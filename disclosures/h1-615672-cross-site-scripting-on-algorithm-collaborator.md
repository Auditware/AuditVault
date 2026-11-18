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
date: 2022-12-21
submitted: 2019-06-15T13:02:06.375Z
bounty_usd: 2100
votes: 37
cve: []
program: "[[programs/quantopian|Quantopian]]"
reporter: "irisrumtub"
source: "https://hackerone.com/reports/615672"
title: "Cross-site scripting on algorithm collaborator "
---
# Cross-site scripting on algorithm collaborator 

> **Severity:** High | **Bounty:** 2,100 USD | **Votes:** 37 | **Program:** Quantopian | **Disclosed:** 2022-12-21

- Report: [https://hackerone.com/reports/615672](https://hackerone.com/reports/615672)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-06-15T13:02:06.375Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi again my favorite VDP team. I bring you 8th bug and 4th cross-site scripting. Currently trying to upload python code via self-serve data, not looking for XSS'es only, but they're a thing still, right?

**Summary:**
By sending specially crafted websockets request attacker can run javascript in algorithm collaborator's web browser

**Description:**
This is actually quite a funny bug. Some time ago when I was testing algo debugger, i noticed that there is a request to */algorithms/algoid/x* which usually happens when i try to insert html's <img src=x>. But since some time your cloudflare became more strict and adding inline scripts in request might result in 403 Forbidden, so i remove them and try without them. But at that time i couldn't find the image that caused that request. I sent that to Chris.
Today i was trying to test against debugger again. The purpose wasn't to find XSS, but i spammed XSS payloads alongside with some different stuff. And again that request to page *X*. And i noticed that debugger removed part of my payload which contained image. That's it! That should be the vulnerable place. 
However typing html entity in it didn't produce anything. And html was injected only on my side, not the other collaborator's. So i decided to take a look at the websocket request that sends it
It turned out that HTML's <> and other entities were encoded. So i tried intercepting the websockets request and enter <img src=x onerror=alert(1)> and it worked not only on me, but on collaborator as well.
So is it TogetherJS library that is in charge of websockets? I think you might need to encode payloads server-side to avoid this kind of things. I would be glad to help you test the fix for this.


## Steps To Reproduce:


  1. Intercept websockets message like this (debugger input update)
{F509648}
  2. Replace value with raw html/javascript
  3. Send the message. Payload will work in collaborator's browser


## Test account information

irisrumtub+hackerone@mail.ru
tvburis+hackerone@gmail.com

## Impact

Run javascript in victim's browser

## Timeline

- **Report Filed**
- **2019-06-17** @irisrumtub: Sorry, here's text payload which you can replace websocket message with:

{"type":"form-update","element":"#debug-mainpane:nth-child(1):nth-child(2):nth-child(2)","value":"<img src=x onerror=alert(document.domain)>","clientId":"<INSERT PROPER CLIENT ID HERE>"}

And also i'd like to add a peculiar detail: After script is run in collaborator's browser, DOM becomes clean of the malicious payload (the debugger input form returns to previous value), which makes this kind of attack nearly entirely stealthy (with exclusion to the situation if user is looking at browser console).

Also this "form-update" websockets event is common in IDE. I have tested the same concept against box with algorithm capital and dates, but those data types are properly checked. Since you know all the elements that can be updated in IDE via this event, those might be  worth testing? If you give me list of updateable forms i can do this myself, but blindly checking all "nth-child(n)" is tiresome.
- **2019-06-17** @irisrumtub: And last clarification: this request is issued when you are typing anything in debugger command line, and the message is sent to debugger WS.
- **2019-06-17** @h1_analyst_leon: Hey @irisrumtub - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Needs More Info**
- **Report New**
- **2019-06-20** @cmichelqt: Hey @irisrumtub,

Happy to see you back again ;-) This was a nice find and took me some time to reproduce, definitely a sneaky one. 

To make things clear, I was able to validate this report. Please give me some time to update the internal team.

Regards
Chris
- **2019-06-20** @irisrumtub: Updating report as per @cmichelqt request. 
Every XSS which happens on quantopian.com is a game over for user's intellectual property. 
First we steal list of algorithms and backtests via this payload:

```
{"type":"form-update","element":"#debug-mainpane:nth-child(1):nth-child(2):nth-child(2)","value":"<img src=x onerror=\"var req = new XMLHttpRequest(); req.open('GET', 'https://www.quantopian.com/algorithms/get_attachment_info?include_empty=true', false); req.setRequestHeader('Upgrade-Insecure-Requests', '1');req.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36') ;req.send(null);var headers = req.response.toLowerCase();console.log(headers);\">","clientId":"5bdd747c62796e0049ad0727"}
```

Then we request specific algorithm with this payload:

```
{"type":"form-update","element":"#debug-mainpane:nth-child(1):nth-child(2):nth-child(2)","value":"<img src=x onerror=\"var req = new XMLHttpRequest(); req.open('GET', 'https://www.quantopian.com/algorithms/5c02c79635e8650024fc62cc', false); req.setRequestHeader('Upgrade-Insecure-Requests', '1');req.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36') ;req.send(null);var headers = req.response.toLowerCase();console.log(headers);\">","clientId":"5bdd747c62796e0049ad0727"}
```
- **2019-06-20** @cmichelqt: Greetings @irisrumtub,

I was able to reproduce the issue with the updated payloads, thanks for the information. Please give me some time to understand the scope of the issue and discuss with the internal team.

Regards
Chris
- **Bounty Awarded**
- **Report Triaged**
- **2019-06-21** @irisrumtub: Thanks alot! This means a lot.
- **2019-07-04** @cmichelqt: Greetings @irisrumtub, 

The fix for this has just been shipped and it should be on prod, when you get the chance, can you see if you can still reproduce the issue?

Regards 
Chris
- **2019-07-05** @irisrumtub: Sorry for the delay. 
The payload works as a self-XSS if you paste html into debugger, but doesn't work on the other collaborator. It seems that WS message with the payload arrives to the other collaborator already encoded.
Just as a side note: 
As i've mentioned earlier, this type of event (form-update) works with several elements in algo IDE, and you might want to check all of them for improper encoding. I've checked algo capital and dates, but there seems to be strict datatype checking.
- **Report Resolved**
- **2019-07-12** @irisrumtub: Thumbs up
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
