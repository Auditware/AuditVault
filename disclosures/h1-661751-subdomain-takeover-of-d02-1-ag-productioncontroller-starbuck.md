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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
 I was able to claim the subdomain: d02-1-ag.productioncontroller.starbucks.com using Azure Cloud Service

**Platform(s) Affected:**
Subdomain
Azure Cloud Service

## Steps To Reproduce:
1. Using dig, I was able to determine that the subdomain 'd02-1-ag.productioncontroller.starbucks.com'   was vulnerable to takeover.  The record showed status: NXDOMAIN and was pointing to the CNAME: 3edbac0a-5c43-428a-b451-a5eb268f888b.cloudapp.net.
2. Using this information, I was able to create a new Azure Cloud Service with the name '3edbac0a-5c43-428a-b451-a5eb268f888b'.  This would resolve to the CNAME record mentioned above.
3. I then crafted a website and uploaded it to the cloud service using this as a guide: https://docs.microsoft.com/en-us/azure/cloud-services/cloud-services-how-to-create-deploy-portal.
4. I was then able to view the uploaded site at http://d02-1-ag.productioncontroller.starbucks.com

## Supporting Material/References:
POC:
http://d02-1-ag.productioncontroller.starbucks.com/poc-2sKR4C.html


## How can the system be exploited with this bug?
See impact below.

## How did you come across this bug ?
Using enumeration, I was able to discover this domain and determined it was vulnerable by the DNS record data mentioned in the steps above.

## Recommendations for fix
To mitigate this issue you can:
* Remove the DNS record from the DNS zone if it is no longer needed.
* Claim the domain name in a permanent DNS record so it cannot be used elsewhere.

## Impact

This is extremely vulnerable to attacks as a malicious user could create any web page with any content and host it on the starbucks.com domain.  This would allow them to post malicious content which would be mistaken for a valid site.  They could steal cookies, bypass domain security, steal sensitive user data, etc.  Here is a nice write-up of the vulnerabilities:  https://0xpatrik.com/subdomain-takeover/

As mentioned in the write-up above the

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
