---
tags:
  - lang/solidity
  - sector/bridge
  - sector/infra
  - sector/stable
  - platform/code4rena
  - has/github
  - severity/high
  - precondition/insider
protocol: "[[Connext]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2022-06-connext"
genome:
  - "[[signature-replay]]"
  - "[[insider]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
  - "[[commitment-uniqueness]]"
---
# [H-06] Malicious Relayer can Replay Execute Calldata on Different Chains Causing Double-Spend Issue

- id: 25135
- impact: HIGH
- protocol: [[Connext]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2022-06-connext

## Summary


This bug report describes an issue that is only applicable for fast-transfer. It occurs when an attacker is able to modify the execute calldata sent to the BridgeFacet.execute function. As a relayer, the attacker can change the ExecuteArgs.local to a valid local representation of canonical token used within Polygon. This allows the attacker to pass the router signature verification and transfer tokens to their wallet on both the Ethereum and Polygon domains. The attacker is then able to keep the tokens on the Polygon domain, as the router is not able to claim back any funds.

The root cause of this issue is that the current design places enormous trust on the relayers to accurately and reliably deliver calldata to the bridge in various domains. To mitigate this issue, the sequencer should sign the execute calldata with its private key, and attach the signature to the execute calldata. Then, submit the execute calldata (with signature) to the relayer network. When the bridge receives the execute calldata (with signature), it can verify if the decoded address matches the sequencer address to ensure that the calldata has not been altered. Additionally, the execute calldata should also have a field that correspond to the destination domain. The bridge that receives the execute calldata must verify that the execute calldata is intended for its domain, otherwise reject the calldata if it belongs to other domains.

The impact of this issue is that router liquidity would be drained by the attacker, and affected router owners would not be able to claim back their liquidity.

## Details

_Submitted by xiaoming90_

[BridgeFacet.sol#L411](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/BridgeFacet.sol#L411)<br>

> This issue is only applicable for fast-transfer. Slow transfer would not have this issue because of the built-in fraud-proof mechanism in Nomad.

First, the attacker will attempt to use Connext to send `1000 USDC` from Ethereum domain to Optimism domain.

Assume that the attacker happens to be a relayer on the relayer network utilised by Connext, and the attacker's relayer happens to be tasked to relay the above execute calldata to the Optimism's Connext [`BridgeFacet.execute`](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/BridgeFacet.sol#L411) function.

Optimism's Connext `BridgeFacet.execute` received the execute calldata and observed within the calldata that it is a fast-transfer and Router A is responsible for providing the liquidity. It will then check that the router signature is valid, and proceed to transfer `1000 oUSDC` to attacker wallet (0x123456) in Optimism.

Next, attacker will update the `ExecuteArgs.local` within the execute calldata to a valid local representation of canonical token (USDC) used within Polygon. Attacker will then send the modified execute calldata to Polygon's Connext `BridgeFacet.execute` function. Assume that the same Router A is also providing liquidity in Polygon. The `BridgeFacet.execute` function checks that the router signature is valid, and proceed to transfer `1000 POS-USDC` to atttack wallet (0x123456) in Polygon.

At this point, the attacker has `1000 oUSDC` and `1000 POS-USDC` in his wallets. When the nomad message arrives at Optimism, Router A can claim the `1000 oUSDC` back from Connext. However, Router A is not able to claim back any fund in Polygon.

Note that same wallet address exists on different chains. For instance, the wallet address on Etherum and Polygon is the same.

#### Why changing the `ExecuteArgs.local` does not affect the router signature verification?

This is because the router signature is generated from the `transferId` + `pathLength` only, and these data are stored within the `CallParams params` within the `ExecuteArgs` struct.

[LibConnextStorage.sol#L77](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/libraries/LibConnextStorage.sol#L77)<br>

```solidity
struct ExecuteArgs {
  CallParams params;
  address local; // local representation of canonical token
  address[] routers;
  bytes[] routerSignatures;
  uint256 amount;
  uint256 nonce;
  address originSender;
}
```

Within the [`BridgeFacet._executeSanityChecks`](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/BridgeFacet.sol#L411) function, it will attempt to rebuild to `transferId` by calling the following code:

```solidity
// Derive transfer ID based on given arguments.
bytes32 transferId = _getTransferId(_args);
```

Within the [`BridgeFacet._getTransferId`](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/BridgeFacet.sol#L719) function, we can see that the `s.tokenRegistry.getTokenId(_args.local)` will always return the canonical `tokenDomain` and `tokenId`. In our example, it will be `Ethereum` and  `USDC`. Therefore, as long as the attacker specify a valid local representation of canonical token on a chain, the `transferId` returned by `s.tokenRegistry.getTokenId(_args.local)` will always be the same across all domains. Thus, this allows the attacker to modify the `ExecuteArgs.local` and yet he could pass the router signature check.

  [BridgeFacet.sol#L719](https://github.com/code-423n4/2022-06-connext/blob/4dd6149748b635f95460d4c3924c7e3fb6716967/contracts/contracts/core/connext/facets/BridgeFacet.sol#L719)<br>

```solidity
  function _getTransferId(ExecuteArgs calldata _args) private view returns (bytes32) {
    (uint32 tokenDomain, bytes32 tokenId) = s.tokenRegistry.getTokenId(_args.local);
    return _calculateTransferId(_args.params, _args.amount, _args.nonce, tokenId, tokenDomain, _args.originSender);
  }
```

### Impact

Router liquidity would be drained by attacker, and affected router owner could not claim back their liquidity.

### Recommended Mitigation Steps

The security of the current Connext design depends on how secure or reliable the relayer is. If the relayer turns rouge or acts against Connext, many serious consequences can happen.

The root cause is that the current design places enormous trust on the relayers to accurately and reliably to deliver calldata to the bridge in various domains. For instance, delivering of execute call data to `execute` function. There is an attempt to prevent message replay on a single domain, however, it does not prevent message replay across multiple domains. Most importantly, the Connext's bridge appears to have full trust on the calldata delivered by the relayer. However, the fact is that the calldata can always be altered by the relayer.

Consider a classic 0x off-chain ordering book protocol. A user will sign his order with his private key, and attach the signature to the order, and send the order (with signature) to the relayer network. If the relayer attempts to tamper the order message or signature, the decoded address will be different from the signer's address and this will be detected by 0x's Smart contract on-chain when processing the order. This ensures that the integrity of the message and signer can be enforced.

Per good security practice, relayer network should always be considered as a hostile environment/network. Therefore, it is recommended that similar approach could be taken with regards to passing execute calldata across domains/chains.

For instance, at a high level, the sequencer should sign the execute calldata with its private key, and attach the signature to the execute calldata. Then, submit the execute calldata (with signature) to the relayer network. When the bridge receives the execute calldata (with signature), it can verify if the decoded address matches the sequencer address to ensure that the calldata has not been altered. This will ensure the intergrity of the execute calldata and prevent any issue that arise due to unauthorised modification of calldata.

Additionally, the execute calldata should also have a field that correspond to the destination domain. The bridge that receives the execute calldata must verify that the execute calldata is intended for its domain, otherwise reject the calldata if it belongs to other domains. This also helps to prevent the attack mentioned earlier where same execute calldata can be accepted in different domains.

**[LayneHaber (Connext) confirmed and commented](https://github.com/code-423n4/2022-06-connext-findings/issues/144#issuecomment-1166344934):**
 > Agree that this is an issue, but disagree with the framing and mitigation.
> 
> The `calldata` is included in the generation of the `transferId` via the `CallParams`, so it cannot be easily manipulated by the relayer network once signed by routers. However, because you are not validating the `s.domain` against the `CallParams.destinationDomain` you can use the same transfer data across multiple chains, which is a big problem.

**[LayneHaber (Connext) resolved](https://github.com/code-423n4/2022-06-connext-findings/issues/144#issuecomment-1167499043):**
 > [connext/nxtp@bc241f8](https://github.com/connext/nxtp/pull/1450/commits/bc241f8d9ca5ca7d9598c7b40affa9a416580cc6)

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-06-connext-findings/issues/144#issuecomment-1214813364):**
 > This seems like the most severe finding of the entire contest. Kudos to the warden on a great find!
> 
> Because transfer data is replicated across multiple chains, relayers are also able to execute data on each chain. If `_executeSanityChecks` does not check that the message's destination chain matches `s.domain`, then transfers could be spent on all available chains.
>
 > Interestingly, because the remote router is included in the message, only the correct destination chain will be able to reconcile the transfer and reimburse routers for providing liquidity. Hence, the issue is only prevalent on other chains if routers readily bid on incoming transfers, which seems possible because signatures can be replayed on other chains. So if the same set of routers have sufficient liquidity on another chain, the relayer can execute this message again to create a double spend issue.
>
 > Another point to add, this issue would only be prevalent on chains which have its local asset pointing to the same address as this is what the bridge will attempt to transfer to the recipient. Additionally, in order for the relayer to replay a router's signature, the `transferId` must exactly match the `transferId` on the intended destination chain. This is only possible if `TokenRegistry.getTokenId` returns the same canonical domain and ID values.
>
 > It would be good to confirm this. Is it possible for a local asset to be registered to the same canonical domain and ID on multiple chains?

**[LayneHaber (Connext) commented](https://github.com/code-423n4/2022-06-connext-findings/issues/144#issuecomment-1218305324):**
 > > Is it possible for a local asset to be registered to the same canonical domain and ID on multiple chains?
> 
> Yes, that is actually the purpose of the `canonicalId` and `canonicalDomain` -- there should only be one canonical (locked) token that maps to any number of local (minted) instances.
> 
> This issue is valid, and enforcing in `_executeSanityChecks` it is only executed on the destination domain should prevent this attack, correct?

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-06-connext-findings/issues/144#issuecomment-1218349487):**
> Okay great! Because local assets map to the same canonical domain and ID on each chain, I think this issue is most definitely valid. `_args.local` is not used to calculate `transferId`, hence the representation for each asset may differ on each chain but the `TokenRegistry.getTokenId` should return the correct information.
> 
> I can confirm that the enforcing check in `_executeSanityChecks` should ensure that transfer data is only executed on the intended destination domain.



***
