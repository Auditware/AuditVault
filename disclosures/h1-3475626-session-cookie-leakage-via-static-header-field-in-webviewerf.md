---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/misconfiguration
  - env/web
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
date: 2026-03-17
submitted: 2025-12-22T19:32:37.156Z
bounty_usd: null
votes: 131
cve: []
program: "[[programs/linkedin|LinkedIn]]"
reporter: "dphoeniixx"
source: "https://hackerone.com/reports/3475626"
title: "Session Cookie Leakage via Static Header Field in WebViewerFragment"
---
# Session Cookie Leakage via Static Header Field in WebViewerFragment

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 131 | **Program:** LinkedIn | **Disclosed:** 2026-03-17

- Report: [https://hackerone.com/reports/3475626](https://hackerone.com/reports/3475626)
- CWE: Misconfiguration
- Submitted: 2025-12-22T19:32:37.156Z

## Report summary

write-up: https://dphoeniixx.medium.com/normal-usage-of-linkedin-leaks-your-secrets-74aa968850fd

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2025-12-30** @rpitke: Hey @dphoeniixx 
Great bug, to brainstorm the remediation - adding stricter schema validation will break the chain right? so if we apply only https in verification url, it should suffice?
- **2025-12-30** @dphoeniixx: Hey @rpitke,

Appreciate it! Yes, enforcing `https://` on the verification URL would break this specific chain, but it won't fix the root cause. I'd recommend addressing the full picture for a more robust fix.

The core bug is the static `ArrayMap` at `WebViewerFragment.CUSTOM_HEADERS`, it's never cleared, so cookies from one site leak to the next loaded URL. Mitigations:
1. Clear `WebViewerFragment.CUSTOM_HEADERS` before each use.
2. Use a local variable instead of a static field if possible.

The gadgets that completed the chain are worth fixing too, as they could enable future attacks:
1. `neptuneTrustVerification`: no scheme validation, allowing `javascript:` URLs. Asserting the URL starts with `https://` or `http://` (I recommend doing it with `String.startsWith()`) would fix this.
2. `WebViewerUtils.isLinkedInUrl` / `isLinkedInArticleUrl`: the regex patterns are missing the `^` anchor, so they match anywhere in the URL. I recall other regexes in that class have the same issue, anchoring them properly would close off multiple potential chains.
- **Report Triaged**
- **Bounty Awarded**
- **2026-01-05** @dphoeniixx: Thanks a lot for the bounty!

I wanted to share some additional impact that I think deserves a bonus similar to report #1234798.

The root cause (static `CUSTOM_HEADERS` never being cleared) also enables a passive attack that happens during normal app usage - no malicious link needed.

**The scenario:**

LinkedIn ads open in the vulnerable `WebViewerFragment`. So if a user clicks on any ad, that site's cookies get stored in `CUSTOM_HEADERS`. When they click another ad later, those cookies leak to the new site automatically.

In the attached video, I had previously clicked a LinkedIn Business ad (which loaded LinkedIn cookies into the WebView). Then I clicked a different ad - and my LinkedIn cookies were sent to that completely unrelated domain.

This makes the bug more severe because:
- It happens through normal ad clicks, not phishing links
- Users have no reason to be suspicious
- Advertisers can passively collect cookies from other sites

{F5188985}

Cheers, and hopefully the bonus comes through :D
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **2026-03-13** @dphoeniixx: Hello @elaw-lnkd,

Could you please review the additional attack vector I described in my previous comment? I demonstrated that the attack can be launched without direct interaction from the victim, which makes it a higher-impact vector. Could this attack path also be considered in the assessment? I believe taking it into account could affect the bounty or bonus.
- **2026-03-13** @elaw-lnkd: Hi @dphoeniixx 
Thanks for the follow up. We use CVSS as part of the calculation.  It doesn't really materially affect the bounty payout since it still requires user interaction.
- **2026-03-14** @dphoeniixx: Hi @elaw-lnkd,

Thanks for the quick response, I appreciate it.

I understand CVSS is your standard for evaluating impact, but I think it doesn't fully reflect the real difference between the two vectors here, even though both require user interaction.

In the original vector, the victim has to click a crafted malicious link. That's a traceable action. The exploit deep-link is distinctive, and if LinkedIn investigated a compromised account, the logs would likely point to it as a clear indicator of something suspicious.

The passive vector is a completely different story. The victim is just scrolling their feed and clicking on an ad, which is completely normal behavior. If that ad loads in WebViewerFragment, LinkedIn cookies get stored in the static CUSTOM_HEADERS. Later, when the user clicks a different ad from the attacker, those cookies get silently sent over with no suspicious link, no unusual redirect, nothing.

This is the key point: in the passive scenario, there is nothing to investigate after the fact. No abnormal deep-link, no phishing URL, just two normal ad clicks. Even if a victim reported their account as compromised and LinkedIn decided to dig into it, there would be no sufficient logs to determine what actually happened.

Both vectors require user interaction, but the nature of that interaction is very different. One requires clicking a suspicious link which is something that can be detected and avoided. The other abuses routine, expected behavior with no forensic trail at all. I believe that distinction goes beyond what CVSS alone captures and is worth factoring into the assessment.

Thanks again for considering this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-03-17** @elaw-lnkd: Hi @dphoeniixx thanks for the explanation.  While I can see where you are coming from, I would like to also share that Advertisers goes through verification such as government-issued ID and Business Verification before ads are placed. So that acts as a mitigation factor as well. As such, we feel that the current bounty is appropriate. Once again we do appreciate your report and looking forward to receiving more reports form you in the future!
- **2026-03-17** @dphoeniixx: Even with Business Verification, a malicious advertiser looks no different from a legitimate one here.  they're just publishing an ad, nothing to flag. Anyway, I get it. Thanks for the quick fix and disclosure, looking forward to the next one!
