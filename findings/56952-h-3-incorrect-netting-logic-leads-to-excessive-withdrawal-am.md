---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/vault
  - sector/yield-aggregator
  - platform/sherlock
protocol: "[[Burve]]"
auditors:
  - stonejiajia
report: "https://github.com/sherlock-audit/2025-04-burve-judging"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/rounding]]"
  - "[[loss-of-funds/direct-drain]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# H-3: Incorrect Netting Logic Leads to Excessive Withdrawal Amounts

- id: 56952
- impact: HIGH
- protocol: Burve
- reporter: stonejiajia (Sherlock)
- source: N/A

## Summary


This bug report details a logical error in the netting calculation of a protocol that leads to incorrect withdrawal amounts. This occurs because the protocol fails to properly subtract deposit amounts when netting pending transactions. The root cause of this issue is that the protocol gets the real balance of a vertex and the actual balance of the closure based on its share balance in the vault. When the real balance is greater than the target real, there is a residual amount that needs to be withdrawn from the vault. However, during the commit function, the code sets the assetsToDeposit value to 0 and then attempts to subtract this value from assetsToWithdraw, resulting in no change to the withdrawal amount. This bug can have a significant impact on the protocol as it prevents the netting optimization from working properly and can result in the protocol paying fees on the full withdrawal amount rather than just the net amount. The protocol team has fixed this issue in the code and users are advised to update to the latest version to mitigate this bug.

## Details

Source: https://github.com/sherlock-audit/2025-04-burve-judging/issues/174 

## Found by 
0L5S6W, 0x23r0, 0xpinkman, 0xpranav, KungFuPanda, RektOracle, Rhaydden, Sparrow\_Jac, TheCarrot, Tigerfrake, aman, anirruth\_, curly11, future, imageAfrika, kazan, m3dython, ni8mare, peppef, prosper, shushu, stonejiajia

### Summary

A logical error in the netting calculation will cause incorrect withdrawal amounts as the protocol fails to subtract deposit amounts when netting pending transactions properly.

### Root Cause

During the trimBalance, the protocol gets the real balance of a vertex:
```solidity
uint256 realBalance = AdjustorLib.toReal(idx, self.balances[idx], true);
```
which is the `targetReal` and also within the vertex, the protocol gets the actual balance of the closure based on its share balance in the vault:
```solidity
uint256 realBalance = vProxy.balance(cid, false);
```
When the real balance is > targetReal, then we have some residual that needs to be withdrawn from the vault, and the bgtResidual:
```solidity
bgtResidual = FullMath.mulDiv(residualReal, bgtValue, value);
```
becomes the amount to deposit for reserve, thereafter, a commit is made:
```solidity
function trimBalance(
        Vertex storage self,
        ClosureId cid,
        uint256 targetReal,
        uint256 value,
        uint256 bgtValue
    ) internal returns (uint256 reserveSharesEarned, uint256 bgtResidual) {
        VaultProxy memory vProxy = VaultLib.getProxy(self.vid);
        uint256 realBalance = vProxy.balance(cid, false);
        // We don't error and instead emit in this scenario because clearly the vault is not working properly but if
        // we error users can't withdraw funds. Instead the right response is to lock and move vaults immediately.
        if (targetReal > realBalance) {
            emit InsufficientBalance(self.vid, cid, targetReal, realBalance);
            return (0, 0);
        }
        uint256 residualReal = realBalance - targetReal;
        vProxy.withdraw(cid, residualReal);
        bgtResidual = FullMath.mulDiv(residualReal, bgtValue, value);
        reserveSharesEarned = ReserveLib.deposit(
            vProxy,
            self.vid,
            residualReal - bgtResidual
        );
        vProxy.commit();
    }
```
The issue arises in the [commit](https://github.com/sherlock-audit/2025-04-burve/blob/44cba36e2a0c3cd7b6999459bf7746db92f8cc0a/Burve/src/multi/vertex/E4626.sol#L71-L73) function, at this point both deposit and withdrawal > 0
```solidity
function commit(VaultE4626 storage self, VaultTemp memory temp) internal {
        uint256 assetsToDeposit = temp.vars[1];
        uint256 assetsToWithdraw = temp.vars[2];

        if (assetsToDeposit > 0 && assetsToWithdraw > 0) {
            // We can net out and save ourselves some fees.
            if (assetsToDeposit > assetsToWithdraw) {
                assetsToDeposit -= assetsToWithdraw;
                assetsToWithdraw = 0;
            } else if (assetsToWithdraw > assetsToDeposit) {
                assetsToDeposit = 0;  // @audit 
                assetsToWithdraw -= assetsToDeposit;
            } else {
                // Perfect net!
                return;
            }
        }

        if (assetsToDeposit > 0) {
            // Temporary approve the deposit.
            SafeERC20.forceApprove(
                self.token,
                address(self.vault),
                assetsToDeposit
            );
            self.totalVaultShares += self.vault.deposit(
                assetsToDeposit,
                address(this)
            );
            SafeERC20.forceApprove(self.token, address(self.vault), 0);
        } else if (assetsToWithdraw > 0) {
            // We don't need to hyper-optimize the receiver.
            self.totalVaultShares -= self.vault.withdraw(
                assetsToWithdraw,
                address(this),
                address(this)
            );
        }
    }
```
The code sets assetsToDeposit to 0 and then attempts to subtract this value (now 0) from assetsToWithdraw, resulting in no change to the withdrawal amount.

### Internal Pre-conditions

- Both pending deposits `(temp.vars[1] > 0)` and pending withdrawals `(temp.vars[2] > 0)` at the time of commit
- The pending withdrawal amount must be greater than the pending deposit amount `(assetsToWithdraw > assetsToDeposit)`


### External Pre-conditions

- There is profit on the vault so preview redeem has increased

### Attack Path

- None

### Impact

The netting optimization exists to make the protocol more efficient, but this bug prevents it from working properly.

For vaults that charge withdrawal fees (like some yield aggregators), the vault will pay fees on the full withdrawal amount rather than just the net amount.

### PoC

_No response_

### Mitigation

```solidity
if (assetsToDeposit > 0 && assetsToWithdraw > 0) {
            if (assetsToDeposit > assetsToWithdraw) {
                assetsToDeposit -= assetsToWithdraw;
                assetsToWithdraw = 0;
            } else if (assetsToWithdraw > assetsToDeposit) {
                assetsToWithdraw -= assetsToDeposit; // audit fix
                assetsToDeposit = 0;
            } else {
                // Perfect net!
                return;
            }
        }
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/itos-finance/Burve/commit/c14995d806cdabc20bfedb094d585ed7b8668c8c
