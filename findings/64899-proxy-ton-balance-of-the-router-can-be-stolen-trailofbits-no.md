---
tags:
  - lang/func
  - lang/solidity
  - sector/dex
  - sector/options
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[TONCO]]"
auditors:
  - "[[Nicolas Donboly Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf"
genome:
  - "[[missing]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[ton-jetton-sender-validation]]"
---
# Proxy TON balance of the router can be stolen

- id: 64899
- impact: HIGH
- protocol: [[TONCO]] CLAMM DEX v1.6
- reporter: Nicolas Donboly Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2026-02-tonco-clamm-securityreview.pdf

## Summary


This bug report discusses a medium difficulty issue with the timing of a proxy TON jetton balance held by a router contract. The problem arises when a certain flag is set to true, allowing users to attach an arbitrary multihop payload during a swap. This can be exploited by malicious users to steal the proxy TON balance held by the router. The report suggests adding checks to ensure that the jetton wallet used in the swap is also the router's proxy TON wallet. It also recommends improving the test suite to cover potential adversarial scenarios and malformed data.

## Details

## Diﬃculty: Medium

## Type: Timing

## Description
The proxy TON jetton balance held by the router contract can be stolen when the `ROUTER_FLAG_MULTIHOP_SHORTCUT` flag is set to true due to missing validation in the multihop shortcut path. The protocol allows users performing a swap to attach an arbitrary multihop payload; this enables users to more easily perform additional actions after the swap.

The `payToOperation` function of the router contract implements an optional shortcut if the receiver of either of the jettons is the router contract or the router’s proxy TON jetton wallet.

```solidity
if ((router.flags & ROUTER_FLAG_MULTIHOP_SHORTCUT) != 0) {
    if (coins.amount0 > 0) {
        if (payToBody.receiver0 == contract.getAddress()) {
            transferNotificationPayloadProcess(queryId, coins.amount0,
                                               contract.getAddress(), coins.jetton0Address, payloadCell0, tonAmount0);
            coins.amount0 = 0;
        }
        if (payToBody.receiver0 == router.proxyTonWallet) {
            transferNotificationPayloadProcess(queryId, coins.amount0,
                                               contract.getAddress(), router.proxyTonWallet, payloadCell0, tonAmount0);
            coins.amount0 = 0;
        }
    }
    if (coins.amount1 > 0) {
        if (payToBody.receiver1 == contract.getAddress()) {
            transferNotificationPayloadProcess(queryId, coins.amount1,
                                               contract.getAddress(), coins.jetton1Address, payloadCell1, tonAmount1);
            coins.amount1 = 0;
        }
        if (payToBody.receiver1 == router.proxyTonWallet) {
            transferNotificationPayloadProcess(queryId, coins.amount1,
                                               contract.getAddress(), router.proxyTonWallet, payloadCell1, tonAmount1);
            coins.amount1 = 0;
        }
    }
}
```

*Figure 6.1: A snippet of the multihop shortcut logic in the router contract (contracts/router_tolk/operations/router_send.tolk#L98–L127)*

However, in the latter case, the `proxyTonWallet` is added as the `sender_address` input to the `transferNotificationPayloadProcess` function even though the jetton wallet is not verified to be the router’s proxy TON wallet. This allows a malicious user to drain the proxy TON balance of the router by exchanging a less valuable or malicious jetton for proxy TON.

## Exploit Scenario
The protocol holds $100,000 of proxy TON. Eve deploys two malicious jetton contracts, jetton A and jetton B, and uses the pool factory contract to deploy and set up a pool for these jettons. She swaps jetton A for jetton B, sets the receiver of jetton B to the router’s proxy TON wallet address, and includes a multihop swap payload that will intentionally fail and trigger the jetton refund flow. Due to the missing validation, the refund returns proxy TON instead of jetton B, allowing Eve to steal all the proxy TON held by the router.

## Recommendations
### Short Term
For both receiver checks shown in figure 6.1, add a check that, if the receiver is the `proxyTonWallet`, the jetton wallet used in the swap is also the `proxyTonWallet`.

### Long Term
Improve the coverage of the test suite by adding tests for common adversarial scenarios and malicious or malformed data.
