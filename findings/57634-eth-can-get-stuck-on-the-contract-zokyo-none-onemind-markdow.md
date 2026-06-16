---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - vuln/dependency/unchecked-return-value
  - novelty/variant
  - misassumption/external-call-is-safe
  - sector/vault
protocol: "[[Onemind]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md"
genome:
  - "[[unchecked-return-value]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[extcall-return-validation]]"
---
# ETH can get stuck on the contract.

- id: 57634
- impact: HIGH
- protocol: [[Onemind]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-10-18-Onemind.md

## Summary


This bug report is about an issue with a function called function_handleMintFee() in a file called FeePayer.sol. The problem is that the code does not check the returned value of a call, which can cause problems if an ETH transfer fails. This can result in ETH getting stuck in the contract's balance. The recommendation is to validate the returned value to prevent this from happening. The issue has been resolved by checking the returned value and also making sure that no ETH gets stuck if another function fails.

## Details

**Description**

FeePayer.sol: function_handleMintFee(), line 24.
The returned value of call() is not checked. In case of the failed ETH transfer, there is no exception and the transaction doesn not revert. Any transferred ETH gets stuck on the contract's balance.
Also, in case the call of 'IfeeOracle(_factoryAddress).mintFeeInfo()` fails, there is no exception as well, and ETH stays on contract. Though such a case is possible only when the deployer of the contract is not CollectionFactory.sol, it might still be possible that ETH will get stuck in such a scenario.

**Recommendation**

Validate the returned value of call() to be true.

**Re-audit comment**

Resolved.

Post-audit:
The returned value of call() is checked now. Also, in case IfeeOracle(_factoryAddress).mintFeeInfo()` fails, it is validated that msg.value equals 0 so that no ETH gets stuck.
