---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-storage-of-sensitive-information
  - env/web
  - vuln/secrets-leak
  - impact/unauthorized-write
substate: "resolved"
weakness: "Insecure Storage of Sensitive Information"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I was able to find Admin Maston API Keys disclosed within Mozilla's #trust-and-safety-eng channel which was posted by a staff member of Mozilla.

## Steps To Reproduce:

  1. Authenticate to mozilla.slack.com as an NDA or Mozillla Staff Member (https://wiki.mozilla.org/NDA)
  2. Search the #trust-and-safety-eng channel for █████████  (Exposed token)
  3. Validate that the token through the following command:

tok=███
ep=https://stage.moztodon.nonprod.webservices.mozgcp.net
curl -H "Authorization: Bearer $tok" "$ep/api/v1/admin/accounts/" 

4. Observe the following output (I've redacted some as it shows the output of all Mastodon accounts):

████████

5. Please note that this was only one API call demonstrated. Maston has the ability to create new accounts, change passwords. delete accounts and delete tweets as referenced within their API documentation here with the  Admin API tokens -  https://docs.joinmastodon.org/methods/accounts/

## Supporting Material/References:

Please find attached the conversation where the API token was accidentaly leaked.

██████████

## Impact

## Summary:

The exposure of Admin Mastodon API tokens represents a critical security vulnerability with the potential for severe consequences. These tokens grant unauthorized individuals comprehensive access to the Mastodon server, allowing them to manipulate user data, spread malicious content, and compromise the integrity of the platform. Immediate action is required to mitigate this risk and protect both the system and its users.

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
