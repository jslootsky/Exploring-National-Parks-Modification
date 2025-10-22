import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

const TEMPLE_FEEDS = [
    {
        label: 'Temple Alert on Twitter',
        url: 'https://r.jina.ai/https://nitter.net/TempleAlert/rss',
        canonicalProfile: 'https://x.com/TempleAlert',
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

const TempleNews = ({ maxItems = 5 }) => {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState('loading');
    const [activeSource, setActiveSource] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchTempleNews = async () => {
            for(const feed of TEMPLE_FEEDS) {
                try{
                    const response = await fetch(feed.url, {
                        signal: controller.signal,
                        headers: {
                            Accept: 'application/rss+xml, application/xml, text/xml'
                        },
                    });

                    if(!response.ok){
                        throw new Error(`Unable to load Temple news from ${feed.url}`);
                    }
                } catch (error){
                    console.error('Temple news feed error: ', error);
                }
            }
        }
    });

};