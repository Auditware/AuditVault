---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/mobile
  - os/android
  - vuln/path-traversal
  - vuln/code-injection
  - impact/rce
  - trigger/victim-interaction
substate: "resolved"
weakness: "Path Traversal: '.../...//'"
enriched: true
body: true
date: 2022-03-29
submitted: 2021-10-21T16:08:18.319Z
bounty_usd: null
votes: 31
cve: []
program: "[[programs/evernote|Evernote]]"
reporter: "hulkvision_"
source: "https://hackerone.com/reports/1377748"
title: "2 click Remote Code execution in Evernote Android"
---
# 2 click Remote Code execution in Evernote Android

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 31 | **Program:** Evernote | **Disclosed:** 2022-03-29

- Report: [https://hackerone.com/reports/1377748](https://hackerone.com/reports/1377748)
- CWE: Path Traversal: '.../...//'
- Submitted: 2021-10-21T16:08:18.319Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This vulnerability is similar to my previous reported vulnerability #1362313 , in here also weakness is path transversal  vulnerability which helps me to acheive code execution but the root cause is different.

some part of this app is written in java and some parts are written in react native. 

In evernote we can share notes and notebooks with others. In  notes we can also add attachments and there is option to rename the added attachment. When renaming i founded that special characters are not restricted,for example file uploaded with name `libjnigraphics.so`  can be renamed to `../../../lib-1/libjnigraphics.so` and when the attachment is downloaded it is downloaded with filename `../../../lib-1/libjnigraphics.so`.
The evernote android app also does not sanitize the received filename, so when user clicks on attachment,instead of attachment getting downloaded in `/data/data/com.evernote/cache/preview/:UUID/` this directory it is downloaded into   `/data/data/com.evernote/lib-1/libjnigraphics.so` which results into remote code execution.

> #1362313 report vulnerability root cause was that the app was not sanatizing the value of `_display_name ` from the provider of received `content://` uri that  resulted into ACE.

> This report's  root cause is that app is extracting attachment filename from `content-disposition` header  eg:- `content-disposition: attachment; filename="../../../lib-1/libjnigraphics.so"`  and the evernote app is  not sanatizing the received filename from the response header. 
The attachment download logic is written in react-native and the source file is compiled into hermes javascript bytecode, so i am not able to show the exact vulnerable code like i did in my last report.

The conclusion i reached was that fixing this report #1362313 bug will not fix this vulnerability so i am writing a new report.




## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. Add the native-library poc file to a note {F1489257}
  2. Rename the attachment to `../../../lib-1/libjnigraphics`.
  2. Invite the victim to your note.

  Step 2 is needed,i don't know why `Shareable link` feature is not working on evernote android app without sending an invitation
 3. Click on 3 dots > copy internal link > copy web link OR copy app link(which is android deeplink and can be triggred from websites)
 4. Send link to victim and open the link (1st click)
 5. Click on attachment when note is opened (2nd click)
 6. Close the evernote app and open it again.
From adb shell run nc 127.0.0.1 6666
* use physical device because i have provided the arm64 architecture native library

>POC VIDEO
{F1489256}

## Impact

remote code execution in evernote android app with 2 clicks.

## Timeline

- **Report Filed**
- **2021-10-22** @h1_analyst_amey: Hi @hulkvision_,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **Report Needs More Info**
- **Report New**
- **2021-10-26** @hulkvision_: Hii, any updates
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **2021-12-07** @hulkvision_: Hiii, any update on resolution of this bug
- **2021-12-09** @h1_analyst_amey: Hello  @hulkvision_,

Thanks for your patience! The Evernote team is still working on this internally, and you will be updated once there is more information to share.

Regards,
@forest_dweller
- **2021-12-09** @boliva: Hi @hulkvision_, our team hasn't been able to actually reproduce this issue but the fix for the other path traversal vulnerability you reported should work for this one as well, that being said can you try and check if it still works for you against the latest available version (10.22) which was published last week in the Google Play Store?
- **2021-12-09** @hulkvision_: I have tested the latest available version(10.22) and the fix is working for my other path transvsal vulnerability report but i can still reproduce this bug.
- **2021-12-09** @boliva: Thanks for confirming @hulkvision_, we appreciate your patience. We're working with our team and we'll get back to you with more details soon.
- **2021-12-18** @hulkvision_: Hii, just checking in ,whether the team was able to reproduce the bug or not. If any  more information is needed for me, ask me.
- **2022-01-18** @hulkvision_: Hello, any update on fix
- **2022-01-25** @boliva: Hi @hulkvision_, I'm sorry for the long delay so I appreciate your patience. Can you please test with the attached version of the App? Thanks in advance.
- **2022-01-26** @hulkvision_: Hello, the bug has still not been fixed.  The app is not using the native library i mentioned above `libjnigraphics.so` anymore but the path transversal bug is still present here.  You can confirm this by renaming the uploaded the file to `../../../lib-main/libhermes-executor-common-release` , in step 2 in Steps to Reproduce Section. 
If you got any question about reproduction, ping me .  also the app(`com.evernote.pre`) you given me to test have same version 10.24 as current version of the playstore app(`com.evernote`),is there any chance by mistake you sent me the wrong version app?
- **2022-01-28** @boliva: @hulkvision_ once again thanks for your help on this. We have a new version for you to test which you can find attached here. Regarding the version number, this is a preRelease build (internal release for testing), so it won’t match the Play Store release package name.
- **2022-01-28** @hulkvision_: Hii, I can confirm the path traversal bug has been fixed in this version. The app is now sanitizing the downloaded filename properly.
- **2022-02-03** @boliva: Hi @hulkvision_, since you confirmed the fix works I am closing this report for now. Once the fixed version hits the Play Store I'll reopen to ask for a retest from you. I would like to slightly downgrade the report severity from Critical to High, mainly because of its somewhat limited scope (Android client only) and the fact that it requires user interaction.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-02-03** @hulkvision_: Hii, i do not agree with your severity rating 

** Attack Vector: Remote **

** Attack Complexity: L **
* Specific conditions to exploit?: No
* Measurable effort to exploit?: No

** Privileges Required: N **
* Requires privileged account (not self-registered)?: No

** User Interaction: R **
Requires victim to perform some action during exploit?: Yes , but the result is persistant, attacker will get shell access on every app launch.

** Scope: C **
* Can the attacker impact a separate service?: Yes , this exploits puts user internal storage data(photos and other files) of their device to risk.

** Confidentiality: H **
* How much data could be accessed?:  All
* How much of Evernote android app is impacted?: All

** Integrity: H **
* How much data could be changed?: All
* How much of Evernote android app is impacted?: All

**  Availability: H **

Also my previous report #1422983 was traiged and paid as high severity because the attack vector was local, a malicious app needed to be installed and opened on victim's device to exploit the vulnerability in app, but in this case the attack vector is remote , it will just need 2 click by the victim to get RCE. 

`Limited scope (affects only Android client)` 
> this app has more than 100 million installs on playstore, so this vulnerability could affect more users than it seems and impact is much much severe because this app ask for permission for location,Camera,Contacts,microphone and storage so this is basically like full access to user's device and this vulnerability enabled attacker to access  all these things  persistently and also in program policy page this asset is marked as critical asset. 

So i request you to consider my reasons and proceed with the severity set during the intial traige and ask you to pay this bug as critical severity.

Best Regards, 
Sunny
- **2022-02-03** @boliva: @hulkvision_ thanks for your feedback. We don't agree with the Attack Complexity being low, given that both H1 Triage and our team had some trouble reproducing it. We don't also agree with the Availability being high, since the attack affects only individual users and doesn't represent a threat to the continuous availability of Evernote services. Thus, with those parameters, our [calculated CVSS score](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:H/PR:N/UI:R/S:C/C:H/I:H/A:L) is 8.2 (high).
- **2022-02-16** @hulkvision_: Hii,  I can agree with Attack Complexity being high at the time of retesting ,because there has been some changes in evernote note sharing mechanism now when attacker shares a notebook with victim, victim now needs to accept  the invitation to access the shared notebook and that makes attack complexity high and also make this complex and more than 2 click RCE .
But at the time of reporting and triage , attacker just needed to share notebook with victim , victim does not needed to accept the invitation to access the shared note and that's why triager  taken attack complexity low and triaged  this report as critical(9.0) . 
you can see the poc video as proof that there was no need for victim to accept any invitation to access the shared note, and i think maybe  the reason evernote team was getting issue reproducing this report because a step was missing in `Step to Reproduce` section,accepting the invitation of shared notebook and that was introduced later in note sharing mechanism.

Therefore, i ask you to reconsider the attack complexity as low  because this was the case when triaging the report, you can confirm this with @turtle_shell , and i can agree with availability being high. my [calculated CVSS score](https://www.first.org/cvss/calculator/3.0#CVSS:3.0/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:L)

Thanks,
Sunny
- **Agreed On Going Public**
- **2022-03-08** @boliva: Hi @hulkvision_, as stated above both H1 Triage and us had some initial trouble trying to reproduce the issue, this to us means the complexity requires some highly specialized knowledge. We agree with your disclosure request, and also our team has shipped a fix in the latest couple of releases already. Could you please download the latest available Google Play Store release (10.28)? We will ask you for a retest.
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Report Became Public**
