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
date: 2019-12-03
submitted: 2019-04-10T13:57:56.746Z
bounty_usd: null
votes: 292
cve: []
program: "[[programs/superhuman|Superhuman (formerly Grammarly)]]"
reporter: "k4r4koyun"
source: "https://hackerone.com/reports/534450"
title: "Account takeover through the combination of cookie manipulation and XSS"
---
# Account takeover through the combination of cookie manipulation and XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 292 | **Program:** Superhuman (formerly Grammarly) | **Disclosed:** 2019-12-03

- Report: [https://hackerone.com/reports/534450](https://hackerone.com/reports/534450)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-04-10T13:57:56.746Z

## Timeline

- **Report Filed**
- **2019-04-10** @h1_analyst_ava: Hi @k4r4koyun,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Severity Updated**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **2019-04-11** @k4r4koyun: Thanks for the heads up! I am glad to hear that our findings were actually useful in aiding the overall security of Grammarly. I was wondering if it's possible to add a collaborator for this report and split the bounty somehow? The user "newbie06" and I have worked on this scenario together.
- **2019-04-11** @gr_triage: @k4r4koyun You could add collaborator from your side
- **2019-04-11** @k4r4koyun: I have looked at the header of our report and could not see a "Manage Collaborators" button. Could it be possible that Grammarly has not enabled this feature or could it be missing because of another reason (such as signal level or reputation)?
- **2019-04-11** @h1_analyst_ava: @k4r4koyun and @vladimir_suslenko 
The requested user has been added to the report.
@sodacan
- **Report Triaged**
- **Bounty Awarded**
- **2019-04-12** @k4r4koyun: Thanks for the bounty! I am waiting for the fix, will re-check the attack scenario as soon as you fix it.

(Note: The user "newbie06" is still not in the Participants list. I'm not sure about the reason but I've created a support ticket at HackerOne. Maybe it is a bug but I have no idea how collaboration works and this is my first report, so if any HackerOne personnel could explain this issue, that would be great.)
- **Report Resolved**
- **2019-04-17** @k4r4koyun: * Setting/getting "grauth" cookie: Not in the whitelist, thus gnar.grammarly.com is not able to reach it. (OK)
* Setting/getting "csrf-token" cookie: Not in the whitelist, thus gnar.grammarly.com is not able to reach it. (OK)
* XSS over "gnar_containerId" cookie: It is in the whitelist however www.grammarly.com resets it before sending it back to the user whenever characters such as "< ' " >" appear in the cookie, or at least that is what I've deduced. (OK)

Thanks for letting us know and fixing this issue quickly. I have traced my steps and was able to verify that the issue does not exist anymore!
- **2019-04-17** @gr_triage: Thanks for validating the fix, @k4r4koyun!
- **Agreed On Going Public**
- **2019-11-06** @gr_triage: @k4r4koyun, sensitive data was redacted. Please, let us know if you're ok with full disclosure.
- **2019-11-07** @k4r4koyun: Sure no problem, I am OK with full disclosure.
- **2019-11-16** @k4r4koyun: Hey there, any updates on the disclosure fellas?
- **Report Became Public**
