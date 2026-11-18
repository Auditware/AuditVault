---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2022-05-13
submitted: 2022-05-12T06:20:27.886Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/curl|curl]]"
reporter: "iylz"
source: "https://hackerone.com/reports/1566462"
title: "error parse uri path in curl"
---
# error parse uri path in curl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** curl | **Disclosed:** 2022-05-13

- Report: [https://hackerone.com/reports/1566462](https://hackerone.com/reports/1566462)
- CWE: Improper Access Control - Generic
- Submitted: 2022-05-12T06:20:27.886Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
[add summary of the vulnerability]

The uri path error could lead to security filter bypasses. 
For example, 
we can use  curl  -vv 'f[h-j]le:///etc/passwd' to bypass  file protocol  black list
we can use  curl  -vv 'http://1.1.1.1:[80-9000]' to scan the open port in the host
etc ...

## Steps To Reproduce:
[add details for how we can reproduce the issue]

curl -vv 'f[h-j]le:///etc/passwd' will  parse 3 request , like  curl -vv 'fhle:///etc/passwd' 、curl -vv 'file:///etc/passwd' 、curl -vv 'fjle:///etc/passwd' 
```
[root@iz2ze9awqx4bwtc7j5q4hsz bin]# ./curl -Version
curl 7.83.1 (x86_64-pc-linux-gnu) libcurl/7.83.1 zlib/1.2.7
Release-Date: 2022-05-11
Protocols: dict file ftp gopher http imap mqtt pop3 rtsp smtp telnet tftp 
Features: alt-svc AsynchDNS IPv6 Largefile libz UnixSockets
[root@iz2ze9awqx4bwtc7j5q4hsz bin]# ./curl -vv 'f[h-j]le:///etc/passwd'
* Protocol "fhle" not supported or disabled in libcurl
* Closing connection -1
curl: (1) Protocol "fhle" not supported or disabled in libcurl
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-bus-proxy:x:999:998:systemd Bus Proxy:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:998:997:User for polkitd:/:/sbin/nologin
tss:x:59:59:Account used by the trousers package to sandbox the tcsd daemon:/dev/null:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:997:995::/var/lib/chrony:/sbin/nologin
ntp:x:38:38::/etc/ntp:/sbin/nologin
nscd:x:28:28:NSCD Daemon:/:/sbin/nologin
tcpdump:x:72:72::/:/sbin/nologin
admin:x:1000:1000::/home/admin:/sbin/nologin
apache:x:48:48:Apache:/usr/share/httpd:/sbin/nologin
postgres:x:26:26:PostgreSQL Server:/var/lib/pgsql:/sbin/nologin
squid:x:23:23::/var/spool/squid:/sbin/nologin
workftp:x:1002:1003::/home/work/ftp/:/sbin/nologin
mysql:x:27:27:MariaDB Server:/var/lib/mysql:/sbin/nologin
* Closing connection 0
* Protocol "fjle" not supported or disabled in libcurl
* Closing connection -1
curl: (1) Protocol "fjle" not supported or disabled in libcurl
[root@iz2ze9awqx4bwtc7j5q4hsz bin]# wget 'f[h-j]le:///etc/passwd'
f[h-j]le:///etc/passwd: 地址缺少协议类型.
[root@iz2ze9awqx4bwtc7j5q4hsz bin]# 
```

So, I think this is a security questions of  curl, because the wget doesn't have same question. Thinks 

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

bypass the security filter like the SSRF/RFL/LFI  etc.

## Timeline

- **Report Filed**
- **2022-05-12** @bagder: This is the "globbing" support curl has and that is prominently documented. You should switch it off if you want to run curl without it. I cannot see how this is a security problem unless you let the user run the full command line themselves, and then you ask for this?
- **2022-05-12** @iylz: As I say, I think this questions can bypass the security filter like the SSRF/RFL/LFI . For example, bypass  file protocol  black list or scan ports. I think should default off about this support consider updating it for security reasons. Thinks
- **2022-05-12** @bagder: That would be a terribly broken filter and the problem would be there, not in curl. curl is just a tool with a (documented) globbing feature.

If you could enable it with an option, then wouldn't the "bypass" still exist?

Sorry, but I cannot agree that this is security problem in curl.
- **2022-05-12** @iylz: In detail, 
When I in order to prevent arbitrary file reading vulnerability in the program. The URL loaded is usually restricted to the file protocol. This limitation can be bypassed through this curl problem. 

I agree with you, this problem is caused by the lax source program security policy. But I still think this is security problem in curl. The description of the problem hazard is incorrect and this is a low security problem ?
- **2022-05-12** @iylz: After testing, I found the wget does not have the same problem.
- **2022-05-12** @bagder: 1. This is not a *problem* in curl, it is a feature. And there are many tools without this feature, wget is only one. You can find many more.
2. This is not a security problem in curl. If this causes security problems, then the filter or whatever you are using is stupid and bad. 
3. You can even accomplish something similar using the globbing support of many shells: "curl fil{a,c,d,e}:///etc/passwd" in bash for example, does not rely on curl's own globbing and thus works with any tool

Again: no, this is not a curl security problem.
- **2022-05-12** @iylz: Unfortunately, thank you for your help.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2022-05-12** @iylz: I found this problem in the https://github.com/curl/curl/blob/master/src/tool_urlglob.c file of the glob_range function , It seems to have nothing to do with other tools like bash shell
- **Cancelled Disclosure Request**
- **2022-05-12** @bagder: What has been explained in this report is not a curl security problem.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Manually Disclosed**
