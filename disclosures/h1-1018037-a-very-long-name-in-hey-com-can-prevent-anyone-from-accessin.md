---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-11-10
submitted: 2020-10-24T22:32:42.256Z
bounty_usd: 1000
votes: 132
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "tw4v3sx"
source: "https://hackerone.com/reports/1018037"
title: "a very long name in hey.com can prevent anyone from accessing their contacts and probably can cause denial of service"
---
# a very long name in hey.com can prevent anyone from accessing their contacts and probably can cause denial of service

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 132 | **Program:** Basecamp | **Disclosed:** 2020-11-10

- Report: [https://hackerone.com/reports/1018037](https://hackerone.com/reports/1018037)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-10-24T22:32:42.256Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary :
=========
after trying to change my initial name to something long i found out that their are no limits to how long it can be , so i directly changed it to something very long {F1050497} which caused my account to really slow down when accessing it and in **the android app , it just keeps crashing** whenever i open it ( no way to access my account at all ) + if i make it longer i get a **500 Internal Server Error response** which highly suggests that this can cause a **server side denial of service .**

Description:
==========
due to not checking the length of the name one can change it to a very long one causing both a server side denial of service  and a client side one

server side : 
------------

one can send multiple requests to change the name of the account and each of them containing a very long name which will cause a 500 internal server error leading to an extensive Resource Consumption.

client side : 
-----------
- if one is able to change the name another account he will also have the ability to crash his android app therefore preventing him from accessing his account.
- if one with a long name sends a message to any email he will slowwwwww down everything where the message appears including folders (inbox , trash ..) and prevent him from accessing his contacts where the email's name also appears , because the app will hang on a loading screen for about 40min each time , and this can be more if for example he sends multiple messages or use multiple accounts ( each on with a long name ) to send a message to the victim mail.

Proof of Concept:
==============

1. open `https://app.hey.com/contacts/%user_id_number%/user/edit`and change the name to the one attached {F1050497} and submit.
1. now u can't open the android app and u can slow down anyone's account just by sending them a message (or multiple ones).

## Impact

- **Attacker can perform a DoS Attack against the server**
- **slow down anyone's account**
- **crash the android app**

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2020-11-07** @tw4v3sx: Hiii 
Sorry for the late response 
First of all i would like to thank u for ur quick response and fix 
However for the bounty i dont understand , why in your program policy 1000$ is supposed to be the lowest bounty for a high severity report while u paid me just 300$ !! I kindly request clarification ??
- **Report Severity Updated**
- **2020-11-09** @jorgemanrubia: Sorry @tw4v3sx, I forgot to downgrade its severity to "medium" according to severity and impact. The bounty was calculated according to that tier. I just did. Sorry about the confusion.
- **2020-11-09** @tw4v3sx: hemmm i see although that's very disappointing  since it was going to be disclosed as a high severity bug
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
- **2020-12-06** @jorgemanrubia: Hi Tarek,

Reviewing this report I noticed that our severity assessment here was too low. I'll change to "high" and reward an additional bounty accordingly.
- **Bounty Awarded**
- **2020-12-06** @tw4v3sx: hey :)
thank you for the bounty ,i appreciate u re-looking at my report .
have a nice day .
- **External User Joined**
- **External User Joined**
- **2020-12-10** @deb0con: Hi @basecamp,
It's not fair to all participants. I've added a lot of impact to my reports, and my reports are marked as duplicate. 
but when I check back the vulnerability, the vulnerability still available.

Kind regards,
@duckoverflow
- **2020-12-10** @tw4v3sx: hey @duckoverflow
can i ask ,what kind of impact did u add??
- **External User Removed**
