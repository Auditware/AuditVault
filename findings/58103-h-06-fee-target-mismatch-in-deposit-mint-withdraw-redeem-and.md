---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-06] Fee target mismatch in `deposit`, `mint`, `withdraw`, `redeem` and `preview***` methods

- id: 58103
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report highlights a high severity issue in a code that calculates fees for depositing and withdrawing tokens. The bug can potentially cause double spending and disrupt calculations in the system. The likelihood of this bug occurring is medium, as it only affects non-exempt addresses set by the administrator.

The issue arises in the `previewDeposit()` and `previewMint()` functions, where the code checks for entry fees based on the `msg.sender` address. However, in the `_deposit()` function, the code uses the `_receiver` variable, which can be manipulated by the caller. This allows an attacker to use two addresses, one with exemption status and one without, to exploit the system and cause double spending.

Similar inconsistencies are found in the `previewWithdraw()` and `previewRedeem()` functions, where the code checks for exit fees based on the `exemptionList[]` but uses the `_owner` variable in the `_withdraw()` function. This can be exploited by an attacker who has approval over the `_owner`'s funds.

To fix this issue, it is recommended to calculate fees based on the `msg.sender` in the `_deposit()` function and to fix the `preview` functions accordingly. Similarly, in the `_withdraw()` function, fees should be calculated based on the `msg.sender` and the `preview` functions should be fixed. These changes will ensure consistency in fee calculations and prevent potential double spending and accounting errors.

## Details

## Severity

**Impact:** High, because it can cause double spending and disturb the pool calculations

**Likelihood:** Medium, because exception recipients are set by admin for common addresses

## Description

When users want to deposit their tokens, code calculates fee in `previewDeposit()` and `previewMint()` and add/subtract it from the amount/share. As you can see code checks entry fee based on `msg.sender`:

```solidity
    function previewDeposit(
        uint256 _amount
    ) public view returns (uint256 shares) {
        return convertToShares(_amount).subBp(exemptionList[msg.sender] ? 0 : fees.entry);
    }

    function previewMint(uint256 _shares) public view returns (uint256) {
        return convertToAssets(_shares).addBp(exemptionList[msg.sender] ? 0 : fees.entry);
    }
```

In `_deposit()`, code wants to account the fee and keep track of it, it perform this action:

```solidity
        if (!exemptionList[_receiver])
            claimableAssetFees += _amount.revBp(fees.entry);
```

As you can see it uses `_receiver` variable which is controllable by caller.

So attacker with two addresses: RECV1 address and has set as `exemptionList[]` can ADDERSS1 which doesn't set as `exemptionList[]` can call mint and deposit with ADDRESS1 and set recipient as RECV1 . In preview functions code doesn't add the fee for user deposit(or subtract it from shares) and code would assume user didn't pay any fee, but in the `_deposit()` function code would check RECV1 address and would add calculated fee to accumulated fee. So in the end user didn't paid the fee but code added fee and double spending would happen.

Attacker can use another scenarios to perform this issue too. (code calculates fee and caller pays it but code doesn't add it to `claimableAssetFees `)

---

When users want to withdraw their tokens, Code charges fee and it's done in preview functions by adding/subtracting fee from amount/share. As you can see code checks exit fee based on `exemptionList[]` and uses `msg.sender` as target:

```solidity
    function previewWithdraw(uint256 _assets) public view returns (uint256) {
        return convertToShares(_assets).addBp(exemptionList[msg.sender] ? 0 : fees.exit);
    }

    function previewRedeem(uint256 _shares) public view returns (uint256) {
        return convertToAssets(_shares).subBp(exemptionList[msg.sender] ? 0 : fees.exit);
    }
```

But in `_withdraw()` function when code wants to calculates fee and accumulated it, it uses `_owner`:

```solidity
        if (!exemptionList[_owner])
            claimableAssetFees += _amount.revBp(fees.exit);
```

`owner` can be different that caller(`msg.sender`) and code checks that caller have approval over the `owner`'s funds.
So attacker can exploit this with two of his address: OWNER1 which has set as `exemptionList[]` and OPERATOR1 which doesn't set as `exemptionList[]`. If attacker give approval of OWNER1 tokens to OPERATOR1 and calls `withdraw(OWNER1)` with OPERATOR1 address then double spend would happen. While code returns funds fully with no charged fee it would also add fee to `claimableAssetFees`.

This can be exploited in other scenarios too. In general this inconsistency would cause accountant errors.

## Recommendations

Calculate the fee based on `msg.sender` in the `_deposit()` function.
In `_withdraw()` function calculate fee based on `msg.sender` and finally fix the `preview` functions.
