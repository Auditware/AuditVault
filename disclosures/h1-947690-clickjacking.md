---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/ui-redressing-clickjacking
  - env/web
substate: "not-applicable"
weakness: "UI Redressing (Clickjacking)"
enriched: true
body: true
date: 2021-03-16
submitted: 2020-07-30T08:40:20.903Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "ashish_murugan"
source: "https://hackerone.com/reports/947690"
title: "ClickJacking"
---
# ClickJacking

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Acronis | **Disclosed:** 2021-03-16

- Report: [https://hackerone.com/reports/947690](https://hackerone.com/reports/947690)
- CWE: UI Redressing (Clickjacking)
- Submitted: 2020-07-30T08:40:20.903Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have found the vulnerability called Clickjacking.

Please find the details below:

Description     

Clickjacking is an exploit in which malicious coding is hidden beneath apparently legitimate buttons or other clickable content on a website.

  OWASP Benchmark   A6- Security Misconfiguration  


Steps to Reproduce   

1.Craft an HTML page and add the following 
( https://www.acronis.com/en-in/ ) of the application within an iframe.

2.Save the file as *.html and run the file.

3.Open the HTML page in a browser.

4.The following attached screenshot shows webiste is in frame.

Please find the attached screenshot for your reference. 

High Level Fix Recommendation

Clickjacking attacks can be avoided by setting the X-Frame-Options header or by using frame busting code which check if the current web page is the top web page (not within a frame).

## Impact

Impact 

Multitude of attacks including key logging and stealing user credentials.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **External User Joined**
- **External User Joined**
- **External User Joined**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
