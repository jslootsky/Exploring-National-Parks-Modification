// Import React and specific Hooks from the React package.
// - useEffect: run side effects (like fetching data) after render.
// - useMemo: memoize expensive computations (or JSX) so they re-run only when dependencies change.
// - useState: local component state for data and UI status.
import React, { useEffect, useMemo, useState } from 'react';

// Import moment for date parsing/formatting.
import moment from 'moment';

// In plain English: we’re pulling in the tools we need—React hooks to manage state/effects,
// and moment to turn raw dates into nicely formatted strings.

// -----------------------------------------------------------------------------
// A list of Temple-related Twitter sources we can try in order.
// Each source includes:
// - label: human-readable label for UI
// - handle: Twitter username used for API route and link building
// - canonicalProfile: the official profile URL for attribution
// -----------------------------------------------------------------------------
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

// In plain English: this is a small list of backup Twitter accounts.
// We’ll try TempleAlert first; if that fails, we’ll try TempleUniv.

// -----------------------------------------------------------------------------
// formatPublishedDate(value)
// Safely parse a date-like value and format it in local time as:
//   "MMM D, YYYY h:mm A"  (e.g., "Oct 23, 2025 1:45 PM")
// Returns an empty string if the input is missing or invalid.
// -----------------------------------------------------------------------------
const formatPublishedDate = (value) => {
  if (!value) {
    return '';
  }

  // Create a moment object from a native Date to avoid parsing quirks.
  const parsed = moment(new Date(value));
  if (!parsed.isValid()) {
    return '';
  }

  // Convert to local timezone and format.
  return parsed.local().format('MMM D, YYYY h:mm A');
};

// In plain English: turn a raw timestamp into a friendly, local-time label.
// If the date is weird or missing, just show nothing.

// -----------------------------------------------------------------------------
// sanitiseTweetText(value)
// Lightly cleans tweet text for display by:
// 1) Removing t.co short links (regex finds "https://t.co/<non-space>")
// 2) Collapsing multiple spaces/newlines to a single space
// 3) Trimming leading/trailing whitespace
// Returns empty string if input is falsy.
// -----------------------------------------------------------------------------
const sanitiseTweetText = (value) => {
  if (!value) {
    return '';
  }

  return value
    .replace(/https:\/\/t.co\/\S+/g, '') // strip t.co URLs
    .replace(/\s+/g, ' ')                // normalize whitespace
    .trim();
};

// In plain English: clean up tweet text by removing short links and extra spaces
// so titles look neat in the UI.

// -----------------------------------------------------------------------------
// fetchTweetsForHandle(source, maxItems, signal)
// Fetches tweets for a specific source.handle from a local API route:
//   GET /api/temple-news/:handle
// - maxItems: caller's requested maximum items; we clamp it into [5, 10].
// - signal: AbortSignal to cancel the request if the component unmounts.
// Returns a normalized array of tweet objects:
//   { id, title, link, pubDate }
// -----------------------------------------------------------------------------
const fetchTweetsForHandle = async (source, maxItems, signal) => {
  // Clamp requested items to between 5 and 10 to control payload size.
  const limit = Math.max(Math.min(maxItems, 10), 5);

  // Fetch from your server-side endpoint that proxies/serves tweet data.
  const response = await fetch(`/api/temple-news/${source.handle}`, {
    signal, // allows cancellation via AbortController
  });

  // If HTTP status is not in the 200–299 range, throw an error.
  if (!response.ok) {
    throw new Error(`Unable to fetch tweets for @${source.handle}.`);
  }

  // Parse response as JSON; expect { data: [...] }.
  const payload = await response.json();
  const tweets = Array.isArray(payload?.data) ? payload.data : [];

  // Map raw tweets to a simplified shape used by the UI and cut to limit.
  return tweets
    .slice(0, limit)
    .map((tweet) => {
      const text = sanitiseTweetText(tweet.text);

      return {
        id: tweet.id, // unique identifier, used as React key
        title: text || tweet.text, // prefer sanitized text; fall back to original
        link: `https://twitter.com/${source.handle}/status/${tweet.id}`, // direct link to tweet
        pubDate: tweet.created_at, // original timestamp (ISO-like string)
      };
    })
    // Ensure we have at least a title and link to render.
    .filter((tweet) => tweet.title && tweet.link);
};

// In plain English: call our backend for tweets from a handle, keep between 5–10,
// normalize the data into a simple shape (title/link/date), and return it.

