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
body: true
date: 2022-08-13
submitted: 2021-10-22T03:49:19.404Z
bounty_usd: null
votes: 34
cve: "CVE-2021-25742"
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "amlweems"
source: "https://hackerone.com/reports/1378175"
title: "Ingress-nginx annotation injection allows retrieval of ingress-nginx serviceaccount token and secrets across all namespaces"
---
# Ingress-nginx annotation injection allows retrieval of ingress-nginx serviceaccount token and secrets across all namespaces

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 34 | **Program:** Kubernetes | **Disclosed:** 2022-08-13

- Report: [https://hackerone.com/reports/1378175](https://hackerone.com/reports/1378175)
- CWE: Code Injection | CVE: CVE-2021-25742
- Submitted: 2021-10-22T03:49:19.404Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I submitted the following report to security@kubernetes.io:
> I've been exploring CVE-2021-25742 and believe I've discovered a variant (although it appears there may be many). Most template variables are not escaped properly in `nginx.tmpl`, leading to injection of arbitrary nginx directives. For example, the `nginx.ingress.kubernetes.io/connection-proxy-header` annotation is not validated/escaped and is inserted directly into the `nginx.conf` file.
>
> An attacker in a multi-tenant cluster with permission to create/modify ingresses can inject content into the connection-proxy-header annotation and read arbitrary files from the ingress controller (including the service account).
>
> I've created a secret gist demonstrating the issue against ingress-nginx v1.0.4: https://gist.github.com/amlweems/1cb7e96dca8ada8aee8dc019d4163f2c

## Impact

An attacker with permission to create/modify ingresses in one namespace can inject content into the connection-proxy-header annotation and read arbitrary files from the ingress controller (including the service account). This service account has permission to read secrets in all namespaces.

## Timeline

- **Report Filed**
- **2021-10-23** @h1_analyst_oliver: Hi @amlweems,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@princeofpersia
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **2021-11-10** @amlweems: As another alternative @princeofpersia, you can go through the install steps in their documentation with a different cluster setup: https://kubernetes.github.io/ingress-nginx/deploy
- **Report Triaged**
- **Bounty Awarded**
- **2021-12-23** @cjcullen: @amlweems How would you like to be credited (if at all) in the CVE?
- **2021-12-23** @amlweems: @cjcullen Thank you for the decision, I really appreciate it!
I'd like to be credited as "Anthony Weems".

Thanks again and I hope you and the team have a happy holidays!
- **Report Retesting**
- **2022-05-06** @amlweems: Apologies for the delayed response, I've read the blog post/PR and retested the issue. The retest submission button is disabled, but I still want to provide the info.

To retest, I installed ingress-nginx version 1.2.0 in a minikube cluster with the chroot image and SYS_CHROOT capability. I verified that the injection point (`connection-proxy-header`) still works, however, the chroot provides a reasonable mitigating control against leaking the service account token. The attack surface exposed to the chroot is minimal (e.g. /proc is empty, no suid binaries, no mounts, non-root user).

As noted in the [blog post](https://kubernetes.io/blog/2022/04/28/ingress-nginx-1-2-0/), the `nginx.conf` file is still accessible, however, given the privileges required to perform this exploit, this seems like a reasonable accepted risk. The blog post describes the _deep inspector_ as a mitigating control here, however, I did not encounter any errors from the inspector using my original payload (which matches the regex `\s*alias\s*.*;`).

One attack path not covered by the remediation is using a directive like `proxy_pass` to proxy to internal services (e.g. `169.254.169.254` if the ingress-nginx controller has access to some metadata service). The impact of this heavily depends on the context, but again seems relatively low given the privileges required.
- **Retest User Expired**
- **External User Joined**
- **User Left Retest**
- **External User Joined**
- **User Completed Retest**
- **2022-05-10** @milankatwal99: Sorry mistakely it was YES
Are you able to reproduce the vulnerability report?
No
- **Report Retest Approved**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
