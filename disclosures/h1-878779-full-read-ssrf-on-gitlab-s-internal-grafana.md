---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-08-07
submitted: 2020-05-20T13:47:25.959Z
bounty_usd: null
votes: 229
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "rhynorater"
source: "https://hackerone.com/reports/878779"
title: "Full Read SSRF on Gitlab's Internal Grafana"
---
# Full Read SSRF on Gitlab's Internal Grafana

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 229 | **Program:** GitLab | **Disclosed:** 2020-08-07

- Report: [https://hackerone.com/reports/878779](https://hackerone.com/reports/878779)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-05-20T13:47:25.959Z

## Timeline

- **Report Filed**
- **2020-05-20** @rhynorater: Please add nnwakelam to the report as well.
- **2020-05-20** @rhynorater: This also affects gitlab infrastructure, as demonstrated from the above on `dev.gitlab.org`.
- **2020-05-20** @gitlab-securitybot: Hi @rhynorater,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 20 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-05-20** @rhynorater: We were able to hit port `3903` on localhost and get access to the `mtail` service there:
```
HTTP/1.1 200 OK
Server: nginx
Date: Wed, 20 May 2020 14:43:55 GMT
Content-Type: image/jpeg
Content-Length: 144786
Connection: close
Cache-Control: private, max-age=3600
Cache-Control: no-cache
Expires: -1
Pragma: no-cache
X-Frame-Options: deny
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin


<html>
<head>
<title>mtail on :3903</title>
</head>
<body>
<h1>mtail on :3903</h1>
<p>Build: mtail version v3.0.0-rc35 git revision a33283598c4b7a70fc2f113680318f29d5826cca go version go1.14 go arch amd64 go os linux</p>
<p>Metrics: <a href="/json">json</a>, <a href="/metrics">prometheus</a>, <a href="/varz">varz</a></p>
<p>Debug: <a href="/debug/pprof">debug/pprof</a>, <a href="/debug/vars">debug/vars</a>, <a href="/tracez">tracez</a>, <a href="/progz">progz</a></p>

```
- **2020-05-20** @rhynorater: Alertmanager on 9093
Node Exporter on 9100
Postgres Exporter on 9187
Redis Exporter on 9121
Consul Agent on 8500
Prometheus Time Series Collection and Processing Server on 9090
- **Report Triaged**
- **Bounty Awarded**
- **External User Joined**
- **2020-05-20** @nnwakelam: Can I attempt to escalate this to a critical?
- **2020-05-21** @rhynorater: ### NOTE: Please do not disclose this bug to anyone besides the required people on your team. Grafana is currently working on a fix.
- **2020-05-22** @gitlab_cmaxim: Hello @nnwakelam, 

> nnwakelam posted a comment.	May 20th (2 days ago)
Can I attempt to escalate this to a critical?

There is no need for this. After doing an internal assessment we concluded that this issue is  `Critical` and we are working on adding mitigations for this.

Thank you for you help and patience.

Regards,
Costel
- **2020-05-22** @nnwakelam: Great! Thanks.
- **2020-05-25** @gitlab-securitybot: ETA for fix:

Hi @rhynorater,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-05-29** @rhynorater: I was able to escalate this in my local lab using the grafana-image-renderer plugin. By forcing the internal grafana-image-renderer plugin to render my URL, I was able to have it perform any actions defined by my web page including SSRF of all HTTP Verbs, ect...
- **2020-05-29** @gitlab_cmaxim: Hello @rhynorater, 

Thanks for the update. If possible please do a retest using the last release 13.0.1 and let us know if you can reproduce this issue.

Regards,
Costel
- **2020-05-29** @rhynorater: @gitlab_cmaxim is dev.gitlab.org on that release?
- **2020-05-29** @gitlab_cmaxim: @rhynorater For the moment try to reproduce this on your env using 13.0.1: 
>I was able to escalate this in my local lab using the grafana-image-renderer plugin. By forcing the internal grafana-image-renderer plugin to render my URL, I was able to have it perform any actions defined by my web page including SSRF of all HTTP Verbs, ect...

Thanks,
Costel
- **2020-05-29** @rhynorater: I have verified the fix in 13.0.1!
- **2020-05-29** @gitlab_cmaxim: @rhynorater: Give it a try o dev.gitlab.com and if it works please let us know what payload you used.

Thanks,
Costel
- **Bounty Awarded**
- **Report Resolved**
- **2020-06-26** @rhynorater: Ey! Thank you for the bounty! :)
- **2020-06-26** @nnwakelam: Thank you!
- **Agreed On Going Public**
- **2020-07-20** @gitlab_cmaxim: Sure! Please ping us after your talk.

Regards,
Costel
- **Agreed On Going Public**
- **Report Became Public**
