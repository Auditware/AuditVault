---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - platform/quantstamp
  - severity/high
  - impact/mev/frontrun
protocol: "[[NetMind]]"
auditors:
  - "[[Jennifer Wu]]"
report: "https://certificate.quantstamp.com/full/net-mind/e7dfdc3c-7589-4fc8-b3d8-4872c783a735/index.html"
genome:
  - "[[broken-logic]]"
  - "[[ownership-takeover]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
  - "[[vote-delegation-loop]]"
---
# Excessive Privileges for Wards

- id: 59206
- impact: HIGH
- protocol: [[NetMind]]
- reporter: Jennifer Wu (Quantstamp)
- source: https://certificate.quantstamp.com/full/net-mind/e7dfdc3c-7589-4fc8-b3d8-4872c783a735/index.html

## Summary


The client has reported a bug in the `Conf.sol` file where the `Conf.wards` mapping contains privileged addresses that can make changes to important protocol settings. This can be abused by a malicious address that has been granted this privilege. If this address is compromised, they can continuously front-run the removal of their privileges and delegate them to another address they own, giving them complete control over the protocol. The recommendation is to only allow this privilege to be managed by a separate, more secure role such as an owner.

## Details

**Update**
The client acknowledged the issue and provided the following explanation:

> This permission is exclusively held by the management contract, which requires voting to execute any operation.

**File(s) affected:**`Conf.sol`

**Description:**`Conf.wards` is a mapping containing privileged addresses that can invoke `Conf.file()` to assign values to crucial protocol state such as contract addresses, privileged executors, and fees. Additionally, any privileged `ward` has the ability to `rely()` or `deny()` another address to be either included or removed from this privileged mapping. This is an excessive privilege that can be abused by a single malicious `ward`.

Consider if a `ward` address was compromised and needs to have their privileges removed, which means the `deny()` function has to be invoked. This malicious ward could, in theory, never be denied privilege by continuously front-running the `deny()` transaction with a `rely()` transaction to delegate that privilege to another address they own. Further, this compromised ward could deny every other ward in the system, becoming the sole entity that can configure the protocol and reconfigure all protocol values to something malicious.

**Recommendation:** Instead of allowing for `wards` to deny or rely other wards, consider only allowing that functionality to happen from a separate privileged role, such as an owner.
