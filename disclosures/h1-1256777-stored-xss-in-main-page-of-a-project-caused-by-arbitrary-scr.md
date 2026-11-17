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
date: 2021-09-15
submitted: 2021-07-10T09:40:15.310Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "joaxcar"
source: "https://hackerone.com/reports/1256777"
title: "Stored XSS in main page of a project caused by arbitrary script payload in group 'Default initial branch name'"
---
# Stored XSS in main page of a project caused by arbitrary script payload in group "Default initial branch name"

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 80 | **Program:** GitLab | **Disclosed:** 2021-09-15

- Report: [https://hackerone.com/reports/1256777](https://hackerone.com/reports/1256777)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2021-07-10T09:40:15.310Z

## Timeline

- **Report Filed**
- **2021-07-11** @joaxcar: With some inspiration from Vakzz [report 836649](https://hackerone.com/reports/836649) I have now managed to bypass CSP on GitLab.com and execute creation and exfiltration of a `personal access token` of the victim. The XSS does not require any further action from the victim than visiting the project main page.

To bypass CSP on gitlab.com one can use a .js file stored in a job archive created by a pipeline:

https://gitlab.com/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/token.js

which will be delivered with header `content-type: application/javascript` and can thus be included as the CSP allows script injections from gitlab.com

to test this on GitLab.com you can use the payload
```
<script src="https://gitlab.com/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/alert.js"></script>
```
it will execute `alert(1)` twice as there are two injections on the page. To test token creation, you can use the payload
```
<script src="https://gitlab.com/joaxcar_group/first/-/jobs/1415515489/artifacts/raw/data/token.js"></script>
```
which as a security measure will ask for permission to create a `personal access token`. It will then show the token in an `alert` but also make a image query towards google.com just to test that exfiltration could be done.

After stealing an access token the attacker has full access to the API as the victim. And if the victim is an administrator, the attacker also has complete control over the Gitlab instance. Even if a user does not answer click on any email notification. The project will be added to the users project list and to "leave" the project the user needs to visit the project page. And thus is forced to trigger the XSS. There might be other ways to leave a project, but most users would probably access the project page.

The positioning of the XSS and the ability to target attacks by "invitation" in combination with access token exfiltration should position this as a quite critical XSS. (I put this in as a HIGH, but the "invitation" path could potentially raise it towards a CRITICAL, but I leave that up to you :) )

best,
Johan
- **2021-07-12** @h1_analyst_oliver: Hi @joaxcar,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@princeofpersia
- **Report Needs More Info**
- **Report New**
- **2021-07-12** @joaxcar: Hi again @princeofpersia

I think that I have found the commit that introduced the bug.

The merge request to update the instructions in the "new empty project page" can be found here ["
333404_update_git_instructions"](https://gitlab.com/gitlab-org/gitlab/-/commit/f597befac0ded7800cd888f9d49aac4c7e264d69). And the commit is here: [Update instructions how to initialize/clone git repository
](https://gitlab.com/gitlab-org/gitlab/-/commit/c73781b1c180543c5083bb40796420f2cc613b7c). This change seems to have been made in version 14.0.0 but I am not completely sure.

This explains why It did not work on your test instance, as the screenshot suggests that you are running an older version (the sidebar looks different).

The commit adds two instances of "#{default_branch_name}" which differ from the two old mentions of default branch name by not having the variable surrounded by whitespace. As so: "#{ default_branch_name }". This seemes to cause the injection.

Test the instructions on version 14 or above and it should work!

/Johan
- **2021-07-13** @joaxcar: To really emphasize on the severity of the positioning of this XSS:

As I noted earlier, inviting any target victim to the project will (with default settings) send an valid GitLab email notification to the victims registered email address, without the attacker needing to find this hidden email (by OSINT or other ways). This mail presents two links (see image) one to go to the project and one "to leave the project"

{F1374475}

==Both of which will execute the payload== as even the "leave link" is just a flag `?leave=1` on the link to the project. Adding a `window.stop();` in the attacker script will stop that from happening and just carry out the attackers script to completion.

Besides this the project is also added to the victims "Your projects" list

{F1374484}

All these links are created by the GitLab system and look (and are) authentic and should not raise any suspicion to the victim user. It also makes it extremely easy for an attacker to target victims as no further recon, OSINT or phishing needs to be performed. And as stated earlier visiting the project page is enough to trigger the payload.
- **Report Pending Program Review**
- **2021-07-17** @joaxcar: Thank you for the response @princeofpersia, I saw now that I misnamed the report as XXS instead of XSS.

I want to add some thoughts on severity and some findings concerning the root of the bug if the GitLab team decides to move forward with this.

## Severity

As the severity of an XSS vulnerability is tightly coupled to the impact of an attack, I want to share a PoC of a potential attack scenario. The placement of this XSS makes it possible to target ==all users== on an instance (or Gitlab.com) without relying on "wormable" payloads or any higher permissions or access rights than a newly created basic account.

This particular XSS requires that the victim is at least a `Developer` in the project. There are however no limitations (at this time) to how many users can be added to the project (or whom can be added). The API allows for batch adding of users to projects or groups through `/api/v4/projects/:ID/members`([invitation API](https://docs.gitlab.com/ee/api/members.html#add-a-member-to-a-group-or-project)). To make it even more interesting, adding users is made by user ID which is an incrementing integer. The victim is added without any posibility to deny the "invitation".

An "invitation attack" could take advantage of these features. A basic for-loop can be used to blindly invite all users on the instance to the project. This will send the `you are invited` emails (which are now a phishing email) and also persistently store the malicious project on the `Your projects` list of all users. Any user accessing the project will be compromised, leaking `personal access tokens` which can be uses to bypass 2FA for accessing all data and API functionality. As a bonus the attack will also target all administrators (even if the attacker does not know which accounts are admins) which could lead to complete instance takeover.

I have only tried this on my local environment but the report [978768](https://hackerone.com/reports/978768) showed (by a hacker not following the scope rules) that an `invitation attack` is possible on GilLab.com as well. I know that there is work on adding more rate limits, but I could not find any information that an invitation (as of adding by ID) rate is in place. The attack took a couple of minutes from account creation to having targeted 2000 users on my test server.

### PoC

1. The attacker creates an account on the instance (say gitlab.com).
2. The attacker creates a group and adds the payload as `default branch name`.
3. The attacker creates an empty project and takes a note of the ID of the project.
4. The attacker runs a python script inviting ==all users== on the instance as `Developer`s to the project (a basic outline of a script used on my own instance is added below {F1380384})

As you can see, this attack requires no special permissions or authorization except a regular account. And efficiently targets any or all user accounts on an instance.  The `Privileges Required` in the CVSS score should thus be `None`.

I think that this attack scenario proves this XSS quite critical.

## Root cause

I mentioned previously the commit that added the vulnerability is [c73781b1](https://gitlab.com/gitlab-org/gitlab/-/commit/c73781b1c180543c5083bb40796420f2cc613b7c). I do not know enough about HAML syntax to draw any final conclusions, but the problem seems to be that the combination of `pre` tags and `:preserve` filter removes the built in HTML escape functionality. Adding an `h` (escape HTML in Ruby), as in line 5 and 6 below, or wrapping the line in a sub-tag, as the `span` on line 19, seems to re-enable escaping. The problematic line is line 14 in this listing where the branch name is added without any of these re-enabling precautions.

```haml
%fieldset
        %h5= _('Git global setup')
        %pre.bg-light
          :preserve
            git config --global user.name "#{h git_user_name}"
            git config --global user.email "#{h git_user_email}"

      %fieldset
        %h5= _('Create a new repository')
        %pre.bg-light
          :preserve
            git clone #{ content_tag(:span, default_url_to_repo, class: 'js-clone')}
            cd #{h @project.path}
            git switch -c #{default_branch_name}
            touch README.md
            git add README.md
            git commit -m "add README"
          - if @project.can_current_user_push_to_default_branch?
            %span><
              git push -u origin #{ default_branch_name }
```

The documentation surrounding this did not give any clear information regarding this behavior. Some blog posts suggested that the problem is that interpolation (`#{}`) with the pre/preserve combo outputs unescaped HTML. Which in turn is interpreted by the browser. It seems to be the case here as well.

Regards,
Johan
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2021-07-21** @gitlab-securitybot: ETA for fix:

Hi @joaxcar,

The issue you reported is currently scheduled to be fixed by 2021-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2021-07-27** @joaxcar: Thank you @dcouture for looking in to the report, and for the bounty!

Out of curiosity: I have read some previous report discussions regarding severity ratings of XSS vulnerability. As I understand it, a vulnerability that can be used to bypass CSP is rated higher than one that is not. But is any additional information taken into account, as my described  "invitation attack", or is that just unnecessary information to add? Would be great to know if the extra effort of trying to "weaponize" the found vulnerability is worth it or if I should just report the bug and move on to other research.

Thanks in advance for any information regarding this, and again thanks for the bounty!

Regards,
Johan
- **2021-07-28** @dcouture: Hi @joaxcar,

For more complex issue it can help to get the maximum impact out of a bug, but the impact of XSS is generally well understood and it's probably not worth spending too much time on it once you already bypassed CSP.

Thanks,
Dominic
GitLab Security Team
- **2021-07-29** @joaxcar: Thank you again for the response @dcouture

In my case the XSS can, as been proven, be targeted towards all users on an instance. And utilizing GitLab invitation emails as phishing emails. Does this effect the severity of the report? A fully functional XSS vector can of course always cause the same JavaScript to be executed, but a lot of the impact of an XSS comes from the risk of users actually visiting the page.

I will not dwell more on this. I am just interested in understanding the assessment as I have seen bounties ranging from 1,5 to 5k for XSS reports

anyhow, thanks again for the answers and looking forward to the fix getting deployed!

Johan
- **2021-07-29** @dcouture: Hi @joaxcar,

The invite vector will not affect the severity of the report, we already consider it easy to get someone to visit that page. For transparency at the moment we normally pay $1500 for XSS without CSP bypass and $3000 for XSS with CSP bypass. Sometimes exceptional circumstances can lead to higher payment (I remember a wormable XSS in issues in the past) and this pay scale is subject to change in the future but it's what it looks like at the moment.

Thanks,
Dominic
GitLab Security Team
- **Report Resolved**
- **Bounty Awarded**
- **2021-08-08** @joaxcar: Hi @dcouture, thank you for the quick response and the bounty! And the information regarding severity ratings.

I would like to request a license for GitLab Self-hosted Ultimate if that is possible. I have made two other valid reports (one still awaiting the patch)

[1192460](https://hackerone.com/reports/1192460)
[1193062](https://hackerone.com/reports/1193062)

if the one awaiting the patch is not yet "valid" I have also made one report resolved as "update to the documentation"
[1199561](https://hackerone.com/reports/1199561)

Regards,
Johan
- **2021-08-09** @dcouture: Hello @joaxcar,

Thank you for requesting a license. We have validated your reports and requested a license to be sent to your `joaxcar@wearehackerone.com` email address. Please let us know if it has not been received in the next 48 hours, and we can resend it to you.

Thank you again for your interest in our program. We look forward to your future reports!

Best Regards,
Dominic
GitLab Security Team
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
