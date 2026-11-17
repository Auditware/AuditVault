---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2021-05-14
submitted: 2021-04-07T13:59:49.750Z
bounty_usd: 20000
votes: 508
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1154542"
title: "RCE when removing metadata with ExifTool"
---
# RCE when removing metadata with ExifTool

> **Severity:** Critical | **Bounty:** 20,000 USD | **Votes:** 508 | **Program:** GitLab | **Disclosed:** 2021-05-14

- Report: [https://hackerone.com/reports/1154542](https://hackerone.com/reports/1154542)
- CWE: Code Injection
- Submitted: 2021-04-07T13:59:49.750Z

## Timeline

- **Report Filed**
- **2021-04-07** @vakzz: I haven't reported this to https://exiftool.org/ yet (not exactly sure even where or how), it may need some kind of coordinated disclosure instead of just submitting it to the public bug tracker?

Cheers,
Will
- **Report Triaged**
- **Bounty Awarded**
- **2021-04-07** @dcouture: Hello @vakzz,

Can you share what was the username of the GitLab account you used to upload the PoC please?

Thanks,
Dominic
GitLab Security Team
- **2021-04-07** @dcouture: Ah it appears to be `vakzz-h1`, thanks.
- **2021-04-07** @vakzz: Hi @dcouture,

Yep https://gitlab.com/vakzz-h1 is the one I used, the uploaded file ended up being rejected so not sure if anything was saved or not.

Cheers,
Will
- **2021-04-07** @dcouture: Hello again @vakzz,

Did you intend to report this issue with the DJVU format to the ExifTool project? Would you rather we do it (in your name)? I suppose this might not be the only bug bounty report you get from this. :)

Best regards,
Dominic
GitLab Security Team
- **2021-04-07** @vakzz: Hi @dcouture,

If you are able to handle reporting the issue that would be great :) 

Cheers,
Will
- **2021-04-08** @dcouture: Hello again,

A GitLab team member had already reached out to ExifTool before I started my day today. I'll make sure you are credited for the vulnerability.

The bug was mitigated on .com yesterday, we are working on a longer term fix now and will have a new release available soon.

Thanks,
Dominic
GitLab Security Team
- **2021-04-08** @vakzz: Hi @dcouture,

Thanks for the update!

Cheers,
Will
- **2021-04-14** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2021-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **2021-04-14** @vakzz: Hi @dcouture,

> Thanks in no small part to your recent findings, we are rolling back our policy about paying half-bounties for third party findings. These have great impact on GitLab and we want to continue to incentivize research for high+ severity issues in that area.
> 
> I don't know if you had any 50% bounties under that policy yourself, but we'll soon revisit the bounties we awarded during that period and pay out the full value.

Wow amazing, thanks! I think the only other one was the issue last month, but that had a bonus to bring it up to the max already :)

> ExifTool independently patched the issue but they didn't intend to request a CVE or credit you in the release notes. We are independently requesting a CVE ID at the moment to help raise awareness about this issue.

Yeah I saw they released a new version with a fix, but it wasn't pushed to MetaCPAN so will make it hard for people to update. Also without a CVE the distros might not update their packaged version, so thanks for following that up!

Cheers,
Will
- **2021-04-20** @vakzz: Hi @dcouture,

> We are independently requesting a CVE ID at the moment to help raise awareness about this issue.

Any updates on this? Not sure how long it normally takes, there are a couple of other vendors asking if there is a CVE for the issue is why I'm checking :)

Cheers,
Will
- **2021-04-20** @dcouture: Hello @vakzz,

It was assigned `CVE-2021-22204` a few hours ago, it will be actually published soon.

Best regards,
Dominic
GitLab Security Team
- **2021-04-20** @dcouture: That CVE was for ExifTool itself, the GitLab bug as reported here will be `CVE-2021-22205`.
- **2021-04-20** @vakzz: Hi @dcouture,

Awesome thanks for that!

Cheers,
Will
- **2021-05-12** @vakzz: Hi @dcouture,

My self-hosted Ultimate license has expired, would I be able to get it renewed or a new one? :) 

Cheers,
Will
- **2021-05-12** @dcouture: Hi @vakzz,

I requested a new license and it should be sent to your @wearehackerone.com email address. If you haven't receive it in a week please let me know.

Thanks,
Dominic
GitLab Security Team
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
