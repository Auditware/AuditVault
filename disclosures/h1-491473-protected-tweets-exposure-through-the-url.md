---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2019-04-19
submitted: 2019-02-05T17:53:21.968Z
bounty_usd: 560
votes: 67
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "terjanq"
source: "https://hackerone.com/reports/491473"
title: "Protected tweets exposure through the URL"
---
# Protected tweets exposure through the URL

> **Severity:** High | **Bounty:** 560 USD | **Votes:** 67 | **Program:** X / xAI | **Disclosed:** 2019-04-19

- Report: [https://hackerone.com/reports/491473](https://hackerone.com/reports/491473)
- CWE: Information Disclosure
- Submitted: 2019-02-05T17:53:21.968Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2019-02-08** @terjanq: Also, the attacker can just obtain the twitter screen name of a visitor by providing the third-party application which requires the visitor to authorize with twitter but without asking for permission to access victim's protected tweets (only screen name is the requirement).
- **2019-02-08** @terjanq: If your misunderstanding of the attack came from that you had to manually input the text in the PoC that the attacker could search for, here comes the attack scenario.

The state about whether there are search results or not serves as an oracle. The attacker can ask the oracle whether a specific chain of words/numbers exist in tweets or not. Given this information, the attacker can find most of the words used in the tweets by using a huge list of most commonly used words, for example, TOP10k list from Google https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa.txt. It can be done effectively with the technique I used for fetching all 3-digit numbers by using the binary-search algorithm. Then by combining them in the right order, also using binary-search, the attacker can obtain full phrases. 

Another method is to use advanced heuristics to predict the words in sentences. As for an example, one method was described in this paper https://pdfs.semanticscholar.org/f9c3/3dd288f60dc87fc59ff94e3eeeac5a249dfd.pdf.
- **2019-02-08** @bugtriage-alex: Thank you for your response @terjanq.

We're evaluating the behavior in your report, and we'll keep you updated when we have additional information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **2019-03-23** @terjanq: I confirm it's fixed. 

Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
