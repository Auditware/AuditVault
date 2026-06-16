---
tags:
  - lang/solidity
  - sector/oracle
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Notional]]"
auditors:
  - "[[0xpiken]]"
  - "[[HeckerTrieuTien]]"
  - "[[Ledger_Patrol]]"
  - "[[Ragnarok]]"
  - "[[X0sauce]]"
  - "[[heavyw8t]]"
  - "[[y4y]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# H-6: DoS might happen to `DineroWithdrawRequestManager#_initiateWithdrawImpl()` due to overflow on `++s_batchNonce`

- id: 62487
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: HeckerTrieuTien (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue that was found in the Notional Finance protocol by a group of individuals. The issue involves a function called `DineroWithdrawRequestManager#initiateWithdraw()` which is responsible for initiating a withdrawal of WETH. The function calls another function, `DineroWithdrawRequestManager#_initiateWithdrawImpl()`, which then executes a redemption from `PirexETH`. The problem lies in the fact that the `requestId` variable, which is used to track the withdrawal, is composed of three variables, one of which is a `uint16` called `s_batchNonce`. Once this variable reaches its maximum value of `65535`, the `initiateWithdraw()` function will revert and no further withdrawals can be made through the protocol. This means that any assets deposited through the protocol will be locked forever. The root cause of this issue is the fact that the capacity of `s_batchNonce` is too small. The report suggests that this can be mitigated by redesigning the `requestId` variable to use a `uint120` instead of a `uint16`. The Notional Finance team has addressed this issue in a recent PR and the bug has been fixed.

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/580 

## Found by 
0xpiken, HeckerTrieuTien, Ledger\_Patrol, Ragnarok, X0sauce, heavyw8t, y4y

### Summary

When `DineroWithdrawRequestManager#initiateWithdraw()` is called to initiate WETH withdrawal, [`DineroWithdrawRequestManager#_initiateWithdrawImpl()`](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/main/notional-v4/src/withdraws/Dinero.sol#L17-L39) will be executed to initiate a redemption from `PirexETH`:
```solidity
    function _initiateWithdrawImpl(
        address /* account */,
        uint256 amountToWithdraw,
        bytes calldata /* data */
    ) override internal returns (uint256 requestId) {
        if (YIELD_TOKEN == address(apxETH)) {
            // First redeem the apxETH to pxETH before we initiate the redemption
            amountToWithdraw = apxETH.redeem(amountToWithdraw, address(this), address(this));
        }

        uint256 initialBatchId = PirexETH.batchId();
        pxETH.approve(address(PirexETH), amountToWithdraw);
        // TODO: what do we put for should trigger validator exit?
        PirexETH.initiateRedemption(amountToWithdraw, address(this), false);
        uint256 finalBatchId = PirexETH.batchId();
@>      uint256 nonce = ++s_batchNonce;

        // May require multiple batches to complete the redemption
        require(initialBatchId < MAX_BATCH_ID);
        require(finalBatchId < MAX_BATCH_ID);
        // Initial and final batch ids may overlap between requests so the nonce is used to ensure uniqueness
        return nonce << 240 | initialBatchId << 120 | finalBatchId;
    }
```
The returned `requestId` is composed by three variables: `nonce`, `initialBatchId`, and `finalBatchId`.
`nonce` is calculated as below:
```solidity
        uint256 nonce = ++s_batchNonce;
```
However, `s_batchNonce` is a `uint16` variable. Once its value reaches `65535`, then `++s_batchNonce` will revert the whole `initiateWithdraw()` function, resulting no one can withdraw WETH though `DineroWithdrawRequestManager`. Anyone asset deposited through `DineroWithdrawRequestManager` will be locked forever.

### Root Cause

The capacity of `s_batchNonce` is too small.

### Internal Pre-conditions

_No response_

### External Pre-conditions

_No response_

### Attack Path

Malicious attacker can call  `DineroWithdrawRequestManager#stakeTokens()` and `DineroWithdrawRequestManager#initiateWithdraw()` repeatedly with different accounts through an approved vault  to quickly increase `s_batchNonce` to `65535`. 

### Impact

Once `s_batchNonce` reaches `65535`, `DineroWithdrawRequestManager#initiateWithdraw()` call will always revert and no any WETH can be withdrawn from `DineroWithdrawRequestManager`.

### PoC

_No response_

### Mitigation

The reason that defining `s_batchNonce` as `uint16` is  that `s_batchNonce` will be used together with two `uint120` variables to make a `uint256` variable:
```solidity
        return nonce << 240 | initialBatchId << 120 | finalBatchId;
```
Since `PirexETH.batchId()` will increase one time only every 32 ether redemption, it is unnecessary to record two batchIds in `requestId`. `requestId` can be redesigned as below:
```code
|255------136|135---------16|15---------0|
|s_batchNonce|initialBatchId|deltaBatchId|
``` 
Where `uint16 deltaBatchId = finalBatchId - initialBatchId`
Then `s_batchNonce` can be defined as a `uint120` variable.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/notional-finance/notional-v4/pull/20/files
