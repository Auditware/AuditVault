#!/usr/bin/env node
'use strict';

/**
 * tag_vault.js
 * Adds protocol/ sector tags to vault findings.
 * For files without frontmatter: writes all fixed tags + protocol sector.
 * For files with frontmatter: injects protocol/ tag if missing.
 * Re-run safe: skips files that already have a protocol/ tag.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');

// ── Protocol → sector classifier ─────────────────────────────────────────────

function classifyProtocol(proto, title, content) {
  const t  = (proto + ' ' + title).toLowerCase();
  const s  = content.slice(0, 800).toLowerCase();
  const is = r => r.test(t);
  const cs = r => r.test(s);

  if (is(/\bdex\b|swap|amm|\blp\b|liquidity.pool|kittenswap|sushiswap|\bsushi\b|uniswap|1inch|balancer|curve|clmm|clamm|\bclob\b|orderbook|order.book|trading.pair|\bpair\b|ammplify|beanstalk.wells|ajna|sudoswap|woofi|increment|hanji|fluid.dex|dango|myriad.clob|tonco|swap.coffee|\bgte\b|\bbebop\b/)) return 'dex';
  if (is(/lend|borrow|credit|loan|collateral|aave|compound|euler|gearbox|blueberry|blend|money.market|\bdebt\b|\bcdp\b|interest.rate|liquidat|paraspace|folks.finance|open.dollar|radiant|ion.protocol|licredity|hyperlend|evaa|malda|bucket.protocol|\bterm.finance\b|\bloopfi\b|\bgondi\b/)) return 'lending';
  if (is(/bridge|cross.chain|wormhole|connext|layerzero|multichain|relayer|messenger|arbitrum.token|meson|fiamma|securitize|toki.bridge|chainport|l2.bridge|off.chain.bridge|\bdecent\b|\bcurio\b/)) return 'bridge';
  if (is(/\bnft\b|erc.?721|collectible|nifty|opensea|\bblur\b|looksrare|ticket|gaming|\bgame\b|trait|loots|nft.staking|niftyapes|bearcave|fantium|traitforge|museum|honeypot.*nft|camp.*nft|\bmunchables\b/)) return 'nft';
  if (is(/stak|validator|liquid.stak|restake|renzo|kiln|rocket|lido|eigenlayer|withdrawal|beacon|slash|delegate|geodefi|\bgeode\b|rio.network|karak|rivus|kinetiq|stakedotlink|bob.staking|stake.dao/)) return 'staking';
  if (is(/\bvault\b|yield|strategy|harvest|farm|autocompound|vaultka|composable.vault|loop.vault|colb|mellow|dipcoin.vault|afi.vault|pear.vault|superform|pods.finance|forta.staking.vault|morpho.vault|prime.vault|ample.earn/)) return 'vault';
  if (is(/\bdao\b|governance|govern|\bvote\b|voting|aragon|nouns|proposal|timelock|barter.dao|dxdao|origin.govern|xdao|\bbrahma\b|snapshot|guild|\bvetenet\b/)) return 'governance';
  if (is(/multisig|gnosis.safe|\bhats\b|squads|smart.wallet|account.abstraction|paymaster|biconomy|etherspot|safe.signer|bls.wallet|gemini.wallet|sequence|\bkinto\b|lukso|biconomy.composability/)) return 'account';
  if (is(/\boracle\b|chainlink|api3|price.feed|tellor|band.protocol|switchboard|seda|reflector/)) return 'oracle';
  if (is(/stable|stablecoin|\busdc\b|\busdt\b|\busd\b|frankencoin|synthetic|peg.mechanism|ussd|hyperstable|monolith.stable|vusd|yuzuusd|resolv|\breserve\b|\bbeanstalk\b|buck.labs|zerem|\blmcv\b/)) return 'stable';
  if (is(/perp|perpetual|futures|options|derivative|gmx|vertex|\bintx\b|ostium|leverage|margin|funding.rate|perennial|buffer|panoptic|ithaca|neutral.trade|dipcoin.perp/)) return 'perp';
  if (is(/\bzk\b|zkvm|zkp|prover|verifier|plonk|snark|stark|zero.knowledge|zkevm|kakarot|linea|taiko|zksync|mantle|openvm|succinct|brevis|open.vm|fiamma|light.protocol|\bmonad\b/)) return 'zk';
  if (is(/token|vesting|erc.?20|\bvtvl\b|airdrop|distribution|launch|mint|\bsale\b|epoch.island|remora|tokenops|symmio|arkham|treasury.vest|\blivepeer\b|\bhydro\b|\bzerem\b/)) return 'token';
  if (is(/insurance|cover|risk.protocol|nexus/)) return 'insurance';
  if (is(/stream|superfluid|sablier/)) return 'streaming';
  if (is(/wallet|metamask|vultisig|martian.wallet|aptos.wallet/)) return 'wallet';
  if (is(/rwa|real.world|centrifuge|real.wagmi|land.and.tunnel|bretton|sukuk/)) return 'rwa';
  if (is(/sport|game|lottery|raffle|megapot|satori|\blotaheros\b/)) return 'gaming';

  // Content fallback
  if (cs(/\bdex\b|swap.*pool|amm|liquidity.provider/)) return 'dex';
  if (cs(/lend|borrow|collateral|liquidat/))            return 'lending';
  if (cs(/\bnft\b|erc.?721/))                           return 'nft';
  if (cs(/stak|validator|restake/))                     return 'staking';
  if (cs(/\bvault\b|yield.strateg/))                    return 'vault';
  if (cs(/bridge|cross.chain/))                         return 'bridge';
  if (cs(/stable|stablecoin|\busd\b/))                  return 'stable';
  if (cs(/perp|perpetual|futures/))                     return 'perp';
  if (cs(/governance|\bdao\b/))                         return 'governance';

  return null;
}

// ── Frontmatter helpers ───────────────────────────────────────────────────────

function fixedTags(content) {
  const tags = ['severity/high'];
  if (/github\.com/i.test(content))                                                     tags.push('has/github');
  if (/pragma solidity|\.sol\b|uint256|mapping\s*\(|contract\s+\w+/i.test(content))    tags.push('lang/solidity');
  if (/\.rs\b|use std::|#\[derive|fn main\(\)|impl\s+\w+.*\{[\s\S]{0,200}let\s+mut/.test(content)) tags.push('lang/rust');
  if (/@external|@view|\bvyper\b/i.test(content))                                       tags.push('lang/vyper');
  if (/proof.of.concept|\bpoc\b|exploit\.sol|attack\.sol/i.test(content))               tags.push('has/poc');
  if (/\$[\d,]+|\breward\b|\bbounty\b/i.test(content))                                  tags.push('has/reward');
  return tags;
}

function buildFrontmatter(tags) {
  return '---\ntags:\n' + tags.map(t => '  - ' + t).join('\n') + '\n---\n';
}

function injectIntoExisting(content, newTags) {
  return content.replace(/^(---\ntags:\n(?:  - .+\n)*)---/, (_, block) => {
    const additions = newTags.map(t => '  - ' + t).join('\n');
    return block + additions + '\n---';
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

const files = fs.readdirSync(FINDINGS_DIR).filter(f => f.endsWith('.md'));
let written = 0, skipped = 0, noProtocol = 0;
const stats = {};

for (const f of files) {
  const fp      = path.join(FINDINGS_DIR, f);
  const content = fs.readFileSync(fp, 'utf8');
  const proto   = (content.match(/^- protocol:\s*(.+)$/m) || [])[1] || '';
  const title   = (content.match(/^#\s+(.+)$/m) || [])[1] || '';
  const sector  = classifyProtocol(proto, title, content);

  if (sector) stats[sector] = (stats[sector] || 0) + 1;
  else noProtocol++;

  if (content.startsWith('---')) {
    if (sector && !content.includes('protocol/')) {
      fs.writeFileSync(fp, injectIntoExisting(content, ['protocol/' + sector]));
      written++;
    } else {
      skipped++;
    }
  } else {
    const tags = fixedTags(content);
    if (sector) tags.push('protocol/' + sector);
    fs.writeFileSync(fp, buildFrontmatter(tags) + content);
    written++;
  }
}

console.log(`Done. Written: ${written}, Skipped: ${skipped}, No protocol tag: ${noProtocol}`);
console.log('Protocol distribution:', JSON.stringify(stats, null, 2));
