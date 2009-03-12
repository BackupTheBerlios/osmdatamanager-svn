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
	include_once("application.php");
	
	/**
	 * DirectoryFactory
	 */
	class DirectoryFactory {
		var $ftpuser;
		var $ftppwd;
		var $ftpserver;
		var $conn_id;
		var $connected;
		var $useftp;
		var $ftpprefix;
						
		function DirectoryFactory() {
			
			global $gl_ftpuser;
			global $gl_ftppwd;
			global $gl_ftpserver;
			global $gl_useftp;
			global $gl_ftpprefix;
						
			$this->ftpuser = $gl_ftpuser;
			$this->ftppwd  = $gl_ftppwd;
			$this->ftpserver  = $gl_ftpserver;
			$this->useftp = $gl_useftp;
			$this->conn_id = NULL;
			$this->connected = false;
			$this->ftpprefix = $gl_ftpprefix;
		}
		
		function login() {
					   		   
		   if (! $this->useftp)
		   	return;
		   
		   $this->conn_id = ftp_connect($this->ftpserver);
		   $login_result = ftp_login($this->conn_id, $this->ftpuser, $this->ftppwd);
		  		  
		   if ((!$this->conn_id) || (!$login_result)) {
			   return false;
		       exit;
		   } else {
			   $this->connected = true;
			   return true;
		   }
		}
		
		function logout() {
			if ($this->conn_id != null) {
				ftp_close($this->conn_id); // Close the FTP Connection	
				$this->connected = false;
				$this->conn_id = null;
			}
		}
		
		function createDirectory($aDirname) {
			if ($this->connected) {
				$dir = ftp_mkdir($this->conn_id  , $this->ftpprefix.$aDirname);
				if ($dir == "FALSE ") {
					return false;
				} else {
					return true;
				}
			}
		}
						
		function listFiles($aUserId) {
			if ($this->connected)
			{
				$path = $this->ftpprefix."trf_".$aUserId;
				$list = ftp_nlist( $this->conn_id, $path );
			   	$fold_no = array(".", "..", "cgi-data", "comp", "zuern", "counter");
				$result = array();
				foreach($list as $file){
			    
			      if (ftp_size($this->conn_id, $file)== -1){
			           if (in_array($file, $fold_no)) {
			               print $file ." Ueberspringe ausgeschlossenes Verzeichnis.<br>";
			           } else {
			           }
			       }else{ 
					  array_push($result, $file);
			       }
			    }
				return $result;
			}
		}
		
		function getFileExtension($filename)
		{
			return end(explode(".", $filename));
		}
		
		function listGpxFiles($aUserId) {
			if ($this->connected)
			{
				$path = $this->ftpprefix."trf_".$aUserId;
				$list = ftp_nlist( $this->conn_id, $path );
				
			   	$fold_no = array(".", "..", "cgi-data", "comp", "zuern", "counter");
				
				$result = array();
				foreach($list as $file){
			    
			      if (ftp_size($this->conn_id, $file)== -1){
			           if (in_array($file, $fold_no)) {
			               print $file ." Ueberspringe ausgeschlossenes Verzeichnis.<br>";
			           } else {
			              
			           }
			       }else{
						$ext = $this->getFileExtension($file);
						switch ($ext) {
							case "gpx";
							case "Gpx";
							case "GPX";
							case "xml";
							case "XML";
							case "Xml";
								array_push($result, $file);		
							break;
						}
						
			       }
			    }
				return $result;
			}
		}
		
		function listPictures($aUserId) {
			if ($this->connected)
			{
				$path = $this->ftpprefix."trf_".$aUserId;
				$list = ftp_nlist( $this->conn_id, $path );
				
			   	$fold_no = array(".", "..", "cgi-data", "comp", "zuern", "counter");
				
				$result = array();
				foreach($list as $file){
			    
			      if (ftp_size($this->conn_id, $file)== -1){
			           if (in_array($file, $fold_no)) {
			               print $file ." Ueberspringe ausgeschlossenes Verzeichnis.<br>";
			           } else {
			              
			           }
			       }else{
						$ext = $this->getFileExtension($file);
						switch ($ext) {
							case "jpg";
							case "jpeg";
							case "JPG";
							case "JPEG";
							case "Jpeg";
							case "Jpg";
								array_push($result, $file);		
							break;
						}
						
			       }
			    }
				return $result;
			}
		}
		
		function listPictures_Dir($aUserId, $aPath) {
			$files = scandir($aPath."trf_".$aUserId);
			$result = array();
			$fold_no = array(".", "..", "cgi-data", "comp", "zuern", "counter");
			foreach($files as $file) {					
				if (! in_array($file, $fold_no)) {	
				  $ext = $this->getFileExtension($file);
						switch ($ext) {
							case "jpg";
							case "jpeg";
							case "JPG";
							case "JPEG";
							case "Jpeg";
							case "Jpg";
								array_push($result, $aPath."trf_".$aUserId."/".$file);		
							break;
						}
				}
			}
			return $result;
		}
		
		function listPicturesFromPath($aPath) {
			if ($this->connected)
			{
				$path = $this->ftpprefix.$aPath;
				$list = ftp_nlist( $this->conn_id, $path );
				
			   	$fold_no = array(".", "..", "cgi-data", "comp", "zuern", "counter");
				$result = array();
				foreach($list as $file){
			    
			      if (ftp_size($this->conn_id, $file)== -1){
			           if (in_array($file, $fold_no)) {
			               print $file ." Ueberspringe ausgeschlossenes Verzeichnis.<br>";
			           } else {
			              
			           }
			       }else{
						$ext = $this->getFileExtension($file);
						switch ($ext) {
							case "jpg";
							case "jpeg";
							case "JPG";
							case "JPEG";
							case "Jpeg";
							case "Jpg";
								array_push($result, $file);		
							break;
						}
						
			       }
			    }
				return $result;
			}
		}
		
				
		function uploadFiles($aUser) {
			if ($aUser != null) {	
				
				if($_FILES['txt_file']['name'] != ""){
			    
				   $local_file = $_FILES['txt_file']['tmp_name']; // Defines Name of Local File to be Uploaded
				
				   $destination_file = $this->ftpprefix."/trf_".$aUser->getUid()."/".basename($_FILES['txt_file']['name']);  // Path for File Upload (relative to your login dir)
								   
					if ($this->connected) {
				   		$upload = ftp_put($this->conn_id, $destination_file, $local_file, FTP_BINARY);  // Upload the File
				  
					   // Verify Upload Status
					   if (!$upload) {
					       echo "<h2>FTP upload of ".$_FILES['txt_file']['name']." has failed!</h2><br /><br />";
					   } else {
					       echo "Success!<br />" . $_FILES['txt_file']['name'] . " has been uploaded to " . $ftp_server . $destination_file . "!<br /><br />";
					   }
					
					   //$this->logout();
					 }
				}
			}
		}
		
		function deleteFiles($aUserId) {
			$lst1 = $this->listFiles($aUserId);
			if ($lst1 != null) {
				for ($i=0;$i<count($lst1);$i++) {
					$fl1 = $lst1[$i];					
					ftp_delete($this->conn_id,$fl1);	
				}
			}
		}
		
		function deleteUserDir($aUserId) {
			if ($aUserId != null) {
				if ($this->connected)
				{
					$dir = $this->ftpprefix."trf_".$aUserId."";
					$this->deleteFiles($aUserId,$dir);
					return ftp_rmdir($this->conn_id,$dir);
				}
			}
			
			return false;
		}
			
	}
	

?>
