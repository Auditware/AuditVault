---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/privilege-escalation/ownership-transfer
protocol: "[[TraitForge]]"
auditors:
  - "[[inzinko]]"
report: "https://code4rena.com/reports/2024-07-traitforge"
genome:
  - "[[wrong-condition]]"
  - "[[ownership-transfer]]"
  - "[[access-roles]]"
---
# [H-04] Number of entities in generation can surpass the 10k number

- id: 37918
- impact: HIGH
- protocol: [[TraitForge]]
- reporter: inzinko (Code4rena)
- source: https://code4rena.com/reports/2024-07-traitforge

## Summary


The bug report states that there is a problem with the function that increments the generation in a game. This can lead to incorrect calculations of the number of entities in the new generation. This means that users can create entities that will belong to the next generation and when the generation is incremented, these entities will not be counted. The report provides a proof of concept by running a test file which shows the incorrect calculation of the number of entities in a given generation. The impact of this bug is significant as it can potentially break the economy of the game. The recommended mitigation step is to not reset the `genMintCount` of the generation.

## Details


Increment generation function sets the count of the entites of the new generation to 0, which could lead to incorrect calculations of the entities in new generation. What can happen is that users will forge entities that will belong to the next generation, and then via the `mintToken` function the generation will be incremented and `genMintCount` will be reset for the next generation, which means that all forged entities will not be counted.

### Proof of Concept

Create new test file, paste the code below and run it. The tests show incorrect calculation of the number of entities of a given generation.

<details>

