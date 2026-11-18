---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-03-20
submitted: 2020-04-04T13:04:40.446Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "xlife"
source: "https://hackerone.com/reports/838817"
title: "Insecure crossdomain.xml on https://vdc.mtnonline.com/"
---
# Insecure crossdomain.xml on https://vdc.mtnonline.com/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** MTN Group | **Disclosed:** 2022-03-20

- Report: [https://hackerone.com/reports/838817](https://hackerone.com/reports/838817)
- CWE: Information Disclosure
- Submitted: 2020-04-04T13:04:40.446Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

https://vdc.mtnonline.com/crossdomain.xml contains the following xml file:

```

<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
	<cross-domain-policy>    
	<site-control permitted-cross-domain-policies="all"/>    
	<allow-access-from domain="*"  secure="false" to-ports="*"/>
	<allow-http-request-headers-from domain="*" headers="*"/> 
	</cross-domain-policy>

```

## Impact

This will make any one able to receive content from https://vdc.mtnonline.com/ , attacker can steal CSRF tokens and user PII.

More information about this issue is available here:

https://medium.com/@x41x41x41/exploiting-crossdomain-xml-missconfigurations-3c8d407d05a8

Best regards,
Vishu10x00 ❤️

## Timeline

- **Report Filed**
- **2020-04-04** @xlife: The ==secure="false"== part of the crossdomain.xml file allows Flash files to communicate cross-domain in HTTP, that compromise the security offered by HTTPS, to be more clear.

After this #105463 bug report, imgur implemented a fix by removing  secure="false" (it's a simple spell but quite unbreakable).


Visit this URL:

```
http://api.imgur.com/crossdomain.xml
```

Now this one:

```
https://api.imgur.com/crossdomain.xml
```

##Difference:

When we visit via http it generates this error:

=={"data":{"error":"HTTP Access is disabled. Requests must use SSL (HTTPS)."},"success":false,"status":400}==

{F773302}

## Impact

the ==secure="false"== part of the crossdomain.xml file allows Flash files to communicate cross-domain in HTTP, that compromise the security offered by HTTPS, If a user were to visit this page from a public or shared network (eg, starbucks, airport, library, etc) This would allow the attacker complete access to the user's PII.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
