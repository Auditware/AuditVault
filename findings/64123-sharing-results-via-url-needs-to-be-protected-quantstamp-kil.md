---
tags:
  - lang/solidity
  - sector/staking
  - platform/quantstamp
  - severity/high
  - novelty/variant
protocol: "[[Kiln]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html"
genome:
  - "[[missing-auth]]"
  - "[[event-manipulation]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# Sharing Results via Url Needs to Be Protected

- id: 64123
- impact: HIGH
- protocol: [[Kiln]] - Minitel
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html

## Summary


The report states that a tool has a client-side architecture with no backend, meaning it does not have a server to handle data. This creates a security risk as the tool allows users to share data through URL links without server-side validation or signing. This can be exploited by attackers to insert malicious content or bypass client-side checks. The recommendation is to not allow URLs to carry unvalidated data and to implement server-side signing to ensure the data is trusted and untampered. This will mitigate the risk of phishing and injection attacks.

## Details

**Update**
Acknowledged by the team with the following remark: "Client side architecture with no backend. Tool is read only (no transaction signing)"

**Description:** Allowing users to share data via URL parameters without server-side validation or signing introduces a significant security risk. URLs that contain raw or unvalidated data can be manipulated by attackers to inject malicious content, perform phishing attacks, or bypass client-side checks. Relying solely on client-side validation is insufficient, as it can potentially be bypassed and tricking users into executing unintended actions.

**Recommendation:** Do not allow URLs to carry raw, unvalidated data for sharing. If URL-based sharing is required, implement server-side signing of the data using a secret key or asymmetric cryptography. Each URL should include a signature (and optionally an expiry timestamp), which is verified server-side before rendering the data. This ensures that only trusted, untampered content is displayed, mitigating phishing and injection risks.
