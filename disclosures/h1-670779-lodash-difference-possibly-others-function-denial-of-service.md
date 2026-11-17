---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "informative"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2019-12-04
submitted: 2019-08-09T23:22:49.175Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "spengietz"
source: "https://hackerone.com/reports/670779"
title: "Lodash 'difference' (possibly others) Function Denial of Service Through Unvalidated Input"
---
# Lodash "difference" (possibly others) Function Denial of Service Through Unvalidated Input

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-04

- Report: [https://hackerone.com/reports/670779](https://hackerone.com/reports/670779)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2019-08-09T23:22:49.175Z

## Timeline

- **2019-08-09** @spengietz: >To help us escalate this report as quickly as possible, please take a moment to confirm your report addresses:

**Reproducible:** I included example code to crash the Node.js process
**Impact:** I demonstrated and described the impact of slowing down the server and/or crashing it completely.
**In Scope:** Lodash is listed as in-scope

Thanks!
- **2019-08-09** @spengietz: I forgot to include that this likely affects more than just the "difference" function because the vulnerability lies within the "baseDifference" function, meaning that other Lodash methods that use that function might be vulnerable to this denial of service as well.
- **Report Filed**
- **2019-08-12** @ktistai: Hi @spengietz 

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Thanks, 
@ktistai
- **Report Triaged**
- **2019-08-26** @spengietz: Hi there, just wanted to check in and see if there were any updates here. Thanks!
- **2019-09-09** @spengietz: Hey, just wanted to check in here again. Thank you!
- **2019-10-03** @lirantal: Hi @spengietz,

Thanks a lot for reporting the vulnerability.
I invited John Dalton, maintainer of lodash, to review and help us resolve the issue here.
- **Report Severity Updated**
- **2019-10-03** @lirantal: @spengietz could you also see if I got the CVSS score right for this report in your opinion?
- **External User Joined**
- **2019-10-03** @spengietz: Perfect, thanks @lirantal and @jdalton! Let me know if you have any questions
- **2019-10-03** @spengietz: Whoops I misread your message.
I just tried calculating the CVSS and came out with an 8.6 (CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:C/C:N/I:N/A:H), but I don't work with CVSS rankings typically so I may be off on a switch or two there.
- **2019-10-04** @lirantal: The difference with both of our scores is the Scope. Why do you feel it is changed? 
For example, the vulnerable component is Node.js and the affected component is Node.js too.
- **2019-10-04** @spengietz: I was thinking that Lodash was the vulnerable component and that Node.js was the affected component, but maybe they are considered one of the same in this context
- **2019-10-04** @lirantal: if that was the case then vulnerable component would never be equal to impacted component. The vulnerability lies in the lodash library which puts the browser or the Node.js server as a vulnerable component as they are using it.
- **2019-10-04** @spengietz: Oh alright that makes sense, then I think your analysis is accurate
- **2019-10-04** @lirantal: Great, thanks for confirming.

@jdalton let us know if you need any help with resolving the issue.
@spengietz any chance you can help out John with figuring out other places that this occurs in the codebase?
- **2019-10-04** @spengietz: Just did a quick search in the lodash.js file (https://github.com/lodash/lodash/blob/4.17.15/lodash.js) to see what functions are relying on "baseDifference". Not sure if it might be imported and used elsewhere in the code though.

The functions that use baseDifference within lodash.js are here:
- difference
- differenceBy
- differenceWith
- baseXor
- without

Not sure about the exploitability if each of them, but possibly next week or next weekend I could look into that.
- **2019-10-05** @jdalton: Several of our methods are "Collections" methods meaning they accept an array-like object (an object with a length counts too). Many builtin array methods can accept things like this too.
```js
Array.prototype.forEach.call({'length': 99999999999}, () =>{}) // hang
```

Many bultin array methods tend to be `this` generic so they don't care that an object is not a real array either. I'm open to ideas to tackle it though.
- **2019-10-07** @spengietz: Ah that's interesting, didn't realize that. This seems like a tough problem to tackle then and I haven't worked intimately with Node.js for a while now so I don't have many insights. I'll keep thinking on it though and see if I can do some research tonight into what a good direction to go would be.
- **2019-10-08** @lirantal: @jdalton I see your point about this being perhaps a generic enough issue that it could be thought of "this is how it works in the language", and surely enough we will not consider the Array forEach example you demonstrated as a vulnerability. However, a user may consider lodash's methods to not work in the same way, and they wouldn't have your depth of knowledge for this.

What I think will be best here is to have a security disclaimer in lodash's documentation/repository which will make users aware of this security concern. WDYT?
- **2019-10-08** @jdalton: Improved docs is always a win for me :)
- **2019-10-08** @lirantal: @jdalton yay 🤗❤️
@spengietz WDYT?
- **2019-10-08** @spengietz: I think that works.

Do you know why the Array.prototype version above just hangs forever when the Lodash function actually crashes the node process? Not sure if that differentiates them, but it seems like a payload against Array.prototype would only affect the user who sent it, but an actual crash of the process would affect every user
- **2019-10-13** @lirantal: @jdalton ping me when you make an update to the README then and I'll close this issue?

@spengietz I'm not entirely sure but I can assume that perhaps lodash just straight-up tries to allocate more data on the heap than it was allowed and so it crashed on OOM where-as the language Array construct does it different by perhaps trying to allocate when memory is available only and so it may hang but not crash. That's just a guess though, I haven't looked into the inner workings of either.
- **2019-10-14** @spengietz: Given that, it seems like the two scenarios aren't very comparable then.

If I exploited the Array.prototype example above in a web application, it would just take a long time to respond to my request and not affect any other users (as far as I understand at least).

If I exploited the Lodash version that I reported, the entire server would crash and would deny access to every user of the application indefinitely.

Seems like these aren't quite the same and maybe a documentation change is not quite enough. Perhaps I'm wrong on the impact, but it seems that in Lodash the impact is far greater than the built-in JS methods.
- **2019-10-16** @spengietz: I wish I had more in-depth knowledge of Node.js internals to help come up with a better fix/solution, but I'm not sure I can.

This may not be applicable, but in Python the len() function provides the length of something, instead of relying on a .length attribute, so I wonder if there is some way to check in JavaScript if you're reading the value of the key "length" or if you're actually reading the length of the object/array.
- **2019-10-16** @lirantal: @spengietz are we discussing the internal Node.js (or rather v8 actually) API and its security? if so that's a whole different context than this H1 program which is focused on npm ecosystem modules.

@jdalton could lodash run some checks internally like checking hasOwnProperty or would that not matter? I guess even if you add it then it will be a breaking change for library consumers.
- **2019-10-16** @spengietz: I was just making the comparison because the impact of the v8 API versus the Lodash vuln I reported makes me think that additional documentation may not be enough to mitigate the risk that it presents, I just don't know exactly what a sufficient fix would look like in Lodash
- **2019-10-26** @lirantal: I think that a documentation update is required regardless to ensure developers are aware of the security context. 

@spengietz I believe this vulnerability applies to consumers of lodash that may use this "insecure" compare function and may get tricked into passing arbitrary sizes via objects to the function call. I'm not yet entirely convinced this is a vulnerability per-the-docs in lodash as you could generally consider C's malloc(size) as vulnerable as well since you can pass a large enough size and crash an app. I do agree however that a security disclaimer needs to be added by @jdalton to ensure developers are aware of the potential security issue.
- **2019-10-28** @spengietz: Yeah that's a good point on malloc. It's not a vulnerability in the function, it's a vulnerability in incorrectly using the function.

Alright I'm on board with that then!
- **2019-12-04** @lirantal: @spengietz I will close the issue as informative and disclose so we can retain the action items from this and make it available for lodash maintainers and community to follow-up with a PR for this later.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
