---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2018-05-19
submitted: 2018-01-12T21:42:47.027Z
bounty_usd: null
votes: 35
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "fransrosen"
source: "https://hackerone.com/reports/304378"
title: "ACME TLS-SNI-01/02 challenge vulnerable when combined with shared hosting providers"
---
# ACME TLS-SNI-01/02 challenge vulnerable when combined with shared hosting providers

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 35 | **Program:** Internet Bug Bounty | **Disclosed:** 2018-05-19

- Report: [https://hackerone.com/reports/304378](https://hackerone.com/reports/304378)
- CWE: Privilege Escalation
- Submitted: 2018-01-12T21:42:47.027Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The [ACME TLS-SNI-01](https://tools.ietf.org/html/draft-ietf-acme-acme-01#section-7.3) (and [TLS-SNI-02](https://tools.ietf.org/html/draft-ietf-acme-acme-09#section-8.4)) specification assumed wrong in terms of how current major cloud providers routed and validated domains. This was reported earlier this week to Let's Encrypt, and they decided to disable the method. Today Let's Encrypt decided to sunset both TLS-SNI-01 and TLS-SNI-02 due to the vulnerability I found. 

A full writeup of the finding and my side of the timeline can be found here:

* [How I exploited ACME TLS-SNI-01 issuing Let's Encrypt SSL-certs for any domain using shared hosting](https://labs.detectify.com/2018/01/12/how-i-exploited-acme-tls-sni-01-issuing-lets-encrypt-ssl-certs-for-any-domain-using-shared-hosting/)

Here is Let's Encrypt first and second announcement about the reported issue:

* [2018.01.09 Issue with TLS-SNI-01 and Shared Hosting Infrastructure](https://community.letsencrypt.org/t/2018-01-09-issue-with-tls-sni-01-and-shared-hosting-infrastructure/49996)
* [2018.01.11 Update Regarding ACME TLS-SNI and Shared Hosting Infrastructure](https://community.letsencrypt.org/t/2018-01-11-update-regarding-acme-tls-sni-and-shared-hosting-infrastructure/50188)

Regards,
Frans

## Impact

The ability to issue SSL-certificates for domains not under the attacker's control but served using the same shared hosting provider.

## Timeline

- **Report Filed**
- **2018-01-27** @joystick: Hi,

Thank you for your submission. We are investigating your report, and will let you know if we have any questions. We appreciate your assistance and cooperation.

Regards.
@joystick
- **Report Triaged**
- **2018-04-15** @thefrog: Hi Frans,

Just wanted to let you know that we have not forgotten about this report. We are still looking into this report and will update you when we have additional information to share. Thank you for your patience!

\- @thefrog
- **Report New**
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **2018-04-19** @adambacchus: Hey @fransrosen,

Apologies for not including that in my initial response!

In this case, it appears the vulnerability was bountied separately by another party.

Part of the IBB's charter (https://internetbugbounty.org/charter.html) includes "Mind the Gap":

> In order to most efficiently allocate funds, the Panel should be cognizant of what software is already covered by other efforts, and how. For example, if another organization rewards for providing patches to open source projects or funds secure development, the IBB should not duplicate this effort, but instead serve in a complementary fashion by rewarding researchers that identify and disclose vulnerabilities to the maintainers. The IBB should proactively identify software that has a gap in rewards for vulnerability research; in conjunction with other criteria, this is a good indicator that the software should be moved into scope.

IIRC, this bug was bountied via Heroku, so due to our Mind the Gap stipulation, the panel voted to not award this particular issue.

Additionally, if my understanding of the bug is correct, it was exploitable due to Heroku and Cloudfront's configurations. IBB primarily issues bounties for bugs in open source, non-commercial software; so potentially, the issue within TLS-SNI-01 would have qualified, but the impact of that aspect of the issue in isolation would not meet the bar for a bounty via IBB. The impact when combining the result with Heroku and Cloudfront would potentially meet the bar, but between the "Mind the Gap" stipulation, and Heroku and Amazon being for-profit companies, unfortunately this issue cannot be bountied via IBB.

I believe I've captured all of this correctly, but if you think I've missed anything or have any questions, please let me know!

Thanks,
Adam Bacchus
- **2018-04-21** @fransrosen: Hi,
Thanks for the comments. To bring transparency to what Heroku did I will attach the screenshots showing the interaction I had with the Heroku-team, since they also agreed back then to allow me to share it.

{F289229}
{F289230}
{F289231}

You could argue that they were paying me for letting them know I was going to publish the post, but that's probably up for interpretation (also the reason why I submitted it to their program was that their PGP-key had expired), and I will not complain about your decision, I just want to clarify how it all went down.

In addition, Heroku and AWS CloudFront were two of the shared hosting environments affected. No "subdomain takeover" was needed to issue certs for other domains, they only had to currently use one of the shared hosting providers. Since the TLS-SNI-01/02 specification only used the domain you wanted to validate to resolve the host it should connect to, and as soon as the connection was made, the TLS-SNI-01/02 verification method asked for a `*.acme.invalid`-domain that had nothing to do with the domain being verified. This was the big issue with the validation method.

As the Let's Encrypt team discovered, the only sane thing was to actually sunset TLS-SNI-01/02 completely. If this would have been an error only for those shared hosting providers, the same resolution would not have been the end result.

I appreciate that you responded to my question about the decision.

Regards,
Frans
- **Report Became Public**
