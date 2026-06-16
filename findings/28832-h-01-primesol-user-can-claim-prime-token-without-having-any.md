---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/staking
protocol: "[[Venus]]"
auditors:
  - "[[santipu_]]"
report: "https://code4rena.com/reports/2023-09-venus"
genome:
  - "[[wrong-condition]]"
  - "[[reward-theft]]"
  - "[[access-roles]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Prime.sol - User can claim Prime token without having any staked XVS, because his `stakedAt` isn't reset whenever he is issued an irrevocable token

- id: 28832
- impact: HIGH
- protocol: [[Venus]] Protocol
- reporter: santipu\_ (Code4rena)
- source: https://code4rena.com/reports/2023-09-venus

## Summary


This bug report is about an issue in the Venus Protocol when a new Prime token is created. Whenever a user `claim`s a revocable token or is `issue`d a revocable token, the user's `stakedAt` is reset to 0. However, this does not happen when a user is `issue`d an irrevocable token. This allows users to `claim` a revocable token without having any XVS staked in the contract, which is a problem. 

To prove this, a proof of concept was created using Hardhat. It simulated a user depositing 10k XVS, the protocol/DAO/admin issuing an irrevocable Prime token, the user withdrawing her entire balance XVS, the token being burned by the protocol, and 100 days passing. After this, the user was able to claim a revocable Prime token without any XVS staked. 

The recommended mitigation steps is to reset the user's `stakedAt` whenever he is issued an irrevocable token. This was confirmed and commented on by chechu (Venus) and 0xDjango (Judge).

## Details


Whenever a new Prime token is created, the users `stakedAt` is reset to 0. This happens when the user `claim` a revocable token and when he is `issue` a revocable token, but it does not happen when a user is `issue` an irrevocable token.

This is `issue()`

```javascript
function issue(bool isIrrevocable, address[] calldata users) external {
        _checkAccessAllowed("issue(bool,address[])");

        if (isIrrevocable) {
            for (uint256 i = 0; i < users.length; ) {
                Token storage userToken = tokens[users[i]];
                if (userToken.exists && !userToken.isIrrevocable) {
                    _upgrade(users[i]);
                } else {
                    // We don't reset here.
                    _mint(true, users[i]);
                    _initializeMarkets(users[i]);
                }

                unchecked {
                    i++;
                }
            }
        } else {
            for (uint256 i = 0; i < users.length; ) {
                _mint(false, users[i]);
                _initializeMarkets(users[i]);
                
                // We reset stakedAt here
                delete stakedAt[users[i]];

                unchecked {
                    i++;
                }
            }
        }
    }
```

We can see that when a revocable token is issued and minted the user's `stakedAt` is reset to 0. Whenever a user's token is upgraded, his `stakedAt` has already been reset to 0 inside `claim`.

```javascript
function claim() external {
        if (stakedAt[msg.sender] == 0) revert IneligibleToClaim();
        if (block.timestamp - stakedAt[msg.sender] < STAKING_PERIOD) revert WaitMoreTime();
        
        // We reset stakedAt here
        stakedAt[msg.sender] = 0;

        _mint(false, msg.sender);
        _initializeMarkets(msg.sender);
    }
```

The only one time when we don't reset the user's `stakedAt` and it's when he is issued an irrevocable token.

Let's see an example and see why this is a problem:

1.  Alice deposits 10k XVS.
2.  The protocol/DAO/admin decides to issue Alice an irrevocable prime token, because she deposited such a large amount of tokens. Keep in mind that the 90 day staking period still hasn't passed and her `stakedAt` is the original time that she deposited 10k XVS.
3.  Time passes and Alice decides to withdraw her entire XVS, so now she has 0 XVS. Her token isn't burned as she has an irrevocable token.
4.  Even more time passes and the protocol/DAO/admin decides to burn Alice's irrevocable token because she is inactive.
5.  EVEN more time passes and Alice returns to the protocol and instead of depositing anything, she calls `claim`.

