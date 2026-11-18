---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-07-13
submitted: 2019-08-29T09:32:53.883Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "xanbanx"
source: "https://hackerone.com/reports/684268"
title: "Stored XSS for Grafana dashboard URL"
---
# Stored XSS for Grafana dashboard URL

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 21 | **Program:** GitLab | **Disclosed:** 2022-07-13

- Report: [https://hackerone.com/reports/684268](https://hackerone.com/reports/684268)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-08-29T09:32:53.883Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi GitLab Security Team 

### Summary

I found a stored XSS vulnerability in the admins page. The administrator can set up a Grafana dashboard. Here, the administrator can either enter a relative URL or an absolute address. However, when adding an absolute URL, the protocol is not checked allowing to add a Javascript payload. However, when clicking on the URL, the corresponding `<a>` contains the `target="_blank"` attribute, which means a new tab is opened. However, by exploiting the `window.opener` attribute, I still can access the original tab allowing me to steal for example the CSRF token.

### Steps to reproduce

Tested locally on GitLab Enterprise 12.3.0-pre 7e45734123b

1. As an administrator go to `http://example.gitlab.com/admin/application_settings/metrics_and_profiling#js-grafana-settings`
2. Enter the following payload `javascript:alert(window.opener.document.location)`
3. Within the admin sidebar open `Monitoring ->  Metrics Dashboard`

See the the Javascript being executed

### Impact

Stored Javascript code is being executed on behalf of another user's session. Although this is only visible within the admins page, it's severity is the same. A malicious administrator can attack other administrator users with that. For example, the CSRF token can be stolen allowing, i.e., to add the attacker's SSH key to the victims user account. This can be done for example using the following payload:

```
javascript:var csrf = window.opener.$('meta[name=csrf-token]').attr('content'); window.opener.$.post('/profile/keys', { 'authenticity_token': csrf, 'key[key]': 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDUXhvMZ/BFqgVY4iWWv2lrs2alZHA6CoNcnZWH7gxObXGeFK89/itFbI8NrEDE291LRScBL1nuHs0xlf7uidf97uFGVMyIW8TKeaG/j5q6olr9ejiOZhiiGGkQZf1iSTV4VYN77EtG7iV62VB1ZbwnCau1xT5mlXbd8E4WzaHIxuOY8Ao8EozouaQzWt+I1xJx5rufVwItmTaX5QKV5Cuv8GhMRUb1UqujNKr22/rbWnut0pSzB1+uE4S4E1AaCNX9Byy0z65nzupk5kdj8y/qJ3pk8UBOgQtJCFEOwc42EHS3JwTeMRNRXs9bwqRJfXUomXL1LZ5Eua7UX7aQq7pf admin@foo.com', 'key[title]': 'admin@foo.com' });
```

### What is the current *bug* behavior?

The URL entered in the Grafana domain is not validated allowing arbitrary javascript being entered.

### What is the expected *correct* behavior?

The URL input field should only allow valid URLs for http(s).

### Relevant logs and/or screenshots

(Paste any relevant logs - please use code blocks (```) to format console output,
logs, and code as it's very hard to read otherwise.)

### Output of checks

#### Results of GitLab environment info

```
System information
System:         Ubuntu 18.04
Proxy:          no
Current User:   xanbanx
Using RVM:      no
Ruby Version:   2.6.3p62
Gem Version:    3.0.3
Bundler Version:1.17.2
Rake Version:   12.3.2
Redis Version:  4.0.9
Git Version:    2.23.0
Sidekiq Version:5.2.7
Go Version:     go1.12.6 linux/amd64

GitLab information
Version:        12.3.0-pre
Revision:       7e45734123b
Directory:      /home/xanbanx/gdk/gdk-ee/gitlab
DB Adapter:     PostgreSQL
DB Version:     10.10
URL:            http://localhost:3001
HTTP Clone URL: http://localhost:3001/some-group/some-project.git
SSH Clone URL:  ssh://xanbanx@localhost:2222/some-group/some-project.git
Elasticsearch:  no
Geo:            no
Using LDAP:     no
Using Omniauth: yes
Omniauth Providers: 

GitLab Shell
Version:        9.4.1
Repository storage paths:
- default:      /home/xanbanx/gdk/gdk-ee/repositories
GitLab Shell path:              /home/xanbanx/gdk/gdk-ee/gitlab-shell
Git:            /usr/bin/git

```

Best,
Xanbanx

## Impact

See above

## Timeline

- **Report Filed**
- **2019-08-29** @gitlab-securitybot: Hi @xanbanx,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-08-30** @gitlab-securitybot: ETA for fix:

Hi @xanbanx,

The GitLab issue created from your report is currently scheduled for 2019-10-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-01-14** @gitlab-securitybot: ETA for fix:

Hi @xanbanx,

The issue you reported is currently scheduled to be fixed by 2020-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-01-17** @gitlab-securitybot: ETA for fix:

Hi @xanbanx,

The issue you reported is currently scheduled to be fixed by 2020-02-29.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-02-22** @gitlab-securitybot: ETA for fix:

Hi @xanbanx,

The issue you reported is currently scheduled to be fixed by 2020-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
