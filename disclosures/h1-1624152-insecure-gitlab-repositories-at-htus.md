---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
  - vuln/info-disclosure
  - trigger/auth-required
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-09-27
submitted: 2022-07-04T14:02:12.041Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "thpless"
source: "https://hackerone.com/reports/1624152"
title: "insecure gitlab repositories at ████████ [HtUS]"
---
# insecure gitlab repositories at ████████ [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-27

- Report: [https://hackerone.com/reports/1624152](https://hackerone.com/reports/1624152)
- CWE: Information Disclosure
- Submitted: 2022-07-04T14:02:12.041Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**If you click the link https://███, you're redirected to https://██████/users/sign_in, where credentials have to be inserted. 
The repositories are private and shouldn't be accessable for unauthenticated users!**

### POC

* If you click the following links https://████/api/v4/projects, information about internal projects and users is leaked

* I just take projectid: 4667 as an example for the information disclosure
```
{"id":4667,"description":"This Network-graph based literature review tool uses the open-source version of Neo4j (https://neo4j.com/) with Jupyter Notebooks written in Python to import academic literature metadata from a variety of sources. \r\n","name":"Graph-Based Literature Review Tool","name_with_namespace":"Senft, Michael / Graph-Based Literature Review Tool","path":"graph-based-literature-review-tool","path_with_namespace":"██████████/graph-based-literature-review-tool","created_at":"2021-10-19T12:47:16.550-07:00","default_branch":"master","tag_list":[],"topics":[],"ssh_url_to_repo":"git@██████:████/graph-based-literature-review-tool.git","http_url_to_repo":"https://████████/███████/graph-based-literature-review-tool.git","web_url":"https://████████/████████/graph-based-literature-review-tool","readme_url":"https://███/███/graph-based-literature-review-tool/-/blob/master/README.md","avatar_url":"https://████/uploads/-/system/project/avatar/4667/SchemaModel.jpg","forks_count":0,"star_count":1,"last_activity_at":"2022-01-31T08:48:54.473-08:00","namespace":{"id":1306,"name":"Senft, Michael","path":"██████████","kind":"user","full_path":"██████","parent_id":null,"avatar_url":"/uploads/-/system/user/avatar/1117/avatar.png","web_url":"https://███/████████"}}
```

* The source-code is accessable/readable: 
https://██████████/████/graph-based-literature-review-tool
https://█████/███████/graph-based-literature-review-tool/-/blob/master/README.md 

* It can be cloned 
```
git clone https://███/██████████/graph-based-literature-review-tool.git
Cloning into 'graph-based-literature-review-tool'...
remote: Enumerating objects: 198, done.
remote: Counting objects: 100% (68/68), done.
remote: Compressing objects: 100% (31/31), done.
remote: Total 198 (delta 41), reused 64 (delta 37), pack-reused 130
Receiving objects: 100% (198/198), 239.72 KiB | 503.00 KiB/s, done.
Resolving deltas: 100% (109/109), done.
```

## Impact

A potential attacker has full access to user information and to the users source-code

## Timeline

- **Report Filed**
- **2022-07-04** @h1_mediation_neal: Hi @thpless,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@fuzzface
- **Report Severity Updated**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-09-27** @ag3nt-j1: We usually do disclosure requests on Friday. We've been busy but will get this done this Friday or next Friday for sure. Seeing you want to use this for an interview I'll see if I can get it done sooner for you.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
