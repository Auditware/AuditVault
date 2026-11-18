---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss
  - trigger/auth-required
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-11-16
submitted: 2022-05-22T19:55:10.820Z
bounty_usd: 13950
votes: 93
cve: "CVE-2022-1948"
program: "[[programs/gitlab|GitLab]]"
reporter: "cryptopone"
source: "https://hackerone.com/reports/1578400"
title: "New /add_contacts /remove_contacts quick commands susseptible to XSS from Customer Contact firstname/lastname fields"
---
# New /add_contacts /remove_contacts quick commands susseptible to XSS from Customer Contact firstname/lastname fields

> **Severity:** High | **Bounty:** 13,950 USD | **Votes:** 93 | **Program:** GitLab | **Disclosed:** 2022-11-16

- Report: [https://hackerone.com/reports/1578400](https://hackerone.com/reports/1578400)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2022-1948
- Submitted: 2022-05-22T19:55:10.820Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

In Gitlab 15.0.0 a new Customer Relations feature was added that allows us to use quick actions to find the contact we wish to select.

However, I noticed that if I set the contact's first name or last name to <script>alert(document.domain)</script> we can get the XSS to trigger when we are attempting to use the quick commands to add/remove a contact.

### Steps to reproduce

1. Create a new group.
1. Once the group is created, navigate to the Settings -> General options for the group.
1. Expand the section "Permissions and group features" and under "Customer Relations" make sure "Enable customer relations" is selected.
1. Return back to the group page. On the left side of the screen a new menu option will appear titled "Customer relations". Select it.
1. Create a new contact with "First name" set to "`<script>alert(document.domain)</script>`" and "Last name" set to "`<script>alert(document.domain)</script>`". Provide an email address and save your changes.
1. The user you created in the previous step should now appear as a contact on the Customer Relations page.
1. Go to the create new project URL (https://gitlab.com/projects/new#blank_project) and under Project URL, select the Group you created earlier. Give the project a name Ex. "CustomerProject".
1. Once the project has been created on the left side of the project page select "Issues" and then click "New Issue".
1. In the description pane type "/add_contacts" so the popup appears, then press "enter" to trigger the XSS.

### Impact

Users attempting to utilize the quick commands /add_contacts or /remove_contacts could inadvertently trigger XSS while attempting to add/remove a customer to an issue.

### Examples

This bug was discovered originally on my self-hosted 15.0.0 but is reproducible on gitlab.com.

Create a contact with the payload in firstname and lastname fields
{F1740002}

Create a new issue and type "/add_contacts" in the markdown text area to trigger the popup to appear
{F1740003}

Press enter, which will trigger the XSS when attempting to load the list of contacts
{F1740004}

### What is the current *bug* behavior?
The HTML special characters are not escaped, allowing an iframe to be injected into the page with XSS.

### What is the expected *correct* behavior?

The HTML special characters would be escaped and shown in the diagram.

### Output of checks

This bug is reproducible on Gitlab.com

#### Results of GitLab environment info

```System information
System:         Ubuntu 20.04
Proxy:          no
Current User:   git
Using RVM:      no
Ruby Version:   2.7.5p203
Gem Version:    3.1.4
Bundler Version:2.2.33
Rake Version:   13.0.6
Redis Version:  6.2.6
Sidekiq Version:6.4.0
Go Version:     unknown

GitLab information
Version:        15.0.0-ee
Revision:       3b397c17532
Directory:      /opt/gitlab/embedded/service/gitlab-rails
DB Adapter:     PostgreSQL
DB Version:     12.10
URL:            http://gitlab-pentest4.example.com
HTTP Clone URL: http://gitlab-pentest4.example.com/some-group/some-project.git
SSH Clone URL:  git@gitlab-pentest4.example.com:some-group/some-project.git
Elasticsearch:  no
Geo:            no
Using LDAP:     no
Using Omniauth: yes
Omniauth Providers:

GitLab Shell
Version:        14.3.0
Repository storage paths:
- default:      /var/opt/gitlab/git-data/repositories
GitLab Shell path:              /opt/gitlab/embedded/service/gitlab-shell```

## Impact

JavaScript execution as the authenticated user when the user attempts to add or remove a contact for the new customer relations feature.

## Timeline

- **Report Filed**
- **2022-05-22** @cryptopone: I hit submit a bit too early and needed to edit a couple of items from the report:

### Examples
In addition to the examples above I created a group and project for this issue on GitLab.com - https://gitlab.com/customergroup/customerproject/-/issues/1

It should be possible to trigger this XSS by attempting to use /add_contacts or /remove_contacts in the comment field for this issue.

### What is the current *bug* behavior?
The HTML special characters are not escaped, allowing code to be executed when GitLab attempts to display a list of contacts to the user.

### What is the expected *correct* behavior?

The HTML special characters would be escaped and the popup would not run code from the first name or last name fields.
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-05-25** @gitlab-securitybot: ETA for fix:

Hi @cryptopone,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **2022-06-20** @cryptopone: Thank you for the generous bounty! I can no longer reproduce the issue after the applied fix.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
