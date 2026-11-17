---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2018-09-19
submitted: 2018-08-20T00:14:05.542Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/shopify|Shopify]]"
reporter: "rijalrojan"
source: "https://hackerone.com/reports/397130"
title: "Unauthenticated access to Zendesk tickets through athena-flex-production.shopifycloud.com Okta bypass"
---
# Unauthenticated access to Zendesk tickets through athena-flex-production.shopifycloud.com Okta bypass

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 61 | **Program:** Shopify | **Disclosed:** 2018-09-19

- Report: [https://hackerone.com/reports/397130](https://hackerone.com/reports/397130)
- CWE: Improper Authentication - Generic
- Submitted: 2018-08-20T00:14:05.542Z

## Report summary

@rijalrojan discovered an application and endpoint under `athena-flex-production.shopifycloud.com `that exposed metadata and contents of our Zendesk tickets. Within a couple hours, we had put it behind an OAuth portal to mitigate the issue. After an internal investigation revealed no evidence of malicious access to the data, we rewarded him with the highest bounty available under our non-core authentication bypass category ($5,000). We did this despite the app being out of scope because of the severity of the information disclosure. As always, out-of-scope rewards are at our sole discretion.

## Timeline

- **Report Filed**
- **2018-08-20** @rijalrojan: Easy hot patch for it is to move this completely behind Okta and not load any content on the site before authentication. Additionally, put GraphQL behind auth (require auth token at the least)
- **2018-08-20** @rijalrojan: There is also another domain vulnerable to this same exact thing: athena-flex.shopifycloud.com. 

Also for Incident response if needed, here is my IP: 76.169.119.108. This is what I used to access the app and use the graphql endpoint.
- **2018-08-20** @rijalrojan: I think this can be more than zendesk because just noticed there is another GraphQL query that probably leads to shop info disclosure. **I cannot investigate it anymore because the site is down**: 

```
"\n  query getShopInfo($domain: String) {\n    shop(myshopifyDomain: $domain) {\n      shopInfo {\n        errors {\n          code\n          message\n        }\n        id\n        domain\n        myshopifyDomain\n        currency\n        countryName\n        createdAt\n        planDisplayName\n        planName\n        planPeriod\n        timezone\n        users {\n          id\n          firstName\n          lastName\n          email\n          userType\n          permissions\n        }\n      }\n      reportify(since: 12) {\n        gmv\n      }\n      askPrompts {\n        edges {\n          node {\n            name\n            url\n            zendeskTag\n            openOpportunity\n            eligible\n          }\n        }\n      }\n    }\n  }\n
```

I am assuming this can result in more disclosure such as email, name and other information about the user.
- **Report Triaged**
- **Bounty Awarded**
- **2018-08-20** @rijalrojan: Thanks! Please let me know if I can be of any help :) 
Cheers!
@rijalrojan
- **2018-08-20** @rijalrojan: This now redirects to OAuth2 login endpoint so the fix so far looks pretty solid. 
Cheers!
@rijalrojan
- **2018-08-23** @rijalrojan: I am extremely happy with the fixes being applied. I do daily monitoring of shopifycloud.com subdomains and it seems like a lot of them are moving to either Oauth2 or to GSuite (which also migrated to Okta). Thank you so much for working to fix the bug throughout the subdomains and not just fixing them one by one as the reports came! 

Cheers!
@rijalrojan
- **2018-09-06** @rijalrojan: Hi, 
Not to rush things but do you guys have an estimate of when this report can be closed?
Thanks!
@rijalrojan
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2018-09-19** @rijalrojan: @francoischagnon before we go public with this report, can we remove the data.json file because it contains some support ticket infos? 
Thanks!
@rijalrojan
- **2018-09-19** @jack_mccracken: Hey @rijalrojan,

We have an email out to HackerOne asking for this data to be removed. Hopefully it'll be responded to soon and we can get this report disclosed :)
- **2018-09-19** @rijalrojan: Also @jack_mccracken for the summary: I think it should be `all zendesk tickets` not `recent zendesk tickets`. For my PoC I did top 5 recent but there were multiple queries that could be done which would in the end dump every zendesk tickets in shopify.zendesk.com.
- **Agreed On Going Public**
- **Report Became Public**
- **2018-09-19** @jack_mccracken: Updated the summary to be more accurate
