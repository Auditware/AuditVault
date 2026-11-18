---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-11-05
submitted: 2018-08-24T23:21:37.544Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "suyog"
source: "https://hackerone.com/reports/399174"
title: "Access MoPub Reports Data even after Company removed you from their MoPub Account."
---
# Access MoPub Reports Data even after Company removed you from their MoPub Account.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** X / xAI | **Disclosed:** 2019-11-05

- Report: [https://hackerone.com/reports/399174](https://hackerone.com/reports/399174)
- CWE: Information Disclosure
- Submitted: 2018-08-24T23:21:37.544Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description + Attacking approach

**API Workflow** :

- The MoPub Reporting API supports two separate CSV outputs where publishers can retrieve inventory or campaign performance data.

- Publishers can retrieve daily reports via making a GET request using the request parameters.

- This URL will return a 302 redirect response. The link to download the report will be returned in the response location header.

-----

**How you grab Report data even after company removed you**

- If Publisher/Company invite you for their MoPub Account with any permissions & Roles.
 ("administrators or Members" - it doesn't matter, which permission company gives you while invitation)

- After accept the invitation you have access to make all changes to the company account. 

-----

**Attacking approach start from here**

- In order to retrieve data, the API must first be enabled for company account.
- So, you can Enable data access through API (just click on checkbox in the Reports page of the MoPub UI.)
or it might be already enabled by publisher.
- Note down the "Reporting API access details". [i.e. API key, Inventory report ID, Campaign report ID]
- Also Note the Report ID of each MoPub Report present inside the Company Account.

**!!!**

- Now, the publisher/company doesn't want you with their MoPub account and they removed you from their Manage User settings.
- But they forgot to Reset API key.
- Now, you don't have any access of company account. 

> NOTE! **You have the "Reporting API access details (which you noted)".**

-----

**Access the Reporting API :**

- GET request using the request parameters.

[report_key=[individual_report_id ; inventory_report_id ; campaign_report_id]
api_key=[API_KEY]
date=Date of the report. Format YYYY-MM-DD]
https://app.mopub.com/reports/custom/api/download_report?report_key=[REP_KEY]&api_key=[API_KEY]&date=[YYYY-MM-DD]

- Sample Request:

██████████

-----

##Remediation :

1. API key must be auto-reset after the user removed from company.
2. **(for 2nd condition in impact)** Once the Data access is disabled, user should not be able to access reports data via API.


.


**Thank you : )**

## Impact

- Attacker(removed user) able to access Organization Current as well as in Future created MoPub reports in 2 conditions :

1. If API key is not reset and "data access through API" checkbox is enabled 
2. If API key is not reset and "data access through API" checkbox is disabled.

## Timeline

- **Report Filed**
- **2018-08-28** @bugtriage-michael: Thank you for your report.

We are considering this, and we'll keep you updated when we have additional information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **Bounty Awarded**
- **2018-09-03** @suyog: Hi Team,

"You are not part of that company, but you can still access the report of that company", isn't this serious issue?
Wouldn't this will come under "Everything Else" with High bounty amount category? 

If not, happy : ) but then I would love to know why not.

Thank you.
Suyog
- **2018-11-04** @suyog: Hi Team,
any updates?

-----
thank you,
**Suyog (S.P.)**
- **Report Resolved**
- **2019-01-18** @suyog: Hi there,
i tested today
n my admin account not received any warning after removing invited user(member). 
and even data is still available for public.
██████
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
