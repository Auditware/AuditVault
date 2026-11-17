---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-11-27
submitted: 2019-09-06T05:40:41.068Z
bounty_usd: 12000
votes: 457
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "jobert"
source: "https://hackerone.com/reports/689314"
title: "Project Template functionality can be used to copy private project data, such as repository, confidential issues, snippets, and merge requests"
---
# Project Template functionality can be used to copy private project data, such as repository, confidential issues, snippets, and merge requests

> **Severity:** Critical | **Bounty:** 12,000 USD | **Votes:** 457 | **Program:** GitLab | **Disclosed:** 2019-11-27

- Report: [https://hackerone.com/reports/689314](https://hackerone.com/reports/689314)
- CWE: Privilege Escalation
- Submitted: 2019-09-06T05:40:41.068Z

## Timeline

- **Report Filed**
- **2019-09-06** @gitlab-securitybot: Hi @jobert,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Triaged**
- **2019-09-07** @jritchey: Hi @jobert  ,

We've deployed a hotpatch on production, can you verify if this mitigates the immediate problem?

Thanks again!
James
- **2019-09-07** @gitlab-securitybot: ETA for fix:

Hi @jobert,

The GitLab issue created from your report is currently scheduled for 2019-09-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2019-09-07** @jobert: Hi @jritchey and @jmatos_bgtvf - I'm not able to reproduce the security vulnerability anymore. Great turnaround time! When I tried to reproduce it, I'm seeing an error when creating the project.

{F577306}

I've also tried working around the patch by adding myself as a Guest of a subgroup and a Developer of the parent and then trying to export a confidential issue of a Project in the subgroup (not available by default for Guest users). However, because permissions trickle down to its descendants, I'm automatically granted Developer rights on the subgroup as well.

If you have code available somewhere, I'm happy to check that out, too.
- **2019-09-09** @dappelt: Hi @jobert - thanks for validating. Attached is the code change to fix the vuln. Do you see any problem?

Thanks,
Dennis
- **2019-09-09** @jmatos_bgtvf: Hello @jobert,

This is the fix for the 1st vulnerability of your exploit chain. We have created 2 other issues with lower priority for the 2 other vulnerabilities you used (https://gitlab.com/gitlab-org/gitlab-ee/issues/14861 and https://gitlab.com/gitlab-org/gitlab-ee/issues/14860).

Do not hesitate to let us know if you believe fixing first only this vulnerability is a bad idea.

Thank you again,
Jeremy
- **2019-09-09** @jobert: Hi @dappelt and @jmatos_bgtvf - thanks for sending over the code. It didn't help me identify a bypass for the original vulnerabilities that I reported, but it did point out a potential new one. A new `Project` model gets initialized with `params`, which may lead to a mass-assignment vulnerability. E.g. the `namespace_id` validation hasn't run yet when that code gets executed, which means that if someone would provide a `namespace_id` that doesn't belong to them, the view will render with a `@project` instance variable that, if it'd call `namespace`, would return a namespace the user may not be authorized to see. I personally wouldn't rely on that logic, so you might want to stay away from initializing the model with the raw parameters *or* run the additional authorization checks before initializing the model. Hope that helps!
- **Bounty Awarded**
- **Report Resolved**
- **2019-09-11** @jobert: Hi @estrike - thanks for the bounty, much appreciated! Holding off on the disclosure until the other issues are remediated is fine with me. Let's check in again in 30 days to see where you're at. Let me know if you need any additional reviews, happy to help.
- **Agreed On Going Public**
- **2019-10-11** @estrike: Hi @jobert ,

I just checked the remaining two issues, and unfortunately they are still open. We will review those with the development team, to get those fixes scheduled. I am not going to disclose or cancel the disclosure request at the moment, in hopes that we can get them addressed within the 30 day window. We will keep you updated here as we progress towards getting them fixed. Thank you for your patience as we work towards mitigating each of the findings in this report.

Best Regards,
Ethan
- **2019-11-26** @jobert: Hi @estrike - is there an update you can provide on the remaining tickets? Let me know if there's anything I can help with here. Thanks!
- **2019-11-27** @jmatos_bgtvf: Hi @jobert,

Apologies for the delay as the 2 lower priority issues have not been addressed yet.
In order not to wait further, we have decided to accept disclosure.

Thank you again for this amazing report.

Best Regards,
Jeremy
- **Agreed On Going Public**
- **Report Became Public**
