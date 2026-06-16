---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/lending
protocol: "[[Bucket Protocol]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/bucket-protocol-v-2/abd312d6-1a5e-45c5-963b-a6856daf6621/index.html"
genome:
  - "[[broken-logic]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Security Level Constraint Can Be Circumvented

- id: 63379
- impact: HIGH
- protocol: [[Bucket Protocol]] V2
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/bucket-protocol-v-2/abd312d6-1a5e-45c5-963b-a6856daf6621/index.html

## Summary


The bug report states that there is an issue with the `update_position()` function in the `bucket_cdp/sources/vault.move` file. This function is supposed to restrict certain actions based on the user's operation and the vault's security level. However, it is possible for a user to bypass this security level by including a deposit amount with their call of `update_position()`. The recommendation is to change the code to use independent `if` statements instead of an `if-else` condition. This will ensure that the security level access control is not circumvented. The bug has been fixed by the client and the code changes can be found in `49f5916fb915743b929b5c5d28d2647a0e24d14e`.

## Details

**Update**
Fixed by the client as per recommendation. Addressed in: `49f5916fb915743b929b5c5d28d2647a0e24d14e`.

**File(s) affected:**`bucket_cdp/sources/vault.move`

**Description:** The `update_position()` function throws an error depending on the user's operation and the vault's security level. It is _intended_ that if the user wants to deposit collateral, the user is allowed if the security level is 0 or 2; if the user wants to withdraw collateral, repay a debt, or borrow, the security level must be 0. This behavior is based on the following code block:

```
// check security by actions
    if(request.deposit_amount() > 0) {
        // deposit actions will only be blocked when security level equals to 1
        vault.check_secutiry_level(1);
    }else{
        // borrow; repay; witdraw;
        vault.check_secutiry_level(2);
    };
```

However, it is possible to withdraw collateral, repay a debt, or borrow even if the security level is 2: the user simply needs to include a deposit amount with their call of `update_position()`. This way, the security level access control is circumvented.

**Recommendation:** Instead of an `if - else` condition, implement independent `if` statements that depend on inputs to `update_position()`, since several operations are supported at once in `update_position()`.
