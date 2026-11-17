---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2019-09-13
submitted: 2019-08-31T09:18:46.360Z
bounty_usd: null
votes: 10
cve: "CVE-2019-5485"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "samlyhin"
source: "https://hackerone.com/reports/685447"
title: "gitlabhook OS Command Injection"
---
# gitlabhook OS Command Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2019-09-13

- Report: [https://hackerone.com/reports/685447](https://hackerone.com/reports/685447)
- CWE: OS Command Injection | CVE: CVE-2019-5485
- Submitted: 2019-08-31T09:18:46.360Z

## Timeline

- **Report Filed**
- **2019-08-31** @samlyhin: Reference: #629099
- **Report Triaged**
- **Changed Scope**
- **Report Severity Updated**
- **2019-09-04** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.

I will invite the package maintainer to this issue.
- **2019-09-04** @samlyhin: Hello, 
Please explain me based on CVSS3, why do you think it's High, not Critical. 
This vulnerability allows unauthenticated Remote Code Execution without any conditions, that leads to complete loosing of confidentiality, availability, and integrity.
- **2019-09-04** @lirantal: I updated scope -> unchanged, and privileges required -> low
Reasoning:
1. A loss of CIA doesn't necessarily mean scope changed. This doesn't mean privilege escalation per say and its possible the command is still constrained to a non-root owned process.
2. Privileges required is a bit more questionable but I'm wondering whether this webhook would actually be exposed to the public as-is? It would make sense to have a best practice to limit incoming requests using a WAF or alike to the specific IP pool of GitLab. I see however that it defaults to listen on 0.0.0.0 which I agree is not ideal.
- **2019-09-04** @samlyhin: @lirantal 
Please keep in mind that we talk about finding vulnerabilities in source code. So you can't suppose that there are other external methods such as WAF, IP restrictions, or even user-role separation, while the application does not implement such mechanisms itself.  
If you say so, there are no critical vulnerabilities at all, because security can be achieved by the other external methods for every application. 
That's why I think that you should change CVSS3 score back to 10.0.
- **2019-09-06** @samlyhin: @lirantal 
Do you have any updates?
- **2019-09-06** @samlyhin: Also, @bassguitar checked the same vulnerability in a previous version ( #629099), and confirmed that 10.0 is a valid score.
- **Report Severity Updated**
- **2019-09-06** @lirantal: Thinking about this some more I agree with the 10 score due to:
1. Scope is changed - the vulnerable component being the gitlabhook changed to the impacted component being the OS that runs it
2. Privileges required - agree with you about this being public by default and no assumption on other controls.

Still waiting on feedback from author. If not replying soon as they're not active I'll disclose.
- **2019-09-11** @samlyhin: @lirantal any updates?
- **2019-09-13** @lirantal: Yes, will continue with disclosing the vulnerability.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2019-09-13** @samlyhin: @lirantal thanks. I would like to ask you for a CVE number for this vulnerability.
- **2019-09-13** @lirantal: I already filed a request for that ;-)
- **2019-09-13** @samlyhin: @lirantal thank you for the quick response, will wait for it
- **2019-09-13** @lirantal: 👍
- **2019-09-13** @samlyhin: Also I see that this module is now eligible for bounty, so may I have some just symbolic dollars for it? ^_^
- **2019-09-19** @lirantal: Which part shows that it is eligible? we only have a few modules listed as those eligible for bounties
- **2019-09-19** @samlyhin: @lirantal Please find a screenshot attached.
- **2019-09-19** @lirantal: I'm not entirely sure why that is so I'll check with our H1 staff.
The bug bounty criteria is showing up at: https://github.com/nodejs/security-wg/blob/master/processes/bug_bounty_criteria.md
- **2019-09-20** @lirantal: Notice that I updated the list of modules that are supported in scope for bounty. Thanks for sending in the report and sorry for the confusion!
