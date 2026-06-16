---
tags:
  - lang/solidity
  - platform/halborn
  - has/poc
  - severity/high
  - sector/privacy
protocol: "[[Aptos Wallet]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest"
genome:
  - "[[missing-modifier]]"
  - "[[admin-takeover]]"
  - "[[access-roles]]"
---
# CONFIDENTIAL DATA ACCESSIBLE ON THE CLIPBOARD

- id: 50668
- impact: HIGH
- protocol: [[Aptos Wallet]]
- reporter: Halborn
- source: https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest

## Summary


This bug report is about a vulnerability in the Aptos wallet that could allow an attacker to access the user's mnemonic passphrase. This sensitive information can be obtained through a Python script or a malicious web page with clipboard access. The impact and likelihood of this vulnerability are both rated as 5, meaning it is a serious threat. The recommendation for fixing this issue is pending and the wallet may be at risk until the fixes are reviewed and implemented in a future version of the code.

## Details

##### Description

The `Aptos wallet` could allow an attacker to obtain the mnemonic passphrase from the clipboard storage. The attack paths could be considered local and remote. A Python script or other process could have access to the clipboard and obtain this sensitive information. Additionally, a malicious web page with clipboard access could be able to obtain the mnemonic passphrase and send it to the attacker.

[PoC video: Mnemonic phrase leaked from clipboard using python script](https://www.loom.com/share/b254a400af644ac3b66d939f61099bc3)

[PoC video: Mnemonic phrase leaked from clipboard using web browser](https://www.loom.com/share/4767a4e793564dd7aec5560bf07deba2)

##### Score

Impact: 5  
Likelihood: 5

##### Recommendation

**PENDING**: The `Pontem Network team` stated that the recommendation will be followed in a future version of the code. `Pontem Aptos Wallet` may be at risk until the fixes have been reviewed and deployed.
