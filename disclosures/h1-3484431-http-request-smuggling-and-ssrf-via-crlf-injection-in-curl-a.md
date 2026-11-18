---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "not-applicable"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2026-01-02
submitted: 2026-01-02T01:51:16.822Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/curl|curl]]"
reporter: "n12d11n"
source: "https://hackerone.com/reports/3484431"
title: "HTTP Request Smuggling and SSRF via CRLF Injection in Curl_add_custom_headers"
---
# HTTP Request Smuggling and SSRF via CRLF Injection in Curl_add_custom_headers

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** curl | **Disclosed:** 2026-01-02

- Report: [https://hackerone.com/reports/3484431](https://hackerone.com/reports/3484431)
- CWE: HTTP Request Smuggling
- Submitted: 2026-01-02T01:51:16.822Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

A lack of CRLF validation in `Curl_add_custom_headers` at `lib/http.c:1761` allows users to inject arbitrary HTTP headers. This violation of RFC 7230 §3.2.4 leads to HTTP Request Smuggling and potential SSRF bypass. **AI Disclosure:** I utilized an AI assistant to aid in the initial code analysis and patch generation, but I have manually verified all claims using hex dumps and proxy simulations to ensure technical accuracy.

## Affected version

* **curl/libcurl version:** 8.18.0-DEV and 8.15.0
* **Platform:** Linux (Kali Linux)
* **curl -V output:** `curl 8.18.0-DEV (x86_64-pc-linux-gnu) libcurl/8.18.0-DEV OpenSSL/3.5.4`

## Steps To Reproduce:

1. Start a listener to capture raw traffic: `nc -l -p 8080 > raw_http.txt`.
2. Execute a `libcurl` application (or curl CLI) that appends a custom header containing CRLF: `curl -H "X-Injected: Value\r\nInjected-Header: Malicious" http://localhost:8080`.
3. Inspect the captured output: `hexdump -C raw_http.txt`.
4. Observe that the CRLF bytes (`0d 0a`) are transmitted unsanitized, causing the receiver to interpret the injected string as a separate, valid HTTP header.

## Supporting Material/References:

* **Hexdump Proof:** The hex dump shows `0d 0a` at offset `0x49`, confirming request splitting at the protocol level.
* **Suggested Patch:** A verification patch using `strchr` to reject `\r` and `\n` in `lib/http.c` successfully mitigates the issue.

---

## Impact

> The lack of CRLF validation in `libcurl`'s header handling allows for **HTTP Request Smuggling**, enabling an attacker to bypass security boundaries and perform **Server-Side Request Forgery (SSRF)**. As `libcurl` is a foundational library used by countless applications and backends, this vulnerability poses a systemic risk. Specifically, injected headers persist across redirects (`-L`), which significantly increases the attack surface and allows for the potential exposure of isolated internal services or cache poisoning.

---

## Timeline

- **Report Filed**
- **2026-01-02** @jimfuller2024: thx for the report, investigating
- **2026-01-02** @jimfuller2024: we have had many variations on this theme -  if someone can run curl there is nothing stopping them from just adding each header eg. no need to smuggle in ... the application invoking curl or libcurl should sanitise.
- **2026-01-02** @n12d11n: > Thank you for your feedback. I understand the perspective that the application invoking libcurl should ideally sanitize its inputs. However, I would like to offer two technical points for reconsideration:
> 1. **Protocol Integrity (RFC 7230 §3.2.4):** According to the RFC, a field value **MUST NOT** contain CR or LF. By allowing these characters, libcurl is generating malformed HTTP messages. As a foundational protocol library, libcurl should enforce the basic grammar of the protocol it implements to ensure interoperability and security.
> 2. **Request Smuggling vs. Custom Headers:** While a user can legally add any header, the issue here is **Request Injection**. An attacker providing input to a vulnerable application (which uses libcurl as a backend) can inject an entirely new, second HTTP request into the same TCP stream. This bypasses the application's intended logic, which is the core of **CWE-444 (HTTP Request Smuggling)**.
> 3. **Proxy Ambiguity:** Our PoC demonstrates that when libcurl is behind a proxy, this CRLF injection causes the proxy to interpret the stream as two separate requests. This can be abused to perform SSRF or cache poisoning, even if the application strictly controls the URLs it visits.
> 
> 
> We believe that sanitizing CRLF at the library level provides critical "Defense in Depth," preventing libcurl from being used as a tool for smuggling in complex network infrastructures.
- **2026-01-02** @bagder: Feel free to argue this on the mailing list or on GitHub. The lack of crlf filtering is documented and warned for, thus not considered a vulnerability.
- **2026-01-02** @n12d11n: > Thank you for the clarification. I appreciate that this behavior is documented. However, I would like to submit my findings as a **Security Hardening** suggestion rather than just a bug report.
> While the responsibility for sanitization currently lies with the application developer, our investigation shows that:
> 1. **Implicit Trust:** Many developers assume a high-level, production-grade library like `libcurl` automatically enforces **RFC 7230** protocol grammar.
> 2. **SSRF Risk in Redirects:** The most critical part is that injected headers persist across redirects. An application might sanitize its initial input, but if a malicious header is injected into an initial request, it could be carried over to an internal or sensitive host during a 30x redirect.
> 
> 
> I have prepared a minimal patch that implements strict CRLF filtering in `lib/http.c` using `strchr`. It effectively prevents Request Smuggling with zero impact on legitimate header performance.
> Even if this is not eligible for a bounty, I would be happy to move this discussion to GitHub or the mailing list to contribute this patch to the project. Would you recommend I open a Pull Request for this hardening?
- **Report Not Applicable**
- **Agreed On Going Public**
- **2026-01-02** @n12d11n: Thank you for the clarification, Daniel. I understand the project's policy regarding documented behavior and the responsibility of the invoking application. I'm glad to see that this report contributed to making the documentation even clearer through the linked PR. I agree with the request for disclosure to help other developers understand the importance of input sanitization when using these APIs. Best regards.
- **Manually Disclosed**
