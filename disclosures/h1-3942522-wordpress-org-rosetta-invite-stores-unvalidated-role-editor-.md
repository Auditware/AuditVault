---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - stack/wordpress
  - vuln/broken-access-control
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2026-11-05
submitted: 2026-08-15T16:39:03.516Z
bounty_usd: null
votes: 45
cve: []
program: "[[programs/wordpress|WordPress]]"
reporter: "0xbs0d27"
source: "https://hackerone.com/reports/3942522"
title: "wordpress.org Rosetta: invite stores unvalidated role — Editor can assign site Administrator despite editable_roles"
---
# wordpress.org Rosetta: invite stores unvalidated role — Editor can assign site Administrator despite editable_roles

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 45 | **Program:** WordPress | **Disclosed:** 2026-11-05

- Report: [https://hackerone.com/reports/3942522](https://hackerone.com/reports/3942522)
- CWE: Improper Access Control - Generic
- Submitted: 2026-08-15T16:39:03.516Z

## Report summary

On Rosetta locale sites, Editors can invite users but are not supposed to make anyone a site Administrator — WordPress normally blocks that via editable_roles.
A wordpress.org mu-plugin saved the invited user’s role from the HTTP request without checking that list, so an Editor could force role=administrator and elevate an account when the invite was accepted.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

On Rosetta locale sites (e.g. `xx.wordpress.org/team/`), Editors are intentionally allowed to **invite existing network users** (`promote_users`) but are **blocked from assigning the Administrator role** via the official WordPress `editable_roles` filter (`unset( $roles['administrator'] )` for non–super-admins).

The wordpress.org mu-plugin `wporg-add-existing-users-via-username.php` breaks that boundary: on `admin_action_adduser` it persists the invite option with `role` taken directly from `$_REQUEST['role']` **before** consulting `get_editable_roles()`. Core’s `/newbloguser/{key}/` path then applies the stored role via `add_existing_user_to_blog()` → `set_role()` with **no** `wp_ensure_editable_role()` re-check.

An Editor can therefore POST `role=administrator` (not offered in the UI dropdown), create a valid invite, and elevate an account to **site Administrator** (`manage_options` on that blog).

This is **not by design**. Official WordPress documentation states that `get_editable_roles()` / `editable_roles` exist specifically so that delegated user managers (editors/authors) **cannot** make others administrators. Rosetta implements that filter. The invite path ignores it. Since WordPress 6.8, Core also provides `wp_ensure_editable_role()` to enforce the allowlist server-side — but that check is **not** applied before invite persistence in this mu-plugin (and Core’s own invite branch still lacks it before `add_option` in some paths).

This is **not** the Learn / `workshop_reviewer` case: Learn does **not** remove Administrator from `editable_roles`, so there is no privilege-boundary bypass there. Rosetta **does** remove it.

## Official documentation (intended security model)

From WordPress Developer Resources — [`get_editable_roles()`](https://developer.wordpress.org/reference/functions/get_editable_roles/):

> Main purpose is to allow filtering of roles so that plugins can remove inappropriate ones… **Specifically because without filtering anyone with the edit_users capability can edit others to be administrators, even if they are only editors or authors.** This filter allows admins to delegate user management.

[`editable_roles`](https://developer.wordpress.org/reference/hooks/editable_roles/) — list of roles a user **can assign to others**.

[`wp_ensure_editable_role()`](https://developer.wordpress.org/reference/functions/wp_ensure_editable_role/) (since 6.8.0) — **stop execution** if the role cannot be assigned by the current user (`403`).

Rosetta relies on that model; the invite mu-plugin does not enforce it.

## Affected Asset / Component

- **Program asset:** WordPress (HackerOne) — wordpress.org custom code / Rosetta
- **Sites:** Rosetta locale team / main (path `/team/` and locale main customizations)
- **Mu-plugin:** `wordpress.org/public_html/wp-content/mu-plugins/pub/wporg-add-existing-users-via-username.php`
- **Rosetta boundary:** `…/plugins/rosetta/inc/site/class-locale-team.php` (also `class-locale-main.php`)
- **Core apply path:** `wp-includes/ms-functions.php` — `maybe_add_existing_user_to_blog()` / `add_existing_user_to_blog()` / `add_user_to_blog()`

## Vulnerable Code

### 1) Rosetta — intentional boundary (Editors may invite; must NOT assign Administrator)

```php
// rosetta/inc/site/class-locale-team.php
public function extend_editors_capabilities( $allcaps, $caps, $args, $user ) {
    if ( ! in_array( 'editor', $user->roles ) ) {
        return $allcaps;
    }
    $allcaps['list_users']    = true;
    $allcaps['promote_users'] = true;
    $allcaps['remove_users']  = true;
    return $allcaps;
}

public function remove_administrator_from_editable_roles( $roles ) {
    if ( ! is_super_admin() ) {
        unset( $roles['administrator'] );
    }
    return $roles;
}


2) Mu-plugin — persists unvalidated $_REQUEST['role'] BEFORE editable check

// wporg-add-existing-users-via-username.php (non–super-admin path)
$new_user_key = substr( md5( $user_id ), 0, 5 );
add_option( 'new_user_' . $new_user_key, array(
    'user_id' => $user_id,
    'email'   => $user_details->user_email,
    'role'    => $_REQUEST['role'],   // UNVALIDATED
) );
$roles = get_editable_roles();        // too late — only used for email text
$role  = $roles[ $_REQUEST['role'] ];
// wp_mail( … translate_user_role( $role['name'] ) … )


If role=administrator is not in get_editable_roles(), email rendering may warn / show empty role name, but add_option already succeeded.

3) Core — applies stored role with no editable re-check
// wp-includes/ms-functions.php
function add_existing_user_to_blog( $details = false ) {
    if ( is_array( $details ) ) {
        $result = add_user_to_blog( get_current_blog_id(), $details['user_id'], $details['role'] );
        // …
    }
}
// add_user_to_blog() → $user->set_role( $role );  // no wp_ensure_editable_role()
Correct pattern (already in Core 6.8 for other paths)
wp_ensure_editable_role( $_REQUEST['role'] ); // used on some create / noconfirmation paths
Invite persistence in this mu-plugin never calls it.




Local validation (source-faithful lab)
Authorized source review + local Multisite lab (not production wordpress.org):

WordPress Multisite + production copy of wporg-add-existing-users-via-username.php
Rosetta-equivalent editable_roles filter (unset administrator) + Editor promote_users
Created lab_editor (Editor) and lab_victim (not yet on blog)
Stored invite with role=administrator (same order as mu-plugin)
Called Core add_existing_user_to_blog()
DB proof:

lab_victim  wp_capabilities  a:1:{s:13:"administrator";b:1;}
Victim had manage_options = true. Invite key shape matches mu-plugin: substr( md5( user_id ), 0, 5 ).

Suggested fix
Call wp_ensure_editable_role( $_REQUEST['role'] ) (or equivalent) before add_option.
Persist only the validated role string from get_editable_roles().
Defense in depth: re-validate in Core add_existing_user_to_blog() before set_role.
Prefer non-deterministic invite keys (Core invite already uses longer random keys; mu-plugin uses substr(md5(user_id),0,5)).

Researcher: 0xbs0d27

## Impact

Authenticated Editor on a Rosetta locale site can escalate another network account (including one they control) to **site Administrator**, bypassing the explicit `editable_roles` removal of Administrator. Impact is full control of that site (`manage_options`), not network super-admin. Severity assessed **High** given Editor prerequisite; Critical may be considered for site takeover on wordpress.org properties.

## Timeline

- **Report Filed**
- **2026-09-04** @0xbs0d27: Hi WordPress / H1 triage,

Friendly bump on #3942522 (submitted 2026-08-15). Status is still New with no triage response.

Summary: On Rosetta, Editors get promote_users but Administrator is removed via editable_roles. The mu-plugin wporg-add-existing-users-via-username.php stores $_REQUEST['role'] into the invite option before get_editable_roles()/wp_ensure_editable_role(), so an Editor can POST role=administrator and elevate a user to site Administrator (manage_options) when the invite is accepted.

Happy to provide more PoC details or clarify the Rosetta vs Learn distinction if needed.

Thanks,
0xbs0d27
- **2026-09-10** @bornull: Thanks for the report! We addressed it in https://github.com/WordPress/wordpress.org/pull/887/
- **Report Resolved**
- **Bounty Awarded**
- **2026-11-05** @0xbs0d27: Hi @bornull and team — thank you again for the fix (PR #887) and the bounty; really appreciated.

This has been Resolved since September, and I wanted to ask gently: if it works for you, would you mind approving public disclosure so it can show up in Hacktivity, similar to your other WordPress.org / meta reports?

I’ve added a short Hacker summary for the public view — happy to tweak anything if you’d like changes before approving.

Thanks so much, and thanks again for your work on this.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
