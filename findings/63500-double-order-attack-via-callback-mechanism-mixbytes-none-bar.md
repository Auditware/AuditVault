---
tags:
  - lang/solidity
  - sector/governance
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/access-control/missing-modifier
  - fix/use-reentrancy-guard
  - novelty/variant
  - misassumption/admin-is-honest
  - fix/add-access-control
protocol: "[[Barter DAO]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Superposition/README.md#1-double-order-attack-via-callback-mechanism"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Double Order Attack via Callback Mechanism

- id: 63500
- impact: HIGH
- protocol: [[Barter DAO]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Superposition/README.md#1-double-order-attack-via-callback-mechanism

## Summary


The bug report discusses a vulnerability in a protocol that transfers tokens from one party to another. The issue arises when a malicious party exploits the callback function, allowing them to fulfill multiple orders without actually transferring the required tokens. The report recommends implementing a `safeTransferFrom()` function and adding a `nonReentrant` modifier to prevent this vulnerability.

## Details

##### Description
The protocol transfers tokens from maker to taker first, and then calls back to the taker (i. e. `msg.sender`) to complete the order:

```solidity
uint256 actualTakerAmount = 
    filledtakerAmount < order.takerAmount ? 
    filledtakerAmount : order.takerAmount;

uint256 balanceBefore = 
    order.takerToken.balanceOf(address(order.maker));

ISuperpositionCallback(msg.sender).superpositionCallback(
        order, actualTakerAmount, callback);

uint256 balanceAfter = 
    order.takerToken.balanceOf(address(order.maker));

// Check that callback provided enough tokens
if (balanceAfter < balanceBefore + actualTakerAmount) {
    revert ReceivedLessThanMinReturn(
        balanceAfter, 
        balanceBefore + actualTakerAmount
    );
}
```
https://github.com/BarterLab/superposition-contract/blob/8dfd5bceb02bef6892a574da6862f673a5ea66b6/src/SuperpositionVault.sol#L141-L148

A malicious taker can exploit this by fulfilling another open order from the same maker during the callback (e.g., an order in the SuperPosition protocol, 1inch, etc.), causing the balance check to pass for both orders without actually transferring the required tokens in the first one.

Additionally, ERC-777 callbacks may be used for the attack.

##### Recommendation
We recommend calling `safeTransferFrom()` for both taker and maker directly in `SuperpositionVault.swap()` at the very end of the code and additionally protect it with a `nonReentrant` modifier as a precaution. For example:
```solidity
contract SuperpositionVault {
    ...
    function swap(...) ... {
        ...
        ...
        ICallback(msg.sender).callback(...);
        ...
        ...
        
        token1.safeTransferFrom(maker, taker, ...);
        token2.safeTransferFrom(taker, maker, ...);

        emit ...;

        // no other code
    }
}
```



    
---
