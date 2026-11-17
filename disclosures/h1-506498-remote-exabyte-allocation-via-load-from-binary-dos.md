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
