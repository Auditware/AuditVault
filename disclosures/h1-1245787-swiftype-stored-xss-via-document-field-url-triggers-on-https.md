---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2021-08-03
submitted: 2021-06-27T17:12:11.813Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "superman85"
source: "https://hackerone.com/reports/1245787"
title: "[Swiftype] - Stored XSS via document field `url` triggers on `https://app.swiftype.com/engines/<engine>/document_types/<type>/documents/<id>`"
---
# [Swiftype] - Stored XSS via document field `url` triggers on `https://app.swiftype.com/engines/<engine>/document_types/<type>/documents/<id>`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Elastic | **Disclosed:** 2021-08-03

- Report: [https://hackerone.com/reports/1245787](https://hackerone.com/reports/1245787)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-06-27T17:12:11.813Z

## Timeline

- **Report Filed**
- **2021-06-27** @superman85: To clarify impact of this report: An user with **Editor** role can create a document and store XSS payload in `url` field. When an **Admin** or **Viewer** user visit the `url` their sessions might be stolen
- **2021-06-29** @h1_analyst_amey: Hi @superman85,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-06-30** @superman85: @douglas_day Thank you so much for the bounty!
- **2021-07-01** @douglas_day: Of course @superman85 !

Would you mind making another video for us, explaining your bug? :) You can leave out your introduction because you provided that in your last video
- **2021-07-01** @superman85: @douglas_day I can make a video today when I came back home.
- **2021-07-02** @superman85: @douglas_day I have created second video explain my bugs. Please take a look! Sorry for my English and the sound device in my laptop is bad!

██████████

If you do not mind! Can you invite my friends to join Elastic bbp?

https://hackerone.com/duahaubadao?type=user
https://hackerone.com/haxor31337?type=user

Thank you
- **Bounty Awarded**
- **2021-07-06** @douglas_day: I just invited them :) 

Hope the three of you are able to find some awesome bugs!
- **2021-07-06** @superman85: @douglas_day thank you so much for the bonus and the invitation!
- **2021-07-06** @superman85: @douglas_day I am using free trial 14 days on app.swiftype.com? Can you give me an access to Pro/Premium plan for testing other features?

Thanks,
- **2021-07-08** @douglas_day: Hey @superman85 ,

I looked into this and what i can do is make your free trial unlimited, and if you want any specific Pro/Premium features, just tell me which features and I can look into enabling them for you.
- **2021-07-09** @superman85: @douglas_day I read a link at https://swiftype.com/documentation/site-search/guides/multiple-domains and see a function is not exist in my trial account **Interface Designer**

{F1370845}

Can you check and let me know! Thanks

`I looked into this and what i can do is make your free trial unlimited`

Can you make my account email: qwerty.chan8@gmail.com to unlimited? Thanks
- **Report Resolved**
- **2021-08-03** @superman85: Since the report was resolved. Lets disclose it. Thanks
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
