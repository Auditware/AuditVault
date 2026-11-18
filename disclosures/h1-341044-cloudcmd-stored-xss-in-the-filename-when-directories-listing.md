---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2018-04-25
submitted: 2018-04-20T09:12:33.738Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/341044"
title: "[cloudcmd] Stored XSS in the filename when directories listing"
---
# [cloudcmd] Stored XSS in the filename when directories listing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-25

- Report: [https://hackerone.com/reports/341044](https://hackerone.com/reports/341044)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-04-20T09:12:33.738Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a Stored XSS issue in module **cloudcmd**
It allows executing malicious javascript code in the user's browser.

# Module

**module name**: cloudcmd
**version**: 9.1.5
**npm page**: https://www.npmjs.com/package/cloudcmd

## Module Description

> Cloud Commander is an orthodox web file manager with console and editor.

## Module Stats

4,433 downloads in the last week

{F288918}

# Vulnerability

## Steps To Reproduce:

* Install the module

```
$ npm i cloudcmd
```

* Run

```
$ ./node_modules/cloudcmd/bin/cloudcmd.js --root .
```

* In the target directory, create a file with name `"><svg onload=alert(3);>`

```
bash$ touch '"><svg onload=alert(3);>'
```

* In the browser, go to http://127.0.0.1:8080/, the XSS popup will fire.

{F288917}

## Supporting Material/References:

* macOS High Sierra 10.13.4
* node v8.10.0
* npm 5.6.0
* Chrome Version 65.0.3325.181 (Official Build) (64-bit)

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It allows executing malicious javascript code in the user's browser

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Triaged**
- **2018-04-23** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-04-23** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **External User Joined**
- **2018-04-23** @coderaiser: Thank you for report. Fixed with [23f4d47](https://github.com/coderaiser/cloudcmd/commit/23f4d4702cd3d473977285f26ea2ae7206b45f38). Landed in [v9.1.6](https://github.com/coderaiser/cloudcmd/releases/tag/v9.1.6).
- **2018-04-24** @lirantal: @coderaiser thank you for the quick reply! are you ok with me disclosing the report as soon we as confirm?

@tungpun can you please confirm the fix?
- **2018-04-25** @tungpun: I confirm that the issue has been fixed! I can't reproduce the PoC anymore.
- **2018-04-25** @coderaiser: @lirantal yes, I'm ok.
- **2018-04-25** @lirantal: Awesome thank you guys!
I'm proceeding with a full public disclosure
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-04-25** @tungpun: @lirantal May I kindly know if this one is valid for a CVE according to the program’s policy?
- **2018-04-25** @lirantal: @tungpun of course it does. all the reports get a CVE but at the moment we're facing some issues and bottlenecks with assigning them so to not delay the report itself we're disclosing them as usual and will retroactively update a CVE (this might take some time but will eventually happen)
- **2019-05-15** @tungpun: Hi @lirantal ,
Thanks for your support! However, 1 year passes, may I kindly know any update?
- **2019-06-19** @tungpun: Hi all, may I kindly know any update on my reports on this program?
