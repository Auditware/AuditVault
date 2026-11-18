---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2021-04-10
submitted: 2021-02-24T15:19:33.483Z
bounty_usd: null
votes: 135
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "monke"
source: "https://hackerone.com/reports/1110229"
title: "Reflected/Stored XSS on duckduckgo.com"
---
# Reflected/Stored XSS on duckduckgo.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 135 | **Program:** DuckDuckGo | **Disclosed:** 2021-04-10

- Report: [https://hackerone.com/reports/1110229](https://hackerone.com/reports/1110229)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2021-02-24T15:19:33.483Z

## Report summary

Writeup here: https://monke.ie/duckduckgoxss/

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi DuckDuckGo,

While browsing normally (since I use DuckDuckGo on a daily basis), I discovered an interesting stored XSS on the duckduckgo main search engine. A payload that somebody had left on urbandictionary.com had triggered a HTML injection, and a stored XSS as a result. 

**Steps to Reproduce**
1. Search the following in the searchbar of DuckDuckGo: `urban dictionary "><img src=x<`
2. A payload left by someone else will render itself and fire in the main DuckDuckGo page.
3. It is also possible to visit the page via the DuckDuckGo URL as [such](https://duckduckgo.com/?q=urban+dictionary+%22%3E%3Cimg+src%3Dx%3C&t=ffab&atb=v1-1&ia=web) and the XSS will trigger.

**POC**
- The page itself renders HTML. The payload fires.
- {F1207848}
- {F1207849}

## Impact

There are several impacts here.
- Firstly, the DuckDuckGo URL serves as a payload, because simply visiting the page with the right search parameter triggers the XSS, although the search parameters themselves do not directly trigger it. 
- Secondly, the XSS is stored in the search results, so this can be considered to be Stored XSS.
- It is possible to execute any Javascript via the main DuckDuckGo page.

If you have any questions or require clarification, I am happy to help.
Cheers,
PMOC

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **External User Joined**
- **2021-03-09** @monke: Hi, 

It seems that this bug has been fixed - any update on your end?

Cheers, 
PMOC
- **2021-03-11** @h1_analyst_jake: Hi @pmoc,

Despite the behavior is no longer reproducible, the team didn't take any actions as a result of this submission. Apparently, the same behavior was previously reported by another researcher and, likewise, it was no longer reproducible when the team picked up the report. On the other side, I was instead able to verify the issue.

I highlighted what described above internally and I will ping the team once to make sure my comment didn't slip through their queue. I will be back as soon as there's more information to share.

Best,
@lugtag
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **Report Became Public**
