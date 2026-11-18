---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss
  - trigger/file-upload
  - fix/csp
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2024-08-10
submitted: 2021-10-25T12:43:03.559Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "gronke"
source: "https://hackerone.com/reports/1380157"
title: "Content-Security Policy bypass with File Uploads"
---
# Content-Security Policy bypass with File Uploads

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Rocket.Chat | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/1380157](https://hackerone.com/reports/1380157)
- CWE: N/A
- Submitted: 2021-10-25T12:43:03.559Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The current default CSP header in Rocket.Chat prevents inline script execution, which can be bypassed by importing a script file uploaded via the Rocket.Chat file upload.

## Description

The default CSP header blocks execution of inline-scripts. When a HTML injection vulnerability occurs though, that restriction can be bypassed by uploading a JavaScript file via the file-upload feature (with `application/javascript` or `text/javascript` content-type) to include it in a `<script src="<UPLOAD_URL></script>" tag.

It is worth noticing that script tags are removed from message content, but this filter can also be bypassed as following:

```html
<iframe srcdoc="&#x3c;script src='/file-upload/<UPLOAD ID>/payload.js?download'></script>">
```

## Releases Affected:

  * 4.0.3
  * 3.18.2

## Steps To Reproduce (from initial installation to vulnerability):

  1. Upload payload as `payload.js` via File Upload feature
  2. Inject iframe with srcdoc via arbitary XSS

## Suggested mitigation

  * Block script content-types from file-uploads
  * Filter frames from message body

## Impact

The CSP `unsafe-inline` restriction can be bypassed by uploading script payload as File Upload.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
