---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/fee-calculation
  - vuln/logic/reward-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Livepeer]]"
auditors:
  - "[[VAD37]]"
report: "https://code4rena.com/reports/2023-08-livepeer"
genome:
  - "[[underflow]]"
  - "[[fee-calculation]]"
  - "[[reward-calculation]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
  - "[[vote-delegation-loop]]"
---
# [H-01] Underflow in `updateTranscoderWithFees` can cause corrupted data and loss of winning tickets

- id: 27047
- impact: HIGH
- protocol: [[Livepeer]]
- reporter: VAD37 (Code4rena)
- source: https://code4rena.com/reports/2023-08-livepeer

## Summary


A bug was found in the `updateTranscoderWtihFees` function of the Livepeer Protocol. MathUtils was used instead of PreciseMathUtils to calculate `treasuryRewards` which can cause an underflow. This underflow can cause accounting errors, unexpected behaviours, and can lead to a loss of winning tickets. 

The `treasuryRewardCutRate` is set with the `setTreasuryRewardCutRate()` function, which calls the internal function `_setTreasuryRewardCutRate()`. This function checks if the value is a valid `PreciseMathUtils` percentage. The `PreciseMathUtils` uses a `PREC_DIVISOR` of `10**27`. However, `MathUtils` uses a `PREC_DIVISOR` of `1000000` instead. This leads to the `treasuryRewards` value being bigger than expected.

The `updateTranscoderWithFees` is called every time a winning ticket is redeemed. Whenever the transcoder has skipped the previous round reward call, this function has to re-calculate the rewards. This re-calculation will always fail due to the underflow.

The bug can be mitigated by using `PreciseMathLib` instead of `MathLib` in the `updateTranscoderWithFees` function. This bug was confirmed by Livepeer and a fix was implemented in the form of a pull request.

## Details


`updateTranscoderWtihFees` can underflow because MathUtils is used instead of PreciseMathUtils.

### Proof of Concept

According to [LIP-92](https://github.com/livepeer/LIPs/blob/master/LIPs/LIP-92.md) the initial `treasuryRewardCutRate` will be set to `10%`.

`treasuryRewardCutRate` is set with the `setTreasuryRewardCutRate()`function, which calls the internal function `_setTreasuryRewardCutRate()`.

```javascript
file: 2023-08-livepeer/contracts/bonding/BondingManager.sol

function _setTreasuryRewardCutRate(uint256 _cutRate) internal {
        require(PreciseMathUtils.validPerc(_cutRate), "_cutRate is invalid precise percentage");
```

In this function the value will be checked if it's a valid `PreciseMathUtils` percentage (<`100%` specified with 27-digits precision):

```javascript
file: 2023-08-livepeer/contracts/libraries/PreciseMathUtils.sol
library PreciseMathUtils {
// ...
    // Divisor used for representing percentages
    uint256 public constant PERC_DIVISOR = 10**27;
	function validPerc(uint256 _amount) internal pure returns (bool) {
        return _amount <= PERC_DIVISOR;
    }
// ...
```

However, in `updateTranscoderWithFees`, to calculate `treasuryRewards`, `MathUtils` is used instead of `PreciseMathUtils`.

```javascript
file: 2023-08-livepeer/contracts/bonding/BondingManager.sol

function updateTranscoderWithFees(
        address _transcoder,
        uint256 _fees,
        uint256 _round
    ) external whenSystemNotPaused onlyTicketBroker {
// ...
uint256 treasuryRewards = MathUtils.percOf(rewards, treasuryRewardCutRate);
rewards = rewards.sub(treasuryRewards);
// ...
}
```

`MathUtils` uses a `PREC_DIVISOR` of `1000000` instead of `10 ** 27` from the `PreciseMathUtils`:

```javascript
file: 2023-08-livepeer/contracts/libraries/MathUtils.sol
library MathUtils {
// ...
    uint256 public constant PERC_DIVISOR = 1000000;
// ...
```

This leads to `treasuryRewards` value being bigger than expected. Here is a [gist of the POC](https://gist.github.com/bronzepickaxe/60063c47c327a1f2d4ee3dbd6361049b). Running the POC it shows that the current usage of `MathUtils` when calculating `treasuryRewards` will always cause an underflow in the next line of code.

`updateTranscoderWithFees` is called every time a winning ticket is redeemed. Whenever the transcoder has skipped the previous round reward call, this function has to re-calculate the rewards, as documented in [LIP-92](https://github.com/livepeer/LIPs/blob/master/LIPs/LIP-92.md?plain=1#L130). This re-calculation will always fail due to the underflow shown above.

### Impact

This will lead to accounting errors, unexpected behaviours and can cause a loss of winning tickets.

Firstly, the accounting errors and unexpected behaviours: these are all the storage values getting updated in `updateTranscoderWithFees`:

```javascript
file: 2023-08-livepeer/contracts/bonding/BondingManager.sol

function updateTranscoderWithFees( address _transcoder,
        uint256 _fees,
        uint256 _round
    ) external whenSystemNotPaused onlyTicketBroker {
// ...
// transcoder & earningsPool.data
L314: Transcoder storage t = transcoders[_transcoder];
L321: EarningsPool.Data storage earningsPool = t.earningsPoolPerRound[currentRound];

//accounting updates happen here
L377: t.cumulativeFees = t.cumulativeFees.add(transcoderRewardStakeFees)
	  .add(transcoderCommissionFees);
L382: earningsPool.updateCumulativeFeeFactor(prevEarningsPool,delegatorsFees);
L384: t.lastFeeRound = currentRound;
```

*   Let `currentRound() - 1` be the previous round where the transcoder skipped the reward call
*   Let `currentRound()` be current round
*   Let `currentRound() + 1` be the next round

During `currentRound()` it won't be possible to update the `Transcoder` storage or `earningsPool.data` storage because of the underflow that will happen because `currentRound() - 1` reward call has been skipped by the transcoder.

During `currentRound() + 1` it will be possible to call `updateTranscoderWithFees`, however, L382 will only update the `prevEarningsPool`, which in this case will be `currentRound()`, not `currentRound - 1`. Therefor, the `EarningsPool.data.cumulativeRewardFactor` won't be updated for `currentRound() - 1`.

Lastly, the validity of a ticket is two rounds as per the [specs](https://github.com/livepeer/wiki/blob/master/spec/streamflow/pm.md?plain=1#L107). This means that a transcoder that receives a winning ticket in `currentRound() - 1` should be able to redeem it in `currentRound() - 1` and `currentRound()`. However, a transcoder that receives a winning ticket in `currentRound() - 1` wont be able to redeem it in `currentRound()` because of the underflow that happens while redeeming a winning ticket in `currentRound()`. The transcoder wont be able to redeem it after `currentRound + 1..N` because the ticket will be expired.

### Recommended Mitigation Steps

Use `PreciseMathLib` instead of `MathLib`:

```javascript
file: 2023-08-livepeer/contracts/bonding/BondingManager.sol

L355: 
- uint256 treasuryRewards = MathUtils.percOf(rewards, treasuryRewardCutRate);
+ uint256 treasuryRewards = PreciseMathUtils.percOf(rewards, treasuryRewardCutRate);
```

### Assessed type

Library

**[victorges (Livepeer) commented](https://github.com/code-423n4/2023-08-livepeer-findings/issues/165#issuecomment-1714255659):**
 > Can confirm this issue!

**[victorges (Livepeer) mitigated](https://github.com/code-423n4/2023-08-livepeer-findings/issues/165):**
 > https://github.com/livepeer/protocol/pull/624



***
