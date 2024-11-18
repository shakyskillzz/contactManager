const urlBase = 'http://cop4331-team11.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("password").value;
	
	document.getElementById("SignUpResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
   
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
        let jsonObject = JSON.parse(xhr.responseText); // Parse the JSON response
			  if (jsonObject.error)
				{
					document.getElementById("SignUpResult").innerHTML = jsonObject.error;
				}
        else {
		    document.getElementById("SignUpResult").innerHTML = "Registration succesful, Please Login";
        }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("SignUpResult").innerHTML = err.message;
	}

}

function addContact() {
    let name = document.getElementById("contactName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = { name: name, phone: phone, email: email, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Create.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText); // Parse the JSON response
            document.getElementById("contactAddResult").innerHTML = "Here";
            if (jsonObject.error && jsonObject.error !== "") {
              document.getElementById("contactAddResult").innerHTML = jsonObject.error;
            } else {
              document.getElementById('contactName').value = '';
              document.getElementById('phone').value = '';
              document.getElementById('email').value = '';
              document.getElementById("contactAddResult").innerHTML = "Contact has been added";
            }    
        }
    };
    
    try {
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = "Error sending request: " + err.message;
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
    document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	let contactList = ""; // This should store the contact list

	let tmp = {search: srch, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
 
				let jsonObject = JSON.parse(xhr.responseText);

				// Check for error in the response
				if (jsonObject.error && jsonObject.error !== "")
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
          document.getElementById("searchDiv").style.display = "none"; 
          document.getElementById("editContactForm").style.display = "none";                  
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML = "Contact(s) retrieved";

					document.getElementById("searchDiv").style.display = "block";

          for (let i = 0; i < jsonObject.results.length; i++)
          {
            let contact = jsonObject.results[i];
           	
           	//works for colors because each object is just 1 value, we are dealing with multiple values and must break them apart
            //contactList += jsonObject.results[i]; 

            
            //this is where the back ticks (`) instead of single/double (')(") qoutes come in that were mention in class. 
            //edit and delete buttons show up only when search results are called.
            contactList += `Name: ${contact.Name}<br /> Phone: ${contact.Phone}<br /> Email: ${contact.Email}<br />
            
            <button id="button_edit" aria-label="Edit Contact" onclick="editAndScroll('${contact.ID}', '${contact.Name}', '${contact.Phone}', '${contact.Email}')">
            <img src="../images/edit-icon.png" width="30px" height="30px" alt="Edit Contact"></button>
            
            <button id="button_delete" aria-label="Delete Contact" onclick="confirmDelete('${contact.ID}')">
            <img src="../images/delete-icon.png" width="30px" height="30px" alt="Delete Contact"></button>
            <span id="deleteResults"></span>
        		<hr>`;

            if (i < jsonObject.results.length - 1)
            {
              contactList += "<br />\r\n";
            }
          }
          document.getElementsByTagName("p")[0].innerHTML = contactList;
        }
      }
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function editAndScroll(contactID, name, phone, email)
{
	// Call the editContact function
	editContact(contactID, name, phone, email);

	// Scroll to the edit contact form
	document.getElementById("editContactForm").scrollIntoView({
		behavior: "smooth"
	});
}

function editContact(id, name, phone, email) {
  // Populate the form fields with contact details
  document.getElementById("editContactId").value = id;
  document.getElementById("editContactName").value = name;
  document.getElementById("editContactPhone").value = phone;
  document.getElementById("editContactEmail").value = email;

  document.getElementById("editContactForm").style.display = "block";
}

function updateContact() {
  let id = document.getElementById("editContactId").value;
  let name = document.getElementById("editContactName").value;
  let phone = document.getElementById("editContactPhone").value;
  let email = document.getElementById("editContactEmail").value;

  let tmp = { name: name, phone: phone, email: email, id: id, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Edit.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function() 
	{
  	if (this.readyState == 4 && this.status == 200) 
  	{
    	let jsonObject = JSON.parse(xhr.responseText); // Parse the JSON response
    	document.getElementById("editResults").innerHTML = jsonObject.error || "Contact updated successfully";
    	searchContacts(document.getElementById("searchText"));
  	}
	};
  xhr.send(jsonPayload);
}

function confirmDelete(ID) {
    // Show confirmation dialog
    const userConfirmed = confirm("Are you sure you want to delete this contact?");

    // Proceed with deletion if user confirms
    if (userConfirmed) {
        deleteContact(ID);
    }
}

function deleteContact(id) {
	let tmp = {id : id};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function() 
	{
		if(this.readyState == 4 && this.status == 200)
		{
			searchContacts(document.getElementById("searchText"));
		}
	};
	xhr.send(jsonPayload);
}
