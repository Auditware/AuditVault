---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-04-01
submitted: 2019-01-25T08:22:50.228Z
bounty_usd: 700
votes: 232
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "giddsec"
source: "https://hackerone.com/reports/485748"
title: "Stored XSS on reports."
---
# Stored XSS on reports.

> **Severity:** High | **Bounty:** 700 USD | **Votes:** 232 | **Program:** X / xAI | **Disclosed:** 2019-04-01

- Report: [https://hackerone.com/reports/485748](https://hackerone.com/reports/485748)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-01-25T08:22:50.228Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
Stored XSS can be submitted on reports, and anyone who will check the report the XSS will trigger. 

**Description:**
Stored XSS, also known as persistent XSS, is the more damaging than non-persistent XSS. It occurs when a malicious script is injected directly into a vulnerable web application. 

## Steps To Reproduce:

  1. Go to https://app.mopub.com/reports/custom/
  2. Click **New network report**.
  3. On the name, enter payload: **"><img src=x onerror=alert(document.domain)>**
  4. Click **Run and save** then XSS will trigger. 

**Demonstration of the vulnerability:**
PoC: ████


Tested on Firefox and chrome.

## Impact

The attacker can steal data from whoever checks the report.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-01-29** @giddsec: Correction: the title should be **Stored XSS on network reports.**
- **2019-01-30** @bugtriage-alex: Thank you for your report @giddsec.

We were able to reproduce the behavior in your report and we will get back to you when we have more information.

Thank you for thinking of Twitter security
- **Report Triaged**
- **2019-02-01** @giddsec: Thanks for the triage! Is this eligible for a bounty?
- **2019-02-01** @jknguyen: Hello @giddsec -

We appreciate your enthusiasm on this issue.
Our team is currently looking into it and we will provide any updates as applicable.

Thank you for your patience!
- **Bounty Awarded**
- **2019-02-05** @giddsec: Thanks for the bounty! :)
- **2019-02-15** @giddsec: Hello @jknguyen and @bugtriage-alex can I get a bonus here after discovering a lot of issues related to this vulnerability? cause it's on the same root cause. 
 #492913 #492444 #487370 #485736 these reports marked as duplicate because it's on same root cause but on different endpoints.

Kind regards
- **2019-02-27** @giddsec: Hello, I think it's already fixed. I can't reproduce it anymore. can you update the status here? 


Kind regards,
@giddsec
- **Report Resolved**
- **2019-02-28** @giddsec: Hello @jknguyen, 

Thank you, it fixed the issue on submitting reports. but it didn't fix the issue on **account settings** endpoint, means that I can still trigger XSS on report's tab endpoint and also on different vulnerable endpoints. I resubmitted another report regarding this issue on **account settings**, do you mind taking a look? #503298

If they really have the same root cause, the **broad fix** will fix them all but the broad fix didn't.

Kind regards.
- **Report Reopened**
- **2019-03-01** @giddsec: Thanks for the update, @jknguyen.
Did you review the report #503298? All other issues are in there. I merged them together. 
Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
