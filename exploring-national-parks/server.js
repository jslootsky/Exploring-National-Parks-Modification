// Import core packages for our server.
// - express: HTTP server and routing
// - dotenv: loads environment variables from a .env file
// - node-fetch: fetch HTTP resources from Node (like the Twitter API)
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables into process.env (e.g., TWITTER_API_KEY).
dotenv.config();

// In plain English: we’re setting up a simple Node server and enabling it to read
// secrets (like API keys) from a .env file, plus giving it the ability to call
// external HTTP APIs.

// -----------------------------------------------------------------------------
// Basic app configuration and in-memory cache for the OAuth2 bearer token.
// -----------------------------------------------------------------------------
const app = express();
const PORT = process.env.API_PORT || 4000;
const TOKEN_CACHE_TTL = 55 * 60 * 1000; // 55 minutes

let cachedToken = null;
let cachedTokenExpiresAt = 0;

// In plain English: we’ll run a server on PORT (default 4000). We cache the Twitter
// bearer token for ~55 minutes so we don’t ask Twitter for a new token on every request.

// -----------------------------------------------------------------------------
// ensureCredentials()
// Verifies we have the required Twitter credentials in environment variables.
// Throws if missing; otherwise returns { key, secret }.
// -----------------------------------------------------------------------------
const ensureCredentials = () => {
  const key = process.env.TWITTER_API_KEY;
  const secret = process.env.TWITTER_API_SECRET;

  if (!key || !secret) {
    throw new Error('Twitter API credentials are not configured.');
  }

  return { key, secret };
};

// In plain English: double-check that TWITTER_API_KEY and TWITTER_API_SECRET are set.
// If not, fail early with a clear error.

// -----------------------------------------------------------------------------
// fetchBearerToken()
// Implements Twitter OAuth 2.0 "client credentials" flow to get an app-only token.
// - Respects an in-memory cache (cachedToken) to avoid frequent auth calls.
// - Encodes key:secret as Basic auth for the token endpoint.
// - Stores the token with an expiry window.
// -----------------------------------------------------------------------------
const fetchBearerToken = async () => {
  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now) {
    return cachedToken;
  }

  const { key, secret } = ensureCredentials();
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64');

  const response = await fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Twitter auth failed (${response.status}): ${errorBody}`);
  }

  const payload = await response.json();
  if (!payload?.access_token) {
    throw new Error('Twitter auth response missing access token.');
  }

  cachedToken = payload.access_token;
  cachedTokenExpiresAt = now + TOKEN_CACHE_TTL;
  return cachedToken;
};

// In plain English: if our token is still fresh, reuse it. Otherwise, ask Twitter
// for a new bearer token using our app key/secret, then cache and return it.

// -----------------------------------------------------------------------------
// resolveUserId(handle, token)
// Converts a Twitter handle (e.g., "TempleAlert") into a numeric user ID via v2 API.
// Requires a valid Bearer token.
// -----------------------------------------------------------------------------
const resolveUserId = async (handle, token) => {
  const url = `https://api.twitter.com/2/users/by/username/${encodeURIComponent(
    handle,
  )}?user.fields=id`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Twitter user lookup failed for @${handle} (${response.status}): ${errorBody}`,
    );
  }

  const payload = await response.json();
  const userId = payload?.data?.id;
  if (!userId) {
    throw new Error(`Twitter user lookup did not return an ID for @${handle}.`);
  }

  return userId;
};

// In plain English: given a username, ask Twitter for that user’s numeric ID
// (which is required by other endpoints). If it fails, throw a descriptive error.

// -----------------------------------------------------------------------------
// fetchTweets(handle)
// Retrieves recent tweets for a given handle (excluding retweets/replies).
// Steps:
// 1) Get/refresh the bearer token.
// 2) Resolve the handle to a numeric userId.
// 3) Call the Twitter v2 timeline endpoint for that user.
// 4) Return up to 10 tweet objects (raw from Twitter).
// -----------------------------------------------------------------------------
const fetchTweets = async (handle) => {
  const token = await fetchBearerToken();
  const userId = await resolveUserId(handle, token);

  const url = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at&exclude=retweets,replies&max_results=10`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Twitter timeline fetch failed for @${handle} (${response.status}): ${errorBody}`,
    );
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
};

// In plain English: with a valid token and user ID, pull the latest original tweets
// (no retweets/replies) for that account and return them as an array.

// -----------------------------------------------------------------------------
// GET /api/temple-news/:handle
// Express route that serves tweets to the frontend.
// - Validates handle, then tries to fetch tweets.
// - On success: { data: [...] }.
// - On failure: logs and returns an error JSON with a 500/502 status.
// -----------------------------------------------------------------------------
app.get('/api/temple-news/:handle', async (req, res) => {
  const { handle } = req.params;

  if (!handle) {
    res.status(400).json({ error: 'Twitter handle is required.' });
    return;
  }

  try {
    const tweets = await fetchTweets(handle);
    res.json({ data: tweets });
  } catch (error) {
    console.error('Temple news API error:', error);
    // Heuristic: auth/credential errors => 500; otherwise treat as upstream 502.
    const status = /auth|credential/i.test(error.message) ? 500 : 502;
    res.status(status).json({ error: error.message });
  }
});

// In plain English: this is the backend endpoint your React app calls.
// It fetches tweets for the given handle and returns them as JSON, or returns
// a clear error response if something goes wrong.

// -----------------------------------------------------------------------------
// Start the HTTP server.
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Temple news service listening on port ${PORT}`);
});

// In plain English: boot up the server and log which port it’s using so you can
// confirm it started correctly.
