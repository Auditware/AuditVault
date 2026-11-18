---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/open-redirect
  - env/web
substate: "resolved"
weakness: "Open Redirect"
enriched: true
body: true
date: 2017-11-25
submitted: 2017-11-24T19:06:06.369Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/ed|Ed]]"
reporter: "jackds"
source: "https://hackerone.com/reports/292825"
title: "Possible to redirect to a (non-existing) subdomain after logging in via GitHub (leaking the token)"
---
# Possible to redirect to a (non-existing) subdomain after logging in via GitHub (leaking the token)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 71 | **Program:** Ed | **Disclosed:** 2017-11-25

- Report: [https://hackerone.com/reports/292825](https://hackerone.com/reports/292825)
- CWE: Open Redirect
- Submitted: 2017-11-24T19:06:06.369Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary
To comment on an article a user has the option to login using his Github account. After logging in the user is normally redirect back to the URL he came from. I found out that it is also possible to redirect to a non-existing subdomain of edoverflow.com. It looks like the whitelist for the OAuth flow is not configured properly.

# Vulnerability Details
For logging in using the OAuth login flow the following URL is used: https://github.com/login/oauth/authorize?client_id=5f45cc999f7812d0b6d2&redirect_uri={url}&scope=public_repo . The redirect_uri parameter is matched against the configured URLs in the OAuth Application settings. I'm not sure how this is configured for this app, but it seems possible to redirect to a subdomain as well.

# Steps To Reproduce:

  1. Go to https://github.com/login/oauth/authorize?client_id=5f45cc999f7812d0b6d2&redirect_uri=https%3A%2F%2Fnonexisting.edoverflow.com&scope=public_repo
  2. Login using your Github account
  3. You are now redirected to nonexisting.edoverflow.com?code={code}

# Impact
Impact is limited as it is still only possible to redirect to a subdomain. In order to carry out an attack the attackers needs to find a vulnerable subdomain first. 

# Supporting Material/References
-

## Impact

If the target URL is vulnerable in any way the attacker might be able to actually steal a login-token.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-11-24** @edoverflow: Uhm... @jackds, did you just hack GitHub?!

{F242110}
{F242111}
- **2017-11-24** @jackds: For the record: I submitted this issue to GH now as well ;)
- **Report Resolved**
- **2017-11-24** @jackds: Confirm. Issue is "fixed".
- **Report Severity Updated**
- **2017-11-25** @jackds: Github's response: We have reviewed your report and validated your findings. After internally assessing the finding we have determined is is a known low risk issue. We may make this functionality more strict in the future, but don't have anything to announce now.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-11-26** @jackds: frog
- **Swag Awarded**
