#!/usr/bin/env node
'use strict';

/**
 * tag_report_sector.js
 * Sector tagger that classifies from finding content first (no HTTP needed),
 * then falls back to fetching GitHub reports for remaining unknowns.
 * Re-run safe: skips files already having a sector/ tag.
 */

const fs    = require('fs');
const path  = require('path');
const https = require('https');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');
const DELAY_MS     = 250;

// ── Sector rules ──────────────────────────────────────────────────────────────

const RULES = [
  ['sector/bridge',      /\b(bridge|cross.?chain|interoperab|ibc\b|wormhole|layerzero|stargate|multichain|celer|across protocol|message pass|relayer|relay chain|connext|hop protocol|socket\b)/],
  ['sector/zk',          /\b(zk.?proof|zero.?knowledge|zkp\b|zkevm|zkvm|circom|groth16|plonk\b|snark|stark\b|prover|verifier circuit|zkrollup|zk rollup|taiko|aligned layer|zkvm|zkwasm|scroll\b)/],
  ['sector/oracle',      /\b(oracle|price feed|chainlink|pyth\b|band protocol|tellor|twap\b|price manipulat)/],
  ['sector/perpetuals',  /\b(perpetual|perp\b|perps\b|funding rate|mark price|open interest|leverage trading|futures contract|gmx\b|dydx\b|synthetix\b)/],
  ['sector/dex',         /\b(dex\b|decentralized exchange|amm\b|automated market maker|swap|liquidity pool|uniswap|curve\b|balancer|sushiswap|pancakeswap|mute|ring protocol|camelot|velodrome|solidly|trident|stixswap|aftermath orderbook|orderbook|clmm\b)/],
  ['sector/lending',     /\b(lend|borrow|collateral|liquidat|aave\b|compound\b|morpho\b|euler\b|loan|debt|credit|over.?collateral|undercollateral|interest rate model|money market|zerolend|init capital|timeswap|coalesce)/],
  ['sector/staking',     /\b(stak|validator|delegat|slash|restake|eigenlayer|liquid staking|lsd\b|lst\b|beacon chain|withdrawal cred|epoch reward|consensus layer)/],
  ['sector/vault',       /\b(vault|yield aggregat|auto.?compound|strategy|harvest|yearn|beefy|convex\b|cellar|yield ninja|pods finance|erc.?4626|share price|superform|yield basis)/],
  ['sector/stable',      /\b(stablecoin|stable coin|peg\b|pegged|dai\b|usdc\b|usdt\b|frax\b|crvusd|algorithmic stable|ust\b|terra\b|basis cash|fei protocol|fei\b|thala|opus\b)/],
  ['sector/token',       /\b(erc.?20|erc20|token contract|mint.*token|burn.*token|transfer hook|fee.on.transfer|rebas|elastic supply|crowdsale|ico\b|token sale|basic attention token|bat\b|mana\b|treasury vesting|vesting.*token|virtuals\b)/],
  ['sector/nft',         /\b(nft\b|non.fungible|erc.?721|erc.?1155|marketplace|opensea|collection|royalt|freeverse|rarible|blur\b|nft marketplace|nextgen\b)/],
  ['sector/governance',  /\b(govern|dao\b|proposal|voting|timelock|gnosis safe|snapshot\b|quorum|on.?chain vote|governor\b)/],
  ['sector/account',     /\b(account abstraction|erc.?4337|smart account|paymaster|bundler|entrypoint|session key|bls wallet|safe account|kernel\b|biconomy|rhinestone|smart session)/],
  ['sector/rwa',         /\b(real.world asset|rwa\b|tokenized.{0,20}asset|securities|commodity token|real estate token|maple\b|centrifuge\b|goldfinch\b|securitize\b|dtf\b)/],
  ['sector/gaming',      /\b(game\b|gaming|nft game|play.to.earn|p2e\b|gamefi|metaverse|item|inventory|axie|illuvium|forte\b|dojo\b|realms|eternum)/],
  ['sector/wallet',      /\b(multisig|gnosis|hardware wallet|key management|custody|smart wallet|bls wallet|social recovery|guardian\b|wallet guard|vultisig|martian\b|aptos wallet|adena wallet|ssp wallet)/],
  ['sector/streaming',   /\b(payment stream|sablier|superfluid|drip\b|vesting stream|stream.*payment|flow.*payment)/],
  ['sector/insurance',   /\b(insurance|cover\b|nexus mutual|risk pool|underwrite|claim.*insurance|protocol cover)/],
  ['sector/launchpad',   /\b(launchpad|bonding curve|fair launch|token launch|ido\b|initial dex offering|presale|desci.*launch|pump\.fun|virtuals.*launch)/],
  ['sector/privacy',     /\b(mixer|tornado|privacy pool|shielded|anonymous|zkp.*privacy|stealth address|confidential)/],
  ['sector/infra',       /\b(sequencer|rollup|data availability|precompile|l2\b|layer.?2|optimistic rollup|state channel|plasma\b|sidechain|overprotocol|openvm|monad\b|sui\b|aptos\b|ink!\b|spherex|mud\b|openbrush|vyper\b|shardeum|zksync\b)/],
  ['sector/escrow',      /\b(escrow|openbazaar|trustless.*payment|conditional.*payment|payment.*condition)/],
  ['sector/dns',         /\b(name service|ens\b|domain.*name|name.*registr|zns\b|zero.*name|naming.*system)/],
];

