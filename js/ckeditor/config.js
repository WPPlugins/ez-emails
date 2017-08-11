/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	config.skin = 'kama';
	config.uiColor = '#eee';
	config.extraPlugins = 'onchange';
	config.minimumChangeMilliseconds = 1000; // 100 milliseconds (default value)
	
	config.toolbar_Standard = [
		{ name: 'format', items : [ 'Format','Font','FontSize' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
		{ name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
		{ name: 'editing', items : [ 'Find','Replace','-','SelectAll'] },
		{ name: 'tools', items : [ 'Maximize'] },
		'/',
		{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
		{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv',
		'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
		{ name: 'links', items : [ 'Link','Unlink','Anchor' ] },
		{ name: 'source', items : [ 'Source'] }
	];
	
};
