---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2019-09-18
submitted: 2019-08-16T00:26:53.604Z
bounty_usd: 280
votes: 20
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "hackbotone_"
source: "https://hackerone.com/reports/674774"
title: "AppLovin API Key hardcoded in a Github repo"
---
# AppLovin API Key hardcoded in a Github repo

> **Severity:** High | **Bounty:** 280 USD | **Votes:** 20 | **Program:** X / xAI | **Disclosed:** 2019-09-18

- Report: [https://hackerone.com/reports/674774](https://hackerone.com/reports/674774)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2019-08-16T00:26:53.604Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
I found a Sensitive Data Exposure in github/mopub-android-mediation project, the AppLovin UI API key is hardcoded in source code. 

And in the comment it's mentioned that 
##"This is a unique SDK Key from AppLovin. Get yours from the AppLovin UI".

Github Link:- https://github.com/mopub/mopub-android-mediation/blob/72804166ec9f3b79cc0dcfa96bd8c813f3252794/Testing/src/main/AndroidManifest.xml#L60

Google Ads SDK reference link:- https://developers.google.com/admob/android/mediation/applovin

Thanks
Anshuman Pattnaik

## Impact

So if it's a production API key then it shouldn't be shown publicly in Github repo otherwise it can be used by other developers as it's a company property the API key should be secure as it's a monetize API key.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2019-08-19** @bugtriage-alex: Thank you for your report @anshuman_pattnaik,

We were able to reproduce the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **Bounty Awarded**
- **2019-08-27** @hackbotone_: Thank you for the bounty reward !!!

But still i can see the API_KEY is in Github repo?

Thanks
Anshuman
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
