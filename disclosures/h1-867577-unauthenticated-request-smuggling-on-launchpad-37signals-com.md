---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-10-28
submitted: 2020-05-07T04:16:23.389Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hazimaslam"
source: "https://hackerone.com/reports/867577"
title: "Unauthenticated request smuggling on launchpad.37signals.com"
---
# Unauthenticated request smuggling on launchpad.37signals.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Basecamp | **Disclosed:** 2020-10-28

- Report: [https://hackerone.com/reports/867577](https://hackerone.com/reports/867577)
- CWE: HTTP Request Smuggling
- Submitted: 2020-05-07T04:16:23.389Z

## Timeline

- **Report Filed**
- **2020-05-09** @rosa: Hi @hazimaslam,

Thanks for sending this report! We'll take a look and let you know.
- **2020-05-13** @georgeclaghorn: Hi @hazimaslam, sorry for the delay. We’re still looking into this report and will get back to you by Friday.
- **Bounty Awarded**
- **Report Triaged**
- **2020-06-21** @hazimaslam: Hi @georgeclaghorn, I hope you're doing well.

Thanks for the award. However, given the severity, I feel like it's low. Anyways, thank you!

@rosa I would like to have my test account trial period extended for following accounts:

h0x01.highrisehq.com
h0x02.highrisehq.com

Also, it would be really nice to have one of those "hey.com" invites, if possible. 😊 

Thanks,
Hazim
- **2020-06-23** @rosa: Hey @hazimaslam, sorry for the delay replying! We've been a bit overwhelmed with HEY launch 😅

I've already extended your trial for these Highrise accounts until the end of this year. I'll follow up tomorrow re: bounty for this report and with HEY invites.

Thank you!
- **Bounty Awarded**
- **2020-06-24** @rosa: Hey again!

I've set a higher bounty for this report. We talked about it and agreed our initial amount was too low given the severity. 

Here you have also an invite code for HEY, can be used 3 times: `ackpb5n`

Thank you!
- **2020-06-24** @hazimaslam: @rosa Thank you so much for additional award as well as HEY invites. 😊
- **2020-07-13** @georgeclaghorn: We’ve deployed a fix for this. The desync is between our load balancers and next-hop nginx servers. The load balancers now reject requests with both Content-Length and Transfer-Encoding headers with a 400 Bad Request response. This is technically a spec violation, but it’s our best option for now.

Mind confirming, @hazimaslam?
- **2020-07-14** @hazimaslam: Confirming it fixed. 👍 

{F907397}
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
