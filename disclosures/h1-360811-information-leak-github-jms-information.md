---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - impact/sensitive-data
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2018-08-16
submitted: 2018-06-01T14:42:40.959Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "p3t3r_r4bb1t"
source: "https://hackerone.com/reports/360811"
title: "Information Leak - Github - JMS Information"
---
# Information Leak - Github - JMS Information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** Starbucks | **Disclosed:** 2018-08-16

- Report: [https://hackerone.com/reports/360811](https://hackerone.com/reports/360811)
- CWE: Information Disclosure
- Submitted: 2018-06-01T14:42:40.959Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

After some research, I found a leak on GitHub that might lead to accessing sensitive data of employees or clients (not sure based on the code). There is also a SAP S-user to access a cloud based HANA service. I have not confirmed what kind of data is in there to avoid potential legal issues. I will let you guys figure that out ;)

I am not sure who is the owner of the repository, but I can tell you that the SAP credentials are for someone at Starbucks China.

https://github.com/karaskay/personalware

Some interesting files:
https://github.com/karaskay/personalware/blob/989723f896eec67a50a9b9f59ceefc48a046049b/python/PycharmProjects/JMS36/testhttprequestjson.py
(SAP Cloud HANA credentials)

https://github.com/karaskay/personalware/blob/989723f896eec67a50a9b9f59ceefc48a046049b/python/PycharmProjects/JMS36/JMSproducerforsurvey.py
(starbuckstest domain credentials)

Thanks!

## Impact

High potential of an unauthorized access to PII data

## Timeline

- **2018-06-01** @p3t3r_r4bb1t: There is also some references to the "starbucks.net" domain, which confirms this is something that comes from inside.

https://github.com/karaskay/personalware/blob/989723f896eec67a50a9b9f59ceefc48a046049b/python/PycharmProjects/JMS36/JMSforsurvey.py
- **Report Filed**
- **Report Informative**
- **Report Severity Updated**
- **2018-06-01** @p3t3r_r4bb1t: @chessmast3r And that call has been validated by the end client?
- **2018-06-01** @p3t3r_r4bb1t: I shouldn't say this,█████
- **2018-06-01** @p3t3r_r4bb1t: Oh, and this is an internal system :
data = json.loads(response)
████
███
███
███████
- **2018-06-01** @chessmast3r: Hi @peuch, 

Thank you for the additional information! this shouldn't be an issue unless you able to exploit anything with this information.

Regards.
- **2018-06-01** @p3t3r_r4bb1t: @chessmast3r The assumption is that, as an external user, I am bound to US law, and I can't do anything. Someone NOT bound to US law, might.  For instance, some credentials are for the SAP SuccessFactor API and Cloud HANA. To stay within the law, I cannot test those, and I cannot check what information is stored in those databases. Maybe there is some juicy stuff, maybe not. However, Starbucks might have the authority to go further and make sure it's all good.  I would personally let them take the decision whether or not this is an issue.
- **2018-06-02** @p3t3r_r4bb1t: @shadegrown @siren Any thoughts from the Starbucks team on this issue?
- **Agreed On Going Public**
- **Hacker Requested Mediation**
- **Report Reopened**
- **Report Triaged**
- **2018-06-12** @p3t3r_r4bb1t: Hi @ristretto, thanks for reopening the issue. Let me know how it goes.
- **2018-06-12** @p3t3r_r4bb1t: Also, be careful to look around all files, there are several credentials spread across the repo. Those in the ticket are an example. Thanks again for having a second look.
- **Report Severity Updated**
- **Bounty Awarded**
- **2018-06-13** @p3t3r_r4bb1t: Hi @ristretto , I'd like to thank you (and the Starbucks team) for the bounty and more importantly, that you took the time to have a second look to this. This is appreciated.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Changed Scope**
