---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Cod3x]]"
auditors:
  - "[[Saw-mon and Natalie]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# RewardsController uses inconsistent scaling in handleAction and can lead to transfer DoS to/from Minipool Market

- id: 49175
- impact: HIGH
- protocol: [[Cod3x]] lend
- reporter: Saw-mon and Natalie (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Cod3x-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report is about a problem found in a code called "minipool market". The severity of this bug is considered high risk, meaning it could cause significant issues. The code affected is called "RewardsController.sol" and the specific line where the bug can be found is L139. The function responsible for this bug is called "RewardController.handleAction" and it has a special case to handle when the user is a part of the minipool market.

The bug is caused by using the function "fetchesscaledTotalSupply" which calculates the difference between the shares of the minipool market and what is actually held by the minipool. This difference should be rewarded, but the function used to calculate it is not accurate in this context. This can lead to a denial of service (DOS) attack on transfers from the ERC6909 market.

To demonstrate this bug, a simple example is provided where a user named Alice deposits 100 aWETH (a type of cryptocurrency) into the minipool market and is given 95.2 shares. When she tries to withdraw her funds, the function used to calculate the difference between her shares and the total supply underflows, causing her to be unable to withdraw her funds.

The recommendation to fix this bug is to use a different function called "totalSupply" to keep the units consistent. This function includes shares of the lending pool that have not been minted yet, which may seem counterintuitive but will fix the bug. This bug has been fixed in a commit called 92f8ffaf and has been verified by a user named Spearbit.

## Details

**Severity:** High Risk  
**Context:** `RewardsController.sol#L139`  

## Description
`RewardController.handleAction` has a special case to handle the case when the user is a minipool market:

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

We can see that the function fetches `scaledTotalSupply` in order to compute the difference between the shares of MLP aToken which are due to the minipool and what is actually held by the minipool. These "shares" which are not accounted for in `aToken.scaledTotalSupply` should be rewarded, and thus this is why `_totalDiff[msg.sender]` is computed and then added to totalSupply for updating reward state:

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

| Params                | Value           |
|-----------------------|-----------------|
| asset                 | aWETH           |
| MLP liquidity index    | 1               |
| minipool liquidity index| 1.05            |
| initial total supply    | 0               |

**Steps:**
- Alice mints 100 aWETH by depositing in the main lending pool.
- Alice deposits the 100 aWETH into the minipool, and is minted 95.2 shares of aWETH6909. After this step, `aWETH6909.scaledTotalSupply` is `95.2e18`.

Alice attempts to withdraw the 100 aWETH, but the following values are used in `RewardController.handleAction` during transfer:

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

| Params                | Value          |
|-----------------------|----------------|
| sender                | aWETH6909      |
| currentTotalSupply    | 100e18         |
| oldSenderBalance      | 100e18         |

Which means `handleAction` will underflow (scaledTotalSupply == 95.2e18):

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

Alice is unable to withdraw her funds.

## Recommendation
We should use `totalSupply` to keep units consistent:

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

Note that it may seem a bit counterintuitive, because this total supply includes shares of the lending pool which are accrued as interest, and have never been "minted" yet.

**Cod3x:** Fixed in commit `92f8ffaf`.  
**Spearbit:** Fix verified.
