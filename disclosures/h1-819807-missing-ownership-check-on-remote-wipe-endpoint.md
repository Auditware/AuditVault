---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-04-19
submitted: 2020-03-15T21:55:05.955Z
bounty_usd: 500
votes: 141
cve: "CVE-2020-8154"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "hitman_47"
source: "https://hackerone.com/reports/819807"
title: "Missing ownership check on remote wipe endpoint"
---
# Missing ownership check on remote wipe endpoint

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 141 | **Program:** Nextcloud | **Disclosed:** 2020-04-19

- Report: [https://hackerone.com/reports/819807](https://hackerone.com/reports/819807)
- CWE: Insecure Direct Object Reference (IDOR) | CVE: CVE-2020-8154
- Submitted: 2020-03-15T21:55:05.955Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

On settings/user/security

You can mark a device for wipe out that does not belong to you.

Steps:

1. Create 2 accounts one for the hacker and one for the victim
2. On both accounts add devices with different names
3.  On the hacker account, while intercepting with burpsuite, select the option to wipe out a device
4.  Forward with burpsuite and in the url that looks like settings/personal/authtokens/wipe/{data-id}, change the data-id to the id of the device of the victim
5. Stop intercepting or forward again and the device of the victim will be marked for wipe out. 

Here is a video demo 
{F748890}

## Impact

Attacker can wipe out the device of another user by using the device ID

## Timeline

- **Report Filed**
- **2020-03-15** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2020-03-16** @nickvergessen: We are currently working on the patch and the following one seems to solve it:

```diff
diff --git a/apps/settings/lib/Controller/AuthSettingsController.php b/apps/settings/lib/Controller/AuthSettingsController.php
index 7248127fd6..ccd1d370a1 100644
--- a/apps/settings/lib/Controller/AuthSettingsController.php
+++ b/apps/settings/lib/Controller/AuthSettingsController.php
@@ -289,7 +289,7 @@ private function findTokenByIdAndUser(int $id): IToken {
 	 * @throws \OC\Authentication\Exceptions\ExpiredTokenException
 	 */
 	public function wipe(int $id): JSONResponse {
-		if (!$this->remoteWipe->markTokenForWipe($id)) {
+		if (!$this->remoteWipe->markTokenForWipe($id, $this->uid)) {
 			return new JSONResponse([], Http::STATUS_BAD_REQUEST);
 		}
 
diff --git a/lib/private/Authentication/Token/RemoteWipe.php b/lib/private/Authentication/Token/RemoteWipe.php
index 2285ccd2cd..b3555203c6 100644
--- a/lib/private/Authentication/Token/RemoteWipe.php
+++ b/lib/private/Authentication/Token/RemoteWipe.php
@@ -58,17 +58,17 @@ public function __construct(IProvider $tokenProvider,
 
 	/**
 	 * @param int $id
-	 *
+	 * @param string $userId
 	 * @return bool
 	 *
 	 * @throws InvalidTokenException
 	 * @throws WipeTokenException
 	 * @throws ExpiredTokenException
 	 */
-	public function markTokenForWipe(int $id): bool {
+	public function markTokenForWipe(int $id, string $userId): bool {
 		$token = $this->tokenProvider->getTokenById($id);
 
-		if (!($token instanceof IWipeableToken)) {
+		if (!$token instanceof IWipeableToken || $token->getUID() !== $userId) {
 			return false;
 		}
 
```

In case you want to confirm it
- **2020-03-16** @hitman_47: Great!, thanks for the quick follow up
- **2020-03-17** @hitman_47: So I tested again and I can confirm this vulnerability has been patched. Great job on fixing it so quickly.
- **Report Resolved**
- **Bounty Awarded**
- **2020-03-20** @hitman_47: Thank you so much for the Bounty :). I can be credited as Tommy Suriel.
- **Agreed On Going Public**
- **2020-03-20** @nickvergessen: We will with the normal 4 weeks delay between release (monday) and disclosure (20th of april).
Together with an advisory on https://nextcloud.com/security/advisories and a CVE.

CVE will be requested soon, the advisory will be published under the id 2020-018: https://nextcloud.com/security/advisory/?id=NC-SA-2020-018
- **2020-03-20** @hitman_47: Perfect, I look forward to those releases. Thank you again.
- **Report Became Public**
- **Changed Scope**
- **Report Title Updated**
