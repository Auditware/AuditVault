---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/staking
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[missing]]"
  - "[[wrong-state]]"
  - "[[weak-randomness]]"
---
# **AW-H-07: Lack of Integrity Check for Blockchain Data** {#aw-h-07:-lack-of-integrity-check-for-blockchain-data}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/db/blockchain.rs\#L1438-L1438](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/db/blockchain.rs#L1438-L1438) (example)

**Description:**  
The conduct protocol uses SQLITE as the underlying database engine to store blockchain data on the device. However, there are no explicit cryptographic integrity checks (e.g., hashing, digital signatures) implemented in the provided code. 

In cases where sqlite is stored in a shared application folder on the device, or the user had been compromised by a 3rd malicious app that was installed to his device, there’s a risk that a malicious actor might modify the data in the SQLite database and affect any part of the system that’s reliant on its integrity.

**Recommendations:**

* Implement cryptographic integrity checks (e.g., hashing) for all critical blockchain data before writing to the database.  
* Verify the integrity of the data when reading from the database to ensure it has not been tampered with.

# **AW-M-01: Strict Bitcoin Confirmation Epoch Check Can Prevent Staker Registration and Renewal** {#aw-m-01:-strict-bitcoin-confirmation-epoch-check-can-prevent-staker-registration-and-renewal}

**Severity:** *Medium*								**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/consensus/header\_validation.rs\#L291-L293](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/consensus/header_validation.rs#L291-L293) 

**Description:**  
The **verify\_bitcoin\_confirmation** function is designed to ensure that a given Bitcoin header was created long enough ago to be confident that it won't be re-organized. Specifically, it checks that the Bitcoin header was created within the N-2 epoch by comparing timestamps.

During the audit it was found that the function might not correctly handle edge cases where the epoch boundaries are crossed, leading to incorrect validation results.

For example, if the Bitcoin header timestamp is near the boundary of an epoch, the conversion to slot and epoch might not be accurate, causing the function to fail the validation check incorrectly making valid stakers to be incorrectly rejected if their Bitcoin header timestamp is near the boundary of an epoch.

**Recommendations:**

* Consider adding an additional checks to handle edge cases where the Bitcoin header timestamp is near the boundary of an epoch, for example:  
   \-  if bitcoin\_header\_epoch \!= current\_epoch \- 2 {  
   \+  if bitcoin\_header\_epoch \!= current\_epoch \- 2 && bitcoin\_header\_epoch \!= current\_epoch \- 1 {  
         return Ok(Some(HeaderValidationError::StakerNotConfirmedOnBitcoin));  
     }

# **AW-M-02: Transaction Race Condition in Mempool Validation** {#aw-m-02:-transaction-race-condition-in-mempool-validation}

**Severity:** *Medium*								**Status:** *Unmitigated*

**Code:**

* [crates/protocol/src/ledger/mempool.rs\#L67-L122](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/protocol/src/ledger/mempool.rs#L67-L122) 

**Description:**

During the audit it was found that the mempool insecurely implements a retry mechanism, allowing transaction order manipulation.

The implementation retries for up to 5 seconds when encountering a **MissingInput** error, which allows an attacker to delay broadcasting a required dependency transaction and then release it strategically within this window.

To abuse this issue, an attacker might follow these steps:

* Attacker submits a transaction referencing a yet-to-be-broadcast dependency.  
* The mempool encounters a **MissingInput** error and retries for 5 seconds.  
* The attacker delays broadcasting the dependency transaction.  
* At a strategic moment, the attacker introduces the dependency transaction.  
* The mempool accepts the original transaction, but now it was already ordered strategically relative to others.

This opens up risks of manipulating transaction ordering, fee sniping and more.

**Recommendations:**

* Remove Fixed-Time Retries, Use Dependency Tracking Instead  
  * Instead of blindly retrying, maintain a dependency-aware mempool  
  * Track missing input dependencies and only include transactions once all dependencies exist  
  * If a transaction has missing inputs, store it in **pending\_transactions**  
  * When the dependency appears, automatically retry

# **AW-M-03: Insecure Random Number Generation** {#aw-m-03:-insecure-random-number-generation}

**Severity:** *Medium*								**Status:** *Unmitigated*

**Code:**

* [crates/sdk/src/cryptography.rs\#L173-L178](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/sdk/src/cryptography.rs#L173-L178)   
* [crates/sdk/src/cryptography.rs\#L94-L99](https://github.com/ConductProtocol/Conduct/blob/e3e6603d43db84d4be05cf1ab29c9cd111f6b18c/crates/sdk/src/cryptography.rs#L94-L99) 

**Description:**

During the audit it was found that the **generate\_random\_bytes** function uses **rand::thread\_rng()** to generate random bytes.

This method returns a thread-local generator backed by **StdRng** \- a deterministic pseudo-random number that is seeded once from **OsRng**.

The following risks arise from this

* It’s not guaranteed to be cryptographically secure \- **StdRng** is not guaranteed to meet the requirements for cryptographic randomness \- even though it’s seeded securely.  
* No **CryptoRng** guarantee \- The random number generator is not explicitly constrained to implement the **CryptoRng** trait (from **rand\_core**), which is a marker for random number generators intended for cryptographic use.  
* Using **OsRng** or constraining your generator to **CryptoRng** makes your intent explicit and guards against regressions or subtle changes in how **thread\_rng()** behaves across versions.

This can lead to predictable random numbers, which can compromise cryptographic operations that rely on secure randomness.

**Recommendations:**

* Consider switching to use **rand::rngs::OsRng**, which draws directly from the operating system's CSPRNG (Cryptographically Secure Pseudorandom Number Generator):  
     pub fn generate\_random\_bytes(len: u32) \-\> Vec\<u8\> {  
