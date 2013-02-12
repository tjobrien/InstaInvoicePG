var user = null;
var user_details = null;
var contacts = null;
var invoices = null;

function getFileSystem(){
		//use do this once when doc loads - can use it to write file if we need to.
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileSystemSuccess, onFileError);
    	
	}
	
	function onGetFileSystemSuccess(fs) {
	 // alert("onGetFileSystemSuccess: " + fs.name);
	  console.log("FileSystem " + fs.name);
	  fs.root.getFile('instainvoice.txt', {create : true}, onFileReaderSuccess, onFileError);
	}

function onFileReaderSuccess(file) {
	console.log("onFileReaderSuccess " + file.name);
  	var reader = new FileReader();

  reader.onloadend = function(e) {
   user = jQuery.parseJSON(e.target.result);
       console.log("Reader " + user);
       if (!user) { //null check
  		//no user data in the local file
  		$("#status").text("Oops- You'll need to login or create an account to use InstaInvoice on this device.");
       }
       else {
        $("#status").text("Hey " + user['email']);
		$("#user_name").text(user['email']);
		$("#id").text(user['id']);
		$("#sync_status").text("true");
		getUserDetails();
       }
    

  };

  reader.onloadstart = function(e) {
   // $('#readInfo').append("Load start" + br);
  };

  reader.onloaderror = function(e) {
   // $('#readInfo').append("Load error: " + e.target.error.code + br);
  };

  reader.readAsText(file);
  

}

function onFileError(e) {
  var msgText;
  switch(e.code) {
    case FileError.NOT_FOUND_ERR:
      has_account = "false";
      console.log(has_account);
      msgText = "You have not created you InstaInvoice Account.";
      break;
    case FileError.SECURITY_ERR:
      msgText = "Security error.";
      break;
    case FileError.ABORT_ERR:
      msgText = "Abort error.";
      break;
    case FileError.NOT_READABLE_ERR:
      msgText = "Not readable error.";
      break;
    case FileError.ENCODING_ERR:
      msgText = "Encoding error.";
      break;
    case FileError.NO_MODIFICATION_ALLOWED_ERR:
      msgText = "No modification allowed.";
      break;
    case FileError.INVALID_STATE_ERR:
      msgText = "Invalid state.";
      break;
    case FileError.SYNTAX_ERR:
      msgText = "Syntax error.";
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msgText = "Invalid modification.";
      break;
    case FileError.QUOTA_EXCEEDED_ERR:
      msgText = "Quote exceeded.";
      break;
    case FileError.TYPE_MISMATCH_ERR:
      msgText = "Type mismatch.";
      break;
    case FileError.PATH_EXISTS_ERR:
      msgText = "Path exists error.";
      break;
    default:
      msgText = "Unknown error.";
  }
  //Now tell the user what happened
  navigator.notification.alert(msgText, null, "File Error");
}

function getFileWriterSystem(){
		//use do this once when doc loads - can use it to write file if we need to.
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onGetFileWriterSystemSuccess, onFileError);
	}
	
	function onGetFileWriterSystemSuccess(fs) {
	 // alert("onGetFileSystemWriterSuccess: " + fs.name);
	  fs.root.getFile('instainvoice.txt', {create : true}, onGetFileSuccess, onFileError); //to write to the file
	}
	
	function onGetFileSuccess(theFile) {
	 // alert("onGetFileSuccess: " + theFile.name);
	  theFile.createWriter(onCreateWriterSuccess, onFileError);
	}

function onCreateWriterSuccess(writer) {
 // alert("onCreateWriterSuccess");
 // $('#writeInfo').html("Entering onCreateWriterSuccess" + br);

  writer.onwritestart = function(e) {
   // $('#writeInfo').append("Write start" + br);
  };

  writer.onwriteend = function(e) {
   // $('#writeInfo').append("Write end" + br);
  };

  writer.onwrite = function(e) {
    //$('#writeInfo').append("Write completed" + br);
  };

  writer.onerror = function(e) {
   // $('#writeInfo').append("Write error: " + e.toString() + br);
  };
 
  console.log("ready to write");

	writer.write(user);
	
}
		function getUserDetails(){
			user_details = null;
			$.ajax({
			        url: "http://billing.breeasy.com/api/v1/users/" + user['id'] + ".json",
			        type: "get",
			       // data: str,
			        dataType: "json",

			       	// callback handler that will be called on success
			        success: function(response, textStatus, jqXHR){
			            // log a message to the console
			            console.log("Hooray, it worked!");
						//$('#results').text("it worked");
						user_details = response;
			        },
			        // callback handler that will be called on error
			        error: function(jqXHR, textStatus, errorThrown){
			            // log the error to the console
			            console.log(
			                "The following error occurred: "+
			                textStatus);
						console.log("Error "  + jqXHR)
						error = jqXHR;

			        },
			        // callback handler that will be called on completion
			        // which means, either on success or error
			        complete: function(){
			        if(user_details){
						//now lets do something with user data
						// $.each(user, function(index, value) {
						// 	console.log("index " + index);
						// });
					$("#first_name").text(user_details['first_name']);
					$("#last_name").text(user_details['last_name']);
					$("#company").text(user_details['company']);
					$("#phone_no").text(user_details['phone']);
					$("#id").text(user['id']);
					$("#sync_status").text("true");
					$("#user_name").text(user['email']);
					$("#status").text("Hey " + user['email']);
					
					
					}
					else
					{
						 navigator.notification.alert("Your details could not be found.  Please login into the Breeasy Billing app and update your account details.", null, "User Details");
						 $("#sync_status").text("false");
					}
			        $.mobile.hidePageLoadingMsg();


			     	} //complete

			    	}); //ajax
			 }
