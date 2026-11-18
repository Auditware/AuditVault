---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2018-04-04
submitted: 2018-02-25T19:14:42.891Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319593"
title: "`sshpk` is vulnerable to ReDoS when parsing crafted invalid public keys"
---
# `sshpk` is vulnerable to ReDoS when parsing crafted invalid public keys

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-04

- Report: [https://hackerone.com/reports/319593](https://hackerone.com/reports/319593)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-02-25T19:14:42.891Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a ReDoS in `sshpk`
It allows to cause Denial of Service by trying to parse a crafted public key.

# Module

**module name:** sshpk
**version:** 1.13.1
**npm page:** `https://www.npmjs.com/package/sshpk`

## Module Description

> Parse, convert, fingerprint and use SSH keys (both public and private) in pure node -- no ssh-keygen or other external dependencies.

## Module Stats

320 485 downloads in the last day
4 709 033 downloads in the last week
19 365 516 downloads in the last month

~232 386 192 estimated downloads per year

# Vulnerability

## Vulnerability Description

ReDoS.

- regex: /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([\n \t]+([^\n]+))?$/
- evil string: `ssh-rsa a${Array(200000).join(' ')}x\nx` (~200 KB, unwrap js template string)
- file: https://github.com/joyent/node-sshpk/blob/v1.13.1/lib/formats/ssh.js#L17

The testcase uses ~200 KB string to demonstrate long unavailability period, but parsing is also considerably slow on shorter strings.

## Steps To Reproduce:

```js
var keyPub = `ssh-rsa a${Array(200000).join(' ')}x\nx`;
var key = require('sshpk').parseKey(keyPub, 'ssh');
```

## Supporting Material/References:

- Arch Linux Current
- Node.js 9.5.0
- npm 5.6.0

# Wrap up

- I contacted the maintainer to let him know: N 
- I opened an issue in the related repository: N

## Impact

Cause denial of service by parsing a crafted public key file.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-02-26** @lirantal: Hi @chalker,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as vulnerability.
I will invite the package maintainer to this issue.
- **Changed Scope**
- **Report Severity Updated**
- **External User Joined**
- **2018-03-03** @lirantal: @davisjam did you contact the maintainers on this report?

I have invited them but no response so far and I want to file a generic security issue in the repo. Are you both ok with this?
- **2018-03-03** @chalker: @lirantal Afaik this one wasn't in @davisjam data, so I guess you shouldn't assume that the maintainers were contacted from his side.
- **2018-03-03** @davisjam: I did not report this myself. I think a generic issue should be OK.
- **2018-03-03** @chalker: @lirantal This looks to be a joyent-managed library, their security contact is security@joyent.com.
- **2018-03-03** @lirantal: Thanks. I reached out before to Cody Mello from joyent who has participated in this module, but will also send an e-mail to the security inbox.
- **External User Joined**
- **2018-03-09** @joysec: Sorry for the delay on this one. We've confirmed the report at our end and have started working on a fix. Thanks!
- **2018-03-10** @chalker: @joysec Here is an (untested) fix for you:

```diff
- var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([\n \t]+([^\n]+))?$/;
+ var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([\n \t]+([^\n \t][^\n]*))?$/;

- var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/ \t\n]+[=]*)(.*)$/;
+ var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/\n][a-zA-Z0-9+\/ \t\n]*[=]*)([^a-zA-Z0-9+\/ \t\n=].*|)$/;
```

It should produce the same results but removes ambiguity, and passes through the Weideman's toll check.
- **2018-03-10** @davisjam: @chalker Your regexes are safe according to Weideman and the other detectors.
- **2018-03-10** @lirantal: @davisjam will you be able to continue with publishing a version fix and let us know so we can close the disclose the report?
- **2018-03-10** @chalker: @lirantal I suppose you meant to ask @joysec?
- **2018-03-10** @lirantal: oh yes, my bad! didn't mean to ping Jamie :-)
thanks for catching it.
- **2018-03-12** @joysec: @chalker / @lirantal Do these proposed regexes look good to you? The ones you suggested don't quite work, but these pass all our tests (after one tiny change further down, since this does change the meaning of the first one a little):

```diff
 /*JSSTYLED*/
-var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)([\n \t]+([^\n]+))?$/;
+var SSHKEY_RE = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/]+[=]*)[\n \t]+()([^\n \t][^\n]*)?$/;
 /*JSSTYLED*/
-var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t]+([a-zA-Z0-9+\/ \t\n]+[=]*)(.*)$/;
+var SSHKEY_RE2 = /^([a-z0-9-]+)[ \t\n]+([a-zA-Z0-9+\/][a-zA-Z0-9+\/ \t\n=]*)([^a-zA-Z0-9+\/ \t\n=].*)?$/;
```

How do you want us to deal with committing the fix for this? Is it ok if I make an empty bug with a title like "performance issues parsing long SSH public keys" to use for it and fill in the details after disclosure?
- **2018-03-12** @chalker: @joysec Yeah, my second regex seems to have broken things.

Those in your patch seem safe, but the new `SSHKEY_RE2` seems to split `ssh-rsa AAAA=foo@example.org` differently than the old one.
- **2018-03-12** @lirantal: @joysec yes, that sounds good.
Once you release a fix we'll confirm it and then request a full public disclosure if that would be ok with you.
- **2018-03-12** @joysec: @chalker Yeah, it does, but the logic further down picks up the slack by realising that the key didn't use up all those bytes when it parsed it, and stuffs them back into the comment field later.

@lirantal Ok, I'll add another comment here when the release is out. Thanks!
- **2018-03-12** @davisjam: @joysec The new regexes are safe according to my analyses as well.
- **2018-03-13** @joysec: Release v1.14.1 of the module is on npm now (and tagged on github), with the fix in it. Ready for public disclosure.
- **2018-03-13** @lirantal: Thanks @joysec 
@chalker can you please confirm the fix is indeed working as expected with 1.14.1?
- **Report Resolved**
- **2018-03-19** @chalker: @lirantal I can confirm that the ReDoS issue is fixed, but I did not test the generic behaviour of sshpk itself.
CI should handle that.
- **2018-03-19** @lirantal: Thanks.
I'll proceed with a public disclosure once we have a CVE assigned.
- **2018-03-21** @chalker: @joysec On a side note, I just filed two unrelated pull requests to https://github.com/joyent/node-sshpk/pulls that fix issues of `sshpk` on current and next Node.js versions. Sorry for pinging here, but given the popularity of `sshpk` and the fact that it's used as a dependency of `npm`, I think that this is important.
- **Agreed On Going Public**
- **2018-04-04** @lirantal: @joysec, @chalker, since we have a known delay in CVE assignment, I will go ahead and proceed with a full public disclosure.
- **Manually Disclosed**
