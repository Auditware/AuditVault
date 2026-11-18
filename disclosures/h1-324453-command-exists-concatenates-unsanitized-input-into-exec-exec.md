---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-05-11
submitted: 2018-03-11T17:01:51.059Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/324453"
title: "`command-exists` concatenates unsanitized input into exec()/execSync() commands"
---
# `command-exists` concatenates unsanitized input into exec()/execSync() commands

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2018-05-11

- Report: [https://hackerone.com/reports/324453](https://hackerone.com/reports/324453)
- CWE: Command Injection - Generic
- Submitted: 2018-03-11T17:01:51.059Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report command injection in `command-exists`.
It allows to inject and execute arbitrary shell commands while trying to determine if a crafted command exists.

# Module

**module name:** `command-exists`
**version:** 1.2.2
**npm page:** `https://www.npmjs.com/package/command-exists`

## Module Description

> node module to check if a command-line command exists

## Module Stats

5 480 downloads in the last day
74 405 downloads in the last week
294 869 downloads in the last month

# Vulnerability

## Vulnerability Description

`commandName` argument is not properly escaped before being concatenated into the command that is passed to `exec()`/`execSync()`.

See https://github.com/mathisonian/command-exists/blob/v1.2.2/lib/command-exists.js#L49-L94

## Steps To Reproduce:

```js
const commandExists = require('command-exists');
commandExists.sync('ls; touch /tmp/foo0');
commandExists('ls; touch /tmp/foo1');
```

Observe `/tmp/foo0` and `/tmp/foo1` being created.

## Supporting Material/References:

- Arch Linux current
- Node.js 9.7.1
- npm 5.7.1

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

For setups where unsanitized user input could end up in `command-exists` argument, users would be able to execute arbitrary shell commands.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-12** @lirantal: Hi,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **External User Joined**
- **2018-04-12** @mathisonian: Hi, thanks for reporting this. I will work on a patch.
- **2018-04-12** @mathisonian: Patch is released, thanks.
- **2018-04-13** @lirantal: @mathisonian thanks for joining the conversation, appreciate it!
if all is well, I will proceed with a full public disclosure right after we verify unless you tell me otherwise.

@chalker can you confirm the patch please?
- **2018-04-13** @chalker: Kinda works, but I'm not sure yet. The wrapped argument could be split into several ones and lets flags through, for example (e.g. `-flag foo`). Not sure how bad that is, will take a look later. Probably fine.
- **2018-04-13** @chalker: On a side note, it functions incorrectly:
```js
> ce.sync('ls')
true
> ce.sync('foo ls')
true
> ce.sync('foo')
false
> ce.sync('node_modules')
true
```
That's not a security issue, though.

Re: flags — I will take a look tomorrow, I guess.
- **2018-04-13** @mathisonian: Thanks @chalker for reporting and testing help, and @lirantal for organizing the issue. I'll be adding more tests today to address any edge cases that have been introduced via the patch. Public disclosure after @chalker confirms the patch is fine with me.
- **2018-04-24** @lirantal: @mathisonian seems like we're still waiting for your input on a new version to check... ?
- **2018-04-25** @mathisonian: The latest version on npm has the patches applied. Apologies for not explicitly updating here.
- **2018-04-25** @mathisonian: And the older versions have been marked as deprecated due to security issues.
- **2018-04-25** @lirantal: @mathisonian thanks!

@chalker can you please test latest version and confirm the fix?
- **2018-05-11** @lirantal: @chalker ping
- **2018-05-11** @chalker: I still don't like how it lets flags through: `require('command-exists').sync('-v')` (on Unix returns `true`),
but I guess it's probably fine from the security point of view (though I suggest fixing it to be sure).

So yes, I think we could count that as fixed and we can disclose.
- **2018-05-11** @lirantal: Thanks, disclosing.
- **Report Resolved**
- **Report Severity Updated**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
