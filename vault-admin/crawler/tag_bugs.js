#!/usr/bin/env node
'use strict';

/**
 * tag_bugs.js
 * Rule-based bug classifier for FindingVault.
 * Assigns vuln/, impact/, trigger/, precondition/, fix/, novelty/,
 * blast-radius/, and misassumption/ tags to findings and hacks.
 * Re-run safe: skips files that already have any of those axes tagged.
 */

const fs   = require('fs');
const path = require('path');

const VAULT_ROOT   = path.resolve(__dirname, '../..');
const FINDINGS_DIR = path.join(VAULT_ROOT, 'findings');
const HACKS_DIR    = path.join(VAULT_ROOT, 'hacks');

// ── Tag rules ─────────────────────────────────────────────────────────────────
// [tag, [patterns], confidence]  - first matching pattern wins per tag

const RULES = [
  // ── vuln/ ────────────────────────────────────────────────────────────────────
  ['vuln/reentrancy/cross-contract',            [/re.?entr\w+.{0,40}cross.contract/i, /cross.contract.{0,40}re.?entr/i], 0.85],
  ['vuln/reentrancy/cross-function',            [/re.?entr\w+.{0,40}cross.func/i, /cross.function.{0,40}re.?entr/i], 0.85],
  ['vuln/reentrancy/read-only',                 [/read.only.{0,30}re.?entr/i, /re.?entr\w+.{0,30}view\b/i, /view.{0,30}re.?entr/i], 0.82],
  ['vuln/reentrancy/single-function',           [/\bre.?entr\w+\b/i, /reentrancy guard/i, /checks.effects.interactions/i], 0.80],

  ['vuln/access-control/tx-origin',             [/tx\.origin/i, /tx_origin/i], 0.95],
  ['vuln/access-control/proxy-storage-collision', [/storage.{0,30}collision/i, /proxy.{0,30}storage/i, /storage.{0,30}overlap/i, /selector.clash/i, /proxy.selector/i, /function.selector.{0,20}clash/i, /selector.{0,20}collide/i], 0.88],
  ['vuln/access-control/uninitialized-owner',   [/uninitiali[sz]ed.{0,30}owner/i, /initialize.{0,30}owner/i, /owner.{0,30}uninitiali/i], 0.85],
  ['vuln/access-control/fake-account-substitution', [/fake.account/i, /malicious account/i, /account.substitut/i, /substitute.{0,20}account/i], 0.85],
  ['vuln/access-control/missing-signer',        [/missing.{0,20}signer/i, /is_signer/i, /signer.{0,20}check/i, /signer.{0,20}validat/i, /missing.{0,20}signature.check/i], 0.88],
  ['vuln/access-control/missing-owner-check',   [/missing.{0,20}owner.check/i, /owner.{0,20}not.{0,20}verif/i, /account\.owner.{0,30}not.check/i], 0.85],
  ['vuln/access-control/missing-modifier',      [/missing.{0,30}modifier/i, /missing.{0,20}onlyowner/i, /missing.{0,20}access.control/i, /no.{0,20}modifier/i, /without.{0,20}modifier/i], 0.82],

  ['vuln/arithmetic/division-before-multiply',  [/division.before.multipl/i, /divid.{0,20}before.{0,20}multipl/i, /multipl.{0,20}after.{0,20}divis/i], 0.90],
  ['vuln/arithmetic/decimal-mismatch',          [/decimal.{0,30}mismatch/i, /decimal.{0,30}differ/i, /different.{0,30}decimal/i, /token.decimal/i, /lamport.{0,20}token/i, /decimal.{0,20}conver/i], 0.82],
  ['vuln/arithmetic/rounding-direction',        [/round.{0,20}direction/i, /round.down.{0,30}should.round.up/i, /rounding.favor/i, /incorrect.round/i, /wrong.{0,20}round/i, /rounding.{0,20}favor.{0,20}attacker/i], 0.83],
  ['vuln/arithmetic/precision-loss',            [/precision.loss/i, /loss.{0,20}precision/i, /precision.{0,20}error/i, /truncat.{0,30}precision/i, /fixed.point.{0,30}loss/i], 0.82],
  ['vuln/arithmetic/overflow',                  [/overflow/i, /integer.overflow/i, /uint.{0,10}overflow/i, /wraparound/i], 0.78],
  ['vuln/arithmetic/underflow',                 [/underflow/i, /integer.underflow/i], 0.83],

  ['vuln/oracle/missing-circuit-breaker',       [/circuit.breaker/i, /price.{0,30}deviation.{0,20}check/i, /no.{0,20}sanity.check.{0,20}price/i], 0.85],
  ['vuln/oracle/manipulable-twap',              [/twap.{0,30}manipul/i, /manipul.{0,30}twap/i, /short.{0,20}twap/i, /twap.window.{0,20}short/i], 0.85],
  ['vuln/oracle/single-source',                 [/single.{0,20}oracle/i, /single.{0,20}price.{0,20}source/i, /no.{0,20}fallback.{0,20}oracle/i], 0.82],
  ['vuln/oracle/stale-price',                   [/stale.{0,20}price/i, /outdated.{0,20}price/i, /price.{0,20}stale/i, /freshness/i, /heartbeat/i, /price.{0,20}not.{0,20}updated/i], 0.85],
  ['vuln/oracle/spot-price',                    [/spot.price/i, /spot.{0,20}oracle/i, /instantaneous.price/i, /current.price.{0,20}as.oracle/i, /price\(\).{0,30}manipul/i], 0.83],

  ['vuln/logic/liquidation-logic',              [/liquidat.{0,30}logic/i, /liquidat.{0,30}wrong/i, /incorrect.{0,30}liquidat/i, /liquidat.{0,30}fail/i], 0.83],
  ['vuln/logic/reward-calculation',             [/reward.{0,30}calculat/i, /incorrect.{0,20}reward/i, /reward.{0,30}wrong/i, /reward.{0,30}inflat/i, /reward.{0,30}miscalcul/i], 0.82],
  ['vuln/logic/fee-calculation',                [/fee.{0,30}calculat/i, /incorrect.{0,20}fee/i, /fee.{0,30}wrong/i, /fee.{0,30}miscalcul/i, /fee.{0,30}bypass/i], 0.82],
  ['vuln/logic/incorrect-order-of-operations',  [/order.of.operations/i, /wrong.order/i, /incorrect.order/i, /operation.{0,20}order/i], 0.78],
  ['vuln/logic/wrong-condition',                [/wrong.condition/i, /incorrect.condition/i, /wrong.comparison/i, /flipped.condition/i, /inverted.check/i], 0.80],
  ['vuln/logic/missing-validation',             [/missing.{0,20}validat/i, /no.{0,20}validat/i, /lack.{0,20}validat/i, /without.{0,20}validat/i], 0.78],
  ['vuln/logic/incorrect-state-transition',     [/state.{0,20}transit/i, /wrong.state/i, /incorrect.state/i, /invalid.state/i], 0.78],

  ['vuln/pda/duplicate-mutable-accounts',       [/duplicate.{0,20}mutable/i, /duplicate.{0,20}account/i, /same.account.{0,30}twice/i, /aliasing/i], 0.88],
  ['vuln/pda/reinitialization',                 [/reinitiali[sz]/i, /re-initiali[sz]/i, /initiali[sz].{0,20}again/i, /initiali[sz].{0,20}twice/i], 0.88],
  ['vuln/pda/bump-canonicalization',            [/bump.{0,20}canonical/i, /canonical.{0,20}bump/i, /non.canonical.bump/i, /bump.seed/i], 0.88],
  ['vuln/pda/missing-seeds-check',              [/pda.{0,20}seed/i, /seed.{0,20}check/i, /missing.{0,20}seed/i, /wrong.{0,20}pda/i, /pda.{0,20}verif/i], 0.85],

  ['vuln/governance/timelock-bypass',           [/timelock.{0,20}bypass/i, /bypass.{0,20}timelock/i, /timelock.{0,20}circumvent/i], 0.90],
  ['vuln/governance/proposal-manipulation',     [/proposal.{0,20}manipul/i, /governance.{0,20}manipul/i, /manipul.{0,20}proposal/i], 0.85],
  ['vuln/governance/flash-loan-voting',         [/flash.loan.{0,30}vot/i, /vot.{0,30}flash.loan/i, /governance.{0,30}flash.loan/i], 0.90],

  ['vuln/bridge/missing-validation',            [/bridge.{0,30}missing.{0,20}validat/i, /bridge.{0,30}validat.{0,20}missing/i, /cross.chain.{0,30}validat/i], 0.83],
  ['vuln/bridge/replay',                        [/bridge.{0,20}replay/i, /replay.{0,20}attack/i, /message.{0,20}replay/i, /replay.{0,20}message/i], 0.87],
  ['vuln/bridge/message-spoofing',              [/message.{0,20}spoof/i, /spoof.{0,20}message/i, /forge.{0,20}message/i, /fake.{0,20}message/i, /craft.{0,30}message/i], 0.83],

  ['vuln/dos/init-constraint',                  [/init.{0,20}constraint/i, /already.{0,20}initiali[sz]/i, /initiali[sz].{0,20}constraint.{0,20}revert/i], 0.85],
  ['vuln/dos/frozen-funds',                     [/frozen.fund/i, /fund.{0,20}frozen/i, /fund.{0,20}lock/i, /permanently.lock/i, /permanently.frozen/i, /inaccessible.fund/i], 0.82],
  ['vuln/dos/griefing',                         [/griefing/i, /grief\b/i, /low.cost.{0,20}disrupt/i, /attacker.can.disrupt/i], 0.80],
  ['vuln/dos/unbounded-loop',                   [/unbounded.loop/i, /loop.{0,20}unbounded/i, /gas.{0,20}exhaust/i, /out.of.gas/i, /\boog\b/i, /loop.{0,30}array.{0,20}grow/i], 0.82],

  ['vuln/dependency/upgradeable-contract',      [/upgradeable.{0,20}contract/i, /upgrade.{0,20}malicious/i, /malicious.{0,20}upgrade/i, /proxy.{0,20}upgrade/i], 0.80],
  ['vuln/dependency/unchecked-return-value',    [/unchecked.{0,20}return/i, /return.{0,20}value.{0,20}not.check/i, /ignored.{0,20}return/i], 0.83],
  ['vuln/dependency/unsafe-external-call',      [/unsafe.{0,20}external.call/i, /external.call.{0,20}unsafe/i, /low.level.call/i], 0.78],

  // ── impact/ ──────────────────────────────────────────────────────────────────
  ['impact/mev/sandwich',                       [/sandwich/i, /sandwich.attack/i], 0.90],
  ['impact/mev/frontrun',                       [/front.run/i, /frontrun/i, /front-run/i], 0.88],
  ['impact/mev/backrun',                        [/back.run/i, /backrun/i, /back-run/i], 0.85],
  ['impact/privilege-escalation/ownership-transfer', [/ownership.{0,20}transfer/i, /transfer.{0,20}ownership/i, /steal.{0,20}ownership/i], 0.88],
  ['impact/privilege-escalation/admin-takeover', [/admin.{0,20}takeover/i, /take.{0,20}over.{0,20}admin/i, /become.{0,20}owner/i, /steal.{0,20}admin/i], 0.85],
  ['impact/privilege-escalation/role-bypass',   [/role.{0,20}bypass/i, /bypass.{0,20}role/i, /bypass.{0,20}access.control/i, /bypass.{0,20}permiss/i], 0.83],
  ['impact/data-corruption/accounting-error',   [/accounting.{0,20}error/i, /incorrect.{0,20}accounting/i, /balance.{0,20}wrong/i, /balance.{0,20}incorrect/i, /share.{0,20}miscalcul/i], 0.78],
  ['impact/data-corruption/price-manipulation', [/price.{0,20}manipul/i, /manipul.{0,20}price/i, /oracle.{0,20}manipul/i], 0.82],
  ['impact/data-corruption/state-manipulation', [/state.{0,20}manipul/i, /manipul.{0,20}state/i, /corrupt.{0,20}state/i], 0.78],
  ['impact/dos/permanent',                      [/permanent.{0,20}dos/i, /permanently.{0,20}disable/i, /permanent.{0,20}denial/i, /permanently.{0,20}broken/i], 0.83],
  ['impact/dos/selective',                      [/specific.{0,20}user.{0,20}dos/i, /target.{0,20}user.{0,20}dos/i, /selective.{0,20}dos/i], 0.80],
  ['impact/dos/temporary',                      [/temporary.{0,20}dos/i, /\bdos\b/i, /denial.of.service/i, /denial-of-service/i], 0.72],
  ['impact/loss-of-funds/locked-funds',         [/lock.{0,20}fund/i, /fund.{0,20}lock/i, /stuck.{0,20}fund/i, /fund.{0,20}stuck/i, /inaccessible/i, /irrecoverable/i], 0.82],
  ['impact/loss-of-funds/reward-theft',         [/steal.{0,20}reward/i, /reward.{0,20}stolen/i, /reward.{0,20}theft/i, /drain.{0,20}reward/i], 0.83],
  ['impact/loss-of-funds/fee-theft',            [/steal.{0,20}fee/i, /fee.{0,20}stolen/i, /fee.{0,20}theft/i, /drain.{0,20}fee/i], 0.83],
  ['impact/loss-of-funds/partial-drain',        [/partial.{0,20}drain/i, /partial.{0,20}loss/i, /some.fund.{0,20}lost/i], 0.75],
  ['impact/loss-of-funds/direct-drain',         [/drain.{0,20}fund/i, /fund.{0,20}drain/i, /steal.fund/i, /loss.of.fund/i, /direct.{0,20}drain/i, /drain.{0,20}pool/i, /drain.{0,20}vault/i, /steal.{0,30}token/i, /attacker.{0,30}withdraw/i], 0.80],

  // ── trigger/ ─────────────────────────────────────────────────────────────────
  ['trigger/reentrancy-callback',               [/fallback.{0,20}call/i, /callback.{0,20}reenter/i, /receive\(\).{0,30}reenter/i, /hook.{0,20}reenter/i], 0.85],
  ['trigger/sandwich-attack',                   [/sandwich/i, /sandwich.attack/i], 0.90],
  ['trigger/cross-chain-message',               [/cross.chain.message/i, /bridge.message/i, /cross.chain.{0,20}exploit/i], 0.85],
  ['trigger/governance-vote',                   [/governance.{0,20}vote/i, /pass.{0,20}proposal/i, /vote.{0,20}governance/i], 0.85],
  ['trigger/flash-loan',                        [/flash.loan/i, /flashloan/i, /flash-loan/i], 0.90],
  ['trigger/price-manipulation',                [/price.{0,20}manipul/i, /manipul.{0,20}price/i, /oracle.{0,20}manipul/i], 0.82],
  ['trigger/sequencer-down',                    [/sequencer.{0,20}down/i, /sequencer.{0,20}offline/i, /sequencer.{0,20}unavailable/i], 0.88],
  ['trigger/reorg',                             [/\breorg\b/i, /chain.reorg/i, /block.reorg/i, /reorganiz/i], 0.88],
  ['trigger/first-deposit',                     [/first.deposit/i, /first.{0,20}depositor/i, /empty.{0,20}pool/i, /empty.{0,20}vault/i], 0.82],
  ['trigger/low-liquidity',                     [/low.liquidity/i, /thin.{0,20}liquidity/i, /low.{0,20}tvl/i, /small.{0,20}pool/i], 0.80],
  ['trigger/specific-state',                    [/only.when/i, /specific.state/i, /certain.state/i, /only.after.{0,20}initiali/i], 0.72],
  ['trigger/privileged-tx',                     [/require.{0,20}admin/i, /require.{0,20}owner/i, /only.{0,20}privileged/i, /malicious.{0,20}admin/i, /malicious.{0,20}owner/i], 0.78],
  ['trigger/time-based/epoch-boundary',         [/epoch.boundary/i, /epoch.rollover/i, /end.of.epoch/i, /epoch.{0,20}exploit/i], 0.85],
  ['trigger/time-based/timelock-expiry',        [/timelock.{0,20}expir/i, /after.{0,20}timelock/i, /timelock.{0,20}elaps/i], 0.85],
  ['trigger/single-tx',                         [/single.transaction/i, /atomic.{0,20}exploit/i, /single.tx/i, /one.transaction/i], 0.78],
  ['trigger/multi-tx',                          [/multiple.transaction/i, /multi.tx/i, /multi.step/i, /across.{0,20}transaction/i], 0.78],

  // ── precondition/ ────────────────────────────────────────────────────────────
  ['precondition/insider',                      [/private.key/i, /insider/i, /off.chain.{0,20}knowledge/i, /admin.key/i], 0.80],
  ['precondition/mev-capable',                  [/\bmev\b/i, /mempool/i, /front.run.{0,20}requir/i, /block.builder/i], 0.78],
  ['precondition/governance-quorum-reachable',  [/governance.quorum/i, /quorum.{0,20}reach/i, /buy.{0,20}votes/i, /acquire.{0,20}voting.power/i], 0.83],
  ['precondition/specific-token-type',          [/fee.on.transfer/i, /rebas/i, /non.standard.token/i, /weird.{0,20}erc20/i, /token.{0,20}hook/i, /erc777/i, /deflationary.token/i], 0.83],
  ['precondition/uninitialized',                [/uninitiali[sz]ed/i, /not.{0,20}initiali[sz]ed/i, /before.{0,20}initiali[sz]/i], 0.82],
  ['precondition/time-locked',                  [/after.{0,20}timelock/i, /wait.{0,20}timelock/i, /timelock.{0,20}period/i], 0.78],
  ['precondition/specific-contract-state',      [/specific.{0,20}state/i, /contract.{0,20}state.{0,20}requir/i, /only.when.{0,20}paused/i], 0.72],
  ['precondition/low-liquidity',                [/low.liquidity/i, /thin.liquidity/i, /small.pool/i, /low.tvl/i], 0.78],
  ['precondition/privileged-caller',            [/only.{0,10}owner/i, /only.{0,10}admin/i, /require.{0,10}owner/i, /require.{0,10}admin/i, /privileged.{0,20}caller/i, /authorized.{0,20}caller/i], 0.78],
  ['precondition/flash-loan-available',         [/flash.loan/i, /flashloan/i], 0.82],
  ['precondition/large-capital',                [/large.{0,20}capital/i, /significant.{0,20}capital/i, /large.{0,20}amount/i, /large.{0,20}position/i], 0.75],

  // ── fix/ ─────────────────────────────────────────────────────────────────────
  ['fix/add-circuit-breaker',                   [/circuit.breaker/i, /price.deviation.check/i, /sanity.check.{0,20}price/i], 0.82],
  ['fix/add-snapshot',                          [/snapshot.{0,20}voting/i, /voting.{0,20}snapshot/i, /snapshot.{0,20}balance/i, /checkpoint.{0,20}vot/i], 0.83],
  ['fix/use-multi-oracle',                      [/multiple.oracle/i, /aggregat.{0,20}oracle/i, /fallback.{0,20}oracle/i, /twap.{0,20}oracle/i], 0.80],
  ['fix/use-twap',                              [/use.{0,20}twap/i, /twap.instead/i, /replace.{0,20}spot.{0,20}twap/i, /time.weighted/i], 0.82],
  ['fix/upgrade-dependency',                    [/upgrade.{0,20}depend/i, /update.{0,20}depend/i, /newer.{0,20}version/i, /patch.{0,20}depend/i], 0.75],
  ['fix/use-reentrancy-guard',                  [/reentrancy.guard/i, /nonreentrant/i, /checks.effects.interactions/i, /reentrancy.lock/i], 0.85],
  ['fix/fix-arithmetic',                        [/safe.math/i, /safemath/i, /overflow.check/i, /unchecked.{0,20}block/i, /use.{0,20}safe.{0,20}arithmet/i], 0.78],
  ['fix/add-access-control',                    [/add.{0,20}access.control/i, /add.{0,20}modifier/i, /add.{0,20}onlyowner/i, /add.{0,20}role.check/i, /add.{0,20}signer.check/i], 0.80],
  ['fix/redesign-logic',                        [/redesign/i, /architect.{0,20}change/i, /fundamental.{0,20}fix/i, /core.{0,20}logic.{0,20}fix/i], 0.72],
  ['fix/add-check',                             [/add.{0,20}check/i, /add.{0,20}validat/i, /add.{0,20}require/i, /add.{0,20}assert/i], 0.72],

  // ── novelty/ ─────────────────────────────────────────────────────────────────
  ['novelty/novel',                             [/novel.{0,20}attack/i, /new.{0,20}attack.vector/i, /previously.unknown/i, /first.{0,20}report/i], 0.70],
  ['novelty/variant',                           [/variant.of/i, /similar.to/i, /variation.of/i, /adapted.from/i], 0.70],

  // ── blast-radius/ ────────────────────────────────────────────────────────────
  ['blast-radius/cross-protocol',               [/cross.protocol/i, /composability/i, /integrated.protocol/i, /downstream.protocol/i, /affect.other.protocol/i], 0.80],
  ['blast-radius/protocol-wide',                [/all.user/i, /entire.protocol/i, /protocol.wide/i, /all.fund/i, /all.pool/i, /global.state/i, /drain.all/i], 0.78],
  ['blast-radius/single-pool',                  [/single.pool/i, /specific.pool/i, /one.pool/i, /single.vault/i, /one.vault/i], 0.75],
  ['blast-radius/single-user',                  [/single.user/i, /specific.user/i, /one.user/i, /target.user/i, /victim.user/i], 0.75],

  // ── misassumption/ ───────────────────────────────────────────────────────────
  ['misassumption/math-is-safe',                [/assumed.{0,20}safe.{0,20}math/i, /assume.{0,20}no.overflow/i, /assume.{0,20}precise/i], 0.72],
  ['misassumption/external-call-is-safe',       [/trusted.{0,20}external/i, /assume.{0,20}safe.call/i, /external.call.{0,20}trusted/i], 0.72],
  ['misassumption/sequencer-is-live',           [/sequencer.{0,20}assumed/i, /assume.{0,20}sequencer/i, /sequencer.{0,20}always.available/i], 0.80],
  ['misassumption/price-cannot-be-manipulated', [/price.{0,20}assumed.{0,20}stable/i, /assume.{0,20}price.{0,20}not.{0,20}manipul/i, /spot.price.{0,20}trusted/i], 0.78],
  ['misassumption/token-is-standard',           [/assume.{0,20}standard.token/i, /assume.{0,20}erc20/i, /non.standard.token.{0,20}not.{0,20}consider/i, /fee.on.transfer.{0,20}not.{0,20}consider/i], 0.78],
  ['misassumption/bridge-is-secure',            [/bridge.{0,20}assumed.{0,20}secure/i, /trust.{0,20}bridge/i, /bridge.{0,20}trusted/i], 0.75],
  ['misassumption/admin-is-honest',             [/admin.{0,20}assumed.{0,20}honest/i, /trusted.{0,20}admin/i, /admin.{0,20}trusted/i, /assume.{0,20}honest.{0,20}admin/i], 0.75],
  ['misassumption/oracle-is-reliable',          [/oracle.{0,20}trusted/i, /trust.{0,20}oracle/i, /oracle.{0,20}assumed.{0,20}reliable/i, /assume.{0,20}oracle.{0,20}correct/i], 0.78],
];

