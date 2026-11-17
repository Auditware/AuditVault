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
date: 2025-04-23
submitted: 2024-12-23T02:11:16.389Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/monero|Monero]]"
reporter: "sagewilder2022"
source: "https://hackerone.com/reports/2912194"
title: "Remote memory exhaustion in Epee RPC stack under zero Receive Window"
---
# Remote memory exhaustion in Epee RPC stack under zero Receive Window

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Monero | **Disclosed:** 2025-04-23

- Report: [https://hackerone.com/reports/2912194](https://hackerone.com/reports/2912194)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2024-12-23T02:11:16.389Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-12-23** @sagewilder2022: Understood.
- **External User Joined**
- **2025-01-01** @sagewilder2022: Happy new year.
Have you had an opportunity to look and test the PoC?
- **2025-01-03** @selsta: Happy new year. I will ask vtnerd for an update, if he is not able to take a look into the issue at the moment I will invite another developer.
- **2025-01-03** @vtnerd: There's not really much that can be done other than putting some hard cap on the buffer size. The RPC mechanism may need a limit for connections too, not sure how I will mix that in (this is similar to an existing PR).
- **2025-01-03** @sagewilder2022: I've thought of several solutions, ranging from easiest to most challenging to implement:
1. As you proposed, a reduced hard cap taking into account the most voluminous restricted RPC response. Possibly configurable, and with according user documentation.
2. In the same vein, a byte length based cap to the queue. No more than N bytes stored in the send queue, size can be incremented by the length of the response before converting to epee::byte_slice, and decremented when quitting the send queue.
3. Implement a response timeout of 1 second or more for items in the queue, after which the response and socket will be dropped.
4. Keep track of the number of responses for the socket in the send queue, before reading a new request from it. This will decrease the OS receive buffer for the socket, and advertise a receive window of zero for the client, which will block and not be able to send new requests to monerod, until reading responses.

The last two being undeniably non-trivial changes.
Also vtnerd, under you branch, I was actually limited to 32 sockets simultaneously.
- **2025-01-15** @sagewilder2022: Hello, any updates?
- **2025-01-15** @vtnerd: Still working on it. Been a bit backed up with (non-monero) things. Should get this out shortly.
- **2025-01-15** @sagewilder2022: Fantastic
- **2025-01-21** @vtnerd: {F3970079}

This is primarily only an issue with RPC. P2P links have a 62.5 MiB limit per connection, a default of one connection per IP, and additional limits for incoming/outgoing connections that can be configured.

However, public RPC nodes exist, and can be taken down by this code. I'm going to default to 100 MiB "soft" limit (see comments in patch), with 3 connections-per-ip-limit. The connection limit is configurable, but the 100 MiB limit is not. The not-runtime configurable 100 MiB limit shouldn't be an issue because (a) P2P links had an existing limit of 62.5 MiB, and (b) a RPC client that only makes one request at a time never hits the limit. AFAIK, the core monero code only makes another request after reading the entire response. I'll have to coordinate with j-berman as the new async scanner may change this. Hopefully this has minimal impact on downstream systems.

So this patch is primarily (1) and (2) from your earlier post, but (3) is arguably implemented too as  the connection is dropped when 100 MiB is queued AND  2+ requests outstanding.
- **2025-01-22** @sagewilder2022: Acknowledged and tested.

I concur with your defaults and your fix appears sane to me. 

Notwithstanding it, I have a lingering concern and would suggest converting `ABSTRACT_SERVER_SEND_QUE_MAX_BYTES` into a runtime variable. Upon disclosure, public nodes dealing with >300 simultaneous users could see a malicious load of >30GB. While we could imagine that the `rpc-max-ip-connections` limit successfully mitigate an attacker, this might also turn unreliable for VPN users and Onion services, as the `rpc-max-ip-connections` will need to be raised for these two cases (first might concentrate several users on the same IP while the latter is seeing all incoming connections coming from 127.0.0.1). It is preferable for these nodes to reduce the queue size to counter the increase of `rpc-max-ip-connections`. Although it's also possible to argue that public nodes of this scale have a specific infrastructure enabling load balancing between multiple nodes and robust hardware. Given my incomplete knowledge of the ecosystem, I'll provide these ideas for consideration rather than definitive recommendations.
- **2025-01-27** @vtnerd: I've been thinking about whether to switch this to hard-cap with runtime option, primarily because this is the expected behavior. I have decided to leave this as a soft-cap, as it's the best way to allow valid requests to go through. Having a runtime option also allow nodes with non-public RPC and custom infrastructure to continue without making changes to their code.

I will post another patch tomorrow.
- **2025-01-27** @vtnerd: Another thing - what should the default runtime value be? I'm thinking about making it lower than 100MiB, maybe 25MiB?
- **2025-01-27** @sagewilder2022: Given that `get_output_distribution` through restricted RPC is always below 18MiB, I believe this strikes a good balance.
- **2025-01-28** @vtnerd: {F3995338}

This makes the soft limit configurable. I will undergo more testing tomorrow, but this is likely close to a PR unless you've got any other comments.
- **2025-01-28** @sagewilder2022: I am satisfied with the current patch. I do not have any additional feedback.
- **2025-01-28** @sagewilder2022: I have noticed that a new release is being prepared in channel #monero-dev. Is it likely that the patch will be deployed during this release window?
- **2025-01-29** @vtnerd: Unlikely, it has to go through code review first. That usually takes a week+.
- **2025-02-03** @sagewilder2022: I understand. As long as the fix is released within the 90-day period, I will consider it satisfactory.
- **2025-02-06** @sagewilder2022: Hello, has the pull request for the fix been created?
- **2025-02-06** @selsta: https://github.com/monero-project/monero/pull/9765
- **2025-02-11** @selsta: We will include the patch in the next release. The bounty will be paid out within the next weeks.
- **2025-02-12** @sagewilder2022: I'm pleased to hear that.
- **2025-02-15** @sagewilder2022: It appears the vulnerability has been found by malicious individuals and leaked on the internet: https://www.openwall.com/lists/oss-security/2025/02/14/3 
This vulnerability has been designated CVE-2025-26819: https://www.cve.org/CVERecord?id=CVE-2025-26819 

I believe you are already aware. Do you have any additional information regarding this incident?
- **2025-02-15** @selsta: Yes, the PR was unfortunately opened with the wrong title, which caused someone malicious to see and exploit it. As far as I know, major node operators have already patched it and we are working on a new release for casual users. There have been no network interruptions.
- **2025-03-14** @sagewilder2022: Hello, thank you for your response. What's the status on the release and the bounty?
- **2025-03-14** @selsta: You can follow the status of the release here: https://github.com/monero-project/monero/issues/9758

And regarding the bounty, I scheduled it to get paid out last month but it seems it got lost. I will remind the person with access to the wallet again about the bounty payout.
- **2025-03-20** @luigi1111w: Sent 4 XMR: 0e9f2ff45f32156bc6acfff7d8167c0a82a7d4ebc4d7ebd7407f9c75e7413128
- **Swag Awarded**
- **Report Resolved**
- **2025-04-15** @sagewilder2022: Thanks, are there any remaining steps before disclosure?
- **2025-04-15** @selsta: No, we will do disclosure in about a week.
- **2025-04-15** @sagewilder2022: Acknowledged.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