// ── Protocol → sector overrides ───────────────────────────────────────────────
// For protocols where the finding body alone doesn't contain enough keywords.

const PROTOCOL_MAP = {
  'stixswapsolana':       'sector/dex',         'stixswap':            'sector/dex',
  'btr':                  'sector/dex',         'aftermath orderbook': 'sector/dex',
  'aftermath':            'sector/dex',         'mute.io':             'sector/dex',
  'behodler':             'sector/dex',         'deepbook':            'sector/dex',
  'econia':               'sector/dex',         'hbarsuite':           'sector/dex',
  'hop aggregator':       'sector/dex',         'xpress protocol':     'sector/dex',
  'ellipsis':             'sector/dex',
  'timeswap':             'sector/lending',     'zerolend':            'sector/lending',
  'init capital':         'sector/lending',     'coalescefinance':     'sector/lending',
  'coalesce finance':     'sector/lending',     'putty':               'sector/lending',
  'thala':                'sector/stable',      'opus':                'sector/stable',
  'infinifi contracts':   'sector/stable',
  'superform':            'sector/vault',       'yield ninja':         'sector/vault',
  'yield basis':          'sector/vault',       'pods finance':        'sector/vault',
  'tailwind':             'sector/vault',       'badgerdao':           'sector/vault',
  'fiva yield tokenization protocol': 'sector/vault',
  'nextgen':              'sector/nft',         'phi':                 'sector/nft',
  'biconomy':             'sector/account',     'bls wallet':          'sector/account',
  'enso finance':         'sector/account',     'infinex':             'sector/account',
  'mass':                 'sector/account',     'curra':               'sector/account',
  'wallet guard':         'sector/wallet',      'vultisig':            'sector/wallet',
  'martian':              'sector/wallet',      'aptos wallet':        'sector/wallet',
  'adena wallet':         'sector/wallet',      'ssp wallet':          'sector/wallet',
  'aptos securitize':     'sector/rwa',         'reserve protocol solana dtfs': 'sector/rwa',
  'onre':                 'sector/insurance',   'onre solana':         'sector/insurance',
  'fairside':             'sector/insurance',   'cap labs covered agent protocol': 'sector/insurance',
  'forte':                'sector/gaming',      'dojo':                'sector/gaming',
  'virtuals':             'sector/gaming',
  'drife':                'sector/infra',
  'descilaunchpad':       'sector/launchpad',   'desci launchpad':     'sector/launchpad',
  'tadle':                'sector/launchpad',   'pump':                'sector/launchpad',
  'taiko':                'sector/zk',          'zksync':              'sector/zk',
  'aligned layer':        'sector/zk',          'scroll':              'sector/zk',
  'overprotocol':         'sector/infra',       'openvm':              'sector/infra',
  'monad':                'sector/infra',       'sui':                 'sector/infra',
  'aptos':                'sector/infra',       'ink!':                'sector/infra',
  'spherex':              'sector/infra',       'mud':                 'sector/infra',
  'openbrush':            'sector/infra',       'vyper':               'sector/infra',
  'shardeum':             'sector/infra',       'berachain':           'sector/infra',
  'initia':               'sector/infra',       'clockwork':           'sector/infra',
  'proximity labs':       'sector/infra',       'consortium':          'sector/infra',
  'appchain modules':     'sector/infra',       'netmind':             'sector/infra',
  'dialect blinks':       'sector/infra',
  'connext':              'sector/bridge',      'across audit':        'sector/bridge',
  'pheasant network':     'sector/bridge',      'shieldflow':          'sector/bridge',
  'bluefin':              'sector/perpetuals',  'laminar markets':     'sector/perpetuals',
  'bluefin spot':         'sector/dex',
  'aura':                 'sector/staking',
  'reserve':              'sector/token',       'treasury vesting':    'sector/token',
  'basic attention token': 'sector/token',      'ethercamp':           'sector/token',
  'arkham intel exchange': 'sector/infra',
  'zerem':                'sector/streaming',
  'zero name service':    'sector/dns',         'zns':                 'sector/dns',
};

function lookupProtocol(protocol) {
  const key = protocol.toLowerCase().replace(/[\[\]"]/g, '').trim();
  return PROTOCOL_MAP[key] || null;
}

function classifySector(text, protocol = '') {
  const ps = lookupProtocol(protocol);
  if (ps) return ps;
  const t = text.toLowerCase();
  for (const [sector, rx] of RULES) {
    if (rx.test(t)) return sector;
  }
  return null;
}

// ── HTTP helper ───────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(res.statusCode === 200 ? data : null));
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
  });
}

