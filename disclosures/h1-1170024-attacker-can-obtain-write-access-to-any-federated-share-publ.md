---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2021-06-10
submitted: 2021-04-20T20:48:20.362Z
bounty_usd: 4000
votes: 142
cve: "CVE-2021-32654"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rtod"
source: "https://hackerone.com/reports/1170024"
title: "Attacker can obtain write access to any federated share/public link"
---
# Attacker can obtain write access to any federated share/public link

> **Severity:** High | **Bounty:** 4,000 USD | **Votes:** 142 | **Program:** Nextcloud | **Disclosed:** 2021-06-10

- Report: [https://hackerone.com/reports/1170024](https://hackerone.com/reports/1170024)
- CWE: Improper Authentication - Generic | CVE: CVE-2021-32654
- Submitted: 2021-04-20T20:48:20.362Z

## Timeline

- **Report Filed**
- **2021-04-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2021-04-21** @rtod: Also please note that there is no rate limiting at all on these endpoints.
So somebody with sufficient time and resources could also start brute forcing (unlikely with so many tokens). Still rate limiting there is not unreasonable.
- **2021-04-22** @rtod: Something I just verified. But with this bug https://hackerone.com/reports/1167929 is actually a lot worse.
As that means that filedrop links can also be converted to federated shares and then have increased permissions. Allow the attacker to also read data they are not supposed to.
- **Bounty Awarded**
- **2021-05-01** @rtod: Thanks a lot for the bounty. I assume the fix is in your recent RCs?

Out of personal interest. How will this be announced/disclosed?
- **2021-05-03** @lukasreschkenc: > Thanks a lot for the bounty. I assume the fix is in your recent RCs?

It should indeed be included. If you are still able to reproduce this, please do let us know :)

> Out of personal interest. How will this be announced/disclosed?

We're aiming to announce the minor releases at the end of this week, the release notes will contain our regular advice that updating is importing for security reasons but will not contain any details.

After 3-4 weeks, we'll be publishing an advisory, where we will credit you.
- **2021-05-10** @rtod: So I guess last week didn't make it? This week then?
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **2021-06-01** @lukasreschkenc: Advisory is at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-jf9h-v24c-22g5
- **Report Became Public**
