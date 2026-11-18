---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/password-in-configuration-file
  - env/web
  - vuln/jwt
  - trigger/auth-required
substate: "resolved"
weakness: "Password in Configuration File"
enriched: true
body: true
date: 2019-09-08
submitted: 2019-07-09T23:30:54.992Z
bounty_usd: null
votes: 102
cve: []
program: "[[programs/trint|Trint Ltd]]"
reporter: "xh3n1"
source: "https://hackerone.com/reports/638635"
title: "Insecure Zendesk SSO implementation by generating JWT client-side"
---
# Insecure Zendesk SSO implementation by generating JWT client-side

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 102 | **Program:** Trint Ltd | **Disclosed:** 2019-09-08

- Report: [https://hackerone.com/reports/638635](https://hackerone.com/reports/638635)
- CWE: Password in Configuration File
- Submitted: 2019-07-09T23:30:54.992Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
app.trint.com implements SSO to Zendesk, it does this by using JWT as described at https://support.zendesk.com/hc/en-us/articles/203663816-Enabling-JWT-JSON-Web-Token-single-sign-on

This functionality has not been implemented securely because the JWT generation happens in the client-side. This is done by the Zendesk secret being hardcoded in the JavaScript code.
The secret is used to create JSON Web Tokens and then you can use the generated token to impersonate any customer in Zendesk. (therefore potentially getting access to their support tickets)

Whilst support.trint.com is marked as out of scope for the program, the described vulnerability isn't caused by Zendesk. The vulnerable component is in app.trint.com.

## Assessment
The JavaScript source map files are available next to the minified production files. This significantly makes analyzing this issue easier.

- JavaScript file: https://app.trint.com/static/js/app.e984c9df.js
- Sourcemap file: https://app.trint.com/static/js/app.e984c9df.js.map

Looking at some of the UI views, I stumbled upon `static/js/modules/auth/pages/ZendeskLoadingPage.js`. I've attached a stripped version which shows the JWT generation:

```js
[snip]
import { ZENDESK_DOMAIN } from 'modules/core/constants/index';

const { REACT_APP_ZENDESK_SECRET } = process.env;

[snip]

function RedirectToZendesk(props) {
  const { user, history } = props;

  function generateZendeskTokenAndRedirect() {
    const TIME_NOW_OBJECT = moment(Date.now());
    try {
      const payload = {
        iat: TIME_NOW_OBJECT.unix(),
        jti: uuid.v4(),
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        email: user.username,
      };

      // encode zendesk token
      const zendeskToken = jwt.sign(payload, REACT_APP_ZENDESK_SECRET);
      window.location = `${ZENDESK_DOMAIN}/access/jwt?jwt=${zendeskToken}`;
    } catch (err) {
      history.push('/error');
    }
  }

  useEffect(
    () => {
      generateZendeskTokenAndRedirect(user);
    },
    [user],
  );

  return <Loader />;
}

[snip]

export default ZendeskLoadingPage;
```

Searching for `REACT_APP_ZENDESK_SECRET` in the sourcemap will show the JWT secret: 

```js
var REACT_APP_ZENDESK_SECRET = "oq1HJ4jXo99Wt41bwvLh9BXBVdgpi52CjkXbThow7UhWQGtJ";
```

Generating the JWT on the client-side like this allows anyone to mint an arbitrary JWT. It would probably be better to generate this on the server-side.

## Reproduction steps

- As logged-in user press "Support" on https://app.trint.com
- Intercept the traffic and see the call to `https://trintsupport.zendesk.com/access/jwt?jwt=[JWT_TOKEN]`
- Logout of Zendesk
- Put the JWT token from above URI into https://jwt.io and decode it.

Example:
```
[REDACTED-JWT]
```

```
{
  "iat": 1562709659,
  "jti": "21d02987-e7ab-4490-97d7-76a0f32a95c8",
  "name": "Test Test",
  "email": "b3871694@urhen.com"
}
```

- Now we can continue with tampering the JWT 
  - Change IAT to the current Unix timestamp
  - Change JTI to a random UUID v4
  - Change email to the victim email address
  - Insert `oq1HJ4jXo99Wt41bwvLh9BXBVdgpi52CjkXbThow7UhWQGtJ` as HMAC secret.
- Use the resulting JWT in a call to `https://trintsupport.zendesk.com/access/jwt?jwt=[JWT_TOKEN]`. You will be logged in as the victim.

## Impact

Access to the Zendesk account of Trint customers. This includes potentially the support history of said user.

I haven't verified whether the same SSO flow can also be used against Zendesk administrators. If so, the risk would be higher.

## Timeline

- **Report Filed**
- **2019-07-11** @h1_analyst_fernando: Hi @xh3n1,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@tabascojellybeans
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
