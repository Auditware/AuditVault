---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - vuln/xss
  - impact/rce
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2023-10-10
submitted: 2021-07-23T04:09:42.135Z
bounty_usd: 3000
votes: 172
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/1274695"
title: "RCE of Burp  Scanner / Crawler via Clickjacking "
---
# RCE of Burp  Scanner / Crawler via Clickjacking 

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 172 | **Program:** PortSwigger Web Security | **Disclosed:** 2023-10-10

- Report: [https://hackerone.com/reports/1274695](https://hackerone.com/reports/1274695)
- CWE: Command Injection - Generic
- Submitted: 2021-07-23T04:09:42.135Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Burp Suite utilizes an embedded Chrome browser for crawling and scanning web applications. The Chrome instance is launched in headless mode, with remote debugging enabled via the remote-debugging websocket port instead of remote-debugging-pipe. As a result, a known XSS vulnerability in Chrome can be leveraged in combination with a JavaScript port sniffing and ClickJacking attack to compromise the WebSocket GUID for the remote debugging channel. Using the provided remote debugging APIs, it’s possible to trigger a file download to the `/Applications/Burp Suite Professional.app/Contents/` directory with a new `user.vmoptions` file. This will provide the `-Xmx5m` and `-XX:OnOutOfMemoryError=open -a Calculator` flags to JVM the next time that Burp Suite is launched. Accordingly, Burp Suite will quickly exhaust the available JVM memory and trigger the supplied OS command.

Based on Google’s security impact guidelines, this issue would typically be considered to have no security impact since Chrome requires additional flags to run (`--remote-debugging` and `--headless`) [1]. Additionally, the XSS vector used in this PoC has been public to Chrome since at least 2016 and reported in multiple tickets [2-6]. As a result, we are reporting this as a Burp Suite vulnerability since the named pipe transport could be utilized to mitigate this issue, which is supported by tools like puppeteer (e.g. `--remote-debugging-pipe`) [7]. 

### POC: 
See attached video. 

### Steps to reproduce:

To confirm this issue, perform the following steps:

1. Download the attached ‘burp.html’ exploit, and host it on a web server (e.g. `python -m http.server`)
2. Launch an instance of Burp Suite, and start a new scan of the web server.
3. Open a Chrome browser and navigate to the hosted exploit page (e.g. http://127.0.0.1:8000/burp.html)
4. Observe that a JavaScript port scanner is determining the randomized port listening for Chrome remote debugging. After the port is identified, a clickjacking payload will be rendered on the page. 
5. After clicking the ‘CLICK ME!!!’ button, restart Burp Suite and observe that the Calculator app has been launched. 

### References:
[1] https://chromium.googlesource.com/chromium/src/+/HEAD/docs/security/security-labels.md#TOC-Security_Impact-None
[2] https://bugs.chromium.org/p/chromium/issues/detail?id=607939
[3] https://bugs.chromium.org/p/chromium/issues/detail?id=618333
[4] https://bugs.chromium.org/p/chromium/issues/detail?id=619414
[5] https://bugs.chromium.org/p/chromium/issues/detail?id=775527
[6] https://bugs.chromium.org/p/chromium/issues/detail?id=798163
[7] https://github.com/puppeteer/puppeteer/blob/943477cc1eb4b129870142873b3554737d5ef252/src/node/PipeTransport.ts

## Impact

After successful exploitation an attacker can gain control over victim's computer with the same permissions as the user running the scanner.

## Timeline

- **Report Filed**
- **2021-07-23** @mattaustin: We can actually make the exploit a bit "quieter" and crash Burp after a restart using a java "agent". 

Instead of using `-Xmx5m` and `-XX:OnOutOfMemoryError=` in the user.vmoptions file we can create a java agent and use `-javaagent:agent.jar` with the attached jar. 

This simple POC is using the following code to open the calculator application on MacOs: 

``` java
import java.io.*;
import java.lang.instrument.*;

public class Hax {
  public static void premain(String args, Instrumentation inst) {
    try {
      Process p = Runtime.getRuntime().exec("open -a Calculator");
    }
    catch (Exception err) {
      err.printStackTrace();
    }
  }
}
```
- **Report Triaged**
- **2021-07-23** @albinowax: Thanks for the excellent report, we're going to tackle this as a priority.
- **Report Triaged**
- **2021-08-02** @albinowax: We've implemented two fixes:
- We removed the link to appspot
- We now require a secret token on requests to the devtools HTTP and WebSocket endpoints

If you have time, could you verify the fixes? You can find them in the following build https://drive.google.com/file/d/173mNjw68j9JHOngZu81Tl_FteOvRAKeJ/view?usp=sharing
- **2021-08-02** @mattaustin: I can confirm I am seeing "Invalid x-burp-authorization header value" now on all requests to chrome.
- **Bounty Awarded**
- **2021-08-03** @albinowax: How would you like to be credited in the release notes?
- **2021-08-04** @mattaustin: Awesome, Thank you!! And I hate to be greedy, but I would love some Burp Suite swag!

@mattaustin and @DanAmodio 

I was trying to add Dan (@00xd4 on h1)  as a "collaborator", but I did not see that option in this ticket. Im not sure if that is a program specific feature or something? 

Thank you again! That was super quick turn around. Just out of curiosity were you guys already forking chromium, or did you have to did it just for this change?
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-10-02** @albinowax: Yep that's fine. Would you like this HackerOne report partially/fully disclosed too?
- **2023-10-05** @mattaustin: As much as you guys are comfortable with.
- **Agreed On Going Public**
- **Report Became Public**
