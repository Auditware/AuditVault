---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cryptographic-issues-generic
  - env/web
substate: "resolved"
weakness: "Cryptographic Issues - Generic"
enriched: true
date: 2020-12-04
submitted: 2020-11-20T12:12:33.260Z
bounty_usd: 100
votes: 20
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "jub0bs"
source: "https://hackerone.com/reports/1039504"
title: "Some build dependencies are downloaded over an insecure channel (without subsequent integrity checks)"
---
# Some build dependencies are downloaded over an insecure channel (without subsequent integrity checks)

> **Severity:** High | **Bounty:** 100 USD | **Votes:** 20 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-12-04

- Report: [https://hackerone.com/reports/1039504](https://hackerone.com/reports/1039504)
- CWE: Cryptographic Issues - Generic
- Submitted: 2020-11-20T12:12:33.260Z

## Timeline

- **Report Filed**
- **2020-11-20** @jub0bs: To make sure that those `wget` commands do get executed during the two `mingw` build jobs in question, I [forked the repository](https://github.com/jub0bs/openvpn) and made a few minor modifications:

1. I [added an `echo` command just before each of the offending `wget` commands in `.travis/build-deps.sh`](https://github.com/jub0bs/openvpn/commit/c565d0057c78b479586049c911986efc63246a88), in order to find the point of interest more easily in the logs.
2. I [modified line 120 of `.travis.yml`](https://github.com/jub0bs/openvpn/commit/0274f0111d75509e61163521d4411311f4554ca5) in order to log the standard output of `.travis/build-deps.sh` unconditionally.

I then set up Travis CI for my fork and triggered a build. Sure enough, the logs for the two `mingw` build  jobs show that the two offending `wget` commands do get executed:

- ` mingw64 | openssl-1.1.1d`
    - [https://travis-ci.org/github/jub0bs/openvpn/jobs/744864488#L11188](https://travis-ci.org/github/jub0bs/openvpn/jobs/744864488#L11188)
    - [https://travis-ci.org/github/jub0bs/openvpn/jobs/744864488#L11226](https://travis-ci.org/github/jub0bs/openvpn/jobs/744864488#L11226)
- `mingw32 | openssl-1.0.2u`
    - [https://travis-ci.org/github/jub0bs/openvpn/jobs/744864489#L4232](https://travis-ci.org/github/jub0bs/openvpn/jobs/744864489#L4232)
    - [https://travis-ci.org/github/jub0bs/openvpn/jobs/744864489#L4270](https://travis-ci.org/github/jub0bs/openvpn/jobs/744864489#L4270)
- **2020-11-24** @cron2: Right, thanks for the notice.  This needs to be fixed.

The security implications are not as bad (we're not using the build artifacts for anything today), but it still needs fixing.
- **2020-11-24** @jub0bs: @cron2 Thanks for your reply. 

Incidentally, unless I'm missing something, HackerOne's CVSS v3 score calculation on this report (7.4 High) seems to be incorrect. If I use the same CVSS v3 vector on first.org, I get a 5.9 Medium, not a High: https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:H/A:N
- **2020-11-24** @cron2: commit 0d4069e41d3ba7178be30f78f1174f689dbdfa59 (master)
commit d3dd620b13a21c3ed73fd466390f471915937309 (release/2.5)
commit f16b4edabab1d24adfe3e8824d26f401f6afde6d (release/2.4)

Change travis build scripts to use https when fetching prerequisites.

Reported by "jub0bs" on hackerone.com (#1039504)
- **Report Triaged**
- **2020-11-25** @jub0bs: @cron2 I see that you made the required changes and that the build passed. Fast turnaround!

Is this report eligible for a bounty?
- **2020-11-25** @cron2: TBH, I have no idea how that bounty stuff works.  I do code :-)

But I intend to find out and let you know.
- **2020-11-25** @jub0bs: @cron2 Thanks! Keep me posted.
- **2020-12-01** @jub0bs: @cron2 Any update?
- **Bounty Awarded**
- **Report Resolved**
- **2020-12-03** @jub0bs: @matttock Thanks for the bounty! Stay safe.
- **2020-12-04** @jub0bs: Since @cron2 made a public reference to this report in [a commit message](https://github.com/OpenVPN/openvpn/commit/0d4069e41d3ba7178be30f78f1174f689dbdfa59) and nothing in here is confidential, I'm sure you'll have no objections to disclose this report.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
