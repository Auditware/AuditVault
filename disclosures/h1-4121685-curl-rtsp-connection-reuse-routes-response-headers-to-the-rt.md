---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
date: 2026-10-19
submitted: 2026-10-17T06:14:55.722Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/curl|curl]]"
reporter: "noraqiu"
source: "https://hackerone.com/reports/4121685"
title: "curl RTSP connection reuse routes response headers to the RTP callback (rtsp_conn state machine not reset between sessions)"
---
# curl RTSP connection reuse routes response headers to the RTP callback (rtsp_conn state machine not reset between sessions)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** curl | **Disclosed:** 2026-10-19

- Report: [https://hackerone.com/reports/4121685](https://hackerone.com/reports/4121685)
- CWE: N/A
- Submitted: 2026-10-17T06:14:55.722Z

## Timeline

- **Report Filed**
- **2026-10-17** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-10-17** @bagder: I don't understand the impact of this "attack". A malicious server can make a subsequent request to the RTSP server mistreat the response as RTP when it is in fact not? Can you elaborate on why this is a security problem for curl? (And please speak as a human, do not copy and paste your AIs "word salad" on this topic.)
- **2026-10-17** @jimfuller2024: security impact seems weak:
* attacker must control RTSP server the client chooses to contact 
* callback already receives attacker controlled RTP data from server
* response headers are sent by that same server so their diversion is I think  not evidence of client data disclosure
* outcome is timeout in that RTSP session

server induced 'stalls' or  never ending transfers are generally not security issues ....  unless I am missing something this feels more like a bug.
- **2026-10-17** @noraqiu: Hello,

We filed it because the header misrouting looked like a confidentiality issue to us. Reading your question and jimfuller's comment, I agree it is not: the callback already receives attacker-controlled RTP data, the diverted headers come from that same server, and the client-side outcome is a session that stalls and ends in a timeout. Under your policy that is a server-induced stall, not a security issue.

I’m fine with closing this and refiling it as a regular bug on GitHub.

Sorry for the dense wording. The report was drafted with AI assistance: the findings come from an LLM-driven security-audit system we are developing as an academic research project. The findings themselves came from our actual test runs, but I didn’t trim the wording enough before submitting.
- **2026-10-17** @bagder: I think this should be submitted as a bug, or even better as a pull-request if you have a proposed fix!
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
