---
tags:
  - lang/solidity
  - sector/governance
  - sector/liquid-staking
  - platform/mixbytes
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Lido]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Lido/In-protocol%20Coverage/README.md#1-possibility-of-taking-burned-shares"
genome:
  - "[[griefing]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Possibility of taking burned shares

- id: 28161
- impact: HIGH
- protocol: [[Lido]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Lido/In-protocol%20Coverage/README.md#1-possibility-of-taking-burned-shares

## Summary


A bug has been found in the Lido DAO’s SelfOwnedStETHBurner.sol contract which allows attackers to take burned shares profit without taking shares before the processLidoOracleReport() execution. This exploit is outlined in a gist by georgiypetrov. It is possible that this is a front-run attack, which would be the most convenient for the attacker. 

In order to fix this bug, it is recommended to add a limit on the amount of burned tokens. This would prevent the attacker from taking advantage of the bug and protect the users of the Lido DAO.

## Details

##### Description
With attack it is possible to take burned shares profit even without taking shares before `processLidoOracleReport()` execution.
https://github.com/lidofinance/lido-dao/blob/ee1991b3bbea2a24b042b0a4433be04301992656/contracts/0.8.9/SelfOwnedStETHBurner.sol#L252
This exploit shows how the attack is done:
https://gist.github.com/georgiypetrov/22c0649058a97102e2fd97a1c619a3b3
If this is a front-run attack, then it will be the most convenient for the attacker.
##### Recommendation
It is necessary to add a limit on the amount of burned tokens.
