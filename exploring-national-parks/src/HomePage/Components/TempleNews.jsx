import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

/**
 * Endpoints that expose the latest alerts and headlines from Temple.
 *
 * We rely on r.jina.ai as a lightweight proxy that adds permissive CORS headers
 * around the upstream RSS feeds so that they can be consumed directly from the
 * browser without exposing API secrets.
 */
const TEMPLE_FEEDS = [
  {
    label: 'Temple Alert on Twitter',
    url: 'https://r.jina.ai/https://nitter.net/TempleAlert/rss',
    canonicalProfile: 'https://twitter.com/TempleAlert',
  },
  {
    label: 'Temple University on Twitter',
    url: 'https://r.jina.ai/https://nitter.net/templeuniv/rss',
    canonicalProfile: 'https://twitter.com/templeuniv',
  },
  {
    label: 'Temple University News',
    url: 'https://r.jina.ai/https://news.temple.edu/rss.xml',
    canonicalProfile: 'https://news.temple.edu/',
  },
];

const formatPublishedDate = (value) => {
  if (!value) {
    return '';
  }

  const parsed = moment(new Date(value));
  if (!parsed.isValid()) {
    return '';
  }

  return parsed.local().format('MMM D, YYYY h:mm A');
};

const normaliseLink = (link) => {
  if (!link) {
    return '';
  }

  try {
    const url = new URL(link);
    if (url.hostname.includes('nitter.net')) {
      return `https://twitter.com${url.pathname}`;
    }

    return url.toString();
  } catch (error) {
    console.warn('Unable to normalise Temple news link', link, error);
    return link;
  }
};

const extractFeedItems = (doc) => {
  if (!doc) {
    return [];
  }

  const nodes = Array.from(doc.querySelectorAll('item'));
  return nodes.map((item) => {
    const title = item.querySelector('title')?.textContent?.trim() ?? '';
    const link = item.querySelector('link')?.textContent?.trim() ?? '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() ?? '';
    const guid = item.querySelector('guid')?.textContent?.trim() ?? '';

    return {
      id: guid || link || title,
      title,
      link,
      pubDate,
    };
  });
};

const parseFeedResponse = async (response) => {
  const text = await response.text();
  const parser = new window.DOMParser();
  return parser.parseFromString(text, 'text/xml');
};

/**
 * Displays the most recent alerts and news headlines for Temple University.
 *
 * The component iterates through a list of Temple news feeds and renders the
 * first feed that successfully returns at least one item. This approach allows
 * the UI to fall back from the Temple Alert feed to the official Temple
 * University account (or even the newsroom RSS feed) if one of the sources is
 * temporarily unavailable.
 *
 * @component
 * @memberof HomePage
 * @returns {JSX.Element}
 */
const TempleNews = ({ maxItems = 5 }) => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeSource, setActiveSource] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTempleNews = async () => {
      for (const feed of TEMPLE_FEEDS) {
        try {
          const response = await fetch(feed.url, {
            signal: controller.signal,
            headers: {
              Accept: 'application/rss+xml, application/xml, text/xml',
            },
          });

          if (!response.ok) {
            throw new Error(`Unable to load Temple news from ${feed.url}`);
          }

          const xml = await parseFeedResponse(response);
          const parsedItems = extractFeedItems(xml)
            .filter((item) => item.title && item.link)
            .slice(0, maxItems)
            .map((item) => ({
              ...item,
              link: normaliseLink(item.link),
              pubDateFormatted: formatPublishedDate(item.pubDate),
            }));

          if (parsedItems.length > 0) {
            if (isMounted) {
              setItems(parsedItems);
              setActiveSource(feed);
              setStatus('ready');
            }
            return;
          }
        } catch (error) {
          console.error('Temple news feed error:', error);
        }
      }

      if (isMounted) {
        setItems([]);
        setStatus('empty');
        setErrorMessage('No live Temple updates are available right now. Please check back soon.');
      }
    };

    fetchTempleNews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [maxItems]);

  const content = useMemo(() => {
    if (status === 'loading') {
      return <p className="temple-news__status">Loading the latest updates…</p>;
    }

    if (status !== 'ready') {
      return (
        <p className="temple-news__status temple-news__status--error">{errorMessage}</p>
      );
    }

    return (
      <ul className="temple-news__list">
        {items.map((item) => (
          <li key={item.id} className="temple-news__item">
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
  }, [errorMessage, items, status]);

  return (
    <section className="temple-news" aria-labelledby="temple-news-heading">
      <div className="temple-news__inner">
        <h2 id="temple-news-heading" className="temple-news__heading">
          Temple Alerts &amp; Headlines
        </h2>
        <p className="temple-news__intro">
          Stay up to date with the latest alerts and announcements from Temple University
          while you plan your next outdoor adventure.
        </p>
        {activeSource && status === 'ready' && (
          <p className="temple-news__source">
            Source: <a href={activeSource.canonicalProfile} target="_blank" rel="noreferrer">{activeSource.label}</a>
          </p>
        )}
        {content}
      </div>
    </section>
  );
};

export default TempleNews;
