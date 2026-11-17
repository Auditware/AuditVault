---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2024-03-26
submitted: 2024-02-20T16:22:43.419Z
bounty_usd: null
votes: 101
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "0v3rw4tch"
source: "https://hackerone.com/reports/2382120"
title: "Creation of bounties through Customer API leads to private email disclosure"
---
# Creation of bounties through Customer API leads to private email disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 101 | **Program:** HackerOne | **Disclosed:** 2024-03-26

- Report: [https://hackerone.com/reports/2382120](https://hackerone.com/reports/2382120)
- CWE: Information Disclosure
- Submitted: 2024-02-20T16:22:43.419Z

## Timeline

- **Report Filed**
- **2024-02-21** @0v3rw4tch: ##POC
████
- **2024-02-22** @h1_analyst_amey: Hi @0verw4tch,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_amey
- **Report Needs More Info**
- **Report New**
- **2024-02-22** @0v3rw4tch: I seem to have missed your question here, sorry:

You are not awarding a bounty to a sandbox report, you are creating a program bounty for any report that has been made outside the program. Refer to the link I provided above. You do not need an already created report in the sandbox (The request here auto creates the report and sends an invite to the user id provided in the request). 
You are also not required to provide a report id in the HTTP request. 
All you need is the id of the user and the id of your sandbox program. 
Replace accordingly in the recipient_id and id sections.

Make sure the api token has report manager role in the sandbox team.

If you've more questions, kindly reach out. Thanks.
- **2024-02-23** @0v3rw4tch: @h1_analyst_amey 
Were you able to reproduce this?
- **2024-02-27** @0v3rw4tch: Hello @h1_analyst_amey 
Did you check this one out yet?
- **Report Needs More Info**
- **Report New**
- **2024-02-28** @0v3rw4tch: Hello @h1_analyst_oscar @h1_analyst_amey 
Did you check this out yet?
- **2024-02-29** @0v3rw4tch: Hello @h1_analyst_oscar @h1_analyst_amey 
Any updates on this?
- **Report Needs More Info**
- **Report New**
- **2024-03-01** @0v3rw4tch: Hello @h1_analyst_oscar 
Any info on this?
- **2024-03-04** @0v3rw4tch: Hello @h1_analyst_oscar 
Were you able to run the code?
- **Report Pending Program Review**
- **Report Triaged**
- **Bounty Awarded**
- **2024-03-06** @0v3rw4tch: Hello @chriszo111 
Thanks for the bounty.
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Report Title Updated**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2024-03-08** @h1_chriszo111: Not a problem! We will request disclosure again at a later time.  Would you mind also addressing the open question in my previous comment?

> Additionally, could you please confirm that you have removed any actual email addresses you found as part of this investigation? Thank you for your understanding and cooperation!
- **2024-03-08** @0v3rw4tch: Hello @chriszo111 
Yes any emails found have been removed. 
Most of my testing was done on my other test accounts.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-03-26** @0v3rw4tch: @chriszo111 
Recent events with the duplicate report have made me to believe that this should be falling under the api.hackerone.com and not hackerone.com.

Possible to review that?
- **2024-03-28** @hendrik_hv01h: Hey @0verw4tch,

 While the proof of concept leveraged the API, the underlying vulnerability resided in our core platform functionality, rather than being API-specific. 

Kind regards,
@hendrik_hv01h
- **2024-03-28** @0v3rw4tch: @hendrik_hv01h 
Sure thing! Came to realize that. Sorry.
- **Bounty Awarded**
- **2024-05-16** @cevans_0glc8: The severity rating of this should have been "High" for consistency with https://hackerone.com/reports/2032716, and to line up with actual impact.

Not to worry. When HackerOne makes an error, the hacker gets to keep any accidental bonus!
