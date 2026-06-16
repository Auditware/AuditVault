---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-04] Faulty NAV Update Logic Creates Compounding Asset Depletion

- id: 57889
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary


The bug report describes a vulnerability that occurs when a user tries to withdraw money from the fund. The problem is that the system deducts fees twice from the total assets, causing the fund's value to decrease at a faster rate. This can lead to a compounding effect where users withdraw more money than intended. The team has fixed the issue by modifying the code to only deduct the net withdrawal amount after the fee payment.

## Details

## Severity

High Risk

## Description

The vulnerability manifests in the interaction between withdrawal initiation and execution. During `initiateWithdrawal()`, the calculated `withdrawAmount` already includes the management fee (as evidenced by managementFee being calculated from withdrawAmount but not subtracted from it). However, in `_withdraw()`, the protocol again subtracts both the withdrawal amount and fees from the NAV through `_updateVaultState(vaultState, sharesWithdrawAmount, totalManagementFee)`.

The internal `_updateVaultState()` function incorrectly treats the withdrawal amount and fees as separate deductions `(nav -= (withdrawAmount + feeAmount))`, despite the withdrawal amount already incorporating the fee component. This double-counting progressively erodes the fund's NAV with each withdrawal.

## Location of Affected Code

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function initiateWithdrawal(uint256 _shares) external nonReentrant {
    require(balanceOf(msg.sender) >= _shares, "INVALID_SHARES");
    UserWithdraw.WithdrawData memory userWithdraw = _getUserWithdraw(
        msg.sender
    );
    // @audit create problem if second time he comes for withdrawal at that time, due to rounding the exact number of shares can't come, due to that he can not withdraw a second time
    require(userWithdraw.shares == 0, "INVALID_WD_STATE");
    // @audit confirm should round up here
    uint256 withdrawAmount = ShareMath.sharesToAsset(
        _shares,
        _getPricePerShare(),
        decimals()
    );

    uint256 managementFee = _calculateManagementFeeAmount(
        block.timestamp,
        withdrawAmount
    );

    // @audit fees not taken on withdrawAmount , it is taken differently so would create a prob
    _createUserWithdraw(
        msg.sender,
        userWithdraw,
        _shares,
        withdrawAmount,
        managementFee
    );

    emit WithdrawalInitiated(msg.sender, withdrawAmount, _shares);
}
```

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
function _updateVaultState(
    VaultStore.VaultState memory vaultState,
    uint256 withdrawAmount,
    uint256 feeAmount
) internal {
    vaultState.withdrawPoolAmount -= withdrawAmount;
    vaultState.nav -= (withdrawAmount + feeAmount);

    VaultStore.setVaultState(
        fundStorage,
        VaultStore.getVaultKey(address(this)),
        vaultState
    );
}
```

## Impact

The protocol's NAV will decrease at an accelerated rate as each withdrawal improperly deducts fees twice from the total assets. This creates a compounding effect where user withdrawals systematically remove more value from the fund than intended

## Recommendation

The `_updateVaultState()` function must be modified to recognize that fees are already included in the withdrawal amount. Instead of deducting both, it should only deduct the net withdrawal amount after the fee payment.

## Team Response

Fixed.
