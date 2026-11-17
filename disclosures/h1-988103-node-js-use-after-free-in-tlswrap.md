---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
  - stack/node
substate: "resolved"
weakness: "Use After Free"
enriched: true
date: 2021-01-05
submitted: 2020-09-22T12:49:41.135Z
bounty_usd: null
votes: 27
cve: "CVE-2020-8265"
program: "[[programs/nodejs|Node.js]]"
reporter: "fwilhelm"
source: "https://hackerone.com/reports/988103"
title: "Node.js: use-after-free in TLSWrap"
---
# Node.js: use-after-free in TLSWrap

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Node.js | **Disclosed:** 2021-01-05

- Report: [https://hackerone.com/reports/988103](https://hackerone.com/reports/988103)
- CWE: Use After Free | CVE: CVE-2020-8265
- Submitted: 2020-09-22T12:49:41.135Z

## Timeline

- **Report Filed**
- **2020-09-22** @mcollina: Thanks for reporting this Felix, it's really a nasty bug. Could you please articulate how this could be exploited in practice? You mention that the impact is Remote Code Execution, but there is no PoC for it. Given your extensive research, have you got a potential fix?

If this is theoretical, we might want to fix this in the public tracker as we have just issued a security release and this would have to wait for a few months before we ship a new one.

Have you verified this to be present only in v14 or also in 12?
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2020-09-30** @jasnell: Ok, I had suspected this may have been a possibility before but had not investigated further. I will take a look at preparing a fix for all release lines. Realistically it will be early next week before I can take a look
- **2020-10-08** @jasnell: I'm working on the fix for this for the main branch. Once I have the primary fix done, I'll work on backports
- **2020-10-08** @jasnell: FWIW, the challenge here is really with StreamBase and the way WriteWrap instances are handled in general. That is, this is not specific to TLSWrap, that just happens to be the place where the bug manifests. That's a long way of saying that fixing this properly will end up touching on a few more things than just TLSWrap.
- **2020-10-10** @jasnell: @fwilhelm ... while investigating this further, there was another change on the main node.js repo that may have fixed this -- at least, I'm not able to recreate the failure now. It would be excellent if you could give your test a try again rebasing from the master branch to see if the issue persists
- **2020-10-12** @fwilhelm: @jasnell 
Thanks for looking into this. 
I can still trigger the crash on the current master branch:
```
[fwilhelm@fwilhelm node]$ git log
commit 2d83e743d934738a3ad26ed587eb7cfd6ca46081 (HEAD -> master, origin/master, origin/HEAD)
Author: Colin Ihrig <cjihrig@gmail.com>
Date:   Fri Oct 9 16:48:11 2020 -0400
```
built with `./configure --debug --enable-asan && make -j4`
- **2020-10-12** @jasnell: Ok, I was afraid of that. I'll have a patch with a quick fix shortly for you to test
- **2020-10-13** @jasnell: Ok, please give the following patch a try to see if it resolves the issue. It appears to fix it on my end using valgrind to test.

```diff
From 7b935231653f64c2f5eca8dd42e75b8c336aebca Mon Sep 17 00:00:00 2001
From: James M Snell <jasnell@gmail.com>
Date: Mon, 12 Oct 2020 17:26:44 -0700
Subject: [PATCH] src: fixup use-after-free in TLSWrap

Signed-off-by: James M Snell <jasnell@gmail.com>
---
 src/stream_base.cc |  2 +-
 src/tls_wrap.cc    | 26 ++++++++++++++++----------
 src/tls_wrap.h     |  2 +-
 3 files changed, 18 insertions(+), 12 deletions(-)

diff --git a/src/stream_base.cc b/src/stream_base.cc
index 3ad2017460..795873c530 100644
--- a/src/stream_base.cc
+++ b/src/stream_base.cc
@@ -168,7 +168,7 @@ int StreamBase::Writev(const FunctionCallbackInfo<Value>& args) {

   StreamWriteResult res = Write(*bufs, count, nullptr, req_wrap_obj);
   SetWriteResult(res);
-  if (res.wrap != nullptr && storage_size > 0) {
+  if (res.err == 0 && res.wrap != nullptr && storage_size > 0) {
     res.wrap->SetAllocatedStorage(std::move(storage));
   }
   return res.err;
diff --git a/src/tls_wrap.cc b/src/tls_wrap.cc
index 908e3899db..13d47d8035 100644
--- a/src/tls_wrap.cc
+++ b/src/tls_wrap.cc
@@ -280,25 +280,25 @@ void TLSWrap::SSLInfoCallback(const SSL* ssl_, int where, int ret) {
 }


-void TLSWrap::EncOut() {
+int TLSWrap::EncOut() {
   Debug(this, "Trying to write encrypted output");

   // Ignore cycling data if ClientHello wasn't yet parsed
   if (!hello_parser_.IsEnded()) {
     Debug(this, "Returning from EncOut(), hello_parser_ active");
-    return;
+    return 0;
   }

   // Write in progress
   if (write_size_ != 0) {
     Debug(this, "Returning from EncOut(), write currently in progress");
-    return;
+    return 0;
   }

   // Wait for `newSession` callback to be invoked
   if (is_awaiting_new_session()) {
     Debug(this, "Returning from EncOut(), awaiting new session");
-    return;
+    return 0;
   }

   // Split-off queue
@@ -309,7 +309,7 @@ void TLSWrap::EncOut() {

   if (ssl_ == nullptr) {
     Debug(this, "Returning from EncOut(), ssl_ == nullptr");
-    return;
+    return 0;
   }

   // No encrypted output ready to write to the underlying stream.
@@ -335,7 +335,7 @@ void TLSWrap::EncOut() {
         });
       }
     }
-    return;
+    return 0;
   }

   char* data[kSimultaneousBufferCount];
@@ -354,8 +354,12 @@ void TLSWrap::EncOut() {
   Debug(this, "Writing %zu buffers to the underlying stream", count);
   StreamWriteResult res = underlying_stream()->Write(bufs, count);
   if (res.err != 0) {
-    InvokeQueued(res.err);
-    return;
+    if(!in_dowrite_) {
+      InvokeQueued(res.err);
+    } else {
+      current_write_.reset();
+    }
+    return res.err;
   }

   if (!res.async) {
@@ -368,6 +372,8 @@ void TLSWrap::EncOut() {
       OnStreamAfterWrite(nullptr, 0);
     });
   }
+
+  return 0;
 }


@@ -820,10 +826,10 @@ int TLSWrap::DoWrite(WriteWrap* w,
   // Write any encrypted/handshake output that may be ready.
   // Guard against sync call of current_write_->Done(), its unsupported.
   in_dowrite_ = true;
-  EncOut();
+  int res = EncOut();
   in_dowrite_ = false;

-  return 0;
+  return res;
 }


diff --git a/src/tls_wrap.h b/src/tls_wrap.h
index 3b9a6c8598..5f32a73741 100644
--- a/src/tls_wrap.h
+++ b/src/tls_wrap.h
@@ -124,7 +124,7 @@ class TLSWrap : public AsyncWrap,
   //
   // EncIn() doesn't exist. Encrypted data is pushed from underlying stream into
   // enc_in_ via the stream listener's OnStreamAlloc()/OnStreamRead() interface.
-  void EncOut();  // Write encrypted data from enc_out_ to underlying stream.
+  int EncOut();  // Write encrypted data from enc_out_ to underlying stream.
   void ClearIn();  // SSL_write() clear data "in" to SSL.
   void ClearOut();  // SSL_read() clear text "out" from SSL.

--
2.17.1
```
- **2020-10-13** @fwilhelm: The patch looks good to me and the UaF doesn't trigger anymore once it is applied.
- **2020-10-13** @jasnell: Awesome ok... at this point we've Identified two potential ways of fixing this in nodejs/node master branch and for both the pending 15.0.0 release and 14.x branch. I will be getting a pull request open in our private security repo to work that fix through. I have not yet investigated backporting the fix to both 12.x and 10.x, both of which will be affected by this also. Will update here once we've made progress on the PRs
- **Report Severity Updated**
- **2020-11-30** @mhdawson: @fwilhelm I see this in the initial report "This bug is subject to a 90 day disclosure deadline. After 90 days elapse, the bug report will become visible to the public. The scheduled disclosure date is 2020-12-21."

The project has been working to build patches/fixes but at this point I'm starting to get concerned that we are not going to make the date. In addition even if we can get ready before the 21st unless it is within the next week or so doing a security release that close to the Christmas holiday may not be appreciated.

I'd like to discuss if the disclosure date can be moved out.
- **2020-12-01** @fwilhelm: @mhdawson I can grant a 14 day grace period as described in our disclosure policy (see https://googleprojectzero.blogspot.com/p/vulnerability-disclosure-faq.html). 

This would move the public disclosure date to Monday 2021-01-04, which seems like a good solution.
Would that work for you?
- **2020-12-01** @jasnell: Thanks for that @fwilhelm, moving out the date would be greatly appreciated ... we have fixes for most of the current versions but we're running into some difficulty for the oldest LTS branch due to some of the necessary base level changes necessary not existing in that branch and a complete lack of time on my part to make those changes. We're working through the issue on our end and really appreciate the patience.
- **2020-12-01** @mhdawson: @fwilhelm thanks for moving it out 14 days as that would help but I have to ask if that is the farthest it can be moved. That is the day after the holidays which relies on our releasers being available (ie not taking any additional holidays) as well as potentially expecting project volunteers to do work over the holiday period.
- **2020-12-08** @fwilhelm: Unfortunately there's no mechanism to delay disclosure beyond 104 days, which would mean the latest date for disclosure would be 2021-01-04. To answer your questions directly, Project Zero does have exceptions for disclosure dates falling on weekends and public holidays, though that doesn't apply in this circumstance.

Any other questions, please let me know.
- **2020-12-11** @mhdawson: I find it disappointing that there is no flexibility to do what's in the best interest of the community.

Security releases have been planned for Jan 4th.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-03-02** @danbev: @fwilhelm I would like to ask if you are able to accept an award for this report?
- **2021-03-11** @fwilhelm: @danbev Thanks for the ping. I'm donating all awards/bounties to Médecins Sans Frontières, so I'm happy to accept it if you want to grant an award.
- **Bounty Awarded**
