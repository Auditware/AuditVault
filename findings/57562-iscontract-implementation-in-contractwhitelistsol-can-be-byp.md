---
tags:
  - lang/solidity
  - platform/zokyo
  - has/github
  - severity/high
  - sector/account
  - sector/multisig
  - sector/staking
protocol: "[[Umami]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md"
genome:
  - "[[fake-account-substitution]]"
  - "[[role-bypass]]"
  - "[[reward-accounting]]"
---
# `isContract` implementation in ContractWhitelist.sol can be bypassed.

- id: 57562
- impact: HIGH
- protocol: [[Umami]]
- reporter: zokyo (Zokyo)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2022-09-07-Umami .md

## Summary


The bug report discusses a vulnerability in the ContractWhitelist.sol code that allows attackers to bypass the isContract function during the constructor call. This can lead to attackers being able to stake tokens without being detected. The recommendation is to monitor other entry points and take measures to prevent this. The issue has been resolved by a partner, but it has introduced a limitation on the operation where investors cannot use Multisig. The Impersonator issue has been fixed, but the attack is still possible.

## Details

**Description**

ContractWhitelist.sol - unfortunately, the implementation of isContract can be surpassed by an attacker as contract does not show up the containment of code during constructor call. In the PoC tests, ImpersonatorFactory does just that: a factory of contracts (Imperso

**Recommendation**

f the attacker could not be discovered during stake, s/he can be discovered in other entrypoints like addToContractWhitelist or withdraw. In that sense, if a contract is discovered to have staked tokens without being added to the whitelist (and not removed priorly by admin) then the suitable measure might be taken to deincentivize that.

**Re-audit comment**

Resolved.

fix#1 - Resolve attempt done by partner but in a way that introduced a limitation on operation. Investors cannot use Multisig. The Impersonator issue though is solved and this attack is now mitigated.
