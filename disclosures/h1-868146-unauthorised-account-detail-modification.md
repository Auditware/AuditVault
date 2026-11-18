---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-06-19
submitted: 2020-05-07T15:16:07.269Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "5kyw41k3r"
source: "https://hackerone.com/reports/868146"
title: "Unauthorised Account Detail Modification "
---
# Unauthorised Account Detail Modification 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Khan Academy | **Disclosed:** 2020-06-19

- Report: [https://hackerone.com/reports/868146](https://hackerone.com/reports/868146)
- CWE: Improper Access Control - Generic
- Submitted: 2020-05-07T15:16:07.269Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Introduction
=========
Hi `5kyw41k3r` here,

==I found an Unauthorised Account Detail Modification  in KA website==...

Defination
=========
```
It is a flaw which allows a malicious actor to modify the details of an account. I have included a video made by me for demonstration purposes using a test account...
```
Reproduction Steps:-
============== 
==I have included a video in the attachments==
+ You need burp proxy correctly configured and working properly.
+ Go to settings and make minor changes to your account.
+ Hit save and then intercept that request.
+ Disconnect your browser and your proxy
+ Send the Step 3 request to the repeater and forward all unnecessary requests.
+ Modify the request as shown in the video
There you have it! ==Notice how you can change you nickname and DOB which is actually not authorized in the browser itself.==   

Here's the vid=====> ████████

## Impact

Impact
======

Well, khan academy being used in schools like mine as it says on the page;
>This is because Khan Academy is used in many schools...

Anyone can change these details by getting hold of those requests, which you can do through the inspect element...No rocket science!

This can lead to a lot of issues such as leakage of sensitive data(==Such as parent emails and accounts==)

They could also perform identity theft through this method.

 I strongly recommend to fix this as soon as possible. 
Hoping for swag!

Thanks and Stay Safe at Home,
`5kyw41k3r`

## Timeline

- **Report Filed**
- **2020-05-08** @5kyw41k3r: If you need more information, don't hesitate to ask!!!
｡◕‿‿◕｡
- **Report Triaged**
- **2020-05-15** @5kyw41k3r: Any updates??
- **2020-05-16** @drosile: Hey @5kyw41ker,

Great news! We've got a fix for this issue and it will likely go out next week. When that happens, I'll let you know (and close as Resolved).

Thanks again,
Diana
- **2020-05-16** @5kyw41k3r: Sure!!(ツ)
- **2020-05-18** @5kyw41k3r: Hi there @drosile ,

I just found something else, here is the video👇
███████
Basically, I can modify the details even if the victim is logged out...
 You need to just take the request of detail change and modify it while the ==victim is logged out==
This can have a higher impact and prove to be more devastating to the victim.

Examine this and see what you think😊😊
Regards,
@5kyw41ker
- **2020-05-18** @drosile: Hi @5kyw41ker,

Thanks for that addition. Could you confirm if that was within 30 minutes of logging out? You are still sending the auth cookies with that request, and they can still work up to 30 minutes after logging out.

thanks,
Diana
- **2020-05-19** @5kyw41k3r: Hi @drosile ,
I can confirm that it was within 30 minutes of logout after 30 minutes you get `UNAUTHORIZED` .
- **Report Resolved**
- **Agreed On Going Public**
- **2020-05-22** @5kyw41k3r: ping @drosile
- **2020-05-22** @5kyw41k3r: ping @drosile
- **2020-05-22** @drosile: Hi @5kyw41ker,

Thanks for confirming the resolution! The issue is already marked resolved :)

best,
Diana
- **2020-05-23** @5kyw41k3r: Hi,
I have sent a disclosure request in the comment where I am confirming the resolution... Could you please disclose it?
- **2020-05-25** @5kyw41k3r: ping
- **2020-05-26** @drosile: Hi @5kyw41ker,

It's already scheduled to be disclosed in about 24 days--it'll happen automatically then. Thanks again!

Diana
- **Report Became Public**
