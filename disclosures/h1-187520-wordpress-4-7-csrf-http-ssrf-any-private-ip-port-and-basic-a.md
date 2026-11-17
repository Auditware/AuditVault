---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2017-11-20
submitted: 2016-12-01T23:02:27.537Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "skansing"
source: "https://hackerone.com/reports/187520"
title: "Wordpress 4.7 - CSRF -> HTTP SSRF any private ip:port and basic-auth"
---
# Wordpress 4.7 - CSRF -> HTTP SSRF any private ip:port and basic-auth

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** WordPress | **Disclosed:** 2017-11-20

- Report: [https://hackerone.com/reports/187520](https://hackerone.com/reports/187520)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2016-12-01T23:02:27.537Z

## Timeline

- **Report Filed**
- **2016-12-04** @vortfu: Thanks for the report, we're investigating the issue.
- **Report Triaged**
- **2016-12-06** @skansing: Thanks for the fast feedback. I will make sure to put it in the right place next time =)

If you would credit it as before that would be great, thanks. btw. do you know if #131522 made it in 4.7?
- **2017-01-11** @skansing: I dont see this mentioned in 4.7.1 release https://wordpress.org/news/
So I am guessing it didnt make the cut

Will it be fixed in 4.7.2?
- **2017-01-27** @voldemortensen: @skansing, thank you for your patience as we've worked on this issue. While the fix wasn't included in 4.7.2 release today, please be assured that we are working towards resolving this issue. Again, thank you for your patience.
- **2017-02-02** @skansing: @voldemortensen hi, thanks for updating me on the situation.

It did surprise me that this was not been fixed in 4.7.1 nor 4.7.2, based upon the intial response where a patch was already under test and a regression into account, but I am crossing fingers it gets fixed soon.

Atm this program is private which means I can not disclose this when the bug is fixed and released. I am in doubt if you want public disclosure on the report when it is released?

Also why does Wordpress have a open (automattic) and this private program, should previous reports afflicting wp also be moved from the open to this program, like #119529?
- **2017-02-02** @aaroncampbell: Hey @skansing,

I'll leave it to one of the others that has worked on this to give you an update on progress on the patch, but I wanted to address your questions about disclosure and our H1.

We are launching this new HackerOne for the WordPress open source project and migrating it off of Automattic's. The process is taking a little while as we get our team up to speed, but the plan is to make this public as soon as we're ready. I'll have someone look into #119529 for you and see if it needs to be migrated here as well.

As for disclosure, I'm happy to work with you on a disclosure schedule whenever this is closed, even if the program is still private at that time.
- **2017-02-02** @skansing: @aaroncampbell thanks for the awesome fast and for full response.  It is appreciated.
- **2017-03-06** @skansing: Hey, I see this was not mentioned in the 4.7.3 release, so I am guessing it has not been fixed?

3 months seems to long for a CSRF=>SSRF in wp?
- **2017-05-17** @skansing: Hi, this has been released in 4.7.5

Can we remove the noisy comments (all of them except the first two) or make a summary and make this report public?
- **Report Resolved**
- **2017-06-17** @skansing: I would like to request public disclosure on this report, but would like limit it to the report. I think the comments are noisy and not in the benefit of any reader.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
