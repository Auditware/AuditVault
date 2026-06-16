---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - platform/codehawks
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Tadle]]"
auditors:
  - "[[inzinko]]"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Formulaic Error Rounds Down Causing Total Loss Of Funds For Bid Takers During Abort

- id: 38067
- impact: HIGH
- protocol: [[Tadle]]
- reporter: inzinko (Codehawks)
- source: N/A

## Summary


This report describes a critical bug in the `abortBidTaker()` function that can cause users to lose all their deposited funds during bid abortion. The bug is caused by an incorrect formula used in the function, which leads to rounding errors. This can result in the deposit amount being rounded down to zero, causing a direct loss of funds for the user. A proof of concept test is provided to reproduce the issue and recommendations are given to fix the bug. 

## Details

## Summary

A critical vulnerability exists in the `abortBidTaker()` function where an incorrect calculation leads to rounding errors, potentially causing
takers to lose all their deposited funds during bid abortion.

## Vulnerability Details
### Overview
The vulnerability stems from an incorrect formula used in the `abortBidTaker()` function where the deposit amount is calculated as follows:
`uint256 depositAmount = stockInfo.points.mulDiv(preOfferInfo.points, preOfferInfo.amount, Math.Rounding.Floor);`. 
This formula is incorrect and should be `uint256 depositAmount = stockInfo.points.mulDiv(preOfferInfo.amount, preOfferInfo.points, Math.Rounding.Floor);` as can be seen in the following
[correct implementation](https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/PreMarkets.sol#L212-L216).

As the numerator and denominator are switched [here](https://github.com/Cyfrin/2024-08-tadle/blob/04fd8634701697184a3f3a5558b41c109866e5f8/src/core/PreMarkets.sol#L671-L675), the deposit amount can easily be rounded to zero causing direct loss of funds for the taker.


### Proof of Concept
Please run the following test to reproduce the issue: `forge test --via-ir --mt testTakerTotalBalancesOnOfferCancellationAndAbort`
As noted in the audit tags, offending lines can be changed to fixed implementation, however this requires adding the recommendations to the src/core/PreMarkets.sol file.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/core/PreMarkets.sol";
import "../src/libraries/GenerateAddress.sol";
import "../src/libraries/Constants.sol";
import "../src/interfaces/ITokenManager.sol";
import "../src/interfaces/ISystemConfig.sol";
import {MockERC20Token} from "./mocks/MockERC20Token.sol";
import {SystemConfig} from "../src/core/SystemConfig.sol";
import {CapitalPool} from "../src/core/CapitalPool.sol";
import {TokenManager} from "../src/core/TokenManager.sol";
import {PreMarktes} from "../src/core/PreMarkets.sol";
import {DeliveryPlace} from "../src/core/DeliveryPlace.sol";
import {TadleFactory} from "../src/factory/TadleFactory.sol";
import {WETH9} from "./mocks/WETH9.sol";
contract IssueTestTemplate is Test {
    SystemConfig systemConfig;
    CapitalPool capitalPool;
    TokenManager tokenManager;
    PreMarktes preMarktes;
    DeliveryPlace deliveryPlace;

    address marketPlace;
    string marketPlaceName = "Backpack";
    WETH9 weth9;
    MockERC20Token mockUSDCToken;
    MockERC20Token mockPointToken;

    address guardian;
    address maker;
    address taker1;
    address taker2;
    address taker3;

    uint256 basePlatformFeeRate = 5_000;
    uint256 baseReferralRate = 300_000;

    bytes4 private constant INITIALIZE_OWNERSHIP_SELECTOR =
        bytes4(keccak256(bytes("initializeOwnership(address)")));

    function setUp() public {
        // Set up accounts
        guardian = makeAddr("guardian");
        maker = makeAddr("maker");
        taker1 = makeAddr("taker1");
        taker2 = makeAddr("taker2");
        taker3 = makeAddr("taker3");

        vm.label(guardian, "guardian");
        vm.label(maker, "maker");
        vm.label(taker1, "taker1");
        vm.label(taker2, "taker2");
        vm.label(taker3, "taker3");
        // deploy mocks
        weth9 = new WETH9();

        TadleFactory tadleFactory = new TadleFactory(guardian);

        mockUSDCToken = new MockERC20Token();
        mockPointToken = new MockERC20Token();

        SystemConfig systemConfigLogic = new SystemConfig();
        CapitalPool capitalPoolLogic = new CapitalPool();
        TokenManager tokenManagerLogic = new TokenManager();
        PreMarktes preMarktesLogic = new PreMarktes();
        DeliveryPlace deliveryPlaceLogic = new DeliveryPlace();

        bytes memory deploy_data = abi.encodeWithSelector(
            INITIALIZE_OWNERSHIP_SELECTOR,
            guardian
        );
        vm.startPrank(guardian);

        address systemConfigProxy = tadleFactory.deployUpgradeableProxy(
            1,
            address(systemConfigLogic),
            bytes(deploy_data)
        );

        address preMarktesProxy = tadleFactory.deployUpgradeableProxy(
            2,
            address(preMarktesLogic),
            bytes(deploy_data)
        );
        address deliveryPlaceProxy = tadleFactory.deployUpgradeableProxy(
            3,
            address(deliveryPlaceLogic),
            bytes(deploy_data)
        );
        address capitalPoolProxy = tadleFactory.deployUpgradeableProxy(
            4,
            address(capitalPoolLogic),
            bytes(deploy_data)
        );
        address tokenManagerProxy = tadleFactory.deployUpgradeableProxy(
            5,
            address(tokenManagerLogic),
            bytes(deploy_data)
        );

        vm.label(systemConfigProxy, "systemConfigProxy");
        vm.label(preMarktesProxy, "preMarktesProxy");
        vm.label(deliveryPlaceProxy, "deliveryPlaceProxy");
        vm.label(capitalPoolProxy, "capitalPoolProxy");
        vm.label(tokenManagerProxy, "tokenManagerProxy");

        vm.stopPrank();
        // attach logic
        systemConfig = SystemConfig(systemConfigProxy);
        capitalPool = CapitalPool(capitalPoolProxy);
        tokenManager = TokenManager(tokenManagerProxy);
        preMarktes = PreMarktes(preMarktesProxy);
        deliveryPlace = DeliveryPlace(deliveryPlaceProxy);

        vm.label(address(systemConfig), "systemConfig");
        vm.label(address(tokenManager), "tokenManager");
        vm.label(address(preMarktes), "preMarktes");
        vm.label(address(deliveryPlace), "deliveryPlace");

        vm.startPrank(guardian);
        // initialize
        systemConfig.initialize(basePlatformFeeRate, baseReferralRate);
        tokenManager.initialize(address(weth9));
        address[] memory tokenAddressList = new address[](2);

        tokenAddressList[0] = address(mockUSDCToken);
        tokenAddressList[1] = address(weth9);

        tokenManager.updateTokenWhiteListed(tokenAddressList, true);

        // create market place
        systemConfig.createMarketPlace(marketPlaceName, false);
        vm.stopPrank();

        deal(address(mockUSDCToken), maker, 100000000 * 10 ** 18);
        deal(address(mockPointToken), maker, 100000000 * 10 ** 18);
        deal(maker, 100000000 * 10 ** 18);

        deal(address(mockUSDCToken), taker1, 100000000 * 10 ** 18);
        deal(address(mockUSDCToken), taker2, 100000000 * 10 ** 18);
        deal(address(mockUSDCToken), taker3, 100000000 * 10 ** 18);

        deal(address(mockPointToken), taker2, 100000000 * 10 ** 18);

        marketPlace = GenerateAddress.generateMarketPlaceAddress("Backpack");

        vm.warp(1719826275);

        vm.prank(maker);
        mockUSDCToken.approve(address(tokenManager), type(uint256).max);

        vm.startPrank(taker2);
        mockUSDCToken.approve(address(tokenManager), type(uint256).max);
        mockPointToken.approve(address(tokenManager), type(uint256).max);
        vm.stopPrank();
    }


        /* @audit - POC: [rounding-causes-loss-for-big-takers.md] Taker final balances are rounded to zero during bid abortion, due to implementation flaws in the
        `abortBidTaker()` function where the deposit amount is calculated as follows:
        `uint256 depositAmount = stockInfo.points.mulDiv(preOfferInfo.points, preOfferInfo.amount, Math.Rounding.Floor);`. 
        This formula is incorrect and should be `uint256 depositAmount = stockInfo.points.mulDiv(preOfferInfo.amount, preOfferInfo.points, Math.Rounding.Floor);`.

        As the numerator and denominator are switched, the deposit amount can easily be rounded to zero causing direct loss of funds for the taker.
        */
        function testTakerTotalBalancesOnOfferCancellationAndAbort() public {
            // initial state
            address referrer = makeAddr("referrer");
            uint256 totalPoints = 1000;
            uint256 purchasedPoints = 500;
            uint256 tokenAmount = 1e18;
            uint256 collateralRate = 12000;
            uint256 tradeTax = 300;
            uint256 collateralSent = tokenAmount * collateralRate / Constants.COLLATERAL_RATE_DECIMAL_SCALER;
            uint256 collateralPurchased = (collateralSent * purchasedPoints) / totalPoints;
            uint256 depositAmount = (purchasedPoints * tokenAmount) / totalPoints;

            // Verify Pre-test state
            uint256 makerInitialBalance = verifyAccountTypeBalance(address(mockUSDCToken), maker, TokenBalanceType.MakerRefund, 0);   
            assertEq(makerInitialBalance, 0, "Maker shouldn't have any refund balance");

            // Setup referral, create offer and taker
            (address offerAddr) = createOffer(maker, address(mockUSDCToken), totalPoints, tokenAmount, collateralRate, tradeTax, OfferType.Ask, OfferSettleType.Turbo);
            (uint256 initialReferrerBalance, uint256 initialTakerBalance) = createTakerAndGetInitialBalances(referrer, offerAddr, purchasedPoints);
            
            // Close Offer and Verify Maker Referral Balances
            closeOffer(maker, offerAddr);

            // Abort Offer 
            abortAskOffer(maker, GenerateAddress.generateStockAddress(0), offerAddr);
            abortBidTakerFixed(taker1, GenerateAddress.generateStockAddress(1), offerAddr); // @audit - NOTE: Change this for `abortBidTakerFixed()` to resolve failing test

            uint256 takerFinalTaxBalance = verifyAccountTypeBalance(address(mockUSDCToken), taker1, TokenBalanceType.TaxIncome, 0);  
            uint256 takerFinalSalesBalance = verifyAccountTypeBalance(address(mockUSDCToken), taker1, TokenBalanceType.SalesRevenue, 0);  
            uint256 takerFinalRefundBalance = getAccountTypeBalance(address(mockUSDCToken), taker1, TokenBalanceType.MakerRefund);
            uint256 takerFinalBalance = takerFinalSalesBalance + takerFinalTaxBalance + takerFinalRefundBalance;

            assertGe(takerFinalBalance, depositAmount, "Excess funds have been extracted during taker cancel + abort"); // @audit - REVERT: This assertion fails, as the taker's balance is rounded to zero during the abortBidTaker() function call.
        }

    // Helper functions

    function createOffer(address offerer, address tokenAddress, uint256 totalPoints, uint256 tokenAmount, uint256 collateralRate, uint256 tradeTax, OfferType offerType, OfferSettleType settleType) internal returns (address offerAddr) {
        vm.startPrank(offerer);
        mockUSDCToken.approve(address(tokenManager), type(uint256).max);
        preMarktes.createOffer(
            CreateOfferParams(
                marketPlace,
                tokenAddress,
                totalPoints,
                tokenAmount,
                collateralRate,
                tradeTax,
                offerType,
                settleType
            )
        );
        offerAddr = GenerateAddress.generateOfferAddress(0);
        vm.stopPrank();
        return offerAddr;
    }

    function createTakerAndGetInitialBalances(address referrer, address offerAddr, uint256 _purchasedPoints) internal returns (uint256 initialReferrerBalance, uint256 initialTakerBalance) {
        
        initialReferrerBalance = tokenManager.userTokenBalanceMap(
            referrer,
            address(mockUSDCToken),
            TokenBalanceType.ReferralBonus
        );
        initialTakerBalance = tokenManager.userTokenBalanceMap(
            taker1,
            address(mockUSDCToken),
            TokenBalanceType.ReferralBonus
        );
        
        vm.startPrank(taker1);
        mockUSDCToken.approve(address(tokenManager), type(uint256).max);
        uint256 purchasedPoints = _purchasedPoints;
        preMarktes.createTaker(offerAddr, purchasedPoints);
        vm.stopPrank();


        return (initialReferrerBalance, initialTakerBalance);
    }

    function closeOffer(address offerer, address offerAddr) internal {
        vm.prank(offerer);
        preMarktes.closeOffer(GenerateAddress.generateStockAddress(0), offerAddr);
    }

    function abortAskOffer(address offerer, address _stock, address _offer) internal {
        vm.prank(offerer);
        preMarktes.abortAskOffer(_stock, _offer);
    }

    function abortBidTaker(address offerer, address _stock, address _offer) internal {
        vm.prank(offerer);
        preMarktes.abortBidTaker(_stock, _offer);
    }
    function abortBidTakerFixed(address offerer, address _stock, address _offer) internal {
        vm.prank(offerer);
        preMarktes.abortBidTakerFixed(_stock, _offer);
    }

    function verifyAccountTypeBalance(address _token, address account, TokenBalanceType accountType, uint256 expectedBalance) internal returns(uint256 balance) {
        balance = getAccountTypeBalance(_token, account, accountType);

        console2.log("AccountType", uint256(accountType));

        assertEq(
            balance,
            expectedBalance,
            "Account should have the correct amount for account type"
        );
        return balance;
    }

    function getAccountTypeBalance(address _token, address account, TokenBalanceType accountType) public returns(uint256 balance) {
        balance = tokenManager.userTokenBalanceMap(
            account,
            _token,
            accountType
        );

        return balance;
    }

    function calculateExpectedReferralBonuses(address offerAddr, uint256 offerPoints, uint256 offerAmount, uint256 purchasedPoints) internal view returns (uint256 expectedReferrerBonus, uint256 expectedTakerBonus) {
        OfferInfo memory offerInfo = preMarktes.getOfferInfo(offerAddr);

        uint256 depositAmount = purchasedPoints * offerAmount / offerPoints;
        uint256 platformFeeRate = systemConfig.getPlatformFeeRate(taker1);
        uint256 platformFee = depositAmount * platformFeeRate / Constants.PLATFORM_FEE_DECIMAL_SCALER;
        
        ReferralInfo memory referralInfo = systemConfig.getReferralInfo(taker1);
        expectedReferrerBonus = (platformFee * referralInfo.referrerRate) / Constants.REFERRAL_RATE_DECIMAL_SCALER;
        expectedTakerBonus = (platformFee * referralInfo.authorityRate) / Constants.REFERRAL_RATE_DECIMAL_SCALER;

        return (expectedReferrerBonus, expectedTakerBonus);
    }

    function calculateExpectedSalesRevenue(address offerAddr, uint256 purchasedPoints) internal view returns (uint256 expectedSalesRevenue) {
        OfferInfo memory offerInfo = preMarktes.getOfferInfo(offerAddr);
        
        expectedSalesRevenue = purchasedPoints * offerInfo.amount / offerInfo.points;
        
        return expectedSalesRevenue;
    }

    function calculateExpectedTaxIncome(address offerAddr, bool isMaker, address _maker, uint256 depositAmount) internal view returns (uint256 expectedTaxIncome) {
        uint256 tradeTax = isMaker? preMarktes.getMakerInfo(_maker).eachTradeTax : preMarktes.getOfferInfo(offerAddr).tradeTax;
        assertGt(tradeTax, 0, "Trade tax should be greater than 0");
        
        expectedTaxIncome = (depositAmount * tradeTax) / Constants.EACH_TRADE_TAX_DECIMAL_SCALER;
        return expectedTaxIncome;
    }
}
```

## Impact

Likelihood: HIGH
Impact: HIGH
Severity: HIGH

## Tools Used

Manual Review and Foundry Testing.

## Recommendations

Update the `abortBidTaker()` function to use the correct formula for calculating the deposit amount:
`uint256 depositAmount = stockInfo.points.mulDiv(preOfferInfo.amount, preOfferInfo.points, Math.Rounding.Floor);`. An example implementation is shown below;

```solidity
/**
     * @notice abort bid taker
     * @param _stock stock address
     * @param _offer offer address
     * @notice Only offer owner can abort bid taker
     * @dev Only offer abort status is aborted can be aborted
     * @dev Update stock authority refund amount
     */
    function abortBidTakerFixed(address _stock, address _offer) external {
        StockInfo storage stockInfo = stockInfoMap[_stock];
        OfferInfo storage preOfferInfo = offerInfoMap[_offer];

        if (stockInfo.authority != _msgSender()) {
            revert Errors.Unauthorized();
        }

        if (stockInfo.preOffer != _offer) {
            revert InvalidOfferAccount(stockInfo.preOffer, _offer);
        }

        if (stockInfo.stockStatus != StockStatus.Initialized) {
            revert InvalidStockStatus(
                StockStatus.Initialized,
                stockInfo.stockStatus
            );
        }

        if (preOfferInfo.abortOfferStatus != AbortOfferStatus.Aborted) {
            revert InvalidAbortOfferStatus(
                AbortOfferStatus.Aborted,
                preOfferInfo.abortOfferStatus
            );
        }

        uint256 depositAmount = stockInfo.points.mulDiv(
            preOfferInfo.amount,
            preOfferInfo.points, // @audit - FIX: pointsPurchased * offerInfo.amount / totalPoints, however this doesn't account for funds lost due to sales tax, referral or platform fees.
            Math.Rounding.Floor
        );

        uint256 transferAmount = OfferLibraries.getDepositAmount(
            preOfferInfo.offerType,
            preOfferInfo.collateralRate,
            depositAmount,
            false,
            Math.Rounding.Floor
        );

        MakerInfo storage makerInfo = makerInfoMap[preOfferInfo.maker];
        ITokenManager tokenManager = tadleFactory.getTokenManager();
        tokenManager.addTokenBalance(
            TokenBalanceType.MakerRefund,
            _msgSender(),
            makerInfo.tokenAddress,
            transferAmount
        );
        console.log("transferAmount", transferAmount);
        console.log("depositAmount", depositAmount);
        console.log("stockInfo.points", stockInfo.points);
        console.log("preOfferInfo.points", preOfferInfo.points);
        console.log("preOfferInfo.amount", preOfferInfo.amount);

        stockInfo.stockStatus = StockStatus.Finished;

        emit AbortBidTaker(_offer, _msgSender());
    }

```
