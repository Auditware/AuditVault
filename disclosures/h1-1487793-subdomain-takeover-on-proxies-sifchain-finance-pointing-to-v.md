---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
substate: "informative"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2022-04-01
submitted: 2022-02-21T19:10:08.552Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/sifchain|Sifchain]]"
reporter: "hrdfrdh"
source: "https://hackerone.com/reports/1487793"
title: "Subdomain Takeover on proxies.sifchain.finance pointing to vercel"
---
# Subdomain Takeover on proxies.sifchain.finance pointing to vercel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Sifchain | **Disclosed:** 2022-04-01

- Report: [https://hackerone.com/reports/1487793](https://hackerone.com/reports/1487793)
- CWE: Misconfiguration
- Submitted: 2022-02-21T19:10:08.552Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,

Subdomain takeover vulnerabilities occur when a subdomain (subdomain.example.com) is pointing to a service (e.g. GitHub pages, Heroku, etc.) that has been removed or deleted. This allows an attacker to set up a page on the service that was being used and point their page to that subdomain. For example, if subdomain.example.com was pointing to a GitHub page and the user decided to delete their GitHub page, an attacker can now create a GitHub page, add a CNAME file containing subdomain.example.com, and claim subdomain.example.com.
Here there is a Sifchain domain  (proxies.sifchain.finance) which is pointing towards vercel pages so  this domain can be taken over can can be used to do any type of attacks mostly i can make a fake login page on your behalf and spoof your users, this is a critical vulnerability and needs to be fixed .

{F1627827}

Vulnerable url : https://proxies.sifchain.finance/

{F1627821}

Cname: cname.vercel-dns.com
Name: proxies.sifchain.finance
Type: CNAME
Class: IN

## Steps To Reproduce/Concept:

1. Visit https://vercel.com/login and login with dev sifchain account

2. Check the availability of the proxies.sifchain.finance sub domain at https://vercel.com/[YourUsername]/sveltekit/settings/domains

3. The proxies.sifchain.finance sub domain does not exist. Potential to be claimed by others

## Remediation:
Remove the cname entry or claim the subdomain proxies.sifchain.finance on vercel.com

## References:
https://github.com/EdOverflow/can-i-take-over-xyz/issues/183

{F1627822}
{F1627826}

https://github.com/EdOverflow/can-i-take-over-xyz
https://labs.detectify.com/2014/10/21/hostile-subdomain-takeover-using-herokugithubdesk-more/
https://0xpatrik.com/subdomain-takeover/
http://yassineaboukir.com/blog/neglected-dns-records-exploited-to-takeover-subdomains/

Best Regards,
@hrdfrdh

## Impact

Fake website
Malicious code injection
Users tricking
Company impersonation
This issue can have really huge impact on the companies reputation someone could post malicious content on the compromised site and then your users will think it's official but it's not

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Not Applicable**
- **2022-02-24** @hrdfrdh: Hi Team,

I found the following discussion https://github.com/vercel/vercel/discussions/5436

I'm trying to send a ticket to support so I can add the subdomain dex2.sifchain.finance

I did some more research as you might be interested in the possible loopholes and potential subdomain takeovers

{F1631422}

{F1631420}

Best,
@hrdfrdh
- **2022-02-26** @khdegraaf: Thanks for the update.
- **Report Reopened**
- **Report Informative**
- **Bounty Awarded**
- **2022-03-28** @hrdfrdh: Hi @khdegraaf & Team

Thank you for the bounty

Regards,
@hrdfrdh
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
