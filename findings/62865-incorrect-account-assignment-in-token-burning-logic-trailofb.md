---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/token
protocol: "[[Radius Technology]]"
auditors:
  - "[[Quan Nguyen Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[account-ownership]]"
---
# Incorrect account assignment in token burning logic

- id: 62865
- impact: HIGH
- protocol: [[Radius Technology]] EVMAuth
- reporter: Quan Nguyen Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-10-radiustechnology-evmauth-securityreview.pdf

## Summary


The bug report describes a problem with a token burning function in a smart contract. The function is supposed to burn tokens from a specific account, but it is incorrectly assigning the wrong account address, causing the contract to attempt burning tokens from the zero address. This means that when someone tries to burn tokens, the transaction fails and the tokens remain in the account, allowing the user to continue accessing premium services. The report recommends fixing the account assignment in the short term and implementing comprehensive tests in the long term to prevent similar issues in the future.

## Details

## Diﬃculty: Low

## Type: Data Validation

### Description
The token burning logic incorrectly assigns the wrong account address when burning tokens. When tokens are being burned, the code incorrectly assigns `address _account = to` instead of using the `from` address, causing the contract to attempt burning tokens from the zero address.

The `_update` function is responsible for handling token minting, burning, and transferring operations. When burning tokens, the logic should burn tokens from the `from` address (the token holder), but the current implementation incorrectly sets `_account = to`, which is `address(0)` (the zero address). This means that the contract attempts to burn tokens from the zero address instead of the actual token holder, which will fail since the zero address has no tokens to burn.

```solidity
// Burning
else if (to == address(0)) {
    address _account = to;
    _burnGroupBalances(_account, _id, _amount);
    _pruneGroups(_account, _id);
}
```

**Figure 1.1:** Incorrect account assignment in burning logic in `_update` function

### Exploit Scenario
Alice has authentication tokens that grant access to a premium service. The service relies on an admin to manually burn tokens when Alice ends her subscription. When the admin attempts to burn Alice’s authentication tokens to revoke access, the burn transaction keeps reverting. This means Alice’s authentication tokens remain in their account even after the admin’s burn operation, allowing her to continue accessing premium services she should no longer have access to.

### Recommendations
- **Short term:** Correct the account assignment in the burning logic in the `_update` function.
- **Long term:** Implement comprehensive unit tests that cover all token operations (mint, burn, transfer) with various edge cases, including burning tokens from different accounts and with different token IDs.
