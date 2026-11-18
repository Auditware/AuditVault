---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2022-11-04
submitted: 2022-04-18T17:44:47.605Z
bounty_usd: 7640
votes: 25
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "legit-security"
source: "https://hackerone.com/reports/1543718"
title: "DOS via issue preview"
---
# DOS via issue preview

> **Severity:** High | **Bounty:** 7,640 USD | **Votes:** 25 | **Program:** GitLab | **Disclosed:** 2022-11-04

- Report: [https://hackerone.com/reports/1543718](https://hackerone.com/reports/1543718)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2022-04-18T17:44:47.605Z

## Report summary

We are Legit Security, a company building a solution that protects development environments and pipelines from security risks such as software supply-chain attacks and sensitive data exposure.
You can read a bit about us at http://www.legitsecurity.com.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
Previewing an issue with a specially-crafted description results in high CPU usage for 60 seconds (request timeout).
Multiple requests can be issued in parallel to create a larger impact.

### Steps to reproduce
1. Given an authorized user (on GitLab.com - anyone can self-register. On EE - depends on instance configuration).
2. Create an issue with the following description (provided a one-line python script to avoid bloating):
3. Hit the preview button.

Steps 2&3 can be accomplished via the preview_markdown API endpoint.

The script:
```python -c "print('![l' * int(1048576 / 3 - 1) + '\n')"```
Note: this is essentially the maximal description size, but a smaller number of repetitions works too.

### Impact
After 60 seconds (timeout) - the request fails.
Meanwhile, on the server end, (a single) CPU is burnt out (verified against a local EE instance).
Issuing multiple requests in parallel results in multiple CPUs burn out.
Using the DockerHub image, the entire server is completely unavailable by repeatedly sending a small number of requests repeatedly.

### Examples
The bug is instance-independent, works on latest versions. Since GitLab.com is open-core - it would work on GitLab too.

### What is the current *bug* behavior?
The HTTP request fails for timeout while the server is burning CPU.

On the code side:
```texts_and_contexts``` is being initialized here:

```
def analyze(text, context = {})
      @texts_and_contexts << { text: text, context: context }
    end
```

It is then used at banzai/reference_extractor.rb:
```
def html_documents
      ...
      @html_documents ||= Renderer.cache_collection_render(@texts_and_contexts)
      ...
```

The CPU utilization is found in the execution of ```cache_collection_render```.

### What is the expected *correct* behavior?
Fix the implementation of ```cache_collection_render```.

### Relevant logs and/or screenshots
### Output of checks
#### Results of GitLab environment info

## Impact

A complete denial of service of a GitLab EE instance.
As this vulnerability impacts GitLab.com, we assume that this vulnerability opens the door for a DDOS attack.

## Timeline

- **Report Filed**
- **2022-04-18** @legit-security: p.s.1. This discovery is issued by Gal Ofri & Tor Beer on behalf of Legit Security Ltd.
p.s.2. We want to note that any bounty you find this to be eligible for - Legit Security will donate it.
- **2022-04-18** @h1_analyst_oceana: Hi @legit-security,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@magicmouse
- **Report Duplicate**
- **Report Reopened**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2022-05-09** @kmorrison: Hi @legit-security  I just tried this in a local installation of 14.10.2-ee and while the preview does take a few seconds to render, the request does not time out. Can you try this in the latest version of GitLab?

Thanks,
@kmorrison
GitLab Security Team
- **2022-05-10** @legit-security: Hi @kmorrison,
Thank you for your response!
We attached a recording of a simple demo - showing the effect with a single issue preview.
Please let us know if you would like us to record a demonstration of a complete DOS (502),
or send any extra information.
Thanks,
@legit-security
- **2022-05-10** @legit-security: p.s.
In addition to this issue, #1543606 and #1543584,
we also opened #1544465 which was not reopened for review.
#1544465 shows a similar DOS effect but is exploitable as an unauthenticated user via API calls.
We’d appreciate your response on that issue as well.

Thanks,
@legit-security
- **Report Severity Updated**
- **Report Triaged**
- **2022-05-10** @kmorrison: Hello @legit-security,

Thank you for submitting this report.

We have verified this finding and have escalated to our engineering team.  We will be tracking progress internally at https://gitlab.com/gitlab-org/gitlab/-/issues/361982  This issue will be made public 30 days following the release of a patch.

Given the severity of the report, we are paying an initial $1000 on triage. Congratulations!

We will continue to update you via HackerOne as a patch is scheduled for release.

I will have a look at your other recent reports as well.

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2022-05-12** @gitlab-securitybot: ETA for fix:

Hi @legit-security,

The issue you reported is currently scheduled to be fixed by 2022-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-05-19** @kmorrison: Hi @legit-security, our engineering team has determined that this issue has the same root cause as your other two similar DoS reports. We'll close this one in favor of the one they are keeping open - https://hackerone.com/reports/1543584
Thanks again for your well-written reports. We look forward to hearing from you in the future.

Best regards,
GitLab Security Team
- **Report Informative**
- **Report Reopened**
- **2022-05-23** @nmalcolm_gitlab: Hi @legit-security,

As discussed [in your other report](https://hackerone.com/reports/1543584#activity-16826984) we are now treating this as a distinct bug.

Cheers,
Nick Malcolm
GitLab Security Team
- **Report Severity Updated**
- **2022-06-01** @gitlab-securitybot: ETA for fix:

Hi @legit-security,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-06-27** @legit-security: Hi @nmalcolm_gitlab,
We wrote an article about this issue and we'd like to publish it once the fix is out (according to the last message here, planned for this Thursday). Would you like to go over it and/or provide a comment?
- **2022-06-27** @nmalcolm_gitlab: Hey @legit-security,

Neat to hear you plan to blog about this! As a reminder [we keep issues confidential for 30 days post-patch](https://about.gitlab.com/handbook/engineering/security/#process-for-disclosing-security-issues) to give users time to upgrade, so until the GitLab Issue is public you must refrain from sharing details. The same principle applies to your other reports. Thanks for understanding!

>  Would you like to go over it and/or provide a comment?

I'll take this question to the team to see who would like to review it.

Cheers,
Nick Malcolm
GitLab Security Team
- **2022-06-28** @gitlab-securitybot: ETA for fix:

Hi @legit-security,

The issue you reported is currently scheduled to be fixed by 2022-09-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-06-28** @legit-security: Hi @nmalcolm_gitlab, thanks for your reply!
Of course, we understand the 30 days post-patch restriction, and we'll certainly wait.
But we see the BOT sent an updated fix date, which is 3 months from now(!)... The 90 days disclosure deadline for our report is July 17th. Especially as we're talking about a high severity bug such as this, in which any unauthenticated user can bring down any publicly available GitLab server worldwide. Please understand our side as well and respect the disclosure deadline.
All the best,
@legit-security
- **2022-06-28** @gitlab_cmaxim: Hello @legit-security, 

The fix date was updated since we traced the issue to the upstream package, contacted the package maintainer and send a patch. The internal issue might add some content to the blog post. 
As soon as the patch is being released in the upstream package we will integrate the update and release a fix in the next security release, currently we are waiting for a response from the package maintainers. I am sorry for the inconvenience.

>We wrote an article about this issue and we'd like to publish it once the fix is out (according to the last message here, planned for this Thursday). Would you like to go over it and/or provide a comment?

Feel free to share a doc with the blog post and I will work with our Communications team for a review.

Regards,
Costel
- **2022-06-28** @legit-security: Hi @nmalcolm_gitlab, thanks for your reply!
In the comment below, we’ve sent you the blog post we are going to publish (without some details pending like the version to update, CVE and fix time)
We would like to get your approval for our findings in the blog post

# GitLab markdown DoS - How an external attacker can shut down your software factory

In this article, we’ll explore a vulnerability we found in GitLab’s markdown engine - commonmarker. The engine is exposed by a REST API that does not require authentication. As a result, **an unauthenticated attacker could easily bring down any GitLab server,** shutting down production pipelines. Private GitLab servers, which are accessible only within an internal network, can also be exploited by anyone with network access. Rate limiting does not prevent the attack from taking down the service on all GitLab tiers

### How does GitLab handle markdown?

GitLab uses commonmarker as one of its markdown engines. [commonmarker](https://github.com/gjtorikian/commonmarker) is a Ruby gem wrapper for libcmark-gfm - a library cloned in GitLab’s repository under ext/commonmarker, and its logic is exposed within the gem as commonmarker.so. The library functions as a markdown strings renderer.

GitLab exposes [Markdown API](https://docs.gitlab.com/ee/api/markdown.html) to all GitLab tiers without permission restrictions. In addition, it is also exposed to authenticated users via issue creation, update, and preview.

### Deep dive into the markdown API - the code flow

The graph below represents the inner flow within GitLab of issuing a markdown API request, handling it using ruby, and propagating it to the commonmarker.so in C:
{F1798970}

### Deep dive into commonmarker

The graph below present the commonmarker knowledge needed for understanding the exploit. Every box represent a function and a flow and every arrow navigates to the inner flow of that function, relevant to the exploit.
{F1798971}

### Exploitation

This gif will present how the exploitation happens within the commonmarker engine, according to the understanding we have acquired in last section
{F1798969}

### Handling with 1 minute timeout

It’s not over yet - this is a potential DoS, but Puma’s architecture makes it a little bit tricky: first is the Puma workers. Puma has multiple workers (configurable by the admin), where worker is a thread. We can adjust to that by multiple requests, in accordance to the amount of CPUs/Puma workers on the machine.

The other mechanism, is the PumaWorkerKiller, which after a timeout of 1 minute or too much memory used, kills the worker. It doesn’t affect the vulnerability exploitation by much, since we can just loop our requests - as each request causes a DoS on the handler thread, when a thread is being killed and resurrected, it will handle our request, being unable to handle anything else, so we can block all the Puma workers - causing a complete DoS.

### Consequences

An attacker can take advantage of this vulnerability and shut down the software production pipeline of any accessible GitLab server.
- **2022-06-29** @legit-security: Hi @nmalcolm_gitlab!

As we thoroughly explained in the article we sent you, the vulnerability is within cmark-gfm/commonmarker, making all vendors using it vulnerable. Therefore, we think the vulnerability we found should be expanded to that project. If we understand correctly, you’ve already approached the maintainers, so please advise how we should proceed in order to obtain an official CVE in the commonmarker package, in addition to the one projected in gitlab

Thanks,
@legit-security
- **2022-06-29** @nmalcolm_gitlab: Hey @legit-security,

I didn't make it super clear, but Costel / @gitlab_cmaxim will be your point person as he is the [AppSec Stable Counterpart](https://about.gitlab.com/handbook/engineering/security/security-engineering-and-research/application-security/stable-counterparts.html) for the team addressing this issue. (He's the one who last commented.) Please `@` mention him if you need his attention! Thanks!

> The 90 days disclosure deadline for our report is July 17th. Especially as we're talking about a high severity bug such as this, in which any unauthenticated user can bring down any publicly available GitLab server worldwide. Please understand our side as well and respect the disclosure deadline.

We appreciate your patience as [we wait up to 90 days for the upstream party to release a fix](https://about.gitlab.com/security/disclosure/#disclosure-guidelines-for-vulnerabilities-in-3rd-party-software). I want to clarify that our [program policy](https://hackerone.com/gitlab#user-content-disclosure) states _"All Resolved reports will be made public via issues on GitLab.com **30 days after releasing a fix**."_ There is also [Hackerone's Finder Terms & Conditions](https://www.hackerone.com/terms/finder) to consider. Following these policies is part of being eligible to participate in our program and receive bounty awards. Please let Costel and us know if you plan to disclose anyway.

Cheers,
Nick Malcolm
GitLab Security Team
- **2022-07-03** @legit-security: Hi,

@nmalcolm_gitlab, thanks for the clarification. As we mentioned before, we will not publish before the required 30 days from fix date.

@gitlab_cmaxim, could you please answer our 2 previous messages? (about the blog post and about cmark-gfm/commonmarker)

Thanks,
@legit-security
- **2022-07-04** @gitlab_cmaxim: @legit-security,

From what I understand it can only be one CVE for this issue, in order to get it from the cmark-gfm package maintainers you will have to contact them, report the issue and mention that Gitlab sent a patch via email and make sure a CVE request is being submitted. We cannot request a CVE id for other products.

I am still waiting for an update from my colleagues about the blog post.

Regards,
Costel
- **2022-07-06** @legit-security: Hi @gitlab_cmaxim,
Thanks for your cooperation! 
Could you please refer us to the email address of the cmark-gfm package maintainer which you've been in contact with?

Thanks,
@legit-security
- **2022-07-12** @gitlab-securitybot: ETA for fix:

Hi @legit-security,

The issue you reported is currently scheduled to be fixed by 2022-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-07-28** @legit-security: Hi @gitlab_cmaxim,

Regarding our last comment, we are still interested in applying for a CVE in commonmarker, and we haven’t heard back from you regarding the cmark-gfm package maintainer with whom you’ve been in contact.
We’ve learned that the current maintainer of that project is gjtorikian. We sent him a message regarding this issue, and he asked us for whoever at GitLab suggested to reach out to the package maintainers — should we continue the conversation with him and send him your information, or do you have a different contact with whom we should communicate?

Thanks,
@legit-security
- **2022-08-31** @kmorrison: Hi @legit-security,

Thank you again for the report! Your finding has been patched in GitLab version 15.3.2. Congratulations!

Please let us know if you find that our patch does not mitigate your finding. Your report will be published in 30 days in GitLab's issue tracker. If you'd like to publicly disclose this report or details of it in a blog post or elsewhere, please allow 30 days to pass before doing so to give time to our customers to upgrade to a patched version.

We look forward to your next report!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2022-09-01** @legit-security: Hi @kmorrison,

Thank you for fixing the issue - we checked, and it is mitigating our finding on GitLab.
We do have some questions, though:

1.  This report used to be assigned as  [#1543584](https://hackerone.com/reports/1543584), and they split into 2 different reports. On the original report, it was stated that the bounty should be 7640$ - we have received on this report 1000$ - can you please add the amount for the correct bounty?
2. What’s the process to make this issue a CVE?
3.  We have seen that the [patch](https://about.gitlab.com/releases/2022/08/30/critical-security-release-gitlab-15-3-2-released/#denial-of-service-via-issue-preview) has our issue title, but is on medium severity instead of high, and is credited to [ryhmnlfj](https://hackerone.com/ryhmnlfj)  - can you please explain if it’s our issue? Why aren’t we credited in the patch summary?

Thanks,
@legit-security
- **2022-09-01** @kmorrison: Hi @legit-security,
Sorry, it looks like the release post is wrong. The severity of this should be 7.5 and the credit should be given to you. It looks like maybe the CVSS string was copy-pasted from the entry above it. I'll get that corrected. That also means I'll be paying out the additional bounty to you. Sorry for the confusion and thanks for bringing it to my attention.

The CVE question was covered by @gitlab_cmaxim in his July 4 reply. We can't request a CVE for commonmarker.

Thanks,
@kmorrison
GitLab Security Team
- **Report Reopened**
- **Bounty Awarded**
- **2022-09-02** @legit-security: Hi @kmorrison, 
Thanks for the update! Regarding the release post, you should also update the Table of Fixes, since now it's incorrect.
And regarding the blog post which we shared with you on Jun 28th, we aim to publish it on Sep 30th. Have you received any comments about it from your colleagues? We'd love to add a quote from you guys about this, to stress the collaboration and the great work you put into this.
Best regards,
@legit-security
- **2022-09-08** @legit-security: Hi @kmorrison, waiting for your response to our last message. It's totally fine if you don't wish to provide a quote, but please fix the severity in the [table](https://about.gitlab.com/releases/2022/08/30/critical-security-release-gitlab-15-3-2-released/). Thanks!
- **2022-09-08** @kmorrison: Hi @legit-security sorry for the delay. I'm not authorized to provide any statement on behalf of GitLab but I'll see if I can find someone who is. Don't wait for us, though.  I'll get that table in the release post fixed today.  Thanks.

@kmorrison
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **2022-09-22** @kmorrison: Hi @legit-security Sorry for the delay! Yes, we did request a CVE but it has the same error that the release post did. I'm working on getting that fixed. Thanks for your patience.

@kmorrison
GitLab Security Team
- **2022-09-23** @kmorrison: Hi @legit-security, the CVE for this issue is CVE-2022-2931.

I don't think it has been published to the NVD just yet.

I see you've requested disclosure of this issue. I can do that on September 30, when 30 days have passed since the patch.  The internal GitLab issue will also be made public. Thanks again for your help on this issue.

Cheers,
@kmorrison
GitLab Security Team
- **Agreed On Going Public**
- **Report Became Public**
