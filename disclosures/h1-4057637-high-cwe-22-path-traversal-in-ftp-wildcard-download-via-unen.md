---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "informative"
weakness: "Path Traversal"
enriched: true
body: true
date: 2026-09-26
submitted: 2026-09-24T21:11:41.917Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/curl|curl]]"
reporter: "mrtomato"
source: "https://hackerone.com/reports/4057637"
title: "[HIGH] CWE-22 — Path Traversal in FTP Wildcard Download via Unencoded `.` in Escaped Filenames"
---
# [HIGH] CWE-22 — Path Traversal in FTP Wildcard Download via Unencoded `.` in Escaped Filenames

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** curl | **Disclosed:** 2026-09-26

- Report: [https://hackerone.com/reports/4057637](https://hackerone.com/reports/4057637)
- CWE: Path Traversal
- Submitted: 2026-09-24T21:11:41.917Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
A malicious or MITM'd FTP server can cause a client using `CURLOPT_WILDCARDMATCH` to download files outside the intended remote directory, by returning a LIST response with a filename containing `..` path-traversal sequences.

### Details
In the CURLWC_DOWNLOADING state (`lib/ftp.c:4079-4095`), each filename returned by the server's LIST response is escaped with `curl_easy_escape()` before being appended to the current wildcard path:

    `char *enc = curl_easy_escape(NULL, finfo->filename, 0);`
    ...
    `tmp_path = curl_maprintf("%s%s", wildcard->path, enc);`
    ...
    `ftp->pathalloc = ftp->path = tmp_path;`

`curl_easy_escape()` percent-encodes everything except the RFC 3986 unreserved character set (A-Za-z0-9-._~), critically, `.` is NOT encoded. A filename of `../etc/passwd` therefore escapes to `..%2Fetc%2Fpasswd` (dots preserved literally, only the `/` gets encoded).

Immediately afterward, `ftp_parse_url_path()` (`lib/ftp.c:207-227`) is called on this same path, and its very first step is:

    `result = Curl_urldecode(ftp->path, 0, &ftpc->rawpath, &pathLen, REJECT_CTRL);`

This URL-decodes the path, reconstructing the literal `../etc/passwd` sequence. `REJECT_CTRL` only rejects control characters (confirmed by reading Curl_urldecode's REJECT_CTRL handling), there is no `..`-component filtering or path-normalization check anywhere in this flow before the resulting path is used to drive the subsequent CWD/RETR sequence.

### PoC
1. Attacker controls or MITMs an FTP server.
2. The client application uses wildcard matching:
   `curl_easy_setopt(curl, CURLOPT_WILDCARDMATCH, 1L)` against a URL like `ftp://server/pub/*.txt`
3. The attacker's FTP LIST response includes a filename such as `"../../etc/passwd"` (or an absolute-looking component).
4. `curl_easy_escape()` encodes it to `"..%2F..%2Fetc%2Fpasswd"` (dots preserved, slashes encoded).
5. It is concatenated onto the current wildcard path.
6. `ftp_parse_url_path()` -> `Curl_urldecode()` decodes it straight back to `"../../etc/passwd"` (or similar), with only control-character filtering.
7. The resulting path drives the client's CWD/RETR sequence, traversing outside the directory the calling application intended to browse.

**Suggested patch:**
```diff
After URL-decoding in ftp_parse_url_path(), validate that the resulting
path does not contain ".." components that traverse outside the intended
directory. Alternatively, validate finfo->filename in the
CURLWC_DOWNLOADING state before it is ever escaped reject filenames
containing "/", "..", or an absolute-path leading "/".
```

## Impact

## Summary:
An application using CURLOPT_WILDCARDMATCH against an untrusted or compromised FTP server can be made to download files from arbitrary paths on that server, outside the directory the calling code intended, an information-disclosure / path-confinement bypass. Requires the calling application to have opted into wildcard matching; does not affect the default (non-wildcard) FTP/SFTP/HTTP transfer paths.

## Timeline

- **Report Filed**
- **2026-09-24** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-09-24** @bagder: @mrtomato I believe this problem does not exist in any curl release, does it?
- **2026-09-24** @bagder: Also: a malicious server that can return bad file names can already serve anything it wants, it doesn't need to trick the client into asking for it.
- **Report Informative**
- **Agreed On Going Public**
- **2026-09-24** @mrtomato: Thanks for taking the time to review this, and for merging a fix and sorry for not diffing against a release tag before writing the original report. The mechanism I originally described (the curl_easy_escape()/Curl_urldecode() round-trip) only exists on main.

For the record, since that specific question was raised: I went back and re-traced the underlying gap (unfiltered LIST filenames reaching CWD/MKD with no escaping) against curl-8_22_0 specifically, and it's present there too via a simpler path, the filename is concatenated straight into the FTP path, no round-trip needed. That's the same gap #23089 closes, so this isn't reopening the classification, just closing the loop on whether it applied to a release.

And I think your call is right, a malicious/MITM'd server that can hand back a bad filename can already serve whatever it wants on the path the client requested, so redirecting it to a different path first doesn't grant any new capability. Appreciate you explaining that, and for the fix.
- **Manually Disclosed**
