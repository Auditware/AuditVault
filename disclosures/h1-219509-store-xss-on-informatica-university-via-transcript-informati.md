---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2017-09-09
submitted: 2017-04-08T13:09:13.224Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/informatica|Informatica]]"
reporter: "alfredsaonoy"
source: "https://hackerone.com/reports/219509"
title: "Store XSS on Informatica University via transcript (informatica.csod.com)"
---
# Store XSS on Informatica University via transcript (informatica.csod.com)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Informatica | **Disclosed:** 2017-09-09

- Report: [https://hackerone.com/reports/219509](https://hackerone.com/reports/219509)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2017-04-08T13:09:13.224Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2017-04-08** @alfredsaonoy: Also seems that the  Training Description is vulnerable to html/content injection. In this case I changed it to bold letters.

Adding Some screenshots:
F174248
F174250
F174251
F174252
F174253
F174254
F174255

Please let me know if you need further information. Thanks and have a great weekend!

Cheers,

@ninjakatz__
- **2017-04-10** @tarantula_hawk: Dear @ninjakatz__ 

We are looking into the issue and severity. Having said that the mentioned application is not in the scope of our program.
- **2017-04-10** @alfredsaonoy: Dear @tarantula_hawk ,

Appreciate the reply. I apologize if the said endpoint is not within scope although I wasn't able to see it in your out-of-scope domains.
Just had to report this so it can also be fixed to avoid from being exploited in the future or atleast help harden your sytem. 

Please do let me know if this 
doesn't merit a change in your end. If not, i would appreciate if you can close as informative or let me self close instead. 

Have a great week ahead!

Cheers,

@ninjakatz__
- **2017-04-11** @alfredsaonoy: Hi @tarantula_hawk,

Would appreciate a feedback or update on this report.

Thanks and have a great day!

Cheers,

@ninjakatz__
- **2017-04-14** @alfredsaonoy: Hello,

I know this might be a low prio report but just would like ask if you have an update on this report? Thanks!
- **2017-04-18** @alfredsaonoy: Hi,

Just would like to ask if this report is going to be considered? Thanks
- **2017-04-20** @tarantula_hawk: We are looking into it, looks like we need to contact our vendor who manages this. Request you to create a video POC and share with us for our reference.
- **2017-04-20** @alfredsaonoy: Hello @tarantula_hawk,

Apologies for bugging you and thanks for checking into this. Attached is a video poc for the said bug on this endpoint. All other parameters on the site are already being sanitized except for the "training description" field which still has html and xss injection.

VIdeo: F177408

Please do let me know if you need further information. Thanks!

PS: Is it possible to set the report into traiged so I can know which of my reports are already checked as well. Would appreciate that. Have a great day!

Cheers,

@ninjakatz__
- **2017-04-20** @tarantula_hawk: Hello @ninjakatz__ 

Thanks for the video POC.
Just for better visibility, can this XSS be triggered on the any other browser by sharing any link ?
- **2017-04-20** @alfredsaonoy: Hi @tarantula_hawk,

The xss can be executed using the latest version of chrome and firefox. 

Normally external training requires **"Separate approval is required to mark the item complete."** which indicates that an admin or course moderator needs to validate these external training before they are approved. That would be a perfect scenario wherein the script can be executed on the admin/moderator end to steal cookies.

By fixing this endpoint, this can also help strengthen security since there is a possibility that courses in the future can be shared either via trainee-to-trainee or trainee-to-admin environment. 

Hope this can help verify on your end as well.

Cheers,

@ninjakatz__
- **2017-04-21** @alfredsaonoy: Hi @tarantula_hawk,

Just wanted to ask if you have an update regarding this report? 
Would appreciate one. 

Have great weekend!

Cheers,

@ninjakatz__
- **2017-04-25** @alfredsaonoy: HI,

Just would like to know if you have an update on this?
Have a great week ahead! Thanks

Cheers,

@ninjajatz__
- **2017-04-28** @alfredsaonoy: Hi @tarantula_hawk,

Was wondering if you have an update on this? Thank you.

Have a great weekend ahead!

Cheers,

@ninjakatz__
- **2017-05-04** @tarantula_hawk: Hey @ninjakatz__ 

yes, we are here and working on this. As soon as we finalize our plans for this will make it trigae. 
Appreciate your patience but as this is not in scope we need to take it separately which is causing the delay.
- **Report Triaged**
- **2017-05-18** @tarantula_hawk: Dear @ninjakatz__ 

we have disabled the feature as a temporary fix for this and will work for the fix later.
can you please confirm the closure. 

thanks,
- **2017-05-19** @alfredsaonoy: Hi @tarantula_hawk,

Apologies for the late reply. Just checked and i'm still able to access and inject code on this endpoint. 

Please let me know if your need more info.

Cheers,

@ninjakatz__
- **2017-05-25** @alfredsaonoy: Just wanted to check if you have an update on this? Thanks
- **2017-05-25** @tarantula_hawk: Dear @ninjakatz__ 

As far as I understood with the fix, now any user can not register for the new account to reproduce this. 
Are you able to register with a new account and then reproduce it ? If yes please let me know.
- **2017-05-25** @alfredsaonoy: Hi @tarantula_hawk,

Just checked and can confirm that "new accounts" doesn't have the option to add a transcript which helps avoid abuse on the endpoint. Nice Temp patch.

Will this report be tagged as "resolved" now?

Was also wondering since there were changes made and possibly another patch applied in the future, will this be eligible for a bounty or swag? Would really appreciate it.

Again, it was nice working with you and hope to find more bugs in this platform soon as a I have time to hunt.

Cheers,

@ninjakatz__
- **Report Resolved**
- **2017-05-26** @alfredsaonoy: Dear @tarantula_hawk,

Appreciate it.

You have a great weekend yourself!
- **2017-06-13** @alfredsaonoy: Hello @tarantula_hawk,

Just checking if a patch has been applied to this? thanks!
- **2017-06-28** @alfredsaonoy: Just wondering if this is still eligible for a bounty? Thanks
- **2017-08-08** @alfredsaonoy: Hello,

Was wondering if there was an update on this? thanks!
- **Agreed On Going Public**
- **2017-09-01** @alfredsaonoy: Hello @tarantula_hawk,

Was wondering if there was an update on this report?  Thanks!

Cheers,

@ninjakatz__
- **Report Became Public**