// =============================================================================
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
  // items: array of normalized tweet objects rendered in the list.
  const [items, setItems] = useState([]);

  // status: 'loading' | 'ready' | 'empty'
  // - 'loading' while fetching
  // - 'ready' when we have items to display
  // - 'empty' when no items are available or an error occurred
  const [status, setStatus] = useState('loading');

  // activeSource: which TWITTER_SOURCES entry successfully provided tweets.
  const [activeSource, setActiveSource] = useState(null);

  // errorMessage: friendly message shown when status !== 'ready'.
  const [errorMessage, setErrorMessage] = useState('');

  // In plain English: we track the tweets, whether we’re loading/ready/empty,
  // which source worked, and any user-facing error message.

  // -----------------------------------------------------------------------------
  // useEffect: run once on mount and again whenever maxItems changes.
  // Orchestrates fetching tweets, trying each source in order until one works.
  // Cleans up by aborting inflight requests if the component unmounts.
  // -----------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true; // guard to avoid state updates after unmount
    const controller = new AbortController(); // enables request cancellation

    const fetchTempleTweets = async () => {
      // Iterate over each configured source in order.
      for (const source of TWITTER_SOURCES) {
        try {
          // Attempt to fetch tweets for this handle.
          const tweets = await fetchTweetsForHandle(
            source,
            maxItems,
            controller.signal,
          );

          // If we got at least one tweet, update state and stop trying others.
          if (tweets.length > 0) {
            if (isMounted) {
              setItems(
                tweets.map((tweet) => ({
                  ...tweet,
                  // Precompute a human-readable local time string for display.
                  pubDateFormatted: formatPublishedDate(tweet.pubDate),
                })),
              );
              setActiveSource(source);
              setStatus('ready');
            }
            return; // stop after the first successful source
          }
        } catch (error) {
          // If the error is due to an abort (cleanup), don't treat as a failure.
          if (error.name === 'AbortError') {
            return;
          }
          // Otherwise, log and try the next source in the list.
          console.error('Temple news Twitter error:', error);
        }
      }

      // If no sources yielded results, mark as empty with a friendly message.
      if (isMounted) {
        setItems([]);
        setStatus('empty');
        setErrorMessage(
          'No recent Temple alerts are available right now. Please check back soon.',
        );
      }
    };

    // Kick off the async fetch and catch any top-level errors.
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

    // Cleanup function: runs when component unmounts or before re-running effect.
    // - Flip isMounted to prevent state updates
    // - Abort any in-flight fetch via controller.abort()
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [maxItems]); // Re-run if the caller changes the desired item count.

  // In plain English: when the component loads (or maxItems changes),
  // try each Twitter source until one returns tweets, then show them.
  // If we unmount mid-request, we cancel it. If none work, show a friendly message.

  // -----------------------------------------------------------------------------
  // Memoize the rendered "content" so we only recalculate when inputs change.
  // Dependencies:
  // - errorMessage: for error state text
  // - items: the tweet list to render
  // - status: UI branch (loading/ready/empty)
  //
  // Returns:
  // - A loading paragraph while fetching
  // - An error paragraph if not 'ready'
  // - Otherwise a UL of tweet items
  // -----------------------------------------------------------------------------
  const content = useMemo(() => {
    if (status === 'loading') {
      return <p className="temple-news__status">Loading the latest updates…</p>;
    }

    if (status !== 'ready') {
      return (
        <p className="temple-news__status temple-news__status--error">{errorMessage}</p>
      );
    }

    // status === 'ready': render the list of items
    return (
      <ul className="temple-news__list">
        {items.map((item) => (
          // Use tweet id as the React key for stable list rendering.
          <li key={item.id} className="temple-news__item">
            <a
              className="temple-news__link"
              href={item.link}
              target="_blank"
              rel="noreferrer" // security best-practice when using target="_blank"
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

  // In plain English: based on the status, we either show a loading message,
  // an error message, or the list of tweets with links and dates.

  // -----------------------------------------------------------------------------
  // Render structure:
  // - A semantic <section> with ARIA labelling.
  // - Heading and intro text for context.
  // - Optional "Source:" line showing which handle supplied the tweets.
  // - The memoized content block above (loading, error, or list).
  // -----------------------------------------------------------------------------
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

// In plain English: the markup is a section with a title, an intro,
// an optional “Source” link when we have data, and then the content we built.

export default TempleNews;

// In plain English: we export the component so the rest of the app can import and render it.