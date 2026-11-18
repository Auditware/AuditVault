---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - vuln/xss
  - vuln/code-injection
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2019-06-25
submitted: 2019-06-08T02:00:23.696Z
bounty_usd: 2500
votes: 171
cve: []
program: "[[programs/upserve|Upserve ]]"
reporter: "gamer7112"
source: "https://hackerone.com/reports/603764"
title: "DOM Based XSS via postMessage at https://inventory.upserve.com/login/"
---
# DOM Based XSS via postMessage at https://inventory.upserve.com/login/

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 171 | **Program:** Upserve  | **Disclosed:** 2019-06-25

- Report: [https://hackerone.com/reports/603764](https://hackerone.com/reports/603764)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2019-06-08T02:00:23.696Z

## Report summary

Due to incomplete origin validation, DOM-based XSS was possible at https://inventory.upserve.com/login/ when receiving a postMessage.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Description
DOM based XSS is possible at https://inventory.upserve.com/login/ due to insecure origin checking when receiving a postMessage.

#POC
1. Visit https://hq.upserve.com.████████/upserve_xss.html
2. Click link
3. View alert on https://inventory.upserve.com

#Vulnerable Code
```javascript
window.addEventListener("message", function(e) {
  if (~e.origin.indexOf("https://hq.upserve.com")) {
    if (e.data && typeof e.data == "object") {
      try {
        if (e.data["exec"]) {
          eval(e.data["exec"]);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Non-object passed");
    }
  } else {
    console.log("Incorrect origin: " + e.origin.toString());
    return;
  }
});
```
The origin check simply determines if "https://hq.upserve.com" is anywhere in the origin so an origin like "https://hq.upserve.com.mydomain.com" will pass this check just fine.

## Impact

Due to the page being a login page, login credentials could be logged and stolen when a victim goes to login.

## Timeline

- **Report Filed**
- **2019-06-08** @nasr0x01: Hi @gamer7112, thanks for your submission. Your report is being reviewed and you'll hear back as soon as there's more to share.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **Bounty Awarded**
- **2019-06-12** @upserve-bryan: @gamer7112 thank you for your report. We have deployed a fix. Can you verify that you cannot bypass the fix?
- **2019-06-12** @gamer7112: Thanks for the bounty, I've verified the fix and the patch seems to not be bypassable.
- **Report Resolved**
- **2019-06-24** @gamer7112: Hello, I'd like to request disclosure but would like if the domain `█████████` could be removed from the report first?
- **2019-06-24** @upserve-bryan: @gamer7112 i have redacted the domain
- **Agreed On Going Public**
- **Changed Scope**
- **Agreed On Going Public**
- **Report Became Public**
