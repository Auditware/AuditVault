---
tags:
  - lang/solidity
  - sector/governance
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/rounding-direction
  - impact/loss-of-funds/reward-theft
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[cergyk]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[rounding-direction]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [H-43] Accounted balance of GlpStrategy does not match withdrawable balance, allowing for attackers to steal unclaimed rewards

- id: 27533
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: cergyk (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


A bug has been identified in the Yieldbox strategies that allows attackers to steal unclaimed rewards due to insufficient accounting. This is due to the total underlying balance of the strategy being obtained via `asset.strategy.currentBalance` and `GlpStrategy._currentBalance` not properly tracking all unclaimed rewards. As a result, attackers can deposit a high amount when there are unclaimed rewards and receive a higher amount of shares than they would if accounting included unclaimed rewards. They can then withdraw all shares and receive a proportion of the unclaimed rewards. To mitigate this issue, it is recommended that `_currentBalance` include some logic to retrieve the amount and value of unclaimed rewards to be included in it's return value.

## Details


Attackers can steal unclaimed rewards due to insufficient accounting.

### Proof of Concept

Pricing of shares for Yieldbox strategies is dependent upon the total underlying balance of the strategy. We can see below how we mint an amount of shares according to this underlying amount.

```solidity
// depositAsset()
uint256 totalAmount = _tokenBalanceOf(asset);
if (share == 0) {
	// value of the share may be lower than the amount due to rounding, that's ok
	share = amount._toShares(totalSupply[assetId], totalAmount, false);
} else {
	// amount may be lower than the value of share due to rounding, in that case, add 1 to amount (Always round up)
	amount = share._toAmount(totalSupply[assetId], totalAmount, true);
}

_mint(to, assetId, share);
```

The total underlying balance of the strategy is obtained via `asset.strategy.currentBalance`.

```solidity
function _tokenBalanceOf(Asset storage asset) internal view returns (uint256 amount) {
	return asset.strategy.currentBalance();
}
```

`GlpStrategy._currentBalance` does not properly track all unclaimed rewards.

```solidity
function _currentBalance() internal view override returns (uint256 amount) {
	// This _should_ included both free and "reserved" GLP:
	amount = IERC20(contractAddress).balanceOf(address(this));
}
```

As a result, attackers can:

*   Deposit a high amount when there are unclaimed rewards
    *   Receiving a higher amount of shares than they would if accounting included unclaimed rewards
    *   Harvests unclaimed rewards, increasing `_currentBalance`, only after they received shares
*   Withdraw all shares
    *   Now that the balance is updated to include previously unclaimed rewards, the attacker profits their relative share of the unclaimed rewards
        *   The more the attacker deposits relative to the strategy balance, the greater proportion of interest they receive

### Recommended Mitigation Steps

It's recommended that `_currentBalance` include some logic to retrieve the amount and value of unclaimed rewards to be included in it's return value.



**[cryptolyndon (Tapioca confirmed)](https://github.com/code-423n4/2023-07-tapioca-findings/issues/932#issuecomment-1678481117)**

***
