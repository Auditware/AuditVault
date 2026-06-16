---
tags:
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/bridge
genome:
  - "[[access-roles]]"
  - "[[access-control/centralization]]"
  - "[[privilege-escalation/admin-takeover]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-access-control]]"
  - "[[precondition/insider]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-H-02: Shared Execution Role Exposes All Production Secrets to Any Container** {#aw-h-02:-shared-execution-role-exposes-all-production-secrets-to-any-container}

**Severity:** ***High***										**Status:** **Fixed**

**Retest:**

April 6 **fixed**: Finding was set to fixed after receiving confirmations from the client, that had ran AWS checks on top of the code checks we had access to, disproving the partial fix.  
Fom ShieldFlow: “All four roles are scoped per-service per-environment (shieldflow/asp/production/\*, etc.). Each has exactly one inline policy (secrets-access) \+ one managed policy (AmazonECSTaskExecutionRolePolicy). Old shared role deleted.”

March 31 **partially fixed**: It was verified that the shared execution role was correctly split into four dedicated per-environment roles:

* **shieldflow-ecs-execution-asp-staging**,  
* **shieldflow-ecs-execution-asp-production**,  
* **shieldflow-ecs-execution-relayer-staging**,  
* **shieldflow-ecs-execution-relayer-production**

However, the execution role IAM policy still grants **secretsmanager:GetSecretValue** on **arn:aws:secretsmanager:eu-central-1:708325790837:secret:shieldflow/\*** \- meaning each role can read secrets belonging to other services. Each role’s policy should be scoped to its own path (e.g. **shieldflow/asp/staging/\*** only). Additionally, **POSTMAN\_PRIVATE\_KEY** and **RELAYER\_SIGNER\_PRIVATE\_KEY** remain in Secrets Manager; migration to KMS has not been implemented.

**Locations:**

* [**shieldflow-asp/ops/aws/asp-task-definition.json\#L7**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/ops/aws/asp-task-definition.json#L7)

* [**shieldflow-core/ops/aws/relayer-task-**](https://github.com/shieldflow-dev/shieldflow-core/blob/7715653e9af461cb8be320ff333c135a52c4b2e8/ops/aws/relayer-task-definition.json#L7)During the audit performed in March 2026, it was found that the finding was partially fixed. The primary risk \- a single shared execution role granting all services access to all environment secrets \- has been fully remediated. It was verified that the shared role was correctly split into four dedicated per-environment roles: **shieldflow-ecs-execution-asp-staging**, **shieldflow-ecs-execution-asp-production**, **shieldflow-ecs-execution-relayer-staging**, and **shieldflow-ecs-execution-relayer-production**. This eliminates direct cross-service privilege escalation via a compromised execution role.

* The remaining items are defense-in-depth hardening. The IAM policy attached to each role still grants **secretsmanager:GetSecretValue** on a **shieldflow/\*** path, meaning a compromised execution role could still read secrets belonging to other services. Scoping each policy to its own prefix (e.g. **shieldflow/asp/staging/\***) would further reduce the blast radius. Migration of **POSTMAN\_PRIVATE\_KEY** and **RELAYER\_SIGNER\_PRIVATE\_KEY** from Secrets Manager to KMS has not been implemented and remains a hardening recommendation.mainnet withdrawals on behalf of any user, and **POSTMAN\_PRIVATE\_KEY**, enabling attacker-controlled **updateRoot()** calls that forge or block inclusion proofs protocol-wide.

This compounds every other finding: any code-execution path in [**AW-C-03**](https://docs.google.com/document/d/19wwLeBau8DtEfkmIsZecPWPpyILWJlzRt8Op3jM9Et8/edit#heading=h.lfvxybdkzl3l), [**AW-C-04**](https://docs.google.com/document/d/19wwLeBau8DtEfkmIsZecPWPpyILWJlzRt8Op3jM9Et8/edit#heading=h.o8a25qdqt5g2), or [**AW-H-01**](https://docs.google.com/document/d/19wwLeBau8DtEfkmIsZecPWPpyILWJlzRt8Op3jM9Et8/edit#heading=h.hpjud5yvpg4j) may escalate to full hot wallet compromise with no additional steps.

**Recommendations:**

* Create separate IAM execution roles per service \- **shieldflow-asp-execution** and **shieldflow-relayer-execution** \- and scope each role's **secretsmanager:GetSecretValue** to the specific secret ARNs that service requires, removing the **shieldflow/\*** wildcard.  
* Staging roles must have no access to production secrets.  
* Migrate **RELAYER\_SIGNER\_PRIVATE\_KEY** and **POSTMAN\_PRIVATE\_KEY** to AWS KMS asymmetric signing keys or a hardware signing service to eliminate plaintext key exposure via the ECS metadata endpoint entirely.

# 
