---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/shieldify
  - has/github
  - severity/high
  - precondition/insider
protocol: "[[Hlos]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md"
genome:
  - "[[secret-exposure]]"
  - "[[role-bypass]]"
  - "[[insider]]"
  - "[[access-roles]]"
---
# [H-01] Logging of Private Key / Printing Secrets

- id: 65050
- impact: HIGH
- protocol: [[Hlos]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md

## Summary


The code in the files "perps/views.py" and "spot/views.py" contains a bug that can reveal sensitive information. The code includes print statements that output private keys, which are important credentials for blockchain wallets. If this code is run in an environment that logs output, the private key can be accessed by anyone with access to the logs. This can lead to full control of the wallet and account. The bug has been fixed by removing the print statements that reveal keys or secrets. It is recommended to remove these statements before deploying the code to production. 

## Details


## Severity

High Risk

## Description

The code contains `print(exchange.wallet._private_key)` and multiple `print(...)` statements that output sensitive info.

If the service runs in an environment logging stdout/stderr (systemd, container logs, cloud logs), the private key will be written to logs. Anyone with access to logs (or backups of logs) can retrieve the raw private key and take full control of that wallet/account.

Private keys are the ultimate credentials for blockchain wallets, printing them is equivalent to storing them in plain logs.
This finding refers to OWASP: A02 – Cryptographic Failures / Sensitive Data Exposure.

**Vulnerable Scenario:**
Vulnerable code (examples found in repo):

```python
print(exchange.wallet._private_key)
print(exchange.account_address)
## many other prints of responses like `print(order_result)` or `print(response)`
```

## Location of Affected Code

File: [perps/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/perps/views.py)

File: [spot/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/spot/views.py)

## Impact

Full compromise of the blockchain account/wallet used by the app. An attacker can sign arbitrary transactions, withdraw funds, and impersonate the service on the chain.

## Recommendations

Remove any print statements that reveal keys or secrets before going to production.

## Team Response

Fixed.
