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
date: 2021-08-03
submitted: 2021-06-06T19:56:04.315Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "superman85"
source: "https://hackerone.com/reports/1218680"
title: "Improper authorization on `/api/as/v1/credentials/` for  Dev Role User with Limited Engine Access"
---
# Improper authorization on `/api/as/v1/credentials/` for  Dev Role User with Limited Engine Access

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Elastic | **Disclosed:** 2021-08-03

- Report: [https://hackerone.com/reports/1218680](https://hackerone.com/reports/1218680)
- CWE: Improper Access Control - Generic
- Submitted: 2021-06-06T19:56:04.315Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2021-06-07** @superman85: Additional Impact: 
-------------------
API keys with full read/write access to all engines, Dev role user with limited access engine can create Meta Engine via API 
https://www.elastic.co/guide/en/app-search/current/meta-engines-guide.html
```
Creating Meta Engines in the UI
You must have the "Admin" or "Owner" role to create a Meta Engine.
```
- **Report Triaged**
- **2021-06-08** @orangeband: Hi @superman85,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@orangeband
- **2021-06-14** @superman85: @douglas_day Any updates on this case and #1218685

Thanks
- **Bounty Awarded**
- **Bounty Awarded**
- **2021-06-14** @superman85: Thank you so much for the bounty! It will helped me a lot!
- **2021-06-16** @douglas_day: Hey @superman85 !

Something we like to do at Elastic is use neat bugs from our Bug bounty program as training material for our developers. If you are able to make a short video presentation about your bug, I'd love to award you a couple hundred dollars as a bonus :) I would just need a 5-10 minute video where you talk about:

- Who you are
- How you like to hack on Elastic
- What your bug is
- How you found the bug
- How developers can avoid making similar bugs in the future

Is this something you think you could do for us? :)
- **2021-06-17** @superman85: Hi @douglas_day Thank you for your proposal. I will try to create video when I came back home today. I hope it will not terrible hehe
- **2021-06-17** @superman85: @douglas_day I need to prepare some things before making a video. I will update information soon, sorry for the delay!
- **2021-06-18** @superman85: Hi @douglas_day I have finished record a 5 minutes talk  
██████
Please take a look and let me know :)
- **2021-06-18** @douglas_day: This is perfect @superman85 !

Than you for helping us out :) 

Before I award you the bonus, I wanted to see if you wanted to change the bounty splitting with @dee-see so that you get the whole bonus.

Once you are ready, let me know and I'll award you your bonus!
- **2021-06-18** @superman85: @douglas_day I have adjusted the bounty splitting. Thank you for the bonus!
@dee-see Sorry I can not set bounty weight to 0, so you will get a small money
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **2021-08-03** @superman85: Since the report was resolved. Lets disclose it, please redact my video training. Thanks
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
