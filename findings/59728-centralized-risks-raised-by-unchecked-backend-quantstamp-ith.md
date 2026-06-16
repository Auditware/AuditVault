---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/perpetuals
protocol: "[[Ithaca Finance]]"
auditors:
  - "[[Mustafa Hasan]]"
report: "https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html"
genome:
  - "[[centralization]]"
  - "[[role-bypass]]"
  - "[[cross-contract-state-consistency]]"
---
# Centralized Risks Raised by Unchecked Backend

- id: 59728
- impact: HIGH
- protocol: [[Ithaca Finance]]
- reporter: Mustafa Hasan (Quantstamp)
- source: https://certificate.quantstamp.com/full/ithaca-finance/8cacdbf3-9f47-4135-854d-1d004abad065/index.html

## Summary


The client has acknowledged the issue and the team is working on providing additional documentation for users. The problem is related to the Ithaca finance system, which relies heavily on an off-chain system called Java backend. This makes it possible for the backend admin to control the process without proper monitoring, leading to potential centralized risk. The team is recommended to disclose the backend workflow and potential risks in the user-facing documentation.

## Details

**Update**
Marked as "Acknowledged" by the client. The team provides proper justification, and will provide additional user-facing documentation. The client provided the following explanation:

> The backend will have extensive documentation in regards to when and how the fund movements occur, and an attestation process of these flows is planned

**File(s) affected:**`contracts/`

**Description:** The proper function of the Ithaca finance system heavily relies on the off-chain system, especially the Java backend to track the settlement progress. In particular, the client balance update and fund movements are not fully handled on-chain, making it possible for the backend admin to control the whole process without proper monitoring in place.

**Recommendation:** In accordance with the documentation issue, we recommend the team to disclose the detailed backend workflow to ensure that the fund movement process is well designed, managed and logged. Declare the potential centralized risk in the user-facing documentation.
