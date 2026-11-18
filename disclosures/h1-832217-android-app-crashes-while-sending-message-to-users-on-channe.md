---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/mobile
  - os/android
  - vuln/dos
  - trigger/victim-interaction
substate: "informative"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2021-03-18
submitted: 2020-03-26T16:15:23.098Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/rocket_chat|Rocket.Chat]]"
reporter: "legalizenepal"
source: "https://hackerone.com/reports/832217"
title: "Android App Crashes while sending message to users/ on channel "
---
# Android App Crashes while sending message to users/ on channel 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Rocket.Chat | **Disclosed:** 2021-03-18

- Report: [https://hackerone.com/reports/832217](https://hackerone.com/reports/832217)
- CWE: Classic Buffer Overflow
- Submitted: 2020-03-26T16:15:23.098Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Description
 I found a security vulnerability in Rocket's latest android app by which I was able to remotely crash any  user’s app  instantly just by just sending a simple message in private or in channel. The vulnerability  require the victim open the message. 


## Devices and Versions

Rocket.Chat.Android version: (e.g. 4.5.1)
Mobile device model and OS version: (tested on :+1: -- " **Android 6.0, 8.0, 10.0**"), probably any other android version

## Steps to reproduce

> Create new #test channel
> Send POC Code onto the channel
> Open Mobile App
> App gets crashed

## POC
### Crafted code to crash mobile app
https://i.postimg.cc/zvBWdMzT/Screenshot-20200320-112405.png

### Message Preview
https://i.postimg.cc/fbCJ6KgC/Screenshot-20200320-112541.png

### App Gets Crashed
https://i.postimg.cc/26J8DXdQ/Screenshot-20200320-112711.png

### Code Link
https://pastebin.com/raw/JEDcC5Yr

**There is no such problem in iOS client and rocket web**

## Impact

An attacker could crash the internal chat user's phone, everytime he/she opens the rocket chat , i.e posting crafted code on #general channel

Hi, i even posted the issue on github, before i got to know about rocket chat on H1, but issue still not fixed, so just tryna keep you updated guys.

https://github.com/RocketChat/Rocket.Chat.ReactNative/issues/1907

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **Agreed On Going Public**
- **2020-05-21** @legalizenepal: Hey, as the issues has been fixed on new releases, can we disclose this report .?
https://github.com/RocketChat/Rocket.Chat.ReactNative/releases/tag/4.6.0-beta.0
- **2020-05-21** @markus-rocketchat: if you want, you can start the disclosure process
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
