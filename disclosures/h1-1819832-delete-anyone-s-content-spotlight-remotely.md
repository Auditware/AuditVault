---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2023-03-06
submitted: 2023-01-01T16:06:51.643Z
bounty_usd: 15000
votes: 801
cve: []
program: "[[programs/snapchat|Snapchat]]"
reporter: "prickn9"
source: "https://hackerone.com/reports/1819832"
title: "Delete anyone's content spotlight remotely."
---
# Delete anyone's content spotlight remotely.

> **Severity:** High | **Bounty:** 15,000 USD | **Votes:** 801 | **Program:** Snapchat | **Disclosed:** 2023-03-06

- Report: [https://hackerone.com/reports/1819832](https://hackerone.com/reports/1819832)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2023-01-01T16:06:51.643Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Snapchat,
 Snapchat has viral video feature callled spotlight which alone was the biggest trend and increase snapchat users and profit in millions.
I found a way to delete anyone's spotlight remotely.

Please see the below poc:-

1. First go to https://my.snapchat.com/myposts and log in there.
2. You will see your posts .
3. Now turn burp suite and intercept.
4.Select any of your posts and click delete option.
5. Now capture the delete request. In delete request there is parameter of id


{"operationName":"DeleteStorySnaps","variables":{"ids":["███████"],"storyType":"SPOTLIGHT_STORY"},"query":"mutation DeleteStorySnaps($ids: [String!]!, $storyType: StoryType!) {\n  deleteStorySnaps(ids: $ids, storyType: $storyType)\n}\n"}

6. You just have to change this id parameter. You can easily get the id parameter. Now forward the request after replacing id with someone's else video id.

And the video of other user will get delete.

HOW TO GET ID PARAMETER

1. Whenever you share spotlight you can see the parameter in the url as:
https://story.snapchat.com/spotlight/█████


I have attached a video POC please check it out

## Impact

Delete anyone's Content Spotlight. Imagine deleting video biggest influencers and content creators.

## Timeline

- **Report Filed**
- **2023-01-02** @prickn9: I have further checked that spotlight once deleted are not eligible for crystal awards( mode of payment of snapchat). So people with large no. of views will not be eligible for payment.█████████
- **2023-01-03** @bugtriage-jack: Thank you for your report @prickn9,

We are looking into this and we'll keep you updated when we have additional information.

Thanks, and good luck with your future bug hunting.
- **2023-01-04** @prickn9: Hello Team Snapchat,

Any updates?

Thanks & Regards,
Prickn
- **Report Triaged**
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2023-01-10** @prickn9: Hello Team Snapchat,

Can you please provide an update on time period when i will be awarded the remaining bounty since you have marked this as resolved already.

Thanks & Regards,
Prickn
- **2023-01-11** @prickn9: Hello Team,

Snapchat its been 24hrs since it was marked resolved. I have not been awarded bounty for this critical bug. Could you please provide an update regarding bounty.

I am looking forward to it.

Thanks & Regards,
Prickn
- **Report Severity Updated**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2023-03-02** @prickn9: @apfeifer_sc @bugtriage-jack @mbryant2 Hello Everyone,

Any updates on disclosure.
I would be grateful if we could disclose this. This is quite informational for everyone on hackerone community.
Thanks & Regards,
Sahil Saxena
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
