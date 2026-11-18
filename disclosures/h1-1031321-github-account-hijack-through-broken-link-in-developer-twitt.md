---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/phishing
  - env/web
substate: "resolved"
weakness: "Phishing"
enriched: true
body: true
date: 2021-02-04
submitted: 2020-11-11T06:59:11.886Z
bounty_usd: null
votes: 222
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "milankatwal99"
source: "https://hackerone.com/reports/1031321"
title: " Github Account hijack through broken link in developer.twitter.com"
---
#  Github Account hijack through broken link in developer.twitter.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 222 | **Program:** X / xAI | **Disclosed:** 2021-02-04

- Report: [https://hackerone.com/reports/1031321](https://hackerone.com/reports/1031321)
- CWE: Phishing
- Submitted: 2020-11-11T06:59:11.886Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Description
A link in    https://developer.twitter.com/en/docs/twitter-api/tools-and-libraries   was broken and anyone could create that account which leads to account impersonate

Steps To Reproduce
1) Visit https://developer.twitter.com/en/docs/twitter-api/tools-and-libraries
2) Scroll down to Javascript/Node.js and click on by @HunterLarco (v2)
3)  Create github username HunterLarcol
4) When someone visits and scroll down to  javascript/Node.js and click on @HunterLarco (v2). They are redirected to my account

similar report
https://hackerone.com/reports/265696



To solve this issue 
put this link https://github.com/HunterLarco

Please let me know if you have any questions. I am happy to help

## Impact

Impact
The users are coming from developer.twitter.com So, the attacker can put malicious content on the github  and many users will be the victim for example https://github.com/HunterLarcol/twitter-v2. Moreover it leads to the loss in the reputation of the company

## Timeline

- **Report Filed**
- **2020-11-11** @milankatwal99: For POC I have attached video
- **2020-11-11** @bugtriage-sophia: Thank you for your report @milankatwal,

We are investigating the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **2020-11-15** @milankatwal99: Any update ?
- **Report Triaged**
- **2020-11-19** @milankatwal99: Ok thank you for your response
- **2020-11-23** @milankatwal99: Good morning 
The issue has been fixed. Any update?
- **2020-11-27** @milankatwal99: Good morning sir 
Can You tell me when the twitter will respond :)
- **Report Resolved**
- **2020-12-02** @milankatwal99: Yes this issue has been fixed
- **2020-12-02** @milankatwal99: but why this bug is not valid for bounty?
- **2020-12-08** @milankatwal99: Hello team 
I am eligible for bounty ?
- **2020-12-16** @milankatwal99: I know there are lot of reports you are handling
but its been a month 
Any update?
- **2021-01-01** @milankatwal99: It has been more than 2 months can you give me the reply if I am eligible for bounty or not
- **Agreed On Going Public**
- **2021-01-16** @milankatwal99: Hello team can you give me update
- **2021-01-28** @milankatwal99: I want limited disclosure
- **Report Became Public**
- **2021-02-12** @milankatwal99: @agoldman Hello Sir
I am eligible for bounty or not ?
 please reply
- **Bounty Awarded**
- **2021-02-17** @milankatwal99: @agoldman 
Can I get limited disclosure 
I want to hide video and show only necessary information
