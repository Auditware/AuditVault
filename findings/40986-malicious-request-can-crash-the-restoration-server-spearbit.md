---
tags:
  - platform/spearbit
  - lang/solidity
  - has/github
  - has/poc
  - severity/high
  - sector/infra
protocol: "[[Overprotocol]]"
auditors:
  - "[[DTheo]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf"
genome:
  - "[[griefing]]"
  - "[[dos-resistance]]"
  - "[[permanent]]"
---
# Malicious request can crash the restoration server

- id: 40986
- impact: HIGH
- protocol: [[Overprotocol]] vCISO
- reporter: Dtheo (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Overprotocol-Spearbit-vCISO-May-2024.pdf

## Summary


This bug report is about a critical risk issue in a restoration server. The bug is caused by a nil fee being sent in a request, which leads to a panic due to a nil dereference. This is because the required fields are not being properly checked during JSON deserialization. A proof of concept is provided and a test shows that this issue can cause a panic. The recommendation is to add checks to ensure required fields are not nil.

## Details

## Severity: Critical Risk

**Context:** cmd/restoration/server.go#L175

### Description:
An attacker can send a request to a restoration server with a nil `Fee`, which causes it to panic via nil dereference. We believe the authors were working under the assumption that the `gencodec:"required"` struct tags would ensure required fields are non-nil, but this does not apply to JSON deserialization. 

Here's a simple proof of concept:

```go
package main

import (
    "fmt"
    "github.com/gofiber/fiber/v2"
    "math/big"
)

type Foo struct {
    Fee *big.Int `json:"fee" gencodec:"required"`
}

func main() {
    app := fiber.New()
    app.Post("/foo", func(ctx *fiber.Ctx) error {
        foo := new(Foo)
        if err := ctx.BodyParser(foo); err != nil {
            return ctx.Status(400).SendString(err.Error())
        }
        ret := fmt.Sprintf("foo.Fee is %v", foo.Fee)
        return ctx.Status(200).SendString(ret)
    })
    fmt.Println(app.Listen(":3001"))
}
```

A request with a null fee shows that the value can be nil:

```bash
$ curl -X POST \
http://localhost:3001/foo \
-H 'Content-Type: application/json' \
-d '{"fee": null}'
```

Output:
```
foo.Fee is <nil>
```

This matters because when you pass `Fee` to `Cmp`, it will panic if `Fee` is nil.

```go
func TestCmpWithNil(t *testing.T) {
    big.NewInt(64).Cmp(nil)
}
```

This test will panic with the following output:
```
=== RUN   TestCmpWithNil
--- FAIL: TestCmpWithNil (0.00s)
panic: runtime error: invalid memory address or nil pointer dereference [recovered]
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x2 addr=0x0 pc=0x1044cf52c]
```

### Recommendation:
Add new checks in `checkRestoreData` which ensure required fields are not nil.
