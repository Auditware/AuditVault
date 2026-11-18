---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - trigger/social-engineering
substate: "informative"
weakness: "Code Injection"
enriched: true
body: true
date: 2017-08-10
submitted: 2016-11-16T16:34:01.706Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "seifelsallamy"
source: "https://hackerone.com/reports/182557"
title: "links the user may download can be a malicious files"
---
# links the user may download can be a malicious files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Brave Software | **Disclosed:** 2017-08-10

- Report: [https://hackerone.com/reports/182557](https://hackerone.com/reports/182557)
- CWE: Code Injection
- Submitted: 2016-11-16T16:34:01.706Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

## Summary:

This vulnerability is pretty simple and pretty dangerous at the same time 

Almost any link the user tries to download it's extension is set according to the file extension in the path 
if the path is `/` then it download's it according to the domain name  
Eg:
[1] http://example.com/example.php
if the user downloaded the link the file type would be `.php`
that's not very dangerous though 

[2] http://example.com/example.exe
if the user downloaded the link the file type would be `.exe`
Okey that's dangerous but it requires a lot of social engineering 
 
[3] http://example.com/
if the user downloaded the link the file type would be `.com`
this requires less social engineering and it's pretty dangerous 
why?
because `.com` files are executable files which may can do what `.exe` can do
here's links about `.com` files
https://en.wikipedia.org/wiki/COM_file
and the difference between `.exe` and `.com`
https://blogs.msdn.microsoft.com/oldnewthing/20080324-00/?p=23033

there's a new many domain names which may can create malicious extensions like `.com`
as example
`.com.py`
which can create a python file 

any website can make his favorable extension in the domain path and when the user downloads it it will be downloaded by the extension
as example http://example.com/example.exe

## Products affected: 

windows 10 x64 brave latest version 

## Steps To Reproduce:

there is 3 ways to reproduce 
[1]
execute this html 
`<a href="http://example.com" download>http://example.com</a>`
right click on the link > Save Link as... > Save
[2]
go to http://example.com
right click > Save Page as... > Save
[3]
execute this html and directly click the link it will download directly 
`<a href="http://example.com" download>http://example.com</a>`


####Note : 
The none exist pages can't be downloaded 

----------
Any link the users tries to download must be `.htm` or `.html`


## Supporting Material/References:
F135079

Thanks!

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2016-11-17** @asuka: Hey @seifelsallamy,

Using a video to demonstrate a potential issue should only be necessary in rare situations and should always be accompanied with a text description of the issue as well. Please clarify this report with step-by-step instructions to reproduce the core components of the issue and what the impact is. If you're not confident in English, feel free to leave your report in your own language, and we'll try our best to find someone who can help translate.

Cheers!
-@asuka
- **2016-11-17** @seifelsallamy: Okey

##To reproduce:
[1] write a C code ( as a malicious code ) then change it to executable file (index.exe as example)

[2] change the file extension from `.exe` to `.html` now it will be `index.html`

[3] open index.html and at the last line put your html 
`<script>document.getElementsByTagName("html")[0].innerHTML="<h1>your code</h1>"</script>`

this code will clear the executable file content and will put your own html and scripts

[4] upload the `index.html` to a website ends by `.com` , upload it to `test` file (www.example.com/test/ as example)

[5] when you open http://www.example.com/test/ you will see the html and scripts you have written

note :  http://www.example.com/test/ will contain the same stuff as http://www.example.com/test/index.html 
but to reproduce this bug we need the first path `http://www.example.com/test/`

[6] right click > Save Page as... > Save

[7] it will be saved as www.example.com open it the malicious code will run because `.com` is an executable extension just like `.exe`


that's how to reproduce like the video 
I hope it's clear enough 

Thanks again!
- **2016-11-17** @seifelsallamy: ##Impact:
attackers running an executable file in your client computers which can be a malware or a virus 
clients downloading links from an evil website they find it downloaded as `.com` file
they don't know that this is a virus they opens it and they got hacked
- **Report Informative**
- **Agreed On Going Public**
- **2016-11-20** @seifelsallamy: Hey again,

This bug is not a RCE it's my mistake I thought that it was a RCE 
I should report it as a design issue instead

However if you don't want to disclose it I have no problem with that
I'm sorry if I was a bit cruel in the last reply I was shocked when you considered it as informative
and I hope you resolve this issue as soon as possible for your clients safety and security

Thanks
- **Agreed On Going Public**
- **Report Became Public**
