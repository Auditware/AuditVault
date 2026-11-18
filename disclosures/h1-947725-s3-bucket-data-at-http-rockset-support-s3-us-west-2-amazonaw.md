---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-08-05
submitted: 2020-07-30T09:51:44.819Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/rockset|Rockset]]"
reporter: "boy_child_"
source: "https://hackerone.com/reports/947725"
title: "S3 bucket data at http://rockset-support.s3-us-west-2.amazonaws.com/ reveals user addresses based on latitudes and longitudes."
---
# S3 bucket data at http://rockset-support.s3-us-west-2.amazonaws.com/ reveals user addresses based on latitudes and longitudes.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Rockset | **Disclosed:** 2020-08-05

- Report: [https://hackerone.com/reports/947725](https://hackerone.com/reports/947725)
- CWE: Information Disclosure
- Submitted: 2020-07-30T09:51:44.819Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

At the s3 bucket located at http://rockset-support.s3-us-west-2.amazonaws.com/, a file was found called ``data.json.15``that contains of interest latitudes and latitudes of user addresses.
{F930036}

**Steps to reproduce:**
1, Download the file in the bucket with the command:
```
aws s3 sync s3://rockset-support .
```
2. Open the file labelled ``data.json.15``.
3. For each line, there will be a set of latitudes and longitudes. Copy a single pair. 
{F930037}

4. Open Google Maps, enter the coordinates and click search.
{F930058}

## Impact

Specific user location information violates the privacy policy stated by Rockset for its users allowing both targeted phishing attacks and physical risk.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-05** @boy_child_: Hi @pmenglund,

Requesting for disclosure, but can the image and video be redacted from the report, because those are actual geolocation data.

Kind regards

@thatquasar
- **Agreed On Going Public**
- **Report Became Public**
