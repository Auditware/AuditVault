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
date: 2018-03-17
submitted: 2018-02-05T21:45:55.181Z
bounty_usd: 256
votes: 19
cve: []
program: "[[programs/discourse|Discourse]]"
reporter: "mishre"
source: "https://hackerone.com/reports/312647"
title: "Gaining access to private topics using quoting feature"
---
# Gaining access to private topics using quoting feature

> **Severity:** High | **Bounty:** 256 USD | **Votes:** 19 | **Program:** Discourse | **Disclosed:** 2018-03-17

- Report: [https://hackerone.com/reports/312647](https://hackerone.com/reports/312647)
- CWE: Improper Access Control - Generic
- Submitted: 2018-02-05T21:45:55.181Z

## Timeline

- **Report Filed**
- **2018-02-05** @mishre: Oups, I have posted an incorrect link in step 4. The link should have been:
```
http://localhost:80/t/blablabla/{copied-topic-id}?source_topic_id={copied-topic-id}
```
for example:
http://localhost:80/t/blablabla/29?source_topic_id=29
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **2018-02-08** @discourse_user: The repro steps are off, the URL is incorrect.. try this one:

`https://try.discourse.org/t/blah/128?source_topic_id=128`

There is a topic 128 on try.discourse.org that you shouldn't have visibility into, and you can repro that way.
- **Report New**
- **Report Triaged**
- **2018-02-08** @discourse_user: Thanks @mishre for the report. We're working on a fix.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
