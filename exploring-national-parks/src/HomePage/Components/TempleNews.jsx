import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

const TWITTER_OAUTH_URL =
  'https://cors.isomorphic-git.org/https://api.twitter.com/oauth2/token';
const TWITTER_API_BASE =
  'https://cors.isomorphic-git.org/https://api.twitter.com/2';

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

const DEFAULT_TWITTER_KEY = 'Y0lS8yqm77fhA30Vkrx26bDZl';
const DEFAULT_TWITTER_SECRET = 'jwn1zbDri22UbJPoluq37wdDXs7CPCOMNwQ2IQchlYw3LMuxUl';

let cachedBearerToken;

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

const getTwitterCredentials = () => {
  const key = process.env.REACT_APP_TWITTER_API_KEY ?? DEFAULT_TWITTER_KEY;
  const secret =
    process.env.REACT_APP_TWITTER_API_KEY_SECRET ?? DEFAULT_TWITTER_SECRET;

  if (!key || !secret) {
    throw new Error('Missing Twitter API credentials.');
  }

  return { key, secret };
};

const encodeCredentials = (key, secret) => {
  try {
    return window.btoa(`${key}:${secret}`);
  } catch (error) {
    console.error('Unable to encode Twitter credentials', error);
    throw new Error('Unable to prepare Twitter authentication header.');
  }
};

const fetchBearerToken = async (signal) => {
  if (cachedBearerToken) {
    return cachedBearerToken;
  }

  const { key, secret } = getTwitterCredentials();
  const credentials = encodeCredentials(key, secret);

  const response = await fetch(TWITTER_OAUTH_URL, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Unable to authenticate with the Twitter API.');
  }

  const payload = await response.json();
  if (!payload.access_token) {
    throw new Error('Twitter authentication response was malformed.');
  }

  cachedBearerToken = payload.access_token;
  return cachedBearerToken;
};

const fetchUserByHandle = async (handle, token, signal) => {
  const response = await fetch(
    `${TWITTER_API_BASE}/users/by/username/${handle}?user.fields=id`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to resolve @${handle} on Twitter.`);
  }

  const payload = await response.json();
  if (!payload?.data?.id) {
    throw new Error(`Twitter did not return an ID for @${handle}.`);
  }

  return payload.data.id;
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

const fetchTweetsForHandle = async (source, token, maxItems, signal) => {
  const userId = await fetchUserByHandle(source.handle, token, signal);
  const limit = Math.max(Math.min(maxItems, 10), 5);
  const response = await fetch(
    `${TWITTER_API_BASE}/users/${userId}/tweets?tweet.fields=created_at&exclude=retweets,replies&max_results=${limit}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to fetch tweets for @${source.handle}.`);
  }

  const payload = await response.json();
  const tweets = payload?.data ?? [];

  return tweets
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
 * The component authenticates with the Twitter API using the provided
 * application credentials and iterates through a list of Temple-affiliated
 * Twitter handles (Temple Alert, Temple University). It renders the first feed
 * that successfully returns at least one tweet so that the UI can gracefully
 * fall back between sources if one is unavailable.
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
      try {
        const token = await fetchBearerToken(controller.signal);

        for (const source of TWITTER_SOURCES) {
          try {
            const tweets = await fetchTweetsForHandle(
              source,
              token,
              maxItems,
              controller.signal,
            );

            if (tweets.length > 0) {
              if (isMounted) {
                setItems(
                  tweets.slice(0, maxItems).map((tweet) => ({
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
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Temple Twitter authentication error:', error);

        if (isMounted) {
          setItems([]);
          setStatus('empty');
          setErrorMessage(
            'We were unable to connect to the Temple Twitter feed. Please verify your Twitter API credentials and try again.',
          );
        }
      }
    };

    fetchTempleTweets();

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