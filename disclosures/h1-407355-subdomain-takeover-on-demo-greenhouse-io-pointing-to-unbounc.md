---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/phishing
  - env/web
substate: "resolved"
weakness: "Phishing"
enriched: true
body: true
date: 2020-03-05
submitted: 2018-09-08T00:08:11.421Z
bounty_usd: null
votes: 76
cve: []
program: "[[programs/greenhouse|Greenhouse.io]]"
reporter: "ninadmathpati"
source: "https://hackerone.com/reports/407355"
title: "Subdomain Takeover on demo.greenhouse.io pointing to unbouncepages"
---
# Subdomain Takeover on demo.greenhouse.io pointing to unbouncepages

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 76 | **Program:** Greenhouse.io | **Disclosed:** 2020-03-05

- Report: [https://hackerone.com/reports/407355](https://hackerone.com/reports/407355)
- CWE: Phishing
- Submitted: 2018-09-08T00:08:11.421Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Actuall this report is same as of this one:- https://hackerone.com/reports/38007  


Subdomain takeover vulnerabilities occur when a subdomain (subdomain.example.com) is pointing to a service (e.g. GitHub pages, Heroku, etc.) that has been removed or deleted. This allows an attacker to set up a page on the service that was being used and point their page to that subdomain. For example, if subdomain.example.com was pointing to a GitHub page and the user decided to delete their GitHub page, an attacker can now create a GitHub page, add a CNAME file containing subdomain.example.com, and claim subdomain.example.com.

Here there is a greenhouse domain  (demo.greenhouse.io) which is pointing towards unbounce pages so  this domain can be taken over can can be used to do any type of attacks mostly i can make a fake login page on your behalf and spoof your users, this is a critical vulnerability and needs to be fixed .

Vulnerable url : demo.greenhouse.io

PoC
Snapshot of the vulnerable page(actually for taking over from unbounce i need to take a paid subscription hich is of higher cost neraly 150-200$ i cannot afford that so as a poc i m showing you a vulnerable page hoping this should work )

cname: unbouncepages.com
Name: demo.greenhouse.io
Type: CNAME
Class: IN

## Impact

Impact
Risk
fake website
malicious code injection
users tricking
company impersonation
This issue can have really huge impact on the companies reputation someone could post malicious content on the compromised site and then your users will think it's official but it's not.

Remediation
Remove the cname entry or claim the subdomain demo.greenhouse.io on unbounce.com

See also
https://github.com/EdOverflow/can-i-take-over-xyz#unbounce
https://labs.detectify.com/2014/10/21/hostile-subdomain-takeover-using-herokugithubdesk-more/
https://0xpatrik.com/subdomain-takeover/
https://medium.com/@ajdumanhug/subdomain-takeover-through-external-services-f0f7ee2b93bd
http://yassineaboukir.com/blog/neglected-dns-records-exploited-to-takeover-subdomains/



Best regards,
Hacker2202

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2018-09-13** @ninadmathpati: Hello @rongutierrez i guess the impact of vulnerability is clear so why do i get less than what another reporter got eg:- https://hackerone.com/reports/38007  As of me i guess you should rethink of my bounty decision as this is a higher impact vulnerability.

Thank you 
Hacker2202
- **2018-09-17** @ninadmathpati: Hello sir,
Any update on bounty?
- **2018-09-19** @ninadmathpati: Hello sir,

Any update?
- **2018-09-19** @rongutierrez: Hi @hacker2202, 

The report you referenced was against a higher profile domain of than this one and also included a working proof of concept. We consider 'demo.greenhouse.io' to be a lower profile domain. In the past we have only rewarded $100 on low profile domains and when a PoC is not included. We decided to provide you with a $500 so its in between the two previous bounties. 

Also, when researching unbounce's security controls there appears like they would perform domain ownership verification if the domain was previously deleted. 

Reference - https://documentation.unbounce.com/hc/en-us/articles/360000851786

Hope this helps clear up on how we decided on the bounty amount.
- **2018-09-21** @ninadmathpati: Okay no worries, thanks for the bounty.
- **Agreed On Going Public**
- **Report Became Public**
