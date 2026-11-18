---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - vuln/ssrf
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE: This is not an SSRF vulnerability but an open TURN relay vulnerability. Typically, this security vulnerability has at least the same impact as an SSRF. However it is considered more useful from an attacker's point of view since attacks are not restricted to HTTP.

- Affects: 
    - `█████:443`
    - `████████:443`

## Description

The affected TURN server did not put any restrictions on peer which allows remote attackers to bypass firewall rules and reach internal services on the server itself as well as the AWS internal network. In the case of `██████████:443`, both TCP and UDP peers could be specified, while `███████:443` appeared to restrict TCP and only allow UDP.

## Steps To Reproduce:

1. Retrieved temporary TURN credentials from XMPP by:
    - making use of Chrome's devtools 
    - open the network tab, filter just WS connections
    - in the `xmpp-websocket` messages, set a filter for `type='turn'`
    - observe the TURN hostname and credentials
2. Made use of an internal tool called `stunner` as follows: `stunner recon tls://███████:443 -u ████████`
3. Made use of stunner's port scanner and socks proxy to reach the telnet server, AWS meta-data service and so on

Note that we restricted our tests to just the following to avoid causing denial of service to the system:

- Read access to AWS meta-data service
- Only running `help` and `pc` commands on coturn telnet server (other commands may be destructive)

The following is an excerpt from the connection to the coturn telnet server:


```
proxychains -f config telnet 127.0.0.1 5766
[proxychains] config file found: config
[proxychains] preloading /usr/lib64/proxychains-ng/libproxychains4.so
[proxychains] DLL init: proxychains-ng 4.13
Trying 127.0.0.1...
[proxychains] Dynamic chain  ...  127.0.0.1:9999  ...  127.0.0.1:5766  ...  OK
Connected to 127.0.0.1.
Escape character is '^]'.

> pc

  verbose: ON
  daemon process: ON
  stale-nonce: ON (*)
  stun-only: OFF (*)
  no-stun: OFF (*)
  secure-stun: OFF (*)
  do-not-use-config-file: OFF
  RFC5780 support: ON
  net engine version: 3
  net engine: UDP thread per CPU core
  enforce fingerprints: OFF
  mobility: OFF (*)
  udp-self-balance: OFF
  pidfile: /var/run/turnserver.pid
  process user ID: 0
  process group ID: 0
  process dir: /

  cipher-list: DEFAULT
  ec-curve-name: empty
  DH-key-length: 1066
  Certificate Authority file: empty
  Certificate file: /████████.crt
  Private Key file: /███.key
  Listener addr: 127.0.0.1
  Listener addr: ██████
  Listener addr: ::1
  Listener addr: ███████
  no-udp: OFF
  no-tcp: OFF
  no-dtls: OFF
  no-tls: OFF
  TLSv1.0: ON
    TLSv1.1: ON
  TLSv1.2: ON
  listener-port: 443
  tls-listener-port: 5349
  alt-listener-port: 0
  alt-tls-listener-port: 0


  Relay addr: █████
  Relay addr: ██████████
  server-relay: OFF
  no-udp-relay: OFF (*)
  no-tcp-relay: OFF (*)
  min-port: 49152
  max-port: 65535
  no-multicast-peers: OFF (*)
  no-loopback-peers: OFF (*)

  DB type: SQLite
  DB: /var/lib/turn/turndb

  Default realm: █████
  CLI session realm: █████
...

> q
```

## Supporting Material/References:

- Similar vulnerability: <https://www.rtcsec.com/2020/04/01-slack-webrtc-turn-compromise>

## Impact

Abuse of this vulnerability allows attackers to:

- control Coturn by connecting to the telnet server on port 5766 which in turn, allows for writing of files on disk (e.g. using `psd` command), display and editing of the coturn configuration, stopping the server
- connecting to the AWS meta-data service and retrieving IAM credentials for user `HipChatVideo-Coturn`, viewing user-data configuration etc
- scanning `127.0.0.1` and internal network on `██████` and connecting to internal services

Note that in the case of `██████████:443`, both TCP and UDP peers can be specified, while `███:443` appeared to be restricted to just UDP which somewhat limits the security impact of this vulnerability.

We think that it is likely that abuse of the coturn telnet server could lead to remote code execution on the server and further penetration inside 8x8's infrastructure.

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
