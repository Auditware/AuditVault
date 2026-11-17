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
date: 2018-02-26
submitted: 2018-02-06T14:08:47.103Z
bounty_usd: null
votes: 9
cve: "CVE-2018-3729"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/312889"
title: "[localhost-now] Path Traversal allows to read content of arbitrary file"
---
# [localhost-now] Path Traversal allows to read content of arbitrary file

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/312889](https://hackerone.com/reports/312889)
- CWE: Path Traversal | CVE: CVE-2018-3729
- Submitted: 2018-02-06T14:08:47.103Z

## Timeline

- **Report Filed**
- **2018-02-07** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Changed Scope**
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-02-26** @lirantal: @bl4de can you confirm the newly released version from the author fixes the problem?
- **2018-02-26** @bl4de: Hi @lirantal 

Yes, I can confirm I can't reproduce this issue in 1.0.2:

```
$ curl -v --path-as-is http://127.0.0.1:1337/../../../../../etc/passwd
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 1337 (#0)
> GET /../../../../../etc/passwd HTTP/1.1
> Host: 127.0.0.1:1337
> User-Agent: curl/7.54.0
> Accept: */*
>
< HTTP/1.1 404 Not Found
< Date: Mon, 26 Feb 2018 21:00:02 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
* Connection #0 to host 127.0.0.1 left intact
```
- **2018-02-26** @lirantal: Great thanks. I'll proceed with a forced public disclosure then.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
