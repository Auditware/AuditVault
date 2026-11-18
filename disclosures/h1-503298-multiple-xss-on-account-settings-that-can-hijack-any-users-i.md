---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - trigger/victim-interaction
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-04-01
submitted: 2019-02-28T12:27:15.103Z
bounty_usd: 700
votes: 73
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "giddsec"
source: "https://hackerone.com/reports/503298"
title: "Multiple XSS on account settings that can hijack any users in the company. "
---
# Multiple XSS on account settings that can hijack any users in the company. 

> **Severity:** Critical | **Bounty:** 700 USD | **Votes:** 73 | **Program:** X / xAI | **Disclosed:** 2019-04-01

- Report: [https://hackerone.com/reports/503298](https://hackerone.com/reports/503298)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-02-28T12:27:15.103Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Note:
Hello Twitter Team, I just noticed that my report #485748 is already fixed, can you confirm? but my other duplicate reports aren't and still exists. #492444 #492913 are you sure it's on the **same root cause**? because I think the broad fix is already released but didn't fix the other issues.
I will make a report here so you'll notice. I will merge #492444 #492913 here. I'm also thinking for Twitter Security. I'm monitoring MoPub since report #485748 was set on triage. 

*The broad fix didn't really fixed all issues, that's why I'm resubmitting these issues.*

##Description: 
An issue that can be performed **vice versa**. That a member can hijack a admin or admin hijack a member by injecting a malicious scripts in the **accounts settings**.

##Steps to reproduce:

1. Login to MoPub: https://app.mopub.com/account/login/
2. Go to **account settings** (*almost everything here is vulnerable to XSS*)
3. Inject on **currency**
4. You can also inject on **company's information** (*every input is vulnerable to XSS*) 

**Cases of injecting on company's name** 
- When the victim go to **report's tab** XSS will trigger. (*even if the victim is on his/her original company, attacker's company still visible on email drop down menu.*)  
- When the victim go to **account settings** XSS will trigger.  
- When the victim go to **edit user settings** XSS will trigger.  

**Cases of injecting on currency**(vice versa attack)
- Administrator can inject malicious payload in **currency** can hijack member's session. (XSS triggers on member's end) 
- Member can inject malicious payload in **currency** can hijack administrator's session. (XSS triggers on administrator's end)

I provided a **Full Demonstration of the vulnerability**
F432851

**Based on Roles and Permissions:**
(Vice Versa Attack)

- Members can make changes in the account, but they cannot add new users, change other users' roles or view payment information. F432849

## Impact

This vulnerability can impact other users invited by the attacker. And it is Stored XSS that every time the victim visits the vulnerable endpoints, XSS will trigger. The impact here is the attacker can hijack the victim's session.

It's also a vice versa attack. the attacker could be the administrator or the member.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-03-01** @jknguyen: Just noting here that these vulnerable fields were originally reported in #485736, but were marked as a duplicate in favor of #485748. Since the fix for #485748 did not encompass these additional vulnerable fields, we are accepting this new report.
- **2019-03-01** @giddsec: Thanks for the triage! @jknguyen,
As of almost every input in **account settings** is vulnerable to XSS, which can result to different impacts, especially it targets the users of MoPub.
- **2019-03-01** @giddsec: As mentioned in report #485736.

- These fields: {Name, Address, Phone Number, User Settings, Rewarded Video Settings, Company Information}
are only accessible by the account owner, and not by any other MoPub users.

Not at all, these fields are still accessible for other users invited by the administrator. so the XSS can still be triggered on the other end. 

And also a member can inject a malicious payload on **currency** that can trigger on administrator's end.
- **2019-03-04** @giddsec: Hello @jknguyen, Is this still eligible for a bounty? Thanks!
- **2019-03-06** @giddsec: I think it's already fixed, can you update the status here?
- **2019-03-12** @giddsec: Hello @jknguyen, any updates?
- **Bounty Awarded**
- **2019-03-13** @giddsec: Thanks for the bounty! :)
- **Report Resolved**
- **2019-03-22** @giddsec: Hello @jknguyen, can we publicly disclose this? Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
