---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - vuln/command-injection
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2019-09-26
submitted: 2017-12-01T03:32:27.925Z
bounty_usd: null
votes: 9
cve: "CVE-2017-17458"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "criticalonly"
source: "https://hackerone.com/reports/294147"
title: "Mercurial git subrepo lead to arbritary command injection"
---
# Mercurial git subrepo lead to arbritary command injection

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-26

- Report: [https://hackerone.com/reports/294147](https://hackerone.com/reports/294147)
- CWE: Command Injection - Generic | CVE: CVE-2017-17458
- Submitted: 2017-12-01T03:32:27.925Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi IBB,

I'd like to submit a issue exist in Mercurial.
```
It is possible that a specially malformed repository can cause Git subrepositories to run arbitrary code in 
the form of a .git/hooks/post-update script checked in to the repository in Mercurial 4.4 and earlier. 
Typical use of Mercurial prevents construction of such repositories, but they can be created 
programmatically.
```
Further details of my original report can be found at:
https://bz.mercurial-scm.org/show_bug.cgi?id=5730

And the Mercurial security advisory
https://www.mercurial-scm.org/wiki/WhatsNew#Mercurial_4.4.1_.282017-11-07.29

Thanks,
Terry

## Impact

A crafted mercurial repo with an evil git subrepo can lead to execute arbritary command on user's OS. And other web applications or clients support mercurial repo management or invoke hg related command also have a risk affected by this vulnerability.

## Timeline

- **Report Filed**
- **2017-12-06** @criticalonly: Hi,
Any update for this report?
Thanks!
- **2017-12-09** @criticalonly: Update the CVE ID of this issue: CVE-2017-17458
- **Cve Id Added**
- **Not Eligible For Bounty**
- **Report Resolved**
- **2017-12-12** @criticalonly: Hi,
The Phabricator's issue is not the same one to this at all.
This one is a confirmed vulnerability from mercurial and can exploit using a crafted mercurial repo with a evil git subrepo.Phabricator not affected by this issue.

And the Phabricator issue i reported is not a vulnerability from mercurial side.
Just because phabricator not check the filename properly and i can inject hg command option by named a filename to sth like --config=pre-cat=curl.

Please check the details i provide,it's not the same issue at all.
Thanks!
- **Report Reopened**
- **2017-12-12** @criticalonly: In this bug report an attacker can exploit the bug through a crafted hg repo with a git submodule and let some applications commit the .git folder into mercurial's version control.And the attacker can modify the .git/config adding sth evil like
```
[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
    ignorecase = true
    precomposeunicode = true
[remote "pwn2own"]
    url = ext::whoami
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
    remote = origin
    merge = refs/heads/master
[protocol]
    allow = always
```
After victim clone the crafted hg repo which contain the evil git submodule,when victim fetch,push or did any thing on the evil submodule,our command will be executed through the ext helper.
As Phabricator doesn't provide such feature,it's not affected by this issue.

Thanks.
- **2017-12-18** @criticalonly: Any update for this report?
Thanks!
- **2018-01-09** @criticalonly: Hi,
This issue has pending from 2017 to 2018,any update about this issue?
Or any other information i need to provide?
Why this simple issue took so long to review.
Your guys just close and repopen and then pending till now...
Thanks!
- **Hacker Requested Mediation**
- **2018-04-12** @thefrog: Hi @pnig0s,

Apologies for the delay. We are still looking into this report and will update you when we have additional information to share. Thank you for your patience!

\- @thefrog
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