function toRawUrls(reportUrl) {
  if (!reportUrl || !reportUrl.includes('github.com') || reportUrl.includes('.pdf')) return [];
  const url = reportUrl.split('#')[0];
  const blobMatch = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
  if (blobMatch) {
    const [, user, repo, branch, filePath] = blobMatch;
    return [`https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`];
  }
  if (url.includes('sherlock-audit') && url.includes('-judging')) {
    const base = url.replace('-judging', '').replace('github.com', 'raw.githubusercontent.com');
    return [`${base}/main/README.md`, `${base}/master/README.md`];
  }
  if (url.match(/^https:\/\/github\.com\/[^/]+\/[^/]+$/)) {
    const raw = url.replace('github.com', 'raw.githubusercontent.com');
    return [`${raw}/main/README.md`, `${raw}/master/README.md`];
  }
  return [];
}

function addTagToFile(content, tag) {
  return content.replace(/(tags:[\s\S]*?)(\n---)/m, (match, tagBlock, rest) => {
    if (tagBlock.includes(`- ${tag}`)) return match;
    const block = tagBlock.endsWith('\n') ? tagBlock : tagBlock + '\n';
    return block + `  - ${tag}` + rest;
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const files    = fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'));
  const untagged = files.filter(f => {
    const c = fs.readFileSync(path.join(FINDINGS_DIR, f), 'utf8');
    return !/sector\//.test(c);
  });

  console.log(`Untagged: ${untagged.length}`);

  let fromContent = 0, fromReport = 0;
  const added = {};

  // ── Pass 1: classify from finding content ─────────────────────────────────
  const stillUntagged = [];
  for (const f of untagged) {
    const fp       = path.join(FINDINGS_DIR, f);
    const c        = fs.readFileSync(fp, 'utf8');
    const rawProto = (c.match(/^protocol:\s*(.+)/m) || [])[1] || '';
    const protocol = rawProto.replace(/[\[\]"']/g, '').trim();
    const title    = (c.match(/^# (.+)/m) || [])[1] || '';
    const body     = c.replace(/^---[\s\S]*?---\n/, '');
    const sector   = classifySector(`${protocol} ${title} ${body}`, protocol);
    if (sector) {
      fs.writeFileSync(fp, addTagToFile(c, sector));
      added[sector] = (added[sector] || 0) + 1;
      fromContent++;
    } else {
      stillUntagged.push(f);
    }
  }
  console.log(`Pass 1 (content): ${fromContent} tagged, ${stillUntagged.length} remain`);

  // ── Pass 2: fetch GitHub report for remaining ─────────────────────────────
  const reportToFiles = {};
  let noFetch = 0;
  for (const f of stillUntagged) {
    const c       = fs.readFileSync(path.join(FINDINGS_DIR, f), 'utf8');
    const r       = (c.match(/^report:\s*"?(.+?)"?\s*$/m) || [])[1];
    const rawUrls = toRawUrls(r);
    if (!rawUrls.length) { noFetch++; continue; }
    if (!reportToFiles[r]) reportToFiles[r] = [];
    reportToFiles[r].push(f);
  }

  const reportUrls = Object.keys(reportToFiles);
  console.log(`Pass 2: fetching ${reportUrls.length} unique reports (${noFetch} no fetchable URL)`);

  const cache = {};
  let fetched = 0, fetchFailed = 0;
  for (const reportUrl of reportUrls) {
    const rawUrls = toRawUrls(reportUrl);
    let content   = null;
    for (const rawUrl of rawUrls) {
      await sleep(DELAY_MS);
      content = await fetchUrl(rawUrl);
      if (content) break;
    }
    if (!content) { fetchFailed++; continue; }
    cache[reportUrl] = classifySector(content);
    fetched++;
    if (fetched % 10 === 0) process.stdout.write(`\r  ${fetched}/${reportUrls.length} fetched...`);
  }
  if (fetched) console.log('');

  for (const [reportUrl, sector] of Object.entries(cache)) {
    if (!sector) continue;
    for (const fname of reportToFiles[reportUrl]) {
      const fp = path.join(FINDINGS_DIR, fname);
      let c    = fs.readFileSync(fp, 'utf8');
      if (/sector\//.test(c)) continue;
      const newC = addTagToFile(c, sector);
      if (newC === c) continue;
      fs.writeFileSync(fp, newC);
      added[sector] = (added[sector] || 0) + 1;
      fromReport++;
    }
  }

  console.log(`Pass 2 (report fetch): ${fromReport} tagged, ${fetchFailed} fetch failed`);
  console.log(`\nTotal tagged: ${fromContent + fromReport}`);
  console.log('By sector:', added);

  const finalUntagged = files.filter(f =>
    !(/sector\//.test(fs.readFileSync(path.join(FINDINGS_DIR, f), 'utf8')))
  ).length;
  console.log(`Still untagged: ${finalUntagged}`);
}

main().catch(err => { console.error(err); process.exit(1); });
