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
date: 2021-07-12
submitted: 2021-02-14T17:05:15.425Z
bounty_usd: 3000
votes: 27
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "taraszelyk"
source: "https://hackerone.com/reports/1103258"
title: "Stored DOM XSS via Mermaid chart"
---
# Stored DOM XSS via Mermaid chart

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 27 | **Program:** GitLab | **Disclosed:** 2021-07-12

- Report: [https://hackerone.com/reports/1103258](https://hackerone.com/reports/1103258)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-02-14T17:05:15.425Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Prologue

Gitlab supports Mermaid as part of GFM to allow users to generate diagrams and flowcharts from text.

In version 8.6.0, Mermaid added a support of directives to add more control over styles(themes) applied to the diagrams.

You can read more about how this works here: https://mermaid-js.github.io/mermaid/#/directives

Syntax for declaring the directive is `%%{init: {<JSON_OBJECT>}}%%`

Directives can be used to overwrite default theme properties like `fontFamily` or `fontSize` to the graph.

Behind the scenes, library takes `JSON_OBJECT` from directive and merges it with config object. Later that config is used to generate new CSS rules:

```
  let userStyles = '';
  // user provided theme CSS
  if (cnf.themeCSS !== undefined) {
    userStyles += `\n${cnf.themeCSS}`;
  }
  // user provided theme CSS
  if (cnf.fontFamily !== undefined) {
    userStyles += `\n:root { --mermaid-font-family: ${cnf.fontFamily}}`;
  }
  // user provided theme CSS
  if (cnf.altFontFamily !== undefined) {
    userStyles += `\n:root { --mermaid-alt-font-family: ${cnf.altFontFamily}}`;
  }
```

## Vulnerability description

Problem is that there is no sanitization of user-supplied values, which are added to `style` tag via `innerHTML` method afterwards:
```
  const stylis = new Stylis();
  const rules = stylis(`#${id}`, getStyles(graphType, userStyles, cnf.themeVariables));

  const style1 = document.createElement('style');
  style1.innerHTML = rules;
  svg.insertBefore(style1, firstChild);
```

This leads to Cross-Site Scripting attack via following directive:
```
%%{init: { 'fontFamily': '\"></style><img src=x onerror=alert(document.cookie)>'} }%%
```
## Steps to reproduce

1. Create an issue in any repository
2. Create mermaid diagram with following payload:
```
%%{init: { 'fontFamily': '\"></style><img src=x onerror=alert(document.cookie)>'} }%%
sequenceDiagram
Alice->>Bob: Hi Bob
Bob->>Alice: Hi Alice
```

3. Save the issue. XSS will be triggered every time a user opens a page with this issue.

## PoC
Visit https://gitlab.com/bugbountyuser1/asdf/-/issues/3
You will see CSP errors in the console. 

{F1195539}

## What is the current *bug* behavior?

Mermaid fails to properly sanitize user-supplied input via directive which leads to XSS.

## What is the expected *correct* behavior?

Mermaid strips/encodes malicious characters, so there is no way to perform XSS attack.

## Output of checks

This vulnerability was tested on gitlab.com. CSP blocks XSS from executing, but I have an idea on how to bypass CSP.
On a local Gitlab instance with a newer version(same as gitlab.com) of Mermaid, it works too.

### Results of GitLab environment info

(For installations with omnibus-gitlab package run and paste the output of:
`sudo gitlab-rake gitlab:env:info`)

(For installations from source run and paste the output of:
`sudo -u git -H bundle exec rake gitlab:env:info RAILS_ENV=production`)

## Impact

The Impact is standard as for any Stored XSS. User interaction is minimal - the user needs to navigate to a page with a Mermaid chart(issues page, etc). CSP is blocking XSS on gitlab.com, but I can work on XSS bypass if it is needed to show the impact/increase bounty amount. So let me know if you need CSP bypass too.

## Timeline

- **Report Filed**
- **2021-02-14** @gitlab-securitybot: Hi @taraszelyk,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **2021-02-19** @gitlab-securitybot: ETA for fix:

Hi @taraszelyk,

The issue you reported is currently scheduled to be fixed by 2021-05-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-04-24** @taraszelyk: Hello @dcouture,
I can confirm that this issue was fixed by upgrading to Mermaid 8.9.2 which includes a patch for this vulnerability.  It is no longer reproducible on gitlab.com.
- **Report Resolved**
- **2021-04-28** @taraszelyk: Hello @dcouture,
Sorry, but I disagree with your decision that these two reports are duplicates. 
They are separate issues, though in one library. I've spent time to find both of them. And spent time to make them work in Gitlab environment. And yes, one "fix"(Mermaid upgrade) from your side was required to patch them. But it's only because I've disclosed two vulnerabilities at once to the maintainer of the library so he fixed them together. And even in the library, they were not patched by the same patch.

By your logic, I should have submitted one issue, wait till the patch, get bounty and then submit another to be sure that I will be rewarded for all work that was done. I don't want to do such things and I think that it's wrong, but I find it unfair to the researcher to say that they are duplicates and reward for only one issue. So, I believe, you should reconsider your decision.
- **2021-04-28** @dcouture: Hello @taraszelyk,

I understand your point of view and completely understand that this was two different issues in mermaid, but we are not the mermaid project. With that said I'll bring your comment back to the team and we'll discuss about how to handle such issues.

Thank you for your patience, I'll give you an update when we take a decision.
Dominic
GitLab Security Team
- **2021-04-28** @taraszelyk: Thank you in advance.
- **2021-04-30** @dcouture: Hello @taraszelyk,

I'm having trouble finding where the issues were fixed, I only see that one issue where the maintainer mentions both bugs. Do you happen to have a reference to the commits?

Thanks,
Dominic
GitLab Security Team
- **2021-04-30** @taraszelyk: Sure, here is the issue https://github.com/mermaid-js/mermaid/issues/1940 and commit with fixes https://github.com/mermaid-js/mermaid/commit/0f31471b2ee3c7451485953d549fca7e2df1fb01
- **Bounty Awarded**
- **2021-05-04** @taraszelyk: Thank you for your decision!
- **Report Severity Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
