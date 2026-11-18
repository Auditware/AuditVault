---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
  - impact/account-takeover
  - trigger/unauthenticated
  - trigger/brute-force
  - fix/authentication-hardening
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Product / URL**
https://en.instagram-brand.com/wp-json/brc/v1/login/

**Description and Impact**
An attacker can perform account takeover by leveraging following two vulnerabilities:

Auth Bypass = Username Enumeration + Login Brute Force



A. Username Enumeration:
-------------------------------

For the site https://en.instagram-brand.com/, it is made sure that a malicious user cannot enumerate usernames of the users by implementing CAPTCHAs at Sign Up (https://en.instagram-brand.com/register/signup) and Forgot Password (https://en.instagram-brand.com/register/signin) pages.
This is made the site secure.
But I have found a way to bypass this protection. The endpoint: https://en.instagram-brand.com/wp-json/brc/v1/resend-verify has absolutely no rate limiting, thus a malicious user can take its advantage to enumerate usernames.

**Another thing of concern is that, if a valid username is found, then the Instagram site sends an account verification link to that email. Even if the account is previously verified !! And if those victims try to login, then they can't. The site asks to first verify their account by clicking on the account activation links !!**

An attacker can harvest the usernames and abuse this functionality to bother the victims.

**Following is the analysis:**
1) The endpoint to which the actual request goes - https://en.instagram-brand.com/wp-json/brc/v1/resend-verify
2) The total number of requests/attempts you were able to make - 1001 (you can do it infinite)
3) The time in which you made those requests/attempts - 10 minutes
4) Some demonstration that you weren't actually just silently locked out -Refer the attached exploit.

**Exploit Developed:**
1. Save the files email.txt and InstagramBrandEnumerationExploit.rb in a folder.
2. Run the exploit like this: ruby InstagramBrandEnumerationExploit.rb
3. Observe in the console that the right emails are disclosed within seconds.


**Reproduction Instructions / Proof of Concept**
1. Sign Up using any email address.
2. Attach a local intercepting proxy.
3. After signing up, a resend email button will appear.
4. Click on it and intercept the request.
5. For the parameter, 'email' in the request body, put your payloads i.e. email addresses to need to be enumerated.
6. Send the request.
7. Observe the response. It is verbose and states clearly if the user exists or not.
8. Now try to login using any of the victim's email.
9. Observe that the web app does not let you login.

**The HTTP Request is:**

`POST /wp-json/brc/v1/resend-verify HTTP/1.1
Host: en.instagram-brand.com
User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
X-WP-Nonce: 30436dbdab
Content-Type: application/x-www-form-urlencoded
Referer: https://en.instagram-brand.com/register/signup
Content-Length: 29
Cookie: pll_language=en; _ga=GA1.2.2112289023.1486871994; _gat=1
Connection: keep-alive`

`email=<your email here>`




B. Login Brute Force
-----------------------

The endpoint https://en.instagram-brand.com/wp-json/brc/v1/login/ does not have any rate limiting. This still allows an attacker to make the following number of guesses from one single system single threaded : 100 per min, 6,000 per hour, 1,44,000 per day or 43,20,000/month. No additional protection mechanism such as Captcha (pre-auth) or account lockout requiring additional email/phone verification (pre- or post-auth) were identified at any time. I could make 1020 attempts in 10 minutes.

**Solution:**
Implement a Captcha after a reasonable number of failed login attempts against one account at the application-layer. The Captcha should not only be shown to offending IP addresses, but to anyone who attempts to login to the account under attack. Another option is to enable an account lockout policy which effectively locks down an account that has been attacked (e.g. after 20 failed consecutive logins) and requires out-of-band validation by the real account owner (e.g. email, mobile) before becoming accessible again.


**Reproduction Instructions / Proof of Concept**
I have developed an exploit in Ruby to demonstrate this attack. 
Its usage:
1. Save the InstagramBrandLoginBruteForce.rb in any folder.
2. Have a long list of passwords in passlist.txt file and keep it in the same folder.
3. On line number 7, enter the name of the victim's email who you want to target. This can also come from username enumeration list fetched from the exploit InstagramBrandEnumerationExploit.rb
4. Using cmd, navigate to that folder and run it like this: ruby InstagramBrandLoginBruteForce.rb
5. Observe the results.


**Additional Note:**
I have used single threading for these attacks, but these can be more powerful if multi threading is used.

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
