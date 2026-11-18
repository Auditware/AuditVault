---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - trigger/auth-required
  - fix/input-validation
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2024-08-10
submitted: 2021-01-04T13:48:48.160Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "gronke"
source: "https://hackerone.com/reports/1071102"
title: "Registration bypass with leaked Invite Token"
---
# Registration bypass with leaked Invite Token

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Rocket.Chat | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/1071102](https://hackerone.com/reports/1071102)
- CWE: Improper Authentication - Generic
- Submitted: 2021-01-04T13:48:48.160Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

Regular expressions in the `validateInviteToken` route allows unauthenticated users to guess a valid invite token, that allows them to access a private channel or register accounts on a remote server with "Secret URL" registration method enabled.

**Description:**

The API route `validateInviteToken` passes an unauthenticated clients token bodyParam to the validateInviteToken method as found in [app/api/server/v1/invites.js#L45-L62](https://github.com/RocketChat/Rocket.Chat/blob/729e258326bcd1fd0685d6d4c4755e38c9f8831d/app/api/server/v1/invites.js#L45-L62)


```javascript
API.v1.addRoute('validateInviteToken', { authRequired: false }, {
	post() {
		const { token } = this.bodyParams;

		if (!token) {
			throw new Meteor.Error('error-invalid-token', 'The invite token is invalid.', { method: 'validateInviteToken', field: 'token' });
		}

		let valid = true;
		try {
			validateInviteToken(token);
		} catch (e) {
			valid = false;
		}

		return API.v1.success({ valid });
	},
});
```

The token is then passed to `Invites.findOneById(token)` without further checks of the input data, which allows to send an Object instead of a string. This object can be a `$regex` Mongo DB query, that reduces the number of queries required to leak a valid invite token.

Once found, an attacker can navigate to `/invite/:token` to then register a new account with access to the specific channel. After initial registration, the process can be repeated to join more rooms with non-expired invites.

```sh
curl 'https://open.rocket.chat/api/v1/validateInviteToken'
  -H "content-type: application/json"
  -d '{ "token": { "$regex": ".*" } }'
```

Expired invite token might mask other token because Mongo DB only returns one document (sorted by order of insertion). A valid strategy to leak a 6 character token (case-sensitive letters and numbers) is to prefix the regex (e.g. `^a.*`, `^b.*`, etc) and check the boolean result.

## Releases Affected:

  * 3.9.4

## Steps To Reproduce (from initial installation to vulnerability):

(Add details for how we can reproduce the issue)

  1.) Leak a valid token with consecutive `validateInviteToken` checks
  2.) Browse to `/invite/:leaked_token`
  3.) Register account

## Suggested mitigation

  * validate user input to be a String

## Impact

Unauthenticated attackers can leak invite links to register new accounts, although public registration is disabled. Authenticated users might gain unauthorized access to private chat rooms.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
