---
tags:
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/token
  - platform/shieldify
  - has/github
  - severity/high
protocol: "[[Daoslive]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md"
genome:
  - "[[dos-resistance]]"
  - "[[locked-funds]]"
---
# [H-01] Swapped Tokens During `finalize()` Permanently Stuck in `DaosLive` Due to Missing Withdrawal Mechanism

- id: 57868
- impact: HIGH
- protocol: Daoslive
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/DaosLive-Security-Review.md

## Summary


This bug report highlights an issue where swapped tokens are permanently stuck in the `DaosLive.sol` contract due to the lack of a mechanism to retrieve them. This can have a high impact as the tokens become inaccessible forever. The recommendation is to implement a withdrawal or sweep function in the contract to retrieve these tokens, or to make the recipient parameter configurable. The team has fixed the issue.

## Details

## Severity

High Risk

## Description

When performing a token swap for `snipeAmount` in the `finalize()` function, using the `IUniRouter.exactInputSingle()` function in the following code snippet:

```solidity
IUniRouter uniRouter = IUniRouter(_factory.uniRouter());
uniRouter.exactInputSingle{value: snipeAmount}(
    IUniRouter.ExactInputSingleParams({
        tokenIn: wethAddr,
        tokenOut: token,
        fee: UNISWAP_V3_FEE,
        recipient: address(this), // swapped tokens sent here
        amountIn: snipeAmount,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    })
);
```

The `recipient` of the swapped tokens is set to `address(this)`, i.e., the `DaosLive.sol` contract. However, the contract lacks any function or mechanism to retrieve or forward these tokens, resulting in the swapped tokens being permanently stuck in the contract.

## Location of Affected Code

File: [contracts/DaosLive.sol#L314](https://github.com/ED3N-Ventures/daoslive-sc/blob/9a1856db2060b609a17b24aa72ab35f2cdf09031/contracts/DaosLive.sol#L314)

## Impact

Swapped tokens are locked and inaccessible forever.

## Recommendation

- Implement a **withdrawal** or **sweep** function in `DaosLive.sol` that allows an authorized address (e.g., owner or governance) to recover any ERC20 tokens held by the contract.
- Alternatively, consider making the `recipient` parameter configurable or passed in explicitly, allowing swapped tokens to be sent to a retrievable address.

## Team Response

Fixed.
