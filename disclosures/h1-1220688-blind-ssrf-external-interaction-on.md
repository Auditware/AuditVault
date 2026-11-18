---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2022-08-21
submitted: 2021-06-08T19:36:59.765Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "error201"
source: "https://hackerone.com/reports/1220688"
title: "Blind SSRF External Interaction on ████████"
---
# Blind SSRF External Interaction on ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 61 | **Program:** MTN Group | **Disclosed:** 2022-08-21

- Report: [https://hackerone.com/reports/1220688](https://hackerone.com/reports/1220688)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2021-06-08T19:36:59.765Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hii Security Team,

I am S █████(Metaxone Certified Ethical Hacker) and a Security Researcher I just checked your website and found Blind SSRF External Interaction on ██████████

What is SSRF?
Server-side request forgery (also known as SSRF) is a web security vulnerability that allows an attacker to induce the server-side application to make HTTP requests to an arbitrary domain of the attacker's choosing.
In typical SSRF examples, the attacker might cause the server to make a connection back to itself, or to other web-based services within the organization's infrastructure, or to external third-party systems.
SSRF attacks often exploit trust relationships to escalate an attack from the vulnerable application and perform unauthorized actions. These trust relationships might exist in relation to the server itself, or in relation to other back-end systems within the same organization.

Steps to reproduce:-

1.Navigate to the website █████
2.Now you can see at bottom on the right there is chat box or messanger box.
3.Click on it and paste the Burp Collaborator URL { Example : In this scenario the URL belike ██████ } and click on send
4.Now we will get HTTP and DNS interaction in Burp Collab and In HTTP requesting it is fetching the file ( test.png ) it means it is vulnerable to Blind SSRF

References:- Similar report which is reported by another researcher ███████

## Impact

Impact:--
This Vulnerability can lead to Attack Surface Analysis is about mapping out what parts of a system need to be reviewed and tested for security vulnerabilities.
The attacker can fetch malicious files which can infect the server
This will allow attackers to gain access to an internal IP of a website along with other sensitive information that may be leaked with the request

POC Attached Below :-

## Timeline

- **Report Filed**
- **2021-06-14** @error201: Hi Team,

Any Updates on my report?

Regards,
@error201
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-05-22** @msiza_a: Hi @error201 

You disclosed this report without our approval. Kindly remove it from being publicly accessible
- **2024-05-22** @error201: Hi @msiza_a 

I did'nt disclosed this report, it was automatically approved and now i can't see option to remove it
