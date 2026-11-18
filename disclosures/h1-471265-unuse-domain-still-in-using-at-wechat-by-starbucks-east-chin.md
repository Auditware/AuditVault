---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2019-01-22
submitted: 2018-12-22T18:27:37.298Z
bounty_usd: null
votes: 22
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "k3mlol"
source: "https://hackerone.com/reports/471265"
title: "unuse domain still in using at wechat by Starbucks East China"
---
# unuse domain still in using at wechat by Starbucks East China

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 22 | **Program:** Starbucks | **Disclosed:** 2019-01-22

- Report: [https://hackerone.com/reports/471265](https://hackerone.com/reports/471265)
- CWE: Improper Access Control - Generic
- Submitted: 2018-12-22T18:27:37.298Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
spcc.mobi is still using at wechat offical account by Starbucks East China. but this domain is **on sale**.

**Description:**
I had reported this at report_id=433843，bu your gays had ignored, because they said the domain is unused.

In fact, spcc.mobi still having an interface using at wechat offical account by Starbucks East China

wechat offical account name is **星巴克江浙沪**

endponit request below:

``` html
GET /v5/bind.html HTTP/1.1
Host: coupon.ec-starbucks.cn
User-Agent: Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MOB31E; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044405 Mobile Safari/537.36 MMWEBID/157 MicroMessenger/6.7.3.1360(0x260703EC) NetType/WIFI Language/zh_CN Process/tools
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,image/wxpic,image/sharpp,image/apng,image/tpg,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,en-US;q=0.8
Cookie: PHPSESSID=ip1f71qqak3kvakksu28bensjlapsh9a; Hm_lvt_b7c2e12efc764f8179148ddbece8211f=1545489448; Hm_lpvt_b7c2e12efc764f8179148ddbece8211f=1545489448
Connection: close

```
reponse is below:

``` html
....
<script>
	$(function(){
		$.get('http://weixin.spcc.mobi/oauth/_jssdk.html',{url:location.href.split('#')[0]},function(data){
			 wx.config($.extend({
			    debug: false,
			    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideMenuItems','showMenuItems','hideOptionMenu','showOptionMenu',]
			},data));
		},'jsonp');
	})
	
	wx.ready(function () {	
		wx.hideOptionMenu();
	});

</script>
....
```

**Platform(s) Affected:**
- coupon.ec-starbucks.cn(Starbucks East China in using)

## Steps To Reproduce:

#### plan A(easy)
1. request the endpoint I offer
2. you will find the reponse contain "weixin.spcc.mobi"
3. visit the **weixin.spcc.mobi** you will find that this domain is on sale

#### plan B(complicated)
1. register a wechat account(download the app(name is wechat) from app store or play store)
2. search wechat offical account **星巴克江浙沪** then follow
3. click my card
4. you can find the requests as the I had mention.

## Recommendations for fix
remove the the unused **weixin.spcc.mobi** endpoint

## Impact

the domain is on sale, if attacker buy  this domain, can full control this domain for(Phishing Attack and etc.)

## Timeline

- **Report Filed**
- **2018-12-22** @k3mlol: I tell some background: **wechat** is the top 1 IM  tool in China, billions users. Wechat offer two main service for company, help company connect the consumer. one is  **wechat offical account**, other is **mini programs**.

 in 2019, I will take some  time to test the wechat service which offer by Starbucks China.

Merry Christmas.
- **2018-12-24** @lollipup: Hi @k3m,

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Kind regards,
@lollipup
- **Report Needs More Info**
- **Report New**
- **2018-12-24** @k3mlol: my burp result
- **2018-12-25** @k3mlol: @lollipup it seem to verify the cookie. I had wrote a python script help you to Triaged, I had refresh the cookie.
- **2018-12-27** @k3mlol: @lollipup hey, I ad refresh a cookie for you:
``` html
PHPSESSID=70ubsnm9lomiqumit5e0mq5sti1dpuka
```
- **Report Needs More Info**
- **Report New**
- **2019-01-02** @k3mlol: @lollipup, it's time to register a wechat account hahaha.
- **Report Triaged**
- **2019-01-05** @k3mlol: @nitrobr3w ok, maybe you need to bug down this domain name
- **2019-01-08** @nitrobr3w: @k3m, Can you please verify if the issue still exists ?
- **2019-01-08** @k3mlol: @nitrobr3w plz, wait a min
- **2019-01-08** @k3mlol: @nitrobr3w Yes, it's fixed. nice work
- **Bounty Awarded**
- **Report Resolved**
- **2019-01-10** @k3mlol: @nitrobr3w thx, daqi 666
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
