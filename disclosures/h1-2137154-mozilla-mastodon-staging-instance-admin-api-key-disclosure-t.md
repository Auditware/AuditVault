---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
date: 2023-09-11
submitted: 2023-09-05T21:31:21.264Z
bounty_usd: 1000
votes: 25
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "griffinf"
source: "https://hackerone.com/reports/2137154"
title: "Mozilla Mastodon Staging Instance Admin API Key Disclosure Through Slack"
---
# Mozilla Mastodon Staging Instance Admin API Key Disclosure Through Slack

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 25 | **Program:** Mozilla | **Disclosed:** 2023-09-11

- Report: [https://hackerone.com/reports/2137154](https://hackerone.com/reports/2137154)
- CWE: Insecure Storage of Sensitive Information
- Submitted: 2023-09-05T21:31:21.264Z

## Timeline

- **Report Filed**
- **2023-09-05** @Mozilla: Note that the responses from Mozilla for the next couple of weeks, from August 21st until September 4th, 2023 will be delayed.
- **Report Triaged**
- **Changed Scope**
- **2023-09-06** @frida-k: Hello @griffinf , thank you for your report. I have asked the engineer who shared the token to rotate it.

Thanks,
Frida
- **Report Title Updated**
- **2023-09-08** @griffinf: Hi @frida-k I can confirm that this token now appears to be have beeen rotated, receiving the following message now:

{"error":"This method requires an authenticated user"}                                                                                                                                                             

Also did we want to also redact the API response which I included which contains email addresses and their associated IP's?
- **2023-09-08** @frida-k: Hello @griffinf , if you are still able to modify the report, can you please add the API response as an attachment and I can redact that?

Thanks,
Frida
- **Report Resolved**
- **2023-09-08** @griffinf: Hi @frida-k  Unfortunately I am unable to modify the report. Maybe Hackerone triage is able to assist?
- **Agreed On Going Public**
- **2023-09-11** @h1_analyst_grace: Hi @frida-k and @griffinf,

I hope all is well at your end, and thanks for leaving a message!

I have now redacted the API response from the past comments.
Please feel free to reach out to us if you require any further assistance regarding the same.

Best,
@h1_analyst_grace
- **2023-09-11** @frida-k: Thanks @h1_analyst_grace , appreciate your help.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
