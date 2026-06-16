---
tags:
  - sector/lending
  - sector/perpetuals
  - sector/stable
title: "Furucombo - REKT"
protocol: "[[Furucombo]]"
date: 2021-02-27
loss_usd: 14000000
auditors:
source: "https://rekt.news/furucombo-rekt"
excerpt: "Better to wait than to swing and miss. rekt gets in the ring with Limzero and Kurt Barry to investigate the $14m furucombo knockout. 'Infinite approval' is never safe."
genome:
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Furucombo - REKT

> **Loss:** $14,000,000 | **Date:** 2021-02-27 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-header.png)

**Better to wait than to swing and miss.** 

We heard about [Furucombo](https://twitter.com/furucombo/status/1365743632460910593?s=20) but our hands were tied - small teams can’t always ship on time, especially when the hackers work weekends. If you’re a DeFi detective with skills to share, then reach out and tell us about your experience - we might have a spot for you here at rekt.news.

A hacker hit back with a counter attack, broke Furucombo and knocked out $14 million from various wallets who had given the app “infinite approval”.

Infinite approval means unlimited trust - something which we know we shouldn’t do in DeFi.

**“Don’t trust, verify”, but who has time or the cash for gas to approve set amounts each time they transact?** 

People who used Furucombo had to give some amount of approval, but it seems too many gave too much, and they received a harsh lesson in return. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-linebreak.png)

In what is known as an “evil contract” exploit, the [attacker](https://etherscan.io/address/0xb624E2b10b84a41687caeC94BDd484E48d76B212) made the Furucombo [proxy contract](https://etherscan.io/address/0x17e8Ca1b4798B97602895f63206afCd1Fc90Ca5f) think that Aave V2 had a new [implementation](https://etherscan.io/address/0x86765dde9304bea32f65330d266155c4fa0c4f04).

The new implementation was, of course, malicious, and had the ability to transfer all approved tokens to addresses controlled by the attacker, as users had approved the Furucombo contracts to use their tokens on their behalf.

**[Kurt Barry](https://twitter.com/Kurt_M_Barry/status/1365876788757471234?s=20) provided an analysis:**

One of the [fund stealing transactions](https://etherscan.io/tx/0x5af11a27e98a167b61b01fea093cf612d5ec76c20fd2032f2d1aa49c8b1ee529) was sent to the Furucombo proxy, specifying the AAVE v2 Lending Pool _proxy_ as the "handler" for the first and only action.

You can see the execution trace below, as shown on [ethtx.info](https://ethtx.info/). Notice the nested delegatecalls.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-tx1.png)

Handlers must be approved in a registry; at the time of the transaction (but not at present), this proxy was a valid handler.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-tx2.png)

The FC proxy delegatecalls the AAVE v2 proxy, which then reads out the implementation address from a special storage slot, but as this is a delegatecall, it reads from the storage of the FC proxy, and the extracted address is the hacker's exploit contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-tx3.png)

If we look at the hacker's [previous transaction](https://etherscan.io/tx/0x6a14869266a1dcf3f51b102f44b7af7d0a56f1766e5b1908ac80a6a23dbaf449#statechange…):

We see that the hacker used their malicious contract to make the FC proxy delegatecall to the AAVE v2 proxy, invoking the initialize function, setting the implementation slot.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-tx4.png)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-tx5.png)

Once the delegatecall executed the hacker's code in the FC proxy's context, it was all over. The victim had approved the FC proxy to move their stETH, and the exploit code sent it all to the hacker. 

Rinse and repeat for the rest.

Summary:
- FC proxy made caller-specified delegatecalls to trusted handlers, letting its storage be modified
- a handler made caller-specified delegatecalls to an address read from storage
- the handler exposed a function for setting that address

What have we learnt:
- a "trust list" is useful but not a guarantee
- developers should audit how a delegatecallee's functions can affect the caller's storage
- consider restricting functions or parameters of callees
- be wary of user-supplied inputs

**It wasn’t just individuals who lost out, even Cream Finance suffered a loss, as the attacker “borrowed” directly from their treasury.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-cream.png)

[Igor Igamberdiev](https://twitter.com/FrankResearcher/status/1365744024611655690?s=20) gave a list of the assets which were stolen.

- 3,9k stETH
- 2.4M USDC
- 649k USDT
- 257k DAI
- 26 aWBTC
- 270 aWETH
- 296 aETH
- 2.3k aAAVE
- 4 WBTC
- 90k CRV
- 43k LINK
- 7.3k cETH
- 17.2M cUSDC
- 69 cWBTC
- 142.2M BAO
- 38.6k PERP
- 30.4k COMBO
- 75k PAID
- 225k UNIDX
- 342 GRO
- 19k NDX

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-ropebreak.png)

