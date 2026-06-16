---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/infra
  - sector/restaking
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# getBlobFromRequest() vulnerable to resource consumption related DOS (CPU/memory/disk)

- id: 61700
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report highlights a potential high-risk issue in the function `getBlobFromRequest()` in the `disperser/apiserver/server.go` file. The function makes allocations in a loop before checking the size of `Blob.data` or the number of `SecurityParams`, which can be exploited by a malicious node to consume large amounts of resources, potentially causing a denial of service attack. The report suggests adding size checks for `Blob.data` and `SecurityParams` before making allocations or logging their values to prevent this issue.

## Details

## Severity: High Risk

## Context
`disperser/apiserver/server.go#L630`

## Description
The function `getBlobFromRequest()` makes allocations in a loop before checking the size of `Blob.data` or the number of `SecurityParams`. This information is checked later on, as it is included in the various checks in `(s *DispersalServer) validateBlobRequest()`, but this occurs after a second set of allocations is made for the data. Since there is no length check prior to this point, it is possible for a malicious node to force allocation of large amounts of blob data or a large number of `SecurityParams`, opening up a potential resource consumption-related DOS vector.

The worst-case resource usage is likely the number of `SecurityParams` that can fit in a 300MB protobuf message (`server.go#L588`), which will cause this function to iterate a for loop a significant number of times (~40MM at 8 bytes per `SecurityParam`):

```go
for i, param := range req.GetSecurityParams() {
    params[i] = &core.SecurityParam{
        QuorumID: core.QuorumID(param.QuorumId),
        AdversaryThreshold: uint8(param.AdversaryThreshold),
        QuorumThreshold: uint8(param.QuorumThreshold),
    }
}
```

This will also log the entirety of the security params values to disk in `(s *DispersalServer) disperseBlob()` right before the final rejection of the message in `validateBlobRequest()`:

```go
s.logger.Debug("received a new disperse blob request", "origin", origin, "securityParams", strings.Join(securityParamsStrings, ", "))
err = s.validateBlobRequest(ctx, blob)
```

An attacker will not be rate-limited here because their blob will be rejected after the damage is done, but before the rate limit functionality is reached. They can likely fill a disk in a reasonable amount of time (e.g., in less than a day, you can easily fill a 1TB disk with the 300MB protobuf message limits).

Assuming rate limits are enforced properly and Debug logging is off, this may be handled decently by a well-resourced machine. However, the CPU usage and memory allocations can be entirely prevented with a `len(req.SecurityParams) <= 256` check here.

## Recommendation
Add size checks for `Blob.data` <= 2MB and `# SecurityParams` <= 256 before making allocations or logging their values.
