---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/dex
protocol: "[[Decent]]"
auditors:
  - "[[3]]"
report: "https://code4rena.com/reports/2024-01-decent"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# [H-01] Anyone can update the address of the Router in the DcntEth contract to any address they would like to set.

- id: 30559
- impact: HIGH
- protocol: [[Decent]]
- reporter: 3 (Code4rena)
- source: https://code4rena.com/reports/2024-01-decent

## Summary


The report details a bug in the DcntEth contract, which allows anyone to set the address of the Router contract to any address they want. This can be exploited by malicious users to gain access to the mint and burn functions of the DcntEth contract. This could lead to various consequences such as disrupting the crosschain accounting mechanism, stealing deposited funds, or causing a denial of service attack. The report recommends implementing an access control mechanism to limit who can set the address of the Router in the DcntEth contract. This bug has been confirmed by the Decent team and has been classified as high-risk.

## Details


By allowing anybody to set the address of the Router contract to any address they want to set it allows malicious users to get access to the mint and burn functions of the DcntEth contract.

### Proof of Concept

The [`DcntEth::setRouter() function`](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DcntEth.sol#L20-L22) has not an access control to restrict who can call this function. This allows anybody to set the address of the router contract to any address they'd like to set it.

> DcntEth.sol

```solidity
//@audit-issue => No access control to restrict who can set the address of the router contract
function setRouter(address _router) public {
    router = _router;
}
```

The functions [`DcntEth::mint() function`](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DcntEth.sol#L24-L26) & [`DcntEth::burn() function`](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DcntEth.sol#L28-L30) can be called only by the router contract.

> DcntEth.sol

```solidity

    //@audit-info => Only the router can call the mint()
    function mint(address _to, uint256 _amount) public onlyRouter {
        _mint(_to, _amount);
    }

    //@audit-info => Only the router can call the burn()
    function burn(address _from, uint256 _amount) public onlyRouter {
        _burn(_from, _amount);
    }
```

A malicious user can set the address of the router contract to an account of their own and:

1.  Gain access to mint unlimited amounts of DcntEth token, which could be used to disrupt the crosschain accounting mechanism, or to steal the deposited weth in the DecentEthRouter contract.
2.  Burn all the DcntEth tokens that were issued to the DecentEthRouter contract when liquidity providers deposited their WETH or ETH into it.
3.  Cause a DoS to the add and remove liquidity functions of the DecentEthRouter contract. All of these functions end up calling the [`DcntEth::mint() function`](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DcntEth.sol#L24-L26) or the [`DcntEth::burn() function`](https://github.com/decentxyz/decent-bridge/blob/7f90fd4489551b69c20d11eeecb17a3f564afb18/src/DcntEth.sol#L28-L30), if the router address is set to be different than the address of the DecentEthRouter, all the calls made from the DecentEthRouter to the DcnEth contract will revert.

> DecentEthRouter.sol

<details>

```solidity

    /// @inheritdoc IDecentEthRouter
    function addLiquidityEth()
        public
        payable
        onlyEthChain
        userDepositing(msg.value)
    {
        weth.deposit{value: msg.value}();
        
        //@audit-issue => If router in the dcnteth contract is not set to the address of the DecentEthRouter, this call will revert
        dcntEth.mint(address(this), msg.value);
    }

    /// @inheritdoc IDecentEthRouter
    function removeLiquidityEth(
        uint256 amount
    ) public onlyEthChain userIsWithdrawing(amount) {

      //@audit-issue => If router in the dcnteth contract is not set to the address of the DecentEthRouter, this call will revert
        dcntEth.burn(address(this), amount);
        weth.withdraw(amount);
        payable(msg.sender).transfer(amount);
    }

    /// @inheritdoc IDecentEthRouter
    function addLiquidityWeth(
        uint256 amount
    ) public payable userDepositing(amount) {
        weth.transferFrom(msg.sender, address(this), amount);

        //@audit-issue => If router in the dcnteth contract is not set to the address of the DecentEthRouter, this call will revert
        dcntEth.mint(address(this), amount);
    }

    /// @inheritdoc IDecentEthRouter
    function removeLiquidityWeth(
        uint256 amount
    ) public userIsWithdrawing(amount) {

      //@audit-issue => If router in the dcnteth contract is not set to the address of the DecentEthRouter, this call will revert
        dcntEth.burn(address(this), amount);
        weth.transfer(msg.sender, amount);
    }
```

</details>

### Recommended Mitigation Steps

Make sure to add an Acess Control mechanism to limit who can set the address of the Router in the DcnEth contract.


**[0xsomeone (Judge) commented](https://github.com/code-423n4/2024-01-decent-findings/issues/721#issuecomment-1925323247):**
 > This and all relevant submissions correctly specify that the lack of access control in the `DcntEth::setRouter` function can be exploited maliciously and effectively compromise the entire TVL of the Decent ETH token.
> 
> A high-risk severity is appropriate, and this submission was selected as the best due to detailing all possible impacts:
> 
> - Arbitrary mints of the token to withdraw funds provided as liquidity to `UTB`
> - Arbitrary burns to sabotage liquidity pools and other escrow-based contracts
> - Sabotage of liquidity provision function invocations

**[wkantaros (Decent) confirmed](https://github.com/code-423n4/2024-01-decent-findings/issues/721#issuecomment-1942664512)**

***
