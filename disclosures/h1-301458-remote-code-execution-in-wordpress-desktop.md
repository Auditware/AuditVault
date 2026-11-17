---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2018-04-14
submitted: 2017-12-31T00:08:35.763Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/301458"
title: "Remote Code Execution in Wordpress Desktop"
---
# Remote Code Execution in Wordpress Desktop

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Automattic | **Disclosed:** 2018-04-14

- Report: [https://hackerone.com/reports/301458](https://hackerone.com/reports/301458)
- CWE: Code Injection
- Submitted: 2017-12-31T00:08:35.763Z

## Timeline

- **Report Filed**
- **2018-01-04** @vortfu: Thanks for the report, we'll take a look.
- **2018-01-23** @mattaustin: I am now on the 3.2.0-beta2 branch and this is still reproducible. Any updates on this issue?
- **2018-02-01** @mattaustin: Any updates on this issue?
- **2018-02-12** @mattaustin: Any updates on this issue? Is this the correct place for this issue?
- **Hacker Requested Mediation**
- **2018-02-14** @allnoodles: Hi Matt,

Sorry for not responding.

I was able to reproduce the problem. I actually fixed the problem in https://github.com/Automattic/wp-desktop/pull/377 as part of other work, but it seems to be still pending a merge. I'll make sure this gets merged in and a new release pushed out as soon as possible.

I'll comment here again when that's done
- **2018-02-14** @allnoodles: Ok, 3.2 beta 3 has been released and it fixes the issue for me. We're aiming to release fully in the next day or so, pending confirmation that it's fixed for you.
- **2018-02-14** @mattaustin: Awesome! This looks resolved to me.
- **2018-02-14** @mattaustin: Looking at the PR, I am glad you guys are using correct "new URL" instead of url.parse in node as well. Looks good.
- **2018-02-15** @allnoodles: Thanks! I'll see about getting this wrapped up
- **2018-03-10** @mattaustin: This looks to be fixed and live in the 3.2.0 release version.
- **Report Resolved**
- **Bounty Awarded**
- **2018-03-13** @mattaustin: I assume there will be no issue with public disclosure as the issue has been in public PR and known for a few months?
- **Agreed On Going Public**
- **2018-03-27** @mattaustin: This issue has been public in the PR for 3 months any reason no to make it public? I would like to link to this is the CVE.
- **Report Became Public**
