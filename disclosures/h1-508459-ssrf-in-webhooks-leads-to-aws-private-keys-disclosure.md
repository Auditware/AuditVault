---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/aws
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
date: 2019-06-28
submitted: 2019-03-12T14:32:57.330Z
bounty_usd: null
votes: 214
cve: []
program: "[[programs/omise|Omise]]"
reporter: "honoki"
source: "https://hackerone.com/reports/508459"
title: "SSRF in webhooks leads to AWS private keys disclosure"
---
# SSRF in webhooks leads to AWS private keys disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 214 | **Program:** Omise | **Disclosed:** 2019-06-28

- Report: [https://hackerone.com/reports/508459](https://hackerone.com/reports/508459)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2019-03-12T14:32:57.330Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Vulnerability Summary

Omise makes use of Amazon AWS as their application environment. Due to a vulnerability in the way webhooks are implemented, an attacker can make arbitrary HTTP/HTTPS requests from the application server and read their responses. This is known as a server-side request forgery (SSRF) vulnerability.

This vulnerability leads to access to Omise's Amazon EC2 instance with the user role `aws-opsworks-ec2-role`, including AWS private keys.

## Description

The vulnerability exists in the way webhooks follow redirects. In general, it appears that redirects are not followed, but a HTTP 303 See Other status code allows an attacker to bypass this restriction.

By pointing my webhook URL to a server that issues a 303 redirect, I am able to redirect and read the responses of arbitrary HTTP/HTTPS requests from the application server. E.g. the following PHP script results in a successful request that is followed by the server:

`<?php header('Location: http://<arbitrary-location>', TRUE, 303); ?>`

As a result, it is possible to request a number of things, including AWS credentials on the metadata server located at `http://169.254.169.254/latest/meta-data/iam/security-credentials/aws-opsworks-ec2-role`

## Steps to reproduce

* Host the following payload on `https://<your-attacker-server>/redir.php`:

````
<?php header('Location: http://169.254.169.254/latest/meta-data/iam/security-credentials/aws-opsworks-ec2-role', TRUE, 303); ?>
````
* Point your webhook endpoint on https://dashboard.omise.co/test/webhooks/edit to `https://<your-attacker-server>/redir.php`
* Make a random call to the API, e.g. adding a user;
* View the "Recent Deliveries" of the webhook calls on https://dashboard.omise.co/test/webhooks
* Note the `200 OK` status code indicating a successful redirect
* Click the event to view the response body of the AWS metadata

## Recommendation

I recommend to ensure all input provided to the endpoint is validated. In this case, ensure that 303 redirects are not followed either.

I also recommend resetting all AWS access tokens. In addition, I recommend reviewing the Amazon access logs to investigate if this vulnerbility has been exploited in the past.

## Attachments

* **20190312_AWS-SSRF-303-redirect-2.png** - Screenshot showing the output of the AWS credentials obtained through the SSRF vulnerability.
* **20190312_AWS-SSRF-303-redirect.png** - Screenshot showing the output of the AWS index of metadata.

## Impact

By exploiting this vulnerability, an unauthorized attacker could gain access to the AWS environment of Omise. Note that the SSRF vulnerability could be abused in a variety of ways, not just limited to obtaining AWS credentials. For example, to enumerate and access services and web applications running on the internal network.

## Timeline

- **Report Filed**
- **2019-03-13** @hardymansen: Hi,
Thanks for your report!
We are working to verify your findings and will update the report once completed. 

Thank you for your research!
Omise Security
- **Report Triaged**
- **Report Severity Updated**
- **2019-03-14** @honoki: Hi @dhawal - I'd be interested to hear the reasoning that leads to lowering the impact rating of this vulnerability. I would like to stress that having read access to the AWS metadata is usually considered as "critical" based on the fact that it provides access to a range of sensitive details, of which the demonstrated keys are only one example.

Please note that I stopped looking after providing a sample of the AWS private keys as I believed them to be a sufficient POC to demonstrate impact, but that there is likely a lot of other sensitive information that an attacker can read using this vulnerability.

Best regards,
Pieter
- **Bounty Awarded**
- **Report Resolved**
- **2019-03-15** @honoki: I can still reply. :) Thanks for the explanation - I think that reasoning makes sense.
- **Agreed On Going Public**
- **2019-06-28** @hardymansen: That is fine.
- **2019-06-28** @honoki: I believe you need to select Agree somewhere
- **Agreed On Going Public**
- **Report Became Public**
