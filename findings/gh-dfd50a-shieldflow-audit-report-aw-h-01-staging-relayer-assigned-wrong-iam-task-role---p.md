---
tags:
  - severity/high
protocol: "[[Shieldflow]]"
auditors:
  - "[[Auditware]]"
  - sector/bridge
genome:
  - "[[access-roles]]"
  - "[[access-control/missing-auth]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-access-control]]"
  - "[[precondition/insider]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-H-01: Staging Relayer Assigned Wrong IAM Task Role \- Production EFS Write** {#aw-h-01:-staging-relayer-assigned-wrong-iam-task-role---production-efs-write}

**Severity:** ***High***									**Status:** **Fixed**

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. It was verified that **relayer-task-definition.json** now sets **taskRoleArn** to **shieldflow-relayer-task-staging**, and **relayer-task-definition-prod.json** sets it to **shieldflow-relayer-task-production**, correctly isolating each environment’s EFS access. ASP task definitions are similarly split across **shieldflow-asp-task-staging** and **shieldflow-asp-task-production**. All four task definitions also reference dedicated per-environment execution roles.

**Locations:**

* [**shieldflow-core/ops/aws/relayer-task-definition.json\#L8**](https://github.com/shieldflow-dev/shieldflow-core/blob/7715653e9af461cb8be320ff333c135a52c4b2e8/ops/aws/relayer-task-definition.json#L8)  
* AWS Architecture Reference (provided) \- L269-L271

**Description:**  
The **relayer-staging** ECS task in live AWS is running with **shieldflow-asp-task** as its IAM task role \- the ASP service's role, not the relayer's own. The repository task definition already specifies the correct role (shieldflow-relayer-task at line 8), confirming this is a deployment drift issue in live infrastructure rather than a code bug.

The **shieldflow-asp-task** role grants **elasticfilesystem:ClientWrite** to EFS filesystem **fs-077171ae1a2ff75ca** without restriction to an access point, giving the staging relayer full write access to the production ASP data volume at /asp-data-production.

The staging relayer is internet-facing at [**testnet-relayer.shieldflow.co**](http://testnet-relayer.shieldflow.co). any code-execution vulnerability in the staging relayer grants write access to asp.sqlite, the production ASP database. Corrupting this database causes the ASP to publish attacker-controlled Merkle roots on-chain via **updateRoot()**, invalidating all user inclusion proofs and blocking protocol-wide withdrawals on Ethereum mainnet.

This makes the staging relayer a one-hop path to permanent disruption of live protocol state.

**Recommendations:**

* Re-register the relayer-staging task definition with **taskRoleArn**: **arn:aws:iam::708325790837:role/shieldflow-relayer-task** and force a service update to terminate the currently misconfigured tasks.  
* Scope EFS IAM policies to specific access point ARNs \- staging containers must have no access to the production EFS mount.
