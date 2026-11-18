---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/password-in-configuration-file
  - env/web
substate: "resolved"
weakness: "Password in Configuration File"
enriched: true
body: true
date: 2021-03-24
submitted: 2019-12-29T16:49:49.871Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "al-madjus"
source: "https://hackerone.com/reports/765825"
title: "Git repo on https://██████.mil/ discloses API password"
---
# Git repo on https://██████.mil/ discloses API password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-24

- Report: [https://hackerone.com/reports/765825](https://hackerone.com/reports/765825)
- CWE: Password in Configuration File
- Submitted: 2019-12-29T16:49:49.871Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
I found a .git repository on https://███████.mil/.git which discloses an API password for Yubikey on 2 different domains, together with full source code. 

**Description:**
Fetching the git repository and decompressing the objects results in the ability to read the source code of the server, which includes an API password for the Yubikey hardware authentication software. The API however does not appear to be functional on the main domain, but since the repository is very recent, I cannot be certain that it'll stay non-functional. 
Additionally, the server discloses info.php at https://███████.mil/info.php. I'm uncertain if this should be reported separately, any comments on this would be very welcome! 

## Impact
I'm rating the impact of this primarily as an information disclosure. The repository appears to have been active within the past months, so any future additions will be disclosed too. 
I was unable to use the found password as the API appears to be currently non-functional, but since the repo is active I would expect the server to be worked upon, and the API to be functional in the future. For this reason I've decided to make you aware of the issue. 
Also, even if the password were to be changed, it would of course still be disclosed on the repository. 
Furthermore, the repository discloses the full source code of the served pages. 

## Step-by-step Reproduction Instructions

1. Fetch the repo with wget:

`wget --no-parent -r https://█████.mil/.git/ --no-check-certificate`
2. Write the following python script (remember to update the 'pwd' variable): 

`import zlib
import os
pwd = INSERT FULL PATH WHERE THE REPO WAS DOWNLOADED + '█████████.mil/.git/objects/'
for subdir, dirs, files in os.walk(pwd):
    for file in files:
        if not file.startswith("index"):
            filename = subdir + '/' +  file
            compressed_contents = open(filename, 'rb').read()
            decompressed_contents = zlib.decompress(compressed_contents)
            print(str(decompressed_contents) + '\n')`

The script is also attached as a file. 
3. Run the script with 

`python gitreader.py | grep -i -E -o ".{0,138}restPW.{0,22}"`

Which greps the output for the string where the password is, together with the paths/domains. 
Of course, the full contents of the repository are available to look through. 

Example output: 
`'https://███`

## Product, Version, and Configuration (If applicable)

## Suggested Mitigation/Remediation Actions
Remove the .git repository from the server, since it contains sensitive information.

## Impact

I'm rating the impact of this primarily as an information disclosure. The repository appears to have been active within the past months, so any future additions will be disclosed too. 
I was unable to use the found password as the API appears to be currently non-functional, but since the repo is active I would expect the server to be worked upon, and the API to be functional in the future. For this reason I've decided to make you aware of the issue. 
Also, even if the password were to be changed, it would of course still be disclosed on the repository. 
Furthermore, the repository discloses the full source code of the served pages.

## Timeline

- **Report Filed**
- **2019-12-29** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2019-12-30** @al-madjus: If I'm not mistaken, Kali Linux uses python-2 by default, try running the script with `python3` instead and see if it still errors out.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
