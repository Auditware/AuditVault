---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2020-06-18
submitted: 2020-05-31T08:37:40.446Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "bugra"
source: "https://hackerone.com/reports/887816"
title: "[H1-2006 2020] I made the CEO's bounty payment!"
---
# [H1-2006 2020] I made the CEO's bounty payment!

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 28 | **Program:** h1-ctf | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/887816](https://hackerone.com/reports/887816)
- CWE: N/A
- Submitted: 2020-05-31T08:37:40.446Z

## Timeline

- **Report Filed**
- **2020-05-31** @bugra: ##Write-up

##Beginning and finding the customer's credentials

Firstly, I saw the [HackerOne's tweet](https://twitter.com/Hacker0x01/status/1266454022124376064) and I saw the `*.bountypay.h1ctf.com` in the h1-ctf program. There is a wildcard in URL so I used [subfinder](https://github.com/projectdiscovery/subfinder) for finding subdomains.
{F849709}

After that, I spent some time in `bountypay.h1ctf.com` and I saw there are 2 portals `Customers` and `Staff`.
I used [ffuf](https://github.com/ffuf/ffuf) tool for finding some paths and file in `bountypay.h1ctf.com` but I couldn't find any interesting path. So I tried same thing on the `Customers` portal : `app.bountypay.h1ctf.com`

{F849719}
And I saw an interesting directory `.git`, I tried to see the content but I saw `403 Forbidden` so I used the [ffuf](https://github.com/ffuf/ffuf) again under the `.git` directory. It found the `config`, and I visited the https://app.bountypay.h1ctf.com/.git/config and I downloaded the config file.
{F849721}
Do you see the Github link? I want it ԅ(≖‿≖ԅ)
I saw the `logger.php` file in the Github repository.
{F849722}
The last line caught my attention. I went to https://app.bountypay.h1ctf.com/bp_web_trace.log immediately. I found this code :

```
1588931909:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJHRVQiLCJQQVJBTVMiOnsiR0VUIjpbXSwiUE9TVCI6W119fQ==
1588931919:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIn19fQ==
1588931928:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC8iLCJNRVRIT0QiOiJQT1NUIiwiUEFSQU1TIjp7IkdFVCI6W10sIlBPU1QiOnsidXNlcm5hbWUiOiJicmlhbi5vbGl2ZXIiLCJwYXNzd29yZCI6IlY3aDBpbnpYIiwiY2hhbGxlbmdlX2Fuc3dlciI6ImJEODNKazI3ZFEifX19
1588931945:eyJJUCI6IjE5Mi4xNjguMS4xIiwiVVJJIjoiXC9zdGF0ZW1lbnRzIiwiTUVUSE9EIjoiR0VUIiwiUEFSQU1TIjp7IkdFVCI6eyJtb250aCI6IjA0IiwieWVhciI6IjIwMjAifSwiUE9TVCI6W119fQ==
```
I noticed there are Base64 encoded texts and I decoded them :
```
1588931909:{"IP":"192.168.1.1","URI":"\/","METHOD":"GET","PARAMS":{"GET":[],"POST":[]}}
1588931919:{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX"}}}
1588931928:{"IP":"192.168.1.1","URI":"\/","METHOD":"POST","PARAMS":{"GET":[],"POST":{"username":"brian.oliver","password":"V7h0inzX","challenge_answer":"bD83Jk27dQ"}}}
1588931945:{"IP":"192.168.1.1","URI":"\/statements","METHOD":"GET","PARAMS":{"GET":{"month":"04","year":"2020"},"POST":[]}}
```
So, I went back to `app.bountypay.h1ctf.com` and I tried the credentials :
username : `brian.oliver` password : `V7h0inzX`, the credentials were right and website redirected me to 2FA page!
{F849730}

##2FA Bypass

I writed `test` to 2FA and I saw this request in Burp Suite ;
{F849733}
I tried to decode md5 hash but I got nothing. I noticed the `challenge` parameter's value is must equal to `md5(challenge_answer)`
So I encoded `test` value with md5. I writed `098f6bcd4621d373cade4e832627b4f6` to challenge parameter. And I bypassed the 2FA successfuly.
{F850026}

##SSRF + Path Traversal + Open Redirect
I clicked `Load Transactions` button and I saw this request :
{F849739}

2 things caught my attention, my cookie `eyJhY2NvdW50X2lkIjoiRjhnSGlxU2RwSyIsImhhc2giOiJkZTIzNWJmZmQyM2RmNjk5NWFkNGUwOTMwYmFhYzFhMiJ9` and the URL in the response `https:\/\/api.bountypay.h1ctf.com\/api\/accounts\/F8gHiqSdpK\/statements?month=01&year=2020`
Firstly, I decoded the Base64 :
`{"account_id":"F8gHiqSdpK","hash":"de235bffd23df6995ad4e0930baac1a2"}`
And I saw my account ID is `F8gHiqSdpK` and I went back to the response. I noticed there is my account ID in the API request. I tried to visit this link but I saw this :
{F849744}

It wants a token for API requests. I spent some time in this part and I noticed if we change our `account_id`, the URL changes too.
I encoded the `{"account_id":"test","hash":"de235bffd23df6995ad4e0930baac1a2"}` with Base64 and I tried to send `Load Transactions` request with Base64 hash in my cookie.
{F849748}
And the `account_id` changed to `test` in the API URL. I combined this with path traversal, and I got limited SSRF in the API. I spent some time in API with using this method but I didn't get any interesting result. After that, I saw there is a link inside the https://api.bountypay.h1ctf.com 
{F849764}

And the link in the `REST API` text was `https://api.bountypay.h1ctf.com/redirect?url=https://www.google.com/search?q=REST+API`, there is a Open Redirect! I thought If I combine it with limited SSRF I can get full SSRF. But this didn't go as expected.
I visited the https://api.bountypay.h1ctf.com/redirect?url=http://127.0.0.1 for testing but I got this message : 
`URL NOT FOUND IN WHITELIST`
I was stuck in this part. So I read my notes from beginning. And I noticed the https://software.bountypay.h1ctf.com/ subdomain in subfinder. I saw this error when I try to access it :
{F849787}

So I went back to open redirect and I writed `software.bountypay.h1ctf.com` to `url` parameter. 
https://api.bountypay.h1ctf.com/redirect?url=https://software.bountypay.h1ctf.com/ I didn't get any error and website redirected me to URL. Awesome! I could see the data using SSRF + Open Redirect
I encoded `{"account_id":"../../../../redirect?url=https://software.bountypay.h1ctf.com/#","hash":"de235bffd23df6995ad4e0930baac1a2"}` as Base64 and I writed it to my cookie.
{F849789}

As you can see, I bypassed the IP restriction for `software.bountypay.h1ctf.com`, but It adds `/statements?month=01&year=2020` end of the URL so I used `#` for ignoring this path. And there was a login page in the index but it requires POST method request and I couldn't make it, I could send GET requests only.
I thought I should use some fuzzer for finding directories but I couldn't find any tool for this. I saw there is a feature in Burp Suite. The `Payload Processing` feature helped me for fuzzing directories. I used this rules :
{F849797}

**What it does?**
1. It takes our payload position
1. It adds `{"account_id":"../../../../redirect?url=https://software.bountypay.h1ctf.com/` to beginning of the URL
1. It adds our payload. (directory)
1. It adds `#","hash":"de235bffd23df6995ad4e0930baac1a2"}` to end of the URL
1. Encodes as Base64 the final payload

Using this technique, I found the `/uploads` folder.
{F849813}

There was `BountyPay.apk` I downloaded it and opened it on android emulator.

##Android Challenges

There was username and twitter handle inputs. I writed random things to them.
Anddd, there was blank page on APK :P
When you click two times for the logo, it sends two hints.
{F849824}
`Deep links` and `Params`, so I should find deeplinks in APK. So I opened the APK using [JADX](https://github.com/skylot/jadx)
I saw 3 deeplinks inside `AndroidManifest.xml`
{F849830}

```
one://part
two://part
three://part
```
And If we open `two://part` directly in Android, it gives error. So we should to find parameters for these deeplinks. I spent some time in JADX, I found this in `bounty.pay.PartOneActivity`
```javascript
if (getIntent() != null && getIntent().getData() != null && (firstParam = getIntent().getData().getQueryParameter("start")) != null && firstParam.equals("PartTwoActivity") && settings.contains("USERNAME")) {
	String user = settings.getString("USERNAME", "");
	SharedPreferences.Editor editor = settings.edit();
	String twitterhandle = settings.getString("TWITTERHANDLE", "");
	editor.putString("PARTONE", "COMPLETE").apply();
	logFlagFound(user, twitterhandle);
	startActivity(new Intent(this, PartTwoActivity.class));
}
```
Basically, it takes the value of `start` parameter and if this parameter equals to `PartTwoActivity` you will complete the Part One.
So I writed `<a href="one://part?start=PartTwoActivity">partone` to HTML editor on Emulator. And when I click this, I completed the Part One.
{F849838}

And there was 2 hints in Part Two. `Currently invisible` and `Visible with the right params.`
I went back to JADX and I spent some time again. I found this in `bounty.pay.PartTwoActivity`:

```javascript
if (getIntent() != null && getIntent().getData() != null) {
	Uri data = getIntent().getData();
	String firstParam = data.getQueryParameter("two");
	String secondParam = data.getQueryParameter("switch");
	if (firstParam != null && firstParam.equals("light") && secondParam != null && secondParam.equals("on")) {
		editText.setVisibility(0);
		button.setVisibility(0);
		textview.setVisibility(0);
	}
```
There are 2 params `two` and `switch`, value of `two` must be `light` and value of `switch` must be `on`. So the deeplink is : `<a href="two://part?two=light&switch=on">parttwo`
{F849841}
But I didn't finish the Part Two still. There was a md5 hash and it equals to `Token`
{F849842}
I writed `Token` to header value but it was incorrect. And I saw this code 
```javascript
if (str.equals("X-" + ((String) dataSnapshot.getValue()))) {
	PartTwoActivity.this.logFlagFound(settings.getString("USERNAME", ""), settings.getString("TWITTERHANDLE", ""));
	editor.putString("PARTTWO", "COMPLETE").apply();
	PartTwoActivity.this.correctHeader();
	return;
```
There is an interesting line : `if (str.equals("X-" + ((String) dataSnapshot.getValue())))`, it means there must be `X-` beginning of the header value. So value must be `X-Token`, I writed it and I completed the Part Two:
{F849846}
There was 2 hints again `Reuse some params.` and `Intercept or check for leaks.` I found this code in `bounty.pay.PartThreeActivity`
```javascript
if (getIntent() != null && getIntent().getData() != null) {
	Uri data = getIntent().getData();
	String firstParam = data.getQueryParameter("three");
	String secondParam = data.getQueryParameter("switch");
	String thirdParam = data.getQueryParameter("header");
	byte[] decodeFirstParam = Base64.decode(firstParam, 0);
	byte[] decodeSecondParam = Base64.decode(secondParam, 0);
	final String decodedFirstParam = new String(decodeFirstParam, StandardCharsets.UTF_8);
	final String decodedSecondParam = new String(decodeSecondParam, StandardCharsets.UTF_8);
	AnonymousClass5 r17 = r0;
	DatabaseReference databaseReference = this.childRefThree;
	byte[] bArr = decodeSecondParam;
	final String str = firstParam;
	byte[] bArr2 = decodeFirstParam;
	final String str2 = secondParam;
	String str3 = secondParam;
	final String secondParam2 = thirdParam;
	String str4 = firstParam;
	final EditText editText2 = editText;
	Uri uri = data;
	final Button button2 = button;
	AnonymousClass5 r0 = new ValueEventListener() {
		public void onDataChange(DataSnapshot dataSnapshot) {
			String str;
			String value = (String) dataSnapshot.getValue();
			if (str != null && decodedFirstParam.equals("PartThreeActivity") && str2 != null && decodedSecondParam.equals("on") && (str = secondParam2) != null) {
				if (str.equals("X-" + value)) {
					editText2.setVisibility(0);
					button2.setVisibility(0);
					PartThreeActivity.this.thread.start();
				}
			}
		}
```
There are 3 parameters `three` `switch` and `header`. It encodes `three` and `switch` params' value as Base64
`three` must equals to `b64("PartThreeActivity")` = `UGFydFRocmVlQWN0aXZpdHk=`
`switch` must equals to `b64("on")` = `b24=`
`header` must equals to our `X-Token` header.
So the final deeplink was : `<a href="three://part?three=UGFydFRocmVlQWN0aXZpdHk=&switch=b24=&header=X-Token">partthree`
{F849865}
But the app wants a leaked hash. Remember the hint `Intercept or check for leaks.`, I intercepted but I didn't get any request in Burp Suite. So I should find another way to get the hash. I noticed the app logs our username etc. So I saw `user_created.xml` in `data > data > bounty.pay > shared_prefs`
{F849871}
We got our token! `8e9998ee3137ca9ade8f372739f062c1`, I pasted it to app and I submitted it :
{F849882}
Finally!
{F850085}

##Surfing on API
`8e9998ee3137ca9ade8f372739f062c1` was our API token too. So I can access `api.bountypay.h1ctf.com` with `X-Token: 8e9998ee3137ca9ade8f372739f062c1` header.
I did some surf on API and I found this endpoint :
{F849893}
I was able to see staffs, but I couldn't access anything about them. After spending a lot of time, I changed `GET` method to `POST` on same endpoint using `Change request method` option on Burp Suite and the response was ;
```
HTTP/1.1 400 Bad Request
Server: nginx/1.14.0 (Ubuntu)
Date: Sun, 31 May 2020 13:28:31 GMT
Content-Type: application/json
Connection: close
Content-Length: 21

["Missing Parameter"]
```

It wants a parameter, I tried a lot of parameters, but the right parameter was inside the `GET` request's response.
`staff_id` is the right parameter. And I tried the staff IDs as value and I got `["Staff Member already has an account"]`
So... should I find a staff ID that hasn't account? Yes, but how? I spent hours for that, but I couldn't figure out until NahamSec's message on [Hacker101 discord](https://discord.com/invite/32ZNZVN)
{F849902}
That was awesome hint! NahamSec retweeted a tweet from `@BountypayHQ` 
{F849903}
This twitter account is following an interesting account `@SandraA76708114` and there is an interesting tweet.
https://twitter.com/SandraA76708114/status/1258693001964068864
{F849904}
I see a staff ID  (͡ ° ͜ʖ ͡ °) `STF:8FJ3KFISL3` and If we write this ID to our endpoint :
{F849905}
Bingo! Got the staff credentials :)

## Staff Portal
There was a ticket portal.

https://staff.bountypay.h1ctf.com/?template=ticket&ticket_id=3582
{F849906}

There was a profile page that we can change our name and avatar.

{F849917}

There was a report page that we can send the current URL for report to Admin. (url is base64 encoded)

{F849922}

There was `website.js` and it contains this code : 

```javascript
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

Interesting... there is a endpoint `/admin/upgrade?username=`, I tried to access it but I saw `"Only admins can perform this"` error. So the admin must click this link to upgrade our account `https://staff.bountypay.h1ctf.com/admin/upgrade?username=sandra.allison`
But, how? Wait, we can send the URLs to admin using report feature! But If you read the Report Page, you will see `Pages in the /admin directory will be ignored for security`. So I should find another way to trigger `upgradeToAdmin` event. 
If you read the JavaScript code, there are hashtags `#tab1` `#tab2` `#tab3` and `#tab4` and using these you can switch the tabs. And they does `click` event.
So, If we call `click` event with `upgradeToAdmin`, we will send the upgrade request! 
I searched for class attribute and I found the avatar code :
{F849943}

I tried to change my avatar and I caught this request! 
{F849944}

I changed value of `profile_avatar` to `avatar2 tab2 upgradeToAdmin` and I saw `<div style="margin:auto" class="avatar avatar2 tab2 upgradeToAdmin"></div>` in response. Awesome! I writed #tab2 to end of the URL. And I checked the requests :
{F849947}
Yes! I sent the request, but there is a problem again. The JavaScript code takes the `username` value from input. And I should find a input that contains `name="username"` so I searched `username` in Burp Suite. And I found this input on Login page.
https://staff.bountypay.h1ctf.com/?template=login
But how to write our username to this input automatically? Easy, just add `&username=sandra.allison` to end of the URL.
And another question, how can we see this page on our Staff dashboard? This question took my a lot of hours. 
At the end, I figured out I can see multiple templates using `template` parameter like arrays.

So the final URL was : https://staff.bountypay.h1ctf.com/?template[]=login&template[]=ticket&ticket_id=3582&username=sandra.allison#tab2
We use the `ticket` template because admin can see our avatar in this page.
I encoded as Base64 this URL and I sent report to admin with this URL.
{F849981}

New cookies? Bingo! There was new tab on Staff dashboard!

{F849990}

## Let's make the CEO's bounty payment!
Got our CEO's credentials. I tried this credentials on Staff login but it didn't work. So I went back to Customers app, I writed credentials and I saw 2FA page again. No worries, I was able to bypass with same technique.

{F849997}

Let's click `Pay` and finish the CTF!
{F849998}

Nope! This 2FA system was different and we should bypass it to.
{F850005}

I clicked `Send Challenge`  and I saw this request :

{F850010}
I sent it to repeater and I noticed 2 things in 2FA page
- We have 2 minutes to write the true 2FA code
- The 2FA code is limited to 7 characters
    {F850012}

I went back to CSS request, I tried everything in this request like XXE, SSRF, XSS etc. but I didn't get anything. We can  import a CSS from **SSL enabled** website only. But the CSS link isn't reflect to our response. 

Probably, it imports the CSS in background. Question, how can we get data with CSS? **using CSS exfil!**
I won't lie, this part was very hard. But I learned a lot of things :)

[This](https://hackerone.com/reports/679969) short but nice report taught me about CSS exfil. So If there is a 2FA, I think there must be input! 

Then, I searched CSS keyloggers and I found this example CSS :
https://github.com/maxchehab/CSS-Keylogging/blob/master/css-keylogger-extension/keylogger.css

I deleted `[type="password"]` and I changed `value` to `name` in this CSS. Because I wanted to find input names firstly. I uploaded this CSS file to my server and I sent the `Pay` request again with my malicious CSS URL.

{F850059}

Yes! There are 7 inputs and the 2FA character limit was 7! After playing more, I got the all input names!

```
code_1
code_2
code_3
code_4
code_5
code_6
code_7
```
So each input has 1 character, and If we combine them we will get the 2FA code! I prepared a CSS with Notepad++ and It worked like a charm. {F850066}

{F850067}

I combined them `5nATkIr` and I writed it to 2FA code.

{F850068}

This CTF was awesome! I learned a lot of things, thanks HackerOne team!
And, thank you very much for reading :)

{F850083}
- **2020-06-08** @bugra: I forgot to change the report's title. Can you change it to "I made CEO's bounty payment!" for me please?
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **2020-06-17** @nahamsec: Hello and congrats on winning the #h12006 CTF! On Thursday, June 25th we plan to do a live stream and talk about our latest CTF. Would you be interested in joining us to chat about your experience with the CTF? 

Thanks,
Ben
- **2020-06-18** @bugra: Hi @nahamsec, thank you very much! :) Regarding the live stream, I appreciate that. Thanks but I can't join you :( It was an awesome CTF. I had so much fun. Before disclosing the report, can you change the title to "[H1-2006 2020] I made the CEO's bounty payment!" please?

Regards,
Bugra
- **Report Title Updated**
- **Report Title Updated**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
