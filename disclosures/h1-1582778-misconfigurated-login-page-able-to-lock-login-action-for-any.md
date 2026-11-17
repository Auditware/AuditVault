---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "informative"
weakness: null
enriched: true
date: 2022-06-06
submitted: 2022-05-27T10:17:28.931Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "ug0x01"
source: "https://hackerone.com/reports/1582778"
title: "Misconfigurated login page able to lock login action for any account without user interaction"
---
# Misconfigurated login page able to lock login action for any account without user interaction

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Reddit | **Disclosed:** 2022-06-06

- Report: [https://hackerone.com/reports/1582778](https://hackerone.com/reports/1582778)
- CWE: N/A
- Submitted: 2022-05-27T10:17:28.931Z

## Report summary

A punishment for every mistake, a reward for every kindness

## Timeline

- **Report Filed**
- **2022-05-29** @ug0x01: {F1748443}

So, any update?
- **2022-05-31** @h1_analyst_arthur: Hi @h1ugroon,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@1nfinit3
- **Report Informative**
- **2022-05-31** @ug0x01: Hey @1nfinit3, thanks for your reply 

> The account lockout is not permanent and can be unlocked by the user

User can not unlock the account and also lockout is permanent.

> It looks that the error you are getting is due to rate limit is triggered after X attempts and your IP has been restricted from accessing that account

No, each request is sent with a different IP address via helper.py. You can try it yourself, if you send over X requests, reddit will block your IP and will start to giving 429 but as what I said each request is sent with a different IP address via helper.py. So, then you can test it with helper.py.

> If you can show a permanent lockout to user’s account

Please create a test account and give me username and then just let me show you what will be happened :)

Cheers,
@h1ugroon
- **2022-05-31** @h1_analyst_arthur: Hello @h1ugroon, 

Please use this email to carry out the attack: `1nfinit3@wearehackerone.com`

Best,
@1nfinit3
- **2022-05-31** @ug0x01: Hey @1nfinit3,

Just username required for attack. So, can you send your username? If your username is `1nfinit3` please let me know

{F1751654}

Best Regards,
@h1ugroon
- **2022-05-31** @h1_analyst_arthur: Hello @h1ugroon, 

Username is `1nfinit3_H1`. 

Best,
@1nfinit3
- **2022-05-31** @ug0x01: Hey @1nfinit3,

Started attack and tried to login on 2 devices.

This is my device

{F1751797}

And this is my friend's device

{F1751798}

After verifying the issue, please let me know and I will stop the attack

Best Regards,
@h1ugroon
- **2022-06-01** @h1_analyst_arthur: Hello @h1ugroon, 

As I can see from your PoC, the application has a cooldown period. You may be running the script continuously but that comes under resource exhaustion (denial of service) category that is generally considered OOS. 

However, I was able to login in a new session and also my old session was not expired, attaching a screenshot for your reference. 
{F1752172}

Having said that, I will keep this issue closed as `Informative`. 

Best,
@1nfinit3
- **2022-06-01** @ug0x01: Hey @1nfinit3,

This is because of I was have to go to sleep and my internet connection has been cut off. Now I have started exploit again. So, can you try to login again?
- **2022-06-01** @ug0x01: {F1752329}
- **2022-06-01** @h1_analyst_arthur: Hello @h1ugroon, 

I can successfully log in to my user account. 

Best,
@1nfinit3
- **2022-06-01** @ug0x01: Hey @1nfinit3,

Do you use vpn or vps? And what is your browser version? Because I can reproduce the issue with chrome latest on a normal device but I can't reproduce with VPN/VPS/Old browsers. 

{F1752646}

As you can see I've used tor
- **2022-06-01** @ug0x01: I used tor, my phone, my friend's computer and my own computer. Seems blocked for all?
- **Agreed On Going Public**
- **2022-06-01** @gunther_reddit: We have different ratelimits based on if the current IP has been associated with a successful login on the account or not. So while yes, this causes a ratelimit with random IPs, a successful login for a "seen before" IP will work just fine. Agree this should be closed, no action will be taken
- **2022-06-01** @ug0x01: Hey @gunther_reddit,