const KNOWN_PATTERNS = new Set([
  'vuln/reentrancy', 'vuln/arithmetic/overflow', 'vuln/arithmetic/underflow',
  'vuln/access-control/tx-origin', 'vuln/oracle/spot-price', 'vuln/oracle/stale-price',
  'vuln/dos/unbounded-loop', 'vuln/governance/flash-loan-voting',
]);

const TAXONOMY_AXES = ['vuln/', 'impact/', 'trigger/', 'precondition/', 'fix/', 'novelty/', 'blast-radius/', 'misassumption/'];

const TAG_ORDER = [
  'blockchain/', 'lang/', 'sdk/', 'sector/', 'platform/', 'has/', 'severity/',
  'vuln/', 'impact/', 'trigger/', 'precondition/', 'fix/',
  'novelty/', 'blast-radius/', 'misassumption/',
];

// ── Frontmatter helpers ───────────────────────────────────────────────────────

function readFm(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { fm: null, fmEnd: 0, body: content };
  return { fm: m[1], fmEnd: m[0].length, body: content.slice(m[0].length) };
}

function getTags(fm) {
  const m = fm.match(/^tags:\n((?:  - .+\n?)+)/m);
  if (!m) return [];
  return m[1].trim().split('\n').map(l => l.trim().slice(2));
}

