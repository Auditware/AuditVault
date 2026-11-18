---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2022-03-31
submitted: 2021-09-16T20:13:04.198Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1342009"
title: "Stored XSS in merge request creation page through payload in approval rule name"
---
# Stored XSS in merge request creation page through payload in approval rule name

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** GitLab | **Disclosed:** 2022-03-31

- Report: [https://hackerone.com/reports/1342009](https://hackerone.com/reports/1342009)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-09-16T20:13:04.198Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

Hi GitLab team, I found a stored XSS in merge request creation page caused by a payload in the name of an "approval rule".

Adding approval rules is a feature that is unlocked for premium subscriptions or above. This does not seem to block it from being used against regular users on for example Gitlab.com by inviting them into the "infected project".

This occurs when adding an "Approval rule" to a project and giving it a javascript/html payload as the name and attaching the rule to an approver. When a user tries to create a merge request in the project and opens the "Reviewers" dropdown, information about the user with the attached rule will be shown and the rule name will be injected underneath.

With the payload
```
<iframe/srcdoc='<script/src=/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/alert.js></script>'></iframe>
```
this XSS bypasses the current CSP on Gitlab.com (tried it with an Ultimate trial and inviting a user without a trial to the project)

As I got the impression that all XSS are treated equal when reporting a similar issue, I have not made any deeper analysis of the reason for this firing. Thought I just report it right away. Please reach back to me if you need me to research the impact deeper! As an example, it does not fire when one "edits" a MR which is a bit odd...

### Steps to reproduce

1. Create two user accounts, `attacker_user` and `victim_user` (`attacker_user` must have at least premium features enabled)
2. Log in as `attacker_user`
3. Create a project `xss_project` by going to https://gitlab.com/projects/new#blank_project
4. Go to projects settings on https://gitlab.com/attacker_user/xss_project/edit and scroll down to and expand "Merge request approvals"

{F1450906}

5. Click "Add approval rule"
6. Put the payload as the name, If on Gitlab.com use
```
<iframe/srcdoc='<script/src=/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/alert.js></script>'></iframe>
```
if this is tested on a server without CSP feel free to use the payload
```
<script>alert(document.domain)</script>
```
7. Search for and select `attacker_user` as approver and click create rule.

{F1450905}

8. Invite `victim_user` to the project as `Developer` on https://gitlab.com/attacker_user/xss_project/-/project_members
9. Log out and log back in as `victim_user`
10. Go to https://██████████/user_01/pub/-/branches/new and create a branch `new`
11. Directly click on "Create merge request" (which will appear on the screen)

{F1450903}

12. Click on the dropdown at "Reviewers"
13. Payload will trigger

{F1450904}


### Impact

Stored XSS with CSP bypass. Full Javascript functionality without restrictions, so everything from stealing data to generating and exfiltrating access tokens.

### Examples

If you access my private project at Gitlab.com (https://gitlab.com/ultimate-joaxcar-test3/xss) as an admin, you should be able to create an MR and trigger payload. (Just an alert box)

### What is the current *bug* behavior?

Approver rule name is injected in the user information without proper sanitization.

### What is the expected *correct* behavior?

The name should be sanitized


### Output of checks

This bug happens on GitLab.com

## Impact

Stored XSS with CSP bypass. Full Javascript functionality without restrictions, so everything from stealing data to generating and exfiltrating access tokens.

## Timeline

- **Report Filed**
- **2021-09-16** @joaxcar: Made a mistake on step 10. I added a link to my personal test server. If possible please edit the step to say:

https://gitlab.com/attacker_user/xss_project/-/branches/new
- **2021-09-17** @mhenriksen: Hi @joaxcar, thanks for submitting this finding to us! Unfortunately, it looks like I can't edit the report on my side (I can only change the title). Perhaps @forest_dweller or someone else in the HackerOne triage team can help?
- **2021-09-17** @joaxcar: Hi @mhenriksen it is no big problem, If the report is accepted and later made public on your issue tracker, then it might be of interest to redact the link. But there is nothing really to hide on my instance anyway, just for privacy I guess :)

I did some quick digging into the source code and I think the problem is located in the file https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/users_select/index.js in the end of the file there is the function

```
UsersSelect.prototype.renderApprovalRules = function (elsClassName, approvalRules = []) {
  const count = approvalRules.length;

  if (!elsClassName?.includes('reviewer') || !count) {
    return '';
  }

  const [rule] = approvalRules;
  const countText = sprintf(__('(+%{count}&nbsp;rules)'), { count });
  const renderApprovalRulesCount = count > 1 ? `<span class="ml-1">${countText}</span>` : '';
  const ruleName = rule.rule_type === 'code_owner' ? __('Code Owner') : rule.name;

  return `<div class="gl-display-flex gl-font-sm">
    <span class="gl-text-truncate" title="${ruleName}">${ruleName}</span>
    ${renderApprovalRulesCount}
  </div>`;
};
```
which uses `rule.name` without sanitation. (line 11 and 14 in my code listing)

It was added 10 months ago in this commit https://gitlab.com/gitlab-org/gitlab/-/commit/3bf388888882aca098659d71fb6e84ba3daa371f

Thank you for looking into the report!

/Johan
- **Report Triaged**
- **2021-09-23** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2021-10-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-10-08** @joaxcar: Hi @mhenriksen I believe that this got patched a week ago in 14.3.1. Is there anything holding the report back? The fix seems to works on Gitlab.com

Regards
Johan
- **Bounty Awarded**
- **2021-11-01** @joaxcar: Hi @mhenriksen , thank you for the bounty!
I think you forgot to close the report here, :) I thought that I might request a disclosure on this one, but the option is missing when the report is still open

Best regards
Johan
- **Report Resolved**
- **Agreed On Going Public**
- **2022-02-22** @joaxcar: @mhenriksen is it possible to disclose this one? Forgot to ping you in my last request

Best regards
Johan
- **Agreed On Going Public**
- **Report Became Public**
