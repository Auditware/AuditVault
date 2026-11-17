---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2019-01-26
submitted: 2019-01-01T17:17:27.369Z
bounty_usd: null
votes: 15
cve: "CVE-2019-5484"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/473811"
title: "[bower] Arbitrary File Write through improper validation of symlinks while package extraction"
---
# [bower] Arbitrary File Write through improper validation of symlinks while package extraction

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2019-01-26

- Report: [https://hackerone.com/reports/473811](https://hackerone.com/reports/473811)
- CWE: Path Traversal | CVE: CVE-2019-5484
- Submitted: 2019-01-01T17:17:27.369Z

## Timeline

- **Report Filed**
- **2019-01-01** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2019-01-20** @lirantal: Hi @skyn3t,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.
I will invite the package maintainer to this issue.
- **External User Joined**
- **2019-01-23** @sheerun: Thank you for informing us, better late than never.

Not sure if you know but we fixed last week similar Zip Slip security bug but with .zip files.. Scary stuff...

I've published bower@1.8.8 that fixed this issue (please confirm)

What are your recommended next steps?
- **2019-01-23** @sheerun: Link to release: https://github.com/bower/bower/releases/tag/v1.8.8
- **2019-01-24** @skyn3t: Hi @sheerun ,
I was able to verify the fix. Great work!
- **2019-01-24** @lirantal: Thank you Adam for the quick response and @skyn3t for this great find.
I'll resolve the issue with a full disclosure and publish it within a couple of weeks to allow users to upgrade to version 1.8.8

Is this ok with you both?
- **2019-01-24** @sheerun: @lirantal I've published 1.8.8 release on github that says it loud. Should I remove it?
- **2019-01-24** @lirantal: Not the end of the world but with popular packages which may affect many people we may want to take some precautions and not disclose this too early to not put users in a tough spot.

If it's not much of a problem I'd go ahead and remove it and only mention it a couple of weeks later.
- **2019-01-24** @skyn3t: Sounds good to me 👍
- **2019-01-24** @sheerun: Okay, I've changed description of release to "Fix bug related to extracting packages" but I cannot change commit name that names it is a vulnerability.

@lirantal When disclosing this issue could you also mention that versions before v1.8.7 suffer from Zip Slip?
- **2019-01-24** @lirantal: All this report will be public so we'll capture that as well as part of this conversation.
How was the zip slip vulnerability disclosed to you?
- **2019-01-24** @sheerun: ████
- **2019-01-24** @lirantal: Would you be interested in PRing the disclosure details to our public security advisories at https://github.com/nodejs/security-wg ?

You can see previous PRs as example on how to format it. Should be as easy as filling in a form.
- **2019-01-24** @sheerun: You mean to send PR that adds file in this directory? https://github.com/nodejs/security-wg/tree/master/vuln/npm
- **2019-01-24** @lirantal: Exactly. Just PR a new report disclosure file there and I'll help you get it merged.
- **2019-01-24** @sheerun: I've re-read e-mail from discloser and he prefers to remain anonymous, please don't disclose his identity outside of this thread
- **2019-01-25** @lirantal: Are you referring to @skyn3t?
How would we be disclosing his identity by disclosing this report? it's a handle on HackerOne and I believe we have disclosed reports from him before.
- **2019-01-25** @skyn3t: >████

@lirantal He's referring to this comment. I think you'll have to redact it out before disclosing this report.
- **2019-01-25** @lirantal: Ok. Checking what can we do about it.
@sheerun perhaps you can see if you have the ability to delete that comment yourself?
- **2019-01-25** @skyn3t: Nope can't
- **2019-01-25** @lirantal: Ok, checking with H1 support.
- **Report Resolved**
- **Agreed On Going Public**
- **Changed Scope**
- **Agreed On Going Public**
- **Report Became Public**
- **2019-01-30** @sheerun: Now that people are tweeting about this, I'm going to announce it officially
- **2019-01-30** @lirantal: Yes that's ok as we have the report public already.
- **2019-01-30** @skyn3t: A heads up from official twitter account to upgrade bower would be nice.
- **2019-01-30** @lirantal: We were just discussing it actually, that's planned to go out later tonight/tomorrow.
- **Report Severity Updated**
- **2019-01-31** @lirantal: @skyn3t I updated the CVSSv3 score for this report. Can you confirm it looks ok with this vulnerability?
- **2019-01-31** @skyn3t: Looks good however why not 8.2 as in #362118?
😅😅
- **2019-01-31** @lirantal: TBH PR:N and UI:N seems odd for this case. Obviously some user&privilege is required to invoke bower. TBH I think maybe the update to make to the current score of 8.0 is to set C:N and A:N since confidentiality and availability are not being impacted by bower itself, even though it can lead to it. WDYT?
- **2019-02-01** @skyn3t: Thanks for the explanation. That makes it clear.
- **2019-08-27** @reed: Is there a CVE assigned to this vulnerability?
- **2019-08-29** @skyn3t: > Is there a CVE assigned to this vulnerability?

Hey @lirantal, do you have any idea?
- **2019-09-10** @lirantal: Sorry for the delay. I submitted a CVE request now, will probably be received within a week or two.
- **2019-09-13** @lirantal: CVE Assigned: CVE-2019-5484
