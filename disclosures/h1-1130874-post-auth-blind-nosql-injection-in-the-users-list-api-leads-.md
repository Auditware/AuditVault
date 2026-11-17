---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2021-07-31
submitted: 2021-03-19T17:31:20.862Z
bounty_usd: null
votes: 13
cve: "CVE-2021-22910"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "sonarsource"
source: "https://hackerone.com/reports/1130874"
title: "Post-Auth Blind NoSQL Injection in the users.list API leads to Remote Code Execution"
---
# Post-Auth Blind NoSQL Injection in the users.list API leads to Remote Code Execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** Rocket.Chat | **Disclosed:** 2021-07-31

- Report: [https://hackerone.com/reports/1130874](https://hackerone.com/reports/1130874)
- CWE: N/A | CVE: CVE-2021-22910
- Submitted: 2021-03-19T17:31:20.862Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-03-26** @sonarsource: Hi @markus-rocketchat,

We have found another endpoint that is vulnerable in the same way.
The `users.autocomplete` API endpoint takes the `selector` query parameter which is then JSON-decoded.
It is then passed to the `findUsersToAutocomplete()` method where the `conditions` property is taken and passed to `Users.findActiveByUsernameOrNameRegexWithExceptionsAndConditions()`. There the `conditions` parameter (coming from the user input) is merged with the query object in a way that allows to overwrite the whole query. This allows an attacker to use the `$where` operator like we explained in the original report.

The user input flows like this:
1. [app/api/server/v1/users.js:801](https://github.com/RocketChat/Rocket.Chat/blob/eba1e9b3146e5102baed000953c2cb51930c345c/app/api/server/v1/users.js#L801)
1. [app/api/server/v1/users.js:807](https://github.com/RocketChat/Rocket.Chat/blob/eba1e9b3146e5102baed000953c2cb51930c345c/app/api/server/v1/users.js#L807)
1. [app/api/server/lib/users.js:25](https://github.com/RocketChat/Rocket.Chat/blob/eba1e9b3146e5102baed000953c2cb51930c345c/app/api/server/lib/users.js#L25)
1. [app/models/server/raw/Users.js:257](https://github.com/RocketChat/Rocket.Chat/blob/eba1e9b3146e5102baed000953c2cb51930c345c/app/models/server/raw/Users.js#L257)

We have also found another way of exploiting both vulnerable endpoints. It involves extracting values from the database via error messages, which is why we propose another general remediation in addition to the ones listed in the original report:
Error messages from internal components, such as the database, should bot be included in API responses because they might include sensitive information. They should instead be replaced with generalized error messages.

Sorry for the late addition! If you have any questions or need more details you can ask anytime.
Kind regards
- **2021-03-26** @markus-rocketchat: Hi @sonarsource 

no need to apologize, in fact THANK YOU a lot! This is extremely valuable information and I have already passed it on to the devs for evaluation.

Best
Markus
- **Report Resolved**
- **2021-04-16** @sonarsource: Hi @markus-rocketchat 

The fix looks good!
We would like to assign a CVE for this vulnerability, should we handle it or do you want to do it?

Kind regards
- **2021-04-19** @markus-rocketchat: thank you for your feedback!

about CVE: both ways would work for us, We just would like to ask to maintain a responsible disclosure timeline for at least 30 days since the fix went live. If you want us to request the CVE, please request a disclosure of the report and the CVE will be published together with the report after the responsible disclosure.
- **Agreed On Going Public**
- **2021-05-12** @sonarsource: Hi,

We found that the variant of the vulnerability (in the `users.autocomplete` endpoint) we mentioned earlier is still vulnerable because of a flaw in the fix.

The `clean` function in [app/api/server/lib/cleanQuery.ts](https://github.com/RocketChat/Rocket.Chat/blob/master/app/api/server/lib/cleanQuery.ts#L21) that is used to remove forbidden operators from a query object uses a regex to check if a property name starts with `$`:
```typescript
export function clean(v: Query, allowList: string[] = []): Query {
	const typedParam = removeDangerousProps(v);
	if (v instanceof Object) {
		/* eslint-disable guard-for-in */
		for (const key in typedParam) {
			if (/^$/.test(key) && !allowList.includes(key)) {
				delete typedParam[key];
			} else {
				clean(typedParam[key], allowList);
			}
		}
	}
	return typedParam;
}
```
The regex is flawed because `$` has a special meaning. It represents the end of the input and not a literal `$` character when used in regular expressions.
Because of this, the function only removes empty property names, and not the ones starting with `$`. This allows the use of dangerous operators such as `$where`.

To patch this, it is best to use `key.startsWith('$')` instead of a regex, because it is more clear and less error-prone.

As mentioned in our last message, we will release a blog post on Tuesday that will feature the original vulnerability in the `users.list` endpoint,  the variant in the `users.autocomplete` endpoint will not be mentioned in it.
- **2021-05-18** @markus-rocketchat: Hi @sonarsource 

the CVE is requested and will be published once the report is disclosed. 

Could you please remove your last comment as it is a different vulnerability? I have informed our team already about it and please feel free to submit another Hackerone vulnerability for it. 

Once you remove the comment, I can disclose directly.
- **2021-05-19** @sonarsource: Hi @markus-rocketchat 

It seems we cannot remove or edit comments, at least HackerOne's UI does not give us the option to do it.
If you can remove or hide it (like the exploit script), please do so.

We will create a new report about the bypass.

Thanks!
- **Cancelled Disclosure Request**
- **2021-05-19** @markus-rocketchat: i just unlocked from the disclosure process, but cant do comment modification either. We would like to wait with the disclosure until we have a fix for the other endpoint. would that be ok? if you have a blog or external disclosure, you could already disclose the previous one.
- **2021-05-19** @sonarsource: Yes that is fine, we don't want to disclose unfixed vulnerabilities.
FYI, we have released a blog post on the fixed ones yesterday: https://blog.sonarsource.com/nosql-injections-in-rocket-chat
- **2021-05-28** @markus-rocketchat: Hi @sonarsource 

we issued a fix for the other endpoint you mentioned in the hotfix 3.12.6, 3.13.4, 3.14.2.
Thanks again for the additional info!

If you would like, we could start the disclosure process and disclose in 30 days.

Best
Markus
- **Agreed On Going Public**
- **2021-06-28** @sonarsource: Hi,

As we are close to the disclosure (2 days) please don't forget to remove the exploit script from the report before it goes public.

Thanks!
- **Cancelled Disclosure Request**
- **2021-07-01** @markus-rocketchat: @sonarsource wow, apologies! just saw this now and removed the script. should be good to disclose now!
- **Agreed On Going Public**
- **Report Became Public**
