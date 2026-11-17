---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-06-02
submitted: 2018-04-26T21:54:11.434Z
bounty_usd: null
votes: 14
cve: "CVE-2018-3758"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "patrickrbc"
source: "https://hackerone.com/reports/343726"
title: "Unrestricted file upload (RCE)"
---
# Unrestricted file upload (RCE)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-02

- Report: [https://hackerone.com/reports/343726](https://hackerone.com/reports/343726)
- CWE: Path Traversal | CVE: CVE-2018-3758
- Submitted: 2018-04-26T21:54:11.434Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-05-05** @vdeturckheim: Thanks for the clarification, we'll look at this shortly.
- **Report Triaged**
- **2018-05-11** @lirantal: Hi Mark,

Can you help us triage this vulnerability reported by @patrickrbc  ?
- **2018-05-28** @patrickrbc: Any updates?
- **2018-05-28** @lirantal: Due to no activity from the maintainer I opened an issue in the repo to invite them to join .
- **2018-05-31** @patrickrbc: For some reason the maintainer joined the other vulnerability report but not this one. In the Github issue you created he said that he did not receive any email. Don't know if you sent both again or just the other one.
- **External User Joined**
- **2018-06-01** @mrvautin: Thanks, finally the invite has worked. Please give me a few days to look into this.
- **2018-06-01** @mrvautin: This is obviously less than ideal but unless I'm missing something, this is not a "Critical" issue in that the server is either already compromised (replacing the app.js file) or the user is a trusted administrator. 

I will fix however (some code is less than ideal), just pointing out the severity.
- **2018-06-01** @lirantal: The severity is set based on a score metric called CVSS 3.0, you're welcome to look at the parameters and if you think any of them are wrong we can discuss changing them.
- **2018-06-01** @mrvautin: Ok, this is new to me and I trust you guys know more than me about it and have it right.
- **2018-06-01** @mrvautin: Fixes have been pushed to Github and NPM.

Github here: https://github.com/mrvautin/expressCart/commit/65b18cfe426fa217aa6ada1d4162891883137893
- **2018-06-01** @lirantal: Thanks.

@patrickrbc can you please confirm the changes address the issue reported?
- **2018-06-01** @patrickrbc: I confirm that I can no longer reproduce this vulnerability.
- **2018-06-02** @lirantal: Great, thanks. I'll move on with a full public disclosure of the vulnerability then.
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-06-02** @lirantal: Disclosed
