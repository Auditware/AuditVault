---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/stable
protocol: "[[RFX]]"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# Execution fee might not be refunded to subaccounts when updating orders

- id: 51986
- impact: HIGH
- protocol: [[RFX]] Contracts
- reporter: Halborn
- source: https://www.halborn.com/audits/rfx-exchange/rfx-contracts

## Summary


The SubaccountRouter contract has a bug where the `execution fee` for orders is not refunded to subaccounts when updating an order. This can cause subaccounts to lose tokens. The bug is caused by the `_autoTopUpSubaccount` function not considering the amount of wrapped native tokens previously deposited by the subaccount. To fix this issue, the current value of the execution fee should be included when topping up subaccounts during order updates. The RFX team has already solved this issue.

## Details

##### Description

When updating an order through the **SubaccountRouter** contract, a subaccount needs to spend some gas and, sometimes, an `execution fee` that must be deposited in advance. The gas spent is refunded to the subaccount, but the execution fee is not. To set the context, it is important to review the **top-up mechanism** of the protocol when a subaccount creates or updates an order through the **SubaccountRouter** contract.

  

When a subaccount creates an order, it needs to spend gas + an `execution fee`. This total value is topped up (i.e., refunded) up to a certain cap to the subaccount after the order is created.

  

On the other hand, when a subaccount updates an order, **only the spent gas is refunded, not the execution fee**. Sometimes, the subaccount doesn't need to add more execution fee, only to modify some parameters. However, in other scenarios is a must to add more execution fee to the orders, as seen in the following example:

  

1. An order is created.
2. A keeper executes the order, but it fails because it is unfulfillable. So, the `execution fee` for the order is now set to **0** and the order is frozen.
3. To unfreeze the order, the subaccount needs to update it. Since the current the current `execution fee` is **0** (see previous step), **the subaccount must have previously deposited an execution fee** to incentivize keepers to execute it.
4. Finally, the gas spent is topped up (i.e., refunded) to the subaccount, but **not the execution fee**.

  

The `execution fee` that subaccounts need to deposit in advance when updating orders is not considered when topping them up. As a result, the execution fee spent might not be correctly refunded to the subaccounts, which economically harms the subaccounts and causes them to lose tokens.

  

Code Location
-------
---
---

The described issue happens because the `SubaccountRouter.updateOrder` function calls `_autoTopUpSubaccount` using **0** as execution fee, instead of relying on the amount of wrapped native tokens previously deposited by the subaccount:

```
_autoTopUpSubaccount(
   order.account(), // account
   msg.sender, // subaccount
   startingGas, // startingGas
   0 // executionFee
);
```

  

It means that when `nativeTokensUsed` is calculated, it will consider `executionFee` as **0**, so the amount transferred to the `subaccount` could be missing the `executionFee`:

```
// cap the top up amount to the amount of native tokens used
uint256 nativeTokensUsed = (startingGas - gasleft()) * tx.gasprice + executionFee;
if (nativeTokensUsed < amount) { amount = nativeTokensUsed; }

router.pluginTransfer(
  address(wnt), // token
  account, // account
  address(this), // receiver
  amount // amount
);

TokenUtils.withdrawAndSendNativeToken(
  dataStore,
  address(wnt),
  subaccount,
  amount
);
```

  

However, the `OrderHandler.updateOrder` function (which is called at some point during the order update operation) adds a new `executionFee` equivalent to the wrapped native tokens previously sent, which can be **greater than zero**, especially if the order was previously frozen (which set the `executionFee` to 0) and needs that someone adds a new `executionFee` **greater than zero** to make it work:

```
// allow topping up of executionFee as frozen orders
// will have their executionFee reduced
address wnt = TokenUtils.wnt(dataStore);
uint256 receivedWnt = orderVault.recordTransferIn(wnt);
order.setExecutionFee(order.executionFee() + receivedWnt);
```

##### Proof of Concept

The proof of concept was directly developed in the already existent `test/guardian/testFrozenOrder.ts` test file, which only needs a couple of minor updates to make the PoC work correctly.

  

