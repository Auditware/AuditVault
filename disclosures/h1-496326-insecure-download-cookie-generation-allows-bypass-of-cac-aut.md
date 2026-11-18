---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cryptographic-issues-generic
  - env/web
substate: "resolved"
weakness: "Cryptographic Issues - Generic"
enriched: true
body: true
date: 2020-05-11
submitted: 2019-02-15T01:56:00.274Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cablej_dds"
source: "https://hackerone.com/reports/496326"
title: "█████████ - Insecure download cookie generation allows bypass of CAC authentication, access to deleted and locked files"
---
# █████████ - Insecure download cookie generation allows bypass of CAC authentication, access to deleted and locked files

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/496326](https://hackerone.com/reports/496326)
- CWE: Cryptographic Issues - Generic
- Submitted: 2019-02-15T01:56:00.274Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

To download a file, ████ directs users to `/██████████/Download.aspx` and sets a cookie authenticating the download. The cookie looks like this:

```
pickup=Subject=&PackageID=MTU4NDgzMTU=███
```

If an attacker can generate this cookie, this allows downloading a file. As it turns out, the generation of the cookie is fairly straightforward and requires no server-side key, only a file ID and its associated password. The components are:

1. The file ID, base 64 encoded, followed by a dash
2. The SHA512 hash of the plaintext file ID, base 64 encoded
3. The secret key of the package (as sent in the email), base 64 encoded, followed by a dash
4. The SHA2512 hash of the secret key, base 64 encoded

By generating a cookie using this format, an attacker can accomplish the following:

1. Bypass CAC-enforced files.
2. Bypass deleted files (tested when a user deletes their package). Untested if this allows accessing historical files.
3. Bypass "locked" files that have already been downloaded.

For instance, after attempting to download a deleted package on █████, █████ displays the following error:

> The package Is no longer available For download. The file(s) has been permanently deleted from ███████. You will have To contact the sender And ask them To upload the file(s) again. 

However, this is not true. By making a crafted request to `/█████████/Download.aspx` given the above cookies, a user can still download deleted files. This may also apply to past files, meaning that all previous uploaded files may not be deleted. I will test this when files I have submitted expire.

## Impact

Significant bypasses to █████████ security controls, including:

- Bypass CAC protections
- Download files that ███ says have been deleted from the file system
- Download locked files that have already been downloaded

It is unclear at the moment if this also applies to files that have expired after a set period of time. I will retest when files I have uploaded have expired.

## Step-by-step Reproduction Instructions

1. Visit https://███████/██████/pickupfiles.aspx?id=15849581, a file I uploaded and deleted.
2. Try the password `█████████`. Observe that an error is displayed that the file is deleted.
3. As described above, generate the following cookie, based on the file ID and password.

```
pickup=Subject=&PackageID=MTU4NDk1ODE=█████████
```

4. Make the following GET request with the cookie:

```
GET /████████/Download.aspx?PackageID=15849581&FileName=dog.jpg HTTP/1.1
Host: ███████
Connection: close
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: https://█████/██████████/pickupfiles.aspx?id=15849581
Accept-Language: en-US,en;q=0.9
Cookie:  pickup=Subject=&PackageID=MTU4NDk1ODE=████

```

5. Observe that the file is returned, demonstrating that it has not been deleted.

This also has been tested with CAC-enforced files and files that are "locked" due to already having been downloaded.

## Impact

.

## Timeline

- **Report Filed**
- **2019-02-15** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **2019-02-27** @ag3nt-j1: I'm going to take a look at FIPS 140-2 and some of the STIG/SRG requirements regarding approved hashing and encryption and see if they are in violation of anything.
- **Report Needs More Info**
- **Report Inactive**
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-12-09** @agent-r5: We will put it in the queue for disclosure.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
