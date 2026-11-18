---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "not-applicable"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2023-05-18
submitted: 2022-10-20T13:16:16.899Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "beksem35"
source: "https://hackerone.com/reports/1744264"
title: " read and message other user's messages"
---
#  read and message other user's messages

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Reddit | **Disclosed:** 2023-05-18

- Report: [https://hackerone.com/reports/1744264](https://hackerone.com/reports/1744264)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-10-20T13:16:16.899Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

go to your account's chat page, stop the request and change the reddit session parameter, now leave the request and you will be able to access the test account's chat screen

send the request to the repeater change the reddit session parameter and send it then you will see the return result is 200

show reply in browser and copy and paste the address into your browser you will access the chat page of your test account

## Impact

other users' chat screen can be accessed
and message can be sent

## Timeline

- **Report Filed**
- **2022-10-20** @beksem35: {F1995729}
- **2022-10-21** @h1_analyst_dhaval: Hi @beksem35,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_dhaval
- **2022-10-21** @beksem35: I'm fine thank you, I hope you are fine too
- **Report Needs More Info**
- **Report New**
- **2022-10-21** @beksem35: press the magnification screen when you open the intercept{F1997038}
- **2022-10-21** @beksem35: You can even go to ads.reddit.com, then click on your name, click edit profile and change the same parameter, this time you will reach the profile editing page of my account, not the message screen.

so you will have access to the complete account
- **2022-10-22** @beksem35: {F1998277}


1 - Go to ads.reddit.com with your own account
2 - open the intercept
3 - click on your picture in the upper right corner and click on the edit profile address and catch the request
4 - change the reddit session parameter, you can use my address it's my test accoun (2311574747931%2C2022-10-19T21%3A47%3A32%2C8ede6d649cc83f6ea88a317f1b0b0379d1e60f7b)
5 - send request
6 - You will see that the incoming response returns 200 and
7 - 
Right click on the response and select SHOW RESPONSE İN BROWSER and copy the address
8 - Paste the copied address into your browser and you will have access to my account.
- **2022-10-22** @beksem35: Can we call this vulnerability a CSRFvulnerability?
and allows account hijacking
- **2022-10-24** @beksem35: Hİ @h1_analyst_dhaval
 I hope you are well.
- **Report Not Applicable**
- **2022-10-25** @beksem35: I have done the same tests to different companies before. but I was not able to access any of them by changing session and cookies but this was possible on reddit.com

I have accessed a different account using session and cookies

It's surprising that this isn't a vulnerability. Thank you for your decision, I respect it
- **Agreed On Going Public**
- **2022-10-28** @beksem35: hi les_oeufs 

you told me this is not a security hole
however, when I tested the application again, I saw that the vulnerability I mentioned was closed.

If this is not a security hole why did you close it?
Also, I have accessed a different account by changing the session parameters.
Could you be wrong about this? (les_oeufs )

Could you please review my report again?
hackerone customer representatives asked me to contact you again before contacting the mediation department
- **2022-10-28** @les_oeufs: @beksem35 I did not inform any dev teams, if you feel this is a vulnerability please provide a better proof of concept WITH steps AND raw requests to allow easy retesting. Cleaner formatted reports are easier to follow. Hackerone Triage also asked for easier steps to reproduce but  you failed to provide clear steps with request examples. This report: https://hackerone.com/reports/1661113, is a good way to format your own report so it's easier to follow your process.
- **2022-10-28** @les_oeufs: In your PoC you are taking one user's reddit session and replacing another user's reddit-session allowing you to see their profile. How is this a vulnerability? You would first have to steal the target user's reddit-session cookie value. If you find a way you could steal another user's sensitive cookie values through some other attack vector (XSS, etc) then we would be interested. Simply copying and pasting another user's cookie values is not an applicable bug bounty issue.
- **2022-10-28** @les_oeufs: As a secondary note, whatever you're reporting here is still reproducible because its the basis of how cookie-based authentication works. So no, nothing has changed. You may have messed up trying to reproduce your own "attack" :)
- **2022-10-28** @beksem35: my dear friend, isn't our aim to control the system?
As for what you said, let's find an xss vulnerability and access the session parameter of the users
Is this really our topic?
I reported the control weakness in the system to you
you insist that this is not a vulnerability
Thanks again for your interest and concern.
Do not doubt that I will continue my research on this subject.
- **2022-10-28** @beksem35: As a secondary note, I know very well the steps I took in my own attack. I checked again and again. The issue I mentioned has been fixed.
- **2022-10-30** @beksem35: hello 

I came across a few things while researching.
breaks page structure when rendering titles with some special characters
~~test~~ (text is crossed out when typed like this)
##test## (makes text bold)
^^test^^ (creates a superscript)
>>>>>>>test> (Adds a wall to the left of the text)
and when i examine the source code i see the tags have been added




{F2011093}{F2011094}{F2011095}
- **2022-11-12** @beksem35: hi; les_oeufs 

I concentrated a little on the vulnerability I found and evaluated it differently.

I bypassed two factor authentication

1 - Go to ads.reddit.com with your own account
2 - open the intercept
3 - click on your picture in the upper right corner and click on the edit profile address and catch the request
4 - change the reddit session parameter, you can use my address it's my test accoun (2302971845070%2C2022-11-12T10%3A04%3A03%2Cde9ada07dda5c498a9a5ae27c8e75ee504b63dcd) (sembek3535)
5 - send request
6 - You will see that the incoming response returns 200 and
7 -Right click on the response and select SHOW RESPONSE İN BROWSER and copy the address
8 - Paste the copied address into your browser and you will have access to my account.

My Reddit account (sembek3535) I have two factor authentication
but when i do what i mentioned above i bypass two factor authentication
{F2029985}
- **2022-11-13** @h1_analyst_dhaval: Hi @beksem35 

Thanks for reaching out. Unfortunately, the scenario indicated in your last comment still cannot be accepted since the attack scenario assumes the attacker has knowledge of 'reddit_session' cookie pertaining to victim user's account session. Scenarios involving assumption and hypothetical scenarios cannot be accepted as practical security issue. I would also request please do not add multiple issues in one report, please create separate reports for new issue so it can be assessed accordingly.

Regards,
@h1_analyst_dhaval
- **2022-11-13** @beksem35: hi; @h1_analyst_dhaval
i think i explained it wrong

the attack here is not user account hijacking or session parameters hijacking

the purpose here is to bypass two factor authentication

I mentioned a security vulnerability that is considered high in the category that reddit posted on its page.

I'm not taking over another user account, I'm bypassing the two-factor authentication screen of my own account
If you look to see if two factor authentication bypass occurs, it's a security vulnerability.

As a result of this attack, regardless of the method, I eventually bypassed two-factor authentication.
I request you to reconsider my report.
- **2022-11-13** @beksem35: {F2030718}
- **2022-11-13** @h1_analyst_dhaval: Hi @beksem35 

Thanks for reaching out. If you are demonstrating a different issue from the original report, then I request please create a separate report for the new issue so it can be assessed accordingly.

Regards,
@h1_analyst_dhaval
- **Agreed On Going Public**
- **Report Became Public**
