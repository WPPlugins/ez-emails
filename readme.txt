=== EZ Emails ===
Contributors: luigipulcini
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VQE6XWAPU96TA
Tags: EMails,HTML Emails, Email Template, User Registration Template, Template, Signature, HTML Signature, Email Signature
Requires at least: 3.3
Tested up to: 4.3.1
Stable tag: 2.2.12
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

EZ Emails (Easy Emails) allows the administrators of a Wordpress site to send emails to users or manually typed email addresses, based on HTML templates.

== Description ==

**EZ Emails** (Easy Emails) allows WordPress administrators to create HTML templates for their email communications to registered users or manually typed in email addresses.

With EZ Emails administrators can:

* create as many HTML templates they want to be used as email templates
* create as many HTML signatures they like to use (each user has their own personal list of signatures)
* edit templates and signatures in a WYSIWYG editor or just in pure HTML
* replace the default WordPress notification message when users register with one of the templates created
* force all the emails sent by Wordpress to use your EZ Emails template

== Installation ==

1. Unpack the 'ez-emails.zip' file and upload its content to the `/wp-content/plugins/` directory of your Wordpress installation
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Click on the 'Control Panel' link under the name of the plugin or go to the menu 'Tools -> EZ Emails'


== Frequently asked questions ==

= Can I use one of the templates I created to replace the default message Wordpress send to registered users? =

Yes, after creating your favorite template, you can go to the 'Settings' tab and select the template you have just created as a replacement for Wordpress default template.

= Is it possible to create different signatures for each user? =

Yes, EZ Emails gives the ability to create as many signatures as you want. Each user can access only their own signatures.

== Screenshots ==

1. Main section of the plugin where the administrator can compose and send emails to registered users and typed in email addresses
2. Template Tab. Here it is possible to create your favorite templates in a WYSIWYG editor with HTML editing capabilities
3. In the 'Settings' tab the administrator can set the options for the plugin

== Changelog ==

= 2.2.12 =
* Bugfix: internal version number did not get updated on version 2.2.11 and it read 2.2.10

= 2.2.11 =
* Bugfix: text/plain messages got wrapped in a single paragraph

= 2.2.10 =
* Bugfix: it is not possible to rename templates and signatures

= 2.2.9 =
* Bugfix: scope setting doesn’t work properly

= 2.2.8 =
* Bugfix: EZ Emails disappearing from Tools menu for administrators

= 2.2.7 =
* Bugfix: custom roles not showing up in the Mass Emails list
* New: better management of the plugin visibility to each role

= 2.2.6 =
* Bugfix: role names with spaces cannot be set in the scope of the plugin

= 2.2.5 =
* Bugfix: wrong release version

= 2.2.4 =
* Bugfix: roles including spaces in the name don’t get listed among the draggable tags

= 2.2.3 =
* Bugfix: settings don't get properly updated on plugin automatic update

= 2.2.2 =
* New: added feedback on sending emails (either on success and failure)

= 2.2.1 =
* Bugfix: mass emails are not sent when dropping the role tags in the recipient area

= 2.2.0 =
* New: complete restyle of the recipient area

= 2.1.3 =
* Fix: draggable role tags now show also the number of users belonging to that role

= 2.1.2 =
* Bugfix: remove_cap error while activating, deactivating and uninstalling the plugin

= 2.1.1 =
* Fix: in the send window, only roles with one or more users are listed

= 2.1.0 =
* New: added the option "Scope" to extend the use of the plugin to any role

= 2.0.0 =
* New: it is now possible to customize the notification messages Wordpress sends every time a new user register to the site (to both the admin and the users themselves).
* New: while customizing a template, you can now use placeholders for user name, login, password, user email address, etc. as well as blog's info (title, description, etc.)
* New: sending mass emails to users based on their roles is now as easy as dragging each role and dropping it on the TO, CC and BCC field
* New: in order to remove an address from the TO, CC and BCC field is now possible to click on an address (or CTRL click for multiple selection) and press the DEL key

= 1.3.6 =
* Bugfix: content of new registration message shows HTML code as plain text

= 1.3.5 =
* Bugfix: lost password emails not showing the link to reset the password

= 1.3.4 =
* Bugfix: template duplication and nidification in emails sent within the 'Send email' panel when using 'Force use of template for all mails' option

= 1.3.3 =
* Bugfix: undefined variable $email_nonce on installation

= 1.3.2 =
* Corrected the current version number

= 1.3.1 =
* Bugfix: Removed a file saving feature for debugging purposes

= 1.3 =
* Added a new option: now you can force ALL the emails sent by Wordpress to use your EZ Emails template. This may solve some compatibility issues with other plugins using the Wordpress mailing system.

= 1.2 =
* Bugfix: user registration notification email not sent using template or not sent at all

= 1.1 =
* Better AJAX integration in Wordpress

= 1.0 =
* First release