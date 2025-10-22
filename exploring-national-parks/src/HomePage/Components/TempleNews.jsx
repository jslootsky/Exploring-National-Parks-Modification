import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment'; //used for formatting dates and times

const TEMPLE_FEEDS = [
    {
        label: 'Temple Alert on Twitter',                               //readable lable for the feed
        url: 'https://r.jina.ai/https://nitter.net/TempleAlert/rss',    //feed URL
        canonicalProfile: 'https://x.com/TempleAlert',                  //link to the original profile
    },
    {
        label: 'Temple University on Twitter',
        url: 'https://r.jina.ai/https://nitter.net/templeuniv/rss',
        canonicalProfile: 'https://x.com/TempleUniv',
    },
    {
        label: 'Temple University News',
        url: 'https://r.jina.ai/https://news.temple.edu/rss.xml',
        canonicalProfile: 'https://news.temple.edu/',
    },
];

//helper to parse the XML RSS feed response into a dom object
const parseFeedResponse = async (response) => {
    const text = await response.text();     //convert to text
    const parser = new window.DOMParser();  //create new DOM parser
    return parser.parseFromString(text, 'text/xml'); //parse XML into a dom
};

const extractFeedItems = (doc) =>{
    if(!doc){
        return [];
    }

    const nodes = Array.from(doc.querySelectorAll('item'));
    return nodes.map((item) => {
        const title = item.querySelector('title')?.textContent?.trim() ?? '';
        const link = item.querySelector('link')?.textContent?.trim() ?? '';
        const pubDate = item.querySelector('pubDate')?.textContent.trim() ?? '';
        const guid = item.querySelector('guid')?.textContent?.trim() ?? '';

        return{
            id: guid || link || title,
            title,
            link,
            pubDate,
        };
    });
};

const normalizeLink = (link) => {
    if (!link){
        return '';
    }

    try{
        const url = new URL(link);
        if(url.hostname.includes('nitter.net')){
            return `https://x.com${url.pathname}`;
        }

        return url.toString();
    }catch (error){
        console.warn('Unable to normalise Temple news link', link, error);
        return link;
    }
};

const formatPublishedDate = (value) => {
    if(!value){
        return '';
    }

    const parsed = moment(new Date(value));
    if(!parsed.isValid()){
        return '';
    }

    return parsed.local().format('MMM D, YYYY h:mm A');
};

const TempleNews = ({ maxItems = 5 }) => {
    const [items, setItems] = useState([]);                 //hold news
    const [status, setStatus] = useState('loading');        //track loading
    const [activeSource, setActiveSource] = useState(null); //store what is being displayed
    const [errorMessage, setErrorMessage] = useState('');   //store error

    useEffect(() => {
        let isMounted = true;                       //prevent state updates after unmount
        const controller = new AbortController();   //cancel fetch if needed

        const fetchTempleNews = async () => {
            for(const feed of TEMPLE_FEEDS) {
                try{
                    //fetching the RSS feed
                    const response = await fetch(feed.url, {
                        signal: controller.signal,
                        headers: {
                            Accept: 'application/rss+xml, application/xml, text/xml' //return xml
                        },
                    });

                    if(!response.ok){
                        throw new Error(`Unable to load Temple news from ${feed.url}`);
                    }

                    const xml = await parseFeedResponse(response);
                    const parsedItems = extractFeedItems(xml).filter((item) => item.title && item.link).slice(0, maxItems).map((item) => ({
                        ...item,
                        link: normalizeLink(item.link),
                        pubDateFormatted: formatPublishedDate(item.pubDate),
                    }));

                    if(parsedItems.length > 0){
                        if(isMounted){
                            setItems(parsedItems);
                            setActiveSource(feed);
                            setStatus('ready');
                        }
                        return; //stop after first successful feed
                    }
                } catch (error){
                    console.error('Temple news feed error: ', error);
                    if(isMounted){
                        setErrorMessage(`Failed to fetch news from ${feed.label}`);
                    }
                }
            }
            
            //reach here only if no feeds returned items
            if(isMounted){
                setItems([]);
                setStatus('empty');
                setErrorMessage('No live Temple updates are available right now. Please check back soon.');
            }
        };

        fetchTempleNews();

        //abort in-flight requests and prevent late stage updates
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [maxItems]); //re-fetch if caller changes how many items to show


    const content = useMemo(() => {
        if(status === 'loading'){
            return <p className="temple-news__status">Loading the latest updates...</p>
        }

        if(status !== 'ready'){
            //either empty or an error message
            return (
                <p className="temple-news__status temple-news__status--error">{errorMessage}</p>
            );
        }

        return(
            <ul className="temple-news__list">
                {items.map((item) => (
                    <li key={item.id} className ="temple-news__item">
                        <a
                            className="temple-news__link"
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="temple-news__title">{item.title}</span>
                            {item.pubDateFormatted && (
                                <span className="temple-news__date">{item.pubDateFormatted}</span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        );
    }, [errorMessage, items, status]); //dependencies

    return(
        <section className="temple-news" aria-labelledby="temple-news-heading">
            <div className="temple-news__inner">
                <h2 id="temple-news-heading" className="temple-news__heading">
                    Temple Alerts &amp; Headlines
                </h2>
                <p className="temple-news__intro">
                    Stay up to date with the latest alerts and announcements from Temple University while you plan your next outdoor adventure.
                </p>
                {activeSource && status === 'ready' && (
                    <p className="temple-news__source">
                        Source: <a href={activeSource.canonicalProfile} target="_blank" rel="norefferer">{activeSource.label}</a>
                    </p>
                )}
                {content}
            </div>
        </section>
    );

};

export default TempleNews;