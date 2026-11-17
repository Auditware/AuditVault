'use strict';

/**
 * lib/http.js - shared transport for every AuditVault scraper.
 *
 * Standard: ALL scraping goes through crawlee's GotScrapingHttpClient -
 * real browser TLS fingerprint + auto-generated browser-like headers
 * (via got-scraping's header-generator). Never raw https.get, never curl:
 * plain node/curl TLS fingerprints are what trip Cloudflare/Vercel bot
 * walls (lesson 2026-11-17: raw node TLS + fast pacing = 429 challenge).
 *
 * Gentle by design:
 *   - retries with exponential backoff on 403/429/5xx, honoring
 *     `retry-after` when present
 *   - `pause()` helper: randomized delay so the request stream is not
 *     metronomic
 *   - callers set their own per-request pacing (>= 1s recommended,
 *     >= 2s for Cloudflare-fronted sites)
 */

const { GotScrapingHttpClient } = require('crawlee');

const client = new GotScrapingHttpClient();

const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Randomized pause: base +/- 30%, so timing is never metronomic. */
function pause(baseMs) {
  const jitter = baseMs * (0.7 + Math.random() * 0.6);
  return sleep(jitter);
}

function backoffMs(attempt) {
  return Math.min(15000 * 2 ** (attempt - 1), 120000);
}

async function send(opts, { retries = 5, label = '' } = {}) {
  for (let attempt = 1; ; attempt++) {
    let res;
    try {
      res = await client.sendRequest(opts);
    } catch (e) {
      if (attempt > retries) throw e;
      const wait = backoffMs(attempt);
      console.warn(`  [http] network error (${e.code || e.message})${label} - backoff ${Math.round(wait / 1000)}s (attempt ${attempt}/${retries})`);
      await sleep(wait);
      continue;
    }
    const sc = res.statusCode;
    if (sc === 403 || sc === 429 || sc >= 500) {
      if (attempt > retries) throw new Error(`HTTP ${sc}${label} after ${retries} attempts`);
      const ra = parseInt(String(res.headers?.['retry-after'] ?? ''), 10);
      const wait = Number.isFinite(ra) && ra > 0 ? Math.min(ra * 1000, 180000) : backoffMs(attempt);
      console.warn(`  [http] HTTP ${sc}${label} - gentle backoff ${Math.round(wait / 1000)}s (attempt ${attempt}/${retries})`);
      await sleep(wait);
      continue;
    }
    return res;
  }
}

/** GET -> response body text (redirects followed by the client). */
async function getText(url, headers = {}, options = {}) {
  const res = await send({ url, method: 'GET', headers }, options);
  return res.body;
}

/** POST JSON -> parsed JSON response. */
async function postJson(url, body, headers = {}, options = {}) {
  const res = await send({
    url,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }, options);
  return JSON.parse(res.body);
}

/** GET -> raw response { statusCode, headers, body } (body: Buffer). */
async function getRaw(url, headers = {}, options = {}) {
  const res = await send({ url, method: 'GET', headers, responseType: 'buffer' }, options);
  return { statusCode: res.statusCode, headers: res.headers, body: Buffer.from(res.body) };
}

module.exports = { getText, postJson, getRaw, pause, sleep };