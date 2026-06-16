---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Recall]]"
auditors:
  - "[[sin1st3r__]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[missing-auth]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[integer-bounds]]"
---
# [H-08] Permissionless creation of new subnets under gateway will lead to gateway actor fund draining

- id: 65095
- impact: HIGH
- protocol: [[Recall]]
- reporter: sin1st3r\_\_ (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


This bug report highlights a vulnerability in the code for a gateway manager contract. The code currently allows anyone to create a new subnet under the gateway, which could potentially lead to the draining of funds from the gateway. This can be exploited by creating a malicious subnet with a higher collateral amount and then transferring the funds to the attacker's account. To prevent this, it is recommended to add a check to ensure that only authorized users can create new subnets under the gateway.

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/gateway/GatewayManagerFacet.sol# L35>

### Finding description and impact

In the github contest page, it is mentioned that gateways restrict who can create subnets under it. But that’s not the case as creating subnets under the gateway is currently permissionless.

> Gateway manages funds for all registered subnets (cf. “omnibus account”). Funds sit in the subnet actor until the subnet is bootstrapped, at which point the collateral and supply is transferred to the gateway. Gateway will manage the fund and disperse to the subnet upon subnet’s request. This design will cause some security threats as one subnet can potentially impact other subnets. Please check the Problems section of the refactoring proposal. **The mitigation under the current design is for gateways to be single-tenant, i.e. to restrict who can create subnets under it, so all risk is contained under a single owner. In the future, the design will segregate liquidity per subnet into their dedicated actors/contracts.**

Looking at the code of the `GatewayManagerFacet::register()` function:
```

    function register(uint256 genesisCircSupply, uint256 collateral) external payable {
        // If L2+ support is not enabled, only allow the registration of new
        // subnets in the root
        if (s.networkName.route.length + 1 >= s.maxTreeDepth) {
            revert MethodNotAllowed(ERR_CHILD_SUBNET_NOT_ALLOWED);
        }

        SubnetID memory subnetId = s.networkName.createSubnetId(msg.sender);

        (bool registered, Subnet storage subnet) = LibGateway.getSubnet(subnetId);
        if (registered) {
            revert AlreadyRegisteredSubnet();
        }

        subnet.id = subnetId;
        subnet.stake = collateral;
        subnet.genesisEpoch = block.number;
        subnet.circSupply = genesisCircSupply;

        s.subnetKeys.add(subnetId.toHash());
        s.totalSubnets += 1;

        if (genesisCircSupply > 0) {
            SubnetActorGetterFacet(msg.sender).supplySource().lock(genesisCircSupply);
        }
        if (collateral > 0) {
            SubnetActorGetterFacet(msg.sender).collateralSource().lock(collateral);
        }
    }
```


```

    function createSubnetId(SubnetID calldata subnet, address actor) public pure returns (SubnetID memory newSubnet) {
        newSubnet.root = subnet.root;
        uint256 subnetRouteLength = subnet.route.length;
        newSubnet.route = new address[](subnetRouteLength + 1);
        for (uint256 i; i < subnetRouteLength; ) {
            newSubnet.route[i] = subnet.route[i];
            unchecked {
                ++i;
            }
        }

        newSubnet.route[newSubnet.route.length - 1] = actor;
    }
```

As it is observed in the code, there are no checks to see if `msg.sender` is allowed to create a new subnet under the gateway or not. This can be exploited to drain all of the funds in the gateway actor contract.

### Exploit

Draining the funds of the gateway actor contract by creating a malicious subnet. This vulnerability can be exploited to drain the funds of the gateway actor contract as follows:

1. Suppose the gateway actor contract currently holds 10,000 USDT ERC20 tokens which an attacker wants to hijack.
2. The attacker will create a malicious subnet actor contract which has a collateral source and supply source assets of a malicious ERC20 token created by the attacker, and then deploys that malicious subnet actor contract.
3. The malicious subnet actor contract will call the function `GatewayManagerFacet::register()`, with the following arguments:

   * `genesisCircSupply` `-> 0`
   * `collateral` `-> 10,000`.

   The subnet will then be registered and it will have a stake of 10,000.
4. The malicious subnet actor contract will change its collateral source token from malicious ERC20 token to USDT.
5. The malicious subnet actor will call the function `GatewayManagerFacet::releaseStake()` with an `amount` argument of `10,000`.
6. 10,000 USDT will be sent to the malicious subnet actor created by the attacker.

An alternative way to exploit this and drain native ETH funds is to call `register()` and supply a `genesisCircSupply` of `1000 eth` and `collateral` of `1000 eth` while having both `supplySource` and `collateralSource` set to be native ETH, and while only sending a `msg.value` of `1000 eth` (should be `2000 eth`). This will work and the `register()` function will gladly accept this because of the check `require(msg.value >= value, "Insufficient funds");` which is called twice where value is `1000`, not `2000`.
```

    function register(uint256 genesisCircSupply, uint256 collateral) external payable {
        ......................

        if (genesisCircSupply > 0) {
            SubnetActorGetterFacet(msg.sender).supplySource().lock(genesisCircSupply);
        }
        if (collateral > 0) {
            SubnetActorGetterFacet(msg.sender).collateralSource().lock(collateral);
        }
    }
```


```

    function lock(Asset memory asset, uint256 value) internal returns (uint256) {
        if (asset.kind == AssetKind.ERC20) {
            IERC20 token = IERC20(asset.tokenAddress);

            // Dealing with deflationary tokens.
            uint256 initialBalance = token.balanceOf(address(this));
            token.safeTransferFrom({from: msg.sender, to: address(this), value: value});
            uint256 finalBalance = token.balanceOf(address(this));
            require(finalBalance > initialBalance, "No balance increase");
            // Safe arithmetic is not necessary because underflow is not possible due to the assert above
            return finalBalance - initialBalance;
        } else {
            // Ensure we have received enough funds to cover the value.
            // msg.value might have coins in excess of the amount that we need to lock (e.g. when contributing both native collateral and supply at the same time).
            // That's why we can't do a strict equality check.
    ------> require(msg.value >= value, "Insufficient funds");
        }
        // Do nothing for native.
        return value;
    }
```

### Recommended mitigation steps

Ensure that the caller of the function `GatewayManagerFacet::register()` is allowed to create a new subnet under the current gateway contract.

---
