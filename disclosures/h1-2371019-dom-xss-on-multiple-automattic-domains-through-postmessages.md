---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
date: 2024-02-26
submitted: 2024-02-12T11:08:21.025Z
bounty_usd: null
votes: 92
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "renniepak"
source: "https://hackerone.com/reports/2371019"
title: "DOM XSS on multiple Automattic domains through postMessages"
---
# DOM XSS on multiple Automattic domains through postMessages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 92 | **Program:** Automattic | **Disclosed:** 2024-02-26

- Report: [https://hackerone.com/reports/2371019](https://hackerone.com/reports/2371019)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2024-02-12T11:08:21.025Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-02-12** @ehtis: Hi @renniepak,

Thank you for the report. We're looking into this - will get back to you soon with an update.
- **2024-02-12** @renniepak: Thanks @ehtis,

For the record, this one is also vulnerable:

https://0-a.nl/jetpackxssclick.html?url=https://blog.gravatar.com/2013/01/14/gravatar-translations/
- **2024-02-12** @renniepak: And:

https://0-a.nl/jetpackxssclick.html?url=https://blog.intensedebate.com/2014/01/22/get-involved/

But you get the point :)
- **2024-02-13** @renniepak: For the record:

It seems the XSS on widgets.wp.com is now fixed by adjusting the following code:

```javascript
name: (e.name + "").replace(/</g, "&lt;").replace(/>/g, "&gt;")
```
- **2024-02-13** @renniepak: Hi @ehtis,

I was wondering if the vulnerability in the postMessage listener in Jetpack is eligible for a CVE. And in general: once this report is resolved, could we disclose? I'd love to do a writeup about it (some day).

Thanks!

Kind regards,

René
- **2024-02-13** @ehtis: Hi @renniepak,

Yes, we worked on some immediate mitigation for widgets.wp.com - overall fix is still in the works. We'll let you know once that is done. If we push out any fixes in the Jetpack plugin, it most likely will be eligible for a CVE and yes, a disclosure will also be available. :)

Thanks!
- **2024-02-13** @renniepak: Thanks a lot @ehtis!
- **Report Resolved**
- **Bounty Awarded**
- **2024-02-22** @renniepak: Thank you @ehtis!
Can we disclose this report?

Kind regards,

renniepak
- **Agreed On Going Public**
- **2024-02-26** @ehtis: Hi @renniepak,

Sure! Would you like a full disclosure or limited?
- **2024-02-26** @renniepak: Full disclosure is fine! Thanks!
- **Agreed On Going Public**
- **Report Became Public**
