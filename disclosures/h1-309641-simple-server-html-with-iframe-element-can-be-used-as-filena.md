---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-03-01
submitted: 2018-01-26T21:38:57.170Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3717"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309641"
title: "[simple-server] HTML with iframe element can be used as filename, which might lead to load and execute malicious JavaScript "
---
# [simple-server] HTML with iframe element can be used as filename, which might lead to load and execute malicious JavaScript 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-01

- Report: [https://hackerone.com/reports/309641](https://hackerone.com/reports/309641)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3717
- Submitted: 2018-01-26T21:38:57.170Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**simple-server** allows to embed HTML in file names, which (in certain conditions) might lead to execute malicious JavaScript. This is caused by outdated version of ```connect``` framework.

**Module:** 

Simple Server allows you to easily get a node.js static file server up and running anywhere anytime.

https://www.npmjs.com/package/simple-server

**Description**

This issue is exactly the same I've reported for ```anywhere``` module (https://hackerone.com/reports/309394).
The problem is outdated ```connect``` framework (2.10.0) with obsolete middleware used to display content of the directory as HTML.

This is the code which allows to embed HTML in file names and execute attack described in PoC (```/node_modules/connect/lib/middleware/directory.js```, lines 192-197):

```javascript

    return '<li><a href="'
      + utils.normalizeSlashes(normalize(path.join('/')))
      + '" class="'
      + classes.join(' ') + '"'
      + ' title="' + file + '">'
      + icon + file + '</a></li>';
```

As you can see, ```file``` is output directly into HTML without any sanitization.

Now, take a look how the same fragment of code looks in ```serve-index``` middleware, introduced in place of old middlewares like ```directory.js``` above, and  used in current Connect and Express frameworks (https://github.com/expressjs/serve-index/blob/a399faa1801f02ee1885e5664ed21a9c7990b63a/index.js#L279):

```javascript
return '<li><a href="'
      + escapeHtml(normalizeSlashes(normalize(path.join('/'))))
      + '" class="' + escapeHtml(classes.join(' ')) + '"'
      + ' title="' + escapeHtml(file.name) + '">'
      + '<span class="name">' + escapeHtml(file.name) + '</span>'
      + '<span class="size">' + escapeHtml(size) + '</span>'
      + '<span class="date">' + escapeHtml(date) + '</span>'
      + '</a></li>';
```

All output data is sanitized with ```escapeHtml()``` which sanitizes HTML before is send to browser.

I think this is the problem of all older npm modules using old versions of Connect middlewares like ```directory.js```.


## PoC - Steps To Reproduce:

In the directory which will be served via ```simple-server```, create file with following name:

```
"><iframe src="malware_frame.html">
```

Then, HTML file with following content have to be saved in the same directory as file with the name changed:

```
<html>

<head>
    <meta charset="utf8" />
    <title>Frame embeded with malware :P</title>
</head>

<body>
    <p>iframe element with malicious code</p>
    <script type="text/javascript" src="malware.js"></script>
</body>

</html>
```

An ```src``` attribute value I've used here is just for PoC purpose, this can be any external url.
On my local machine, ```malware.js``` has following content:

```
alert('Uh oh, I am very bad malware!')
```

Run ```simple-server`` in directory where both file with filename changed and ```malware_frame.html``` are saved:

```
$ ./node_modules/simple-server/bin/simple-server.js ./ 8080
Simple-Server listening to http://:::8080/ with directory /Users/bl4de/playground/node_bugbounty_playground
```

and open ```http://127.0.0.1:8080``` in the browser, you can see JavaScript from ```malware.js``` is executed.

## Supporting Material/References:

Configuration I've used to find this vulnerability:

- macOS HighSierra 10.13.3
- node 8.9.3
- npm 5.5.1
- curl 7.54.0

## Wrap up

I hope this report will help to keep Node ecosystem more safe. If you have any questions about any details of this finding, please let me know in comment.

Thank you

Regards,

Rafal 'bl4de' Janicki

## Impact

Exploitation of this vulnerability in the wild might be hard, however it's not impossible and it depends only on attacker's skills to get into directory on the server, where ```simple-server``` is used to serve static content.

## Timeline

- **Report Filed**
- **2018-01-29** @vdeturckheim: Hey @bl4de thanks you for this report! We will shortly look at it!
- **2018-01-30** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **External User Joined**
- **2018-01-30** @balupton: Author here. This is a package for quick and dirty local dev from 2011 that has unsupported and outdated labels on its github page.
- **2018-01-30** @balupton: Argh. Seem people use it despite the above: https://github.com/balupton/simple-server/network/dependents

Will push up something better.
- **2018-01-30** @lirantal: Hey @balupton,

Happy you joined us, and appreciate the quick response! :-)
I already requested a CVE assigned so we'll also have that coming in soon.
- **2018-01-30** @balupton: Alright. New version released that just aliases `zeit/serve`. Hopefully the dependents will upgrade.
- **2018-01-30** @lirantal: This was swift, thanks @balupton!
@bl4de can you confirm?

@balupton are you ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **2018-01-30** @bl4de: Hi @lirantal , @balupton 

I can't reproduce this issue anymore, seems to be fixed :)

bl4de
- **2018-01-30** @balupton: > are you ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)

Sure thing.
- **Cve Id Added**
- **Cve Id Added**
- **2018-01-30** @lirantal: Great. Thanks a lot to both of you working on this!
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-01-30** @balupton: I've sent PRs to the most popular dependents to remove simple-server or swap it out for serve directly.

- https://github.com/noflo/noflo-ui/pull/846
- https://github.com/jonnor/projects/pull/2
- https://github.com/babakhani/pwt.datepicker/pull/206
- https://github.com/FabModules/fabmodules-html5/pull/32
- **2018-01-31** @lirantal: @balupton thanks for the pro-active attitude!
- **Report Became Public**
- **Changed Scope**
- **Report Severity Updated**
