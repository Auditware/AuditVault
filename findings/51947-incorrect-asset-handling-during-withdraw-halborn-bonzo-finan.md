---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/lending
  - sector/token
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
# Incorrect asset handling during withdraw

- id: 51947
- impact: HIGH
- protocol: Finance Contracts
- reporter: Halborn
- source: https://www.halborn.com/audits/bonzo/finance-contracts

## Summary


This bug report describes an issue with the `withdraw` function in the `LendingPool` contract. The problem occurs when handling the `whbar` asset, as the function assumes that the `msg.sender` and `to` addresses are the same, which may not always be true. This can result in the caller paying for the withdrawal of `whbar` tokens, leading to double payment for the `to` address. Additionally, there is no allowance mechanism in place, which can cause the function to fail if the `msg.sender` has not approved the `LendingPool` for the withdrawal amount. To fix this, the recommendation is to modify the `withdraw` logic for `whbar` assets by transferring the funds to a controlled vault address with the necessary approvals, and then unwrapping the tokens to the `to` address. This approach prevents double payment scenarios and ensures proper handling of the asset during the withdrawal process. The Bonzo team has already applied this suggestion, and the remediation hash is 9f29c6812e7f962b5f06513c91d7d17123e0650d.

## Details

##### Description

During the `withdraw` function execution in the `LendingPool` contract, there is an issue with the handling of the `whbar` asset. The `burn` function of the `AToken` contract transfers the `_underlyingAsset` to the `receiverOfUnderlying`, which corresponds to the `to` parameter in the `withdraw` function. If the asset is the wrapped HBAR ( `whbar` ), a `withdraw` is performed on the `msg.sender`, sending the unwrapped HBAR to the `to` address. This design assumes that `msg.sender` and `to` are the same, which might not be the case. Consequently, this can lead to a scenario where the caller ( `msg.sender` ) pays for the `whbar` withdrawal, resulting in double payment for the `to` address if `msg.sender` is different from `to`.

Additionally, there is no allowance mechanism in place for this operation. The `withdraw` function may fail if `msg.sender` has not approved the `LendingPool` for the `amountToWithdraw`, potentially leading to the use of unrelated allowances.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:C/R:N/S:U (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:N/Y:C/R:N/S:U)

##### Recommendation

To resolve this issue, modify the `withdraw` logic for `whbar` assets. Always transfer the funds to `address(this)` or a controlled vault address with the necessary approvals for the `whbarContract`. Then, unwrap the tokens via `IWHBAR(_whbarContract).withdraw` to the `to` address.

```
// Note - we are withdrawing the user's _whbarToken tokens and send them HBAR
if (asset == address(_whbarToken)) {
    IAToken(aToken).burn(msg.sender, address(this), amountToWithdraw, reserve.liquidityIndex);
    // Note the function, it is a direct `withdraw` without a "from". (approving first could be required)
    IWHBAR(_whbarContract).withdraw(to, amountToWithdraw);
} else {
    IAToken(aToken).burn(msg.sender, to, amountToWithdraw, reserve.liquidityIndex);
}
```

Ensure the controlled vault address has the necessary permissions to handle `whbar` withdrawals. This approach prevents double payment scenarios and ensures proper asset handling during the withdrawal process.

  

###

##### Remediation

**SOLVED:** The suggestion was applied by the **Bonzo team**.

##### Remediation Hash

9f29c6812e7f962b5f06513c91d7d17123e0650d
