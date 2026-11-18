---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/csrf
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-07-15
submitted: 2021-05-12T11:09:52.009Z
bounty_usd: 1000
votes: 39
cve: "CVE-2021-32688"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rtod"
source: "https://hackerone.com/reports/1193321"
title: "Scoped apptokens can be changed by that very apptoken"
---
# Scoped apptokens can be changed by that very apptoken

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 39 | **Program:** Nextcloud | **Disclosed:** 2021-07-15

- Report: [https://hackerone.com/reports/1193321](https://hackerone.com/reports/1193321)
- CWE: Improper Access Control - Generic | CVE: CVE-2021-32688
- Submitted: 2021-05-12T11:09:52.009Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I noticed that there is the possibility to limit apptokens to not be able to access the filesystem.

1. Create a new apptoken in `https://server/settings/user/security`
2. Click the .. of your new apptoken and make it not allowed to access the filesystem
3. Log out
4. Navigate to `https://server/remote.php/dav` and login with your username + apptoken
5. Navigate again to `https://server/settings/user/security`
6. You won't be able to access the apptoken data
7. Obtain the CSRF token
8. Send a PUT request to `https://server/settings/personal/authtokens/ID` chaging the scope

Now the ID you do not know. However even on a decent sized system it is not hard to iterate this as there is no rate limiting or throttling at all.
And voila. You have filesystem access.

You could also remove other apptokens of the same user (if you'd want).

## Impact

Leaked scoped tokens could be used to gain full access to all your data. Defeating the whole purpose of scoped tokens.

I recommend.

1. Only allow tokens that result from a real login (so user+pass+2fa) to modify/delete tokens
2. Do not allow the current token in use to edit itself

## Timeline

- **Report Filed**
- **2021-05-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **2021-06-16** @lukasreschkenc: Draft advisory is at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-48m7-7r2r-838r
- **Cve Id Added**
- **Report Became Public**
