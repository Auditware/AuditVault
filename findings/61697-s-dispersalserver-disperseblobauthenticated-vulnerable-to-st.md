---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/restaking
protocol: "[[EigenDA]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[dos-resistance]]"
---
# (s *DispersalServer) DisperseBlobAuthenticated() vulnerable to stream exhaustion DOS

- id: 61697
- impact: HIGH
- protocol: [[EigenDA]] vCISO
- reporter: DTheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Eigenlayer-Spearbit-vCISO-February-2025.pdf

## Summary


This bug report discusses an issue with the Disperser Server, which does not include a timeout in the authentication challenge flow. This can lead to a malicious actor opening multiple streams and tying up resources, potentially preventing the server from responding to new API requests. The report recommends creating a timeout for the gRPC stream for all disperser API handlers to address this issue.

## Details

## Critical Risk Report

## Severity
**Critical Risk**

## Context
- `disperser/apiserver/server.go#L132`
- `disperser/cmd/apiserver/main.go#L126`

## Description
The Disperser Server does not include a timeout in the authentication challenge flow. This makes it possible for a malicious actor to open up multiple streams that will tie up resources. It may be possible to hold the default max file descriptor count of a process (1024 in Linux-based systems) and prevent the disperser from being able to respond to new API requests.

In `disperser/apiserver/server.go#L132`, a gRPC stream is used to handle DisperseBlobAuthenticated requests. This stream appears to enable bidirectional and stateful communication for a cryptographic challenge and public key verification. The issue is that the `secondRecv()` call on the stream will wait for the response without a timeout.

```go
challenge := rand.Uint32()
err = stream.Send(&pb.AuthenticatedReply{Payload: &pb.AuthenticatedReply_BlobAuthHeader{
    BlobAuthHeader: &pb.BlobAuthHeader{
        ChallengeParameter: challenge,
    },
}})
if err != nil {
    return err
}
// Receive challenge_reply
in, err = stream.Recv()
if err != nil {
    return fmt.Errorf("error receiving next message: %v", err)
}
```

Since the `stream.Recv()` method in gRPC Go does not have a built-in timeout, it requires specifically setting one using a context with a deadline. However, the context passed to this gRPC server does not use a context with a timeout:

```go
func RunDisperserServer(ctx *cli.Context) error {
    // ...
    // ...
    // ...
    return server.Start(context.Background())
}
```

## Recommendation
Create a timeout for the `gRPC.stream` for all disperser API handlers. This appears to be implemented correctly in the disperser client streams, for example:

```go
disperserClient := disperser_rpc.NewDisperserClient(conn)
ctxTimeout, cancel := context.WithTimeout(ctx, c.config.Timeout)
defer cancel()
// ...
// ...
// ...
reply, err := disperserClient.DisperseBlob(ctxTimeout, request)
if err != nil {
    return nil, nil, err
}
```
