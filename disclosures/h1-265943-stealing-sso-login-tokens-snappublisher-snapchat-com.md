---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass
  - env/web
substate: "resolved"
weakness: "Authentication Bypass"
enriched: true
body: true
date: 2021-07-29
submitted: 2017-09-05T07:03:06.903Z
bounty_usd: 7500
votes: 244
cve: []
program: "[[programs/snapchat|Snapchat]]"
reporter: "coolboss"
source: "https://hackerone.com/reports/265943"
title: "Stealing SSO Login Tokens (snappublisher.snapchat.com)"
---
# Stealing SSO Login Tokens (snappublisher.snapchat.com)

> **Severity:** High | **Bounty:** 7,500 USD | **Votes:** 244 | **Program:** Snapchat | **Disclosed:** 2021-07-29

- Report: [https://hackerone.com/reports/265943](https://hackerone.com/reports/265943)
- CWE: Authentication Bypass
- Submitted: 2017-09-05T07:03:06.903Z

## Report summary

@coolboss was able to chain multiple security issues, which allowed him to extract SSO tokens from Snapchat users by sending them to a malicious website.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Description
Attacker can steal SSO login tokens for snappublisher.snapchat.com by chaining different flaws in SSO and Snapchat’s Snappublisher tool. Detailed attack flow is as follows.

# Attack Flow
1.. Snapchat fetches a `SSO LOGIN TOKEN` from `accounts.snapchat.com` to login into different products of Snapchat i.e. SnapPublisher, Ads Manager, Business Manager, etc. provided that user is logged into `accounts.snapchat.com`.
eg. To login into SnapPublisher following requests are made …
1] https://accounts.snapchat.com/accounts/login?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/sso_continue
2] 302 redirect to
https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https%3A%2F%2Fsnappublisher.snapchat.com%2Fsso_continue
3] again 302 redirect to 
https://snappublisher.snapchat.com/sso_continue?ticket=redacted

So, a SSO login token `ticket` is sent from `accounts.snapchat.com` to `snappublisher.snapchat.com` which is used to login the user. And is also used in `Authorization header` when making requests to API.

Now, we are going to steal this SSO login token `ticket` which will allow us to login and control victim’s account.

2.. On `snappublisher.snapchat.com`, I was able to upload a `svg` image to google cloud storage, using which I run my javascript code.
Note: Use `import from site` functionality via `https://snappublisher.snapchat.com/snaps/create/new` and import my `xss-svg` image from here (███████/tokenstealer.svg). This alerts and logs `#hashfragment` in the console. 
I have already did this in my POC so this is just for understanding purpose. My image URL is `https://snappublisher.snapchat.com/api/v1/media/████████/file/somthine.svg?%23pranav`

3.. Now, other flaws in SSO …
1] In this URL 
`https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/api/v1/media/████████/file/somthine.svg?%23pranav`

`referrer` parameter can be controlled and any `snappublisher.snapchat.com` URL is allowed.
Also, `%23pranav`, this `#hashfragment` is allowed in `referrer ` parameter. 

I take advantage of both these flaws to flow the `SSO login token` to my website or land to a page which I control.
Note: `#hashfragment` is send further by browser for `302` / `307` redirects.


4.. CSRF Login flaw
SSO functionality is vulnerable to CSRF attack so I can login other people into my account. I use this functionality to login user into my account.

5.. Token doesn’t expire flaw 
Once the SSO login token is used, it doesn’t expire and can be reused multiple times.

So, simple attack flow is as follows :
1. User is logged into `accounts.snapchat.com`.
2. Attacker logs user into his/her `snappublisher.snapchat.com` account via CSRF login flaw.
3. Now, attacker makes a request to fetch SSO login token `https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/api/v1/media/█████████/file/somthine.svg?%23pranav` and redirects the token in `#hashfragment` to `https://snappublisher.snapchat.com/api/v1/media/█████/file/somthine.svg?%23pranav`
4. `https://snappublisher.snapchat.com/api/v1/media/████/file/somthine.svg?%23pranav` this redirects with `307` status code to `storage.googleapis.com/creativesuite-prod-media/*` with `SSO login token ticket` in  `#hashfragment` carried forward by browser.
5. Svg image executes my js code and alerts and logs the `SSO login token ticket` in the console.
6. I can use the `ticket` to login into victim’s account. Via `https://snappublisher.snapchat.com/sso_continue?ticket=<stolen token>`

