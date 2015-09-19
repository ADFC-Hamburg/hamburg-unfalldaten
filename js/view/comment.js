define('view/comment',[
		  'jquery',
		  'js.cookie',
		  ],function ($,Cookies) {




function clearErr() {
    $('#comments').find('.help-block').each(function (ele) {
	$(this).remove();
    });
    $('#comments').find('.form-control-feedback').each(function (ele) {
	$(this).remove();
    });
    $('#comments').find('.has-error').each(function (ele) {
	$(this).removeClass('has-error').removeClass('has-feedback');
    });
    $('#newcommentmsg').hide();
}


function addComment() {
    var data= {
	id:$("#comment-id").val(),
	usr:$("#comment-usr").val(),
	email:$("#comment-email").val(),
	save:$("#comment-save").is(":checked"),
	subject:$("#comment-subject").val(),
	comment:$("#comment-comment").val(),
    };

    if (data.save) {
	Cookies.set('adfc_username', data.usr,  { expires: 365 });
	Cookies.set('adfc_useremail', data.email,  { expires: 365 });
    } else {
	Cookies.remove('adfc_username');
	Cookies.remove('adfc_useremail');
    }

    $('#comment-send-btn').button("loading");
    clearErr();
    $('#newcomment').hide();
    $.post( "api/comment.php/new", JSON.stringify(data) ).done( function (d) {
	console.log('done',d);
	d=JSON.parse(d);
        $('#comment-send-btn').button("reset");
	if (d.status==1) {
	    $('#comment-send-btn').hide();
	    $('#newcommentmsg').removeClass().addClass('alert alert-success').text("Vielen Dank, der Kommentar wurde gespeichert. Wir melden uns bei Ihnen per E-Mail sobald dieser angezeigt wird.").show();
	} else if (d.status==2) {
	    $('#comment-send-btn').button("reset");
	    $('#newcomment').show();
	    $.map(d.val, function(value, index) {
		var obj=$('#fg-'+index);
		obj.addClass("has-error").addClass("has-feedback").append($('<span>').addClass('glyphicon glyphicon-remove form-control-feedback'));
		for (var i = 0; i < value.length; i++) {
		    obj.append($('<span>').addClass("help-block").text(value[i]));
		}
//		console.log(value,index);
	    });
/*	    for (var i = 0; i < d.val.keys().length; i++) {
		var key= d.val.keys()[i];
		console.log(key);
	    }*/
	}
    }).fail(function (jqXHR, textStatus, errorThrown ) {
	$('#newcomment').show();
	$('#comment-send-btn').button("reset");
	console.log('fail', jqXHR, textStatus, errorThrown);
	$('#newcommentmsg').removeClass().addClass('alert alert-danger').text("Leider gab es beim Speichern einen unvorhergesehen Fehler. Bitte informieren Sie den Admin unter: adfc2015@sven.anders.hamburg").show();
    });
}
		      $('#comment-send-btn').on('click', addComment);
function convertDate(date) {
    var pattern = /^(\d\d\d\d)-(\d\d)-(\d\d) .*$/;
    var matches = pattern.exec(date);
    if (!matches) {
        throw new Error("Invalid string: " + date);
    }
    var year = matches[1];
    var month = matches[2];  
    var day = matches[3];
    return day+"."+month+"."+year;
}
function loadComments( lfnr ) {
    $('#oldcomments').text('Lade Kommentare ...');
    $.ajax ({
	type:'GET',
	dataType:'text',
	url: 'api/comment.php/getAll/'+lfnr,
	error: function() {
	    $('#oldcomments').text('Kommentierung zur Zeit wegen eines Fehlers deaktiviert');
	},
	success: function(data) {
	    // FIXME 
	    var comments=JSON.parse(data);
	    var container= $('#oldcomments');
	    container.html('');
	    if (comments.length===0) {
		container.append($('<div>').addClass('alert alert-success').text('Wir haben leider noch keine Kommentare zur Unfallstelle erhalten. Schreibe den ersten Kommentar!'));
	    } else {
		for (var i = 0; i < comments.length; i++) {
		    var comment= comments[i];
		    container.append($('<h4>').text(comment.subject));
		    
		    container.append($('<div id="comment-from">').text('Von '+comment.creator+' am '+convertDate(comment.created.date)+'.'));
		    container.append($('<div id="comment-msg">').text(comment.description));
		    container.append($('<hr>'));
		}
	    }
	}
    });
}

function openComment( id ) {
    clearErr();
    loadComments(id);
    $('#comment-send-btn').show();
    $('#newcomment').show();
    $('#newcommentmsg').text("");
    $('#comment-subject').val('');
    $('#comment-usr').val('');
    $('#comment-email').val('');
    $('#comment-comment').val('');
    if (Cookies.get('adfc_username')) {
	$('#comment-usr').val(Cookies.get('adfc_username'));
	$('#comment-email').val(Cookies.get('adfc_useremail'));
	$("#comment-save").prop( "checked",true);
    }
    $("#comment-title").text("Kommentare zu Fahrradunfall Nr. "+id+" in 2014");
    $("#comment-id").val(id);
    $("#comments").modal();
}

return {
    'open': openComment,
};

});