---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2018-12-12
submitted: 2018-12-10T22:08:57.783Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/liberapay|Liberapay]]"
reporter: "strukt"
source: "https://hackerone.com/reports/460121"
title: "Publicly editable GitHub wikis"
---
# Publicly editable GitHub wikis

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Liberapay | **Disclosed:** 2018-12-12

- Report: [https://hackerone.com/reports/460121](https://hackerone.com/reports/460121)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-10T22:08:57.783Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello team,

While browsing `https://github.com/liberapay` I found that many of the repositories have their wikis publicly editable by any GitHub user. The following are some of the affected repositories:
```
https://github.com/liberapay/cardregistration-js-kit/wiki
https://github.com/liberapay/mangopay2-python-sdk/wiki
```

I went on and created the following wiki page as a PoC:
`https://github.com/liberapay/cardregistration-js-kit/wiki/PoC`

## Impact

This enables an attacker to edit the wiki pages of the affected repositories completely remotely, adding content that may link to malicious code libraries that would be installed and used by developers or information that may mislead your users.

## Timeline

- **Report Filed**
- **2018-12-10** @Liberapay: Thank you for your submission! We have received your report and a security analyst will respond shortly.
- **2018-12-10** @karel_origin: Hi @strukt,

Thank you for reporting this to us. I discussed this internally and it looks like this is completely intentional since Liberapay is about the community, people, and transparency. We do appreciate your efforts, could you please self-close your report so that your HackerOne statistics will be left unharmed?

Thanks in advance,
Karel.
- **Report Needs More Info**
- **Report Not Applicable**
- **External User Joined**
- **Agreed On Going Public**
- **Manually Disclosed**
