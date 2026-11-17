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
date: 2018-03-06
submitted: 2018-02-23T12:44:58.526Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3734"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/319003"
title: "[stattic] Inproper path validation leads to Path Traversal and allows to read arbitrary files with any extension(s)"
---
# [stattic] Inproper path validation leads to Path Traversal and allows to read arbitrary files with any extension(s)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-06

- Report: [https://hackerone.com/reports/319003](https://hackerone.com/reports/319003)
- CWE: Path Traversal | CVE: CVE-2018-3734
- Submitted: 2018-02-23T12:44:58.526Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **2018-02-23** @lirantal: Hi @bl4de,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Cve Id Added**
- **2018-03-03** @lirantal: I opened a generic security issue in the repo to invite the maintainers to the discussion.
- **External User Joined**
- **2018-03-05** @jmjuanes: Hi,
Thanks for your report. This issue is now solved in `v0.3.0`.

```
$ git clone https://github.com/jmjuanes/stattic.git
$ cd stattic/
$ ll
total 64
-rw-r--r--  1 jmjuanes  staff  1081 Mar  5 11:01 LICENSE
-rw-r--r--  1 jmjuanes  staff  2372 Mar  5 11:01 README.md
drwxr-xr-x  3 jmjuanes  staff   102 Mar  5 11:01 assets
-rw-r--r--  1 jmjuanes  staff   731 Mar  5 12:56 cli.js
-rw-r--r--  1 jmjuanes  staff  4279 Mar  5 12:49 index.js
drwxr-xr-x  5 jmjuanes  staff   170 Mar  5 12:56 node_modules
-rw-r--r--  1 jmjuanes  staff   594 Mar  5 12:56 package-lock.json
-rw-r--r--  1 jmjuanes  staff   513 Mar  5 12:57 package.json
-rw-r--r--  1 jmjuanes  staff   335 Mar  5 11:01 stattic.iml
$ node cli.js --folder ./assets

Static server listening on: http://localhost:5000
Reading files from: /Users/jmjuanes/workspace/stattic/assets
```
If you try to read the `package.json` file located in the parent folder, it throws a 404 http status:
```
$ curl -v --path-as-is http://localhost:5000/../package.json
*   Trying ::1...
* Connected to localhost (::1) port 5000 (#0)
> GET /../package.json HTTP/1.1
> Host: localhost:5000
> User-Agent: curl/7.43.0
> Accept: */*
>
< HTTP/1.1 404 OK
< Content-Type: text/html
< Date: Mon, 05 Mar 2018 14:28:53 GMT
< Connection: keep-alive
< Transfer-Encoding: chunked
<
<!-- External resources -->
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">

<!-- Styles -->
<style>
  body
  {
    font-family: 'Montserrat', sans-serif;
    margin: 0px;
    margin-top: 200px;
    padding: 0px;
    font-size: 14px;
    color: #697496;
  }
  .error-header
  {
    display:block;
    font-size: 17px;
    font-weight: bold;
    color: #57607c;
    margin-bottom: 8px;
  }
  .error-detail
  {
    display: block;
  }
</style>

<!-- Error header -->
<div class="error-header" align="center">Error 404</div>

<!-- Error detail information -->
<div class="error-detail" align="center">File not found on the server. Try again or contact with the administrator.</div>
* Connection #0 to host localhost left intact
```

Further comments or issues, please open a new issue in the repository. 

Regards,
Jose.
- **2018-03-05** @bl4de: Hi @jmjuanes ,

Thanks for the fix! Looks good to me :)

@lirantal - I can confirm issue is not reproducible in 0.3.0 :)

bl4de
- **2018-03-05** @lirantal: Great stuff guys, thanks!
@jmjuanes @bl4de are you both ok if I proceed with a full public disclosure of the report?
- **Report Resolved**
- **Agreed On Going Public**
- **2018-03-06** @jmjuanes: @lirantal Yes, please :)
- **Manually Disclosed**
