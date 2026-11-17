---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/sql-injection
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "SQL Injection"
enriched: true
date: 2017-11-13
submitted: 2016-11-03T13:32:17.535Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "b258ea62bf297b02afa9854"
source: "https://hackerone.com/reports/179920"
title: "WordPress DB Class, bad implementation of prepare method guides to sqli and information disclosure"
---
# WordPress DB Class, bad implementation of prepare method guides to sqli and information disclosure

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 17 | **Program:** WordPress | **Disclosed:** 2017-11-13

- Report: [https://hackerone.com/reports/179920](https://hackerone.com/reports/179920)
- CWE: SQL Injection
- Submitted: 2016-11-03T13:32:17.535Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2016-11-04** @b258ea62bf297b02afa9854: As another example there is working sqli into popular wordpress plugin nextgen gallery (https://wordpress.org/plugins/nextgen-gallery/). It has huge number of active installations and is vulnerable to sqli caused by this WP issue.  Detailed description as attachment.
- **2016-11-06** @b258ea62bf297b02afa9854: Another wordpress core method vulnerable to sqli is get_pages() function located in wp-includes/post.php . In case of attacker controls post_status variable then we have working sqli if it is passed as array and not sanitized as valid text for the input.
- **2016-11-09** @nikolayb: Hey, @slavco, thanks for the added examples. I am attaching our preliminary patch here, it should fix the reported issue, but let us know if you find a case we’ve missed.

We’re still exploring the backwards compatibility implications, since few plugins actually use this functionality.
- **2016-11-09** @b258ea62bf297b02afa9854: I'm afraid that given fix doesn't solve the issue. 

Try this:
$str = $wpdb->prepare("select * from test where id = %s", "%2$%2$%s%ss");
echo $wpdb->prepare($str, " or 1=1#", "t");

will result in:

select * from test where id = '%2$%2$' or 1=1#''t's' 

and this is valid sqli.
- **2016-11-10** @vortfu: > I'm afraid that given fix doesn't solve the issue.

While technically correct, the poc against the patch isn't really valid - you're injecting a valid conversion specification (`%s`) **AND** providing the correct number of arguments when you call `$wpdb->prepare()` for the second time.

If this were real code, the second call to `$wpdb::prepare()` would trigger a PHP notice, via `_doing_it_wrong()`, for all valid values because there wouldn't normally be any conversions to take place.

````
wp> $sql = $wpdb->prepare( 'SELECT * FROM test WHERE id = %s', 'foo' ); // no injection
=> string(38) "SELECT * FROM test WHERE id = 'foo'"
wp> $sql = $wpdb->prepare( $sql, 'bar' ); // _doing_it_wrong()
PHP Notice:  wpdb::prepare was called <strong>incorrectly</strong>. The query argument of wpdb::prepare() must have a placeholder. Please see <a href="https://codex.wordpress.org/Debugging_in_WordPress">Debugging in WordPress</a> for more information. (This message was added in version 3.9.0.) in ...
=> string(35) "SELECT * FROM test WHERE id = 'foo'"
````

In a more realistic use-case, there would be additional placeholders added to the sql during the second call to `$wpdb->prepare()` - such as:

````
wp> $sql = $wpdb->prepare( 'SELECT * FROM test WHERE id = %s', 'foo' ); // no injection
=> string(35) "SELECT * FROM test WHERE id = 'foo'"
wp> $sql = $wpdb->prepare( $sql . ' AND username = %s', 'bar' ); // everything works as expected
=> string(56) "SELECT * FROM test WHERE id = 'foo' AND username = 'bar'"
````

If you were to try and inject an additional conversion specification, everything should fail due to the mismatched number of placeholders and values.

````
wp> $sql = $wpdb->prepare( 'SELECT * FROM test WHERE id = %s', '%s' ); // placeholder injection
=> string(34) "SELECT * FROM test WHERE id = '%s'"
wp> $sql = $wpdb->prepare( $sql . ' AND username = %s', 'bar' ); // failed due to argument mismatch
=> bool(false)
````
- **2016-11-10** @b258ea62bf297b02afa9854: It is valid because on the second call you need to have one more param not exactly the same. 
Regarding the calling ->prepare for two times you know that there are real world examples that show the following:

$sql = "somestring where x='{$condition}' and x='strong' ";
$wpdb->prepare($prequery.$sql,$arg1,$arg2,...) 

Is it valid now?
- **2016-11-11** @b258ea62bf297b02afa9854: Forgot to mention that another argument from my side why test case I propose is valid sqli and vulnerability that exists in the proposed patch is the moment where we state that this method could accept array as input, so there are a lot of cases where sqli will rise again.
- **2016-11-11** @b258ea62bf297b02afa9854: To be much more precise via your examples:

$var1 = user controlled variable

$sql = $wpdb->prepare( 'SELECT * FROM test WHERE id = %s', $var1 ); //ofc no injection

and here we go:

$var2 = esc_sql($_POST["id"]);

here in this case $_POST['id'] could be an array so we have the following: 

$sql = $wpdb->prepare( $sql . ' AND username = %s', $var2 ); // sqli by definition
- **2016-11-13** @b258ea62bf297b02afa9854: From proposed fix I can get the direction from you guys how you want to solve the issue. There is always but and I think that the biggest threat in this bug isn't sprintf functionality with swapping arguments where was your focus, but instead is this line of code in the prepare method:

$query = preg_replace( '|(?<!%)%s|', "'%s'", $query ); // quote the strings, avoiding escaped strings like %%s

This functionality fails on %%%s e.g. won't add quotes and it is quite simple e.g. if you find %s add quotes and it doesn't checks if it causes sql injection e.g. breaks valid sql code. 
That is why my latest example is valid and is real e.g. proposed fix doesn't protect for sql injection in every cases and there is no way to keep compatibility and to be sure that first parameter should be scalar or array ( this will solve my latest test case too ). This means we must focus on this line e.g. to provide smart method for adding quotes on %%%s or omitting %%%%s in this method.

See attachment fix.php, more precisely method checkquotes .

Test samples:

echo $wpdb->prepare("test ' \\\\\' %s ' %%%%%s opa %s third '%s' cool ", "a1","a2","a3","a4")."\n";
echo $wpdb->prepare("test ' \'%s ' %%%%%%s opa %s third '%s' cool ", "a1","a2","a3")."\n";

Output with fix you proposed:

test ' \\\' 'a1' ' %%a2 opa 'a3' third 'a4' cool 
test ' \''a1' ' %%%s opa 'a2' third 'a3' cool 

Output with new method for handling %s and its variants depending of the place in the query:

test ' \\\' a1 ' %%'a2' opa 'a3' third 'a4' cool 
test ' \'a1 ' %%%s opa 'a2' third 'a3' cool  

Now I think wp should be safe from tricking this method and causing sql injection.
- **2016-11-14** @vortfu: The changes made in `fix.php` introduce the following SQLi

````
$sql = $wpdb->prepare( "SELECT * FROM test WHERE id = %s", "'%s" );
$sql = $wpdb->prepare( $sql . " AND name = %s", [ "' OR 1=1 -- -", "ignored" ] );

// fix.php: SELECT * FROM test WHERE id = '\\' OR 1=1 -- - AND name = ignored
//    core: SELECT * FROM test WHERE id = '\'\' OR 1=1 -- -' AND name = 'ignored'
````
- **2016-11-14** @b258ea62bf297b02afa9854: True, that lousy substr_count... Knew I should write my own function :) Will upload fix right now :)
- **2016-11-14** @b258ea62bf297b02afa9854: Edit:
###########
Avoid this answer uploaded wrong file :)
###########
As attachment fix e.g. substr_count is replaced with my own function. Didn't expect native php function to fail in substring counting but it is what it is. Fix as attachment and works even for this test case :)
- **2016-11-14** @b258ea62bf297b02afa9854: It isn't substr_count it is:

