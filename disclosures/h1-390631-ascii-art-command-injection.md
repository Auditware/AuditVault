---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-09-08
submitted: 2018-08-05T06:31:48.648Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "pontus_johnson"
source: "https://hackerone.com/reports/390631"
title: "[ascii-art] Command injection"
---
# [ascii-art] Command injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Node.js third-party modules | **Disclosed:** 2018-09-08

- Report: [https://hackerone.com/reports/390631](https://hackerone.com/reports/390631)
- CWE: Command Injection - Generic
- Submitted: 2018-08-05T06:31:48.648Z

## Report summary

vulnerable versions: < 1.4.4
patched versions: >= 1.4.4

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a command injection vulnerability in the **ascii-art npm** module.
It allows arbitrary shell command execution through a maliciously crafted command line argument.

# Module

**module name:** ascii-art
**version:** 1.4.3
**npm page:** `https://www.npmjs.com/package/ascii-art`

## Module Description

>Images, fonts, tables, ansi styles and compositing in Node.js & the browser. 100% JS.
>
>In the beginning there was colors.js but in the fine tradition of vendors calling out a problem they have the solution to, chalk was introduced. In that same vein, I offer ascii-art as an update, expansion and generalization of MooAsciiArt and at the same time it can replace your existing ansi colors library.
>
>It features support for Images, Styles, Tables and Figlet Fonts as well as handling multi-line joining automatically.

## Module Stats

56 downloads in the last day
217 downloads in the last week
1432 downloads in the last month

# Vulnerability

## Vulnerability Description

ascii-art does not sanitize the `target` command line argument, and subsequently passes it to `child_process.exec()`, thus allowing arbitrary shell command injection.

## Steps To Reproduce:

1. Install ascii-art: `sudo npm install -g ascii-art` (On a pristine Google Cloud instance, I also had to install pkg-config, libcairo2-dev, libjpeg-dev and libgif-dev, and then install ascii-art with unsafe-perm=true).
2. Run ascii-art with malicious argument: `ascii-art preview 'doom"; touch /tmp/malicious; echo "'`
3. Check that the injected command was executed: `ls /tmp/`

## Patch

Command execution happens [here](https://github.com/khrome/ascii-art/blob/9059daa5fcbf2c6a8813bbf072a1477d91e7b61d/bin/ascii-art#L210):

`exec('open "http://www.figlet.org/fontdb_example.cgi?font='+target.toLowerCase()+'.flf"')`

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
- **2018-08-05** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2018-08-06** @lirantal: Hi @douglas_hall,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **2018-08-06** @pontus_johnson: Thanks for your prompt response. Looking forward to resolving the issue.
- **2018-08-10** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository:  https://github.com/khrome/ascii-art/issues/12
- **2018-08-10** @pontus_johnson: Very good. Do you have a disclosure deadline policy, in case the maintainers remain silent?
- **2018-08-10** @lirantal: It's also mentioned on the program's page on H1 - 45 days.
- **2018-08-10** @pontus_johnson: Right. Thanks.
- **Report Severity Updated**
- **External User Joined**
- **2018-08-31** @khrome: Thanks for reporting this, I'll patch it over the weekend by validating `target` for legal characters and terminating with an error if invalid input is found.
- **2018-08-31** @lirantal: @khrome thanks, looking forward for the fix.
- **2018-09-05** @khrome: Hi there fix is in both github and npm. But when I did it I noticed that this is in no way a high security exploit. It requires you are either already on the shell you are "exploiting", have write access to a bash script the runs in a shell with the required privileges or you have a setup where you have write access to scripts that execute at higher privledges than the user. In either case it's far simpler to just directly run the command. Literally the only new surface this provides is if you do a command-line callout to this script from within a module (also without checking input). No Test, no Pull Request, and a false sense of urgency. Not what I expect from a reputable org.
- **2018-09-07** @lirantal: Hi @khrome,

We appreciate the effort to fix this and jumping on the conversation with us here to discuss and review.
I agree that if an attacker is already on the shell obviously there's no need to invoke the module to exploit it, but another attack vector is if indeed there was another module that was using yours then that could be exploitable. 

Regardless to the specific vulnerability here, we're hopeful that the community will also embrace secure coding conventions and a security-mindset as there are many other developers out there learning by looking at our code and we want to set proper examples.

I'm not sure what sense of urgency you felt was out of order but we'll be really happy to get any feedback from you on how to improve our processes and reach with maintainers. We are a small group of volunteers and aren't able to provide a fix for each vulnerability, apologies for that, and thanks for jumping in and providing the fix.


@douglas_hall can you please review the fix?
- **2018-09-07** @pontus_johnson: Hi @lirantal, @khrome,

The fix looks good. A regex check has been added which disallows unsafe characters.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
