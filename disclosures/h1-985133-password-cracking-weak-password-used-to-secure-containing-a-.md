---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/storing-passwords-in-a-recoverable-format
  - env/web
substate: "resolved"
weakness: "Storing Passwords in a Recoverable Format"
enriched: true
body: true
date: 2021-02-18
submitted: 2020-09-18T05:39:31.410Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "z32"
source: "https://hackerone.com/reports/985133"
title: "Password Cracking - Weak Password Used to Secure ████ Containing a Plaintext Password"
---
# Password Cracking - Weak Password Used to Secure ████ Containing a Plaintext Password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/985133](https://hackerone.com/reports/985133)
- CWE: Storing Passwords in a Recoverable Format
- Submitted: 2020-09-18T05:39:31.410Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I was able to crack the password to the ████████ located at ██████, as the pdf was protected with a weak password contained in a common word list. This guide contains steps to set-up the ███████ secure communication application with the unprotected configuration file located at██████████. This guide also contains a plaintext password for the configuration file.

## Step-by-step Reproduction Instructions

1. Browse to ███
2. Click `████████`. You will be prompted for a password.
3. Using wget, download the pdf: `wget ████████`.
4. Once downloaded, you can use `pdf2john` to convert the pdf password into a format that is parse-able by `john`: 
`perl /path/to/john/pdf2john.pl █████████.pdf`
5. This will produce a hash. Cracking this hash with `john` and the `rockyou` wordlist will produce the password: 

```
root@kali:/home/kali# john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (PDF [MD5 SHA2 RC4/AES 32/64])
Cost 1 (revision) is 6 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
█████████           (████████.pdf)
1g 0:00:00:00 DONE (2020-09-18 01:08) 1.785g/s 2285p/s 2285c/s 2285C/s 753951..poohbear1
Use the "--show --format=PDF" options to display all of the cracked passwords reliably
Session completed
```

7. You can now browse to █████████, click `███`, and type in the password `█████████` to view the pdf (or view it on your local system).
8. Reading the setup instructions, and attacker can download the `Messaging Config`to download the ████ configuration file. This mobile guide contains the plaintext password for the configuration file (`███████`). They can then attempt to use the configuration file and a compromised `.mil`/`.gov`/etc. account to gain access to ████ secure communications.

## References
https://github.com/openwall/john/blob/bleeding-jumbo/run/pdf2john.pl

## Suggested Mitigation/Remediation Actions
Use a strong password for this .pdf file in order to prevent successful password cracking attempts.

## Impact

This guide contains steps to set-up the ███████ secure communication application with the unprotected configuration file located at█████. This guide also contains a plaintext password for the configuration file. An attacker could potentially join the secure communication channel if they were able to obtain access to the DoD ID number of an ███ member.

## Timeline

- **Report Filed**
- **2020-09-18** @z32: This also applies to the following:
- `█████████` at███████/███████-█████ 
- `████` at████/████
- `███████` at████/██████████ 

As these three files do not seem to contain any information that cannot be gathered from the other reports, I'm putting them into this one. If you would prefer these reported in separate reports, please let me know.
- **Report Severity Updated**
- **2020-09-18** @agent-l8: ██████████
█████-███████OB-0001-██████OnboardGuide.pdf
Same site/issue/path.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
