---
tags:
  - lang/solidity
  - platform/consensys
  - severity/high
  - sector/algo-stable
  - sector/governance
  - sector/lending
  - sector/options
  - sector/oracle
protocol: "[[Fei Protocol V2 Phase 1]]"
auditors:
  - "[[Sergii Kravchenko]]"
report: "https://consensys.net/diligence/audits/2021/09/fei-protocol-v2-phase-1/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# CollateralizationOracle - Fei in excluded deposits contributes to userCirculatingFei

- id: 13297
- impact: HIGH
- protocol: [[Fei Protocol V2 Phase 1]]
- reporter: Sergii Kravchenko (ConsenSys)
- source: https://consensys.net/diligence/audits/2021/09/fei-protocol-v2-phase-1/

## Summary


A bug has been identified in the `CollateralizationOracle.pcvStats` function in the code/contracts/oracle/CollateralizationOracle.sol file, which is used to calculate Protocol-Controlled Value (PCV), User-circulating FEI, and Protocol Equity. This bug is caused by the FEI balances from excluded deposits being added to the `userCirculatingFei`, which distorts the numbers and skews the collateralization ratio. In extreme scenarios, where all deposits have been excluded, the entire Fei supply is reported as `userCirculatingFei`.

It is unclear how to fix this bug, as the querying function should be fixed and the substitute values should be trusted to the Governor, not a Guardian. Moreover, proper care should be taken when *all* deposits (or just too many) have been excluded, for example, by setting the returned `validityStatus` to `false`.

## Details

#### Description


`CollateralizationOracle.pcvStats` iterates over all deposits, queries the resistant balance and FEI for each deposit, and accumulates the total value of the resistant balances and the total resistant FEI. Any Guardian or Governor can exclude (and re-include) a deposit that has become problematic in some way, for example, because it is reporting wrong numbers.
Finally, the `pcvStats` function computes the `userCirculatingFei` as the total FEI supply minus the accumulated resistant FEI balances; the idea here is to determine the amount of “free” FEI, or FEI that is not PCV. However, the FEI balances from excluded deposits contribute to the `userCirculatingFei`, although they are clearly not “free” FEI. That leads to a wrong `protocolEquity` and a skewed collateralization ratio and might therefore have a significant impact on the economics of the system.


It should be noted that even the exclusion from the total PCV leads to a `protocolEquity` and a collateralization ratio that could be considered skewed (again, it might depend on the exact reasons for exclusion), but “adding” the missing FEI to the `userCirculatingFei` distorts these numbers even more.


In the extreme scenario that *all* deposits have been excluded, the entire Fei supply is currently reported as `userCirculatingFei`.


**code/contracts/oracle/CollateralizationOracle.sol:L278-L328**



```
/// @notice returns the Protocol-Controlled Value, User-circulating FEI, and
/// Protocol Equity.
/// @return protocolControlledValue : the total USD value of all assets held
/// by the protocol.
/// @return userCirculatingFei : the number of FEI not owned by the protocol.
/// @return protocolEquity : the difference between PCV and user circulating FEI.
/// If there are more circulating FEI than $ in the PCV, equity is 0.
/// @return validityStatus : the current oracle validity status (false if any
/// of the oracles for tokens held in the PCV are invalid, or if
/// this contract is paused).
function pcvStats() public override view returns (
  uint256 protocolControlledValue,
  uint256 userCirculatingFei,
  int256 protocolEquity,
  bool validityStatus
) {
    uint256 \_protocolControlledFei = 0;
    validityStatus = !paused();

    // For each token...
    for (uint256 i = 0; i < tokensInPcv.length(); i++) {
        address \_token = tokensInPcv.at(i);
        uint256 \_totalTokenBalance  = 0;

        // For each deposit...
        for (uint256 j = 0; j < tokenToDeposits[\_token].length(); j++) {
            address \_deposit = tokenToDeposits[\_token].at(j);

            // ignore deposits that are excluded by the Guardian
            if (!excludedDeposits[\_deposit]) {
                // read the deposit, and increment token balance/protocol fei
                (uint256 \_depositBalance, uint256 \_depositFei) = IPCVDepositBalances(\_deposit).resistantBalanceAndFei();
                \_totalTokenBalance += \_depositBalance;
                \_protocolControlledFei += \_depositFei;
            }
        }

        // If the protocol holds non-zero balance of tokens, fetch the oracle price to
        // increment PCV by \_totalTokenBalance \* oracle price USD.
        if (\_totalTokenBalance != 0) {
            (Decimal.D256 memory \_oraclePrice, bool \_oracleValid) = IOracle(tokenToOracle[\_token]).read();
            if (!\_oracleValid) {
                validityStatus = false;
            }
            protocolControlledValue += \_oraclePrice.mul(\_totalTokenBalance).asUint256();
        }
    }

    userCirculatingFei = fei().totalSupply() - \_protocolControlledFei;
    protocolEquity = int256(protocolControlledValue) - int256(userCirculatingFei);
}

```
#### Recommendation


It is unclear how to fix this. One might want to exclude the FEI in excluded deposits *entirely* from the calculation, but not knowing the amount was the reason to exclude the deposit in the first place.  

One option could be to let the entity that excludes a deposit specify substitute values that should be used instead of querying the numbers from the deposit. However, it is questionable whether this approach is practical if the numbers we’d like to see as substitute values change quickly or repeatedly over time. Ultimately, the querying function itself should be fixed. Moreover, as the substitute values can dramatically impact the system economics, we’d only like to trust the Governor with this and not give this permission to a Guardian. However, the original intention was to give a role with less trust than the Governor the possibility to react quickly to a deposit that reports wrong numbers; if the exclusion of deposits becomes the Governor’s privilege, such a quick and lightweight intervention isn’t possible anymore.


Independently, we recommend taking proper care of the situation that *all* deposits – or just too many – have been excluded, for example, by setting the returned `validityStatus` to `false`, as in this case, there is not enough information to compute the collateralization ratio even as a crude approximation.
