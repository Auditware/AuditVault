---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/infra
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# **AW-H-03: Single Point of Failure in Messenger Server** {#aw-h-03:-single-point-of-failure-in-messenger-server}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/p2p/messenger/server.rs\#L89-L103](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/p2p/messenger/server.rs#L89-L103)

* [crates/protocol/src/p2p/messenger/client.rs\#L36-L36](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/p2p/messenger/client.rs#L36-L36)  

**Description:**  
During the audit it was found that the **MessengerServer** implementation uses a single **TcpListener** to accept incoming connections.

This creates both a centralization concern and a single-point-of-failure, appearing as a bad implementation decision for the protocol.

An attacker flooding the server with connection requests should trivially be able to lead to a DoS attack and disrupt the entire p2p protocol.

**Recommendations:**

* Consider using a distributed architecture to eliminate the single point of failure.  
* Implement load balancing to distribute incoming connections across multiple instances of the server.  
* Implement rate limiting to prevent a single client from overwhelming the server with connection requests.  
* Use a Content Delivery Network (CDN) like Cloudflare to help mitigate DoS attacks by distributing traffic across multiple servers and providing additional security features.

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
