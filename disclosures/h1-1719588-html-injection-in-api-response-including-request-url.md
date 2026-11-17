---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/remote-file-inclusion
  - env/web
substate: "informative"
weakness: "Remote File Inclusion"
enriched: true
date: 2023-05-18
submitted: 2022-10-02T04:02:09.331Z
bounty_usd: null
votes: 11
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "prilvesh"
source: "https://hackerone.com/reports/1719588"
title: "HTML injection in API response including request url"
---
# HTML injection in API response including request url

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Reddit | **Disclosed:** 2023-05-18

- Report: [https://hackerone.com/reports/1719588](https://hackerone.com/reports/1719588)
- CWE: Remote File Inclusion
- Submitted: 2022-10-02T04:02:09.331Z

## Timeline

- **Report Filed**
- **2022-10-02** @prilvesh: update since the first one was supposed to be uri encoded  for  secret message
PROOF OF Terrorist & Illegal bombing messages being distributed
https://s.reddit.com/WELCOME_TO_MY_CRIME_NETWORK_RIGHT_CLICK_AND_NAVIGATE_TO_THIS=data:text/html,%3Cstyle%3Ebody%7Bbackground-color:red;color:white%7Dh1%7Bfont-size:50pt;margin-top:400PX;margin-left:100px;%7Dp%7Bfont-size:25pt;margin-left:100px;%7D%3C/style%3E%3Ch1%3ETop%20Secret%20ILLEGAL%20Criminal%20MESSAGE%20DISTRIBUTION%3C/h1%3E%3Cp%3E%20This%20message%20will%20not%20be%20detected%20by%20AI%20systems,Your%20Mission%20%20is%20%20to%20Blow%20up%20something%20on%20the%2012%20of%20December%202022%20%204%20pm%20a%20%20water%20melon%20%20%20at%20location%20MEXICO%20CITY%3C/h1%3E

update since first one was supposed to have [] removed  for
PROOF OF Storing and Distributing JSON data using reddit.
https://s.reddit.com/ILLEGAL_JSON_DISTRIBUTION_DOWNLOAD_HERE=data:text/json;charset=utf-8,%20%7B%20%22id%22:%201,%20%22name%22:%20%22Leanne%20Graham%22,%20%22username%22:%20%22Bret%22,%20%22email%22:%20%22Sincere@april.biz%22,%20%22address%22:%20%7B%20%22street%22:%20%22Kulas%20Light%22,%20%22suite%22:%20%22Apt.%20556%22,%20%22city%22:%20%22Gwenborough%22,%20%22zipcode%22:%20%2292998-3874%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-37.3159%22,%20%22lng%22:%20%2281.1496%22%20%7D%20%7D,%20%22phone%22:%20%221-770-736-8031%20x56442%22,%20%22website%22:%20%22hildegard.org%22,%20%22company%22:%20%7B%20%22name%22:%20%22Romaguera-Crona%22,%20%22catchPhrase%22:%20%22Multi-layered%20client-server%20neural-net%22,%20%22bs%22:%20%22harness%20real-time%20e-markets%22%20%7D%20%7D,%20%7B%20%22id%22:%202,%20%22name%22:%20%22Ervin%20Howell%22,%20%22username%22:%20%22Antonette%22,%20%22email%22:%20%22Shanna@melissa.tv%22,%20%22address%22:%20%7B%20%22street%22:%20%22Victor%20Plains%22,%20%22suite%22:%20%22Suite%20879%22,%20%22city%22:%20%22Wisokyburgh%22,%20%22zipcode%22:%20%2290566-7771%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-43.9509%22,%20%22lng%22:%20%22-34.4618%22%20%7D%20%7D,%20%22phone%22:%20%22010-692-6593%20x09125%22,%20%22website%22:%20%22anastasia.net%22,%20%22company%22:%20%7B%20%22name%22:%20%22Deckow-Crist%22,%20%22catchPhrase%22:%20%22Proactive%20didactic%20contingency%22,%20%22bs%22:%20%22synergize%20scalable%20supply-chains%22%20%7D%20%7D,%20%7B%20%22id%22:%203,%20%22name%22:%20%22Clementine%20Bauch%22,%20%22username%22:%20%22Samantha%22,%20%22email%22:%20%22Nathan@yesenia.net%22,%20%22address%22:%20%7B%20%22street%22:%20%22Douglas%20Extension%22,%20%22suite%22:%20%22Suite%20847%22,%20%22city%22:%20%22McKenziehaven%22,%20%22zipcode%22:%20%2259590-4157%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-68.6102%22,%20%22lng%22:%20%22-47.0653%22%20%7D%20%7D,%20%22phone%22:%20%221-463-123-4447%22,%20%22website%22:%20%22ramiro.info%22,%20%22company%22:%20%7B%20%22name%22:%20%22Romaguera-Jacobson%22,%20%22catchPhrase%22:%20%22Face%20to%20face%20bifurcated%20interface%22,%20%22bs%22:%20%22e-enable%20strategic%20applications%22%20%7D%20%7D,%20%7B%20%22id%22:%204,%20%22name%22:%20%22Patricia%20Lebsack%22,%20%22username%22:%20%22Karianne%22,%20%22email%22:%20%22Julianne.OConner@kory.org%22,%20%22address%22:%20%7B%20%22street%22:%20%22Hoeger%20Mall%22,%20%22suite%22:%20%22Apt.%20692%22,%20%22city%22:%20%22South%20Elvis%22,%20%22zipcode%22:%20%2253919-4257%22,%20%22geo%22:%20%7B%20%22lat%22:%20%2229.4572%22,%20%22lng%22:%20%22-164.2990%22%20%7D%20%7D,%20%22phone%22:%20%22493-170-9623%20x156%22,%20%22website%22:%20%22kale.biz%22,%20%22company%22:%20%7B%20%22name%22:%20%22Robel-Corkery%22,%20%22catchPhrase%22:%20%22Multi-tiered%20zero%20tolerance%20productivity%22,%20%22bs%22:%20%22transition%20cutting-edge%20web%20services%22%20%7D%20%7D,%20%7B%20%22id%22:%205,%20%22name%22:%20%22Chelsey%20Dietrich%22,%20%22username%22:%20%22Kamren%22,%20%22email%22:%20%22Lucio_Hettinger@annie.ca%22,%20%22address%22:%20%7B%20%22street%22:%20%22Skiles%20Walks%22,%20%22suite%22:%20%22Suite%20351%22,%20%22city%22:%20%22Roscoeview%22,%20%22zipcode%22:%20%2233263%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-31.8129%22,%20%22lng%22:%20%2262.5342%22%20%7D%20%7D,%20%22phone%22:%20%22(254)954-1289%22,%20%22website%22:%20%22demarco.info%22,%20%22company%22:%20%7B%20%22name%22:%20%22Keebler%20LLC%22,%20%22catchPhrase%22:%20%22User-centric%20fault-tolerant%20solution%22,%20%22bs%22:%20%22revolutionize%20end-to-end%20systems%22%20%7D%20%7D,%20%7B%20%22id%22:%206,%20%22name%22:%20%22Mrs.%20Dennis%20Schulist%22,%20%22username%22:%20%22Leopoldo_Corkery%22,%20%22email%22:%20%22Karley_Dach@jasper.info%22,%20%22address%22:%20%7B%20%22street%22:%20%22Norberto%20Crossing%22,%20%22suite%22:%20%22Apt.%20950%22,%20%22city%22:%20%22South%20Christy%22,%20%22zipcode%22:%20%2223505-1337%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-71.4197%22,%20%22lng%22:%20%2271.7478%22%20%7D%20%7D,%20%22phone%22:%20%221-477-935-8478%20x6430%22,%20%22website%22:%20%22ola.org%22,%20%22company%22:%20%7B%20%22name%22:%20%22Considine-Lockman%22,%20%22catchPhrase%22:%20%22Synchronised%20bottom-line%20interface%22,%20%22bs%22:%20%22e-enable%20innovative%20applications%22%20%7D%20%7D,%20%7B%20%22id%22:%207,%20%22name%22:%20%22Kurtis%20Weissnat%22,%20%22username%22:%20%22Elwyn.Skiles%22,%20%22email%22:%20%22Telly.Hoeger@billy.biz%22,%20%22address%22:%20%7B%20%22street%22:%20%22Rex%20Trail%22,%20%22suite%22:%20%22Suite%20280%22,%20%22city%22:%20%22Howemouth%22,%20%22zipcode%22:%20%2258804-1099%22,%20%22geo%22:%20%7B%20%22lat%22:%20%2224.8918%22,%20%22lng%22:%20%2221.8984%22%20%7D%20%7D,%20%22phone%22:%20%22210.067.6132%22,%20%22website%22:%20%22elvis.io%22,%20%22company%22:%20%7B%20%22name%22:%20%22Johns%20Group%22,%20%22catchPhrase%22:%20%22Configurable%20multimedia%20task-force%22,%20%22bs%22:%20%22generate%20enterprise%20e-tailers%22%20%7D%20%7D,%20%7B%20%22id%22:%208,%20%22name%22:%20%22Nicholas%20Runolfsdottir%20V%22,%20%22username%22:%20%22Maxime_Nienow%22,%20%22email%22:%20%22Sherwood@rosamond.me%22,%20%22address%22:%20%7B%20%22street%22:%20%22Ellsworth%20Summit%22,%20%22suite%22:%20%22Suite%20729%22,%20%22city%22:%20%22Aliyaview%22,%20%22zipcode%22:%20%2245169%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-14.3990%22,%20%22lng%22:%20%22-120.7677%22%20%7D%20%7D,%20%22phone%22:%20%22586.493.6943%20x140%22,%20%22website%22:%20%22jacynthe.com%22,%20%22company%22:%20%7B%20%22name%22:%20%22Abernathy%20Group%22,%20%22catchPhrase%22:%20%22Implemented%20secondary%20concept%22,%20%22bs%22:%20%22e-enable%20extensible%20e-tailers%22%20%7D%20%7D,%20%7B%20%22id%22:%209,%20%22name%22:%20%22Glenna%20Reichert%22,%20%22username%22:%20%22Delphine%22,%20%22email%22:%20%22Chaim_McDermott@dana.io%22,%20%22address%22:%20%7B%20%22street%22:%20%22Dayna%20Park%22,%20%22suite%22:%20%22Suite%20449%22,%20%22city%22:%20%22Bartholomebury%22,%20%22zipcode%22:%20%2276495-3109%22,%20%22geo%22:%20%7B%20%22lat%22:%20%2224.6463%22,%20%22lng%22:%20%22-168.8889%22%20%7D%20%7D,%20%22phone%22:%20%22(775)976-6794%20x41206%22,%20%22website%22:%20%22conrad.com%22,%20%22company%22:%20%7B%20%22name%22:%20%22Yost%20and%20Sons%22,%20%22catchPhrase%22:%20%22Switchable%20contextually-based%20project%22,%20%22bs%22:%20%22aggregate%20real-time%20technologies%22%20%7D%20%7D,%20%7B%20%22id%22:%2010,%20%22name%22:%20%22Clementina%20DuBuque%22,%20%22username%22:%20%22Moriah.Stanton%22,%20%22email%22:%20%22Rey.Padberg@karina.biz%22,%20%22address%22:%20%7B%20%22street%22:%20%22Kattie%20Turnpike%22,%20%22suite%22:%20%22Suite%20198%22,%20%22city%22:%20%22Lebsackbury%22,%20%22zipcode%22:%20%2231428-2261%22,%20%22geo%22:%20%7B%20%22lat%22:%20%22-38.2386%22,%20%22lng%22:%20%2257.2232%22%20%7D%20%7D,%20%22phone%22:%20%22024-648-3804%22,%20%22website%22:%20%22ambrose.net%22,%20%22company%22:%20%7B%20%22name%22:%20%22Hoeger%20LLC%22,%20%22catchPhrase%22:%20%22Centralized%20empowering%20task-force%22,%20%22bs%22:%20%22target%20end-to-end%20models%22%20%7D%20%7D%20


Finally here is the  reddit URL  for the demo done in the attached video 
the video shows all the poc's .
https://www.reddit.com/r/cakedecorating/comments/xqe58k/buttercream_ranunculus_these_flowers_have_given/?sort=new
- **2022-10-02** @prilvesh: Please find attached the  Video showing POC Demonstrations 
███
uploaded to google drive since uploading of video here keeps failing for me . 
Thanks
- **2022-10-02** @prilvesh: Managed to upload Video POC  here  [retired google drive link] 
Please find attached the Video showing POC Demonstrations  ███████
- **Report Informative**
- **Agreed On Going Public**
- **2022-10-05** @prilvesh: Hey @h1_analyst_ava
I think I meet the below scope , since the poc video's demonstrated    vulnerabilities that  allow a user to do something they shouldn't  along with Link validation bypass, domain restrictions on posted content bypass .

##scope 
"Low-risk vulnerabilities are typically vulnerabilities that allow a user to do something they shouldn't, but with no serious security implications. Examples include:
 Bypassing domain restrictions on posted content "
"Forcing users to  not use the redesign ."

In the video you see the Reddit's  Link  validation being bypassed when it presented the error  " Link doesn't look right "
Than you see it being abused by different types of crafted links that contain different  types of data being inserted into the  html element  "<a>"  inserted in reddits comments section.

Than you see a user click on the  commented link and being redirected from the Front end of reddit to the back end of reddit  and being exposed to domain restricted content  that would have been removed otherwise.

Technically  this isn't text injection  but  it's  data injection of different data types .
Also the posted  data  for JSON ,  html & css  is not  spoofed in anyway  it's normal  standard Uri encoding by the browser.

data:image/jpeg;base64         - for   jpeg image .
data:json;charset=utf-8,          -for   JSON  (JavaScript Object Notation) is a data type on its own
data:text/html                          -for   html   (HyperText Markup Language or HTML)
data:text                                   -for   text only

Finally when the post of the comment  on reddit is successful  you  see   Content moderation by pass  and   Bypassing domain restrictions on posted content.
If a user had posted Illegal content directly as a comment there post would get removed and they would get banned .

But as you can seen when i post the same content the post remains and I do not get banned also if another user clicks on the inserted  link they see the restricted  content while still remaining on reddit .   

I get you just want  a one step process to validate a exploit  which the above meets Low priority scope.   

It's  just that in the video I went on to demonstrate a 2 step process that makes it a critical vulnerability which demonstrated stored JavaScript can be executed on a curious user who is redirected from the comment  allowing for  xss & remote command executions which meet the critical priority scope. 

In real life this is the same scenario of  having this ability  of planting touch enabled   land mines in on reedits restricted area where I shouldn't be allowed to enter or plant the land mines anyway  and than redirecting unsuspecting users towards it, Obviously some users would press the big red button and become victims same concept applies for the Stored and Persisted Java script  and redirecting from Reddits front end to RediTts api backend.
.
- **Hacker Requested Mediation**
- **2022-11-14** @h1_analyst_caesar: Thanks for reaching out HackerOne mediation team, @prilcool.

After much internal debating with my colleague we definitely see your point, however I find myself in agreement with my colleague's assessment of this finding.

Your effort is nonetheless appreciated and we wish that you'll continue to research and submit any future security issues you find.

Kind regards,
@h1_analyst_caesar
- **2022-11-14** @prilvesh: @h1_analyst_caesar  thank you for the templated reply , I've seen this before .  
Can you as a  human actually explain on what you discussed  about  and advise  how this report does not meet the Low risk vulnerability scope  ?  

The low risk vulnerability scope   quoted verbatim  from the policy is  :
"Low-risk vulnerabilities are typically vulnerabilities that allow a user to do something they shouldn't, but with no serious security implications. Examples include:
Bypassing domain restrictions on posted content "
"Forcing users to not use the redesign ."

Which the report clearly now demonstrates  ,  so  can you  advise how does this report not meet the low-risk scope when the scope clearly says  "allow a user to do something they shouldn't"  and  in this case Bypassing domain restrictions on posted content  and Forcing users to not use the design ?  

Considering this  is purely straight forward and yet  I'm being made to run around in circles  and not getting straight answers  , 
I'll be disclosing this details in public
- **Comments Closed**
- **Report Title Updated**
- **Report Reopened**
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
