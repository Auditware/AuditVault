---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-03-03
submitted: 2021-12-16T21:21:48.610Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/rails|Ruby on Rails]]"
reporter: "nagli"
source: "https://hackerone.com/reports/1429148"
title: "Subdomain Takeover at https://new.rubyonrails.org/"
---
# Subdomain Takeover at https://new.rubyonrails.org/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Ruby on Rails | **Disclosed:** 2022-03-03

- Report: [https://hackerone.com/reports/1429148](https://hackerone.com/reports/1429148)
- CWE: Privilege Escalation
- Submitted: 2021-12-16T21:21:48.610Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Disclaimer

I know it's OOS but the issue is pretty serious because of the attractive domain name "new.rubyonrails.org" basically anyone could have put malware there.

## Summary
Hi!

I discovered that new.rubyonrails.org was pointing to an unclaimed Github Page, making it vulnerable to subdomain takeover.
I've managed to claim it in my Github-account and added a simple html file as POC:

{F1548667}

`https://new.rubyonrails.org`

## Mitigation
- Remove the DNS record

Best regards,
nagli

## Impact

Subdomain takeovers can be used for
- Cookies set to the root domain will be shared with this subdomain and can be obtained
- Stored XSS (arbitrary javascript code can be executed in a users browser)
- Phishing
- Hosting malicious content

## Timeline

- **Report Filed**
- **2022-01-04** @tenderlove: @nagli thanks for reporting this. I pinged the people that manage DNS and I'll update this ticket when I get more info.  Thank you!
- **2022-01-18** @nagli: Hi, I think it's fixed @tenderlove
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Not Eligible For Bounty**
