---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss
  - vuln/code-injection
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2022-05-25
submitted: 2022-05-03T15:29:14.440Z
bounty_usd: null
votes: 102
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "bugra"
source: "https://hackerone.com/reports/1558010"
title: "Blind XSS in app.pullrequest.com/████████ via /reviews/ratings/{uuid}"
---
# Blind XSS in app.pullrequest.com/████████ via /reviews/ratings/{uuid}

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 102 | **Program:** HackerOne | **Disclosed:** 2022-05-25

- Report: [https://hackerone.com/reports/1558010](https://hackerone.com/reports/1558010)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2022-05-03T15:29:14.440Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hi,

While researching PullRequest yesterday, I saw some "review" endpoints in web archive of "app.pullrequest.com". (http://web.archive.org/cdx/search/cdx?url=app.pullrequest.com/*&output=text&fl=original&collapse=urlkey)

One of them was https://app.pullrequest.com/reviews/ratings/6eaa6b75-b958-4530-ba46-0d00cbe74e0b/false , I went to that endpoint and filled the all fields with my blind XSS payload.
`'"><img src=x id=█████ onerror=eval(atob(this.id))>`

This payload sends an alert to my blind XSS application in `██████`

Today (May 3, 2022, 6:09 pm UTC+3), I got a lot of alerts from https://app.pullrequest.com/███. I checked the report and I see it came from an PullRequest admin who checks reviews. 

Here is a screenshot from the report :

███████

I checked the HTML source code and I see my payload reflected to `Disliked_reviewers`,  `Liked_reviewers` and `Reasons` fields without any encoding. 

You can also check the source code : █████████

## Impact

Blind XSS in PullRequest admin portal

Regards,
Bugra

## Timeline

- **Report Filed**
- **2022-05-03** @bugra: Note : my payload is in the `<div id="feedback-types-content">` without any encoding. The payload reflected to other fields as HTML encoded.

Also I'm sure I can extract other admin pages using a JavaScript code that sends XHR requests (like `/████`,`/█████` etc.) . So, I think the impact is great.
- **2022-05-05** @h1_analyst_indy: Hi @bugra,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chapeau
- **Report Title Updated**
- **Report Severity Updated**
- **2022-05-05** @h1_analyst_indy: Hi @bugra,

Thanks for your submission!

To fully validate this report requires the internal system access, therefore, I'm forwarding this report to our internal team to take a closer look.

I changed the severity of this report to None for now. Once this report gets accepted, the team will analyze the impacts and assess the severity correctly. Thanks for your understanding!

Kind regards,
@chapeau
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-05-16** @bugra: Thanks!
- **Report Retesting**
- **2022-05-17** @bugra: Hi @jobert, I filled the new rating with the XSS payloads. Can you check on your side?
- **2022-05-17** @jobert: Hi @bugra - this seems fixed! Here's what we're seeing in the admin panel. Thanks!
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-05-25** @bugra: Hi @jobert, can you also redact my domain and the XSS payload?
- **2022-05-25** @jobert: @bugra Of course — done!
- **Agreed On Going Public**
- **Report Became Public**
