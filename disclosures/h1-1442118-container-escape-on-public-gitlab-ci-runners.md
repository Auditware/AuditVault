---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/cloud
  - stack/gitlab
substate: "informative"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2022-04-27
submitted: 2022-01-06T00:29:40.807Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "digitalrane"
source: "https://hackerone.com/reports/1442118"
title: "Container escape on public GitLab CI runners"
---
# Container escape on public GitLab CI runners

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** GitLab | **Disclosed:** 2022-04-27

- Report: [https://hackerone.com/reports/1442118](https://hackerone.com/reports/1442118)
- CWE: Improper Access Control - Generic
- Submitted: 2022-01-06T00:29:40.807Z

## Timeline

- **Report Filed**
- **2022-01-06** @digitalrane: Additionally, just wanted to note, in case it is helpful. After reviewing the architecture of this setup, I can't see a good reason for the build container to be privileged. Running builds as an unprivileged container, or at least implementing selinux or apparmor rules on the host to prevent containers from mounting filesystems would mitigate this escape. From a CI perspective, an unprivileged container would still be able to install software in the CI job thanks to user namespace separation. If there is a reason privileged is needed, I'd be happy to advise on alternate configuration which might be more secure and help to prevent the type of misuse GitLab has been seeing on their CI jobs.
- **2022-01-10** @h1_analyst_dhaval: Hi @ec0,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@saffron
- **Report Severity Updated**
- **Report Pending Program Review**
- **2022-01-10** @digitalrane: Thanks @saffron!
- **Report Informative**
- **2022-01-11** @digitalrane: Hi @saffron - thanks for the update.

For the purposes of making sure that this is being closed as informative for the right reasons - I would like to ask the GitLab team to carefully consider this report - and to highlight that the original report linked (which is now closed) details a different container-escape mechanism on an earlier iteration of GitLab's public CI infrastructure. This report is from when they were using CoreOS (they are now using Fedora CoS per https://gitlab.com/gitlab-com/gl-infra/infrastructure/-/issues/9132), CoreOS now being deprecated, so the steps detailed (including the mount of /dev/sda9 within the container) would not lead to a viable container escape.

The reason I am asking that the GitLab team carefully re-review this report is that I am concerned it has simply been shut down given they have a similar closed issue on their bug tracker, rather than actually considering that there is a different container escape with the above mentioned impact which they are currently vulnerable to. It is still possible to run a CI job, disable their suricata agent and run code on the host without any constraints or monitoring for the duration of the CI worker's life. I would at least like to ensure they plan to address this, even if that doesn't lead to me being compensated for the effort and time I put into this report, as it seems contrary to the considerable effort they have put in to protect against this exact situation (cryptomining and other malicious workloads).

Thanks,
James
- **2022-01-11** @digitalrane: Hi @saffron,

Just as additional data, I attempted to reproduce the container escape in the linked issue, and I was not able to reproduce it, so it does seem that issue was indeed mitigated between now and when the original issue was opened. The stateful data the original issue relied in is mounted before the job runs it seems, so it is not possible to mount it a second time inside the container. Again, just wanting to make sure the security issue here is clearly understood by GitLab, even if they are not willing to pay a bounty for the finding.

Best,
James
- **2022-01-18** @digitalrane: Hello,

I was wondering if GitLab has been made aware of the further detail I have shared in my previous comments?
Also, I would like to request disclosure of this vulnerability. 

Thanks,
James
- **2022-01-19** @h1_analyst_dhaval: Hi @ec0

Thanks for reaching out. I can confirm the GitLab Team has thoroughly reviewed the initial report and considered it a known issue. I attempted to reproduce the issue and I can confirm it is still reproducible, I was able to receive the reverse shell. If you are able to leverage this forward and demonstrate a direct security impact upon other users or the platform then please let us know along with the evidence and we will review this report again.

If you wish to request disclosure, please do so using the provided action menu on your right. You can read more about the step at https://docs.hackerone.com/hackers/disclosure.html#requesting-disclosure.

Once you submit the request, the GitLab Team shall review it and let you know if this report can be disclosed.

Kind Regards,
@saffron
- **Agreed On Going Public**
- **2022-04-27** @nmalcolm_gitlab: Hey @ec0,

First off, a big apology on the behalf of the GitLab team for missing your disclosure request! Yes, happy to disclose this. Thanks for your participation in the program, we look forward to your next report :)

Cheers,
Nick Malcolm
GitLab Security Team
- **2022-04-27** @nmalcolm_gitlab: Hey @saffron, I'm clicking "Disclosure pending" and confirming _"Are you sure you want to modify the visibility of this report from Limited to Full?"_ with "OK", but nothing happens. Any tips? Does it need to be a GitLab Team Member with a different H1 role?

FYI @ec0. Feel free to treat this as disclosed and proceed with your talk anyway, if you want.
- **2022-04-27** @digitalrane: Thanks @nmalcolm_gitlab - much appreciated.
- **Agreed On Going Public**
- **Report Became Public**
