---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - os/windows
substate: "not-applicable"
weakness: null
enriched: true
date: 2025-12-18
submitted: 2025-12-18T17:23:11.320Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/curl|curl]]"
reporter: "im4x"
source: "https://hackerone.com/reports/3470649"
title: "File URL UNC Path Access (Windows SSRF)"
---
# File URL UNC Path Access (Windows SSRF)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** curl | **Disclosed:** 2025-12-18

- Report: [https://hackerone.com/reports/3470649](https://hackerone.com/reports/3470649)
- CWE: N/A
- Submitted: 2025-12-18T17:23:11.320Z

## Timeline

- **Report Filed**
- **2025-12-18** @bagder: This sounds very similar to https://curl.se/docs/CVE-2019-15601.html

It has been deemed quite impossible to prevent Windows from doing network accesses when using the file system.
- **2025-12-18** @im4x: Hi ,

Thank you for the reference to CVE-2019-15601. I agree there is some overlap in that both involve Windows filesystem behavior.

However, I believe this issue differs in that curl explicitly accepts file://<hostname>/ URLs, which causes a URL scheme typically expected to be local-only to be silently translated into a remote SMB network access. This happens at the URL handling stage in curl, before any unavoidable Windows filesystem behavior.

While Windows may perform network access once a UNC path is reached, curl can still reasonably restrict or warn about constructing UNC paths from file:// URLs, especially given the security implications of silent NTLM authentication.

Best regards
- **2025-12-18** @bagder: Documented in [URL-SYNTAX.md](https://curl.se/docs/url-syntax.html#windows-specific-file-details):

> The Windows operating system itself converts some file accesses to perform network accesses over SMB/CIFS, through several different file path patterns. This way, a file:// URL passed to curl might be converted into a network access inadvertently and unknowingly to curl. This is a Windows feature curl cannot control or disable.
- **2025-12-18** @bagder: Basically, this is a game we can't win. We cannot properly prevent Windows from accessing the network so we have instead documented it and warn about it.

I don't think avoiding *some* of theses accesses add much protection and it would just lead us to get even more reports from people finding yet new ways.

So: `file://` accesses on Windows may use the network. That's an unfortunate but known risk with using `file://` with curl on Windows.
- **2025-12-18** @im4x: I understand and agree that once a UNC path is reached, the resulting network access is a Windows behavior that curl cannot control.

My concern was primarily about the security expectation around accepting file://<hostname>/ URLs in the first place, but I acknowledge your explanation and the documented behavior in URL-SYNTAX.md.

Thank you for taking the time to review and explain this.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
