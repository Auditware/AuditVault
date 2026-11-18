---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
  - vuln/code-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-09-02
submitted: 2018-08-13T17:51:39.108Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "pontus_johnson"
source: "https://hackerone.com/reports/394294"
title: "[samsung-remote] Command injection"
---
# [samsung-remote] Command injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-02

- Report: [https://hackerone.com/reports/394294](https://hackerone.com/reports/394294)
- CWE: Command Injection - Generic
- Submitted: 2018-08-13T17:51:39.108Z

## Report summary

vulnerable_version: <1.3.5
patched_version: >=1.3.5

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a command injection vulnerability in the **samsung-remote** npm module.
It allows arbitrary shell command execution through a maliciously crafted argument.

# Module

**module name:** samsung-remote
**version:** 1.2.5
**npm page:** `https://www.npmjs.com/package/samsung-remote`

## Module Description

>Module for integration of Samsung SmartTV with your NodeJS application. Tested with Samsung D6000 TV.
>Inspired by this topic http://forum.samygo.tv/viewtopic.php?f=12&t=1792

## Module Stats

24 downloads in the last day
217 downloads in the last week
1024 downloads in the last month

# Vulnerability

## Vulnerability Description

samsung-remote does not sanitize the IP address argument, and subsequently passes it to child_process.exec(), thus allowing arbitrary shell command injection. It is not unlikely that some systems using this package will pass a user-controlled IP address to the function, thus inadvertently allowing arbitrary code execution by the user.

## Steps To Reproduce:

1. Install samsung-remote: `npm install samsung-remote --save`.
2. Create the following `index.js`file:

```
var remote = new SamsungRemote({
    ip: '127.0.0.1; touch /tmp/malicious;' 
});

remote.isAlive(function(err) {});
```
3. Execute `node index.js`
4. Check that the injected command was executed: `ls /tmp/`

## Patch

Command execution happens [here](https://github.com/natalan/samsung-remote/blob/bf7e68d78dddfb534d7ef6c501d0af5e4d32e788/lib/samsung-remote.js#L103):

`return exec("ping -c 1 " + config.ip, function (error, stdout, stderr) {`

`exec` could be replaced by `execFile`, which would force developers to separate the command and its arguments.

## Supporting Material/References:

- Operating system: Debian GNU/Linux 9.5 (stretch)
- Node.js v8.11.3
- npm v5.6.0

# Wrap up


- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

Arbitrary shell command execution.

## Timeline

- **Report Filed**
- **2018-08-13** @dukefleed: Hello @douglas_hall ,

Thank you for the report. We are currently reviewing this and will get in touch with you once our review is complete.

Kind regards,
@dukefleed
- **Report Triaged**
- **Changed Scope**
- **Report Severity Updated**
- **2018-09-01** @lirantal: Hi @douglas_hall,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **External User Joined**
- **2018-09-02** @natalan: Thanks for reporting. This issue is fixed in samsung-remote@1.3.5
- **2018-09-02** @lirantal: Thanks @natalan 
@douglas_hall can you please confirm?
- **2018-09-02** @pontus_johnson: Hi @lirantal, @natalan,

I think the fix looks good. The IP address argument is now sanitized using the module `is-ip`.
- **2018-09-02** @lirantal: Great.
Thank you both for the quick turnaround here!

I'll go ahead with a full public disclosure and request a CVE.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
