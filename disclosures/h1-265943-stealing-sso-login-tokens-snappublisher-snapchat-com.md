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
