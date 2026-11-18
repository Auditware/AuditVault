---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "not-applicable"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2018-12-06
submitted: 2018-11-06T05:11:12.639Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "csanuragjain"
source: "https://hackerone.com/reports/434689"
title: "Global defaming of any twitter user"
---
# Global defaming of any twitter user

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** X / xAI | **Disclosed:** 2018-12-06

- Report: [https://hackerone.com/reports/434689](https://hackerone.com/reports/434689)
- CWE: Business Logic Errors
- Submitted: 2018-11-06T05:11:12.639Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Private tweets can be used to keep any user's tweet secret from rest of twitter world. Once the user changes his setting from private tweets to public tweets, all his secret tweets become visible. This can become a major issue causing global distributed attacks

**Steps to Reproduce**

1. Assume the attacker is targeting certain president XYZ for the next election
2. Attacker goes to settings and enable private tweet
3. Attacker find famous tweets from 10000+ celebrity profiles
4. Attacker replies on all those 10000+ celebrity profile tweets mentioning "XYZ is the worst candidate. See what he did <some video or something>"
5. None of the twitter user can see that reply from Attacker since it is a private tweet
6. Once the elections are really near, Attacker changes his setting from private to public tweet
7. Attacker reply comments are now visible in all those 10000+ celebrity profile famous tweets
8. This can cause mass defaming, before twitter could actually intervene and remove attacker

## Impact

This can be used to defame any famous celebrity on a mass level

## Timeline

- **Report Filed**
- **2018-11-06** @csanuragjain: **Recommendation**
If a person has private tweet enabled then it does not make any sense for him to tweet to any other person profile. But if this required then atleast the private post must be visible to the person to whom the reply is made
- **Report Not Applicable**
- **Agreed On Going Public**
- **2018-11-09** @csanuragjain: @bugtriage-josh Kindly help with public disclosure of this issue.
- **2018-11-13** @csanuragjain: @bugtriage-josh Can you please help with the disclosure
- **2018-11-13** @csanuragjain: @bugtriage-josh I am planning to write a blog post on this issue next week. Kindly revert if you see an issue.
- **2018-11-21** @csanuragjain: @twitter  
As mentioned in support ticket twitter wanted to have a final review of this issue before giving go ahead for public disclosure.
can you please let me know the final decision on public disclosure of this issue.
- **Agreed On Going Public**
- **Report Became Public**
