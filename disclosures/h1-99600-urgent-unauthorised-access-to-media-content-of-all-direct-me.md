---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2018-03-21
submitted: 2015-11-14T02:52:03.041Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "indoappsec"
source: "https://hackerone.com/reports/99600"
title: "Urgent : Unauthorised Access to Media content of all Direct messages and protected tweets(Indirect object reference)"
---
# Urgent : Unauthorised Access to Media content of all Direct messages and protected tweets(Indirect object reference)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** X / xAI | **Disclosed:** 2018-03-21

- Report: [https://hackerone.com/reports/99600](https://hackerone.com/reports/99600)
- CWE: Improper Authentication - Generic
- Submitted: 2015-11-14T02:52:03.041Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Team,

You can tweet from your ad account while creating a campaign.When you add a media content from your computer and upload it there is a Json request which gives you the link of your media(Photos) to preview before Tweeting.This link is Vulnerable to IDOR Attack and it leads to disclose all the media content of twitter.I have checked and verified that it discloses the media content of any user's Direct messages and also protected tweets.

Vulnerable HTTP request : 

GET /media_id_to_cdn_url.json?media_id=[Media_id]&_=1447455982153 HTTP/1.1
Host: ads.twitter.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:37.0) Gecko/20100101 Firefox/37.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
X-Requested-With: XMLHttpRequest
Referer: https://ads.twitter.com/accounts/18ce53x5krr/campaigns/5936943/copy?campaign_type=followers&promoted_account=true&source=campaign_dashboard
Cookie: [Cookie_values]
Connection: keep-alive

Here Media_id is vulnerable to IDOR attack and it leads to give you the exact link of the Media content(Photos).

For more Information I am providing Video POC :
Link : https://youtu.be/GMZgEqej61M

This is a critical issue ,Kindly Fix it in priority.

Best Regards !
Vijay Kumar

## Timeline

- **Report Filed**
- **2015-11-14** @indoappsec: Additional information :

In the response of this you will get a link of CDN URL of the content which would look something like : https://pbs.twimg.com/media-preview/snf:[Media_ID]/[Encrypted_ID].png 

How can i get all the Media content :
So basically Media_ID is numeric and i can run proxy tool or write a script which will give me the URL of all the Media Content very easily.

Let me know if you need any other help from my side.

Best Regards !
Vijay Kumar
- **Report Triaged**
- **Bounty Awarded**
- **2015-11-26** @indoappsec: @mfinifter @twitter  : Hope you are good ! I am not happy here with the reward amount you provided. As mentioned in the bounty rules in twitter that protected tweets and direct messages comes under critical sections.below mentioned point  is exactly mentioned in the rules :
"Critical actions include (but are not limited to) tweeting, retweeting, favoring and direct messaging " 

Here i was able to view the Media content of any private direct messages and protected tweets which is very critical but when you see the reward amount it's too less for this.

I would request you to understand the issue closely and re consider the reward amount based on it's criticality and risk.

Best Regards !
Vijay Kumar
- **2017-07-19** @indoappsec: @twitter @andrewsorensen : This issue has been resolved Long back . I request you to close this issue as resolved and let me know if you need any other help from my side.

Best Regards !
Vijay Kumar
- **Report Severity Updated**
- **Report Resolved**
- **2017-07-19** @indoappsec: @rroberts : Thanks for closing the issue as resolved . The Reward amount was not upto the severity of the issue . Still i am happy to help keeping twitter Secure :)
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **2017-10-14** @indoappsec: The issue has been fixed Now. Can you please adjust the reward amount since the severity is Updated to High risk  ??
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
