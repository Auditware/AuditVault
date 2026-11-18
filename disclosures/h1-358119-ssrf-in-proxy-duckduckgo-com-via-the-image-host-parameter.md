---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2018-08-15
submitted: 2018-05-27T15:39:32.113Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "fpatrik"
source: "https://hackerone.com/reports/358119"
title: "SSRF in proxy.duckduckgo.com via the image_host parameter"
---
# SSRF in proxy.duckduckgo.com via the image_host parameter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** DuckDuckGo | **Disclosed:** 2018-08-15

- Report: [https://hackerone.com/reports/358119](https://hackerone.com/reports/358119)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-05-27T15:39:32.113Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description

https://proxy.duckduckgo.com/iur/ endpoint is vulnerable to ssrf via image_host
get parameter.

## Vulnerable URL:
https://proxy.duckduckgo.com/iur/?f=1&image_host=https://tudomanyok.hu/

## Some internal URL:
https://proxy.duckduckgo.com/iur/?f=1&image_host=https://127.0.0.1:18091/
http://127.0.0.1:9998/
http://127.0.0.1:8092/
http://127.0.0.1:8091/

The only restriction that is there must be a http:// or https:// before the URL so you can't go with ssh://

# How to reporduce

1. Go to one of the internal urls and you will see that there is something (some url is only visible with view-source)
2. The best example is the  http://127.0.0.1:18091/ one if you will visit: view-source:https://proxy.duckduckgo.com/iur/?f=1&image_host=https://127.0.0.1:18091/ui/ that there is something called couchebase console. (only visible in view-source)

These are I think internal web ports because I wasn't able to go to these ports from the external proxy.duckduckgo.com url.

## Impact

Attacker can scan your internal network, finding internal port, and internal web applications

The hacker selected the **Server-Side Request Forgery (SSRF)** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**Can internal services be reached bypassing network access control?**
Yes

**What internal services were accessible?**
http://127.0.0.1:9998/
http://127.0.0.1:8092/
http://127.0.0.1:8091/
https://127.0.0.1:18091/
...

**Security Impact**
I was possible to reach internal services, however I didn't tested that is that important or not (because i didn't want to violate any law)

## Timeline

- **Report Filed**
- **2018-05-28** @doggos: Hi @fpatrik,

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Regards,
@doggos
- **Report Severity Updated**
- **2018-05-28** @doggos: Hi @fpatrik,

We were able to validate your report, and we have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and if/when a fix will be implemented. We will follow-up after the remediation team has assessed the impact of this report. Please note that the status and severity are subject to change.

Regards,
@doggos
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **2018-06-01** @fpatrik: Hello,

Thanks for the quick fix!
I can verify that this is fixed now.

Regards,
@fpatrik
- **2018-06-01** @fpatrik: Hello @doggos,

According to the Policy: "we would love to send you some swag" is it enough for some swag?

Thanks!
@fpatrik
- **2018-06-03** @doggos: Hi @fpatrik,

I'll go ahead and check with them!

Best Regards,
@doggos
- **Swag Awarded**
- **2018-06-04** @doggos: Sorry for the delay @fpatrik, we were having some troubles awarding swag! Thanks for the report!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-10-16** @marcantonio: Hi @fpatrik. I'm following up on some old cases. Did you get your swag?
- **2018-10-16** @fpatrik: Hi @marcantonio. I didn't get my swag.
- **2018-10-19** @marcantonio: @fpatrik so sorry about that. It looks like we misplaced this one. We are sending something new out for you today. Thanks!
- **2018-10-20** @fpatrik: @marcantonio Thanks!
