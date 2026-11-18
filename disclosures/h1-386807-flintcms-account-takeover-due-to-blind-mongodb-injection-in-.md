---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2018-08-15
submitted: 2018-07-25T20:41:49.826Z
bounty_usd: null
votes: 12
cve: "CVE-2018-3783"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "becojo"
source: "https://hackerone.com/reports/386807"
title: "[flintcms] Account takeover due to blind MongoDB injection in password reset"
---
# [flintcms] Account takeover due to blind MongoDB injection in password reset

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-15

- Report: [https://hackerone.com/reports/386807](https://hackerone.com/reports/386807)
- CWE: Privilege Escalation | CVE: CVE-2018-3783
- Submitted: 2018-07-25T20:41:49.826Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a privilege escalation vulnerability in flintcms.
It allows to reset a known user password, extract its password reset token and reset its password to then access the account.

# Module

**module name:** flintcms
**version:** v.1.1.9
**npm page:** `https://www.npmjs.com/package/flintcms`

## Module Description

Flint is a CMS built to be easy to use and super flexible. Your content needs to fit into more layouts and environments than anyone but you can plan for, so Flint enables you to make the templates you need and fill it with your content. It's a CMS that is built for those who want to fully design the front-end of their website without wanting to deal with static site generators or older content management systems (that are slow and use outdated technology).

## Module Stats

7 downloads in the last week

# Vulnerability

## Vulnerability Description

The vulnerability is caused by the lack of user input sanitization in the route that verifies the password reset token. The value from the parameter is directly sent to the Mongoose API which allows a user to insert MongoDB query operators. These operators can be used to extract the value of the field _blindly_ in the same manner of a blind SQL injection. In this case, the `$regex` operator is used to guess each character of the token from the start.

Vulnerable code:

```js
  router.get('/verify', async (req, res) => {
    const token = req.query.t

    const user = await User.findOne({ token })

    if (!user) {
      res.redirect('/admin')
      return
    }

    res.redirect(`/admin/sp/${token}`)
  })
```
You can tell the different behavior when visiting these pages (assuming one of the user has reset their password):
- http://localhost:4000/admin/verify?t[$ne]=something redirects to http://localhost:4000/admin/sp/[object%20Object]
- While http://localhost:4000/admin/verify?t[$eq]=something redirects to http://localhost:4000/admin/login?p=/admin/

To take over an account, the following are required:
1. Reset the password of the targeted account (the email of the target user must be know)
2. Use the password reset page to extract the token using the blind MongoDB injection
3. Use the token to reset the password and log in 

---

To lift the requirements to know the email, it is also possible to find the emails of the users because the password reset form is also vulnerable to blind MongoDB injection. In the same manner as previously, each character of the email can be guessed using the `$regex` MongoDB operator.

Vulnerable code:
```js
  router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).end('There is no user with that email.')
      return
    }
    // [...]
```

## Steps To Reproduce:

1. Follow the install guide https://flintcms.co/docs/installation/
2. Create the admin user at http://localhost:4000/admin/install
3. Log out
4. Proceed to reset the password of the admin. Let's say the email configured was `admin@localhost.com`
5. Run the provided Python script
6. Visit the reset URL that the script finds
7. Reset the user password
8. You are now logged in

## Patch
The request parameters should be converted to string before being sent to the Mongoose API. Adding `.toString()` to the parameters should be enough to prevent objects being passed to Mongoose. For example:

```js
    const { email } = req.body
    const user = await User.findOne({ email: email.toString() })
```

```js
    const token = req.query.t.toString()
```

Further sanitization should be added to other endpoints. 

## Supporting Material/References:

- Ubuntu 16.04.3 LTS
- v8.4.0
- 5.3.0
- For the script: Python 2.7.12 and the `requests` package

# Wrap up
- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

An attacker could take over the website, delete data or server malicious content.

## Timeline

- **Report Title Updated**
- **Report Filed**
- **2018-07-25** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2018-07-27** @lirantal: Hi @becojo,

Thanks for your report!
I'll go ahead and invite the module author to join the discussion and evaluate the vulnerability with you.
- **Report Severity Updated**
- **Report Triaged**
- **2018-08-07** @becojo: Nevermind. I thought I found something easier to exploit the vulnerability but turns out you still need the original script.
- **2018-08-10** @lirantal: Due to inactivity from the maintainer I opened an issue in the repository: https://github.com/JasonEtco/flintcms/issues/77
- **External User Joined**
- **2018-08-10** @jasonetco: Hey folks - thanks for opening the issue @lirantal, I hadn't seen this before, and thhans for reporting @becojo! I'll go ahead and convert to string as you've suggested, and cut a new release immediately.
- **2018-08-10** @jasonetco: [Version 1.1.10 has been released](https://www.npmjs.com/package/flintcms/v/1.1.10) - I intentionally chose not to do this in a PR, but you can still [see the diff here](https://github.com/JasonEtco/flintcms/compare/49e4b6a49e8ba378313845162cd32ba06a2681d6...14dc0724a031f285e0cc057608937bfde8e39c90).
- **2018-08-11** @lirantal: @jasonetco great, thank you for the prompt reply!
@becojo can you verify the fix please?
- **2018-08-14** @becojo: Yes the fix works. Thank you @jasonetco
- **2018-08-15** @lirantal: Great work guys!
I'll go ahead and fully disclose this report, let me know if you prefer otherwise to avoid it.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
