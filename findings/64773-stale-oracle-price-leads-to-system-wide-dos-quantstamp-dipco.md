---
tags:
  - lang/solidity
  - sector/oracle
  - sector/perpetuals
  - platform/quantstamp
  - severity/high
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - fix/add-check
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[stale-price]]"
  - "[[known-pattern]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[oracle-freshness]]"
  - "[[pyth-oracle-completeness]]"
---
# Stale Oracle Price Leads to System-Wide DoS

- id: 64773
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The client has reported a bug where the system is dependent on oracle prices, causing the entire market to be unable to conduct transactions if the oracle becomes stale. This affects all users of the system, freezing deposits, withdrawals, and financial management. The recommendation is to allow the protocol manager to temporarily pause or suspend affected markets and modify the NAV calculation to handle this state. Alternatively, not using oracle prices for NAV calculations would be a better solution.

## Details

**Update**
Marked as "Mitigated" by the client. Addressed in: `9751237437bb737c7ccc3057ce4edc0e0e5efa21`. The client provided the following explanation:

> Currently, our system is highly dependent on oracle prices. If the oracle of a certain market is stale, the entire market will be unable to conduct transactions, and calculating position values based on this state will be meaningless. In such a case, the best approach is to suspend the corresponding operations(deposit, withdraw, etc.). Meanwhile, we have also made a modification to skip price updates for markets with no open positions, thereby avoiding being affected by irrelevant stale markets.

**File(s) affected:**`vault.move`

**Description:** The vault requires that NAV be calculated using fresh prices for every single perpetual market in the system before any financial operation can proceed. If the oracle for even one, potentially minor, market becomes stale (older than 60 seconds), the `pyth::get_price_older_than` call reverts, causing the entire transaction to fail. This effectively freezes all deposits, withdrawals, and financial management for every user of the vault, regardless of whether their funds are involved with the affected market.

**Recommendation:** The protocol manager should have the ability to temporarily mark a specific perpetual market as "paused" or "suspended" if the oracle is unresponsive. The NAV calculation should then be modified to gracefully handle this state, for instance, by calculating the NAV based only on the remaining active markets and temporarily disallowing interactions that would be affected by the paused market. As mentioned in **[DIP-5](https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html#findings-qs5)**, a better solution would be not to use oracle prices for NAV calculations altogether.
