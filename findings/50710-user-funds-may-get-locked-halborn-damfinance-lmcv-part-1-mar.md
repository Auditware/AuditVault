---
tags:
  - lang/solidity
  - sector/lending
  - platform/halborn
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/variant
protocol: "[[LMCV]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/damfinance/lmcv-part-1-smart-contract-security-assessment"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
---
# USER FUNDS MAY GET LOCKED

- id: 50710
- impact: HIGH
- protocol: [[LMCV]] part 1
- reporter: Halborn
- source: https://www.halborn.com/audits/damfinance/lmcv-part-1-smart-contract-security-assessment

## Summary



The bug report describes an issue with the `CollateralJoin` contract where the `live` flag is set to zero when the admin calls the `cage` function. This means that the contract is stopped and users are unable to withdraw their assets from the contract, even if they repay their loans. The bug is located in the `cage` and `exit` functions of the contract, and a test case has been provided to replicate the issue. The impact of this bug is rated as 5 out of 10, with a likelihood of 3 out of 10. The recommendation is to update the `cage` function to allow the admin to re-start the contract, which will allow users to withdraw their assets successfully. The bug has been solved by updating the `cage` function in the `CollateralJoin.sol` file.

## Details

##### Description

When admin calls the`cage` function of the `CollateralJoin` contract, the `live` flag is set to zero, which means the contract is stopped.

The user can repay the loan, but will not be able to exit (withdraw) assets from the `CollateralJoin` contract.

Code Location
-------
---
---

`cage` function:

#### contracts/CollateralJoin.sol

```
function cage() external auth {
    live = 0;
    emit Cage();
}

```

The `exit` function, requires contract to be `live`:

#### contracts/CollateralJoin.sol

```
function exit(address usr, uint256 wad) external {
    require(live == 1, "CollateralJoin/not-live");
    lmcv.pullCollateral(collateralName, msg.sender, wad);
    require(collateralContract.transfer(usr, wad), "CollateralJoin/failed-transfer");
    emit Exit(usr, wad);
}

```

Hardhat test case:

```
it("HAL-01 User collateral gets locked", async function () {

    // initial collateralJoin balance: 2 users joined with 100 tokens each
    expect(await mockToken.balanceOf(collateralJoin.address)).to.equal(fwad("200"));

    //Total value of collateral: $6000
    //Total loanable amount: $3000
    await userLMCV.loan(collateralBytesList, [fwad("50"), fwad("100"), fwad("200")], fwad("2000"), addr1.address);

    expect(await userLMCV.lockedCollateral(addr1.address, mockTokenBytes)).to.equal(fwad("50"));
    expect(await userLMCV.lockedCollateral(addr1.address, mockToken2Bytes)).to.equal(fwad("100"));
    expect(await userLMCV.lockedCollateral(addr1.address, mockToken3Bytes)).to.equal(fwad("200"));

    expect(await userLMCV.normalizedDebt(addr1.address)).to.equal(fwad("2000"));
    expect(await lmcv.totalDPrime()).to.equal(frad("2000"));
    expect(await lmcv.totalNormalizedDebt()).to.equal(fwad("2000"));

    // lock join contract
    await collateralJoin.cage();

    expect(await await collateralJoin.live()).to.equal(0);

    // repay the loan
    await userLMCV.repay(collateralBytesList, [fwad("50"), fwad("100"), fwad("200")], fwad("2000"), addr1.address);

    // validate the loan was paid - there is no locked collateral, debt nor issued dPrime
    expect(await userLMCV.lockedCollateral(addr1.address, mockTokenBytes)).to.equal(fwad("0"));
    expect(await userLMCV.lockedCollateral(addr1.address, mockToken2Bytes)).to.equal(fwad("0"));
    expect(await userLMCV.lockedCollateral(addr1.address, mockToken3Bytes)).to.equal(fwad("0"));
    expect(await userLMCV.normalizedDebt(addr1.address)).to.equal(fwad("0"));
    expect(await lmcv.totalDPrime()).to.equal(frad("0"));
    expect(await lmcv.totalNormalizedDebt()).to.equal(fwad("0"));

    // try to exit from join contract
    let collatJoinConnect = collateralJoin.connect(addr1);
    await expect(collatJoinConnect.exit(addr1.address, fwad("100")))
        .to.be.revertedWith("CollateralJoin/not-live");

    // balance does not change
    expect(await mockToken.balanceOf(collateralJoin.address)).to.equal(fwad("200"));
});

```

##### Score

Impact: 5  
Likelihood: 3

##### Recommendation

**SOLVED**: Updated the `cage` function to allow an admin to re-make the contract. When the administrator resumes the contract, users can withdraw their assets successfully.

Reference: [CollateralJoin.sol](https://github.com/DecentralizedAssetManagement/lmcv/blob/a4b1e5cf9d68e0f2392ac26e3867dda166e70020/contracts/lmcv/CollateralJoin.sol#L103)
