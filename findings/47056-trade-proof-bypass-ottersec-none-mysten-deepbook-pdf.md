---
tags:
  - lang/move
  - platform/ottersec
  - severity/high
  - sector/vault
protocol: "[[DeepBook]]"
auditors:
  - "[[Robert Chen]]"
report: "https://mystenlabs.com/"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[cross-contract-state-consistency]]"
---
# Trade Proof Bypass

- id: 47056
- impact: HIGH
- protocol: [[Mysten Deepbook]]
- reporter: Robert Chen (OtterSec)
- source: https://mystenlabs.com/

## Summary


The report discusses a bug in the code for transferring assets between a vault and a BalanceManager. The function responsible for this transfer, vault::settle_balance_manager, has a critical check that verifies the legitimacy of the transaction using a trade_proof. However, the code does not always properly utilize this trade_proof, allowing for the possibility of fake trade_proofs being used to bypass verification and submit fake transactions. The report recommends a fix to ensure that the trade_proof is always properly validated, and notes that this issue has been resolved in a recent code update.

## Details

## Vault Settle Balance Manager

The `vault::settle_balance_manager` is responsible for transferring assets between the vault and a `BalanceManager`. A critical check is the verification of the `trade_proof` to ensure the legitimacy of the transaction. The function checks if there is a difference between the `balances_out` and `balances_in` for each asset type (base, quote, and DEEP). If a difference exists, it performs the corresponding balance transfer and utilizes the `trade_proof` during this process.

```rust
> _vault.moverust
public(package) fun settle_balance_manager<BaseAsset, QuoteAsset>(
    self: &mut Vault<BaseAsset, QuoteAsset>,
    balances_out: Balances,
    balances_in: Balances,
    balance_manager: &mut BalanceManager,
    trade_proof: &TradeProof,
) {
    if (balances_out.base() > balances_in.base()) {
        let balance = self.base_balance.split(balances_out.base() - balances_in.base());
        balance_manager.deposit_with_proof(trade_proof, balance);
    };
    if (balances_out.quote() > balances_in.quote()) {
        let balance = self.quote_balance.split(balances_out.quote() - balances_in.quote());
        balance_manager.deposit_with_proof(trade_proof, balance);
    };
    [...]
}
```

If `balances_out` equals `balances_in` for all three asset types, none of the above conditions will be met, and no balance transfers will occur. As a result, the `trade_proof` is never utilized, effectively bypassing its verification. Thus, anyone may craft a fake `trade_proof` and call `settle_balance_manager` with equal `balances_out` and `balances_in` in order to avoid proof validation and submit a fake `trade_proof`.

## Remediation
Ensure that the `settle_balance_manager` unconditionally validates the `trade_proof`, regardless of whether assets are transferred or not.

---

© 2024 Otter Audits LLC. All Rights Reserved. 9/27  
Mysten Deepbook Audit 04 - Vulnerabilities  
Patch resolved in PR #185.  
© 2024 Otter Audits LLC. All Rights Reserved. 10/27
