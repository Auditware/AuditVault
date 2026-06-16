---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/staking
protocol: "[[Consortium]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/lombard/consortium"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# Lack Of Slashing/Penalty Mechanism

- id: 52081
- impact: HIGH
- protocol: [[Consortium]]
- reporter: Halborn
- source: https://www.halborn.com/audits/lombard/consortium

## Summary


This report highlights a concern with the current implementation of a Threshold Signature Scheme (TSS) that uses a consensus mechanism called Dragonboat. The issue is that there is no penalty or slashing mechanism in place to discourage nodes from acting maliciously within the network. This could lead to disruptions or failures in critical operations. The report recommends implementing a mechanism where nodes can report malicious behavior and the majority can confirm and penalize the offending node. The team has accepted the risk and states that they have a contractual framework in place to address any malicious activity.

## Details

##### Description

In the current implementation of a Threshold Signature Scheme (`TSS`) that communicates through a consensus mechanism (`Dragonboat`), there is a notable absence of slashing or penalty mechanisms for nodes that act maliciously within the network. This gap is particularly concerning given the vulnerabilities identified in previous issues, such as "`Malicious Messages Can Clear Consensus State`". In that issue, it was highlighted that malicious nodes could exploit the error handling in consensus processes to force nodes to clear their current consensus state, effectively causing a denial-of-service (DoS) attack on the network.

The `TSS` relies on a subset of nodes (signers/players) to collaboratively generate signatures on transactions or other data, making it critical that all participating nodes adhere strictly to the protocol. However, without a mechanism to penalize nodes for behaviors that deviate from the expected protocol (such as sending incorrect or malicious data that leads to consensus failure), there is little deterrent against such actions. This lack of penalties could lead to scenarios where malicious or faulty nodes disrupt the TSS process, causing delays, incorrect signing, or complete failure of critical operations.

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:L/D:N/Y:N (8.1)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:H/I:L/D:N/Y:N)

##### Recommendation

It is recommended to implement a penalty and slashing mechanism based on collective node reporting in a decentralized manner. Nodes that receive erroneous or incorrect messages from peers participating in the consensus process should have the capability to report such behaviors to the broader network. If a consensus majority confirms the reported misbehavior, the mechanism should then enact penalties such as temporary suspension or permanent expulsion of the offending node from the consensus process. This system of checks and balances will ensure that all participating nodes adhere strictly to protocol rules, thereby enhancing the integrity and reliability of the entire network. Bear in mind that, the implementation of this mechanism would require careful design to ensure that it cannot be misused for competitive or malicious purposes against honest nodes.

### Remediation Plan

**RISK ACCEPTED:** The **Lombard team** accepted the risk of this issue with the following statement:

```
While we currently do not have a technical slashing mechanism in place, our network operates within a permissioned environment with carefully vetted validators. Any malicious activity would be addressed through the enforcement of our contractual agreements, ensuring the immediate removal of any offending validators. This contractual framework provides a strong layer of security, maintaining the integrity and trustworthiness of the consortium.
```
