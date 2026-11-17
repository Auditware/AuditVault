---
tags:
  - blockchain/evm
  - lang/solidity
  - web3-sector/token
  - web3-sector/yield-aggregator
---
Given that the existing position’s depositAmount is used, but fnftId (informed via fnftsCreated) is not updated until the end of the minting routine, re-entrancy at this point allows for additional funds to be added to an existing position.
