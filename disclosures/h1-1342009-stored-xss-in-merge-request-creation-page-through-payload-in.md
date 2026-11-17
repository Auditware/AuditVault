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
