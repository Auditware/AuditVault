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
date: 2023-06-02
submitted: 2022-12-17T10:52:08.221Z
bounty_usd: 13950
votes: 295
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/1731349"
title: "Stored XSS via Kroki diagram"
---
# Stored XSS via Kroki diagram

> **Severity:** High | **Bounty:** 13,950 USD | **Votes:** 295 | **Program:** GitLab | **Disclosed:** 2023-06-02

- Report: [https://hackerone.com/reports/1731349](https://hackerone.com/reports/1731349)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-12-17T10:52:08.221Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2022-12-17** @h1_analyst_shiva: Hi @vakzz,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_shiva
- **Report Pending Program Review**
- **Report Triaged**
- **2023-01-05** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2023-02-28.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2023-01-05** @vakzz: Hi @ngeorge,

It looks like https://gitlab.com/gitlab-org/gitlab/-/merge_requests/102800 now prevents popovers/tooltips from using the `style` tag, so the trick I was using to enlarge the chevron no longer works, but the CSP bypass still triggers if you manually click on it. Eg a payload of:

```html
<a>
    <pre lang='/" data-diff-for-path=/root/kroki1/-/snippets/9/raw/main/aaa.json '>
        <code lang="wavedrom">csp</code>
    </pre>
</a>
```

Then clicking on the chevron results in the alert: {F2106378}

Cheers,
Will
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
