---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
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
