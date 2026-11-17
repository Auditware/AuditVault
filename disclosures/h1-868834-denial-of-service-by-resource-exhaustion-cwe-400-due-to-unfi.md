---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2020-10-17
submitted: 2020-05-08T07:45:07.938Z
bounty_usd: 250
votes: 8
cve: "CVE-2020-8251"
program: "[[programs/nodejs|Node.js]]"
reporter: "shogun_panda"
source: "https://hackerone.com/reports/868834"
title: "Denial of Service by resource exhaustion CWE-400 due to unfinished HTTP/1.1 requests"
---
# Denial of Service by resource exhaustion CWE-400 due to unfinished HTTP/1.1 requests

> **Severity:** Critical | **Bounty:** 250 USD | **Votes:** 8 | **Program:** Node.js | **Disclosed:** 2020-10-17

- Report: [https://hackerone.com/reports/868834](https://hackerone.com/reports/868834)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2020-8251
- Submitted: 2020-05-08T07:45:07.938Z

## Timeline

- **Report Filed**
- **2020-05-08** @shogun_panda: As this is my first report I mistakenly included a public PR without completely thinking about security impact for the time being. The PR has been live on GH for around 20 min but now it's completely gone.

I'm correctly attaching the fix as patch here.
Sorry for the big inconvenience.
- **Report Duplicate**
- **Report Reopened**
- **Report Triaged**
- **2020-08-02** @mcollina: I've invited @notwes. Wdyt think of this? The actual fix is going to be slightly different.
We are aiming to set the default requestTimeout to 0/disabled instead as there are too many legitimate cases for that.
- **External User Joined**
- **2020-08-02** @notwes: In general, I think this patch to node sounds like a good approach.  As with any change like this, it would break users if the timeout was anything other than 0 since folks will be relying on the long timeout, for example all large file upload scenarios.  Would be reasonable in the future to change it to something like 5 minutes by default on a major version.  Then folks could decide to increase it on services they expect to take this long.

FWIW, I think that most attacks like this need to be solved in layers outside node in real world scenarios.  Having been the target of large DDOS attacks in the past, my anecdotal evidence is that solving these things at the application layer is just a bad idea, so having sane platform defaults and options seems like enough to me to say "we are doing the right thing, if you need to you can turn it off".
- **2020-09-09** @mhdawson: @shogunpanda  would you like attribution when this goes out in a security release and if so could you provide what you'd like in terms of

Thank you to X who works at Y for reporting this vulnerability.

@mcollina would you like attribution when this goes out in a security release and if so could you provide what you'd like in terms of

Thank you to X who works at Y for reporting this vulnerability.
- **2020-09-09** @mhdawson: will need that by the end of the week to be able to include it.
- **2020-09-14** @mhdawson: @shogunpanda , @mcollina one last ping.
- **2020-09-14** @mhdawson: Confirmed with Matteo through twitter:

Thank you to Paolo Insogna and Matteo Collina who work at Nearfom for reporting this vulnerability.
- **2020-09-14** @mhdawson: Was suggested it should be: 

Thank you to Paolo Insogna and Matteo Collina who work at Nearfom for reporting and fixing this vulnerability.
- **2020-09-17** @mhdawson: Resolved in September security release: https://nodejs.org/en/blog/vulnerability/september-2020-security-releases/
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
