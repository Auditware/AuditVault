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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Persistent XSS via customer address (state/county)
================================

CVSS
----

High 7.2 [CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:N](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:L/I:L/A:N)

Description
-----------

The current version (3.5.7) of the WooCommerce WordPress plugin echoes the state/county of a customer in the admin backend without encoding, leading to persistent XSS.

For a successful attack, an attacker needs a customer account, though it is to be expected that account creation is available for users in a considerable amount of setups.

If the victim is an administrator on a default WordPress setup, an attacker can exploit the issue to gain code execution on the server by eg sending a request to edit a WordPress plugin file.

POC
---

Setup: Install the WooCommerce plugin & open registration / add a user (permissions do not matter, I used "customer"). 

To place the payload:

1. Login as a customer at http://192.168.0.101/wordpress/my-account/
2. To place a payload, either:
    - add an item to cart & proceed to checkout. Under "Billing Details", select UK as country and enter `'"><img src=x onerror=alert(1) x=y` as `County` (note the missing `>` which is required as tags are filtered).
    - Alternatively, simply change the address under account settings at `http://192.168.0.101/wordpress/my-account/edit-address/`.

To trigger the payload:

1. Go to `http://192.168.0.101/wordpress/wp-admin/users.php` and click on the customer, or directly visit `http://192.168.0.101/wordpress/wp-admin/user-edit.php?user_id=4`, where `4` is the customers ID.

## Impact

With a successful attack, an attacker can read data available to the attacked user or perform arbitrary request in the name of the attacked user. 

With a default setup, an attacker can gain code execution on the server by eg editing a WordPress plugin file.

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
