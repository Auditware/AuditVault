---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - impact/account-takeover
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-05-11
submitted: 2019-08-11T14:34:02.500Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/priceline|Priceline]]"
reporter: "badca7"
source: "https://hackerone.com/reports/671406"
title: "Account takeover via Google OneTap"
---
# Account takeover via Google OneTap

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 81 | **Program:** Priceline | **Disclosed:** 2022-05-11

- Report: [https://hackerone.com/reports/671406](https://hackerone.com/reports/671406)
- CWE: Improper Authentication - Generic
- Submitted: 2019-08-11T14:34:02.500Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

It's possible to take over any priceline.com user's account knowing their email. The only requirement is that the victim's email domain is not registered with Google's Gsuite. The root cause of this issue is that the backend does not verify whether the email provided is a confirmed one.

## Steps To Reproduce:

1. Create Account A (in my case `badca7@wearehackerone.com`) with priceline.com, without any SSO, via the "Create an account" link (aka "register with email").
2. Once the account has been created, add a dummy phone number to the profile. It will serve as a canary to demonstrate we accessed the same data in the next steps.
3. In another browser/session (eg, incognito/private mode) sign up for a trial GSuite account at https://gsuite.google.com/signup/basic/welcome  . This will be Account B.
4. Use any email to register as you won't need to confirm that email. 
5. When the wizard comes to the "Does your business have a domain?" confirm and enter `wearehackerone.com` (or any other domain that hosts the victim's email box) as in F552718. You may not use the same domain name at this stage, as I claimed it for the purposes of this PoC however you can do so when my GSuite trial expires. From this comes the requirement that the victim's email domain name must not be registered with Google prior to this attack. 
6. Once you saved the domain record with Google, stop there as there's no need to verify the domain.
7. At this stage the OneTap/GoogleYOLO popup will be showing on priceline.com when visited in the same browser session. It took me some time to get it to show however signing in and out of Google Account several times with the newly created GSuite credentials and then refreshing the priceline.com page helped. On another occasion a Gmail account, which I signed in in the same browser window helped too. You may need to play around with these until you see the newly created account to show in the list. F552723 
8. Once you have that, just sign in (`badca7@wearehackerone.com` in my case). You can confirm you accessed Account A by seeing the phone number you added in step (2). In the other browser window/session with Account A you can see that now there are two accounts showing in the top right corner and the profile data is blank.
9. Account takeover complete. F552724

# Notes

- IP used for this PoC: ███

## Impact

Attackers can take over any priceline.com account given they were able to register a specific domain with GSuite.

## Timeline

- **Report Filed**
- **2019-08-13** @ktistai: Hi @badca7 

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@ktistai
- **Report Needs More Info**
- **Report New**
- **2019-08-14** @ktistai: Hi @badca7, 

Ok, based on your last explanation I decided to give it a go, as my thinking was not at it's best. However, I got stuck at step 7). In which browser do I need to log-in? The one at step 1 or the one where I made the GSUITE account? Also, where is the YOLO button? I can't see any popups. 

Thanks, 
@ktistai
- **Report Severity Updated**
- **Report Triaged**
- **2019-08-14** @badca7: Awesome, glad you worked it out. I have the best results getting the popup to show right after signing in with the "spoof" account into GSuite and then refreshing the web page.

Thanks.
- **2019-08-14** @ktistai: @badca7 , 

Actually, if you go on Priceline in another tab, the Google sign in method will come up and then you are in. This is a really interesting find. Congrats. Also, I got to register my domain with G-Suite, which was in the queue for a long time so thanks :D 

Happy hacking, 
@ktistai
- **Report Triaged**
- **Bounty Awarded**
- **2019-08-15** @badca7: Thanks, @r0n
- **External User Joined**
- **2019-09-05** @badca7: @lollipup why was another researcher added to this report? I don't remember asking disclosure :)
- **2019-09-05** @badca7: If.. that was you of course.
- **2019-09-05** @csanuragjain: @badca7 I was added since I filled a duplicate issue on this program. To be honest I am a bit surprised that it is duplicate since I was under the belief that no one was aware of this issue. :)
- **2019-11-06** @r0n: Hi @badca7 , 

Can you test this again? A fix has been deployed to production.
- **2019-11-06** @badca7: To the best of my knowledge Google has closed the loophole quite some time ago now. I don't think this attack works anymore. @csanuragjain - do you observe the same, that Google now won't allow unconfirmed accounts to be used to sign in (just like they correctly do for the oAuth flow)?
- **2019-11-06** @r0n: Hi @badca7,

Where is the update from Google that this is fixed? 

Did you test again just to confirm?
- **2019-11-10** @badca7: Hi @r0n,

Hope you're doing well. I'm not aware of any public updates from Google however I did test and can confirm that now I can't get unverified accounts in Gsuite to sign in using SmartLock. The account won't appear in any SmartLock popup anymore, neither forcing various parameters on Google's side of things allows bypassing that. I thus assume this has been fixed or improved by G in the first place, hence Priceline.com should not be vulnerable either.

Curious if @csanuragjain observed the same recently. Otherwise what's the point of adding other researchers to others' reports, right? ;)

Thanks.
- **Report Resolved**
- **2019-11-12** @badca7: Wonderful. Thanks for the update.
- **Agreed On Going Public**
- **Report Became Public**
- **2024-09-19** @a9h0ra: @badca7 
IP has been redacted.
