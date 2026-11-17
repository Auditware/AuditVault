---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
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
