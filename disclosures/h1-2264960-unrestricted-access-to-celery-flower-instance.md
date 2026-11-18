---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2023-12-14
submitted: 2023-11-27T11:14:05.531Z
bounty_usd: null
votes: 97
cve: []
program: "[[programs/exness|EXNESS]]"
reporter: "ashwarya"
source: "https://hackerone.com/reports/2264960"
title: "Unrestricted Access to Celery Flower Instance"
---
# Unrestricted Access to Celery Flower Instance

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 97 | **Program:** EXNESS | **Disclosed:** 2023-12-14

- Report: [https://hackerone.com/reports/2264960](https://hackerone.com/reports/2264960)
- CWE: N/A
- Submitted: 2023-11-27T11:14:05.531Z

## Report summary

The publicly accessible Celery Flower instance allowed unrestricted access, exposing sensitive information, and the ability to manipulate tasks.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team,

The Celery Flower instance is running and publicly accessible via the PIM mobile route /pim/flower/*. The access to this service is presently unrestricted. 

I quickly took a glance at the API to ensure that access is unrestricted. From this quick look, it appears possible to shut down a worker instance, revoke or terminate tasks, and perform other actions. In addition to unrestricted access to tasks and workers, I observed ███ via `/api/tasks` endpoint. Most importantly, the endpoint `/api/task/async-apply/*` seems to apply a task asynchronously, and there seems to be a possibility to execute arbitrary code on the Celery worker through this endpoint. I believe it's unwise for me to go beyond this since the instance is running in the prod environment, so I'm sending this quick report to you. If some form of escalation is needed for impact assessment, please let me know.

##Vulnerable Endpoint
```
https://api.excalls.mobi/pim/flower/
```

#Steps to Reproduce

```
https://api.excalls.mobi/pim/flower/api/workers
https://api.excalls.mobi/pim/flower/api/tasks
https://api.excalls.mobi/pim/flower/api/task/info/dc58fcb7-be31-4f4e-aeff-5837f0c32d30
```



#Proof of Concept
█████

████

██████


#Suggested Mitigation

Set the `flower_unauthenticated_api` environment variable to `false`

## Impact

The impact includes, but is not limited to:

1. Manipulating tasks to achieve unintended outcomes, such as disrupting or halting PIM processes.
2. ███
3. A malicious actor could continuously monitor and revoke tasks as they are created, preventing their execution and consuming resources. This could exhaust the Celery worker's resources and hinder its ability to handle legitimate tasks.
4. There seems to be a possibility to execute arbitrary code on the Celery worker by executing a task asynchronously.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **2023-11-27** @loqpa_exness: Hi @ashwarya ,

Thanks for your report.
We are currently investigating it and will respond to you as soon as possible.

We will try to escalate this issue to RCE in test environment and will come back to you with the result. Nice catch btw ;)
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2023-12-01** @ashwarya: Thanks for the bounty & bonus! I'm unable to access the flower instance anymore.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **Report Severity Updated**
