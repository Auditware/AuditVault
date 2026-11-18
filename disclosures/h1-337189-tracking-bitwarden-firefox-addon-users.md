---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2018-05-23
submitted: 2018-04-13T09:21:24.054Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/bitwarden|Bitwarden]]"
reporter: "kmodi"
source: "https://hackerone.com/reports/337189"
title: "Tracking Bitwarden firefox addon users"
---
# Tracking Bitwarden firefox addon users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Bitwarden | **Disclosed:** 2018-05-23

- Report: [https://hackerone.com/reports/337189](https://hackerone.com/reports/337189)
- CWE: N/A
- Submitted: 2018-04-13T09:21:24.054Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Firefox web extension, generate a UUID for each web-extension and is specific to a user. Unlike chrome extensions. 
Which means whenever the user installs Bitwarden on Firefox, it generates a different extension ID for each user.
You can check the extension ID by about:debugging -> under extensions.

The problem occurs when Bitwarden prompts the user with the message:
 `Should Bitwarden remember this password for you?`.  [Screenshot attached]

This prompt is loaded as a local resource from `moz-extension://UUID/bar.html?add=1`, and this can be easily read by the website and any Javascript running on that page.

## Impact

Now, because this is UUID is unique to each user, it is a potential userID which can be used for tracking a user:
1. That a user is a Bitwarden user.
2. Multiple accounts used by the user across normal windows, private windows, containers.
3. Because this ID can also be read by a third-party javascript on the page:
    A.com/login.html has a third-party T.com
    B.com/login.html has a third-party T.com
Now because T.com can also read the UUID for Bitwarden, T.com can on their backend track that it's the same user visiting A.com and B.com. It will not matter whether the user has third-party cookies disabled or not, or is using some tracking protection. Hence, Bitwarden infects the browser ecosystem and breaks the privacy protections / private browsing mode.

This ID is accessible and remains same irrespective of :
- Private mode
 -Normal mode
- After browser restart
- Extension update.
- Clearing History / Local storage

The only way to remove this UUID is by deleting and re-installing the extension.

I am happy to help you with more concrete examples if needed. 
As a demo:
1. Firefox with Bitwarden extension installed.
2. Visit the page: https://cdn.cliqz.com/browser-f/fun-demo/tracking-bw-users.html

This is a known issue with Firefox webextensions you can find the details here:
https://bugzilla.mozilla.org/show_bug.cgi?id=1372288

As far as I can see, this needs to fixed at the extension level and not at Firefox level.

Please note, as of now I have only tested the resource loaded from this prompt. But this would be a problem anywhere the resource being loaded which is using the same pattern.

## Timeline

- **Report Filed**
- **2018-04-13** @kspearrin: Hi, thanks for the report! Is there a suggested fix for this? I am not sure how we could provide this feature without loading a local resource onto the page. It's a shame that resource URLs are not static like Chromium browsers. I think Edge might also suffer from this same problem.
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: Here is where we inject the notification bar iframe into the page: https://github.com/bitwarden/browser/blob/master/src/content/notificationBar.js#L382 . We use the `chrome.extension.getURL` API.
- **2018-04-13** @kspearrin: Perhaps the solution is we need to move away from injecting an iFrame and generate the DOM directly on the page?
- **2018-04-13** @kmodi: Would be worth checking, also try and use `url(data:image/png;base64--------` technique to load resources.
- **2018-04-13** @kspearrin: This is loading an HTML page though, not a simple binary image.
- **2018-04-13** @kspearrin: This comment in the referenced Bugzilla thread seems to provide a viable solution for our use case: https://bugzilla.mozilla.org/show_bug.cgi?id=1372288#c25
- **2018-04-13** @kspearrin: I added this simple fix: https://github.com/bitwarden/browser/commit/46dabd5d8ab015554c7854f62e5f914004b8276f

Trying it on your test page seems to demonstrate that the resource URL is no longer being leaked through iframe src.

Can you confirm?
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: What version of node are you using? `node --version`
- **2018-04-13** @kspearrin: Try pulling latest. I fixed the syntax error mentioned in the webpack file. Not sure why it compiled fine on my machine. Maybe I am using a more forgiving version of node.
- **Report Needs More Info**
- **Report New**
- **2018-04-13** @kspearrin: I am not sure. This is during build? I am running node 9.7.1
- **2018-04-13** @kmodi: Ok, so got it working. Upgraded the node version.

So, I can confirm it fixes the issue. However, Bitwarden will be still vulnerable to some attacks:
1. Users can still be tracked if they are using Bitwarden (document.getElementById('bit-notification-bar-iframe'))
2. It might be possible to emulate button click. (Need to be verified).

As a suggestion, for a long term fix you might want to explore Shadow Dom.(https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), (https://glazkov.com/2011/01/14/what-the-heck-is-shadow-dom/)
- **Report Severity Updated**
- **Report Resolved**
- **2018-04-13** @kmodi: Thanks! Love the lighting fixes.
- **2018-04-23** @kmodi: If the fixed has been released and pushed on stores, is it safe to make this bug public?
- **Agreed On Going Public**
- **Report Became Public**
