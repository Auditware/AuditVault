---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-06-28
submitted: 2023-04-24T11:40:24.169Z
bounty_usd: null
votes: 73
cve: []
program: "[[programs/indrive|inDrive]]"
reporter: "spongebhav"
source: "https://hackerone.com/reports/1960107"
title: "Rider can forcefully get passenger's order accepted resulting in multiple impacts including PII reveal  and more mentioned in the report."
---
# Rider can forcefully get passenger's order accepted resulting in multiple impacts including PII reveal  and more mentioned in the report.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 73 | **Program:** inDrive | **Disclosed:** 2023-06-28

- Report: [https://hackerone.com/reports/1960107](https://hackerone.com/reports/1960107)
- CWE: Improper Access Control - Generic
- Submitted: 2023-04-24T11:40:24.169Z

## Report summary

A vulnerability was found in a customer order flow that allowed a driver to accept an order on behalf of a passenger. This vulnerability allowed the driver to set the ride price by force bypassing the built-in ride price calculation algorithm, where the passenger and the driver negotiate the fare based on their preferences.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello Indrive Security Team,
This is going to be chain of attacks with major flow being in /api/setTenderStatus request allowing the attacker to get their ride request accepted automatically.

## Steps To Reproduce:

1st major vulnerability:
// Forcefully getting the passenger to accept the ride

### Section 1

1. Whenever a rider/driver offers the passenger their price there is a request that is sent to /api/driverrequest

█████

2. Now after getting the tenderID and OrderID from that request, the rider sends the request in /api/setTenderStatus in this format

█████████

Here the orderID and tenderID is from step 1.

3. The ride gets accepted.



The impact for this is "The rider can get details of any passenger, this includes phone number of passengers. Even when the passenger doesn't accept the riders offer."
Please keep in mind that this can be automated in real time to make this attack more efficien.

2nd Chain vulnerability:
// Chose a out of range price

### Section 2

1. This request is sent when the rider bids his price: 

██████████

2. The rider can modify the price range to be of a much higher value than that.
3. Resulting in sending a bid that is significantly more

// Combining this with above vulnerability we can get passenger to forcefully accept the ride of the customer.



==Provide the request in curl format, if possible==

For vuln A:

```
curl https://terra-akamai.indriverapp.com/api/setTenderStatus?cid=5957&locale=en_US&phone=████&token=████████&v=7&stream_id=1682280490209367&tender_id=████████&order_id=█████████&status=accept
```

For vuln B:

```
curl https://terra-akamai.indriverapp.com/api/driverrequest?cid=5957&locale=en_US&job_id=338f72ff-f3c1-4da0-af15-5d1aa720146b&phone=██████████&token=████████&v=7&stream_id=1682279074257167&order_id=██████&client_id=█████████&shield_session_id=██████████&type=indriver&price=63&period=3&geo_arrival_time=1&distance=5&longitude=85.3249627&latitude=27.7390611&sn=1
```



Thank you so much.
Let me know if you need any further help in reproducing this issue.
@spongebhav

## Impact

1. Revealing PII of customers even if customer didn't accept the rider's request.
2. Making customer accept a bid that is significantly higher tricking the customer into giving more money.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2023-04-25** @spongebhav: Also, apologies, the video and sound may mismatch due to 3 videos put in one. I am not a good editor that's for sure :P
- **Report Triaged**
- **Bounty Awarded**
- **2023-05-02** @ttffdd_indriver: Nice finding! Very great job, thanks
- **2023-05-02** @spongebhav: Hello @ttffdd_indriver 

> Nice finding! Very great job, thanks

Thank you so much for the bounty and for the compliments.

I was wondering, since it was a chain consisting of ***two*** different vulnerabilities, and impact affected both ***PII*** and ***financial***.

Does it qualify for a single award or there is a bonus bounty award for such cases where multiple vulns are reported as one to increase impact?

I wanted to know your take on this.

Please let me know your final ruling on this report.

Thank you again. :D
@spongebhav
- **2023-05-02** @majesttic: Hi @spongebhav! 

The vulnerable request is `/api/setTenderStatus`, which allows the driver to accept an offer for a passenger. This breaks the logic of the application and reveals information about the passenger. 

The `/api/driverrequest` is not vulnerable, you can offer a price higher, lower or accept the passenger's price. The passenger then decides which offer to accept. This method is not vulnerable.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
