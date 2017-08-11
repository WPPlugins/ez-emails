<?php

if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit ();
}
delete_option('ezemails_options');
delete_option('ezemails_templates');

$users = get_users();
foreach ($users as $user) {
	delete_user_meta($user->ID, 'ezemails_signatures');
}

global $wp_roles;
$roles = $wp_roles->get_names();
foreach ($roles as $role) {
	$wp_roles->remove_cap(strtolower($role), 'manage_ezemails');
}


?>