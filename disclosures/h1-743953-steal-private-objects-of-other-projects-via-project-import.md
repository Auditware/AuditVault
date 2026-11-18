---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-06-07
submitted: 2019-11-22T04:52:22.161Z
bounty_usd: 20000
votes: 254
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/743953"
title: "Steal private objects of other projects via project import"
---
# Steal private objects of other projects via project import

> **Severity:** Critical | **Bounty:** 20,000 USD | **Votes:** 254 | **Program:** GitLab | **Disclosed:** 2022-06-07

- Report: [https://hackerone.com/reports/743953](https://hackerone.com/reports/743953)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2019-11-22T04:52:22.161Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
An attacker could transfer issues, merge requests of another project to the imported project by importing a crafted GitLab export. 

### Steps to reproduce
1. Import the attached tarball as GitLab export.
2. Check the issues page of the imported project. You will see an private issue created by https://gitlab.com/nyangawa-h1 instead of the current user.

### Description
The exploit is in project.json, I added one line to assign `issue_ids` and kept `issues` an empty array.
```
    "issue_ids": [ 27422144 ],                                                 
    "issues": [],  
```

The issues_ids contains the database id of the issues the attacker wants to steal. There's no good way for the attacker to know the id of a specific issue, but as the id is incremental, the attacker could simply steal as many issues as possible in a brute forcing manner.

The root cause of this issue lies in `project_tree_restorer.rb`
```
...
@project.assign_attributes(project_params)
...
```

Many attributes (foreign key) like `issue_ids` and `merge_request_ids` are not excluded during import. According to my observation, affected objects including (but not limited to):
```
board_ids
issue_ids
merge_request_ids
note_ids
...
```
Looks like almost all non-excluded attributes behaves like `issues` are affected.

### Examples

{F640860}

### Output of checks

This bug happens on GitLab.com and self-hosted GitLab installations.

## Impact

With this ability to modify relations between objects, an attacker could end up with accessing random resources of other users by traversing the incremental ID space.

## Timeline

- **Report Filed**
- **2019-11-22** @gitlab-securitybot: Hi @nyangawa,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-11-22** @saltyyolk: Hi,
I want to update the impact of this issue after some further investigations:
1. Secret CI variable leakage with `variable_ids`
2. Cluster credential leakage with `cluster_ids`

Leaking the above information could result into infrastructure resources of the victim being compromised by the attacker. At the same time, the stolen objects usually would become inaccessible from the original project, which causes things like pipeline malfunctioning in the original project.

Best regards,
Li
- **Report Severity Updated**
- **2019-11-25** @saltyyolk: As I personally think that the impact could be severe. Allow me to shamelessly set the severity to bring up some notice. :P
- **Report Triaged**
- **Bounty Awarded**
- **2019-11-27** @gitlab-securitybot: ETA for fix:

Hi @nyangawa,

The issue you reported is currently scheduled to be fixed by 2019-12-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-11-27** @gitlab_cmaxim: Hello @nyangawa,

Thank you again for the report! Your finding has just been patched in GitLab version 12.5.1. Please take a look and check if you can find a bypass. 
Your report will be published in 30 days in GitLab's issue tracker.

We will keep you updated about the final bounty amount.

Best regards,
Costel
Security Team | GitLab Inc.
- **2019-11-28** @saltyyolk: Hi @gitlab_cmaxim,

I'm on vacation recently, might not be able to reply in time :p

I just looked into the patch and I saw a new change in the AttributeCleaner class where it blocks all _ids assignments during import. This is a quite straight-forward way to patch the issue we mentioned in this report.

However, I'm actually wondering that whether it really blocks all attack surfaces by assigning values to some other attributes which does not end in _ids or those which had been blocked already. It's still a extremely trivial idea and I haven't been able to looking into it. I'll try to figure out a PoC if there're any and when I got some more time.

From a long-term perspective, I think it might be better to re-design this part to import projects more strictly, with things like whitelisting instead of blacklisting specific attribute names. But talk is just talk, the issue in this report has been fixed anyway.

Thanks,
Li
- **2019-11-28** @gitlab_cmaxim: Hi @nyangawa, 

Enjoy your vacation and thanks for looking icon this.

Regards,
Costel
- **2019-11-28** @hackerjuan: Hey @nyangawa, 

Thanks for the recommendation. We totally agree and had already opened an internal issue to replace this logic for a whitelist based approach. Enjoy your vacation!

Best regards,
Juan
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
