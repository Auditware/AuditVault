---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2024-04-08
submitted: 2024-01-15T14:48:55.123Z
bounty_usd: null
votes: 65
cve: "CVE-2024-27983"
program: "[[programs/nodejs|Node.js]]"
reporter: "bart"
source: "https://hackerone.com/reports/2319584"
title: "'Assertion failed' in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash"
---
# "Assertion failed" in node::http2::Http2Session::~Http2Session() leads to HTTP/2 server crash

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 65 | **Program:** Node.js | **Disclosed:** 2024-04-08

- Report: [https://hackerone.com/reports/2319584](https://hackerone.com/reports/2319584)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-27983
- Submitted: 2024-01-15T14:48:55.123Z

## Report summary

An attacker can make the Node.js HTTP/2 server completely unavailable by sending a small amount of HTTP/2 frames packets with a few HTTP/2 frames inside. It is possible to leave some data in nghttp2 memory after reset when headers with HTTP/2 CONTINUATION frame are sent to the server and then a TCP connection is abruptly closed by the client triggering the Http2Session destructor while header frames are still being processed (and stored in memory) causing a race condition.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-01-15** @bart: I haven't yet but I have it on my list. After discovering the issue in Node.js I looked into nghttp2 [session state machine](https://github.com/nghttp2/nghttp2/blob/48168eacdb7815375747cd01b886d65a5c4e0931/lib/nghttp2_session.c) but it was too complicated to digest in a timely manner. Decided to file an issue and investigate later.
- **2024-01-15** @bart: I spent some time reading nghttp2 code and I _think_ the issue is happening because of race condition caused by nghttp2 session `reset()` and a callback executed when `CONTINUATION` frame is parsed. When `CONTINUATION` frame arrives the following chain on events occur:
* state machine is in [`NGHTTP2_IB_EXPECT_CONTINUATION` state](https://github.com/nghttp2/nghttp2/blob/48168eacdb7815375747cd01b886d65a5c4e0931/lib/nghttp2_session.c#L6892),
* we go the happy path so state is changed to `NGHTTP2_IB_READ_HEADER_BLOCK`, from there it calls:
* `session_after_header_block_received` which calls:
* `session_call_on_frame_received` which calls:
* `on_frame_recv_callback`.

The last one calls `OnFrameReceive` callback in node.js, later: `HandleHeadersFrame` which does some memory counter update:
```
  DecrementCurrentSessionMemory(stream->current_headers_length_);
  stream->current_headers_length_ = 0;
```

Now, when `HandleHeadersFrame` and `Http2Session::~Http2Session()` are executed at the same time it's possible that they will update the `current_session_memory_` variable at the same time:

`HandleHeadersFrame` | `~Http2Session()`
-|-
᠎ |  `CHECK(!is_in_scope());`
᠎ |  `Debug(this, "freeing nghttp2 session");`
᠎ |  `// Explicitly reset session_ so the subsequent`
᠎ |  `// current_nghttp2_memory_ check passes.`
᠎ |  `session_.reset();`
`DecrementCurrentSessionMemory(stream->current_headers_length_);` | 	
᠎ |  `CHECK_EQ(current_nghttp2_memory_, 0);`

It seems the issue is isolated to Node.js.

I don't know nghttp2 internals very well so it's possible I'm completely wrong. Hope it helps, though.
- **2024-01-16** @mcollina: Thanks, it does!
- **2024-02-19** @bart: FYI, because very similar issues are present in multiple open-source HTTP/2 servers, CERT/CC has opened a Vulnerability Coordination Case (issue VU#421644).
- **2024-02-23** @bart: Hey, it's been over a moment since I reported this. Any news? I can see you were added to CERT/CC's VINCE. Do you want to share some news there?
- **2024-02-27** @mhdawson: @mcollina I assume once we get the Alpha-omega contract signed we should get that resource working on a fix.
- **2024-03-26** @rafaelgss: Hi @bart!

Could you please check if the following patch fixes the problem entirely?

```diff
diff --git a/src/node_http2.cc b/src/node_http2.cc
index 0d0faaaa752..8668b8ef730 100644
--- a/src/node_http2.cc
+++ b/src/node_http2.cc
@@ -578,7 +578,7 @@ Http2Session::Http2Session(Http2State* http2_state,
       nghttp2_session_server_new3 :
       nghttp2_session_client_new3;

-  nghttp2_mem alloc_info = MakeAllocator();
+  /* nghttp2_mem alloc_info = MakeAllocator(); */

   // This should fail only if the system is out of memory, which
   // is going to cause lots of other problems anyway, or if any
@@ -591,7 +591,7 @@ Http2Session::Http2Session(Http2State* http2_state,
       callback_struct_saved[hasGetPaddingCallback ? 1 : 0].callbacks.get(),
       this,
       *opts,
-      &alloc_info), 0);
+      NULL), 0);
   session_.reset(session);

   outgoing_storage_.reserve(1024);
```
- **2024-03-26** @bart: @rafaelgss it looks like it should fix the issue however I don't know how to compile Node.js to test it. In my first message I shared exploit code, can you try to run it against patched binary?
- **2024-03-26** @rafaelgss: I ran and it doesn't crash the Node.js server anymore. I just wanted to double-check with you. If you want to compile Node.js, you need to check https://github.com/nodejs/node/blob/main/BUILDING.md
- **2024-03-29** @bart: Could you share CVE ID for this issue, if there is one already?
- **Cve Id Added**
- **2024-04-01** @rafaelgss: CVE-2024-27983
- **2024-04-01** @bart: Could you update [VINCE](https://kb.cert.org/vince/) so CERT/CC can update their Vulnerability Note? Can you provide a link to Security Advisory upfront?
- **Report Resolved**
- **Agreed On Going Public**
- **2024-04-03** @bart: Thank you for fixing it. Could you add my full name: Bartek Nowotarski and (optionally) link to my website (https://nowotarski.info/) in the advisory here: https://nodejs.org/en/blog/vulnerability/april-2024-security-releases ?
- **Agreed On Going Public**
- **Report Became Public**
- **2024-04-08** @bart: More information about this vulnerability can be found at: https://nowotarski.info/http2-continuation-flood-technical-details/
