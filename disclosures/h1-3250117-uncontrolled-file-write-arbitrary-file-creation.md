---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "not-applicable"
weakness: "Code Injection"
enriched: true
body: true
date: 2025-07-13
submitted: 2025-07-13T16:50:47.600Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/curl|curl]]"
reporter: "hadesguy"
source: "https://hackerone.com/reports/3250117"
title: "Uncontrolled File Write/Arbitrary File Creation "
---
# Uncontrolled File Write/Arbitrary File Creation 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** curl | **Disclosed:** 2025-07-13

- Report: [https://hackerone.com/reports/3250117](https://hackerone.com/reports/3250117)
- CWE: Code Injection
- Submitted: 2025-07-13T16:50:47.600Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description

The dumpeasysrc function in the provided code snippet allows an attacker to specify an arbitrary file path for outputting the generated libcurl source code via the global->libcurl variable. If the global->libcurl value is not properly sanitized or restricted, a malicious user could provide a path to a sensitive system file (e.g., /etc/passwd, /etc/cron.d/malicious_job, user's .bashrc, etc.) or a device file (e.g., /dev/null, /dev/random).

The core issue is that fopen(o, FOPEN_WRITETEXT) is called directly with o = global->libcurl without any checks on the path provided.

# Vulnerable code 

```
void dumpeasysrc(struct GlobalConfig *global)
{
  struct curl_slist *ptr;
  char *o = global->libcurl; // <--- 'o' holds the user-supplied file path

  FILE *out;
  bool fopened = FALSE;
  if(strcmp(o, "-")) {
    out = fopen(o, FOPEN_WRITETEXT); // <--- Direct use of user-supplied path in fopen()
    fopened = TRUE;
  }
  else
    out = stdout;
  // ... rest of the function writes data to 'out'
}
```

# Proof of Concept (POC) to Prove Real Vulnerability and Step-by-Step
I will demonstrate overwriting a user-created, non-critical file within a standard temporary directory. This is easily reproducible and clearly shows the integrity impact without attempting to directly compromise critical system files, which might be blocked by OS permissions for a regular user.

1. Create a distinctive, dummy file in a temporary location:
```
echo "This is the ORIGINAL content of the file." > /tmp/curl_test_overwrite.txt
ls -l /tmp/curl_test_overwrite.txt
cat /tmp/curl_test_overwrite.txt
```

{F4561625}

2. Execute the vulnerable curl command to overwrite the file:
Assuming your curl executable (the one you built with the vulnerable code) is accessible in your PATH or you're running it with ./curl.

#Curl Version
```
└─# ./curl -V                                                        
WARNING: this libcurl is Debug-enabled, do not use in production

curl 8.15.0-DEV (x86_64-pc-linux-gnu) libcurl/8.15.0-DEV zlib/1.3.1 libpsl/0.21.2
Release-Date: [unreleased]
Protocols: dict file ftp gopher http imap ipfs ipns mqtt pop3 rtsp smtp telnet tftp ws
Features: alt-svc AsynchDNS Debug IPv6 Largefile libz PSL threadsafe TrackMemory UnixSockets
```

```
./curl --libcurl /tmp/curl_test_overwrite.txt http://example.com
```

{F4561649}

Using http://example.com is better than google.com as it avoids potential redirects and makes the curl output simpler, focusing on the --libcurl aspect.

3. Verify the content of the file after the curl execution:
```
cat /tmp/curl_test_overwrite.txt
```

The content of /tmp/curl_test_overwrite.txt will be replaced by the generated libcurl C code. It will look something like this:

{F4561653}

## Impact

Data Corruption/Loss: Arbitrary files can be overwritten with the generated libcurl C source code.

## Timeline

- **Report Filed**
- **2025-07-13** @bagder: No, this is curl working as intended. The user provides a file name for curl to create the source code in. It is not an attack.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-07-13** @jimfuller2024: Maybe I am missing something - I also am not seeing any security issue here.
- **2025-07-13** @bagder: curl can create files anywhere in the file system where the OS lets it, using many different command line options. That's by design.
- **Manually Disclosed**
