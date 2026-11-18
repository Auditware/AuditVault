---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - stack/firebase
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-09-25
submitted: 2019-08-29T03:22:26.687Z
bounty_usd: null
votes: 49
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "deeptiman"
source: "https://hackerone.com/reports/684099"
title: "Periscope-all Firebase database takeover"
---
# Periscope-all Firebase database takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 49 | **Program:** X / xAI | **Disclosed:** 2019-09-25

- Report: [https://hackerone.com/reports/684099](https://hackerone.com/reports/684099)
- CWE: Improper Access Control - Generic
- Submitted: 2019-08-29T03:22:26.687Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

I found one public Firebase database of periscope.tv and I can able to insert data to this database and i only used it once for the testing purposes, so other database queries also possible.

Please follow the below link to check the inserted test data.

###Periscope-all Firebase URL :- 

https://█████████/.json

## Impact

This is quite serious because by using this database attacker can use this for malicious purposes and also an attacker can track this database if periscope uses it for future perspective and at that time it will be much easier for the attacker to steal the data from this repository and later it will harm the reputation of the Periscope.

So please immediately change the rule of the database to private so that nobody can able to access it outside.

Thanks
Deeptiman Pattnaik

## Timeline

- **Report Filed**
- **2019-08-29** @deeptiman: Hello,

Apologies, I forgot to attach the takeover screenshot on my submission. Please find the attached screenshot.

Thanks
Deeptiman Pattnaik
- **Report Needs More Info**
- **Report New**
- **2019-08-30** @bugtriage-sophia: Thank you for your report @deeptiman,

We were able to reproduce the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **2019-09-10** @deeptiman: Hello @jwaddle,

Do you have any update for my report?

Thanks 
Deeptiman Pattnaik
- **2019-09-10** @jwaddle: Hello @deeptiman,

  I'm trying to determine the potential impact.  You can help in that process by giving specifics on what bad things attackers can do to Twitter or its users by exploiting this vulnerability.
- **2019-09-10** @deeptiman: Hello @jwaddle,

First of all, it's very simple to understand that,   the criticality of an open database with large storage space. It allows an attacker to store highly sensitive compromised data in the Periscope Firebase database anonymously. 

 An attacker can store many different forms of data in this Firebase database such as -: malicious links, stolen credit card details, user's stolen email's password or some organization's financial information.

Most importantly Firebase allows to store hyperlink in the database, so it's an open advantage for the attacker to design an application to fool the end-user to click on the suspicious links unknowingly. Whereas there is no way of accusing the anonymous attackers of owning the data being stored in the Periscope Firebase database because the complete proprietary owner of the database belongs to Twitter. It will cause severe damage to Twitter's public reputation and may follow a lawsuit from the federal authority for allowing or giving open access to any anonymous attackers store records illegally. 


###Recent Attacks

There are some recent attacks occurred for Firebase database misconfiguration and allowing any user to access companies records publicly. I will advise you to please follow the below links, perhaps Periscope may not have the plan to store records in this Firebase database but it will help you to be aware of the sensitivity of misconfiguring the Firebase database.

1. https://www.xda-developers.com/user-data-leak-misconfigured-firebase-backends/
2. https://medium.com/@fs0c131y/how-i-found-the-database-of-the-donald-daters-app-af88b06e39ad
3. https://blog.netspi.com/when-databases-attack-entry-points/

###A blog regarding storing stolen records in your database 

1. https://www.foregenix.com/blog/magento-websites-stolen-credit-card-data-stored-in-your-database

###Resolve Insecurities

There are guidelines available by Firebase to resolve the insecurities and misconfiguration, please follow this link

1. https://firebase.google.com/docs/database/security/resolve-insecurities

###Firebase GDPR Ready

Firebase is strongly GDPR compliant model and some key questions have been categorized by Firebase to protect user's privacy and the responsibility of a data protection officer to control the data of an organization.

```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
1. How does your organization ensure user transparency and control around data use?
2. Are you sure that your organization has the right consents in a place where these are needed under the GDPR?
3. Does your organization have the right systems to record user preferences and consents?
4. How will you show regulators and partners that you meet the principles of the GDPR and are an accountable organization?
```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

I will highly recommend following the below guidelines available for Firebase GDPR ready.

1. https://firebase.google.com/support/privacy
2. https://www.termsfeed.com/blog/gdpr-firebase-dpo/
3. https://firebase.google.com/terms/data-processing-terms

And one more thing I'd like to point out that this Firebase database link is found in the production periscope Android app, so it's a live database and it needs to be configured securely. And as always it's a best practice to secure companies property properly.

Please go through the above details and let me know.

Thanks
Deeptiman Pattnaik
- **2019-09-13** @deeptiman: Hello @jwaddle,

 I can see now the Periscope Firebase says "Permission Denied", which is correct in terms of unauthorized access. So, this issue resolved now.

https://██████████/.json

Just want to know, am I eligible for bounty? 

Thanks
Deeptiman Pattnaik
- **2019-09-16** @jwaddle: Hi @deeptiman,

  Yes, as you can see the team has addressed the issue, and the bounty committee will meet in the next day or two to discuss awards.

Thank you again for your report!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-09-19** @jwaddle: Hi @deeptiman,

 Yes, of course!  Please request disclosure through HackerOne's UI: https://docs.hackerone.com/programs/disclosure.html#requesting-disclosure
- **Agreed On Going Public**
- **Report Became Public**
