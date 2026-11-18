---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "duplicate"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2024-03-26
submitted: 2024-03-06T17:33:02.738Z
bounty_usd: null
votes: 61
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "0v3rw4tch"
source: "https://hackerone.com/reports/2404415"
title: "View any user email using the Team's audit log section"
---
# View any user email using the Team's audit log section

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 61 | **Program:** HackerOne | **Disclosed:** 2024-03-26

- Report: [https://hackerone.com/reports/2404415](https://hackerone.com/reports/2404415)
- CWE: Information Disclosure
- Submitted: 2024-03-06T17:33:02.738Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
Hello team, I decided to do some further testing, and I came across another endpoint that can be used to reveal user emails. 

### Steps To Reproduce

1. Create a demo in your account https://hackerone.com/teams/new/sandbox
2. Create a token with the report manager role on https://hackerone.com/organizations/demo/settings/api_tokens
3. Copy the user ID of any user that has an account on HackerOne
4. A program bounty to that user using the API. `recipient_id` is the id of any user and `{id}` is the id of your sandbox program.
```
let inputBody = "{\n  \"data\": {\n    \"type\": \"bounty\",\n    \"attributes\": {\n      \"recipient_id\": \"2869549\",\n          \"amount\": 51,\n      \"reference\": \"newbounty1\",\n      \"title\": \"BOUNTY\",\n      \"currency\": \"USD\",\n      \"severity_rating\": \"high\"\n    }\n  }\n}";
let user = 'identifier';
let password = 'token';
let headers = new Headers();
headers.set('Authorization', 'Basic ' + btoa(user + ":" + password));
  headers.set('Content-Type', 'application/json');  headers.set('Accept', 'application/json');

fetch('https://api.hackerone.com/v1/programs/{id}/bounties',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});
```
5. You will get a success message
6. After awarding the bounty to the user, head over to the audit log section of your sandbox team.
7. Notice a message is shown `"@api" awarded a $51.00 bounty to "email@email.com"`

POC
████

## Impact

View emails of other users

## Timeline

- **Draft Started**
- **Report Filed**
- **2024-03-11** @0v3rw4tch: Hello @chriszo111,
Was a fix pushed out for this?
- **Report Triaged**
- **2024-03-11** @0v3rw4tch: Sure thing @daniele_h1 
Good day.
- **Report Needs More Info**
- **Report New**
- **2024-03-12** @0v3rw4tch: I spent so much time trying to get a bypass to that report and There is no way you can close a valid report as a duplicate of a resolved report. No way

Regards
- **2024-03-12** @0v3rw4tch: @daniele_h1 
I believe you are the same person that triaged the report and wrote this `Hey @0verw4tch, I hope you are doing well!
Thank you for your report. I reached out to the responsible Engineering team and they will work on a fix. Please give us some time to remediate the issue.
Have a nice day and happy hacking!`


How does it turn to be an invalid submission now? I don't understand.
- **2024-03-13** @daniele_h1: Hi @0verw4tch,

Regarding your report #2404415, we want to clarify the situation and explain our decision. When a critical vulnerability is identified, multiple teams are involved in the remediation process. This was a mistake on our part, and we wanted to trigger rapid response mechanisms to get the relevant teams to look at the reported security concern as fast as possible.

After carefully evaluating the situation, we found that the issue you reported in #2404415 was already in the queue to be addressed as part of your previous report #2382120. In such cases, our standard practice is to develop and provide a quick fix first, followed by a more comprehensive fix addressing the root cause.

Specifically, for your first report (#2382120), the initial resolution (the quick fix) was to show the personal email address only if the invitation recipient is the current user making the request.  

Subsequently, we engaged the team responsible for that area, and they provided a more thorough fix by returning the @wearehackerone.com email address instead of the private email address, addressing the issue more broadly. Internally, the issue to mitigate the root cause was escalated on May 6th, 6:41 pm CET. This report (#2404415) was submitted at May 6th, 6:33 pm CET, however the responsible teams did not see the report before fixing the issue at the root level.

You can also notice that both reports leverage the same API endpoint (https://api.hackerone.com/v1/programs/{id}/bounties).
We also want to inform you that our API endpoints are wrappers around our core infrastructure, and our fix propagates to other APIs as well.
  
In light of these circumstances, we kindly ask you to trust HackerOne's decision regarding this matter. We value your contributions and aim to maintain transparency in our remediation processes.

Please let us know if you have any further questions or concerns.

Best regards,
The HackerOne Security Team
- **2024-03-13** @0v3rw4tch: Hello @daniele_h1 
I still have concerns because I believe this was valid at the time of reporting. From this `This was a mistake on our part,` seems like you accept an insufficient patch was released hence the reason I found this other edpoint.


I have a question: Is it fair to close a valid report as a duplicate to a resolved report?

it appears you are only invalidating this report since I'm the same person who reported the first report. This was a valid report at time of submission and should be treated as such whether the team pushed a fix later or not 

If this endpoint was to be found by another reporter, their report would not have been closed as a duplicate of a resolved report.

The first report had already been resolved which makes any report made after that a valid report.


1. From your comment,
`Internally, the issue to mitigate the root cause was escalated on May 6th, 6:41 pm CET. This report (#2404415) was submitted at May 6th, 6:33 pm CET, `

It appears that this report was submitted even before the team raised the issue to mitigate the root cause. In simple terms, what I understand from that is this report was valid at the time of submission, right?

2. You triaged the report and said that you reached out to the team and they were working on a fix, which also adds to my point that this report was still valid at the time of triage.

3. Notice the timestamp for this. It was still fully exploitable on march 8th
██████████

4. I have no idea why the team is deciding not to count this as a valid report, but there is nothing I can do if the decision has been made already.
- **2024-03-19** @0v3rw4tch: Hello @daniele_h1 
A ping from the @HackerOne program documentation on expected platform standards.

https://docs.hackerone.com/en/articles/8369826-detailed-platform-standards

{F3130248}
- **2024-03-20** @cevans_0glc8: Hello @0verw4tch, Chris Evans here, HackerOne's CISO and Chief Hacking Officer. Sorry for the delay. I'm looking into the internal timeline here and will be providing full transparency on whether this is a Duplicate or not.
- **2024-03-20** @0v3rw4tch: Good morning @cevans_0glc8 
Thanks you for the update.
- **2024-03-22** @cevans_0glc8: # CISO / Chief Hacking Officer response on report #2404415

By Chris Evans, HackerOne CISO and Chief Hacking Officer

Receiving a “Duplicate” status for a report can be disappointing, especially when the duplicate is against internal tooling or processes. In such cases, trust must be built with transparency. This write-up attempts to “lead by example”, and be an exemplar of how to handle internal duplicates.

Any reader who is interested in the summary and decisions may skip to the “Findings and fixes” section below.

This timeline is an abbreviation of a lengthy internal HackerOne incident process. Although receiving a Bug Bounty report is not strictly a security event, HackerOne sometimes runs a full incident response process in response to a Bug Bounty report, for various reasons including:
- Ensure the incident response process is tested and exercised
- Ensure certain incident response steps occur, such as a blameless retrospective to see what can be learned from a bug
- Track tasks to prove that we haven’t seen evidence that the bug was abused
- Track serious bugs in order to report upwards to the CISO, CEO and board

The use of the “Duplicate” status for https://hackerone.com/reports/2404415 is, of course, assessed against HackerOne’s published platform and industry standards, specifically:
- From “Industry Best Practices”: https://docs.hackerone.com/en/articles/8369777-industry-best-practices
  - “Pay for Value”: “Reward for anything that causes you to take any form of action, or accelerate an action to remediate a vulnerability.”
  - “Be Transparent”: “If something a hacker reports is an accepted risk or a duplicate, take some time to provide detailed and verbose insight into the specifics of why, especially if a fix has been implemented internally. If a duplicate report is submitted, best practice is to link the submission to the aforementioned duplicate report. If it is a known vulnerability not within the HackerOne application, screenshots of internal tickets with timestamps are encouraged. Transparency builds trust and loyalty with the hackers on your program.”
  - “Own Your Mistakes”
- From “Detailed Platform Standards”: https://docs.hackerone.com/en/articles/8369826-detailed-platform-standards
  - “Multiple Reports Highlighting Systemic Issues”: “This value is determined by factors like how the application is coded, whether a single change can resolve the issue”
  - “Bypass of a Resolved Report”: “If a hacker finds a bypass of a vulnerability report that was fixed by the customer and set in the “Resolved” state, that should be considered as a new vulnerability report, distinct from the one that is in the “Resolved” state.”

**Timeline**
- March 6, 2024, 12:04 UTC: original report https://hackerone.com/reports/2382120 escalated to internal HackerOne development teams
- March 6, 2024, 12:57 UTC: engineer CS creates internal GitLab ticket ID 72921
  - Title “[H1 BBP][CVSS Score 9.3] Reveal any user email”
  - Excerpt for report affiliation: “Link:		https://hackerone.com/reports/2382120”
- March 6, 2024, 13:35 UTC: decision made to start with a hot fix, followed by a thorough fix; log line added to internal incident document: “Deactivating for private and public program as hot fix”
- March 6, 2024, 14:05 UTC: Merge Request 24006 ready
  - Title “Hide bounty recipient emails from sandboxed programs”
  - Description “Quick fix for the vulnerability: Hide bounty recipient emails from sandboxed programs”
- March 6, 2024, 15:21 UTC: change 24006 committed
- March 6, 2024, 15:59 UTC: original report tagged as ready for retesting
  - Hacker is told, “Our engineering team has implemented a fix to address this exposure of sensitive information. Could you please retest and confirm if you are still able to reproduce the issue?”
  - The communication here could have been better; see lessons learned below
- March 6, 2024, 17:00 UTC: handover call from Europe on-duty (engineer CS) to US on-duty (engineer HH); discussion covers the nature of the longer term fix and which team should own it
- March 6, 2024, 17:33 UTC: second report filed, same hacker, similar issue: https://hackerone.com/reports/2404415
  - This report takes a few days to go through the triage / escalation process
  - Skip down to March 8 below to see when the report is first noted by HackerOne, specifically engineer HH
  - Skip down to March 11 below to follow the start of the investigation in to the report by engineer RG
- March 6, 2024, 17:41 UTC: engineer CS files internal GitLab ticket ID 72934 as follow-on from the on-duty handover call
  - Title “Restrict customers from seeing `Invitations::ClaimBounty` email of user”
  - Excerpt for report affiliation: “Related report: https://hackerone.com/reports/2382120#activity-26371568”
  - Excerpt “We addressed the immediate concern and prevented sandboxed programs from accessing the data. However this won't prevent non-sandboxed programs from accessing the email of users they have created a bounty for through the Customer API.”
- March 7, 2024, 11:09 UTC: Merge Request 24022, by engineer JF, ready
  - Title “Stm/72934/fix email leaking through claim bounty invitations”
  - Excerpt “This problem was caused by a recent change in the code that allows awarding bounties with a user ID (next to the email). The underlying code would then send out email-based invitations, leaking the user's email even if the invitation was sent based on an ID.”
- March 8, 2024, 16:53 UTC: second hacker report noticed
  - Engineer MH notes in the incident Slack channel: “We got a new report from the same reporter and it looks the same-ish bug: https://hackerone.com/reports/2404415”
  - See Article B below which is the log entry in the incident document and demonstrates the realization that one fix fixes both reports, as well as one change being responsible for introducing both manifestations.
- March 10, 2024, 17:21 UTC: internal GitLab ticket ID 73001 created
  - Title “[H1 BBP][CVSS Score 9.3] View any user email using the Team's audit log section”
  - Excerpt for report affiliation: “Link:		https://hackerone.com/reports/2404415”
- March 11, 2024 12:07 UTC, investigation of GitLab ticket ID 73001
  - Engineer RG states, “Already fixed by hackerone/engineering_and_product/core!24022”
  - Engineer RG states, “Specifically this line that changes the email address also used by the auditlog higher up in the same interactor.”
  - See Article A below, which demonstrates that the change to fix both reports is a single code change at a generic layer
- March 12, 2024, 18:13 UTC: internal GitLab ticket ID 73063 filed by engineer SW
  - Title “Investigate and update historical audit logs and invitations that are leaking hacker emails”
  - Engineers SK, SW, JF and SE collaborate to complete the cleanup in about 1 day

**Findings and fixes**
- Finding: report 2404415 is indeed a duplicate of 2382120, as assessed by the Detailed Platform Standards. A change to a single line of code resolves both observed security issues.
  - Note, for posterity, that this would have been assessed as two separate issues if this simple code change had been repeated twice, even in the same file / function.
- Fix: the communication to the hacker in report 2382120 was incomplete / incorrect. Internal lessons have been learned. Either:
  - The retest should not have been requested until both the hot fix and longer term fix were pushed; or
  - The hacker should have been told that a more correct fix was pending, so they could make a more informed decision on whether to wait before performing additional testing and retesting.
- Fix: we must “Own Your Mistakes”
  - To compensate the hacker for their wasted time filing the second report, we will treat this as a Spot Check for $500.
  - Note, “Multiple Reports Highlighting Systemic Issues” takes precedence over “Bypass of a Resolved Report” in this case. This is because the first report was marked resolved in error. The report was not fully resolved because there were pending Merge Requests internally that were not live in production. “Bypass of a Resolved Report” is for cases where all fixes have been landed, but they are insufficient. In this case, sufficient fixes were in flight but were not all landed in production. The retesting was initiated too soon. However, “Own Your Mistakes” still comes into play.
- Fix: report 2404415, although a duplicate, does provide additional value. Specifically, the database cleanup task would likely not have considered the Audit Log aspect, had it not been for the hacker’s second report. Therefore, strictly adhering to “Reward for anything that causes you to take any form of action”, this is a $500 bonus.

Overall, a $1000 bonus to the hacker on the Duplicate report, and internal lessons learned for how to treat retesting for a report fixed over multiple MRs.

Article A
{F3138826}

Article B
​​{F3138830}
- **2024-03-22** @cevans_0glc8: @0verw4tch See above, which is a markdown version of an internal Google Doc I spent some time on. One intent here is to show what a world-class response looks like in terms of demonstrating, technically, that a bug is a duplicate. As you can see, I've even quoted a 1-liner code change that resolved both manifestations. It is not common to disclose Duplicate reports, but in this case, I propose to do so in order to provide an exemplar of transparency when building trust that a report really is a Duplicate.
- **2024-03-22** @cevans_0glc8: @0verw4tch In addition, let me note that when I started writing this report, I was expecting it to be a simple case of proving this report is a duplicate. But in the process, I found one HackerOne operational error and one instance where some value was provided by this report (for an internal database cleanup task). Accordingly, tagging with a reward as per the investigation above.
- **Report Duplicate**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2024-03-26** @cevans_0glc8: @0verw4tch Is the report now redacted to your satisfaction?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
