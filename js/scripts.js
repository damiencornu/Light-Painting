$(function () {

	var oldX, oldY, oldZ;
	
	var modeEcriture = true;
		var clickAllow = true;

	var canvasPos, canvasToile, ctxP, ctxT; //make it global
	
	var panneauActif = "toile";
	
	DepthJS = {
		onKinectInit: function() {
		},
		onRegister: function(x, y, z, data) {
			ctxP.beginPath();
			ctxT.beginPath();
			if(oldX) {
				ctxT.moveTo(oldX, oldY);
			}
		},
		onUnregister: function() {
			ctxP.closePath();
			ctxT.closePath();
			
			// Éffacer le curseur
			modeEcriture = false;
			clearCanvas(ctxP, canvasPos);
			
			// Ne plus se souvenir du dernier point (pour définir une nouvelle orgine par la suite)
			oldX = oldY = oldZ = undefined;
		},
		onMove: function(x, y, z) {
		
			// Mettre les données reçues de Kinect à l'échelle du canvas
			x = 8.7 * (100 - x);
			y = 6 * y;
			
			dessinerCurseur(x,y);
		
			/* Mode tracé de ligne */
			var nouveauTrace;
			if(oldX && modeEcriture && panneauActif == "toile" && x >= 70) { // Si il y a eu un point avant... && si en mode écriture && on est sur la toile && on est dans la zone active
				ctxT.lineTo(x-70,y);
				ctxT.stroke();
			} else {
				nouveauTrace = true;
			}
		
			//ctxT.fillRect (x, y, taillePinceau, taillePinceau);
			oldX = x; oldY = y; oldZ=z;
		
			if(nouveauTrace) {
				ctxT.beginPath();
				ctxT.moveTo(oldX, oldY);
			}
		   /* Fin du mode tracé de ligne */
		
		   /* Mode dessin de rond */
		
		},
		onSwipeLeft: function() {
			if(panneauActif == "toile") {
				// Fonction annuler, si possible
			}
			else if(panneauActif == "configuration") {
				fermerConfiguration();
			}
		},
		onSwipeRight: function() {
			console.log("zazuuziauzuauiziaui");
			ouvrirConfiguration();
		},
		onHandClick: function(x, y, z) {
			if(panneauActif == "toile") {
				if(modeEcriture == true && clickAllow == true) {
					modeEcriture = false;
					clickAllow = false;
					window.setTimeout(allowClick, 500);
				}
				else if (modeEcriture == false && clickAllow == true){
					modeEcriture = true;
					clickAllow = false;
					window.setTimeout(allowClick, 500);
				}
			} // fin des actions sur la toile
		} // onHandClick
	};
	
	canvasPos = document.getElementById('posKinect');
	ctxP = canvasPos.getContext('2d');
	ctxP.save();
	
	canvasToile = document.getElementById('toile');  
	ctxT = canvasToile.getContext('2d');
	ctxT.fillRect(0,0,870,600);
	ctxT.strokeStyle = "#FFFFFF"
	ctxT.lineWidth = 5;

	function allowClick() {
		clickAllow = true;
	}
	
	function ouvrirConfiguration() {
		if(panneauActif == "toile") {
			panneauActif = "";
			$('#canvasSliderContent').animate({left:0}, 750, function() {
				panneauActif = "configuration";
			})
		}
	}
	
	function fermerConfiguration() {
		if(panneauActif == "configuration") {
			panneauActif = "";
			$('#canvasSliderContent').animate({left:'-872px'}, 750, function() {
				panneauActif = "toile";
			})
		}
	}
	
	function clearCanvas(context, canvas) {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  var w = canvas.width;
	  canvas.width = 1;
	  canvas.width = w;
	}
	
	function dessinerCurseur(x,y) {
		if(panneauActif == "toile") {
			clearCanvas(ctxP, canvasPos);
			ctxP.lineWidth = 3;
			ctxP.strokeStyle = "#00b4ff";

			if(modeEcriture) {
				ctxP.moveTo(x-10,y);
				ctxP.lineTo(x+10,y);
				ctxP.moveTo(x,y-10);
				ctxP.lineTo(x,y+10);
			} else {
				ctxP.moveTo(x+10,y);
				ctxP.arc(x, y, 10, 0, Math.PI*2, true);
			}
			ctxP.stroke();
		}
		else if(panneauActif == "configuration") {
			ctxP.moveTo(x+10,y);
			ctxP.arc(x, y, 10, 0, Math.PI*2, true);
			
			// Récupérer la position de la souris et voi si on est au dessus d'un élément
			$('#configuration').children().each(function() {
				console.log("élément");
			});
		}
	}

});