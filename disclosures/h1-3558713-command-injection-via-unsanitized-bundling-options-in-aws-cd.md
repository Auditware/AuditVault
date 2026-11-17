---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/aws
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2026-06-11
submitted: 2026-02-17T10:22:34.970Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "inkerton"
source: "https://hackerone.com/reports/3558713"
title: "Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`"
---
# Command Injection via Unsanitized Bundling Options in `aws-cdk-lib/aws-lambda-nodejs`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** AWS VDP | **Disclosed:** 2026-06-11

- Report: [https://hackerone.com/reports/3558713](https://hackerone.com/reports/3558713)
- CWE: OS Command Injection
- Submitted: 2026-02-17T10:22:34.970Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2026-02-20** @bitdumpster: Hi @████████, 

Thank you for submitting this report to the the AWS VDP HackerOne program! I am with the AWS VDP team responsible for Coordinated Vulnerability Disclosure (CVD). Our internal teams are currently reviewing your report and will provide you with updates as they become available and on a monthly basis. 

If you have any questions, feel free to let me know. 

Best Regards,
@████████
- **2026-03-23** @bitdumpster: Hi @████████, 

Just a quick update for you. Our internal team is still evaluating your report and possible courses of action. I'll be in touch when I have more information to share. 

Best Regards,
@████████
- **2026-04-10** @bitdumpster: Hi @████████ ,

Two PRs have been merged related to your report:
* https://github.com/aws/aws-cdk/pull/37292
* https://github.com/aws/aws-cdk/pull/37412

Do you agree these updates address the issues in your report? Our internal team is also evaluating for customer messaging. I'll update when I have more information to share. 

Have a great weekend,
@████████
- **2026-04-10** @inkerton: Hi @████████,

Yes, I can confirm that [PR 37292](https://github.com/aws/aws-cdk/pull/37292) and [PR 37412](https://github.com/aws/aws-cdk/pull/37412) completely address the issues described in my report.

[PR 37292](https://github.com/aws/aws-cdk/pull/37292) successfully remediates the core issue by replacing the vulnerable shell string concatenation (`bash -c "..."` / `cmd.exe /c "..."`) with direct, array-based `spawnSync` calls for the local bundling steps. This correctly prevents shell metacharacters in properties like `externalModules`, `define`, and `esbuildArgs` from being evaluated as secondary commands.

Additionally, [PR 37412](https://github.com/aws/aws-cdk/pull/37412) securely handles the Windows `npx.cmd` execution edge case by using `powershellEscape()` to strictly single-quote literal arguments before invoking the PowerShell call operator (`&`), which prevents PowerShell-level injection.

These patches align perfectly with the recommended remediation and effectively close this supply-chain/command-injection vector. 

Thank you and the internal team for the swift and thorough patch! Please let me know if you need any further validation on my end, and keep me posted regarding the customer messaging/advisory.

Have a great weekend,
@████████
- **2026-04-13** @inkerton: _This comment was deleted by the author._
- **2026-04-15** @bitdumpster: @████████

I discussed customer notification with our internal team. Evaluation and inclusion of 3rd party resources falls on the customer side of the shared responsibility model [1]. The core security responsibility for vetting 3rd party dependencies, and code execution in customer environments, remains with the customer per the shared responsibility model. Our internal team is handling these updates as a customer obsessed defense in depth measure. 

Thank you for this report to AWS VDP. We appreciate your commitment to the security of AWS and AWS customers. I’m going to close this report as informative. We look forward to your next report! We are always available here at HackerOne and on the AWS Security inbox (aws-security@amazon.com). 

Best Regards,
@████████

[1] https://aws.amazon.com/compliance/shared-responsibility-model/
- **2026-04-15** @inkerton: Hi @████████,

Thank you for the update and for the detailed explanation of the internal team's perspective. 

While I fully agree that according to the Shared Responsibility Model, customers are responsible for vetting the 3rd party code they choose to execute, I believe there is a critical distinction here regarding **Tool Integrity**.

The core of this report is not about the *content* of a malicious dependency, but rather a **CWE-78 (OS Command Injection)** implementation flaw within the `aws-cdk-lib` CLI tool itself. A secure CLI tool must handle input strings safely, especially when they are extracted from external sources like `package.json`. By interpolating these strings directly into a shell (`bash -c` / `cmd /c`), the CDK tool created a secondary, unexpected RCE vector that bypasses standard security measures (like `npm install --ignore-scripts`).

If a developer uses a tool provided by AWS, they expect that tool to be **secure by design**. The fact that the internal team merged two significant PRs ([37292](https://github.com/aws/aws-cdk/pull/37292) and [37412](https://github.com/aws/aws-cdk/pull/37412)) to move away from shell-based execution to direct array-based `spawnSync` confirms that this was a recognized architectural security gap, even if categorized as DiD.

Since this flaw allowed a silent, low-privilege network participant (e.g., via a Pull Request or a compromised transitive dependency) to escalate to RCE on a developer's machine via the AWS-provided toolset, I kindly ask that this be reconsidered for a valid (Non-Informative) status. 

I appreciate the work the team put into the patches and look forward to your thoughts.

Best regards,
@████████
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Informative**
- **Report Reopened**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **2026-06-11** @bitdumpster: A team member has permanently deleted all attachments from this report.
- **Agreed On Going Public**
- **Manually Disclosed**
