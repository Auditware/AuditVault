---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - stack/ruby
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2023-07-28
submitted: 2021-04-07T03:05:50.107Z
bounty_usd: null
votes: 27
cve: "CVE-2022-21831"
program: "[[programs/rails|Ruby on Rails]]"
reporter: "gquadros_"
source: "https://hackerone.com/reports/1154034"
title: "Argument/Code Injection via ActiveStorage's image transformation functionality"
---
# Argument/Code Injection via ActiveStorage's image transformation functionality

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** Ruby on Rails | **Disclosed:** 2023-07-28

- Report: [https://hackerone.com/reports/1154034](https://hackerone.com/reports/1154034)
- CWE: Code Injection | CVE: CVE-2022-21831
- Submitted: 2021-04-07T03:05:50.107Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Triaged**
- **2021-04-22** @rsilva: Hi @georgeclaghorn. Do you have any update about this issue?
- **2021-04-23** @georgeclaghorn: I’ve emailed the maintainer of ImageProcessing about the code injection finding. We still need to decide how to implement your second recommendation.
- **External User Joined**
- **2021-05-04** @rsilva: Hi @georgeclaghorn. How are you? Any progress on this issue?
- **2021-05-04** @pixeltrix: Hi @rsilva, unfortunately George has decided to step down from Rails Core after leaving Basecamp so I'll be picking up this bug - I can get back to you in a couple of days once I've found out what the situation is.
- **2021-05-04** @rsilva: Ok @pixeltrix. Thank you!
- **2021-05-04** @tenderlove: Hi,

Looking at the example code:

```
<%= image_tag user.avatar.variant(params[:t].to_s => params[:v].to_s) %>
```

Are the `to_s` calls in order to bypass strong parameters?  We should definitely fix this, but if the app developer has to do something to specifically pass in untrusted strings, then the attack scenario isn't as common as I thought it might be.
- **2021-05-04** @gquadros_: Hi, these 'to_s' calls are not necessary. It was just a way to differentiate from the first exploitation scenario (Argument Injection), which needs an array as input. It shows that even if you convert to string, you can get in trouble.
- **2021-06-02** @rsilva: Hi guys. Any update about this issue?
- **2021-07-08** @gquadros_: Hi @pixeltrix @tenderlove @jankomarohnic, any update about this issue? Let us know if you have any questions.

Cheers
- **2021-09-08** @shopify-dave: Howdy @gquadros_ ,

Thanks again for the report and sorry for the delay. This report ended up moving through a number of different people.

While I'm not convinced that the root cause of this behavior is in rails, I agree that we should be doing a better job of validating user supplied input for transformations.

In order to do that, I broke the issue down into situations where the attacker controls either the transformation method name, the parameters, or both.

For method names, rails would enforce a configurable allow-list with a set of default, known safe [imagemagick methods](https://imagemagick.org/script/command-line-options.php).

For parameters, I opted for a deny-list. The only other option I could see is to create an exhaustive allow-list that attempts to account for every possible permutation of all possible parameter types supported by imagemagick. While not ideal, a deny list _should_ do the trick here. The minimagick gem calls out to the system shell in a way that [prevents shell expansion](https://github.com/minimagick/minimagick/blob/master/lib/mini_magick/shell.rb#L28).

In other words, you can't do something like `-wr$(echo)ite` to evade the denylist. Curious if anyone can spot a bypass I'm overlooking?

Attached are the proposed patches for `5.2`, `6.0` and `6.1`.
- **2021-09-16** @gquadros_: Hi @zack_spotify,

We tested the patch and found some bypasses.

Considering the following code:

```ruby
<%= image_tag blob.preview(params[:t] => params[:v]) %>
```

1) Blocklist bypass with upper case letters

```
?t=resize&v[]=123&v[]=-seT&v[]=comment&v[]=MYCOMMENT&v[]=-writE&v[]=/tmp/file.erb
```

2) File enumeration (error based)

```
?t=resize&v[]=100&&v[]=-size&v[]=1x1&v[]=-remap&v[]=gray:/etc/issue
?t=resize&v[]=100&&v[]=-size&v[]=1x1&v[]=-remap&v[]=gray:/etc/issuex
```

3) SSRF - ImageMagick tries to get an image located at the URL

```
?t=resize&v[]=100&v[]=http://localhost:4444/xxx
```

There are probably other ways to exploit it.

It could be a good idea to remove methods which support filenames as arguments from the allow-list, such as cdl, clip-mask, decipher, encipher, etc. Although the deny-list is not the best solution, your implementation could be improved by doing a case-insensitive comparison and maybe also blocking anything containing special characters such as -, @, /, :, etc.

It is also important to warn developers in the documentation about the dangers of passing user-supplied data to the affected methods (variant/preview) without sanitization.

Regards,
- **2021-10-05** @shopify-dave: Howdy @gquadros_,

Thanks for the followup.

Attached are the revised patches. Anything new stand out in this case?

We made a usability tradeoff on allowing special characters in arguments. Along with this we could ship a recommended [security policy](https://imagemagick.org/script/security-policy.php) for imagemagick to account for edge cases.
- **2021-10-21** @rsilva: Hi @zack_spotify,

we had a look at the new patch and it is still possible to achieve SSRF as we talked above.
Another thing we realized is that it is possible to leak arbitrary file content.

Considering the following code:

```ruby
<%= image_tag blob.variant(params[:t] => params[:v]) %>
```

If the original image is a GIF, we can leak by doing

```
?t=size&v[]=1x1&v[]=-depth&v[]=8&v[]=gray:/etc/issue
?t=size&v[]=1x1&v[]=-depth&v[]=8&v[]=rgb:/etc/issue
```

and extracting the file content from the resulting image.


It is indeed hard to provide the API’s flexibility of passing arguments with arrays and to cover all the possible dangerous cases with block-lists. Maybe the improvements made so far combined with proper warnings about ImageMagick’s convert usage of arguments could be a good tradeoff. The developer using the variant()/preview() API should be aware of the danger and validate properly.


Regards
- **2021-11-01** @shopify-dave: Thanks for the followup!

> Maybe the improvements made so far combined with proper warnings about ImageMagick’s convert usage of arguments could be a good tradeoff. 

Agreed, this patch strikes a balance between flexibility and safety so workarounds of varying degrees of impact are inevitable. With this, we also talked about the Rails team and the community building a good default for the ImageMagick policy XML file that we can either ship with Rails or somehow give to people.

The patch as is along with documentation and a safe default policy file would put us in a much better place than we are now.
- **2021-11-25** @rsilva: Hi @zack_spotify, any update?
- **2022-01-04** @tenderlove: @rsilva thanks for your patience, I'm going to write a security notice and we'll ship the patches that @zack_spotify has attached.
- **2022-01-10** @rsilva: Ok  @tenderlove, thank you for the update.
- **2022-03-07** @rsilva: Hi guys, any update?
- **Cve Id Added**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
