---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2020-03-07
submitted: 2019-12-27T23:07:56.864Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "emilvirkki"
source: "https://hackerone.com/reports/765291"
title: "Remote code execution via path traversal in Zip extraction in the Extract app"
---
# Remote code execution via path traversal in Zip extraction in the Extract app

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Nextcloud | **Disclosed:** 2020-03-07

- Report: [https://hackerone.com/reports/765291](https://hackerone.com/reports/765291)
- CWE: Path Traversal
- Submitted: 2019-12-27T23:07:56.864Z

## Timeline

- **Report Filed**
- **2019-12-27** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-01-07** @nickvergessen: Thanks for reporting.

Definitly the right decision.

I will contact the owner of the app and make sure it's fixed soon
- **Report Triaged**
- **Not Eligible For Bounty**
- **Swag Awarded**
- **2020-01-07** @nickvergessen: Can you confirm that the following patch is enough to prevent the issue?

```diff
diff --git a/lib/Controller/ExtractionController.php b/lib/Controller/ExtractionController.php
index a0dc4fb..a46fce2 100644
--- a/lib/Controller/ExtractionController.php
+++ b/lib/Controller/ExtractionController.php
@@ -40,6 +40,14 @@ class ExtractionController extends Controller {
        */
 
        public function extractHere($nameOfFile, $directory, $external, $shareOwner = null) {
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $nameOfFile)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t find zip file'];
+                       return json_encode($response);
+               }
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $directory)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t open zip file at directory'];
+                       return json_encode($response);
+               }
                if (!extension_loaded ("zip")){
                        $response = array_merge($response, array("code" => 0, "desc" => $this->l->t("Zip extension is not available")));
                        return json_encode($response);
@@ -81,6 +89,14 @@ class ExtractionController extends Controller {
        * @NoAdminRequired
        */
        public function extractHereRar($nameOfFile, $directory, $external, $shareOwner = null) {
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $nameOfFile)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t find rar file'];
+                       return json_encode($response);
+               }
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $directory)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t open rar file at directory'];
+                       return json_encode($response);
+               }
                $response = array();
                if ($external){
                        $externalMountPoints = $this->getExternalMP();
@@ -159,6 +175,14 @@ class ExtractionController extends Controller {
        * @NoAdminRequired
        */
        public function extractHereOthers($nameOfFile, $directory, $external, $shareOwner = null) {
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $nameOfFile)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t find file'];
+                       return json_encode($response);
+               }
+               if (preg_match('/(\/|^)\.\.(\/|$)/', $directory)) {
+                       $response = ['code' => 0, 'desc' => 'Can\'t open file at directory'];
+                       return json_encode($response);
+               }
                $response = array();
                if ($external){
                        $externalMountPoints = $this->getExternalMP();
```
- **2020-01-12** @emilvirkki: The patch looks sufficient to me :)
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
