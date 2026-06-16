---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/nft
  - sector/stable
  - sector/staking
  - precondition/insider
title: "Tapioca DAO - Rekt"
protocol: "[[Tapioca DAO]]"
date: 2024-10-18
loss_usd: 4400000
auditors:
source: "https://rekt.news/tapioca-dao-rekt"
excerpt: "Another day, another private key theft, another protocol rekt. Tapioca DAO on Arbitrum suffers a roughly $4.4 million loss in a private key compromise. Some funds have been recovered, though the full "
genome:
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Tapioca DAO - Rekt

> **Loss:** $4,400,000 | **Date:** 2024-10-18 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/tapioca-dao-rekt-header.png)


_Another day, another private key theft, another protocol rekt._

  
**Tapioca DAO on Arbitrum suffers a roughly $4.4 million loss in a private key compromise.**  
  
Some funds have been recovered, though the full extent of the damage remains to be seen, though the full extent of the damage remains to be seen.  
  
Seems like Tapioca's recipe for success didn't include robust key management.  
  
**The attacker, playing the role of a master chef, cooked up a scheme that left Tapioca's defenses as mushy as overcooked noodles.**  
  
While the protocol scrambles to reassure users, whispers of a notorious hacker group are already circulating through the cryptosphere.  
  
Did Tapioca have a North Korean dev in their pocket, or just a bad case of compromised keys?  
  
**These hackers are hitting us from all angles - yesterday's [Radiant Capital](https://rekt.news/radiant-capital-rekt2/) got served a steaming hot plate of [RAT malware](https://x.com/danielvf/status/1847023591117795708), and now Tapioca's security is looking more half-baked than a botched soufflé.**  
  

