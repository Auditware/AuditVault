---
tags:
  - has/github
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[SSP Wallet, Relay And Key]]"
auditors:
  - Halborn
report: "https://www.halborn.com/audits/influx-technologies/ssp-wallet-relay-and-key"
genome:
  - "[[access-roles]]"
  - "[[insider]]"
---
# HAL-29 - HARCODED SECRETS IN GIT HISTORY

- id: 52587
- impact: HIGH
- protocol: SSP Wallet, Relay and Key
- reporter: Halborn
- source: https://www.halborn.com/audits/influx-technologies/ssp-wallet-relay-and-key

## Summary


This bug report discusses a potential issue with sharing code publicly or privately. It is possible for sensitive information, such as private keys and service account details, to be accidentally included in the code and accessible to others. This could lead to misuse of the information and compromise the security of the application and its infrastructure. The report provides proof of this issue and recommends measures to address it, such as removing the sensitive information from the code and using secure methods for storing and managing secrets. The team responsible for the code has confirmed that the identified credentials were only used for testing and not in production.

## Details

##### Description

Sharing code publicly or privately could lead to inadvertently leaving secrets in the code, making them accessible to others. Repositories are frequently cloned and forked into new projects, giving new developers access to their complete history. Any secrets within the repository's history would exist in all new repositories, and if stored in plain text, could lead to potential misuse of the secrets. In the case of a breach or unauthorized access to the source code, it could lead to further exploitation of infrastructure.

During the security assessment, it was identified that the application contained a hardcoded **Private Keys** and other service account details. Due to **public repositories**, any unauthorized access to the source code could potentially lead to the misuse of these hardcoded secrets, compromising the security and integrity of the application and its associated infrastructure.

##### Proof of Concept

* **Identified potential sensitive data in git history here:**  
  <https://github.com/RunOnFlux/ssp-relay/commit/d87f1360f9a5854197de4fc5955a916c7ecaabae#diff-977e7becf2c7fbcd18511d0723659f79c7efb748f53bcf2f2d482b8afe013b89>

***NOTE:*** *Further, test private keys and mnemonics were identified; confirmation was required that these were only used for testing purposes and never used anywhere else.*

* <https://github.com/RunOnFlux/ssp-wallet/blob/master/tests/lib/wallet.spec.ts>
* <https://github.com/RunOnFlux/ssp-key/blob/master/tests/lib/wallet.test.ts>

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

To address the identified risks, the following measures would be appropriate:

* Extracted hardcoded secrets from the source code and the repository's commit history.
* Changed and invalidated exposed secrets, rotate them with new, secure credentials.
* Employed environment variables, secret management solutions, or encryption for secure secret storage and management.

##### Remediation

**SOLVED:** The **InFlux Technologies team** confirmed that the credentials identified during the assessment were exclusively for testing purposes and were not used in production.
