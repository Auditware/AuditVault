---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
  - stack/ruby
substate: "not-applicable"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2017-08-06
submitted: 2017-08-06T18:53:50.656Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/ruby|Ruby]]"
reporter: "sandeep_hodkasia"
source: "https://hackerone.com/reports/257276"
title: "Open aws s3 bucket s3://rubyci"
---
# Open aws s3 bucket s3://rubyci

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Ruby | **Disclosed:** 2017-08-06

- Report: [https://hackerone.com/reports/257276](https://hackerone.com/reports/257276)
- CWE: Information Disclosure
- Submitted: 2017-08-06T18:53:50.656Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello team,

### Description:

Ruby amazon aws bucket `https://rubyci.s3.amazonaws.com` is open with read only privilege which allows any authenticated aws user to read private files.
PFA screenshot.

Thanks,
Sandeep

## Timeline

- **Report Filed**
- **2017-08-06** @sandeep_hodkasia: Please disable all access so that any external guy would not allowed to see private files.
- **2017-08-06** @sandeep_hodkasia: directories are getting disclosed: https://rubyci.s3.amazonaws.com/aix71_ppc/ruby-2.1/last.html.gz(visit all the links)
- **2017-08-06** @sandeep_hodkasia: directories are getting disclosed: https://rubyci.s3.amazonaws.com/aix71_ppc/ruby-2.1/last.html.gz (visit all the links)
- **Report Not Applicable**
- **2017-08-06** @sandeep_hodkasia: its ok if you don't think there is any risk. let me publically disclose this on my blog.

But this may affect your system as all your logs , directory list are getting disclosed.
- **2017-08-06** @sandeep_hodkasia: its better to disable readable access.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-03-07** @sandeep_hodkasia: .
- **Comments Closed**
