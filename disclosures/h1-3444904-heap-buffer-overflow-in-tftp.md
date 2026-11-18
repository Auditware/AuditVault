---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/heap-overflow
  - env/web
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "not-applicable"
weakness: "Heap Overflow"
enriched: true
body: true
date: 2025-12-01
submitted: 2025-11-29T17:06:00.927Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/curl|curl]]"
reporter: "helspy"
source: "https://hackerone.com/reports/3444904"
title: "Heap Buffer Overflow in TFTP"
---
# Heap Buffer Overflow in TFTP

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** curl | **Disclosed:** 2025-12-01

- Report: [https://hackerone.com/reports/3444904](https://hackerone.com/reports/3444904)
- CWE: Heap Overflow
- Submitted: 2025-11-29T17:06:00.927Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary:
A heap buffer overflow vulnerability exists in the TFTP implementation of libcurl. The vulnerability is triggered when a malicious TFTP server sends an OACK (Option  acknowledgment) packet with a blksize option that is larger than the default block size (512 bytes). libcurl updates its internal block size variable but fails to reallocate the receive and send buffers (rpacket and spacket). When the application subsequently receives data (in tftp_rx) or sends data (in tftp_tx) using the larger block size, it writes past the end of the allocated buffer, leading to a heap buffer overflow.


# Affected version
**curl 8.18.0-DEV** (based on LIBCURL_VERSION in  include/curl/curlver.h) Platform: Windows (reproduced on)


# Steps To Reproduce:
1. Save the provided reproduction script as tftp_repro.py.
2. Run the script: python tftp_repro.py. This starts a malicious TFTP server on port 6969.
3. In another terminal, run a curl command to fetch a file from this server: curl tftp://localhost:6969/test (Note: Ensure you are using a curl build that includes this vulnerable code. If testing with a system curl, it might not be vulnerable or might be a different version).
4. The server will send an OACK with blksize=2048 and then a DATA packet of 2048 bytes.
5. The curl client will crash or exhibit undefined behavior due to the heap overflow.

# Supporting Material/References:
Vulnerable Code Location: **lib/tftp.c**, function: **tftp_parse_option_ack**
 updates **state->blksize** without reallocating **state->spacket.data** and **state->rpacket.data**.
Reproduction Script: **tftp_repro.py**

## Impact

# Summary:
This vulnerability allows a malicious TFTP server to cause a heap buffer overflow on the client.

**Remote Code Execution (RCE)**: By carefully crafting the payload in the DATA packet, an attacker could overwrite critical heap metadata or function pointers, potentially leading to arbitrary code execution on the victim's machine with the privileges of the curl process.

**Denial of Service (DoS)**: The overflow can corrupt memory structures, causing the curl application to crash or behave unpredictably, leading to a denial of service.

## Impact

## Summary:
This vulnerability allows a malicious TFTP server to cause a heap buffer overflow on the client.

**Remote Code Execution (RCE)**: By carefully crafting the payload in the DATA packet, an attacker could overwrite critical heap metadata or function pointers, potentially leading to arbitrary code execution on the victim's machine with the privileges of the curl process.
**Denial of Service (DoS)**: The overflow can corrupt memory structures, causing the curl application to crash or behave unpredictably, leading to a denial of service.

## Timeline

- **Report Filed**
- **2025-11-29** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-11-29** @bagder: @helspy there is no tftp_repro.py script attached?
- **2025-11-30** @helspy: sorry! here is the program...
```
import socket
import struct

PORT = 6969
blksz= 2048
def start_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', PORT))
    print(f" server started on port {PORT}")
    while True:
        data, addr = sock.recvfrom(1024)
        print(addr)
        opcode = struct.unpack('!H', data[:2])[0]
        
        if opcode == 1 or opcode == 2:
            print("Sending oack")
            oack = struct.pack('!H', 6) + b'blksize\0' + str(blksz).encode() + b'\0'
            sock.sendto(oack, addr)
            if opcode == 1:
                print("sending data packet")
                payload = b'A' * blksz
                data_pkt = struct.pack('!HH', 3, 1) + payload
                sock.sendto(data_pkt, addr)
if __name__ == "__main__":
    start_server()
```
- **2025-11-30** @helspy: It seems like in tftp_parse_option_ack, when the server sends a new block size, the code checks:
```
if(blksize > state->requested_blksize) {
    failf(data, "server requested blksize larger than allocated");
    return CURLE_TFTP_ILLEGAL;
}
```
this check force the client to use a block size larger than what was originally allocated so might prevent heap overflow. 
I was parallelly trying to reproduce while writing the report(submitted too early) which was a mistake hence the issue. Apologies, you may close this issue.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
