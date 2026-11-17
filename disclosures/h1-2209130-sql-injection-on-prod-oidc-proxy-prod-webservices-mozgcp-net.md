---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2024-01-30
submitted: 2023-10-14T12:47:48.736Z
bounty_usd: null
votes: 93
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "supr4s"
source: "https://hackerone.com/reports/2209130"
title: "SQL Injection on prod.oidc-proxy.prod.webservices.mozgcp.net via invite_code parameter - Mozilla social inscription"
---
# SQL Injection on prod.oidc-proxy.prod.webservices.mozgcp.net via invite_code parameter - Mozilla social inscription

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 93 | **Program:** Mozilla | **Disclosed:** 2024-01-30

- Report: [https://hackerone.com/reports/2209130](https://hackerone.com/reports/2209130)
- CWE: SQL Injection
- Submitted: 2023-10-14T12:47:48.736Z

## Timeline

- **Report Filed**
- **2023-10-14** @supr4s: Hi,

With the help of SQLMap, I was able to retrieve the following information : 

Database name : `public`

Tables : 

- `allowlist`
- `disallowed_handles`
- `invitation_tokens`
- `knex_migrations`
- `knex_migrations_lock`
- `oidc_payloads`
- `regexp_disallowed_handles`
- `sub_to_account`
- `waitlist`

To POC : 

```
$ sqlmap -r sqli-mozilla --level=3 -p invite_code --dbms=postgresql --tables --force-ssl
```
- **2023-10-14** @supr4s: From `waitlist` table, here are the columns found :

- `email`
- `first_name`
- `id`
- `last_name`
- `mastodon_handle` 
- `twitter_handle`

9438 entries in total.

From `waitlist` table : 

- `account`

And 722 entries in this column.

From `invitation_tokens` table, here are the columns found :

- `assigned`
- `assigned_at`
- `created_at`
- `last_name`
- `owner`
- `state`
- `token`

Current user of database : `oidcproxy`. He is not DBA.

__________________________

About the scope : 

I'm a bit lost between [https://hackerone.com/mozilla_critical_services](https://hackerone.com/mozilla_critical_services) and [https://hackerone.com/mozilla_core_services](https://hackerone.com/mozilla_core_services), I didn't notice that there was a second program open.
If ever the report is on the wrong program, could you move it ? :)

I think the report now needs to be critically appraised. Let me know if you want any further information or if I should continue with the operation.

Regards,
Supr4s
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **Bounty Awarded**
- **2023-11-06** @supr4s: Hi,

Thanks for the bounty ! :)

May I ask why the amount corresponds to a Medium category, when we are here on some critical things in CVSS 9.1 ?

Thanks !

Supr4s
- **2023-11-06** @frida-k: Hello @supr4s , mozilla.social and the application which manages the invitations, where the issue is found, are both out of scope of our program. For out of scope assets, we pay in the range of 500-1000 for critical issues. Additionally, we paid out a bonus on top of that because of the impact on the application.

Thanks,
Frida
- **2023-11-06** @supr4s: Hi,

Thank you for your feedback and explanations !

Have a nice day.

Supr4s
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **Reassigned To Team**
