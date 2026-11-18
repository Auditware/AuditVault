---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2020-07-26
submitted: 2020-06-24T15:26:46.071Z
bounty_usd: 200
votes: 66
cve: []
program: "[[programs/irccloud|IRCCloud]]"
reporter: "do_some_hack"
source: "https://hackerone.com/reports/906907"
title: "IDOR with Geolocation data not stripped from images"
---
# IDOR with Geolocation data not stripped from images

> **Severity:** High | **Bounty:** 200 USD | **Votes:** 66 | **Program:** IRCCloud | **Disclosed:** 2020-07-26

- Report: [https://hackerone.com/reports/906907](https://hackerone.com/reports/906907)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-06-24T15:26:46.071Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerable URL :-   ████

Vulnerability Discription:
When an image is taken using a smartphone or camera certain metadata fields are often attached to it. These fields could include the model of the camera, the time it was taken, whether the flash was used, the shutter speed, focal length, light value and even the location. In Inturn, while uploading the image as a profile picture, the exif data is not stripped from images. The exif data in images contains sensitive data like Geoloacation, latitude, longitude, etc. Also it contains the camera information and other details. 

And your website vulnerable to image IDOR which allows attacker to see other users images and retrive data using tool.

Tools Used: exiftool.

Steps TO reproduce:

Use  2 accounts in two browser

Download images from here 

https://github.com/ianare/exif-samples/tree/master/jpg/gps

1)In 1st account in network user can upload files just upload the image their and open image link in new tab.

 new tab that image url like

██████████

2)In second account do same things and that url like down 

█████

3) Change 1st account Url parameter value to 2nd acoount Url parameter(see poc for it).

4) now image will shows up copy that url again and paste it to image data retrival website

http://exif.regex.info/exif.cgi

5) and see sensitive data   exposed.

## Impact

1) By this the attacker tracks your location and use it for personal things.
2) Sensitive data exposed.

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **2020-06-25** @do_some_hack: Thanks for the bounty but i am expecting more but its ok.
and i verified the bug but it still showing me EXIF data  and IDOR still exist.
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2020-06-26** @do_some_hack: hello jwheare,
    I want to disclose this vulnerability.please help me to disclose it.
- **Agreed On Going Public**
- **2020-06-26** @do_some_hack: Thanks
- **Report Became Public**
