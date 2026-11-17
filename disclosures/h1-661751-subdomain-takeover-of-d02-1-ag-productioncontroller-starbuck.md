---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-08-15
submitted: 2019-07-27T08:21:18.351Z
bounty_usd: null
votes: 122
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "mindtrick"
source: "https://hackerone.com/reports/661751"
title: "Subdomain takeover of d02-1-ag.productioncontroller.starbucks.com"
---
# Subdomain takeover of d02-1-ag.productioncontroller.starbucks.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 122 | **Program:** Starbucks | **Disclosed:** 2019-08-15

- Report: [https://hackerone.com/reports/661751](https://hackerone.com/reports/661751)
- CWE: Privilege Escalation
- Submitted: 2019-07-27T08:21:18.351Z

## Timeline

- **Report Filed**
- **2019-07-27** @mindtrick: I realized, I didn't complete my statement in the Impact section.  I was going to finish with: 
    As mentioned in the write-up above, the possible mitigations are:
       * Remove the affected DNS record
       * Claim the domain name
- **2019-07-28** @mindtrick: I also reported the wrong asset category for this report.  This should be under 'Other non domain specific items' rather then just 'Other assets'.
- **Report Severity Updated**
- **Changed Scope**
- **2019-07-28** @h1_analyst_decimo: Thank you for your submission @mindtrick,

This appears to be a valid finding. The information you have provided here will be forwarded onto the team. You will receive updates when, and if, there will be any to share. Please note that the status and severity are subject to change.

Cheers,
@still
- **Report Triaged**
- **Bounty Awarded**
- **2019-07-31** @mindtrick: Thanks for the quick response and resolution.  I rechecked the domain on my end and it looks like it's been cleared.  I will release the cloud service after you close the ticket.
- **2019-08-01** @mindtrick: Hi @tealeaf, 
I checked this domain again.  It looks good.  The DNS record is no longer pointing to the Azure Cloud Service CNAME and my POC link no longer works.  This issue is resolved.  I have also deleted the Cloud Service for this ticket.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
