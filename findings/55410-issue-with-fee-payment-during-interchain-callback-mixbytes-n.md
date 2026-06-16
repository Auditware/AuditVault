---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/bridge
  - sector/oracle
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#3-issue-with-fee-payment-during-interchain-callback"
genome:
  - "[[fee-accounting]]"
  - "[[flashloan-callback-auth]]"
  - "[[logic/fee-calculation]]"
  - "[[dos/temporary]]"
  - "[[known-pattern]]"
  - "[[cross-chain-message]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# Issue with Fee Payment During Interchain Callback

- id: 55410
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Multi%20Scope/README.md#3-issue-with-fee-payment-during-interchain-callback

## Summary


The report describes a bug in the `OracleRequestRecipient.handle()` function of the Spectra-interoperability contract. The bug is due to the `msg.value` parameter being missing in the call to `OracleTrigger.dispatch()`, causing `IMailbox(mailBox).dispatch()` to always fail. This breaks the core functionality of the contract and may require redeployment to fix. The report recommends adding `msg.value` to the call and developing a mechanism to pay the fee when calling `OracleRequestRecipient.handle()`.

## Details

##### Description
In the `OracleRequestRecipient.handle()` function the `msg.value` parameter is missing [in the call](https://github.com/diadata-org/Spectra-interoperability/blob/ed9f1e5ff3aa6cfba02d12f0bed1e435aeec24c1/contracts/contracts/OracleRequestRecipient.sol#L76) to `OracleTrigger.dispatch()`. As a result, `IMailbox(mailBox).dispatch()` will always revert, as the passed `msg.value` will be zero.

Also for the `OracleRequestRecipient.handle()` call to be executed with `msg.value > 0`, `Mailbox.process()` must also be called with `msg.value > 0`. This raises the question of how to ensure that relayers operate with an additional `msg.value`. It may be necessary to run custom relayers, but this approach seems suboptimal.

This issue has been assigned a **High** severity level because it breaks the core functionality of the `OracleRequestRecipient` contract, and the only way to fix it would be through a redeployment.

##### Recommendation
We recommend adding the `msg.value` to the call:
```solidity
IOracleTrigger(oracleTriggerAddress).dispatch{value: msg.value}(
    _origin, sender, key);
```  

Additionally, we recommend developing a mechanism to paying the fee when calling `OracleRequestRecipient.handle()`.