$query = str_replace( "'%s'", '%s', $query ); // in case someone mistakenly already singlequoted it 

Now this line it is not needed anymore because function is aware for adding quotes now and we won't be in situation to add quotes twice.Checked twice and made mistake and I've blamed substr_count...

Nvm check attachment
- **2016-11-14** @vortfu: This version of `checkquotes` seems broken (wrt trailing single quotes breaking things).
````
$sql = $wpdb->prepare( 'SELECT * FROM test WHERE id = %s', 'foobar' );
echo $sql . PHP_EOL; // SELECT * FROM test WHERE id = 'foobar''

$sql = $wpdb->prepare( $sql . ' AND name = %s', 'pewpewpew' );
echo $sql . PHP_EOL; // SELECT * FROM test WHERE id = 'foobar'' AND name = pewpewpew
````
- **2016-11-14** @b258ea62bf297b02afa9854: Yes made change in a 
if ( $lq === true && $i<=$chunks_len-2){ 

into (when I was checking the reason for the test cases you provide to me)

if ( $lq === true && $i<=$chunks_len-1){

Now it is changed, check attachment :)
- **2016-11-15** @b258ea62bf297b02afa9854: I would like to add opinion regarding proposed solution from your side and code/method I sent as extra for it. This solution where %1$s are escaped ( for sprintf ) could lead into bugs in some of the plugins out there. There are plugins that use this functionality when preparing queries... 
Anyway I think that after query is prepared there should not be place for %s, %1#s, ... in it e.g. any form of valid sprintf type specifier. 
All of this data should be replaced/removed/cleaned from the query.
- **2016-12-03** @b258ea62bf297b02afa9854: Bump, what is the status of the current issue? When will be fixed and why it takes too long. It is obvious that removing content from final query isn't good for security (based on current design in wordpress core), but your patch combined with smart quotes provided by me is almost ideal solution.
- **2016-12-03** @nikolayb: Hey, slavco,

We’re still looking at the best approach, and we’d like some more time to test with some of the bigger plugins – from experience we’ve seen a lot of weird uses of queries and `prepare` there and we don’t want to break millions of websites. But yes, currently the initial patch with your quotes fixes seems the prevailing approach.

Nikolay.
- **2016-12-03** @b258ea62bf297b02afa9854: I'm glad there is progress with this one.  :)
- **2017-01-28** @aaroncampbell: Hey @slavco,
I apologize for our unresponsiveness. We've had a long and somewhat rough transition to HackerOne. That should not be a valid excuse for not keeping up communication though. I'm adding your report to a list that I will be bringing up with the rest of the team over the next week. I'm also reaching out to our plugin team to see if we can tell if there are any existing uses of `wpdb::prepare()` that might be unexpected broken by this. As @nikolayb said, "from experience we've seen a lot of weird uses of queries and `prepare`".

Sorry again and thank you for your continued patience,
Aaron
- **2017-05-02** @b258ea62bf297b02afa9854: <?php
// Silence is golden.
- **2017-05-02** @aaroncampbell: Hey @slavco,

I know this has been a very slow moving issue and I apologize for that. Breaking changes to such widely used functions have historically been extremely troublesome, so we try to be especially careful and thoughtful about our approaches. We've run some of the potential solutions past a set of plugin authors and have been discussing it internally as well. We'll try to get back to you soon with more information based on the feedback we've received.
- **2017-05-29** @b258ea62bf297b02afa9854: If possible to tell me the release time/period because I want to craft one security related tool :)
- **2017-06-30** @b258ea62bf297b02afa9854: Ding dong :)))
- **2017-08-16** @b258ea62bf297b02afa9854: Hi,