```
import {
  Airdrop,
  DevFund,
  EntityForging,
  EntropyGenerator,
  EntityTrading,
  NukeFund,
  TraitForgeNft,
} from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import generateMerkleTree from '../scripts/genMerkleTreeLib';
import { fastForward } from '../utils/evm';
import { N, parseEther } from 'ethers';

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TraitForgeNFT', () => {
  let entityForging: EntityForging;
  let entropyGeneratorContract: EntropyGenerator;
  let nft: TraitForgeNft;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let entityTrading: EntityTrading;
  let nukeFund: NukeFund;
  let devFund: DevFund;
  let merkleInfo: any;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TraitForgeNft contract
    const TraitForgeNft = await ethers.getContractFactory('TraitForgeNft');
    nft = (await TraitForgeNft.deploy()) as TraitForgeNft;

    // Deploy Airdrop contract
    const airdropFactory = await ethers.getContractFactory('Airdrop');
    const airdrop = (await airdropFactory.deploy()) as Airdrop;

    await nft.setAirdropContract(await airdrop.getAddress());

    await airdrop.transferOwnership(await nft.getAddress());

    // Deploy EntityForging contract
    const EntropyGenerator = await ethers.getContractFactory(
      'EntropyGenerator'
    );
    const entropyGenerator = (await EntropyGenerator.deploy(
      await nft.getAddress()
    )) as EntropyGenerator;

    await entropyGenerator.writeEntropyBatch1();

    entropyGeneratorContract = entropyGenerator;

    await nft.setEntropyGenerator(await entropyGenerator.getAddress());

    // Deploy EntityForging contract
    const EntityForging = await ethers.getContractFactory('EntityForging');
    entityForging = (await EntityForging.deploy(
      await nft.getAddress()
    )) as EntityForging;
    await nft.setEntityForgingContract(await entityForging.getAddress());

    devFund = await ethers.deployContract('DevFund');
    await devFund.waitForDeployment();

    const NukeFund = await ethers.getContractFactory('NukeFund');

    nukeFund = (await NukeFund.deploy(
      await nft.getAddress(),
      await airdrop.getAddress(),
      await devFund.getAddress(),
      owner.address
    )) as NukeFund;
    await nukeFund.waitForDeployment();

    await nft.setNukeFundContract(await nukeFund.getAddress());

    entityTrading = await ethers.deployContract('EntityTrading', [
      await nft.getAddress(),
    ]);

    // Set NukeFund address
    await entityTrading.setNukeFundAddress(await nukeFund.getAddress());

    merkleInfo = generateMerkleTree([
      owner.address,
      user1.address,
      user2.address,
    ]);

    await nft.setRootHash(merkleInfo.rootHash);
  });

  describe('POC: Mint with budget cannot be used after 10_000 nft has been minted', async () => {
    /// End of whitelist
    it('Should mint with budget', async () => {
      ///Due to the bug in incrementGeneration function we need to transferOwnership to the nft contract so the incorrect functionality can be shown
      await entropyGeneratorContract
        .connect(owner)
        .transferOwnership(await nft.getAddress());
      fastForward(24 * 60 * 60 + 1);

      await nft.connect(user1).mintToken([], {
        value: ethers.parseEther('1'),
      });
      await nft.connect(user1).mintToken([], {
        value: ethers.parseEther('1'),
      });

      const token_1_entropy = await nft.getTokenEntropy(1);
      const token_2_entropy = await nft.getTokenEntropy(2);
      //  uint8 forgePotential = uint8((entropy / 10) % 10);
      const token1ForgePotential = (token_1_entropy / BigInt(10)) % BigInt(10);
      const token2ForgePotential = (token_2_entropy / BigInt(10)) % BigInt(10);

      expect(token1ForgePotential).to.be.eql(BigInt(5));

      const isToken_1_Forger =
        token_1_entropy % BigInt(3) == BigInt(0) ? true : false;
      const isToken_2_Merger =
        token_2_entropy % BigInt(3) != BigInt(0) ? true : false;

      expect(isToken_1_Forger).to.be.eql(true);
      expect(isToken_2_Merger).to.be.eql(true);

      await nft
        .connect(user1)
        .transferFrom(user1.getAddress(), user2.getAddress(), 2);

      const ownerOfToken1 = await nft.ownerOf(1);
      const ownerOfToken2 = await nft.ownerOf(2);

      expect(ownerOfToken1).to.be.eql(await user1.getAddress());
      expect(ownerOfToken2).to.be.eql(await user2.getAddress());

      ///Minting 10k tokens so the next token to be minted is from the next generation
      for (let i = 0; i < 9998; i++) {
        await nft.connect(user2).mintToken([], {
          value: ethers.parseEther('1'),
        });
        console.log('FINISHED: ');
        console.log(i);
      }

      const currentGen = await nft.getGeneration();
      const lastMintedTokenGeneration = await nft.getTokenGeneration(10_000);

      expect(currentGen).to.be.eql(BigInt(1));
      expect(lastMintedTokenGeneration).to.be.eql(BigInt(1));

      await entityForging.connect(user1).listForForging(1, parseEther('0.01'));
      await entityForging
        .connect(user2)
        .forgeWithListed(1, 2, { value: parseEther('0.01') });

      const forgedTokenGeneration = await nft.getTokenGeneration(10_001);
      expect(forgedTokenGeneration).to.be.eql(BigInt(2));

      const generation2MintCount = await nft.generationMintCounts(2);

      //there is one recorded entity belonging to gen2 after forging
      expect(generation2MintCount).to.be.eql(BigInt(1));

      await nft.connect(user1).mintToken([], {
        value: ethers.parseEther('1'),
      });

      const generation2MintCountAfterIncrementingGeneration =
        await nft.generationMintCounts(2);
      expect(generation2MintCountAfterIncrementingGeneration).to.be.eql(
        BigInt(1)
      );

      const generationOfFirstGeneration2TokenByMint =
        await nft.getTokenGeneration(10_002);

      //there is one recorded entity belonging to gen2 after minting. The contract does not account the previously forged entity which proves that the 10k cap per generation can be surpassed
      expect(generationOfFirstGeneration2TokenByMint).to.be.eql(BigInt(2));

      ///transaction reverts because token does not exists
      const tx = nft.ownerOf(10_003);
      await expect(tx).to.be.revertedWith('ERC721: invalid token ID');
    });
  });
});
```

</details>

### Impact

The main invariant of the protocol is broken, thus potentially breaking the economy of the game.

### Recommended Mitigation Steps

Do not reset the `genMintCount` of the generation.

**[TForge1 (TraitForge) confirmed](https://github.com/code-423n4/2024-07-traitforge-findings/issues/219#event-13827202751)**

***
