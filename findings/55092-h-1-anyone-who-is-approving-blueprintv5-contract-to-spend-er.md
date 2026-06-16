---
tags:
  - lang/solidity
  - sector/stable
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[Crestal Network]]"
auditors:
  - dreamcoder
report: "https://github.com/sherlock-audit/2025-03-crestal-network-judging"
genome:
  - "[[token-approval-flow]]"
  - "[[direct-drain]]"
---
# H-1: Anyone who is approving `BlueprintV5` contract to spend ERC20 can get drained because `Payment::payWithERC20`

- id: 55092
- impact: HIGH
- protocol: Crestal Network
- reporter: dreamcoder (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue found in the `BlueprintV5` contract, which is used for handling payments with ERC20 tokens. It was discovered that the function `payWithERC20` can also be used to drain funds from anyone interacting with the contract and approving the use of the payment token. This is because the function is public and can be called by anyone with a valid token address and the victim's address. The bug can only occur if the admin has enabled the use of the payment token and the victim has approved the token for use by the contract. The impact of this bug is that the victim can lose their funds to the attacker. The bug has been fixed by making the `payWithERC20` function internal.

## Details

Source: https://github.com/sherlock-audit/2025-03-crestal-network-judging/issues/260 

## Found by 
0x180db, 0x73696d616f, 0xAadi, 0xDemon, 0xEkko, 0xGondar, 0xGutzzz, 0xYjs, 0xadarum, 0xaudron, 0xc0ffEE, 0xhiros, 0xjarix, 0xlucky, 0xpetern, Anirruth, Arav, Artur, Buggx0, CasinoCompiler, Chaindecompiler, ChaosSR, Cybrid, Edoscoba, FalseGenius, GODSPEED, Harry\_cryptodev, Harsh, HolyHak, IzuMan, JasonBPMIASN, Kodyvim, KungFuPanda, Kwesi, MSK, Matic68, OlaHamid, OpaBatyo, Oxpreacher, Pelz, Pihu, Praise03, Ryonen, Trepid, ZOL, ZafiN, abhishek\_thakur, anchabadze, auditism, bube, c3phas, dennis, dreamcoder, eLSeR17, farismaulana, gegul, ggbond, gxh191, hirugohan, ihtishamsudo, ilyadruzh, j3x, jacopod, jprod15, krot-0025, lom\_ack, makeWeb3safe, patitonar, ph, phrax, princekay, radcipher, redtrama, resosiloris, roccomania, sa9933, sabanaku77, seeques, shady4, skid0016, skipper, tachida2k, thimthor, vivekd, w33kEd, x0rc1ph3r, y4y, yaioxy, zxriptor

### Summary

`payWithERC20` is supposed to be used inside `BlueprintV5` contract to handle payment. But this function also can be used to drain anyone who is interact with `BlueprintV5` and using it to approve payment token when creating an agent.

### Root Cause

[Payment.sol#L25-L32](https://github.com/sherlock-audit/2025-03-crestal-network/blob/main/crestal-omni-contracts/src/Payment.sol#L25-L32)

```Solidity
@>    function payWithERC20(address erc20TokenAddress, uint256 amount, address fromAddress, address toAddress) public {
        // check from and to address
        require(fromAddress != toAddress, "Cannot transfer to self address");
        require(toAddress != address(0), "Invalid to address");
        require(amount > 0, "Amount must be greater than 0");
        IERC20 token = IERC20(erc20TokenAddress);
        token.safeTransferFrom(fromAddress, toAddress, amount);
    }
```

the root cause simply because this function is public function, meaning anyone can call this and supply valid token address, then fill `fromAddress` with any address that still have allowance/approving the payment token to be spend by `BlueprintV5` contract

### Internal Pre-conditions

1. admin enable usdc or any erc20 token as payment by calling `Blueprint::addPaymentAddress`

### External Pre-conditions

1. victim approve the spending of usdc or any erc20 token set in last step for `BlueprintV5` contract address proxy
2. the amount approved should be greater than the amount used for creating agent with token cost
3. victim call the function to create agent (optional)

### Attack Path

1. attacker call `payWithERC20` supplying the parameter with usdc address, victim address and sufficient amount to be sent into attacker address

### Impact

user/victim who interacted would lose their funds drained by attacker

### PoC

_No response_

### Mitigation

make the `Payment::payWithERC20` internal

## Discussion

**spidemen2024**

Got it

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/crestalnetwork/crestal-omni-contracts/pull/16
