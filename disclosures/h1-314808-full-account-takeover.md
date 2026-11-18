---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-03-19
submitted: 2018-02-10T18:54:54.830Z
bounty_usd: null
votes: 413
cve: []
program: "[[programs/reverb|Reverb.com]]"
reporter: "sandeep_hodkasia"
source: "https://hackerone.com/reports/314808"
title: "Full account takeover"
---
# Full account takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 413 | **Program:** Reverb.com | **Disclosed:** 2020-03-19

- Report: [https://hackerone.com/reports/314808](https://hackerone.com/reports/314808)
- CWE: Improper Access Control - Generic
- Submitted: 2018-02-10T18:54:54.830Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,

I got a security issue in reverb ios application which allows an attacker hack all users account.
Since iOS application is not in the scope but still I am reporting this, because this vulnerability may compromise all users account.
Please resolve this quickly. 

Desription:
Reverb ios application is not validating facebook `access_token` on the server side in login api, which allows an  attacker to hack all account using his own app access token.

Vulnerable request:
```
POST /api/auth/facebook HTTP/1.1
Host: reverb.com

{"fb_token":"[REDACTED - see source report]"}
```
Here in vulnerable i used lyst app access token to login.

Steps to reproduce:
1. Replay vulnerable request in vulnerable request in burp suite
2. Use any other app access token .

Fix recommendation:
https://developers.facebook.com/docs/facebook-login/security

**(Bug in oauth flow)

## Impact

Attacker Can hack all users account using his own app access token

## Timeline

- **Report Filed**
- **2018-02-10** @ctennis: Can you provide a little more information?  I don't see enough here to understand how to reproduce the problem.
- **2018-02-11** @sandeep_hodkasia: Hey @ctennis ,

Facebook login oauth token thatis access token is not getting validated on the server side. Actually on login with facebook option, facebook provides an access token to the user to login on that app.

Suppose any user A who login into two app 1, 2. Now if any app do not validate the token on server side. Then app 1 owner can use user A token to login into app 2. 
So this thing is happening in reverb, all reverb user must have login into some other app, so if that company is hack , then reverb will also be hacked. Attacker can use the access token to login into other users account. 
For more info visit: https://developers.facebook.com/docs/facebook-login/security
To know more about oauth: http://tutorials.jenkov.com/oauth2/index.html (this will give you a clear idea of oauth).

PFA POC video, it contains steps to reproduce this issue.
(This time i used letgo app access token to login into reverb)
**All testing done on my account only, no other user is affected.

If you have any doubts, please let me know.
- **2018-02-11** @ctennis: I'm still coming up short on this. Can you provide a link to the PoC video you were talking about?

As best as I can tell by what you're writing, you're able to use an access token from another app that is linked to facebook to authenticate to Reverb...but in those cases the access token you're using would be tied to your facebook account with the other app, correct?  So..how are you obtaining a FB access token for another user that you can use to log into Reverb?

Can you show me how you are able to do an actual account take over, not a hypothetical one?
- **2018-02-11** @sandeep_hodkasia: Hello @ctennis,

This vulnerability lies in oauth flow.
This is not an hypothetical issue, it is practical.
Suppose 100 users login into my app using facebook, now access token of that 100 users is saved into my server. Now i can use the same access token to login into reverb app on behalf of that users

https://hackerone.com/reports/101977
- **2018-02-11** @sandeep_hodkasia: Please read about facebook oauth flow and security issue in oauth flow.
- **2018-02-11** @sandeep_hodkasia: please verify if the access token belongs to reverb FB app or not.
- **2018-02-11** @ctennis: I understand about oauth flow.  I am just trying to confirm what you are reporting to make sure I'm clear on the vulnerability you are claiming.

I believe now I understand that what you're saying is if you have access to a fb token of another non-reverb user, you can use it to authenticate against reverb as that user.  However you have to obtain that token first, YOU are not getting these tokens automatically.  One way you COULD  get these tokens is running your own FB app and collecting them as users authenticate to your app, then use them to login to reverb with.  Is that correct?
- **2018-02-11** @ctennis: Thank you for your report by the way.  We will award a bounty for this as soon as I can talk to the mobile development team.
- **2018-02-11** @sandeep_hodkasia: Yes , you are right!!.
But this doesn't mean attacker can only hack non-reverb users by registering them.
Also already registered reverb users can also be hacked by using access token.
- **2018-02-11** @sandeep_hodkasia: If you still have any doubt, please let me know.

Happy to help. :)
- **2018-02-11** @sandeep_hodkasia: Can i report all security issues lies in iOS application? from low to high?
- **2018-02-11** @ctennis: yes, you can report any other security issues you wish related to iOS.  Just keep in mind the rules of our hackerone in especially that reports that are best practices but aren't direct vulnerabilities aren't eligible.
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2018-05-13** @sandeep_hodkasia: @ctennis can you please disclose this report publicly, only bounty amount and bug title (partial disclosure). Please don't disclose full.
- **2018-05-18** @sandeep_hodkasia: @ctennis ?
- **Agreed On Going Public**
- **Report Became Public**
