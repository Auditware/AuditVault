---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2021-05-24
submitted: 2021-03-22T15:23:30.056Z
bounty_usd: 16000
votes: 194
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "saltyyolk"
source: "https://hackerone.com/reports/1132378"
title: "Arbitrary file read during project import"
---
# Arbitrary file read during project import

> **Severity:** Critical | **Bounty:** 16,000 USD | **Votes:** 194 | **Program:** GitLab | **Disclosed:** 2021-05-24

- Report: [https://hackerone.com/reports/1132378](https://hackerone.com/reports/1132378)
- CWE: Path Traversal
- Submitted: 2021-03-22T15:23:30.056Z

## Timeline

- **Report Filed**
- **2021-03-22** @saltyyolk: About the SSRF part, I'm not going to test it deeper, as it doesn't make too much difference to any other (or previously reported) SSRF issues. It could be used to access metadata services like `http://metadata.google.internal/computeMetadata/v1beta1` like it was done before. I believe you the security team knows much more than me about the infrastructure part, so I should leave the impact assessment to you.

For credentials leaked in GitLab.com, I believe you might need to rotate the secret key base and database password of sidekiq. I did try to read credentials of the service account named gitlab-production from '/etc/gitlab/objectstorage/lfs' but was terminated right after private_key_id, so the secret is still safe. There was nothing else of the leakage attempts worthy to be mentioned afaik, if you have, just let me know.
- **Report Severity Updated**
- **2021-03-22** @gitlab-securitybot: Hi @saltyyolk,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2021-03-31** @gitlab-securitybot: ETA for fix:

Hi @saltyyolk,

The issue you reported is currently scheduled to be fixed by 2021-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-04-05** @rchan: Hi @saltyyolk,

We have resolved this report in 13.10.1, but we are still in the process of discussing the bounty amount, please bear with us. And feel free to ping me if you don't hear back by early next week.

Thanks,
Ron
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
