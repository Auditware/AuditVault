---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-hard-coded-credentials
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Use of Hard-coded Credentials"
enriched: true
body: true
date: 2022-07-08
submitted: 2022-05-24T23:38:35.714Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/glovo|Glovo]]"
reporter: "mehdisadir"
source: "https://hackerone.com/reports/1580567"
title: "Exposed valid AWS, Mysql, Sendgrid and other secrets"
---
# Exposed valid AWS, Mysql, Sendgrid and other secrets

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** Glovo | **Disclosed:** 2022-07-08

- Report: [https://hackerone.com/reports/1580567](https://hackerone.com/reports/1580567)
- CWE: Use of Hard-coded Credentials
- Submitted: 2022-05-24T23:38:35.714Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team,

I just discovered some hardcoded credentials allowing access to AWS, Mysql database, ...

To make this report short, here is the POC: 
see ███ & █████
## Steps To Reproduce:

where there are the info : 

<p>
APP_NAME=Glovo
APP_ENV=local
APP_KEY=█████
APP_DEBUG=false
APP_URL=http://localhost
LOG_CHANNEL=stack
LOG_LEVEL=debug
DB_CONNECTION=mysql
DB_HOST=██████████
DB_PORT=3306
DB_DATABASE=████████
DB_USERNAME=█████
DB_PASSWORD=█████████
BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
MEMCACHED_HOST=127.0.0.1
REDIS_HOST=█████
REDIS_PASSWORD=██████████
REDIS_PORT=11773
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"
AWS_ACCESS_KEY_ID=███
AWS_SECRET_ACCESS_KEY=███████
AWS_DEFAULT_REGION=eu-central-1
AWS_BUCKET=glovos3
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
SENDGRID_API_KEY=████
MAIL_FROM=glovo@appsmart.ro
MAIL_REPLY_TO=glovo@appsmart.ro
REDIS_URL=█████
LINK_RECEIPT=https://glovo.onlineservice.io/g/c/
SENDGRID_TEMPLATE=d-6ae3f2fe536c41fda21ad60a18c10cce
SENDGRID_PUBLIC_KEY=███████
</p>




  1. The leak was found using Leakix : https://leakix.net/host/16.170.179.191

#Mitigation :

Remove the exposed credentials and revoke them.

Regards,

NB: After checking some files which i deleted immediatly, I found the company name is GLOVOAPPRO SRL and im not sure if it is related to Glovo company, but I can confirm a little bit from the database where I could see delivery fees ... which is about Glovo's principal service (delivery).

## Impact

Anyone could access

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2022-05-24** @mehdisadir: I can confirm that this is related to Glovo by visiting the website : https://appsmart.ro/ that includes Glovo's logo for companies they worked with.
- **2022-05-25** @madaga: Hi @mehdisadir this is not from Glovo but from one of our third-party, we are analyzing the leaked information to measure the impact.

Best regards.
- **2022-05-25** @madaga: Hi @mehdisadir can you test the access with the leaked credentials?
- **Report Severity Updated**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2022-05-26** @madaga: Hi @mehdisadir thanks for validating.

Best regards
- **2022-05-26** @mehdisadir: Hi,

Could we disclose it?

Regards
- **Agreed On Going Public**
- **2022-05-27** @madaga: Hi @mehdisadir yes of course.
- **Agreed On Going Public**
- **Report Became Public**
