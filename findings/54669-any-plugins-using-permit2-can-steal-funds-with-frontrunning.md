---
tags:
  - lang/solidity
  - sector/dex
  - sector/streaming
  - sector/token
  - platform/cantina
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Any plugins using permit2 can steal funds with frontrunning attack 

- id: 54669
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_jul2023.pdf

## Summary


This bug report discusses an issue with the SablierV2ProxyTarget contract. The problem is that when funds are transferred, the permit2 signature is used to allow the proxy to spend the tokens on behalf of the user. However, this signature does not specify the target contract or the function being called, which means that the proxy can use the signature for any reason. This could potentially allow a user to front-run the proxy's use of the signature and use the same signature for their own purposes. The recommendation is to use the more restrictive `permitWitnessTransferFrom` function, which would allow for better verification of the intent of the owner. The responses from Sablier and Cantina acknowledge the issue and agree to document the potential dangers of using Permit2 signatures in proxy plugins.

## Details

## SablierV2ProxyTarget Analysis

## Context

- SablierV2ProxyTarget.sol#L662

## Description

As stated in the Uniswap Permit2 documentation [here](#) and [here](#), the calling contract should check the intent of the signer on how the signature is used.

In `SablierV2ProxyTarget`, any time funds are transferred, the permit2 signature is used to permit the proxy to spend the tokens on behalf of the user:

```solidity
permit2Params.permit2.permit({
  owner: owner_,
  permitSingle: permit2Params.permitSingle,
  signature: permit2Params.signature
});
// Transfer funds from the proxy owner to the proxy.
permit2Params.permit2.transferFrom({ from: owner_, to: address(this), amount: amount, token: address(asset) });
```

However, this signature only specifies the proxy address, token contract, and token amount; it does not specify the target/plugin contract or the function being called, which more precisely covers the intent of the owner when they sign the permit2 allowance.

### Struct Definitions

```solidity
struct PermitSingle {
  // the permit data for a single token allowance
  PermitDetails details;
  // address permissioned on the allowed tokens
  address spender;
  // deadline on the permit signature
  uint256 sigDeadline;
}

struct PermitDetails {
  // ERC20 token address
  address token;
  // the maximum amount allowed to spend
  uint160 amount;
  // timestamp at which a spender's token allowances become invalid
  uint48 expiration;
  // an incrementing value indexed per owner, token, and spender for each signature
  uint48 nonce;
}
```

This means the proxy can use the signature to transfer funds from the permit2 contract for any reason. In the event that there is a plugin installed on the proxy that uses permit2, a user can front-run the proxy's use of the signature and use the same signature to spend the funds for its own purposes.

## Recommendation

1. Documentation should be clear that permit2 signatures are not allowed in plugins, as it would be impossible for the proxy code to enforce verification of the witness before forwarding to the plugin contract.
   
2. Although less likely, this same risk can exist in other situations besides plugins. For example, envoys may be permitted to send transactions to a contract with permit2, assuming they would be able to use it without the owner's signature.

To solve this, use the more restrictive `permitWitnessTransferFrom`, which allows limiting the validity of the signature to the action intended by the owner. This should at minimum include the target contract address and the function called on the target contract, but ideally would also include the target contract's function parameters.

Note that this witness data should be validated by the proxy code itself before forwarding the call to the target contract. Therefore, a dedicated function `executeWithPermit2(address target, bytes calldata data, Permit2Params calldata permit2Params)` for permit2 usage is needed to uniformly be able to extract the permit2 signature from the calldata.

## Responses

**Sablier:** Acknowledged. We will accept this issue as an inescapable consequence of the computational universality of the plugin/target execution flow. But we will make sure to document the dangers of using Permit2 signatures in proxy plugins, as you have recommended.

**Cantina:** Acknowledged.