_In this DeFi kitchen nightmare, are we watching the evolution of financial warfare, or just the same old recipe of greed and incompetence, now with a side of state-sponsored hacking?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Daniel VF](https://x.com/danielvf/status/1847023591117795708), [0xTeun](https://x.com/0xTeun/status/1847235350915145888), [ZachXBT](https://x.com/zachxbt/status/1847249205720408138), [Tapioca DAO](https://x.com/tapioca_dao/status/1847330264139145361), [Hacken](https://x.com/hackenclub/status/1847285999757332640), [Bleeping Computer](https://www.bleepingcomputer.com/news/microsoft/vscode-marketplace-can-be-abused-to-host-malicious-extensions/), [The Block ](https://www.theblock.co/post/321351/cosmos-liquid-staking-north-korea)_

**As the crypto world slumbered, [0xTeun sounded the alarm](https://x.com/0xTeun/status/1847235350915145888): Tapioca was under attack.**

  

Seems our enterprising hacker managed to [exploit the Emergency Rescue function](https://x.com/0xTeun/status/1847235350915145888) on one of the Vesting contracts deployed by the Tapioca Deployer.  
  
Another day, another vulnerability laid bare.  
  
The attacker wasted no time, exploiting the vulnerability to withdraw roughly 30 million TAP tokens.

  

_With the finesse of a seasoned trader, they swapped this haul for 591 ETH, sending [TAP's value into a 97% nosedive](https://www.coingecko.com/en/coins/tapioca-dao-token)._

  

**But why stop there? Our hacker friend wasn't done cooking.**

  

They multi-called several other addresses including the $USDO stablecoin contract and minted themselves a jaw-dropping five quintillion $USDO.

  

Because why settle for millions when you can have quintillions?

  

Following the crypto equivalent of a high-speed chase, our blockchain sleuths tracked the stolen funds as they were bridged to the BNB Chain.  
  
As of press time, the suspicious address sits pretty with approximately $4.4 million in stablecoins like BSC-USD and USDC. Not a bad day's work for our digital desperado.  
  
**[Tapioca DAO finally broke their silence](https://x.com/tapioca_dao/status/1847330264139145361) - a mere 6 hours after the attack.**  
  
_Their official response? A classic case of "it's not a bug, it's a feature."_  
  
According to Tapioca, this wasn't just any old hack - oh no, this was a "social engineering attack."  
  
Apparently, the attacker managed to compromise the TAP token vesting contract's ownership, allowing them to claim and [sell a whopping 30M vested TAP](https://x.com/tapioca_dao/status/1847330264139145361).  
  
But wait, there's more! The USDO stablecoin contract's ownership was also compromised, with the attacker adding a minter to infinite mint USDO and drain the USDO/USDC LP pair.  
  

**[Tapioca's damage report](https://x.com/tapioca_dao/status/1847330264139145361)? A cool 591 ETH and 2.8M USDC stolen. At least they're consistent with the blockchain detectives on this one.**  
  
_The attack centered on Tapioca's vesting contract, a piece of code that was supposed to keep tokens locked up tight._  
  
**TAP Vesting Contract:**
[0x2997C5ddD3070A46E9938261ce0A16a237121cb0](https://arbiscan.io/address/0x2997c5ddd3070a46e9938261ce0a16a237121cb0#code)

  

**Exploiter:**
[0x70285a11489bed93686410EBC727057CAfb8129D](https://arbiscan.io/address/0x70285a11489bed93686410ebc727057cafb8129d)

**Attack Transaction 1:** [0x8cf8def40fa2beab66f46863478bea71ad8f4512003caf2fa639cc5a00550753](https://arbiscan.io/tx/0x8cf8def40fa2beab66f46863478bea71ad8f4512003caf2fa639cc5a00550753)  
  
**Attack Transaction 2:** [0x1abb8cf0b0af2ce19a30ce5103d51269d4600d9aeba045260feb588db89d76a4](https://arbiscan.io/tx/0x1abb8cf0b0af2ce19a30ce5103d51269d4600d9aeba045260feb588db89d76a4)

**Attack Transaction 3:**  
[0x174c3deaf563be1bb6d873ba279421e8588acc888ef672bafd5efe7441aae74f ](https://arbiscan.io/tx/0x174c3deaf563be1bb6d873ba279421e8588acc888ef672bafd5efe7441aae74f)

_But our hacker wasn't satisfied with just one course. For dessert, they set their sights on Tapioca's stablecoin, turning USDO into their personal money printer._

  

**USDO Stablecoin Contract:**  
[0xEB99062643cA5Ab880c077288345E0B14B297432  ](https://arbiscan.io/token/0xeb99062643ca5ab880c077288345e0b14b297432)

**USDO Infinite Mint Exploit:**  
[0x0bca43cfb5b14ea039f2b329cb6074383d54ed8240963014ccb6400befa5a4e3](https://arbiscan.io/tx/0x0bca43cfb5b14ea039f2b329cb6074383d54ed8240963014ccb6400befa5a4e3)

**Stolen funds were bridged from Arbitrum to BSC:**
[0x69d91e56ca80f2a4d7b808b59053ea5c5505ffe2  ](https://bscscan.com/address/0x69d91e56ca80f2a4d7b808b59053ea5c5505ffe2)

_But wait, there's more! Our favorite on-chain sleuth, ZachXBT, has stirred the pot with [some spicy observations](https://x.com/zachxbt/status/1847249205720408138)._  
  
**According to Zach, this Tapioca tempest might be connected to a string of recent hacks targeting projects like Nexera, Concentric, Masa, SpaceCatch, and others.**  
  

The common ingredient in this hacker's cookbook?  
  
Malware, possibly served up through fake job listings.  
  
It seems in the world of DeFi, "We're always hiring!" could be code for "We're always hacking!"  
  

_And here's where it gets really interesting - Zach hints at a potential connection to everyone's favorite boogeyman of the crypto world: North Korean state-sponsored hackers._  
  
**But just when you thought this story couldn't get any wilder, Tapioca serves up a plot twist that would make M. Night Shyamalan jealous.**  
  
In a stunning turn of events, they've managed to pull a reverse uno card on the hacker.  
  
[Tapioca announced in their Discord](https://discord.com/channels/922809589991370792/992018197488341073/1296907727473213541): "We have hacked the hacker! Recovered 1000 ETH which is now safely in the DAO multisig. The 1000 ETH was DAO collateral within Big Bang Origins to mint USDO for USDO/USDC LP."  
  
With this recovery, Tapioca's treasury now stands at $4.2M. 

_The team promises more details in the upcoming post-mortem, crediting Seal911 and EnigmaDarkLabs for their assistance in this counter-operation._  
  

**As Tapioca continues to work on resolving the situation, this [story is far from over](https://x.com/twmattt/status/1847373654390349853) and should make for another interesting post mortem.**  
  
And because no crypto disaster is complete without a side of phishing, scammers quickly moved in, [impersonating Tapioca DAO and dropping malicious links](https://x.com/hackenclub/status/1847285999757332640) like breadcrumbs.  
  
Hacken's warning to users? Don't take the bait.  
  
**Well, somebody took the bait. But was it a Tapioca team member who swallowed the phishing hook, line, and sinker?**  
  
_Did our hacker chef serve up a specially crafted "job opportunity" that was too tasty to resist?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_After Tapioca's $4.4 million stumble, we're left with a familiar taste of incompetence garnished with a side of North Korean intrigue._  
  
**It's another entry in the "How Not to DeFi" handbook, where your protocol is just one compromised key away from being the next cautionary tweet thread.**

  

The security game has leveled up, evolving from smart contract bug hunts to a twisted version of "Who's the Mole?"

  

While we've gotten better at auditing our code, we've forgotten to run a virus scan on our devs.

  

_Rogue actors aren't just in our programs anymore; they're writing them._

  

**They're in our [VS Code extensions](https://www.bleepingcomputer.com/news/microsoft/vscode-marketplace-can-be-abused-to-host-malicious-extensions/), our [job applicant pools](https://www.theblock.co/post/321351/cosmos-liquid-staking-north-korea), and probably in that weird Discord server you joined last week.**

  

At this rate, every Web3 project will have their very own pet North Korean hacker by 2025.

  

Forget "bring your dog to work day" - it's now "bring your state-sponsored cyber-criminal to work day."

  

**In this crypto clown fiesta, where your next colleague could be coding for Kim Jong-un on the weekends.**

  
_Is this the cyberpunk future we were promised, or just a really elaborate phishing scam that we're all falling for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
