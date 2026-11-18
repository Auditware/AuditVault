---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/wordpress
  - stack/php
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2023-04-14
submitted: 2023-02-28T01:38:47.772Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0r10nh4ck"
source: "https://hackerone.com/reports/1888723"
title: " WordPress application vulnerable to DoS attack via wp-cron.php"
---
#  WordPress application vulnerable to DoS attack via wp-cron.php

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-04-14

- Report: [https://hackerone.com/reports/1888723](https://hackerone.com/reports/1888723)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2023-02-28T01:38:47.772Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
Hi team,

The WordPress application is vulnerable to a Denial of Service (DoS) attack via the wp-cron.php script. This script is used by WordPress to perform scheduled tasks, such as publishing scheduled posts, checking for updates, and running plugins.

An attacker can exploit this vulnerability by sending a large number of requests to the wp-cron.php script, causing it to consume excessive resources and overload the server. This can lead to the application becoming unresponsive or crashing, potentially causing data loss and downtime.

I found this vulnerability at https://████████ endpoint.

## References

https://developer.wordpress.org/plugins/cron/

## Impact

A successful attack on this vulnerability can result in the following consequences:

    - Denial of Service (DoS) attacks, rendering the application unavailable.
    - Server overload and increased resource usage, leading to slow response times or application crashes.
   -  Potential data loss and downtime.

## System Host(s)
██████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Get the doser.py script at https://github.com/Quitten/doser.py
2. Use this command to run the script:
```
python3 doser.py -t 999 -g 'https://█████/wp-cron.php'
```
3. Go to https://████ after 1000 requests of the doser.py script.
4. The site returns code 502.
5. See the video PoC.

## Suggested Mitigation/Remediation Actions
To mitigate this vulnerability, it is recommended to disable the default WordPress wp-cron.php script and set up a server-side cron job instead.
Here are the steps to disable the default wp-cron.php script and set up a server-side cron job:

   1.  Access your website's root directory via FTP or cPanel File Manager.
   2.  Locate the wp-config.php file and open it for editing.
   3.  Add the following line of code to the file, just before the line that says "That's all, stop editing! Happy publishing.":
```
define('DISABLE_WP_CRON', true);
```
   4.  Save the changes to the wp-config.php file.
   5. Set up a server-side cron job to run the wp-cron.php script at the desired interval. This can be done using the server's control panel or by editing the server's crontab file.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
