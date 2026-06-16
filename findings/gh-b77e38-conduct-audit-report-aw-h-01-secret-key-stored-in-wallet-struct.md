---
tags:
  - severity/high
protocol: "[[Conduct]]"
auditors:
  - "[[Auditware]]"
  - sector/wallet
genome:
  - "[[access-roles]]"
  - "[[access-control/secret-exposure]]"
  - "[[privilege-escalation/ownership-takeover]]"
  - "[[known-pattern]]"
  - "[[trigger/offchain]]"
  - "[[redesign-logic]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[blast-radius/single-user]]"
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
