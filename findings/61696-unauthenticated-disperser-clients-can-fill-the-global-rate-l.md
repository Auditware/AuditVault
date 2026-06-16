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
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Unauthenticated disperser clients can fill the global rate limit even if unauthRates are 0

- id: 61696
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report discusses a critical risk issue with the disperser server, which could allow unauthorized clients to fill the global rate limits and prevent authorized clients from requesting blob dispersal. The issue lies in the `disperseBlob()` function, where a malicious blob can pass validation checks and the global rate limit is updated even for unauthorized clients. This allows unauthorized adversaries to prevent authorized clients from dispersing blobs. The report recommends moving the authorization check to the top of the request handlers and implementing origin-based rate limiting to prevent abuse of the challenge/response flow.

## Details

## Severity: Critical Risk

## Context
- disperser/apiserver/server.go#L230
- disperser/apiserver/server.go#L389

## Description
Unauthenticated disperser clients can fill the global `rate limitsTotalUnauthThroughput` and `TotalUnauthBlobRate` even if the `unauthRates.PerUserUnauthThroughput` and `unauthRates.PerUserUnauthBlobRate` config values are set to zero. This will prevent authorized clients from being able to request blob dispersal.

Both `DisperseBlobAuthenticated` and `DisperseBlob` API calls eventually call `(s *DispersalServer) disperseBlob()` which collects and logs information about the authenticated address (if provided) as well as the origin IP. Blob request validation is then done but a malicious blob can easily be crafted that will pass these checks. 

`disperseBlob()` then calls `s.checkRateLimitsAndAddRates()` which is where the issue lies. `s.getAccountRate()` will correctly return 0 for unauthorized accounts, but before the request is refused, the following global ratelimit checks are done:

```go
// Check System Ratelimit
systemQuorumKey := fmt.Sprintf("%s:%d", systemAccountKey, param.QuorumID)
allowed, err := s.ratelimiter.AllowRequest(ctx, systemQuorumKey, encodedSize, rates.TotalUnauthThroughput)
if err != nil {
    return fmt.Errorf("ratelimiter error: %v", err)
}
if !allowed {
    s.logger.Warn("system byte ratelimit exceeded", "systemQuorumKey", systemQuorumKey, "rate", rates.TotalUnauthThroughput)
    return errSystemThroughputRateLimit
}
systemQuorumKey = fmt.Sprintf("%s:%d-blobrate", systemAccountKey, param.QuorumID)
allowed, err = s.ratelimiter.AllowRequest(ctx, systemQuorumKey, blobRateMultiplier, rates.TotalUnauthBlobRate)
if err != nil {
    return fmt.Errorf("ratelimiter error: %v", err)
}
if !allowed {
    s.logger.Warn("system blob ratelimit exceeded", "systemQuorumKey", systemQuorumKey, "rate", float32(rates.TotalUnauthBlobRate)/blobRateMultiplier)
    return errSystemBlobRateLimit
}
```

The issue is that in these calls to `s.ratelimiter.AllowRequest()`, the `bucketParams.LastRequestTime` is updated, effectively counting against the global rate limit even though the request will ultimately be declined as unauthorized in the account rate limit checks.

```go
func (d *rateLimiter) AllowRequest(ctx context.Context, requesterID common.RequesterID, blobSize uint, rate common.RateParam) (bool, error) {
    // Retrieve bucket params for the requester ID
    // This will be from dynamo for Disperser and from local storage for DA node
    bucketParams, err := d.bucketStore.GetItem(ctx, requesterID)
    // ...
    // ...
    // ...
    // Get interval since last request
    interval := time.Since(bucketParams.LastRequestTime)
    bucketParams.LastRequestTime = time.Now().UTC()
    // ...
    // ...
    // ...
    // Update the bucket based on blob size and current rate
    if allowed || d.globalRateParams.CountFailed {
        // Update bucket params
        err := d.bucketStore.UpdateItem(ctx, requesterID, bucketParams)
        if err != nil {
            return allowed, err
        }
    }
    // ...
    // ...
    // ...
}
```

This effectively makes it possible for an unauthorized adversary to prevent authorized clients from dispersing blobs.

## Recommendation
1. Move the authorization check in `(s *DispersalServer) getAccountRate()` towards the top of the `DisperseBlobAuthenticated` and `DisperseBlob` request handlers to prevent authorized clients from having as much reachable attack surface as possible.
2. Enact origin-based rate limiting at this same location to prevent abuse of the challenge/response flow in `DisperseBlobAuthenticated` API calls.
