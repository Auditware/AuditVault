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
date: 2018-03-01
submitted: 2018-01-25T19:45:34.645Z
bounty_usd: null
votes: 9
cve: "CVE-2018-3713"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bl4de"
source: "https://hackerone.com/reports/309120"
title: "[angular-http-server] Path Traversal in angular-http-server.js allows to read arbitrary file from the remote server"
---
# [angular-http-server] Path Traversal in angular-http-server.js allows to read arbitrary file from the remote server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-01

- Report: [https://hackerone.com/reports/309120](https://hackerone.com/reports/309120)
- CWE: Path Traversal | CVE: CVE-2018-3713
- Submitted: 2018-01-25T19:45:34.645Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **Changed Scope**
- **Cve Id Added**
- **2018-01-26** @bl4de: Hi @lirantal ,

Thank you for verifying my report.

I haven't contacted project maintainer as my intention was to keep the whole process consistent through the program. Also I didn't want to open issue on its GitHub repository to not cause any security issues to this module users before it will be fixed and patch will be available.

Regards,
bl4de
- **2018-01-26** @lirantal: Yep, no worries @bl4de.
I already invited the author on both of the tickets I'm handling for you (this and 309124). It's part of our process to check if you reached out already and we'll probably ask you the same in future tickets. Apologies if it's a bit robotic of us :-)
- **2018-01-26** @bl4de: Hi @lirantal ,

Yeah, I am familiar with this process as I've already opened other reports, so no worries :)
- **2018-01-26** @lirantal: I think you're our rising hacker star on the node ecosystem :D
appreciate all the effort and responsibility you're putting into it, keep it up!
- **2018-01-26** @bl4de: Ha ha, I am as far from being a hacker star as it's probably possible :D 
But thank you for the kind words :)

But yeah, I am going to spend some time here for sure. As full time webdev, I use Node and npm packages a lot, so it's great opportunity to give back to community :)
- **2018-01-26** @lirantal: 😉
- **External User Joined**
- **2018-01-27** @hotbelgo: Your email cam out of the blue, but the information in it is most welcome. I've posted a patch - 1.4.3 - let me know if you think this is enough. Basically I'm blocking any url that contains `..`
- **2018-01-27** @bl4de: Hi @hotbelgo,

Seems to be fixed, I can't reproduce the issue now :)
Good job!

Regards,

bl4de
- **2018-01-27** @lirantal: Great and fast response @hotbelgo!

@bl4de, @hotbelgo, would you like to go ahead and disclose the vulnerability publicly or would you want to wait it out a bit? Also, let me know if you don't want me to do a full disclosure of the report.
- **Report Severity Updated**
- **2018-01-27** @bl4de: @lirantal , @hotbelgo 

No problem with public disclosure from my side :)
- **2018-01-30** @lirantal: @hotbelgo are you ok with a full public disclosure for this report? we'll publicly disclose it within 45 days since it was triaged per the policy (https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)
- **2018-01-30** @hotbelgo: Sure, do whatever you think is appropriate
- **2018-01-30** @lirantal: Super.
Thank you both for co-ordinating on this!
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Became Public**
