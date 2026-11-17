---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2018-02-21
submitted: 2018-02-04T14:25:08.445Z
bounty_usd: 750
votes: 39
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "edoverflow"
source: "https://hackerone.com/reports/312118"
title: "Using GitLab to monitor and hijack domains in mass quantity."
---
# Using GitLab to monitor and hijack domains in mass quantity.

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 39 | **Program:** GitLab | **Disclosed:** 2018-02-21

- Report: [https://hackerone.com/reports/312118](https://hackerone.com/reports/312118)
- CWE: Business Logic Errors
- Submitted: 2018-02-04T14:25:08.445Z

## Timeline

- **Report Filed**
- **2018-02-05** @jritchey: Hi @edoverflow,

Thank you for submitting this report. I've marked this as a duplicate of https://hackerone.com/reports/296907. We've reconsidered the issue and are implementing a short-term fix as well as a domain verification mechanism. We will keep you updated on our progress via HackerOne.

Feel free to contact us at anytime if you need an update

Best regards,
James
- **Report Duplicate**
- **2018-02-05** @edoverflow: Hi @jritchey,

While what I have demonstrated here might have a similar outcome as in #296907, this is in fact a different attack vector. #296907 is simply concerning unclaimed domains — as Brian pointed out, an issue caused by the user. My report on the other hand is a design flaw from your side — you allow setting an unlimited number of domains and on top of that, you allow users to squat domains that are not even pointing to `52.167.214.135` in the first place. I, hereby, kindly request you review this report again. There appears to be a misunderstanding — I would definitely not go out of my way to report a previously-disclosed report to you.
- **2018-02-07** @edoverflow: I really think that there was a grave misunderstanding here and I can assure you that this is not the same attack vector as #296907. Please do review this report again as I believe it would be a shame to end this report on this note.
- **2018-02-07** @jritchey: I'm investigating this further and will get back to you as soon as I can.
- **2018-02-07** @edoverflow: Thank you, @jritchey.
- **2018-02-07** @kathyw: @edoverflow a question for you on your suggested mitigation approach... once the TXT record key is placed, will that address this issue that you are highlighting? Or would a re-verification mechanism also be needed?
- **2018-02-07** @edoverflow: Hi @kathyw,

TXT record validation when adding the custom domain should mitigate this issue. You generate the token when the user adds the domain.

{F261178}
- **2018-02-07** @jritchey: Hi @edoverflow ,

I have a couple of questions and below is my understanding of the report.

## Vulnerability vs exploit

Isn't the real vulnerability that **GitLab doesn't validate the custom domain** when added?

https://hackerone.com/reports/296907 exploits this vulnerability by claiming the domain when stale DNS A records **already** point to `52.167.214.135`. My understanding is that this report exploits this vulnerability by claiming the domain name **before** the DNS record has been added. To me, this report seems to be a different exploit of the same vulnerability.

Also, if the real issue is a lack of custom domain validation, why would allowing multiple domains be a vulnerability as long as are validated?
- **2018-02-08** @edoverflow: > Isn't the real vulnerability that GitLab doesn't validate the custom domain when added?

That and the fact that you allow an unrestricted number of domains for a single repository, and that you allow users to add domains that are not pointing towards `52.167.214.135`.

> To me, this report seems to be a different exploit of the same vulnerability.

Let me break down the two reports and explain what is going on.

**#296907** 

This report is what we commonly refer to as a "(sub)domain takeover". This issue is quite prevalent, but normally you do not report the issue to the service the vendor is serving their content on, but rather the vendor themselves. See https://hackerone.com/reports/263902 where I reported 5 subdomain takeovers to the TTS where their subdomains were pointing to GitHub.

This type of issue is caused by the user and not the vendor, therefore I fully agree with Brian's conclusion. What surprised me about that report is the fact that you disclosed it without notifying affected users. In fact, I recreated the exploit and added a small trick where I check the apex domain and the `www.` subdomain to increase the pool of vulnerable users to 700.

**#312118 (this report)**

This report is about squatting domains **before** they even point to GitLab, preventing the user from using their custom domain, and serving content on their domain. This issue is in fact caused by GitLab and **not** the user.

1. You should not allow registering an unlimited number of (sub)domains for a single repository;
2. You should not allow users to add domains that are not already pointing to `52.167.214.135`;
3. You should validate the domain when a user adds the domain to their repository.

Admittedly, you might kill two birds with one stone when using my proposed fix, but that does not mean it is the same issue at all. My finding is more in-depth and therefore requires fixing #296907 in the process too.
- **2018-02-08** @jritchey: Hi @edoverflow,

Thanks the detailed clarification. I'm awarding a High severity bounty for this report. Also, I'm referencing the notification on the GitLab blog https://about.gitlab.com/2018/02/05/gitlab-pages-custom-domain-validation/.

Best,
James
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Reopened**
- **Report Resolved**
- **2018-02-08** @edoverflow: Thank you, @jritchey. I am very impressed by your program and I look forward to reporting more issues in the future.
- **Report Reopened**
- **Report Triaged**
- **2018-02-08** @edoverflow: To help you with keeping track of affected users, I constructed a list of potentially vulnerable (sub)domains.

```
$ wc -l vulnerable-gitlab-projects.txt
1350 vulnerable-gitlab-projects.txt
```
- **2018-02-08** @jritchey: Thanks @edoverflow !
- **2018-02-12** @edoverflow: I would like to apologise for contacting affected users without notifying you first. I was hoping to help your customers and in the process help you in resolving this issue. I am terribly sorry, it didn't even cross my mind that affected users could possibly panic and contact support. I promise not to contact any further affected users and instead to submit them here for you to contact.
- **2018-02-12** @jritchey: We understand you have good intentions. If you’re unsure about any actions, please check with us first.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2018-02-22** @kathyw: Resolved.
