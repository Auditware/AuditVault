---
tags:
  - lang/move
  - platform/halborn
  - has/github
  - severity/high
  - sector/wallet
protocol: "[[Aptos Wallet]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# UN-ENCRYPTED USER PASSWORD IN-MEMORY

- id: 50673
- impact: HIGH
- protocol: [[Aptos Wallet]]
- reporter: Halborn
- source: https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest

## Summary


This bug report discusses a vulnerability found in the Windows version of the Pontem Aptos Wallet. This vulnerability allows an attacker who has compromised a user's machine to access and steal the user's wallet password. The issue is caused by the fact that the mnemonic phrase is not encrypted in the wallet's memory. This means that the plain text password is available in memory during different scenarios, making it easy for an attacker to access it. The report suggests that this issue may also exist on Linux and MacOS, but the focus is on the Windows platform. The report includes a screenshot of the memory dump file, which clearly shows the plain text mnemonic phrase. The impact and likelihood of this vulnerability are both rated as 5 out of 5. The report recommends that the Pontem Network team should encrypt the plain text password in a future version of the code to prevent this vulnerability. A GitHub Pull Request has been made to address this issue. Until the fix is implemented, the Pontem Aptos Wallet may be at risk.

## Details

##### Description

The mnemonic phrase in the wallet is not encrypted in memory. As a result, an attacker who has compromised a users' machine can exfiltrate and steal users' wallet password.

This report only contains the vulnerabilities found within the Windows platform. The number of ways to exploit this on Windows were trigger than on Linux and MacOS. If the memory issues are fixed on the Windows platform, they will automatically also cater for those on Linux and MacOS.

The plain text user password is available in memory during various scenarios. Memory dumps were taken throughout the testing process. These memory dumps contained an exact replica of what was in memory while the application was open.

Making use of the `strings` tool on Linux, a search through the memory dump file revealed the plain text mnemonic phrase.

![User wallet password leaked from Chrome memory dump](https://halbornmainframe.com/proxy/audits/images/659ea0baa1aa3698c0eb7c15)

##### Score

Impact: 5  
Likelihood: 5

##### Recommendation

**PENDING**: The `Pontem Network team` stated that the recommendation will be followed in a future version of the code. `Pontem Aptos Wallet` may be at risk until the fixes have been reviewed and deployed.

Several improvements in the password's encryption were made in the following GitHub Pull Request:
[[Wallet] APT-757. Encrypt plain text password #297](https://github.com/pontem-network/pontem-pitaka/pull/297)
