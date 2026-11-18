---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - trigger/social-engineering
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2019-08-31
submitted: 2019-02-20T22:00:44.232Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "chernobyl"
source: "https://hackerone.com/reports/498878"
title: "User Editable nextcloud Wiki pages of Public Repositories"
---
# User Editable nextcloud Wiki pages of Public Repositories

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Nextcloud | **Disclosed:** 2019-08-31

- Report: [https://hackerone.com/reports/498878](https://hackerone.com/reports/498878)
- CWE: N/A
- Submitted: 2019-02-20T22:00:44.232Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Summary :
I have found that the "Edit" Permissions of WIKI pages are NOT disabled on the public repositories of nextcloud. Generally Edit permissions are given only to the collaborators of a specific repository. but that is not the case with Nextcloud, It is public editable which isn't right in terms of security. 

An attacker can create a new Wiki page for this particular nextcloud Github Wiki page : There is no restriction on it.


https://github.com/nextcloud/logreader/wiki

An attacker could include any content/links and direct users to other similar nextcloud pages to steal user information. 
Attacker could even provide false information about the user to provide their private keys or passwords using a form/page.

## Impact

These wikis should not be publicly editable due to the possibility of abuse through hacktivities such as Phishing, Defacement, etc

Many companies (even on hackerone) are correcting this issue and removing the "Edit" Permissions to the wiki page of public repositories.

## Timeline

- **Report Filed**
- **2019-02-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Resolved**
- **2019-02-21** @chernobyl: @nickvergessen , Any updates on the bounty?
- **Not Eligible For Bounty**
- **2019-02-22** @chernobyl: @nextcloud , 
>Sorry, but repository configurations are not eligible for a bounty,

But, It was not mentioned in your policy page right?
- **2019-02-25** @nickvergessen: The overview clearly states "Source code" as the scope
- **Agreed On Going Public**
- **Report Became Public**
