---
tags:
  - blockchain/ethereum
  - blockchain/optimism
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
title: "Hypr Network - REKT"
protocol: "[[Hypr Network]]"
date: 2023-12-13
loss_usd: 220000
auditors:
source: "https://rekt.news/hypr-network-rekt"
excerpt: "What is this, a bridge hack for ants? Yesterday, Hypr Network lost $220k to a bridge exploit. Forking code can be risky, especially when devs aren't up to date with issues in the source."
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[initializer-auth]]"
---
# Hypr Network - REKT

> **Loss:** $220,000 | **Date:** 2023-12-13 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hypr-header.png)

_What is this, a bridge hack for ants?_

**Yesterday, gaming-focused L2 Hypr Network lost 2.57M HYPR (approx $220k) to a bridge exploit just two days after [launch](https://www.hypr.network/articles/hypr-mainnet-beta-launch).**

The incident was [quickly identified](https://twitter.com/ManaMoonNFT/status/1734787141266223455) by a user, and the team [warned users](https://twitter.com/hypr_network/status/1734787659527229581) that something was amiss, but without initially admitting to an exploit:

>📢 ATTENTION: Do not use the Hypr Network Bridge. The team wants to perform some more tests and do some further audits on the bridge.

The team’s follow-up [statement](https://twitter.com/hypr_network/status/1734970973647163770) reassured users that HYPR holders in general were not affected, with losses coming from just two addresses (_the only users to have bridged funds up to that point_).

_However, the token did experience a [drop of almost 40%](https://www.coingecko.com/en/coins/hypr-network) when the proceeds were dumped for 97 ETH, worth approx $220k at the time of writing, the price has since recovered with the market rebound._

While we’ve seen [plenty](https://rekt.news/heco-htx-rekt/) of [bridges](https://rekt.news/multichain-rekt2/) lose [funds](https://rekt.news/poly-network-rekt2/) to compromised keys over recent months, this is the first example of exploited code leading to a bridge hack since last autumn’s [BNB bombshell](https://rekt.news/bnb-bridge-rekt/) (_unless you count the [Shibarium bridge](https://rekt.news/shibarium-bridge-rekt/)’s temporary self-rekt in August_).

**Forking code can be risky, especially when devs aren't up to date with issues in the original source.**

_Should developers of a codebase designed to be forked take more responsibility for communications?_

_Or were Hypr simply not paying enough attention?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1735197818883588574), [Hypr Network](https://www.hypr.network/articles/incident-postmortem-bridge-exploit)_

The Hypr Network is built via OP Stack which allows developers to deploy fully functional L2s, forking Optimism as a template.

In the Hypr team’s post-mortem [thread](https://twitter.com/hypr_network/status/1735169665234772195), they explain that:

>Hypr used the most recent version of the develop branch of the OP monorepo at the time of deployment. Unbeknownst to us, this was not a production-ready branch and at the time contained a critical vulnerability which had yet to be patched.

**The full post-mortem report can be found [here](https://www.hypr.network/articles/incident-postmortem-bridge-exploit).**

BlockSec [summarised](https://twitter.com/BlockSecTeam/status/1735197818883588574) the vulnerability as follows:

>The root cause was that the attacker managed to circumvent the 'finalizeERC20Withdrawal' function check by reinitializing the contract, due to the existence of the 'clearLegacySlot' modifier.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hypr-code.png)

Exploiter address 1: **[0x5b8d598b354f5760b2a65f492154e7a3df46d1be](https://etherscan.io/address/0x5b8d598b354f5760b2a65f492154e7a3df46d1be)**

Exploiter address 2: **[0x3ea6ba6d3415e4dfd380516c799aafa94e420519](https://etherscan.io/address/0x3ea6ba6d3415e4dfd380516c799aafa94e420519)**

Attack tx: [0x51ce3d9c…](https://etherscan.io/tx/0x51ce3d9cfc85c1f6a532b908bb2debb16c7569eb8b76effe614016aac6635f65)

_The exploiter was [funded](https://etherscan.io/tx/0x21748d14991113c8fbe0b044fd8378db7a87cb24fb0a0a4096c750f3c36c8d1c) from hacker-favourite FixedFloat and, at the time of writing, the stolen ETH remains in the [0x5b8d](https://etherscan.io/address/0x5b8d598b354f5760b2a65f492154e7a3df46d1be) address._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Composability, interoperability and building upon open-source code are elements which allow for many of DeFi’s greatest innovations.**

_But they also mean that a bug in [one place](https://rekt.news/curve-vyper-rekt/) can affect [multiple protocols](https://rekt.news/agave-hundred-rekt/) across the sector._

Communication between teams and staying up-to-date with security conversations across the ecosystem is key for anyone relying on forked code. As BlockSec [points out](https://twitter.com/BlockSecTeam/status/1735197818883588574):

>Note that the vulnerability was [patched](https://github.com/ethereum-optimism/optimism/commit/f4a234c29b90f2a86e61fc897db343bda651202c) by the OP team after the contract had been deployed.
>
>This incident underscores the importance of the community working collaboratively to refine the process for releasing security patches, which will undoubtedly benefit us all.

Hypr’s post-mortem report [states](https://www.hypr.network/articles/incident-postmortem-bridge-exploit) that, following consultation, with the OP Labs team:

>[OP Labs] agreed that improvements on their release and communications process

And, after [reassuring](https://twitter.com/optimismFND/status/1735276698894041121) users that other OP infrastructure was unaffected, the Optimism Foundation added:

>We encourage developers building projects in production to use releases approved by Optimism governance, which meet the security bar established by the Collective. We're also improving our release comms processes to help ensure it's clearer to projects leveraging the OP Stack.

**As ever, being the first to bridge to a new ecosystem can often lead to lucrative first mover advantages.**

After a prolonged period of apathy, FOMO is driving a growing desire to try new things as markets begin to heat back up once again.

_Are the potential rewards worth the risk?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
