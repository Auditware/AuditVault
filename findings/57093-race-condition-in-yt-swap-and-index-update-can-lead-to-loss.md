---
tags:
  - lang/solidity
  - sector/dex
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
protocol: "[[FIVA Yield Tokenization Protocol]]"
auditors:
  - Tarun Bansal
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf"
genome:
  - "[[frontrun-exposure]]"
  - "[[direct-drain]]"
  - "[[fee-theft]]"
---
# Race condition in YT swap and index update can lead to loss of funds

- id: 57093
- impact: HIGH
- protocol: FIVA Yield Tokenization Protocol
- reporter: Tarun Bansal (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-05-FIVA-yieldtokenizationprotocol-securityreview.pdf

## Summary


The report describes a bug in the FIVA protocol where a race condition between token swap and contract index update messages can lead to loss of funds. The issue occurs when the index values stored in the Pool and YTMinter contracts are not the same, causing a difference in the expected amount of tokens minted. This can happen during updates to the index value, creating a window of vulnerability. The report recommends sending the index value between contracts in the short term and thoroughly analyzing the codebase in the long term to prevent similar issues.

## Details

## Difficulty: High

## Type: Data Validation

## Description

A race condition between the YT token swap messages and the Pool and YTMinter contract index update messages can lead to loss of funds. The FIVA Pool contract allows users to swap SY to YT tokens. The Pool contract does not hold YT tokens as liquidity; therefore, it mints new PT/YT tokens for swapping SY to YT.

When a user transfers SY tokens with the `swap_sy_for_yt` message, the Pool contract computes the amount of SY tokens needed to mint new PT/YT tokens:

```plaintext
;; sy_out is equal to amount of YT which will be sent to the user
(int sy_out, int protocol_fee) = swap_exact_sy_for_yt(jetton_amount, inv_before);
int yt_out = sy_out * storage::index / DIVIDER;
```

```plaintext
;; reserve amount of tons we had before message processing to prevent pool draining
raw_reserve(fee::min_tons_for_pool_storage, 4);
if (
    (yt_out < max(min_yt_out, MIN_SWAP_AMOUNT)) |
    (sy_out > (storage::total_supply_sy - storage::sy_locked - MINIMUM_LIQUIDITY))
) {
    send_sy_back(from_address, recipient_addr, jetton_amount, query_id, with_unwrap);
} else {
    storage::total_supply_sy -= (sy_out + protocol_fee);
    storage::total_supply_sy += jetton_amount;
    storage::collected_sy_protocol_fee += protocol_fee;
    
    ;; Pool will receive PT amount equal to YT_out in some time from YT minter
    storage::total_supply_pt += yt_out;
    storage::pt_locked += yt_out;
    
    ;; If swap decreases pool invariant, don't commit it and return jettons back
    if inv_before > invariant() {
        send_sy_back(from_address, recipient_addr, jetton_amount, query_id, with_unwrap);
    } else {
        int fwd_amount = fee::mint_pt_yt(fee::avg_fwd_fee);
        mint_py(sy_out, my_address(), recipient_addr, 0, fwd_amount, query_id, CARRY_REMAINING_BALANCE);
        save_data(SWAP_TYPE);
    }
}
```

**Figure 13.1:** A snippet of the `swap_sy_for_pt` message handler [contracts/AMM/markets/swaps.fc#L115-L142]

The Pool contract then computes the `yt_out` amount by dividing the computed `sy_out` amount by the `storage::index` value stored in the Pool contract. This `yt_out` is the expected amount of the YT and PT tokens that will be minted from the YTMinter contract by transferring out the `sy_out` amount of SY tokens. The Pool contract adds `yt_out` to the `storage::total_supply_pt` and `storage::pt_locked` values. The Pool contract transfers the `sy_out` amount of SY tokens to the YTMinter contract with the `mint_pt_yt` message in the `forward_payload`.

The YTMinter contract receives the SY tokens and computes the amount of PT/YT tokens to mint by multiplying the `storage::index` values stored in the YTMinter contract with the amount of SY tokens transferred. The YTMinter contract mints new YT tokens for the user and new PT tokens for the Pool contract. The YTMinter contract sends the `mint_notification` message with the PT tokens to the Pool contract to allow it to update the `storage::pt_locked` value.

```plaintext
storage::pt_locked -= min(jetton_amount, storage::pt_locked);
```

**Figure 13.2:** [contracts/AMM/markets/swaps.fc#L313-L313]

However, if the `storage::index` values stored in the Pool contract and the YTMinter contract are not the same, then the `yt_out` computed by the Pool contract will differ from the amount of PT tokens minted by the YTMinter contract. If the index is higher in the YTMinter than in the Pool contract, then a higher-than-expected amount of PT tokens will be minted to the Pool contract, which will remain stuck in the Pool contract because they are not added to the `storage::total_supply_pt` value. A race condition between the swap message and the index update message to the YTMinter and Pool contract can lead to the `storage::index` value difference and consequently a loss of funds.

This issue also affects the YT to SY token swaps, with a difference in the expected amount of redeemed SY tokens and the redeemed amount of the SY tokens.

## Exploit Scenario

The FIVA protocol administrator wants to update the index value stored in YTMinter and Pool contract from 1.1 to 1.2. The administrator sends the `update_minter_index` message to the YTMinter contract and then sends the `update_pool_index` message to the Pool contract. The YTMinter contract index is updated, but before the `update_pool_index` message reaches the Pool contract, it receives a `swap_sy_for_yt` message to swap 1,000 SY tokens to YT tokens. The Pool contract expects the YTMinter contract to mint 1,100 PT tokens, but it mints 1,200 PT tokens. The Pool contract adds only 1,100 PT tokens to the pool liquidity, and the remaining 100 PT tokens are stuck in the Pool contract.

## Recommendations

- **Short Term:** Send the `storage::index` value from the Pool contract to the YTMinter contract and from the YTMinter contract to the Pool contract. Additionally, update the pool reserves, considering changes in the `storage::index` value for the YT swap operations.

- **Long Term:** Analyze the codebase to document the assumptions that a value will remain in sync between multiple contracts, validate these syncing assumptions, and consider out-of-sync values when implementing features and test cases.
