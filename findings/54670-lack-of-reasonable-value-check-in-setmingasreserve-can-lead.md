---
tags:
  - lang/solidity
  - sector/staking
  - sector/streaming
  - platform/cantina
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# Lack of reasonable value check in setMinGasReserve() can lead to bricked proxy 

- id: 54670
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


The bug report is about a potential issue with a piece of code in the PRBProxy project. The code does not have a check for the input parameter for a new variable called `minGasReserve`, which is used in a function called `setMinGasReserve()`. This variable is used to deduct gas from a transaction that calls another contract. If the `minGasReserve` value is set too high, it could cause the transaction to exceed the block size limit and not be included in a block. This could also happen if the `minGasReserve` value is accidentally or intentionally overwritten by another contract. The report suggests removing the `minGasReserve` altogether or adding a check for a reasonable value and storing it in an external contract to prevent accidental overwriting. The issue has been fixed in a recent PR.

## Details

## Context
- [/prb-proxy/src/PRBProxyAnnex.sol#L72](https://github.com/your-repository/prb-proxy/src/PRBProxyAnnex.sol#L72)
- [/prb-proxy/src/PRBProxy.sol#L66-L77](https://github.com/your-repository/prb-proxy/src/PRBProxy.sol#L66-L77)
- [/prb-proxy/src/PRBProxy.sol#L106-L118](https://github.com/your-repository/prb-proxy/src/PRBProxy.sol#L106-L118)

## Description
There is no sanity check on the input parameter for the new `minGasReserve` in `setMinGasReserve()`. The `minGasReserve` is deducted from the gas stipend to be sent in the delegatecall to a target or plugin contract.

```solidity
function _safeDelegateCall(address to, bytes memory data) internal returns (bool success, bytes memory response) {
    ...
    uint256 stipend = gasleft() - minGasReserve;
    (success, response) = to.delegatecall{ gas: stipend }(data);
    ...
}
```

If the `minGasReserve` is set to a high enough value the total required gas amount could be so high it would exceed the block size limit and never be able to get included in a block. This also applies to a transaction to set the `minGasReserve` back to a sane value, resulting in an unusable proxy locking all the funds with it. The storage slot used for the `minGasReserve` can also accidentally (or intentionally by a malicious plugin or target contract) be overwritten with the same result.

Additionally, reserving a fixed amount of gas for post-processing the delegatecall serves no purpose. If we would rely on the normal 1/64th amount of gas reserved and it would not be sufficient for post-processing (which is limited to checking the success of the delegatecall and possibly reverting with the underlying reason), the transaction would revert due to insufficient gas. This behavior, however, is no different than when the `minGasReserve` is applied and the stipend for the delegatecall is reduced, in which case the delegatecall would revert due to insufficient gas. In both situations, the transaction reverts and the user needs to send the transaction again with an increased gas limit.

## Recommendation
Consider removing the stipend altogether. Alternatively, perform a check for the sane value of `minGasReserve` when setting a new value and store it in an external contract to avoid plugins or target contracts accidentally overwriting the storage slot.

## Sablier
Changed applied in PR 114.

## Cantina
Fixed.
