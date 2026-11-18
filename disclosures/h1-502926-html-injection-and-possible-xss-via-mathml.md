---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-generic
  - env/web
  - vuln/xss
  - impact/credential-theft
substate: "duplicate"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2019-09-03
submitted: 2019-02-27T19:47:20.360Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "z41b1337_"
source: "https://hackerone.com/reports/502926"
title: "Html Injection and Possible XSS via MathML"
---
# Html Injection and Possible XSS via MathML

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** X / xAI | **Disclosed:** 2019-09-03

- Report: [https://hackerone.com/reports/502926](https://hackerone.com/reports/502926)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2019-02-27T19:47:20.360Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,
I would like to report HTML Injection and possible cross site scripting (XSS) vulnerability using the MathML on Firefox.
Account title of field is vulnerable to Html Injection which can lead an attacker to store javascript using the MathML in Firefox.
Modern Firefox versions allow usage of inline MathML. While other user agents don't support the href attribute for MathML elements (yet), Firefox does and thereby enables passive JavaScript execution. Note that supporting href for MathML elements is a feature - introduced with MathML 3. The same effect can be observed by using xlink:href. The statusline action further enables obfuscation of the actual link target - and in this example hides the JavaScript URI.

Step to reproduce
1- Login to your mopub account.
2- Go to account settings.
3- Click on Edit user settings.
4- Add this payload in Title field 

<math href="javascript:alert(1)">CLICKME</math>

<math>
<!-- up to FF 13 -->
<maction actiontype="statusline#http://google.com" xlink:href="javascript:alert(2)">CLICKME</maction>

<!-- FF 14+ -->
<maction actiontype="statusline" xlink:href="javascript:alert(3)">CLICKME<mtext>http://http://google.com</mtext></maction>
</math>

5- Click on Submit Button.
6- HTML link will be stored in account Title.
7- Click on that html link and XSS will be executed in Firefox.

POC
Please see the images in the attachment.

## Impact

The vulnerability allow a malicious user to inject html tags and execute Javascript  which could lead to steal user's session

## Timeline

- **Report Filed**
- **2019-03-01** @bugtriage-alex: Thank you for your report @z41b1337.

We are reviewing the behavior that you described, and we will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Duplicate**
- **2019-03-04** @z41b1337_: Hello @asayler,
Can you please add to the above mentioned report.
- **2019-03-04** @asayler: @z41b1337, we don't generally share other reporters' reports.

Thanks for helping to keep Twitter secure!
- **Agreed On Going Public**
- **2019-08-30** @jknguyen: @faceless_man -

Thank you for your patience.
Would you like the images that show your e-mail address to be removed prior to disclosure?
- **2019-08-30** @z41b1337_: yep, please and thanks for asking :)
- **Agreed On Going Public**
- **Report Became Public**
