---
tags:
  - severity/high
protocol: "[[Bullpen]]"
auditors:
  - "[[Auditware]]"
  - sector/dex
genome:
  - "[[extcall-return-validation]]"
  - "[[access-control/secret-exposure]]"
  - "[[privilege-escalation/ownership-takeover]]"
  - "[[known-pattern]]"
  - "[[user-interaction]]"
  - "[[add-check]]"
  - "[[misassumption/offchain-is-trusted]]"
  - "[[blast-radius/single-user]]"
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

# **AW-L-01: Potential DOS via Unprotected Unwrap Calls** {#aw-l-01:-potential-dos-via-unprotected-unwrap-calls}

**Severity:** *Low*								**Status:** *Unmitigated*

**Locations:**

* [src/presentation/grpc/middleware/telegram\_webapp\_init\_data\_validator.rs](https://github.com/BullpenFi/bullpen-usergate/blob/6e1c5460fc4ad849761bd5cb99ea12b48d989787/crates/usergate/src/presentation/grpc/middleware/telegram_webapp_init_data_validator.rs#L34-L44)


**Description:**

Because the code uses “.unwrap()”, any missing or invalid data immediately triggers a panic rather than a controlled error path. This can lead to a full crash, which malicious actors can exploit by sending malformed requests (for instance, leaving out “hash” or providing an invalid format for “auth\_date”). If done in large volumes, these repeated panics can deny service to legitimate users.

In order to abuse this issue, a potential threat actor might follow these steps:

* The attacker crafts requests that lack certain required fields or that provide data of the wrong type.  
* Each invalid request encounters the “.unwrap()” call, causing an immediate panic.  
* By repeating this, the attacker can cause the application to repeatedly crash or become unable to handle new connections, thus resulting in a denial-of-service condition.


**Recommendation:**

* Stop relying on “.unwrap()” and instead verify that the necessary data is present and properly formatted. If it is missing or invalid, respond with an explicit error message rather than panicking.  
* Ensure that the application continues running after encountering malformed data by returning an appropriate status code or error message.  
* Consider adding rate-limiting to detect and reduce automated attempts that send large numbers of invalid requests.

This report was produced by Auditware for Bullpen based solely on the   
information provided by Bullpen. Auditware provides no guarantees as to the accuracy  
 of the contents of this report and does not make any guarantees that following the advice   
within will prevent security incidents or issues.

Auditware is available for questions or comments about any of the contents of this report. We can be reached at [https://auditware.io/](https://auditware.io/) or by email at [joe@auditware.io](mailto:joe@auditware.io).
