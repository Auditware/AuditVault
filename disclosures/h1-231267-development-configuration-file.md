---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2018-01-18
submitted: 2017-05-23T21:21:30.618Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/pushwoosh|Pushwoosh]]"
reporter: "protector47"
source: "https://hackerone.com/reports/231267"
title: "Development configuration file"
---
# Development configuration file

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** Pushwoosh | **Disclosed:** 2018-01-18

- Report: [https://hackerone.com/reports/231267](https://hackerone.com/reports/231267)
- CWE: Information Disclosure
- Submitted: 2017-05-23T21:21:30.618Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
I found an **Sensitive Information Disclosure**.
A configuration file (e.g. Vagrantfile, Gemfile, Rakefile, ...) was found in this directory. This file may expose sensitive information that could help a malicious user to prepare more advanced attacks. It's recommended to remove or restrict access to this type of files from production systems.

#POC
https://go.pushwoosh.com/composer.json
https://go.pushwoosh.com/composer.lock

Open these URLs a configuration file will become download and these files contains very sensitive data.

###IMPACT:
These files may disclose sensitive information. This information can be used to launch further attacks.

###PATCH
Remove or restrict access to all configuration files accessible from internet.

Thanks,

## Timeline

- **Report Filed**
- **2017-06-05** @pkrush: Hello. Dev team here
Sorry for the late reply
The issue have been accepted for the development and will be resolved soon
- **Report Resolved**
- **2017-06-14** @protector47: Any bounty or reward?
- **Agreed On Going Public**
- **Report Became Public**
