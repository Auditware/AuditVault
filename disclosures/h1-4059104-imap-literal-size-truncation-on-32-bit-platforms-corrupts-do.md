---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
date: 2026-10-05
submitted: 2026-09-25T11:57:43.020Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/curl|curl]]"
reporter: "cyberfathy"
source: "https://hackerone.com/reports/4059104"
title: "IMAP literal size truncation on 32-bit platforms corrupts downloads and desynchronizes the response parser"
---
# IMAP literal size truncation on 32-bit platforms corrupts downloads and desynchronizes the response parser

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** curl | **Disclosed:** 2026-10-05

- Report: [https://hackerone.com/reports/4059104](https://hackerone.com/reports/4059104)
- CWE: N/A
- Submitted: 2026-09-25T11:57:43.020Z

## Timeline

- **Report Filed**
- **2026-09-25** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-09-25** @bagder: Does this simple change fix the issue?

~~~diff
diff --git a/lib/imap.c b/lib/imap.c
index f06a20daf6..ea87021231 100644
--- a/lib/imap.c
+++ b/lib/imap.c
@@ -1437,11 +1437,11 @@ static CURLcode imap_state_fetch_resp(struct Curl_easy *data,
 
       /* keep only the overflow */
       curlx_dyn_tail(&pp->recvbuf, chunk);
       pp->nfinal = 0; /* done */
 
-      if(chunk > (size_t)size)
+      if((curl_off_t)chunk > size)
         /* The conversion from curl_off_t to size_t is always fine here */
         chunk = (size_t)size;
 
       if(!chunk) {
         /* no size, we are done with the data */
- **2026-09-25** @cyberfathy: Yes — that change fixes the FETCH download path this report is about.

if((curl_off_t)chunk > size) does the comparison in curl_off_t space, so a 32-bit wrap of (size_t)size no longer clamps chunk to the low 32 bits of a huge {size}. For {4294967306}, overflow bytes stay body instead of being reparsed as IMAP. When size actually fits in size_t and is smaller than chunk, the clamp still happens and chunk = (size_t)size is then valid.

That is imap_state_fetch_resp() around the overflow check (the site in your diff). That is the path used by imap://…/INBOX;UID=1.

The same narrowing is still present in imap_state_listsearch_resp():

if(chunk > (size_t)size)
  chunk = (size_t)size;

That is a different state (custom FETCH / UID FETCH listing). The original PoC does not hit it. Same 32-bit wrap if that path sees a huge literal.

Suggested: ship your FETCH-resp change, and apply the same compare at the listsearch site so both clamps stay in curl_off_t space. The comment that converting to size_t is always fine then holds for the assignment after the new compare.
- **2026-09-25** @bagder: PR: https://github.com/curl/curl/pull/23100
- **2026-09-25** @cyberfathy: Thanks
- **2026-09-25** @bagder: Because of the limiting factors, we want to consider this as "just a bug" and not a vulnerability.

- An attacker to exploit this needs to be a malicious server or a MITM, and such an attacker can already to much more harm than this
- This problem is limited to (extremely) rare 4GB IMAP downloads on 32-bit systems
- The problem is likely to be immediately noticeable if triggered by mistake and unlikely to cause a security problem then
- **2026-09-25** @cyberfathy: Agreed — treating this as a correctness bug is the right call.

The three limits you listed match what I saw: malicious/MITM server (already in a position to lie about the message), 32-bit + `{size}` > `SIZE_MAX`, and a truncated download that is obvious if it happens by accident. The clamp only ever shrinks the copy, so there is no memory-safety issue. I did not get a working response-injection past the FETCH state machine.

PR https://github.com/curl/curl/pull/23100 is the right fix: `if((curl_off_t)chunk > size)` in both `imap_state_fetch_resp()` and `imap_state_listsearch_resp()`. Happy to close this as a non-advisory bug once that lands.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
