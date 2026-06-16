---
tags:
  - lang/solidity
  - sector/governance
  - platform/code4rena
  - has/github
  - severity/high
  - vuln/bridge/replay
  - impact/loss-of-funds/direct-drain
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Taiko]]"
auditors:
  - "[[wangxx2026]]"
report: "https://code4rena.com/reports/2024-03-taiko"
genome:
  - "[[replay]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[permit-fork-replay]]"
  - "[[timelock-timestamp-bypass]]"
---
# [H-05] Signatures can be replayed in `withdraw()` to withdraw more tokens than the user originally intended.

- id: 31933
- impact: HIGH
- protocol: [[Taiko]]
- reporter: wangxx2026 (Code4rena)
- source: https://code4rena.com/reports/2024-03-taiko

## Summary


This bug report discusses a vulnerability in the TimelockTokenPool.sol contract where users can provide a signature to withdraw all their tokens, but the lack of a nonce allows for signature replay attacks. This means that an attacker can repeatedly use the same signature to withdraw more tokens than the user intended. The bug is similar to one found in Arbitrum H-01 and the recommended mitigation step is to implement a nonce or other signature replay protection in the contract. The bug has been confirmed and a fix is being worked on in a pull request.

## Details


Signatures can be replayed in `withdraw()` to withdraw more tokens than the user originally intended.

### Vulnerability Details

In the TimelockTokenPool.sol contracts, users can provide a signature to allow someone else to withdraw all their withdrawable tokens on their behalf using their signature. [TimelockTokenPool.sol#L170)  ](https://github.com/code-423n4/2024-03-taiko/blob/f58384f44dbf4c6535264a472322322705133b11/packages/protocol/contracts/team/TimelockTokenPool.sol#L170)

        function withdraw(address _to, bytes memory _sig) external {
            if (_to == address(0)) revert INVALID_PARAM();
            bytes32 hash = keccak256(abi.encodePacked("Withdraw unlocked Taiko token to: ", _to));
     @>     address recipient = ECDSA.recover(hash, _sig);
            _withdraw(recipient, _to);
        }

As seen from above, the signature provided does not include a nonce and this can lead to signature replay attacks. Due to the lack of a nonce,  withdraw() can be called multiple times with the same signature. Therefore, if a user provides a signature to withdraw all his withdrawable tokens at one particular time, an attacker can repeatedly call withdraw() with the same signature to withdraw more tokens than the user originally intended.
The vulnerability is similar to [Arbitrum H-01](https://solodit.xyz/issues/h-01-signatures-can-be-replayed-in-castvotewithreasonandparamsbysig-to-use-up-more-votes-than-a-user-intended-code4rena-arbitrum-foundation-arbitrum-foundation-git) where  user's signatures could be replayed to use up more votes than a user intended due to a lack of nonce.

### Recommended Mitigation Steps

Consider using a nonce or other signature replay protection in the TimelockTokenPool contract.

**[dantaik (Taiko) confirmed and commented](https://github.com/code-423n4/2024-03-taiko-findings/issues/60#issuecomment-2032045461):**
 > Valid bug report, trying to fix it in this PR: https://github.com/taikoxyz/taiko-mono/pull/16611/files

***
