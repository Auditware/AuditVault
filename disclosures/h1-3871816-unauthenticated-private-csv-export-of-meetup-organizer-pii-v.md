---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-11-05
submitted: 2026-07-18T02:44:52.844Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "0xbs0d27"
source: "https://hackerone.com/reports/3871816"
title: "Unauthenticated private CSV export of Meetup organizer PII via broken authz check in WordCamp Reports"
---
# Unauthenticated private CSV export of Meetup organizer PII via broken authz check in WordCamp Reports

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** WordPress | **Disclosed:** 2026-11-05

- Report: [https://hackerone.com/reports/3871816](https://hackerone.com/reports/3871816)
- CWE: Improper Access Control - Generic
- Submitted: 2026-07-18T02:44:52.844Z

## Report summary

An inverted authorization check in WordCamp Reports (`Meetup_Details::export_to_file()`) used `&&` instead of `||` between nonce verification and the `view_wordcamp_reports` capability check. Unauthenticated requests with an invalid nonce could export a private CSV of Meetup organizer fields (`public => false`).

## Timeline

- **Report Filed**
- **2026-07-25** @0xbs0d27: I think it's taking way too long over here to mark this as a duplicate. Mr. Duplicate hasn't shown up around here yet.
- **Report Resolved**
- **Bounty Awarded**
- **2026-11-05** @0xbs0d27: Hi @obenland and team 

This has been Resolved since July, and I wanted to ask gently: if it works for you, would you mind approving public disclosure so it can show up in Hacktivity, similar to your other WordCamp/meta reports?

I’ve added a short Hacker summary for the public view — happy to tweak anything if you’d like changes before approving.

Thanks so much, and thanks again for your work on this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
