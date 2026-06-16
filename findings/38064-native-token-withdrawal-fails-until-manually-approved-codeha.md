---
tags:
  - lang/solidity
  - sector/nft
  - sector/staking
  - sector/token
  - platform/codehawks
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Tadle]]"
auditors:
  - "[[MinhTriet]]"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[upgrade-safety]]"
  - "[[vote-delegation-loop]]"
---
# Native token withdrawal fails until manually approved

- id: 38064
- impact: HIGH
- protocol: [[Tadle]]
- reporter: MinhTriet (Codehawks)
- source: N/A

## Summary


The report discusses a bug in the TokenManager contract that causes native token withdrawals to fail. This is due to a mistake in the internal function TokerManager::\_transfer, which passes the wrong address when attempting to approve spending. This results in the withdrawal failing and users not being able to access their funds until the issue is manually resolved. The impact is considered medium as it disrupts protocol functionality, but no funds are at risk. The recommended solution is to change the code in line 247 of TokenManager.sol to correctly pass the token address when calling the approve function. The tools used for this report were Forge.

## Details

## Summary

TokenManager::withdraw uses a spending allowance on the capital pool to move its funds.

When doing a withdrawal, the internal function TokerManager::\_transfer checks for this allowance and attempts to approve spending, but incorrectly passes address(this) instead of the token address.

Hence, withdrawal fails.

## Vulnerability Details

Let us use a simple example of creating an offer, closing it and attempting to withdraw.

```Solidity
    function test_native_token_withdrawal_fails() public {
        deal(user, INITIAL_TOKEN_VALUE);

        vm.startPrank(user);
        preMarktes.createOffer{value: 0.012 * 1e18}(
            CreateOfferParams(
                marketPlace,
                address(weth9),
                1000,
                0.01 * 1e18,
                12000,
                300,
                OfferType.Ask,
                OfferSettleType.Turbo
            )
        );

        // Close the offer.
        address offerAddr = GenerateAddress.generateOfferAddress(0);
        address stockAddr = GenerateAddress.generateStockAddress(0);

        preMarktes.closeOffer(stockAddr, offerAddr);

        tokenManager.withdraw(address(weth9), TokenBalanceType.MakerRefund);
        vm.stopPrank();
    }
```

We get:

```Solidity
    │   │   ├─ [9999] UpgradeableProxy::approve(UpgradeableProxy: [0x6891e60906DEBeA401F670D74d01D117a3bEAD39])
    │   │   │   ├─ [4983] CapitalPool::approve(UpgradeableProxy: [0x6891e60906DEBeA401F670D74d01D117a3bEAD39]) [delegatecall]
    │   │   │   │   ├─ [534] TadleFactory::relatedContracts(5) [staticcall]
    │   │   │   │   │   └─ ← [Return] UpgradeableProxy: [0x6891e60906DEBeA401F670D74d01D117a3bEAD39]
    │   │   │   │   ├─ [708] UpgradeableProxy::approve(UpgradeableProxy: [0x6891e60906DEBeA401F670D74d01D117a3bEAD39], 115792089237316195423570985008687907853269984665640564039457584007913129639935 [1.157e77])
    │   │   │   │   │   ├─ [192] TokenManager::approve(UpgradeableProxy: [0x6891e60906DEBeA401F670D74d01D117a3bEAD39], 115792089237316195423570985008687907853269984665640564039457584007913129639935 [1.157e77]) [delegatecall]
    │   │   │   │   │   │   └─ ← [Revert] EvmError: Revert
    │   │   │   │   │   └─ ← [Revert] EvmError: Revert
    │   │   │   │   └─ ← [Revert] ApproveFailed()
```

This approve fails because we're calling approve on a non-ERC20 contract, the function simply does not exist.

Here is the mistake, in TokenManager::\_transfer:

```Solidity
    function _transfer(
        address _token,
        address _from,
        address _to,
        uint256 _amount,
        address _capitalPoolAddr
    ) internal {
        uint256 fromBalanceBef = IERC20(_token).balanceOf(_from);
        uint256 toBalanceBef = IERC20(_token).balanceOf(_to);

        if (
            _from == _capitalPoolAddr &&
            IERC20(_token).allowance(_from, address(this)) == 0x0
        ) {
            ICapitalPool(_capitalPoolAddr).approve(address(this));
        }
```

address(this) is TokenManager itself, but CapitalPool::approve expects a token address.

## Impact

No funds are at risk, but people won't be able to withdraw native tokens until someone manually calls the approve correctly. **Because there's a disruption of protocol functionality**, I'm submitting this as MEDIUM.

## Tools Used

Forge.

## Recommendations

Change ICapitalPool(\_capitalPoolAddr).approve(address(this)) to ICapitalPool(\_capitalPoolAddr).approve(\_token) in line 247, TokenManager.sol.
