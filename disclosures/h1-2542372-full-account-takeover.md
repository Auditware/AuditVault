---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2024-08-17
submitted: 2024-06-08T14:23:10.555Z
bounty_usd: null
votes: 123
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "impozzible"
source: "https://hackerone.com/reports/2542372"
title: "FULL ACCOUNT TAKEOVER"
---
# FULL ACCOUNT TAKEOVER

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 123 | **Program:** MTN Group | **Disclosed:** 2024-08-17

- Report: [https://hackerone.com/reports/2542372](https://hackerone.com/reports/2542372)
- CWE: N/A
- Submitted: 2024-06-08T14:23:10.555Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-06-10** @impozzible: Ok great, thanks. Let me know if you have any questions
- **2024-06-12** @slydingdong1: Hi @impozzible 

Can you provide the date which you ran the POC, we want to check the logs of the activity you performed.


Regards
- **2024-06-12** @impozzible: Hello @slydingdong1 , it was done same day the report was made June 8, 2024
- **2024-06-14** @slydingdong1: Hi @impozzible ,

The fix has been applied please test again.

Regards,
- **2024-06-14** @impozzible: Ok @slydingdong1, will check again now
- **2024-06-14** @impozzible: {F3357341}
Just tried testing, but the selfservice is not currently working,
- **2024-06-17** @impozzible: So I tried again, and I am still able to reproduce the issue, the site behaves weird where OTP is delayed multiple times, but the issue still persists
- **2024-06-19** @slydingdong1: Hi @impozzible
 
Please see the extract from the site developer and confirm if what they are saying is practical :\
"The action we put won’t stop the users from been able to pass the alternative number from the frontend, but the backend application would ignore it. 

Please confirm if user can log in to the primary number using the alternate number flow
"
regards,
- **2024-06-20** @impozzible: Yes I was able to login to the primary number using the alternate number flow, I described above, I still replicated same scenario this evening
- **2024-06-20** @impozzible: {F3374997}
The picture above shows the request  {\"msisdn\":\"2348144091760|2347033412902\}..., the only alternate number on 2348144091760 is 2347059717498, in this request you can see I am passing 2347033412902 as the alternate number
{F3374998}
The picture above shows the response from the server, indicating the request was successful

{F3374999}

The picture above shows 2347033412902 receiving the OTP which should not have worked.
- **2024-07-03** @slydingdong1: Hi @impozzible 
Alternative linked number feature has been blocked so that OTP does not get to the unauthorized user to prevent account take over.
Kindly re-assess to confirm loophole has been blocked. 
Please test again.

Regards,
- **Report Resolved**
- **2024-07-12** @impozzible: Confirmed to be closed, @slydingdong1 can we make this report public, since issue has been fixed
- **Agreed On Going Public**
- **Report Became Public**
