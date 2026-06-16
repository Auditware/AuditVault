#!/usr/bin/env node
'use strict';

/**
 * scrape_rekt.js
 * Scrape rekt.news leaderboard → FindingVault/hacks/*.md
 */

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

const VAULT_ROOT = path.resolve(__dirname, '../..');
const HACKS_DIR  = path.join(VAULT_ROOT, 'hacks');
const BASE_URL   = 'https://rekt.news';

// ── Tag rules ─────────────────────────────────────────────────────────────────

const SECTOR_RULES = [
  ['sector/bridge',     /\b(bridge|cross.?chain|wormhole|layerzero|stargate|multichain|celer|nomad|ibc\b)/i],
  ['sector/dex',        /\b(dex\b|amm\b|swap|uniswap|curve|balancer|pancakeswap|sushiswap)/i],
  ['sector/lending',    /\b(lend|borrow|collateral|liquidat|aave\b|compound\b|euler\b|morpho\b|loan|debt)/i],
  ['sector/oracle',     /\b(oracle|price.?feed|chainlink|price manipulation|twap\b|flash.?loan.*price)/i],
  ['sector/staking',    /\b(staking|staked|liquid staking|lsd\b|lst\b|validator|slash)/i],
  ['sector/vault',      /\b(erc.?4626|yield vault|yield strategy|yield aggregat|auto.?compound|yearn|beefy|convex\b)/i],
  ['sector/nft',        /\b(nft\b|non.fungible|erc.?721|erc.?1155|marketplace|opensea)/i],
  ['sector/governance', /\b(govern|dao\b|proposal|voting|timelock|snapshot\b)/i],
  ['sector/token',      /\b(erc.?20|token contract|airdrop|mint.*token)/i],
  ['sector/gaming',     /\b(game\b|gaming|play.to.earn|p2e\b|gamefi|axie)/i],
  ['sector/perpetuals', /\b(perpetual|perp\b|funding rate|open interest|leverage trading|gmx\b|dydx\b)/i],
  ['sector/stable',     /\b(stablecoin|stable coin|algorithmic stable|peg\b|dai\b|usdc\b|usdt\b|terra\b|ust\b)/i],
  ['sector/launchpad',  /\b(launchpad|bonding curve|fair launch)/i],
  ['sector/restaking',  /\b(restaking|eigenlayer|avs\b)/i],
  ['sector/privacy',    /\b(mixer|tornado|privacy pool|shielded|anonymous)/i],
  ['sector/multisig',   /\b(multisig|multi.sig|gnosis safe|safe wallet)/i],
  ['sector/rwa',        /\b(real.world asset|rwa\b|tokenized)/i],
  ['sector/infra',      /\b(sequencer|rollup|data availability|precompile)/i],
];

const ATTACK_VECTOR = [
  ['vector/flash-loan',          /\bflash.?loan/i],
  ['vector/reentrancy',          /\breentranc/i],
  ['vector/price-manipulation',  /\bprice.?manipulat|oracle.?manipulat/i],
  ['vector/access-control',      /\baccess.?control|unauthorized|privilege\b|admin.?key|compromised.?key/i],
  ['vector/logic-error',         /\blocic.?error|logic.?bug|accounting.?error|incorrect.?calculat/i],
  ['vector/bridge-exploit',      /\bbridge.?(exploit|hack|attack|drain)/i],
  ['vector/rug-pull',            /\brug.?pull|exit.?scam/i],
  ['vector/private-key',         /\bprivate.?key.?(leak|compromis|stolen)|key.?comprom/i],
  ['vector/social-engineering',  /\bsocial.?engineer|phish|spear.?phish|spoof/i],
  ['vector/signature-replay',    /\bsignature.?replay|replay.?attack/i],
  ['vector/integer-overflow',    /\boverflow|underflow|integer.?(overflow|underflow)/i],
];

