---
tags:
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/bridge
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[access-control/broken-logic]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[add-check]]"
  - "[[precondition/specific-contract-state]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[blast-radius/single-user]]"
---
# **AW-H-03: Protocol Bypass via Fail-Open Compliance on Unmapped ChainId** {#aw-h-03:-protocol-bypass-via-fail-open-compliance-on-unmapped-chainid}

**Severity:** **High**										**Status:** **Fixed** 

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that both code paths now fail closed \- **startAsyncScreening** (**compliance.ts** line 165\) and the **pollPendingScreenings** retry path (**compliance.ts** line 228\) both reject deposits for unmapped chain IDs. The hardcoded **CHAIN\_ID\_TO\_NOMINIS** table was replaced with a config-driven mapping enforced by Zod schema at startup.

**Locations:**  

* [**shieldflow-asp/src/services/compliance.ts\#L160-L165**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/services/compliance.ts#L160-L165)  
* [**shieldflow-asp/src/services/compliance.ts\#L19-L30**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/services/compliance.ts#L19-L30)  
* [**shieldflow-asp/src/services/compliance.ts\#L230-L235**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/src/services/compliance.ts#L230-L235)

**Description:**

During the audit, it was found that ShieldFlow's compliance service screens every deposit through the Nominis API before approving it into the protocol. The service maps each supported chain ID to its corresponding Nominis chain identifier via a hardcoded lookup table, **CHAIN\_ID\_TO\_NOMINIS**. At the time of the audit, only Ethereum mainnet (**chain ID 1**) and Sepolia testnet (**chain ID 11155111**) are mapped.                                                                                                                                                            
When a deposit arrives from a **chain ID** absent from this table, the code does not reject it \- it approves it **unconditionally**, adding it to the ASP Merkle tree without any compliance screening. A missing chain mapping is treated as a reason to skip screening rather than a reason to block.  

**const chain \= CHAIN\_ID\_TO\_NOMINIS\[chainId\];**  
**if (\!chain) {**  
 **console.error(\`\[Compliance\] No Nominis chain mapping for chainId ${chainId}, auto-approving\`);**  
 **await updateDepositStatus(chainId, poolScope, label, 'APPROVED');**  
 **await addLeaf(chainId, label);**  
 **return;**  
**}**

**// pollPendingScreenings - retry path (L230-L235)**  
  **const chain \= CHAIN\_ID\_TO\_NOMINIS\[req.chainId\];**                                                                                                              
  **if (\!chain) {**     
    **await this.approveDeposit(req);**  
    **continue;**  
  **}**

The vulnerability exists in two independent code paths. Patching **startAsyncScreening** alone is insufficient \- any deposit queued as **PENDING** will still be **auto-approved** by **pollPendingScreenings**, which contains the same fail-open branch.

Any deposit on an unmapped chain bypasses Nominis entirely and is admitted to the ASP Merkle tree without screening, exposing ShieldFlow operators to regulatory liability under OFAC with no audit trail.

**Recommendations:**

* Change the missing-chain branch in **startAsyncScreening** to call **updateDepositStatus('REJECTED')** rather than **APPROVED** \- fail closed, not open.  
* Apply the same fail-closed fix to the retry path in **pollPendingScreenings(L230-L235);** both code paths must be patched simultaneously.                   
