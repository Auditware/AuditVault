---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-07-03
submitted: 2020-04-06T22:23:13.722Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/concretecms|Concrete CMS]]"
reporter: "mayllart"
source: "https://hackerone.com/reports/841947"
title: "Remote Code Execution through Extension Bypass on Log Functionality"
---
# Remote Code Execution through Extension Bypass on Log Functionality

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Concrete CMS | **Disclosed:** 2020-07-03

- Report: [https://hackerone.com/reports/841947](https://hackerone.com/reports/841947)
- CWE: Code Injection
- Submitted: 2020-04-06T22:23:13.722Z

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-09** @mayllart: Thank you very much @korvin !!

I'll be waiting for further information!

Regards,

Mayllart
- **Report Severity Updated**
- **2020-04-16** @mayllart: Hello everyone!

Any news regarding this vulnerability?

Regards,

Thiago Mayllart
- **2020-05-06** @korvin: Hi @mayllart,
I've opened a pull request with the following commit:
https://github.com/concrete5/concrete5/pull/8623/commits/bf5402725f3001e0c37a0f471770f44f386bf57c

Do you mind testing this and making sure that it adequately resolves the issue?

Thanks!
Korvin
- **2020-05-09** @mayllart: Hello @korvin !

Thank you for your reply! And sure,  I’ll be testing it and will get back to you  pretty soon!

Thanks!!
- **2020-05-11** @mayllart: Hello @korvin,

I 've just tested the application with the pull request and issue is fixed! However, the line 86 can be bypassed:           ` if (pathinfo($logFile, PATHINFO_EXTENSION) !== 'log') { `

I was testing the application with php-7.3 and the function pathinfo is vulnerable to nullbyte injection. It means that this function is failing to validate log files containing nullbytes: /{INSTALLATION_PATH}/concrete5/testing.php%00.log. This function interprets the nullbyte and removes everything after it, allowing it to be bypassed.

Thankfully, the function "file_exists" (line 91) ends up verifying the $logFile and then, throws an error. The function "file_exists" was vulnerable in the past due to nullbyte injection, but it doesn't seem to exploitable anymore (https://bugs.php.net/bug.php?id=39863)

Thank you very much!!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
