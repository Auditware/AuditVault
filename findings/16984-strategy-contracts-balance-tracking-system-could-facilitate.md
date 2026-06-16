---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/stable
  - sector/vault
protocol: "[[Yield Basis]]"
auditors:
  - "[[Natalie Chin]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# Strategy contract’s balance-tracking system could facilitate theft

- id: 16984
- impact: HIGH
- protocol: [[Yield V2]]
- reporter: Natalie Chin (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/YieldV2.pdf

## Summary


This bug report is about a configuration issue in a Strategy contract, which inherits from the ERC20Rewards contract. The ERC20Rewards contract defines a reward token and a reward distribution schedule. An admin must send reward tokens to the Strategy contract to fund its reward payouts. The bug is that if the base token is used as the reward token, the contract's base token balance will be inflated to include the reward token balance, which can lead to users receiving more base tokens than they should when burning strategy tokens. 

To address this bug, short term recommendations are to add checks to verify that the reward token is not set to the base token, liquidity token, fyToken, or strategy token. Long term recommendations are to analyze all token interactions in the contract to ensure they do not introduce unexpected behavior into the system.

## Details

## Diﬃculty: High

## Type: Conﬁguration

## Description

Strategy contract functions use the contract’s balance to determine how many liquidity or base tokens to provide to a user minting or burning tokens. The Strategy contract inherits from the ERC20Rewards contract, which defines a reward token and a reward distribution schedule. An admin must send reward tokens to the Strategy contract to fund its reward payouts. This flow relies on an underlying assumption that the reward token will be different from the base token.

```solidity
/// @dev Set a rewards token.
/// @notice Careful, this can only be done once.
function setRewardsToken(IERC20 rewardsToken_)
external
auth
{
    require(rewardsToken == IERC20(address(0)), "Rewards token already set");
    rewardsToken = rewardsToken_;
    emit RewardsTokenSet(rewardsToken_);
}
```
*Figure 10.1: yield-utils-v2/contracts/token/ERC20Rewards.sol#L58-L67*

The `burnForBase()` function tracks the Strategy contract’s base token balance. If the base token is used as the reward token, the contract’s base token balance will be inflated to include the reward token balance (and the balance tracked by the function will be incorrect). As a result, when attempting to burn strategy tokens, a user may receive more base tokens than he or she deserves for the number of strategy tokens being burned:

```solidity
/// @dev Burn strategy tokens to withdraw base tokens. It can be called only when a pool is not selected.
/// @notice The strategy tokens that the user burns need to have been transferred previously, using a batchable router.
function burnForBase(address to)
external
poolNotSelected
returns (uint256 withdrawal)
{
    // strategy * burnt/supply = withdrawal
    uint256 burnt = _balanceOf[address(this)];
    withdrawal = base.balanceOf(address(this)) * burnt / _totalSupply;
    _burn(address(this), burnt);
    base.safeTransfer(to, withdrawal);
}
```
*Figure 10.2: strategy-v2/contracts/Strategy.sol#L258-L271*

## Exploit Scenario

Bob deploys the Strategy contract; DAI is set as a base token of that contract and is also defined as the reward token in the ERC20Rewards contract. After a pool has officially been closed, Eve uses `burnWithBase()` to swap base tokens for strategy tokens. Because the calculation takes into account the base token’s balance, she receives more base tokens than she should.

## Recommendations

**Short term:** Add checks to verify that the reward token is not set to the base token, liquidity token, fyToken, or strategy token. These checks will ensure that users cannot leverage contract balances that include reward token balances to turn a profit.

**Long term:** Analyze all token interactions in the contract to ensure they do not introduce unexpected behavior into the system.
