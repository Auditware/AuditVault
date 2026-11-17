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
date: 2018-12-12
submitted: 2017-12-19T18:18:30.760Z
bounty_usd: 3000
votes: 34
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "dr_dragon"
source: "https://hackerone.com/reports/299424"
title: "Bypass Filter and get Stored Xss "
---
# Bypass Filter and get Stored Xss 

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 34 | **Program:** Shopify | **Disclosed:** 2018-12-12

- Report: [https://hackerone.com/reports/299424](https://hackerone.com/reports/299424)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-12-19T18:18:30.760Z

## Timeline

- **Report Filed**
- **2017-12-19** @dr_dragon: another attachments:
- **Report Severity Updated**
- **Report Triaged**
- **2017-12-20** @clayton: @ahmed_anwer_mohamed We deployed a preliminary fix for this last night, but we're still doing some further testing before we close off this issue. We'll get back to you as soon as that's done.
- **2017-12-21** @dr_dragon: Nice work , it seems to be fix now :)
- **2017-12-21** @dr_dragon: Any update ?
- **2017-12-22** @shopify-peteryaworski: Please don't ask for updates, we'll let you know as soon as there is one. As @clayton mentioned, we deployed a temporary fix but are still testing before we close the issue.

Thanks for your patience.
Pete
- **2018-01-11** @dr_dragon: Hey @clayton
It been more than 3 weeks waiting your reply for update .
- **2018-01-11** @clayton: @ahmed_anwer_mohamed Please be patient. We'll reach out to you when we have an update.
- **2018-01-22** @dr_dragon: @clayton
There is no vulnerability on shopify that taking more than one month to fix it, in addition to this vulnerability has been fixed.
So why all this delay ?
- **2018-01-23** @jenn-shopify: We are still in the process of fixing this particular issue. Though the example you provided may no longer be working, there are additional changes we plan to make here before closing this off. 

We will send you an update when this fix is complete, thank you for your patience.
- **Bounty Awarded**
- **2018-02-27** @dr_dragon: Iam tired of waiting 
Is there any update ?
- **2018-02-27** @clayton: As mentioned previously, we will provide an update when the fix is complete. Thank you for your patience.
- **2018-03-27** @dr_dragon: Hi sir , 
I have waited more than three months so can you give me the remainder awarded and then take the time to fix it
- **2018-04-18** @dr_dragon: @clayton 

Any update ?
- **2018-04-18** @clayton: We're still working on this, and will contact you when we have an update. Thank you for your patience.
- **2018-05-13** @dr_dragon: @Clayton
I have waited more than five months and there is no update so can you give me the remainder awarded and then take the time to fix it.
- **2018-05-15** @dr_dragon: Hello anybody there ?
- **2018-05-16** @clayton: As previously stated, we will contact you when we have an update. Thank you for your patience.
- **2018-07-08** @dr_dragon: Any update ?
- **2018-07-09** @shopify-peteryaworski: Nope.
- **2018-07-25** @dr_dragon: Till when ?
- **2018-08-16** @dr_dragon: Can i know Why you take all this time to fix it
- **2018-09-10** @dr_dragon: Any update ?
- **2018-09-11** @clayton: No. As we explained previously, we will contact you as soon as there is an update.
- **2018-09-13** @dr_dragon: Well, I don’t think I will ever want to report you something.I sent this report 9 months ago and I don’t understand why you take all this time to reward my report. It seems It will take the immortality before we done with It .
- **2018-10-20** @dr_dragon: Any update ?
- **2018-10-20** @clayton: No. As we explained previously, we will contact you as soon as there is an update.
- **2018-11-10** @dr_dragon: I think it has completely fixed right now .
- **2018-11-12** @shopify-peteryaworski: Hi @dr_dragon,
I apologize this has taken so long. The functionality you found the vulnerability has an initial fix, as you recognized. However, there have been multiple vulnerabilities in our handling of SVG files, yours being the most recent. As a result, when we patched the vulnerability, we also began redesigning how we handle the SVGs in general. This has been a much more comprehensive undertaking and taken longer than we expected. This is why we have not resolved this report. I am looping back with the engineering team and hope we'll have an update for you soon. 

Once we have any info to share, we'll let you know. Thanks again for your patience and sorry for the delay. We appreciate all the work you've done on the platform, helping to make commerce more secure for our merchants. I hope you'll keep testing our systems.
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2018-12-08** @dr_dragon: thanks for the bounty but I think it deserves more than $3000 like this report #232174
- **2018-12-08** @clayton: @dr_dragon The reason why the bounty for this report was less than for #232174 is that sales channel icons are no longer rendered in our internal admin panel. (They were removed in response to #232174). Thus, the impact of XSS through a sales channel icon is now less than before. I hope that helps explain the difference.
- **Agreed On Going Public**
- **Report Became Public**
