---
tags:
  - sector/privacy
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/account
genome:
  - "[[proxy-initialization]]"
  - "[[dos-resistance]]"
  - "[[input-validation/missing]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# **AW-H-04: Withdrawal DoS via Unverified Entrypoint Address in ASP Config** {#aw-h-04:-withdrawal-dos-via-unverified-entrypoint-address-in-asp-config}

**Severity: High**										**Status:**  **Fixed**

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that **entrypointAddress** was removed from **config.json** and hardcoded in **contracts.ts** as audited constants, with **postman.ts** updated to call **getEntrypointAddress(chainId)**, fully implementing the recommendation.

**Locations:**  

* [**shieldflow-asp/src/config/index.ts\#L19**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/config/index.ts#L19)  
* [**shieldflow-asp/src/services/postman.ts\#L157**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/services/postman.ts#L157)  
* [**shieldflow-asp/src/services/postman.ts\#L217**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/services/postman.ts#L217)

**Description:**  
During the audit, it was found that the Entrypoint contract address is read from **config.json** at startup and used by the Postman service without any on-chain verification. When posting ASP root updates, Postman calls **updateRoot()** on whatever address appears in **this.chainConfig.entrypointAddress** \- it never confirms this is the legitimate deployed contract. 

**Attack Flow:**

* An attacker gains write access to **config.json** via the CI/CD paths identified in [**AW-C-03**](#aw-c-03:-overly-permissive-oidc-trust---any-branch-can-assume-deployer-role) and [**AW-C-04**](#aw-c-04:-deployer-role-has-account-wide-ecr/ecs-write)   
* The legitimate Entrypoint address is replaced with an attacker-controlled contract  
* All subsequent ASP root updates are posted to the fake contract \- the real Entrypoint stops receiving updates and its root goes stale.  
* Users submit withdrawal proofs built against the current root, but the real on-chain Entrypoint holds a stale one \- every transaction reverts with **IncorrectASPRoot**. Normal withdrawals are completely blocked.  
* Users who cannot wait are forced into **ragequit** \- an emergency exit that exposes deposit amounts and timing on-chain, permanently destroying their privacy guarantee.

**Recommendations:**

* Hardcode contract addresses \- remove **entrypointAddress** from **config.json** and embed in source as audited constants.
