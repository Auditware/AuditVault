---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2026-08-30
submitted: 2026-07-16T19:07:21.836Z
bounty_usd: null
votes: 72
cve: []
program: "[[programs/weblate|Weblate]]"
reporter: "visionx7"
source: "https://hackerone.com/reports/3869124"
title: "**Unauthenticated IDOR allows modification of payment customer billing information**"
---
# **Unauthenticated IDOR allows modification of payment customer billing information**

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 72 | **Program:** Weblate | **Disclosed:** 2026-08-30

- Report: [https://hackerone.com/reports/3869124](https://hackerone.com/reports/3869124)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2026-07-16T19:07:21.836Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The application contains an access control issue in the payment billing information edit functionality. An unauthenticated user can access the payment edit endpoint and modify the billing information associated with a payment without any authorization check.

The issue occurs because the application allows access to the edit page using only the payment identifier in the URL. The server does not verify whether the requester is logged in or has permission to modify the customer information linked to that payment.

Steps to reproduce:

1. Create a payment object and note the payment UUID.

Example:

``
01f82084-20dc-498a-b004-2694d51be433
``

2. Open the following URL in a browser where you are not logged in:

``
http://127.0.0.1:8000/en/payment/01f82084-20dc-498a-b004-2694d51be433/edit/
``

3. Observe that the payment billing information edit page is accessible without authentication.

4. Modify the billing information fields.

Example changes:

```
Name:
IDOR_EVIDENCE_TEST

Address:
IDOR_ADDRESS_TEST
```

5. Submit the form.

6. The application accepts the request and updates the customer billing information.

7. Verify that the changes are stored by checking the customer record. The modified values remain saved:

```
Name: IDOR_EVIDENCE_TEST
Address: IDOR_ADDRESS_TEST
```

This demonstrates that an unauthenticated attacker can modify persistent customer billing information by accessing the payment edit endpoint directly.

The root cause appears to be missing authorization checks before allowing modification of the customer object associated with the payment.

## Impact

**An attacker can modify customer billing information without authentication by accessing the payment edit endpoint directly.**

Successful exploitation allows unauthorized changes to stored customer data, including billing name and address information. These changes are persistent and affect the data saved in the application database.

Potential impacts include:

- Modification of customer billing records
- Incorrect customer information being stored and displayed
- Integrity loss of payment-related customer data
- Possible disruption of billing, invoicing, or payment-related workflows if modified information is used by the system

The issue affects the integrity of customer data because an unauthenticated attacker can make unauthorized changes without requiring account access or permission.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **2026-07-24** @visionx7: Thanks for the quick fix!

I noticed the issue has been resolved. I was wondering if it's okay for me to publish a technical write-up about this vulnerability on Medium. I'll follow your responsible disclosure policy and won't include any sensitive information or anything that could put users at risk.

Please let me know if public disclosure is approved. Thanks again!
- **Agreed On Going Public**
- **Report Became Public**
