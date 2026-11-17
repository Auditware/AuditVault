---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-09-02
submitted: 2020-05-07T00:51:25.479Z
bounty_usd: null
votes: 3006
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "imgnotfound"
source: "https://hackerone.com/reports/867513"
title: "Takeover an account that doesn't have a Shopify ID and more"
---
# Takeover an account that doesn't have a Shopify ID and more

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3006 | **Program:** Shopify | **Disclosed:** 2020-09-02

- Report: [https://hackerone.com/reports/867513](https://hackerone.com/reports/867513)
- CWE: N/A
- Submitted: 2020-05-07T00:51:25.479Z

## Report summary

A report from @francisbeaudoin showed that it was possible to bypass Shopify's email verification for a small subset of Shopify user accounts. Doing so would have allowed a user to access accounts they did not own. 

Our team immediately deployed a change to address this issue. Additionally, we have removed the ability to verify an email address prior to merging an account. All account merges now require an email verification flow.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2020-05-07** @imgnotfound: As a FYI, in the video, the victim's store was also a development store (created in a separate partner account) to make sure that the shop owner "StaffMember" object isn't attached to any account on accounts.myshopify.com, which I believe is a Shopify ID.

It might be possible to takeover already existing Shopify ID but will require digging deeper.
- **Report Triaged**
- **2020-05-07** @imgnotfound: Alright, thanks for quick update!
- **2020-05-08** @clayton: A quick update: we deployed a preliminary fix to prevent email changes made through our API from bypassing email validation requirements. Our engineering team is continuing to investigate, and we'll be in touch again soon.
- **2020-05-08** @imgnotfound: I made some testing of the preliminary fix for the email change and it does look good! You guys are quite efficient and I really appreciate working with you guys :)
- **Bounty Awarded**
- **Report Resolved**
- **2020-05-13** @imgnotfound: Awesome, thanks a lot for that bounty!
- **Agreed On Going Public**
- **2020-06-30** @shopify-peteryaworski: Hi @francisbeaudoin,
just wanted to let you know we haven't forgotten about the disclosure request on this one, we just need to follow up internally on it. Sorry it's taken so long.
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **2020-12-22** @imgnotfound: Really appreciate you all taking time to make that video - it really made my day!

Thanks again and happy holiday to all of you!
- **Swag Awarded**
- **2021-01-08** @imgnotfound: Yeah, thanks :)
- **Bounty Awarded**
