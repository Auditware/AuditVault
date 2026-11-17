---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2022-05-13
submitted: 2022-05-12T06:20:27.886Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/curl|curl]]"
reporter: "iylz"
source: "https://hackerone.com/reports/1566462"
title: "error parse uri path in curl"
---
# error parse uri path in curl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** curl | **Disclosed:** 2022-05-13

- Report: [https://hackerone.com/reports/1566462](https://hackerone.com/reports/1566462)
- CWE: Improper Access Control - Generic
- Submitted: 2022-05-12T06:20:27.886Z

## Timeline

- **Report Filed**
- **2022-05-12** @bagder: This is the "globbing" support curl has and that is prominently documented. You should switch it off if you want to run curl without it. I cannot see how this is a security problem unless you let the user run the full command line themselves, and then you ask for this?
- **2022-05-12** @iylz: As I say, I think this questions can bypass the security filter like the SSRF/RFL/LFI . For example, bypass  file protocol  black list or scan ports. I think should default off about this support consider updating it for security reasons. Thinks
- **2022-05-12** @bagder: That would be a terribly broken filter and the problem would be there, not in curl. curl is just a tool with a (documented) globbing feature.

If you could enable it with an option, then wouldn't the "bypass" still exist?

Sorry, but I cannot agree that this is security problem in curl.
- **2022-05-12** @iylz: In detail, 
When I in order to prevent arbitrary file reading vulnerability in the program. The URL loaded is usually restricted to the file protocol. This limitation can be bypassed through this curl problem. 

I agree with you, this problem is caused by the lax source program security policy. But I still think this is security problem in curl. The description of the problem hazard is incorrect and this is a low security problem ?
- **2022-05-12** @iylz: After testing, I found the wget does not have the same problem.
- **2022-05-12** @bagder: 1. This is not a *problem* in curl, it is a feature. And there are many tools without this feature, wget is only one. You can find many more.
2. This is not a security problem in curl. If this causes security problems, then the filter or whatever you are using is stupid and bad. 
3. You can even accomplish something similar using the globbing support of many shells: "curl fil{a,c,d,e}:///etc/passwd" in bash for example, does not rely on curl's own globbing and thus works with any tool

Again: no, this is not a curl security problem.
- **2022-05-12** @iylz: Unfortunately, thank you for your help.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2022-05-12** @iylz: I found this problem in the https://github.com/curl/curl/blob/master/src/tool_urlglob.c file of the glob_range function , It seems to have nothing to do with other tools like bash shell
- **Cancelled Disclosure Request**
- **2022-05-12** @bagder: What has been explained in this report is not a curl security problem.
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Manually Disclosed**
