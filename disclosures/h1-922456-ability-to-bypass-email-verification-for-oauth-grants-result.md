---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
date: 2020-10-01
submitted: 2020-07-13T10:47:32.845Z
bounty_usd: 3000
votes: 257
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "cache-money"
source: "https://hackerone.com/reports/922456"
title: "Ability to bypass email verification for OAuth grants results in accounts takeovers on 3rd parties"
---
# Ability to bypass email verification for OAuth grants results in accounts takeovers on 3rd parties

> **Severity:** High | **Bounty:** 3,000 USD | **Votes:** 257 | **Program:** GitLab | **Disclosed:** 2020-10-01

- Report: [https://hackerone.com/reports/922456](https://hackerone.com/reports/922456)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2020-07-13T10:47:32.845Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
There's a limitation that requires a validated email before going through the OAuth flow, however this is bypassable. Bypassing this means the target site assumes your email is validated, and actually ends up signing you in with an non-validated email. This behavior can frequently lead to account takeovers in 3rd parties since they often use the email as an identifier, and fold all OAuth/manually created accounts into one. In my example I am going to demonstrate an account takeover on https://laravelshift.com/, however this concept is widely exploitable.

It should also be possible to use this technique to get into internal company using pages that just look for `@domain.com` in the email before allowing them access.

### Steps to reproduce
1) Create a Bitbucket or GitHub account with a random email, and login to https://laravelshift.com/. (We're seeding a victim account).
2) In a different browser, create a new GitLab account with that same email but never confirm it.
3) In that browser, visit LaravelShift and click "Sign in with GitLab", notice you land on a page that states you cannot complete the OAuth grant without validating your email.

Run the following request in Burp replacing your cookies, CSRF token, and state parameter.

```
POST /oauth/authorize HTTP/1.1
Host: gitlab.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 354
DNT: 1
Connection: close
Cookie: [COOKIES]

utf8=%E2%9C%93&authenticity_token=[CSRF TOKEN]&client_id=6dd35c52b02a99eca3454505c4b1f1fa761ad1125bcdccdbc1c290877ef25093&redirect_uri=https%3A%2F%2Flaravelshift.com%2Fauth%2Fgitlab%2Fcallback&state=[STATE VALUE FROM URL]&response_type=code&scope=&nonce=
```
4) Notice the request succeeds with a 302 to LaravelShift with the `code`.
5) Visit that URL and notice you get logged into the victim's account from step 1. This works since the GitLab email is assumed to be trusted and validated.

### Impact

Account takeovers on 3rd parties due to developers assuming GitLab is properly checking validated emails.

### What is the current *bug* behavior?

It's possible to play the `/oauth/authorize` request directly to bypass the `Verify the email address in your account profile before you sign in.` prompt.

### What is the expected *correct* behavior?

The email verification check should be enforced at this step of the process as well.

## Impact

Thanks,
-- Tanner

## Timeline

- **Report Filed**
- **2020-07-13** @gitlab-securitybot: Hi @cache-money,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-07-21** @gitlab-securitybot: ETA for fix:

Hi @cache-money,

The issue you reported is currently scheduled to be fixed by 2020-08-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **2020-08-07** @cache-money: Confirmed this is fixed. You now get the `Verify the email address in your account profile before you sign in.` error directly from the POST.
- **2020-08-07** @jmatos_bgtvf: Hello @cache-money ,

Thank you for the feedback. We are now awarding the final bounty. Congratulations!

We look forward to your next report!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
