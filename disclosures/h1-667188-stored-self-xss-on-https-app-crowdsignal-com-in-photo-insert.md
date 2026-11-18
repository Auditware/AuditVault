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
date: 2019-10-21
submitted: 2019-08-04T17:49:50.225Z
bounty_usd: null
votes: 68
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ali"
source: "https://hackerone.com/reports/667188"
title: "Stored Self XSS on https://app.crowdsignal.com (in Photo Insert App) + Stored XSS on https://*your-subdomain*.survey.fm"
---
# Stored Self XSS on https://app.crowdsignal.com (in Photo Insert App) + Stored XSS on https://*your-subdomain*.survey.fm

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 68 | **Program:** Automattic | **Disclosed:** 2019-10-21

- Report: [https://hackerone.com/reports/667188](https://hackerone.com/reports/667188)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-08-04T17:49:50.225Z

## Report summary

I love bug bounty.
I love xss.
https://twitter.com/alicanact60

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Steps:
1. Go to https://app.crowdsignal.com/dashboard and click Create a New > Quiz
2. Add Multiple Choice to your page and click image button, upload a photo and click upload.
3. Start the burp suite and click Save button. Look at the request (poc1.png) and you will see media_code= parameter. It will be your photo's id and change it as payload and forward the request. Payload: "><svg/onload=alert(document.domain)> 
4. Now you will see xss (poc2.png). Copy the quiz link and open it the new tab. You will see second xss (poc3.png). And this one is stored xss.

## Impact

XSS

## Timeline

- **Report Filed**
- **2019-08-07** @ali: Hey @automattic
- **2019-08-10** @ali: Hey @automattic
- **2019-08-12** @ali: Hi there,
1 week passed. Any update?

And do you accept mitm attacks? I saw this report: https://hackerone.com/reports/206650 . That's why I asked.

Regards,
@mygf
- **2019-08-12** @cgastrell: Thanks for the report @mygf We're going to take a look and let you know.
- **2019-08-12** @ali: Thanks, I'm waiting @cgastrell 
And I asked a question:
`And do you accept mitm attacks? I saw this report: https://hackerone.com/reports/206650 . That's why I asked.`
- **2019-08-13** @ali: Hi sir,
Have you any update?

Regards,
@mygf
- **2019-08-15** @cgastrell: We've deployed a patch to address this issue. @mygf could you try again an post your results? Thanks.
- **2019-08-15** @ali: Hi @cgastrell,
I tried a few bypass method but I can't reproduce it. So, it's fixed.

Regards,
@mygf
- **2019-08-15** @cgastrell: Thanks for your report. We'll be getting in touch with you in a few days about a bounty.
- **2019-08-15** @ali: Thank you, I'm waiting. 

@mygf
- **2019-08-16** @ali: Hi @cgastrell,
Can you triage my report?

Regards,
@mygf
- **Report Triaged**
- **2019-08-19** @ali: Hi sir,
Any update about bounty? @donncha @cgastrell 

Regards,
@mygf
- **Report Resolved**
- **Bounty Awarded**
- **2019-10-05** @ali: Disclosure?
- **Agreed On Going Public**
- **2019-10-06** @ali: @xknown @donncha @cgastrell
- **2019-10-19** @ali: Hi there!
Any update? @xknown @donncha @cgastrell
- **Agreed On Going Public**
- **Report Became Public**
- **2020-07-16** @ali: Hello @xknown @donncha @cgastrell,
I can't load my report ( #920005 ). I think you should contact with support@hackerone.com.

Best Regards,
@mygf
