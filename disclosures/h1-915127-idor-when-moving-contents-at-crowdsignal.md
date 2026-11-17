---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-11-18
submitted: 2020-07-04T03:26:20.493Z
bounty_usd: null
votes: 94
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/915127"
title: "IDOR when moving contents at CrowdSignal"
---
# IDOR when moving contents at CrowdSignal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 94 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/915127](https://hackerone.com/reports/915127)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-07-04T03:26:20.493Z

## Timeline

- **Report Filed**
- **2020-07-04** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-07-08** @bugra: Hi @donncha, yes I noticed that. But the IDs are sequential, so an attacker can takeover all surveys or polls with a automated attack. Attacker can't select a specific content for attack, but attacker can attack to all contents via brute forcing the ID.
- **2020-07-09** @donncha: I couldn't replicate the problem when moving a poll in a free user account but I was able to move a poll from free user account to a team account.
Is the first example above incorrect? Should it be, as you said earlier, be intercepting the close and open queries?
"You can only change status etc if you have a free account."
- **2020-07-09** @bugra: Hi @donncha, yes you're right. My bad, I was trying this vulnerability with a team account while writing this report. Firstly I moved it to `My Content` and it worked, but I couldn't access it fully (just changing status, delete it etc.). So I thought, it works on free account too. I was wrong, it works only with a team account. I see error when trying this with free account. But our main attack scenerio was in team account already. Sorry for that.
- **2020-07-10** @bugra: I have just noticed, there is no need move the survey (or poll) to `My Content` if you want delete or change status. You can delete them or change status directly via changing the ID on `delete` and `close` action requests.
- **2020-07-13** @donncha: Thanks. I was able to replicate that too. Same problem as the moving. A team account user can delete or close items from other accounts.
- **2020-07-13** @donncha: I've made a fix to the site to fix permission checks on dashboard items. Can you test if you can still trigger the bug?
- **2020-07-13** @bugra: Hi @donncha, I can confirm the fix, I can't move, delete or change status on victim's item. LGTM :)

{F905796}
- **Report Resolved**
- **Bounty Awarded**
- **2020-07-14** @bugra: Thanks @xknown :) Do you accept bug submissions related Atavist? A theme has a vulnerability and there are multiple affected websites.
- **2020-07-23** @bugra: Hi @xknown and @donncha, I'm still waiting an answer to my last question :) The vulnerability still exists on the Atavist theme.
- **2020-07-30** @ice9js: Hi @bugra! Sorry for the delay - yes, please feel free to submit Atavist reports.
- **2020-07-30** @bugra: Thanks @ice9js, I reported it on #947790 :)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
