---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insufficiently-protected-credentials
  - env/web
  - impact/account-takeover
  - trigger/session-cookie
substate: "resolved"
weakness: "Insufficiently Protected Credentials"
enriched: true
body: true
date: 2019-12-03
submitted: 2019-11-24T13:08:59.542Z
bounty_usd: 20000
votes: 1643
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "haxta4ok00"
source: "https://hackerone.com/reports/745324"
title: "Account takeover via leaked session cookie"
---
# Account takeover via leaked session cookie

> **Severity:** High | **Bounty:** 20,000 USD | **Votes:** 1643 | **Program:** HackerOne | **Disclosed:** 2019-12-03

- Report: [https://hackerone.com/reports/745324](https://hackerone.com/reports/745324)
- CWE: Insufficiently Protected Credentials
- Submitted: 2019-11-24T13:08:59.542Z

## Report summary

# Incident Report | 2019-11-24 Account Takeover via Disclosed Session Cookie
*Last updated: 2019-11-27*

## Issue Summary
On November 24, 2019 at 13:08 UTC, HackerOne was notified through the HackerOne Bug Bounty Program by a HackerOne community member (“hacker”) that they had accessed a HackerOne Security Analyst’s HackerOne account. A session cookie was disclosed due to a human error, which led to the hacker being able to access the account. The session cookie was revoked at 15:11 UTC, blocking all unauthorized access to the account.

The technical investigation finished at 21:27 UTC, concluding that there was no malicious intent and that all copies of potentially sensitive information were deleted.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
You are disclose for me you session
**Description:**
you are gevi me your session on last report
I am can use your session(sorry)
███
████████
█████████

## Impact

HackerOneStaff Access, i can read all reports @security and more program

## Timeline

| Date | Time (UTC)| Action |
|---|---|---|
| 2019-11-24 | 12:48 | HackerOne Security Analyst’s session cookie was posted on a HackerOne report. |
| 2019-11-24 | 13:08 | HackerOne received a report through its bug bounty program that the session cookie could be used to access sensitive information. |
| 2019-11-24 | 15:08 | A HackerOne Security Analyst began triaging the report.  |
| 2019-11-24 | 15:11 | The session cookie was revoked. |
| 2019-11-24 | 16:07 | HackerOne’s Incident Response team started an investigation. |
| 2019-11-24 | 21:27 | HackerOne concluded technical investigation. |
| 2019-11-25 | 08:49 | Impacted customers were alerted that their information was viewable to the hacker who submitted the vulnerability. |
| 2019-11-26 | 01:58 | A change was deployed restricting HackerOne employee and HackerOne Security Analyst sessions to only be accessible from the originating IP address. This mitigates similar incidents in the future. |

## Root Cause
HackerOne triages incoming reports for HackerOne’s own bug bounty program. On November 24, 2019, a Security Analyst tried to reproduce a submission to HackerOne’s program, which failed. The Security Analyst replied to the hacker, accidentally including one of their own valid session cookies.

*Why was a cookie included?*
When a Security Analyst fails to reproduce a potentially valid security vulnerability, they go back and forth with the hacker to better understand the report. During this dialogue, Security Analysts may include steps they’ve taken in their response to the report, including HTTP requests that they made to reproduce. In this particular case, parts of a cURL command, copied from a browser console, were not removed before posting it to the report, disclosing the session cookie.

*Why was the hacker able to access the account?*
Session cookies are tied to a particular application, in this case hackerone.com. The application won’t block access when a session cookie gets reused in another location. This was a known risk. As many of HackerOne’s users work from mobile connections and through proxies, blocking access would degrade the user experience for those users. Due to the entropy of session cookies and in-depth defenses such as HackerOne’s strict [Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy), HackerOne had not prioritized any additional defenses that limit a session cookie’s ability to be used in a separate browser.

*Why does a session cookie grant access to reports?*
HackerOne offers a number of additional tools on the platform for Security Analysts to work through security reports. In a normal situation, the Security Analysts go through multi-factor Single Sign-On (SSO) to obtain a valid session cookie for their work. Because a live session cookie was obtained, all platform features were available, which therefore granted access to a number of customers’ reports. This was limited to the customer programs that this particular Security Analyst supports.

*Why were reports exposed for programs that don’t use HackerOne Triage?*
HackerOne offers an optional service called [Human-Augmented Signal](https://docs.hackerone.com/programs/human-augmented-signal.html) (HAS). HackerOne Security Analysts have access to a separate HAS Inbox on their account where reports can be inspected before they’re forwarded to the customer. A number of reports from this particular Inbox were accessed.

*Why did it take two hours to notice the report?*
HackerOne aims to reply within 24 hours to any submission, including over the weekend. For high and critical severity vulnerabilities, HackerOne tries to respond within a couple of hours. The report to HackerOne’s bug bounty program was submitted on Sunday morning at 05:00am PST (where the majority of HackerOne’s security team resides). For critical submissions, HackerOne’s security team automatically receives a notification on Slack. This works during business hours but is unreliable over the weekend. Security Analysts who work over the weekend noticed the report two hours after the submission, after which they immediately followed Incident Response procedures.

## Resolution and Recovery

The session cookie was revoked by HackerOne on November 24, 2019 at 15:11 UTC, two hours after it was shared, three minutes after the report was opened for triage. Revoking the session cookie rendered it useless to anyone using it. The subsequent investigation focused on affected customers, vulnerability data, intent, communication, and preventative measures, which concluded on November 26, 2019.

HackerOne audited existing comments to see if other session cookies were leaked in the past. This did not yield any results.

The severity of the report was determined to be high based on HackerOne’s environmental score for the selected asset and CVSS 3.0 base metrics (*CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:H/A:H/CR:H/IR:H/AR:H*). The minimum bounty award for a high severity vulnerability (based on CVSS) on hackerone.com is currently set to $7,500. A $7,500 reward for disclosing this to HackerOne would mean that HackerOne would award the same amount regardless of which user’s account was compromised. The team looked into the amount of sensitive information that could have been accessed by the account and took that under advisement when deciding on the bounty amount. This led to the decision to treat the submission as a critical vulnerability and award a $20,000 bounty.

## Vulnerability Impact on Data

Sensitive information of multiple objects was exposed. During the timeframe the hacker had access, three different features were used to access sensitive information. By default, all inboxes only download the minimal amount of data, such as title, state, severity, and assignee, so the user can view the user interface. Vulnerability information is only disclosed when the user selects a report from the user interface.

In an effort to simplify what data was accessed, HackerOne mapped the access of features to the information disclosed as follows:

 - If the hacker accessed their report via HAS Inbox, Triage Inbox, or Inbox features, the *report titles and limited metadata were viewable*
 - If the hacker used the Report View feature, the *report contents were viewable*

Below is an overview of the features and the data that was exposed in each of them. 

### Human-Augmented Signal (HAS) Inbox

This Inbox is used by a number of Security Analysts to block or forward submissions that are flagged by HackerOne’s backend of having a high-likelihood being noise. When the hacker accessed the page, the default view loaded up to 25 reports to show the user interface. Reports are sorted by oldest report first. The following information was loaded and displayed:

| Information | Note |
|---|---|
| latest_activity_at | ISO 8601 formatted date/time when the last activity (internal or external) was posted to the report. |
| created_at | ISO 8601 formatted date/time when the report was submitted.|
| title | The title of the report. |
| state | Indicates whether the report is open or closed.|
| substate | Indicates the report’s state (new, triaged, needs-more-info, resolved, informative, spam, not-applicable, duplicate). |
| assignee (group name, username) | The group’s name or user’s username who is currently assigned to the report. |
|reporter (username) | The reporter’s username.|
| program (handle, name) | The program’s handle and name the report was submitted to. |

### Triage Inbox

This is the Security Analyst’s main Inbox to interact with reports. When the hacker accessed the page, the default view loaded up to 100 reports to show the user interface. Reports are sorted by oldest report first. The following information was loaded and displayed:

| Information | Note |
|---|---|
|title| The title of the report.|
|substate|Indicates the report’s state (new, triaged, needs-more-info, resolved, informative, spam, not-applicable, duplicate).|
| assignee (group name, username) | The group’s name or user’s username who is currently assigned to the report.|
|triage blockers (reasons, blocked by) | An object that contains the reason why a report is currently blocked on something other than the Security Analysts. |
| program (handle, triage notes) | The program’s handle and name the report was submitted to.|

### Inbox

This is the main Inbox hackers and customers use to interact with reports they’ve submitted and received. When the hacker accessed the page, the default view loaded up to 25 reports to show the user interface. Reports are sorted depending on the view that was selected. The following information was loaded and displayed:

| Information | Note |
|---|---|
| latest_activity_at | ISO 8601 formatted date/time when the last activity (internal or external) was posted to the report.|
|created_at | ISO 8601 formatted date/time when the report was submitted. |
| title | The title of the report.|
| state | Indicates whether the report is open or closed. |
|substate | Indicates the report’s state (new, triaged, needs-more-info, resolved, informative, spam, not-applicable, duplicate).|
|reference | Any issue tracker reference that was set on the report.|
|reference_url|The full URL to any issue tracker’s task when set.|
|severity_rating|Indicates the report’s severity (null, none, low, medium, high, critical).|
|assignee (group name, username)|The group’s name or user’s username who is currently assigned to the report.|
|reporter (username)|The reporter’s username.|
|program (handle, name)|The program’s handle and name the report was submitted to.|
|custom_field_attributes (name)|All custom field attributes that reports can be filtered on.|
|assets (identifier)|All asset identifiers that reports can be filtered on.|
|groups (name)|All team member groups associated with the program the report was submitted to.|
|members (name, username)|All team members associated with the program the report was submitted to.|

### Report View

Reports are viewable in all of the inboxes in order to help customers, security analysts, and hackers communicate over a vulnerability. Only a single report can be viewed in the same window at any given time. When the hacker viewed the report, the following information was loaded and displayed:

| Information | Note |
|---|---|
| vulnerability_information|The initial description of the vulnerability provided by the reporter.|
|comments (text, internal and to the reporter)|The comments between the reporter and the security team as well as internal comments.|
|latest_activity_at|ISO 8601 formatted date/time when the last activity (internal or external) was posted to the report.|
|created_at|ISO 8601 formatted date/time when the report was submitted.|
|title|The title of the report.|
|state|Indicates whether the report is open or closed.|
|substate|Indicates the report’s state (new, triaged, needs-more-info, resolved, informative, spam, not-applicable, duplicate).|
|reference|Any issue tracker reference that was set on the report.|
|reference_url|The full URL to any issue tracker’s task when set.|
|severity_rating|Indicates the report’s severity (null, none, low, medium, high, critical).|
|assignee (group name, username)|The group’s name or user’s username who is currently assigned to the report.|
|reporter (username)|The reporter’s username.|
|program (handle, name)|The program’s handle and name the report was submitted to.|
|custom_field_attributes (name)|All custom field attributes that reports can be filtered on.|
|assets (identifier)|All asset identifiers that reports can be filtered on.|
|groups (name)|All team member groups associated with the program the report was submitted to.|
|members (name, username)|All team members associated with the program the report was submitted to.|
|weakness|The category of vulnerability.|

**Data access was limited to the access the HackerOne Security Analyst had, which does not cover HackerOne’s entire customer base. If your data was accessed during this incident, you have received a separate notification from HackerOne.**

## Preventative Measures

As part of HackerOne Incident Response process, HackerOne is conducting an internal review and analysis of the incident. HackerOne is taking the following actions to address the underlying causes of issues and to help prevent future occurrence:

### Short-term (completed)

These are the short term actions identified. All items have already been addressed and deployed to hackerone.com.

#### Bind Sessions to IP Addresses
The session cookie is able to be reused on different devices. A short term mitigation of this vulnerability is to bind the user’s session to the IP address used at initial sign-in. If an attempt is made to utilize the session from a different IP address, the session is terminated.

This change was rolled out for HackerOne employees (including all HackerOne Security Analysts) on November 25, 2019.

#### Block Sessions from Restricted Countries
HackerOne restricts its employees from accessing resources from specific countries. To mitigate account takeovers, the user sessions are prevented from being used from specific restricted list of countries.

This change was rolled out for HackerOne employees (including all HackerOne Security Analysts) on November 26, 2019.

#### Page on Critical Reports
In order to further reduce the time to notify the security team, the team has decided to move from a Slack notification to paging the on-call security person when a critical report gets submitted to the bug bounty program.

This change was implemented on November 25, 2019.

#### Update Program Policy regarding Sensitive Information Access
HackerOne has updated their bug bounty program policy to include specific actions on when a hacker may have access to a HackerOne account, sensitive keys, or sensitive data.

This change was [implemented on November 26, 2019](https://hackerone.com/security/policy_versions?change=3624684).

### Mid-term (next three months)

#### Detect & Redact Sensitive Data in Comments
When a user is making a comment, detect possible sensitive information, such as session cookies and authentication tokens, and block submission of the comment until confirmation. Additionally, offer the user the ability to redact the sensitive from the comment automatically.

This change was implemented on December 2, 2019.

#### Add Additional Logging Context

While HackerOne was able to determine which reports were access based on the executed GraphQL queries, HackerOne is planning to improve their logging of information around data access. This will support Incident Response capabilities and allow the incident response to be performed faster.

#### Bind Sessions to Devices

A limitation of binding to IPs is that they change for legitimate reasons and will unauthenticate the user, creating a poor user experience. Additionally, IP addresses do not uniquely identify a user (such as with NAT), allowing malicious users to utilize the session, even if it is IP bound. To improve usability and security, HackerOne will investigate binding the session to a specific device that the user is using. Sessions bound to the device will only be usable on that device and using the session elsewhere will terminate the session.

#### Improve Education for Employees

In addition to HackerOne’s current employee education programs, HackerOne will expand the security training for those who handle vulnerability reports. The training will include additional details on how to share technical reproductions and specifically avoid sharing keys, tokens, and session information.

### Long-term (next twelve months)

#### Overhaul Security Analyst Permission Model
The HackerOne Security Analysts have access to HackerOne customers’ sensitive data in order to triage incoming vulnerability reports. HackerOne has identified that HackerOne can restrict security analyst access in programs, as well as overhaul the allocation of security analysts to a more restrictive list of programs to keep these users to the least privilege required. 

#### Improve Education for Hackers

As the community grows, HackerOne needs to ensure that HackerOne is reinforcing the best practices in bug bounty hunting. The HackerOne Community team will look to increase hacker education around delivering proof of critical severity vulnerabilities in case sensitive information has been accessed by the hacker.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-11-24** @haxta4ok00: ████████
█████
- **2019-11-24** @haxta4ok00: i found what is you can edit private program ( for test ) I have not changed anything and not used , all for the sake of hacking
- **Report Needs More Info**
- **Report New**
- **2019-11-24** @haxta4ok00: If you need Proof, I can write a message ███.
- **Report Needs More Info**
- **Report New**
- **2019-11-24** @haxta4ok00: ██████
- **2019-11-24** @ktistai: @haxta4ok00 

I asked the appropriate people on how we deal with such reports and as soon as there will be more information, we will let you know. 

Thanks, 
@ktistai
- **2019-11-24** @zander: Hi @haxta4ok00 thanks for reporting this so quickly, we really appreciate it! We're currently looking into the report and appropriate mitigations. If we have any more questions for you we'll reach out to you here.
- **2019-11-24** @reed: Hi @haxta4ok00,

Thank you for confirming you no longer have unauthorized access. As part of our investigation, we also want to make sure we have all the relevant information from you to ensure we’re capturing everything, even as we review our own logs / audit records. As such, we would appreciate your answers to a few questions to assist us.

* Are there things outside of the screenshots you provided that you looked at? Specifically, did you review any specific programs, reports, etc.?
  * If so, could you list these programs?

* Did you provide any of this information to other people outside of your report submission?

* Have you made mention of this issue to any other people at all?

* Can you confirm if you took any actions at all outside of viewing data? As in, did you perform any actions (pay bounties, modify program details, add users, etc.)?

* Can you please delete all screenshots, exports, etc. that you may have captured as part of your report submission and send us a confirmation in this report once complete?

* Can you confirm that you have no other copies of vulnerability data that was stored on your computer, such as proxy logs, browser history, and any other screenshots or data exports?

* Lastly, do you have any other questions we can answer for you or important information to share with us related to this report?

Again, thank you so much for responsibly reporting this issue to us. We really do appreciate it, and we thank you for your assistance with our investigation.
- **2019-11-24** @haxta4ok00: Hi @reed 

* Are there things outside of the screenshots you provided that you looked at? Specifically, did you review any specific programs, reports, etc.? If so, could you list these programs?

>No, only screenshots , Yes ███ and some programs to see the access rights of this account(I do not remember the name, sorry) (Exclusively for white hacks)

* Did you provide any of this information to other people outside of your report submission?

>No

* Have you made mention of this issue to any other people at all?

>No 

* Can you confirm if you took any actions at all outside of viewing data? As in, did you perform any actions (pay bounties, modify program details, add users, etc.)?

>No , Did not do any actions, did not add participants and did not pay remuneration. Only read-only .

* Can you please delete all screenshots, exports, etc. that you may have captured as part of your report submission and send us a confirmation in this report once complete?

>Only was screenshots, I didn't export the reports. I don't quite understand how I can prove to you that I deleted all the screenshots ? I will of course remove them as you ask

* Can you confirm that you have no other copies of vulnerability data that was stored on your computer, such as proxy logs, browser history, and any other screenshots or data exports?

>Again. I do not know how to prove it to you, but they are not present, I did not make copies and export reports

* Lastly, do you have any other questions we can answer for you or important information to share with us related to this report?

>On this moment until nope. But I wonder, ██████████?

Thanks for the answer and this report only white hacks 
Sorry i bad speak english
I hope you understand me
Thank you,haxta4ok00
- **2019-11-24** @reed: Hi @haxta4ok00,

Much appreciated for the responses. Especially thank you for confirming your removal of all screenshots and other data you may have downloaded as part of your report submission.

We can confirm that ██████ uses 2FA via SAML. That is, the built-in HackerOne 2FA functionality is not used, as our identity provider handles 2FA itself. Authentication to the HackerOne Platform is federated from our identity provider to HackerOne via SAML.

Again, thanks for reporting this to us. We'll be in touch soon on next steps.
- **2019-11-24** @haxta4ok00: Hi @reed -- Thanks for answer
- **Changed Scope**
- **Report Severity Updated**
- **2019-11-25** @jobert: Hi @haxta4ok00 - thanks again for bringing this to our attention. We’re still actively working on this, primarily preparing communications to affected customers and a root cause analysis. As part of that, we’re updating the severity according to the impact of the vulnerability. At this point, we have not made a decision on the bounty amount, and it may be different from what our bounty table indicates. See below for our reasoning behind the corrected severity, which with the environmental score of the affected asset, brings the CVSS to 8.3 (High).

**Attack Vector: Network** - The vulnerability was exploitable from anywhere in case the attacker had a copy of an active session cookie.

**Attack Complexity: High** - The semi-feasible attack scenario is for a HackerOne employee to share an active session cookie. Carrying this out is beyond an attacker’s control, which is why the Attack Complexity to High.

**Privileges Required: None** - The attacker does not need to be authenticated to exploit the vulnerability.

**User Interaction: Required** - The victim needs to share the session cookie, making User Interaction Required for the vulnerability to be exploited.

**Scope: Changed** - Due to the nature of the data that could’ve been accessed, systems other than hackerone.com may be accessible. Scope includes any customer assets because of the vulnerability information that could have been accessed.

**Confidentiality: High** - Vulnerability information could be accessed when the attacker has an active session cookie of the HackerOne employee. Any security vulnerability that affects vulnerability information automatically bumps Confidentiality to High.

**Integrity: High** - The HackerOne employee had sufficient privileges to make updates to programs they were managing, causing Impact to being set to High.

**Availability: High** - Due to the HackerOne employee’s permissions, they could suspend submissions for a number of HackerOne customers. Although this technically doesn’t affect the availability of the platform, the team ended up going with a High impact because submissions are a business critical process on the platform.
- **2019-11-25** @haxta4ok00: Hi @jobert -- You may be right about CVSS, but aren't actions on behalf of H1Staff critical. For example, read reports, add members to private programs, send bounties, etc.?
- **2019-11-25** @jobert: Hi @haxta4ok00 - yup, but that's subjective. We've updated CVSS to capture the objective measurement of impact of the vulnerability. The business impact, which is subjective to some extend, will be discussed when we decide on a bounty amount. Thanks for your understanding and patience!
- **2019-11-25** @haxta4ok00: @jobert Thanks for the answer
- **Report Title Updated**
- **Report Triaged**
- **2019-11-25** @haxta4ok00: Hi @jobert-- thanks for the answer
- **2019-11-25** @jobert: Hi @haxta4ok00 - something came up that we hadn't asked you yet. We didn't find it necessary for you to have opened all the reports and pages in order to validate you had access to the account. Would you mind explaining why you did so to us? Thanks!
- **2019-11-25** @haxta4ok00: Hi @jobert -- I did it to show the impact. I didn't mean any harm by it.I reported it to you at once. I was not sure that after the token substitution I would own all the rights.

I apologize if I did anything wrong. But it was just a white hack
- **Report Title Updated**
- **2019-11-26** @haxta4ok00: Hi @jober , @reed , @bencode , @zander -- May I add one remark for you?
- **2019-11-26** @jobert: Hi @haxta4ok00 - of course, go for it! No need to ask.
- **2019-11-26** @haxta4ok00: Hi @jobert -- thanks for the answer!

* Three years ago I mentioned such an attack, but it was theoretical and I was not listened to( here #163381 I wrote `in theory find this in the future`). If this will help the I am systemic moderator on one of forums on security. And we protected ourselves from such attacks by binding the session to the IP address at the entrance. We also made basic authorization for access to private sections. Perhaps this will help you.

* I understand, that saw data which should not was see, but this was only hack interest in white purposes, I wanted to watch and show you to prejudice consequence of this can lead ( I've always been taught to write the full impact that can be) . It was a happy white hacking for me.

* Please do not scold █████ he's one of the best staff that help to hackerone

And sorry if I that the poorly translated, hope you me will understand. Thanks @jobert again.
- **2019-11-26** @jobert: Hi @haxta4ok00 - thanks for that, it's much appreciated. No need to worry about ██████████ this was a human error that could've happened to anyone. There won't be any consequences for them. This became a bigger incident due to the amount of data that you accessed, not because it happened in the first place.

As for your first remark: yesterday we've released an update that limits HackerOne employees and HackerOne Security Analyst sessions to the IP address that they've started the session with. This would've prevented the incident. We're postponing the rollout to all users due to people having legitimate use cases for using multiple IP addresses (e.g. ISPs with DHCP). We're also planning to roll out a number of smaller changes, such as warning the user when a comment seems to contain sensitive information and clarification in our policy about what to do when someone gains access to other people their account.

We'll keep you posted!
- **2019-11-26** @haxta4ok00: Hey @jobert -- Thanks for the answer!

> No need to worry about ████ this was a human error that could've happened to anyone.

Nice!

>As for your first remark: yesterday we've released an update that limits HackerOne employees and HackerOne Security Analyst sessions to the IP address that they've started the session with. This would've prevented the incident

Nice, good idea
- **Report Vulnerability Types Updated**
- **Bounty Awarded**
- **Swag Awarded**
- **2019-11-27** @haxta4ok00: Hi @jobert -- Thanks for the bounty! This is a very large sum for me. 

My PayPal has in my country a certain limit per month, if I can not get the whole amount at once, it will be possible to divide it into several parts in the future?
Thansk!
- **2019-11-27** @jobert: Hi @haxta4ok00 - yes, e-mail support@hackerone.com so we can sort that out! Please reference this ticket to give them the right context.
- **2019-11-27** @haxta4ok00: Hi @jobert -- ohh, ok, thank you for the answer, and one more request.

Could you check two more of my reports, thank you?
- **2019-12-02** @bencode: > Could you check two more of my reports, thank you?

Yep, we'll get back to you in the other reports.
- **2019-12-03** @haxta4ok00: Hi @bencode -- Thanks for the answer!
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Vulnerability Types Updated**
