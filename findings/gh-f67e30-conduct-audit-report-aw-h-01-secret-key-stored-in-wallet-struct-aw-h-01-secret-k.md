---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/wallet
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[secret-exposure]]"
  - "[[role-bypass]]"
  - "[[dos-resistance]]"
---
# **AW-H-01: Secret Key Stored in Wallet Struct** {#aw-h-01:-secret-key-stored-in-wallet-struct}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/sdk/src/models.rs\#L24-L26](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/sdk/src/models.rs#L24-L26)

**Description:**  
The Wallet struct is instantiated within the **BlockchainApp::create** method using the provided **wallet\_credentials**. These credentials include a **SecretKey**, which is critical for cryptographic operations.

During the audit it was found that these credentials are stored unencrypted, meaning that processes on the running device might access the memory containing the secrets and steal the user’s credentials.

Other than defying best practices of key management, this insecure storage can lead to unauthorized access and compromise of the user's wallet. 

**Recommendations:**

* Use platform-specific secure storage mechanisms to store the **SecretKey** and other sensitive credentials. Both Android and iOS provide secure storage solutions that are designed to protect sensitive information (e.g. Android Keystore and iOS Keychain).

# **AW-H-02: Reliance on Local System Time for Global Timestamp** {#aw-h-02:-reliance-on-local-system-time-for-global-timestamp}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/clock.rs\#L32-L37](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/clock.rs#L32-L37)

* [crates/protocol/src/production/block\_production.rs\#L75-L75](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/production/block_production.rs#L75-L75)

**Description:**  
The **global\_timestamp** function in **clock.rs** relies on the local system time to generate a global timestamp.

This timestamp is used in the block production process in **block\_production.rs**.

If the local system time changes unexpectedly or is manipulated, it can alter the global timestamp, affecting the timing of block production and potentially disrupting the entire blockchain's consensus mechanism.

**Recommendations:**

* Use a trusted time source, such as NTP (Network Time Protocol) servers, to obtain the current time.  
* Implement checks to detect significant deviations in the local system time and raise alerts or correct the time automatically.  
* Consider using a consensus-based approach to determine the current time across multiple nodes in the network.

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
