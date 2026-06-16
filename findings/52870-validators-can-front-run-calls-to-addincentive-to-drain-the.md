---
tags:
  - lang/solidity
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[Berachain]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf"
genome:
  - "[[proposal-manipulation]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# Validators can front run calls to addIncentive to drain the entire incentive allocation in return for validating a single block

- id: 52870
- impact: HIGH
- protocol: [[Berachain Pol]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Berachain-Pol-Spearbit-Security-Review-October-2024.pdf

## Summary


The report discusses a high-risk bug found in the BerachainRewardsVault contract. The addIncentive function, which allows anyone to allocate a certain amount of whitelisted incentive tokens to the contract, has a vulnerability that can be exploited by rogue validators. These attackers can manipulate the incentive rate and steal leftover tokens, potentially causing damage to the system. The report suggests a solution to this issue, but it is not a complete fix and should be tested before implementation. The bug has been fixed in the latest version of the contract.

## Details

Severity: High Risk
Context: BerachainRewardsVault.sol#L312
Description: addIncentive is a function that allows anyone to allocate any amount of whitelisted incentive tokens
to the BerachainRewardsVault contract to further incentivize validators for allocating BGT tokens to their vaults.
In the current version of the code, the function allows the caller to set the incentive rate (only bounded by MAX_-
INCENTIVE_RATE ) in case the amount of incentive tokens left in the contract is less than minIncentiveRate .
As seen in the issue "Validators can manipulate incentive rates to receive more incentives than intended", rogue
validators can set the incentiveRate as they wish to effectively steal leftover amounts. In this issue we will
describe an attack vector that uses the same vulnerability but may end up in greater damage.
Using the same parameters used in "Validators can manipulate incentive rates to receive more incentives than
intended", in case addIncentive is called when incentive.amountRemaining < minIncentiveRate for a specific
token (this can either happen during the first call or when the current rewards are consumed and need to be
refilled). In the normal case we assume that the caller is planning to load the contract with a considerably large
amount of tokens that will be consumed in accordance to his provided incentive rate.
Potential attackers can monitor the mem-pool and sandwich the call to addIncentive with two calls:
1. Before: call addIncentive with amount=101 (an amount slightly greater thanminIncentiveRate ) and incen-
tiveRate=MAX_INCENTIVE_RATE .
Now the victim's call of addIncentive(amount = 100,000 incentive tokens, incentiveRate = 100) is
processed, they expect it to set the incentive rate to 100, but it would not because of the "donation" just made
before, so line 329 won't be executed but the call will succeed. At this point incentive.amountRemaining is
100,101 incentive tokens.
if (amountRemaining <= minIncentiveRate && incentiveRate >= minIncentiveRate) {
incentive.incentiveRate = incentiveRate; // line 329
}
2. After: call distributeFor and potentially siphon the entire 100,101 incentive tokens for just a single validated
block since amount will be min(100101*1e18, 0.5 * 1e18 * 1e36 / 1e18) = 100,101 incentive tokens.
uint256 amount = FixedPointMathLib.mulDiv(bgtEmitted, incentive.incentiveRate, PRECISION);
uint256 amountRemaining = incentive.amountRemaining;
amount = FixedPointMathLib.min(amount, amountRemaining);
Recommendation: Providing a simple and hermetic solution to this issue is not an easy task. The issue stems
from the fact that setting the incentive rate can be done in a permission-less way and therefore can be manipulated.
While there can be a solution that will provide an efficient isolation for different callers of addIncentive , it will not
be a simple one, but it might be inspired by the design that's used in Drips Protocol. With that being said, together
with the Berachain team, we came up with a solution that is somewhat a compromise. Rather than completely
solving the issue, we change the code so that attackers will only be able to temporarily DoS specific calls to
addIncentive paying for each attack transaction slightly more than minIncentiveRate which will dis-incentivize
them to do so. Please consider adopting this amended version of addIncentive , notice that it will also solve
"Validators can manipulate incentive rates to receive more incentives than intended":
/// @inheritdoc IBerachainRewardsVault
function addIncentive(address token, uint256 amount, uint256 incentiveRate) external
onlyWhitelistedToken(token) {, !
if (incentiveRate > MAX_INCENTIVE_RATE) IncentiveRateTooHigh.selector.revertWith();
Incentive storage incentive = incentives[token];
(uint256 minIncentiveRate, uint256 incentiveRateStored, uint256 amountRemaining) =
(incentive.minIncentiveRate, incentive.incentiveRate, incentive.amountRemaining);
if (amount < minIncentiveRate) AmountLessThanMinIncentiveRate.selector.revertWith();
token.safeTransferFrom(msg.sender, address(this), amount);
incentive.amountRemaining = amountRemaining + amount;
// if its different, then caller is trying to change the incentive rate
// validate if change is possible if not revert to avoid front running of caller call
if (incentiveRate != incentiveRateStored){
// Allow to reset incentive rate if amountRemaining < minIncentiveRate
if (amountRemaining == 0 && incentiveRate >= minIncentiveRate) {
incentive.incentiveRate = incentiveRate;
}
// if reset not possible, caller trying to increase the rate, validate if possible
else if (incentiveRate >= incentiveRateStored) {
uint256 rateDelta;
unchecked {
rateDelta = incentiveRate - incentiveRateStored;
}
if (amount >= FixedPointMathLib.mulDiv(amountRemaining, rateDelta, incentiveRateStored)) {
incentive.incentiveRate = incentiveRate;
} else {
revert();
}
}
else{
// This will break the POC as front run tx will increase ` amountRemaining ` just more than
` minIncentiveRate `, !
// also they will set the ` incentiveRateStored ` to max so both condition will fail and you
revert, !
revert();
}
}
emit IncentiveAdded(token, msg.sender, amount, incentive.incentiveRate);
}
Please note that the provided code is experimental and should be tested and as explained above is a practical
compromise and not a holistic solution.
Berachain: Fixed in commit 534a0eba.
Spearbit: Fixed by making addIncentive permissioned. Only managers that were defined by the factory owner
are allowed to call addIncentive . This will prevent any ability to front run this function.
