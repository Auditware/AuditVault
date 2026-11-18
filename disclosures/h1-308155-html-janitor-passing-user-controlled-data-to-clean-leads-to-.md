---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2018-02-09
submitted: 2018-01-23T12:34:13.662Z
bounty_usd: null
votes: 5
cve: "CVE-2017-0931"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/308155"
title: "[html-janitor] Passing user-controlled data to clean() leads to XSS"
---
# [html-janitor] Passing user-controlled data to clean() leads to XSS

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-09

- Report: [https://hackerone.com/reports/308155](https://hackerone.com/reports/308155)
- CWE: Cross-site Scripting (XSS) - DOM | CVE: CVE-2017-0931
- Submitted: 2018-01-23T12:34:13.662Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Module:**

* Name: [html-janitor](https://www.npmjs.com/package/html-janitor)
* Version: 2.0.2

**Summary:**

Passing user-controlled data to the module's clean() function can result in arbitrary JS execution, because of unsafe DOM operations. 

The description "*Cleans up your markup and allows you to take control of your HTML. HTMLJanitor uses a defined whitelist to limit HTML it is given to a defined subset.*" implies that "dirty" HTML is expected and therefore I would assume the clean method should never result in arbitrary JS being executed.

**Description:**

The following will result in JS execution:
```javascript
var myJanitor = new HTMLJanitor({tags:{p:{}}});
var cleanHtml = myJanitor.clean("<p><img src onerror=alert()><p>")
```

because [of this code](https://github.com/guardian/html-janitor/blob/master/src/html-janitor.js#L44):

```js
HTMLJanitor.prototype.clean = function (html) {
    var sandbox = document.createElement('div'); // This is not a safe way to create a sandbox.
    sandbox.innerHTML = html; // At this point, the onerror in the img is triggered.
```

**Recommendation:**

The "sandbox" should be created using safe browser APIs such as `document.implementation.createHTMLDocument();`.

*Note that I previously reported this issue at https://github.com/guardian/html-janitor/issues/34*

## Impact

Given the module's description I would assume it should be used to prevent XSS vulnerabilities. This is currently a very dangerous assumption given that the module itself has a XSS vulnerability. 

Note that the author might have never intended to feed untrusted data into the clean() function. However, in that case this should be at least mentioned in the documentation, because other developers most certainly will use the package in such scenarios.

## Timeline

- **Report Filed**
- **Changed Scope**
- **2018-01-23** @lirantal: Hi Martin,

Thanks for another detailed report on the problem and fix.
Even though the actual fix might be in different places, it seems that both this and the other issue (308158) have the same context, vulnerability and impact/end result. Do you agree we can set this one as a duplicate?
- **2018-01-23** @bayotop: Hi, I agree that the impact/end result is the same for anyone using the library. Nonetheless, it's a different vulnerability. This one is a XSS in the library's code. 308158 is a sanitization bypass that allows arbitrary HTML to slip through the cleaning process regardless of the initial settings passed to the `HTMLJanitor()` constructor. 

I tried to keep the issues separate for the sake of transparency, tracking, etc. 

If handling both issues in one report works better for you then that's fine with me.

On the other hand, it would make perfect sense to label this one as a duplicate in case the author decides that untrusted input was never considered.  Updating the documentation accordingly would solve both issues. Maybe we should wait for what they have to say?
- **2018-01-23** @lirantal: Sounds good.
- **Report Triaged**
- **Report Severity Updated**
- **Cve Id Added**
- **Cve Id Added**
- **2018-02-09** @lirantal: I will publicly disclose the vulnerability as we did with the related report #308158.

Thanks again @bayotop for reporting this to the Node.js ecosystem, we appreciate it1
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
