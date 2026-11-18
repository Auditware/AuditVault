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
submitted: 2018-01-26T22:06:10.553Z
bounty_usd: null
votes: 8
cve: "CVE-2018-3716"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309648"
title: "[simplehttpserver] Stored XSS in file names leads to malicious JavaScript code execution when directory listing is output in HTML"
---
# [simplehttpserver] Stored XSS in file names leads to malicious JavaScript code execution when directory listing is output in HTML

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-26

- Report: [https://hackerone.com/reports/309648](https://hackerone.com/reports/309648)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2018-3716
- Submitted: 2018-01-26T22:06:10.553Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Guys,

**simplehttpserver** allows to embed HTML in file names, which (in certain conditions) might lead to execute malicious JavaScript.

**Module:** 

'simpehttpserver' is simple imitiation of python's SimpleHTTPServer and intended for testing, development and debugging purposes

https://www.npmjs.com/package/simpehttpserver

**Description**

This issue is another example of lack of output sanitization. 
Here's source code, which allows to embed HTML in file name and run attack presented in PoC section (./node_modules/simplehttpserver/simplehttpserver.js, lines 106-117):


```javascript

    // Check for each file if it's a directory or a file
    var q = async.queue(function(item, cb) {
        fs.stat(path.join(pathname, item), function(err, stat) {
           if ( !stat ) cb();
           if ( stat.isDirectory() ) {
               ulist.push('<li><a href="'+item+'/">'+item+'/</a></li>')
           } else {
               ulist.push('<li><a href="'+item+'">'+item+'</a></li>')
           }
            cb();
        });
    }, 4);
```

As you can see, ```item``` is output directly into HTML without any sanitization.

## PoC - Steps To Reproduce:

In the directory which will be served via ```simple-server```, create file with following name:

```
javascript:alert('You are pwned!')
```

Run ```simplehttpserver``` in directory with file with changed filename:

```
$ ./node_modules/simplehttpserver/cli.js
Listening 0.0.0.0:8000 web root dir /Users/bl4de/playground/node_bugbounty_playground
```

and open ```http://127.0.0.1:8000``` in the browser.

Try to open file with name ```javascript:alert('You are pwned!')``` by clicking it.

{F257774}

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


## Impact:

This vulnerability can be used to eg. download malware via "drive-by-download" attacks. Also, as described in other modules I've reported similar vulnerabilty, an iframe with malicious JS file loaded from external resource can be executed.

## Impact

This vulnerability can be used to eg. download malware via "drive-by-download" attacks. Also, as described in other modules where I've reported similar vulnerabilty, an iframe with malicious JS file loaded from external resource can be executed.

## Timeline

- **Report Filed**
- **2018-01-29** @vdeturckheim: Hey @bl4de thanks you for this report! We will shortly look at it!
- **2018-01-30** @lirantal: Hi @bl4de,

Thanks for reporting this issue to us.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Report Triaged**
- **Cve Id Added**
- **Report Title Updated**
- **Report Severity Updated**
- **Changed Scope**
- **2018-02-26** @lirantal: @bl4de it seems that the author removed this package from npm. Can you also confirm?
If so I'll go ahead and publish a full disclosure.
- **2018-02-26** @bl4de: @lirantal Yes, I can confirm that. 
A little bit weird way to fix an issue, but 100% efficient - can't reproduce anymore :D
- **2018-02-26** @lirantal: :-)
I'll force a public disclosure then.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