const BLOCKCHAIN_RULES = [
  ['blockchain/ethereum',  /\bethereum\b|\bevm\b/i],
  ['blockchain/bsc',       /\b(bsc\b|binance smart chain|bnb chain)/i],
  ['blockchain/solana',    /\bsolana\b/i],
  ['blockchain/polygon',   /\bpolygon\b|\bmatic\b/i],
  ['blockchain/arbitrum',  /\barbitrum\b/i],
  ['blockchain/optimism',  /\boptimism\b/i],
  ['blockchain/avalanche', /\bavalanche\b|\bavax\b/i],
  ['blockchain/fantom',    /\bfantom\b|\bftm\b/i],
  ['blockchain/near',      /\bnear\b.*protocol|\bnear\b.*chain/i],
  ['blockchain/tron',      /\btron\b/i],
  ['blockchain/bitcoin',   /\bbitcoin\b|\bbtc\b/i],
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function classify(text) {
  return {
    sectors: SECTOR_RULES.filter(([, rx]) => rx.test(text)).map(([t]) => t),
    vectors: ATTACK_VECTOR.filter(([, rx]) => rx.test(text)).map(([t]) => t),
    chains:  BLOCKCHAIN_RULES.filter(([, rx]) => rx.test(text)).map(([t]) => t),
  };
}

function sortTags(tags) {
  const order = { 'type/': 0, 'blockchain/': 1, 'sector/': 2, 'vector/': 3, 'has/': 4 };
  return [...tags].sort((a, b) => {
    const ra = Object.entries(order).find(([p]) => a.startsWith(p))?.[1] ?? 9;
    const rb = Object.entries(order).find(([p]) => b.startsWith(p))?.[1] ?? 9;
    return ra !== rb ? ra - rb : a.localeCompare(b);
  });
}

function parseDate(d) {
  const parts = (d || '').trim().split('/');
  if (parts.length === 3) {
    const [m, day, y] = parts;
    return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return d || '';
}

function slugToProtocol(title) {
  return title
    .replace(/\s*[-–]\s*rekt.*$/i, '')
    .replace(/\s+rekt$/i, '')
    .trim();
}

function safeFname(protocol, date) {
  const slug = protocol.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
  return `rekt-${date}-${slug}.md`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function get(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? require('https') : require('http');
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching leaderboard...');
  const html    = await get(`${BASE_URL}/leaderboard`);
  const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!ndMatch) throw new Error('Could not find __NEXT_DATA__');
  const entries = JSON.parse(ndMatch[1]).props.pageProps.leaderboard;
  console.log(`${entries.length} leaderboard entries found`);

  const hacks = entries.filter(e => e?.rekt?.amount > 0 && e.slug);
  console.log(`${hacks.length} entries with loss amount`);

  let written = 0, skipped = 0, errors = 0;

  for (const entry of hacks) {
    const slug     = entry.slug;
    const title    = entry.title;
    const rekt     = entry.rekt || {};
    const loss     = rekt.amount || 0;
    const audit    = rekt.audit || 'N/A';
    const hackDate = parseDate(rekt.date || entry.date || '');
    const excerpt  = entry.excerpt || '';
    const protocol = slugToProtocol(title) || (entry.tags?.[0] || 'Unknown');
    const fname    = safeFname(protocol, hackDate);
    const fpath    = path.join(HACKS_DIR, fname);

    if (fs.existsSync(fpath)) { skipped++; continue; }

    let content = '';
    try {
      const ar      = await get(`${BASE_URL}/${slug}`);
      const andMatch = ar.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      const adata   = JSON.parse(andMatch[1]).props.pageProps;
      content = (adata.content || '').trim();
    } catch (e) {
      console.error(`  ERROR ${slug}: ${e.message}`);
      errors++;
      await sleep(1000);
      continue;
    }

    const fullText = `${excerpt}\n${content}`;
    const { sectors, vectors, chains } = classify(fullText);

    const baseTags = ['type/hack'];
    if (audit && audit !== 'N/A') baseTags.push('has/audit');
    const allTags    = sortTags([...baseTags, ...chains, ...sectors, ...vectors]);
    const tagsYaml   = allTags.map(t => `  - ${t}`).join('\n');
    const safeExcerpt = excerpt.slice(0, 200).replace(/"/g, "'").replace(/\n/g, ' ');
    const safeTitle  = title.replace(/"/g, "'");
    const safeProto  = protocol.replace(/"/g, "'");

    const note = `---
tags:
${tagsYaml}
title: "${safeTitle}"
protocol: "${safeProto}"
date: ${hackDate}
loss_usd: ${loss}
audit: "${audit}"
source: "https://rekt.news/${slug}"
excerpt: "${safeExcerpt}"
---
# ${title}

> **Loss:** $${loss.toLocaleString()} | **Date:** ${hackDate} | **Audited by:** ${audit}

${content}
`;

    fs.writeFileSync(fpath, note);
    written++;
    console.log(`  [${String(written).padStart(3)}] ${protocol.slice(0, 45).padEnd(45)} $${(loss / 1e6).toFixed(1)}M  ${hackDate}`);
    await sleep(300);
  }

  console.log(`\nDONE - Written: ${written}  Skipped: ${skipped}  Errors: ${errors}`);
}

main().catch(err => { console.error(err); process.exit(1); });
