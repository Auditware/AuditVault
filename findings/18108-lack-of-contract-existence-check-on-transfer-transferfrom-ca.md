---
tags:
  - lang/solidity
  - sector/bridge
  - sector/staking
  - sector/token
  - platform/trailofbits
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Meson]]"
auditors:
  - "[[Damilola Edwards]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf"
genome:
  - "[[unchecked-return-value]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[vote-delegation-loop]]"
---
# Lack of contract existence check on transfer / transferFrom calls

- id: 18108
- impact: HIGH
- protocol: [[Meson]] Protocol
- reporter: Damilola Edwards (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf

## Summary


This bug report is about the MesonHelpers contract, which uses the low-level call function to execute the transfer / transferFrom function of an ERC20 token without first performing a contract existence check. This means that if a supported token is subsequently self-destructed, it will be possible for a posted swap involving that token to succeed without actually depositing any tokens.

The Solidity documentation includes a warning that the low-level functions call, delegatecall, and staticcall return true as their first return value if the account called is non-existent. 

The exploit scenario is that a token supported by the Meson protocol, token X, is self-destructed, but the Meson protocol does not immediately detect the change and still allows users to post swaps with token X. Because the MesonHelpers contract lacks a contract existence check, these swaps succeed.

The recommendation is to implement a contract existence check before each low-level call, and / or check the balance of the sender before and after each call to verify that the expected amount has actually been transferred. In the long term, the Solidity documentation should be carefully reviewed, especially the “Warnings” section.

## Details

## Type: Testing

## Difficulty: Low

## Description
The MesonHelpers contract uses the low-level call function to execute the transfer / transferFrom function of an ERC20 token. However, it does not first perform a contract existence check. Thus, if there is no contract at the token address, the low-level call will still return success. This means that if a supported token is subsequently self-destructed (which is unlikely to happen), it will be possible for a posted swap involving that token to succeed without actually depositing any tokens.

### Function: _unsafeDepositToken
```solidity
function _unsafeDepositToken(
    address token,
    address sender,
    uint256 amount,
    bool isUCT
) internal {
    require(token != address(0), "Token not supported");
    require(amount > 0, "Amount must be greater than zero");
    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(
        bytes4(0x23b872dd), // 
        bytes4(keccak256(bytes("transferFrom(address,address,uint256)")))
        sender,
        address(this),
        amount
        // isUCT ? amount : amount * 1e12 // need to switch to this line if
        // deploying to BNB Chain or Conflux
    ));
    require(success && (data.length == 0 || abi.decode(data, (bool)),
        "transferFrom failed");
}
```

_Figure 10.1: contracts/util/MesonHelpers.sol:53–69_

The Solidity documentation includes the following warning:

> The low-level functions call, delegatecall and staticcall return true as their first return value if the account called is non-existent, as part of the design of the EVM. Account existence must be checked prior to calling if needed.

_Figure 10.2: A snippet of the Solidity documentation detailing unexpected behavior related to call_

## Exploit Scenario
A token that is supported by the Meson protocol, token X, is self-destructed. However, the Meson protocol does not immediately detect the change and still allows users to post swaps with token X. Because the MesonHelpers contract lacks a contract existence check, these swaps succeed.

## Recommendations
- **Short term**: Implement a contract existence check before each low-level call, and/or check the balance of the sender before and after each call to verify that the expected amount has actually been transferred.
- **Long term**: Carefully review the Solidity documentation, especially the “Warnings” section.
