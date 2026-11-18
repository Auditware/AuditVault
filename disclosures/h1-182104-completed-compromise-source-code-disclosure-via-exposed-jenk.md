---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/java
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2017-06-17
submitted: 2016-11-14T15:58:13.907Z
bounty_usd: null
votes: 63
cve: []
program: "[[programs/udemy|Udemy]]"
reporter: "cha5m"
source: "https://hackerone.com/reports/182104"
title: "Completed Compromise & Source Code Disclosure via Exposed Jenkins Dashboard at https://jenkins101.udemy.com"
---
# Completed Compromise & Source Code Disclosure via Exposed Jenkins Dashboard at https://jenkins101.udemy.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 63 | **Program:** Udemy | **Disclosed:** 2017-06-17

- Report: [https://hackerone.com/reports/182104](https://hackerone.com/reports/182104)
- CWE: Code Injection
- Submitted: 2016-11-14T15:58:13.907Z

## Report summary

I discovered a critical information disclosure bug via an exposed Jenkins dashboard located at `https://jenkins101.udemy.com`. Upon navigating to this address, I was presented with a Github authentication page. After authenticating, I was surprised to find that I had complete read access to the corresponding Jenkins Dashboard. 

Contained within the dashboard was the complete Udemy source code, including the keys for various Udemy services.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Howdy, @udemy!

Summary:
=======
I am writing to inform you of a critical information disclosure bug via an exposed Jenkins dashboard located at https://jenkins101.udemy.com. Upon navigating to this address, I was asked to authenticate with my Github account. After authenticating, I was surprised to find that I had complete access to the corresponding Jenkins Dashboard as seen in the screenshot below:

{F134658}

Impact:
=====
Contained within these files was the complete Udemy Django source code. This included complete database schemas and keys/ credentials for the following services:

* Crowdin
* Amazon Redshift
* Exchange
* Facebook
* Google
* Maxmind
* Sendgrid
* Sift
* Twilio
* Zencoder
* Level3
* Apple
* Salesforce
* Celery
* Paypal
* Stripe
* Freshdesk
* and more

To verify that these credentials were active, I attempted to login into Sendgrid. I was able to take over the Udemy Sendgrid account as seen in the screenshot below. I did not make any change/ access any information.

{F134656}

Mitigation
=====

Mitigation for this should be fairly straightforward, simply ensuring proper user authentication should prevent future unauthorized users from access the dashboard. I am not storing any of the informaiton that I came across, however, rekeying the compromised systems may not be a bad idea.

I hope this reports helps! Please let me know if you have any questions! 😁

Best,
@n0rb3r7

## Timeline

- **Report Filed**
- **Report Triaged**
- **2016-11-15** @acima: We believe this access has been closed off, can you verify?
- **2016-11-15** @cha5m: Hi, @acima! Thank you for the quick triage! It appears that I am no longer able to access the Jenkins dashboard.
- **Report Resolved**
- **Report Severity Updated**
- **2016-11-17** @cha5m: Hey @acima! No problem, glad to help. :)

Just curious- if this is just considered "High" severity what would you consider to be "Critical" severity. I admittedly didn't "dig in" too much to respect the privacy of users (as per the brief), but I would think that it can't get much more severe than this.

Cheers!
- **2016-11-17** @acima: The HackerOne severity is supposed to be CVSS based, there is a calculator here  https://www.first.org/cvss/calculator/3.0  - happy to hear how you would fill that out.
- **2016-11-17** @cha5m: Ah yes, I opted to skip that because I think it's sometimes tough to map these config-based vulnerabilities and I instead just assigned critical as I had all of the creds. For the CIA triad, obviously it's going to be a high for confidentiality, but I could see the argument for integrity and availability as well. Attached is my best shot at it.

That said, I think the CVSS can be somewhat arbitrary and I agree with however you see it. :)

Thanks again!
- **2016-12-15** @cha5m: Hi @udemy! Sorry to bother, but is there any update on a bounty for this issue? 

Thanks!
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
