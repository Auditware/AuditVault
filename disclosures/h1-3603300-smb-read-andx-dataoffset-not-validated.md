---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "not-applicable"
weakness: null
enriched: true
body: true
date: 2026-03-16
submitted: 2026-03-13T16:59:27.491Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "x2048"
source: "https://hackerone.com/reports/3603300"
title: "SMB READ_ANDX DataOffset not validated"
---
# SMB READ_ANDX DataOffset not validated

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2026-03-16

- Report: [https://hackerone.com/reports/3603300](https://hackerone.com/reports/3603300)
- CWE: N/A
- Submitted: 2026-03-13T16:59:27.491Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
in `smb_request_state()` case `SMB_DOWNLOAD` curl reads two server-controlled fields from a `READ_ANDX` response and uses them to decide where in the receive buffer file data starts.

```c
/* lib/smb.c */
len = Curl_read16_le((const unsigned char *)msg +
                     sizeof(struct smb_header) + 11);
off = Curl_read16_le((const unsigned char *)msg +
                     sizeof(struct smb_header) + 13);
if(len > 0) {
    if(off + sizeof(unsigned int) + len > smbc->got) {
        failf(data, "Invalid input packet");
        result = CURLE_RECV_ERROR;
    }
    else
        result = Curl_client_write(data, CLIENTWRITE_BODY,
                                   (char *)msg + off + sizeof(unsigned int),
                                   len);
}
```

`off` and `len` are both `unsigned short` values read directly from the server response. the only check performed is `off + sizeof(unsigned int) + len > smbc->got`

this is a pure upper bound check. there is no lower bound check on `off`. the SMB specification requires `DataOffset` to point past all headers and parameter words, for a standard 12-word `READ_ANDX` response that minimum is 59 bytes
from the start of the SMB frame, or 63 bytes from the start of `recv_buf` (which includes the 4-byte NBT prefix). curl has no such minimum. `sizeof(struct smb_header)` in this codebase is 36 bytes (4-byte NBT session header + 32-byte SMB header). `msg` points to `smbc->recv_buf`, the raw receive buffer, so `msg + 0 + 4 = recv_buf[4]` is the first byte of the SMB magic field `\xff S M B`.

## Affected version
latest master

## Steps To Reproduce:
### exploit

a server sets `DataOffset = 0x0000` and `DataLength = N` in its `READ_ANDX` response. the bounds check becomes `0 + 4 + N > smbc->got`. for any well formed response (minimum `smbc->got` ≥ 63 bytes for the size check at line 1088 to pass), this evaluates false for any `N ≤ smbc->got − 5`. the check passes. curl then calls:

```c
Curl_client_write(data, CLIENTWRITE_BODY,
                  (char *)msg + 0 + 4,   /* = recv_buf[4] */
                  N);
```

`recv_buf[4]` is `smb_header.magic[0]` = `0xff`. the application receives `N` bytes of raw SMB receive-buffer content as "file data". with `DataLength = 28` and a total response of 91 bytes:

```
recv_buf[4..31] delivered to application:

offset  value   field
  4     ff      magic[0]
  5     53      magic[1]  'S'
  6     4d      magic[2]  'M'
  7     42      magic[3]  'B'
  8     2e      command   (READ_ANDX)
  9-12  ??      status    (4 bytes)
  13    ??      flags
  14-15 ??      flags2
  16-17 ??      pid_high
  18-25 ??      signature (8 bytes — HMAC-MD5 in authenticated sessions)
  26-27 ??      pad
  28-29 ??      tid
  30-31 ??      pid
```

the attacker controls the content of all of these fields because they are fields in the server's own response. in an authenticated session, `signature` holds HMAC-MD5-derived session keying material.

### proof of concept

a minimal Python SMB server was written that completes the full handshake (NEGOTIATE → SESSION_SETUP_ANDX → TREE_CONNECT_ANDX → NT_CREATE_ANDX → READ_ANDX) and then sends a `READ_ANDX` response with `DataOffset = 0x0000` and `DataLength = 0x001c`. `curl smb://127.0.0.1:14450/share/file --user guest: -o output.bin`

curl exit code is 0 and `output.bin` size is 28 bytes

`output.bin` content:
```
00000000: ff53 4d42 2e00 0000 0088 4100 0000 0000  .SMB......A.....
00000010: 0000 0000 0000 0000 0100 d7ba            ............
```

the first four bytes are `\xff S M B`. this is the SMB magic from the receive buffer. no file data was ever sent by the server. curl wrote internal SMB session state to disk and reported a successful download.

the full protocol trace:
```
--> 0x72 NEGOTIATE
<-- NEGOTIATE response (dialect "NT LM 0.12")
--> 0x73 SESSION_SETUP_ANDX
<-- SESSION_SETUP response (uid=1)
--> 0x75 TREE_CONNECT_ANDX
<-- TREE_CONNECT response (tid=1)
--> 0xa2 NT_CREATE_ANDX
<-- NT_CREATE response (fid=1, end_of_file=28)
--> 0x2e READ_ANDX
<-- READ_ANDX response (DataOffset=0x0000, DataLength=28)  ← exploit
    bounds check: 0+4+28=32 > 91 → false → PASS
    Curl_client_write(recv_buf+4, 28)
--> 0x04 CLOSE
--> 0x71 TREE_DISCONNECT
```

### fix

add a minimum bound check on `off` before the existing check. for a standard `READ_ANDX` response with `word_count = 12`, the earliest valid `DataOffset` is 59 (32-byte SMB body + 1 byte `word_count` + 24 bytes of parameter words +
2 bytes `ByteCount`). the data read pointer must not precede the end of the parameter block.

```c
/* proposed addition at lib/smb.c after line 1096 */
if(off < sizeof(struct smb_header) - sizeof(unsigned int) +
         1 + (SMB_WC_READ_ANDX * sizeof(unsigned short)) +
         sizeof(unsigned short)) {
    failf(data, "Invalid input packet");
    result = CURLE_RECV_ERROR;
    break;
}
```

the concrete minimum for a 12-word response `sizeof(smb_header) − 4 + 1 + 12×2 + 2 = 32 + 1 + 24 + 2 = 59`. any `off < 59` must be rejected.

## Impact

## Summary:

the application receives attacker controlled bytes instead of the requested file, with no indication of failure. any pipeline that acts on the downloaded content operates on data the server dictated. and the `signature`, `tid`, `uid` and `pid` fields from the server's response frame are delivered above the transport layer. in authenticated sessions the signature field contains HMAC-MD5 derived material that is internal to the SMB session and should never be visible to the application. and curl returns exit code 0. automated checks based on exit code or file size will not detect the attack.

## Timeline

- **Report Filed**
- **2026-03-13** @bagder: > the application receives attacker controlled bytes instead of the requested file

Explain to us how a malicious server cannot already provide exactly the bytes it thinks curl should get.
- **2026-03-14** @x2048: fair point. the security concern i was considering was whether recv_buf could contain client side state from previous operations that was not overwritten by the current response. if the buffer is not zeroed between uses and a previous response was larger. DataOffset=0 could potentially expose stale data the server did not send in this response. even if that angle does not hold this might be worth fixing as a robustness issue rather than a security bug. i did not mean to waste your time, sorry about that. :-)
- **2026-03-14** @bagder: > DataOffset=0 could potentially expose stale data the server did not send in this response

I cannot see how that can happen. so I cannot see how this is a security problem.
- **2026-03-14** @x2048: i re-read the code and smb_pop_message() sets smbc->got = 0 and smb_recv_message() always fills the buffer from offset 0 for each new message, you are right, sorry for the confusion. i still stand by that curl silently accepts "malformed" responses but it is not a security vulnerability, so we can probably drop this report. i should have reasoned through the buffer lifecycle before filing. thank you for your patience, i will be more careful before submitting next time.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
