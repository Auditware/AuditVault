---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/crlf-injection
  - env/network
substate: "not-applicable"
weakness: "CRLF Injection"
enriched: true
date: 2025-12-25
submitted: 2025-12-24T00:25:06.263Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/curl|curl]]"
reporter: "0x024062870000nosfu"
source: "https://hackerone.com/reports/3477023"
title: "Protocol Smuggling / CRLF Injection via Gopher Protocol allows Arbitrary Command Injection"
---
# Protocol Smuggling / CRLF Injection via Gopher Protocol allows Arbitrary Command Injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** curl | **Disclosed:** 2025-12-25

- Report: [https://hackerone.com/reports/3477023](https://hackerone.com/reports/3477023)
- CWE: CRLF Injection
- Submitted: 2025-12-24T00:25:06.263Z

## Timeline

- **Report Filed**
- **2025-12-24** @bagder: This is injected by the user themselves.

I claim this is already warned about in documentation.
- **2025-12-24** @0x024062870000nosfu: Hi @bagder,

Thank you for the quick review.

I understand that the input is provided by the user. However, my concern is regarding consistency and defense-in-depth for applications using libcurl.

curl actively strips CRLF characters in other contexts (like HTTP headers) to prevent Protocol Smuggling / Response Splitting. The issue here is that Gopher's lack of sanitization allows an attacker to bypass these protections entirely.

If a developer uses libcurl to fetch a URL provided by a user, they might expect curl to handle the protocol safety. By switching the scheme to gopher:// and injecting %0d%0a, an attacker can escape the protocol and issue raw commands to services like Redis or SMTP, turning a simple SSRF into Remote Code Execution.

Could you please clarify if libcurl deliberately delegates the responsibility of sanitizing CRLF for the Gopher protocol to the downstream developer, unlike how it handles HTTP?

Best regards.
- **2025-12-25** @bagder: curl (and libcurl) have always allowed rubbish input in most places, to allow users to try out edge cases and test server implementation etc. curl usually only test for and avoid things that truly breaks curl itself, not just things that create a different request.

The not stripping CRLF from most option is especially documented precisely because all the researchers submitting reports like this, insisting it is a problem when in fact it is a feature.

libcurl does not strip the CRLF for HTTP either for most options.

If CRLF is not intended by the user to be passed to curl, the user should not pass CRLF to curl.
- **2025-12-25** @jimfuller2024: agree with @bagder - apart from this being curl status quo 'forever' on this topic  ... the answer to such things should be from rfc/specs ... unfortunately we know well the gaps there. I do not see any new security issue here.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-12-25** @0x024062870000nosfu: Hi @bagder and @jimfuller2024,

I fully accept and respect the project's philosophy: curl is a power tool that should not second-guess the user's intent. If a user inputs CRLF, curl sends CRLF.

However, I would like to request a reconsideration specifically for the Gopher protocol, distinct from HTTP, for one key reason: The Context of Usage.

Protocol Smuggling Risk: unlike HTTP, Gopher's structure (raw TCP stream) makes it uniquely capable of simulating other protocols (Redis, SMTP, Memcached) perfectly. The impact of a CRLF injection here is not just a malformed request, but often full Remote Code Execution (RCE) on internal networks via SSRF.

Modern Usage: While developers use curl to fuzz/test HTTP servers daily, the legitimate use-case for manually injecting CRLF into a gopher:// URL for debugging purposes is infinitesimally small in 2025. Conversely, the accidental exposure of this via downstream libraries (php-curl, libcurl wrappers) is a massive and recurring security pain point for the ecosystem.

The Proposal: If strictly sanitizing the input is out of scope to preserve the "power tool" capability, would the team consider:

A Warning: Emitting a warning to stderr when CRLF characters are detected specifically in a gopher:// scheme?

Documentation: Explicitly marking Gopher as "Unsafe for untrusted input" in the security documentation, distinguishing it from HTTP?

I believe this small friction could prevent significant downstream vulnerabilities without removing the capability for power users who genuinely need to test raw Gopher streams.

Thanks for your time and for maintaining such an essential tool.

Best regards, 0x0000nosfu
- **2025-12-25** @bagder: > Documentation: Explicitly marking Gopher as "Unsafe for untrusted input" in the security documentation, distinguishing it from HTTP?

We document *all* protocols as unsuitable for untrusted input/URLs.
- **2025-12-25** @0x024062870000nosfu: Understood. Thank you for the clarification regarding the project's stance on documentation and untrusted inputs.

I have no further objections and I agree to the full disclosure of this report.
- **Manually Disclosed**
