---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2023-08-29
submitted: 2023-08-24T15:52:11.345Z
bounty_usd: null
votes: 395
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "harshdranjan"
source: "https://hackerone.com/reports/2122671"
title: "IDOR - Delete all Licenses and certifications from users account using CreateOrUpdateHackerCertification GraphQL query"
---
# IDOR - Delete all Licenses and certifications from users account using CreateOrUpdateHackerCertification GraphQL query

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 395 | **Program:** HackerOne | **Disclosed:** 2023-08-29

- Report: [https://hackerone.com/reports/2122671](https://hackerone.com/reports/2122671)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2023-08-24T15:52:11.345Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hey team,

While editing our **Licenses and certifications** if we change the ID number we can delete other users **Licenses and certifications**. it simply can be done by editing the ID number in our graphql query.
If change the ID from 1 to X possible range then we can delete all the **Licenses and certifications** present between these.


### Steps To Reproduce

1. Log in to your own account in two browsers A and B with User A and User B
2. Create your own **Licenses and certifications* in both the account
3. Now edit your own **Licenses and certifications* and Intercept this using a Burp Proxy 
4. Now In the body change the **ID** number and you will be able to delete all the **Licenses and certifications** present in HackerOne 
5. For now change the ID to the **Licenses and certifications** ID of the Other account and it will be deleted.

PoC Video: ████

## Impact

Able to delete all the **Licenses and certifications** present in HackerOne

## Timeline

- **Report Filed**
- **2023-08-25** @h1_analyst_aaron: Hi @callmed0_4 ,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_aaron
- **Report Title Updated**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Pending Program Review**
- **2023-08-25** @z0x01: Hi @callmed0_4,  I've have escalated this to the responsible team. Thanks for submitting!
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2023-08-25** @harshdranjan: Hey @z0x01 ,

HackerOne has rewarded the very same behavior with High #1969141 as "Insecure Direct Object Reference (IDOR) - Delete Campaigns" and my report is the same as that just the Affected product is different so how is this a Medium severity issue?

regards,
Harsh
- **2023-08-25** @harshdranjan: Hey @z0x01 ,
A similar issue of IDOR  #1501611  " archive and unarchive any structured scope" was also rewarded as a High while in my report the "Licenses and certifications" are completely removed from the user's account forever.
This should be treated as High just like previous reports.

regards,
Harsh
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2023-08-28** @zerotea: We are internally discussing the severity and will report back once we reached a conclusion.
- **2023-08-29** @z0x01: We deliberated over the seriousness of the matter, and we appreciate your efforts in pushing us to address this issue. After careful consideration, we concluded that, in this instance, applying the following `CVSS:3.0/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N` metrics is appropriate, categorising the severity as "Medium". Our decision was based on the following rationale: the impact is limited to a specific subset of data on the hackerone.com platform and the potential corruption of the affected data is not equivalent to a complete wipeout of all scopes, wherefore report #1501611 did, which we deem to be a more severe form of corruption. Thank you for understanding and happy hacking!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-08-30** @z0x01: To prevent confusion/duplicates, we have redacted the attachment here because it contained a cookie.
- **Report Severity Updated**
- **2023-08-30** @cevans_0glc8: Hello @z0x01, apologies that we marked CVSS as "Privileges Required: Low", PR:L. It should be "Privileges Required: None", PR:N. Requiring a self sign-up account is not a realistic barrier for an attacker. PR:L should be reserved for an account type that an attacker cannot obtain trivially.
With this adjustment, the overall Severity is still coming out as Medium, but it's important to be accurate.
- **2023-08-31** @harshdranjan: Hey @cevans_0glc8 ,

Thank you for the explanation but I think that Integrity should be High as well. Reference : #1969141 making it a High.

As the potential corruption of the affected data is equivalent to a complete wipeout of all licences and certificates even though it's a subset of data just like all the reports none of them were affecting others sections as well but was accepted as a high issue, like in your report #1969141  was only affecting Campaigns . And I was able to delete all the Licence and certificates from the Hackerone.
It matches the Integrity description you provided .

High: There is a total loss of integrity, or a complete loss of protection. For example, the attacker is able to Alternatively, only some files can be modified, but malicious modification would present a direct, serious consequence to the impacted component.

Regards,
Harsh
- **2023-09-05** @z0x01: Hi @callmed0_4 ,

We want to inform you that, based on your insightful comment, we have re-evaluated the report once more. Upon further examination, we have come to the realisation that we inadvertently overlooked a crucial detail in this IDOR scenario – the leakage of non-public data.

When you remove the certification by changing the userId, in the response it exposes certain data points that should not be publicly accessible at this point.

- Certification name
- Organization
- Issue date
- Expiration date
- Certification ID
- Certification URL

While some data points, such as the certification's name, are considered public, we had intended to keep the certification ID concealed from public view. 

Thanks to your demonstration of the IDOR, we have identified that it was indeed being displayed. We will keep the integrity score low due to the reasoning outlined above. However, your outstanding efforts in enhancing the security of our platform are highly commendable. Consequently, we will raise Confidentiality from None to Low. The overall combination of changing to PR:N and C:L have the effect of bouncing the overall severity up to High. We will award an additional $5000 bounty in order to correct your original bounty

Thank you for engaging thoughtfully with us to correct our original error. We apologise for the original mischaracterisation and are grateful to have had the opportunity to make a correction.

Keep up the excellent work, and happy hacking!
- **Report Severity Updated**
- **Bounty Awarded**
- **Comments Closed**
- **Comments Closed**
- **Bounty Awarded**
