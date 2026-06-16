---
tags:
  - lang/solidity
  - sector/gaming
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Majority Protocol]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# `DepositManager::getRewards` always includes `REFERRER_FEE` resulting in 2 percent of every games' rewards not being distributed to winners when there were no referrers

- id: 65376
- impact: HIGH
- protocol: [[Majority Protocol]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-01-27-cyfrin-majority-protocol-v2.0.md

## Summary


This bug report is about a function called `getRewards` in the DepositManager contract. The function is used to calculate the rewards for a game, but it always includes a fee called `REFERRER_FEE` in the calculation. This means that if there are no referral rewards for a game, the rewards will be less than they should be. This results in 2% of the rewards being stuck in the contract and unable to be paid out to game winners or retrieved by the sponsor. To fix this, the report recommends changing the way the referral rewards are handled and introducing a new role called `CLAIMER_ROLE` to collect these fees. This bug has been fixed in a recent update, but there is still a possibility for it to occur if certain steps are not taken. 

## Details

**Description:** `DepositManager::getRewards` always includes `REFERRER_FEE` when calculating the percentage of `totalCollectedAmount` available to distribute to winners:
```solidity
function getRewards(uint256 gameId) public view returns (uint256) {
    return gamePools[gameId].totalCollectedAmount
        * (BASIS_POINTS - (gamePools[gameId].creatorFee + gamePools[gameId].protocolFee + REFERRER_FEE)) / BASIS_POINTS;
}
```

**Impact:** If no referral rewards were accrued for a game, this calculation results in the game rewards being less than they should since the `REFERRER_FEE` basis points are still used to deduct from the `totalCollectedAmount`.

The missing 2% of rewards are permanently stuck in the contract unable to be paid out to game winners or retrieved by the sponsor.

**Recommended Mitigation:** Rather than using `REFERRER_FEE`, change `DepositManager::_payEntryFee, _refundEntryFee` to increment/decrement the total amount of referral rewards in a new storage variable.

Then in `DepositManager::getRewards` deduct the total amount of referral rewards from `gamePools[gameId].totalCollectedAmount`.

**Majority Games:**
Fixed in commit [e090f2e](https://github.com/Engage-Protocol/engage-protocol/commit/e090f2e1b5f42eb212fdbda7be94ccf295281075) by introducing a `CLAIMER_ROLE` which can collect referral fees assigned to `address(0)`, such that referral fees are always collected. `Registry::setReferrer` has been modified to prevent an address having `CLAIMER_ROLE` from becoming a referrer since then they couldn't collect fees associated with their address.

**Cyfrin:** Verified. We note that `AccessControl::grantRole` has not been overridden such that a referrer could be granted `CLAIMER_ROLE` which would prevent them from claiming referrals associated with their address.
