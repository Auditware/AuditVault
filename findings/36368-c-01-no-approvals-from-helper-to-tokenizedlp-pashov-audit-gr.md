---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Radiant]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-June.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# [C-01] No approvals from Helper to TokenizedLP

- id: 36368
- impact: HIGH
- protocol: [[Radiant June]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Radiant-security-review-June.md

## Summary


This is a bug report for a problem with the money flow in a code called LockZap. The severity and impact of this bug are high, meaning it could have a significant negative impact. The likelihood of this bug occurring is also high. 

The issue is that the money flow is supposed to go through two specific functions, but it is not working properly. The first function, `UniV3PoolHelper.zapETH()`, or the second function, `UniV3PoolHelper.zapTokens()`, should deposit tokens to `UniV3TokenizedLp.deposit()`, but this is not happening. Instead, the code is trying to transfer tokens from `UniV3PoolHelper.zapETH()` to `UniV3TokenizedLp` without first giving the necessary approvals. This causes the entire process to fail and the money flow to be reverted.

To fix this bug, the team working on LockZap should consider giving approvals from `UniV3PoolHelper` to `UniV3TokenizedLp` to ensure a smooth money flow.

## Details

**Severity**

**Impact:** High

**Likelihood:** High

**Description**

The money flow goes through LockZap to `UniV3PoolHelper.zapETH()` or to `UniV3PoolHelper.zapTokens()`. But later tokens should be deposited to `UniV3TokenizedLp.deposit()`.

```solidity
	function zapWETH(uint256 amount) public onlyLockZap returns (uint256 liquidity) {
		IERC20(weth9Addr).safeTransferFrom(msg.sender, address(this), amount);
		uint256 token0Amt = token0 == weth9Addr ? amount : 0;
		uint256 token1Amt = token1 == weth9Addr ? amount : 0;
		liquidity = tokenizedLpToken.deposit(token0Amt, token1Amt, msg.sender);
	}
```

`UniV3TokenizedLp` takes tokens from `UniV3PoolHelper.zapETH()` via `trasnferFrom()` which required approvals given. But `UniV3PoolHelper` does not approve tokens, so the whole money flow will be reverted.

**Recommendations**

Consider giving approvals from `UniV3PoolHelper` to `UniV3TokenizedLp`.
