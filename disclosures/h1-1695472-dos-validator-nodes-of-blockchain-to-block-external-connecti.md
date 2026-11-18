---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - os/linux
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2022-09-13
submitted: 2022-09-08T16:37:06.035Z
bounty_usd: 1500
votes: 20
cve: "CVE-2022-31006"
program: "[[programs/hyperledger|Linux Foundation Decentralized Trust]]"
reporter: "cre8"
source: "https://hackerone.com/reports/1695472"
title: "DOS validator nodes of blockchain to block external connections"
---
# DOS validator nodes of blockchain to block external connections

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 20 | **Program:** Linux Foundation Decentralized Trust | **Disclosed:** 2022-09-13

- Report: [https://hackerone.com/reports/1695472](https://hackerone.com/reports/1695472)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2022-31006
- Submitted: 2022-09-08T16:37:06.035Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Attack was documented in the in the github repo: https://github.com/hyperledger/indy-node/security/advisories/GHSA-x996-7qh9-7ff7

# Attack:
The attacker sends 500 read requests to each node and opens a new one when
holding 500 parallel connections. Every user is able to send read requests
since it's a public readable registry so setting up an allowlist like it's
done with the nodes' port for the consensus does not work here. To increase
the efficiency:

the custom read request is increased with more bytes (random header or
json values)
the bandwidth of the sender machine is limited
Requirements on the attacker side:
Indy-VDR: comment out the timeouts. Using another tool to send the requests
could be even more efficient
VM: attack can be performed from one or multiple VMs limited connection: using
TC to limit the bandwidth (value depends on the amount of connections)
Sample Implementation
We set up a VON-Network and added the firewall rules. The VM had 32 CPUs
and 64 GB RAM

# Result:
there is no damage to the blockchain, only an unreachable network as long
as the attack is going on .
Other clients are not able to send read or write requests to the nodes. In
the "best case" their requests will go through but with a response time of
multiple seconds, see:
Not available [image: image.png]

Not available [image: image.png]

# Counteractions:
blacklisting actors: It does not matter what is in the body since the
firewall rule acts in front of indy that is processing the information. To
avoid big requests the firewall could set a limit of the request size, but
this could also block valid requests.
Scaling via the observer-pattern: Right now the amount of nodes is
limited so blocking 25*500 connections is very easy. When adding nodes in
front of the validators to prevent accessing from the internet the
validators are save, but then all the observers are under attack
Scalability: Giving the VMs more CPU and RAM to increase the parallel
connections amount can help in first run, but the DoS attack can be
performed as a DDos. An attacker does not have to DoS the network 24/7, but
can scale up the VMs on demand to attack a specific network. The setup is
done in about 2 minutes automatically. In our test we used 500 as the
limit. Maybe there is some kind of algorithm for the node administrators to
calculate the limit based on their CPU. But in this case the attacker can
also increase his ressources.

## Impact

An attacker can max out the number of client connections allowed by the ledger, leaving the ledger unable to be used for its intended purpose.

However, the ledger content will not be impacted and the ledger will resume servicing client requests after the conclusion of the attack.

## Timeline

- **Report Filed**
- **Cve Id Added**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
