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
date: 2019-06-22
submitted: 2017-02-26T02:41:50.008Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "saurabhb"
source: "https://hackerone.com/reports/209008"
title: "Authentication Bypass - Chaining two vulnerabilities leads to account takeover at en.instagram-brand.com"
---
# Authentication Bypass - Chaining two vulnerabilities leads to account takeover at en.instagram-brand.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Automattic | **Disclosed:** 2019-06-22

- Report: [https://hackerone.com/reports/209008](https://hackerone.com/reports/209008)
- CWE: Improper Authentication - Generic
- Submitted: 2017-02-26T02:41:50.008Z

## Timeline

- **Report Filed**
- **2017-02-28** @vortfu: Thanks for the report - we'll take a look into this, but in general we do not consider username enumeration or brute force attacks of this nature (43,20,000/month barely makes a dent in the searchable space of an 8 character password) to be vulnerabilities.
- **Report Triaged**
- **2017-03-02** @saurabhb: Hi Friends,

I would like to mention 2 points that **raises the severity** of this issue:

1. Although in the exploit and in the report, I have written that an attacker can do 43,20,000/month. But that is when single thread program is used. If **multi-threads** are used then this attack can be **more powerful**. The intruder feature of burp makes up-to 99 threads and this increases the boundaries of the damage.
2. If the attacker knows the email of a victim. Say abc@pqr.com. He can completely DOS that user. This is by using that end point to send password reset emails to that user. Even if the victim ignores this and tries to login, the application treats the user as a new user and does not let that user to login and ask him/her to first click on the password reset link. **Thus, an attacker can frustrate a particular user by doing this using the automated exploit.**

Regards,
DerMeister
- **2017-03-20** @nickdaugherty: Sorry for the delay, the client is still working on this too. Hopefully it won't be too much longer.
- **2017-03-22** @saurabhb: ok..Thanks for letting me know that.
- **2017-04-24** @nickdaugherty: Sorry again for the delay - the client has now implemented fixes for these issues. There should now be brute force prevention on the login endpoint, as well as a more generic response to reset requests so that valid email addresses cannot be determined.

Can you please look again and let us know if you feel the issue is resolved?
- **2017-05-01** @saurabhb: Hi @nickdaugherty ,

The above bug is **not completely fixed**.

What is fixed:
1. The fact that username enumeration was possible. Now it is fixed cause the app sends a generic message so an attacker cannot determine whether a particular email exists or not.

What is NOT fixed:
1. Rate limiting is not applied at this email verify resend end point: https://en.instagram-brand.com/wp-json/brc/v1/resend-verify  as a result of which an attacker can bombard victims with mails. I have attached a PoC demonstrating this. PFA.

What is NOT properly fixed:
1. Now we cannot brute force login. It seems that rate limiting is there. But the problem is that now instead of presenting a CAPTCHA to suspicious malicious users, the web app simple says that username/password are incorrect. This is not a good design in my opinion. Because if an attacker does this to a victim's email, then the victim will be denied of service. This will happen when both attacker and victim are using same public IP (a common scenario in corporations, universities). So I would recommend not to block an account instead present the attacker with CAPTCHA.

Regards,
DerMeister
- **2017-05-01** @saurabhb: PFA.
- **2017-05-14** @saurabhb: Hi.....Any updates on this?
- **Report Resolved**
- **2017-05-25** @saurabhb: Hi @nickdaugherty ,

Any updates on this?

Best Regards,
DerMeister
- **2017-05-26** @nickdaugherty: Hey @dermeister - One more thing that I realized I hadn't addressed in your report. You had previously stated:

>If the attacker knows the email of a victim. Say abc@pqr.com. He can completely DOS that user. This is by using that end point to send password reset emails to that user. Even if the victim ignores this and tries to login, the application treats the user as a new user and does not let that user to login and ask him/her to first click on the password reset link. Thus, an attacker can frustrate a particular user by doing this using the automated exploit.

I've been unable to reproduce this behavior - simply sending a password reset link doesn't seem to lock the user out of their account. Is that still happening for you? Any tips for reproducing it?
- **2017-06-05** @saurabhb: Hi @nickdaugherty 

First of all sorry for the late reply. Had a busy week. 
I have re-tested your above mentioned concern. It is fixed now. Cannot be reproduced.

Best Regards,
DerMeister
- **2017-06-05** @nickdaugherty: Great, thank you for the confirmation!
- **2017-06-07** @saurabhb: Is this bug eligible for a bounty?
- **Bounty Awarded**
- **2017-06-09** @saurabhb: Guys, I am not happy with the bounty. This bug deserves more. 

####Justification:
I have reported 2 bugs and took efforts to chain them and present in front of you. The report is very well written that there was no need for you to ask me for any clarification. I have also took so much efforts to develop the Ruby exploits which made this issue very clear. I have been more patient in order to resolve it. Waited for so many months......... :(
- **2017-06-10** @saurabhb: Additional comments: For the low severity #209352 issue. Cross domain leakage of sensitive info, you gave $100 and for this clever issue you are only giving $175. This is not fair !!
- **2019-05-23** @saurabhb: Hello Team,

Would you mind a public disclosure of this bug. I want to share security testing knowledge in the community.

Thanks,
Saurabh
- **Agreed On Going Public**
- **Report Became Public**
- **2019-06-28** @saurabhb: Thanks a lot for the disclosure.
