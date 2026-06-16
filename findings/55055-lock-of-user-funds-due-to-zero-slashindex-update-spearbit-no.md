---
tags:
  - lang/solidity
  - sector/staking
  - platform/spearbit
  - has/github
  - severity/high
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[locked-funds]]"
---
# Lock of user funds due to zero slashIndex update

- id: 55055
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


The bug report discusses a severe issue in the InfiniFi protocol's `UnwindingModule` and `LockingController` contracts. The `slashIndex` variable, which adjusts the value of user positions, can become `0` after a loss event, causing a panic error and preventing users from accessing their locked tokens. This issue leads to a permanent loss of assets and does not have a straightforward fix. The report suggests updating the `UnwindingModule.applyLosses` function, but this would require additional changes and could break the `totalRewardWeight` logic. The bug has been fixed in the InfiniFi protocol and verified by Spearbit.

## Details

## Severity: High Risk

## Context
UnwindingModule.sol#L292

## Description
In the InfiniFi protocol, the `UnwindingModule` and `LockingController` contracts work together to manage the locking and unwinding of user tokens. The `slashIndex` is a pivotal variable that adjusts the value of user positions (e.g., reward weights) to reflect losses in the system. Under normal conditions, `slashIndex` starts at `1.0` (`1e18`) and decreases proportionally with losses, for example, dropping to `0.9` (`9e17`) after a 10% loss. 

However, a severe edge case arises when a loss event burns all Receipt Tokens from the `UnwindingModule`, setting `slashIndex` to `0` to indicate a complete loss of value in the `UnwindingModule`. This design choice introduces a significant issue in the `startUnwinding` function, which users must call to initiate the unwinding of their locked tokens. 

The function includes the following calculation:
```solidity
uint256 rewardWeight = _rewardWeight.divWadDown(slashIndex);
```
Here, `_rewardWeight` is the user's current reward weight, and `divWadDown` performs a division with 18-decimal precision, rounding down. When `slashIndex` is `0`, this line attempts to divide `_rewardWeight` by zero, which will cause a panic error and revert. As a result, users cannot execute `startUnwinding`, preventing them from transitioning their locked tokens into the unwinding state.

The implications are severe: users with tokens locked in the `LockingController` are trapped, unable to access or recover their funds. This issue leads to a permanent loss of assets, as the protocol does not provide an alternative mechanism for users to bypass the failed `startUnwinding` call or retrieve their tokens when `slashIndex` is `0`.

## Recommendation
There is not a straightforward fix. A possible solution could be updating the `UnwindingModule.applyLosses` function to reset the `slashIndex` to `1` (`1e18`) whenever the remaining `totalReceiptTokens` are zero:
```solidity
function applyLosses(uint256 _amount) external onlyCoreRole(CoreRoles.LOCKED_TOKEN_MANAGER) {
    if (_amount == 0) return;
    uint256 _totalReceiptTokens = totalReceiptTokens;
    ERC20Burnable(receiptToken).burn(_amount);
    slashIndex = slashIndex.mulDivDown(_totalReceiptTokens - _amount, _totalReceiptTokens);
    totalReceiptTokens = _totalReceiptTokens - _amount;
    
    if(totalReceiptTokens == 0){
        slashIndex = 1e18;
    }
}
```
However, this would break the `totalRewardWeight` logic. It would also be required to implement a way to reset `totalRewardWeight` to `0` in all the previous slopes until the current epoch.

## Conclusion
- infiniFi: Fixed in 66182a3 and 06dca30.
- Spearbit: Fix verified.
