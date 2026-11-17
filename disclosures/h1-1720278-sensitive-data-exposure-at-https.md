---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
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
