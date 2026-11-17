---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-06-29
submitted: 2025-02-06T00:42:42.663Z
bounty_usd: null
votes: 81
cve: []
program: "[[programs/cosmos|Cosmos]]"
reporter: "unknown_feature"
source: "https://hackerone.com/reports/2976481"
title: "Unauthorized coins transfer from locking account(s)"
---
# Unauthorized coins transfer from locking account(s)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 81 | **Program:** Cosmos | **Disclosed:** 2025-06-29

- Report: [https://hackerone.com/reports/2976481](https://hackerone.com/reports/2976481)
- CWE: Improper Access Control - Generic
- Submitted: 2025-02-06T00:42:42.663Z

## Timeline

- **Draft Started**
- **Report Filed**
- **Report Vulnerability Information Updated**
- **Report Title Updated**
- **2025-02-06** @unknown_feature: Pushed supplementary files here https://github.com/h1uf/cosmos_rust_client . Except `main.rs` and `msg.rs`. The rest of the files are just client and signing.  Also main.rs and msg.rs are here https://gist.github.com/unknownfeature/d0b8cfcf263904d9be4707dded38c706. 

Also wanted to say I originally wanted to run the POC via commands but couldn't because of [this](https://github.com/cosmos/cosmos-sdk/blob/7e391959b9aebf055294b24b7f392346709dae64/x/accounts/cli/cli.go#L72). In periodic locking account we need to send funds to be able to lock them. But cli doesn't allow. Not sure maybe that's by design. Maybe no.
- **Report Triaged**
- **2025-02-06** @unknown_feature: Thank you very much for this update, @amulet_mizmo !
- **Report Severity Updated**
- **2025-02-07** @amulet_mizmo: Hey @unknown_feature 

I have an update for you - The team has shipped a patch here: https://github.com/cosmos/cosmos-sdk/pull/23621
Given the release direction of 52, the team's calculation of this issue resulted in a High severity.

I'll need to keep this issue open for potentially two more weeks while we sort funding on our side for the program before I can issue you a bounty for your report, so thank you again for your patience.

Best,
Mo
- **2025-02-07** @unknown_feature: Hi @amulet_mizmo ! Thank you very much for the update! No worries about the bounty! I'll wait:)
- **2025-02-07** @unknown_feature: @amulet_mizmo I apologize. Please, don't take it as an attempt to argue. It's just the reasoning behind the severity is not fully clear to me. And I can't stop thinking about it. While trying to guess possible reasons.  Is there way you could give more insights on what does "Given the release direction of 52" mean? 
It's a direct loss of funds. If there was an account like that it would take one transaction. The exploit is very simple. Dev team applied fix on the next day after I reported. So it seems like there was a degree of urgency(or it was a coincidence). I was thinking before that maybe you would only consider something to be critical if that's a loss of funds. I remember that infinite mint bug in ibc-go that you had in Spring. That exploit was very complex. But also it was utilizing functionality that wasn't in scope(ibc-apps hooks, while in the scope it says only packet forwarding is covered) . Yet it was critical. I totally get it  that I'm definitely not aware of the argumentation behind.  And I'm sure there are some other circumstances that influenced the decision. I'm not super aware of your business logic .Maybe you want to get rid of those accounts. Maybe they are not used etc. And this would totally influence the severity. Plus I suspect that you have a higher bar for criticals after increasing high payouts. Which makes a lot of sense.  And regardless of the response I won't be arguing or anything. I'm already endlessly grateful to you and I know you are very honest and reasonable people.  It's just I need to understand the reasoning in order to stop thinking about it. And to adjust my expectations. 

Thank you very much in advance for the response!
- **2025-02-07** @amulet_mizmo: Hey @unknown_feature 

The team rated this as a catastrophic impact and rare likelihood since the entire 52 release was cancelled, and subsequently this code as well. I’m unfortunately downstream of their final say however I understand their perspective. Had the 52 release and entire featureset not been canceled I suspect the impact would have been much higher. 

The teams are going through a handoff period as well so a new set of developers are working on the code in the next few months. 


We were planning on paying this out at the minimum critical tier however, so I can mark it as so in the program. 

Best,
Mo
- **Report Severity Updated**
- **2025-02-07** @unknown_feature: @amulet_mizmo I definitely can see things from that perspective. And absolutely agree it would be much more impactful if it was already on prod. I did not realize that bugs in master branch would be considered lower probability if they are not in the release yet. Or will not go into a release during the next few months.  That’s a valuable information. Thank you very much for telling me! I really appreciate you updating the severity. Tho you really didn’t have to. And I wouldn’t get offended if you didn’t! And I feel bad if you did it because I asked. I really just wanted to understand the reasoning behind. I’m not aware of what’s happening behind the scene. And sometimes I can figure out what might be the cause. And sometimes I can’t. And I couldn't in this particular case. That's why I asked. Thank you very much for explaining it to me!
- **2025-02-09** @unknown_feature: @amulet_mizmo hello. I looked around a bit more. And it's not just an unauthorized transfer. It's a full accounts takeover. I also saw that this code is present in 2 release candidates of 52(https://github.com/cosmos/cosmos-sdk/blob/v0.52.0-rc.2/x/accounts/defaults/lockup/lockup.go#L131 and https://github.com/cosmos/cosmos-sdk/blob/v0.52.0-rc.1/x/accounts/defaults/lockup/lockup.go#L131). And those tags are used by other projects. I did a high level search on github and found quite a few that use those tags.  The fix https://github.com/cosmos/cosmos-sdk/pull/23621 is presented as rather a refactoring. Not a critical security issue fix. And there is no new tag so people who already use  vulnerable dependency would be able to patch their apps. And even after you release a new rc  there will be no urgency for them to update because it's not presented as a vulnerability. I saw a project still uses rc1 for the last two months. Obviously upgrades are not prioritized unless there is an issue in old version. And there is an issue. They just don't know about it.
- **2025-02-09** @amulet_mizmo: Hey @unknown_feature 

I’ll share your feedback with the core team here. They’re ultimately the deciders on how this gets released and communicated. 

Best
Mo
- **Bounty Awarded**
- **Report Resolved**
- **2025-02-25** @unknown_feature: Hi @amulet_mizmo ! Just saw it. Thank you very much for the bounty! I greatly appreciate it. Waiting wasn't that long.  No issues at all. Thank you  so much once again!
- **Agreed On Going Public**
- **Report Became Public**
