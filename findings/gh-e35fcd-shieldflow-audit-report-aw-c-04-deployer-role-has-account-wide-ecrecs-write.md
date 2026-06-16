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
  - "[[misassumption/admin-is-honest]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-C-04: Deployer Role Has Account-Wide ECR/ECS Write** {#aw-c-04:-deployer-role-has-account-wide-ecr/ecs-write}

**Severity:** ***Critical***								**Status:** **Fixed**

**Retest:**

During the audit performed in March 2026 it was found that the finding was **fixed**. The deployer policy was verified live against AWS in March 2026, with the help of the customer running the commands from their authenticated AWS cli on staging and production:

* **aws iam get-role-policy \--role-name shieldflow-github-deployer-production \--policy-name deploy-access**

which returned a scoped policy where:

* ECR push/pull is restricted to the **shieldflow/asp** and **shieldflow/relayer** repositories only  
* ECS service operations are scoped to the asp-production and relayer-production services and the shieldflow clusters  
* **iam:PassRole** is restricted to four named production role ARNs.

The original shared **shieldflow-github-deployer** role has also been split into separate **shieldflow-github-deployer-staging** and **shieldflow-github-deployer-production** roles, reducing blast radius further.

One minor observation: **ecs:DeregisterTaskDefinition** also remains **Resource: "\*"** and could be scoped to specific task definition ARNs; however, deregistering a task definition does not affect running services and the residual risk is low and the finding is considered fixed.

**Locations:**

* [**shieldflow-asp/.github/workflows/asp.yml\#L75**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/.github/workflows/asp.yml#L75)  
* AWS Architecture Reference (provided) \- L419

**Description:**  
The **shieldflow-github-deployer** IAM role \- assumed via the OIDC trust misconfiguration in [**AW-C-03**](https://docs.google.com/document/d/19wwLeBau8DtEfkmIsZecPWPpyILWJlzRt8Op3jM9Et8/edit#heading=h.lfvxybdkzl3l) \- carries an attached policy granting ECR and ECS write actions scoped to **Resource: "\*"** across account **708325790837**.

An attacker who has assumed the deployer role can push a backdoored container image to any ECR repository in the account, register a malicious task definition with arbitrary injected environment variables, and force any ECS service in the account to redeploy with the malicious image. ECR image tags are mutable, overwriting **:latest** triggers no alert and bypasses no approval gate.

The complete attack chain from a single feature branch push ([**AW-C-03**](https://docs.google.com/document/d/19wwLeBau8DtEfkmIsZecPWPpyILWJlzRt8Op3jM9Et8/edit#heading=h.lfvxybdkzl3l)) to a running backdoored production container requires no human intervention and completes in under five minutes, placing both the production ASP and relayer \- handling live Ethereum mainnet transactions \- within the blast radius.

**Recommendations:**

* Scope all ECR and ECS IAM permissions to specific resource ARNs, removing **Resource: "\*"** from the deployer policy.  
* Create separate deployer roles per service \- **shieldflow-asp-deployer** and **shieldflow-relayer-deployer** \- each scoped to their respective ECR repositories and ECS task families only.  
* Enable ECR image signing and enforce signature verification at ECS task launch to prevent deployment of unverified images. Require deployment approval gates via GitHub environment protection rules on the production environment.
