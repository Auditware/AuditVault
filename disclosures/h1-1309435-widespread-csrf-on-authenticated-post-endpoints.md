---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2022-02-13
submitted: 2021-08-18T06:16:46.093Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/upchieve|UPchieve]]"
reporter: "zeyu2001"
source: "https://hackerone.com/reports/1309435"
title: "Widespread CSRF on authenticated POST endpoints"
---
# Widespread CSRF on authenticated POST endpoints

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** UPchieve | **Disclosed:** 2022-02-13

- Report: [https://hackerone.com/reports/1309435](https://hackerone.com/reports/1309435)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2021-08-18T06:16:46.093Z

## Timeline

- **2021-08-19** @zeyu2001: Hi, any updates on this?
- **Report Filed**
- **2021-08-19** @dexter0us: Hi @zeyu2001,

Thanks for your submission, we highly appricate your detailed explanation in the report, I'll triage your report in a day or two after fully analyzing the impact and vulnerable sensitive endpoints.
Meanwhile if you want you can try to escalate the issue further and search for more sensitive endpoints.

---


> I do not have access to them yet due to the approval / onboarding process.

You can provide me your student and volunteer accounts I will get them approved for you.

Regards,
@dexter0us
- **2021-08-19** @zeyu2001: Hi @dexter0us,

Thanks for getting back to me! 

My volunteer account on https://hackers.upchieve.org/ is zeyu2001@wearehackerone.com. For the student account, could you help me to create one on the hacker-specific site using the email ██████? I only have access on the main site currently.

Thanks!
- **2021-08-24** @zeyu2001: Hey, just checking in - can this be triaged?
- **Report Severity Updated**
- **Report Triaged**
- **2021-09-22** @zeyu2001: Hi, any updates on this?
- **2021-09-23** @dexter0us: Hey @zeyu2001,

Sorry for the delay, our dev team is working on this issue. You might expect a patch in next ~4 weeks.

Thanks for your understanding.

Regards,
@dexter0us
- **2021-11-05** @thedevelopnik: I wanted to give a quick update since the last one was posted about 4 weeks ago and gave a 4 week timeline. We have been working on an overhaul of our backend code to make it easier to make changes which took longer than expected but is now done, merged and deployed as of this week. This issue is my next priority for the tech initiative time we have each sprint. Will update again as soon as we've got it done.
- **2021-11-06** @zeyu2001: Thanks!
- **2022-01-16** @zeyu2001: Hey, any updates on this?
- **2022-01-16** @thedevelopnik: Hey. Thanks for checking in. It's the constant push and pull in a small organization, but promises that our business/product people made have kept pushing this further out. We just finished annual/quarterly planning, and the good news is the thing the business/product people want isn't ready to come to us yet, so I believe I'm going to be able to make this the priority in the sprint starting this Tuesday. It remains the top-priority thing in my tech backlog. Will update on Tuesday after we have sprint planning.
- **2022-01-18** @thedevelopnik: We just wrapped up sprint planning, and this is in it! So ideally more quickly but we will definitely have this done in the next two weeks.
- **2022-01-31** @thedevelopnik: The work on this is done. We realized if we just deploy it now we're going to have a lot of people not refresh the frontend, and that will cause issues, so we're first deploying a version of the app that checks for a new version every 30 seconds, we'll wait til most people are rolled over to that, and then we'll get this deployed. I will confirm when this is in production, should be within 24-48 hours!
- **2022-02-01** @zeyu2001: Thanks for the update! :)
- **2022-02-04** @thedevelopnik: This is now deployed to all our test and production environments, and I'm pretty confident it's working because the devs making our new mobile app reached out with "Hey, uh, we can't log in all of a sudden?" But if you can please check it to confirm in hackers.upchieve.org I would greatly appreciate it! Thank you so much for your patience.
- **2022-02-13** @zeyu2001: Hey @thedevelopnik,

Looks good to me! Thanks!
- **2022-02-13** @zeyu2001: I think we could Resolve this now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
