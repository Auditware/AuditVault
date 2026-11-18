---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/gitlab
  - vuln/ssrf
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the (parenthesized) sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

### Summary
A mis-usage of json schema validator could be used by an attacker to read any file in GitLab server. The issue allows the attacker to leak ~250 bytes of data of any file.
At the same time, as the root cause of the issue here is 'open-uri'. It's an SSRF issue at the same time.

### Steps to reproduce
1. Use the import feature of gitlab.com to import the attached import.tar.gz as 'GitLab export' ███████
2. Wait the import process to finish
3. Access URL: https://gitlab.com/api/v4/projects/PROJECT_ID/import where PROJECT_ID is the id of the imported project, which could be found in the home page of the project.
4. The connection information of gitlab's production database is in the output, as attached.

### Impact
For GitLab.com, this issue could be used to leak some critical credentials. I went through the charts in `https://gitlab.com/gitlab-org/charts/gitlab/-/tree/master/charts/gitlab/charts/sidekiq/templates`. It seems that there're a bunch of  juicy credentials could be leaked with this method, including Rails secret_key_base, database credentials and GitLab's smtp credentials. The object storage service account credential is limitedly accessed because of the 250 bytes limitation.

For self-hosted GitLab instances, this issue could cause more severe problems since most of self-hosted GitLab instances has sidekiq running with gitlab-rails & gitlab-shell. So .gitlab_shell_token could be easily downloaded and be used to access internal APIs such as '/api/v4/internal/personal_access_token', which could issue an private access token of an admin of someone else.

### Relevant logs and/or screenshots
███
███████

### Output of checks
This bug happens on GitLab.com

## Impact

For GitLab.com, this issue could be used to leak some critical credentials. I went through the charts in `https://gitlab.com/gitlab-org/charts/gitlab/-/tree/master/charts/gitlab/charts/sidekiq/templates`. It seems that there're a bunch of  juicy credentials could be leaked with this method, including Rails secret_key_base, database credentials and GitLab's smtp credentials. The object storage service account credential is limitedly accessed because of the 250 bytes limitation.

For self-hosted GitLab instances, this issue could cause more severe problems since most of self-hosted GitLab instances has sidekiq running with gitlab-rails & gitlab-shell. So .gitlab_shell_token could be easily downloaded and be used to access internal APIs such as '/api/v4/internal/personal_access_token', which could issue an private access token of an admin of someone else.

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
