---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - sector/vault
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-12.md"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[bridge-sender-auth]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# [H-05] User can drain escrow via approved withdrawals

- id: 61458
- impact: HIGH
- protocol: Blueberry_2025-03-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-12.md

## Summary


The report discusses a bug in the `HyperEvmVault::requestRedeem` function. This function is used by users to withdraw their assets from the vault. However, a malicious actor can exploit the `ERC4626::withdraw` function to drain the vault equity of any escrow. This can lead to an imbalance where affected users are unable to withdraw their full entitlements. To fix this issue, the `_beforeWithdraw` function should be modified to explicitly pass the owner as an argument and deduct from their request instead of `msg.sender`.

## Details


## Severity

**Impact:** High  

**Likelihood:** Medium  

## Description

Whenever a user wishes to withdraw, they must create a request via the `HyperEvmVault::requestRedeem` function:

```solidity
function requestRedeem(uint256 shares_) external nonReentrant {
    V1Storage storage $ = _getV1Storage();
    uint256 balance = this.balanceOf(msg.sender);
    // Determine if the user withdrawal request is valid
    require(shares_ <= balance, Errors.INSUFFICIENT_BALANCE());

    RedeemRequest storage request = $.redeemRequests[msg.sender];
    
    request.shares += shares_;
    require(request.shares <= balance, Errors.INSUFFICIENT_BALANCE());

    uint256 tvl_ = _totalEscrowValue($);
    _takeFee($, tvl_);
    uint256 assetsToRedeem = shares_.mulDivDown(tvl_, totalSupply());

    request.assets += uint64(assetsToRedeem);
    $.totalRedeemRequests += uint64(assetsToRedeem);
    emit RedeemRequested(msg.sender, shares_, assetsToRedeem);

    VaultEscrow escrowToRedeem = VaultEscrow($.escrows[redeemEscrowIndex()]);
    escrowToRedeem.withdraw(uint64(assetsToRedeem));
}
```

The function calculates the assets/share ratio and saves it into the user's request. When withdrawing, the `_beforeWithdraw` function is invoked:

```solidity
function _beforeWithdraw(uint256 assets_, uint256 shares_) internal {
    V1Storage storage $ = _getV1Storage();

    RedeemRequest memory request = $.redeemRequests[msg.sender];
    require(request.assets >= assets_, Errors.WITHDRAW_TOO_LARGE());
    require(request.shares >= shares_, Errors.WITHDRAW_TOO_LARGE());

    request.assets -= uint64(assets_);
    request.shares -= shares_;
    $.totalRedeemRequests -= uint64(assets_);

    _fetchAssets(assets_);
}
```

This function deducts from the request of the `msg.sender` and fetches the assets from the escrow. However, `ERC4626::withdraw` also supports approvals, which a malicious actor could exploit to drain the vault equity of any escrow.

### Proof of Concept (PoC)

Preconditions:
- **Vault equity of redeem escrow:** **2000 USDC**
- **Vault equity of deposit escrow:** **0**
- **Assets/Share ratio:** **1:1**

Exploit Steps:

1. **Alice creates two addresses (Address1 and Address2) and mints 400 shares to each.**
2. **Alice grants Address1 an unlimited (`type(uint256).max`) approval over Address2’s shares.**
3. **Alice initiates redeem requests from both addresses:**
   - **Redeem escrow vault equity:** **1200 USDC**
   - **Deposit escrow vault equity:** **800 USDC**
4. **Alice, using Address1, executes a withdrawal on behalf of Address2:**
   - `_beforeWithdraw` deducts assets from Address1's request but burns shares from Address2.
5. **Alice creates another redeem request, extracting another 400 USDC from the redeem escrow:**
   - **Redeem escrow equity:** **800 USDC**
   - **Deposit Escrow equity: 800 USDC**
6. **400 USDC is now permanently locked, because of Address2's untouched request.**
  
By depositing only 800 USDC, Alice managed to extract 1200 USDC from the redeem escrow, successfully locking 400 USDC forever in the escrow contract.

Impact:

Alice can continuously repeat this exploit, siphoning assets from escrows and leaving a portion of funds permanently locked. This creates an imbalance where affected users are unable to withdraw their full entitlements.

## Recommendations

Consider modifying `_beforeWithdraw` to explicitly pass `owner` as an argument and deduct from their request instead of `msg.sender` to prevent unauthorized withdrawals on behalf of another user.
