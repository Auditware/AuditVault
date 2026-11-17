---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "not-applicable"
weakness: "Path Traversal"
enriched: true
date: 2025-12-15
submitted: 2025-12-15T07:45:06.227Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "ba5"
source: "https://hackerone.com/reports/3465094"
title: "Path Traversal Bypass in file:// URLs Due to Incomplete URL-Encoded Path Normalization"
---
# Path Traversal Bypass in file:// URLs Due to Incomplete URL-Encoded Path Normalization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2025-12-15

- Report: [https://hackerone.com/reports/3465094](https://hackerone.com/reports/3465094)
- CWE: Path Traversal
- Submitted: 2025-12-15T07:45:06.227Z

## Timeline

- **Report Filed**
- **2025-12-15** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-12-15** @ba5: Hey @bagder ,

Thank you for your response. Waiting your feedback.
have a nice day ahead 

Regards
- **2025-12-15** @bagder: It seems pointless to do this on `file://` since curl can already access the full file system.

You can just use `file:///etc/passwd` directly. No need to complicate it.
- **2025-12-15** @ba5: Hey @bagder 

Yes you are correct that for file:// URLs, direct filesystem access is already possible (e.g., `file:///etc/passwd`). But, I believe this issue is still significant for the following reasons:

### 1. RFC 3986 Compliance Issue
The `dedotdotify()` function is explicitly designed to implement **RFC 3986 section 5.2.4 "Remove Dot Segments"**. This is a standard requirement for URL path normalization. The function currently fails to work correctly for URL-encoded sequences, representing a **correctness bug** that violates the RFC standard it's supposed to implement.

**Evidence**: The function documentation at `lib/urlapi.c:780-785` states:
```c
/*
 * dedotdotify()
 * This function gets a null-terminated path with dot and dotdot sequences
 * passed in and strips them off according to the rules in RFC 3986 section
 * 5.2.4.
 */
```

The function is intended to normalize paths per RFC 3986, but it doesn't handle URL-encoded slashes (`%2f`), making it non-compliant with the standard.

### 2. Universal Impact Across All URL Schemes

`dedotdotify()` is used for **ALL URL schemes**, not just file://. The bug affects:

- **HTTP/HTTPS URLs**: Used in redirect processing (see `lib/http.c:1281`)
- **FTP URLs**: Path normalization during FTP operations
- **All other protocols**: Any URL scheme that uses path normalization

**Code Evidence**: `lib/urlapi.c:1230-1242` shows `dedotdotify()` is called for all URL schemes when `CURLU_PATH_AS_IS` is not set:
```c
if(!(flags & CURLU_PATH_AS_IS)) {
  /* remove ../ and ./ sequences according to RFC3986 */
  char *dedot;
  int err = dedotdotify(path, pathlen, &dedot);
  // ...
}
```

### 3. HTTP/HTTPS Redirect Processing Impact

For HTTP/HTTPS URLs, proper path normalization is critical when processing redirects. The bug means that redirects containing URL-encoded path traversal sequences are not properly normalized, which can lead to:

- Non-RFC-compliant URL handling
- Potential bypass of URL filtering systems that expect normalization
- Unexpected behavior in applications relying on curl's normalization

**Example Scenario**:
```
Server redirects to: https://example.com/%2f%2e%2e%2f%2e%2e%2fadmin%2fconfig
Expected after normalization: https://example.com/admin/config
Actual (due to bug): https://example.com/%2f%2e%2e%2f%2e%2e%2fadmin%2fconfig (unchanged)
```

### 4. Security Filtering Bypass Potential

Security systems may implement URL filtering that:
- Blocks literal `../` sequences
- Relies on curl to normalize URL-encoded sequences first
- Expects normalized paths for further validation

The bug means URL-encoded traversal sequences bypass normalization, potentially allowing them to pass through filters that expect normalization to occur.

**Example**:
- Security filter blocks: `https://example.com/../../admin`
- Filter allows: `https://example.com/%2f%2e%2e%2f%2e%2e%2fadmin` (expecting curl to normalize it first)
- Due to bug: Normalization doesn't occur, encoded sequence passes through

### 5. Correctness Bug Affecting All Applications

Even if not directly exploitable for file:// URLs with absolute paths, this is still a **correctness bug** that affects:

- **RFC 3986 compliance**: The function doesn't work as specified by the standard
- **Expected behavior**: Applications expect path normalization to work correctly
- **Interoperability**: Non-compliant behavior may cause issues with systems expecting RFC-standard normalization
- **Relative URL resolution**: Scenarios where relative URLs with encoded paths should be normalized

### 6. Test Case Evidence

The unit test `tests/unit/unit1395.c` line 44 demonstrates this is recognized behavior:
```c
{ "%2f%2e%2e%2f", "%2f%2e%2e%2f" },  // Input == Output (not normalized)
```

This test case shows that `%2f%2e%2e%2f` (encoded `/../`) is NOT normalized, confirming the bug exists.

## Conclusion

While we both acknowledge that for file:// URLs with absolute paths, direct filesystem access is already possible, this issue represents:

1. **A correctness bug** in RFC 3986 path normalization implementation
2. **Impact on HTTP/HTTPS URL processing** where normalization is critical
3. **Potential security implications** for systems relying on curl's normalization
4. **Non-compliance** with the RFC standard the function is supposed to implement

I believe this should be fixed to ensure:
- RFC 3986 compliance
- Correct behavior across all URL schemes
- Proper handling of URL-encoded path sequences
- Applications can rely on curl's normalization working as specified
- **2025-12-15** @bagder: First, please stop using AI when responding. It is enough if you answer with no more than 20 lines. The rest is just word sallad.

> The function is intended to normalize paths per RFC 3986, but it doesn't handle URL-encoded slashes (%2f), making it non-compliant with the standard.

No.  RFC 3986 says nothing about encoded slashes. *slashes* in URLs are treated special, and they are also not the same as the encoded version of the slash. There are "raw" and encoded slashes for a reason. An encoded slash is passed on as encoded.

This report claims **Path Traversal Bypass in file:// URLs** and that simply is not true. It does not bypass anything because there is nothing to bypass for file://. Or we could say that curl always bypasses it, with or without encoded slashes.
- **2025-12-15** @ba5: you are correct. I can withdraw this finding.
Thank you.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-12-15** @bagder: You were clearly mislead by the AI. You will not be able to submit more issues to us. You are banned.
- **Manually Disclosed**
- **Comments Closed**
