---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-09-18
submitted: 2018-07-21T12:34:12.401Z
bounty_usd: null
votes: 5
cve: "CVE-2019-5423"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "lirantal"
source: "https://hackerone.com/reports/384939"
title: "http-live-simulator npm module is prone to path traversal attacks"
---
# http-live-simulator npm module is prone to path traversal attacks

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/384939](https://hackerone.com/reports/384939)
- CWE: Path Traversal | CVE: CVE-2019-5423
- Submitted: 2018-07-21T12:34:12.401Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report Path Traversal vulnerability in http-live-simulator
It allows to read arbitrary files from any location on disk

# Module

**module name:** http-live-simulator
**version:** 1.0.5
**npm page:** `https://www.npmjs.com/package/http-live-simulator`

## Module Description

> Copy description from npm page

## Module Stats

> Replace stats below with numbers from npm’s module page:

[9] weekly downloads

# Vulnerability

## Vulnerability Description

> Description about how the vulnerability was found and how it can be exploited, how it harms package users (data modification/lost, system access, other.

The http-live-simulator module doesn't set a root directory and allows any arbitrary paths to be accessed on the file system and returned to requesting clients

## Steps To Reproduce:

> Detailed steps to reproduce with all required references/steps/commands. If there is any exploit code or reference to the package source code this is the place where it should be put.

1. Install the module locally in an npm project: `npm install http-live-simulator`
2. Run the live server on a specified port: `node_modules/.bin/http-live --port 8181`
3. Attempt to access a file from outside that project's directory, such as `curl --path-as-is http://localhost:8181/../../file.txt`
4. Files output should be returned 

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- MacOS
- Node.js 8.11.3
- npm 5.6.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

path traversal vulnerability leading to read access in arbitrary files on disk

## Timeline

- **Report Filed**
- **2018-07-21** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-25** @marcinhoppe: Hi @lirantal 

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability. I will reach out to the package maintainer to join.
- **Report Triaged**
- **External User Joined**
- **2018-07-25** @prahladyeri: @marcinhoppe As discussed, if you can send me a CR on github, I can merge it and release the updated version on npm. Please let me know how to proceed.
- **2018-07-25** @marcinhoppe: @prahladyeri We usually ask maintainers to fix those vulnerabilities and the Security WG coordinates the responsible disclosure once the fix is available on NPM. Will you be able to provide a fix?
- **2018-07-25** @prahladyeri: Yep, I can do that. I'll update here once its done so that you can test and confirm.
- **2018-07-25** @prahladyeri: Hi, I've just published the latest version 1.0.6 that takes care of this. I've fixed this by replacing any reference to back folders by a "" (blank), so it returns 404 error in your case:

`pathname = pathname.replace("/../",""); //fix for path traversal bug`

[github link to commit #8e85a1be562248d0d616c0e5092a3d71bbf5fe5f](https://github.com/prahladyeri/http-live-simulator/commit/8e85a1be562248d0d616c0e5092a3d71bbf5fe5f)

Please test and let me know. Thanks again for your contribution to http-live-simulator.
- **2018-07-26** @marcinhoppe: @prahladyeri Thanks, I can no longer reproduce the issue.

@lirantal Can you verify the fix so that we could proceed with disclosure?
- **2018-07-27** @lirantal: Confirming that I can't reproduce anymore.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
