---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/cloud
  - stack/aws
substate: "informative"
weakness: "Information Exposure Through Directory Listing"
enriched: true
body: true
date: 2024-10-22
submitted: 2024-10-16T14:44:33.783Z
bounty_usd: null
votes: 46
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "necr0mancer"
source: "https://hackerone.com/reports/2784712"
title: "Information Disclosure Due To exposed .env file (Directory Listing) at ████████"
---
# Information Disclosure Due To exposed .env file (Directory Listing) at ████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 46 | **Program:** AWS VDP | **Disclosed:** 2024-10-22

- Report: [https://hackerone.com/reports/2784712](https://hackerone.com/reports/2784712)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2024-10-16T14:44:33.783Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A .env file was discovered on the server at ████, exposing sensitive application configurations, including database credentials, email settings, and more. This information could allow an attacker to gain unauthorized access to critical systems and services.

**Steps to Reproduce:**

1. Open a web browser.
2. Navigate to ████████.
3. The .env file content is displayed, revealing sensitive information.

**PoC Video Link:** ██████

## Impact

The exposed .env file could lead to multiple security threats, including but not limited to:

Unauthorized database access using DB_HOST, DB_USERNAME, and DB_PASSWORD.
Compromise of email services via MAIL_USERNAME and MAIL_PASSWORD.
Ability to access or manipulate other connected services.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Pending Program Review**
- **Report Informative**
- **2024-10-19** @necr0mancer: Hi █████████,

Thank you for the update and clarification on the shared responsibility model. I understand that the issue is related to customer-side configuration rather than AWS services directly. I appreciate AWS taking the initiative to notify the affected customers and providing guidance for securing their environment.

While I acknowledge that this falls under the customer's domain, the exposure of sensitive information like database credentials and email settings still presents a significant risk. It might be beneficial for AWS to include more proactive security checks or automated alerts for customers when exposed files like .env are publicly accessible, even if they fall under customer-managed resources.

Please let me know if there’s any further action required from my side. I'll continue to report any security concerns I find related to AWS infrastructure or implementations.

Thank you again for your time and consideration.

Best regards,
@necr0mancer
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