**We spoke to DeFi enthusiast Limzero [(@pleyuh)](https://twitter.com/pleyuh/status/1365998455638876161?s=20) after we found out he was one of the worst affected.**

**rekt:**

_How did the situation play out for you?_ 

_How did you realise Furucombo was being attacked and when did you take action?_

**Limzero:**

I was chilling with some friends in my home. I opened TG from mobile to see what's up and saw from [Darren's](https://twitter.com/Darrenlautf) ["The daily ape"](https://t.me/thedailyape) channel that there was a Furucombo related exploit.

I checked one of my addresses I had used furucombo from and noticed the transfer of my aAAVE and some aETH.

I got scared because I had some active loans and didn't want to have my deposits liquidated. I found out that my health factor had dropped to 1.15, so i repaid the loans fast.

What i noticed is that the attacker drained all my aAAVE but only 1/3 of my aETH. I suspect that the low HF blocked them from transferring more funds out. I might have been lucky having active loans.

After I repaid the loans to protect the deposits, I revoked all token permissions I had given from that address.

That was an action I was postponing for weeks (for when fees would be lower). Apparently it was a costly delay.

I noticed the transfer of my funds by the hacker 90m after the hack had taken place.

**rekt:**

_Was it a big loss for you?_ 

_How did it feel psychologically, do you feel more cautious or less confident about using DeFi after the attack?_

**Limzero:**

It was a big loss in absolute numbers but nothing my portfolio couldn't survive.

I got very scared for a couple of minutes as I was afraid that all my aTokens could have gotten liquidated, when I saw my health factor above 1.1 I felt relief.

I treat the whole experience as an expensive security lesson- having infinite allowances on from an address with large amounts was a very silly mistake by my side. All things considered, that was an [ape tax](https://rekt.eth.link/ape-tax/) I had to pay eventually. It's the first smart contract hack / exploit that affects me after so many years in the space. I feel lucky that more serious situations haven't touched me yet.

Actually the first exploit after the COVER exploit but I forgot about that :P

I do not feel less confident about using DeFi. These kinds of risks were known.

I have taken measures to increase my cyber security though.

**rekt:**

_What can you tell us about these measures?_

**Limzero:**

I'd rather not say sorry.

It's part of the measures  😋

**rekt:**

_What steps would you recommend our readers take to improve their security?_

**Limzero:**

1) use hardware wallets
2) avoid windows
3) web 3 dedicated machine for contract interactions
4) unique passwords or password managers + VPN
5) low social media profile
6) use multiple addresses to spread risk
7) fresh addresses for new farms
8) revoke approvals from frequently used addresses

I am not a security expert by any means. These are standard guidelines suggested by more knowledgeable people in crypto.

9) read REKT xD

**rekt:**
_Any final message for our readers?_

**Limzero:**

"Please don't hack me again"

Also, unless you feel very confident about your security, consider keeping a small fraction of your holdings on top tier CEXes like Kraken, Coinbase, Gemini, Binance in case your personal wallets get hacked.

That's all from me.

**rekt:**

_Thanks for talking to us._

**Limzero:**

Thank you! I hope we never talk again lol.

---

**A simple attack with a simple fix** - don’t use “infinite approve” unless you have unlimited trust. Individual approvals are no small expense, but don’t cut costs when it comes to security.

Sites such as [Debank](https://debank.com/) or [Etherscan](https://etherscan.io/tokenapprovalchecker) allow you to monitor and revoke your wallet approvals, and as Limzero stated, this is not a task that should be delayed until another day.

Never drop your guard, hackers are always looking for an opening, and these attacks occur much more regularly than you might expect.

**There’s no referee inside this ring; you are responsible for your own safety, but once you learn the ropes, the prize money is worth the risk.** 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/furu-conc.png)

**EDIT: 18th July 2021:**

**Haechi reached out to us with the following statement:**

>Although their contract(proxy) was in our scope of audit, the exploit that infected the proxy was not our scope of the audit.

>What furucombo team provided to us was only two contracts; furucombo proxy and compound adapter. So their scenario that furucombo team has provided is accessing the compound protocol using a compound adapter with proxy, that’s all.

>But, as you know, the exploit was caused by the scenario of using AAVE. We were not able to find this issue since they already had whitelist functionality which should have worked as a guard for this kind of situation.
