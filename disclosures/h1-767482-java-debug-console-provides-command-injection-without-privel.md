---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/java
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2020-07-23
submitted: 2020-01-03T05:59:05.336Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "rpbeast33"
source: "https://hackerone.com/reports/767482"
title: "Java Debug Console Provides Command Injection Without Privellage Esclation"
---
# Java Debug Console Provides Command Injection Without Privellage Esclation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** MTN Group | **Disclosed:** 2020-07-23

- Report: [https://hackerone.com/reports/767482](https://hackerone.com/reports/767482)
- CWE: Code Injection
- Submitted: 2020-01-03T05:59:05.336Z

## Report summary

Arbitrary Java code could be executed inside a container on the server for debug purposes. However due to improper sandboxing an attacker could create a new .jsp file that would be served under the web servers temp folder. This attacker controlled file could then execute native java code with the permissions of the Web Servers ```uid```. 

The debug console was designed to insert an admins/users code within a ```.jsp``` file ```<% %>``` tags which would allow very limited code to be executed. Due to no filtering of user input, an attacker could close the intial ```<%``` tag and thus have full control over the .jsp file, including importing ```java classes```. The attack logically worked similar to an ```XSS``` attack where an attacker would close a HTML tag and insert their own. However, due the ability to have ```.jsp``` files include ```java``` code and execute on the server on load this attack is quite critical.  Overall this led to a situation where an attacker could have command injection on the server and could spawn a reverse shell, read local files, or other nefarious attacks. 

The below PoC was used to demonstrate reading local files on the server: 

```Java
out.print("LOCAL FILE DATA");
out.print(":");%>
<%@ page import="java.util.Random"%>
<%@ page import="java.io.*"%>
<%
out.println("\n");
File file = new File("/etc/mime.types");
BufferedReader br = new BufferedReader(new FileReader(file));
String st;
while ((st = br.readLine()) != null)

{ out.println(st); };%>
<% out.println("Exit");
```

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