function alreadyTagged(tags) {
  return tags.some(t => TAXONOMY_AXES.some(ax => t.startsWith(ax)));
}

function sortTags(tags) {
  return [...new Set(tags)].sort((a, b) => {
    const ra = TAG_ORDER.findIndex(p => a.startsWith(p));
    const rb = TAG_ORDER.findIndex(p => b.startsWith(p));
    const ia = ra === -1 ? TAG_ORDER.length : ra;
    const ib = rb === -1 ? TAG_ORDER.length : rb;
    return ia !== ib ? ia - ib : a.localeCompare(b);
  });
}

function writeTags(fpath, content, fm, fmEnd, newTags) {
  const tagBlockMatch = fm.match(/^tags:\n(?:  - .+\n?)+/m);
  if (!tagBlockMatch) return false;
  const existing = getTags(fm);
  const merged   = sortTags([...existing, ...newTags]);
  const newBlock = 'tags:\n' + merged.map(t => `  - ${t}`).join('\n') + '\n';
  const newFm    = fm.slice(0, tagBlockMatch.index) + newBlock + fm.slice(tagBlockMatch.index + tagBlockMatch[0].length);
  fs.writeFileSync(fpath, `---\n${newFm}---\n${content.slice(fmEnd)}`);
  return true;
}

