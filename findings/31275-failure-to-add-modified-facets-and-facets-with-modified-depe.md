---
tags:
  - lang/solidity
  - sector/governance
  - sector/oracle
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Beanstalk]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-12-05-cyfrin-beanstalk-bip-39.md"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[chainlink-round-completeness]]"
  - "[[upgrade-safety]]"
  - "[[weak-randomness]]"
---
# Failure to add modified facets and facets with modified dependencies to `bips::bipSeedGauge` breaks the protocol

- id: 31275
- impact: HIGH
- protocol: [[Beanstalk]] Bip
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2023-12-05-cyfrin-beanstalk-bip-39.md

## Summary


The bug report is about a missing function in the `bipSeedGauge` function which is causing issues with the protocol. The missing function is causing problems with the accounting and issuance of Stalk, the native token of the protocol. This is because some facets and libraries have been modified since the previous upgrade, but the changes have not been taken into account in the `bipSeedGauge` function. The impact of this bug is considered low, but it can cause severe issues such as incorrect issuance of Stalk. A proof of concept has been provided to demonstrate the broken accounting. The recommended solution is to always add all modified facets and their dependencies to the upgrade script and to develop a test suite to catch similar errors in the future.

## Details

**Description:** At the time of a Diamond Proxy upgrade, modified facets are cut by their inclusion in the relevant function within [`bips.js`](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/scripts/bips.js). are Currently, the [`bipSeedGauge` function](https://github.com/BeanstalkFarms/Beanstalk/blob/dfb418d185cd93eef08168ccaffe9de86bc1f062/protocol/scripts/bips.js#L198-L240) appears to be missing `FieldFacet`, `BDVFacet`, `ConvertFacet`, and `WhitelistFacet` which have all been modified since the previous upgrade. Moreover, the addition of facets with modifications to their libraries has not been taken into account, resulting in multiple issues that break the protocol.

**Impact:** At first glance, given that it appears none of these facets or the libraries they use contain significant modifications to the core business logic of Beanstalk, the impact could be considered low. However, given there have been significant alterations to other libraries utilized by multiple facets, this is not the case. One of the more severe issues involves the issuance of significantly increased amounts of Stalk than intended which therefore breaks protocol accounting.

**Proof of Concept:** A list of all modified facets can be obtained by running the following command:
```bash
git diff --stat 7606673..dfb418d -- ".sol" ":\!protocol/test/" ":\!protocol/contracts/mocks/*" | grep "Facet.sol"
```
Output:
```
protocol/contracts/beanstalk/barn/UnripeFacet.sol  | 360 +++++++++
---
---
protocol/contracts/beanstalk/field/FieldFacet.sol  |   4 +-
protocol/contracts/beanstalk/silo/BDVFacet.sol     |  12 +-
protocol/contracts/beanstalk/silo/ConvertFacet.sol |   8 +-
.../contracts/beanstalk/silo/WhitelistFacet.sol    |  79 +++-
.../contracts/beanstalk/sun/GaugePointFacet.sol    |  39 ++
.../beanstalk/sun/SeasonFacet/SeasonFacet.sol      | 120 +++--
.../sun/SeasonFacet/SeasonGettersFacet.sol         | 248 ++++++++++
```

A list of all modified libraries can be obtained by running the following command:
```bash
git diff --stat 7606673..dfb418d -- "*.sol" ":\!protocol/test/*" ":\!protocol/contracts/mocks/*" | grep "Lib.*\.sol"
```
Output:
```
.../contracts/libraries/Convert/LibChopConvert.sol |  60 +++
.../contracts/libraries/Convert/LibConvert.sol     |  42 +-
.../contracts/libraries/Convert/LibConvertData.sol |   3 +-
.../libraries/Convert/LibUnripeConvert.sol         |  18 +-
.../contracts/libraries/Convert/LibWellConvert.sol |   3 +-
.../contracts/libraries/Curve/LibBeanMetaCurve.sol |  15 +
.../contracts/libraries/Curve/LibMetaCurve.sol     |  61 ++-
protocol/contracts/libraries/LibCases.sol          | 161 +++++++
protocol/contracts/libraries/LibChop.sol           |  65 +++
protocol/contracts/libraries/LibEvaluate.sol       | 297 ++++++++++++
protocol/contracts/libraries/LibFertilizer.sol     |   2 +
protocol/contracts/libraries/LibGauge.sol          | 330 +++++++++++++
protocol/contracts/libraries/LibIncentive.sol      |  20 +-
.../contracts/libraries/LibLockedUnderlying.sol    | 509 +++++++++++++++++++++
protocol/contracts/libraries/LibUnripe.sol         | 180 ++++++--
.../libraries/Minting/LibCurveMinting.sol          |  26 +-
.../contracts/libraries/Minting/LibWellMinting.sol |  30 +-
.../libraries/Oracle/LibBeanEthWellOracle.sol      |  55 
---
.../contracts/libraries/Oracle/LibEthUsdOracle.sol |   3 +-
.../contracts/libraries/Oracle/LibUsdOracle.sol    |  18 +-
.../libraries/Silo/LibLegacyTokenSilo.sol          |   4 -
protocol/contracts/libraries/Silo/LibTokenSilo.sol |  18 +-
protocol/contracts/libraries/Silo/LibWhitelist.sol | 181 ++++++--
.../libraries/Silo/LibWhitelistedTokens.sol        |  47 ++
protocol/contracts/libraries/Well/LibWell.sol      | 217 ++++++++-
```

The following coded proof of concept has been written to demonstrate the broken Stalk accounting:
```javascript
const { expect } = require('chai');
const { takeSnapshot, revertToSnapshot } = require("../utils/snapshot.js");
const { BEAN, BEAN_3_CURVE, UNRIPE_BEAN, UNRIPE_LP, WETH, BEAN_ETH_WELL, PUBLIUS, ETH_USD_CHAINLINK_AGGREGATOR } = require('../utils/constants.js');
const { bipSeedGauge } = require('../../scripts/bips.js');
const { getBeanstalk } = require('../../utils/contracts.js');
const { impersonateBeanstalkOwner, impersonateSigner } = require('../../utils/signer.js');
const { ethers } = require('hardhat');

const { impersonateBean, impersonateEthUsdChainlinkAggregator} = require('../../scripts/impersonate.js');
let silo, siloExit, bean

let grownStalkBeforeUpgrade, grownStalkAfterUpgrade
let snapshotId
let whitelistedTokenSnapshotBeforeUpgrade, whitelistedTokenSnapshotAfterUpgrade

const whitelistedTokens = [BEAN, BEAN_3_CURVE, UNRIPE_BEAN, UNRIPE_LP, BEAN_ETH_WELL]

const whitelistedTokensNames = ["BEAN", "BEAN:3CRV CURVE LP", "urBEAN", "urBEAN:WETH", "BEAN:WETH WELLS LP"]
const beanHolderAddress = "0xA9Ce5196181c0e1Eb196029FF27d61A45a0C0B2c"
let beanHolder

/**
 * Async function
 * @returns tokenDataSnapshot: Mapping from token address to (name,stemTip)
 */
const getTokenDataSnapshot = async()=>{
  tokenDataSnapshot = new Map()

  for(token of whitelistedTokens){
    tokenDataSnapshot.set(token,{
      name: whitelistedTokensNames[whitelistedTokens.indexOf(token)],
      stemTip: await silo.stemTipForToken(token)
    })
  }
  return tokenDataSnapshot
}



const forkMainnet = async()=>{
  try {
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.FORKING_RPC,
            blockNumber: 18619555-1 //a random semi-recent block close to Grown Stalk Per Bdv pre-deployment
          },
        },
      ],
    });
  } catch(error) {
    console.log('forking error in seed Gauge');
    console.log(error);
    return
  }
}

const initializateContractsPointers = async(beanstalkAddress)=>{
  tokenSilo = await ethers.getContractAt('TokenSilo', beanstalkAddress);
  seasonFacet = await ethers.getContractAt('ISeasonFacet', beanstalkAddress);
  siloFacet = await ethers.getContractAt('SiloFacet', beanstalkAddress);
  silo = await ethers.getContractAt('ISilo', beanstalkAddress);
  siloExit = await ethers.getContractAt('SiloExit', beanstalkAddress);
  admin = await ethers.getContractAt('MockAdminFacet', beanstalkAddress);
  well = await ethers.getContractAt('IWell', BEAN_ETH_WELL);
  weth = await ethers.getContractAt('IWETH', WETH)
  bean = await ethers.getContractAt('IBean', BEAN)
  beanEth = await ethers.getContractAt('IWell', BEAN_ETH_WELL)
  beanEthToken = await ethers.getContractAt('IERC20', BEAN_ETH_WELL)
  unripeLp = await ethers.getContractAt('IERC20', UNRIPE_LP)
  beanMetapool = await ethers.getContractAt('MockMeta3Curve', BEAN_3_CURVE)
  chainlink = await ethers.getContractAt('MockChainlinkAggregator', ETH_USD_CHAINLINK_AGGREGATOR)
}

const impersonateOnchainSmartContracts = async() => {
  publius = await impersonateSigner(PUBLIUS, true)
  await impersonateEthUsdChainlinkAggregator()
  await impersonateBean()
  owner = await impersonateBeanstalkOwner()
}

const deposit = async(signer, tokenDataSnapshot) => {
  await network.provider.send("hardhat_setBalance", [
    signer.address,
    "0x"+ethers.utils.parseUnits("1000",18).toString()
  ]);


  beanToDeposit = await bean.balanceOf(signer.address)
  // console.log(`Beans to deposit: ${ethers.utils.formatUnits(beanToDeposit,6)}`)
  beanStemTip = tokenDataSnapshot.get(BEAN).stemTip
  await siloFacet.connect(signer).deposit(BEAN,beanToDeposit,0) // 0 = From.EXTERNAL
  return await tokenSilo.getDepositId(BEAN, beanStemTip, )
}

describe('Facet upgrade POC', function () {
  before(async function () {

    // Get users to impersonate
    [user, user2] = await ethers.getSigners()

    // fork mainnet
    await forkMainnet()

    // Replace on chain smart contract for testing
    await impersonateOnchainSmartContracts()
    beanHolder = await impersonateSigner(beanHolderAddress)

    this.beanstalk = await getBeanstalk()

    await initializateContractsPointers(this.beanstalk.address)

    // Before doing anything we record some state variables that should hold
    whitelistedTokenSnapshotBeforeUpgrade = await getTokenDataSnapshot()

    // We do a deposit
    depositId = await deposit(beanHolder,whitelistedTokenSnapshotBeforeUpgrade)

    grownStalkBeforeUpgrade = await siloExit.balanceOfGrownStalk(beanHolder.address,BEAN)

    // seed Gauge
    await bipSeedGauge(true, undefined, false)
    console.log("BIP-39 initiated\n")

    whitelistedTokenSnapshotAfterUpgrade = await getTokenDataSnapshot(silo)
    grownStalkAfterUpgrade = await siloExit.balanceOfGrownStalk(beanHolder.address,BEAN)
  });

  beforeEach(async function () {
    snapshotId = await takeSnapshot()
  });

  afterEach(async function () {
    await revertToSnapshot(snapshotId)
  });


  describe('init state POC', async function () {

    it("Grown stalk backward compatibility",async()=>{
      expect(grownStalkBeforeUpgrade).to.be.eq(grownStalkAfterUpgrade, "Grown stalk for a deposit after BIP-39 upgrade is not the same than before the upgrade")
    })


    it('Stem tip backward compatibility',async()=>{
      expect(whitelistedTokenSnapshotBeforeUpgrade.get(BEAN).stemTip).to.be.equal(whitelistedTokenSnapshotAfterUpgrade.get(BEAN).stemTip,"BEAN stem tip is not the same than after the upgrade")
      expect(whitelistedTokenSnapshotBeforeUpgrade.get(BEAN_3_CURVE).stemTip).to.be.equal(whitelistedTokenSnapshotAfterUpgrade.get(BEAN_3_CURVE).stemTip,"BEAN:3CRV Curve LP stem tip is not the same than after the upgrade")
      expect(whitelistedTokenSnapshotBeforeUpgrade.get(BEAN_ETH_WELL).stemTip).to.be.equal(whitelistedTokenSnapshotAfterUpgrade.get(BEAN_ETH_WELL).stemTip,"BEAN:3CRV Curve LP stem tip is not the same than after the upgrade")
      expect(whitelistedTokenSnapshotBeforeUpgrade.get(UNRIPE_BEAN).stemTip).to.be.equal(whitelistedTokenSnapshotAfterUpgrade.get(UNRIPE_BEAN).stemTip,"BEAN:3CRV Curve LP stem tip is not the same than after the upgrade")
      expect(whitelistedTokenSnapshotBeforeUpgrade.get(UNRIPE_LP).stemTip).to.be.equal(whitelistedTokenSnapshotAfterUpgrade.get(UNRIPE_LP).stemTip,"BEAN:3CRV Curve LP stem tip is not the same than after the upgrade")

    })
  })
})
```
As is shown by the reverting expectations, failure to add `SiloFacet` to the upgrade breaks the milestone stem update and the grown stalk accounting.

If the solution for the issue relating to the previous milestone stem being scaled for use with the new gauge point system (which uses untruncated values moving forward) is implemented without updating the `SiloFacet`, then the previous `LibTokenSilo::stemTipForToken` implementation is used. This allows deposits performed before the upgrade to receive significantly more grown stalk than intended.

**Recommended Mitigation:** Be sure to always add all modified facets and all facets whose library dependencies have been modified to the upgrade script. It is highly recommended to develop an upgrade simulation test suite to catch other similar errors in the upgrade process in the future.
