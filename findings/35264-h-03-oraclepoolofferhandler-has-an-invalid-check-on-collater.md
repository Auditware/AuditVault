---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - severity/high
  - sector/lending
  - sector/nft-lending
  - sector/oracle
  - sector/staking
protocol: "[[Gondi]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2024-06-gondi"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[circuit-input-range-check]]"
---
# [H-03] `OraclePoolOfferHandler` has an invalid check on `collateralTokenId`, incorrect loan offers can pass validation

- id: 35264
- impact: HIGH
- protocol: [[Gondi]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2024-06-gondi

## Summary


This bug report is about a vulnerability found in the `OraclePoolOfferHandler::validateOffer` function of the `OraclePoolOfferHandler.sol` file. The function is responsible for validating loan offer terms in three ways: through a range, a Merkle root, or an individual token id. However, the range validation check has an incorrect implementation, which allows an out-of-range `collateralTokenId` to pass the check. This results in invalid `principalFactors` being used in loan validation, which can be exploited for profit at the expense of users. The recommended mitigation step is to change the check condition to `if(_collateralTokenId < min || _collateralTokenId > max) {//revert}`. This vulnerability has been confirmed by the Gondi team and is classified as a high-risk vulnerability. 

## Details

In `OraclePoolOfferHandler::validateOffer`, loan offer terms can be validated in [three ways](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L19-L24):
1. Range (collateral tokens ids in a certain range will have a corresponding [`PrincipalFactor` used to calculate `maxPrincipal` allowed](https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L315)).
2. Merkle root.
3. Individual token id.

In the case of a range validation (`validationData.code == 1`), `_getFactors()` has an incorrect check implementation. The check will not revert when the `collateralTokenId` is out of range.

```solidity
//src/lib/pools/OraclePoolOfferHandler.sol
    function _getFactors(
        address _collateralAddress,
        uint256 _collateralTokenId,
        uint256 _duration,
        IBaseLoan.OfferValidator[] memory _validators
    ) private view returns (PrincipalFactors memory) {
        bytes32 key;
        if (_validators.length == 0) {
...
        } else if (
            _validators.length == 1 && _isZeroAddress(_validators[0].validator)
        ) {
            PrincipalFactorsValidationData memory validationData = abi.decode(
                _validators[0].arguments,
                (PrincipalFactorsValidationData)
            );
            if (validationData.code == 1) {
                 // Range
                (uint256 min, uint256 max) = abi.decode(validationData.data, (uint256, uint256));
                //@audit invalid check condition. Should be `_collateralTokenId < min || _collateralTokenId > max`
|>              if (_collateralTokenId < min && _collateralTokenId > max) {
                    revert InvalidInputError();
                }
                key = _hashKey(_collateralAddress, uint96(_duration), validationData.data);
...
        return _principalFactors[key];
```

https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L359-L360

As seen, an out-of-range `collateralTokenId` can pass the check, resulting in invalid `principalFactors` used in loan validation.

```solidity
//src/lib/pools/OraclePoolOfferHandler.sol
    function validateOffer(uint256 _baseRate, bytes calldata _offer)
        external
        view
        override
        returns (uint256, uint256)
    {
...
        PrincipalFactors memory factors = _getFactors(
            offerExecution.offer.nftCollateralAddress,
            offerExecution.offer.nftCollateralTokenId,
            duration,
            offerExecution.offer.validators
        );

        uint128 maxPrincipalFromCurrentFloor = uint128(uint256(currentFloor.value).mulDivDown(factors.floor, PRECISION));
        uint128 maxPrincipalFromHistoricalFloor =
            uint128(uint256(historicalFloor.value).mulDivDown(factors.historicalFloor, PRECISION));
        uint256 maxPrincipal = maxPrincipalFromCurrentFloor > maxPrincipalFromHistoricalFloor
            ? maxPrincipalFromHistoricalFloor
            : maxPrincipalFromCurrentFloor;
        //@audit-info maxPrincipal is based on returned principalFactors from _getFactors. Invalid range check in _getFactors() compromises validateOffer
|>      if (offerExecution.amount > maxPrincipal) {
            revert InvalidPrincipalAmountError();
        }
...
```

https://github.com/code-423n4/2024-06-gondi/blob/ab1411814ca9323c5d427739f5771d3907dbea31/src/lib/pools/OraclePoolOfferHandler.sol#L329-L330

### Recommended Mitigation Steps

Change the check condition into `if(_collateralTokenId < min || _collateralTokenId > max) {//revert`.

### Assessed type

Error

**[0xsomeone (judge) commented](https://github.com/code-423n4/2024-06-gondi-findings/issues/6#issuecomment-2220161790):**
 > This submission was initially mistakenly set as a duplicate of [#7](https://github.com/code-423n4/2024-06-gondi-findings/issues/7); however, upon closer inspection, it is a distinct vulnerability.
> 
> Specifically, the `min` and `max` range checks performed by the `OraclePoolOfferHandler::_getFactors` function appear to be invalid. This will permit a collection-level offer that has a specific range of token IDs to have its restriction bypassed.
> 
> I had requested the Sponsor's feedback for this submission on exhibit #7 and have queried for it again to ensure a fully informed judgment is issued for this submission. However, I am inclined to keep it as a valid high-risk vulnerability at this point based on similar rationale as the one laid out in #7; significant functionality of the protocol is impacted and the vulnerability can be exploited for profit at the expense of users by supplying less lucrative token IDs.

**[0xend (Gondi) confirmed](https://github.com/code-423n4/2024-06-gondi-findings/issues/6#event-13459919778)**

***
