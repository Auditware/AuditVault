---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/php
substate: "not-applicable"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2017-10-18
submitted: 2017-10-17T16:11:32.470Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/codeigniter|CodeIgniter]]"
reporter: "hackerneo"
source: "https://hackerone.com/reports/278225"
title: "If the developer forgets to remove the built in controller welcome.php it helps the attacker to identify that the site is built with Codeigniter"
---
# If the developer forgets to remove the built in controller welcome.php it helps the attacker to identify that the site is built with Codeigniter

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** CodeIgniter | **Disclosed:** 2017-10-18

- Report: [https://hackerone.com/reports/278225](https://hackerone.com/reports/278225)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2017-10-17T16:11:32.470Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The attacker can check the website's backend technology simply by typing site_name/index.php/welcome/index it will display the codeigniter welcome page if the developer dosen't removed the built in controller and view welcome.php and welcome_message.php i attaching a screenshot below as a proof of concept

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
