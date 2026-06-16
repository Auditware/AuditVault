---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/staking
  - sector/wallet
protocol: "[[Metamask Delegation Framework]]"
auditors:
  - George Kobakhidze
report: "https://diligence.consensys.io/audits/2025/04/metamask-delegation-framework-april-2025/"
genome:
  - "[[dos-resistance]]"
  - "[[dos/unbounded-loop]]"
  - "[[dos/gas-limit]]"
  - "[[dos/permanent]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# getTermsInfo Reverts Because of Block Gas Limit ✓ Fixed

- id: 56801
- impact: HIGH
- protocol: Metamask Delegation Framework April 2025
- reporter:  George Kobakhidze
                         (ConsenSys)
- source: https://diligence.consensys.io/audits/2025/04/metamask-delegation-framework-april-2025/

## Summary


This bug report discusses an issue with the `getTermsInfo` function in the `MultiTokenPeriodEnforcer` smart contract. This function is used to retrieve information about token configurations, but it currently iterates through the entire array of configurations, making it inefficient for larger arrays. This could lead to gas inefficiency and potential block gas limit issues. To fix this, the function should be optimized by allowing for direct access to the relevant token through an index parameter. This will improve gas efficiency and prevent potential issues with gas limits. The bug has been fixed in a recent commit and pull request.

## Details

...

Export to GitHub ...

Set external GitHub Repo ...

Export to Clipboard (json)

Export to Clipboard (text)

#### Resolution

Fixed in [49b57f4a55f10d83fe9b1a990a0dd52cced186c8](https://github.com/MetaMask/delegation-framework/commit/49b57f4a55f10d83fe9b1a990a0dd52cced186c8) and [PR 104](https://github.com/MetaMask/delegation-framework/pull/104) by changing how token information gets retrieved in `getTermsInfo()`. In particular, a `uint256 _tokenIndex` argument was added to access specific token configurations immediately as opposed to searching through the whole configuration set.

#### Description

The `getTermsInfo` function decodes a flattened `bytes` array containing multiple fixed-size token configurations. Each record is 116 bytes long and includes a token address, `periodAmount`, `periodDuration`, and `startDate`. The function iterates over all entries to find a match for the provided `_token` address and then extracts the associated parameters.

However, the function always iterates over the entire `terms` array, which makes this approach gas-inefficient, particularly for larger arrays. Considering the [PR 81](https://github.com/MetaMask/delegation-framework/pull/81), the system should be able to operate with large quantities of tokens, including 100 tokens. However, because the `MultiTokenPeriodEnforcer` enforcer will be used together with other enforcers and delegations, and the `redeemDelegations` function of `DelegationManager` is gas-heavy, there is a risk that the block gas limit may occur with the tokens that are at the end of the `terms` data. When the enforcer reverts because of the gas block limit, the `delegate` would be unable to move funds of the `delegator` in the delegation, so the `delegator` will have to create a new delegation for this exact token.

#### Examples

**src/enforcers/MultiTokenPeriodEnforcer.sol:L157-L187**

```
function getTermsInfo(
    bytes calldata _terms,
    address _token
)
    public
    pure
    returns (uint256 periodAmount_, uint256 periodDuration_, uint256 startDate_)
{
    uint256 termsLength_ = _terms.length;
    require(termsLength_ != 0 && termsLength_ % 116 == 0, "MultiTokenPeriodEnforcer:invalid-terms-length");

    // Iterate over the byte offset directly in increments of 116 bytes.
    for (uint256 offset_ = 0; offset_ < termsLength_;) {
        // Extract token address from the first 20 bytes.
        address token_ = address(bytes20(_terms[offset_:offset_ + 20]));
        if (token_ == _token) {
            // Get periodAmount from the next 32 bytes.
            periodAmount_ = uint256(bytes32(_terms[offset_ + 20:offset_ + 52]));
            // Get periodDuration from the subsequent 32 bytes.
            periodDuration_ = uint256(bytes32(_terms[offset_ + 52:offset_ + 84]));
            // Get startDate from the final 32 bytes.
            startDate_ = uint256(bytes32(_terms[offset_ + 84:offset_ + 116]));
            return (periodAmount_, periodDuration_, startDate_);
        }

        unchecked {
            offset_ += 116;
        }
    }
    revert("MultiTokenPeriodEnforcer:token-config-not-found");
}

```

#### Recommendation

We recommend optimizing the function by allowing an index parameter, enabling direct access to the relevant token. This will reduce unnecessary iteration and improve gas efficiency. The index variable can be passed as an `args` variable into the enforcer.
