---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/options
  - platform/code4rena
protocol: "[[Initia]]"
auditors:
  - berndartmueller
report: "https://code4rena.com/reports/2025-02-initia-cosmos"
genome:
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[dos/gas-limit]]"
  - "[[dos/temporary]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-user]]"
---
# [H-04] JSON-RPC `FilterCriteria.Addresses` are unbound and can be used to DoS the RPC

- id: 55307
- impact: HIGH
- protocol: Initia
- reporter: berndartmueller (Code4rena)
- source: https://code4rena.com/reports/2025-02-initia-cosmos

## Summary


The `eth_getLogs` ETH JSON-RPC method returns a list of logs based on filter criteria, such as specific topics and addresses. However, while there is a limit on the number of topics that can be used, there is no limit on the number of addresses that can be used. This can be exploited to cause a Denial of Service (DoS) attack on the RPC server by sending a large number of addresses in the request. The default request body limit is not sufficient to prevent this attack. The issue has been fixed by adding a maximum limit on the number of addresses that can be used in the request. 

## Details



The `eth_getLogs` ETH JSON-RPC method returns an array of all logs matching a given filter criteria, e.g., a topic list `Topics` and/or a list of addresses (`Addresses`) that restricts matches to events created by specific contracts.

While `Topics` is limited to [`maxTopics = 4`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/jsonrpc/namespaces/eth/filters/api.go# L29), `Addresses` in unbounded.

[`minievm:jsonrpc/namespaces/eth/filters/api.go# L366`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/jsonrpc/namespaces/eth/filters/api.go# L366)
```

358: // GetLogs returns logs matching the given argument that are stored within the state.
359: func (api *FilterAPI) GetLogs(ctx context.Context, crit ethfilters.FilterCriteria) ([]*coretypes.Log, error) {
360: 	if len(crit.Topics) > maxTopics {
361: 		return nil, errExceedMaxTopics
362: 	}
363: 	var filter *Filter
364: 	if crit.BlockHash != nil {
365: 		// Block filter requested, construct a single-shot filter
366: ❌ filter = newBlockFilter(api.logger, api.backend, *crit.BlockHash, crit.Addresses, crit.Topics)
367: 	} else {
```

This can be exploited to DoS the RPC server and bring it to a halt by sending `eth_getLogs` requests with a large number of addresses in the `Addresses` field, which takes a considerable amount of time to process.

It should be noted that the JSON-RPC server has a default request body limit of `~10MB`, which can be adjusted via the [`max-recv-msg-size` configuration option](https://github.com/cosmos/cosmos-sdk/blob/eb1a8e88a4ddf77bc2fe235fc07c57016b7386f0/tools/confix/data/v0.50-app.toml# L166). This at least limits the `Addresses` field to a certain extent. However, the below the PoC demonstrates that this is not sufficient and it is still possible to DoS the server.

The same issue, not having an upper bound on the `Addresses`, is also observed in:

* [`FilterAPI::NewFilter()`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/jsonrpc/namespaces/eth/filters/api.go# L343) and
* [`FilterAPI::Logs()`](https://github.com/initia-labs/minievm/blob/744563dc6a642f054b4543db008df22664e4c125/jsonrpc/namespaces/eth/filters/subscriptions.go# L131)

### Proof of Concept

The following estimation shows how many addresses we can fit within a `~10MB` JSON-RPC request limit:

1. Each Ethereum address is 20 bytes
2. In JSON-RPC format, each address needs to be hex-encoded with “0x” prefix:

   * 20 bytes becomes 40 hex characters
   * Plus “0x” prefix = 42 characters
3. In JSON array format, we need:

   * Quotes around each address: +2 characters = 44 chars per address
   * Commas between addresses: +1 character
   * Square brackets: +2 characters for the whole array
4. Each character in JSON is 1 byte

So for `n` addresses:

* Total bytes = `44n + (n-1) + 2`
* Simplified: `45n + 1 bytes`

With a 10MB (10,485,760 bytes) limit:
```

10,485,760 = 45n + 1
n = (10,485,760 - 1) / 45
n ≈ 232,905 addresses
```

To account for some request overhead, a more conservative estimate would be around **200,000** addresses.

The following test case demonstrates that by providing 200,000 addresses to the `GetLogs` function, the request takes more than 5 seconds to complete. This opens up the possibility of a DoS attack by sending a large number of addresses to the `GetLogs` function and repeating the request to bring the RPC to a halt.

Apply the following git diff and run the `Test_GetLogs` test with `go test -timeout 30s -run ^Test_GetLogs$ ./jsonrpc/namespaces/eth/filters`
```

diff --git a/jsonrpc/namespaces/eth/filters/api_test.go b/jsonrpc/namespaces/eth/filters/api_test.go
index e1ad746..7c27536 100644
--- a/jsonrpc/namespaces/eth/filters/api_test.go
+++ b/jsonrpc/namespaces/eth/filters/api_test.go
@@ -392,10 +392,27 @@ func Test_GetLogs(t *testing.T) {
 		}
 	}

+	// create a massive number of addresses and populate them into `Addresses`
+	numAddresses := 200_000
+	addresses := make([]common.Address, 0, numAddresses)
+	for i := 0; i < numAddresses; i++ {
+		addresses = append(addresses, common.BytesToAddress(contractAddr))
+	}
+
+	// time how long it takes
+	start := time.Now()
+
 	logs, err := input.filterAPI.GetLogs(context.Background(), ethfilters.FilterCriteria{
 		FromBlock: big.NewInt(tx2Height),
+		Addresses: addresses,
 	})
 	require.NoError(t, err)
+
+	elapsed := time.Since(start)
+
+	// assert that it takes at least 5 seconds
+	require.GreaterOrEqual(t, elapsed.Milliseconds(), int64(5_000))
+
 	for _, log := range logs {
 		if log.BlockNumber == uint64(tx3Height) {
 			require.Equal(t, txHash3, log.TxHash)
```

### Recommended mitigation steps

Consider enforcing an upper limit on the number of `Addresses`, similar to how it’s done for `Topics`.

**[beer-1 (Initia) confirmed and commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-9?commentParent=vhzra2sKXiS):**

> This is valid finding, but only consensus breaking and taking over funding related findings can be critical.
>
> Would like to lower severity to medium.

**[LSDan (judge) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-9?commentParent=vhzra2sKXiS&commentChild=FSpbZ9nbVYY):**

> I disagree. This is a direct DDOS vector with next to zero cost. The ease of execution and the potential for overloading every JSON-RPC server simultaneously with a small botnet is enough to justify high risk.

**[beer-1 (Initia) commented](https://code4rena.com/audits/2025-02-initia-cosmos/submissions/F-9?commentParent=vhzra2sKXiS&commentChild=oRypCWySfbG):**

> Fixed [here](https://github.com/initia-labs/minievm/pull/165/commits/024640e8d972e73f9411adbddc8ea2c61a276e69).

**[Initia mitigated](https://github.com/code-423n4/2025-03-initia-cosmos-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Added a max addresses limit.

**Status:** Mitigation confirmed. Full details in reports from [0xAlix2](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-16), [berndartmueller](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-2) and [Franfran](https://code4rena.com/audits/2025-03-initia-cosmos-mitigation-review/submissions/S-37).

---


