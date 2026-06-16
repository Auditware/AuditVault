#!/usr/bin/env node
'use strict';

/**
 * normalize_protocols.js
 * Normalize protocol: fields in findings to [[WikiLink]] format.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');

// ── Manual overrides - raw value → clean name (null = flag for review) ────────

const MANUAL = {
  '0Xbow Smart Contract Audit Report   2':                '0xbow',
  'Alchemix   Optimism Bridging And Reward Routing':      'Alchemix',
  'Apps.Fun Smart Contract Audit Report':                 'Apps.Fun',
  'Audius Contracts Audit':                               'Audius',
  'Augur Core V2 Audit: Components':                      'Augur',
  'Aura Audit Report':                                    'Aura',
  'Aurorafastbridge':                                     'Aurora',
  'Autonomint Colored Dollar V1':                         'Autonomint',
  'Basic Attention Token (BAT) Audit':                    'Basic Attention Token',
  'Blueberry Update #3':                                  'Blueberry',
  'Boba 1 (Bridges And LP Floating Fee)':                 'Boba',
  'Cantina Oro February2025':                             'Cantina Oro',
  'Cantina Polymer Frankcastle':                          'Polymer',
  'Celo Contracts Audit – Release 4':                     'Celo',
  'Compound Alpha Governance System Audit':               'Compound',
  'Compound Open Oracle Audit':                           'Compound',
  'Datachain   IBC':                                      'Datachain',
  'Decentraland MANA Token Audit':                        'Decentraland',
  'EIP':                                                  'EIP-4337',
  'ETH2 Deposit CLI':                                     'ETH2 Deposit CLI',
  'EVM Emulator And Semi Abstracted Nonces Update Audit': 'zkSync',
  "EtherCamp'S Decentralized Startup Team Public Code Audit": 'EtherCamp',
  'Fei Protocol V2 Phase 1':                              'Fei Protocol',
  'Franklin Templeton: Aptos Money Market Fund':          'Franklin Templeton',
  'Freeverse Audit':                                      'Freeverse',
  'GainsNetwork July':                                    'GainsNetwork',
  'Gmx Solana Protocol   Zenith Audit Report':            'GMX',
  'GooseFX V2':                                           'GooseFX',
  'Gorples EVM Contracts Revision':                       'Gorples',
  'Holdefi Audit':                                        'HoldeFi',
  'Hubii Token Audit':                                    'Hubii',
  'INIT Capital':                                         'INIT Capital',
  'Init Capital':                                         'INIT Capital',
  'LayerZero Aptos':                                      'LayerZero',
  'Level  Money':                                         'Level Money',
  'Lzapp Onft':                                           'LayerZero',
  'MUD Audit':                                            'MUD',
  'Music Protocol (Token, Staking And DAO)':              'Music Protocol',
  'Mute.Io':                                              'Mute.io',
  'Mysten Deepbook':                                      'DeepBook',
  'Mysten Labs Sui':                                      'Sui',
  'Mysten Republic Security Token':                       'Mysten Labs',
  'OmiseGo MoreVP':                                       'OmiseGo',
  "OpenBazaar'S Escrow Audit":                            'OpenBazaar',
  'OpenBrush Contracts Library Security Review':          'OpenBrush',
  'Opyn Contracts Audit':                                 'Opyn',
  'Origin Dollar':                                        'Origin',
  'Origin Protocol':                                      'Origin',
  'P2P.Org':                                              'P2P.org',
  'Perennial V2':                                         'Perennial',
  'Perennial V2 Update #1':                               'Perennial',
  'Plasma Accretion':                                     'Plasma',
  'Pods Finance':                                         'Pods Finance',
  'Pontem (Liquidswap)':                                  'Pontem',
  'Pontem // Clmm':                                       'Pontem',
  'Pontem Mobile Wallet':                                 'Pontem',
  'Push Protocol Snap For MetaMask':                      'Push Protocol',
  'RNDR Token Transfer Audit':                            'RNDR',
  'Radiant July':                                         'Radiant',
  'Radiant June':                                         'Radiant',
  'Reporter:':                                            null,
  'Rocket Pool Atlas (V1.2)':                             'Rocket Pool',
  'Roots of Ember Vault':                                 'Roots of Ember',
  'Security Review – Ink! & Cargo Contract':              'ink!',
  'Skale Token':                                          'Skale',
  'Sofamon August':                                       'Sofamon',
  'Sperax   Farms':                                       'Sperax',
  'Starknet Perpetual':                                   'Starknet Perpetual',
  'Storj Token Audit':                                    'Storj',
  'Succinct Labs Telepathy':                              'Succinct',
  'Sui Axelar (Gateway V2)':                              'Axelar',
  'Sui Bridge':                                           'Sui',
  'SuperDAO Promissory Token Audit':                      'SuperDAO',
  'Symmetrical Update':                                   'Symmetrical',
  'Thala Labs':                                           'Thala',
  'Thala Swap + Math V2':                                 'Thala',
  'Thala VCISO':                                          'Thala',
  'ThalaSwap V2':                                         'Thala',
  'The Standard Smart Vault':                             'The Standard',
  'Threshold Network':                                    'Threshold',
  'Tierion Presale Audit':                                'Tierion',
  'Trillion Contracts + Synth Chefs (Updates)':           'Trillion',
  'Unknown':                                              null,
  'ZK Email Noir':                                        'ZK Email',
  'ZK Stack VM1.5 Diff Audit':                            'ZK Stack',
  'ZkSync Fee Model And Token Bridge Audit':              'zkSync',
  '1Inch':                                                '1inch',
  'AZTEC':                                                'Aztec',
  'Ajna Protocol':                                        'Ajna',
  'Argent Account & Argent Multisig Starknet Transaction V3 Updates': 'Argent',
  'Berachain Pol':                                        'Berachain',
  'Blobhouse Smart Contract Audit Report':                'Blobhouse',
  'Bullpen Audit Report':                                 'Bullpen',
  'Conduct Audit Report':                                 'Conduct',
  'Dojo Security Review':                                 'Dojo',
  'GainsNetwork':                                         'Gains Network',
  'Gearbox Protocol':                                     'Gearbox',
  'HatsSignerGate V2':                                    'Hats Protocol',
  'Hats Protocol':                                        'Hats Protocol',
  'Rarible Audit Report':                                 'Rarible',
  'Swapboard Smart Contract Audit Report':                'Swapboard',
};

// ── Auto-strip suffixes ───────────────────────────────────────────────────────

const STRIP_PATTERNS = [
  /\s+Smart Contract Audit Report\s*\d*$/i,
  /\s+Contracts Audit\s*[-–]?\s*.*$/i,
  /\s+Token Audit$/i,
  /\s+Presale Audit$/i,
  /\s+Escrow Audit$/i,
  /\s+Audit Report\s*\d*$/i,
  /\s+Audit$/i,
  /:\s+.*$/,
  /\s+\(.*\)$/,
  /\s+V\d[\d.]*\s*(Update\s*#\d+)?$/i,
  /\s+Update\s*#\d+$/i,
  /\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{0,4}$/i,
  /\s+Phase\s*\d+$/i,
  /\s+Release\s*\d+$/i,
  /^Security Review\s*[-–]\s*/i,
  /\s+Security Review$/i,
  /\s+Labs$/i,
];

