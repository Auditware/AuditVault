---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-09-08
submitted: 2020-04-21T14:56:04.931Z
bounty_usd: 3000
votes: 36
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/855276"
title: "Injection of `http.<url>.*` git config settings leading to SSRF"
---
# Injection of `http.<url>.*` git config settings leading to SSRF

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 36 | **Program:** GitLab | **Disclosed:** 2020-09-08

- Report: [https://hackerone.com/reports/855276](https://hackerone.com/reports/855276)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-04-21T14:56:04.931Z

## Timeline

- **Report Filed**
- **2020-04-21** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **Bounty Awarded**
- **2020-04-22** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-07-07** @vakzz: Hi @dcouture,

Just checking in regarding this issue, looks like it didn't make the 2020-06-30 security patch?

Cheers,
Will
- **2020-07-07** @dcouture: Hi @vakzz,

Indeed it missed the release but should make it to the next one, the work to fix it is nearly completed.

Best regards,
Dominic
GitLab Security Team
- **2020-07-07** @dcouture: Hello again @vakzz,

I just want to confirm that my assessment of the impact matches with your testing: the status code from the forged request is the only information you're able to read from the SSRF. Is that correct?

Thanks,
Dominic
GitLab Security Team
- **2020-07-07** @vakzz: Hi @dcouture,

Sorry it's been a while so had to recheck a few things!

With the SSRF you can get the status code and the body only if the request fails. For example hitting an invalid route in Consul directly with curl gives:
```bash
$ curl -v localhost:8500/v1/config
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8500 (#0)
> GET /v1/config HTTP/1.1
> Host: localhost:8500
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 405 Method Not Allowed
< Allow: OPTIONS,PUT
< Vary: Accept-Encoding
< Date: Tue, 07 Jul 2020 23:29:31 GMT
< Content-Length: 22
< Content-Type: text/plain; charset=utf-8
<
* Connection #0 to host localhost left intact
method GET not allowed* Closing connection 0
```

When using the SSRF you can see the body is returned in the ` remote:` section:
```
2:Fetching remote upstream failed: remote: method GET not allowed
fatal: unable to access 'http://google.com/v1/config?/': The requested URL returned error: 405
```

Cheers,
Will
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
