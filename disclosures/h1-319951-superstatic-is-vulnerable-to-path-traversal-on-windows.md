---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - os/windows
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2018-04-29
submitted: 2018-02-26T17:53:06.527Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/319951"
title: "`superstatic` is vulnerable to path traversal on Windows"
---
# `superstatic` is vulnerable to path traversal on Windows

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-29

- Report: [https://hackerone.com/reports/319951](https://hackerone.com/reports/319951)
- CWE: Path Traversal
- Submitted: 2018-02-26T17:53:06.527Z

## Timeline

- **Report Filed**
- **2018-02-27** @chalker: This is owned by Firebase which turned out to be owned by Google.
https://hackerone.com/firebase seems outdated, the links are broken there.

Reported to Google, do not disclose.
- **2018-02-27** @lirantal: Ok, keep us posted!
- **Report Triaged**
- **2018-03-14** @lirantal: @chalker any updates on this one?
- **2018-03-14** @chalker: They kinda fixed it a while ago.

I don't like the fix and suggested implementing it differently, though I was not able to come up with a specific attack and not sure if there are actual issues left.

The upstream report is still open.
- **2018-03-14** @chalker: «A while ago» = 14 days ago, shortly after I contacted them.
They also didn't publish a release yet, though.
See https://github.com/firebase/superstatic
- **2018-04-24** @lirantal: @chalker due to no activity from the maintainer, how do you feel about disclosing this report?
- **2018-04-24** @chalker: There was some initial activity, and I am still avaiting their response on another platform. Let's wait a bit more — I will notify here if anything changes.
- **2018-04-25** @lirantal: @chalker thanks, waiting on your input
- **2018-04-27** @chalker: They landed a commit that kinda fixed the issue (though I don't link the fix) 57 days ago — that commit also publically disclosed the issue, see https://github.com/firebase/superstatic/pull/254

But there was no new release with this fix yet.
Last response from them was 38 days ago, and I pinged them a month ago and got no response…

I pinged them again today, asking if it is ok to treat this issue as public by now.

Note that this issue affects not only `superstatic` on Windows, but also `superstatic` on other platforms with certain buggy Node.js versions (the only example that I am aware of is 9.9.0).
- **2018-04-28** @lirantal: Ok so we're still waiting on input from you about disclosing.
- **2018-04-29** @chalker: This is the reply I received:

> If it's fixed in the public repo feel free to publish it.
>
> Regards,
> Martin, Google Security Team

I suppose we can disclose this report, with affected versions `<=5.0.1`.

Any version after (but not including) v5.0.1 should be fixed, as it's fixed in git.
- **2018-04-29** @lirantal: Alright, will disclose then.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
- **2018-04-30** @chalker: Upstream report was at https://issuetracker.google.com/issues/73907457, linking just in case.
