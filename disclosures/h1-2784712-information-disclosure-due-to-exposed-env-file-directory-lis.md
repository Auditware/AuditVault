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