Her tx goes through, since her `stakedAt` wasn't reset to 0 when she got issued her irrevocable token.

This way, Alice claimed a revocable token without having any XVS staked in the contract.

### Proof of Concept

Add the following line at the top of `tests/hardhat/Prime/Prime.ts`. We'll use this to simulate time passing

```javascript
import { time } from "@nomicfoundation/hardhat-network-helpers";
```

Paste the following inside `tests/hardhat/Prime/Prime.ts` and run `npx hardhat test tests/hardhat/Prime/Prime.ts`.

```javascript
it.only("User can get Prime token without any XVS staked", async () => {
      // User1 deposits 10k XVS
      await xvs.transfer(await user1.getAddress(), parseUnits("10000", 18));
      await xvs.connect(user1).approve(xvsVault.address, parseUnits("10000", 18));
      await xvsVault.connect(user1).deposit(xvs.address, 0, parseUnits("10000", 18));
      let userInfo = await xvsVault.getUserInfo(xvs.address, 0, user1.getAddress());
      expect(userInfo.amount).to.eq(parseUnits("10000", 18));

      // Venus decides to issue an irrevocable Prime token to User1 for staking such a large amount.
      // Note that the 90 day staking period still hasn't passed
      await prime.issue(true, [user1.getAddress()]);
      let token = await prime.tokens(user1.getAddress());
      expect(token.exists).to.be.equal(true);
      expect(token.isIrrevocable).to.be.equal(true);

      // User1 withdraws her entire balance XVS
      await xvsVault.connect(user1).requestWithdrawal(xvs.address, 0, parseUnits("10000", 18));
      userInfo = await xvsVault.getUserInfo(xvs.address, 0, user1.getAddress());
      expect(userInfo.pendingWithdrawals).to.eq(parseUnits("10000", 18));

      // User1's Prime token gets burned by protocol
      await prime.burn(user1.getAddress());
      token = await prime.tokens(user1.getAddress());
      expect(token.exists).to.be.equal(false);
      expect(token.isIrrevocable).to.be.equal(false);

      // 100 days pass
      await time.increase(8640000);

      // User1 can claim a revocable Prime token without any XVS staked, because his stakedAt wasn't reset to 0
      expect(prime.stakedAt(await user1.getAddress())).to.not.be.equal(0);

      await prime.connect(user1).claim();
      token = await prime.tokens(user1.getAddress());
      expect(token.exists).to.be.equal(true);
      expect(token.isIrrevocable).to.be.equal(false);
    });
```

If you are having trouble running the test, this change might fix it. Inside `Prime.sol`, `burn()` remove the access control from the function. This doesn't change the attack and the test outcome.

```javascript
function burn(address user) external {
        // _checkAccessAllowed("burn(address)");
        _burn(user);
    }
```

### Tools Used

Hardhat

### Recommended Mitigation Steps

Reset the user's `stakedAt` whenever he is issued an irrevocable token.

```javascript
function issue(bool isIrrevocable, address[] calldata users) external {
        _checkAccessAllowed("issue(bool,address[])");

        if (isIrrevocable) {
            for (uint256 i = 0; i < users.length; ) {
                Token storage userToken = tokens[users[i]];
                if (userToken.exists && !userToken.isIrrevocable) {
                    _upgrade(users[i]);
                } else {
                    _mint(true, users[i]);
                    _initializeMarkets(users[i]);
                    delete stakedAt[users[i]]; 
                }
          ...

```

**[chechu (Venus) confirmed and commented](https://github.com/code-423n4/2023-09-venus-findings/issues/633#issuecomment-1777540916):**
 > Fixed [here](https://github.com/VenusProtocol/venus-protocol/commit/9d318165333b5ae4d2350a4b674d7d7237066642).

**[0xDjango (Judge) commented](https://github.com/code-423n4/2023-09-venus-findings/issues/633#issuecomment-1787932866):**
 > Valid issue with serious impact to the protocol.


***
