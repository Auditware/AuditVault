---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/vault
protocol: "[[USDi]]"
auditors:
  - George Kobakhidze
report: "https://diligence.consensys.io/audits/2025/04/usdi/"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Incorrect Fee Handling During Withdrawals ✓ Fixed

- id: 55383
- impact: HIGH
- protocol: USDi
- reporter: George Kobakhidze (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/04/usdi/

## Summary


The report describes a bug in a code that is used to generate fees for a contract. The bug occurs when the fee is calculated and deducted in the `withdraw()` function. The fee is supposed to be collected in the form of `backingToken`, but the calculation is done using `USDi` before it is converted. This results in the fee being denominated in `USDi` instead of `backingToken`. To fix this, the fee calculation should be moved to occur after the `USDi` amount has been converted into `backingToken` amount.

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

In the `1ae396b8da0f15367703764e3071e8cdffd926a5` commit for fix review the finding has been fixed by applying the fee logic after `amount` is converted to `backingAmount` in `backingToken` units.

#### Description

As a way to generate fees, the contract deducts a portion of the user’s deposit or withdrawal during processing. This behavior is evident in the use of the `getFee()` function and subsequent `backingToken` transfers, such as `backingToken.safeTransfer(treasury, fee)`. The fee is intended to be collected in the form of the `backingToken`.

In the `deposit()` function, the fee is correctly calculated as a fraction of the user-supplied `amount` (in `backingToken`) and transferred to the treasury. However, in the `withdraw()` function, the same logic is incorrectly applied. Specifically, the fee is calculated based on the `amount` of `USDi` being burned-before conversion to `backingToken`.

This results in the fee being denominated in `USDi`, while the actual fee transfer is performed using `backingToken`. Since the `amount` has not yet been converted to `backingToken`, the fee calculation occurs in the wrong unit. The fee logic should instead be applied after the `USDi` amount is converted to `backingToken` to ensure the correct token denomination and fee value.

See the related code:

**contracts/USDiCoin.sol:L472-L484**

```
function withdraw(uint256 amount) external nonReentrant whenNotPaused {
    _requireWhitelisted(msg.sender);
    _requireBackingTokenPegInRange();

    require(amount > 0, "Amount must be greater than 0");
    require(balanceOf(msg.sender) >= amount, "Insufficient balance");

    // Compute fee, ensure min
    uint256 fee = getFee(amount, false);
    if (fee < minimumFee) {
        fee = minimumFee;
    }
    uint256 netAmount = amount - fee;

```

#### Recommendation

We recommend moving the fee calculation in the `withdraw()` function to occur **after** the `USDi` amount has been converted into its equivalent `backingToken` amount. This ensures that the fee is properly calculated and deducted in the correct units.
