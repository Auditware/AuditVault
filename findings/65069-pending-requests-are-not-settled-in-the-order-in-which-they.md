---
tags:
  - lang/move
  - sector/lending
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Franklin Templeton Aptos Money Market Fund]]"
auditors:
  - "[[Jaime Iglesias]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[liquidation-manipulation]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
---
# Pending requests are not settled in the order in which they were created

- id: 65069
- impact: HIGH
- protocol: [[Franklin Templeton Aptos Money Market Fund]]
- reporter: Jaime Iglesias (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2024-10-franklintempleton-aptos-securityreview.pdf

## Summary


The bug report is about an issue in a fund management system where user requests are processed in the wrong order, leading to unexpected behavior. This can cause problems for users, as seen in the example of Alice who ends up with a failed request because of this bug. The report suggests a temporary solution of processing requests in the order they were created, while also recommending implementing additional tests to prevent this issue in the future.

## Details

## Diﬃculty: Low

## Type: Undefined Behavior

### Description
Users can interact with the fund by creating different requests (e.g., requesting a share purchase or a liquidation). However, during the settlement of the requests, they are processed backward (i.e., from newest to oldest) instead of being executed in the order the user created them. This issue can lead to unexpected behavior.

```plaintext
1127    fun process_settlements(
1128       account: address,
1129       date: u64,
1130       price: u64,
1131       memo: String,
1132    ) acquires ManagedShareHolders, FundManagement {
1133       only_when_account_exists(account);
1134
1135       let fund = borrow_global<FundManagement>(@ft_funds);
1136       let managed = borrow_global_mut<ManagedShareHolders>(@ft_funds);
1137       let shareholders = &mut managed.shareholders;
1138       let shareholder = smart_table::borrow_mut(shareholders, account);
1139       let resource_signer = &account::create_signer_with_capability(&fund.resource_signer_cap);
1140
1141       only_max_size_batch(vector::length(&shareholder.request_ids), MAX_BATCH_SIZE);
1142
1143       while (!vector::is_empty(&shareholder.request_ids)) {
1144           let request_id = vector::pop_back<u64>(&mut shareholder.request_ids);
```
Figure 9.1: `process_settlements` function in `fund_token.move#L1127–L1144`

As shown in the figure above, requests are removed from the vector of pending requests using the `pop_back` function, which removes and returns the last element of the vector.

### Exploit Scenario
Alice, a user of the fund who currently owns five shares, creates a number of requests during the day:
1. She makes a cash purchase of 10 shares.
2. She transfers some shares to another shareholder.
3. She requests a partial liquidation of 11 shares.

When Alice’s requests are processed at the end of the day, the first request that will be fulfilled will be the partial liquidation, which will fail because Alice has only five shares at the moment of fulfillment.

### Recommendations
- Short term, process requests in the order in which they were created.
- Long term, implement additional unit tests to check that the pending requests are processed in the order in which they were created.
