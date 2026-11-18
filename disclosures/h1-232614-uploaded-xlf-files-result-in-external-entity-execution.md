---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2017-06-02
submitted: 2017-05-28T11:12:25.002Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/weblate|Weblate]]"
reporter: "4cad"
source: "https://hackerone.com/reports/232614"
title: "Uploaded XLF files result in External Entity Execution"
---
# Uploaded XLF files result in External Entity Execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Weblate | **Disclosed:** 2017-06-02

- Report: [https://hackerone.com/reports/232614](https://hackerone.com/reports/232614)
- CWE: XML External Entities (XXE)
- Submitted: 2017-05-28T11:12:25.002Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary:
========
 Weblate users in the Translate group (or those with the ability to upload translation files) can trigger XML External Entity Execution. This is a well known and high/critical vector of attack that often can completely compromise the security of a web application or in some cases lead to Remote Code Execution (although I do not expect it to be an easy RCE in this case).

Description:
========
The XML External Entity Execution allows for arbitrary reading of files on the server using a relatively obscure aspect of the XML language. It is generally considered high or critical severity, most notably Google places it at the same severity as remote code execution because of the potential for Server-Side Request Forgery, Remote Code Exection, and arbitrary File Read.

The mitigating factors here for you are that some account priveleges are required to upload tranlation files, although by default this gets rolled into the @Translate group. Also because your web server is python based it is not vulnerable to the trivial RCE that PHP servers are commonly vulnerable to.

The core of the vulnerability is in how the translate-toolkit processes .XLF files. The XLIFF standard is XML based, and thus supports by default standard XML functionality including external entity execution.

In my proof of concept, I dowloaded as .XLF the translations of the "hello" project which is being pointed to by my local Weblate instance. A minor modification shown in the steps below results in the /etc/passwd file out through the UI for review as a translation, although much worse things can be done - this is just to prove the vulnerability exists. For more details search for "XML External Entity Exploit"

See the attached screenshots and exploit XML file for evidence of the vulnerability.

Version:
========

I tested this against the latest stable source available a couple fo days ago (~May 26) running "Weblate 2.15-dev"

Steps to Reproduce
========
(I have included a live exploit testproject-testcomponent-en_GB.xlf that works with the "hello" data backing the demo website.)

* Log in as a user that has permission to upload translation files.
* Go to a component, and download its translations as XLF
* Add the following two lines after the "<?xml" tag, and replace one of the translation texts with "&xxe;" :

```
<!DOCTYPE foo [ <!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "file:///etc/passwd" >]>
```
* Upload the file back to the server
* Observe the contents of the passwd file as a translation

## Timeline

- **Report Filed**
- **2017-05-28** @4cad: I have not been able to get it to make a HTTP request, so it seems likely to me that this attack is limited to reading arbitrary files on the filesystem - which is a mitigating factor.

I have not actually tested the file formats, but from reading through the translate-toolkit supported formats list I suspect that .NET Resource Files (.resx) and Android String Resource files may be similarly vulnerable since they are also XML based.
- **2017-05-29** @4cad: Just an FYI it looks like HackerOne changes the file extension of the malicious upload from "xlf" to "xml" when you download it, so you have to change it back to ".xlf" before uploading it in order for it to work.

Also, by putting the external entity into an XML attribute I can covertly check whether or not a file path is valid without leaving a trace in a translation project because the upload fails but the error message is different depending on whether or not the path can be read.
- **Report Triaged**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