Issue was reported 10 months ago more than enough time to patch anything / anywhere so I'll consider this report more than responsible. I'll be releasing a white paper regarding this issue on 22nd - 24th August 2017, so you have more than enough time to push the patch.
- **2017-08-17** @aaroncampbell: Hey @slavco,
The person handling this ( @vortfu ) has been out on leave for the last couple months and isn't due back in until early next month. I apologize that communication slipped through the cracks. I'd like to get this into a release in the near future, but:

1) We won't have a release before August 22
2) I'd prefer to let the person that's been working with this all along continue to shepherd it into the release, so I'd like to wait until he gets back.

I know it's already been a long time, but would it be possible to delay the white paper for a month?

Thanks,
Aaron
- **2017-09-20** @johnbillion: Hi @slavco,

As you'll have noticed, 4.8.2 was released yesterday with a fix for this issue. We'll arrange for a bounty payment shortly and close this report as fixed. Thanks again for your valuable report.

In the meantime, we noticed that you commented on your blog post stating that the fix in 4.8.2 is incomplete. Are you able to share some more information with us please? If you'd like to open another report on H1 please feel free. We're happy to award points and bounties to you for your responsible disclosure and co-operation.
- **Report Resolved**
- **2017-10-11** @aaroncampbell: Hey @slavco,

