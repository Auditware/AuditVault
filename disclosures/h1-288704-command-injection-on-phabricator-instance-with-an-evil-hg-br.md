---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2017-11-11
submitted: 2017-11-09T08:57:35.077Z
bounty_usd: null
votes: 41
cve: []
program: "[[programs/phabricator|Phabricator]]"
reporter: "criticalonly"
source: "https://hackerone.com/reports/288704"
title: "Command injection on Phabricator instance with an evil hg branch name"
---
# Command injection on Phabricator instance with an evil hg branch name

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 41 | **Program:** Phabricator | **Disclosed:** 2017-11-11

- Report: [https://hackerone.com/reports/288704](https://hackerone.com/reports/288704)
- CWE: Command Injection - Generic
- Submitted: 2017-11-09T08:57:35.077Z

## Timeline

- **Report Filed**
- **2017-11-09** @epriestley: I can reproduce the important part of this locally with Mercurial `4.4.1`.

Have you reported this to Mercurial, or do you believe Mercurial is already aware of it? I'd like to coordinate with the Mercurial upstream around this because they've previously considered similar issues to be security concerns (CVE-2017-9462, CVE-2017-1000116) and I think this is ultimately a Mercurial issue, not a Phabricator issue, although it's severe and we'll need to mitigate it.

If you haven't reported this to Mercurial yet I can report it on your behalf, but if you've already reported it, plan to report it, or believe someone else has already reported it it would be helpful to know about that.

(I'm going to get in touch with them regardless, because any fix will make will reveal the vulnerability.)
- **2017-11-09** @criticalonly: I think the hook usage in this place is a normal use for mercurial rather than a vulnerability.Application use hg command need to place any user applied input after "--" or use the sha value instead the string value.
I haven't reported this to them yet,cause i don't think this is on their side.The hook pre-log is designed to be executed before hg log command.
- **2017-11-09** @criticalonly: You can place the option --config=hooks.pre-[log|pull|update|cat|...etc] to the certain and it's a normal usage not like the one you point out in the comment.
- **2017-11-09** @criticalonly: Just like the git rebase command,if a filename called --exec=id and some application use this directly and inject to the git rebase command that will lead to command injection and this is totaly not the git's fault.
- **2017-11-09** @criticalonly: I already did some testing on phabricator and the filename always have a prefix "./" when executing command and the branch name in other place will force to convert to it's SHA value and your guys just missed this hg log scenario.
- **2017-11-09** @epriestley: I think Mercurial is in the wrong here, for two reasons.

First, its behavior is inconsistent with other software. Consider:

```
$ git rebase --onto '--exec=wget' master
fatal: Needed a single revision
Does not point to a valid commit: --exec=wget
```

Git interprets `--exec=wget` as the target for `--onto` because it immediately follows the `--onto` flag.

```
$ python -c -d 'print 1'
Traceback (most recent call last):
  File "<string>", line 1, in <module>
NameError: name 'd' is not defined
```

Python interprets `-d` as the command to execute with `-c`, not a flag, because it immediately follows the `-c` flag.

All software I'm familiar with works like this: if an `--argument` takes a parameter, that parameter is _always_ interpreted as the value for the argument, not a flag.

Second, it's impossible to escape this command safely. We can't add `--`:

```
$ hg log --b -- '--config=hooks.pre-log=wget' --rev x
hg log: option --branch requires argument
```

...and I believe it's unreasonable for Mercurial to take the position that callers must test and reject "unsafe" branch names before invoking commands.

That said, it's possible that Mercurial will not consider this to be a vulnerability.
- **2017-11-09** @epriestley: Here's the mail I sent Mercurial's security list:

---
To: security@mercurial-scm.org
Subject: Command Injection: hg log -b '--config=...' --rev x

Mercurial interprets the branch name "--config=..." as a "--config" flag in this command:

	$ hg log -b '--config=hooks.pre-log=wget' --rev x
	wget: missing URL
	Usage: wget [OPTION]... [URL]...

	Try `wget --help' for more options.
	abort: pre-log hook exited with status 1

This reproduces for me in Mercurial 4.4.1, and appears to impact some larger number of flags (perhaps all flags which take arguments?) provided that the flag is not the last argument in the command. For example, I can `hg log --rev '--config=...' -b x` instead.

This may represent a security vulnerability if software invokes this command or other similar commands with user input, even when that input is properly escaped (above, the "--config" flag has been properly escaped for the shell).

I learned of this because I received a vulnerability report for some software I help maintain ("Phabricator") via HackerOne earlier this morning, so credit tentatively goes to Tianqi Zhang (pnig0s) on that platform. (I've asked him for more information about how he discovered this, since I'm not sure if he's the original researcher or not.)

The impact on Phabricator is critical (remote code execution) so we need to respond to this regardless of what Mercurial does with it. This issue may already be known, but our fix will disclose the nature of the issue so I wanted to coordinate with the Mercurial upstream in case this is something you also consider significant.

In my assessment, this is generally similar in nature to CVE-2017-9462 and CVE-2017-1000116.

If Mercurial does not consider this to be a security issue, we'll fix this and disclose it (by nature of the changelog and repository being open source) today, probably via kludgy blacklisting. We're happy to wait if you want to take action here and coordinate releases on a different timeline, though.

(I don't plan to allocate a CVE identifier since this isn't my discovery and I'm not sure if Mercurial considers it a vulnerability.)

Thanks,
Evan
- **2017-11-09** @criticalonly: Alright i'll wait for the reply from mercurial but i think the good practice is just use the SHA value instead of the string value supplied by user.
- **2017-11-09** @epriestley: I'm going to wait for a response from the Mercurial upstream.

If they don't consider this to be a vulnerability in Mercurial, we'll patch, release, and disclose it ASAP (probably today if they get back to us in the next few hours), since this has a major security impact on Phabricator.

If they do consider it to be a vulnerability, we'll work with them to figure out a release/disclosure timeline, since our fix will necessarily reveal the nature of the vulnerability.

If I don't hear back from them in ~36 hours we'll probably move forward with this without their involvement, but we'll see.
- **2017-11-09** @epriestley: > Alright i'll wait for the reply from mercurial but i think the good practice is just use the SHA value instead of the string value supplied by user.

In the general case, this isn't possible. Not all parameters have SHA equivalents, and I think `hg log -b default` can not be equivalent to `hg log -b <any hash>` because `default` may have multiple open branch heads which are not mutual ancestors.
- **2017-11-09** @criticalonly: Well i think you can just make the "default" a fix string in the hg command when it need to be used rather than use this from user supplied like other customed branches.I also tested similar issue on other applications that support mercurial and most of them force using SHA value,fix the "default" branch name or put "--" before user applied value.I think combine above three methods can fix these kind of issue.
- **2017-11-09** @epriestley: This definitely can not be fixed by making "default" a hard-coded string, using "--", or converting branch names into SHA values. Those workarounds either do not work or change the meaning of the command. 

Also note that `--config=hooks.pre-log=wget` is a perfectly valid Mercurial branch name:

```
$ hg branch -- '--config=hooks.pre-log=wget'
marked working directory as branch --config=hooks.pre-log=wget
```

```
$ hg heads
changeset:   21:60e36457f9cd
branch:      --config=hooks.pre-log=wget
tag:         tip
user:        Evan Priestley <hg@yghe.net>
date:        Thu Nov 09 06:34:45 2017 -0800
```

It can be *worked around* by using revset syntax so that we don't specify any additional parameters, but this is not robust or general.

I'm also not convinced that this is the only vulnerable command. Even if it is, we need to put a fix in place not only for existing commands, but also for possible future commands, so we don't turn around and introduce another vulnerable command in the future.
- **2017-11-09** @criticalonly: How about using "hg log --branch=--config=hooks.pre-log=wget" as long as the beginning of the value is not "-" or "--" the option won't work any more.

```
# hg log --branch=--config=hooks.pre-log=wget
changeset:   71:84e8c5feb4fa
branch:      --config=hooks.pre-log=wget
parent:      68:90b627c305ef
user:        pwn2own <pnigos@live.com>
date:        Thu Nov 09 07:45:15 2017 +0000
summary:     Created new branch --config=hooks.pre-log=wget
```
- **2017-11-09** @criticalonly: I think the goal of the hook feature is designed to be executed as a high priority than other command options so that there're pre-command,post-command and fail-command kind of hooks here.Also the --config is a global hg option and not for some certain sub-command.
- **2017-11-09** @epriestley: Mercurial security replied, and said that they expect to respond today or tomorrow.

(The upstream task for this is <https://secure.phabricator.com/T13012>, although it's not currently public.)

We tentatively have a patch ready for this when Mercurial makes a decision.
- **2017-11-09** @criticalonly: Mercurial had already mentioned the risk about this kind issue in https://www.mercurial-scm.org/repo/hg/rev/77eaf9539499
```
We're not currently hardening any subcommands other than 'serve'. If
your service exposes other commands to users with arbitrary repository
names, it is imperative that you defend against repository names of
'--debugger' and anything starting with '--config'.
```
- **2017-11-09** @epriestley: I think Mercurial's behavior is *clearly* wrong. Consider this:

```
$ hg grep -- --debugger
entering debugger - type c to continue starting hg or h for help
...
```

They may choose not to fix it, but the magical, nonstandard, dangerous behavior of the `--config` and `--debugger` flags is clearly a problem with Mercurial and their "messy implementation of argument parsing", not a reasonable caveat which implementors building on top of `hg` should be expected to anticipate.
- **2017-11-09** @criticalonly: I just think mercurial can't be totally blamed by this.Application using mercurial do have ways to mitigate this kind risk.This is not a directly vulnerability like the serve sub-command.It's just some kind dangerous feature that other developer should be careful with.And directly using user input as the option of command is definely not a safe and good practice.Today is mercurial,maybe there's other application have these kind features,you can't blame them all.Other application support mercurial like Bitbucket not affected by this issue at all.Maybe mercurial will hardern this or maybe not.But the responsibility from phabricator side still can't be ignored.
- **2017-11-09** @criticalonly: You can't make every application you execute with all safe,so the key point here is how to safely invoke them to mitigate the risk.
- **2017-11-09** @amckinley: I believe Evan's point is that Mercurial's approach makes it *very* difficult to safely invoke the `hg` binary. We'll definitely work around this issue in Phabricator if Mercurial decides not to fix it, but I agree with Evan that this would be much better fixed in the upstream. There's nothing to prevent Mercurial from adding additional `--do-something-dangerous` flags forever that we'll need to explicitly check for in our code.
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2017-11-11** @criticalonly: BTW:How can i track the details of the mitigation from mercurial side?
- **2017-11-11** @epriestley: I'm not sure, I don't have any more information than what I posted in <https://secure.phabricator.com/T13012>.
