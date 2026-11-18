---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2017-09-21
submitted: 2017-08-14T20:53:18.957Z
bounty_usd: null
votes: 39
cve: "CVE-2017-9800", "CVE-2017-1000116", "CVE-2017-1000117"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "joernchen"
source: "https://hackerone.com/reports/260005"
title: "RCE via ssh:// URIs in multiple VCS "
---
# RCE via ssh:// URIs in multiple VCS 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** Internet Bug Bounty | **Disclosed:** 2017-09-21

- Report: [https://hackerone.com/reports/260005](https://hackerone.com/reports/260005)
- CWE: OS Command Injection | CVE: CVE-2017-9800, CVE-2017-1000116, CVE-2017-1000117
- Submitted: 2017-08-14T20:53:18.957Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I'd like to submit an RCE issue within Git SVN and Mercurial, the CVEs are:

*  CVE-2017-9800 (Subversion)
* CVE-2017-1000116 (Mercurial (hg))
* CVE-2017-1000117 (Git)

Further Info can be found at:

http://blog.recurity-labs.com/2017-08-10/scm-vulns

And product specific:

* https://public-inbox.org/git/xmqqh8xf482j.fsf@gitster.mtv.corp.google.com/T/#u
* http://subversion.apache.org/security/CVE-2017-9800-advisory.txt
* https://about.gitlab.com/2017/08/10/gitlab-9-dot-4-dot-4-released/

I think these issues which all are based on the same flaw could be worth
an IBB Bounty. However I'd like to point out that we at Recurity Labs
would like the bounty being donated to a charity. The to be determined
charity will be something in the field of brain aneurysm, this is due to
the fact that Felix, the founder of Recurity Labs, currently is
recovering from a brain aneurysm.


So, just let us know what you think about this.

Cheers,

joern

P.S. I took the CVSS Score from the Subversion Advisory
the Redhat advisory states a score of 6.3 (CVSS:3.0/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:L) I guess the truth is somewhere in between.

## Timeline

- **Report Filed**
- **Cve Id Added**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2017-08-22** @joernchen: Hey,

thanks!

Could you disable the automated payment? It'd safe a lot of hassle on my side. We still need to pick a charity and the bounty should go directly there. :)

joernchen
- **2017-08-22** @arice: Awesome! Payment is on hold for this report (any other bounties to your account will still go through). Since this is a one-off, please email `support@hackerone.com` with this Report ID when you are ready to kick off the donation!
- **Report Became Public**
