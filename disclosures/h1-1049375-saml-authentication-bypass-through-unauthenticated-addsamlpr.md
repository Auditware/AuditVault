---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-01-08
submitted: 2020-12-03T03:40:59.324Z
bounty_usd: null
votes: 5
cve: "CVE-2020-29594"
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "fabianfreyer"
source: "https://hackerone.com/reports/1049375"
title: "SAML authentication bypass through unauthenticated `addSamlProvider` Meteor Call"
---
# SAML authentication bypass through unauthenticated `addSamlProvider` Meteor Call

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Rocket.Chat | **Disclosed:** 2021-01-08

- Report: [https://hackerone.com/reports/1049375](https://hackerone.com/reports/1049375)
- CWE: Improper Access Control - Generic | CVE: CVE-2020-29594
- Submitted: 2020-12-03T03:40:59.324Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** Rocket.Chat exposes an unauthenticated Meteor method `addSamlProvider`, which allows disabling SAML signature verification.

**Description:**

The `addSamlProvider` Meteor method sets a number of settings, among them a boolean flag that defaults to `false`:
```js
export const addSamlService = function(name: string): void {
	settings.add(`SAML_Custom_${ name }`, false, {
		type: 'boolean',
		group: 'SAML',
		i18nLabel: 'Accounts_OAuth_Custom_Enable',
	});
```

The provider `name` is entirely user-controlled in this case.

Secondly, if a SAML authentication provider does not have a certificate set, or the setting is falsy, no validation is performed:
```js
private verifySignatures(response: Element, assertionData: ISAMLAssertion, xml: string): void {
	if (!this.serviceProviderOptions.cert) {
		return;
	}
```

## Releases Affected:

  * all versions including `meteor-accounts-saml`, i.e. 0.8.0 and later.

## Steps To Reproduce (from initial installation to vulnerability):

On the login page of a Rocket.Chat instance supporting SAML authentication using a provider named `Default` (this is the default), run the following Meteor call:
```
Meteor.call("addSamlService", "Default_cert")
```

Then log in using an arbitrarily faked SAML response.

## Suggested mitigation

  * Remove the `addSamlProvider` Meteor method. All callers of the underlying function are server-side, therefore it needs not be exposed to the client.

## Impact

* An unauthenticated attacker can disable SAML certificate validation on an instance with SAML authentication enabled, and then log in as an arbitrary user with administrative privileges.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-12-05** @fabianfreyer: I've reviewed the following releases and can confirm they fix this issue:
* 0.74.4
* 1.3.4
* 2.4.13
* 3.7.3
* 3.8.3
* 3.9.1

An indicator of compromise would be the presence of settings such as `SAML_custom_..._cert_cert`.

From my side, this can be closed & disclosed.
- **Report Resolved**
- **Cve Id Added**
- **Agreed On Going Public**
- **Report Became Public**
