---
tags:
  - lang/solidity
  - sector/token
  - has/github
  - severity/high
protocol: "[[Valantis]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md"
genome:
  - "[[token-decimal-normalization]]"
  - "[[specific-token-type]]"
---
# [VLTS3-5] The calculation of shares in STEXAMM is incorrect because of using the outdated amountToken1PendingLPWithdrawal

- id: 56682
- impact: HIGH
- protocol: Valantis
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md

## Summary


The report discusses a critical bug in the STEXAMM contract's `deposit()` and `withdraw()` functions. The calculation of shares in these functions is affected by an outdated value for `amountToken1PendingLPWithdrawal`, which leads to incorrect calculations and a potential loss of shares for users. The bug can be fixed by triggering an `update()` function or creating a getter function to keep `amountToken1PendingLPWithdrawal` updated at all times. The bug has been fixed.

## Details

**Severity:** Critical

**Path:** src/STEXAMM.sol#L468-L479, src/STEXAMM.sol#L550-L555

**Description:** The calculation of shares in `deposit()` function of STEXAMM contract:
```
(uint256 reserve0Pool, uint256 reserve1Pool) = ISovereignPool(pool).getReserves();
// Account for token0 in pool (liquid) and pending unstaking (locked)
uint256 reserve0Total = reserve0Pool + _withdrawalModule.amountToken0PendingUnstaking();
// Account for token1 pending withdrawal to LPs (locked)
uint256 reserve1PendingWithdrawal = _withdrawalModule.amountToken1PendingLPWithdrawal();
// shares calculated in terms of token1
shares = Math.mulDiv(
    _amount,
    totalSupplyCache,
    reserve1Pool + _withdrawalModule.amountToken1LendingPool()
        + _withdrawalModule.convertToToken1(reserve0Total) - reserve1PendingWithdrawal
);
```
`amountToken0PendingUnstaking()` is the amount that the withdrawal module is waiting for the overseer contract to claim after `unstakeToken0Reserves`. In `stHYPEWithdrawalModule`, this getter function is always up to date:
```
function amountToken0PendingUnstaking() public view override returns (uint256) {
    uint256 balanceNative = address(this).balance;
    uint256 excessNative =
        balanceNative > amountToken1ClaimableLPWithdrawal ? balanceNative - amountToken1ClaimableLPWithdrawal : 0;
    // stHYPE is rebase, hence no need for conversion
    uint256 excessToken0 = excessNative > 0 ? excessNative : 0;

    uint256 amountToken0PendingUnstakingCache = _amountToken0PendingUnstaking;
    if (amountToken0PendingUnstakingCache > excessToken0) {
        return amountToken0PendingUnstakingCache - excessToken0;
    } else {
        return 0;
    }
}
```
However, `amountToken1PendingLPWithdrawal` is not the same, since it doesn’t have a getter function and is not updated with the current native balance in the `stHYPEWithdrawalModule` contract. Therefore, when the overseer has already sent native Token1 from unstaking but `update()` hasn’t been called, `amountToken1PendingLPWithdrawal` remains outdated, leading to a miscalculation of the total assets in the share calculation.

For example, after some withdrawals are queued, `amountToken1PendingLPWithdrawal` increases to 10e18 from `burnToken0AfterWithdraw`. Then, the owner calls `stHYPEWithdrawalModule::unstakeToken0Reserves `for the first time with `amount = 10e18` to unstake Token0 from the Sovereign pool and burn it via the Overseer contract to claim native Token1 asynchronously.

Before the overseer sends tokens:
`amountToken1PendingLPWithdrawal = 10e18`, `amountToken0PendingUnstaking = 10e18`
=> Total assets = `reserve0 + reserve1 + amountToken1LendingPool + amountToken0PendingUnstaking - amountToken1PendingLPWithdrawal
= reserve0 + reserve1 + amountToken1LendingPool + 10e18 - 10e18`

After the overseer sends 4e18 native tokens, but `update()` hasn’t been called:
`amountToken1PendingLPWithdrawal = 10e18` (still outdated), `amountToken0PendingUnstaking = 4e18 `(up-to-date via getter function)
=> Total assets = `reserve0 + reserve1 + amountToken1LendingPool + 4e18 - 10e18`

Therefore, the user’s shares will be calculated incorrectly due to the use of the outdated `amountToken1PendingLPWithdrawal`, leading to a loss of shares when depositing. 

The same issue exists in the calculation of the `withdraw` function.

**Remediation:**  You should trigger update() whenever a deposit or withdrawal occurs, or create a getter function for amountToken1PendingLPWithdrawal to keep it updated at all times.

**Status:**  Fixed


- - -
