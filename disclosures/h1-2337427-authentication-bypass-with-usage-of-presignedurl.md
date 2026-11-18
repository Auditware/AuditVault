---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-03-22
submitted: 2024-01-27T19:50:47.574Z
bounty_usd: 2000
votes: 44
cve: []
program: "[[programs/owncloud|ownCloud]]"
reporter: "kolokokop"
source: "https://hackerone.com/reports/2337427"
title: "Authentication Bypass with usage of PreSignedURL"
---
# Authentication Bypass with usage of PreSignedURL

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 44 | **Program:** ownCloud | **Disclosed:** 2024-03-22

- Report: [https://hackerone.com/reports/2337427](https://hackerone.com/reports/2337427)
- CWE: Improper Access Control - Generic
- Submitted: 2024-01-27T19:50:47.574Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

## Summary

It was identified that ownCloud Infinite Scale (oCIS) is prone to vulnerability that allows access any file without authentication. Prior knowledge of username and filename is needed to access file.

In this instance, vulnerability was result of the default enabled PreSignedURL, which incorrectly checks the expiry date in `OC-Date` and `OC-Expires` variables. If the date has expired, the signing key has not been checked and access to file is granted.

## Steps to reproduce

1. Login to the ownCloud Infinite Scale instance - e.g. `admin` username was used.

2. Create new file - Press "New" and "Plain text file" - `secret.txt` filename was used.

{F3011022}

3. Add some content to the file - e.g. "secret file content" and save the file.

{F3011023}

In addition, it is possible to check that the file is not public or shared with anyone.

{F3011024}

4. Access the file without authentication with the following link builded with known username and known filename:

`https://{ownload-instance}/remote.php/dav/files/{username}/{filename}?OC-Credential={username}&OC-Verb=GET&OC-Expires=60&OC-Date=2024-01-27T00:00:00.000Z&OC-Signature=notchecked`

In particular the following link was used:

`https://localhost:9200/remote.php/dav/files/admin/secret.txt?OC-Credential=admin&OC-Verb=GET&OC-Expires=60&OC-Date=2024-01-27T00:00:00.000Z&OC-Signature=notchecked`

{F3011032}

## Details

Default settings for PreSignedURL allows usage of GET requests and therefore download files.


[`services/proxy/pkg/config/defaults/defaultconfig.go`](https://github.com/owncloud/ocis/blob/v4.0.5/services/proxy/pkg/config/defaults/defaultconfig.go#L74):

```go
		PreSignedURL: config.PreSignedURL{
			AllowedHTTPMethods: []string{"GET"},
			Enabled:            true,
		},
```

Inside function [`validate`](https://github.com/owncloud/ocis/blob/v4.0.5/services/proxy/pkg/middleware/signed_url_auth.go#L73) another function [`urlIsExpired`](https://github.com/owncloud/ocis/blob/v4.0.5/services/proxy/pkg/middleware/signed_url_auth.go#L126) is called to check for expiration of `OC-Date` and `OC-Expires`.However, in the case of expired dates, the function returns a null error, resulting in successful authentication of requests without checking the user's signing signature/key.

{F3011035}

{F3011036}

{F3011037}

## Vulnerable versions

The following tags on GitHub was found to be vulnerable - it was not tested on different branches/tags:

- v5.0.0-rc.3
- v5.0.0-rc.2
- v4.0.5

## Temporary remediation

Disabling PreSignedURLs, e.g. with environment variable `PROXY_ENABLE_PRESIGNEDURLS=false` blocked unrestricted access to files.

## Impact

Broken Access Control vulnerabilities have severe consequences, both for organizations and end-users. Attackers exploiting Broken Access Control can gain access to sensitive data, including personal information, financial records, or confidential documents, compromising user privacy and security. In this instance, it was possible to access the organization's and users' private files without authentication.

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-01-27** @ownCloud: Thanks a lot for reporting this potential issue back to us. We take security very seriously and would appreciate if you would not share any information about this bug until we have determined a potential patch.
 
Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster.
- **Report Triaged**
- **External User Joined**
- **Changed Scope**
- **External User Joined**
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2024-02-23** @tmueller_owncloud: CVE will be released. Disclosure decision will be made these days ...
- **Report Became Public**
