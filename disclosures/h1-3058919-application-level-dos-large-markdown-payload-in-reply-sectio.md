---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
  - fix/input-validation
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2025-10-18
submitted: 2025-03-25T15:57:43.111Z
bounty_usd: null
votes: 84
cve: []
program: "[[programs/discourse|Discourse]]"
reporter: "theteatoast"
source: "https://hackerone.com/reports/3058919"
title: "Application Level DoS - Large Markdown Payload in Reply Section Leading to Resource Exhaustion"
---
# Application Level DoS - Large Markdown Payload in Reply Section Leading to Resource Exhaustion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 84 | **Program:** Discourse | **Disclosed:** 2025-10-18

- Report: [https://hackerone.com/reports/3058919](https://hackerone.com/reports/3058919)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2025-03-25T15:57:43.111Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

An application level Denial of Service (DoS) vulnerability was identified in the reply section on https://try.discourse.org

By submitting an excessively large markup payload (~800,000 characters), the server takes 30 seconds to respond before returning an HTTP/2 502 Bad Gateway error. This indicates potential resource exhaustion or backend service failure, which could be exploited to degrade or disrupt website availability.

## Attack Scenario:

If an attacker automates this request using multiple parallel requests (e.g., via Burp Intruder, Python scripts, or a botnet), it can cause severe resource exhaustion.

The backend service will be overwhelmed, leading to widespread downtime, preventing legitimate users from accessing the forum.

## Steps To Reproduce:
1. Login with valid credentials on `https://try.discourse.org`

2. Navigate to the default discobot grettings message.
{F4182648}

3. Reply the message with the following paylod while intercepting the request: `https://github.com/theteatoast/theteatoast.github.io/blob/main/payload.txt`
{F4182646}

4. Repeat the request and observe that the server takes ~30 seconds before responding with 502.
{F4182647}

##Video POC:
{F4182629}

##Suggested Mitigation:

1. Implement input length restrictions on replies to prevent excessive payload sizes.

2. Introduce rate-limiting and request throttling to mitigate automated abuse.

3. Optimize backend request handling to reject large payloads early before processing.

##Note:

This Proof of Concept (PoC) was performed solely for demonstration purposes, with no intent to harm the system. I ensured minimal impact while testing.

## Impact

1. Attackers can exploit this to cause severe delays and temporary or prolonged service disruption.

2. The lack of input validation allows attackers to send multiple large requests in parallel, leading to backend resource exhaustion.

3. If automated, this attack could render the forum completely inaccessible.

## Timeline

- **Report Filed**
- **2025-04-10** @h1_analyst_trevor: Hi @theteatoast,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_trevor
- **Report Needs More Info**
- **Nmi Reminder Comment**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2025-04-21** @theteatoast: Hey @h1_analyst_trevor,

## Update:

I re-tested the issue and this time, I sent 8 parallel large-payload requests from my PC using my broadband connection, and simultaneously monitored the target endpoint using a Python script on my laptop connected via mobile data (completely separate network and device).

Even in this setup, I observed a significant response delay (~30 seconds), confirming that the impact is not limited to a single device or network session.

Best,
theteatoast
- **Report Severity Updated**
- **Report Triaged**
- **2025-05-03** @theteatoast: Hi @h1_analyst_trevor 

Just checking in to see if there is any update regarding my current report. Let me know if anything else is needed from my side.

Thanks!
- **Bounty Awarded**
- **2025-05-15** @lillinator13: Thanks for the report! Our team has reviewed your report, and validated the vulnerability. A fix is being developed.
- **2025-05-15** @theteatoast: Thank you for the update and for validating the vulnerability.

I wanted to ask if it would be possible to have a CVE ID assigned for this issue. Please let me know if there's any additional information or steps needed from my side to facilitate the process.

Looking forward to your response!

Best regards,
@theteatoast
- **2025-05-16** @jomaxro: Hi @theteatoast,

Yes, we issue CVE IDs for all of our security fixes. Once the fix is developed and the advisory drafted, we'll work to obtain an ID, and are happy to credit you in the advisory as well.
- **2025-05-19** @jomaxro: A fix for the vulnerability has been developed. We're now in the process of rolling it out to our hosted customers, and will then release it publicly in our next beta release. We'll close this report and publish the CVE at that time. If you'd like credit for the advisory via GitHub, please advise on your username.

Per [our policy](https://hackerone.com/discourse):
> You must wait 90 days after the fix is released before publicly disclosing any information about the vulnerability, your research methods, or how it may be exploited.
- **2025-05-20** @theteatoast: Thanks for the update. You can credit me via GitHub using the username `theteatoast`. I'll follow the 90-day disclosure policy.
- **2025-06-09** @tgx_world: Thanks again for the report! This has been fixed, and you can find the CVE at https://github.com/discourse/discourse/security/advisories/GHSA-3q5q-qmrm-rvwx.

As a reminder, per [our policy](https://hackerone.com/discourse):
> You must wait 90 days after the fix is released before publicly disclosing any information about the vulnerability, your research methods, or how it may be exploited.

We appreciate your help making Discourse secure!
- **2025-06-09** @theteatoast: Thank you.
- **2025-06-09** @theteatoast: Hi @jvyto_tgxworld,

If I post that the CVE id is mine without disclosing any vulnerability details. Will that violate the policy?

Thanks.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
