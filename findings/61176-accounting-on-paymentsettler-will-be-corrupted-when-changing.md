---
tags:
  - lang/solidity
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
protocol: "[[Remora Pledge]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md"
genome:
  - "[[token-decimal-normalization]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# Accounting on `PaymentSettler` will be corrupted when changing `stablecoin` that is used to process payments

- id: 61176
- impact: HIGH
- protocol: Remora Pledge
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-04-cyfrin-remora-pledge-v2.0.md

## Summary


The bug report describes a problem with the `PaymentSettler` system where the accounting is affected when the stablecoin used for payments is changed to one with a different number of decimals. This issue was introduced in the latest update and was not present in the previous version. The impact of this bug is that the accounting will be incorrect and the recommended solution is to follow the recommendation for C-2. The bug has been fixed by the Remora team in recent commits and has been verified by Cyfrin.

## Details

**Description:** The accounting on the `PaymentSettler` will be initialized based on the decimals of the initial stablecoin that is used at the beginning of the system.
The system is capable of [changing the stablecoin that is used for the payments](https://github.com/remora-projects/remora-smart-contracts/blob/audit/Dacian/contracts/PaymentSettler.sol#L195-L198), and, when the stablecoin is changed for a stablecoin with different decimals, all the existing accounting will be messed up because the new amounts will vary from the existing values on the system.

This problem was introduced on the last change when the `PaymentSettler` was introduced to the system. On the previous version, the system correctly handled the decimals of the internal accounting to the decimals of the active stablecoin used for payments.

For example, 100 USD of fees that were generated while the stablecoin had 6 decimals would be only 1 USD if the stablecoin were changed to a stablecoin with 8 decimals.

**Impact:** Accounting on `PaymentSettler` will be corrupted when changing `stablecoin` to different decimals.

**Recommended Mitigation:** See recommendation for C-2.

**Remora:** Fixed in commits [a0b277f](https://github.com/remora-projects/remora-smart-contracts/commit/a0b277fe4a59354f3b3783c4b8c06eb60f5157610), [ced21ba](https://github.com/remora-projects/remora-smart-contracts/commit/ced21ba9758b814eb48a09a5e792aa89cc87e8f5).

**Cyfrin:** Verified.
