---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/lending
protocol: "[[Bonzo Finance]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/bonzo/finance-contracts"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Incorrect asset handling during executeBorrow
- impact: HIGH
- protocol: Finance Contracts
- reporter: Halborn
- source: https://www.halborn.com/audits/bonzo/finance-contracts

## Summary


This bug report describes a potential issue in the `_executeBorrow` function of the `LendingPool` contract. The issue occurs when `releaseUnderlying` is set to `true` and the underlying asset is the wrapped HBAR (`_whbarToken`). In this case, the code currently unwraps and sends the HBAR to `vars.onBehalfOf`, which can lead to incorrect handling and unnecessary complexity.

The report recommends modifying the code to ensure that the unwrapping only occurs when `releaseUnderlying` is `true` and that the unwrapped HBAR is sent to `vars.user`, who is the intended recipient of the underlying asset. This will prevent confusion and double payments.

The suggested solution has been implemented by the Bonzo team and the bug has been resolved. The remediation hash for this fix is 660ee467156ad3078e0d61e07e347a920eb1d621.

## Details

##### Description

During the `_executeBorrow` function in the `LendingPool` contract, there is a potential issue when `releaseUnderlying` is set to `true`. If the underlying asset is the wrapped HBAR ( `_whbarToken` ), the unwrapping process should be carefully managed. Currently, the code unwraps and sends the HBAR to `vars.onBehalfOf`, which can lead to incorrect handling and unnecessary complexity.

The unwrapping should only occur when `releaseUnderlying` is `true`, and the unwrapped HBAR should be sent to `vars.user`, who is the one receiving the underlying asset through `transferUnderlyingTo`. This ensures that the correct user receives the unwrapped HBAR and avoids any confusion or double payments.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:C/R:N/S:U (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:C/R:N/S:U)

##### Recommendation

Modify the `_executeBorrow` function to handle the unwrapping of `_whbarToken` properly. Ensure that the unwrapping only occurs when `releaseUnderlying` is `true` and that the unwrapped HBAR is sent to `vars.user`.

```
if (vars.releaseUnderlying) {
    if (vars.asset == address(_whbarToken)) {
        IAToken(vars.aTokenAddress).transferUnderlyingTo(address(this), vars.amount);
        IWHBAR(_whbarContract).withdraw(vars.user, vars.amount);
    } else {
        IAToken(vars.aTokenAddress).transferUnderlyingTo(vars.user, vars.amount);
    }
}
```

By implementing this change, the borrowing process will correctly handle the unwrapping of `_whbarToken`, ensuring that the appropriate user receives the unwrapped HBAR and preventing any potential issues related to asset handling during borrowing.

###

##### Remediation

**SOLVED:** The suggestion was applied by the **Bonzo team**.

##### Remediation Hash

660ee467156ad3078e0d61e07e347a920eb1d621
