---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/dex
protocol: "[[SaucerSwap]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html"
genome:
  - "[[fot-slippage]]"
---
# Weak Password Hashing Configuration: Low `PBKDF2` Iteration Count and No Use of Argon2

- id: 61991
- impact: HIGH
- protocol: [[SaucerSwap]] Wallet
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation for the update. The bug was related to the encryption system and specifically the function `determineIterations` in the file `utils/cryptoUtils.ts`. The application was using PBKDF2 for password hashing, but this is no longer considered secure enough. The recommendation is to switch to Argon2, which is a newer and more secure algorithm. For older systems, it is recommended to increase the number of PBKDF2 iterations significantly. The report emphasizes the importance of consistency and enforcing strong security measures when dealing with sensitive information.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `0f6180f1921216b72f3f210687369fdcf0f8bb48`. Additional fixes in: `9c26b94fca8767a0114944678b3fe095ef422ae8` The client provided the following explanation:

> Upgraded encryption system to use Argon2id hashing algorithm instead of PBKDF2 Enhanced security with modern password-based key derivation function Added react-native-libsodium dependency for native Argon2 implementation

**File(s) affected:**`utils/cryptoUtils.ts`

**Description:** In `utils/cryptoUtils.ts` the function `determineIterations`: The application currently uses PBKDF2 for password hashing, but the number of iterations is dynamically adjusted based on device performance, with an upper limit of 10,000 iterations. While this approach attempts to balance usability across devices, it falls short of modern security recommendations.

As of 2025, 10,000 PBKDF2 iterations is considered insufficient to resist brute-force and offline dictionary attacks, especially given the efficiency of modern GPUs and ASICs. PBKDF2 lacks memory hardness, making it more vulnerable to parallelized attacks compared to newer algorithms.

Furthermore, the dynamic adjustment based on performance can lead to non-deterministic security guarantees, meaning that users on slower devices may end up with significantly weaker password protection.

The better alternative is Argon2. It is memory-hard, designed specifically to resist GPU and ASIC cracking, and configurable for time, memory, and parallelism.

**Recommendation:** Migrate to Argon2 (preferably `Argon2id`) for all new password hashes.

For legacy systems where immediate migration isn't feasible: Increase PBKDF2 iterations significantly. Since the used library `Crypto-ES` is using HMAC-SHA256, the [OWASP guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2) recommend 600,000 iterations.

Relying on device-dependent iteration counts may seem adaptive but ultimately erodes consistency and security. Cryptographic strength should be fixed and enforced, especially when protecting sensitive credentials.
