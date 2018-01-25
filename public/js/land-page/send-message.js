var sendMessage = function  () {
	$('#sendMsgBtn').click(function  () {
		$.ajax({
			url: '/api/help',
			data: {
				name: $('#name').val(),
				email: $('#email').val(),
				subject: $('#subject').val(),
				text: $('#text').val()
			},
			type: 'POST',
			crossDomain: false,
			error: function  (xhr, textStatus, error) {
				var err = JSON.parse(xhr.responseText);
				$('#errorMsg').text('');
				$('#errorMsg').show();
				for(var e in err.error){
					for(var i in err.error[e]){
						$('#cancelModal').trigger('click');
						$('#errorMsg').append('<span>' + err.error[e][i] + '</span><br />');
					}
				}
				setTimeout(function  () {
					$('#errorMsg').hide();
				}, 2000);
			},
			success: function  (data) {
				$('#cancelModal').trigger('click');
				$('#successMsg').show();
				$('#successMsg').append('<span>Message sent successfully!</span>')
				setTimeout(function  () {
					$('#successMsg').hide();
				}, 2000);
			}
		});
	});

	$('#name').keyup(function  () {

		var val = $('#name').val();

		if(val.length == 0){
			$('.nameRequired').show();
		}else {
			$('.nameRequired').hide();
		}
	});
	$('#email').keyup(function  () {
		
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		var val = $('#email').val();

		if(val.length == 0){
			$('.emailRequired').show();
		}else {
			$('.emailRequired').hide();
		}
		if(!regexEmail.test(val)){
			$('.emailInvalid').show();
		}else{
			$('.emailInvalid').hide();
		}
	});
	$('#subject').keyup(function  () {

		var val = $('#subject').val();
		
		if(val.length == 0){
			$('.subjectRequired').show();
		}else {
			$('.subjectRequired').hide();
		}
	});
	$('#text').keyup(function  () {

		var val = $('#text').val();
		
		if(val.length == 0){
			$('.textRequired').show();
		}else {
			$('.textRequired').hide();
		}
	});
};


$(document).ready(sendMessage);

