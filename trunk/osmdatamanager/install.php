<?php
    /*
    This file is part of osmdatamanager.

    osmdatamanager is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, only GPLv2.

    osmdatamanager is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with osmdatamanager.  If not, see <http://www.gnu.org/licenses/>.
	
	*/
	
	/*
	 * at the moment this file does not the complete installation, it's a little helper !!
	 * 
	 */
	include_once("application.php");
	include_once("userfactory.php");
	include_once("directoryfactory.php");
	
	$username		= $_REQUEST['username'];
	$password		= $_REQUEST['password'];
	$go				= $_GET['go'];
	
	if (isset($username) && isset($password) && isset($go)) {
		if ((trim($username) != "") && (trim($password) != "")) {
		
			/*
			 * End General Settings, do not edit the following code
			 */
			echo "Username: ".$username."<br/>";
			echo "Password: ".$password."<br/>";
			
			//check the directory structure
			
			echo "<br/>checking the directory structure...<br/>";
			$dojodir = "lib/dojo";
			$dojodir_dojo = $dojodir."/dojo";
			$dojodir_dijit = $dojodir."/dijit";
			$dojodir_dojox = $dojodir."/dojox";
			
			$trmdir = "lib/trm";
						
			if (! file_exists($dojodir)) {
				echo $dojodir."does not exist !<br>";	
			}
			if (! file_exists($dojodir_dojo)) {
				echo $dojodir."does not exist !<br>";	
			}
			if (! file_exists($dojodir_dijit)) {
				echo $dojodir."does not exist !<br>";	
			}
			if (! file_exists($dojodir_dojox)) {
				echo $dojodir."does not exist !<br>";	
			}
			
			//check the db connection
			$dba1 = new DatabaseAccess();
			if ($dba1->checkDbConnection()) {
				$dba1->createTableStructure();
				
				$uf1 = new UserFactory();
				if ($uf1->registerUser($username,$password,"")) {
					echo "user created successfully<br/>";
					
					//try to login
					$usr = application_loginuser($username,$password);
					if ($usr != null)
					{
						$df = new DirectoryFactory();
					  	$df->login();
					  	if ($df->createDirectory("trf_".$usr->getUid())) {
					  		echo "user directory created successfully<br/>";
					  	} else {
					  		echo "<b>could not create user directory you can do it manually<br/></b>";
							echo "please create a directory called: trf_".$usr->getUid()."<br/>";
					  	}
					  	
						$df->logout();
						
						$uf1->createExampleGroup($usr);
						$uf1->createExamplePoi($usr);
					} else {
						echo "could not login user: ".$username."<br/>"	;
					}
				} else {
					echo "could not create user: ".$refusr."<br/>";
					//$uf1->deleteUser($refusr);
				}
			}
				
			echo "<hr><br/>";
			phpinfo();
		} else {
			echo "please enter valid data !!<br>";
			?>
				<form method="post" action="install.php">
				  <input type="submit" name="Button" value="Back">
				</form>
			<?php	
		}
	} else {
		?>		
		<html>
			<head>
				<title>Install</title>
			</head>
			
			<body>
				<p><b>please check the config.php file first !!!</b></p>
				<p> please enter a username and password for the first osmdatamanager user</p>
				
				<form method="post" action="install.php?go=yes">
		
				<table>
					<tr>
						<td>Username: </td><td><input type="text" name="username" /></td>
					</tr>
					<tr>
						<td>Password: </td><td><input type="text" name="password" /></td>
					</tr>
				</table>
				
				<p>
					<b>all osmdatamanager tables will be deleted if they are already in the database</b><br/>
					<b>to change this you can edit the osmdatamanager.sql file !!</b>
				</p>
				<input type="submit" name="Button" value="Next">
				
				</form>
			</body>
		</html>  			
		<?php	  
	}	 
?>








