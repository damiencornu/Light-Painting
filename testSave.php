<?php
print_r($_POST);
if (isset($_POST['canvasData']) && isset($_POST['pseudo']) && isset($_POST['nomCreation']))
{
   print_r($_POST);
	// Get the data
	$imageData=$_POST['canvasData'];
	$pseudo = $_POST['pseudo'];
	$nomCreation = $_POST['nomCreation'];
	

	// Remove the headers (data:,) part.  
	// A real application should use them according to needs such as to check image type
	/*$filteredData=substr($imageData, strpos($imageData, ",")+1);

	// Need to decode before saving since the data we received is already base64 encoded
	$unencodedData=base64_decode($filteredData);

	//echo "unencodedData".$unencodedData;

	// Save file.  This example uses a hard coded filename for testing, 
	// but a real application can specify filename in POST variable
	$a = time().rand(0,10);
	$fp = fopen( 'img/creations/'.$a.'.png', 'wb' );
	fwrite( $fp, $unencodedData);
	fclose( $fp );
	
	
	$retour = '<div class="floatLeft" id="splashFin">';
	$retour .= '<img src="img/creations/'.$a.'.png" />';
	$retour .= '';
	$retour .= '</div><!-- fin #splahsFin -->';
	
	   echo json_encode($datas);
	   */
}
?>