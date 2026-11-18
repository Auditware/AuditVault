---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-04-24
submitted: 2025-04-22T06:51:55.633Z
bounty_usd: null
votes: 86
cve: []
program: "[[programs/dust|Dust]]"
reporter: "0xsom3a"
source: "https://hackerone.com/reports/3103755"
title: "Privilege Escalation in Edit and Create Secret Endpoints Leads to Unauthorized Secret Modification"
---
# Privilege Escalation in Edit and Create Secret Endpoints Leads to Unauthorized Secret Modification

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 86 | **Program:** Dust | **Disclosed:** 2025-04-24

- Report: [https://hackerone.com/reports/3103755](https://hackerone.com/reports/3103755)
- CWE: Improper Access Control - Generic
- Submitted: 2025-04-22T06:51:55.633Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary

A user with the **Builder** role — a role that is **not expected** to manage secrets — can:

- ✅ **List all existing secret names** in the workspace.
- ✅ **Create new secrets**.
- ✅ **Overwrite existing secrets** simply by using the same name.

This behavior **violates permission boundaries** and  leads to **privilege escalation**, **tampering with app configurations**, or **unauthorized access to sensitive data**.

---

# Steps to Reproduce

##Step-1 :  Get All Secret Names in the Workspace

As a **Builder**, send a `GET` request to the secrets endpoint to enumerate all existing secret names.

```http
GET /api/w/[workspace_id]/dust_app_secrets HTTP/2  
Host: dust.tt  
Cookie: [appSession]
```

This returns a list of secrets with their `id`, `name`, `created_at`, etc. — but without showing the secret `value`.

```json
{
  "secrets": [
    { "name": "NAME-1", "value": "•••••••" },
    { "name": "NAME-2", "value": "•••••••" }
  ]
}

```


##**Step-2 :** Create or Overwrite a Secret

Now, send a `POST` request to create a new secret.


```json
POST /api/w/[workspace_id]/dust_app_secrets HTTP/2  
Host: dust.tt  
Content-Type: application/json  
Cookie: [appSession]

{
  "name": "NAME-1",
  "value": "malicious-value"
}
```

#### Behavior:
- If the `name` used in the request **already exists** in the workspace (as returned from step 1), the system will **overwrite the existing secret's value**.
- If the `name` is **new**, a new secret will be created.

-  No error or warning is shown — overwrite happens silently.

---

#POC Video:

██████


---

# Expected Behavior

The **Builder** role should:

-  Not be able to access the list of secret names.
-  Not be able to create or update any secrets.

---

# Suggested Fix

- Enforce strict permission checks on all secret-related endpoints.
- Ensure only users with elevated roles (e.g., Admin, Owner) can list, create, or update secrets.

## Impact

This vulnerability allows users with the **Builder** role to:

-  Discover all secret names in the workspace.
-  Tamper with or overwrite secrets used by other users or apps.
-  Create new secrets and potentially trick other users into using them.
-  Escalate privileges by modifying secrets used in sensitive flows (e.g., API keys, tokens, credentials).

This could lead to:

- Configuration manipulation  
- Account compromise  
- Supply chain attacks on internal tooling  
- Loss of integrity of secret data

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2025-04-24** @0xsom3a: hey there,

if you are okay with the disclosure, redact the poc video and accept the request

best regards,
0xom3a
- **Agreed On Going Public**
- **Report Became Public**
- **2025-10-12** @0xsom3a: Hi @spolu-dust  and Dust team,

I would like to ask whether Dust can assist with requesting a CVE identifier for this report, or advise the preferred process for requesting CVE assignment.

Please let me know Whether you can help request a CVE or recommend the appropriate path.

Thanks — looking forward to your guidance.
Regards,
0xsom3a
