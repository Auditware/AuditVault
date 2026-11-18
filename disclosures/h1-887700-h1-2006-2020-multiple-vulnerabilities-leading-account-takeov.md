---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - vuln/broken-access-control
  - vuln/privilege-escalation
  - impact/account-takeover
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-06-17
submitted: 2020-05-31T01:37:23.209Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "nukedx"
source: "https://hackerone.com/reports/887700"
title: "[H1-2006 2020]  Multiple vulnerabilities leading account takeover"
---
# [H1-2006 2020]  Multiple vulnerabilities leading account takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** h1-ctf | **Disclosed:** 2020-06-17

- Report: [https://hackerone.com/reports/887700](https://hackerone.com/reports/887700)
- CWE: Privilege Escalation
- Submitted: 2020-05-31T01:37:23.209Z

## Report summary

## Start of events
On May 29th HackerOne announced via [twitter](https://twitter.com/Hacker0x01/status/1266454022124376064) that their lovely CEO *Mårten Mickos* needs to approve bounties on their new payment system called **BountyPay** but looks like he lost his login details and they asked help from the community.

So as a proud member of the community, I started to check what's **BountyPay** and visited their web page on https://bountypay.h1ctf.com/ for a visual reconnaissance, but that page from very start didn't look promising. They only had login links for their [customers] (https://app.bountypay.h1ctf.com/) and [staff] (https://staff.bountypay.h1ctf.com/)

Since all index pages nearly had zero info from visual reconnaissance except that they are using technologies like Bootstrap and jQuery there was nothing else. So started the initial reconnaissance process.

## Reconnaissance process and leaked credentials

As we all know reconnaissance is key feature for approaching to target and since I noticed **BountyPay** using different subdomains for staff and their customers, I wanted to see if there is any other subdomains available at all so for it I relied to [amass] (https://github.com/OWASP/Amass) which is really powerful subdomain enumeration and asset discovery tool and executed following:
`amass enum --passive -d bountypay.h1ctf.com` 

After few seconds results were like this:
{F850507}

So it looks like **BountyPay** had interesting subdomains like **api** and **software** but decided to check them later more after analyzing current initial subdomains **app** and **staff**

Therefore I started directory brute forcing on **app** via using [dirsearch](https://github.com/maurosoria/dirsearch) which is a nice tool for this job and executed it as following:

`python3 ~/dirsearch/dirsearch.py -u https://app.bountypay.h1ctf.com/ -e php,asp,aspx,jsp,html,zip,jar -b -w ~/dirsearch/db/dicc.txt -t 200 -x 502,503 -H 'X-FORWARDED-FOR: 127.0.0.1'` 

Since our target could be potentially behind WAF or has some rate limit assigned to IP address, we relied an old trick with using **X-Forwarded-For** header, after few seconds I noticed it found some interesting stuff under `.git` folder
{F850498}

So by using **curl** viewed contents of `.git/config`
`curl -sk https://app.bountypay.h1ctf.com/.git/config`

Response had some valuable information:
{F850501}

So visited `https://github.com/bounty-pay-code/request-logger/` and noticed it was public repository with file called `logger.php` there and it had following source:

{F850503}

It looks like developers of **BountyPay** were using it for trace logging, it was basically converting requests as json data and encoding them by using **base64** then saving it under `bp_web_trace.log` file

When I requested a file by using curl: `curl -sk https://app.bountypay.h1ctf.com/bp_web_trace.log`

Interestingly file was in present there with following data:
{F850502}
When I decoded **base64** values it became more interesting because it was leaking credentials for user called `brian.oliver`

Decoded values:
```json
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX"}}}
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX","challenge_answer":"bD83Jk27dQ"}}}
{"IP":"192.168.1.1","URI":"\/statements","METHOD":"GET","PARAMS":{"GET":{"month":"04","year":"2020"},"POST":[]}
```

## Using leaked credentials and bypassing 2FA

Since we got some credentials to login, I straightly went for it and credentials was working but there was another problem to deal with which is called as 2FA
{F850499}

So I tried leaked 2FA answer `bD83Jk27dQ` which was fitting criteria of `aZ09` and 10 characters, unfortunately it didn't work well then checked the request done to the server with the help of [Burp Suite](https://portswigger.net/) which is a must have tool as bounty hunter and penetration tester.

{F850505} 

There was a parameter called `challenge_hash` which looked like a MD5 hash and surprisingly it wasn't on logs so giving the fact that hash was in present it must be used to verify `challenge_answer` which was actually the value I used from leaking credentials, given the fact that all combinations of `aZ09` which is already 62 elements and being 10 length, brute forcing would be unrealistic because it's 62^10 combinations which is equal to *839299365868340224* so there must be something else, then I decided to change value of `challenge_hash` to **5828c689761cce705a1c84d9b1a1ed5e** the MD5 value of `bD83Jk27dQ` and tried to login again, boom! bypassed the 2FA and we were in as Mr. Brian Oliver.

{F850523}

Dashboard of the customers looked very simple and they only had the option to view statements for a given time period. Unfortunately there was nothing on dashboard but something was interesting:

{F850510}

When the customer views the statements, the app was actually doing a request on **api.bountypay.h1ctf.com** and retrieving value back to us, that gave me an idea what if there is a SSRF? 


##Open redirect and SSRF
Since **api.bountypay.h1ctf.com** was used for api, I hoped it would have some documentation on it and on index of it there was a some valuable info, also it looked like api do not rely/need cookie from **app.bountypay.h1ctf.com**, so we are basically anonymous for api right now.

{F850476}

When we mouse over on `REST API` it was actually having `https://api.bountypay.h1ctf.com/redirect?url=https://www.google.com/search?q=REST+API` as a link and that was a clear open redirect but there was some url whitelist as following
```
https://www.google.com/search?q=REST+API
https://bountypay.h1ctf.com/
https://api.bountypay.h1ctf.com/
https://software.bountypay.h1ctf.com/
https://staff.bountpay.h1ctf.com/
https://www.bountpay.h1ctf.com/
```
Interestingly it didn't have `https://app.bountypay.h1ctf.com` in the list but it's a gold in current state, the question is how can we force api to go `/redirect` endpoint and abuse it.

So I started to check URL return from statement viewing on api `https://api.bountypay.h1ctf.com/api/accounts/F8gHiqSdpK/statements?month=04&year=2020`, it looks like we were able to control the query part of URL with our request on statement viewing, so tried a couple tricks to force URL parser to fail, it didn't.

Furthermore noticed **F8gHiqSdpK** which looked like our account value and our token looked like encoded as *base64* so when I decoded it:

```json
{"account_id":"F8gHiqSdpK","hash":"de235bffd23df6995ad4e0930baac1a2"}
```

Yes **F8gHiqSdpK** was there with altering now I was able to do directory traversal, luckily they were not checking account value on cookie to verify session but **hash**

Since whitelist on domains were limited, it meant we can not exfiltrate metadata or similar stuff, neither view local services, then decided to check only remaining subdomain I didn't visit **software.bountypay.h1ctf.com**, it looks like our IP address was not allowed to access it.

{F850508}

So it felt like this is something I must use with SSRF then coded {F850470} for this purpose since SSRF was doable via token cookie.

```
#!/bin/bash
host="https://app.bountypay.h1ctf.com/statements?month=04&year=2020"
token=$(echo '{"account_id":"../../redirect?url=https://software.bountypay.h1ctf.com/'$1'#","hash":"de235bffd23df6995ad4e0930baac1a2"}' | base64 -w 0 | awk {'print "token="$1'})
request=$(curl -sk $host -b $token)
if [[ ! $request == *" not found"* && ! $request == *"404 Not Found"* ]]; then
        data=$(echo $request | jq -c .data)
        url=$(echo $request | jq -c .url | cut -c 66- | cut -d "#" -f 1)
        now=$(date +"%T")
        echo "$url : $data"
fi
```
It is a simple tool which generates new token and uses it for SSRF on `https://software.bountypay.h1ctf.com`, thanks to **xargs** I was able to run it as multithreaded/multiprocess and for the wordlist I used [common.txt](https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt) 
`cat common.txt | xargs -P 30 -n 1 ./b64search.sh`

After few minutes I found out **uploads** folder
{F850458}

It was having some file directory listed as `/uploads/BountyPay.apk` but accessing the file with SSRF would be a pain and I hoped there was a permission issue and visited `https://software.bountypay.h1ctf.com/uploads/BountyPay.apk` and luckily, it started downloading.

## Android app and leaked token

So after downloading the APK file, I started to reverse engineering using [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF), a cool framework for mobile application testing. APK looked like it didn't have any public URL but firebase, so no hidden reconnaissance path was revealed with it.
I started my **Genymotion** and loaded APK with my virtual android device and continue viewing results from **MobSF**

Android manifest revealed there are some activities and they had schemes assigned to each other:
```xml
 <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_three" android:name="bounty.pay.PartThreeActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="three" android:host="part" />
            </intent-filter>
        </activity>
        <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_two" android:name="bounty.pay.PartTwoActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="two" android:host="part" />
            </intent-filter>
        </activity>
        <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_one" android:name="bounty.pay.PartOneActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="one" android:host="part" />
            </intent-filter>
        </activity>
```

It looks like APK has some intent checks and bypassing them would be easy, on PartOneActivity, it also hinted us at APK saving data on shared preferences for the process.
{F850451}

I was able to bypass PartOneActivity's intent checks with adb shell and using it as following:
`adb shell am start -a android.intent.action.VIEW -d "one://part?start=PartTwoActivity" -n bounty.pay/.PartOneActivity`

PartTwoActivity had similar checks:
{F850455}
Again using adb shell as following let me pass intent check:
`adb shell am start -a android.intent.action.VIEW -d "two://part?two=light\&switch=on" -n bounty.pay/.PartTwoActivity`

When we pass the check submit form appeared:
{F850456}

As we already figured from source of **PartTwoActivity**, it's checking for if the value we submit has `X-` at very beginning and there was some interesting hash on screen `459a6f79ad9b13cbcb5f692d2cc7a94d` which also looked like a MD5 hash, by querying it via [CrackStation](https://crackstation.net/), I was able to find it was MD5 hash value for `Token`, then entered `X-Token` as answer and proceeded to PartThreeActivity

PartThreeActivity also had some intent checks
{F850453}
This time things were looking a bit different since *base64* involved then I started to check other parts of PartThreeActivity and noticed there was some *base64* values located:
{F850452}

So when I decoded value of **directory** result was: `host`, and when decoded value of **directoryTwo** result was: `X-Token`

Intent check also was looking value we supplied for **three** and **switch** parameters as *base64* value of `PartThreeActivity` and `on` as respectively, so encoded `PartThreeActivity` and result was: `UGFydFRocmVlQWN0aXZpdHk=`, for `on` when encoded result was: `b24=` then executed following `adb shell` command:

`adb shell am start -a android.intent.action.VIEW -d "three://part?three=UGFydFRocmVlQWN0aXZpdHk=\&switch=b24=\&header=X-Token" -n bounty.pay/.PartThreeActivity`

I was able to pass intent check of PartThreeActivity and next step was checking hash value 
{F850454}

Since we already know APK was saving our process on shared preferences, I viewed details of with using adb shell as following:
`adb shell cat ./data/data/bounty.pay/shared_prefs/user_created.xml`

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="PARTTWO">COMPLETE</string>
    <string name="USERNAME">nukedx</string>
    <string name="HOST">http://api.bountypay.h1ctf.com</string>
    <string name="PARTONE">COMPLETE</string>
    <string name="TWITTERHANDLE">mcipekci</string>
    <string name="TOKEN">8e9998ee3137ca9ade8f372739f062c1</string>
</map>
```

Hash value needed was **8e9998ee3137ca9ade8f372739f062c1** by entering it I was able to complete APK challenge
{F850457}

CongratsActivity also had some valuable information which actually we figured out after viewing shared preferences.
{F850450}

Now we were having some token to use on **api.bountypay.h1ctf.com** 

## OSINT and getting staff credentials via API

After receiving token for API, started to directory brute force and only able to find few endpoints:
```
/api/accounts/{any}
/api/staff/
```
So API wasn't very talkative to us and looked like very limited with using token did simple `GET` request on `/api/staff` endpoint:
{F850432}

I was able to find staff details but they were only names and their staff ids, then wanted to test `POST` request on same endpoint, since we had `staff_id` parameter on previous request did some request like this:
{F850433}

It was giving error like **Staff Member already has an account**, since staff id's look like `STF:AZ09{10}` combination brute forcing a staff id which is not associated with account details would be hard, around same moments HackerOne made a retweet from handle **BountyPayHQ**
{F850427}

I start to check that handle and noticed they were celebrating a new team member called **Sandra**
{F850429}

She was not in the list of previously found staff members and started to check her twitter profile, interestingly she had some ID card with **BountyPay** logo on it, which was revealing her staff id.
{F850430}

Her staff id was `STF:8FJ3KFISL3` and tried `POST` request on `/api/staff` endpoint which let me get her credentials:
{F850431}

## Staff account and privilege escalation 

Since I found out login credentials for Sandra, logged in to her account on `https://staff.bountypay.h1ctf.com` but it looks like Sandra didn't have admin details.

Staff panel had some interesting javascript on `https://staff.bountypay.h1ctf.com/js/website.js`
{F850463}

It looks like admins can upgrade normal users on the staff system to admin as well and if there is a location hash on URL, javascript automatically triggers a click event for context assigned to them.

There was also report function for users to report pages they are on to admins or viewing but it strictly stated that: `Pages in the /admin directory will be ignored for security` so we can not use `/admin/upgrade?username=sandra.allison` for reporting too, so there must be a way to privilege escalation.

Since we know `#tab` classes auto clicks if there is a location hash with that class name we can combine multiple classes like `upgradeToAdmin tab2` but we must be able to find an injection point for it.

I realized that there was a update profile option and avatar we select is actually a class defined in cascading style sheet of page, so maybe we can trick server to have some other classes in our avatar, therefore I used inspect element option of my browser and edited value of **avatar2** and saved it:
{F850461}

After updating avatar went to ticket page and inspected avatar of Sandra:
{F850468}

So it was successful so decided to check if we can execute javascript with having location hash on URL:
{F850469}

It brought some problem username is send as undefined to server, so we must check if there is another endpoint which is having **username** input, since staff portal loading templates as query parameter, tried various potential template names and only one was having **username** input which is very first `login` template, then decided to check if there is any other endpoint unfortunately none.
{F850465}

Since we know **app.bountypay.h1ctf.com** was running as PHP, only potential thing left to try was sending query string parameter as array, since PHP can read query strings as is which means if we pass `param[]=value` as query string, param will read into array, so we will simply send `template[]=home` as first try to see if it loads page at all, and it was successful then wanted to try `template[]=login&template[]=ticket` in hope of template parameter handled as array too on app itself, result was successful as well now both templates loaded, I requested following page from server `/?template[]=login&template[]=ticket&ticket_id=3582&username=sandra.allison#tab2`
{F850460}

Now we can try to see if **username** sent as undefined or not:
{F850462}

Since report to admin function relies `url` variable located on page we must alter it, we could alter request by simply intercepting with any proxy as well but for such simple stuff, I decided to use developer tools:
{F850467}

It was executed properly:
{F850466}

So it was time to check home page of staff portal and see if we gained admin rights:
{F850464}

We were successfully escalated to admin rights and when viewing admin section noticed `marten.mickos` had their password available there as plain text
{F850459}

##Log in as Marten and pay all the bounties

It was incredible we find out *Mårten Mickos'* account details and now we can try login into it, looks like we had same 2FA process on very beginning of finding out login credentials for `brian.oliver` so by applying same logic, I was able to login his customer dashboard. after viewing current months statement, I noticed there was some unpaid bounties to our hacker friends:
{F850443}

It looks like **BountyPay** had extra layer of security so for approving payments we need another 2FA:
{F850434}

Interestingly this time there was some weird request which was having parameter called `app_style` in `POST` requests data
{F850435}

It looked like SSRF at glance was hitting any target I sent for but result was blind and since initial request had **css** as extension, this looked like either exfiltration data with CSS or some stored XSS, for eliminating stored XSS possibility, I tested simple payload like: `"><b>x</b>` and request I got on my collab server was having `"<>/` characters were sanitized and requested filename was looking like `file.extbxb`.

So I eliminated stored XSS, and checked next page of 2FA, realized this time it's 7 characters and trick we used on initial 2FA was not working so we must gain a 2FA code so went straightforward for exfiltration data with CSS, made {F850441} and started to send request to target.
{F850438} 

After some time revealed first 4 chars of input which was `code`: 
{F850442} 

So assumed input value was code and used {F850439} interestingly we were not getting any request at all, output for css from failed attempt was:
{F850440}

As we can see we directly used `=code` after altering it to `"^=code"`, we realized we were getting two hits this time:
{F850444}

Currently we were in misleading direction so we must figure out full input names, given habit of usage on `_` character, wanted to try `code_` as input value and we continued to get multiple requests after than figured out its sequential like `code_1` `code_2` etc and made {F850447}

I think we had some network problem had struggles like:
{F850448}

After few tries we were able to get first 6 characters for 2FA:
{F850446} 

For last char went for brute forcing with burp intruder and result was:
{F850437}

So we paid all the bounties to hackers :)

## Rabbit holes during event

1. `/pay/id/hash/` on `https://app.bountypay.h1ctf.com` forced us to believe there was an IDOR on early stages.
1. Login screen on `https://software.bountypay.h1ctf.com` 
1. Not being able to download APK due to permission :D
1. Since we were not expecting any OSINT in the first place, not being able to find any other endpoint on api was so annoying
1. Before realizing it was loading multiple templates with arrays, we realized each time updating profile was changing cookie value so thought we must decode cookie which was using some custom alphabet base64 and regular base64 over it which is really hard to achieve :D
1. Open redirect whitelist needs `/` at the end of URL which forced me and many other to believe there was something else :D
1.  `app_styles` param on the very last 2FA many believed it would be SSRF due to the user agent at first until they realized it's actually imitating a human being.

## After event findings

Since we always getting failed amount data with CSS exfiltration, realized it was actually due to not using **double quote** on input name and value and using `*~` in between of input and style, so it is actually causing some issues with chrome and not processing all styles, fixed php code for my PoC can be found on this [pastebin](https://pastebin.com/VnUrDx5T), since I already made two posts for attachments and didn't want to make another one.

Android APK is saving API token right after completing PartOneActivity, so other parts of the event could be skipped by a person who reads and analyzes entire codes :)

Open redirect whitelist for google is actually checking if `REST` is part of a query string so you can just use `https://www.google.com/?REST` :)

On first 2FA challenge you can ignore **challenge_answer** since it's not checking length of data send by user and directly push `d41d8cd98f00b204e9800998ecf8427e` as challenge hash which is md5 value of null :)

## Shoutouts

@ziot @superhero exchanging ideas with me during the event, @NahamSec @b3nac and @Adamtlangley for an amazing CTF.

@zeroxyele for letting me figure out issue with CSS exfiltration after finishing it as well during our convo for rabbit holes and issues encountered, he mentioned he was using [Jonathan Omisore's CSS keylogger](https://github.com/JonathanOmisore/CSS-Keylogging/blob/master/css-keylogger-extension/keylogger.css) so after viewing I realized issue for how Chromium was failing to handle CSS files.

I tried to make this write up as much as from my view and wanted to show using different tools and ways is possible to achieve the same results, instead of relying on one tool. I hope whoever reads this write up will enjoy it as much as I enjoyed the CTF and writing this up :)

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I'm posting flag and will send my write up upcoming days when I clear my mind after this rabbit holes! :D
`^FLAG^736c635d8842751b8aafa556154eb9f3$FLAG---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-06-17
submitted: 2020-05-31T01:37:23.209Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "nukedx"
source: "https://hackerone.com/reports/887700"
title: "[H1-2006 2020]  Multiple vulnerabilities leading account takeover"
---
# [H1-2006 2020]  Multiple vulnerabilities leading account takeover

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 10 | **Program:** h1-ctf | **Disclosed:** 2020-06-17

- Report: [https://hackerone.com/reports/887700](https://hackerone.com/reports/887700)
- CWE: Privilege Escalation
- Submitted: 2020-05-31T01:37:23.209Z

## Report summary

## Start of events
On May 29th HackerOne announced via [twitter](https://twitter.com/Hacker0x01/status/1266454022124376064) that their lovely CEO *Mårten Mickos* needs to approve bounties on their new payment system called **BountyPay** but looks like he lost his login details and they asked help from the community.

So as a proud member of the community, I started to check what's **BountyPay** and visited their web page on https://bountypay.h1ctf.com/ for a visual reconnaissance, but that page from very start didn't look promising. They only had login links for their [customers] (https://app.bountypay.h1ctf.com/) and [staff] (https://staff.bountypay.h1ctf.com/)

Since all index pages nearly had zero info from visual reconnaissance except that they are using technologies like Bootstrap and jQuery there was nothing else. So started the initial reconnaissance process.

## Reconnaissance process and leaked credentials

As we all know reconnaissance is key feature for approaching to target and since I noticed **BountyPay** using different subdomains for staff and their customers, I wanted to see if there is any other subdomains available at all so for it I relied to [amass] (https://github.com/OWASP/Amass) which is really powerful subdomain enumeration and asset discovery tool and executed following:
`amass enum --passive -d bountypay.h1ctf.com` 

After few seconds results were like this:
{F850507}

So it looks like **BountyPay** had interesting subdomains like **api** and **software** but decided to check them later more after analyzing current initial subdomains **app** and **staff**

Therefore I started directory brute forcing on **app** via using [dirsearch](https://github.com/maurosoria/dirsearch) which is a nice tool for this job and executed it as following:

`python3 ~/dirsearch/dirsearch.py -u https://app.bountypay.h1ctf.com/ -e php,asp,aspx,jsp,html,zip,jar -b -w ~/dirsearch/db/dicc.txt -t 200 -x 502,503 -H 'X-FORWARDED-FOR: 127.0.0.1'` 

Since our target could be potentially behind WAF or has some rate limit assigned to IP address, we relied an old trick with using **X-Forwarded-For** header, after few seconds I noticed it found some interesting stuff under `.git` folder
{F850498}

So by using **curl** viewed contents of `.git/config`
`curl -sk https://app.bountypay.h1ctf.com/.git/config`

Response had some valuable information:
{F850501}

So visited `https://github.com/bounty-pay-code/request-logger/` and noticed it was public repository with file called `logger.php` there and it had following source:

{F850503}

It looks like developers of **BountyPay** were using it for trace logging, it was basically converting requests as json data and encoding them by using **base64** then saving it under `bp_web_trace.log` file

When I requested a file by using curl: `curl -sk https://app.bountypay.h1ctf.com/bp_web_trace.log`

Interestingly file was in present there with following data:
{F850502}
When I decoded **base64** values it became more interesting because it was leaking credentials for user called `brian.oliver`

Decoded values:
```json
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX"}}}
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX","challenge_answer":"bD83Jk27dQ"}}}
{"IP":"192.168.1.1","URI":"\/statements","METHOD":"GET","PARAMS":{"GET":{"month":"04","year":"2020"},"POST":[]}
```

## Using leaked credentials and bypassing 2FA

Since we got some credentials to login, I straightly went for it and credentials was working but there was another problem to deal with which is called as 2FA
{F850499}

So I tried leaked 2FA answer `bD83Jk27dQ` which was fitting criteria of `aZ09` and 10 characters, unfortunately it didn't work well then checked the request done to the server with the help of [Burp Suite](https://portswigger.net/) which is a must have tool as bounty hunter and penetration tester.

{F850505} 

There was a parameter called `challenge_hash` which looked like a MD5 hash and surprisingly it wasn't on logs so giving the fact that hash was in present it must be used to verify `challenge_answer` which was actually the value I used from leaking credentials, given the fact that all combinations of `aZ09` which is already 62 elements and being 10 length, brute forcing would be unrealistic because it's 62^10 combinations which is equal to *839299365868340224* so there must be something else, then I decided to change value of `challenge_hash` to **5828c689761cce705a1c84d9b1a1ed5e** the MD5 value of `bD83Jk27dQ` and tried to login again, boom! bypassed the 2FA and we were in as Mr. Brian Oliver.

{F850523}

Dashboard of the customers looked very simple and they only had the option to view statements for a given time period. Unfortunately there was nothing on dashboard but something was interesting:

{F850510}

When the customer views the statements, the app was actually doing a request on **api.bountypay.h1ctf.com** and retrieving value back to us, that gave me an idea what if there is a SSRF? 


##Open redirect and SSRF
Since **api.bountypay.h1ctf.com** was used for api, I hoped it would have some documentation on it and on index of it there was a some valuable info, also it looked like api do not rely/need cookie from **app.bountypay.h1ctf.com**, so we are basically anonymous for api right now.

{F850476}

When we mouse over on `REST API` it was actually having `https://api.bountypay.h1ctf.com/redirect?url=https://www.google.com/search?q=REST+API` as a link and that was a clear open redirect but there was some url whitelist as following
```
https://www.google.com/search?q=REST+API
https://bountypay.h1ctf.com/
https://api.bountypay.h1ctf.com/
https://software.bountypay.h1ctf.com/
https://staff.bountpay.h1ctf.com/
https://www.bountpay.h1ctf.com/
```
Interestingly it didn't have `https://app.bountypay.h1ctf.com` in the list but it's a gold in current state, the question is how can we force api to go `/redirect` endpoint and abuse it.

So I started to check URL return from statement viewing on api `https://api.bountypay.h1ctf.com/api/accounts/F8gHiqSdpK/statements?month=04&year=2020`, it looks like we were able to control the query part of URL with our request on statement viewing, so tried a couple tricks to force URL parser to fail, it didn't.

Furthermore noticed **F8gHiqSdpK** which looked like our account value and our token looked like encoded as *base64* so when I decoded it:

```json
{"account_id":"F8gHiqSdpK","hash":"de235bffd23df6995ad4e0930baac1a2"}
```

Yes **F8gHiqSdpK** was there with altering now I was able to do directory traversal, luckily they were not checking account value on cookie to verify session but **hash**

Since whitelist on domains were limited, it meant we can not exfiltrate metadata or similar stuff, neither view local services, then decided to check only remaining subdomain I didn't visit **software.bountypay.h1ctf.com**, it looks like our IP address was not allowed to access it.

{F850508}

So it felt like this is something I must use with SSRF then coded {F850470} for this purpose since SSRF was doable via token cookie.

```
#!/bin/bash
host="https://app.bountypay.h1ctf.com/statements?month=04&year=2020"
token=$(echo '{"account_id":"../../redirect?url=https://software.bountypay.h1ctf.com/'$1'#","hash":"de235bffd23df6995ad4e0930baac1a2"}' | base64 -w 0 | awk {'print "token="$1'})
request=$(curl -sk $host -b $token)
if [[ ! $request == *" not found"* && ! $request == *"404 Not Found"* ]]; then
        data=$(echo $request | jq -c .data)
        url=$(echo $request | jq -c .url | cut -c 66- | cut -d "#" -f 1)
        now=$(date +"%T")
        echo "$url : $data"
fi
```
It is a simple tool which generates new token and uses it for SSRF on `https://software.bountypay.h1ctf.com`, thanks to **xargs** I was able to run it as multithreaded/multiprocess and for the wordlist I used [common.txt](https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt) 
`cat common.txt | xargs -P 30 -n 1 ./b64search.sh`

After few minutes I found out **uploads** folder
{F850458}

It was having some file directory listed as `/uploads/BountyPay.apk` but accessing the file with SSRF would be a pain and I hoped there was a permission issue and visited `https://software.bountypay.h1ctf.com/uploads/BountyPay.apk` and luckily, it started downloading.

## Android app and leaked token

So after downloading the APK file, I started to reverse engineering using [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF), a cool framework for mobile application testing. APK looked like it didn't have any public URL but firebase, so no hidden reconnaissance path was revealed with it.
I started my **Genymotion** and loaded APK with my virtual android device and continue viewing results from **MobSF**

Android manifest revealed there are some activities and they had schemes assigned to each other:
```xml
 <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_three" android:name="bounty.pay.PartThreeActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="three" android:host="part" />
            </intent-filter>
        </activity>
        <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_two" android:name="bounty.pay.PartTwoActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="two" android:host="part" />
            </intent-filter>
        </activity>
        <activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_one" android:name="bounty.pay.PartOneActivity">
            <intent-filter android:label="">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="one" android:host="part" />
            </intent-filter>
        </activity>
```

It looks like APK has some intent checks and bypassing them would be easy, on PartOneActivity, it also hinted us at APK saving data on shared preferences for the process.
{F850451}

I was able to bypass PartOneActivity's intent checks with adb shell and using it as following:
`adb shell am start -a android.intent.action.VIEW -d "one://part?start=PartTwoActivity" -n bounty.pay/.PartOneActivity`

PartTwoActivity had similar checks:
{F850455}
Again using adb shell as following let me pass intent check:
`adb shell am start -a android.intent.action.VIEW -d "two://part?two=light\&switch=on" -n bounty.pay/.PartTwoActivity`

When we pass the check submit form appeared:
{F850456}

As we already figured from source of **PartTwoActivity**, it's checking for if the value we submit has `X-` at very beginning and there was some interesting hash on screen `459a6f79ad9b13cbcb5f692d2cc7a94d` which also looked like a MD5 hash, by querying it via [CrackStation](https://crackstation.net/), I was able to find it was MD5 hash value for `Token`, then entered `X-Token` as answer and proceeded to PartThreeActivity

PartThreeActivity also had some intent checks
{F850453}
This time things were looking a bit different since *base64* involved then I started to check other parts of PartThreeActivity and noticed there was some *base64* values located:
{F850452}

So when I decoded value of **directory** result was: `host`, and when decoded value of **directoryTwo** result was: `X-Token`

Intent check also was looking value we supplied for **three** and **switch** parameters as *base64* value of `PartThreeActivity` and `on` as respectively, so encoded `PartThreeActivity` and result was: `UGFydFRocmVlQWN0aXZpdHk=`, for `on` when encoded result was: `b24=` then executed following `adb shell` command:

`adb shell am start -a android.intent.action.VIEW -d "three://part?three=UGFydFRocmVlQWN0aXZpdHk=\&switch=b24=\&header=X-Token" -n bounty.pay/.PartThreeActivity`

I was able to pass intent check of PartThreeActivity and next step was checking hash value 
{F850454}

Since we already know APK was saving our process on shared preferences, I viewed details of with using adb shell as following:
`adb shell cat ./data/data/bounty.pay/shared_prefs/user_created.xml`

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="PARTTWO">COMPLETE</string>
    <string name="USERNAME">nukedx</string>
    <string name="HOST">http://api.bountypay.h1ctf.com</string>
    <string name="PARTONE">COMPLETE</string>
    <string name="TWITTERHANDLE">mcipekci</string>
    <string name="TOKEN">8e9998ee3137ca9ade8f372739f062c1</string>
</map>
```

Hash value needed was **8e9998ee3137ca9ade8f372739f062c1** by entering it I was able to complete APK challenge
{F850457}

CongratsActivity also had some valuable information which actually we figured out after viewing shared preferences.
{F850450}

Now we were having some token to use on **api.bountypay.h1ctf.com** 

## OSINT and getting staff credentials via API

After receiving token for API, started to directory brute force and only able to find few endpoints:
```
/api/accounts/{any}
/api/staff/
```
So API wasn't very talkative to us and looked like very limited with using token did simple `GET` request on `/api/staff` endpoint:
{F850432}

I was able to find staff details but they were only names and their staff ids, then wanted to test `POST` request on same endpoint, since we had `staff_id` parameter on previous request did some request like this:
{F850433}

It was giving error like **Staff Member already has an account**, since staff id's look like `STF:AZ09{10}` combination brute forcing a staff id which is not associated with account details would be hard, around same moments HackerOne made a retweet from handle **BountyPayHQ**
{F850427}

I start to check that handle and noticed they were celebrating a new team member called **Sandra**
{F850429}

She was not in the list of previously found staff members and started to check her twitter profile, interestingly she had some ID card with **BountyPay** logo on it, which was revealing her staff id.
{F850430}

Her staff id was `STF:8FJ3KFISL3` and tried `POST` request on `/api/staff` endpoint which let me get her credentials:
{F850431}

## Staff account and privilege escalation 

Since I found out login credentials for Sandra, logged in to her account on `https://staff.bountypay.h1ctf.com` but it looks like Sandra didn't have admin details.

Staff panel had some interesting javascript on `https://staff.bountypay.h1ctf.com/js/website.js`
{F850463}

It looks like admins can upgrade normal users on the staff system to admin as well and if there is a location hash on URL, javascript automatically triggers a click event for context assigned to them.

There was also report function for users to report pages they are on to admins or viewing but it strictly stated that: `Pages in the /admin directory will be ignored for security` so we can not use `/admin/upgrade?username=sandra.allison` for reporting too, so there must be a way to privilege escalation.

Since we know `#tab` classes auto clicks if there is a location hash with that class name we can combine multiple classes like `upgradeToAdmin tab2` but we must be able to find an injection point for it.

I realized that there was a update profile option and avatar we select is actually a class defined in cascading style sheet of page, so maybe we can trick server to have some other classes in our avatar, therefore I used inspect element option of my browser and edited value of **avatar2** and saved it:
{F850461}

After updating avatar went to ticket page and inspected avatar of Sandra:
{F850468}

So it was successful so decided to check if we can execute javascript with having location hash on URL:
{F850469}

It brought some problem username is send as undefined to server, so we must check if there is another endpoint which is having **username** input, since staff portal loading templates as query parameter, tried various potential template names and only one was having **username** input which is very first `login` template, then decided to check if there is any other endpoint unfortunately none.
{F850465}

Since we know **app.bountypay.h1ctf.com** was running as PHP, only potential thing left to try was sending query string parameter as array, since PHP can read query strings as is which means if we pass `param[]=value` as query string, param will read into array, so we will simply send `template[]=home` as first try to see if it loads page at all, and it was successful then wanted to try `template[]=login&template[]=ticket` in hope of template parameter handled as array too on app itself, result was successful as well now both templates loaded, I requested following page from server `/?template[]=login&template[]=ticket&ticket_id=3582&username=sandra.allison#tab2`
{F850460}

Now we can try to see if **username** sent as undefined or not:
{F850462}

Since report to admin function relies `url` variable located on page we must alter it, we could alter request by simply intercepting with any proxy as well but for such simple stuff, I decided to use developer tools:
{F850467}

It was executed properly:
{F850466}

So it was time to check home page of staff portal and see if we gained admin rights:
{F850464}

We were successfully escalated to admin rights and when viewing admin section noticed `marten.mickos` had their password available there as plain text
{F850459}

##Log in as Marten and pay all the bounties

It was incredible we find out *Mårten Mickos'* account details and now we can try login into it, looks like we had same 2FA process on very beginning of finding out login credentials for `brian.oliver` so by applying same logic, I was able to login his customer dashboard. after viewing current months statement, I noticed there was some unpaid bounties to our hacker friends:
{F850443}

It looks like **BountyPay** had extra layer of security so for approving payments we need another 2FA:
{F850434}

Interestingly this time there was some weird request which was having parameter called `app_style` in `POST` requests data
{F850435}

It looked like SSRF at glance was hitting any target I sent for but result was blind and since initial request had **css** as extension, this looked like either exfiltration data with CSS or some stored XSS, for eliminating stored XSS possibility, I tested simple payload like: `"><b>x</b>` and request I got on my collab server was having `"<>/` characters were sanitized and requested filename was looking like `file.extbxb`.

So I eliminated stored XSS, and checked next page of 2FA, realized this time it's 7 characters and trick we used on initial 2FA was not working so we must gain a 2FA code so went straightforward for exfiltration data with CSS, made {F850441} and started to send request to target.
{F850438} 

After some time revealed first 4 chars of input which was `code`: 
{F850442} 

So assumed input value was code and used {F850439} interestingly we were not getting any request at all, output for css from failed attempt was:
{F850440}

As we can see we directly used `=code` after altering it to `"^=code"`, we realized we were getting two hits this time:
{F850444}

Currently we were in misleading direction so we must figure out full input names, given habit of usage on `_` character, wanted to try `code_` as input value and we continued to get multiple requests after than figured out its sequential like `code_1` `code_2` etc and made {F850447}

I think we had some network problem had struggles like:
{F850448}

After few tries we were able to get first 6 characters for 2FA:
{F850446} 

For last char went for brute forcing with burp intruder and result was:
{F850437}

So we paid all the bounties to hackers :)

## Rabbit holes during event

1. `/pay/id/hash/` on `https://app.bountypay.h1ctf.com` forced us to believe there was an IDOR on early stages.
1. Login screen on `https://software.bountypay.h1ctf.com` 
1. Not being able to download APK due to permission :D
1. Since we were not expecting any OSINT in the first place, not being able to find any other endpoint on api was so annoying
1. Before realizing it was loading multiple templates with arrays, we realized each time updating profile was changing cookie value so thought we must decode cookie which was using some custom alphabet base64 and regular base64 over it which is really hard to achieve :D
1. Open redirect whitelist needs `/` at the end of URL which forced me and many other to believe there was something else :D
1.  `app_styles` param on the very last 2FA many believed it would be SSRF due to the user agent at first until they realized it's actually imitating a human being.

## After event findings

Since we always getting failed amount data with CSS exfiltration, realized it was actually due to not using **double quote** on input name and value and using `*~` in between of input and style, so it is actually causing some issues with chrome and not processing all styles, fixed php code for my PoC can be found on this [pastebin](https://pastebin.com/VnUrDx5T), since I already made two posts for attachments and didn't want to make another one.

Android APK is saving API token right after completing PartOneActivity, so other parts of the event could be skipped by a person who reads and analyzes entire codes :)

Open redirect whitelist for google is actually checking if `REST` is part of a query string so you can just use `https://www.google.com/?REST` :)

On first 2FA challenge you can ignore **challenge_answer** since it's not checking length of data send by user and directly push `d41d8cd98f00b204e9800998ecf8427e` as challenge hash which is md5 value of null :)

## Shoutouts

@ziot @superhero exchanging ideas with me during the event, @NahamSec @b3nac and @Adamtlangley for an amazing CTF.

@zeroxyele for letting me figure out issue with CSS exfiltration after finishing it as well during our convo for rabbit holes and issues encountered, he mentioned he was using [Jonathan Omisore's CSS keylogger](https://github.com/JonathanOmisore/CSS-Keylogging/blob/master/css-keylogger-extension/keylogger.css) so after viewing I realized issue for how Chromium was failing to handle CSS files.

I tried to make this write up as much as from my view and wanted to show using different tools and ways is possible to achieve the same results, instead of relying on one tool. I hope whoever reads this write up will enjoy it as much as I enjoyed the CTF and writing this up :)


## Impact

Multiple vulnerabilities leading attacker to takeover any bounty pay user.

## Timeline

- **Report Filed**
- **2020-06-01** @nukedx: Going to use this post for attachments
- **2020-06-01** @nukedx: Looks like I will use this as well since I forget few attachments, sorry for flood! :)
- **Report Triaged**
- **Report Title Updated**
- **2020-06-11** @nahamsec: Hello,

I wanted to personally thank you for participating in the #h12006 2020 CTF, I hope you enjoyed the challenge! We received tons of great submission and it definitely made our decision a lot harder than we excepted. Unfortunately, since we only have a limited number of invites available, your write up was not selected for this event. We appreciate your hard work and we hope to see you participate in our next CTF!

We will send you a request to publicly disclose your submissions next week, so please hold on to your writeups, we'll make sure to let you know when you can publish them on your site!

If you were one of the first 10 people to submit a write-up,  look out for some private invite in the next few days!
- **2020-06-11** @nukedx: No problem! All is well :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