function getContacts(populate){
				//if(!contacts){
				$.ajax({
				        url: "http://billing.breeasy.com/api/v1/contacts.json?user_id="+ user['id'],
				        type: "get",
				       // data: str,
				        dataType: "json",

				       	// callback handler that will be called on success
				        success: function(response, textStatus, jqXHR){
				            // log a message to the console
							//$('#results').text("it worked");
							contacts = response;
							console.log("contacts " + contacts);
							
				        },
				        // callback handler that will be called on error
				        error: function(jqXHR, textStatus, errorThrown){
				            // log the error to the console
				            console.log(
				                "The following error occurred: "+
				                textStatus);
							console.log("Error "  + jqXHR)
							error = jqXHR;

				        },
				        // callback handler that will be called on completion
				        // which means, either on success or error
				        complete: function(){
				        if(contacts){
							//populate the list
							//alert(populate);
							if(populate == "contacts"){
								populateContacts();
							}
							else{
								populateSelect();
							}
						}
						else
						{
						
						}
				        $.mobile.hidePageLoadingMsg();


				     	} //complete

				    	}); //ajax
					//}
				 }

function populateContacts(){
	console.log("populateContacts");
	$('#contact_list_view').empty();
	$.each(contacts, function(index, value) {
		var	contact = value;
		var total = parseFloat(contact['mobile_balance']);
		$('#contact_list_view').append($('<li/>', {    //here appending `<li>`
		'text': contact['first_name'] + " " + contact['last_name'] + " - " + contact['company']+ " Balance:  $" + total.toFixed(2)
		}));						
	});
	
	$('#contact_list_view').listview('refresh');
}

function getInvoices(){
	if(!invoices){
		$.ajax({
		url: "http://billing.breeasy.com/api/v1/invoices.json?user_id="+ user['id'],
		type: "get",
		// data: str,
		dataType: "json",

				       	// callback handler that will be called on success
				        success: function(response, textStatus, jqXHR){
				            // log a message to the console
				            console.log("Hooray, it worked!");
							//$('#results').text("it worked");
							invoices = response;
				        },
				        // callback handler that will be called on error
				        error: function(jqXHR, textStatus, errorThrown){
				            // log the error to the console
				            console.log(
				                "The following error occurred: "+
				                textStatus);
							console.log("Error "  + jqXHR)
							error = jqXHR;

				        },
				        // callback handler that will be called on completion
				        // which means, either on success or error
				        complete: function(){
				        if(invoices){
							//populate the list
							populateInvoices();

						}
						else
						{
						}
				        $.mobile.hidePageLoadingMsg();


				     	} //complete

				    	}); //ajax
					}
				 }
function populateInvoices(){
	$.each(invoices, function(index, value) {
	var	invoice = value;
	var total = parseFloat(invoice['mobile_total'])

		$('#invoice_list_view').append($('<li/>', {    //here appending `<li>`
		'text': invoice['id'] + " " + invoice['status'] + " - " + invoice['description'] + " Total:  $" + total.toFixed(2)
							
		}));
							
	});
	$('#invoice_list_view').listview('refresh');
}
function populateSelect(){

	$('#invoice_contact_id').empty();
	$('#invoice_user_id').val(user.id);
	for (k = 0; k < contacts.length; k++){
		contact = contacts[k];
		$('#invoice_contact_id').append("<option value='" + contact.id + "'>" + contact.first_name + " " + contact.last_name + " - " + contact.company +  "</option>");
	}
	if(contacts.length == 0){
					$("#invoice_contact_id").append("<option>No Contacts</option>");
				}
				$('#invoice_contact_id').selectmenu('refresh');
	
}
