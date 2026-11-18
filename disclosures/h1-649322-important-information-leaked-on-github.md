---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-hard-coded-credentials
  - env/web
substate: "resolved"
weakness: "Use of Hard-coded Credentials"
enriched: true
body: true
date: 2019-08-22
submitted: 2019-07-18T15:45:59.893Z
bounty_usd: null
votes: 98
cve: []
program: "[[programs/equifax|Equifax-vdp]]"
reporter: "mohanaddobal"
source: "https://hackerone.com/reports/649322"
title: "Important information leaked on Github"
---
# Important information leaked on Github

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 98 | **Program:** Equifax-vdp | **Disclosed:** 2019-08-22

- Report: [https://hackerone.com/reports/649322](https://hackerone.com/reports/649322)
- CWE: Use of Hard-coded Credentials
- Submitted: 2019-07-18T15:45:59.893Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

While searchin on Github about Equifax i found some juicy information like a username and password of this subdomain (https://transport5.ec.equifax.com/), internal ip of the database and its username & password 
 In the following link (https://github.com/ajiththorali/Testing/blob/49025b364451fb2076f85ad009a0dc50a941c5ce/target/classes/API_Equifax/propertiesHandle.properties) you could find this info 
*******
XML_URL = https://transport5.ec.equifax.com/ists/stspost?require_security= HTTP/1.1
Username = 50404
Password = ny5b2MuswjrFq3J2P9
service_name = acroxmltest
Content_Type = application/xml
*******
jdbc_driver = com.mysql.jdbc.Driver
db_url = jdbc:mysql://192.168.84.225:3700/EquiFax
db_username = root
db_password = redhat
*********

You should change passwords of the leaked account and remove this info from github

## Impact

any attacker can login to this sub domain and do unauthorized actions
If any one was able to be inside the network he would connect to the leaked database ip and steal important information

## Timeline

- **Report Filed**
- **2019-07-19** @h1_analyst_decimo: Thank you for reporting this potential issue, 

Your report is currently being examined by the HackerOne triage team. You will receive further details, or questions, as soon as technically possible. Thanks for your patience.

Cheers,
@still
- **Report Triaged**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **2019-07-19** @5ly: Thank you for your hard work and information, we appreciate the help being giving on this report. The GitHub account has been successfully removed avoiding any information disclosure out there. 
Currently, we're hardening the server to avoid any intrussions. Please stay in touch.

Thanks.
- **2019-07-21** @5ly: Hey @mohanaddobal ,

Thank you again for keeping in touch. As mentioned, this GitHub repository has been successfully taken down and the credentials changed. 
Would you like to double confirm from your end that the access has been modified?
We appreciate your help, thank you !
- **2019-07-22** @mohanaddobal: Hey @5ly 
Thanks for your response 
I checked now and the access has been modified. I can't login now with leaked credentials
- **Swag Awarded**
- **Report Resolved**
- **2019-07-22** @mohanaddobal: Thank you for the reward. It was pleasure to work with you
- **Agreed On Going Public**
- **Report Became Public**
- **2020-01-23** @mohanaddobal: @5ly Hi, Hope you have a nice day
I haven't received the swag yet. Could you please tell me the reason ?
