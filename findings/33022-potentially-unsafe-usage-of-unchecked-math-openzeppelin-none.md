---
tags:
  - lang/solidity
  - sector/nft
  - sector/rwa
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Land and Tunnel]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/land-and-tunnel-audit"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[permanent]]"
  - "[[integer-bounds]]"
---
# Potentially unsafe usage of unchecked math

- id: 33022
- impact: HIGH
- protocol: [[Land and Tunnel]] Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/land-and-tunnel-audit

## Summary


The bug report identifies instances of unchecked math in the code for the LandBaseTokenV3 and LandV3 smart contracts. These unchecked math operations can lead to overflows and underflows, which can cause unexpected behavior and potential security vulnerabilities. It is recommended to use the latest version of Solidity, which has built-in checks for these issues, or to use the SafeMath library for older versions of Solidity. The bug has been resolved in a recent update to the code.

## Details

The following instances of unchecked math were identified:


* The operation on [line 44](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L44) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 50](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L50) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 57](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L57) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 84](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L84) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 85](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L85) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 228](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L228) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 258](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L258) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 279](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L279) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 293](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L293) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 294](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L294) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 314](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L314) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 317](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L317) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 341](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L341) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 383](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L383) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 390](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L390) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 391](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L391) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 421](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L421) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 486](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L486) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 487](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L487) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 541](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L541) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 543](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L543) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 611](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L611) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 620](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol#L620) of [`LandBaseTokenV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/Land/erc721/LandBaseTokenV3.sol)
* The operation on [line 40](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/LandV3.sol#L40) of [`LandV3.sol`](https://github.com/thesandboxgame/sandbox-smart-contracts/blob/8430ea5fdb0f4905b9678689ce0cbc2f74a704b6/src/solc_0.5/LandV3.sol)


Consider using the latest Solidity version which has built-in math checks against overflows and underflows. Alternatively, consider using the OpenZeppelin [`SafeMath` library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol) to protect math operations against overflows and underflows for Solidity versions `>=0.6.0` and `<0.8.0`.


***Update:** Resolved in [pull request #909](https://github.com/thesandboxgame/sandbox-smart-contracts/pull/909) at commit [37b3dfb](https://github.com/thesandboxgame/sandbox-smart-contracts/pull/909/commits/37b3dfbac8cb6b1aab8e1c8c2d0131ec37d8ed93). The `exists` (`_isValidQuad`) function in the `LandBaseTokenV3` contract has been updated to ensure the input quad size is one of the valid sizes. In addition, upon further review from the OpenZeppelin team, it was noted that unchecked math for both the `LandBaseTokenV3.sol` and `LandV3.sol` does not introduce potential for overflows or underflows. Also, the Sandbox team stated:*



> *We checked for possible cases of `unsafeMath` but feel that we have good validation for the values of parameters, which will never cause a `safeMath` error. We have found one case regarding the possible value of size, which has been handled in the pull request for L-02.*
