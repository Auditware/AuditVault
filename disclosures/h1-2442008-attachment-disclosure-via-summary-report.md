---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/cors-misconfig
  - trigger/cors-origin
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2024-04-29
submitted: 2024-03-30T17:53:08.294Z
bounty_usd: null
votes: 340
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "xklepxn"
source: "https://hackerone.com/reports/2442008"
title: "Attachment disclosure via summary report "
---
# Attachment disclosure via summary report 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 340 | **Program:** HackerOne | **Disclosed:** 2024-04-29

- Report: [https://hackerone.com/reports/2442008](https://hackerone.com/reports/2442008)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2024-03-30T17:53:08.294Z

## Report summary

A critical vulnerability was discovered in the HackerOne platform that allowed an attacker to gain unauthorized access to attachments belonging to other users through the report summary editing functionality. By manipulating attachment IDs in the request, an attacker could view sensitive files that should have been restricted. The core issue was an Insecure Direct Object Reference (IDOR) vulnerability (CWE-639) where attachment access was not properly validated across user accounts when editing summary reports. This posed a serious risk to the confidentiality of user data and could lead to disclosure of sensitive attack details and exploitation information and also loss of it.

Fortunately, this vulnerability was responsibly disclosed through our bug bounty program and remediated before it could be maliciously exploited or cause any data exposure.

Upon validation, the HackerOne team promptly implemented a fix to correctly validate attachment IDs and prevent unauthorized cross-user access via summary report editing.

HackerOne maintains a strong commitment to security and transparency. We are grateful to the ethical hacker community for their invaluable contributions in identifying vulnerabilities before malicious exploitation can occur.

Here if you want to read the story behind me finding this vulnerability!

ID: https://blog.tegalsec.org/hackerone-got-hacked-how-can-i-steal-your-poc
EN: https://medium.com/@kresec/hackerone-got-hacked-how-can-i-steal-your-poc-01a9132c5aeb

Writeups are very useful for bug hunters for learning / reference material.
For developers: it is useful to make secure applications earlier by learning from bug hunter findings, even though you have tried but the application is getting bigger, more routes, you may miss it.

 .

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

Hackerone provides a form for reporting vulnerabilities to various programs. where the form supports uploading files & previews (images or videos) but is not allowed to use file ids belonging to other accounts. but with the sumary report feature I as a hacker can reveal files belonging to other users just changing the id. this is very severe.


**Description:**

I have tried to call files belonging to other accounts through the submit report, edit report form but it doesn't work it always gets the response ```"was_successful":false,```. but fortunately I can find another endpoint that is able to read files belonging to other accounts, namely in the sumary report feature.

### Steps To Reproduce
If you look at the video I attached, there I made the scenario "failed to read other account files" & "successfully read other account files" as for the steps as follows:
note : left victim right attacker

1. the attacker creates a report either draft or existing, then creates a Hacker summary 
2. then edit the summary and give the file to. 
3. intercept with intercept change the attacker file id to the victim file id
4. boom file read in markdown preview.

{F3155289}

### POC 
I don't know, uploading large files takes too long in attacth, I just put the poc via yt. : https://████ (private video)
or in gdrive, if yt can't be seen yet  : https://███████

### Optional: Supporting Material/References (Screenshots)

####raw text in video :
```
attachment leaked via add sumary report :

victim file id : 
3155239

I WILL CHANGE F3155244 TO 3155239
ATTACKER file : 

3155241
3155242
"was_successful":true, (IF FILE FROM ATTACKER) I WILL CHANGE TO VICTIM FILE
"was_successful":false, WILL FALSE 

trying leak via content : false positive
leak via sumary : successful
```
#### endpoint affected  (attachment_ids)

```
PUT /reports/████/summaries/███████ HTTP/2
Host: hackerone.com
.....all header ...
Content-Length: 908
Origin: https://hackerone.com
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{"id":████████,"category":"researcher","content":"TESTEDIT\n\n{F3155244} ","updated_at":"2024-03-30T17:16:29.625Z","user":{"id":█████,"username":"█████","name":"██████████████","bio":"please see pdfx","cleared":false,"verified":false,"website":null,"location":"","created_at":"2024-03-29T11:27:50.077Z","url":"https://hackerone.com/██████████","hackerone_triager":false,"hackerone_employee":false,"user_type":"hacker","profile_picture_urls":{"small":"/assets/avatars/default-█████.png","medium":"/assets/avatars/default-███████.png","xtralarge":"/assets/avatars/default-███████.png"}},"can_view?":true,"can_create?":true,"attachments":[],"action_type":"publish","attachment_ids":[
3155239]}
```

## Impact

This is very bad especially the id form is only numeric in order. I can just add all the file ids of the hackerone account. I can see other people's pocs if it's a video.

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-04-01** @xklepxn: Hello there, if you can't see the preview image of the poc above {F3155289}. that image is proof that the attacker can use the victim's file for his report.
I've reattached it below:
{F3156984}

And this should go into IDOR too instead of Sensitive Information Disclosure
- **2024-04-02** @xklepxn: Hello
3 days passed, I hope it's time to be triaged
- **2024-04-03** @h1_analyst_oscar: Hi @xklepxn,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_oscar
- **Report Pending Program Review**
- **2024-04-03** @xklepxn: Thank you for the triage, after I reviewed the findings, I concluded the more detailed impact like this:

- Availability is lost, the victim (all users) cannot see files in all report summaries (like my report above the image is only id because yesterday I tested using this report)
- Confidentiality, attackers can see the victim's files
- Integrity, imagine an attacker who loops  the attachment id will damage the sumarry of all reports or the contents of the poc report both private and disclosed.
- **2024-04-03** @0daybookworm: Hey @xklepxn!

Thanks for your report, we have validated the issue and we'll keep you updated regarding our engineering updates,

HackerOne
- **2024-04-03** @0daybookworm: Also confirmed the availability loss as I tested with the attachment ids from this report, apologies for that. @xklepxn
- **Report Triaged**
- **2024-04-03** @0daybookworm: Hello @xklepxn!

Our engineering team has already implemented a fix to properly validate attachment IDs and prevent unauthorized access across user accounts when editing summary reports. The severity scoring is still undergoing final discussion internally;  You will receive an update on the final decision and payout amount once a decision is taken.

Thank you for your excellent work in identifying this vulnerability before it could be exploited maliciously. We are grateful to ethical hackers like yourself who help make HackerOne a more secure platform for our community. Please let us know if you need any other information!

HackerOne
- **2024-04-03** @xklepxn: The fixing speed is amazing, just assign me to retest the findings.
And waiting for a commensurate bounty / finall severity, I hope it lands before Eid mubarak (April 11, 2024) 🤲🏻🔥
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Retesting**
- **User Completed Retest**
- **2024-04-04** @xklepxn: Alhamdulillah. thanks for bounty!
- **Report Retest Approved**
- **Report Resolved**
- **2024-04-04** @0daybookworm: You're welcome to re-add the proof-of-concept attachment if you're comfortable including it as part of the disclosure.
- **2024-04-04** @xklepxn: Of course, I plan to make a writeup before this report is disclosed.
- **2024-04-04** @xklepxn: Hi @0daybookworm  

This is the draft writeup I made https://medium.com/@kresec/get-critical-bug-on-hackerone-luck-effort-or-fate-b29093941044 is there anything I need to cover first? for example account username

██████████

Thanks
- **2024-04-08** @hendrik_hv01h: Hi @xklepxn,

Thanks for sharing the draft writeup. While the technical details look good, I'd suggest running it through an AI writing assistant to improve the grammar, spelling, and overall language quality. This can really help make the writeup more polished and impactful.

Just let me know, and we can then proceed with disclosure once you're satisfied with the writeup.

Regards,
@hendrik_hv01h
- **2024-04-22** @jordan_mga51: Hi @xklepxn, hope you had a great weekend. Any update on the writeup for the disclosure?
- **Agreed On Going Public**
- **2024-04-24** @xklepxn: writeup will be published after this report is disclosed. it is still a draft
- **2024-04-29** @xklepxn: You have hidden the text I want, but why not just disclose it directly sir?
- **Agreed On Going Public**
- **Report Became Public**
- **Report Vulnerability Types Updated**
- **Bounty Awarded**
- **2024-05-10** @xklepxn: Thanks, I deserve that!
- **Report Collaborator Invited**
