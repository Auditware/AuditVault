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
date: 2021-07-22
submitted: 2021-05-26T16:19:43.401Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "renganathan"
source: "https://hackerone.com/reports/1210043"
title: "Enumerate all the class codes via google dorking "
---
# Enumerate all the class codes via google dorking 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Khan Academy | **Disclosed:** 2021-07-22

- Report: [https://hackerone.com/reports/1210043](https://hackerone.com/reports/1210043)
- CWE: Improper Access Control - Generic
- Submitted: 2021-05-26T16:19:43.401Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I used this particular google dork `site:khanacademy.org/join/*` to enumerate all the links of joining classes. 

1. Go to google and use the above query to enumerate all of them. 
2. Create the student account by filling all the required details 
3. Now you're in the class without being actually invited by the teacher 

Attached POC:
████████

## Impact

An attacker can enumerate all the classes and join in them and make chaos there are chances of IDOR too... a class code can look like `a57d5d5548f302ef4a` instead of `A45JST`

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-05-28** @renganathan: Hey, thanks for the triage and no worries about the forgotten badge :) stay safe.
- **2021-05-28** @renganathan: `renganathanofficial` is my khan academy username :)
- **2021-05-28** @drosile: Thanks, the badge should be added to your account today!
- **2021-05-29** @renganathan: Thank you :)
- **2021-06-21** @renganathan: Hey, any updates ?
- **Report Resolved**
- **2021-06-22** @renganathan: Cool! Can we disclose this ? Please and can I release a write-up about this please in my blog ?? I request you to remove this video while disclosure please :)
- **Agreed On Going Public**
- **2021-07-04** @renganathan: hi, any updates on disclosure, please?
- **2021-07-06** @renganathan: By the way, I would like to disclose the POC video on my youtube channel and I would write about this vulnerability in my blog, please let me know if you you're okay with this :)
- **2021-07-07** @drosile: Hi @renganathan,

When you request to disclose a Resolved report, it starts a 30-day timer and then discloses at the end of that automatically. Our policy is to keep that 30-day window for every report, so just 2 more weeks to go on this one :)

And yes, it's definitely OK to blog about it or disclose the POC video once it reaches that public disclosure point! I think it should be on the 21st of this month.

best,
Diana
- **2021-07-08** @renganathan: Awesome, Thanks :) I didn't know that since this is the first time I'm disclosing my report!
- **2021-07-09** @renganathan: Is this possible now to make it a limited disclosure, please? If it's not possible, then it's okay. Not an issue :)
- **Report Became Public**
