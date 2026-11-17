---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2019-07-03
submitted: 2019-03-30T20:31:23.902Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/monero|Monero]]"
reporter: "guido"
source: "https://hackerone.com/reports/519120"
title: "Computing hash of crafted block leads to crash in tree_hash()"
---
# Computing hash of crafted block leads to crash in tree_hash()

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Monero | **Disclosed:** 2019-07-03

- Report: [https://hackerone.com/reports/519120](https://hackerone.com/reports/519120)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2019-03-30T20:31:23.902Z

## Timeline

- **Report Filed**
- **2019-03-30** @guido: Related:

I would use

```c
memset(ints, 0 , cnt * HASH_SIZE);
```

instead of 
```c
memset(ints, 0 , sizeof(ints));
```

and I would change the asserts in ```tree_hash_cnt``` to exception throws just in case someone manages to reach this code with a tx_hashes size of ```0x10000000```:

```c
size_t tree_hash_cnt(size_t count) {
    // This algo has some bad history but all we are doing is 1 << floor(log2(count))
    // There are _many_ ways to do log2, for some reason the one selected was the most obscure one,
    // and fixing it made it even more obscure.
    //  
    // Iterative method implemented below aims for clarity over speed, if performance is needed
    // then my advice is to use the BSR instruction on x86
    //  
    // All the paranoid asserts have been removed since it is trivial to mathematically prove that
    // the return will always be a power of 2.
    // Problem space has been defined as 3 <= count <= 2^28. Of course quarter of a billion transactions
    // is not a sane upper limit for a block, so there will be tighter limits in other parts of the code

    assert( count >= 3 ); // cases for 0,1,2 are handled elsewhere
    assert( count <= 0x10000000 ); // sanity limit to 2^28, MSB=1 will cause an inf loop

    size_t pow = 2;
    while(pow < count) pow <<= 1;
    return pow >> 1;
}
```
- **Report Triaged**
- **Report Triaged**
- **2019-04-29** @guido: Can you please proceed to rewarding this report please? Both the bug and the fix are evident.

48XB817vPzmEhwEGvw5zcLSnT1aRMBbN1jQUnUXMLpoyJE7jgXpdPsUNYgXg3ddcKbA2u3wpGqmHhT3DbTZCMjmV6vSY3bt

Thanks
- **2019-04-30** @anonimal: Yes, we will respond soon.
- **2019-04-30** @luigi1111w: Sent 2 XMR: <a1d21945bb6097004795fbb00760ec9a9a8649f9830dd73adefee518dad64dd1>
- **Swag Awarded**
- **2019-04-30** @guido: Thanks. Why 2 XMR and some others 10 XMR?
- **Report Resolved**
- **2019-04-30** @anonimal: Hi @guido.

The decision for bounty reward was based on the following factors:

1. As always, with any report, bounty amount is subjectively distributed based on both the criteria of severity and the percentage of bounty available per severity. This report was considered `LOW` severity but, of course, it was very helpful and appreciated. 
2. As noted in our VRP: `DoS's which do not crash a node remotely will receive a lower bounty reward` so,since you've stated `I'm not sure how to test this against against an actual Monero instance, so I'm instead showing an isolated PoC`,  we cannot release larger bounty at this time (for this report).

Please continue your great work, we are very appreciative of your efforts and reports.
- **Agreed On Going Public**
- **Manually Disclosed**
