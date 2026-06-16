---
tags:
  - lang/solidity
  - sector/account
  - sector/oracle
  - sector/stable
  - sector/vault
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/first-deposit
  - trigger/sandwich-attack
protocol: "[[AFI Vault]]"
auditors:
  - "[[Paul Clemson]]"
report: "https://certificate.quantstamp.com/full/afi-vault/dc8a68ae-e72b-4b63-bef2-544c709f6fda/index.html"
genome:
  - "[[oracle/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[first-deposit]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
  - "[[token-decimal-normalization]]"
---
# Oracle Updates Are Vulnerable to Sandwich Attacks

- id: 64132
- impact: HIGH
- protocol: [[AFI Vault]]
- reporter: Paul Clemson (Quantstamp)
- source: https://certificate.quantstamp.com/full/afi-vault/dc8a68ae-e72b-4b63-bef2-544c709f6fda/index.html

## Summary


The client has marked a bug as "Fixed" in their system. The issue was related to the cooldown period and maximum deposit limit in the `afiVault` contract, which is used for exchanging shares to assets. This allowed attackers to front-run oracle updates and withdraw at the new exchange rate, draining the pool. The bug has been fixed in multiple code updates and the affected files are `src/afiVault.sol` and `src/Oracle.sol`. The report also provides a scenario where a malicious user could exploit this bug and recommends some possible solutions to mitigate this attack. These include disallowing deposits and withdrawals from the same user in the same block, using MEV protection bundlers, enforcing a minimum deposit time, and setting a realistic maximum deposit amount. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `3afeff0f397341e6746941897be228378090cbc3`. The client provided the following explanation:

> The cooldown period enforces a minimum time between deposit and withdrawal,\npreventing attackers from front-running oracle updates and immediately withdrawing\nat the new exchange rate. The maximum deposit limit caps the potential profit\nfrom such attacks.

Additional fixes in `8c91d24a67ce84883ca9868935beb3e43d4df918` and `8bcce6dae5362777c84948df542d8f66677af9f7`

**File(s) affected:**`src/afiVault.sol`, `src/Oracle.sol`

**Description:** While the exchange rate of typical ERC-4626 vaults changes in a linear fashion, the `afiVault` uses an oracle price mechanism where the shares-to-assets exchange rate increases in a stepwise manner. This leads to a scenario where the malicious user can sandwich the call to `Oracle.updateExchangeRate()`, first depositing into the vault at the old exchange rate, then immediately withdrawing after at the new exchange rate, effectively draining the pool.

**Exploit Scenario:**

 Consider the following scenario:

*   The shares to asset exchange rate of the pool is 1:1 (ignoring decimal precision) 
*   The balance of the pool is 100,000 USDT 
*   Alice sees an `updateExchangeRate()` call in the mempool that will increase the exchange rate to 1.01 (an increase of 1%) 
*   Alice frontruns this transaction, depositing 1,000,000 USDT while the rate is still 1:1 
*   The `updateExchangeRate()` transaction successfully changes the exchange rate 
*   Alice's second transaction immediately sells her 1,000,000 share tokens for 1,010,000 USDT. Here, she immediately profited 10,000 USDT and reduced the overall balance of the pool to 90,000 USDT

**Recommendation:** Some possible mitigations to mitigate the possibilities of this attack vector are as follows:

*   Consider disallowing the same user to make deposits and withdrawals within the same block 
*   Consider making calls to `updateExchangeRate()` via an MEV protection bundler, such as flashbots 
*   Consider enforcing a minimum deposit time of at least `Oracle.updateCooldown`
*   Consider setting some realistic `maxDeposit()` amount to reduce the maximum profitability of such an attack
