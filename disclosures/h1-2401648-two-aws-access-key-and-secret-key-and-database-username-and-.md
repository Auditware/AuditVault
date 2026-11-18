---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2024-10-18
submitted: 2024-03-04T19:25:36.853Z
bounty_usd: null
votes: 71
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "ghaazy"
source: "https://hackerone.com/reports/2401648"
title: "two aws access key and secret key and database username and password exposed "
---
# two aws access key and secret key and database username and password exposed 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 71 | **Program:** Mozilla | **Disclosed:** 2024-10-18

- Report: [https://hackerone.com/reports/2401648](https://hackerone.com/reports/2401648)
- CWE: Information Disclosure
- Submitted: 2024-03-04T19:25:36.853Z

## Report summary

A security vulnerability is identified in a Docker image hosted on Docker Hub. The image, associated with Mozilla's Common Voice project, is found to contain exposed AWS access keys, AWS secret keys, and database credentials. These sensitive credentials are discovered within the file /code/scripts/test/config.json of the Docker image and allowed unauthorized access to AWS resources associated with the project.  The images were deleted from docker hub, the credentials were rotated and the AWS users associated with them were removed.

Note that Common Voice is out of scope of our program but we accepted and rewarded this report since it is critical.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
hello mozilla security team i found two aws access key and secret key and database username and password exposed  in dockerhub image 

## Steps To Reproduce:
go to https://hub.docker.com/r/mozilla/commonvoice
and do pull for this image
you will find them in 
/code/scripts/test/config.json
███████
poc of  the asw keys 
████
and also 
████
reference 
{F3097699}
and the enum for it 
████████
## Supporting Material/References
  *https://hackerone.com/reports/1720278
  * https://hackerone.com/reports/1580567

## Impact

## Summary:
exposure of sensitive data lead to many serious attacks and access

## Timeline

- **Report Filed**
- **2024-03-04** @ghaazy: hello @scott-f this is urgent you need to solve it now
- **Report Pending Program Review**
- **Report Triaged**
- **2024-03-06** @ghaazy: hello @scott-f and @frida-k i see that the keys are still valid i think this might help
the images that contains the aws keys are 
█████
they all were pushed by this user 
https://hub.docker.com/u/█████████
the reason why i found those key by just pulling the image was this image 
https://hub.docker.com/layers/mozilla/commonvoice/latest/images/sha256-00ce4d3f1c33aa3f29a65be3aa17da3d571a7a18bf198744e1f18948b8d0c377?context=explore
because it use the default tag ===> latest
so i hope you fix it soon 
and does will be a bounty for this critical submission
- **2024-03-07** @frida-k: We are still working on deleting those images. We will discuss the bounty in our bug bounty panel and let you know our decision within a few weeks.
- **2024-03-08** @ghaazy: hello @frida-k i saw that you have deleted those image congratulations
- **2024-03-08** @ghaazy: hi @frida-k any updates of report status before the weekend ?
- **2024-03-08** @scott-f: Hi @ghaazy, there will not be any updates before the weekend. Our next bounty committee meeting will take place a few weeks from now. As soon as they meet, we'll update you here.
- **2024-03-08** @ghaazy: Okay @scott-f waiting to hear from you
- **2024-03-11** @ghaazy: Hello @frida-k and @scott-f any updates oof the status should it be resting or solved?
- **Report Resolved**
- **2024-03-12** @ghaazy: hello @frida-k congratulations 
even if the key users were not used it's grant access to anyone to the infrastructure and this could lead to infrastructure takeover and there were exposed credentials for the rds database
- **2024-03-12** @ghaazy: hi @frida-k any updates about the bounty committee meeting
- **2024-03-13** @ghaazy: Hi @scott-f any updates?
- **2024-03-13** @ghaazy: Hi @gene1wood any updates
- **2024-03-13** @frida-k: You don't need to keep asking for updates, we will inform you when we have updates.
- **2024-03-15** @ghaazy: Okay @frida-k waiting to hear from you when you have any updates
- **2024-03-19** @ghaazy: Hello @frida-k anything new?
- **Bounty Awarded**
- **2024-03-21** @ghaazy: Glad I could help. Thanks for the bounty!
- **Reassigned To Team**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
- **2024-10-30** @frida-k: re-uploading the PoC image redacted

{F3719977}
