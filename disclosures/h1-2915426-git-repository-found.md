---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "not-applicable"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2025-07-07
submitted: 2024-12-27T15:10:29.925Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/curl|curl]]"
reporter: "tefa_"
source: "https://hackerone.com/reports/2915426"
title: "Git repository found"
---
# Git repository found

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** curl | **Disclosed:** 2025-07-07

- Report: [https://hackerone.com/reports/2915426](https://hackerone.com/reports/2915426)
- CWE: Information Disclosure
- Submitted: 2024-12-27T15:10:29.925Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello team , 
When i research I found domain vuln to downliad git repository and i will explain that.

## Steps To Reproduce:

1. Add DotGit extention on your browser
2. Now try to access to that domain https://curl.dev/
3. You will show that extention is alert and can download that bucket.

## Impact

## Summary:
The exposure of the /.git directory can lead to unauthorized access to sensitive information, such as source code, configuration files, and potentially secrets or credentials stored in the repository.

## Timeline

- **Report Filed**
- **2024-12-27** @tefa_: To show that domain visit that url https://curl.se/libcurl/
- **Report Not Applicable**
- **2024-12-27** @tefa_: You are right but i foud that website in the main domain should be remove .
- **2024-12-27** @jimfuller2024: Despite being told that this is explicitly not a secret is there something we are missing ? Why do you think this should be removed ?
- **2024-12-27** @tefa_: Because i found that domain on the main website and contain the domain name (curl) and when any visit that domain you can download git repository you have two fix:-
1. Remove that domain from the url.
2. Now allow download Git repository.
- **2024-12-27** @jimfuller2024: Not sure I understand ... 

    https://github.com/curl/curl.dev

is publicly available

I guess if we adulterated .git/config with something else that might be a problem ... but not seeing the issue
- **Agreed On Going Public**
- **Manually Disclosed**
