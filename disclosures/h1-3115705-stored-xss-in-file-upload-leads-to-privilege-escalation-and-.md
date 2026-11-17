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
date: 2025-05-02
submitted: 2025-04-28T11:26:38.120Z
bounty_usd: null
votes: 118
cve: []
program: "[[programs/dust|Dust]]"
reporter: "sjalu"
source: "https://hackerone.com/reports/3115705"
title: "Stored XSS in File Upload Leads to Privilege Escalation and Full Workspace Takeover"
---
# Stored XSS in File Upload Leads to Privilege Escalation and Full Workspace Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 118 | **Program:** Dust | **Disclosed:** 2025-05-02

- Report: [https://hackerone.com/reports/3115705](https://hackerone.com/reports/3115705)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2025-04-28T11:26:38.120Z

## Report summary

A stored Cross-Site Scripting (XSS) vulnerability exists in Dust’s file upload functionality, allowing an attacker to execute arbitrary JavaScript in the context of other workspace members’ browsers. By uploading a malicious HTML file and convincing another user to interact with it, an attacker can fully impersonate that user and perform any actions available to them without stealing their cookies. If the victim holds administrative privileges, the attacker can escalate their own permissions, revoke others’ access, read sensitive data, and take full control over the workspace. The impact is critical and can lead to full account and organizational takeover.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2025-04-29** @sjalu: Hey, thank you for the quick triage and for taking this seriously.

There are definitely some interesting attack paths enabled by this issue. I highlighted what I believe is the most critical one: privilege escalation by downgrading an admin and elevating a regular member to admin, ultimately resulting in full workspace takeover. Another possible vector for full account compromise, depending on implementation, would be if there are internal requests that refresh or rotate session tokens. If such a request exists, it could potentially be triggered within the victim’s session context and the response (e.g., new token) exfiltrated to an attacker-controlled server.

Regarding what was mentioned in the GitHub issue:

>“Marking as p1 as pretty critical pending confirmation that this is not exploitable cross-workspace.”

That was also my initial concern when testing the vulnerability. I expected the uploaded HTML file to be publicly accessible, which would’ve escalated the impact significantly. While the current PoC appears to require the victim to be in the same workspace, I wouldn’t rule out the possibility that similar attack surfaces exist elsewhere in the platform, particularly if the same HTML upload vector is allowed in other places (e.g., public-facing content, shared assets). In that case, the attack surface would widen to include cross-workspace and even unauthenticated attack scenarios.

As you likely know, stored XSS bugs like this tend to open the door to a wide range of abuse, but in the end, the fix is almost always straightforward. I noticed MIME-type restrictions are already in place (e.g., rejecting `image/svg+xml`), so I was a bit surprised that `text/html` was still accepted.

Happy to help further if needed, thanks again for the attention on this!
- **2025-04-29** @spolu-dust: We are aligned. Current belief is that this is only intra-workspace and we will definitely audit similar endpoints for potential cross-workspace availability but very unlikely :+1:
- **2025-04-29** @sjalu: Sounds good!
- **2025-04-29** @spolu-dust: We have a strong belief that this is only an intra-workspace exploit. We are mitigating by downloading all contents except a whitelist of mimeTypes  which will likely be images only.
- **2025-04-29** @sjalu: I gotcha. Wouldn't it be easier to just disallow `text/html` instead? The endpoint doesn't expect anything other than an image anyways as far as I know.
- **Report Resolved**
- **2025-04-29** @sjalu: Hey. Did a quick retest now. I'm able to upload the same as before, but it's no longer accessible in browser, just automatically downloaded.
- **Agreed On Going Public**
- **2025-05-02** @sjalu: Bumping this for disclosure, thanks.
- **Agreed On Going Public**
- **Report Became Public**
