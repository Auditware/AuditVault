---
tags:
  - severity/high
  - sector/vault
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[weak-randomness]]"
  - "[[direct-drain]]"
  - "[[insider]]"
---
# **AW-C-02: Complete User Fund Theft via 53-bit Entropy Truncation in Master Key Generation** {#aw-c-02:-complete-user-fund-theft-via-53-bit-entropy-truncation-in-master-key-generation}

**Severity: *Critical***									**Status:** ***Fixed***

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that **bytesToNumber** was replaced with **bytesToBigInt** in both **crypto.ts:50–54** and **account.service.ts:88–92**, restoring full 256-bit key entropy. The unnecessary **BigInt()** wrappers were also removed since **bytesToBigInt** already returns **bigint**.

**Locations:**	

* [**shieldflow-core/packages/sdk/src/crypto.ts\#L50-L58**](https://github.com/shieldflow-dev/shieldflow-core/blob/7715653e9af461cb8be320ff333c153a52c4b2e8/packages/sdk/src/crypto.ts#L50-L58)  
* [**shieldflow-core/packages/sdk/src/core/account.service.ts\#L88-L97**](https://github.com/shieldflow-dev/shieldflow-core/blob/7715653e9af461cb8be320ff333c153a52c4b2e8/packages/sdk/src/core/account.service.ts#L88-L97)


**Description:**  
The SDK uses **bytesToNumber** instead of **bytesToBigInt** when converting BIP32 HD private key bytes into the master nullifier and master secret seeds. JavaScript's Number type is IEEE 754 double-precision and can only represent integers exactly up to **2^53** \- 1 (**Number.MAX\_SAFE\_INTEGER**). A 32-byte private key value is silently truncated to 53 bits before being fed into Poseidon, reducing effective key entropy from 256 bits to 53 bits.  
This affects two code paths \- **crypto.ts:50-58** and **account.service.ts:88-97** \- meaning every account ever created through the ShieldFlow SDK is cryptographically insecure.

**Attack Flow:**

* An attacker monitors ShieldFlow **deposit** / **withdrawal** events publicly  
* Because of the bug, every user's **masterNullifier** and **masterSecret** keys are actually only 53 bits, so he spins up cloud servers and tries all 9 quadrillion possible 53-bit values, firstly just for the **masterNullifier** key for cost accuracy. For each one they run it through the same hash function (**poseidon(\[BigInt(candidate)\])**) your protocol uses, then compare the result against the **existingNullifierHash** values published on-chain.  
* From the cracked accounts linked **masterNullifier** find the highest holder (to narrow the remaining compute costs) and use the same approach to crack the **masterSecret** for these accounts

Once **masterNullifier** and **masterSecret** are recovered, the attacker generates a valid ZK withdrawal proof and **drains the account** privately and irreversibly (using the same SDK). The theft appears as a legitimate withdrawal with no on-chain evidence of compromise.

**Recommendations:**

* Replace **bytesToNumber** with **bytesToBigInt** (from **viem**) in both **crypto.ts** and **account.service.ts**. This is a one-word change per file \- no **BigInt()** wrapping needed as **bytesToBigInt** already returns **bigint**.
