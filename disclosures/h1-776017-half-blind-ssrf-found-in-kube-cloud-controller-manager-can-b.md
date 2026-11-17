---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/kubernetes
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
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