**Updates in the test file:**

  

Add the following imports:

```
import { createAccount } from "../../utils/account";
import * as keys from "../../utils/keys";

```

Finally, include `subaccountRouter` and `orderVault` variables in the test file

  

**Step-by-step explanation of the PoC:**

  

1. The `subaccountRouter` is set. It is configured that the subaccount's top-up amount is **0.5 ETH**, which is the cap when refunding to subaccounts.
2. An order is created with **0.3 ETH** as `execution fee`.
3. The order is executed, but it fails because it is unfulfillable. So, the `execution fee` for the order is now set to **0** and the order is frozen.
4. The subaccount **updates the order for the first time** without depositing wrapped native tokens. As expected, the order is unfrozen but the `execute fee` is still **0**. Then, after refunding, the subaccount's balance has been reduced by only **0.000641938502995713 ETH** (partial gas expenses).
5. Finally, the subaccount **updates the order for the second time**, but now depositing **0.3 ETH** as `execution fee`. As expected, the `execute fee` is now **0.3 ETH**. However, after refunding, the subaccount's balance has now been reduced by **0.000667564503115301 ETH** (partial gas expenses), but also by the `execution fee` (**0.3 ETH**).

  

```
  it("Execution fee is not refunded to subaccount when updating order", async () => {

    const subaccount = createAccount();

    // Setting subaccountRouter
    await subaccountRouter
    .connect(user1)
    .multicall(
      [
        subaccountRouter.interface.encodeFunctionData("sendNativeToken", [subaccount.address, expandDecimals(1, 18)]),
        subaccountRouter.interface.encodeFunctionData("addSubaccount", [subaccount.address]),
        subaccountRouter.interface.encodeFunctionData("setMaxAllowedSubaccountActionCount", [
          subaccount.address,
          keys.SUBACCOUNT_ORDER_ACTION,
          20,
        ]),

        /**** STEP 1: SETTING THE SUBACCOUNT TOP-UP AMOUNT ****/
        subaccountRouter.interface.encodeFunctionData("setSubaccountAutoTopUpAmount", [
          subaccount.address,
          expandDecimals(5, 17), // Top up to 0.5 ETH
        ]),
      ],
      { value: expandDecimals(1, 18) }
    );


    /**** STEP 2: A LIMIT INCREASE ORDER IS CREATED ****/
    await createOrder(fixture, {
      account: user1,
      market: ethUsdMarket,
      initialCollateralToken: wnt,
      initialCollateralDeltaAmount: expandDecimals(1, 18),
      sizeDeltaUsd: decimalToFloat(10_000),
      acceptablePrice: expandDecimals(5100, 12),
      triggerPrice: expandDecimals(5000, 12),
      orderType: OrderType.LimitIncrease,
      isLong: true,
      executionFee: expandDecimals(3, 17),
    });

    // Limit order go to future block
    await mine(10);

    const orderKeys = await getOrderKeys(dataStore, 0, 1);

    const orderBeforeExecuted = await reader.getOrder(dataStore.address, orderKeys[0]);
    
    // Check that the order's execution fee is 3e17, i.e.: 0.3 ETH
    expect(orderBeforeExecuted.numbers.executionFee).eq(expandDecimals(3, 17));


    /**** STEP 3: THE ORDER IS EXECUTED AND BECOMES FROZEN ****/
    await executeOrder(fixture, {
      tokens: [wnt.address, usdc.address],
      minPrices: [expandDecimals(5000, 4), expandDecimals(1, 6)],
      maxPrices: [expandDecimals(5000, 4), expandDecimals(1, 6)],
      tokenOracleTypes: [TOKEN_ORACLE_TYPES.DEFAULT, TOKEN_ORACLE_TYPES.DEFAULT],
      precisions: [8, 18],
      expectedFrozenReason: "InsufficientReserve",
    });

    const orderPreUpdate = await reader.getOrder(dataStore.address, orderKeys[0]);
    
    // Check that the order's execution fee is now 0
    expect(orderPreUpdate.numbers.executionFee).eq(0);

    // Check that the order has been frozen
    expect(orderPreUpdate.flags.isFrozen).eq(true);
  
    // ETH balance for subaccount before updating order
    const ethBalancePreUpdate = await ethers.provider.getBalance(subaccount.address);
    

    /**** STEP 4: SUBACCOUNT UPDATES THE ORDER FOR THE FIRST TIME ****/
    // subaccount updates the order to be filled at a different price points this will unfreeze the order
    await subaccountRouter.connect(subaccount).updateOrder(
      orderKeys[0],
      decimalToFloat(10_000), // sizeDeltaUsd
      expandDecimals(5200, 12), // acceptablePrice
      expandDecimals(5200, 12), // triggerPrice
      expandDecimals(52000, 6) // minOutputAmount
    );

    const orderAfterFirstUpdate = await reader.getOrder(dataStore.address, orderKeys[0]);

    // Check that the order's execution fee is still 0
    expect(orderAfterFirstUpdate.numbers.executionFee).eq(0);

    // Check that the order has been unfrozen
    expect(orderAfterFirstUpdate.flags.isFrozen).eq(false);

    // ETH balance for subaccount after first update
    const ethBalanceAfterFistUpdate = await ethers.provider.getBalance(subaccount.address);

    // Gas spent (after top-up) in the first update: 0.000641938502995713 ETH
    const EthSpentFirstUpdate = ethers.BigNumber.from("641938502995713");

    // The difference between the previous and current balance is due to gas expenses
    expect(ethBalancePreUpdate.sub(ethBalanceAfterFistUpdate)).eq(EthSpentFirstUpdate);


    /**** STEP 5: SUBACCOUNT UPDATES THE ORDER FOR THE SECOND TIME ****/
    await subaccountRouter
      .connect(subaccount)
      .multicall(
        [
          subaccountRouter.interface.encodeFunctionData("sendWnt", [orderVault.address, expandDecimals(3, 17)]),
          subaccountRouter.interface.encodeFunctionData("updateOrder",
             [ 
              orderKeys[0],
              decimalToFloat(10_000), // sizeDeltaUsd
              expandDecimals(5200, 12), // acceptablePrice
              expandDecimals(5200, 12), // triggerPrice
              expandDecimals(52000, 6) // minOutputAmount
             ]),
        ],
        { value: expandDecimals(3, 17) }
      );

    const orderAfterSecondUpdate = await reader.getOrder(dataStore.address, orderKeys[0]);

    // Check that the order's execution fee is now 3e17 again, i.e.: 0.3 ETH
    expect(orderAfterSecondUpdate.numbers.executionFee).eq(expandDecimals(3, 17));

    // ETH balance for subaccount after second update
    const ethBalanceAfterSecondUpdate = await ethers.provider.getBalance(subaccount.address);
    
    // Gas spent (after top-up) in the second update: 0.000667564503115301 ETH
    const EthSpentSecondtUpdate = ethers.BigNumber.from("667564503115301");

    // The difference between the previous and current balance is due to execution fee (0.3 ETH) + gas expenses
    // TL;DR: This difference shows that the execution fee is not refunded to the subaccount 
    expect(ethBalanceAfterFistUpdate.sub(ethBalanceAfterSecondUpdate)).eq(orderAfterSecondUpdate.numbers.executionFee.add(EthSpentSecondtUpdate));

  });
```

##### BVSS

[AO:A/AC:L/AX:L/R:N/S:U/C:N/A:N/I:H/D:M/Y:N (8.8)](/bvss?q=AO:A/AC:L/AX:L/R:N/S:U/C:N/A:N/I:H/D:M/Y:N)

##### Recommendation

Include the current value of the execution fee when topping up subaccounts during order updates.

##### Remediation

**SOLVED**: The **RFX team** solved the issue in the specified commit id.

##### Remediation Hash

<https://github.com/relative-finance/rfx-contracts/pull/50/commits/86f5e9398e3e2fbfb7ff21ed8dbd9fbdaa176170>
