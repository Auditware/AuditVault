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
date: 2023-08-10
submitted: 2023-07-12T19:28:03.088Z
bounty_usd: 250
votes: 11
cve: "CVE-2023-39963"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "mikaelgundersen"
source: "https://hackerone.com/reports/2067572"
title: "New AppPassword can be generated without password confirmation"
---
# New AppPassword can be generated without password confirmation

> **Severity:** High | **Bounty:** 250 USD | **Votes:** 11 | **Program:** Nextcloud | **Disclosed:** 2023-08-10

- Report: [https://hackerone.com/reports/2067572](https://hackerone.com/reports/2067572)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-39963
- Submitted: 2023-07-12T19:28:03.088Z

## Report summary

Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-j4qm-5q5x-54m5

## Timeline

- **Report Filed**
- **2023-07-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2023-07-17** @nickvergessen: Something like the following patch should solve it:
```diff
diff --git a/core/Controller/AppPasswordController.php b/core/Controller/AppPasswordController.php
index 096261d2311..205381e83c1 100644
--- a/core/Controller/AppPasswordController.php
+++ b/core/Controller/AppPasswordController.php
@@ -58,6 +58,7 @@ class AppPasswordController extends \OCP\AppFramework\OCSController {
 
        /**
         * @NoAdminRequired
+        * @PasswordConfirmationRequired
         *
         * Create app password
         *
```

Will clarify if we can add it to the currently processed release still, or if we wait for the august release.
- **Report Severity Updated**
- **2023-07-17** @mikaelgundersen: Hi,

It seems to be in use by the android client
https://github.com/nextcloud/android-library/blob/9dcfbd951f5ae27c1258960d33e017ed225d297b/library/src/main/java/com/owncloud/android/lib/resources/users/ConvertAppTokenRemoteOperation.java#L50

Judging from the code it looks like it is used to convert username+password to an apptoken. But I lack a bit of knowledge on the android side.
- **2023-07-17** @nickvergessen: It's also used in iOS in a similar fashion, but they send the credentials as basic auth on the request, so will pass the "password confirmation required" check.
- **Report Resolved**
- **Agreed On Going Public**
- **2023-08-09** @nickvergessen: Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-j4qm-5q5x-54m5
- **Cve Id Added**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
