---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-04-01
submitted: 2020-02-09T23:25:28.933Z
bounty_usd: null
votes: 1924
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "ngalog"
source: "https://hackerone.com/reports/791775"
title: "Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation to Any Shop Owner by Taking Advantage of the Shopify SSO"
---
# Email Confirmation Bypass in myshop.myshopify.com that Leads to Full Privilege Escalation to Any Shop Owner by Taking Advantage of the Shopify SSO

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1924 | **Program:** Shopify | **Disclosed:** 2020-04-01

- Report: [https://hackerone.com/reports/791775](https://hackerone.com/reports/791775)
- CWE: N/A
- Submitted: 2020-02-09T23:25:28.933Z

## Report summary

On February 9th, @ngalog reported that it was possible to bypass Shopify's email verification for a small subset of Shopify user accounts. Doing so would have allowed a user to access accounts they did not own. Our team immediately disabled the impacted functionality and deployed a permanent fix three hours later. 

After resolving the report, @ngalog demonstrated being able to bypass the email verification again. We investigated and discovered another bug with a separate root cause. We asked him to submit a [separate report](https://hackerone.com/reports/796808) to be awarded separately.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-02-10** @ngalog: I wasn't using the most accurate words while describing the impact, it could be more than just be taking over other stores , but also the partner account as well since they are all tied together
- **2020-02-10** @jack_mccracken: Hi @ngalog,

Thanks for the additional context. We will make sure to take all discovered impact into account when deciding on a bounty for this report. We deployed a temporary fix for this issue tonight, and you should no longer be able to reproduce it. We will keep you updated as we continue to work on a more permanent fix. Thanks again for reporting to Shopify!
- **2020-02-10** @ngalog: @jack_mccracken 

Thanks for the impressive quick turnaround! I just checked and I can't reproduce anymore.

- Cannot receive the email confirmation in the email used to sign up
- Cannot integrate across stores/partner even they share the same email address after confirming them

I think the fix is good.

Thanks,
Ron
- **Report Resolved**
- **2020-02-11** @ngalog: Hey this is weird, it is working again now, I don’t know what went wrong last time I verify it. I just used the shop h41ngalog to confirm email yaworsk@hackerone.com using the same technique 

{F713514}
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **2020-02-12** @ngalog: @jack_mccracken 

I tried to change the email prior to the initial email verification message going out, and I still get the email message sent to the email that was used to sign up, but this time after clicking the link, it would return an error saying your email can't be changed because of an error etc...

i.e. I am not able to reproduce now.

Thanks,
Ron
- **2020-02-14** @jack_mccracken: Hi @ngalog,

Thank you for the great report and for your patience while we decided on a bounty. In this issue, the first behaviour you reported and the behaviour you noticed after the report was resolved have two separate root causes. For this reason, we decided it would be most fair to award these two issues separately. 

We would like to ask that you open a second report about the behaviour where the user changes their email prior to receiving the verification message on their original email. Let us know when you have done this and we will process the bounty.

We appreciate you hacking on Shopify, and look forward to continuing to work with you in the future!
- **Bounty Awarded**
- **2020-02-15** @ngalog: Thank you very much for the bounty, and also the quick response time and the conversation here, and the 100% transparency in this report. Really enjoy working with Shopify team. 
No one can complain anything if they can get two bounties for one bug =P
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **2020-12-21** @ngalog: Thank you team! I didn't see this coming and was really happy watching the video. It's good to see everyone in person (sort of) and I'm equally thankful to work with Shopify team!
I wish everyone has a happy holiday, and this certainly has set the bar for other bug bounty programs, in a good way :P
- **Swag Awarded**
