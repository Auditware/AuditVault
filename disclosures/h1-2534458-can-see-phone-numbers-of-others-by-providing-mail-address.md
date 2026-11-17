---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2024-11-13
submitted: 2024-06-03T17:42:45.253Z
bounty_usd: null
votes: 111
cve: []
program: "[[programs/linkedin|LinkedIn]]"
reporter: "sevada797"
source: "https://hackerone.com/reports/2534458"
title: "Can see phone numbers of others by providing mail address"
---
# Can see phone numbers of others by providing mail address

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 111 | **Program:** LinkedIn | **Disclosed:** 2024-11-13

- Report: [https://hackerone.com/reports/2534458](https://hackerone.com/reports/2534458)
- CWE: Information Disclosure
- Submitted: 2024-06-03T17:42:45.253Z

## Report summary

The issue reported was about exposure of LinkedIn member's phone number due to the logical flaw in reset password functionality. The issue has been resolved on priority. Thanks @sevada797 for the report.

## Timeline

- **Report Filed**
- **2024-06-03** @sevada797: With this comment I am adding the video POC, I didn't mention the exact severity of the vulnerability as I am not sure about it, but I believe it's either medium or low. Thanks for reading
Regards,
-Sevada

███
- **Report Severity Updated**
- **Report Pending Program Review**
- **2024-06-04** @sevada797: Hi ███████ 

Thank you so much for the quick and correct response, I just have some quick notes about your comment related to `Attack complexity`, I can't confirm that first name and last name is needed for the information to be disclosed. Also, as you can see in my video POC no additional information was needed from me besides email address.

Regards, ███
- **2024-06-04** @h1_analyst_bernard: Hey ██████,

I suspect it only happens occasionally, but I don't know what triggers the extra verification step on the LinkedIn side. Here's what I see when I attempted to reproduce (after hitting "Send Code" for the SMS verification)

{███████}

Whatever additional. controls may exist I think will ultimately make this a little more complex for an attacker to reliably abuse. That said, the LinkedIn team will review this and may adjust CVSS further based on their interpretation of the report.

Hope this helps clear up where I'm coming from.

Cheers,
███████
- **Report Triaged**
- **Report Severity Updated**
- **2024-06-05** @sevada797: Hi ██████  , sorry maybe this isn't quite the right place to write about it, I just wanted to directly communicate with Linkedin stuff about one issue I have found previously, the problem is it didn't pass the Hackerone's triage, but I believe it's still a security concern. Could you please check my report with ID `2180845` , 
Short description: In short it is a mail flooding vulnerability, that allows attacker to spam victim mails coming from @linkedin.com, 
Notes: My report is marked duplicate of informative, but I believe the researcher who reported the bug previously couldn't achieve impact, and that's why his report is marked as Informative, and my report couldn't have had the right response, please let me know if I am right in my deductive thinking.

This my report isn't associated with this current report. 
Regards,
-Sevada
- **2024-06-05** @sevada797: Sorry ████, my appeal for reviewing report by ID `2180845` is not urgent, you can postpone it's review so that it doesn't interfere your workload.
Regards,
-Sevada
- **Report Severity Updated**
- **Bounty Awarded**
- **2024-06-09** @sevada797: Hi I am excited to earn my first bounty, I just have one question, when does the payout happen?
Regards,
-Sevada
- **2024-06-11** @sevada797: Hey team,
Any update regarding the fix? If everything is fine I would like to request disclosure.
Regards,
-Sevada
- **2024-07-05** @sevada797: Hi Team,

I hope you are doing well.

I wanted to follow up on my previous message regarding the fix for the issue reported. It has been a while since my last communication, and I haven't received any updates yet.

Could you please provide an update on the current status of the fix? If everything is resolved, I would like to request disclosure of the report.

Thank you for your time and assistance.

Best regards,
Sevada
- **Report Resolved**
- **2024-09-18** @sevada797: OK I will check these days, and let u know.
- **2024-09-20** @sevada797: Hey, I just found out that in the page where the phone number is fully disclosed you made it for only 2 numbers to be visible, however, I've found an endpoint, where I don't know why right before that , and right after pressing "I don't have access to this email" , you are exposing 4 numbers of the phone number, this strange behavior was not present before, here let me attach simple screenshots to make it simple and also tell how to reproduce

For reproducing the issue,
1. Go to █████████ fill up email, press forgot password 
2. Press "Can’t access this email?" button, and see that last 4 numbers getting exposed
while when you press send, only last 2 digits would get exposed.

Tho I think this is another bug and not the same, should I report it separately? ████████
- **2024-09-20** @sevada797: I think I should report this separately, sorry you can ignore comment previous to this one, currently the report which you marked as resolved, is actually not reproducible, or at least I couldn't reproduce.
If everything is okay, can we delete this previous comment , upload censored video-POC (I don't want my email and phone number to be exposed) and disclose this report ?
Thanks and
Warm regards,
Sevada
- **2024-09-27** @sevada797: Hi ██████,

I hope you’re doing well. Could you please take a moment to read my previous comment?

Thank you!

Best,
Sevada
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
