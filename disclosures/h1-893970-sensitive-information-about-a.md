---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2020-09-21
submitted: 2020-06-08T17:05:58.567Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0x9747"
source: "https://hackerone.com/reports/893970"
title: "Sensitive information about a ██████"
---
# Sensitive information about a ██████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-09-21

- Report: [https://hackerone.com/reports/893970](https://hackerone.com/reports/893970)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2020-06-08T17:05:58.567Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
https://████████/ is an U.S. Government (USG) Information System (IS) that is provided for USG-authorized use only.Due to some reason a document  which contains the information about a special ███ for the ████  █████ which possibly is ███████or █████.The pdf file is located at https://██████/spi/█████████.pdf and also contains some drawings for the packaging of the machine.

To confirm that it indeed was a confidential document it was found that a basic search related to this pdf returns a meta info containing a label about criminal penalties for foreign export:

"WARNING – This document contains technical data whose export is restricted by the Arms Export Control Act (Title 22, U.S.C., Sec 2751 et seq.) or the Export Administration Act of 1979, (Title 50, U.S.C., App. 2401 et seq.), as amended. Violations of these export laws are subject to severe criminal penalties. Disseminate in accordance with provisions of DoD Directive 5230.25."

To confirm that the file is not just another special ██████████ it was discovered that the SPI number is not labeled at https://███/████████/spi?OpenPage&TableRow=2.1.1#2.1.


## Step-by-step Reproduction Instructions

1.Open any browser of your choice 
2.Head over to https://███████/spi/███████.pdf
3.Observe the content listed in the pdf and analyse the products mentioned in there

## Product, Version, and Configuration (If applicable)
Null
## Suggested Mitigation/Remediation Actions
Removal of such documents or introduction of certain authentication mechanisms would be ideal.

## Impact

This exposes highly sensitive information about not just the packaging info but also the designs mentioned.
Any person can access this document and cause information leakage.

## Timeline

- **Report Filed**
- **2020-06-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-06-08** @0x9747: the report can be placed under medium to high level severity since  it can be classified as an FOUO
- **2020-06-08** @0x9747: @deptofdefense
- **Report Needs More Info**
- **Report New**
- **2020-06-08** @0x9747: Such meta info was also reported in some previous reports where the documents contained technical info about several machines associated with US Army and were hence validated so i do need a double check on this report
- **2020-06-08** @0x9747: here's a resource  about the warning present in the meta info: 
https://www.dla.mil/Portals/104/Documents/J3LogisticOperations/EnhancedValidation/J3_expctrltraining_191004.pdf
- **Report Severity Updated**
- **Report Triaged**
- **2020-06-08** @0x9747: great!, looking forward for a fix soon :)
- **2020-06-14** @0x9747: @deptofdefense is it fixed yet?
- **2020-06-15** @agent-l8: @0x9747 we have not had any updates from the system owner at this time. When they do update us, we will promptly change the status. Thanks!
- **2020-06-15** @0x9747: Alright thank for the update 😄
- **Report Resolved**
- **Agreed On Going Public**
- **2020-09-14** @agent-l8: added to queue
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
