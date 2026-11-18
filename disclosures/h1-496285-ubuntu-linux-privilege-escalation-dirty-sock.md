---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - os/linux
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-08-28
submitted: 2019-02-14T22:15:46.992Z
bounty_usd: null
votes: 103
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "initstring"
source: "https://hackerone.com/reports/496285"
title: "Ubuntu Linux privilege escalation (dirty_sock)"
---
# Ubuntu Linux privilege escalation (dirty_sock)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 103 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-08-28

- Report: [https://hackerone.com/reports/496285](https://hackerone.com/reports/496285)
- CWE: Privilege Escalation
- Submitted: 2019-02-14T22:15:46.992Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,
This week, I have publicly disclosed the dirty_sock local root exploit affecting multiple Linux Operating Systems.

Very detailed information on the vulnerability can be found in my blog posting [here](https://initblog.com/2019/dirty-sock/).

And the exploit code can be found in my GitHub repository [here](https://github.com/initstring/dirty_sock).

The vulnerability exists in stock versions of Ubuntu Linux due to the default inclusion of the snapd service, but all Linux distributions are vulnerable if they install the package. The disclosure was handled directly with Canonical via the bug tracked [here](https://bugs.launchpad.net/snapd/+bug/1813365).

A large percentage of the Internet is safer today than it was a week ago, due to the amazing response by the team at Canonical.

## Impact

Linux relies on a functioning security model, particularly in environments shared by multiple users. The ability of any user to obtain immediate root access completely breaks this model, putting sensitive data all around the world at risk of exposure.

The exploits provided allow any user to immediately elevate to a root account.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-02-15** @h1_analyst_leon: Hey @initstring - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **2019-02-15** @initstring: Thanks!

Just to add, this has now gained a large amount of publicity. You can read some of the articles here:

- https://www.zdnet.com/article/dirty-sock-vulnerability-lets-attackers-gain-root-access-on-linux-systems/
- https://www.theregister.co.uk/2019/02/14/snapd_priv_escalation_bug/
- https://threatpost.com/dirty-sock-snapd-linux/141779/
- https://news.softpedia.com/news/canonical-patches-dirty-sock-vulnerability-affecting-ubuntu-other-linux-distros-524944.shtml
- https://www.bleepingcomputer.com/news/security/canonical-snapd-vulnerability-gives-root-access-in-linux/
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-08-29** @initstring: I've opened a support ticket (270231) to donate this bounty. Thank you!
