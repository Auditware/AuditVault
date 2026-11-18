---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
  - stack/wordpress
  - trigger/brute-force
  - fix/authorization-checks
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2020-02-05
submitted: 2020-02-03T18:44:10.022Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/stripo|Stripo Inc]]"
reporter: "brumens"
source: "https://hackerone.com/reports/788420"
title: "Authorization for wp-admin directory are vulnerable to brute force."
---
# Authorization for wp-admin directory are vulnerable to brute force.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Stripo Inc | **Disclosed:** 2020-02-05

- Report: [https://hackerone.com/reports/788420](https://hackerone.com/reports/788420)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2020-02-03T18:44:10.022Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The domain https://my.stripo.email in the directory /wp-admin are not blocking amount of request in the authorization form, this leads to bruteforce attack. Where the attacker are able to guess tons of passwords without getting blocked or the password field gets locked.
This attack make it possible to gain access as an admin extremely easy and quick to get a successfully login.

To test this security issue you need to visit the link https://my.stripo.email in the directory /wp-admin
Install a bruteforce tool like: Burp intruder, Wfuzz, Hydra, Ncrack
I personality use Wfuzz and Burp.

Wfuzz command in Linux terminal: wfuzz -c -w /usr/share/seclists/Passwords/Common-Credentials/10k-most-common.txt -u https://my.stripo.email/wp-admin -d "Authorization: Basic admin:FUZZ" 

Supported links and fix tips:
https://owasp.org/www-community/attacks/Brute_force_attack
https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks

This Pictures below show status from my program as you can see with Wfuzz it hitted around 3000 passwords in like 40 secounds (calculated approximately.)
My Burp suite shows more exact response from your server.

## Impact

Get access to anadmin login quickly and while logged in the attacker can do whatever an admin can.

## Timeline

- **Report Filed**
- **2020-02-03** @brumens: Tell me if the Image was missing can't see it from my side of the conversation.
- **Report Triaged**
- **2020-02-04** @brumens: Okey thats weard I will try get the image as soon as i come home
- **Report Resolved**
- **2020-02-04** @brumens: Thanks, disclose?
- **2020-02-05** @artem_nefedov: Request a disclosure
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
