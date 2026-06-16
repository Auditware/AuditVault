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
  - "[[privilege-escalation/admin-takeover]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-access-control]]"
  - "[[precondition/insider]]"
  - "[[blast-radius/protocol-wide]]"
---
# **AW-C-03: Overly Permissive OIDC Trust \- Any Branch Can Assume Deployer Role** {#aw-c-03:-overly-permissive-oidc-trust---any-branch-can-assume-deployer-role}

**Severity:** ***Critical***									**Status:** **Fixed**

**Retest:**

April 6 **fixed**: During the retest, it was verified that push-production in asp.yml was added in commit [**2b7600b**](https://github.com/shieldflow-dev/shieldflow-asp/commit/2b7600b8a9048cb3baf5b5d0c5247c3dc2adb889#diff-c9eadc6543069b6502ec58735194284b0f63d83cc9cd4083cd66cba9cd059d03) , and the ShieldFlow team manually confirmed via AWS CLI that the OIDC trust policy contains no wildcards, with roles locked to refs/heads/main.

March 31 **partially fixed**: It was found that the primary risk \- production secrets stored in the repository and unrestricted CI/CD access to production \- has been fully remediated as secrets are now injected at runtime from AWS Secrets Manager and per-environment task roles are in place, removing the original critical attack path where any user with read access to the repository could extract production credentials.

The remaining gaps are defense-in-depth hardening that reduce exposure in the event of a compromised developer account, not independent critical vulnerabilities. The OIDC trust policy still uses a **:\*** wildcard in the **sub** condition for both repos, meaning any branch \- not just **main** \- can assume the **shieldflow-github-deployer** role. Additionally, the **push-production** job in **asp.yml** is missing the **environment: production** gate, so an image can be pushed to production ECR without reviewer approval (only the **deploy-production** job requires it). Both issues require repository write access to exploit. The recommended hardening steps are to lock the OIDC **sub** condition to **ref:refs/heads/main** and to add **environment: production** to the **push-production** job.

**Locations:**

* [**shieldflow-asp/.github/workflows/asp.yml\#L62-L63**](https://github.com/shieldflow-dev/shieldflow-asp/blob/785aaaefcb4df86d70239f178e57fb64a8147c72/.github/workflows/asp.yml#L62-L63)  
* [**shieldflow-core/.github/workflows/relayer.yml\#L75-L76**](https://github.com/shieldflow-dev/shieldflow-core/blob/7715653e9af461cb8be320ff333c135a52c4b2e8/.github/workflows/relayer.yml#L75-L76)  
* AWS Architecture Reference (provided) \- L407

**Description:**  
GitHub Actions CI/CD for shieldflow-asp and shieldflow-core uses OIDC federation to assume the **shieldflow-github-deployer** IAM role (**arn:aws:iam::708325790837**:**role**/**shieldflow-github-deployer**). The IAM trust policy uses a **StringLike** condition: **repo:shieldflow-dev/shieldflow-asp:\*** and **repo:shieldflow-dev/shieldflow-core:\***. The trailing wildcard :\* matches any branch, tag, or ref \- not only protected branches.

Although the existing deployment workflows restrict triggers to main and dev, the IAM trust condition is evaluated independently of workflow-level branch filters. Any repository contributor can:

* Push a new workflow file to any feature branch with permissions: **id-token: write** and **role-to-assume** pointing at the deployer role ARN  
* GitHub Actions issues an OIDC token for that branch, the trust condition matches, and the deployer role is assumed with no merge requirement, no approval gate, and no code review required for production deployment.

An attacker who has assumed the deployer role can push a backdoored container image to any ECR repository in the account, register a malicious task definition with arbitrary injected environment variables, and force any ECS service in the account to redeploy with the malicious image.

**Recommendations:**

* Restrict the IAM trust condition to the protected branch only \- replace :\* with :ref:refs/heads/main in the trust policy for both shieldflow-asp and shieldflow-core.  
* Scope all ECR and ECS IAM permissions to specific resource ARNs, removing **Resource: "\*"** from the deployer policy. Create separate deployer roles per service \- **shieldflow-asp-deployer** and **shieldflow-relayer-deployer** \- each scoped to their respective ECR repositories and ECS task families only.  
* Enable ECR image signing and enforce signature verification at ECS task launch to prevent deployment of unverified images.  
* Require deployment approval gates via GitHub environment protection rules on the production environment.  
* Enable GitHub environment protection rules on the production environment requiring reviewer approval before any job that requests **id-token: write** can execute
