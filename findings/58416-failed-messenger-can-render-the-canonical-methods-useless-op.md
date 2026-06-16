---
tags:
  - lang/solidity
  - sector/bridge
  - sector/options
  - sector/stable
  - has/github
  - severity/high
protocol: "[[Across Protocol OFT Integration Differential]]"
auditors:
  - OpenZeppelin
report: "https://blog.openzeppelin.com/across-protocol-oft-integration-differential-audit"
genome:
  - "[[dos-resistance]]"
  - "[[cross-protocol]]"
---
# Failed Messenger Can Render the Canonical Methods Useless

- id: 58416
- impact: HIGH
- protocol: Across Protocol OFT Integration Differential Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/across-protocol-oft-integration-differential-audit

## Summary


The `Arbitrum_Adapter` and `Arbitrum_SpokePool` contracts have a bug that causes a failure in transferring assets if the messenger associated with the token is not working properly. This can result in a stall situation until the issue is resolved. To prevent this, the affected contracts should be modified to allow for bypassing a failing messenger or a `try-catch` mechanism can be used. The team has acknowledged the issue but has not yet resolved it, suggesting a mitigation plan involving deploying a new contract and manually backfilling missing tokens. 

## Details

The [`Arbitrum_Adapter`](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/chain-adapters/Arbitrum_Adapter.sol#L133) and [`Arbitrum_SpokePool`](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/Arbitrum_SpokePool.sol#L94) contracts implement a new `else if` conditional statement branch to make use of the `_transferViaOFT` function from the `OFTTransportAdapter` contract. To enter into this branch, the only requirement is for the [messenger associated with that token](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/chain-adapters/Arbitrum_Adapter.sol#L127) to [not be zero](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/chain-adapters/Arbitrum_Adapter.sol#L132).

The call stack on the `HubPool` contract's side is: [executeRootBundle](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/HubPool.sol#L620) -> [\_sendTokensToChainAndUpdatePooledTokenTrackers](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/HubPool.sol#L876) -> [relayTokens](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/chain-adapters/Arbitrum_Adapter.sol#L121) -> [\_transferViaOFT](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/libraries/OFTTransportAdapter.sol#L57). In this call sequence, if the messenger throws an error in its internal operation when [sending the message](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/libraries/OFTTransportAdapter.sol#L94) inside the innermost call to the `_transferViaOFT` function, the reversion will be propagated all the way up to the `_sendTokensToChainAndUpdatePooledTokenTrackers` function and the assets [will not be sent](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/HubPool.sol#L901-L910). Not only that, since the assets are [sent in the same call as the message with the refund roots](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/HubPool.sol#L686-L697), the roots will also not be sent to the respective `SpokePool` contract. As the bridging mechanisms are checked sequentially, the Arbitrum Gateway, which [comes after the OFT Transport method](https://github.com/across-protocol/contracts/blob/c5d7541037d19053ce2106583b1b711037483038/contracts/chain-adapters/Arbitrum_Adapter.sol#L132-L178), will not be able to be used as a replacement, meaning that there will be no way of transferring those funds until either the messenger resolves the conflicts or the admin role removes it from the `oftMessengers` mapping, possibly resulting in a stall situation until it gets resolved.

In order to prevent a scenario in which assets need to be moved into or out of Arbitrum (e.g., there are insufficient assets) when the OFT messenger is currently not working, consider replacing these patterns in all the affected contracts to allow for bypassing a failing messenger so that the canonical alternative can be used. Alternatively, consider using a `try-catch` mechanism to prevent the propagation of the revert that could also affect the bridging of the root hashes.

***Update:** Acknowledged, not resolved. The team stated:*

> *This is indeed an important situation, which will not, however, be mitigated by try - catching.*
>
> *The scenario we imagine is OFT transfer breaking (messenger freezing the route) for some OFT token, say USDT. As discussed in Slack, USDT is not bridgeable in a meaningful way to L2s via canonical bridges. If the OFT messenger for that route is shut down / frozen, there's indeed no way for our system to rebalance USDT to that destination chain because OFT is supposed to be the only available bridge option for USDT.*
>
> *If a situation like this ever happens though, it's crucial that the engineering team knows about it immediately. We can not just silently try catch, because system will not continue to operate correctly without the rebalance required by it (e.g. we're trying to repay relayers on Arbitrum with USDT that's not in Spoke's balance -> that won't work). The mitigation scenario we envision is the following:*
>
> *1. We deploy a new `ArbitrumAdapter` with commented `_transferViaOft` line commented out, allowing bundle to execute.*
>
> *2. At this point, any USDT relayer refund leaves on Arbitrum will fail to execute and will page us a lot. We deal with this by modifying the executor (probably) to suppress this noise.*
>
> *3. Once OFT is back unfrozen for this path, we use `relaySpokePoolAdminFunction` in conjunction with something like [Arbitrum\_SendTokensAdapter.sol](https://github.com/across-protocol/contracts/blob/a5fbdf13a95a7eaf50eb907c85ec03845a4aacd0/contracts/chain-adapters/Arbitrum_SendTokensAdapter.sol) (change it's code to OFT logic) to backfill the missing USDT tokens on L2 (that were not executed properly during 1).*
>
> *Otherwise, if OFT route is never unfrozen, we have no way to repay the relayers on Arbitrum. Summing this up, doing anything other than sending the funds through the OFT adapter should require manual intervention. (i.e. no try-catch and drop the sending of funds).*
