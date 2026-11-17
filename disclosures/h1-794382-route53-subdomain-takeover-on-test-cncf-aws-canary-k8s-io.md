---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/cloud
  - stack/kubernetes
  - stack/aws
substate: "duplicate"
weakness: "Misconfiguration"
enriched: true
date: 2021-01-16
submitted: 2020-02-12T10:38:37.420Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "rhynorater"
source: "https://hackerone.com/reports/794382"
title: "Route53 Subdomain Takeover on test-cncf-aws.canary.k8s.io"
---
# Route53 Subdomain Takeover on test-cncf-aws.canary.k8s.io

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Kubernetes | **Disclosed:** 2021-01-16

- Report: [https://hackerone.com/reports/794382](https://hackerone.com/reports/794382)
- CWE: Misconfiguration
- Submitted: 2020-02-12T10:38:37.420Z

## Timeline

- **Report Filed**
- **2020-02-12** @bluetooth_headset: Hi @rhynorater,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bluetooth_headset
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2020-02-12** @rhynorater: Using this subdomain takeover, it is possible to execute a technique called Cookie Bombing which would stuff cookies in the user's browser which is greater than the possible request size for an HTTP request. This would cause mission critical sites like dl.k8s.io and get.k8s.io to error out until the user clears their cookies.
- **Report Duplicate**
- **2020-02-13** @rhynorater: All good @bluetooth_headset. However, I will say that I have all 4 nameservers for this host, which means that the other reporter deleted their control of the domain and left it open for an attacker to claim. If Kubernetes is not interested in resolving this vulnerability, it would be a  good idea for them to put it in their scope.
- **2020-02-14** @h1_analyst_andrew: Hi @rhynorater,
Thank you for your reply.

Yes, the other report was submitted 2 months ago - so the reporter 'released' the Nameservers after his submission was triaged and awarded a bounty, which is why you were able to claim them.

It's not that Kubernetes is not interested in this type of issue, it's just that someone else managed to find and report this before you.

Hope this clarified any questions/doubts you might have had. 
Duplicates are annoying , but keep up the good work :)

Cheers,
@retina
- **2020-05-02** @rhynorater: This is STILL vulnerable. @retina @bluetooth_headset , could you reach out to the team and ensure that they know they are leaving this host open to attack?
- **2020-05-04** @bluetooth_headset: Hi @rhynorater - I'm discussing this submission internally with the Kubernetes team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
