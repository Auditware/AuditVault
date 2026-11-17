---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2021-10-15
submitted: 2021-02-12T10:41:52.074Z
bounty_usd: null
votes: 18
cve: "CVE-2021-40097"
program: "[[programs/concretecms|Concrete CMS]]"
reporter: "d3addog"
source: "https://hackerone.com/reports/1102067"
title: "Authenticated path traversal to RCE"
---
# Authenticated path traversal to RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Concrete CMS | **Disclosed:** 2021-10-15

- Report: [https://hackerone.com/reports/1102067](https://hackerone.com/reports/1102067)
- CWE: Path Traversal | CVE: CVE-2021-40097
- Submitted: 2021-02-12T10:41:52.074Z

## Timeline

- **Report Filed**
- **2021-04-14** @d3addog: any updates?
- **Report Severity Updated**
- **Report Triaged**
- **2021-08-20** @lisaciso: Hello @d3addog,

Thanks again for all the work you did on reporting this vulnerability to us. 

A fix for this vulnerability you reported has been merged into these release candidates: 
9.0.0RC3https://www.concretecms.com/download_file/8c1f8bf8-6e0f-4730-bfb6-649c8213f283
8.5.6RC1https://www.concretecms.com/download_file/2e714705-d861-484f-9e33-2b7ecfd7e585

It would be greatly appreciated if you could verify that we have indeed fixed the issue. 

I will be attaching a CVE to this HackerOne report. Respectfully, please do not disclose the CVE until we give you the "ok" to do so. Thanks for understanding!

~Lisa
- **Cve Id Added**
- **2021-09-16** @lisaciso: @d3addog does this CVE also need to be credited to ""Solar Security Research Team"
- **Report Resolved**
- **2021-10-04** @lisaciso: NIST scored as 8.8 CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H.  Published https://nvd.nist.gov/vuln/detail/CVE-2021-40097
- **2021-10-04** @lisaciso: @d3addog you may disclose at will
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
