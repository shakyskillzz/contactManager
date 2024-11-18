<?php
$inData = getRequestInfo();

$email = $inData["email"];
$phone = $inData["phone"];
$name = $inData["name"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL))
{
        $emailErr = "Invalid email format";
        returnWithError($emailErr);
}
elseif (!preg_match("/^[a-zA-Z-' ]*$/",$name)) 
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
    $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
    $stmt->bind_param("sssss", $name, $phone, $email, $inData["id"], $inData["userId"]);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithInfo("Contact updated successfully");
    } else {
        returnWithError("Update failed or no changes made");
    }

    $stmt->close();
    $conn->close();
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    $retValue = '{"results":[],"error":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}
?>