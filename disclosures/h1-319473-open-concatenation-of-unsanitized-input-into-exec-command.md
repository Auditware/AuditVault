---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-12-13
submitted: 2018-02-25T06:14:22.741Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319473"
title: "[open] concatenation of unsanitized input into exec() command"
---
# [open] concatenation of unsanitized input into exec() command

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-13

- Report: [https://hackerone.com/reports/319473](https://hackerone.com/reports/319473)
- CWE: Command Injection - Generic
- Submitted: 2018-02-25T06:14:22.741Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report command injection in `open`.
It allows to inject arbitrary shell commands by specifing crafted urls.

# Module

**module name:** open
**version:** 0.0.5
**npm page:** `https://www.npmjs.com/package/open`

## Module Description

> Open a file or url in the user's preferred application.

## Module Stats

31 293 downloads in the last day
473 107 downloads in the last week
1 968 932 downloads in the last month

~23 627 184 estimated downloads per year

# Vulnerability

## Vulnerability Description

Urls are not properly escaped before concatenating them into the command that is opened using `exec()`.

## Steps To Reproduce:

```js
require("open")("http://example.com/`touch /tmp/tada`");
```

Observe `/tmp/tada/` file created.

Supporting Material/References:

- Arch Linux Current
- Node.js 9.5.0
- npm 5.6.0
- bash 4.4.012

# Wrap up

- I contacted the maintainer to let him know: N 
- I opened an issue in the related repository: N

## Impact

User A who can pass urls for them being `open`-ed on machine B can execute arbitrary shell commands on machine B.

## Timeline

- **Report Filed**
- **2018-03-03** @chalker: This one is pretty bad imo.
- **2018-03-03** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-04-24** @lirantal: @chalker no response from the author.
how do we feel about disclosing the vulnerability? I also see that the "homepage" for the npm package leads to a github repo with a deprecation notice.
- **2018-04-29** @chalker: Last commit in 2014. If attempts to contact the authors failed, I suppose disclosure is justified.
- **2018-04-29** @chalker: Give me a few days to take a look at packages depending on it, though.
- **2018-05-12** @chalker: @lirantal I suppose this can be disclosed.
- **Report Severity Updated**
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **Report Title Updated**
