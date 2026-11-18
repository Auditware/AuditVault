---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - trigger/admin-required
substate: "not-applicable"
weakness: null
enriched: true
body: true
date: 2022-07-01
submitted: 2022-06-20T16:03:43.388Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/omise|Omise]]"
reporter: "irwanjugabro"
source: "https://hackerone.com/reports/1607756"
title: "Unauthorized Access - downgraded admin roles to none can still edit projects through brupsuite"
---
# Unauthorized Access - downgraded admin roles to none can still edit projects through brupsuite

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Omise | **Disclosed:** 2022-07-01

- Report: [https://hackerone.com/reports/1607756](https://hackerone.com/reports/1607756)
- CWE: N/A
- Submitted: 2022-06-20T16:03:43.388Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

hi team,
I found that your site is vulnerable to Unauthorized Access lead to  privilege escalation, where when the owner invites a user with admin roles, the user can still edit anything with admin access, via brupsuite, it should get an error message because the admin role has been removed.


production step:
1. The `owner `invites `user` with admin roles at https://dashboard.omise.co/team
2. Then the `user`, intercept any request using brupsuite, for example edit/add link at https://dashboard.omise.co/v2/links
3. then the `owner` lowers the role to `none`
4. then you will see, the user does not see the create link feature because the role is lost
5. but when the `user` repeats the request step#2 via brupstuite. then it will be valid.

PoC :
██████

## Impact

Unauthorized Access lead to  privilege escalation, downgraded admin roles to none can still edit projects through brupsuite

## Timeline

- **Report Filed**
- **2022-06-22** @irwanjugabro: HI, any update?
- **2022-06-23** @mel-opn: Hi @zombieesshx ,

Sorry for the late reply. 

Unfortunately, after checking your PoC report, we found that you are in the `Test Dashboard` (Sandbox environment) which is not identical to the `Live Dashboard` and by our design, we allow full access for all team members in the `Test Dashboard` as the statement below:

> Note: Roles are only applicable on the live dashboard. All members have full access to the test dashboard.

See more in https://www.omise.co/how-to-manage-user-access-to-the-dashboard

Could you please reproduce in the `Live Dashboard` ?

Omise Security
- **2022-06-23** @irwanjugabro: HI @mel-opn,
looks like it but I'm sure it will be in production on the live dashboard too,

i can't test it, because the live app needs review, and i'm not sure my project will be valid,
can you confirm my project, in order to test this problem quickly.
 
let me know if you have confirmed the live project.

project email : victim.email2021@gmail.com
- **2022-06-26** @irwanjugabro: hi any updates?
- **2022-06-27** @mel-opn: Hi @zombieesshx,

We are working to verify your finding issue in `Live dashboard` and will update the report once completed.

Thank you.
Omise Security
- **2022-06-30** @irwanjugabro: Hi more than a week, this report no progress? 
I also hope to speed up your triage give me 1 credential for the live dashboard 


Regards..
- **2022-06-30** @mel-opn: Hi @zombieesshx, 

Unfortunately, we cannot provide you the credentials for the live dashboard. 

We do concern your issue and in the meantime, we have recently concluded the penetration test result on this system, in which there was no relevant issue. However, we ourselves are also in the progress of requesting for the credential to access the live dashboard in order to re-verify your reported issue. We will keep you updated once it is complete.

Thank you.
Omise Security
- **2022-06-30** @irwanjugabro: thanks,
I think it will take longer than your policies
- **2022-06-30** @mel-opn: Hi @zombieesshx, 

We are sorry to keep you waiting, I think we have finished analysis on your report in the `Test Dashboard` already. 

The next step is we have to recheck in the `Live Dashboard` to ensure whether this issue is actually valid and affect our customers because you cannot test in the `Live Dashboard`, so we are waiting for the `Live Dashboard` account as well, which will take a longer time than usual.

Hope you understand our current situation. Thank you.
Omise Security
- **2022-07-01** @mel-opn: Hi @zombieesshx,

We have tried to reproduce your reported issue in the `Live Dashboard` and found that we are unable to use the member account that has previously been revoked the Administrator role to re-create a link.

Attached you would find evidence of a failed attempt to create a link before and after the Administrator role is revoked from the member account, thus it is not an issue in the `Live Dashboard`.

Thank you for your effort. We are looking forward to your contribution in the future.
Happy hunting!
Omise Security
- **Report Not Applicable**
- **2022-07-01** @irwanjugabro: hi i think its very bad if you make this `N/A`.
First I reported a valid issue even though it was on the test dashboard. 
Second, you didn't provide credentials and did the test yourself, maybe you're right it didn't work, but I think there's a way to do that it works. What you don't find. 

I think at least you appreciate my report. With `infomative` instead of `N/A` that ruined my reputation being hackerone.
I hope you understand and change the status against me and this report. 

Best Regards...
- **2022-07-01** @mel-opn: Hi @zombieesshx,

Firstly, in the `Test Dashboard`, we do have information and a warning message as attached.
What you have done and reported is in the `Test Dashboard`, which the dashboard itself has already informed that you are in the test mode (`Test Dashboard`) and roles are not applied to the `Test Dashboard` even though you configured the role in the team setting. The `Test Dashboard` also grants all members full access to all functions. Therefore, we considered your report invalid and thus we closed this report to `N/A` as this is the most applicable state according to the HackerOne's closed report state definition (https://docs.hackerone.com/hackers/report-states.html).

Secondly, providing a credential of the `Live Dashboard` to reporters is out of our responsibility as reporters have to create by themselves.

Hope you understand our justification regarding this matter.
Best regards,
Omise Security
- **2022-07-01** @irwanjugabro: Hi, 
You should have said that on your program policy page at hackerone, 
If you say that behavior is intentional, it shouldn't go through brupsuite either way. But it doesn't work whether it's called the behavior you mean.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
