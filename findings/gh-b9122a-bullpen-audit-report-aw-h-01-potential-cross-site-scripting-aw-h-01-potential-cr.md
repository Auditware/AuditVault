---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - sector/dex
protocol: "[[Bullpen]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[missing]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# **AW-H-01: Potential Cross-site Scripting** {#aw-h-01:-potential-cross-site-scripting}

**Severity:** *High*								**Status:** *Unmitigated*

**Locations:**

* All React elements with user inputs and rendered user data  
* Input data sources (unsanitized inputs)

**Description:**

The app’s security is underpinned by credentials stored in local storage and Telegram cloud storage. These credentials are only as secure as the Javascript that handles them. Thus, any cross-site scripting vulnerabilities would undermine the security module of the entire service.

It is unclear what protections Telegram mini apps provide to mitigate cross-site scripting, so it is recommended to prevent any possible XSS vulnerabilities.

In order to abuse this issue, a potential threat actor might follow these steps:

* Inject an XSS payload into a data source or input field in the Bullpen app (OR deliver a reflected XSS payload via social engineering or CSRF vector)  
* Stored XSS payload is executed when rendered in victim’s browser instance  
* Credentials are exfiltrated to attacker controlled device (or attacker could directly execute trades in victim’s browser)

**Recommendation:**

* Configure a [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#1-restricting-inline-scripts) to prevent inline scripts  
* OR implement input sanitization and output encoding  
* [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

# **AW-M-01: Lack of CSRF Protection** {#aw-m-01:-lack-of-csrf-protection}

**Severity:** *Medium*								**Status:** *Unmitigated*

**Locations:**

* All server-side endpoints that change the application state (e.g. POSTs and PUTs)  
* Client-side requests made from the mini app

**Description:**

User sessions in the app are necessarily granted permissions to initiate and execute on-chain transactions. These actions are typically initiated by the user directly through the app, but potentially forged requests could cause as much damage as a stolen credential. Cross\-Site Re	quest Forgery (CSRF) is one such vector by which an attacker could trick a user into executing a forged request that the user did not intend to authorize. 

It is unclear what protections Telegram mini apps provide to mitigate CSRF attacks, but it is recommended to directly mitigate CSRF just in case there are any unknown attack vectors.

In order to abuse this issue, a potential threat actor might follow these steps:

* Attacker crafts a specific url to open the Bullpen mini app in Telegram and perform a state-changing operation, such as an on-chain token trade  
* Attacker socially engineers victim to click the url link via Telegram message  
* State changing actions could be triggered with the fully authenticated context of the user’s session (e.g. executing a token swap, logging out the user, registering an account, etc.)

**Recommendation:**

* Implement a CSRF prevention measure (double-submit cookie method is recommended)  
* [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended)
