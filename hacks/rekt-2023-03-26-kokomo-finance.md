---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/optimism
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/token
  - vuln/dependency/upgradeable-contract
  - novelty/variant
title: "Kokomo Finance - REKT"
protocol: "[[Kokomo Finance]]"
date: 2023-03-26
loss_usd: 4000000
auditors:
source: "https://rekt.news/kokomo-finance-rekt"
excerpt: "Another week, another rug. This time, Kokomo Finance took off with $4M, before deleting their online presence. Less than a week old, and Kokomo has already flatlined."
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Kokomo Finance - REKT

> **Loss:** $4,000,000 | **Date:** 2023-03-26 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kokomo-header.png)

_Another week, another rug._

**This time, [Kokomo Finance](https://www.kokomo.finance/#) took off with approximately $4M, deleting their website, [Twitter](https://twitter.com/KokomoFinance), [GitHub](https://github.com/KokomoFinance) and [Medium](https://kokomofinance.medium.com/) in the process.**

The lending protocol had [launched](https://twitter.com/Optimism_Space/status/1638799587971588096) on Optimism less than a week ago, and its token, [KOKO](https://www.coingecko.com/en/coins/kokomo-finance), less than 36 hours before the rug.

**Wrapped Bitcoin deposits were rugged via changes made by the project’s deployer address. Almost $2M of tokens [still remain](https://defillama.com/protocol/kokomo-finance) in the project’s pools on Optimism.**

But with the contracts paused and users [unable](https://optimistic.etherscan.io/address/0x2F174385C9fc984433577Dc5cae04A419290f06d) to withdraw funds, the question remains…

_…will they be back for the rest?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Certik](https://twitter.com/CertiKAlert/status/1640118618548568069), [Beosin](https://twitter.com/BeosinAlert/status/1640194668389634048)_

Certik [explained](https://twitter.com/CertiKAlert/status/1640118618548568069) how the rug went down:

> 1/ The deployer of KOKO Token, address [0x41BE](https://optimistic.etherscan.io/address/0x41be327a34d5d2f0855ff7e4fb3f6f1748b3310f), deployed attack contract cBTC. Then set the reward speed, paused the borrow and set the implementation contract into a [malicious one](https://optimistic.etherscan.io/address/0x05b2957591a4d1334b230f8c56fd62ddee17b52e).
>
> 2/ Address [0x5a2d](https://optimistic.etherscan.io/address/0x5a2d0e3d6f862ee155f52ab65b6b22e1d80f5716)… [approved](https://optimistic.etherscan.io/tx/0xc3a34542b7283fc3ef9101f6c3d92b6fd666b882a4c6193ae11b027fbde39cd9) the cBTC contract to spend the 7010 sonne WBTC.
>
> 3/ Since the implementation contract has been upgraded to the malicious cBTC contract, the attacker called 0x804edaad method to transfer sonne WBTC to address [0x5C8d](https://optimistic.etherscan.io/address/0x5c8db6eea11896065ec7dcfc67f458c54ccf7bff).
>
> 4/ Finally, the address 0x5C8d.. [swapped](https://optimistic.etherscan.io/tx/0x6c6095addf69f5e37d4057f1c58b9c2098ad4c181aa21b8a54c2f66acf3dd3ce) 7010 sonne WBTC to 141 WBTC (~4M) for profit.

**The rugged funds are currently in the following addresses:**

[0x8C0eCD7BACCed114729F8269B459E0A4D5e95C3b](https://bscscan.com/address/0x8C0eCD7BACCed114729F8269B459E0A4D5e95C3b) 50 BTCB ($1.4M)

[0xB74C5e41E748BaBC32ce33813549E2503CDaB762](https://bscscan.com/address/0xB74C5e41E748BaBC32ce33813549E2503CDaB762) 40 BTCB ($1.1M)

[0xC2AE8D3b0fb159cCD331a01A8C3632B95dB23CF5](https://bscscan.com/address/0xC2AE8D3b0fb159cCD331a01A8C3632B95dB23CF5) 32 BTCB ($0.9M)

[0x88340ff2292506D0D93934CbBFEA5ED1804CDa0d](https://arbiscan.io/address/0x88340ff2292506D0D93934CbBFEA5ED1804CDa0d) 20 WBTC ($0.6M)
  
The project’s [audit](https://github.com/0xGuard-com/audit-reports/blob/master/Kokomo%20Finance%20Token/Kokomo%20Finance%20Token.pdf), conducted by 0xGuard, covered just the token contract, rather than the protocol at large.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Aside from Wintermute’s Gnosis Safe [blunder](https://rekt.news/wintermute-rekt/) last year, this is the largest incident we’ve covered on Optimism, so far._

With last week’s ARB airdrop taking all the L2 mindshare, and now this bad news for Optimism…

**Are we seeing a changing of the tides amongst Ethereum’s most popular scaling solutions?**

Or now that airdrops are out of the way, will users simply rotate to the [next](https://rekt.news/airdrop-hunters/) best [chance](https://rekt.news/airdrop-hunters2/) to ‘earn’ some free money?

_Whatever the future holds for Optimism, one thing’s for certain:_

**Kokomo has flatlined.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/kokomo-chart.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
