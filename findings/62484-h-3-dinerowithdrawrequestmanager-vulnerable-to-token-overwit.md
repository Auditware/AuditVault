---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Notional]]"
auditors:
  - "[[0xc0ffEE]]"
  - "[[Atharv]]"
  - "[[Ledger_Patrol]]"
  - "[[Ragnarok]]"
  - "[[Schnilch]]"
  - "[[X0sauce]]"
  - "[[aman]]"
  - "[[hgrano]]"
  - "[[seeques]]"
  - "[[xiaoming90]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[frontrun-exposure]]"
---
# H-3: `DineroWithdrawRequestManager` vulnerable to token overwithdrawal via batch ID overlap

- id: 62484
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: Ledger\_Patrol (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue in the `DineroWithdrawRequestManager` contract where some users may profit while others may incur losses. This is due to the contract not properly tracking the balance of each `upxETH` token per withdrawal request, which can lead to overlaps and unintended withdrawals. This can be exploited by malicious users to withdraw more tokens than intended. To fix this, the contract needs to be updated to track balances per request. The protocol team has already fixed this issue in a recent pull request.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/297 

## Found by 
0xc0ffEE, Atharv, Ledger\_Patrol, Ragnarok, Schnilch, X0sauce, aman, hgrano, seeques, xiaoming90

### Summary

Some users may profit while others incur losses because the `DineroWithdrawRequestManager` contract does not track the balance of each `upxETH` token per withdrawal request, even though a single `upxETH` token may be associated with multiple requests.

### Root Cause

When a user initiates a withdrawal request through `DineroWithdrawRequestManager`, the contract executes the `_initiateWithdrawImpl()` function. This function captures `PirexETH.batchId()` before and after calling `PirexETH::initiateRedemption()`:

[DineroWithdrawRequestManager::_initiateWithdrawImpl()](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/withdraws/Dinero.sol#L17) function:
```solidity
function _initiateWithdrawImpl(
    address /* account */,
    uint256 amountToWithdraw,
    bytes calldata /* data */
) override internal returns (uint256 requestId) {
      ...
=>    uint256 initialBatchId = PirexETH.batchId();
      pxETH.approve(address(PirexETH), amountToWithdraw);
      PirexETH.initiateRedemption(amountToWithdraw, address(this), false);
=>    uint256 finalBatchId = PirexETH.batchId();
      uint256 nonce = ++s_batchNonce;

=>    return nonce << 240 | initialBatchId << 120 | finalBatchId;
  }
```

When the user later finalizes the withdrawal via `_finalizeWithdrawImpl()`, the contract attempts to redeem all `upxETH` tokens within the range `[initialBatchId, finalBatchId]`:

```solidity
function _finalizeWithdrawImpl(
    address /* account */,
    uint256 requestId
) internal override returns (uint256 tokensClaimed, bool finalized) {
    finalized = canFinalizeWithdrawRequest(requestId);

    if (finalized) {
        (uint256 initialBatchId, uint256 finalBatchId) = _decodeBatchIds(requestId);

=>      for (uint256 i = initialBatchId; i <= finalBatchId; i++) {
=>          uint256 assets = upxETH.balanceOf(address(this), i);
            if (assets == 0) continue;
            PirexETH.redeemWithUpxEth(i, assets, address(this));
            tokensClaimed += assets;
        }
    }

    WETH.deposit{value: tokensClaimed}();
}
```

After this, `upxETH.balanceOf(address(this), i)` for all `i` in the range `[initialBatchId, finalBatchId]` becomes 0.

On the other hand, `initialBatchId` and `finalBatchId` may overlap across multiple withdrawal requests due to the logic inside `PirexETH::initiateRedemption()`, which internally calls `PirexEthValidators::_initiateRedemption()`:

```solidity
function _initiateRedemption(
    uint256 _pxEthAmount,
    address _receiver,
    bool _shouldTriggerValidatorExit
) internal {
    pendingWithdrawal += _pxEthAmount;

    while (pendingWithdrawal / DEPOSIT_SIZE != 0) {
        uint256 _allocationPossible = DEPOSIT_SIZE + _pxEthAmount - pendingWithdrawal;

=>      upxEth.mint(_receiver, batchId, _allocationPossible, "");
        ...
        batchIdToValidator[batchId++] = _pubKey;
        status[_pubKey] = DataTypes.ValidatorStatus.Withdrawable;
    }
    ...
    if (_pxEthAmount > 0) {
=>      upxEth.mint(_receiver, batchId, _pxEthAmount, "");
    }
}
```

This can lead to some users benefiting at the expense of others. Consider the following scenario:

1. User A initiates a withdrawal request, associated with `upxETH` token IDs 1 and 2.
2. User B then initiates a withdrawal request, associated with token IDs 2 and 3.
3. User A finalizes their request and redeems all ETH from token IDs 1 and 2, even though ID 2 is also tied to User B's request. User A withdraws more than intended.
4. When User B finalizes their request, the balance of token ID 2 is already 0. Thus, they only receive the ETH from token ID 3.

A malicious user can exploit this behavior by front-running another user’s withdrawal request, intentionally causing batch ID overlaps and withdrawing more tokens than intended.

### Impact

A malicious user can:

* Withdraw more tokens than they should by front-running others.
* Cause financial loss to other users.

### Mitigation

Update the `DineroWithdrawRequestManager` contract to track `upxETH` balances per withdrawal request:

Add state variables:

```solidity
mapping(uint256 requestId => mapping(uint256 batchId => uint256 balance)) upxETHBalanceOfRequest;
mapping(uint256 batchId => uint256 balance) latestUpxETHBalance;
```

Modify `_initiateWithdrawImpl`:

```diff
function _initiateWithdrawImpl(
    address /* account */,
    uint256 amountToWithdraw,
    bytes calldata /* data */
) override internal returns (uint256 requestId) {
    ...
    // Initial and final batch ids may overlap between requests so the nonce is used to ensure uniqueness
-   return nonce << 240 | initialBatchId << 120 | finalBatchId;
+   requestId = nonce << 240 | initialBatchId << 120 | finalBatchId;

+   for (uint256 i = initialBatchId; i <= finalBatchId; i += 1) {
+       uint256 currentBalance = upxETH.balanceOf(address(this), i);
+       upxETHBalanceOfRequest[requestId][i] =  currentBalance - latestUpxETHBalance[i];
+       latestUpxETHBalance[i] = currentBalance;
+   }
    
}
```

Modify `_finalizeWithdrawImpl`:

```diff
function _finalizeWithdrawImpl(
    address /* account */,
    uint256 requestId
) internal override returns (uint256 tokensClaimed, bool finalized) {
    finalized = canFinalizeWithdrawRequest(requestId);

    if (finalized) {
        (uint256 initialBatchId, uint256 finalBatchId) = _decodeBatchIds(requestId);

        for (uint256 i = initialBatchId; i <= finalBatchId; i++) {
-           uint256 assets = upxETH.balanceOf(address(this), i);
+           uint256 assets = upxETHBalanceOfRequest[requestId][i];
            if (assets == 0) continue;
            PirexETH.redeemWithUpxEth(i, assets, address(this));
            tokensClaimed += assets;
+           latestUpxETHBalance[i] -= assets;
        }
    }

    WETH.deposit{value: tokensClaimed}();
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/notional-finance/notional-v4/pull/20
