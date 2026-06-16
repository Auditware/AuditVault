---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/polygon
  - sector/bridge
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/token
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Poly Network - REKT"
protocol: "[[Poly Network]]"
date: 2021-08-10
loss_usd: 611000000
auditors:
source: "https://rekt.news/polynetwork-rekt"
excerpt: "This is it rekt readers; the big one. $611M stolen from Poly Network, but has the hacker had a change of heart? They're returning the money bit by bit."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[bridge-merkle-proof]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Poly Network - REKT

> **Loss:** $611,000,000 | **Date:** 2021-08-10 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/poly-header.png)

**This is it rekt readers; the big one.** 

_$611 million dollars stolen._ 

That’s more than the [Mt Gox hack](https://www.bloomberg.com/news/articles/2014-02-28/mt-gox-exchange-files-for-bankruptcy). More than the GDP of several small countries. More than the entire rekt.news leaderboard added together.

**The biggest cryptocurrency hack... _ever_.**

>[Poly Network](https://twitter.com/PolyNetwork2/status/1425130017546149891) = rekt.

_But how?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/poly-investigates.png)

_Credit:_[breadcrumbs.app](https://www.breadcrumbs.app/reports/671), [slowmist](https://twitter.com/SlowMist_Team/status/1425197809058254849?s=20), [blocksec](https://blocksecteam.medium.com/the-initial-analysis-of-the-polynetwork-hack-270ac6072e2a)

**Attacker ETH:** [0xc8a65fadf0e0ddaf421f28feab69bf6e2e589963](https://etherscan.io/address/0xc8a65fadf0e0ddaf421f28feab69bf6e2e589963)

**Attacker BSC:** [0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71](https://bscscan.com/address/0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71) 

**This was not the usual smart contract flash loan / arbitrage affair.** 

**The hacker exploited the Proxy Lock Contracts of Poly Network on three different chains.**

**Ethereum:**[0x250e76987d838a75310c34bf422ea9f1ac4cc906](https://etherscan.io/address/0x250e76987d838a75310c34bf422ea9f1ac4cc906)  

**BSC:**[0x05f0fDD0E49A5225011fff92aD85cC68e1D1F08e](https://bscscan.com/address/0x05f0fDD0E49A5225011fff92aD85cC68e1D1F08e)  

**Polygon:**[0x28FF66a1B95d7CAcf8eDED2e658f768F44841212](https://polygonscan.com/address/0x28FF66a1B95d7CAcf8eDED2e658f768F44841212)  

>Credit: [@kelvinfichter](https://twitter.com/kelvinfichter)

**"Poly has a contract called the "**EthCrossChainManager**". It's a privileged contract that has the right to trigger messages from another chain. It's a standard thing for cross-chain projects.**

It has a function named **verifyHeaderAndExecuteTx** that anyone can call to execute a cross-chain transaction.

It (1) verifies that the block header is correct by checking signatures (seems the other chain was a poa sidechain or) and then (2) checks that the transaction was included within that block with a Merkle proof. [Here's the code.](https://github.com/polynetwork/eth-contracts/blob/d16252b2b857eecf8e558bd3e1f3bb14cff30e9b/contracts/core/cross_chain_manager/logic/EthCrossChainManager.sol#L127)

One of the last things the function does is call **executeCrossChainTx**, which makes the call to the target contract. This is where the critical flaw sits. [Poly checks](https://github.com/polynetwork/eth-contracts/blob/d16252b2b857eecf8e558bd3e1f3bb14cff30e9b/contracts/core/cross_chain_manager/logic/EthCrossChainManager.sol#L185) that the target is a contract, but they forgot to prevent users from calling a very important target... the [**EthCrossChainData** contract](https://github.com/polynetwork/eth-contracts/blob/master/contracts/core/cross_chain_manager/data/EthCrossChainData.sol)

By sending this cross-chain message, the user could trick the **EthCrossChainManager** into calling the **EthCrossChainData** contract, passing the **onlyOwner** check. Now the user just had to craft the right data to be able to trigger the function that changes the public keys…

The only remaining challenge was to figure out how to make the **EthCrossChainManager** call the right function. Now comes a little bit of complexity around how Solidity picks which function you're trying to call. 

The first four bytes of transaction input data is called the "signature hash" or "sighash" for short. It's a short piece of information that tells a Solidity contract what you're trying to do.

The sighash of a function is calculated by taking the first four bytes of the hash of "<function name>(<function input types>)". For example, the sighash of the ERC20 transfer function is the first four bytes of the hash of "transfer(address,uint256)".

Poly's contract was willing to call any contract. However, it would only call the contract function that corresponded to the following sighash:
  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/poly-sighash.png)

Errr but wait... **"_method"** here was user input. All the attacker had to do to call the right function was figure out *some* value for "**_method**" that, when combined with those other values and hashed, had the same leading four bytes as the sighash of our target function.

With just a little bit of grinding, you can easily find some input that produces the right sighash. You don't need to find a full hash collision, you're only checking the first four bytes. So is this theory correct?

Well... here's the actual sighash of the target function:
>http://ethers.utils.id ('putCurEpochConPubKeyBytes(bytes)').slice(0, 10)
'0x41973cd9'

And the sighash that the attacker crafted...
> http://ethers.utils.id ('f1121318093(bytes,bytes,uint64)').slice(0, 10)
'0x41973cd9'

**Fantastic. No private key compromise required! Just craft the right data and boom... the contract will just hack itself!**

One of the biggest design lessons that people need to take away from this is: if you have cross-chain relay contracts like this, **MAKE SURE THAT THEY CAN'T BE USED TO CALL SPECIAL CONTRACTS.** The **EthCrossDomainManager** shouldn't have owned the **EthCrossDomainData** contract.

Separate concerns. If your contract absolutely needs to have special privileges like this, make sure that users can't use cross-chain messages to call those special contracts."

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

>On the Ethereum blockchain, the hacker stole

**USDC** - 96,389,444
  
**WBTC** - 1,032
  
**DAI** - 673,227
  
**UNI** - 43,023
  
**SHIBA** - 259,737,345,149
  
**renBTC**- 14.47
  
**USDT** - 33,431,197
  
**wETH** - 26,109
  
**FEI USD** - 616,082

>On BSC, the hacker stole:

**BNB** - 6,613.44
  
**USDC** - 87,603,373 
  
**ETH** - 299
  
**BTCB** - 26,629
  
**BUSD** - 1,023

>On the Polygon blockchain, the hacker stole:

**USDC** - 85,089,610

>TOTAL VALUE LOST - ~$611,000,000

_At the time of writing, the stolen funds are located in the following wallets:_

**ETH:** [0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963](https://etherscan.io/address/0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963)
  
**BSC:** [0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71](https://bscscan.com/address/0x0D6e286A7cfD25E0c01fEe9756765D8033B32C71)
  
**Polygon:** [0x5dc3603C9D42Ff184153a8a9094a73d461663214](https://polygonscan.com/address/0x5dc3603C9D42Ff184153a8a9094a73d461663214)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**DeFi storylines are rarely straightforward, and this one is no exception.**

_Even anonymous actors adore attention._ 

Shortly after the exploit, an unexpected protagonist appeared, going by the name of [hanashiro.eth.](https://etherscan.io/address/0xf8b5c45c6388c9ee12546061786026aaeaa4b682) 

hanashiro.eth first gained attention when they [sent the hacker](https://etherscan.io/tx/0xae2442c5b5721df8c190fd8f59b53b6dc56a875fb03035ad34276a598ddf7d31) a tip about how to handle USDT, for which they [received 13.37 Ether](https://etherscan.io/tx/0xdf3afc47c7914e06ddb1be19afcd769e558111d353e55273a62c4a96e6a6090f) from the hacker as a reward.

**[Many others](https://twitter.com/JustDoingItBig/status/1425115724209655812?s=20) sent messages to the hacker afterwards, but none were quite as successful as hanashiro.eth.**

With a truly crypto native level of philanthropic showmanship, hanashiro.eth went on to donate their stolen money to a few of the foundational organisations which support our industry, such as Infura, Etherscan, and [rekt.news](https://www.rekt.news/). 

_But not all of the funds were so freely accessible._

[Tether froze all of the 33M USDT](https://twitter.com/paoloardoino/status/1425090760609832978?s=20) that were stolen on the Ethereum chain. 

**Their coin - their choice… A fact worth remembering if you use USDT.**

By this point the shit had really hit the fan; and all eyes were on [Poly Network, who resorted to posting an open letter](https://twitter.com/PolyNetwork2/status/1425123153009803267) to the attacker begging them to return the funds. 
  
**A single tweet asking a criminal to return six hundred million dollars... Maybe Gensler was right when he said we are in the [“Wild West”](https://www.reuters.com/technology/us-sec-chair-gensler-calls-congress-help-rein-crypto-wild-west-2021-08-03/) phase of cryptocurrency.**

Consider the mindset of the attacker at this point in the story. Which do you think they felt more; euphoria, or terror?

**Stealing 600 million dollars whilst sat at your computer must be a surreal experience.**

_The experience of then trying to launder that money must be equally intense._

Aside from JPEGS, tornado.cash would be the obvious starting point, and that’s exactly where our hacker went.
  
They [sent themself a transaction](https://twitter.com/UnderTheBreach/status/1425119885978447875?s=20) containing the message;

>Wonder why Tornado? Will miners stop me? Teach me please

**Was that psyops or stupidity? In crypto it’s never quite clear...**

**On the run with 600 million, and broadcasting messages to an audience of thousands.** 

_The hacker was growing too confident._
  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/poly-fallout.png) 
  
**When [@WardBradt](https://twitter.com/wardbradt/status/1425112492397764609?s=20) tweeted the following;**

>Did the PolyNetwork Exploiter accidentally use the wrong sender address for this tx [0xb12681d9e](https://t.co/SXS7F6iJsM?amp=1)? The sender address is tied to FTX, Binance, Okex accounts.

**Suddenly the attacker's attitude changed.** 

Surely a hacker who feels confident enough to attempt an attack of this scale wouldn’t make such a basic OPSEC error? Or maybe they used fake KYC documents… 

_Either way, we began to see signs of fear from the attacker._

The hacker [began to suggest](https://twitter.com/UnderTheBreach/status/1425127303353356293?s=20) that they might return _"some tokens"_ or even abandon them, saying that they were _"not so interested in the money"._

[Then the hacker considered the idea](https://twitter.com/sniko_/status/1425135792658255877?s=20) of creating a DAO to distribute the stolen funds.

**Finally, the pressure became too much, and the hacker announced that they were [“READY TO SURRENDER”](https://etherscan.io/tx/0x7b6009ea08c868d7c5c336bf1bc30c33b87a0eedd59dac8c26e6a8551b20b68a)**
  
**In an unexpected and unprecedented move, the attacker is now returning the funds to Poly Network.**

They announced that they were ["READY TO RETURN THE FUNDS!"](https://etherscan.io/tx/0x7b6009ea08c868d7c5c336bf1bc30c33b87a0eedd59dac8c26e6a8551b20b68a) in an Ethereum transaction that was sent from the same wallet used for the attack.
 
Before sending the first return transaction, the hacker created a token called "The hacker is ready to surrender" and sent this token to Poly Network who announced that they had set up a [multisig controlled by ‘’known Poly addresses’’](https://twitter.com/PolyNetwork2/status/1425321860539949056).  

[A summary of the hackers' communication with Poly Network can be found here.](https://docs.google.com/spreadsheets/u/1/d/11LUJwLoHX8ZCyfjhg5YZ0V99iU6PafMNL_NET45FSVc/htmlview?pru=AAABe1lDAS0*CdZKWo5WZNYwj5Qca8505A#gid=0)
  
**At the time of writing, the hacker has returned the following:**

On the Ethereum blockchain: [$2.6M](https://etherscan.io/address/0x71fb9db587f6d47ac8192cd76110e05b8fd2142f#tokentxns) 
  
On the BSC: [$1.1M](https://bscscan.com/address/0xEEBb0c4a5017bEd8079B88F35528eF2c722b31fc)
  
On the Polygon blockchain: [$1M](https://polygonscan.com/address/0xa4b291ed1220310d3120f515b5b7accaecd66f17) 

**Will the hacker continue to return the funds, or is this just another stunt?**

_Can they really just return the money and be forgiven?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 
  
**Poly Network. 611 million.**

_And you thought you knew all the big protocols in DeFi._ 

**This industry has grown bigger than our echo chamber can handle.** 

This may be the first, but it won’t be the last hack of this size that we will see over the coming years. Yet the market seems unfazed, and rightly so.

For [better](https://finance.yahoo.com/news/coinbase-crushes-q2-expectations-notes-210643795.html) or for [worse](https://www.coindesk.com/bitmex-announces-100m-cftc-fincen-settlement), crypto will make the news, and the [world will have to take notice](https://twitter.com/NeerajKA/status/1423721468123287556?s=20) as our industry becomes the norm.  

_This is just another inevitable part of the progress._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/poly-conc.png)
