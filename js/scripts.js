jQuery(function() {
	(function ($,CKE) {

		var ctrlDown = false;
	
		$('.ezemails_tab').click(function(){
			$('.ezemails_tab').removeClass('nav-tab-active');
			$(this).addClass('nav-tab-active');
			$('.ezemails-option-page:visible').hide();
			$('#'+$(this).attr('id').replace('-tab','')).show();
			$('#ezemails_current_tab').val($(this).attr('id').replace('-tab',''));
			updatePreviewFrame();
		});
		
		$('#ezemails_form').submit(function(){
			$('#ezemails_admin_message').text(CKE.instances['ezemails_admin_message'].getData());
			$('#ezemails_user_message').text(CKE.instances['ezemails_user_message'].getData());
			$('#ezemails_default_message').text(CKE.instances['ezemails_default_message'].getData());
		});
		
		$('#ezemails_to_addresses, #ezemails_cc_addresses, #ezemails_bcc_addresses').each(function(){
			resizeTextarea($(this));
		});
		
		$('#ezemails_select_template, #ezemails_select_signature').change(function () {
			updatePreviewFrame();
		});
		
		$('#ezemails_send_now').click(function (){
			if (!$('.ezemails_address').length) {
				showResult('<div class="error fade">No recipients selected</div>', $('#ezemails_to_addresses'));
				return false;
			}
			if ($('#ezemails_send_subject').val()=='') {
				showResult('<div class="error fade">No subject specified</div>', $('#ezemails_send_subject'));
				return false;
			}
			if (CKE.instances['ezemails_email_body'].getData()=='') {
				showResult('<div class="error fade">Email has no body</div>', $('#cke_ezemails_email_body'));
				return false;
			}
			$('#ezemails_from_value').val($('#ezemails_from_'+$('#ezemails_from').val()).text());
			updatePreviewFrame();
			sendEmail();
			return true;
		});
		
		$('.ezemails_scope_option').click(function () {
			var checked = new Array();
			$('.ezemails_scope_option:checked').each(function(){
				checked.push($(this).attr('value'));
			});
			console.log(checked.join(','));
			$('#ezemails_scope').val(checked.join(','));
		});
		
		$('#ezemails_message_box').css({
			left: ($(window).width() - $(this).width()) / 2,
			top:  ($(window).height() - $(this).height()) / 2
		});
		
		$('.ezemails_address_roles').draggable({ helper: "clone" });
		
		function split( val ) {
		  return val.split( /,\s*/ );
		}
		function extractLast( term ) {
		  return split( term ).pop();
		}
		function addAddressItem( name, value, el, type ) {
			if (value == '') return;
			var list = value.split(/\,\s*/);
			var address;
			if (list.length == 1) {
				address = list[0].split(/ <\s*/);
				var addressName = '',
					addressEmail = '', 
					displayAddress = '';
				if (address.length > 1) {
					addressName  = address[0];
					addressEmail = address[1].replace('>','');
					displayAddress = addressName;
				} else {
					addressEmail  = address[0];
					displayAddress = addressEmail;
				}
				name = displayAddress;
			}
			var $newItem = $('<div class="ezemails_address">'+name+'<div class="ezemails_address_remove"></div></div>');
			
			el.before($newItem);
			for (i=0;i<list.length;i++) {
				address = list[i].split(/ <\s*/);
				var addressName = '',
					addressEmail = '', 
					displayAddress = '';
				if (address.length > 1) {
					addressName  = address[0];
					addressEmail = address[1].replace('>','');
					displayAddress = addressName;
				} else {
					addressEmail  = address[0];
					displayAddress = addressEmail;
				}
				$newItem.append('<div class="ezemails_address_item" email="'+addressEmail+'" recipient="'+addressName+'" type="'+type+'"></div>');
				resizeTextarea(el);
			}
			$('.ezemails_address').unbind().click(function() {
				if (!ctrlDown) $('.ezemails_address.selected').removeClass('selected');
				$(this).addClass('selected');
			});
			$('.ezemails_address_remove').unbind().click(function(){
				$(this).parent().remove();
				resizeTextarea(el);
			});

		}
		
		function resizeTextarea(el) {
			el.css('width',1);
			newWidth = el.parent().innerWidth() - (el.position().left - el.parent().position().left) - 16;
			if (newWidth < 200) newWidth = el.parent().innerWidth();
			el.css('width',newWidth);
		}

		$(document).keyup(function(e){
			if (e.keyCode == 46) $('.ezemails_address.selected').remove();
			if (e.keyCode == 17) ctrlDown = false;
		});
		
		$(document).keydown(function(e){
			if (e.keyCode == 17) ctrlDown = true;
		});
		
		$('#ezemails_to, #ezemails_cc, #ezemails_bcc').droppable({
			hoverClass: "drop-hover",
			drop: function(event, ui) {
				addAddressItem(ui.draggable.html(), ui.draggable.attr('value'), $(this).find('textarea'), $(this).find('textarea').attr('type'));
			}
		});
		
		if (typeof(ezemailsUserList) != 'undefined') {
			$('#ezemails_to_addresses, #ezemails_cc_addresses, #ezemails_bcc_addresses')
				.bind( "keydown", function( event ) {
					if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {
						event.preventDefault();
					}
				})
				.autocomplete({
					minLength: 1,
					autoFocus: true,
					delay: 0,
					source: function( request, response ) {
						// delegate back to autocomplete, but extract the last term
						response( $.ui.autocomplete.filter(
							ezemailsUserList, extractLast( request.term ) )
						);
					},
					focus: function() {
						// prevent value inserted on focus
						return false;
					},
					change: function ( event, ui ) {
						
						if (ui.item == null) {
							if (this.value.match(/.+@.+\..+/i)) {
								addAddressItem(this.value, this.value, $(this), $(this).attr('type'));
								this.value = '';
							} else if (this.value != '') {
								showResult('<div class="error">This is not a valid email address</div>', $(this));
							}
							$(this).focus();
						}
					},
					select: function( event, ui ) {
						var terms = split( this.value );
						// remove the current input
						terms.pop();
						// add the selected item
						terms.push( ui.item.value );
						// add placeholder to get the comma-and-space at the end
						this.value = ''; //terms.join( ", " );
						addAddressItem(ui.item.value, ui.item.value, $(this), $(this).attr('type'));
						return false;
					}
				});
		}

		if (CKE.instances['ezemails_email_body']) {
			CKE.instances['ezemails_email_body'].on('change', function(e) {
				updatePreviewFrame();
			});
			updateTemplateList();
			updateSignatureList();
			updateUserList();
			updatePreviewFrame();
		}

		function updatePreviewFrame() {
			var templateID = $('#ezemails_select_template option:selected').val(),
				signatureID = $('#ezemails_select_signature option:selected').val(),
				bodyHTML = CKE.instances['ezemails_email_body'].getData(),
				signatureHTML = $('#ezemails-signature-body-'+signatureID).text(),
				templateHTML = $('#ezemails-template-body-'+templateID)
					.text()
					.replace('%content%', bodyHTML)
					.replace('%signature%', signatureHTML);
			$('#ezemails_final_email').text(templateHTML);
			var $iFrame = $('#ezemails_email_preview_frame'),
				$container = $iFrame.parent();
			$iFrame.contents().find('html').html(templateHTML);
			$iFrame.height($iFrame.contents().find('html').height()*.75);
			$iFrame.width($container.innerWidth());
			$iFrame.contents().find('body')
				.css('-webkit-transform', 'scale(0.75)')
				.css('-webkit-transform-origin', 'top');
		}

		function displayMessage(msg, $el, elClass) {
			elclass = (typeof(elClass) == 'undefined') ? 'error ezemails' : elClass;
			var $error = $('<div/>').addClass(elClass).append($('<p/>').text(msg));
			$el.after($error);
			setTimeout(function() {
				$error.fadeOut(3000, function() {
                    $(this).remove();
                });
			}, 2000);

		}
		
		function ezMessageBox(msg) {
			$('#ezemails-box-title').html('TITLE');
			$('#ezemails-box-message').html(msg);
		}
		
		function sendEmail() {
			$('#ezemails_send_overlay').show();
			var addressList = [];
			$('.ezemails_address_item').each(function () {
				addressList.push({
					name:	$(this).attr('recipient'),
					email:	$(this).attr('email'),
					type:	$(this).attr('type')
				});
			});
			$.ajax({
				type: "POST",  
				url: ezemails_ajax.ajax_url,
				data: {
					nonce: ezemails_ajax.nonce,
					action: 'ezemails_sendemail',
					addressList: addressList,
					subject: $('#ezemails_send_subject').val(),
					from: $('#ezemails_from_value').val(),
					body: $('#ezemails_final_email').text()
				},
				beforeSend: function() {
					
				},
				success: function(response) {
					response = JSON.parse(response);
					if (!response.err) {
						$('.ezemails_address').remove();
						$('#ezemails_send_subject').val('');
						$('#ezemails_final_email').empty();
						CKE.instances['ezemails_email_body'].setData('');
						updatePreviewFrame();
					}
					$('#ezemails_send_overlay').hide();
					showResult(response.html, $('#ezemails_send_now'));
				}
			});
			return false;
		}

		function showResult(html, el) {
			var p = el.parent().position();
			$('<div id="ezemails_send_result" class="tooltip"></div>')
				.insertBefore(el)
				.css('top', p.top-35+'px')
				.css('left', p.left+'px')
				.html(html)
				.fadeIn(1000, function() {
					setTimeout(function() {
						$('#ezemails_send_result').fadeOut(1000, function() {
							$(this).empty().remove();
						});
					}, 3000);
				}
			);
		}

		function addSignature() {
			var name = 	$('#ezemails_signature_name').val();
			if (name) {
				if ($('input[name*="signature_names"][value="'+$('#ezemails_signature_name').val()+'"]').length) {
					displayMessage('There is already a signature with the same name', $('#ezemails_cancel_signature'), 'error');
				} else {
					var id = name.toLowerCase().replace(/^[0-9]/,'x').replace(/[^0-9a-z-_]/g,'_');
					var $newSignatureName = $('<input id="ezemails-signature-name-'+id+'" type="hidden" name="signature_names[]" value="'+name+'">');
					var $newSignatureBody = $('<textarea id="ezemails-signature-body-'+id+'" name="signature_bodies[]" style="display:none;"></textarea>');
					if ($('textarea[name*="signature_bodies"]').length) {
						$('input[name*="signature_names"]').last().after($newSignatureName);
						$('textarea[name*="signature_bodies"]').last().after($newSignatureBody);
					} else {
						$('#ezemails_signature_name').after($newSignatureBody);
						$('#ezemails_signature_name').after($newSignatureName);
					}
					$('#ezemails-signature-name-'+id).val($('#ezemails_signature_name').val());
					$('#ezemails-signature-body-'+id).text(CKE.instances['ezemails_signature_body'].getData());
					$('#ezemails_select_signature').append($('<option value="'+id+'">'+name+'</option>'));
					updateSignatureList();
					resetSignature();
				}
			} else {
				displayMessage('You have to provide a name for the signature', $('#ezemails_cancel_signature'), 'error');
			}
		}

		function resetSignature() {
			$('#ezemails_signature_name').val('');
			$('#ezemails_signature_current').val('');
			CKE.instances['ezemails_signature_body'].setData('');
			$('#ezemails_save_signature').hide();
			$('#ezemails_cancel_signature').hide();
		}

		function newSignature() {
			resetSignature();
			$('#ezemails_signature_name').val('New Signature');
			CKE.instances['ezemails_signature_body'].setData('<p>This is a new signature.</p><p>You can customize it using this editor.</p>');
			$('#ezemails_save_signature').unbind().text('Add').click(function () {
				addSignature();
			}).show();
			$('#ezemails_cancel_signature').unbind().click(function () {
				resetSignature();
			}).show();
		}

		function editSignature(id) {
			$('#ezemails_signature_name').val($('#ezemails-signature-name-'+id).val());
			$('#ezemails_signature_current').val(id);
			CKE.instances['ezemails_signature_body'].setData($('#ezemails-signature-body-'+id).text());
			$('#ezemails_save_signature').unbind().text('Save').click(function () {
				saveSignature();
			}).show();
			$('#ezemails_cancel_signature').unbind().click(function () {
				resetSignature();
			}).show();
		}

		function saveSignature() {
			if ($('#ezemails_signature_name').val()) {
				var id = $('#ezemails_signature_current').val();
				var name = $('#ezemails_signature_name').val();
				var newId = name.toLowerCase().replace(/^[0-9]/,'x').replace(/[^0-9a-z-_]/g,'_');
				if (id != newId) {
					if ($('input[name*="signature_names"][value="'+$('#ezemails_signature_name').val()+'"]').length) {
						displayMessage('There is already a signature with the same name', $('#ezemails_cancel_signature'), 'error');
						return false;
					} else {
						$('#ezemails-signature-name-'+id).remove();
						$('#ezemails-signature-body-'+id).remove();
						id = newId;
						var $newSignatureName = $('<input id="ezemails-signature-name-'+id+'" type="hidden" name="signature_names[]" value="'+name+'">');
						var $newSignatureBody = $('<textarea id="ezemails-signature-body-'+id+'" name="signature_bodies[]" style="display:none;"></textarea>');
						if ($('textarea[name*="signature_bodies"]').length) {
							$('input[name*="signature_names"]').last().after($newSignatureName);
							$('textarea[name*="signature_bodies"]').last().after($newSignatureBody);
						} else {
							$('#ezemails_signature_name').after($newSignatureBody);
							$('#ezemails_signature_name').after($newSignatureName);
						}
					}
				}
				$('#ezemails-signature-name-'+id).val($('#ezemails_signature_name').val());
				$('#ezemails-signature-body-'+id).text(CKE.instances['ezemails_signature_body'].getData());
				updateSignatureList();
				resetSignature();
				displayMessage('The signature was successfully saved!', $('h2:contains("EZ Emails")'), 'updated');
				return true;
			} else {
				displayMessage('You have to provide a name for the signature', $('#ezemails_cancel_signature'), 'error');
				return false;
			}
		}

		function deleteSignature(id) {
			$('#ezemails-signature-name-'+id).remove();
			$('#ezemails-signature-body-'+id).remove();
			$('select#ezemails_select_signature option[value="'+id+'"]').remove();
			updateSignatureList();
			resetSignature();
		}

		function updateSignatureList() {
			var fields = $("#ezemails_form").serializeArray();
			fields.push(
				{name: 'nonce', value: ezemails_ajax.nonce},
				{name: 'action', value: 'ezemails_signature_list'}
			);
			request = $.ajax({
				type: "POST",  
				url: ezemails_ajax.ajax_url,
				data: fields,
				beforeSend: function() {
					$('#ezemails_signature_table_overlay').show();
				},
				success: function(html) {
					$('#ezemails_signature_list').html(html);
					$('#ezemails_signature_table_wrap').children('.tablenav.top, .tablenav.bottom').remove();
					$('#ezemails_signature_table_overlay').hide();
					
					$('.ezemails-signature-edit').unbind();
					$('.ezemails-signature-delete').unbind();
					$('.ezemails_add_signature').unbind();

					$('#ezemails_new_signature').click(function(){
						newSignature();
					});
					
					$('.ezemails-signature-delete').click(function() {
						var id = $(this).attr('id').replace('ezemails-signature-delete-','');
						deleteSignature(id);
					});

					$('.ezemails-signature-edit').click(function() {
						var id = $(this).attr('id').replace('ezemails-signature-edit-','');
						editSignature(id);
					});
				}
			});
			return false;
		}

		function addTemplate() {
			var name = 	$('#ezemails_template_name').val();
			if (name) {
				if ($('input[name*="template_names"][value="'+$('#ezemails_template_name').val()+'"]').length) {
					displayMessage('There is already a template with the same name', $('#ezemails_cancel_template'), 'error');
				} else {
					var id = name.toLowerCase().replace(/^[0-9]/,'x').replace(/[^0-9a-z-_]/g,'_');
					var $newTemplateName = $('<input id="ezemails-template-name-'+id+'" type="hidden" name="template_names[]" value="'+name+'">');
					var $newTemplateBody = $('<textarea id="ezemails-template-body-'+id+'" name="template_bodies[]" style="display:none;"></textarea>');
					if ($('textarea[name*="template_bodies"]').length) {
						$('input[name*="template_names"]').last().after($newTemplateName);
						$('textarea[name*="template_bodies"]').last().after($newTemplateBody);
					} else {
						$('#ezemails_template_name').after($newTemplateBody);
						$('#ezemails_template_name').after($newTemplateName);
					}
					$('#ezemails-template-name-'+id).val($('#ezemails_template_name').val());
					$('#ezemails-template-body-'+id).text(CKE.instances['ezemails_template_body'].getData());
					$('#ezemails_select_template').append($('<option value="'+id+'">'+name+'</option>'));
					$('#ezemails_default_template').append($('<option value="'+id+'">'+name+'</option>'));
					updateTemplateList();
					resetTemplate();
				}
			} else {
				displayMessage('You have to provide a name for the template', $('#ezemails_cancel_template'), 'error');
			}
		}

		function resetTemplate() {
			$('#ezemails_template_name').val('');
			$('#ezemails_template_current').val('');
			CKE.instances['ezemails_template_body'].setData('');
			$('#ezemails_save_template').hide();
			$('#ezemails_cancel_template').hide();
		}

		function newTemplate() {
			resetTemplate();
			$('#ezemails_template_name').val('New Template');
			CKE.instances['ezemails_template_body'].setData('<html><head></head><body><p>This is a new template.</p><p>You can customize it using this editor.</p></body></html>');
			$('#ezemails_save_template').unbind().text('Add').click(function () {
				addTemplate();
			}).show();
			$('#ezemails_cancel_template').unbind().click(function () {
				resetTemplate();
			}).show();
		}

		function editTemplate(id) {
			$('#ezemails_template_name').val($('#ezemails-template-name-'+id).val());
			$('#ezemails_template_current').val(id);
			CKE.instances['ezemails_template_body'].setData($('#ezemails-template-body-'+id).text());
			$('#ezemails_save_template').unbind().text('Save').click(function () {
				saveTemplate();
			}).show();
			$('#ezemails_cancel_template').unbind().click(function () {
				resetTemplate();
			}).show();
		}

		function saveTemplate() {
			if ($('#ezemails_template_name').val()) {
				var id = $('#ezemails_template_current').val();
				var name = $('#ezemails_template_name').val();
				var newId = name.toLowerCase().replace(/^[0-9]/,'x').replace(/[^0-9a-z-_]/g,'_');
				if (id != newId) {
					if ($('input[name*="template_names"][value="'+$('#ezemails_template_name').val()+'"]').length) {
						displayMessage('There is already a template with the same name', $('#ezemails_cancel_template'), 'error');
						return false;
					} else {
						$('#ezemails-template-name-'+id).remove();
						$('#ezemails-template-body-'+id).remove();
						id = newId;
						var $newTemplateName = $('<input id="ezemails-template-name-'+id+'" type="hidden" name="template_names[]" value="'+name+'">');
						var $newTemplateBody = $('<textarea id="ezemails-template-body-'+id+'" name="template_bodies[]" style="display:none;"></textarea>');
						if ($('textarea[name*="template_bodies"]').length) {
							$('input[name*="template_names"]').last().after($newTemplateName);
							$('textarea[name*="template_bodies"]').last().after($newTemplateBody);
						} else {
							$('#ezemails_template_name').after($newTemplateBody);
							$('#ezemails_template_name').after($newTemplateName);
						}
					}
				}
				$('#ezemails-template-name-'+id).val($('#ezemails_template_name').val());
				$('#ezemails-template-body-'+id).text(CKE.instances['ezemails_template_body'].getData());
				updateTemplateList();
				resetTemplate();
				displayMessage('The template was successfully saved!', $('h2:contains("EZ Emails")'), 'updated');
				return true;
			} else {
				displayMessage('You have to provide a name for the template', $('#ezemails_cancel_template'), 'error');
				return false;
			}
		}

		function deleteTemplate(id) {
			$('#ezemails-template-name-'+id).remove();
			$('#ezemails-template-body-'+id).remove();
			$('select#ezemails_select_template option[value="'+id+'"]').remove();
			$('select#ezemails_default_template option[value="'+id+'"]').remove();
			updateTemplateList();
			resetTemplate();
		}

		function updateTemplateList() {
			var fields = $("#ezemails_form").serializeArray();
			fields.push(
				{name: 'nonce', value: ezemails_ajax.nonce},
				{name: 'action', value: 'ezemails_template_list'}
			);
			request = $.ajax({
				type: "POST",  
				url: ezemails_ajax.ajax_url,
				data: fields,
				beforeSend: function() {
					$('#ezemails_template_table_overlay').show();
				},
				success: function(html) {
					$('#ezemails_template_list').html(html);
					$('#ezemails_template_table_wrap').children('.tablenav.top, .tablenav.bottom').remove();
					$('#ezemails_template_table_overlay').hide();
					
					$('.ezemails-template-edit').unbind();
					$('.ezemails-template-delete').unbind();
					$('.ezemails_add_template').unbind();

					$('#ezemails_new_template').click(function(){
						newTemplate();
					});
					
					$('.ezemails-template-delete').click(function() {
						var id = $(this).attr('id').replace('ezemails-template-delete-','');
						deleteTemplate(id);
					});

					$('.ezemails-template-edit').click(function() {
						var id = $(this).attr('id').replace('ezemails-template-edit-','');
						editTemplate(id);
					});
				}
			});
			return false;
		}

		function updateUserList(page) {
			if (typeof(page) == 'undefined') page = 3;
			var fields = {
				nonce: ezemails_ajax.nonce,
				action: 'ezemails_user_list',
				page: page
			};
			request = $.ajax({
				type: "POST",  
				url: ezemails_ajax.ajax_url,
				data: fields,
				beforeSend: function() {

				},
				success: function(html) {
					$('#ezemails_user_list').html(html);
				}
			});
			return false;
		}

	})(jQuery, CKEDITOR);
});
