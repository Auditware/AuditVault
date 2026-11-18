---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/use-of-a-key-past-its-expiration-date
  - env/web
substate: "resolved"
weakness: "Use of a Key Past its Expiration Date"
enriched: true
body: true
date: 2017-08-03
submitted: 2017-04-03T12:29:12.064Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/kaspersky|Kaspersky]]"
reporter: "huntman"
source: "https://hackerone.com/reports/218287"
title: "In App purchase Hack "
---
# In App purchase Hack 

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 47 | **Program:** Kaspersky | **Disclosed:** 2017-08-03

- Report: [https://hackerone.com/reports/218287](https://hackerone.com/reports/218287)
- CWE: Use of a Key Past its Expiration Date
- Submitted: 2017-04-03T12:29:12.064Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I have downloaded kaspersky internet security from the playstore and it asks for free version or trial version and i have given trial version then i got 7 days free pack,After that i used with the help of lucky patcher and freedom app i can able to byepass without money i can able to purchase 365 days pack ,Hope this will help ,I have attached screenshot here kindly check,I dint spend not even single $

## Timeline

- **Report Filed**
- **2017-04-04** @kravcov_v: Hello!

Thank you for the report! Please kindly send us screenshot of the licence window, after activation. 
We need to see what is "behind" the pop-up window on After_Activation.jpeg screenshot.

Thank You!
- **2017-04-04** @huntman: Kindly check the screenshot
- **2017-04-04** @huntman: First i have got the premium version 

check the below screenshot and i have got all the options enabled and i can use each and every functionality,

Below screenshot i just did hide of my devicec id kindly check
- **2017-04-05** @kravcov_v: Thank you!

We will check and provide you with update.
- **2017-04-05** @huntman: Thanks.
- **2017-04-17** @huntman: Hi Team,

What is the status of this vulnerability?
- **2017-04-24** @kravcov_v: Hello!

I have requested status update from developers.

Thank You!
- **2017-04-25** @kravcov_v: Hello!

We suppose, that your device doesn't have internet connection and the product can't check the status of the license.
Please kindly check if the issue persist when your device is connected to web.

Thank You!
- **2017-04-25** @huntman: Hi Team

Yes it is 
And the days count day by day it is getting reduced please check the attached screenshot

Check the above on screenshot it is connected with internet and check the days count
- **2017-04-27** @huntman: Hi Team,

Can you able to produce this issue or if you need let me send you POC Video for that,And same procedure i have tried with some other antivirus product they bring up webview on purchase window i can not able to perform Hacks into that,If you need more information let me Send POC video ,Waiting for your kind reply.

Thanks !
- **2017-05-02** @kravcov_v: Hello!

Yes, sure!
Please kindly send us video.

Best Regards,
Vitaly Kravtsov.
- **2017-05-03** @huntman: Hi Team,

Let me send you.

Thanks.
- **2017-05-03** @kravcov_v: Hello!

We didn't get anything, sorry.

Thank You!
- **2017-05-04** @huntman: Hi Team 

I have attached a Video and step by step procedure to reproduce.

Tools Used to hack:
Luckypatcher
Freedom
ADB
Drozer(Mobile Security Framework)

Steps to reproduce:
Step 1:
Install Kaspersky from the play store, And the installed version from the play store is free and few operations will not be enabled only a premium version users can use that services

1.Real-time protection
2rivacy Protection
3.Web Protection

Step 2:
Use drozer Framework to check the services which are running on the package and the command is 

"run app.package.attacksurface com.kms.free"
Attack Surface:
  15 activities exported
  24 broadcast receivers exported
  0 content providers exported
  5 services exported

"run app.activity.info -a com.kms.free"
Package: com.kms.free
  com.kms.gui.KMSEnterCodeActivity
    Permission: null
  com.kms.gui.ShareItActivity
    Permission: null
  com.kms.antivirus.gui.AvScanResultActivity
    Permission: null
  com.kms.antitheft.gui.DeviceAdminLockScreenActivity
    Permission: null
  com.kms.antitheft.gui.LockInfoActivity
    Permission: null
  com.kms.activation.gui.LicenseInfoActivity
    Permission: null
  com.kms.antispam.gui.AntiSpamUserActionActivity
    Permission: null
  com.kms.gui.KMS6ManageSpaceActivity
    Permission: null
  com.kms.rateus.gui.KMSRateUsActivity
    Permission: null
  com.kms.activation.gui.RenewalValidationFormActivity
    Permission: null
  com.kms.ipm.gui.ShowIpmMessageActivity
    Permission: null
  com.kms.ipm.gui.IpmLicenseNotificationActivity
    Permission: null
  com.kms.activation.gui.LicenseBlockedActivity
    Permission: null
  com.kms.permissions.gui.PermissionsActivity
    Permission: null
  com.kms.free.PermissionsActivityLauncher
    Permission: null
    Target Activity: com.kms.permissions.gui.PermissionsActivity

Step 3:
And i am gonna run the particular activity from the drozer and the activity name is 

"com.kms.antitheft.gui.DeviceAdminLockScreenActivity"

Step 4:
Once the activity executes automatically it starts on mobile

Step 5:
Now click on Buy premium and it will be activated successfully and u can make enable all the 

1.Real-time protection
2.Privacy Protection
3.Web Protection

YouTube URL:
https://youtu.be/x3gnO0me_h8

Note:
As a security researcher i am looking for a hall of fame here please go through the reproduce steps and check the vulnerability, I am waiting for your reply.

Thanks
- **2017-05-04** @huntman: Hi Team

This is the competitor application of your Kaspersky and i tried all these applications and they have brought the web view to purchase the product and i could not able to bypass.

Bitdefender
Norton Security
Avira
Trend Micro
Avast
F-Secure
Panda Security
ESET
K7

Thanks
- **2017-05-06** @kravcov_v: Hello!

Thank you! We are analyzing new information.
- **2017-05-07** @huntman: Hi Team 

Acknowledged.
- **2017-05-16** @huntman: Hi Team 

Hope your team is good,

What is the status of this vulnerability As a security researcher i am looking for bounty and Hall of fame here, Does that vulnerability fixed ?.Please update
- **2017-05-17** @huntman: Hi Team, 

Hope you guys doing good?

What is the status of this vulnerability, Please update
- **2017-05-17** @kravcov_v: Hello!

It is unclear what is happening on step 5. There is no video. Is it possible to provide us with this step details?

Thank You!
- **2017-05-18** @huntman: Hi Team 

As per your request i have recorded another playback video for activate premium version

Please check the below URL 

https://youtu.be/otT3qy8o9vE

Note:
The same issue existed one of your competitor antivirus product ,They have fixed and the solution i have given them to bring up the webview payment method instead of using IAP services and they are gonna release new build ASAP .

As a security researcher my sumbission is professional and this will not be revealed public until or unless you fixed,Bounty and hall of fame that will motivate me and it will helps to find more way to secure your product hope this video will help you to fix

Thanks Team 
Please update the status
- **2017-06-01** @huntman: Hi Team 

What is the status of this vulnerability any update?
- **2017-06-01** @kravcov_v: Status update requested from developers
- **2017-06-01** @huntman: Hi Team,

Thanks Acknowledged,Once you got informations please update
- **2017-06-08** @huntman: Hi Team,

What is the status of this vulnerability any updates from the developers ?.
- **2017-06-11** @huntman: Hi Team,

What is the status of this vulnerability Have you got any updates from the developers ?.
- **2017-06-13** @kravcov_v: Hello!

I have requested status update from developers.

Thank You!
- **2017-06-20** @huntman: Hi Team,

Any updates from the development team, What is the status of this vulnerability?
- **2017-06-20** @kravcov_v: Hello!

At the moment we are preparing a special diagnostic build for you.
Unfortunately it may take 2 weeks till this build is ready.

I will keep you updated.

Thank You!
- **2017-06-20** @huntman: Hi Team

Acknowledged
- **2017-06-23** @kravcov_v: Hello!

We have recently released new version - MR14. Can you please kindly check if the issue still can be reproduced?
You can get this version here: https://box.kaspersky.com/f/b93c649d46/

Thank You!
- **2017-06-23** @huntman: Hi Kravcov,

Acknowledged.Let me check and update you ASAP.

Thanks
- **2017-06-26** @huntman: Hi Krakov,

Today i tried to reproduce the issue but i could not able to see entire activity list as i did before ,Your team did a good work.

But i found client side  an attacker can able to unblock all the function with the help IAP hook hack but once user connects with internet automatically server end your team did a validation to block it hope this will not affect app behaviour.But for the next build even client side User should not unblock all the functions.Without purchase user should not see the blocked function at client end but if i see the function before purchase it is Vulerable..

Apart from this,The activity calls fixed from your team 

Congrats.
- **2017-06-27** @kravcov_v: Hello!

Can you please kindly clarify if you suppose that the issue is solved?

Thank You@
- **2017-06-27** @huntman: Hi Kracov,

Yes,I tried to reproduce the issue but i could not able to see entire activity list as i did before,It is resolved 

But client side an attacker unblock the functions kracov.
- **Report Resolved**
- **2017-06-27** @huntman: Hi Kracov,

Let me update Regarding this on another thread
- **2017-06-27** @huntman: Hi Kracov,

For this resolved issues do i get any reward, hall of fame or bounties ?.
- **Bounty Awarded**
- **2017-06-30** @huntman: Hi Team,

Thank You.
- **Agreed On Going Public**
- **2017-07-05** @huntman: Hi Karlo,

Any update would you mind to disclose this public?
- **2017-07-05** @kravcov_v: Hello!

Could you please kindly clarify - you want us to disclose this on our site or you would like to publish it somewhere by yourself?

Thank You!
- **2017-07-05** @huntman: Hi Kracov,

I would like to publish on some website and they would like to compensate me for this.
- **2017-07-05** @kravcov_v: Hello!

Thank you for clarification.
I will inform responsible department and will let you know their opinion.

Best Regards,
Vitaly Kravtsov.
- **2017-07-05** @huntman: Hi Kracov,

Thanks and Acknowledged.
- **2017-07-06** @huntman: Hi Kracov,

Any updates regarding public disclosure?
- **2017-07-06** @kravcov_v: Hello!

Yes, disclosure is possible but after the version with fix is fully released.
This process will take + 2 weeks. 

We will inform you when it will be done and you can make a publication after that.

Will that be ok for you?

Thank You!
- **2017-07-06** @huntman: Hi Kravcov,

Yes, this is Ok.No problem.Let me wait.Once it is done please let me know once it is done.But anyways you guys fixed right that will not a problem if posted?.If I want to wait let me wait

Thanks

> 9 more activity entries not fetched (cap 50).
