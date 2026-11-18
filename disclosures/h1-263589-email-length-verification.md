---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "spam"
weakness: null
enriched: true
body: true
date: 2017-08-26
submitted: 2017-08-26T12:36:33.068Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/legalrobot|Legal Robot]]"
reporter: "husnainiqbal01"
source: "https://hackerone.com/reports/263589"
title: "Email Length Verification "
---
# Email Length Verification 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Legal Robot | **Disclosed:** 2017-08-26

- Report: [https://hackerone.com/reports/263589](https://hackerone.com/reports/263589)
- CWE: N/A
- Submitted: 2017-08-26T12:36:33.068Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team, 
Hope you are good. I found your website app.legalrobot.com vulnerable to this vulnerability.
Bug: Improper authentication - generic 
Description:
Dont know much about the websites that how they stored email address.Email addresses are stored as VARCHAR(128) But here your website legalrobot dont verify the length of an email address upon registration which allowed the attackers to bypass the allowed email-domains defined in auth.email-domains.

How to Exploit:
Exploiting this is much Easy
Get an email address of 128 characters long. StackOverflow answer indicates that the maximum length of an email address is 254 characters.Then register with your 128 character email address with @allowed-domain.com appended to it. The @allowed-domain.com part will be truncated because MySQL can’t store it, and you will receive a verification email on your 128 character email address.

It will be much easy if you are using gmail if we keep
ihusnain49@gmail.com, you will receive all mails sent to
ihusnain49+aaaaaaaaaaa…aaa@gmail.com.  

References: 
For reference watch this video : https://www.youtube.com/watch?v=o8-0hwaUB4I&feature=youtu.be and you will came to know about the vulnerability of your website. you can also see this report as a reference because this is the same vulnerability as this report is : https://hackerone.com/reports/2224 

I reccomended you two open both of the links. 

Reference 1:  https://www.youtube.com/watch?v=o8-0hwaUB4I&feature=youtu.be 

Reference 2 : https://hackerone.com/reports/2224 

Proof of concept:
I  register an account on legalrobot with this email ihusnain49+aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..aaa@gmail.com
and I received the mail on ihusnain49@gmail.com because the other part gets truncated. 

Screenshots for Proof of concept: 

Attaching some screen shots for proof of concept in which you can clearly see. 

Thanks 
Regards: 
Husnain Iqbal

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Spam**
- **2017-08-26** @husnainiqbal01: Why are you closing this as a spam its a valid report. review this @danrubins
- **2017-08-26** @husnainiqbal01: If you didnt undestand my point please check this reproducing steps:
1.Make an account with email like iqbal01+aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com
2.Account successfully registered.
3. And you will recieve a registration email at iqbal01@gmail.com because the other part gets truncated. 
This is not the expected behaviour mostly when i visit different sites they have an email rate limit. i hope you are understood @danrubins  
And take a look at this report: https://hackerone.com/reports/2224 the hacker was rewarded with $1000 for the same vulnerability and closing this as a spam that's not fair :)
- **2017-08-26** @danrubins: 1) Your report describes a fairly well-known feature of Gmail, not a security issue with our domain. https://lifehacker.com/144397/instant-disposable-gmail-addresses
2) The business about VARCHAR(128) and MySQL tells me you certainly didn't read our policy or even attempt this on our site.
3) That's great that another security researcher was able to get a $1,000 bounty for this issue on ***a completely different*** bug bounty program; that has *no* bearing on this report.

Publicly disclosing this report for the sake of transparency so the community can see how we handled this issue.
- **Agreed On Going Public**
- **Manually Disclosed**
- **Comments Closed**
