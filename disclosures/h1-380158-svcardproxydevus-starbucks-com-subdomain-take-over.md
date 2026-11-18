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
date: 2018-07-23
submitted: 2018-07-10T13:14:17.255Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "txt3rob"
source: "https://hackerone.com/reports/380158"
title: "svcardproxydevus.starbucks.com Subdomain take over"
---
# svcardproxydevus.starbucks.com Subdomain take over

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** Starbucks | **Disclosed:** 2018-07-23

- Report: [https://hackerone.com/reports/380158](https://hackerone.com/reports/380158)
- CWE: Improper Access Control - Generic
- Submitted: 2018-07-10T13:14:17.255Z

## Report summary

I was monitoring starbucks.com with https://takeover.cyberint.com/ and noticed it flagged up 2 subdomains with issues.

After using subfinder and tko-subs i was able to determine the subdomains which were dead and take over.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

You have left a dns record pointing to a dead cloudapp vm.

```
svcardproxydevus.starbucks.com -> s00307ntmp0svcardproxydev0.trafficmanager.net -> s00307dpipsvcardproxy00.eastus.cloudapp.azure.com = Dead
```

## Impact

```
1) Attacker takes over subdomain and then puts something like porn or something that shouldn't be on the domain.
2) hacker then contacts support pretending to be a concerned user.
3) support click on it to check what is going on
4) attacker has put responder on the page via a image file using a UNC path (https://github.com/SpiderLabs/Responder)
5) attacker is then sent supports hash for their windows login.
6) attacker then cracks hash and uses the VPN to pivot 
```

They can also use it to phish and other bad activitys

## Timeline

- **Report Filed**
- **2018-07-10** @chemex: Hi @txt3rob

Thank you for your report! I am unable to validate the takeover. I'm getting a timeout error when requesting the asset `svcardproxydevus.starbucks.com`.

Could you verify the stale DNS entry?

@chemex
- **2018-07-11** @txt3rob: Hi,

It looks like they have fixed the DNS.

As a proof I was able to take it over i ensured i got the wayback timemachine to archive my takeover.


https://web.archive.org/web/20180710174504/http://svcardproxydevus.starbucks.com/

If you right click and view frame source i put a link to my H1 profile in html comment.
- **2018-07-11** @thefrog: Hi @txt3rob,

No worries, I actually caught a glimpse of your subdomain takeover before it disappeared. I will forward this report on to the team and will keep you updated.

Best regards,
@thefrog

Security Analyst
**HackerOne**
- **Bounty Awarded**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
