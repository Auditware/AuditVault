---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2021-12-22
submitted: 2021-04-10T19:53:30.325Z
bounty_usd: null
votes: 83
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "youstin"
source: "https://hackerone.com/reports/1160407"
title: "Cache poisoning Denial of Service affecting assets.gitlab-static.net"
---
# Cache poisoning Denial of Service affecting assets.gitlab-static.net

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 83 | **Program:** GitLab | **Disclosed:** 2021-12-22

- Report: [https://hackerone.com/reports/1160407](https://hackerone.com/reports/1160407)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2021-04-10T19:53:30.325Z

## Report summary

For more details about the vulnerability, check out:
https://youst.in/posts/cache-poisoning-at-scale/

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary

Hi,

Gitlab.com is hosting JS and CSS on `https://assets.gitlab-static.net/` and uses them on gitlab.com/*
The static files seem to be stored on a gcp host, which by default accepts the `x-http-method-override` header. Since the CDN is using Varnish to cache files, I was able to combine the GCP behaviour and poison the cache into returning an empty resource, inherenetly causing a denial of service on gitlab.com and all gitlab assets that use the specific cdn. 

###  Disclaimer

No actual denial of service attack was caused troughout my testing. All the testing used cache-busters, meaning it did not affect the live website in any way.
 
# Steps to reproduce

1. Sending a request such as:

```http
GET /assets/webpack/commons-pages.admin.sessions-pages.groups.omniauth_callbacks-pages.ldap.omniauth_callbacks-pages.omn-c3aaf8c4.3f9d44ba.chunk.js HTTP/1.1
Host: assets.gitlab-static.net
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0
Connection: close
```
will return the expected js file. 
By taking a quick look at the response headers, we can see the file is currently cached by varnish because of the following headers:
```http
Age: 498
X-Served-By: cache-dca17752-DCA, cache-osl6520-OSL
X-Cache: HIT, HIT
X-Cache-Hits: 1, 1
```
2. In order to test cache poisoning without affecting the live website, we can add random query parameters that will act as cache busters. In order to poison a resource, an attacker would send the following request:

```http
GET /assets/webpack/commons-pages.admin.sessions-pages.groups.omniauth_callbacks-pages.ldap.omniauth_callbacks-pages.omn-c3aaf8c4.3f9d44ba.chunk.js?cb=youstin-xyz HTTP/1.1
Host: assets.gitlab-static.net
x-http-method-override: HEAD
```

This will return an empty response, as it is expected from a `HEAD` request. However since the `x-http-method-override` header is not included in the cache key and the varnish configuration used does not proccess the `x-http-method-override`, this empty response will also be forwarded to all other users requesting the file, with normal GET requests. 

{F1260892}

You can also confirm the cache can be poisoned by visiting the file in your browser, making sure to include the parameter used as a cachebuster. You should notice the empty repsonse, typical to a HEAD request.

This vulnerability can be used on files used by the live site even if they are already cached, by making use of the PURGE http method, which clears the cache, allowing for an easily reproducible DoS attack.

## Impact

Since Gitlab does not forbid unauthorized users from using the PURGE http method, which clears the cache, it is possible for an attacker to clear the cache for actual JS or CSS files used on gitlab.com and poison it with an empty response. Doing so will lead to missing JS and CSS files, making gitlab completely unuseable. 
This vulnerability affects all instances of gitlab where the cdn is used for JS and CSS files.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-04-15** @youstin: I'd also like to mention that this also affects about.gitlab.com. Since the website is hosted on GCP itself, there is no need to take down js files, you can just take down `/`. While the specific subdomain is out of scope, Gitlab should also fix this one.
- **2021-04-17** @h1_analyst_jack: Hello @youstin I hope all is well and thank you for your message. I am checking with the GitLab team about some doubt that I have and I will be sure to try to give you an update when I have some news from the GitLab team. Till then, please remain patient.

Thanks and regards,
@golden__retriever
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-05-19** @gitlab-securitybot: ETA for fix:

Hi @youstin,

The issue you reported is currently scheduled to be fixed by 2021-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2021-10-25** @dcouture: Just leaving a note here to mention that the impact to gitlab.com fixed on June 10th but this remains open because it's still possible to exploit it on about.gitlab.com and that's why the issue is still opened.
- **2021-10-27** @gitlab-securitybot: ETA for fix:

Hi @youstin,

The issue you reported is currently scheduled to be fixed by 2021-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **External User Joined**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
