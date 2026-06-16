---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[3]]"
report: "https://code4rena.com/reports/2024-02-tapioca"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-06] Attacker can use `MagnetarAction.OFT` action of the Magnet to perform operations as any user including directly stealing user tokens

- id: 32317
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: 3 (Code4rena)
- source: https://code4rena.com/reports/2024-02-tapioca

## Summary


This bug report discusses an issue with the `Magnetar` contract that could potentially allow an attacker to exploit two vulnerabilities and carry out unauthorized actions. The first vulnerability is that the `Magnetar._processOFTOperation` function does not properly check the function signatures in the action calldata, allowing an attacker to call any whitelisted target address from the `Magnetar` contract. The second vulnerability is that the `Magnetar` contract itself is added to the whitelist, allowing an attacker to call the contract and bypass the `_checkSender` function. This could result in the attacker being able to pretend to be anyone and call any contract through the `Magnetar` contract. The report provides a proof of concept using the `MagnetarAssetModule` as an example, showing how an attacker could steal users' collateral in the market. The recommendation is to check the target function signature in the `_processOFTOperation` function to prevent this vulnerability. The issue has been confirmed and fixed by the Tapioca team.

## Details


<https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/Magnetar.sol#L153-L156> 

<https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/Magnetar.sol#L325-L333> 

<https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/contracts/Magnetar/MagnetarStorage.sol#L93-L97>

This issue requires the combination of two vulnerabilities to achieve the impact described in the title. The first vulnerability is that the `Magnetar._processOFTOperation` function doesn't check the function sigs in the action calldata with the the target addresses. It only ensures the calling target addresses are in the Whitelist of the Cluster. So an attacker can use this vuln to call any whitelist target address from the Magnetar.

The second vulnerability is that the Magnetar contract address itself will also be added to the Cluster whitelist. It can be found in the following integration test [here](https://github.com/Tapioca-DAO/tapioca-periph/blob/032396f701be935b04a7e5cf3cb40a0136259dbc/test_hardhat/magnetar.test.ts#L389). If the attacker can let the Magnetar call itself, the `msg.sender` in the sub-call will be in the whitelist. It will bypass the `_checkSender` check:

```solidity
    function _checkSender(address _from) internal view {
        if (_from != msg.sender && !cluster.isWhitelisted(0, msg.sender)) {
            revert Magnetar_NotAuthorized(msg.sender, _from);
        }
    }
```

### Impact

Combining the two issues mentioned above, we can carry out the following exploitation.

1. Call `Magnetar.burst` function with `_action.id == MagnetarAction.OFT`, which will call `_processOFTOperation` function. The `_target` is the Magnetar contract itself, and the `_actionCalldata` is still an encoded calldata to call the `Magnetar.burst` function with `_action.id == MagnetarAction.OFT` again.
2. In the second call, the `msg.sender` will be the Magnetar itself, so the from address check in the `_checkSender` function will be skipped directly because the `msg.sender` is in the whitelist.
3. Now the attacker can pretend to be anyone and call any contract through the Magnetar. Please note that users approved their tokens to Magnetar if they used it.

### Proof of Concept

Taking `MagnetarAssetModule` as an example, it demonstrates how an attacker could steal users' collateral in the market.

Firstly the `_checkSender(data.user);` can be bypassed directly.

And make `data.withdrawCollateralParams.withdraw = true`, so the `collateralWithdrawReceiver` will be the Magnetar contract itself:

    address collateralWithdrawReceiver = data.withdrawCollateralParams.withdraw ? address(this) : data.user;

Then if `collateralShare > 0`, the function will call `_withdrawToChain(data.withdrawCollateralParams);` to withdraw the collateral to the another chain by sending LZ message.

There is no check for `withdrawCollateralParams` in the `_withdrawToChain` function. The attacker can set the receiver address to his address and finally receive the tokens on the target chain.

### Recommendation

Check the target function sig in the `_processOFTOperation` function.

**[cryptotechmaker (Tapioca) confirmed, but disagreed with severity and commented via duplicate Issue #170](https://github.com/code-423n4/2024-02-tapioca-findings/issues/170#issuecomment-2009731108):**
>Medium, the same happens if you approve the attacker for an ERC20. However, this is worth fixing in my opinion. I think we can add specific selectors instead of allowing any call to be executed.
>
>Fixed [here](https://github.com/Tapioca-DAO/tapioca-periph/commit/d4bb69d70f57d570a9608b797f1effc35cfa8490).

***
