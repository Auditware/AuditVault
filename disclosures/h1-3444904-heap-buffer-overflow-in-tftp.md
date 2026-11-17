---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/heap-overflow
  - env/web
substate: "not-applicable"
weakness: "Heap Overflow"
enriched: true
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
