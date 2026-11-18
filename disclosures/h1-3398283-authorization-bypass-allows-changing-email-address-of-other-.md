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
date: 2025-11-19
submitted: 2025-10-24T15:14:32.308Z
bounty_usd: null
votes: 35
cve: "CVE-2025-48986"
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "yoyomiski"
source: "https://hackerone.com/reports/3398283"
title: "Authorization bypass allows changing email address of other users"
---
# Authorization bypass allows changing email address of other users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 35 | **Program:** Revive Adserver | **Disclosed:** 2025-11-19

- Report: [https://hackerone.com/reports/3398283](https://hackerone.com/reports/3398283)
- CWE: Improper Access Control - Generic | CVE: CVE-2025-48986
- Submitted: 2025-10-24T15:14:32.308Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

==Version: Revive Adserver 6.0.0==

##Summary:
The Change E-mail UI requires the current password, but the admin panel endpoint /admin/agency-user.php accepts a POST that updates a user’s email (including admin) without requiring the account password. The application does not require re-authentication before updating email addresses.

##Step to reproduce:
1. Log in page
2. Go to Preferences → Change E-mail, observe that changing the email normally requires the current password.

██████
3. Navigate to Inventory → User Access, select the admin user, and click Save changes while intercepting the request.
4. Modify and send the following request:
`submit=1&login=admin&token=ba6ff2f70a69a509d5bcc84cb2225517&userid=1&email_address=another-mail@example.com&agencyid=1`

{F4929064}
5. Observe that the admin user’s email is successfully updated without password confirmation.

███████

## Impact

- An authenticated attacker (with access to the User Access page) can change the administrator’s email address without authorization, potentially leading to account takeover or loss of access control integrity.

VIdeo PoC: ██████

## Timeline

- **Report Filed**
- **2025-10-24** @yoyomiski: {F4929549}

If an attacker can change the administrator’s email address without providing the current password, they can set their own email as the admin’s. Then, by using the Forgot Password function, the attacker can receive the password reset link and fully compromise the administrator account.
- **Report Triaged**
- **2025-10-24** @yoyomiski: hey, @mbeccati Thanks for the update! I really appreciate the quick triage.
For attribution in the security advisory, I would like to be credited as: `Dao Hoang Anh`

Thanks again for the fast response — looking forward to your update soon.

best,
@yoyomiski
- **2025-10-25** @yoyomiski: hi @mbeccati , I have an update on this issue --> This increases the impact of this issue

I created another account and granted it the “Allow this user to manage this account’s users” permission. However, this account was still unable to manage the admin account, even though the “Save changes” button remained functional.

- Using the account I created, I clicked “Save changes” and changed the admin’s email address to one I controlled.
- Then, I used the Forgot Password function — which allowed me to completely take over the admin account.

##Video PoC: ██████

best,
@yoyomiski
- **2025-10-26** @mbeccati: The attached {F4934615} patch should fix the vulnerability.

As you have found out, any logged in user having an account with elevated permissions (admin or having "Allow this user to manage this account's users") could use their respective /admin/*-user.php scripts to change any existing user's email address and take over their account using the Forgot Password functionality.
- **Report Severity Updated**
- **2025-10-27** @yoyomiski: thank @mbeccati , Will this be a new release?
- **2025-10-27** @mbeccati: Yes, it will be a new release, potentially both a 5.5.3 and 6.0.2. We'll get back to you with more information soon.
- **Report Resolved**
- **2025-10-28** @yoyomiski: hi @mbeccati ,
I think that's reasonable, thank you very much
- I'd like to pushlish a CVE-ID under the name: **Dao Hoang Anh (yoyomiski)**
- Before disclosure, could you please update the report title appropriately?

One again, thank you so much, have a great day

Best,
@yoyomiski
- **Report Title Updated**
- **Report Severity Updated**
- **Cve Id Added**
- **Agreed On Going Public**
- **2025-11-12** @mbeccati: I've redacted the videos. Full disclosure is planned for next week.
- **Agreed On Going Public**
- **Report Became Public**