# Proof Of Concept

Video POC : █████████(Unlisted video on youtube)

1. Login into your account on `accounts.snapchat.com`.
2. Login into your SnapPublisher account `snappublisher.snapchat.com`.
3. Visit (█████) which fetches `user’s SSO login token` which can be used to login. (This alerts and logs the `token` in console.)
4. Use the token via `https://snappublisher.snapchat.com/sso_continue?ticket=<stolen token>`


# Impact 
1. Gain unauthorized access to Snappublisher account.
2. Can use the SSO login token to make API requests.

# Recommendations

1. For SSO functionality …
1] Add `state` param to prevent `CSRF login` on `https://snappublisher.snapchat.com/sso_continue?ticket=<token>` 
2] In `referrer` param of the following URL 
`https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/api/v1/media/██████████/file/somthine.svg?%23pranav` disallow `#hashfragments` to be included.
3] Make the `referrer` param of the following URL 
`https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/api/v1/media/███████/file/somthine.svg?%23pranav` more specific and restricted similar to your OAuth2 adsapi.
4] SSO login token should be one time use and should not be able to use it again and again.

2. For SnapPublisher
1] I observed you are using Google Cloud Storage, so blocking `svg` images or disallowing any uploads of `svg-xss` images will further enhance security. Otherwise, one can easily get `xss` on `storage.google`


Let me know if you need any help. :-)

Regards,
Pranav Hivarekar

## Timeline

- **Report Filed**
- **Report Triaged**
- **2017-09-05** @bsy: We received an earlier report about the login CSRF and a fix is on the way, hopefully ready by the end of the week. That will break that link in this attack chain.  We'll look closer at this report to see if there are other new actionable info that can help secure Snap.
- **2017-09-06** @coolboss: Thanks for the update.
- **2017-09-09** @bsy: The login CSRF from the other, earlier report should be fixed now and should also break the corresponding link in the attack chain here. The ticket-after-fragment bug is still pending, though arguably this has no security impact, since Javascript would just use window.location.href to get the URL (with query string values) and parse it for the ticket rather than parsing window.location.hash. There was another report on SVG issues, and I'll see if this is a duplicate of that (or by how much).
- **2017-09-09** @coolboss: Thanks for keeping me updated. It seems CSRF-login bug temporarily patches the attack mentioned in this report.

I would like to provide more information on the flaws I chained here. My report aims to be more concentrated towards flaws in your OAuth, so I would like you to pay more attention towards it.

Simple attack was to steal `SSO login token` to a third party domain and from third party domain to attacker’s domain which is not part of `*.snapchat.com`.

For example, look at the following SSO login URL which I modified ...
`https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/api/v1/media/██████████/file/somthine.svg?%23pranav`
Here, I am forcing the `SSO login token` to be sent to 
`https://snappublisher.snapchat.com/api/v1/media/██████/file/somthine.svg?#pranav&ticket=redacted`

I want to highlight that I used the SVG-xss to steal the token. This is just one way to do so. Whereas attacker can find a simple open redirector and then form an URL like `https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/myopenredirector` which will directly send the token to `open redirector` page and from there to attacker’s domain.

