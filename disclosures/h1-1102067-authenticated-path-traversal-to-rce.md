---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - vuln/path-traversal
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/auth-required
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

** crayons **

## Description
The `bFilename` parameter in the scenario `index.php/ccm/system/dialogs/block/design/submit` is vulnerable to remote code execution via path traversal vulnerability. Authenticated attacker with rights to edit web application pages can upload malicious PNG file containing PHP code using any attachment upload functions (for example in comment section of the blog) and then use its relative path in `bFilename` parameter while editing layout design.  The file, supplied in vulnerable parameter will be included in PHP, leading to injected malicious code to run.

## Testing setup :
Concrete5 CMS version: 8.5.4
PHP Version: 7.2.24

## Steps to reproduce
1) Login to your Concrete5 account with rights to edit pages
2) Upload using any attachment upload function png file, containing php code at its end. You can use file ```png-transparent.png``` from the attachments . It is empty PNG file with the following payload at its end:

```
<?php system("uname -a");?>
```
You can get file path for example by viewing uploaded file properties:
{F1193239}
3) Navigate to page edit constructor
4) Select any element (for example Sidebar) and click "Add Layout" -> "Add Layout"
5) Click on newly added block and select "Edit layout Design" -> Save
6) Get the request from step 5 from any web proxy (for example Burp Suite) and resend it modifying `bFilename` with the system relative path to the uploaded file, for example:

```
bFilename=../../../../application/files/9316/1312/5391/png-transparent.png
```
7) Reload the page, your are editing, and see the payload fired

{F1193235}

## Credits
This bug was found as a part of Solar Security CMS Reseach, with https://hackerone.com/d0bby, https://hackerone.com/wezery0, https://hackerone.com/silvereniqma in collaboration. Can you, please, add them to this report?

## Impact

Authenticated attacker with page editing rights can run arbitrary system commands and obtain sensitive information

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