// ── Classifier ────────────────────────────────────────────────────────────────

function classify(text) {
  const high = [], low = [];
  const seen = new Set();
  for (const [tag, patterns, conf] of RULES) {
    if (seen.has(tag)) continue;
    if (patterns.some(rx => rx.test(text))) {
      (conf >= 0.80 ? high : low).push([tag, conf]);
      seen.add(tag);
    }
  }
  // novelty fallback
  const hasNovelty = [...high, ...low].some(([t]) => t.startsWith('novelty/'));
  if (!hasNovelty) {
    const vulnTags = [...high, ...low].filter(([t]) => t.startsWith('vuln/')).map(([t]) => t);
    if (vulnTags.length) {
      const isKnown = vulnTags.some(vt => [...KNOWN_PATTERNS].some(kp => vt.startsWith(kp)));
      high.push([isKnown ? 'novelty/known-pattern' : 'novelty/variant', 0.70]);
    }
  }
  return high;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const args     = process.argv.slice(2);
const dryRun   = args.includes('--dry-run');
const only     = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const limitArg = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 0;

const dirs = [];
if (only !== 'hacks')    dirs.push(FINDINGS_DIR);
if (only !== 'findings') dirs.push(HACKS_DIR);

const files = dirs.flatMap(d => fs.readdirSync(d).filter(f => f.endsWith('.md')).sort().map(f => path.join(d, f)));
console.log(`Total files: ${files.length}`);

let written = 0, skipped = 0, count = 0;
const lowItems = [], noMatch = [];

for (const fpath of files) {
  if (limitArg && count >= limitArg) break;

  const content      = fs.readFileSync(fpath, 'utf8');
  const { fm, fmEnd } = readFm(content);
  if (!fm) { skipped++; continue; }

  const tags = getTags(fm);
  if (alreadyTagged(tags)) { skipped++; continue; }

  const snippet  = content.slice(fmEnd, fmEnd + 3000);
  const titleM   = snippet.match(/^#\s+(.+)$/m);
  const title    = titleM ? titleM[1] : path.basename(fpath, '.md');
  const text     = `${title}\n${snippet}`;
  const highTags = classify(text);
  count++;

  if (!highTags.length) {
    noMatch.push(path.basename(fpath));
    continue;
  }

  if (dryRun) {
    console.log(`\n[DRY] ${path.basename(fpath)}`);
    for (const [t, c] of highTags) console.log(`  +(${c.toFixed(2)}) ${t}`);
  } else {
    writeTags(fpath, content, fm, fmEnd, highTags.map(([t]) => t));
    written++;
  }

  if (count % 100 === 0) console.log(`  ${count} done, ${written} written...`);
}

console.log(`\n=== DONE ===`);
console.log(`Classified: ${count} | Written: ${written} | Skipped: ${skipped}`);

if (noMatch.length) {
  console.log(`\n=== NO MATCH (${noMatch.length} files) ===`);
  noMatch.slice(0, 30).forEach(f => console.log(`  ${f}`));
  if (noMatch.length > 30) console.log(`  ... and ${noMatch.length - 30} more`);
}
