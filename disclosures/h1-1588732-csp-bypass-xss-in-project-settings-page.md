---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - stack/gitlab
  - vuln/xss
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2022-11-16
submitted: 2022-06-01T14:29:35.949Z
bounty_usd: null
votes: 100
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "yvvdwf"
source: "https://hackerone.com/reports/1588732"
title: "CSP-bypass XSS in project settings page"
---
# CSP-bypass XSS in project settings page

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 100 | **Program:** GitLab | **Disclosed:** 2022-11-16

- Report: [https://hackerone.com/reports/1588732](https://hackerone.com/reports/1588732)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2022-06-01T14:29:35.949Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

This javascript [function](https://gitlab.com/gitlab-org/gitlab/-/blob/85fbd72dc08bcedcb9fe80fad4df798e9527ded8/app/assets/javascripts/projects/settings/access_dropdown.js#L534) is vulnerable:


```javascript
  deployKeyRowHtml(key, isActive) {
    const isActiveClass = isActive || '';

    return `
      <li>
        <a href="#" class="${isActiveClass}">
          <strong>${key.title}</strong>
          <p>
            ${sprintf(
              __('Owned by %{image_tag}'),
              {
                image_tag: `<img src="${key.avatar_url}" class="avatar avatar-inline s26" width="30">`,
              },
              false,
            )}
            <strong class="dropdown-menu-user-full-name gl-display-inline">${escape(
              key.fullname,
            )}</strong>
            <span class="dropdown-menu-user-username gl-display-inline">${key.username}</span>
          </p>
        </a>
      </li>
    `;
  }
```

It is used to render a deployment key in a dropdown item. Because the deployment title is controlled by users, it can be any html content, such as, `<script>alert(document.domain)</script>`. Furthermore, the html content will be [rendered](https://gitlab.com/gitlab-org/gitlab/-/blob/85fbd72dc08bcedcb9fe80fad4df798e9527ded8/app/assets/javascripts/deprecated_jquery_dropdown/gl_dropdown.js#L396) using jQuery, so the `<script>` tag will be executed despise of CSP with `script-src ` having  `'strict-dynamic'`  value:

```javascript
  renderMenu(html) {
    if (this.options.renderMenu) {
      return this.options.renderMenu(html);
    }
    return $('<ul>').append(html);
  }
```

### Steps to reproduce

1. In an existing project or create a new one, goto `Settings`/`Repository`. Then fill the form in `Deploy keys` as the following:

- `Title`:  `test <script>alert(document.domain)</script>`
- `Key`:  `ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCkhkyrQJvb30Q5lLZzxeALqCyBrLOh+QzRYWh+gPGpqi2efyGMf5beN2zda66OI6DaclB31SJ0jYzaYKgKXQw7rzu/IYazONdy5lz5O2iUB2BkDzJYZ+BObTaTCjyDgSvNNuezUqNXXqoXftEMa1l0+FRSkTusH5F2P3JCV3Tf1BBQImrbDIpdc6ps+UxsiX7S/dT+7bNIVXblC8s8k+AK4CWsC2KmfMToK35pk+sa9JI+rb26hzv8IHA8n7cqXOmR5qAj2qX962p1kOLNXCyHJAKAIfRXCuDPbXiB+kjnu478eIcudOPveo3CK3G6hBI0hPSRfoyAUIubcddnnbhR `
- `Grant write permissions to this key`:  Checked

Then click `Add key` button to save the form.

{F1752821}


__NOTE__: 

- `Title` can be any HTML content that represents the attack payload. In the example above, we just show an alert containing the current domain.
- `Key` can be any valid SSH public key. In the example above, I give you a random key so that you can copy-paste into the form without the need to generate a key

2. Always in the `Settings`/`Repository` page, click on `Protected branches` link to expand its form
3. Click on the dropdown box under `Allowed to push `, you should see an alert that was generated when the payload above being executed

{F1752822}

__NOTE__:

- This is not self-XSS as any project maintainer can access to the settings page. Furthermore a victim can be added as a project maintainer without their explicit acceptation
- The Step 2 can be ignored by accessing directly within `#js-protected-branches-settings` on the url, for example, `https://gitlab.com/yvvdwf/xss/-/settings/repository#js-protected-branches-settings`

### Impact

XSS with CSP bypass allows attacks to perform arbitrary malicious requests on behalf of victims on HTTP client side, such as, do an API request to access to private resources, etc.

### Examples

https://gitlab.com/yvvdwf/xss/-/settings/repository#js-protected-branches-settings

### What is the current *bug* behavior?

Deployment title is not sanitized

### What is the expected *correct* behavior?

Deployment title should be sanitized

### Output of checks

This bug happens on GitLab.com

## Impact

XSS with CSP bypass allows attacks to perform arbitrary malicious requests on behalf of victims on HTTP client side, such as, do an API request to access to private resources, etc.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Triaged**
- **2022-06-04** @gitlab-securitybot: ETA for fix:

Hi @yvvdwf,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
