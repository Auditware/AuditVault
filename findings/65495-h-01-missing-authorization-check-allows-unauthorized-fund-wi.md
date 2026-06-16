---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/staking
  - sector/token
  - sector/vault
protocol: "[[SukukFi]]"
auditors:
  - "[[0xpetern]]"
report: "https://code4rena.com/reports/2025-11-sukukfi"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[bridge-sender-auth]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Missing Authorization Check Allows Unauthorized Fund Withdrawal

- id: 65495
- impact: HIGH
- protocol: [[SukukFi]]
- reporter: 0xpetern (Code4rena)
- source: https://code4rena.com/reports/2025-11-sukukfi

## Summary


This bug report addresses a critical vulnerability in the code of the `WERC7575Vault.sol` contract. The `withdraw` and `redeem` functions in the contract do not have proper authorization checks, which allows any malicious actor to withdraw assets from the contract on behalf of any user who has authorized the contract to interact with their shares. This could result in the theft of user funds. The report recommends an immediate mitigation by enforcing that the caller is the owner of the shares, and a protocol upgrade to support a secure `spendAllowance` function. 

## Details



* `src/WERC7575Vault.sol` [# L434-L437](https://github.com/code-423n4/2025-11-sukukfi/blob/163216500a54627afc6abaac3bffdc3a830051fa/src/WERC7575Vault.sol# L434-L437)
* `src/WERC7575Vault.sol` [# L464-L467](https://github.com/code-423n4/2025-11-sukukfi/blob/163216500a54627afc6abaac3bffdc3a830051fa/src/WERC7575Vault.sol# L464-L467)

The `withdraw` and `redeem` functions in `WERC7575Vault` are designed to allow a caller (`msg.sender`) to withdraw assets on behalf of a share `owner`, adhering to the ERC4626 standard signature. However, the implementation lacks the critical authorization check to verify that `msg.sender` is either the `owner` themselves or an authorized spender of the `owner`’s shares.

In a standard ERC4626 implementation where the Vault tokenizes the shares (inheriting ERC20), the `withdraw` function calls `_spendAllowance(owner, msg.sender, shares)`, which verifies and decrements the allowance that the `owner` has granted to the `msg.sender`.

In this `WERC7575Vault` architecture, the Share Token is a separate contract (`_shareToken`). The `_withdraw` internal function calls `_shareToken.spendSelfAllowance(owner, shares)`. Given that this is an external call from the Vault, this function presumably checks and consumes the allowance that the `owner` has granted to the **Vault** (`address(this)`), ensuring the Vault has permission to burn the shares.

Crucially, **no check exists to verify the relationship between `msg.sender` and `owner`**.

1. There is no `msg.sender == owner` check.
2. There is no check of `allowance[owner][msg.sender]` on the Share Token.
3. Even if the Vault attempted to check `allowance[owner][msg.sender]`, it could not securely decrement it via standard ERC20 functions (as only the spender can decrement their own allowance via transfer/spend).

As a result, if an `owner` has approved the Vault contract (which is likely a prerequisite for the Vault to burn shares during a legitimate withdrawal), **any malicious actor** can call `withdraw(..., ..., owner)` or `redeem(..., ..., owner)`, burn the `owner`’s shares, and direct the underlying assets to themselves.

### Impact

This is a critical vulnerability allowing the theft of user funds. An attacker can drain the assets associated with any user who has authorized the Vault to interact with their shares. If the system is configured such that the Vault has privileged “burn” rights (requiring no user approval), then an attacker can drain the funds of **all** share owners.

### Recommendation

1. **Immediate Mitigation:** Enforce that the caller is the owner of the shares.

   
```

   function withdraw(uint256 assets, address receiver, address owner) public nonReentrant whenNotPaused returns (uint256 shares) {
       if (msg.sender != owner) revert IERC20Errors.ERC20InvalidSender(msg.sender);
       shares = previewWithdraw(assets);
       _withdraw(assets, shares, receiver, owner);
   }
   
```

   (Apply similarly to `redeem`).
2. **Protocol Upgrade:** If the business requirement is to support third-party withdrawals (standard ERC4626 allowance functionality), the `WERC7575ShareToken` interface must be upgraded to support a secure `spendAllowance(address owner, address spender, uint256 amount)` function that allows a trusted Vault to verify and consume the allowance granted by an `owner` to a `spender` (`msg.sender`).

[View detailed Proof of Concept](https://code4rena.com/audits/2025-11-sukukfi/submissions/F-3)

---
