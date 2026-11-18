---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-09-28
submitted: 2020-03-24T11:17:34.706Z
bounty_usd: null
votes: 16
cve: "CVE-2020-8182"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "warsocks"
source: "https://hackerone.com/reports/827816"
title: "Missing server side controls when editing the board’s sharing permissions per user"
---
# Missing server side controls when editing the board’s sharing permissions per user

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Nextcloud | **Disclosed:** 2020-09-28

- Report: [https://hackerone.com/reports/827816](https://hackerone.com/reports/827816)
- CWE: Improper Access Control - Generic | CVE: CVE-2020-8182
- Submitted: 2020-03-24T11:17:34.706Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Author: Silvia Väli, Clarified Security (https://www.clarifiedsecurity.com/silvia-vali/)
Date: 24th of March, 2020

**Description**:
When the regular user is visiting the Deck view, all created boards are displayed along with the ones that are shared with the user by others. Available functionality within each of the shared boards depends whether the user has received share, manage, edit permissions. 

Since the access control rules related to user’s permissions have only been applied on the client side and not on the server side, user can specify share/edit/manage permissions to be always true within the response (for example by using a proxy tool) when viewing board information. This way he can gain control over the board so he/she could apply the missing edit/manage permissions to him/herself directly from the UI.

**Version information**:
Nextcloud 18.0.2
Deck 0.8.0 enabled

**Pre-requisites as an admin user to follow the vulnerable path**:
- create 2 regular users in the next cloud, for example user silvia and user john. Users do not belong to the admin group.
- Install the Deck app (installed version 0.8.0)

**To reproduce the vulnerable path**:

**User: silvia**

1. Authenticate as user silvia and select Deck from the menu
2. Create new board -> name it (“board for testing”)
3.  Add a new stack (“test test”)
4. Click on “Show board for details”
5. Add the other user john and only give him Share permission. Uncheck Edit and Manage.

**User: john**

6. Now authenticate in the application as john -> click Deck from the menu and open the shared board “board for testing”. Since the board was only Shared and no edit permissions were granted, john cannot do much on the board. 
7. What john can do however is use a proxy tool such as Burp Suite to modify the response body. When john clicks on the Deck from the menu, following request is made:
```
GET /apps/deck/boards HTTP/1.1
Host: next.yy.ee
...
Connection: close
Cookie: …
```

8. In the response to that request, you can see that john only been given the permission to share which only allows to read the data and not modify it.
```
[{"title":"board for testing",
"owner":{"primaryKey":"silvia","uid":"silvia","displayname":"silvia"},"color":"0082c9","archived":false,"labels":[],"acl":[{"participant":{"primaryKey":"john","uid":"john","displayname":"john"},"type":0,"boardId":7,"permissionEdit":false,"permissionShare":true,"permissionManage":false,"owner":false,"id":4}],"permissions":{"PERMISSION_READ":true,"PERMISSION_EDIT":false,"PERMISSION_MANAGE":false,"PERMISSION_SHARE":true},"users":[],"shared":1,"stacks":[],"deletedAt":0,"lastModified":1585045324,"id":7}]
```

9.  john however uses a proxy tool such as Burp Suite and applies via proxy -> options -> Match and replace that every time the following line with permissions is seen modify all the options to be equal to true.
Original: `"permissionEdit":false,"permissionShare":true,"permissionManage":false,"owner":false`
Modified: `"permissionEdit":true,"permissionShare":true,"permissionManage":true,"owner":true`

10. If john now refreshes the Deck page and opens the board “board for testing” -> Show board details -> Sharing -> he can add himself the permissions to Edit, Share, Manage to take over the board which was initially only shared with him.

## Impact

Attacker would achieve control over the board and its data/attachment uploads etc.

## Timeline

- **Report Filed**
- **2020-03-24** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-03-24** @nickvergessen: Thanks for the report, I will forward this to the Deck Developers
- **2020-03-24** @warsocks: Thank you for a quick response. Will look forward to receiving some feedback from the Deck Developers then.
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-01** @warsocks: Glad you managed to reproduce it well. If there is anyway I could help you, or any further questions, fire away.
- **2020-04-06** @juliushaertl: Hi,

just a quick update. We have a fix for the issue prepared at https://github.com/nextcloud/deck/pull/1653/files#diff-e448525c1380ca5a2202113c6f85e094 and will prepare new releases of the deck app once that has been reviewed.
- **2020-04-08** @warsocks: Thank you for the update, will review.
- **2020-04-08** @warsocks: Just to make sure we both understand how the functionality is intended to behave now after the fix, could you please clarify this part of your sentence "...updating permissions will always be limited to the own permission level" with an example please.
- **2020-04-09** @warsocks: In v0.8.2 I was not able to replicate the same vulnerability anymore and when trying to elevate my permissions always received the response HTTP/1.1 403 Forbidden. So from my side, it can be counted as fixed.
- **Report Resolved**
- **2020-04-09** @warsocks: Below you can find my information. I would also like to know if a CVE be requested for the vulnerability and is my finding eligible for a bounty? :)

Name: Silvia Väli
E-mail: silvia@clarifiedsecurity.com
Website: https://www.clarifiedsecurity.com/silvia-vali/
Company: Clarified Security
- **Bounty Awarded**
- **2020-04-09** @nickvergessen: All our security issues will be published as a Security Advisory on our website and then be requested a CVE after ~4 weeks
- **2020-04-14** @warsocks: Thank you so much for assigning a bounty @Nextcloud, @nickvergessen and the Deck developers and a Happy Easter!
- **2020-05-18** @warsocks: Hello, you mentioned I would be credited in your official advisory. I have not managed to find a reference to it, could you kindly direct me to it please?
- **Report Severity Updated**
- **Changed Scope**
- **2020-06-08** @nickvergessen: Sorry for the long delay.

The advisory will be published at https://nextcloud.com/security/advisory/?id=NC-SA-2020-025 soon.
We got CVE-2020-8182 assigned for the issue which will be published soon too.
- **2020-06-15** @nickvergessen: Published
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
