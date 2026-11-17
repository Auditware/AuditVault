---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2024-06-18
submitted: 2019-09-17T07:31:51.824Z
bounty_usd: null
votes: 31
cve: "CVE-2019-11510", "CVE-2019-11542", "CVE-2019-11539", "CVE-2019-11538", "CVE-2019-11508", "CVE-2019-11540"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/696276"
title: "Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://██████ (███)"
---
# Arbitrary File Reading leads to RCE in the Pulse Secure SSL VPN on the https://██████ (███)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-06-18

- Report: [https://hackerone.com/reports/696276](https://hackerone.com/reports/696276)
- CWE: Path Traversal | CVE: CVE-2019-11510, CVE-2019-11542, CVE-2019-11539, CVE-2019-11538, CVE-2019-11508, CVE-2019-11540
- Submitted: 2019-09-17T07:31:51.824Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **2019-09-17** @sp1d3rs: You can use my Digital Ocean socks5 proxy to quickly bypass the firewall blocks (in case you get request timeout error), if you don't have different IPs to try, just add next argument `--socks5-hostname 157.245.180.224:1080` to curl command
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2019-09-17** @sp1d3rs: Got it @still , I just saw that scope contains targets in the `143.84.0.0` subnets, so this one can pose direct risks to that subnet, despite not being listed
- **2019-09-18** @8thwonder: Hello @sp1d3rs -

Thank you for your report. We have determined that this report is eligible for a bounty. In order to issue you a bounty, you must pass a background check. This is outlined in our policy:

> Prior to receiving a bounty award you must provide your consent to a criminal background check conducted by HackerOne to ensure and verify that you are not a convicted felon, a terrorist, or an associate of a known terrorist or terrorist organization, or otherwise ineligible to receive an award;
> If you choose not to consent to such a background check, you will be deemed to have elected to opt-out of receiving a bounty award and will not receive a bounty award

In order to begin the background check, I have sent you an email to your email address on file from Sterling Talent Solutions, our background check vendor. *Please look for that email so that you can begin the background check process.*

Thank you,
Antoine Williams-Baisy
8thwonder
Technical Program Manager
HackerOne
- **Bounty Awarded**
- **2019-10-29** @sp1d3rs: As part of my monthly reports recheck process, it's notification that this report was resolved and instance patched.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
