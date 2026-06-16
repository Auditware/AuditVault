---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
  - sector/token
protocol: "[[FairSide]]"
auditors:
  - "[[WATCHPUG]]"
report: "https://code4rena.com/reports/2021-11-fairside"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [H-02] `FSDVesting`: Claiming tributes should call FSD token's corresponding functions

- id: 42325
- impact: HIGH
- protocol: [[FairSide]]
- reporter: WatchPug (Code4rena)
- source: https://code4rena.com/reports/2021-11-fairside

## Summary


The bug report is about an issue with claiming staking and governance tributes for vested tokens. The `claimTribute()` and `claimGovernanceTribute()` functions are missing the necessary calls to the FSD token contract, causing accrued rewards to be taken from the beneficiary's vested tokens without replenishing them. The recommended mitigation steps suggest removing internal accounting for claimed tributes, as it is already performed in the FSD token contract. The issue has been confirmed by YunChe404 (FairSide).

## Details

_Submitted by hickuphh3, also found by leastwood_

#### Impact
The claiming of staking and governance tributes for the a beneficiary's vested tokens should be no different than other users / EOAs. However, the `claimTribute()` and `claimGovernanceTribute()` are missing the actual claiming calls to the corresponding functions of the FSD token contract. As a result, the accrued rewards are taken from the beneficiary's vested token while not claiming (replenishing) from the FSD token contract.

#### Recommended Mitigation Steps

In addition to what has been mentioned above, the internal accounting for claimedTribute states can be removed because they are already performed in the FSD token contract.

```jsx
// TODO: Remove _claimedTribute and _claimedGovernanceTribute mappings

/**
* @dev Allows claiming of staking tribute by `msg.sender` during their vesting period.
* It updates the claimed status of the vest against the tribute
* being claimed.
*
* Requirements:
* - claiming amount must not be 0.
*/
function claimTribute(uint256 num) external onlyBeneficiary {
    uint256 tribute = fsd.availableTribute(num);
    require(tribute != 0, "FSDVesting::claimTribute: No tribute to claim");
		fsd.claimTribute(num);
    fsd.safeTransfer(msg.sender, tribute);
    emit TributeClaimed(msg.sender, tribute);
}

/**
* @dev Allows claiming of governance tribute by `msg.sender` during their vesting period.
* It updates the claimed status of the vest against the tribute
* being claimed.
*
* Requirements:
* - claiming amount must not be 0.
*/
function claimGovernanceTribute(uint256 num) external onlyBeneficiary {
  uint256 tribute = fsd.availableGovernanceTribute(num);
  require(
    tribute != 0,
    "FSDVesting::claimGovernanceTribute: No governance tribute to claim"
  );
  fsd.claimGovernanceTribute(num);
  fsd.safeTransfer(msg.sender, tribute);
  emit GovernanceTributeClaimed(msg.sender, tribute);
}
```

**[YunChe404 (FairSide) confirmed](https://github.com/code-423n4/2021-11-fairside-findings/issues/28)**
