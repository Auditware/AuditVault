---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/lending
protocol: "[[Dipcoin]]"
auditors:
  - "[[Hamed Mohammadi]]"
report: "https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[batch-item-auth]]"
  - "[[dos-resistance]]"
---
# Denial of Service in Several Functions Due to Object Limits

- id: 64770
- impact: HIGH
- protocol: [[Dipcoin]] Vault
- reporter: Hamed Mohammadi (Quantstamp)
- source: https://certificate.quantstamp.com/full/dipcoin-vault/287cb76f-d531-451c-b1ae-306a570c4ff3/index.html

## Summary


The client has marked the issue as "Fixed" and provided two code changes to address the problem. The issue is related to the `distribute_funds()` function in the `vault.move` file, which is used to distribute dividends to users. This function and others in the vault have the potential to cause problems due to their use of dynamic field accesses, which could be exploited by attackers or cause issues as the protocol grows. The report recommends removing the `distribute_funds()` function and refactoring the `close_vault()` and `set_vault_config_operator()` functions to use a different method for distributing funds and updating permissions.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `88027bf820e6052fa9ce956b543e6dd12bae7ebb`, `8036b79578ba123c2bf809cb68ce187d27685ab2`.

> The `distribute_funds()` function was identified for removal during the audit. The Dipcoin team confirmed that it had already been planned for removal prior to the initial report.

**File(s) affected:**`vault.move`

**Description:** There are several functions within the vault that perform various batch operations with potentially unbounded batch sizes.

1.   The `distribute_funds()` function (and by extension `close_vault()`, which calls it) iterates over the entire `vault.users` list to distribute dividends. Inside the loop, it performs two dynamic field accesses per user:

    *   `vault.user_positions.borrow(*user)`: Accesses the user's position in the Vault table.
    *   `bank.transfer(...)`: Accesses the user's account in the Bank table.

2.   The `set_vault_config_operator()` function iterates over all existing vaults to reset the operator address in their `SubAccounts`, which results in dynamic field accesses under the hood.

Any of these operations can be exploited by attackers or become problematic through natural protocol growth as new vaults are created and new users join.

Aside from the gas cost of these operations possibly exceeding gas limit constraints, Sui enforces a strict limit of 1,000 dynamic field accesses per transaction (see [Move Book](https://move-book.com/guides/building-against-limits/#maximum-number-of-dynamic-fields-accessed)). This means that any of these functions can easily reach this 1,000 dynamic field access limit and trigger denial-of-service (DoS) issues.

**Recommendation:**

1.   **Remove `distribute_funds()`**: As noted, users can simply withdraw to realize gains. Push-based token distribution is an anti-pattern.
2.   **Refactor `close_vault()`**: Instead of pushing funds to all users, `close_vault()` should simply set the vault state to `Closed`. Users would then claim their share of the remaining assets via a new `claim_closed_vault_funds()` function (pull pattern).
3.   **Refactor** the permission update logic in `set_vault_config_operator()` function to be asynchronous or paginated. Instead of updating all vaults in a single transaction, allow the operator to be updated in batches or implement a lazy update mechanism where permissions are checked and updated only when a vault is next interacted with.
