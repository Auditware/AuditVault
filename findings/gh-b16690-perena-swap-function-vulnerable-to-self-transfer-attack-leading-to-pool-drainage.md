---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - novelty/variant
  - sector/dex
  - check/swap-account-validation
protocol: "[[Perena]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[missing]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[swap-account-validation]]"
---
3.1.3
Swap Function Vulnerable to Self-Transfer Attack, Leading to Pool Drainage
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the swap_out() function, there is a critical vulnerability in the transfer operation for the
input asset. The function does not properly validate the input accounts, which allows an attacker to ma-
nipulate the transaction to perform a self-transfer while still receiving tokens from the reserve.
The root cause is the swap_out() function accepts user-provided accounts without validating that:
1. The user_info account is actually the user's wallet and not the bank_info account.
2. The input_user_ata account is actually the user's associated token account and not the bank's re-
serve account (input_reserve_info).
This allows an attacker to construct a transaction where they provide the bank_info as the user_info
and the reserve account as the input_user_ata. When this happens, the ﬁrst transfer effectively moves
tokens from the reserve back to itself (a no-op) instead of moving tokens from the attacker to the reserve
as intended, while the second transfer still sends the output tokens to the attacker.
Since no actual input tokens are transferred from the attacker, they can execute this attack repeatedly to
drain all tokens from the output reserve without providing any input tokens in return.
Recommendation: Implement proper account validation before performing transfers. This should in-
clude:
1. Verify that user_info is the signer of the transaction.
2. Verify input_user_ata and output_user_ata are valid ATAs owned by user_info (This should apply
to all mint, burn, and swap functions).
3. Add checks that input and output accounts are distinct to prevent self-transfers (This should apply
to all mint, burn, and swap functions).
[[Perena]]: Fixed in PR 43.
Cantina Managed: Veriﬁed.
