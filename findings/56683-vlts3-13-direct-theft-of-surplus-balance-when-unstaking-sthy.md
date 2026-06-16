---
tags:
  - lang/solidity
  - sector/dex
  - sector/liquid-staking
  - sector/options
  - sector/staking
  - sector/token
  - has/github
  - severity/high
protocol: "[[Valantis]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[specific-token-type]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[admin-is-honest]]"
  - "[[external-call-is-safe]]"
  - "[[add-access-control]]"
  - "[[reentrancy-callback]]"
---
# [VLTS3-13] Direct theft of surplus balance when unstaking stHYPE

- id: 56683
- impact: HIGH
- protocol: Valantis
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-03-17-Valantis.md

## Summary


Severity: Critical

Description: The stHYPE Withdrawal Module allows the owner to unstake stHYPE into HYPE using the Overseer contract. However, there is a vulnerability that allows an attacker to steal the entire surplus amount by leveraging the swap callback of the Sovereign Pool. This can be done by calling `stHYPEWithdrawalModule.update` inside the callback, where the surplus amount in HYPE is transferred directly. This allows the attacker to swap to stHYPE without actually paying, resulting in direct theft from the protocol.

Remediation: To fix this issue, it is necessary to add a `donate` function to the Sovereign Pool that only works for rebase tokens and has the `nonReentrant` modifier. Alternatively, dummy calls can be used to check for reverts due to reentrancy. This will prevent the vulnerability from being exploited.

Status: Fixed. 

## Details

**Severity:** Critical

**Path:** src/stHYPEWithdrawalModule.sol:update#L431-L475

**Description:** The stHYPE Withdrawal Module exposes functionality for the owner of the module to unstake stHYPE into HYPE using the Overseer contract. The owner calls `unstakeToken0Reserves`, which in turn transfers stHYPE from the SovereignPool (uses the STEXAMM) and then calls `burnAndRedeemIfPossible` to create a Burn request. The stHYPE is burned immediately and the Burn request can be redeemed later once filled for HYPE.

In the `update` function, any received HYPE from redeemed Burn requests is first allocated to any outstanding LP withdrawal requests after which the surplus is deposited back into the Sovereign Pool directly on lines 471-474:
```
token1.deposit{value: balanceSurplus}();
// Pool reserves are measured as balances, hence we can replenish it with token1
// by transfering directly
token1.safeTransfer(stexInterface.pool(), balanceSurplus);
```
This works because the token is a rebase token and so the Sovereign Pool uses the actual balance as reserve.

However, this mechanism can be exploited to directly steal the entire surplus amount by leveraging the swap callback of the Sovereign Pool.

When calling `swap` on the Sovereign Pool, the user has the option parameter `isSwapCallback`, which can be turned on to pay the `tokenIn` amount inside of the callback in `_handleTokenInTransfersOnSwap`:
```
    function _handleTokenInTransfersOnSwap(
        bool isZeroToOne,
        bool isSwapCallback,
        IERC20 token,
        uint256 amountInUsed,
        uint256 effectiveFee,
        bytes calldata _swapCallbackContext
    ) private {
        uint256 preBalance = token.balanceOf(sovereignVault);

        if (isSwapCallback) {
            ISovereignPoolSwapCallback(msg.sender).sovereignPoolSwapCallback(
                address(token),
                amountInUsed,
                _swapCallbackContext
            );
        } else {
            token.safeTransferFrom(msg.sender, sovereignVault, amountInUsed);
        }

        uint256 amountInReceived = token.balanceOf(sovereignVault) - preBalance;
        
        [..]
    }
```
Any balance transferred to the Sovereign Pool during this callback would be counted towards payment for the user. As such, it is possible to call `stHYPEWithdrawalModule.update` inside of the callback, where the surplus amount in HYPE is transferred directly.

As a result, the entire amount can be used by the attacker to swap to stHYPE, without actual paying and thus directly stealing the value from the protocol. 
```
    function update() external nonReentrant {
        // Need to ensure that enough native token is reserved for settled LP withdrawals
        // WARNING: This implementation assumes that there is no slashing enabled in the LST protocol
        uint256 amountToken1ClaimableLPWithdrawalCache = amountToken1ClaimableLPWithdrawal;
        if (address(this).balance <= amountToken1ClaimableLPWithdrawalCache) {
            return;
        }

        // Having a surplus balance of native token means that new unstaking requests have been fulfilled
        uint256 balanceSurplus = address(this).balance - amountToken1ClaimableLPWithdrawalCache;
        // stHYPE is rebase, hence no need for conversion
        uint256 balanceSurplusToken0 = balanceSurplus;

        uint256 amountToken0PendingUnstakingCache = _amountToken0PendingUnstaking;
        if (amountToken0PendingUnstakingCache > balanceSurplusToken0) {
            _amountToken0PendingUnstaking = amountToken0PendingUnstakingCache - balanceSurplusToken0;
        } else {
            _amountToken0PendingUnstaking = 0;
        }

        // Prioritize LP withdrawal requests
        uint256 amountToken1PendingLPWithdrawalCache = amountToken1PendingLPWithdrawal;
        if (balanceSurplus > amountToken1PendingLPWithdrawalCache) {
            balanceSurplus -= amountToken1PendingLPWithdrawalCache;
            amountToken1ClaimableLPWithdrawal += amountToken1PendingLPWithdrawalCache;
            cumulativeAmountToken1ClaimableLPWithdrawal += amountToken1PendingLPWithdrawalCache;
            amountToken1PendingLPWithdrawal = 0;
        } else {
            amountToken1PendingLPWithdrawal -= balanceSurplus;
            amountToken1ClaimableLPWithdrawal += balanceSurplus;
            cumulativeAmountToken1ClaimableLPWithdrawal += balanceSurplus;
            balanceSurplus = 0;
            return;
        }

        // Wrap native token into token1 and re-deposit into the pool
        ISTEXAMM stexInterface = ISTEXAMM(stex);
        address token1Address = stexInterface.token1();
        IWETH9 token1 = IWETH9(token1Address);

        token1.deposit{value: balanceSurplus}();
        // Pool reserves are measured as balances, hence we can replenish it with token1
        // by transfering directly
        token1.safeTransfer(stexInterface.pool(), balanceSurplus);
    }
```

**Remediation:**  It is not safe to make direct transfers to the pool if you are unsure whether current execution is inside of a swap callback. It should therefore be verified using the reentrancy switch of the Sovereign Pool, however this is currently not exposed.

One possibility is to add a `donate` function to the SovereignPool that only works for rebase tokens (donations are possible with transfers already anyway) and has the `nonReentrant` modifier. That way you can safely donate the tokens back to the pool without the risk.

If modifications to the SovereignPool are not possible, then dummy calls that check whether reverts happen due to reentrancy are needed. This is often used to guard against read-only reentrancy for Balancer or Curve.

**Status:**  Fixed

- - -
