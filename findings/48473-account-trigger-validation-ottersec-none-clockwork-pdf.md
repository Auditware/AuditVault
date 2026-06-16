---
tags:
  - platform/ottersec
  - lang/rust
  - severity/high
  - sector/infra
protocol: "[[Clockwork]]"
auditors:
  - "[[Maher Azzouzi]]"
report: "https://www.clockwork.xyz/"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
---
# Account Trigger Validation

- id: 48473
- impact: HIGH
- protocol: [[Clockwork]]
- reporter: Maher Azzouzi (OtterSec)
- source: https://www.clockwork.xyz/

## Summary


The bug report states that there is an issue with the account trigger validation for threads. The code is supposed to compare the calculated hash of the account data with the prior data hash, but it is not doing so. This means that threads relying on account triggers can be repeatedly invoked even if the account data has not changed. The suggested solution is to verify that the data hash is different from the previous data hash. This bug has been resolved in the patch 831a4c2.

## Details

## Account Trigger Validation Issue

Account trigger validation for threads doesn’t work as intended. While the code calculates the hash of the account data, it does not actually compare this calculated value against the prior data hash.

## Code Snippet

```rust
match exec_context.trigger_context {
    TriggerContext::Account {
        data_hash: prior_data_hash,
    } => {
        prior_data_hash.hash(&mut hasher);
        hasher.finish()
    }
}
```

As a result, threads that rely on account triggers could be repeatedly invoked, even if the underlying account data did not change.

## Remediation

Verify the account’s data hash is different than the previous data hash.

## Code Snippet

```rust
require!(
    data_hash.ne(&prior_data_hash),
    ClockworkError::TriggerNotActive
)
```

## Patch

Resolved in commit `831a4c2`.
