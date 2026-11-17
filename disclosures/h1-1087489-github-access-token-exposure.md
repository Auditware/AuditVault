---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2021-07-26
submitted: 2021-01-26T13:03:40.914Z
bounty_usd: 50000
votes: 1602
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "augustozanellato"
source: "https://hackerone.com/reports/1087489"
title: "Github access token exposure"
---
# Github access token exposure

> **Severity:** Critical | **Bounty:** 50,000 USD | **Votes:** 1602 | **Program:** Shopify | **Disclosed:** 2021-07-26

- Report: [https://hackerone.com/reports/1087489](https://hackerone.com/reports/1087489)
- CWE: N/A
- Submitted: 2021-01-26T13:03:40.914Z

## Report summary

I was reviewing an Electron app made by one of Shopify employees (at the time I didn't know that Shopify was in any way involved), after extracting the `app.asar` file using `npx asar extract path/to/app.asar extracted/path` I found a `.env` file, initially I skipped it because I thought it just contained some app configuration stuff but after taking a look at the source it was clear that the app never loaded it. It was probably a leftover of the release building process.
That `.env` contained a `GH_TOKEN` variable, which is (as you can probably guess) a GitHub token, I tried using it to authenticate against GitHub REST API using `curl -H "Authorization: token $GH_TOKEN" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user`, I saw that the token was indeed valid so I decided to hit the `/user/orgs` API endpoint and I got back (among others) the Shopify organization, then I hit the `/orgs/Shopify/repos` endpoint to confirm the GitHub token scope and I successfully got back a list containing both Shopify public and private repos with `"permissions": {"admin": false, "push": true, "pull": true}` so at that point I knew that the token was enabling me to perform arbitrary push and pulls to Shopify repos so potentially permitting me to place backdoors and such.

On January 26, @augustozanellato reported that while reviewing a public MacOS app, they found a valid GitHub Access Token belonging to a Shopify employee. This token had read and write access to Shopify-owned GitHub repositories. Upon validating the report, we immediately revoked the token and performed an audit of access logs to confirm no unauthorized activity had occurred.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2021-01-27** @jack_mccracken: Hi @augustozanellato,

Thanks again for the report. We’ve revoked this GitHub Personal Access Token. To aid in our investigation, we would appreciate if you could provide the IP address(es) from which you performed your testing and a list of actions you performed on the Shopify organization using the token.

You should hear back from us within 7 days regarding a bounty decision.
- **2021-01-27** @augustozanellato: Hi,
the IP used for the tests is `██████████`, the actions performed on the Shopify org were limited to GET `/orgs/Shopify/repos` in order to list the repos and I tried to actually start some clones because I couldn't believe it was real :P. I also cloned in `/tmp` the shopify repo in order to give you the hash of README.md. Maybe I shouldn't have done that, but I had no idea how to approach this. Rest assured that all the data was properly destroyed after providing you with the hash.
- **Bounty Awarded**
- **2021-02-02** @augustozanellato: Ok, I'm officially speechless, I wasn't expecting a bounty so big! Big thanks to all the Shopify security team, looking forward to open more reports here!
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-04-01** @augustozanellato: Hi Jack,
figured out it that the report itself wasn't very clear so I provided a summary, can we do partial disclosure?
Thanks again,
Augusto
- **2021-07-19** @jenn-shopify: Hey @augustozanellato!
We're getting ready to disclose this one, and wondered if you would be okay with full disclosure? This is a great report, and others will be able to learn from the comments on it.
- **2021-07-24** @augustozanellato: Full disclosure would be fine for me, feel free to accept my disclosure request whenever you are ready.
- **Agreed On Going Public**
- **Report Became Public**
