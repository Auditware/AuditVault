---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/missing-required-cryptographic-step
  - env/web
  - stack/node
substate: "informative"
weakness: "Missing Required Cryptographic Step"
enriched: true
date: 2025-12-19
submitted: 2025-12-13T16:49:43.115Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "sideni"
source: "https://hackerone.com/reports/3463949"
title: "Missing AES-GCM Authentication Tag Validation and Improper Deprecation Handling"
---
# Missing AES-GCM Authentication Tag Validation and Improper Deprecation Handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Node.js | **Disclosed:** 2025-12-19

- Report: [https://hackerone.com/reports/3463949](https://hackerone.com/reports/3463949)
- CWE: Missing Required Cryptographic Step
- Submitted: 2025-12-13T16:49:43.115Z

## Timeline

- **Report Filed**
- **2025-12-14** @tniessen: Thank you for the report @sideni. While I agree that the current behavior is undesirable and that the documentation can be improved, this unfortunately is a known issue and has been publicly discussed at length. See, for example, [nodejs/node#17523](https://github.com/nodejs/node/issues/17523) and, more recently, [nodejs/node#52327](https://github.com/nodejs/node/issues/52327). Misuse of the API was only recently deprecated and will be moved to end-of-life soon.

The current behavior is due to the `node:crypto` module closely mirroring OpenSSL in many regards, including  this one. And, while we have been aware of this issue for a while, we were unable to change the behavior without going through deprecation cycles because some applications rely on the current behavior (i.e., the user application validates the authentication tag length).

Given that this behavior has been publicly documented for at least eight years, I do not see the need to treat this known issue as a vulnerability. I would be happy to propose the move to end-of-life status with the next major release of Node.js. Please let me know in case you disagree, or in case I missed some detail that goes beyond the public discussions of this issue.
- **2025-12-15** @sideni: I had seen the older issue and didn't want to reopen the conversation there, that's why I submitted here (but, I hadn't seen the more recent issue, thanks for sharing @tniessen). As I've been researching about that OpenSSL behavior in many languages (presented this year at NorthSec and I'm close to publishing a blog post on the topic), I thought it would be better to try and get things fixed first.

While I agree this has been publicly discussed in GitHub issues, I doubt it's publicly known to developers. Let's face it, lots of people don't read documentation (which wouldn't help here as it's mistaken) and even less people dig into GitHub issues :/
This issue being known to Node.js maintainers, I don't mind if we don't treat this as a vulnerability.

My concern is with people using the feature as documented without knowing they are at risk.
With how the feature is being deprecated, only those that rely on the current behavior know it's close to stop working.
The others don't even know that they are vulnerable.

Even if this is not handled as a vulnerability, I'd be happy to see a documentation update (with a warning or something) OR if the deprecation warning could be given to anyone not specifying the `authTagLength` option on `createDecipheriv` (instead of only those explicitly truncating or being actively exploited).
I know this is not optimal, but it feels weird to keep folks vulnerable because of a few using a broken behavior :/

I also want to say thanks for being opened to discussing this :)
- **2025-12-15** @tniessen: Thank you for your thoughtful response @sideni. I am going to do the following, unless there are objections (cc @panva_):

1. Close this report as informative. You can then request public disclosure of the report for the sake of transparency and visibility.
2. Create a documentation pull request to warn more visibly about the current behavior. This will be visible in the next regular release of Node.js.
3. Create a pull request moving the current deprecation to end-of-life status. This will take effect in the next major release of Node.js.

Please let us know if this plan sounds reasonable. You would, of course, be welcome to chime in through related public discussions on GitHub as well.
- **2025-12-15** @sideni: That plan sounds good, thanks to you @tniessen!
- **Report Informative**
- **2025-12-16** @tniessen: Documentation PR: https://github.com/nodejs/node/pull/61082
End-of-Life PR: https://github.com/nodejs/node/pull/61084
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
