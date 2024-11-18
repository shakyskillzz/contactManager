<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
    elseif (!preg_match("/^[a-zA-Z-' ]*$/",$firstName)) 
    {
        $firstNameErr = "Invalid first name";
        returnWithError($firstNameErr);
    }
    elseif (!preg_match("/^[a-zA-Z-' ]*$/",$lastName)) 
    {
        $lastNameErr = "Invalid last name";
        returnWithError($lastNameErr);
    }
	else
	{
		$stmt = $conn->prepare("SELECT count(*) FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$stmt->bind_result($count);
		$stmt->fetch();
		
		if ($count != 0) 
		{
     	$stmt->close();
			$conn->close();
			returnWithError("Username already taken");
		} 
		else 
		{    
			$stmt->close();

			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();

			$stmt->close();
			$conn->close();
			returnWithSuccess("User successfully registered, please log in");
		}
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}

	function returnWithSuccess($msg)
	{
		$retValue = '{"success":"' . $msg . '"}';
		sendResultInfoAsJson($retValue);
	}
?>