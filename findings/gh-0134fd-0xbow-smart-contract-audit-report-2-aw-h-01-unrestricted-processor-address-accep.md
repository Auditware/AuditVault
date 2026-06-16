---
tags:
  - blockchain/evm
  - lang/solidity
  - sector/account
  - sector/privacy
  - sector/token
  - sector/zk
  - platform/auditware
  - severity/high
  - novelty/variant
protocol: "[[0xbow]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[logic/missing-validation]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[account-ownership]]"
  - "[[bridge-message-validation]]"
---
# **AW-H-01: Unrestricted Processor Address Acceptance** {#aw-h-01:-unrestricted-processor-address-acceptance}

**Severity:** *High*									**Status:** *Unmitigated*

**Code:**

* [packages/contracts/src/contracts/BatchRelayer.sol\#L26](https://github.com/0xbow-io/privacy-pools-core/blob/2f6a650b4cbc7872e163a70c56cdc977fe7839b4/packages/contracts/src/contracts/BatchRelayer.sol#L26) 

**Description:**  
During the audit it was found that users can be socially engineered into generating proofs with malicious processor addresses, and the protocol has no way to distinguish between legitimate and malicious processors.

The current validation in PrivacyPool.sol:  
// Check caller is the allowed processooor  
if (msg.sender \!= \_withdrawal.processooor) revert InvalidProcessooor();

// Check the context matches to ensure its integrity  
if (\_proof.context() \!= uint256(keccak256(abi.encode(\_withdrawal, SCOPE))) % Constants.SNARK\_SCALAR\_FIELD) {  
 revert ContextMismatch();  
}

This only ensures that:

* The caller matches the processor specified in the withdrawal  
* The proof was generated for this specific withdrawal data

But still enables attackers to deploy malicious processors with identical interfaces and steal all withdrawn funds.

The attack requires minimal technical sophistication only contract deployment and social engineering with no gas costs or technical barriers once users are deceived.

An attacker abusing this scenario might follow these steps:

* Attacker deploys malicious BatchRelayer contract with identical interface  
* Through compromised UI, social engineering, or phishing, tricks user into generating withdrawal proofs on a valid pool with malicious processor address  
* User unknowingly authorizes withdrawal to attacker's contract instead of legitimate BatchRelayer  
* Malicious contract receives all withdrawn funds and redirects them to attacker instead of intended recipient  
* Attack scales if malicious processor address spreads through compromised UIs or documentation

**Recommendations:**

* Processor Whitelist: Add a whitelist of approved processor addresses at the PrivacyPool level  
* Circuit-Level Validation: Include processor address validation within the zero-knowledge circuit itself  
* Registry Pattern: Implement a canonical processor registry that users/UIs can reference

# **AW-M-01: Unvalidated Pool Parameter** {#aw-m-01:-unvalidated-pool-parameter}

**Severity:** *Medium*								**Status:** *Unmitigated*

**Code:**

* [packages/contracts/src/contracts/BatchRelayer.sol\#L27](https://github.com/0xbow-io/privacy-pools-core/blob/2f6a650b4cbc7872e163a70c56cdc977fe7839b4/packages/contracts/src/contracts/BatchRelayer.sol#L27) 

**Description:**  
BatchRelayer accepts any pool address as a parameter without validation, contrasting with Entrypoint's registry-based approach that provides cryptographic assurance of pool legitimacy. This architectural difference creates conditional fund loss scenarios where users interact with unverified pools:

// Entrypoint validates pools via registry:  
IPrivacyPool \_pool \= scopeToPool\[\_scope\];  
if (address(\_pool) \== address(0)) revert PoolNotFound();

// BatchRelayer accepts any pool address directly

The risk manifests when attackers deploy malicious pool contracts implementing IPrivacyPool interfaces with dishonest logic. Unlike Entrypoint's technical enforcement through registry validation, BatchRelayer relies entirely on user behavior and UI integrity for pool verification, creating a trust gap that sophisticated attackers can exploit through social engineering campaigns or compromised UIs.

An attacker may abuse this by following the next scenario:

* Attacker deploys malicious pool contract implementing **IPrivacyPool** interface with malicious logic  
* Through social engineering, phishing sites, or compromised documentation, tricks users into believing malicious pool is legitimate  
* User generates a withdrawal proof against the malicious pool  
* User receives fake ERC-20 tokens that they would assume are legitimate.  
* Unlike Entrypoint's registry protection, BatchRelayer provides no technical barrier to prevent interaction with malicious pools

**Recommendations:**

* Implement comprehensive pool validation. You may follow one of these suggestions:  
  * Integrating with Entrypoint's existing pool registry to validate **\_pool** addresses against **scopeToPool** mapping  
  * Creating a dedicated pool registry with administrative controls for adding verified pools. As an interim measure, clearly document pool verification requirements in user-facing interfaces and provide canonical pool addresses through official channels to reduce social engineering attack surface.
