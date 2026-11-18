---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "not-applicable"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2025-06-28
submitted: 2025-03-10T21:00:59.857Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/curl|curl]]"
reporter: "irfanmughal1122"
source: "https://hackerone.com/reports/3030158"
title: "Improper Restriction of Authentication Attempts in cURL"
---
# Improper Restriction of Authentication Attempts in cURL

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** curl | **Disclosed:** 2025-06-28

- Report: [https://hackerone.com/reports/3030158](https://hackerone.com/reports/3030158)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2025-03-10T21:00:59.857Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
The authentication mechanism in cURL does not properly restrict the number of failed authentication attempts, allowing an attacker to brute-force credentials. This issue affects authentication-based requests and could lead to unauthorized access if an attacker successfully guesses a valid password.

## Affected Version:
cURL version: [Specify version]
Platform: [Specify OS and environment]
(curl -V output: [Attach output])

## Steps To Reproduce:

Use a valid username but an incorrect password to make an authentication request via cURL:

curl -u valid_user:wrong_password http://target-url.com

Observe that there is no lockout or delay after multiple failed attempts.

Automate the process using a brute-force script:

for i in {1..1000}; do curl -u valid_user:password$i http://target-url.com; done

If a correct password is found, the attacker gains unauthorized access.

## Supporting Material/References:

[Attach logs or screenshots showing multiple failed attempts without any lockout]

[Any relevant documentation that supports this claim]

## Impact:

Allows brute-force attacks against user accounts.

Potential unauthorized access leading to data breaches.

Can be exploited remotely if authentication is exposed.

## Recommended Fix:

Implement rate-limiting after multiple failed authentication attempts.

Introduce CAPTCHA or multi-factor authentication (MFA).

Enforce temporary account lockouts after a predefined number of failures.

## Severity: Critical 🚨
This vulnerability can be exploited remotely, leading to unauthorized access, making it a high-impact security risk

## Impact

Allows brute-force attacks against user accounts.

Potential unauthorized access leading to data breaches.

Can be exploited remotely if authentication is exposed.

## Timeline

- **Report Filed**
- **2025-03-10** @dgustafsson: How is enforcing backoff between failed attempts the responsibility of curl and not the site?
- **2025-03-10** @jimfuller2024: I think the report confuses a few topics and spits out boilerplate which is not germane to curl - but will play along with an easy to follow example - one is free to run curl as a container which means the entire execution of curl and the container is instantiated, does its work and closed down ... there is nothing curl could do to throttle and there are plenty analog scenarios similar to this ... that is why the server does this kinda thing.

This report is not a security issue nor a bug in curl.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
