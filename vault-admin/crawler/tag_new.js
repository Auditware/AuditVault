#!/usr/bin/env node
'use strict';

/**
 * tag_new.js
 * Tags findings that have no frontmatter yet - adds severity, lang,
 * sector, platform, protocol, auditors, and report fields.
 * Re-run safe: skips files that already start with ---.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');

// ── Sector classifier ─────────────────────────────────────────────────────────

const SECTOR_RULES = [
  ['sector/bridge',           /\b(bridge|cross.?chain|interoperab|ibc\b|wormhole|layerzero|stargate|multichain|celer)/],
  ['sector/zk',               /\b(zk.?proof|zero.?knowledge|zkevm|zkvm|circom|groth16|plonk\b|snark|stark\b|prover|verifier circuit)/],
  ['sector/oracle',           /\b(oracle|price feed|chainlink|pyth\b|twap\b)/],
  ['sector/perpetuals',       /\b(perpetual|perp\b|perps\b|funding rate|mark price|open interest|leverage trading)/],
  ['sector/dex',              /\b(dex\b|decentralized exchange|amm\b|automated market maker|swap pool|liquidity pool|uniswap|curve finance|balancer)/],
  ['sector/lending',          /\b(lend|borrow|collateral|liquidat|aave\b|compound\b|morpho\b|euler\b|loan|debt|credit)/],
  ['sector/restaking',        /\b(restaking|restake|eigenlayer|avs\b|actively validated)/],
  ['sector/staking',          /\b(staking|staked|validator|delegat|slash|liquid staking|lsd\b|lst\b)/],
  ['sector/vault',            /\b(erc.?4626|yield aggregat|auto.?compound|yearn|beefy|convex\b|yield vault|yield strategy|harvest finance|strategy contract|vault strategy|vault contract|yield bearing)/],
  ['sector/stable',           /\b(stablecoin|stable coin|peg\b|pegged|dai\b|usdc\b|usdt\b|frax\b|algorithmic stable)/],
  ['sector/token',            /\b(erc.?20\b|erc20\b|transfer hook|fee.on.transfer|rebas|token contract|token standard|airdrop|token.*vesting|presale|token sale|allowance\b)/],
  ['sector/nft',              /\b(nft\b|non.fungible|erc.?721|erc.?1155|marketplace|opensea|royalt)/],
  ['sector/multisig',         /\b(multisig|multi.sig|gnosis safe|safe wallet)/],
  ['sector/governance',       /\b(govern|dao\b|proposal|voting|timelock|snapshot\b|quorum)/],
  ['sector/account',          /\b(account abstraction|erc.?4337|smart account|paymaster|bundler|entrypoint)/],
  ['sector/rwa',              /\b(real.world asset|rwa\b|tokenized securities|commodity token)/],
  ['sector/gaming',           /\b(game\b|gaming|play.to.earn|p2e\b|gamefi)/],
  ['sector/wallet',           /\b(hardware wallet|cold wallet|metamask|ledger wallet|trezor|key management system|self.custod|non.custodial wallet|browser extension wallet|metamask snap)/],
  ['sector/streaming',        /\b(payment stream|sablier|superfluid|vesting stream|vesting contract|vesting schedule|token.*vesting|cliff.*vesting|linear vesting)/],
  ['sector/insurance',        /\b(insurance|nexus mutual|risk pool|underwrite|cover protocol|coverage claim|insurance fund|nexus\b|unslashed)/],
  ['sector/nft-lending',      /\b(nft.*loan|nft.*lend|nft.*borrow|nft.*collateral|nftfi\b|bend dao|benddao|arcade\b.*nft|blur.*lending|blend\b)/],
  ['sector/nft-marketplace',  /\b(nft.*marketplace|opensea|blur\b|looksrare|x2y2|seaport\b|nft.*trading|royalt)/],
  ['sector/liquid-staking',   /\b(liquid staking|lido\b|rocket pool|frax eth|steth\b|reth\b|cbeth\b|liquid.*staking token|lst\b|lsd\b)/],
  ['sector/staking-pool',     /\b(staking pool|stake pool|pool.*stake|staking reward|masterchef|emission.*staking|reward pool)/],
  ['sector/yield-aggregator', /\b(yield aggregat|yearn\b|beefy\b|harvest finance|auto.?compound|convex\b|aura\b.*yield|yield optimizer)/],
  ['sector/options',          /\b(option\b|call option|put option|strike price|expir.*option|opyn\b|hegic\b|lyra\b|premia\b|dopex\b|option.*contract)/],
  ['sector/farm',             /\b(yield farm|farming reward|farm\b.*reward|masterchef|emission|yield optimization|lp.*reward|farm.*token)/],
  ['sector/cdp',              /\b(cdp\b|collateralized debt position|makerdao|maker dao|liquity\b|trove\b|stability pool|vat\b.*dai|minting.*dai)/],
  ['sector/uncollat-lending', /\b(uncollateralized|undercollateralized|credit.?line|truefi\b|maple finance|goldfinch\b|clearpool\b|flash loan.*uncollat)/],
  ['sector/algo-stable',      /\b(algorithmic stable|algo.?stable|terra\b|ust\b|basis cash|fei\b|ampleforth|rai\b|reflexer|frax\b|crvusd\b|gho\b)/],
  ['sector/prediction',       /\b(prediction market|outcome token|augur\b|futarchy|betting|outcome market|yes.*no.*market|polymarket|market resolution|binary market)/],
  ['sector/infra',            /\b(data availability layer|blob fee|blob gas|blob transaction|blob submission|sequencer|rollup infrastructure|eigen ?da|celestia|precompile|node operator|cross.?chain relay|message relay)/],
  ['sector/privacy',          /\b(privacy|zero.?knowledge|mixer|tornado|private transfer|shielded|confidential|anonymi)/],
];

function classifySectors(content) {
  const t = (content || '').toLowerCase();
  const matched = [];
  for (const [sector, rx] of SECTOR_RULES) {
    if (rx.test(t) && !matched.includes(sector)) matched.push(sector);
  }
  return matched;
}

// ── Field extractors ──────────────────────────────────────────────────────────

function extractProtocol(content) {
  const raw = (content.match(/^- protocol:\s*(.+)$/m) || [])[1] || '';
  if (!raw) return '';
  return raw
    .replace(/_\d{4}-\d{2}-\d{2}.*/, '')
    .replace(/[-_](audit|security|review|contest|competition|v\d+[\d.]*).*$/i, '')
    .replace(/[-_]\d{4}.*$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractAuditors(content) {
  const foundBy = content.match(/## Found by\n([^\n#]+)/);
  if (foundBy) return foundBy[1].split(',').map(a => a.trim()).filter(Boolean);
  const reporter = (content.match(/^- reporter:\s*(.+)$/m) || [])[1] || '';
  const name     = reporter.replace(/\s*\(.*\)/, '').trim();
  return name ? [name] : [];
}

function extractPlatform(content) {
  const reporter = (content.match(/^- reporter:\s*(.+)$/m) || [])[1] || '';
  const m = reporter.match(/\(([^)]+)\)/);
  if (!m) return null;
  return 'platform/' + m[1].toLowerCase().replace(/\s+/g, '-');
}

function deriveReport(src, bodySource) {
  if (src && src !== 'N/A') {
    const issueMatch = src.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/issues\/\d+/);
    if (issueMatch) return issueMatch[1];
    const c4Match = src.match(/https:\/\/github\.com\/code-423n4\/(\d{4}-\d{2}-[^/]+?)-findings/);
    if (c4Match) return `https://code4rena.com/reports/${c4Match[1]}`;
    return src;
  }
  if (bodySource) {
    const issueMatch = bodySource.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/issues\/\d+/);
    if (issueMatch) return issueMatch[1];
    return bodySource;
  }
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'));
let written = 0, skipped = 0;

