---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-07-28
submitted: 2020-04-10T21:47:48.472Z
bounty_usd: 2000
votes: 12
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "iamnoooob"
source: "https://hackerone.com/reports/846905"
title: "Stored XSS in Elastic App Search"
---
# Stored XSS in Elastic App Search

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 12 | **Program:** Elastic | **Disclosed:** 2020-07-28

- Report: [https://hackerone.com/reports/846905](https://hackerone.com/reports/846905)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-04-10T21:47:48.472Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
There exists a stored XSS via reference_ui in "URL" Parameter in the latest Elastic App Search v7.6.2 (Tested both on cloud and local instance)

**Description:** 
Stored attacks are those where the injected script is permanently stored on the target servers, such as in a database, in a message forum, visitor log, comment field, etc. The victim then retrieves the malicious script from the server when it requests the stored information. Stored XSS is also sometimes referred to as Persistent or Type-I XSS.

## Steps To Reproduce:
1. Go To https://cloud.elastic.co/ and login

2. Create a Deployment by visiting https://cloud.elastic.co/deployments/create

3. Fill & Select all necessary details but under **"Optimize your deployment"** section select **"App Search"** & Click Create Deployment

4. Now go to your deployment and click "launch" on your App Search instance and you would be taken to something like `https://069c551087be451bb8d1aecb3cf64341.app-search.us-east-1.aws.found.io/login`

5. Now Login with the provided credentials and Click **"Create an Engine"**

6. On the next screen, Click **"Paste JSON"** and put this 
```
{
"url":"javascript://test%0aalert(document.domain)"
}
```
7. Next, Go to "Reference UI" tab on the menu at the left and under "Title field (optional)" field select "url" and also under "URL field (optional)" field select "url" and finally click "Generate Preview" and you would be take to something like `https://069c551087be451bb8d1aecb3cf64341.app-search.us-east-1.aws.found.io/as/engines/test/reference_application/preview?titleField=url&urlField=url`
{F783219}

8. Press **"CTRL + CLICK"** or **middle mouse button** on the Title and XSS will be executed.
{F783213}

9. The Generated link `https://069c551087be451bb8d1aecb3cf64341.app-search.us-east-1.aws.found.io/as/engines/test/reference_application/preview?titleField=url&urlField=url` can directly be shared with High privileged users etc.

## Impact

A low privileged user with only access to create/index documents can create a document with such evil JSON and can send a link of Reference UI to Admin/Owner which when clicked would lead to Stored XSS

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-10** @iamnoooob: Hi @douglas_day , that's great to know I was able to help you guys! But I was like literally setting/working up my Elastic App Search instance locally for a personal project :D and got this. Thanks a lot for your products as well!
- **Bounty Awarded**
- **2020-04-13** @iamnoooob: haha, Thanks for the great bounty @Elastic. Would this be eligible for a CVE also since this was also present in the local Installation of your Elastic App Search product? Thanks again!
- **2020-04-13** @douglas_day: Hey @iamnoooob ,

I believe we will be making a CVE for this, though I need to discuss more with the internal teams. I'll try to give you an update later this week.

Thanks!
- **2020-06-08** @iamnoooob: Hi @douglas_day ,

 Hope you are doing good! I saw this today on twitter https://nvd.nist.gov/vuln/detail/CVE-2020-7011 Just want to confirm if this is the same issue ? :) 

Regards
Rahul Maini
- **2020-06-08** @joshbresserselastic: Hi @iamnoooob that's it, yeah.

Thanks again for the report, we really appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
