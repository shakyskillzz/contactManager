<?php
	$inData = getRequestInfo();
	
	$name = $inData["name"];
  $phone = $inData["phone"];
  $email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        $emailErr = "Invalid email format";
        returnWithError($emailErr);
    }
    elseif (!preg_match("/^[a-zA-Z-' ]+$/",$name)) 
    {
        $nameErr = "Invalid name";
        returnWithError($nameErr);
    }
    elseif(!preg_match('/^[0-9]{10}+$/', $phone)) 
    {
        $phoneErr = "Invalid phone number";
        returnWithError($phoneErr);
    }
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,Name,Phone,Email) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $userId, $name, $phone, $email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>