---
tags:
  - lang/solidity
  - sector/governance
  - sector/nft
  - platform/code4rena
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Virtuals]]"
auditors:
  - "[[sergei2340]]"
report: "https://code4rena.com/reports/2025-04-virtuals-protocol"
genome:
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# [H-04] Public `ContributionNft::mint` leads to cascading issues / loss of funds

- id: 61825
- impact: HIGH
- protocol: [[Virtuals]] Protocol
- reporter: sergei2340 (Code4rena)
- source: https://code4rena.com/reports/2025-04-virtuals-protocol

## Summary


The bug report is about a vulnerability in the Virtuals protocol, where contributors are able to mint their own NFTs without proper authorization. This can lead to incorrect values being passed and calculated, resulting in breaking three functionalities: impact calculation, reward distribution, and token transfer. The recommended solution is to only allow an operator or admin to call the `ContributionNft::mint` function.

## Details



The contributors are supposed to submit their proposals via frontend and it is assumed from the [docs](https://whitepaper.virtuals.io/about-virtuals-1/the-protocol/co-contribution-and-provenance/modular-consensus-framework), that the frontend calls the [`ContributionNft::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ContributionNft.sol# L65) function to mint as per the proposed proposal.
```

Contribution Process: Contributors submit their proposals through our frontend, utilizing the modular consensus framework. Each proposal generates a contribution NFT regardless of acceptance, authenticating the submission's origin.
```

However, the [`ContributionNft::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ContributionNft.sol# L65) is un-gaurded, allowing proposers to mint their own NFTs.
```

    function mint(
        address to,
        uint256 virtualId,
        uint8 coreId,
        string memory newTokenURI,
        uint256 proposalId,
        uint256 parentId,
        bool isModel_,
        uint256 datasetId
    ) external returns (uint256) {
        IGovernor personaDAO = getAgentDAO(virtualId);
        require(
            msg.sender == personaDAO.proposalProposer(proposalId),
            "Only proposal proposer can mint Contribution NFT"
        );
        require(parentId != proposalId, "Cannot be parent of itself");
```

An issue arises here when these proposers are able to pass in incorrect/bogus values of incorrect `coreId`, `newTokenURI`, `parentId`, `isModel_` and `datasetId`.

### Impact

1. Incorrect cores and model values inside the [`ServiceNft::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L58C14-L58C18) function, leading to incorrect `serviceNFT` mint:
```

    function mint(uint256 virtualId, bytes32 descHash) public returns (uint256) {
        // . . . Rest of the code . . .
        uint256 proposalId = personaDAO.hashProposal(targets, values, calldatas, descHash);
        _mint(info.tba, proposalId);
        _cores[proposalId] = IContributionNft(contributionNft).getCore(proposalId);     <<@ -- // Incorrect core set
        // Calculate maturity
        _maturities[proposalId] = IAgentDAO(info.dao).getMaturity(proposalId);

        bool isModel = IContributionNft(contributionNft).isModel(proposalId);               <<@ -- // Incorrect model
        if (isModel) {
            emit CoreServiceUpdated(virtualId, _cores[proposalId], proposalId);
            updateImpact(virtualId, proposalId);
            _coreServices[virtualId][_cores[proposalId]] = proposalId;
        } else {
            _coreDatasets[virtualId][_cores[proposalId]].push(proposalId);
        }
        // . . . Rest of the code . . .
    }
```

2. Incorrect `datasetId` would overwrite someone else’s values as well as incorrect `_impacts` calculated for both `proposalId` and `datasetId` can be seen inside the [`ServiceNft::updateImpact`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ServiceNft.sol# L90):
```

    function updateImpact(uint256 virtualId, uint256 proposalId) public {

       // . . . Rest of the code . . .

        uint256 datasetId = IContributionNft(contributionNft).getDatasetId(proposalId);     <<@ -- // Incorrect datasetId

        _impacts[proposalId] = rawImpact;
        if (datasetId > 0) {
            _impacts[datasetId] = (rawImpact * datasetImpactWeight) / 10000;                <<@ -- // Incorrect impact calculated
            _impacts[proposalId] = rawImpact - _impacts[datasetId];                         <<@ -- // Incorrect impact calculated
            emit SetServiceScore(datasetId, _maturities[proposalId], _impacts[datasetId]);
            _maturities[datasetId] = _maturities[proposalId];
        }

       // . . . Rest of the code . . .
    }
```

This clearly breaks three functionalities:

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

3. [`AgentDAO::_calcMaturity`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/virtualPersona/AgentDAO.sol# L179) uses [`ContributionNft::getCore`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ContributionNft.sol# L124) which would calculate incorrect core allowing to manipulate `coreService`:
```

    function _calcMaturity(uint256 proposalId, uint8[] memory votes) internal view returns (uint256) {
        address contributionNft = IAgentNft(_agentNft).getContributionNft();
        address serviceNft = IAgentNft(_agentNft).getServiceNft();
        uint256 virtualId = IContributionNft(contributionNft).tokenVirtualId(proposalId);
        uint8 core = IContributionNft(contributionNft).getCore(proposalId);                 <<@ -- // Hence, calculating incorrect core.
        uint256 coreService = IServiceNft(serviceNft).getCoreService(virtualId, core);
        // All services start with 100 maturity
        uint256 maturity = 100;
        if (coreService > 0) {
            maturity = IServiceNft(serviceNft).getMaturity(coreService);
            maturity = IEloCalculator(IAgentNft(_agentNft).getEloCalculator()).battleElo(maturity, votes);
        }

        return maturity;
    }
```

### Recommended mitigation steps

Due to lack of documentation, from my personal understanding the [comment](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ContributionNft.sol# L33) helps in inferring that the function was meant to be guarded:
```

    address private _admin; // Admin is able to create contribution proposal without votes
```

Allowing only an operator or admin to call the [`ContributionNft::mint`](https://github.com/code-423n4/2025-04-virtuals-protocol/blob/28e93273daec5a9c73c438e216dde04c084be452/contracts/contribution/ContributionNft.sol# L65) should mitigate the issue:
```

require(_msgSender() == _admin, "Only admin can set elo calculator");
```


```

    function mint(
        address to,
        uint256 virtualId,
        uint8 coreId,
        string memory newTokenURI,
        uint256 proposalId,
        uint256 parentId,
        bool isModel_,
        uint256 datasetId
    ) external returns (uint256) {
+       require(_msgSender() == _admin, "Only admin can mint tokens");
        IGovernor personaDAO = getAgentDAO(virtualId);
```

**Virtuals marked as informative**

---
