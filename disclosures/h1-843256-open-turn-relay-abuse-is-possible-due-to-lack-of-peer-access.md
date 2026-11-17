---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-06-08
submitted: 2020-04-08T14:42:53.762Z
bounty_usd: 700
votes: 23
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "sandrogauci"
source: "https://hackerone.com/reports/843256"
title: "Open TURN relay abuse is possible due to lack of peer access control (Critical)"
---
# Open TURN relay abuse is possible due to lack of peer access control (Critical)

> **Severity:** High | **Bounty:** 700 USD | **Votes:** 23 | **Program:** 8x8 | **Disclosed:** 2020-06-08

- Report: [https://hackerone.com/reports/843256](https://hackerone.com/reports/843256)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-04-08T14:42:53.762Z

## Timeline

- **Report Filed**
- **2020-04-08** @sandrogauci: ### Solutions and recommendations

Our recommendation is to follow these steps:

1. Upgrade coturn with the latest security fixes
2. Apply a configuration that denies internal IP addresses from being reachable

An example configuration based on step 2 for coturn would be the following:

```
no-multicast-peers
denied-peer-ip=0.0.0.0-0.255.255.255
denied-peer-ip=10.0.0.0-10.255.255.255
denied-peer-ip=100.64.0.0-100.127.255.255
denied-peer-ip=127.0.0.0-127.255.255.255
denied-peer-ip=169.254.0.0-169.254.255.255
denied-peer-ip=127.0.0.0-127.255.255.255
denied-peer-ip=172.16.0.0-172.31.255.255
denied-peer-ip=192.0.0.0-192.0.0.255
denied-peer-ip=192.0.2.0-192.0.2.255
denied-peer-ip=192.88.99.0-192.88.99.255
denied-peer-ip=192.168.0.0-192.168.255.255
denied-peer-ip=198.18.0.0-198.19.255.255
denied-peer-ip=198.51.100.0-198.51.100.255
denied-peer-ip=203.0.113.0-203.0.113.255
denied-peer-ip=240.0.0.0-255.255.255.255
```

In some older versions, you might also want to use the `no-loopback-peers` option.
- **Report Duplicate**
- **Report Reopened**
- **Report Triaged**
- **2020-04-08** @1x1: The Jitsi team has implemented some fixes on the following server and would like to see if you can verify fix there before they roll to servers from your report.   
`███`
- **2020-04-09** @sandrogauci: Happy to test your fixes. We'll need TURN credentials to be able to test - usually this is retrieved from the `extdisco` XMPP messages.
- **2020-04-09** @sandrogauci: Hi @1x1 - realized that we can use the credentials from 8x8 video meetings. We ran our tests and it looks like internal addresses are no longer allowed. Here's a log:

```
INFO[2020-04-09 08:47:38] CREATEPERMISSION allowed peers over udp: 8.8.8.8:80 
INFO[2020-04-09 08:47:38] CREATEPERMISSION forbidden peers over udp: 169.254.169.254:80, 127.0.0.1:80, 0.0.0.0:80, 10.0.0.1:80, 100.64.0.0:80, 169.254.0.1:80, 192.0.0.1:80, 192.0.2.1:80, 192.168.0.1:80, 198.18.0.1:80, 198.51.100.1:80, 224.0.0.1:80, 240.0.0.1:80, 255.255.255.255:80 
INFO[2020-04-09 08:47:38] CHANNELBIND allowed peers over udp: 8.8.8.8:80 
INFO[2020-04-09 08:47:38] CHANNELBIND forbidden peers over udp: 169.254.169.254:80, 127.0.0.1:80, 0.0.0.0:80, 10.0.0.1:80, 100.64.0.0:80, 169.254.0.1:80, 192.0.0.1:80, 192.88.99.1:80, 192.168.0.1:80, 198.18.0.1:80, 198.51.100.1:80, 203.0.113.1:80, 224.0.0.1:80, 240.0.0.1:80, 255.255.255.255:80 
INFO[2020-04-09 08:47:38] CREATEPERMISSION allowed peers over tcp: 8.8.8.8:80 
INFO[2020-04-09 08:47:38] CREATEPERMISSION forbidden peers over tcp: 169.254.169.254:80, 127.0.0.1:80, 0.0.0.0:80, 10.0.0.1:80, 100.64.0.0:80, 169.254.0.1:80, 192.0.0.1:80, 192.0.2.1:80, 192.88.99.1:80, 192.168.0.1:80, 198.18.0.1:80, 198.51.100.1:80, 203.0.113.1:80, 224.0.0.1:80, 240.0.0.1:80, 255.255.255.255:80 
INFO[2020-04-09 08:47:38] CREATEPERMISSION allowed peers over tls: 8.8.8.8:80 
INFO[2020-04-09 08:47:38] CREATEPERMISSION forbidden peers over tls: 169.254.169.254:80, 127.0.0.1:80, 0.0.0.0:80, 10.0.0.1:80, 100.64.0.0:80, 169.254.0.1:80, 192.0.0.1:80, 192.0.2.1:80, 192.88.99.1:80, 192.168.0.1:80, 198.18.0.1:80, 198.51.100.1:80, 203.0.113.1:80, 224.0.0.1:80, 240.0.0.1:80, 255.255.255.255:80 
INFO[2020-04-09 08:47:38] successfully returned
```

Response code 403 / Forbidden IP. Looks good to me.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-04-17** @sandrogauci: can this also be made public please?
- **Agreed On Going Public**
- **Report Became Public**
- **Reassigned To Team**
- **Report Severity Updated**
- **Bounty Awarded**
