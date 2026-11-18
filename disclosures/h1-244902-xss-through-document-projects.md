---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-03-30
submitted: 2017-06-30T23:10:37.540Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "ethanluismcdonough"
source: "https://hackerone.com/reports/244902"
title: "XSS through document projects"
---
# XSS through document projects

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Khan Academy | **Disclosed:** 2018-03-30

- Report: [https://hackerone.com/reports/244902](https://hackerone.com/reports/244902)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2017-06-30T23:10:37.540Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello, I'm Ethan Luis McDonough ([@elmt2](https://www.khanacademy.org/profile/elmt2/) on Khan Academy), and I found a way to inject scripts into document projects.  Since KA document projects output HTML, I can edit the PUT request that updates projects (https://www.khanacademy.org/api/internal/scratchpads/ID) and inject JavaScript code inside an `<img>` tag's `onload` attribute.  Here's a demo that completely redirects a learner from KA to another site: https://www.khanacademy.org/physics/woah/4740384569491456.  

**Note**: the stored script does not run in Firefox because document projects don't seem to be working on that browser (at least on my machine).

## Timeline

- **Report Filed**
- **2017-07-01** @ethanluismcdonough: I would like to note that this script is not executed within a sandboxed iframe, rather on the actual site.
- **2017-07-01** @ethanluismcdonough: I've done some further testing and have been able to manipulate the DOM of the web page.  Since I have access to `document.cookie`, I've been also able to make authenticated API calls on the user's behalf (I would like to thank [@MatthiasSaihttam](https://www.khanacademy.org/profile/MatthiasSaihttam/) for indirectly explaining to me how `fkey` works).  

 Here's a demo I made on an alt (to keep the program hidden): https://www.khanacademy.org/physics/test-for-hackerone/6231641170968576.  This demo doesn't do anything harmful, it just makes a T&T on the program that says "This tip and thanks was posted without my permission" if you're logged in.  You can see the JS it injects [here](https://rawgit.com/EthanLuisMcDonough/8d8809cf75d7f3bf144cdf2087d8ab25/raw/5f5999851d8c78ca91ab67530c747eebfa257e45/post.js) and the code behind the program [here](http://www.khanacademy.org/api/labs/scratchpads/6231641170968576).
- **2017-07-01** @ethanluismcdonough: **NOTE**: I deleted the redirection demo (the very first example I posted) and moved it to my alt: https://www.khanacademy.org/physics/elmt2s-redirect-xss-test/6613395044106240.  I have faith that this information will be much safer in my alt account than in my main account.
- **2017-07-01** @ethanluismcdonough: *than it will be in my main account
- **2017-07-01** @ethanluismcdonough: *would
- **2017-07-01** @ethanluismcdonough: I am also able to access information about the user through `KAdefine.require("./javascript/shared-package/ka.js")`.  Here's a demo I made on my alt: https://www.khanacademy.org/physics/email-xss-test-for-reporting-to-the-ka-team/6079712205799424.  Combined with the automatic API calls, this could be very dangerous.
- **2017-07-06** @ragini123: Hi Ethan, thanks for your report on our site's prospective vulnerability. My name is Ragini and I went through your ticket.
I was although unable to look at the demo https://www.khanacademy.org/physics/elmt2s-redirect-xss-test/6613395044106240 as it redirects to the MDN website automatically. Can you share that again?
- **2017-07-06** @ethanluismcdonough: Hi Ragini, thanks for responding.  The document project at https://www.khanacademy.org/physics/elmt2s-redirect-xss-test/6613395044106240 is redirecting you to MDN because that's what I told it to do.  The JS that I injected into this project was `window.location.href='https://developer.mozilla.org/en-US/';`.  You can what's happening behind the scenes here: http://www.khanacademy.org/api/labs/scratchpads/6613395044106240.  This example doesn't work with cookies or make authenticated API calls like my other demos do, but it does showcase some functionality that could be harmful.
- **2017-07-06** @ragini123: This sounds very helpful. Thanks for pointing this out to us.
I will triage this and create an internal ticket to solve this bug. Will we update you as it goes along.
- **Report Triaged**
- **2017-07-06** @ethanluismcdonough: Thanks!
- **2017-09-05** @ethanluismcdonough: Any progress?
- **2017-09-05** @ragini123: The team is still discussing this and working on finding a solution for this based on it's security vulnerabilities. Will update you when something comes up. Thanks.
- **2018-01-06** @ethanluismcdonough: Any updates?
- **2018-01-08** @ragini123: Hi Ethan, the team had talked about it. I have asked for the current status of this report and will get back to you when I hear from the team.
- **2018-02-06** @ethanluismcdonough: Have you heard back yet?
- **2018-02-06** @idreyn: Hi Ethan! My name is Ian and I'm a developer at Khan Academy. We were able to identify and disable the XSS exploit you described and it should now be impossible to inject Javascript — or indeed any unexpected markup — into the body of a document scratchpad. We'd appreciate it if you can confirm that this is no longer possible for you so we can close the ticket. Thanks once more for identifying this serious vulnerability!
- **2018-02-07** @ethanluismcdonough: I ran a few tests, and I think the issue is fixed.  Thanks.
- **Report Resolved**
- **2018-02-08** @ethanluismcdonough: Thanks, but I was already awarded that badge.
- **2018-02-28** @ethanluismcdonough: Can we disclose this?
- **Agreed On Going Public**
- **Report Became Public**
