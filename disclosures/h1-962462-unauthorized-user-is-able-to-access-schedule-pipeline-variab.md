---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2020-11-30
submitted: 2020-08-19T16:08:55.229Z
bounty_usd: null
votes: 9
cve: "CVE-2020-13351"
program: "[[programs/gitlab|GitLab]]"
reporter: "vaib25vicky"
source: "https://hackerone.com/reports/962462"
title: "Unauthorized user is able to access schedule pipeline variables and values"
---
# Unauthorized user is able to access schedule pipeline variables and values

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** GitLab | **Disclosed:** 2020-11-30

- Report: [https://hackerone.com/reports/962462](https://hackerone.com/reports/962462)
- CWE: Information Disclosure | CVE: CVE-2020-13351
- Submitted: 2020-08-19T16:08:55.229Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

The feature allows to add or overwrite variables that are passed to jobs  in order to modify the behavior just for that specific instance.
 
As per this https://gitlab.com/gitlab-org/gitlab-foss/-/issues/32568#note_32531510 , the current security model is
>If you are owner of schedule (as developer) or master => you can read, modify and delete,
If you are developer => you can just list, not read,

>This allows only owners and masters to read variables assigned to the schedule. It prevents other developers from hijacking schedules, but allows master to fully control them. Master already has access to Secret Variables.

But api endpoints are cleary showing this values to everyone even if the user is not part of the project. https://docs.gitlab.com/ee/api/pipeline_schedules.html#get-a-single-pipeline-schedule


### PoC

This is my test project https://gitlab.com/thevicc/trigg with schedule pipeline which custom variables you can't read.

Now, run this to read the variable and its value

`curl  --header "Private-Token: <your_access_token>"  https://gitlab.com/api/v4/projects/20618145/pipeline_schedules/69918`

Response
{F955402}

### Steps to reproduce

* Create a project and add a schedule pipeline with custom variables
*  Only you or owner can read variables
* As second account, use the api `https://docs.gitlab.com/ee/api/pipeline_schedules.html#get-a-single-pipeline-schedule`

## Impact

This bug allows unauthorized users to read scheduled pipeline custom variables and values. As per security model, this allows other devs to hijack schedules.

## Timeline

- **Report Filed**
- **2020-08-19** @gitlab-securitybot: Hi @vaib25vicky,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-10-16** @gitlab-securitybot: ETA for fix:

Hi @vaib25vicky,

The issue you reported is currently scheduled to be fixed by 2020-11-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Cve Id Added**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **2020-11-03** @vaib25vicky: Awesome, thank you!
- **Agreed On Going Public**
- **2020-11-20** @dcouture: Hi @vaib25vicky,

We will disclose the report but first we'll wait until 30 days have passed since the fix has been released.

Thanks,
Dominic
GitLab Security Team
- **Agreed On Going Public**
- **Report Became Public**
