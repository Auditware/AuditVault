---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

Memory exhaustion can be triggered in `http_protocol_handler.inl` and `abstract_tcp_server2.inl` under delayed ACK or zero Receive Window advertisement. This can lead with specific RPC methods to remote crash of nodes through restricted RPC endpoints.

## Releases Affected

Every branches of monero(d).

## Details

If a socket delays ACK packets and let TCP receive window diminish (for example, by not reading the response from the server), responses are kept in epee server send queue up until a memory exhaustion happen. The RPC method used heavily influence the rapidity of the memory exhaustion.

monerod had the following arguments: `--prune-blockchain --sync-pruned-block --rpc-restricted-bind-port=18089`
Tests have been conducted using the undocumented `get_txids_loose`, `get_info` and `get_output_distribution` methods, generating 208kB, 1.5kB and 17MB response respectively:
```json
{"jsonrpc":"2.0","id":"0","method":"get_output_distribution","params":{"amounts":[0],"from_height":0,"to_height":3300000,"compress":false}}
{"jsonrpc":"2.0","id":"0","method":"get_txids_loose","params":{"txid_template":"0000000000000000000000000000000000000000000000000000000000000000","num_matching_bits":14}}
```
Any JSON-RPC request can be weaponized.

Valgrind of an OOM crash indicated that the memory being leaked originates from a string append at [`/contrib/epee/include/net/http_protocol_handler.inl#L607`](https://github.com/monero-project/monero/blob/893916ad091a92e765ce3241b94e706ad012b62a/contrib/epee/include/net/http_protocol_handler.inl#L607C4-L607C5)
```cpp
  LOG_PRINT_L3("HTTP_RESPONSE_HEAD: << \r\n" << response_data);

	if ((response.m_body.size() && (query_info.m_http_method != http::http_method_head)) || (query_info.m_http_method == http::http_method_options))
		response_data += response.m_body; // <------- here

	m_psnd_hndlr->do_send(byte_slice{std::move(response_data)});
```
This complete string response is then converted into an `epee::byte_slice` and passed to [`/contrib/epee/include/net/abstract_tcp_server2.inl#L756`](https://github.com/monero-project/monero/blob/893916ad091a92e765ce3241b94e706ad012b62a/contrib/epee/include/net/abstract_tcp_server2.inl#L756):
```cpp
template<typename T>
bool connection<T>::send(epee::byte_slice message)
{
  std::lock_guard<std::mutex> guard(m_state.lock);
  if (m_state.status != status_t::RUNNING || m_state.socket.wait_handshake)
    return false;

  // Send queue logic...
```

Here the send queue logic is to accept up to `ABSTRACT_SERVER_SEND_QUE_MAX_COUNT` (1000) responses, if this limit is exceeded then the server starts a random delay between 5 and 6 seconds. If this delay is over, the connection is terminated. All the responses are stored here before being sent, regardless of their size. If we take `get_output_distribution`, one can store up to 17GB in the queue, and more during a period of at least 5 seconds.

The testing virtual machine is equipped with 16 threads, 12GB of RAM and Ubuntu 24.04 LTS.
The PoC has been tested using 1, 4 and 16 sockets with 200 milliseconds delay between requests.
The limit imposed by vtnerd's TCP improvement branch is 31.
A 16 socket execution can kill the node (or machine) in under 30 seconds.
Affected and tested branches are [`master`](https://github.com/monero-project/monero/tree/master) and [`vtnerd:improvement/tcp_throttling`](https://github.com/vtnerd/monero/tree/improvement/tcp_throttling)

### Suspicion of memory leaks

In rare cases (4 times), after the PoC stopped, monerod was let with part of its memory allocated for responses not freed. Effectively leaking memory.
Examining this code I have not been able to assert the exact location of it and the unreliability do not help at profiling the issue.
I do not believe to have introduced something that caused these irregularities. I invite reviewers to be careful upon testing and reviewing the current stack.

### Note

This vulnerability has been assessed after discovering a first bug when fuzzing the RPC stack. The p2p throttle code was entangled with the rpc bandwith leading to complete p2p disconnection under RPC throttling. A search on github permitted to find an open PR fixing this bug and aditional mitigations:
https://github.com/monero-project/monero/pull/9459.

Decision has been taken to test both branches.

### Bounty

XMR address: 8BbCtXoBTuxNYnngbLvfpMQRp2qJEQVtH715eUnM34VvFvUYkdJbSwTCLsBjyr4SjYUskFjNCvoGaA6tiJeKf5jW1PvxPSo

## Impact

Remote crash of any node exposing their RPC interface.

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
