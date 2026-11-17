---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2019-05-26
submitted: 2019-04-07T09:06:52.809Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "foobar7"
source: "https://hackerone.com/reports/530499"
title: "WooCommerce: Persistent XSS via customer address (state/county)"
---
# WooCommerce: Persistent XSS via customer address (state/county)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Automattic | **Disclosed:** 2019-05-26

- Report: [https://hackerone.com/reports/530499](https://hackerone.com/reports/530499)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-04-07T09:06:52.809Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2019-04-07** @foobar7: The option to open registration up can be found at WooCommerce -> Settings -> Accounts & Privacy -> "Allow customers to create an account [during checkout / on the My account page]"

The origin of the vulnerability is in the `change_country` function in `/assets/js/admin/users.js`, which reads the properly encoded state/county value out of the DOM, and then reinserts it in an insecure manner.

The insecure insertion takes place in line 64:

>     $state.replaceWith( '<input type="text" class="js_field-state" name="' + input_name + '" id="' + input_id + '" value="' + value + '" />' );

where `value` is the user-controlled state/county name. 

The issue can be fixed by encoding quotes in the line:

    $state.replaceWith( '<input type="text" class="js_field-state" name="' + input_name + '" id="' + input_id + '" value="' + value.replace(/"/g, "&quot;") + '" />' );

The fix would have to be applied to the minified version of the script.
- **2019-04-08** @xknown: Hi. Thanks for the report. We are going to take a look.
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
