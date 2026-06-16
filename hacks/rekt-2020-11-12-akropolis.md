---
tags:
  - sector/lending
  - sector/perpetuals
  - sector/stable
  - sector/token
  - has/audit
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Akropolis - REKT"
protocol: "[[Akropolis]]"
date: 2020-11-12
loss_usd: 2000000
auditors:
  - "[[Certik]]"
  - "[[SmartDec]]"
source: "https://rekt.news/akropolis-rekt"
excerpt: "The Akropolis has not been this rekt since the battle of Salamina in 480 B.C. A modern day King Xerses has razed the Akropolis once more, stealing $2,000,000 DAI via a combination of flash loans and r"
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Akropolis - REKT

> **Loss:** $2,000,000 | **Date:** 2020-11-12 | **Audited by:** CertiK, SmartDec

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/11/84604-1.jpg)
Pericles must be turning in his grave.

The Akropolis has not been this rekt since the battle of Salamina in 480 B.C.

A modern day King Xerses has razed the Akropolis once more, stealing $2,000,000 DAI via a combination of flash loans and re-entrancy.

At first, the Akropolis admins tried to claim they were simply carrying out some “fixes”.
![](https://lh5.googleusercontent.com/MElhS0VhaZ0DA_lMRYeLoRNafz1YWpafkzgdcV_K9F-HNxz1V7H85KDGkQdP3npLM9Nql6LjtEqzKVUnHMdL8OzlWbsZ9JbFl_L7JQJc_MWKJpYwIRr_AVzsBUvrpEtLpc-xpkDi)
We now know they were burned for $2 million.
![](https://lh5.googleusercontent.com/OGE_yvAkXzHlE9USnNhS0g0NpV3bqHKBj8Z7bAcVT3B0ejQs8bBkWfWJrmqo_83zWyVTq7aOG_JaLTItr7uL_k2TiKOHN7JEqmwp1T6IOY9w9ENZr6ZtbWE2B29XNxAl4ex_UO_r)
But how?

The Akropolis protocol allows users to deposit tokens into a vault and get different tokens in return. The amount of new tokens you get back depends on how much is deposited.

The deposit amount is calculated by the difference in balance from before and after the transfer operation.

Here’s how the attacker took advantage of this system by creating a malicious token contract which called deposit again (reentrancy). [This](https://etherscan.io/address/0xe2307837524db8961c4541f943598654240bd62f#tokentxns) is the attack contract.

1. Create faketoken

2. Deposit faketoken

3a. Get a callback to faketoken, deposit 25k DAI

3b. Get credited for 25k DAI of deposits

4. Get credited for 25k DAI of deposits

5. Withdraw 50k DAI

Credit [samczsun](https://twitter.com/samczsun)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/11/4d509e7155f551c4d98bb1014b320c61-1.jpg)
Because the attacker was able to use their contract as the deposit token, they were able to use reentrance with a dYdx flash loan, as shown below.
![](https://lh4.googleusercontent.com/LxCZ2ZHvBLGPgk7BaoplX3rNuNtfN2JoZ9VeMBZe42MaWMw7ShK_mdgg70RhZJ1DJO4lLn1D8IkAnZ91VKeamI49aW0pDY-7trH07qX2A_ifqbg5xE_1QVLoOxt7qcUBfIYUm8i0)![](https://lh5.googleusercontent.com/D2wa_EEUSuXUk7r9cRAhX-fwHRv91pmeFeWd1bVR9KFO_IZLXzlzt8I2eJhNfGFP9pOiVokZa58Qn4aFUWlycIIt2gSNNZA5pDSbsy3vqMqsG8eZS1yU8N1qfgQP4_UFbZS0kMfV)
[This](https://etherscan.io/address/0xe2307837524db8961c4541f943598654240bd62f#tokentxns) is the hackers address. We can see they had started to execute batches of $50k attacks around 8 hours prior.

They then [sent $2m](https://etherscan.io/tx/0xf15623567231c67df2b8bcc5540236fbda2c3ac11ecbec427048f11b582cb869) of these gains to a different address, where it remains at the time of writing.

Credit [@dogetoshi](https://twitter.com/Dogetoshi/status/1326963117356625931?s=20)
![](https://lh3.googleusercontent.com/dSGoJEDMg3SdSHVshM5N8FaLgkai2s1q7gtmCd7-VPKmeNcCew5OXEVAHOQ_Sa9h7iRL021U54658OC8HnVS6MdQSTMxsyjfu6MOKQ-qP5o6Ay0-Jy3NjnVx2dKYEmgAqTrefgjL)
We should note that the smart contracts that the hacker interacted with had been audited by two separate security companies, Smartdec and Certik.

Smartdec have a reasonably good track [record](https://blog.smartdec.net/), however, for Certik, Akropolis is an unwelcome addition to the growing list of projects that they have audited before an exploit.

bZx, Lien, [Harvest](/harvest-finance-rekt/), and now Akropolis. A completed security audit should never be taken as a guarantee of safety, but a Certik audit certainly carries less weight than it used to...

Even a well made and thoroughly audited contract can turn into a shit show if in the hands of bad players. The fact that Akropolis were so quick to lie to their users shows that not all the blame lies on Certik or the hacker.

Although we so often strive for trustless protocols, when it comes to human communication between a user and a service provider, the fragility of trust should always be protected.

Akropolis have lost that trust, and become rekt.
