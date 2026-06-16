---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Meson]]"
auditors:
  - "[[Damilola Edwards]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf"
genome:
  - "[[signature-replay]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
---
# Hash collisions in untyped signatures

- id: 18099
- impact: HIGH
- protocol: [[Meson]] Protocol
- reporter: Damilola Edwards (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/MesonProtocol.pdf

## Summary


This bug report is about a vulnerability in the Meson protocol, a cryptocurrency protocol that facilitates swaps between two different blockchains. The vulnerability is present in the signature verification code, which allows a user to use the same signature for both the request and release messages. This could allow an attacker to request and release funds from both sides of the swap, resulting in a potential attack.

The short-term solution is to prefix untyped messages with the message type (request or release) and include all message fields in the top-level digest. The long-term solution is to document the formats of all messages that could possibly be validated by the MesonHelpers contract, and ensure that the message type and all parameters can be unambiguously extracted from the top-level digest for verification. This will help to ensure that the message encoding is injective. Additionally, consider implementing legacy signatures by using EIP-712-compliant messages as the input to eth_sign.

## Details

## Diﬃculty: High

## Type: Cryptography

## Description

To post or execute a swap, a user must provide an ECDSA signature on a message containing the encoded swap information. The Meson protocol supports both typed (EIP-712) and legacy untyped (EIP-191) messages. The format of a message is determined by a bit in the encoded swap information itself. The Meson protocol defines two message types: 

- A **request message** containing only an encoded swap.
- A **release message** containing the hash of an encoded swap concatenated with the recipient’s address.

Figure 1.1 shows the relevant signature-verification code.

```solidity
function _checkRequestSignature(
    if (nonTyped) {
        bytes32 digest = keccak256(abi.encodePacked(
            bytes28(0x19457468657265756d205369676e6564204d6573736167653a0a3332), // HEX of "\x19Ethereum Signed Message:\n32"
            ...
            encodedSwap
        ));
        require(signer == ecrecover(digest, v, r, s), "Invalid signature");
        return;
    }
}

function _checkReleaseSignature(
    if (nonTyped) {
        digest = keccak256(abi.encodePacked(
            bytes28(0x19457468657265756d205369676e6564204d6573736167653a0a3332), // HEX of "\x19Ethereum Signed Message:\n32"
            ...
            keccak256(abi.encodePacked(encodedSwap, recipient))
        ));
    }
}
```

*Figure 1.1: contracts/utils/MesonHelpers.sol*

Note that the form of both the request and release messages in the figure is `"\x19Ethereum Signed Message:\n32" + msg`, where `msg` is a 32-byte string. If an attacker could find a message that would be interpreted as valid in both contexts, the attacker could use the signature on that message to both request and release funds, facilitating a number of potential attacks.

Specifically, the attacker would need to identify `swap1`, `swap2`, and `recipient` values such that:

```
swap1 = keccak256(swap2, recipient).
```

The attacker could do that by choosing a valid `swap2` value and then iterating through `recipient` values until finding one for which `keccak256(swap2, recipient)` would be interpreted as a valid message. With the current restrictions on the swap amount, chain, and token fields, we estimate that this would take between \(2^{60}\) and \(2^{70}\) tries.

## Exploit Scenario

Alice computes `swap1`, `swap2`, and `recipient` values such that:

```
swap1 = keccak256(swap2, recipient)
```

and `swap1` and `swap2` refer to valid swaps from chain A to chain B. 

Alice then convinces Bob to post `swap1` and `swap2` on chain A, locks `swap2` on chain B, and uses the request signature on `swap1` as the release signature on `swap2`. This enables her to release the funds to her wallet (the recipient address) and to collect the funds on both sides of the swap.

## Recommendations

Short term, prefix untyped messages with the message type (request or release), and include all message fields in the top-level digest, as shown in figure 1.2:

```solidity
bytes32 digest = keccak256(abi.encodePacked(
    bytes28(“\x19Ethereum Signed Message:\n71”),
    bytes7(“REQUEST”),
    encodedSwap,
    recipient
));
```

*Figure 1.2: The recommended modifications to the top-level digest*

Long term, document the formats of all messages that could possibly be validated by the MesonHelpers contract, and ensure that the message type and all parameters can be unambiguously extracted from the top-level digest for verification. This will help ensure that the message encoding is injective. Additionally, consider implementing legacy signatures by using EIP-712-compliant messages as the input to `eth_sign`.
