---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-debug-information
  - env/web
  - vuln/info-disclosure
  - trigger/session-cookie
substate: "resolved"
weakness: "Information Exposure Through Debug Information"
enriched: true
body: true
date: 2019-04-11
submitted: 2019-02-28T11:01:26.220Z
bounty_usd: null
votes: 100
cve: []
program: "[[programs/slack|Slack]]"
reporter: "rubaljain"
source: "https://hackerone.com/reports/503283"
title: "Real Time Error Logs Through Debug Information"
---
# Real Time Error Logs Through Debug Information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 100 | **Program:** Slack | **Disclosed:** 2019-04-11

- Report: [https://hackerone.com/reports/503283](https://hackerone.com/reports/503283)
- CWE: Information Exposure Through Debug Information
- Submitted: 2019-02-28T11:01:26.220Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary**: During the assessment, I have found the debug URL on slackb.com which is disclosing the World Wide real time error logs of Slack users.

The information leaked includes the following:
1. User Device Information
2. Redacted Token
3. Client IP Address
4. Description
5. Session ID
6. Team ID
7. User ID
8. User Agent
9. Server Response
10. Timestamp
11. api_call
12. x-amz-cf-id
13. x-amz-id-2

And other user sensitive information.

**Steps to Reproduce**

Open below URL in browser and refresh it to see real time logs.

https://slackb.com/debug

The vulnerable domain here is slackb.com. I have confirmed this with Slack to report this on Hackerone and mention the vulnerable domain.

## Impact

By exploiting this vulnerabiliti​y, an attacker can dump the real-time logs and information gained through this is critical which includes the team ID, user ID and redacted token which allows attackers to gather information which can be used later in the attack lifecycle, in order to achieve more than they could if they didn’t get access to such information.

## Timeline

- **2019-02-28** @rubaljain: Hi there,

The domain on which vulnerability is reported in not in-scope but I have taken the on email confirmation from the Slack team to report the issue on hackerone. 

Kindly look into the report since its a critical flaw. I have provided the required description, impact and other details.

Thanks,
Rubal
- **Report Filed**
- **Report Not Applicable**
- **Report Reopened**
- **2019-02-28** @rubaljain: I have confirmed the domain via Slack support team. Please find the enclosed whois slackb.com details.
- **2019-02-28** @lollipup: Thanks for the report! Unfortunately, your submission is out of scope as slackb.com is not listed in the scope. I invite you to self-close this report.

Your effort is nonetheless appreciated, and we wish that you'll continue to research and submit any future security issues you find.

Kind Regards.
- **Report Filed**
- **Report Triaged**
- **2019-03-05** @rubaljain: Hi @nbrandt ,

Any update on this?

Thanks,
Rubal
- **2019-03-05** @maxfeldman: Hey @rubaljain - we're still investigating this but will resolve and reward soon!
- **2019-03-09** @rubaljain: Hi @maxfeldman,

Any update? I can see that issue has been resolved.
- **Report Resolved**
- **Bounty Awarded**
- **2019-03-11** @rubaljain: @maxfeldman 

Thank you for the conclusion.

I am bi​t disappointed for the awarded amount for reporting such a severe issue.
- **Agreed On Going Public**
- **Report Became Public**
