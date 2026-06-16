---
tags:
  - lang/solidity
  - sector/token
  - sector/vault
  - platform/shieldify
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
protocol: "[[Pear]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Pear-Vault-Security-Review.md"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[bridge-sender-auth]]"
  - "[[reentrancy-guard]]"
---
# [C-01] Missing Authorization in `withdraw()` and `redeem()` Allows Theft of Any User's Funds

- id: 65286
- impact: HIGH
- protocol: [[Pear]] Vault
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Pear-Vault-Security-Review.md

## Summary


This bug report discusses a critical issue in the `withdraw()` and `redeem()` functions of the PearVault smart contract. These functions allow any caller to specify an arbitrary `owner` and `receiver` address without verifying if the caller is authorized to act on behalf of the owner. This means that an attacker can steal a user's vault shares by specifying themselves as the receiver and targeting any victim's address as the owner. The affected code can be found in the `PearVault.sol` file in lines 496-509, 512-524, and 703-709. The impact of this bug is a complete loss of funds for all vault depositors. The recommendation is to add authorization checks at the beginning of the affected functions to ensure that only authorized users can make these calls. The team has responded that the issue has been fixed.

## Details


## Severity

Critical Risk

## Description

The `withdraw()` and `redeem()` functions allow any caller to specify an arbitrary `owner`/`user` address and a `receiver` address. The functions burn shares from the specified owner and send the underlying assets to the receiver without verifying that `msg.sender` is authorized to act on behalf of the owner.

The `_withdrawWithFee()` internal function intentionally bypasses the ERC4626 allowance check by passing the `user` parameter as both `caller` and `owner` to `super._withdraw()`. The base ERC4626 implementation only performs an allowance check when `caller != owner`, so this design completely removes the authorization mechanism.

An attacker can call `redeem(victimShares, attackerAddress, victimAddress)` or `withdraw(assets, attackerAddress, victimAddress)` to burn a victim's shares and receive the assets themselves.

## Location of Affected Code

File: [src/PearVault.sol#L496-L509](https://github.com/pear-protocol/pear-vault-smartcontracts/blob/f681d7cc31ba76d521038f65e0e060849de55345/src/PearVault.sol#L496-L509)
```solidity
function redeem(uint256 shares, address receiver, address user) public override(ERC4626Upgradeable, IERC4626) nonReentrant onlyActiveVault returns (uint256) {
    if (balanceOf(user) < shares) revert InsufficientBalance();
    
    uint256 assets = super.previewRedeem(shares);
    if(!_canDirectWithdraw(assets)) {
        revert("Direct redeem not allowed. Use requestWithdrawal() for queued redeem");
    }
    
    return _withdrawWithFee(shares, user, receiver);
}
```

File: [src/PearVault.sol#L512-L524](https://github.com/pear-protocol/pear-vault-smartcontracts/blob/f681d7cc31ba76d521038f65e0e060849de55345/src/PearVault.sol#L512-L524)
```solidity
function withdraw(uint256 assets, address receiver, address owner) public override(ERC4626Upgradeable, IERC4626) nonReentrant onlyActiveVault returns (uint256) {
    if(!_canDirectWithdraw(assets)) {
        revert("Direct withdraw not allowed. Use requestWithdrawal() for queued withdrawal");
    }
    uint256 shares = super.previewWithdraw(assets);
    if (balanceOf(owner) < shares) revert InsufficientBalance();
    _withdrawWithFee(shares, owner, receiver);
    return shares;
}
```

File: [src/PearVault.sol#L703-L709](https://github.com/pear-protocol/pear-vault-smartcontracts/blob/f681d7cc31ba76d521038f65e0e060849de55345/src/PearVault.sol#L703-L709)
```solidity
function _withdrawWithFee(uint256 shares, address user, address receiver) internal returns (uint256) {
  // code
  super._withdraw(
      user, // caller (same as owner to avoid allowance check)
      receiver, // receiver
      user, // owner of shares
      assetsToTransfer, // assets to transfer (after fee)
      shares // shares to burn
  );
  // code
}
```

## Impact

Any user's vault shares can be stolen by any attacker. The attacker specifies themselves as the receiver while targeting any victim's address as the owner, resulting in a complete loss of funds for all vault depositors.

## Recommendation

Add authorization checks at the beginning of both `withdraw()` and `redeem()` functions to ensure that `msg.sender` is either the owner or has sufficient allowance:

```solidity
if (msg.sender != owner) {
    _spendAllowance(owner, msg.sender, shares);
}
```

Alternatively, pass `msg.sender` as the `caller` argument to `super._withdraw()` instead of `user`, allowing the base ERC4626 implementation to enforce the allowance check.

## Team Response

Fixed.
