---
tags:
  - lang/solidity
  - sector/token
  - platform/shieldify
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Harmonix Finance]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-TokenSale-Hyperliquid-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
  - "[[treasury-multisig]]"
---
# [H-02] The `finalizeSettlement()` Can Be Dossed Leading to Refund Failures

- id: 63977
- impact: HIGH
- protocol: Harmonixfinance Tokensale Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-TokenSale-Hyperliquid-Security-Review.md

## Summary


This bug report discusses a high-risk issue in the code of a token sale contract. The team had recently made a fix where all tokens purchased would be sent to a treasury address and then transferred to the contract before calling the `finalizeSettlement()` function. However, there is a vulnerability that allows anyone to potentially disrupt the `finalizeSettlement()` function, preventing users from claiming their refunds. This is because the code has a strict check that can be manipulated by an attacker. The affected code is located in the `HarTokenSale.sol` file. The impact of this bug is that the settlements cannot be finalized, leading to refund failures. The team has recommended changing the strict equality check to prevent this issue. The team has responded that they have fixed the bug.

## Details


## Severity

High Risk

## Description

In the fix, the team added `treasury` address and during purchase, all the token goes to the treasury and then later the tokens will be transferred from the treasury to the contract before they call the `finalizeSettlement()` as per the current design to ensure the users get the refunds accordingly.

However, anyone can DoS the `finalizeSettlement()` forever because of the strict check:

```solidity
require(curBalance + safetyBuffer == totalRefund, "Settlement: total refund not matched");
```

The `curBalance` is taken as the contract balance, which can be increased by anyone by directly transferring the `purchaseToken` to the contract.

An attacker can simply:

- Monitor the mempool for the finalizeSettlement() transaction
- Front-run it by sending any amount of purchaseToken > 1000 wei directly to the contract
- This makes curBalance > totalRefund - safetyBuffer
- The equality check fails, reverting the transaction

Thus, DoS-ing the transaction forever and thus users can't ever claim their refunds.

## Location of Affected Code

File: [contracts/token_sales/HarTokenSale.sol#L186-L195](https://github.com/harmonixfi/core-contracts/blob/979b550c812157b8831d5d9b19f68df9a2892a41/contracts/token_sales/HarTokenSale.sol#L186-L195)

```solidity
function finalizeSettlement() external onlyOwner {
    require(block.timestamp >= saleConfig.settleTime, "Settlement: too early");
    require(!settlementFinalized, "Settlement: finalized");

    _finalizeSettlement();
    uint256 curBalance = purchaseToken.balanceOf(address(this));
    uint256 safetyBuffer = 1000;
    uint256 totalRefund = totalCommitted - totalAccepted;
    require(curBalance + safetyBuffer == totalRefund, "Settlement: total refund not matched");
}
```

## Impact

settlements can't be finalised, leading to refund failures

## Recommendation

Change the strict equality :

```diff
- require(curBalance == totalRefund + safetyBuffer, "Settlement: insufficient balance");
+ require(curBalance >= totalRefund + safetyBuffer, "Settlement: insufficient balance");
```

## Team Response

Fixed.
