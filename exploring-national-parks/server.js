import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;
const TOKEN_CACHE_TTL = 55 * 60 * 1000; // 55 minutes

let cachedToken = null;
let cachedTokenExpiresAt = 0;

const ensureCredentials = () => {
  const key = process.env.TWITTER_API_KEY;
  const secret = process.env.TWITTER_API_SECRET;

  if (!key || !secret) {
    throw new Error('Twitter API credentials are not configured.');
  }

  return { key, secret };
};

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
    const status = /auth|credential/i.test(error.message) ? 500 : 502;
    res.status(status).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Temple news service listening on port ${PORT}`);
});