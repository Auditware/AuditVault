---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/crlf-injection
  - env/network
substate: "not-applicable"
weakness: "CRLF Injection"
enriched: true
date: 2025-12-28
submitted: 2025-12-27T16:35:37.975Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/curl|curl]]"
reporter: "efrsxcv"
source: "https://hackerone.com/reports/3479984"
title: "CRLF Injection / Protocol Smuggling in libcurl via CURLOPT_USERNAME (IMAP)"
---
# CRLF Injection / Protocol Smuggling in libcurl via CURLOPT_USERNAME (IMAP)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** curl | **Disclosed:** 2025-12-28

- Report: [https://hackerone.com/reports/3479984](https://hackerone.com/reports/3479984)
- CWE: CRLF Injection
- Submitted: 2025-12-27T16:35:37.975Z

## Timeline

- **Report Filed**
- **2025-12-27** @efrsxcv: Hi team curl, just to clarify the impact

This vulnerability triggers via the libcurl API (CURLOPT_USERNAME), not via local configuration files. This means it introduces a Remote Attack Vector.

For example, a web application using libcurl to authenticate users against an IMAP/SMTP server would be vulnerable to Protocol Injection/Smuggling simply by passing unsanitized user input from a web form to curl_easy_setopt. The library fails to escape the CRLF characters locally before sending them over the wire, breaking the protocol integrity.

I have confirmed this behavior locally with the provided PoC.
- **2025-12-27** @efrsxcv: [UPDATE] Variant Analysis: POP3 is also vulnerable

Following up on my initial report, I performed a variant analysis on other protocols supported by libcurl. I have confirmed that POP3 is also vulnerable to the same CRLF injection in lib/pop3.c.

Proof of Concept (POP3): I targeted a local netcat listener mimicking a POP3 server.

Payload: admin\r\nDELE 1 (in CURLOPT_USERNAME)

Observed Output:
USER admin
DELE 1

The DELE 1 command is injected successfully on a new line, allowing an attacker to delete messages or execute other POP3 commands if the application passes unsanitized input to the username option.

This confirms a systemic lack of input sanitization for control characters across legacy protocol handlers (imap.c, pop3.c).

{F5161046}{F5161047}
- **2025-12-27** @efrsxcv: [FINAL UPDATE] Trifecta: FTP Protocol is also confirmed vulnerable

I have successfully reproduced the CRLF injection in the FTP protocol handler as well (lib/ftp.c), completing the set (IMAP, POP3, FTP).

PoC Details:
- Target: ftp_state_user function.
- Payload: anonymous\r\nSITE EXEC calc passed to CURLOPT_USERNAME.
- Observed Output (Netcat):
USER anonymous
SITE EXEC calc

Final Conclusion: This is a systemic vulnerability in libcurl's architecture. The library consistently fails to sanitize \r\n characters in the CURLOPT_USERNAME field before passing them to Curl_pp_sendf across all three legacy protocols.

This creates a generic Remote Protocol Injection vector for any application using libcurl to connect to IMAP, POP3, or FTP servers with user-controlled credentials.{F5161065}{F5161066}
- **2025-12-27** @efrsxcv: 4th Protocol Confirmed: RTSP Header Injection

To finalize my audit, I checked the RTSP implementation (lib/rtsp.c) and confirmed it is also vulnerable to CRLF Injection via CURLOPT_RTSP_STREAM_URI.

PoC Output (Netcat):
OPTIONS rtsp://127.0.0.1:8554/movie
X-Hacked: YouArePwned RTSP/1.0
CSeq: 1

Analysis: The \r\n characters injected into the Stream URI broke the RTSP Request Line, forcing X-Hacked: YouArePwned to be interpreted as a new header.
Summary of Vulnerable Protocols:
1. IMAP (Auth/User)
2. POP3 (Auth/User)
3. FTP (Auth/User)
4. RTSP (Request Line/Stream URI)

This confirms a library-wide failure to sanitize input for text-based protocols before writing to the socket. I strongly recommend a centralized fix rather than patching each file individually.{F5161084}{F5161085}
- **2025-12-27** @bagder: This is documented and warned for. Not considered a security problem.
- **2025-12-27** @efrsxcv: Thank you for the quick triage, Badger.

I understand the stance that sanitization is the application's responsibility. I respect that libcurl aims to transmit exactly what is provided.

However, considering that:
1. Many modern wrappers or applications relying on libcurl implicitly assume that the library handles basic protocol encapsulation safety (like preventing header injection).
2. The impact of a developer missing this warning leads to critical protocol injection vulnerabilities (IMAP/SMTP/RTSP smuggling).

Would you be open to considering a "hardening" patch in the future that explicitly rejects CRLF in specific options like CURLOPT_USERNAME/CURLOPT_RTSP_STREAM_URI? Or perhaps making the warning in the documentation more prominent for these specific options?

Regardless of the decision, thanks for maintaining curl
- **2025-12-27** @bagder: Also reported like 37 times before
- **2025-12-27** @bagder: We're always open to discussions and improvements, but this is the wrong forum for those.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
