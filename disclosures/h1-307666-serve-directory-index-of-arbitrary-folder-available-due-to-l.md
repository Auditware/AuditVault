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
body: true
date: 2018-01-23
submitted: 2018-01-21T15:44:02.801Z
bounty_usd: null
votes: 10
cve: "CVE-2018-3712"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/307666"
title: "[serve] Directory index of arbitrary folder available due to lack of sanitization of %2e and %2f characters in url"
---
# [serve] Directory index of arbitrary folder available due to lack of sanitization of %2e and %2f characters in url

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2018-01-23

- Report: [https://hackerone.com/reports/307666](https://hackerone.com/reports/307666)
- CWE: Path Traversal | CVE: CVE-2018-3712
- Submitted: 2018-01-21T15:44:02.801Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

This report is about Arbitrary Directory Listing vulnerability I found in serve module.
Vulnerability does not allow to open arbitrary file due to ```send``` module which handles file reading and implements its own validation and protection against Path Traversal attacks.

However ```serve``` handles directory listing on its own and does not protect against listing of any directory on the remote server.

**Module:** 

```Serve``` is a module which allows to server static files and browse directories in the browser. The vulnerability exists in the latest available version (6.4.8)

Link to npm page: https://www.npmjs.com/package/serve

**Summary:** 

```Serve``` does not handle ```%2e``` (.) and ```%2f``` (/) and allows to use them in paths, which can be used do go up through directory tree and lists content of any directory.


## Steps To Reproduce:

- install ```serve```

```
$ npm install serve
```

- create simple application which uses ```http-pages``` for serving static files from local server:

```javascript
const serve = require('serve')

const server = serve(__dirname, {
    port: 4444,
    ignore: []
})
```

- run application:

```
$ node app.js
```

- open the browser and go to ```http://localhost:4444``` You should see all directories and files in the directory, where ```app.js``` was run:

{F256095}

- now, open the following url: ```http://localhost:4444/..%2f/..%2f/..%2f/..%2f/etc/``` (please adjust the number of ..%2f/ to reflect your system). You'll be able to see the content of ```/etc``` directory:

{F256096}


## Supporting Material/References:

Configuration I've used to find this vulnerability:

- macOS HighSierra 10.13.2
- node 8.9.3
- npm 5.5.1
- curl 7.54.0

## Wrap up

I hope this report will help to keep Node ecosystem more safe. If you have any questions about any details of this finding, please let me know in comment.

Thank you

Regards,

Rafal 'bl4de' Janicki

## Impact

This vulnerability allows malisious user to list content of any directory on the remote machine, where ```serve``` runs. Although it's not enough to open and read arbitrary files, this still might expose some sensitive information which can be used in different attacks.

## Timeline

- **Report Filed**
- **2018-01-21** @bl4de: > create simple application which uses http-pages for serving static files from local server:

Of course it should be:

create simple application which **uses ```serve```** for serving static files from local server:

Sorry for this.

Regards,

bl4de
- **2018-01-21** @vdeturckheim: hello @bl4de thanks for reporting this to us. I will be looking at it shortly.
- **Changed Scope**
- **2018-01-22** @vdeturckheim: Hello @bl4de , thanks again for reporting this. I was able to reproduce the described behavior and will consider this as a security issue. Have you already tried to contact maintaners regarding this?
- **Report Triaged**
- **2018-01-22** @bl4de: Hi @vdeturckheim 

Thank you for veryfing the issue.

I did not contact maintainers as due to existence of Node.js ecosystem program my intention was to keep the whole process of reporting and resolving  vulnerability consistent and managed through this report. 

Also I didn't want to open issue in official package GitHub repository to not to raise the flag and put package users into the situation that vulnerability might be exploited against them before maintainers even had a chance to patch it.

Feel free to contact/invite anyone who might be interested/involved.

Regards,

bl4de
- **2018-01-22** @vdeturckheim: Perfect, @bl4de , I have just emailed the lead maintainer of this package (and pinged him through a DM on twitter).
- **2018-01-22** @bl4de: Great! As I am going to spend some time on Node.js ecosystem  program,  I'll be keeping this way of raising issues in the future as well (I mean I will always open report on HackerOne first).

Are you ok with this?

bl4de
- **2018-01-22** @vdeturckheim: @bl4de no problem with that. It is procedure to us to ask if you already contacted the maintainer so it might happen often but we are used to contacting them ourselves and this is totally fine!
- **2018-01-22** @bl4de: @vdeturckheim That's perfect. Let's keep this in that way in the future then.

Thanks again for this program and  amazing opportunity to help Node.js ecosystem to be safe :)

Regards,

bl4de
- **2018-01-22** @vdeturckheim: Leo Lamprecht has been invited to this report.
- **External User Joined**
- **Report Severity Updated**
- **2018-01-22** @notquiteleo: Thanks for reporting this, guys!

I'll work on this today and get a patch shipped.

Will keep you updated.
- **2018-01-22** @vdeturckheim: Awesome, @notquiteleo .
I just required a CVE through HackerOne since we do not do it at Foundation level at the moment).
- **Cve Id Added**
- **2018-01-23** @notquiteleo: Just posted a fix:

https://github.com/zeit/serve/pull/316

Can you verify that it's working by doing `npm install && npm link && serve` locally?

Thanks!
- **2018-01-23** @bl4de: Hi @notquiteleo 

As far as I can test the patch, I am not able to reproduce this issue anymore. Seems that ```decodeURIComponent()``` and ```is-path-inside``` do  their job well here  :)

This is response I get from the server when trying to go "up":

```
$ curl -v --path-as-is http://localhost:4444/..%2f/..%2f/..%2f/..%2f/..%2f/etc/
*   Trying ::1...
* Connected to localhost (::1) port 4444 (#0)
> GET /..%2f/..%2f/..%2f/..%2f/..%2f/etc/ HTTP/1.1
> Host: localhost:4444
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 400 Bad Request
< Content-Length: 11
< Date: Tue, 23 Jan 2018 13:37:24 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact
Bad Request
```

That's pretty good behaviour tho :)
Good job!

Regards,

bl4de
- **2018-01-23** @vdeturckheim: @notquiteleo @bl4de awesome, great job by both of you! 

@notquiteleo when do you think you will release the patched version? Also, do you know if all versions older than 6.4.8 are affected? 

If that's good for everyone, I'd like to disclose this after release of the patch.
- **2018-01-23** @bl4de: Hi @vdeturckheim,

I'll be more than happy to see this report disclosed :)

bl4de

PS. Working with you guys is just a pleasure.
- **2018-01-23** @notquiteleo: Thanks again for helping out!

I just released `serve` 6.4.9 with that patch: https://github.com/zeit/serve/releases/tag/6.4.9

@vdeturckheim Older versions than 6.4.8 are probably also affected.

@bl4de I'd like to hand you a $500 bounty for catching the bug. Can you reach out to leo@zeit.co with your preferred way of receiving it? I can also offer you 1 year "Pro" on Now (https://zeit.co).

Let me know!
- **Report Resolved**
- **2018-01-23** @bl4de: That's awesome @notquiteleo,  thank you so much!

Stay Safe guys!

bl4de
- **Agreed On Going Public**
- **2018-01-23** @notquiteleo: @vdeturckheim Sure, go ahead. You can make it public now!
- **Manually Disclosed**
- **Report Vulnerability Types Updated**
