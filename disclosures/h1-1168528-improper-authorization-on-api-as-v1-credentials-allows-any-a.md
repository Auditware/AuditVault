---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-06-02
submitted: 2021-04-19T13:20:47.377Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "dee-see"
source: "https://hackerone.com/reports/1168528"
title: "Improper authorization on `/api/as/v1/credentials/` allows any App Search user to access all API keys and escalate privileges"
---
# Improper authorization on `/api/as/v1/credentials/` allows any App Search user to access all API keys and escalate privileges

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Elastic | **Disclosed:** 2021-06-02

- Report: [https://hackerone.com/reports/1168528](https://hackerone.com/reports/1168528)
- CWE: Improper Access Control - Generic
- Submitted: 2021-04-19T13:20:47.377Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Hello team, I hope you're doing well! App Search has a credentials page located at `/as#/credentials` that lists all the API keys a user has access to, if any. That same page will 404 for users with `Analyst` or `Editor` role. This is all working as intended, however there is also an [API endpoint](https://www.elastic.co/guide/en/app-search/current/credentials.html) to query that same data at `/api/as/v1/credentials/` and this will list all existing API keys for any authenticated user regardless of their App Search role.

## Steps to reproduce

I'm going to use the cloud environment for the reproduction

### Preparation

1. Log in App Search with the admin (`elastic`) user and go to the `Users & roles` page (`/as#/role-mappings/`)
1. Click `Add mapping`
1. In the `Attribute value` field enter `h1-repro`
1. In the `Role` box select `Analyst`
1. In the `Engine Access` select `Limited Engine Access`, no need to select any engine
    - We now have created the most limited role possible
1. Log in Kibana with the admin (`elastic`) user and go to the `Stack Management` > `Users` page (`/app/management/security/users/`)
1. Click `Create user`
1. In the `Username` field enter `hi-repro`
1. Set any password you like and then click `Create user`

### Reproduction

1. Log in App Search with the `h1-repro` user
1. Navigate to `/as#/role-mappings/` and observe that it's a 404 because you don't have access to this page
1. Navigate to `/api/as/v1/credentials/` and observe that you have access to all the API keys

## Impact

Privilege escalation. The default App Search install has a [Private API Key with read/write access to all engines](https://www.elastic.co/guide/en/app-search/current/authentication.html#authentication-key-types). If a Private Admin Key has been created before. the attacker can use it to create new API keys or delete existing ones.

## Timeline

- **Report Filed**
- **2021-04-19** @dee-see: Step 8 in the preparation section should be

> 8. In the `Username` field enter `h1-repro`

There's a typo in the username.
- **Report Triaged**
- **Bounty Awarded**
- **Bounty Awarded**
- **2021-04-19** @dee-see: Thanks! Happy with the \#1 🎉
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