In my attack, I CSRF-login the victim into my account, so victim can access my svg file(https://snappublisher.snapchat.com/api/v1/media/████/file/somthine.svg) uploaded on my account. And using the svg file I am able to steal the token.


>the ticket-after-fragment bug is still pending, though arguably this has no security impact, since Javascript would just use window.location.href to get the URL (with query string values) and parse it for the ticket rather than parsing window.location.hash.

-- Here, I am redirecting the victim to `https://snappublisher.snapchat.com/api/v1/media/██████/file/somthine.svg?%23pranav` which decodes to `https://snappublisher.snapchat.com/api/v1/media/█████████/file/somthine.svg?#pranav&ticket=redacted`

Here, `https://snappublisher.snapchat.com/api/v1/media/██████████/file/somthine.svg?%23pranav` redirects with `307` status code to `https://storage.googleapis.com/creativesuite-prod-media/███/file?GoogleAccessId=creativesuite-prod@appspot.gserviceaccount.com&Expires=1504936648&Signature=███████%3D%3D&response-content-disposition=inline%3Bfilename%3D%22somthine.svg%22#pranav&ticket=redacted`. Please note that this is different domain that `*.snapchat.com`.

So, in order to steal `SSO login tokens` which are sent as query parameters (?ticket=something). It is nearly impossible to make browser forward query params from `snappublisher.snapchat.com` to `storage.googleapis.com`. I have used the browser’s behavior of forwarding `#hash-fragments` for `307 redirects`. So, for this URL `https://snappublisher.snapchat.com/api/v1/media/███████/file/somthine.svg?%23pranav` browser carries through the token with 307 redirect to `https://storage.googleapis.com/creativesuite-prod-media/█████/file?GoogleAccessId=creativesuite-prod@appspot.gserviceaccount.com&Expires=1504936648&Signature=██████%3D%3D&response-content-disposition=inline%3Bfilename%3D%22somthine.svg%22#pranav&ticket=redacted`  and then I am using the XSS to get the token.

You cannot get the `token` using `window.location.href` as you won’t be able to fetch the `SSO login token` to the SVG-XSS page on `storage.googleapis.com`.

In order to patch the whole OAuth flow, you will need to address all the vulnerabilities/flaws I highlighted in this report, otherwise one can again get the similar kind of account hijacking bugs using different open redirector or related flaws.

Sorry, for lengthy reply, but I hope I got my point through. :)

Regards,
Pranav
- **2017-09-11** @bsy: Thanks for the clarification. I was thinking you were able to host XSS on the snapchat domain and extract the query parameters that way. Of course, that would be a whole additional set of problems!  We are working on cleaning up the referrer= parameter handling to properly understand/handle URL fragments, so hopefully the use of this bug with redirects will be closed soon.
- **2017-09-12** @coolboss: Cool. Thanks for the update. Would love to check the functionality after patch.
- **2017-09-29** @coolboss: Just wanted to know, when can I expect bounty decision on this particular bug report?
- **2017-09-29** @bsy: Sorry about the delay.  We need to get some paperwork done to transfer additional funds to H1, and that's taking longer than expected.
- **2017-09-30** @coolboss: No problem about it. I was just asking so that I know how your program operates and how bounties are paid out after triage, before fix or after fix.
- **Bounty Awarded**
- **2017-10-02** @bsy: Oh, re: whether we assign awards before or after the fix, the answer is "it depends" :-)  If the bug is clear and the fix is understood/on the way, we can assign awards before the fix is deployed; however, sometimes we delay until the fix is completely done and tested, etc, because, as the adage goes, "the devil is in the details" — and the impact of the bug won't really be understood until the fix is done.

And then, of course, there's the paperwork elephant in the room.
- **2017-10-02** @coolboss: Hi Bennet,

First of all thanks for answering all my questions. :-) 

Secondly, thanks for the reward. I guess there's an admin panel or some `only snap-employees` functionality on snappublisher for which I believe you raised the reward. It is higher than expected with all the duplicates filtered out from my report. 

I appreciate your transparency in the bug triage process and bugbounty program as a whole. Also, answering every single question that comes up. :)

Glad to work with you. 

Regards,
Pranav Hivarekar
- **2017-10-13** @coolboss: Hi @bsy ,

Can you please check my other report #273615 ? I didn't receive proper response. It was closed after being triaged and reproduced withOUT proper understanding and verification of the issue. I replied back with more details but didn't receive any response yet.

Can you check it out?

Regards,
Pranav
- **2017-10-30** @bsy: The fixes for the issues discovered should have been deployed now. Could you please take a look?
- **2017-10-31** @coolboss: Hi Bennet,

I see you are not allowing any `#hashfragment` in the `referrer` param of SSO login URL which will forbid anyone to carry `ticket` in #hashfragment and will definitely strengthen the security all your other services which uses SSO login.

Only concern is that anyone is still able to redirect to any URL for a particular client. For example, I can still use https://accounts.snapchat.com/accounts/sso?client_id=creativesuite-prod&referrer=https://snappublisher.snapchat.com/thisispage and send the `ticket` to that specific page of the app. If you are able to restrict `referrer` param to certain specific URL then it will be more secure.

Given that this bug is fixed but cannot guarantee that, other attacks may evolve until you place strict redirect URLs for the apps.

Regards,
Pranav
- **Report Resolved**
- **Agreed On Going Public**
- **Changed Scope**
- **Report Severity Updated**
- **Manually Disclosed**
- **Report Vulnerability Types Updated**
- **Report Vulnerability Types Updated**
