---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/cloud
  - env/network
  - stack/docker
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2021-10-20
submitted: 2021-09-07T16:45:45.843Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "0x0luke"
source: "https://hackerone.com/reports/1332433"
title: "RCE on 17 different Docker containers on your network"
---
# RCE on 17 different Docker containers on your network

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Nextcloud | **Disclosed:** 2021-10-20

- Report: [https://hackerone.com/reports/1332433](https://hackerone.com/reports/1332433)
- CWE: Code Injection
- Submitted: 2021-09-07T16:45:45.843Z

## Timeline

- **Report Filed**
- **2021-09-07** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2021-09-07** @0x0luke: Thank you for that amazingly quick turn around!

Is this report eligible for a bounty?
- **2021-09-07** @lukasreschkenc: > Is this report eligible for a bounty?

I will have to confirm with the stakeholders internally what access the host had, and align with our management team on this. Once I've done this I'll be able to provide an answer here.
- **2021-09-07** @0x0luke: Awesome, thank you!
- **2021-09-08** @lukasreschkenc: Quick update from our end: The hostname resolves to an IP address not belonging to us anymore. We have reached out to the current owner of this system and they told us that they will shutdown Portainer.

So from a risk perspective this would be primarily a subdomain take-over. As our DNS zone has only a limited amount of people with access rights, removing the entry may take up to a week.
- **2021-09-08** @0x0luke: Ok thanks for the update, is this issue therefore resolved?
- **2021-09-08** @lukasreschkenc: We still need to remove the DNS entry on our end :-)
- **2021-09-09** @0x0luke: Hi Lukas, I've just ran a dig request against the domain and it seems to have been removed by the DNS team on your half, can you confirm this is now fixed?
- **Report Resolved**
- **2021-09-19** @0x0luke: Awesome, cheers, 

Just want to make sure this doesn't get buried but I'm guessing no update at this stage?
- **Agreed On Going Public**
- **2021-09-27** @0x0luke: HI. It's been 3 weeks since resolve, any update?
- **Not Eligible For Bounty**
- **Report Became Public**
