---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-08-19
submitted: 2018-07-31T13:54:26.547Z
bounty_usd: null
votes: 7
cve: "CVE-2018-3786"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "pontus_johnson"
source: "https://hackerone.com/reports/388936"
title: "[egg-scripts] Command injection"
---
# [egg-scripts] Command injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-19

- Report: [https://hackerone.com/reports/388936](https://hackerone.com/reports/388936)
- CWE: Command Injection - Generic | CVE: CVE-2018-3786
- Submitted: 2018-07-31T13:54:26.547Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a command injection vulnerability in egg-scripts.
It allows arbitrary shell command execution through a maliciously crafted command line argument.

# Module

**module name:** [egg-scripts]
**version:** [2.6.0]
**npm page:** `https://www.npmjs.com/package/egg-scripts`

## Module Description

"deploy tool for egg project."

## Module Stats

Replace stats below with numbers from npm’s module page:

209 downloads in the last day
1,958 downloads in the last week
8,333 downloads in the last month

# Vulnerability

## Vulnerability Description

egg-script does not sanitize the --stderr command line argument, and subsequently passes it to child_process.exec(), thus allowing arbitrary shell command injection.

## Steps To Reproduce:

1. Install egg: `npm i egg --save`
2. Install egg-scripts: `sudo npm i egg-scripts -g --save`
3. Run eggctl with malicious argument: `eggctl start --daemon --stderr=/tmp/eggctl_stderr.log; touch /tmp/malicious`
4. Check that the injected command was executed: `ls /tmp/`
5. Stop eggctl: `eggctl stop`

## Patch

Command execution happens [here](https://github.com/eggjs/egg-scripts/blob/22faa4cfbb84cc5bc819d981dce962d8f95f8357/lib/cmd/start.js#L214):
```
const [ stdout ] = yield exec('tail -n 100 ' + stderr);
```
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
- **2018-07-31** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-31** @lirantal: Hi @douglas_hall, 

Thanks a lot for reporting the vulnerability.
I will take a look at your report and triage it shortly!
- **Report Triaged**
- **2018-07-31** @pontus_johnson: A correction: Step 3 in "Steps to Reproduce" should be 
Run eggctl with malicious argument: `eggctl start --daemon --stderr='/tmp/eggctl_stderr.log; touch /tmp/malicious'`.
- **2018-07-31** @lirantal: Yep, that's correct. Otherwise it's just interpreted by the shell as a new command.
I was indeed able to easily reproduce and will hope the package maintainer can join soon and discuss with us a fix.
- **2018-07-31** @pontus_johnson: Great. Thanks.
- **External User Joined**
- **2018-08-10** @lirantal: @popomore can you please review @douglas_hall's report and discuss a fix?
- **2018-08-18** @lirantal: Due to inactivity from the maintainer I wanted to opened an issue in the repository but unfortunately that feature is not enabled for the repository. 

- @popomore another ping.
- Also invited fengmk2@gmail.com
- **External User Joined**
- **2018-08-19** @fengmk2: Thanks for the security report! I will fix it as soon as possible.
- **2018-08-19** @fengmk2: https://github.com/eggjs/egg-scripts/pull/26 wil be fixed by this pull request.
- **2018-08-19** @pontus_johnson: Hi @fengmk2,

That fix looks fine to me. Nice job!
- **2018-08-19** @lirantal: Great.
I'll proceed with a full public disclosure of the vulnerability then. Let me know if you prefer otherwise.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-08-19** @fengmk2: Thanks again @lirantal @douglas_hall
- **Changed Scope**
- **2018-08-19** @lirantal: @fengmk2 sure thing! thanks for collaborating with us on this and for the prompt fix.
- **2018-08-19** @pontus_johnson: @lirantal @fengmk2: Thanks both!
