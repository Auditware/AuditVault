---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2017-09-23
submitted: 2017-06-29T20:05:48.533Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "jackb898"
source: "https://hackerone.com/reports/244504"
title: "Possible SOP bypass in www.starbucks.com due to insecure crossdomain.xml"
---
# Possible SOP bypass in www.starbucks.com due to insecure crossdomain.xml

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Starbucks | **Disclosed:** 2017-09-23

- Report: [https://hackerone.com/reports/244504](https://hackerone.com/reports/244504)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2017-06-29T20:05:48.533Z

## Report summary

Ah, my early reports. I've come quite a ways from reporting things before I understood exactly what they were. Nonetheless I got pretty creative here and recognized that a problem existed in this configuration, one that turned out to be a high impact problem. For web developers: *always* keep your crossdomain.xml allowed domains up to date if you have something other than wildcard allowed! Thank you to the Starbucks team for an efficient and helpful response.

## Timeline

- **Report Filed**
- **2017-06-29** @joystick: Hi,

Thank you for your submission. We are investigating your report, and will let you know if we have any questions. We appreciate your assistance and cooperation. 

Regards.
- **Report Vulnerability Types Updated**
- **Report Title Updated**
- **Report Title Updated**
- **2017-06-30** @jackb898: Thanks for fixing the title. I really didn't know how to describe or categorize it.
- **Report Triaged**
- **2017-07-01** @jackb898: Great, thanks. I'll be offline for about 2 weeks beginning tomorrow in case you're trying to ask me anything.
- **Bounty Awarded**
- **2017-07-15** @jackb898: Thanks for the bounty! May we disclose this after the entry is removed?
- **2017-08-02** @jackb898: Just curious if you have an estimated time of removing the crossdomain entry?
- **2017-08-08** @siren: Hi @kicker,

I'm expecting a release to address this very soon and will provide another update as soon as I have confirmation it has been deployed.
Once this is closed out we can disclose.

Thanks!
- **2017-08-24** @jackb898: Hello, I see you've updated the crossdomain.xml files across your domains. That should resolve the issue as far as I can tell.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
- **Report Severity Updated**
- **Changed Scope**