> a successful login for a "seen before" IP will work just fine

No you can test, it's blocking a "seen before" IP too
- **2022-06-01** @ug0x01: You can check my first attachment (PoC video on report (https://hackerone-us-west-2-production-attachments.s3.us-west-2.amazonaws.com/h11p01gfdkpfho5z7qc53fu0w148?response-content-disposition=attachment%3B%20filename%3D%22recording-1653645412706.webm%22%3B%20filename%2A%3DUTF-8%27%27recording-1653645412706.webm&response-content-type=video%2Fwebm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQGK6FURQY54WIUW4%2F20220601%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220601T141925Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEsaCXVzLXdlc3QtMiJHMEUCIQDBbWz3lhGmeTsP1SufCmyiePFKO8KjSjuOljrR5NhPiAIgOXdr6YJYtWDr6mzoLEEGDbzsegYiU%2B9LPW%2BVSyYImkIq0gQIRBACGgwwMTM2MTkyNzQ4NDkiDJQ6MtWtPvU4uTgGryqvBJyn0mBlidz4huDBoURKMc5ZWoY%2BUocDqDT2yyoymtu%2FHbGVeremyuvdqAyiA4RqKTTC1ixGgSHLu7tTUF7fxpU3gpen1PZ3mWlDdKMejnQ9UgdgkPWTXRqX7JIuikEgXi%2BuMNWDbjWjNyx7sETDAmoybvwBfuObwoOnRx4Xx%2FRc74wQc%2FY9pd3RVKfezt5%2B99FrvOFFTU1veE0%2BA4n59BINcx2dzSk1j8ACHTY60KW%2FMPG8jotTURNO909cgneA3aVCs6ULJAMLONMPQMvcolw0gGSwcwRzokyfHjsJtklCpBGH6vGA3DPWL6hNqGj1UwnRSrU8A5CLis1DQlO62bhxJitE69ukqHuY4IGqVwcVvNxRPaTvP4OlQ2pC%2FDVNJyrolymVhkaxMVGK%2F9iw3WCI%2F7n5vnUC2bKmq4g9Tw5CMclCHC6l3OiDpJLWZxuERnEieV0rBNhMsAdYhgpXaRzXyp16crBMgBU6PwTnGNvbuiWIQt5RaCsfikDYpms%2FeQ4J3e2GU%2BewZkq0pv3oO8SKXWx1TFkl4oNUtTuRBSEgPIO94F3YrExRYYgOPLVYtMSQIL4JSqqcRNjkDaWwN9gWev%2FwAfbPtkR0QigZ0cpc%2BWN5SSUN70EMY1ej6C%2BJj9Mdokubp%2BT29gfNNREyRHoBFtgbjV8DXtGmlrCnkJk6I4yS7RWcqBkRrhwyhxMQuMpOF%2FzyUE5PhWvVLxsniz%2BBACSymzx4FalPqun4o%2Bcwn%2F3clAY6qQGE0EN%2FuneykYAbRb%2BAuFjDA2s1bWm6h4JQtFbBobhBf%2BGYXwciVjLkYvyYh21zQX56DZ3BRx4Sj%2ByOrf5MYfiFJT7M7gaYuOmlCPD78vOH4xIVK23BF0NgluCgjUrBGm93wnm%2BQosFBRUAcH1XM6Ls3ZEJS6ROzlS8ISQaIHaI1xEtlXTJWHvNefQT7WSpMYaAcz1OIaxPyRqaD9ox7XsXZzWdvSyJpquM&X-Amz-SignedHeaders=host&X-Amz-Signature=48857f13eada245e5c07aeb1f5cd77833cdd66ac75134336c2cd219734ade4fc))
- **2022-06-01** @ug0x01: I don't know if you fixed the issue after reporting but in the PoC in the report, you can clearly see that it also blocked a "seen before" IP.
- **2022-06-01** @ug0x01: {F1752845}
- **Hacker Requested Mediation**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-03-10** @ug0x01: I think they are good scammers
