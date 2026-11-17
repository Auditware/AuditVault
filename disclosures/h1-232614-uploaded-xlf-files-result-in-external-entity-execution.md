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
date: 2017-06-02
submitted: 2017-05-28T11:12:25.002Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/weblate|Weblate]]"
reporter: "4cad"
source: "https://hackerone.com/reports/232614"
title: "Uploaded XLF files result in External Entity Execution"
---
# Uploaded XLF files result in External Entity Execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Weblate | **Disclosed:** 2017-06-02

- Report: [https://hackerone.com/reports/232614](https://hackerone.com/reports/232614)
- CWE: XML External Entities (XXE)
- Submitted: 2017-05-28T11:12:25.002Z

## Timeline

- **Report Filed**
- **2017-05-28** @4cad: I have not been able to get it to make a HTTP request, so it seems likely to me that this attack is limited to reading arbitrary files on the filesystem - which is a mitigating factor.

I have not actually tested the file formats, but from reading through the translate-toolkit supported formats list I suspect that .NET Resource Files (.resx) and Android String Resource files may be similarly vulnerable since they are also XML based.
- **2017-05-29** @4cad: Just an FYI it looks like HackerOne changes the file extension of the malicious upload from "xlf" to "xml" when you download it, so you have to change it back to ".xlf" before uploading it in order for it to work.

Also, by putting the external entity into an XML attribute I can covertly check whether or not a file path is valid without leaving a trace in a translation project because the upload fails but the error message is different depending on whether or not the path can be read.
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
