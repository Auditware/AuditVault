---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - trigger/auth-required
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-01-19
submitted: 2021-12-10T14:36:48.517Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "h3xr"
source: "https://hackerone.com/reports/1422641"
title: "Wrong settings in ADF Faces leads to information disclosure"
---
# Wrong settings in ADF Faces leads to information disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-01-19

- Report: [https://hackerone.com/reports/1422641](https://hackerone.com/reports/1422641)
- CWE: Information Disclosure
- Submitted: 2021-12-10T14:36:48.517Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, Team.

Found some interesting links which leads to information disclosure in █████
Link 1: [██████████]███
Link 2: [████████]██████████
Link 3: [██████████]███

Every link goes through https://██████to https://████
**For Link 3 is possible to change data in the fields: First Name, Last Name, Phone Number. Just click "██████".**

Viewing the code gives us some more info about the system:
```
██████
```

ADF ███████ is outdated
The [Ref. Page](https://docs.oracle.com/cd/E41362_01/web.1111/b31973/ap_config.htm) says:
*A.2.3.16 Version Number Information
Use the oracle.adf.view.rich.versionString.HIDDEN parameter to determine whether or not to display version information an a page's HTML. When the parameter is set to false, the HTML of an ADF Faces page contains information about the version of ADF Faces and other components used to create the page as shown in Example A-2.
When you create a new application, the parameter is set to true. It should also be set to true in a production environment. Set the parameter to false to display this version information for debugging information.
Note:
In a production environment, set this parameter to true to avoid security issues. It should be set to false only in a development environment for debugging purposes.*

[This Ref.](https://imlive.s3.amazonaws.com/Federal%20Government/ID188660931371312277217448460962608356160/Attachment_E_███S_Request_for_Role_Guide.pdf) points us that Link 3 is:
*██████S lists any █████s waiting for your approval. If there are none, there will be a message like the one in ███████. Click the Logout button to exit ██████████S.  You can use the link in your email to return to the ██████████.*

But we see the Logout button and can modify some data - so **perhaps** we are logged in.

## Impact

Sensitive information disclosure
Information modification
Privacy Violation

## System Host(s)
███████

## Affected Product(s) and Version(s)
Oracle ADF Faces

## CVE Numbers


## Steps to Reproduce
In the Desc. section

## Suggested Mitigation/Remediation Actions
Update Oracle ADF
Close sensitive information from unauthenticated users

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
