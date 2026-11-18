---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2020-12-17
submitted: 2020-10-27T12:35:10.399Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/mariadb|MariaDB]]"
reporter: "gabriel_sztejnworcel"
source: "https://hackerone.com/reports/1019891"
title: "Named pipe connection inteception"
---
# Named pipe connection inteception

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** MariaDB | **Disclosed:** 2020-12-17

- Report: [https://hackerone.com/reports/1019891](https://hackerone.com/reports/1019891)
- CWE: Business Logic Errors
- Submitted: 2020-10-27T12:35:10.399Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

With MariaDB running on Windows, when local clients connect to the server over named pipes, it's possible for an unprivileged user with an ability to run code on the server machine to intercept the named pipe connection and act as a man-in-the-middle, gaining access to all the data passed between the client and the server, and getting the ability to run arbitrary SQL commands on behalf of the connected user.

On Windows, MariaDB allows local clients to connect to the server over named pipes. Unfortunately, when creating the named pipe server, the security descriptor is not set correctly, and as a result every user on the system can create pipe server instances. This allows for the following attack scenario:
1.	The attacker creates a pipe server instance and waits for a client to connect to it.
2.	Once a client is connected, the attacker connects to the real pipe server instance as a client.
3.	At this point, the attacker is connected to the legitimate client and server, and can pass the messages back and forth, reading the messages (as they are passed in clear text) and possibly changing the messages.

Please see the attached report and POC tool for more information.

## Impact

- All the SQL requests/responses from the intercepted connection
- Ability to run SQL commands

## Timeline

- **Report Filed**
- **Report Resolved**
- **2020-11-01** @gabriel_sztejnworcel: Thanks for your quick response.
Are you going to open a CVE or report on this some way? How do you usually handle this process?
What is your stand towards publishing the findings after it's being fixed?
- **2020-11-01** @vuvova: Our stand is responsible disclosure, normally we coordinate the embargo and disclosure time with other affected vendors.

But this time MySQL is affected and you mentioned that you've notified Oracle already. In that case we do nothing until the next Oracle Critical Patch Update (January 19, 2021). This CPU will have the CVE id that we will use and after the CPU we will disclose the details of the issue.
- **2020-11-01** @gabriel_sztejnworcel: Hi,

I got another response from Oracle. They say that they have a parameter for setting the named pipe permissions: named_pipe_full_access_group. The default is to allow everyone, which is not secure, but they do have the option to configure it. I checked the MariaDB source code and didn't find this parameter.

Can you please check? If it really doesn't exist in MariaDB, maybe the severity is different between MariaDB and MySQL.

Thanks,
Gabriel
- **2020-11-02** @wlad: Hi,
I do not think we will implement named_pipe_full_access_group. With the current patches, we only allow full access to creator only, and  remove the "create pipe instance" from anyone else.  That does not need a parameter.
- **2020-11-02** @vuvova: Yes, you're right, the severity is different. Oracle can claim it's a misconfiguration issue, we cannot. Still, if they're going to address it somehow, we cannot proceed with a public disclosure until the next CPU.
- **2020-11-02** @gabriel_sztejnworcel: I think your fix the the right thing to do, I actually don't understand why they need this parameter, why would they want to allow anyone but the service to create named pipe instances? I understand they might want to allow different users to read/write to the pipe, but never to create an instance.
I will check if they still see it as an issue and get back to you.
Thanks for you responsiveness.
- **2020-11-02** @wlad: I think Oracle MySQL restricted Everyone's access even further, by removing FILE_READ_EA|FILE_WRITE_EA permissions https://github.com/mysql/mysql-server/commit/9007ecdbe2c7822c8f2631666ad214adcf3da864.diff

which perhaps did  not worked well with existing clients that were using CreateFile(...,GENERIC_READ|GENERIC_WRITE,...). And therefore, that needed something to allow older clients to connect, and so they invented the named_pipe_full_access system variable.

If it is so, I believe it was not a bright idea, as CreateFile(GENERIC_READ|GENERIC_WRITE) is very likely what most  clients (apart from they own libmysql 8.0.x) would be using for read-write pipe access on Windows, e.g Java with java.io.RandomAccessFile(), and NamedPipeClientStream in .NET
- **2020-11-03** @gabriel_sztejnworcel: Hi,

I checked with Oracle. They don't see this as a security issue and they are not going to address it.
How are you going to proceed? Are you going to request for a CVE and publicly disclose the issue?
With your permission, I might want to publish my findings after you release the patch.

Thanks,
Gabriel
- **2020-11-08** @gabriel_sztejnworcel: Hi,

I would appreciate your response for my last comment.
I see that the fix is already in Github.

Thanks,
Gabriel
- **2020-11-08** @vuvova: Hi,

As far as MariaDB is concerned, please, feel free to publish your findings anytime you want.

We cannot speak for Oracle, you need to ask them separately. But as far as I understand you already did.

We haven't requested a CVE yet, but we're going to.

Regards,
Sergei
- **2020-11-09** @gabriel_sztejnworcel: Thanks
- **2020-11-17** @vuvova: CVE-2020-28912
- **Agreed On Going Public**
- **2020-12-11** @gabriel_sztejnworcel: Hi,

Sorry, I don't know this platform yet. Do I need to approve your request? Or is it done automatically after 30 days?

Thanks,
Gabriel
- **2020-12-11** @vuvova: I *think* you only need to do something if you disagree with the disclosure. Otherwise it'll happen automatically as scheduled
- **Report Became Public**
