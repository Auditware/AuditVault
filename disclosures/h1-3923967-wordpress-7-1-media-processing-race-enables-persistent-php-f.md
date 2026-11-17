---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/wordpress
  - stack/php
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2026-10-21
submitted: 2026-08-07T16:46:52.221Z
bounty_usd: null
votes: 37
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "mappymappy123"
source: "https://hackerone.com/reports/3923967"
title: "WordPress 7.1 Media Processing Race Enables Persistent PHP File Write and Author-to-RCE"
---
# WordPress 7.1 Media Processing Race Enables Persistent PHP File Write and Author-to-RCE

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 37 | **Program:** WordPress | **Disclosed:** 2026-10-21

- Report: [https://hackerone.com/reports/3923967](https://hackerone.com/reports/3923967)
- CWE: Code Injection
- Submitted: 2026-08-07T16:46:52.221Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **2026-08-07** @mappymappy123: Could you please let us know if this condition is not considered an issue due to the preconditions? We will close this from our end if that is the case.

The `WP_CONTENT_DIR` temp condition is uncommon but realistic. It can occur when:

- Hosting guidance explicitly sets `WP_TEMP_DIR` to `wp-content/temp`; [Hostinger documents this exact workaround](https://www.hostinger.com/tutorials/how-to-fix-missing-temporary-folder-error-on-wordpress).
- A hardened container uses `readOnlyRootFilesystem` and mounts only `wp-content` writable without providing a writable `/tmp`.
- Restricted IIS/PHP-FPM environments deny the PHP worker access to the system temp directory while leaving `wp-content` writable, as historically documented in [WordPress ticket #22900](https://core.trac.wordpress.org/ticket/22900).

This is not the default on ordinary Linux installations, but it is a supported fallback reached in real deployments. The condition should therefore reduce severity/prevalence, not make the core issue N/A.
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Bounty Awarded**
- **2026-08-17** @ari-gato: Thanks for the triage and the bounty @johnbillion !
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
