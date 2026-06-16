---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/lending
protocol: "[[Astera]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# RewardsController uses inconsistent scaling in handleAction and can lead to transfer DoS to/from

- id: 62276
- impact: HIGH
- protocol: [[Astera]]
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Astera-Spearbit-Security-Review-December-2024.pdf

## Summary


The report discusses a bug in the Minipool Market where users are unable to withdraw their funds due to an inaccurate calculation of rewards. The code snippet provided shows that the function `handleAction` uses `scaledTotalSupply` to calculate the difference between the shares of MLP aToken that are due to the minipool and what is actually held by the minipool. However, this leads to a denial of service for transfers from the ERC6909 market. The report recommends using `totalSupply` instead to keep units consistent. The bug has been fixed in a recent commit.

## Details

## Minipool Market

**Severity:** High Risk  
**Context:** RewardsController.sol#L139  

## Description

`RewardController.handleAction` has a special case to handle when a user is a minipool market:

### Code Snippet
```solidity
// RewardsController.sol#L134-L145
if (_isAtokenERC6909[user] == true) {
    (uint256 assetID,) = IAERC6909(user).getIdForUnderlying(IAToken(msg.sender).WRAPPER_ADDRESS());
    // For trancheATokens we calculate the total supply of the AERC6909 ID for the assetID.
    // We subtract the current balance.
    uint256 totalSupplyAsset = IAERC6909(user).scaledTotalSupply(assetID); // <<<
    uint256 diff = totalSupplyAsset - userBalance;
    _totalDiff[msg.sender] = _totalDiff[msg.sender] - lastReportedDiff[msg.sender][user] + diff;
    lastReportedDiff[msg.sender][user] = diff;
    userBalance = totalSupplyAsset;
}
```

We can see that the function fetches `scaledTotalSupply` in order to compute the difference between the shares of MLP aToken that are due to the minipool and what is actually held by the minipool. These "shares" which are not accounted for in `aToken.scaledTotalSupply` should be rewarded, and thus this is why `_totalDiff[msg.sender]` is computed and then added to totalSupply for updating the reward state:

### Code Snippet
```solidity
// RewardsController.sol#L146-L148
_updateUserRewardsPerAssetInternal(
    msg.sender,
    user,
    userBalance,
    totalSupply + _totalDiff[msg.sender] // <<<
);
```

Unfortunately, it is inaccurate to use `IAERC6909(user).scaledTotalSupply` in this context, since the total supply is scaled according to the minipool market index, while all other amounts are only scaled according to the main lending pool index. To showcase how it can lead to DOS of transfers from the ERC6909 market, we will use a simple example:

## Scenario

**Preconditions:**

| Params                     | Value     |
|----------------------------|-----------|
| asset                      | aWETH     |
| MLP liquidity index        | 1         |
| minipool liquidity index    | 1.05      |
| initial total supply       | 0         |

**Steps:**

- Alice mints 100 aWETH by depositing in the main lending pool.
- Alice deposits the 100 aWETH into minipool, and is minted 95.2 shares of aWETH6909. After this step, `aWETH6909.scaledTotalSupply` is 95.2e18.

### Alice's Attempt to Withdraw

Alice attempts to withdraw the 100 aWETH, but the following values are used in `RewardController.handleAction` during transfer:

### Code Snippet
```solidity
// IncentivizedERC20.sol#L191-L199
if (address(_getIncentivesController()) != address(0)) {
    uint256 currentTotalSupply = _totalSupply;
    _getIncentivesController().handleAction(sender, currentTotalSupply, oldSenderBalance); // <<<, !
    if (sender != recipient) {
        _getIncentivesController().handleAction(recipient, currentTotalSupply, oldRecipientBalance);
    }
}
```

| Params                     | Value     |
|----------------------------|-----------|
| sender                     | aWETH6909 |
| currentTotalSupply         | 100e18    |
| oldSenderBalance           | 100e18    |

This means `handleAction` will underflow (`scaledTotalSupply == 95.2e18`):

### Code Snippet
```solidity
// RewardsController.sol#L134-L145
if (_isAtokenERC6909[user] == true) {
    (uint256 assetID,) = IAERC6909(user).getIdForUnderlying(IAToken(msg.sender).WRAPPER_ADDRESS());
    // For trancheATokens we calculate the total supply of the AERC6909 ID for the assetID.
    // We subtract the current balance.
    uint256 totalSupplyAsset = IAERC6909(user).scaledTotalSupply(assetID);
    uint256 diff = totalSupplyAsset - userBalance; // <<<
    _totalDiff[msg.sender] = _totalDiff[msg.sender] - lastReportedDiff[msg.sender][user] + diff;
    lastReportedDiff[msg.sender][user] = diff;
    userBalance = totalSupplyAsset;
}
```

As a result, Alice is unable to withdraw her funds.

## Recommendation

We should use `totalSupply` to keep units consistent:

### Code Snippet
```solidity
// RewardsController.sol#L134-L145
if (_isAtokenERC6909[user] == true) {
    (uint256 assetID,) = IAERC6909(user).getIdForUnderlying(IAToken(msg.sender).WRAPPER_ADDRESS());
    // For trancheATokens we calculate the total supply of the AERC6909 ID for the assetID.
    // We subtract the current balance.
    uint256 totalSupplyAsset = IAERC6909(user).totalSupply(assetID);
    uint256 diff = totalSupplyAsset - userBalance;
    _totalDiff[msg.sender] = _totalDiff[msg.sender] - lastReportedDiff[msg.sender][user] + diff;
    lastReportedDiff[msg.sender][user] = diff;
    userBalance = totalSupplyAsset;
}
```

Note that it may seem a bit counterintuitive, because this total supply includes shares of the lending pool which are accrued as interest and have never been "minted" yet.

---

**Astera:** Fixed in commit 92f8ffaf.  
**Spearbit:** Fix verified.
