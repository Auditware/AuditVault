#!/usr/bin/env node
'use strict';

/**
 * tag_protocols.js
 * Tag protocol pages with blockchain/, lang/, sdk/, sector/ tags
 * derived from linked findings + description keyword inference.
 *
 * Reads data/proto_data.json - generate this before running.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT    = path.resolve(__dirname, '../..');
const PROTOCOLS_DIR = path.join(VAULT_ROOT, 'protocols');
const DATA_FILE     = path.join(__dirname, 'data', 'proto_data.json');

// ── Keyword inference rules ───────────────────────────────────────────────────

const CHAIN_KEYWORDS = [
  [/\bethereum\b|\bevm\b|\bsolidity\b/i,         'blockchain/evm'],
  [/\bsolana\b|\bsealevel\b/i,                   'blockchain/solana'],
  [/\baptos\b/i,                                 'blockchain/aptos'],
  [/\bsui\b/i,                                   'blockchain/sui'],
  [/\bstarknet\b/i,                              'blockchain/starknet'],
  [/\bpolkadot\b|\bsubstrate\b|\bparachain\b/i,  'blockchain/polkadot'],
  [/\bnear\b/i,                                  'blockchain/near'],
  [/\bcosmos\b|\bcosmwasm\b|\btendermint\b/i,    'blockchain/cosmos'],
  [/\balgorand\b/i,                              'blockchain/algorand'],
  [/\btron\b/i,                                  'blockchain/tron'],
  [/\bbsc\b|\bbinance smart chain\b/i,           'blockchain/bsc'],
  [/\bavalanche\b|\bavax\b/i,                    'blockchain/avalanche'],
  [/\bpolygon\b|\bmatic\b/i,                     'blockchain/polygon'],
  [/\barbitrum\b/i,                              'blockchain/arbitrum'],
  [/\boptimism\b|\bop stack\b/i,                 'blockchain/optimism'],
  [/\bbase\b/i,                                  'blockchain/base'],
  [/\bzksync\b|\bzk stack\b/i,                   'blockchain/zksync'],
  [/\bfantom\b/i,                                'blockchain/fantom'],
  [/\bhedera\b|\bhbar\b/i,                       'blockchain/hedera'],
  [/\bton\b|\bthe open network\b/i,              'blockchain/ton'],
  [/\bbitcoin\b|\bbtc\b/i,                       'blockchain/bitcoin'],
  [/\bfuel\b/i,                                  'blockchain/fuel'],
  [/\bchiliz\b/i,                                'blockchain/chiliz'],
];

const LANG_KEYWORDS = [
  [/\bsolidity\b/i,              'lang/solidity'],
  [/\brust\b/i,                  'lang/rust'],
  [/\bmove\b/i,                  'lang/move'],
  [/\bcairo\b/i,                 'lang/cairo'],
  [/\bink!\b|\bink\b/i,          'lang/ink'],
  [/\bvyper\b/i,                 'lang/vyper'],
  [/\btypescript\b|\bjavascript\b/i, 'lang/typescript'],
  [/\bsway\b/i,                  'lang/sway'],
];

const SDK_KEYWORDS = [
  [/\banchor\b/i,   'sdk/anchor'],
  [/\bfoundry\b/i,  'sdk/foundry'],
  [/\bhardhat\b/i,  'sdk/hardhat'],
  [/\bcosmwasm\b/i, 'sdk/cosmwasm'],
];

const SECTOR_KEYWORDS = [
  [/\bdecentralized exchange\b|\bdex\b|\bamm\b|\bswap\b|\bpool\b/i,  'sector/dex'],
  [/\blend\b|\bborrow\b|\bcollateral\b|\bcredit\b/i,                  'sector/lending'],
  [/\bliquid.?staking\b|\bstaking derivative\b|\blst\b/i,             'sector/liquid-staking'],
  [/\bstaking\b/i,                                                     'sector/staking'],
  [/\bperp\b|\bperpetual\b|\bfutures?\b/i,                            'sector/perpetuals'],
  [/\boptions?\b/i,                                                    'sector/options'],
  [/\boracle\b|\bprice feed\b/i,                                       'sector/oracle'],
  [/\bbridge\b|\bcross.?chain\b/i,                                     'sector/bridge'],
  [/\bgovernance\b|\bdao\b|\bvoting\b/i,                              'sector/governance'],
  [/\bstablecoin\b|\bpegged\b|\balgo.?stable\b/i,                     'sector/stable'],
  [/\byield.?aggregator\b|\byield.?optim\b|\bvault\b|\bstrategy\b/i,  'sector/yield-aggregator'],
  [/\bnft\b|\bnon.?fungible\b/i,                                       'sector/nft'],
  [/\bnft.?market\b|\bnft.?trading\b/i,                               'sector/nft-marketplace'],
  [/\blaunchpad\b|\bido\b/i,                                           'sector/launchpad'],
  [/\binsurance\b/i,                                                   'sector/insurance'],
  [/\bpayment\b|\bpayroll\b/i,                                         'sector/payment'],
  [/\bgaming\b|\bgame\b|\bgamefi\b/i,                                  'sector/gaming'],
  [/\bprivacy\b|\bmixer\b|\bzero.?knowledge\b|\bzk\b/i,               'sector/privacy'],
  [/\brollup\b|\bl2\b|\blayer.?2\b/i,                                 'sector/bridge'],
  [/\bidentity\b|\bkyc\b|\bssi\b/i,                                    'sector/identity'],
  [/\bfarm\b|\byield.?farm\b/i,                                        'sector/farm'],
];

// ── Manual overrides for well-known multi-chain protocols ─────────────────────

const MANUAL_TAGS = {
  'Chainlink':      ['blockchain/evm', 'blockchain/solana', 'blockchain/aptos', 'blockchain/sui', 'lang/solidity', 'sector/oracle'],
  'Wormhole':       ['blockchain/evm', 'blockchain/solana', 'blockchain/aptos', 'blockchain/sui', 'blockchain/cosmos', 'lang/solidity', 'lang/rust', 'sector/bridge'],
  'LayerZero':      ['blockchain/evm', 'blockchain/solana', 'blockchain/aptos', 'lang/solidity', 'sector/bridge'],
  'Axelar':         ['blockchain/evm', 'blockchain/cosmos', 'lang/solidity', 'lang/rust', 'sector/bridge'],
  'Stargate':       ['blockchain/evm', 'lang/solidity', 'sector/bridge', 'sector/dex'],
  'Uniswap':        ['blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Aave':           ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Compound':       ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Curve Finance':  ['blockchain/evm', 'lang/vyper', 'sector/dex', 'sector/stable'],
  'MakerDAO':       ['blockchain/evm', 'lang/solidity', 'sector/stable', 'sector/lending'],
  'Synthetix':      ['blockchain/evm', 'lang/solidity', 'sector/perpetuals', 'sector/synthetic'],
  'GMX':            ['blockchain/evm', 'blockchain/solana', 'lang/solidity', 'sector/perpetuals'],
  'Lido':           ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Frax Finance':   ['blockchain/evm', 'lang/solidity', 'sector/stable', 'sector/lending'],
  'Euler':          ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Morpho':         ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Radiant':        ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Pendle':         ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'Sablier':        ['blockchain/evm', 'lang/solidity', 'sector/payment'],
  'OpenZeppelin':   ['blockchain/evm', 'lang/solidity'],
  'Hats Protocol':  ['blockchain/evm', 'lang/solidity', 'sector/governance'],
  'Safe':           ['blockchain/evm', 'lang/solidity', 'sector/account'],
  'MetaMask':       ['blockchain/evm', 'lang/typescript', 'sector/account'],
  'Gnosis':         ['blockchain/evm', 'lang/solidity', 'sector/account'],
  'Squads':         ['blockchain/solana', 'lang/rust', 'sector/account'],
  'Jupiter':        ['blockchain/solana', 'lang/rust', 'sector/dex'],
  'Raydium':        ['blockchain/solana', 'lang/rust', 'sector/dex'],
  'Orca':           ['blockchain/solana', 'lang/rust', 'sector/dex'],
  'Marinade':       ['blockchain/solana', 'lang/rust', 'sector/liquid-staking'],
  'Drift':          ['blockchain/solana', 'lang/rust', 'sector/perpetuals'],
  'Mango Markets':  ['blockchain/solana', 'lang/rust', 'sector/lending', 'sector/perpetuals'],
  'Solend':         ['blockchain/solana', 'lang/rust', 'sector/lending'],
  'Thala':          ['blockchain/aptos', 'lang/move', 'sector/dex', 'sector/stable'],
  'Liquidswap':     ['blockchain/aptos', 'lang/move', 'sector/dex'],
  'Cetus':          ['blockchain/sui', 'lang/move', 'sector/dex'],
  'DeepBook':       ['blockchain/sui', 'lang/move', 'sector/dex'],
  'Sui':            ['blockchain/sui', 'lang/move'],
  'Aptos':          ['blockchain/aptos', 'lang/move'],
  'Aztec':          ['blockchain/evm', 'lang/solidity', 'sector/privacy'],
  'zkSync':         ['blockchain/evm', 'lang/solidity', 'blockchain/zksync'],
  'Starknet':       ['blockchain/starknet', 'lang/cairo'],
  'Fuel':           ['blockchain/fuel', 'lang/sway'],
  'Aragon':         ['blockchain/evm', 'lang/solidity', 'sector/governance'],
  'Connext':        ['blockchain/evm', 'lang/solidity', 'sector/bridge'],
  'Hop':            ['blockchain/evm', 'lang/solidity', 'sector/bridge'],
  'Across':         ['blockchain/evm', 'lang/solidity', 'sector/bridge'],
  'Arbitrum':       ['blockchain/arbitrum', 'blockchain/evm', 'lang/solidity'],
  'Optimism':       ['blockchain/optimism', 'blockchain/evm', 'lang/solidity'],
  'Taiko':          ['blockchain/evm', 'lang/solidity'],
  'Scroll':         ['blockchain/evm', 'lang/solidity'],
  'Linea':          ['blockchain/evm', 'lang/solidity'],
  'Balancer':       ['blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Yearn Finance':  ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'Yearn':          ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'Convex':         ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'Ribbon Finance': ['blockchain/evm', 'lang/solidity', 'sector/options'],
  'Lyra Finance':   ['blockchain/evm', 'lang/solidity', 'sector/options'],
  'Ithaca Finance': ['blockchain/evm', 'lang/solidity', 'sector/options'],
  'Opyn':           ['blockchain/evm', 'lang/solidity', 'sector/options'],
  'Panoptic':       ['blockchain/evm', 'lang/solidity', 'sector/options'],
  'Rocket Pool':    ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Frax':           ['blockchain/evm', 'lang/solidity', 'sector/stable'],
  'Liquity':        ['blockchain/evm', 'lang/solidity', 'sector/stable', 'sector/lending'],
  'Fei Protocol':   ['blockchain/evm', 'lang/solidity', 'sector/stable'],
  'Augur':          ['blockchain/evm', 'lang/solidity', 'sector/prediction'],
  'PoolTogether':   ['blockchain/evm', 'lang/solidity', 'sector/lottery'],
  'Sudoswap':       ['blockchain/evm', 'lang/solidity', 'sector/nft-marketplace'],
  'LooksRare':      ['blockchain/evm', 'lang/solidity', 'sector/nft-marketplace'],
  'Blur':           ['blockchain/evm', 'lang/solidity', 'sector/nft-marketplace'],
  'OpenSea':        ['blockchain/evm', 'lang/solidity', 'sector/nft-marketplace'],
  'Sushi':          ['blockchain/evm', 'lang/solidity', 'sector/dex', 'sector/lending'],
  'Camelot':        ['blockchain/arbitrum', 'blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Velodrome':      ['blockchain/optimism', 'blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Aerodrome':      ['blockchain/base', 'blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Beefy':          ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'BadgerDAO':      ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator'],
  'Alchemix':       ['blockchain/evm', 'lang/solidity', 'sector/yield-aggregator', 'sector/lending'],
  'Superfluid':     ['blockchain/evm', 'lang/solidity', 'sector/payment'],
  'Biconomy':       ['blockchain/evm', 'lang/solidity', 'sector/account'],
  'EigenLayer':     ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Karak':          ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Puffer Finance': ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Renzo':          ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'Lombard':        ['blockchain/evm', 'lang/solidity', 'sector/liquid-staking'],
  'GainsNetwork':   ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Gains Network':  ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Perennial':      ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Kwenta':         ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'dYdX':           ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Vertex':         ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Hyperliquid':    ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Ostium':         ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'Zaros':          ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  'ParaSpace':      ['blockchain/evm', 'lang/solidity', 'sector/lending', 'sector/nft'],
  "JPEG'd":         ['blockchain/evm', 'lang/solidity', 'sector/lending', 'sector/nft'],
  'BendDAO':        ['blockchain/evm', 'lang/solidity', 'sector/lending', 'sector/nft'],
  'Ion Protocol':   ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Notional':       ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Term Finance':   ['blockchain/evm', 'lang/solidity', 'sector/lending'],
  'Gearbox':        ['blockchain/evm', 'lang/solidity', 'sector/lending', 'sector/yield-aggregator'],
  'Maia DAO':       ['blockchain/evm', 'lang/solidity', 'sector/dex', 'sector/lending', 'sector/yield-aggregator'],
  'Berachain':      ['blockchain/evm', 'lang/solidity', 'sector/dex', 'sector/lending'],
  'Skale':          ['blockchain/evm', 'lang/solidity'],
  'Celo':           ['blockchain/evm', 'lang/solidity'],
  'Polygon':        ['blockchain/polygon', 'blockchain/evm', 'lang/solidity'],
  'Mantle':         ['blockchain/evm', 'lang/solidity'],
  'Audius':         ['blockchain/evm', 'lang/solidity', 'sector/token'],
  'RNDR':           ['blockchain/evm', 'lang/solidity', 'sector/token'],
  'Decentraland':   ['blockchain/evm', 'lang/solidity', 'sector/gaming', 'sector/nft'],
  'Chiliz':         ['blockchain/chiliz', 'blockchain/evm', 'lang/solidity'],
  'Boba':           ['blockchain/evm', 'lang/solidity', 'sector/bridge'],
  'UMA':            ['blockchain/evm', 'lang/solidity', 'sector/bridge', 'sector/oracle'],
  'Polymer':        ['blockchain/evm', 'lang/solidity', 'sector/bridge'],
  'Perena':         ['blockchain/solana', 'lang/rust', 'sector/stable', 'sector/dex'],
  'Plasma':         ['blockchain/solana', 'lang/rust', 'sector/dex'],
  'Cantina Oro':    ['blockchain/solana', 'lang/rust', 'sector/staking'],
  'Layer N':        ['blockchain/solana', 'lang/rust'],
  'Swaylend':       ['blockchain/fuel', 'lang/sway', 'sector/lending'],
  'ink!':           ['blockchain/polkadot', 'lang/ink'],
  'Acala':          ['blockchain/polkadot', 'lang/rust', 'sector/dex', 'sector/stable'],
  'Hydration':      ['blockchain/polkadot', 'lang/rust', 'sector/dex'],
  'Neutron':        ['blockchain/cosmos', 'lang/rust', 'sector/bridge'],
  'Osmosis':        ['blockchain/cosmos', 'lang/rust', 'sector/dex'],
  'CoreDAO':        ['blockchain/bitcoin', 'blockchain/evm', 'lang/solidity'],
  'Bonzo Finance':  ['blockchain/hedera', 'lang/solidity', 'sector/lending'],
  'HbarSuite':      ['blockchain/hedera', 'lang/solidity'],
  'g8keep':         ['blockchain/evm', 'lang/solidity', 'sector/dex'],
  'Shardeum':       ['blockchain/evm', 'lang/solidity'],
  'RFX':            ['blockchain/evm', 'lang/solidity', 'sector/perpetuals'],
  '0xbow':          ['blockchain/evm', 'lang/solidity', 'sector/privacy'],
};

const TAG_ORDER = ['blockchain/', 'lang/', 'sdk/', 'sector/'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function sortTags(tags) {
  return [...new Set(tags)].sort((a, b) => {
    const ia = TAG_ORDER.findIndex(p => a.startsWith(p));
    const ib = TAG_ORDER.findIndex(p => b.startsWith(p));
    const ra = ia === -1 ? 99 : ia;
    const rb = ib === -1 ? 99 : ib;
    return ra !== rb ? ra - rb : a.localeCompare(b);
  });
}

function inferFromText(text) {
  const tags = new Set();
  for (const [rx, tag] of CHAIN_KEYWORDS)  if (rx.test(text)) tags.add(tag);
  for (const [rx, tag] of LANG_KEYWORDS)   if (rx.test(text)) tags.add(tag);
  for (const [rx, tag] of SDK_KEYWORDS)    if (rx.test(text)) tags.add(tag);
  for (const [rx, tag] of SECTOR_KEYWORDS) if (rx.test(text)) tags.add(tag);
  // Implied language defaults
  if (tags.has('blockchain/evm')    && ![...tags].some(t => t.startsWith('lang/'))) tags.add('lang/solidity');
  if (tags.has('blockchain/solana') && !tags.has('lang/rust'))                       tags.add('lang/rust');
  if ((tags.has('blockchain/aptos') || tags.has('blockchain/sui')) && !tags.has('lang/move')) tags.add('lang/move');
  return tags;
}

function applyTags(fpath, protoName, findingTags, desc) {
  const content = fs.readFileSync(fpath, 'utf8');
  const tags    = new Set();

  if (MANUAL_TAGS[protoName]) MANUAL_TAGS[protoName].forEach(t => tags.add(t));

  for (const t of findingTags) {
    if (TAG_ORDER.some(p => t.startsWith(p))) tags.add(t);
  }

  if (!/pending/i.test(desc)) {
    for (const t of inferFromText(desc)) tags.add(t);
  }

  if (tags.has('blockchain/evm') && ![...tags].some(t => t.startsWith('lang/'))) tags.add('lang/solidity');
  if (!tags.size) return false;

  const tagLines    = sortTags([...tags]).map(t => `  - ${t}`).join('\n');
  const frontmatter = `---\ntags:\n${tagLines}\n---\n`;
  const body        = content.replace(/^---[\s\S]*?---\s*\n?/, '');
  fs.writeFileSync(fpath, frontmatter + body);
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!fs.existsSync(DATA_FILE)) {
  console.error(`proto_data.json not found at ${DATA_FILE}\nGenerate it first.`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
let written = 0, skipped = 0;

for (const [protoName, info] of Object.entries(data)) {
  const protoFile = path.join(PROTOCOLS_DIR, protoName, `${protoName}.md`);
  if (!fs.existsSync(protoFile)) continue;
  if (applyTags(protoFile, protoName, info.finding_tags, info.desc)) written++;
  else skipped++;
}

console.log(`Done: ${written} tagged, ${skipped} skipped (no tags inferred)`);
