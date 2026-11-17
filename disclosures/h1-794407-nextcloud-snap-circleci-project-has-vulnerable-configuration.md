---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insufficiently-protected-credentials
  - env/web
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
date: 2021-01-29
submitted: 2020-02-12T11:08:18.357Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "nathand"
source: "https://hackerone.com/reports/794407"
title: "nextcloud-snap CircleCI project has vulnerable configuration which can lead to exposing secrets"
---
# nextcloud-snap CircleCI project has vulnerable configuration which can lead to exposing secrets

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Nextcloud | **Disclosed:** 2021-01-29

- Report: [https://hackerone.com/reports/794407](https://hackerone.com/reports/794407)
- CWE: Insufficiently Protected Credentials
- Submitted: 2020-02-12T11:08:18.357Z

## Report summary

The techniques and tools I used for finding the insecure configuration detailed in this report can be found on my blog at https://nathandavison.com/blog/shaking-secrets-out-of-circleci-builds.

## Timeline

- **Report Filed**
- **2020-02-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Resolved**
- **2020-02-17** @nathand: Thanks @nickvergessen - is this one eligible for bounty? I know the CI system is not specifically in scope, but I figured maybe the Github token gave privileged access to a repo that is in scope? FYI a quick way to test this is to run:

```
curl "https://api.github.com/rate_limit" -i -u "user:XXXX" | grep "X-OAuth-Scopes:"
```

Where `XXXX` is the token, and then reference https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/ for the details on what scope the token grants. E.g. a scope of `repo` is quite vast but `repo:status` maybe not so much.
- **2020-02-17** @nathand: Sorry forgot to mention, I can confirm the project is now reporting that the "forks receive secrets" is off.
- **Not Eligible For Bounty**
- **2020-02-17** @nathand: Oh sorry, I was not aware of that - but the repo exists under the Nextcloud Github org, and it is possible the token has access beyond just this repo. For instance, if it has the `repo` scope, it would grant read and write to all repos.
- **2020-04-15** @nathand: Hi there - I was just re-reading through this and realized I didn't get a response regarding whether the Github token that would have been exposed here could have impacted on other Nextcloud Github repositories, including those specifically listed as in scope. Is this something that was considered when reviewing this report for bounty eligibility? Thanks.
- **2020-04-15** @nickvergessen: No, it only had access to push to the snap repo
- **2020-04-15** @nathand: @nickvergessen No problems thanks for checking and reporting back.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
