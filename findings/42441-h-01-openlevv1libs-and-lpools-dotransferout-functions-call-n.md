---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[OpenLeverage]]"
auditors:
  - "[[shw]]"
report: "https://code4rena.com/reports/2022-01-openleverage"
genome:
  - "[[decimal-mismatch]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
---
# [H-01] OpenLevV1Lib's and LPool's `doTransferOut` functions call native `payable.transfer`, which can be unusable for smart contract calls

- id: 42441
- impact: HIGH
- protocol: [[OpenLeverage]]
- reporter: shw (Code4rena)
- source: https://code4rena.com/reports/2022-01-openleverage

## Summary


The report discusses a bug in the OpenLevV1 and LPool contracts. When a user withdraws their funds using a wrapped native token, the `payable.transfer()` function is used. However, this function is unsafe as it has a hardcoded gas budget and can fail when the user is a smart contract. This can cause the user's funds to not be delivered and can lead to the failure of important functions such as `closeTrade` and `liquidate`. The report recommends replacing `transfer()` with a safer alternative such as `call.value(amount)` or using the OpenZeppelin `Address.sendValue` function. This issue has been confirmed and resolved by the team. 

## Details

_Submitted by hyh_

When OpenLev operations use a wrapped native token, the whole user withdraw is being handled with a `payable.transfer()` call.

This is unsafe as `transfer` has hard coded gas budget and can fail when the user is a smart contract. This way any programmatical usage of OpenLevV1 and LPool is at risk.

Whenever the user either fails to implement the payable fallback function or cumulative gas cost of the function sequence invoked on a native token transfer exceeds 2300 gas consumption limit the native tokens sent end up undelivered and the corresponding user funds return functionality will fail each time.

As OpenLevV1 `closeTrade` is affected this includes user's principal funds freeze scenario, so marking the issue as a high severity one.

#### Proof of Concept

OpenLevV1Lib and LPool have `doTransferOut` function that calls native token payable.transfer:

OpenLevV1Lib.doTransferOut

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1Lib.sol#L253>

LPool.doTransferOut

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/liquidity/LPool.sol#L297>

LPool.doTransferOut is used in LPool redeem and borrow, while OpenLevV1Lib.doTransferOut is used in OpenLevV1 trade manipulation logic:

closeTrade

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1.sol#L204>

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1.sol#L215>

liquidate

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1.sol#L263>

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1.sol#L295>

<https://github.com/code-423n4/2022-01-openleverage/blob/main/openleverage-contracts/contracts/OpenLevV1.sol#L304>

#### References

The issues with `transfer()` are outlined here:

<https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/>

#### Recommended Mitigation Steps

OpenLevV1's `closeTrade` and `liquidate` as well as LPool's `redeem`, `redeemUnderlying`, `borrowBehalf`, `repayBorrowBehalf`, `repayBorrowEndByOpenLev` are all `nonReentrant`, so reentrancy isn't an issue and `transfer()` can be just replaced.

Using low-level `call.value(amount)` with the corresponding result check or using the OpenZeppelin `Address.sendValue` is advised:

<https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol#L60>

**[ColaM12 (OpenLeverage) confirmed and resolved](https://github.com/code-423n4/2022-01-openleverage-findings/issues/75)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-01-openleverage-findings/issues/75#issuecomment-1045627508):**
 > Awesome find! Completely agree with the warden here. This would prevent users from calling sensitive functions which withdraw their funds in some way. 



***
