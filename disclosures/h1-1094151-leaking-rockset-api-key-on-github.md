---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cleartext-storage-of-sensitive-information
  - env/web
substate: "resolved"
weakness: "Cleartext Storage of Sensitive Information"
enriched: true
body: true
date: 2021-03-02
submitted: 2021-02-03T17:54:12.674Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/rockset|Rockset]]"
reporter: "fonte"
source: "https://hackerone.com/reports/1094151"
title: "Leaking Rockset API key on Github"
---
# Leaking Rockset API key on Github

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Rockset | **Disclosed:** 2021-03-02

- Report: [https://hackerone.com/reports/1094151](https://hackerone.com/reports/1094151)
- CWE: Cleartext Storage of Sensitive Information
- Submitted: 2021-02-03T17:54:12.674Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
We all know that Github is great, but it runs the risk of some credentials being revealed by mistake. In this case I found a Rockset API key, This API key is not in the current code, but it is visible in an old commit.

## Steps To Reproduce:
You can find the leak in this link : https://github.com/rockset/recipes/pull/19/files

```
        /* Getting the distance covered by each vehicle using the latest and oldest locations */
        distance_for_vehicles AS (
        SELECT
            ST_DISTANCE(
@@ -128,7 +147,7 @@
    'q4': query4 
}

api_key = "skZMJRZSXLZZj5HAdBjNxUfZbarWV5dLqfVO6U623zW5KROzfY0vNRa22ToZfRRe"
```

Then I visited the documentation of Rockset ( https://docs.rockset.com/rest-api/ ) and I found this way to check if the API key is revoke or not
```
curl --request GET \
    --url https://api.rs2.usw2.rockset.com/v1/orgs/self/users/self/apikeys \
    -H 'Authorization: ApiKey skZMJRZSXLZZj5HAdBjNxUfZbarWV5dLqfVO6U623zW5KROzfY0vNRa22ToZfRRe'
```
and I got this answer:
```
{"data":[{"created_at":"2019-10-22T06:08:37Z","name":"K1","key":"skZMJRZSXLZZj5HAdBjNxUfZbarWV5dLqfVO6U623zW5KROzfY0vNRa22ToZfRRe","last_access_time":null,"created_by":null}]}
```
So I could verify that it was not revoked

## Impact

I just checked that the key was not revoked. I didn't try anything with the token  to be prudent, and I don't know the real impact of this, But I think it is a good idea to share this with you, to avoid any risk that may grow.

Regards!

## Timeline

- **Report Filed**
- **2021-02-04** @bluetooth_headset: Hi @afsec,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@bluetooth_headset
- **2021-02-04** @bluetooth_headset: Hi @afsec - I'm discussing this submission internally with the Rockset team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2021-02-10** @fonte: Hi! How are you? I hope you are well.
Any updates?
Regards!
- **2021-02-10** @bluetooth_headset: Hi @afsec - We are still looking into this report and will update you when we have additional information to share. Thanks for your patience!
- **2021-02-17** @pmenglund: The customer api key has been revoked now
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