function autoClean(raw) {
  let s = raw.trim();
  for (const pat of STRIP_PATTERNS) s = s.replace(pat, '').trim();
  return s;
}

function normalize(raw) {
  raw = raw.trim().replace(/^["']|["']$/g, '');
  if (raw.startsWith('[[') && raw.endsWith(']]')) return null; // already done
  if (Object.prototype.hasOwnProperty.call(MANUAL, raw)) return MANUAL[raw]; // may be null → flag
  const cleaned = autoClean(raw);
  return cleaned || null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md')).sort();
let changed = 0, flagged = 0, skipped = 0;
const flags = [];

for (const fname of files) {
  const fpath   = path.join(FINDINGS_DIR, fname);
  const content = fs.readFileSync(fpath, 'utf8');
  const m       = content.match(/^(protocol:\s*)(.+)$/m);
  if (!m) { skipped++; continue; }

  const rawVal = m[2].trim().replace(/^["']|["']$/g, '');
  if (rawVal.startsWith('[[') && rawVal.endsWith(']]')) { skipped++; continue; }

  const clean = normalize(rawVal);
  if (clean === null && Object.prototype.hasOwnProperty.call(MANUAL, rawVal) && MANUAL[rawVal] === null) {
    flagged++;
    flags.push([rawVal, fname]);
    continue;
  }
  if (!clean) { skipped++; continue; }

  const newContent = content.slice(0, m.index) + `${m[1]}"[[${clean}]]"` + content.slice(m.index + m[0].length);
  fs.writeFileSync(fpath, newContent);
  changed++;
}

console.log(`\nDone: ${changed} updated, ${skipped} already linked/no field, ${flagged} flagged\n`);
if (flags.length) {
  console.log('=== FLAGGED (manual review) ===');
  flags.forEach(([raw, f]) => console.log(`  [${raw}]  ${f}`));
}
