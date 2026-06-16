---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/streaming
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[flashloan-callback-auth]]"
---
# Any envoy with access to SablierV2ProxyTarget can steal all funds in proxy 

- id: 54671
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


This bug report is about a function called `_transferAndApprove()` in the `SablierV2ProxyTarget.sol` contract. This function allows a user to create a stream of funds, but there is a vulnerability that could allow a malicious user to steal all the funds in the contract. The report suggests that the contract should check the permit2 address before approving the transfer to prevent this from happening. The issue has been addressed in a recent update to the contract.

## Details

## Security Review

## Context
- `SablierV2ProxyTarget.sol#L643-L666`

## Description
Envoys are given permissions on a target-by-target basis, with the assumption that they are not fully trusted with the assets of the proxy. When a proxy owner gives an envoy permissions on the `SablierV2ProxyTarget`, it is safe for them to assume that the user cannot steal their funds. This is because the only way to create a stream is to have a signed `permit2` order from the owner, which allows the assets to be transferred to the proxy so the stream can be created.

### Function: `_transferAndApprove`
```solidity
function _transferAndApprove(
    address sablierContract,
    IERC20 asset,
    uint160 amount,
    Permit2Params calldata permit2Params
) internal {
    // Retrieve the proxy owner.
    address owner_ = owner;
    // Permit the proxy to spend funds from the proxy owner.
    permit2Params.permit2.permit({
        owner: owner_,
        permitSingle: permit2Params.permitSingle,
        signature: permit2Params.signature
    });
    // Transfer funds from the proxy owner to the proxy.
    permit2Params.permit2.transferFrom({ from: owner_, to: address(this), amount: amount, token: address(asset) });
    // Approve the Sablier contract to spend funds.
    _approve(sablierContract, asset, amount);
}
```

However, this `_transferAndApprove()` function allows the caller to input the `Permit2Params`, which includes the permit2 address that is used for the approval and transfer. This allows a malicious envoy to deploy their own dummy contract (with `permit()` and `transferFrom()` functions that pass but don’t do anything), and then create a stream on behalf of the owner with this contract passed as the permit2 address.

The result is that the `createStream()` function will call `_transferAndApprove()`, no checks will be performed in `permit2`, the asset will be approved for spending by Sablier, and the stream will be created. This stream could be uncancellable and send assets to themselves over a short time period, stealing all the funds in the proxy from the owner.

## Recommendation
A list of approved permit2 contracts should be maintained on the contract, and the inputted permit2 address should be checked against this list before approving the transfer.

- **Sablier**: Addressed via PR 102.
- **Cantina**: Fixed.
