---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "duplicate"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2026-04-29
submitted: 2026-04-11T17:52:40.271Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/curl|curl]]"
reporter: "sdainard"
source: "https://hackerone.com/reports/3666576"
title: "Negotiate Authentication Premature on Connection Reuse"
---
# Negotiate Authentication Premature on Connection Reuse

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3666576](https://hackerone.com/reports/3666576)
- CWE: Improper Authentication - Generic
- Submitted: 2026-04-11T17:52:40.271Z

## Timeline

- **Report Filed**
- **2026-04-11** @bagder: This is a confirmed problem, but you are not the first to report this. We are already dealing with this issue in another report. To be published in sync with the next release.
- **2026-04-12** @bagder: As there is no reproducer in your report we cannot be 100% sure it is an exact duplicate (nor can we be sure your fix actually fixes your reported problem), but if it is, the issue is already fixed in master.

Can you reproduce the problem with curl's git master?
- **2026-04-12** @sdainard: My reproducer is test 2077, 2078; checking logs will show the issue despite tests passing,  removing the test masking line change in issue #1 will cause them to fail.  This was from my fork Saturday morning pacific time.

I have an appt this morning but will repull & recheck from master this afternoon.
- **2026-04-12** @bagder: What you call issue one is at worst a test problem. Not an issue we care about here.
- **2026-04-13** @sdainard: Apologies,
 I was trying to do too many things (not work on the wknd, taxes, head cold, be a good community member) and got tunnel vision.  Was checking one thing saw the other, assumed they were related.  
Sure enough did the pull and the commit titles' a pretty solid, "oh right there it is."

The issue with #2, (and it being masked by #1) still exists but it's a bug only & I'll put on issues as initially intended.
- **2026-04-13** @jimfuller2024: confirmed duplicate
- **Report Duplicate**
- **2026-04-14** @sdainard: I really am just getting over a rather unpleasant upper respiratory infection and the meds did make my head swim. 
I appreciate you are busy, I felt bad for having bothered you here unneeded and now I feel bad for posting in the wrong place (twice!) but I'm getting whiplash trying to help here.  (re below)
I accidently thought the header issue was related in my hurry but per my documentation #1 & 2 stand. 

I thought #1 might have security adjacent concerns as it might mask real issues, but now know better.
Best I can tell #2 appears to have no credential leak, no auth bypass, no privilege escalation. The worst outcome is an unnecessary second TCP connection, which is a performance/function regression. I clearly am not the expert here.

- My original issues #1 & 2 here as a new separate report here?
- Evaluate the re-open the github issue/pr?
- What ever else you'd like that I can do, done.

Genuinely, with humbleness, I promise  knowing tone can't be read;  please just tell me what you'd like, I'm new and just wanted to help.

re:
https://github.com/curl/curl/pull/21309
"bagder
commented
9 hours ago {UTC 7:50 AM Tuesday, April 14, 2026}
Security sensitive bugs and changes MUST be dealt with privately on our hackerone tracker, not be submitted in public."

https://github.com/curl/curl/issues/21307#issuecomment-4241616724
bagder
10 hours ago {UTC 8:50 AM Tuesday, April 14, 2026}
Member
Issues with a suspected security impact must be reported to https://hackerone.com/curl and not in public.
- **2026-04-15** @bagder: We ask that you just wait.

As I explained already, this exact issue has been reported by another user and is being handled as a security problem. The fix has already been merged.

The corresponding CVE will be published in sync with the pending curl release on April 29.

Since it is a SECURITY problem we do not discuss its details in public until after April 29.
- **Agreed On Going Public**
- **Manually Disclosed**
