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
date: 2019-03-24
submitted: 2019-01-23T05:09:30.817Z
bounty_usd: null
votes: 105
cve: []
program: "[[programs/ford|Ford]]"
reporter: "march"
source: "https://hackerone.com/reports/484420"
title: "Subdomain takeover on usclsapipma.cv.ford.com"
---
# Subdomain takeover on usclsapipma.cv.ford.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 105 | **Program:** Ford | **Disclosed:** 2019-03-24

- Report: [https://hackerone.com/reports/484420](https://hackerone.com/reports/484420)
- CWE: Privilege Escalation
- Submitted: 2019-01-23T05:09:30.817Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Ford H1 team,

I want to report a Subdomain takeover vulnerability in this report, a pretty serious security issue in some context.

##Overview:
One of the ford.com subdomains is pointing to Azure, which has unclaimed CNAME record. ANYONE is able to own ford.com subdomain at the moment.

This vulnerability is called subdomain takeover. You can read more about it here:

https://blog.sweepatic.com/subdomain-takeover-principles/
https://labs.detectify.com/tag/hostile-subdomain-takeover/
https://hackerone.com/reports/325336

##Details:
usclsapipma.cv.ford.com has CNAME usclsapipma.trafficmanager.net wich has a CNAME to feuscspma3fcvapi.eastus.cloudapp.azure.com. However, feuscspma3fcvapi.eastus.cloudapp.azure.com is not registered in Azure cloudapp Virtual machine anymore and thus can be registered as FQDN for a easus VM by anyone. After registering the Cloud App Virtual Machine in Azure portal, the person doing so has full control over traffic on dynatraceppeast01.cf.ford.com (so, not only HTTP/HTTPS but also mails traffic, etc, since we have full control over the virtual machine and it's OS).

##Mitigation:
Remove the CNAME record from ford.com DNS zone completely.
OR
Claim it back in Azure portal

##Files : 
Azure-check-availability.png -> Screenshot of the Azure website api "check availability" for the "eastus" cloudapp virtual machine. on the link, you can see the location "eastus" part of the fqdn ad the DomainNameLabel "feuscspma3fcvapi" part of the FQDN, and the "available : true" response for this fqdn.
dns-proof.png -> Result of a "dig" command for this domains, showing the "NXDOMAIN" reponse for the CNAME entry of the ford subdomain.

Cheers,

March_42

## Impact

Subdomain takeover can be abused to do several things like :

Malware distribution
Phishing / Spear phishing
XSS
Authentication bypass
Legitimate mail sending and receiving on behalf of ford subdomain
...
List goes on and on.

## Timeline

- **Report Filed**
- **2019-01-23** @march: My bad, i've made a mistake on this report, on "detail" section. here is the corrected part

##Detail 
[...]
After registering the Cloud App Virtual Machine in Azure portal, the person doing so has full control over traffic on ~~dynatraceppeast01.cf.ford.com~~  **usclsapipma.cv.ford.com** (so, not only HTTP/HTTPS but also mails traffic, etc, since we have full control over the virtual machine and it's OS).
- **2019-01-23** @lasagna: Hi @march,

Thanks for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@lasagna
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Report Severity Updated**
- **2019-01-23** @march: Hello @lasagna ! Can you provide me the CVSS parameters you used to re-calculate From critical to high (if you have set via CVSS calculator, of course) ?
It's because i'm no totally sure at first how to classify this type of vulnerability and I want to improve the quality of my future report and correctly set the CVSS score at first post :)

Same for "Weakness" also, since i'm not really sure that "privilege escalation" is the most appropriate weakness, since the "Subdomain takeover" (or at least "DNS misconfiguration", or something like that) are not available choice.

Thanks to you !

Cheers,

March
- **Report Resolved**
- **2019-02-22** @march: Hello ! It's fixed ! Entry got deleted from ford's dns.
- **Agreed On Going Public**
- **Report Became Public**
