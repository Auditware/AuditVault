---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/network
substate: "not-applicable"
weakness: "Path Traversal"
enriched: true
date: 2025-12-01
submitted: 2025-11-30T00:07:49.798Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/curl|curl]]"
reporter: "qss"
source: "https://hackerone.com/reports/3445174"
title: "Path Traversal in file:// protocol allows Arbitrary File Read"
---
# Path Traversal in file:// protocol allows Arbitrary File Read

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** curl | **Disclosed:** 2025-12-01

- Report: [https://hackerone.com/reports/3445174](https://hackerone.com/reports/3445174)
- CWE: Path Traversal
- Submitted: 2025-11-30T00:07:49.798Z

## Timeline

- **Report Filed**
- **2025-11-30** @qss: > Hello team,
>
> Following up on my initial report, I've discovered additional interesting behavior in the `file://` path handling that further demonstrates weaknesses in the sanitization logic.
>
> **Finding:** The path traversal sanitizer incorrectly handles double forward-slashes (`//`).
>
> **Steps to Reproduce:**
> 1. Run the following command:
>    ```bash
>    ./src/curl -v "file:///some/random/path/..//..//..//..//..//etc/passwd"
>    ```
> 2. **Actual Result:** `curl` attempts to open the file `/some//etc/passwd`.
>
> **Analysis:**
> It appears that after processing the first `..//` sequence (which correctly resolves `/some/random/path` to `/some/`), the sanitizer stops processing subsequent `..//` sequences. It then incorrectly appends the final part of the path (`etc/passwd`).
>
> While not as severe as the main path traversal issue, this demonstrates a flaw in the normalization logic that could be used to bypass naive filters and further strengthens the case for a complete overhaul of the `file://` path handling.
>
> Thank you.
- **2025-11-30** @bagder: The user can just as well just access the path directly. curl and the user has direct file access. The dot dot removal does not protect the user for file://
- **2025-11-30** @bagder: > ./src/curl "file:///any/dummy/path/../../../../../../etc/passwd"

This path is normalized by curl to become `/etc/passwd`.
- **2025-11-30** @bagder: > file:///some/random/path/..//..//..//..//..//etc/

This path is normalized by curl to become `/some/random//etc/passwd`.

I see no vulnerability here - this seems to work as intended.
- **2025-11-30** @qss: Hi Daniel,

Thank you for the quick and clear explanation. I understand your point regarding `file://` behaving as intended, where curl acts as a direct proxy for user's local file access permissions.

Your reasoning makes sense. However, I suspect this path normalization behavior might have an unintended security impact when applied to remote network protocols where the server, not the user, is supposed to enforce path restrictions.

I am currently setting up a local FTP server to test if the same `../` traversal allows escaping the FTP user's root directory. If this is the case, it would demonstrate a bypass of a server-side security boundary, which is a different scenario than the local `file://` access.

I will post my findings here shortly. I would appreciate it if you could keep this report open for a little longer while I conduct this final test.

Thanks again for your time and consideration.
- **2025-11-30** @qss: You were absolutely right.

I've completed the test against a local vsftpd server configured with a chroot jail. As you predicted, the path traversal was correctly blocked by the FTP server, and curl behaved as expected, denying the directory change.

This confirms your assessment that the path normalization behavior is specific to the `file://` handler and does not carry over to remote protocols where server-side security is enforced.

Thank you for taking the time to explain the design philosophy. I've learned a valuable lesson about context in vulnerability assessment. I agree that this is not a vulnerability.

You can close this report. I appreciate the dialogue.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