for (const f of files) {
  const fp = path.join(FINDINGS_DIR, f);
  let c = fs.readFileSync(fp, 'utf8');
  if (c.startsWith('---')) { skipped++; continue; }

  const tags     = ['severity/high'];
  const platform = extractPlatform(c);

  if (/github\.com/i.test(c))                                                      tags.push('has/github');
  if (/## Proof of Concept|## PoC|## Exploit/i.test(c))                            tags.push('has/poc');
  if (/pragma solidity|\.sol\b|uint256|mapping\s*\(|contract\s+\w+/i.test(c))     tags.push('lang/solidity');
  if (/\.rs\b|use std::|#\[derive|fn \w+\(/.test(c))                               tags.push('lang/rust');
  if (/#\[account|#\[program\]|anchor_lang|use anchor/.test(c))                    tags.push('lang/anchor');
  if (/@external|@view|\bvyper\b/i.test(c))                                        tags.push('lang/vyper');
  if (/\.move\b|module \w+::\w+|public fun /i.test(c))                             tags.push('lang/move');

  tags.push(...classifySectors(c));
  if (platform) tags.push(platform);

  const protocol = extractProtocol(c);
  const auditors = extractAuditors(c);
  const src      = (c.match(/^- source:\s*(.+)$/m) || [])[1]?.trim();
  const bodySrc  = c.match(/^Source:\s*(.+)$/m)?.[1]?.trim();
  const report   = deriveReport(src, bodySrc);

  let fm = `---\ntags:\n${tags.map(t => `  - ${t}`).join('\n')}\n`;
  if (protocol) fm += `protocol: "${protocol}"\n`;
  if (auditors.length) fm += `auditors:\n${auditors.map(a => `  - ${a}`).join('\n')}\n`;
  if (report)   fm += `report: "${report}"\n`;
  fm += '---\n';

  fs.writeFileSync(fp, fm + c);
  written++;
}

console.log(`Written: ${written}, Skipped: ${skipped}`);
