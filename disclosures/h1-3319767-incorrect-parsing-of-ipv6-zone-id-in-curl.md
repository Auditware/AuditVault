---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-by-primary-weakness
  - env/web
substate: "not-applicable"
weakness: "Authentication Bypass by Primary Weakness"
enriched: true
date: 2025-09-01
submitted: 2025-08-29T09:52:15.041Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/curl|curl]]"
reporter: "9vvert"
source: "https://hackerone.com/reports/3319767"
title: "Incorrect Parsing of IPv6 Zone ID in curl"
---
# Incorrect Parsing of IPv6 Zone ID in curl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** curl | **Disclosed:** 2025-09-01

- Report: [https://hackerone.com/reports/3319767](https://hackerone.com/reports/3319767)
- CWE: Authentication Bypass by Primary Weakness
- Submitted: 2025-08-29T09:52:15.041Z

## Timeline

- **Report Filed**
- **2025-08-29** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-08-29** @bagder: > The curl seems to discard the Zone ID.

What makes you draw this conclusion? The curl URL API offers explicit  support for this "component" and that would not be possible if it "discarded" it.

I'm not really buying the attack here. URL parsing differences are common and expected. No one can or should expect two different URL parsers to parse every URL the same way (I blogged about a recent such report in 2022: https://daniel.haxx.se/blog/2022/01/10/dont-mix-url-parsers/), and you even yourself mention a notable WHATWG vs RFC3986 discrepancy for zone ids.
- **2025-08-29** @dgustafsson: I'm still not quite sure I understand what the attack vector you are implying would be, but quoting from RFC6874 section 4:

 > An HTTP client, proxy, or other intermediary MUST remove any ZoneID
 > attached to an outgoing URI, as it has only local significance at the
 > sending host.

Isn't curl doing the right thing here?
- **2025-09-01** @dgustafsson: The zone id is for directing outgoing traffic and MUST (according to RFC 6874) be removed from the URL in clients. This is what curl does so there is no security issue or bug here. Unless you can provide more information which shows an incorrect behavior we'll close this report shortly.
- **2025-09-01** @9vvert: I'm sorry that our report may be  inaccurate. Thank you for your consideration anyway.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
