---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-10-19
submitted: 2021-06-06T08:07:33.006Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/gsa_vdp|U.S. General Services Administration]]"
reporter: "toormund"
source: "https://hackerone.com/reports/1218461"
title: "User information disclosed via API"
---
# User information disclosed via API

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. General Services Administration | **Disclosed:** 2022-10-19

- Report: [https://hackerone.com/reports/1218461](https://hackerone.com/reports/1218461)
- CWE: Information Disclosure
- Submitted: 2021-06-06T08:07:33.006Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

It appears that the requests for "system accounts" are fully available via an API endpoint that does not require authentication. 

The main issue is that among the information disclosed are user emails (many with gmail addresses) but the individual applications also include information that the user provides about their organization/integration such as IP addresses, physical locations and whether or not the system uses okta. 

## Steps To Reproduce:

Navigate to the following URL:  https://sam.gov/api/prod/iam/cws/v1/applications/

## Supporting Material/References:

Help desk article about what the [system accounts are](http://www.fsd.gov/gsafsd_sp?id=gsafsd_kb_articles&sys_id=c8d50f1d1b187c909ac5ddb6bc4bcbe2)

Here is an example object of what is returned from the endpoint:

```
{"uid":12345,"systemAccountName":"POC","interfacingSystemVersion":"beta.POCcom","systemDescriptionAndFunction":"example of data thgat is leaked","systemAdmins":"[]","systemManagers":"[{\"commonName\":\"James Bond\",\"uid\":\"fakepassword@gmail.com\",\"mail\":\"fake-fun@opayq.com\",\"name\":\"James Bond\",\"isGov\":false,\"id\":\"fake-fun@opayq.com\"}]","contractOpportunities":"","contractData":"","entityInformation":"","federalHierarchy":"","wageDeterminations":"","assistanceListings":"","referenceData":"","ipAddress":"","typeOfConnection":"","physicalLocation":"","securityOfficialName":"","securityOfficialEmail":"","uploadAto":"","authorizationConfirmation":false,"authorizingOfficialName":"","submittedDate":"2021-06-06T06:49:17.130+0000","submittedBy":"fake-fun@opayq.com","securityApprover":"","rejectedBy":"","rejectionReason":"","applicationStatus":"Draft","isGov":false,"migratedToOkta":false,"fips199Categorization":""}
```

## Impact

A threat actor could view personal information about users on the platform.

It is also theoretically possible that a threat actor could use information gathered from this endpoint to identify future targets and footholds.

## Timeline

- **Report Filed**
- **2021-06-07** @h1_analyst_chanel: Hi @toormund,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chinch1lla
- **Report Triaged**
- **2021-06-07** @issamy11: @toormund Thank you for your report. Our team is currently looking into it and we will follow up with questions if applicable.
- **2021-07-03** @toormund: Hi @issamy11, just wanted to circle back and say that I think it might be worth checking to make sure a user could not make a PUT request and change other user statuses. I saw the PII so just stopped where I was but making different API requests would be the next thing I would try to do if I were a malicious actor.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
