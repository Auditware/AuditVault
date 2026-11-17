---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2023-09-21
submitted: 2023-08-13T14:16:41.617Z
bounty_usd: 8868
votes: 248
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "neex"
source: "https://hackerone.com/reports/2107680"
title: "AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp"
---
# AWS keys and user cookie leakage via uninitialized memory leak in outdated librsvg version in Basecamp

> **Severity:** High | **Bounty:** 8,868 USD | **Votes:** 248 | **Program:** Basecamp | **Disclosed:** 2023-09-21

- Report: [https://hackerone.com/reports/2107680](https://hackerone.com/reports/2107680)
- CWE: Information Disclosure
- Submitted: 2023-08-13T14:16:41.617Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2023-08-13** @rosa: Hey ███,

Just a quick update to let you know we've shipped a quick patch implementing your suggested option 2. I can no longer reproduce the issue following your steps. Tomorrow we'll continue addressing this. 

Thanks again,
██████████
- **2023-08-14** @neex: Hello ████████,

Thank you for the fast reply. I can confirm that the fix is deployed. SVGs don't work anymore.

In case you need the full list of all aws keys present in my dumps to revoke them, here are they:

```
█████ / ███████
████ / ████
████████ / ████████
██████ / ████████
```

Of course, I won't share them anywhere and will delete all the dumps.

Later I came up with an idea how I could leverage this issue to an RCE (without using the AWS keys). Since `<base64>--<signature>` data in RoR are mostly output of `ActiveSupport::MessageVerifier` (that is, marshal + hmac), I could try to recover the signing key from the dumps and then try one of unmarshal -> RCE techniques. However, I'm not sure if this would succeed.

P.S. Sorry for reporting on Sunday, I didn't expect you will be looking at it that soon. "It Doesn’t Have to Be Crazy at Work" is one of my favorite work-related books.
- **2023-08-14** @lewispb: Hey ███████, great report, thanks. Quick question, is there a relevant CVE in librsvg (or elsewhere) we can refer to here?
- **2023-08-14** @neex: Hello @lewispb,

The core issue resides in the gdk-pixbuf (this is the library used by librsvg to parse raster image formats like BMP which is used in my exploit).

I believe - but not sure at all - that the bug in question was accidentally fixed somewhere around here in ████████: ████████. However, no CVE was assigned and no security patch was released.
- **2023-08-15** @lewispb: Thanks █████ - very helpful. Are you able to also provide us with other cookies you were able to log?
- **2023-08-15** @lewispb: Actually, perhaps you could send the entire dump of data so that we could analyze it ourselves? Depending on the size, perhaps you could upload an encrypted zip here and email the key to ████

Thanks
- **2023-08-15** @neex: Hi, 

I grepped everything that looked like cookies, the file is attached: ███████
- **2023-08-15** @lewispb: Thank you very much. We would still like to analyze the data ourselves if possible.
- **2023-08-15** @neex: Sorry @lewispb, I missed your second message. 

Here's the archive, I'll emailed you the key from ████████ several minutes ago. The file is here: ████████.
- **2023-08-15** @rosa: Hey ██████████!

Thanks for sending all this; it was very helpful. 

> P.S. Sorry for reporting on Sunday, I didn't expect you will be looking at it that soon. "It Doesn’t Have to Be Crazy at Work" is one of my favorite work-related books.

Oh, no worries at all, and glad you like the book! Normally we don't work on Sundays, that's totally true, but in this case, we decided to address it as soon as we could as it was a serious issue 😅

We're still working through updates to `librsvg` in all our servers. When we finish we'll close this as Resolved. 

We'll be also awarding a bounty shortly. 

Thanks again!
██████████
- **Bounty Awarded**
- **2023-08-16** @neex: Thank you for the bounty)
- **Report Resolved**
- **2023-08-18** @neex: Hi █████████,

Yes, I confirm I just deleted everything I had on my filesystem. However, note that I can't delete the dumps I sent you earlier since they're stored here at H1.

Thanks again for the fast and qualified handling of the issue)
- **2023-08-18** @rosa: Hi ███████,

> Yes, I confirm I just deleted everything I had on my filesystem. However, note that I can't delete the dumps I sent you earlier since they're stored here at H1.

Yes, of course. That's perfect; thanks a lot for confirming, and thanks again for the brilliant report and all your patience and help with it. 

Have a good weekend!
███████
- **Agreed On Going Public**
- **Report Became Public**
