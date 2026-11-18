---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
  - vuln/misconfiguration
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2023-02-24
submitted: 2022-10-02T23:45:22.173Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0r10nh4ck"
source: "https://hackerone.com/reports/1720278"
title: "Sensitive Data Exposure at https://█████████"
---
# Sensitive Data Exposure at https://█████████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-02-24

- Report: [https://hackerone.com/reports/1720278](https://hackerone.com/reports/1720278)
- CWE: Information Disclosure
- Submitted: 2022-10-02T23:45:22.173Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**

I found in the endpoint https://███/api/getEnvVars, 
sensitive data of environment variables containing: AWS S3 credentials, PATH, IP and PORTs.

## References

https://www.tenable.com/plugins/was/113164
https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html

## Impact

By using leaked AWS credentials or abusing credentials with misconfigured permissions, 
an attacker could try to gain access to sensitive information on the AWS account 
or perform arbitrary modification on the AWS resources.

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Enable a HTTP interception proxy, such as Burp Suite or OWASP ZAP
2. Use a browser to navigate to: https://█████████
3. Find the HTTP POST to https://█████████/api/getEnvVars
4. See the response.

POC:

```json
{"PORT":"8080","PATH":"/home/vcap/app/node_modules/.bin:/home/vcap/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/home/vcap/deps/0/node/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/home/vcap/deps/0/bin:/usr/local/bin:/usr/bin:/bin:/home/vcap/app/bin:/home/vcap/deps/0/node_modules/.bin","APP_SUB_DOMAIN":"██████","DEPLOY_ENV":"test","CF_INSTANCE_ADDR":"████████:61069","CF_INSTANCE_IP":"█████████","CF_INSTANCE_PORT":"61069","HOME":"/home/vcap/app","MEMORY_LIMIT":"125m","PWD":"/home/vcap/app","TMPDIR":"/home/vcap/tmp","USER":"vcap","VCAP_APP_HOST":"0.0.0.0","VCAP_APP_PORT":"8080","VCAP_APPLICATION":"{\"application_id\":\"█████████\",\"application_name\":\"████████\",\"application_uris\":[\"███\"],\"application_version\":\"███████\",\"cf_api\":\"https://api.system.██████\",\"host\":\"0.0.0.0\",\"instance_id\":\"█████████\",\"instance_index\":0,\"limits\":{\"disk\":3072,\"fds\":16384,\"mem\":125},\"name\":\"█████\",\"organization_id\":\"█████\",\"port\":8080,\"process_id\":\"███████\",\"process_type\":\"web\",\"space_id\":\"f28c5898-2473-4bf8-90e4-24d77a930603\",\"space_name\":\"CDN2-0_test\",\"uris\":[\"█████\"],\"version\":\"████\"}","VCAP_SERVICES":"{\"aws-s3\":[{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"██████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"█████████\",\n  \"instance_name\": \"█████\",\n  \"binding_guid\": \"██████████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"██████\",\n    \"bucket\": \"███-████████\",\n    \"region\": \"███\",\n    \"secret_access_key\": \"████\"\n  },\n  \"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n},{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"█████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"█████████\",\n  \"instance_name\": \"███████\",\n  \"binding_guid\": \"██████████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"█████\",\n    \"bucket\": \"██████████-████\",\n    \"region\": \"██████████\",\n    \"secret_access_key\": \"████████\"\n  },\n  \"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n}]}","s3_env_params":{"s3":{"config":{"credentials":{"expired":false,"expireTime":null,"refreshCallbacks":[],"accessKeyId":"████"},"credentialProvider":{"providers":[null,null,null,null,null,null,null],"resolveCallbacks":[]},"region":"████","logger":null,"apiVersions":{},"apiVersion":null,"endpoint":"https://s3.amazonaws.com","httpOptions":{"timeout":120000,"agent":null},"maxRedirects":10,"paramValidation":true,"sslEnabled":true,"s3ForcePathStyle":false,"s3BucketEndpoint":false,"s3DisableBodySigning":true,"s3UsEast1RegionalEndpoint":"legacy","computeChecksums":true,"convertResponseTypes":true,"correctClockSkew":false,"customUserAgent":null,"dynamoDbCrc32":true,"systemClockOffset":0,"signatureVersion":"v4","signatureCache":true,"retryDelayOptions":{},"useAccelerateEndpoint":false,"clientSideMonitoring":false,"endpointDiscoveryEnabled":false,"endpointCacheSize":1000,"hostPrefixEnabled":true,"stsRegionalEndpoints":"legacy","useFipsEndpoint":false,"useDualstackEndpoint":false},"endpoint":{"protocol":"https:","host":"s3.amazonaws.com","port":443,"hostname":"s3.amazonaws.com","pathname":"/","path":"/","href":"https://s3.amazonaws.com/"},"_events":{"apiCallAttempt":[null],"apiCall":[null]},"_clientId":10},"s3_bucket":"██████-███","user_url":"████"}}
```

## Suggested Mitigation/Remediation Actions
- Implement access control.
- Properly configure the API.
- Block requisition exposure.

## Timeline

- **Report Filed**
- **2022-10-02** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2022-10-03** @secretagent23: ████████
- **Report Severity Updated**
- **Report Triaged**
- **2022-10-03** @0r10nh4ck: Hi,
The request data contains AWS Bucket Credentials in the VCAP_SERVICES variable, does this increase the impact of this vulnerability?
POC:

```json
"VCAP_SERVICES":"{\"aws-s3\":[{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"███████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"██████████\",\n  \"instance_name\": \"███\",\n  \"binding_guid\": \"████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"████████\",\n    \"bucket\": \"██████████-███\",\n    \"region\": \"█████████\",\n    \"secret_access_key\": \"████████\"\n  },\n  \"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n},{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"███████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"███\",\n  \"instance_name\": \"███████\",\n  \"binding_guid\": \"███████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"███████\",\n    
\"bucket\": \"████████-██████████\",\n    
\"region\": \"████████\",\n    
\"secret_access_key\": \"███\"\n  },\n  
\"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n}]}"
```
- **2022-10-04** @0r10nh4ck: Hi

In the request, the following credentials were found in the environment variable VCAP_SERVICES:
```json
"VCAP_SERVICES":"{\"aws-s3\":[{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"██████████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"████\",\n  \"instance_name\": \"████████\",\n  \"binding_guid\": \"█████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"█████████\",\n    \"bucket\": \"███████-█████████\",\n    \"region\": \"██████\",\n    \"secret_access_key\": \"███████\"\n  },\n  \"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n},{\n  \"label\": \"aws-s3\",\n  \"provider\": null,\n  \"plan\": \"standard\",\n  \"name\": \"█████████\",\n  \"tags\": [\n\n  ],\n  \"instance_guid\": \"███████\",\n  \"instance_name\": \"███\",\n  \"binding_guid\": \"█████████\",\n  \"binding_name\": null,\n  \"credentials\": {\n    \"access_key_id\": \"████████\",\n    
\"bucket\": \"█████████-██████████\",\n    
\"region\": \"██████\",\n    
\"secret_access_key\": \"███████\"\n  },\n  
\"syslog_drain_url\": null,\n  \"volume_mounts\": [\n\n  ]\n}]}"█████████████████████████
```

With the Credentials exposed, I was able to upload files, list the files, and download files in the respective AWS S3 Buckets.

The vulnerability can be reproduced using the files provided
below:

```
test_credentials.py
requirements.txt
file.txt
```
**Steps for reproduce:**

1. Create a python venv.

`python3 -m venv .venv`

2. Activate venv.

`source .venv/bin/activate`

3. Install dependencies from `requirements.txt` file.

`pip install -r requirements.txt`

4. Use the `test_s3_credentials.py` script to test the credentials.

`python3 test_credentials.py`

5. The script will upload the file `file.txt`, and then this same file will be downloaded with the name new_file.txt
6. Check the file in the object list.
7. Check the downloaded file.
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
