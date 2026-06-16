---
tags:
  - lang/solidity
  - sector/bridge
  - sector/options
  - sector/staking
  - platform/quantstamp
  - severity/high
  - novelty/variant
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# Relayer Can Submit Undisputable Evidence for L2->L1 Trades

- id: 60328
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


The bug report explains that there is a problem with the withdrawal process on the Pheasant Network Bridge. The issue has been fixed, but there is a new issue where a relayer can withdraw assets with incorrect evidence. This is because there is no validation of the block number, which means that a relayer can submit evidence from a block that is too old or too far in the future. This can lead to fraudulent withdrawals and potentially harm other users. The report recommends implementing a validation process for the block number to prevent this issue.

## Details

**Update**
The issue is fixed due to a shift of responsibility. Now, the relayer has no reason to submit evidence with a wrong block hash because he will get slashed when he will have to defend himself.

![Image 63: Alert icon](https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/static/media/info-icon-alert.3c9578483b1cf3181c9bfb6fec7dc641.svg)

**Update**
Addressed in: `64a96f0bec95007790f91ab71b054b38eb0e101a`. The client provided the following explanation:

> In the past implementation, a relayer can withdraw asset with an unslashable evidence. The main obstacles for this problem is that we conduct verification process with the submitted evidence by the relayer and we could not add validation for these evidence such as blocknumber validation into our contract because of the different implementation of `block.number` in each L2s. To tackle with this problem, we changed disputing process and separate this into three parts.
> 
> 
> *   dispute
> *   Executed by anyone who realize malicious acts by a relayer and they will be a disputer. Disputer need to deposit some amount of asset when they execute this function to prevent DoS like attack agaist a relayer.
> *   defence
> *   The relayer need to prove their submitted evidence in certain amount of time, we set this period 3 hours as default for now. Since they need to prove their submitted evidence by themselves, they need to withdraw with a provable evidence.
> *   If the relayer succeed in defence, they can earn deposited asset by disputer.
> *   slash
> *   In these two conditions, the disputer is able to execute this function and get the relayer's bond.
> *   Passed `defencePeriod`, which is 3 hours for now, after they execute dispute function
> *   Failed defence by a relayer. With this separation, a relayer need to prove their submitted evidence by themselves in certain amount of time when someone dispute their trades, hence they need to submit provable evidence when they withdraw assets and we can solve those problems in withdrawal process and specifications of each L2s.

**File(s) affected:**`PheasantNetworkBridgeChild.sol`

**Description:** When the relayer calls the function `withdraw()` for accepting an L2->L1 trade, they submit the `evidence` struct in the `calldata` of the function call. This evidence is, however, not put to much of a test, as the bridge is optimistic, and the relayer is assumed to be honest.

In order for this evidence to be disputable, disputers must have the option to submit the L1 block hash of the transaction contained in the evidence, or else the evidence cannot be verified.

However, there are currently no checks in place assuring that the submitted evidence is from a sufficiently fresh block. So technically, a relayer could forge malicious evidence of a transaction of more than 256 blocks ago. This is mainly a problem for the L2->L1 trades, as the relayer can potentially withdraw deposits of other users with evidence of a made up L1-transaction that is indisputable.

In theory, relayers can also submit fraudulent evidence with a block number that is more than `SLASHABLE_PERIOD` in the future, making the transaction unslashable, as no block hash can be forwarded on time. Technically, more than 3 hours in the future would be sufficient, as this gives the relayer enough time to withdraw their bond assets under the current design.

**Recommendation:** The block number has to be validated before accepting evidence from the relayer.
