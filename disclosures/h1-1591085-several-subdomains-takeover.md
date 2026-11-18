---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
body: true
date: 2022-06-08
submitted: 2022-06-04T12:14:40.430Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "3amii"
source: "https://hackerone.com/reports/1591085"
title: "Several Subdomains Takeover"
---
# Several Subdomains Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Reddit | **Disclosed:** 2022-06-08

- Report: [https://hackerone.com/reports/1591085](https://hackerone.com/reports/1591085)
- CWE: N/A
- Submitted: 2022-06-04T12:14:40.430Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

there are some subdomains in reddit.com those are vulnerable to takeover subdomain attack. I found these subdomains while I have been testing the subdomains of reddit.com.

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. create a user account in reddit.com.
  2. there are some subdomain as sample: webcovid19.reddit.com (151.101.13.140) and click on this subdomain.
  3. you will see "Sorry, there aren’t any communities on Reddit with that name" message.
  4. now create an community with the same name "webcovid19".and you will not find any message as above.
  5. well done. now you have the subdomain for your community.

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

1-for details, please find attached screenshots.
2-use this subdomain finder to find subdomains.
https://subdomainfinder.c99.nl/

## Impact

attacker can use available unclaimed subdomains for malicious intention

## Timeline

- **Report Filed**
- **2022-06-04** @3amii: Any update?
- **2022-06-04** @3amii: there are some unclaimed subdomains:
webcovid19.reddit.com
owacovid19.reddit.com
2019covid19.reddit.com
13covid19.reddit.com
mx01covid19.reddit.com
mx-covid19.reddit.com
www-covid19.reddit.com
alt-covid19.reddit.com
- **2022-06-05** @3amii: Any update?
- **2022-06-05** @3amii: attacker can create several community with same name as they are listed in above comment. these subdomains of communities  was created by users and used to use as communities for covid19 pandemic. 
sample:
webcovid19.reddit.com = www.reddit.com/r/webcovid19
- **Report Not Applicable**
- **2022-06-07** @3amii: @gunther_reddit 
those unclaimed subdomains are existed before you create any community. in my thought those are list of communities that were created by users and then they all left it or not use it any more.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
