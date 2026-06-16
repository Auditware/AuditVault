---
tags:
  - lang/solidity
  - sector/liquid-staking
  - sector/streaming
  - sector/token
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Wrapped native asset address can be freely chosen and is assumed to return equal amount of tokens on deposit 

- id: 54668
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


The report discusses a bug found in the `SablierV2ProxyTarget` contract, specifically in the `wrapAndCreate` function. This function allows users to specify the address of the wrapped native asset (e.g., WETH) when creating a stream. However, if the user chooses a different ERC20 contract that can handle `deposit()`, it can be used to steal tokens from the proxy contract. The report recommends limiting the acceptable wrapped native asset contracts with an allow list or an immutable variable to prevent this bug. The bug has been fixed in the `b7c426` commit of the Sablier contract.

## Details

## Context

- **File**: `/v2-periphery/src/SablierV2ProxyTarget.sol#L329-L338`

## Description

The `wrapAndCreate` functions in the `SablierV2ProxyTarget` contract allow the user to specify the address of the wrapped native asset (e.g., WETH).

```solidity
function wrapAndCreateWithDurations(
    ISablierV2LockupLinear lockupLinear,
    LockupLinear.CreateWithDurations memory createParams
)
    external
    payable
    override
    onlyDelegateCall
    returns (uint256 streamId)
{
    createParams.totalAmount = uint128(msg.value);
    // Wrap the native asset payment in ERC-20 form.
    IWrappedNativeAsset(address(createParams.asset)).deposit{ value: msg.value }();
    // Approve the Sablier contract to spend funds.
    _approve(address(lockupLinear), createParams.asset, createParams.totalAmount);
    // Create the stream.
    streamId = lockupLinear.createWithDurations(createParams);
}
```

The ETH sent with the transaction is deposited in the contract via the `deposit()` function. The amount of ETH deposited is `msg.value`, which is used to overwrite the `createParams.totalAmount` used to create the stream.

However, as the WETH address is specified by the user, they can choose any other ERC20 contract that can handle `deposit()`. If that contract returns less tokens than the ETH deposited, this can be used to steal any of those tokens from the proxy. 

The attack could look like this:
- The returned amount of ERC20 token is less than the `msg.value`.
- The `_approve()` then does an infinite approval on the token contract.
- The `totalAmount` of the stream is set to the `msg.value`.
- The difference will be taken from the proxy contract's balance when creating the stream.

We haven't found a contract that meets these requirements (although stETH comes close except for the empty calldata check in the fallback function).

## Recommendation

Limit the acceptable wrapped native asset contracts with an allow list or an immutable variable in case only one contract is to be allowed.

## Sablier

Changes applied in commit `b7c426`.

## Cantina

Fixed.
