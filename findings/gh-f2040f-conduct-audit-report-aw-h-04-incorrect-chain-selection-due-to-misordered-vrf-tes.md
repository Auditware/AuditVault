---
tags:
  - lang/solidity
  - platform/auditware
  - severity/high
  - sector/infra
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[weak-randomness]]"
---
# **AW-H-04: Incorrect Chain Selection Due to Misordered VRF Test Hash Comparison** {#aw-h-04:-incorrect-chain-selection-due-to-misordered-vrf-test-hash-comparison}

**Severity:** *High* 									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/consensus/chain\_selection.rs\#L184-L186](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/consensus/chain_selection.rs#L184-L186) 

**Description:**  
The **standard\_chain\_selection** function is part of the chain selection process in a blockchain protocol. It determines which of two competing block headers should be selected based on predefined rules.

Other than height and slot comparisons, the function compares the VRF test hash values of the block headers.

As stated in [this comment](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/consensus/chain_selection.rs#L155-L155), If slots are equal, the function should choose the chain with the lower VRF test hash value. However, during the audit it was found that when **y\_i** is bigger than **x\_i** (effectively meaning **x\_i** has the lower VRF hash value), **Y\_STANDARD** is being chosen instead of **X\_STANDARD**.

Incorrect chain selection can lead to network instability, as the chain with the higher VRF test hash value may be selected over the intended chain. This can cause forks and reduce the overall security and reliability of the blockchain network.

**Recommendations:**

* Ensure that the intended chain (the one with a lower VRF hash value) is being selected on **standard\_chain\_selection**:  
     if y\_i \> x\_i {  
   \-      return Ok(ChainSelectionOutcome::Y\_STANDARD);  
   \+      return Ok(ChainSelectionOutcome::X\_STANDARD);  
     }
