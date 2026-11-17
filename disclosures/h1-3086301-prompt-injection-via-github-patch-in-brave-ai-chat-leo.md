---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/llm01-prompt-injection
  - env/web
substate: "informative"
weakness: "LLM01: Prompt Injection"
enriched: true
date: 2025-08-22
submitted: 2025-04-09T21:05:50.430Z
bounty_usd: null
votes: 77
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "stellersjay"
source: "https://hackerone.com/reports/3086301"
title: "Prompt Injection via GitHub Patch in Brave AI Chat (Leo)"
---
# Prompt Injection via GitHub Patch in Brave AI Chat (Leo)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 77 | **Program:** Brave Software | **Disclosed:** 2025-08-22

- Report: [https://hackerone.com/reports/3086301](https://hackerone.com/reports/3086301)
- CWE: LLM01: Prompt Injection
- Submitted: 2025-04-09T21:05:50.430Z

## Timeline

- **Report Filed**
- **2025-04-09** @diracdeltas: Prompt injection is out of scope for us but we'll take a look at the rest of this report.
- **2025-04-09** @stellersjay: Apologies I did not realize or see prompt injection was out of scope. Thanks for continuing to take a look. Let me know if I can provide anything further
- **Report Needs More Info**
- **Report New**
- **Report Informative**
- **2025-08-22** @stellersjay: Hey @artem_chaikin Just read your article on [prompt injection in Perplexity's Comet](https://brave.com/blog/comet-prompt-injection/). Since Perplexity considered it a risk shouldnt Brave consider re-evaluating the prompt injection I reported in this issue? The POC is the video 2025-04-09_13-52-25.mov which is someways similar to what was reported to Perplexity sans hitting "summarize this page"
- **2025-08-22** @artem_chaikin: Hi. As I noted in the comment here https://hackerone.com/reports/3086301#activity-33841488  the proof of concept you provided is not a vulnerability in Leo. The browser normalises the path when you open the URL with path traversal sequences and Leo summarizes the page you just opened, so it's working as intended. 
Regarding the prompt injection itself, since we don't have any agentic capabilities yet, any prompt injects on the webpage can't trigger browser tools, so we didn't consider it a vulnerability, also LLM saying `You're dumber than a sack of potatoes` is not a security risk :) . We will have features similar to Comet soon and are working on making it secure. Once it's there - we will be happy to see security reports about bypasses of our security guardrails
- **2025-08-22** @stellersjay: My followup was less about the path normalization issue since we both agreed that was an over sight and non issue. 

The follow up was more about the prompt injection, the POC was just polluting the models intent or persona and not the ability to use browser functionality. Which sure  triggering browser tooling would indeed be more impactful.

Since Brave considers this a non-issue, you wouldn't mind making this report public?
- **2025-08-22** @artem_chaikin: You can request the disclosure so we can approve
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
