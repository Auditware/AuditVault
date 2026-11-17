---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-11-05
submitted: 2026-08-15T16:39:03.516Z
bounty_usd: null
votes: 45
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "0xbs0d27"
source: "https://hackerone.com/reports/3942522"
title: "wordpress.org Rosetta: invite stores unvalidated role — Editor can assign site Administrator despite editable_roles"
---
# wordpress.org Rosetta: invite stores unvalidated role — Editor can assign site Administrator despite editable_roles

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 45 | **Program:** WordPress | **Disclosed:** 2026-11-05

- Report: [https://hackerone.com/reports/3942522](https://hackerone.com/reports/3942522)
- CWE: Improper Access Control - Generic
- Submitted: 2026-08-15T16:39:03.516Z

## Report summary

On Rosetta locale sites, Editors can invite users but are not supposed to make anyone a site Administrator — WordPress normally blocks that via editable_roles.
A wordpress.org mu-plugin saved the invited user’s role from the HTTP request without checking that list, so an Editor could force role=administrator and elevate an account when the invite was accepted.

## Timeline

- **Report Filed**
- **2026-09-04** @0xbs0d27: Hi WordPress / H1 triage,

Friendly bump on #3942522 (submitted 2026-08-15). Status is still New with no triage response.

Summary: On Rosetta, Editors get promote_users but Administrator is removed via editable_roles. The mu-plugin wporg-add-existing-users-via-username.php stores $_REQUEST['role'] into the invite option before get_editable_roles()/wp_ensure_editable_role(), so an Editor can POST role=administrator and elevate a user to site Administrator (manage_options) when the invite is accepted.

Happy to provide more PoC details or clarify the Rosetta vs Learn distinction if needed.

Thanks,
0xbs0d27
- **2026-09-10** @bornull: Thanks for the report! We addressed it in https://github.com/WordPress/wordpress.org/pull/887/
- **Report Resolved**
- **Bounty Awarded**
- **2026-11-05** @0xbs0d27: Hi @bornull and team — thank you again for the fix (PR #887) and the bounty; really appreciated.

This has been Resolved since September, and I wanted to ask gently: if it works for you, would you mind approving public disclosure so it can show up in Hacktivity, similar to your other WordPress.org / meta reports?

I’ve added a short Hacker summary for the public view — happy to tweak anything if you’d like changes before approving.

Thanks so much, and thanks again for your work on this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
