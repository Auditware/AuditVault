---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[windhustler]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[griefing]]"
  - "[[locked-funds]]"
  - "[[access-roles]]"
---
# [H-46] TOFT leverageDown always fails if TOFT is a wrapper for native tokens

- id: 27536
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: windhustler (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


This bug report is about a pathway in the Tapioca-DAO/tapiocaz-audit repository that fails when the TapiocaOFT or mTapiocaOFT holds the native token as the underlying token. When someone tries to execute the "sendForLeverage" function, it will always result in a revert, leading to the permanent loss of TOFT tokens. This is because the "approve" function is not available in the address(0) and the failed message will keep reverting if retried.

To mitigate this issue, it is recommended to disable the "sendForLeverage" function if the TapiocaOFT or mTapiocaOFT holds the native token as the underlying token. This was confirmed by 0xRektora (Tapioca).

## Details


Pathway for [`sendForLeverage`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/BaseTOFT.sol#L323) -> [`leverageDown`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/BaseTOFT.sol#L480) always fails if the `TapiocaOFT` or `mTapiocaOFT` holds the native token as underlying, i.e. [`erc20 == address(0)`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/BaseTOFTStorage.sol#L28).
This results in loss of gas, airdropped amount, and burned TOFT on the sending side for the user.
The failed message if retried will always fail and result in permanent loss for the user.

### Proof of Concept

TapiocaOFT/mTapiocaOFT is deployed with [erc20 being address(0)](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/TapiocaOFT.sol#L74) in case if it holds the native token as an underlying token.
However, it still allows anyone to execute the [`sendForLeverage`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/BaseTOFT.sol#L323) which always results in reverts when receiving the message.

The revert happens at [`IERC20(erc20).approve(externalData.swapper, amount);`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/modules/BaseTOFTLeverageModule.sol#L215) since `address(0)` doesn't have an `approve` function.

The message if retried will just keep on reverting because of the same reason due to the way the `failedMessages` are stored, e.g. you can just retry the same exact payload.
This way anyone invoking this function will lose his TOFT tokens forever.

### Recommended Mitigation Steps

Disable [`sendForLeverage`](https://github.com/Tapioca-DAO/tapiocaz-audit/blob/master/contracts/tOFT/BaseTOFT.sol#L323) function if the `TapiocaOFT` or `mTapiocaOFT` holds the native token as underlying, e.g. revert on the sending side.

**[0xRektora (Tapioca) confirmed](https://github.com/code-423n4/2023-07-tapioca-findings/issues/904#issuecomment-1700191812)**

***
