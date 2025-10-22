import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

const TWITTER_SOURCES = [
  {
    label: 'Temple Alert on Twitter',
    handle: 'TempleAlert',
    canonicalProfile: 'https://twitter.com/TempleAlert',
  },
  {
    label: 'Temple University on Twitter',
    handle: 'TempleUniv',
    canonicalProfile: 'https://twitter.com/TempleUniv',
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

const sanitiseTweetText = (value) => {
  if (!value) {
    return '';
  }

  return value
    .replace(/https:\/\/t.co\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const fetchTweetsForHandle = async (source, maxItems, signal) => {
  const limit = Math.max(Math.min(maxItems, 10), 5);
  const response = await fetch(`/api/temple-news/${source.handle}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch tweets for @${source.handle}.`);
  }

  const payload = await response.json();
  const tweets = Array.isArray(payload?.data) ? payload.data : [];

  return tweets
    .slice(0, limit)
    .map((tweet) => {
      const text = sanitiseTweetText(tweet.text);

      return {
        id: tweet.id,
        title: text || tweet.text,
        link: `https://twitter.com/${source.handle}/status/${tweet.id}`,
        pubDate: tweet.created_at,
      };
    })
    .filter((tweet) => tweet.title && tweet.link);
};

/**
 * Displays the most recent alerts and news headlines for Temple University.
 *
 * The component requests Temple-affiliated Twitter feeds from the local
 * backend service and iterates between multiple handles (Temple Alert, Temple
 * University). It renders the first feed that successfully returns at least one
 * tweet so that the UI can gracefully fall back between sources if one is
 * unavailable.
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

    const fetchTempleTweets = async () => {
      for (const source of TWITTER_SOURCES) {
        try {
          const tweets = await fetchTweetsForHandle(
            source,
            maxItems,
            controller.signal,
          );

          if (tweets.length > 0) {
            if (isMounted) {
              setItems(
                tweets.map((tweet) => ({
                  ...tweet,
                  pubDateFormatted: formatPublishedDate(tweet.pubDate),
                })),
              );
              setActiveSource(source);
              setStatus('ready');
            }
            return;
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            return;
          }
          console.error('Temple news Twitter error:', error);
        }
      }

      if (isMounted) {
        setItems([]);
        setStatus('empty');
        setErrorMessage(
          'No recent Temple alerts are available right now. Please check back soon.',
        );
      }
    };

    fetchTempleTweets().catch((error) => {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Temple news fetch error:', error);

      if (isMounted) {
        setItems([]);
        setStatus('empty');
        setErrorMessage(
          'We were unable to connect to the Temple Twitter feed. Please try again later.',
        );
      }
    });

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