I was going through and getting bounties assigned for all tickets that were missing it, and I see that I neglected to comment here before. I wanted to make sure that I made it clear why no bounty was being paid for this one. We know that fixing this issue took a long time, but public disclosure before it is granted here (which is only after the issue has been fixed and shipped) makes a report ineligible for bounty.

Thanks,
Aaron
- **2017-10-11** @b258ea62bf297b02afa9854: Yo @aaroncampbell 

From the day one I wasn't expecting nothing except fix for this issue (isn't delivered) and that is why I have reported to security@wordpress.org, it was your wish this issue to be moved here. Please check with @johnbillion too ^^ he says something else, but who the fuck is he to tell something here.  
>As you'll have noticed, 4.8.2 was released yesterday with a fix for this issue. We'll arrange for a bounty payment shortly and close this report as fixed. Thanks again for your valuable report.

According me that is more than normal behavior for the Wordpress  security or what ever team. 

This security issue/report brings the biggest bounty for me. Beside acknowledgment from infosec community I have learned why Wordpress is the worst open source project from security aspect and making this report public (yes will be public 100%) the audience will learn it too. It will learn to never trust the [fake news] (https://wordpress.org/news/category/security/) section on wordpress.org that is under your control. Will learn that any minor "bigfix" update could holds scary security fix. Will learn that some of the plugin authors are not equal with the another ones. Will learn that you care only if persons with huge number of followers rant against you and isn't important normal approach from regular users who believe in responsible disclosure (please learn what it means). This knowledge will be crucial for the developers out there to stay safe while they migrate towards another open source solution that will fit towards their needs and will care for the security of its users.  

p.s. It was pleasure to see how `types` plugin was removed from the repository and `bbpress` was there not patched to the same end...

p.s. Security researchers will learn that reporting vulnerabilities towards Wordpress security team on hackerone is nothing but wasting time and hackerone maybe will notice abusing their service from your side.

Fuck off,
Slavco
- **2017-10-12** @jjj: Hi Slavco,

The bbPress issue you brought up here was fixed in June via a separate bbPress-specific HackerOne report.
Please accept my personal apologies for not including that info for you here.

Warmest regards,
-JJJ
- **2017-10-12** @b258ea62bf297b02afa9854: Hi jjj,

Strange, I was watching the [development changelog] (https://wordpress.org/plugins/bbpress/#developers) in the past, but I didn't notice update neither saw removal from Wordpress plugin directory listing. Maybe update was silent, m? o_O 

Hottest regards,
-Slavco
- **Agreed On Going Public**
- **Not Eligible For Bounty**
- **2017-11-01** @b258ea62bf297b02afa9854: Congrats for the new security release for the patch for this patch, you just introduced new feature towards wp.
Recommended memory usage for the Wordpress gets new formula: 
`memory_limit` >= `post_max_size * 66 * 3`

Congrats again,
Slavco
- **2017-11-03** @b258ea62bf297b02afa9854: Report will be disclosed in 10 days according counter. You understand the implications of latest 4.8.3 patch right? 

Beside not fixed `$wpdb->prepare("%1$%s","grr")` and easy out of memory for any wp instance, now there is something else:
 
`code where variable is esc_sql-ed`
...
`code where wp-load.php is included/required again`
...
`salute extra data in the variable that won't be removed by ->query`

Few existing attacks made easy... :(  8.4.3 patch is probably worst in the wp history.

Stay safe,
Slavco
- **2017-11-03** @aaroncampbell: Hey @slavco,

Thanks for your continued concern and for the additional information.

## Query Issue

In the case of `$wpdb->prepare( "%1$%s", "grr" )`, `%1$%s` isn't a valid placeholder. This means that during regular (expected) usage, the query would be broken and a developer would fix it. If a developer is putting something directly into the query part of a `wpdb::prepare` call, they could also just do `$wpdb->prepare( "grr' ...", ... )`. What we were attempting to protect against in 4.8.3 with regard to this, was developers that were using common practices that they *expected* (likely reasonably so) to be secure but they weren't. This included user-controlled data going into the query part of a `wpdb::prepare()` call only **after** having gone through `esc_sql()` or another `wpdb::prepare()` which the developer thought was protecting them.

I also scanned the WordPress.org plugin directory and am not seeing any matches for `%[1-9][0-9]*\$%s`. Can you point to the plugins you are saying are vulnerable? (Ref: https://twitter.com/mslavco/status/925686658779009025)

## Memory

I had a couple people on our team compare memory usage of 4.8.2 and 4.8.3. We're seeing results like this:

| 4.8.2    | 4.8.3    | Diff     |
|----------|----------|----------|
| 14495632 | 14511272 | 15640    |
| 20143104 | 20156416 | 13312    |

There is an increase, but it's fairly negligible. Only about 10-20k on an average page load, which doesn't seem like it justifies an adjustment to the memory limit. Hosts don't seem to be noticing any issues related to this either, at least not the ones that I've spoken to so far. Can you tell me what kind of setup you're testing on and what numbers you're seeing?

## Something Else

I'm not sure I'm tracking with the new things you mentioned:

> `code where variable is esc_sql-ed`
...
`code where wp-load.php is included/required again`
...
`salute extra data in the variable that won't be removed by ->query`

Could you expand on these or supply a PoC to help us understand what you mean?

Thanks,
Aaron
- **2017-11-03** @b258ea62bf297b02afa9854: No need to search for the `%1$%s` you need to search for example you should search for code like this:
`$not_in = "'" . implode( "', '", esc_sql( $_POST['exclude'] ) ) . "'";` - yes direct request in wp is sqli save. But also you can search for code like this:
`if (!self::getDB()->queryWrite(sprintf("insert ignore into " . self::table() . " (name, val, autoload) values (%%s, X'%s', 'no')", $dataChunk), $chunkedValueKey . $chunks))` - part of wordfence code and only because of `hex2bin` there isn't sqli towards wp `4.8.3`. Now if places like this exists :) then the payload would be more than simple e.g. you can play with the directives in order to get something like the following format string:
`$wpdb->("%1$%s%2$%s%2$%s %s %s", $input['one'], $input['two'])` - input one if it is user controlled then just set it on `'' - empty value` and choose your sqli payload in `$input['two']` - I think I was clear regarding this case.

Case for memory usage (short: you replace `%` into 66 characters and you hold it in memory for some time):
```
((wp_posts.post_title LIKE '{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}slavco{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}') OR (wp_posts.post_excerpt LIKE '{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}slavco{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}') OR (wp_posts.post_content LIKE '{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}slavco{5944533a7bbf0e39b0751657f6618c4003a77dc4d2a15581d17deef104a124a8}'))
```
this is output of the prepare when you search something in wp - this case I search for `slavco`. This means that the attacker could stop execution of the PHP script at the place he want if he controls the user input and if PHP setting for memory usage e.g. memory_limit is lower than `66 * max_post_size` - 66 is output of hash_hmac + `{}` and I say `max_post_size` because if 10MB it is, then PHP memory must be bigger than 66*post_max_size in order to stop payload holding a lot of `%` in it. Good for the test of the memory usage for wp you conducted, but you  can try it with more `%` when you post comments for instance - yes you just turned wp in web goat for beginners to practice DOS attacks on it.

Regarding the third concern it is the biggest of all, but this time I'll leave towards all of you to trust me e.g. I won't show any attack vector atm.
- **2017-11-03** @b258ea62bf297b02afa9854: `$not_in = "'" . implode( "', '", esc_sql( $_POST['exclude'] ) ) . "'";` - need to be without `esc_sql` in it. by default wp is sqli proof and there are many plugins that add `$_POST['var']` in the query 
`$wpdb->query("bla '".$_POST['var']."'");` - no sqli in wp
- **2017-11-03** @b258ea62bf297b02afa9854: ^^ `hex2bin` need to be `bin2hex` too
- **2017-11-03** @aaroncampbell: These are in WordFence? Have you reported it to them? https://www.wordfence.com/security/
- **2017-11-03** @b258ea62bf297b02afa9854: Nothing scary, it is hex encoded data, as extra they use $wpdb only in case mysqli isn't avaliable on the server... NVM, this is just sample there are many many places where user input is put in the $query and then $query is used in `->prepare`. I can't believe after a year I'm talking this again, but it is my fault I don't have many followers to be able to rant like a man :D
- **2017-11-03** @b258ea62bf297b02afa9854: In one of my code bases just found a plugin that is (90% just followed the function calls) vulnerable to sqli caused by this patch ( wasn't with previous patch ). Core problem here isn't just numbered placeholders, but also input into format string and functionality of PHP sprintf. Yes with the latest patch something was done, but `%[NUMBER]$%s` is allowed in it and combined with quoting there is trouble e.g. sqli, basically for some cases you rolled back wordpress to not patched version `4.8.1`. Regarding memory usage and new "features" introduced with replacement of `%` that is another story that opens wide doors for different types of attack and it is a quite unbelievable for me. 
There are two ways for complete backward compatible fix for wp regarding this issue with price not to introduce new issues like now. First half of the solution is delivered by me as idea for the patch and the rest of it is simple vsprintf functionality written in php that will be sprintf by the "book" without hidden gems of it (`c`, `O`, `l`, ... could be completely dismissed then ). Another one is much more simple and require no coding at all - just big note in the documentation and warning against community to not place in the query-format string any user input except constants in the form of allowed format directives. That is it, there is no another way.
- **2017-11-04** @aaroncampbell: Hey @slavco,

It is true that non-escaped data going directly into either `wpdb::query()` or the query (first) parameter in `wpdb::prepare()` is generally unsafe and could be vulnerable to SQLi. Documentation around this, as you pointed out, is a must. I'll try to make sure what we document this where we can.

If you have a list of specific plugins that are are doing this, we could bring these cases directly to the developers and help them fix and secure their plugins. It would be extremely helpful.

Thanks,
Aaron
- **2017-11-04** @b258ea62bf297b02afa9854: - Fixing current  issues won't prevent future failures in plugins, themes, cron scripts in the future... You should keep in mind that wp code base is PHP code and also you know that there are cases where people are using `mysqli_real_escape_string` into `array_map`, implement their own `esc_sql` functions like, use/parse output from mysql dumps in order to restructure/restore data, ... yes there are many use cases that are vulnerable towards SQLi re-introduced in `4.8.3` - but not in `4.8.2` for instance.
- memory usage beside dos-ing the server php module could stop php execution at certain point (if accepts user input towards operation that includes `prepare`) that could lead towards broken authentications/authorizations or bypassing some flows...
-told you there is 3rd case but I'm not going to disclose anything regarding it atm :)
- **2017-11-06** @b258ea62bf297b02afa9854: And there are live traces of the 3rd case e.g. the new feature https://wordpress.org/support/topic/bug-with-character-in-woocommerce-product-name/ this is not functional bug, but it is security bug because it leads towards `unserialize` of the attacker/user payload. There are case scenarios that work in both directions - defeat `maybe_serialize` and defeat `maybe_unserialize`. Yup, core is now opened towards `unserialize` of user payload - few scenarios and as extra escalates limited security vulnerability as LFI towards possible RCE on wp.
- **2017-11-06** @b258ea62bf297b02afa9854: ```
$value = wc_clean($_POST["name"]);
...
$value = esc_sql($value);
//used here in some insert / update query and on success used as meta
...
update_metadata('post', $_id, $key, $value );
```
Is this code safe, why isn't and why are there production codes with same approach? :)
- **2017-11-06** @b258ea62bf297b02afa9854: Somebody reads here, you have opened wp for `unserialize` of user input. Many plugins perform `esc_sql` on some value -> then `serialize` -> then `->query`. We all know that `->query` removes the `{64charfeature}`, but string is already `serialized` => we can craft our payload so when `{64charfeature}` occurrences removed, some another serialized string property will become part of serialized object/array - boom RCE :)

> 2 more activity entries not fetched (cap 50).
