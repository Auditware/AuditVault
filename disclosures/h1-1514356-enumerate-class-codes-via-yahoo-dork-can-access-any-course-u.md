---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/idor
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-05-01
submitted: 2022-03-16T23:30:59.147Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "bughunterpol"
source: "https://hackerone.com/reports/1514356"
title: "Enumerate class codes via yahoo dork - Can access any course under teacher - Sensitive information leaked"
---
# Enumerate class codes via yahoo dork - Can access any course under teacher - Sensitive information leaked

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Khan Academy | **Disclosed:** 2022-05-01

- Report: [https://hackerone.com/reports/1514356](https://hackerone.com/reports/1514356)
- CWE: Information Disclosure
- Submitted: 2022-03-16T23:30:59.147Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,
I am quality researcher and I found some links using yahoo dorking techniques
I used yahoo dork `site:pl.khanacademy.org/join` 
I used Firefox browser.

Steps to reproduce:
1.Go to yahoo search page and use above query to enumerate.
2.Create student account by filling all the required details
3.Now you are in the class without actually invited by teacher.
4.You can pick any course from item and start you course.

I can also able to see teacher Full name- This is sensitive information 

Attached POC:

## Impact

Any black hacker can enumerate all the classes and join in them and can make chaos.
Some chances of IDOR too.
If you can encrypt this class details which some hashing technique and this will not showed up with dorking queries.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2022-03-18** @bughunterpol: Hello Team, Any updates on this?
- **Report Triaged**
- **2022-03-22** @bughunterpol: Thank you, waiting for some good news from your side.
- **Report Resolved**
- **2022-03-26** @bughunterpol: Thank you.
My Username is : nileshbugbashpl

Can we disclose this report
- **2022-03-28** @drosile: Thanks, the badge should be added to your account today! You should be able to request disclosure on the report, and it will be automatic after a wait period.

best,
Diana
- **2022-03-31** @bughunterpol: Hi,
Could you please disclose this report for my small write up.
Thanks
- **2022-03-31** @drosile: Hi @bughunterpol,

You should be able to request disclosure on the report yourself!

best,
Diana
- **2022-04-01** @bughunterpol: Hello @drosile. I am not able to see such option to request disclosure for my report. Could you please guide me.
- **2022-04-01** @drosile: Sure! The up-to-date instructions for requesting disclosure are here: https://docs.hackerone.com/programs/disclosure.html#requesting-disclosure
- **Agreed On Going Public**
- **2022-04-11** @bughunterpol: Hi team, Could you please disclose my report?
- **2022-04-11** @drosile: Hi @bughunterpol,

Of course! Disclosure happens automatically 30 days after the request.

best,
Diana
- **Report Became Public**
